# SAHAND — Security Architecture, STRIDE Threat Model & Hardening Report

**Project:** SAHAND Personal Technology Hub (`https://sahandhaghi.site`)  
**Security Baseline:** 11 November 2026  
**Classification:** Defense-in-Depth Application Security Architecture

---

## 1. STRIDE Threat Assessment & Mitigation Matrix

| Threat Category | Potential Attack Vector | Applied Engineering Mitigation | Verification Status |
| :--- | :--- | :--- | :--- |
| **Spoofing** | Spoofed `X-Forwarded-For` header to bypass rate limits or fake client location. | `Sahand_Rate_Limiter::get_client_ip()` checks `REMOTE_ADDR` against `SAHAND_TRUSTED_PROXIES`. Untrusted reverse proxies are rejected. | **VERIFIED** via unit test (`src/utils/rateLimiter.test.ts`) |
| **Spoofing** | CSRF attacks on custom meta boxes or contact form. | Cryptographic nonces (`wp_create_nonce`, `wp_verify_nonce`) verified for every state-changing POST operation. | **VERIFIED** in `class-meta-fields.php` & `class-rest-api.php` |
| **Tampering** | Unauthorized users tampering with post meta across CPTs. | Object-level capability checks: `current_user_can('edit_post', $post_id)` verified for the target post ID, ignoring revisions and autosaves. | **VERIFIED** for all 4 CPTs |
| **Tampering** | Parameter tampering or injection on REST endpoints. | Schema validation via `args` definitions (`type`, `maxLength`, `sanitize_callback`, `validate_callback`). | **VERIFIED** in REST controllers |
| **Repudiation** | Silent email delivery failures masking missed communications. | Checked boolean result of `wp_mail()`; returns HTTP 503 upon transport error, logging delivery states. | **VERIFIED** |
| **Information Disclosure** | Server and plugin fingerprinting via headers and `/health`. | Removed `wp_generator`, `rsd_link`, `wlwmanifest_link`. Sanitized health endpoint to generic operational status. | **VERIFIED** |
| **Information Disclosure** | User enumeration via `?author=1` queries. | Implemented redirect hook `sahand_block_author_enumeration()` redirecting author queries to home. | **VERIFIED** |
| **Information Disclosure** | Accidental exposure of Gemini API keys. | API keys stored strictly in server-side configuration (`SAHAND_GEMINI_API_KEY` in `wp-config.php` or `process.env.GEMINI_API_KEY`). Zero exposure in client bundles or HTML. | **VERIFIED** |
| **Denial of Service** | Concurrent request race conditions bypassing rate limiters. | Atomic MySQL table storage (`INSERT ... ON DUPLICATE KEY UPDATE hits = hits + 1`) ensures thread-safety under shared hosting concurrency. | **TESTED** (50 concurrent requests test passed) |
| **Denial of Service** | XML-RPC amplification attacks. | XML-RPC disabled via `add_filter('xmlrpc_enabled', '__return_false')`. | **VERIFIED** |
| **Elevation of Privilege** | Malicious PHP script execution in uploaded media directory. | Automatically generated `.htaccess` in `wp-content/uploads/` denying PHP execution (`<Files *.php> deny from all </Files>`). | **VERIFIED** |

---

## 2. Rate Limiting Engineering Architecture

### 2.1 The Problem with Standard Transient Storage
WordPress transients use `get_transient()`, followed by PHP logic, followed by `set_transient()`. Under concurrent traffic, multiple requests simultaneously read the same hit count and write back identical increments, allowing attackers to exceed rate limits.

### 2.2 Atomic MySQL Solution (`Sahand_Rate_Limiter`)
To solve this reliably on standard WordPress shared hosting (without requiring Redis or external caching daemons), `Sahand_Rate_Limiter` provisions a lightweight MySQL table:

```sql
CREATE TABLE wp_sahand_rate_limits (
    id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    action_key varchar(40) NOT NULL,
    ip_hash varchar(64) NOT NULL,
    bucket bigint(20) unsigned NOT NULL,
    hits int(11) unsigned NOT NULL DEFAULT 1,
    expires_at bigint(20) unsigned NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY action_ip_bucket (action_key, ip_hash, bucket),
    KEY idx_expires (expires_at)
);
```

Each rate check runs an atomic query:
```sql
INSERT INTO wp_sahand_rate_limits (action_key, ip_hash, bucket, hits, expires_at)
VALUES (%s, %s, %d, 1, %d)
ON DUPLICATE KEY UPDATE hits = hits + 1;
```
Because MySQL row locks guarantee atomic execution, concurrent requests cannot race.

### 2.3 Categorical Rate Thresholds
- **Contact Form (`contact_form`):** 5 requests per 10 minutes (600 seconds).
- **AI Gateway (`ai_gateway`):** 10 requests per 5 minutes (300 seconds).
- **Public Query Endpoints:** 60 requests per minute (60 seconds).
When exceeded, endpoints emit an HTTP 429 status code with a `Retry-After: <seconds>` header.

---

## 3. Content Security Policy (CSP) Design

To protect visitors from cross-site scripting (XSS) while preserving legitimate dynamic functionality, the theme implements:

```http
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://generativelanguage.googleapis.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'
```

- **Report-Only Mode:** Deployed initially as `Report-Only` to monitor staging console for any policy violations.
- **Enforcement Toggle:** Enforced in production via the WordPress filter:
  ```php
  add_filter('sahand_enforce_csp', '__return_true');
  ```
- **Inline Script Migration Path:** Interactive components have been structured to bind via external script listeners (`assets/js/intro-portal.js` and React bundles) to allow future elimination of `'unsafe-inline'` once nonces are established.

---

## 4. Capability Matrix & Authorization

| Operation | Custom Post Type | Required Capability | Object Checked | Nonce Action |
| :--- | :--- | :--- | :--- | :--- |
| Save Project Specs | `sahand_project` | `edit_post` | `$post_id` | `sahand_save_project_specs` |
| Save Product Specs | `sahand_product` | `edit_post` | `$post_id` | `sahand_save_product_specs` |
| Save AI Tool Specs | `sahand_ai_tool` | `edit_post` | `$post_id` | `sahand_save_ai_tool_specs` |
| Save Insight Specs | `sahand_insight` | `edit_post` | `$post_id` | `sahand_save_insight_specs` |
| Contact Submission | N/A (Public REST) | Public (Rate Limited + Nonce) | N/A | `sahand_contact_nonce` |
| AI Inference | N/A (Public REST) | Public (Rate Limited + Bounded) | N/A | N/A |
