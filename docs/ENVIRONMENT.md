# SAHAND — Production Environment & Shared Hosting Specifications

**Target Environment:** Shared WordPress Hosting / Dedicated cPanel / DirectAdmin / Custom LEMP  
**Advertised Shared Resources:** 5 GB Storage, 3 GB RAM, 3 CPU Cores  
**Application Target:** `https://sahandhaghi.site`  

---

## 1. Hosting Hardware & Quota Allocation

While the advertised hosting plan provides 5 GB storage, 3 GB RAM, and 3 CPU cores, shared hosting relies on noisy-neighbor virtualization (e.g., CloudLinux LVE). SAHAND is engineered with minimal footprint to run comfortably well within conservative limits:

- **Storage Footprint:**
  - `sahand-theme`: ~650 KB uncompressed
  - `sahand-core`: ~350 KB uncompressed
  - Packaged Zip Archives: ~86 KB total
  - Memory consumption per PHP worker: ~24 MB (far below standard 256 MB limits)
- **Database Footprint:**
  - `wp_sahand_rate_limits`: ~128 KB initial table size, with probabilistic garbage collection to purge expired records.

---

## 2. Server Configuration Matrix

| Parameter | Recommended Setting | Minimum Required | Operational Notes |
| :--- | :--- | :--- | :--- |
| **PHP Version** | `8.2` or `8.3` | `8.2` | Core uses PHP 8.2 typed properties and match expressions |
| **MySQL Version** | `MySQL 8.0+` or `MariaDB 10.5+` | `MySQL 5.7+` | InnoDB storage engine required for row-level locking and atomic rate limiting |
| **memory_limit** | `256M` | `128M` | Accommodates WordPress core plus theme/plugin overhead |
| **max_execution_time** | `60` seconds | `30` seconds | AI gateway enforces 15s timeout on upstream calls |
| **upload_max_filesize** | `32M` | `10M` | For media library image uploads |
| **post_max_size** | `32M` | `10M` | Must match or exceed upload_max_filesize |
| **allow_url_fopen** | `On` | `On` | Required for `wp_remote_post()` and `wp_remote_get()` |

---

## 3. Required PHP Extensions

The hosting plan must have the following standard PHP extensions enabled:

- `curl` (Required for WordPress HTTP API & Gemini REST communications)
- `mbstring` (Required for multilingual text truncation and string length calculations)
- `json` (Required for REST API payloads, Schema.org JSON-LD generation)
- `mysqli` or `pdo_mysql` (Required for WordPress database interaction)
- `openssl` (Required for HTTPS and cryptographic hash calculations)
- `xml` / `simplexml` (Required for WordPress XML sitemaps and feed generation)

---

## 4. Required Environment Constants (in `wp-config.php`)

```php
// Gemini AI API Key (kept strictly on server)
define('SAHAND_GEMINI_API_KEY', 'your_key_here');

// Trusted reverse proxy IP list (for Cloudflare / host proxy)
define('SAHAND_TRUSTED_PROXIES', array('127.0.0.1', '::1'));

// Admin security
define('DISALLOW_FILE_EDIT', true);
```
