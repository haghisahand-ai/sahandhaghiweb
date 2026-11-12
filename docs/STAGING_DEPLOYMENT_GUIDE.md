# SAHAND — Staging Deployment, Shared Hosting Compatibility & Backup Runbook

**Target Production Domain:** `https://sahandhaghi.site`  
**Architecture:** Decoupled WordPress Theme (`sahand-theme`) + Core Plugin (`sahand-core`)  
**Target Environment:** Standard Shared / Managed WordPress Hosting (cPanel, LiteSpeed, Apache, or Nginx)

---

## 1. Hosting Requirements & Compatibility Matrix

| Parameter | Recommended Specification | Minimum Compatible | Validation Command / Check |
| :--- | :--- | :--- | :--- |
| **PHP Version** | PHP 8.2 or 8.3 | PHP 8.1 | `php -v` |
| **PHP Memory Limit** | `256M` or `512M` | `128M` | `ini_get('memory_limit')` |
| **Max Execution Time** | `60s` | `30s` | `ini_get('max_execution_time')` |
| **Database** | MySQL 8.0 or MariaDB 10.6+ | MySQL 5.7 | `SELECT VERSION();` |
| **Required Extensions** | `curl`, `json`, `mbstring`, `openssl`, `mysqli`, `pcre` | Core standard set | `php -m` |
| **File Permissions** | Folders: `755`, Files: `644`, `wp-config.php`: `400` or `440` | `750` / `640` | `ls -la` |
| **Cron Scheduling** | Real system crontab (`*/15 * * * * php /path/to/wp-cron.php`) | Alternate WP-Cron | Crontab |

---

## 2. Environment Configuration (`wp-config.php`)

Add the following security, performance, and API definitions to your staging and production `wp-config.php` above the `/* That's all, stop editing! */` line:

```php
// =========================================================================
// SAHAND PLATFORM — PRODUCTION CONFIGURATION
// =========================================================================

// 1. Server-Side Gemini AI Gateway Credentials (Server-only; never leaked)
define('SAHAND_GEMINI_API_KEY', 'your-secret-gemini-api-key-here');

// 2. Trusted Reverse Proxy Configuration (e.g. Cloudflare IP ranges)
define('SAHAND_TRUSTED_PROXIES', array(
    '127.0.0.1',
    '::1',
    // Add hosting reverse proxy or Cloudflare proxy egress IPs
));

// 3. Security Hardening & File Protection
define('DISALLOW_FILE_EDIT', true);       // Disables plugin/theme file editor in dashboard
define('FORCE_SSL_ADMIN', true);          // Enforces HTTPS for admin sessions

// 4. Memory Allocations
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');

// 5. Disable System WP-Cron if system cron job is active
// define('DISABLE_WP_CRON', true);
```

---

## 3. Staging Deployment Procedure

### Step 1: Upload and Activate `sahand-core` Plugin
1. Compress `wordpress/wp-content/plugins/sahand-core/` into `sahand-core.zip`.
2. Navigate to **Plugins > Add New > Upload Plugin** in the WordPress staging dashboard.
3. Click **Activate Plugin**.
4. The activation hook automatically:
   - Registers all 4 Custom Post Types (`sahand_project`, `sahand_product`, `sahand_ai_tool`, `sahand_insight`).
   - Registers custom taxonomies.
   - Executes `Sahand_Rate_Limiter::create_table()` to provision `wp_sahand_rate_limits`.
   - Flushes rewrite rules cleanly.

### Step 2: Upload and Activate `sahand-theme`
1. Compress `wordpress/wp-content/themes/sahand-theme/` into `sahand-theme.zip`.
2. Navigate to **Appearance > Themes > Add New > Upload Theme**.
3. Activate **SAHAND Theme**.
4. Ensure primary navigation menu is assigned in **Appearance > Menus**.

### Step 3: Configure Multilingual Plugin (Polylang)
1. Install and activate **Polylang** or **Polylang Pro**.
2. Configure three languages in order:
   - **Persian (`fa`)** — Set as Default Language (RTL)
   - **English (`en`)** — LTR
   - **Turkish (`tr`)** — LTR
3. In **Settings > Languages > Settings**, configure:
   - URL modifications: *The language code is added to the pretty permalinks* (e.g. `/fa/`, `/en/`, `/tr/`).
   - Hide URL language information for default language: *Unchecked* (ensures `/fa/` is explicit).

---

## 4. Backup, Disaster Recovery & Rollback Runbook

### 4.1 Database Backup
Execute prior to every deployment or update via terminal or cron:
```bash
mysqldump --opt --single-transaction --routines --triggers \
  -u [DB_USER] -p[DB_PASSWORD] [DB_NAME] > /backup_storage/db_sahand_$(date +%Y%m%d_%H%M%S).sql
gzip -9 /backup_storage/db_sahand_*.sql
```

### 4.2 WordPress File Backup
```bash
tar -czvf /backup_storage/files_sahand_$(date +%Y%m%d_%H%M%S).tar.gz \
  --exclude='wp-content/cache' \
  --exclude='wp-content/upgrade' \
  /var/www/html/
```

### 4.3 Off-Site Retention Policy
- Retain daily backups for 14 days.
- Retain weekly backups for 8 weeks.
- Retain monthly backups for 12 months.
- Automatically sync archives to secondary encrypted storage (e.g., S3-compatible cold bucket or secure SFTP). Never store backups exclusively on the local hosting account.

### 4.4 Rollback Procedure
If a deployment fails verification on staging:
1. Re-activate previous theme release:
   ```bash
   wp theme activate sahand-theme-previous
   ```
2. Restore database state from snapshot if schema was altered:
   ```bash
   mysql -u [DB_USER] -p[DB_PASSWORD] [DB_NAME] < /backup_storage/db_sahand_[TIMESTAMP].sql
   ```
3. Purge object cache and flush rewrite rules:
   ```bash
   wp cache flush
   wp rewrite flush
   ```

---

## 5. Verification Checklist Before Production Cutover

- [ ] All 4 CPTs visible in admin with correct meta boxes and save handlers.
- [ ] Save post as editor and verify object-level capabilities prevent cross-post tampering.
- [ ] Submit contact form with invalid inputs and verify HTTP 400 rejection.
- [ ] Send 6 consecutive contact form submissions and verify HTTP 429 rate limit response.
- [ ] Test real email delivery via `wp_mail()` with configured SMTP credentials.
- [ ] Verify AI gateway responds to test query or reports graceful 503 if API key is pending.
- [ ] Verify language switcher switches between equivalent translated pages.
- [ ] Check browser console for zero Content-Security-Policy violations in Report-Only mode.
- [ ] Verify accessibility navigation and reduced-motion toggle behavior.
