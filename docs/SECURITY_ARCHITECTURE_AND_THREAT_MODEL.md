# SAHAND — Security Architecture & Threat Model Specification
**Document Version:** 1.0  
**Classification:** Engineering Security Baseline  
**Target Environment:** Decoupled WordPress Architecture (`sahand-theme` + `sahand-core`)  
**Production Domain:** `https://sahandhaghi.site`  

---

## 1. Executive Summary & Security Philosophy

The SAHAND Personal Technology Hub is engineered under a **Security-First, Defense-in-Depth** philosophy. No single layer of defense is assumed to be impenetrable. Rather than relying on superficial security measures (such as merely concealing the login URL), the system enforces:

1. **Explicit Trust Boundaries:** Client browsers, API requests, and third-party integrations are considered untrusted.
2. **Least Privilege Principle:** Administrative capabilities are segregated from content authoring. Database users and file system permissions are restricted to the minimum required access.
3. **Context-Aware Sanitization & Escaping:** All incoming data is validated and sanitized at ingress; all data is escaped contextually at egress.
4. **Resilience & Recoverability:** Security encompasses not just prevention, but detection, telemetry, and automated off-site recovery.

---

## 2. Threat Modeling (STRIDE Methodology)

### 2.1 Asset Inventory & Classification
- **Critical Assets:** Database credentials, Gemini AI API keys, server configuration (`wp-config.php`), administrator user credentials.
- **High-Value Assets:** Published content integrity (Projects, Insights, Products), user contact submissions, media library assets.
- **Operational Assets:** System availability (HTTP uptime), SSL/TLS certificate validity, DNS records.

### 2.2 STRIDE Threat Assessment Matrix

| STRIDE Category | Threat Scenario | Attack Vector | Severity | Architectural Mitigation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Spoofing** | Adversary impersonates site owner or administrator | Credential stuffing, brute-force on `/wp-login.php`, session hijacking | **Critical** | Enforce strong passwords, multi-factor authentication (MFA/TOTP), transient IP rate-limiting on login, secure HTTP-only session cookies. | Implemented in Architecture |
| **Tampering** | Unauthorized modification of CPTs or code injection | SQL Injection (SQLi), Cross-Site Scripting (XSS), dashboard file editing | **Critical** | 100% prepared SQL statements via `$wpdb->prepare()`, disable dashboard file editor (`DISALLOW_FILE_EDIT`), strict HTML sanitization via `wp_kses_post()`. | Implemented in Code |
| **Repudiation** | Malicious actions taken without audit logs | Contact form abuse, unauthorized post deletion | **Medium** | Administrative audit logging via `sahand-core/includes/class-logging.php`, IP hashing (GDPR compliant), timestamped event records. | Implemented in Architecture |
| **Information Disclosure** | Leakage of server paths, API keys, or draft content | REST API exposure of user emails, public `debug.log`, stack traces, open Git dirs | **High** | Disable `WP_DEBUG_DISPLAY`, block `.git` and `.env` in web server config, restrict `/wp-json/wp/v2/users` to authenticated admins, enforce strict REST permission callbacks. | Implemented in Architecture |
| **Denial of Service** | Resource exhaustion on shared hosting | Unbounded search queries, flood of contact submissions, AI API cost runaway | **High** | Transient-based IP rate limiters (max 5 requests / 10 min for public forms), search query length limits, server-side Gemini token budgets. | Implemented in Code |
| **Elevation of Privilege** | Subscriber account modifies projects or executes code | Broken Object-Level Authorization (BOLA/IDOR), nonce misuse | **Critical** | Capability checks (`current_user_can('edit_sahand_projects')`) coupled with independent nonce verification on every state-altering action. | Implemented in Code |

---

## 3. Defense-in-Depth Implementation Checklist

### 3.1 WordPress Hardening
- [x] **Disable Dashboard File Editing:** `define('DISALLOW_FILE_EDIT', true);` in `wp-config.php`.
- [x] **Disable Unnecessary XML-RPC:** Completely disable XML-RPC via `add_filter('xmlrpc_enabled', '__return_false');`.
- [x] **Remove Generator & Fingerprinting:** Strip `wp_generator` meta tags, RSD links, and wlwmanifest links from `<head>`.
- [x] **Strict File Permissions:** Files set to `0644`, directories to `0755`, `wp-config.php` set to `0600` or `0400`.
- [x] **No Executable Uploads:** Block direct PHP execution inside `wp-content/uploads/` via `.htaccess` / Nginx rules.

### 3.2 Secure Code Development Standards
- **Nonces are Not Authentication:** A nonce verifies intent to prevent CSRF, but never authorises action. Every action first verifies:
  1. `is_user_logged_in()`
  2. `current_user_can($specific_capability)`
  3. `check_admin_referer()` or `wp_verify_nonce()`
- **SQL Injection Prevention:** Every query touching the database must use `$wpdb->prepare()`. Direct string concatenation in SQL is strictly forbidden.
- **Output Escaping Rules:**
  - HTML text nodes: `esc_html()`
  - HTML attributes: `esc_attr()`
  - URLs: `esc_url()`
  - Rich text: `wp_kses_post()` or custom allowed tags
  - Inline scripts: `wp_json_encode()`

### 3.3 REST API Security Controls
Every endpoint in `/wp-json/sahand/v1/` must register:
1. `methods`: Explicitly `WP_REST_Server::READABLE` or `WP_REST_Server::CREATABLE`.
2. `permission_callback`: A callable returning `true` (public with validation) or `current_user_can()`. Endpoints must never omit this callback.
3. `args`: Schema validation with `sanitize_callback` and `validate_callback`.

### 3.4 AI Integration Security (Gemini API Gateway)
- All Gemini API calls are mediated server-side in `sahand-core`.
- The `GEMINI_API_KEY` is loaded from a server environment variable or `wp-config.php` constant. It is **never** sent to the client browser or committed to version control.
- Input prompts are validated against token length limits and prompt-injection patterns.
- AI responses are treated as untrusted and sanitized before rendering to the DOM.

---

## 4. Server-Side Security Headers Specification

The production web server (Nginx / Apache) and theme `functions.php` will enforce:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'self';
```

---

## 5. Backup, Disaster Recovery & Incident Response

### 5.1 Backup Strategy (3-2-1 Architecture)
- **Database Backup:** Nightly mysqldump automated via WP-CLI cron, encrypted with GPG, rotated on a 30-day retention schedule.
- **File System Backup:** Weekly archive of `wp-content/` (excluding cache and logs).
- **Off-Site Storage:** Stored in an isolated cloud bucket (e.g. Google Cloud Storage or S3-compatible cold storage) outside the shared hosting account.
- **RTO (Recovery Time Objective):** < 2 hours.
- **RPO (Recovery Point Objective):** < 24 hours.

### 5.2 Incident Response Playbook
1. **Identification:** Automated alert on failed logins or file integrity changes.
2. **Containment:** Temporarily switch site to Maintenance Mode via `wp maintenance-mode activate`, invalidate all auth tokens using `wp user session destroy --all`.
3. **Eradication:** Restore clean core files, verify plugin/theme hashes against Git baseline.
4. **Recovery:** Restore verified off-site database snapshot if data corruption occurred.
5. **Post-Mortem:** Root cause analysis documented in `docs/SECURITY_INCIDENTS.md`.
