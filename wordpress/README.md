# SAHAND WordPress Installation

This directory contains the production WordPress theme and plugin. The React/Vite application at the repository root is a design prototype and is not required to run the WordPress site.

## Package locations

- Theme: `wp-content/themes/sahand-theme/`
- Plugin: `wp-content/plugins/sahand-core/`

Copy these two directories into the matching directories of a clean WordPress installation. Do not upload the repository root as a theme.

## Requirements

- WordPress 6.4 or newer.
- PHP 8.2 or newer.
- MySQL 8.0 or newer, or MariaDB 10.6 or newer.
- HTTPS enabled.
- Polylang installed and configured with the language slugs `fa`, `en`, and `tr`.

The theme currently uses Polylang APIs for language detection and translated-page links. Without Polylang, the theme falls back to Persian; the English and Turkish language experience is not complete.

## Activation sequence

1. Back up the WordPress database and files.
2. Install and activate Polylang. Add Persian, English, and Turkish languages using the exact slugs above; choose Persian as the default.
3. In Polylang language URL settings, enable language codes in URLs for all languages, including the default Persian language. This is required because the approved intro portal occupies the bare site root while localized homepages use `/fa/`, `/en/`, and `/tr/` routes.\n4. Upload and activate **SAHAND Theme** from Appearance → Themes.
5. Upload and activate **SAHAND Core** from Plugins.
6. In Settings → Reading, assign a static front page after creating the localized home pages.
7. Create the required pages for each language (Home, About, Projects, Launchpad, AI Lab, Engineering, Insights, Contact) and link translations in Polylang.
8. Set the primary and footer menus under Appearance → Menus and assign the corresponding theme locations.
9. Set Settings → Permalinks to **Post name**, then save once after activating the plugin to refresh rewrite rules.
10. Add the shortcode `[sahand_contact_form]` to the Contact page content in each language.
11. Configure WordPress outgoing email using a trusted SMTP provider and verify delivery on staging.

## Intro portal

The approved language-selection intro is displayed at the bare site root. Language-prefixed front pages are rendered as normal localized homepages. The intro assets are loaded only for the root intro request.

## Contact form security and delivery

The shortcode submits JSON to the plugin REST endpoint. The endpoint validates fields, checks the same-site Origin header, uses a honeypot field, applies a transient-based rate limit, and checks the result of `wp_mail()`.

The transient limiter is not atomic under concurrent requests. Configure an edge/WAF rate limit before production. A successful `wp_mail()` result means WordPress handed the message to its mail transport; it does not prove inbox delivery. Validate SMTP delivery and spam handling on staging.

## Release validation

Before production:

- Run the repository GitHub Actions workflow and confirm PHP syntax and frontend checks pass.
- Activate the theme and plugin on a clean staging WordPress installation.
- Test page, archive, single, 404, and all language routes.
- Test project/product metadata permissions with administrator, editor, and unauthorized accounts.
- Test the contact form with valid/invalid fields, wrong Origin, honeypot submission, rate-limit threshold, and SMTP failure/success.
- Verify backups and perform a restore test.
- Run responsive, accessibility, performance, and security regression checks.

Do not treat a successful source build or PHP syntax check as proof of production readiness.
