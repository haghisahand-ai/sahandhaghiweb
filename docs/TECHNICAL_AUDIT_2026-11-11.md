# SAHAND Repository Audit — 11 November 2026

## Scope

Static review of the public repository at the audit baseline. This review did not include deployment to the live hosting account, execution of the application, authenticated WordPress testing, penetration testing, or verification of mail-provider configuration.

## Confirmed findings

### 1. Meta-box object authorization

The project and product meta save callbacks used `current_user_can('edit_post')` indirectly without passing the post ID. WordPress object-level meta capabilities must be checked against the specific object. The audit-fixes branch changes the helper to accept an object ID, passes the current post ID, restricts callbacks to their intended post types, and ignores revisions/autosaves.

### 2. Contact endpoint delivery reporting

The REST contact handler previously ignored the boolean return value from `wp_mail()` and always returned HTTP 200 with a success message. The audit-fixes branch now validates the submitted fields, validates the configured recipient, checks the mail result, and returns HTTP 503 when delivery fails.

This does not prove end-to-end email deliverability. SMTP/provider configuration and delivery must be tested on staging.

### 3. Public health endpoint information

The previous health response disclosed the plugin version, architecture description, language list, and security posture. The audit-fixes branch reduces the public response to a generic status and timestamp. This is a reduction in unnecessary fingerprinting information, not a substitute for access control or hardening.

### 4. Rate limiting limitation

The current rate limiter uses WordPress transients with a read/increment/write sequence. Concurrent requests can race and exceed the configured threshold. The code now documents this limitation explicitly. Production enforcement should use a suitable edge/WAF control or a storage mechanism with atomic increments and a defined proxy-aware client-IP policy.

### 5. React prototype behavior

The React AI Lab returns predefined content after a timeout; it does not call Gemini. The React contact form changes its local status after a timeout; it does not send a request. These are prototype interactions and must not be represented as production AI inference or successful message delivery.

### 6. Content Security Policy

The theme sends several security headers, but does not implement a Content-Security-Policy. A strict CSP should not be added blindly: the current front end uses inline styles/scripts and third-party font resources. First inventory and remove/nonce/hash inline execution where possible, then test a report-only policy before enforcement.

## Validation still required

- Run PHP syntax checks and WordPress coding standards.
- Run TypeScript lint and Vite production build.
- Test meta-box saves as administrator, editor, and an unauthorized role.
- Test contact endpoint with valid/invalid nonce, malformed fields, rate-limit threshold, invalid admin email, and simulated `wp_mail()` failure/success.
- Verify REST API permissions and public data exposure.
- Test all three languages with the actual multilingual plugin and translated page relationships.
- Run staging accessibility, responsive, performance, backup/restore, and security tests.

## Release decision

Do not deploy this branch directly to production. Merge only after review and the validation items above have been completed on staging.
