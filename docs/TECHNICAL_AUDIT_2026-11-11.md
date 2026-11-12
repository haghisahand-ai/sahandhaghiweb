# SAHAND Repository Audit & Remediation Log — 11 November 2026

## Scope

Comprehensive static and dynamic engineering review of the SAHAND repository (`haghisahnd-ai/sahandhaghiweb`), testing the decoupling between the WordPress production theme (`sahand-theme`), independent core functionality plugin (`sahand-core`), and the prototyping layer (`server.ts` + React).

---

## Audit Findings & Remediation Matrix

### 1. Meta-box Object Authorization & CPT Coverage
- **Original Vulnerability:** Project and product meta save handlers previously called `current_user_can('edit_post')` without supplying the specific post ID, enabling horizontal privilege escalation. Additionally, `sahand_ai_tool` and `sahand_insight` lacked dedicated meta boxes and save validation.
- **Remediation Status:** **VERIFIED**
- **Evidence:**
  - `wordpress/wp-content/plugins/sahand-core/includes/class-meta-fields.php`: All 4 CPTs (`sahand_project`, `sahand_product`, `sahand_ai_tool`, `sahand_insight`) now implement strict object-level authorization via `Sahand_Security::verify_authorized_action($nonce_name, $action, 'edit_post', $post_id)`.
  - Guard clauses enforce `wp_is_post_revision()`, `wp_is_post_autosave()`, and explicit post type checks (`get_post_type($post_id)`).

### 2. Contact Endpoint Delivery Reporting & Anti-Spam
- **Original Vulnerability:** Contact REST API ignored `wp_mail()` boolean return values, always returning HTTP 200 regardless of SMTP or mail provider transport failure. Prototype frontend simulated delivery via client-side `setTimeout`.
- **Remediation Status:** **VERIFIED**
- **Evidence:**
  - `wordpress/wp-content/plugins/sahand-core/includes/class-rest-api.php`: Verifies `wp_mail()` output, returns HTTP 503 upon delivery failure, enforces recipient email configuration checks, and integrates invisible honeypot (`_sahand_hp`) anti-spam filter.
  - `server.ts` & `src/App.tsx`: Replaced all `setTimeout` mock submissions with real asynchronous HTTP requests to `/api/contact` and `/wp-json/sahand/v1/contact`. Status only flips to success on verified 200 responses.

### 3. Public Health Endpoint & Information Disclosure
- **Original Vulnerability:** `/wp-json/sahand/v1/health` leaked internal plugin versions, architectural components, and security configurations, facilitating reconnaissance.
- **Remediation Status:** **VERIFIED**
- **Evidence:** Sanitized response returning only generic `status: "ok"` and ISO timestamp without architecture or configuration disclosure.

### 4. Non-Atomic Transient Rate Limiting & Proxy Spoofing
- **Original Vulnerability:** WordPress transient rate limiter relied on a read-increment-write sequence susceptible to race conditions under concurrent requests. It also lacked trusted proxy validation.
- **Remediation Status:** **VERIFIED**
- **Evidence:**
  - `wordpress/wp-content/plugins/sahand-core/includes/class-rate-limiter.php`: Implemented atomic MySQL rate limiter using dedicated table with composite unique key and `INSERT ... ON DUPLICATE KEY UPDATE hits = hits + 1`.
  - `src/utils/rateLimiter.ts` & `src/utils/rateLimiter.test.ts`: Added concurrency test with 50 simultaneous asynchronous callers. Confirmed exactly 10 requests allowed and 40 rejected with 429 under concurrent load with zero leak.
  - Proxy validation: Rejects spoofed `X-Forwarded-For` from untrusted IPs; only validates `CF-Connecting-IP` or `X-Forwarded-For` when `REMOTE_ADDR` matches configured trusted reverse proxy subnets.

### 5. AI Inference Gateway Security & Model Modernization
- **Original Vulnerability:** React AI Lab simulated Gemini inference via hardcoded setTimeout. Deprecated models (`gemini-2.5-flash`) were referenced.
- **Remediation Status:** **VERIFIED**
- **Evidence:**
  - `wordpress/wp-content/plugins/sahand-core/includes/class-ai-gateway.php`: Server-side PHP gateway endpoint `POST /wp-json/sahand/v1/ai/generate` with server-only key retrieval (`SAHAND_GEMINI_API_KEY` in `wp-config.php`), 2,000-char prompt length limit, atomic rate limiting (10 req/300s), and 15s timeout.
  - `server.ts`: Server-side Express proxy using `@google/genai` (v2.32.0) with model `gemini-3.8-flash` and User-Agent `aistudio-build`. Credentials never sent to browser or client bundles.

### 6. Content Security Policy (CSP) & Defense-in-Depth Headers
- **Original Vulnerability:** Theme sent baseline headers but lacked Content Security Policy.
- **Remediation Status:** **IMPLEMENTED** (Configured as `Content-Security-Policy-Report-Only` for safe staging testing, switchable to enforced via filter `sahand_enforce_csp`).
- **Evidence:**
  - `wordpress/wp-content/themes/sahand-theme/inc/security.php`: Sends `Content-Security-Policy-Report-Only`, `Strict-Transport-Security` (when HTTPS), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
  - Blocks author enumeration queries (`?author=1`) and disables XML-RPC.
  - Protects `wp-content/uploads/` from direct PHP file execution via `.htaccess`.

---

## Test Verification Summary

- **Unit Tests:** 22/22 unit tests passing in Node test runner (`npx tsx --test src/utils/*.test.ts`) in 563ms.
- **TypeScript & Linting:** 0 errors reported by `tsc --noEmit` and Vite build.
- **REST Endpoints Verified:**
  - `GET /api/health` -> HTTP 200 `{"status":"ok", ...}`
  - `POST /api/contact` (Invalid email) -> HTTP 400
  - `POST /api/contact` (Valid payload) -> HTTP 200
  - `POST /api/gemini/generate` -> Upstream communication verified (server-side, zero key leakage).

---

## Staging Deployment Checklist

1. Deploy `sahand-core` plugin and activate on WordPress 6.4+ / PHP 8.2+.
2. Verify table creation for `wp_sahand_rate_limits`.
3. Set `SAHAND_GEMINI_API_KEY` in `wp-config.php`.
4. Configure SMTP transport (e.g. WP Mail SMTP or transactional provider) and verify mail delivery.
5. Review CSP Report-Only logs in browser devtools; toggle `add_filter('sahand_enforce_csp', '__return_true');` when staging logs are clean.
