# SAHAND — Staging & Production Deployment Runbook

**Target Domain:** `https://sahandhaghi.site`  
**Production Stack:** Linux (LAMP / LEMP), Apache / Nginx, PHP 8.2+, MySQL 8.0+ / MariaDB 10.5+, WordPress 6.4+  
**Target Architecture:** Decoupled WordPress Theme (`sahand-theme`) + Core Plugin (`sahand-core`)  

---

## 1. Pre-Deployment Package Build

Ensure the latest theme and plugin zip archives are compiled from the verified source code:

```bash
# Package WordPress Theme & Plugin into public/downloads/
python3 scripts/package_wordpress.py
```

Generated packages:
- `public/downloads/sahand-theme.zip` (~63 KB)
- `public/downloads/sahand-core.zip` (~23 KB)

---

## 2. Server & wp-config.php Configuration

Add the following security constants to your production `wp-config.php` above the `/* That's all, stop editing! Happy publishing. */` line:

```php
// 1. SAHAND Gemini AI Gateway Configuration
define('SAHAND_GEMINI_API_KEY', 'your-secret-gemini-api-key-here');

// 2. Reverse Proxy & WAF Configuration (if behind Cloudflare)
define('SAHAND_TRUSTED_PROXIES', array(
    '127.0.0.1',
    '::1',
    // Add hosting reverse proxy IP or Cloudflare IP ranges
));

// 3. Security Hardening
define('DISALLOW_FILE_EDIT', true);      // Disable in-dashboard theme/plugin code editor
define('WP_POST_REVISIONS', 5);          // Limit database bloat
define('FORCE_SSL_ADMIN', true);         // Force SSL in admin dashboard
```

---

## 3. Database Table Provisioning (Atomic Rate Limiter)

The plugin automatically provisions the rate limits table upon activation. If manual execution or verification is needed in phpMyAdmin:

```sql
CREATE TABLE IF NOT EXISTS `wp_sahand_rate_limits` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `action_key` varchar(40) NOT NULL,
  `ip_hash` varchar(64) NOT NULL,
  `bucket` bigint(20) unsigned NOT NULL,
  `hits` int(11) unsigned NOT NULL DEFAULT 1,
  `expires_at` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `action_ip_bucket` (`action_key`, `ip_hash`, `bucket`),
  KEY `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
```

---

## 4. Plugin and Theme Installation Steps

1. **Log in to WordPress Admin (`/wp-admin`)**.
2. **Install Core Plugin:**
   - Navigate to **Plugins > Add New Plugin > Upload Plugin**.
   - Choose `sahand-core.zip` and click **Install Now**.
   - Click **Activate Plugin**.
3. **Install Presentation Theme:**
   - Navigate to **Appearance > Themes > Add New Theme > Upload Theme**.
   - Choose `sahand-theme.zip` and click **Install Now**.
   - Click **Activate**.
4. **Configure Permalinks:**
   - Navigate to **Settings > Permalinks**.
   - Select **Post name** (`/%postname%/`) and click **Save Changes** (this registers rewrite rules for CPTs).
5. **Assign Primary Menu:**
   - Navigate to **Appearance > Menus**.
   - Create a menu with Home, About, Projects, Launchpad, AI Lab, Engineering, Insights, and Contact.
   - Assign it to display location **Primary Navigation**.

---

## 5. Rollback & Disaster Recovery Procedures

1. **Database Rollback:**
   - If a deployment failure occurs, restore the database backup taken prior to deployment via phpMyAdmin or `wp db import backup_pre_deploy.sql`.
2. **Plugin / Theme Rollback:**
   - Rename `wp-content/themes/sahand-theme/` to `sahand-theme.broken`.
   - WordPress will automatically fall back to the default theme (e.g., `twentytwentyfour`).
   - If `sahand-core` throws a fatal error, rename `wp-content/plugins/sahand-core/` to deactivate it.
