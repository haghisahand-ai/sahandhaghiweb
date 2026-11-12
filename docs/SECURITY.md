# SAHAND — Application Security & Threat Model

**Document Classification:** Engineering Security Standard  
**Revision:** 12 November 2026  
**Auditor:** Application Security Lead & Principal Software Engineer  
**Scope:** SAHAND Core Plugin (`sahand-core`), Theme (`sahand-theme`), and Development API Gateway  

---

## 1. STRIDE Threat Model & Defense Matrix

| Threat Category (STRIDE) | Attack Vector & Surface | Implemented Defense Mechanism | Verification Status |
| :--- | :--- | :--- | :--- |
| **Spoofing** | Forged Client IP headers (`X-Forwarded-For`, `CF-Connecting-IP`) to bypass rate limits | Strict reverse proxy whitelist (`SAHAND_TRUSTED_PROXIES`); fallback to `REMOTE_ADDR` if unverified | **PASS** (Unit tested) |
| **Tampering** | Parameter tampering or CSRF on form submissions & admin meta saves | Cryptographic WordPress nonces (`wp_verify_nonce`); strict schema validation and sanitization | **PASS** (Unit tested) |
| **Repudiation** | Mail delivery spoofing or non-delivery silent failures | Server-side validation of `wp_mail()` boolean return; HTTP 503 on transport failure; admin alerts | **PASS** (Verified) |
| **Information Disclosure** | Public endpoint exposure (`/health`), PHP errors, or author enumeration | Zero-fingerprinting health response (`{"status":"ok"}`); `author=1` 301 redirects; generator removal | **PASS** (Verified) |
| **Denial of Service** | DDoS against contact form or AI inference endpoint | Atomic MySQL rate limiting (`INSERT ... ON DUPLICATE KEY UPDATE`); 8s circuit breaker; 5 req/10m contact limit | **PASS** (50-caller concurrency test) |
| **Elevation of Privilege** | Horizontal privilege escalation during meta-box save | Object-level authorization via `current_user_can('edit_post', $post_id)` with explicit post ID | **PASS** (Unit tested) |

---

## 2. Mandatory Security Controls Implemented

### A. Nonces and Authorization
- A WordPress nonce alone is **never** used as an authorization mechanism. Every sensitive operation performs:
  1. Nonce cryptographic verification.
  2. User capability check (`edit_post`, `edit_posts`, `manage_options`).
  3. Object-level ID check (ensuring the user has permission for that specific `$post_id`).

### B. Input Validation & Output Escaping
- Input data sanitized using context-appropriate functions: `sanitize_text_field`, `sanitize_textarea_field`, `sanitize_email`, `esc_url_raw`, `absint`.
- Output escaped using `esc_html`, `esc_attr`, `esc_url`, `esc_textarea`, and `wp_json_encode`.
- All SQL operations in `Sahand_Rate_Limiter` utilize `$wpdb->prepare()`.

### C. Direct Script Execution Lockdown
- `Sahand_Security::protect_upload_directory()` automatically provisions an `.htaccess` file inside `wp-content/uploads/` denying direct PHP script execution:
  ```apache
  <Files *.php>
  deny from all
  </Files>
  Options -Indexes -ExecCGI
  ```

### D. Content Security Policy (CSP) & Defense-in-Depth Headers
- Injected via `send_headers` action:
  - `Content-Security-Policy-Report-Only`: Strict policy protecting assets while preventing breakages. Can be enforced via `add_filter('sahand_enforce_csp', '__return_true');`.
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (when SSL is active)

### E. API Key Protection
- The Google Gemini API key (`GEMINI_API_KEY` / `SAHAND_GEMINI_API_KEY`) is stored exclusively in server environment variables or `wp-config.php`.
- Zero credentials appear in frontend bundles, browser logs, or client-side JavaScript.

---

## 3. Residual Risks & Staging Requirements

1. **Shared Hosting Process Isolation:** On shared hosting environments where other accounts share the same MySQL or PHP daemon, file permissions should be restricted to `0644` for files and `0755` for directories.
2. **Mail Transport Configuration:** The native PHP `mail()` function on shared hosts frequently lacks SPF/DKIM records. Deploying an authenticated SMTP plugin (e.g., WP Mail SMTP) on staging is required for reliable email delivery.
3. **CSP Enforcement Transition:** The CSP is currently in `Report-Only` mode. After observing browser developer console logs on staging for 48 hours without legitimate script violations, enforce it via the `sahand_enforce_csp` filter.
