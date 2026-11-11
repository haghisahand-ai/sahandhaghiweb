# SAHAND — Personal Technology Hub
## Master Architecture & Engineering Specification — Phase 01: Product Definition & Architecture
**Author:** Principal Software Architect & Engineering Lead  
**Client / Project Owner:** Sahand Haghi  
**Production Domain:** `https://sahandhaghi.site`  
**Current Phase:** Phase 01 (Foundation & Product Architecture)  
**Status:** Ready for Owner Review & Approval  

---

## 1. Executive Summary & Brand Identity

### 1.1 Brand Philosophy
The **SAHAND Personal Technology Hub** is a long-term, scalable digital platform embodying the engineering ethos of **Sahand Haghi**. Inspired by the majesty, endurance, and quiet strength of **Mount Sahand** (سهند) in Azerbaijan, the identity reflects:
- **Engineering Rigor & Precision:** Calculated, clean systems built with architectural discipline.
- **Independence & Autonomy:** An autonomous platform prioritizing data ownership, self-hosting sustainability, and open-web standards.
- **Multilingual Horizon:** Equal-first citizenships for Persian (`fa-IR`), English (`en-US`), and Turkish (`tr-TR`).
- **Product Craftsmanship:** A launchpad for real software, developer tools, algorithms, and technical insights.

### 1.2 Non-Negotiable Architectural Principles
1. **CMS Foundation:** Native WordPress running on standard LAMP/LEMP hosting. No permanent Node.js server requirement in production.
2. **Strict Separation of Concerns:**
   - **Theme (`sahand-theme`):** Presentation, layout, responsive templates, design system tokens, typography, RTL/LTR layout mechanics, client-side progressive enhancements.
   - **Plugin (`sahand-core`):** Data structures, Custom Post Types (CPTs), custom fields, taxonomies, REST API endpoints, business logic, security controls, future AI middleware.
3. **True Trilingual Parity:** Persian (default, RTL), English (LTR), and Turkish (LTR). No untranslated strings, no machine-translated placeholders, no cross-language pollution.
4. **Zero AI Slop / Anti-Template:** Custom-tailored typography, strict whitespace rhythm, minimal high-utility components, avoiding generic theme bloat or template builder locks (e.g., no Elementor, Divi, or bulky page builders).

---

## 2. Decoupled WordPress Architecture

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT BROWSERS                                   |
|   Persian (fa-IR, RTL)  |  English (en-US, LTR)  |  Turkish (tr-TR, LTR)         |
+-----------------------------------------------------------------------------------+
                                         |
                                  HTTPS (Cloudflare / Nginx)
                                         |
+-----------------------------------------------------------------------------------+
|                             WORDPRESS CORE ENGINE                                 |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | THEME: sahand-theme (Presentation Layer)                                    |  |
|  | - header.php, footer.php, index.php, front-page.php                         |  |
|  | - single-{cpt}.php, archive-{cpt}.php, page-templates/                      |  |
|  | - Bidirectional CSS (Tailwind/PostCSS build -> style.css, rtl.css)          |  |
|  | - Alpine.js / Vanilla JS micro-interactions (no heavy SPA runtime)          |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|  +-----------------------------------------------------------------------------+  |
|  | PLUGIN: sahand-core (Business Logic & Data Layer)                           |  |
|  | - Post Types: sahand_project, sahand_product, sahand_ai_tool, sahand_insight  |  |
|  | - Taxonomies: project_category, tech_stack, product_type, insight_topic     |  |
|  | - Meta Fields: Engine metadata, release logs, metrics, links               |  |
|  | - REST API: /wp-json/sahand/v1/* (secured endpoints)                        |  |
|  | - Future AI Proxy: Server-side Gemini API gateway with rate-limiting       |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|  +-----------------------------------------------------------------------------+  |
|  | MULTILINGUAL LAYER: Polylang Pro / WPML                                      |  |
|  | - URL routing (/fa/, /en/, /tr/)                                            |  |
|  | - Post/Term translation linking                                             |  |
|  | - String translations & hreflang automation                                 |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                         |
+-----------------------------------------------------------------------------------+
|                         PERSISTENCE & STORAGE (MySQL / MariaDB)                   |
|   wp_posts | wp_postmeta | wp_terms | wp_term_taxonomy | Custom AI tables (P10)   |
+-----------------------------------------------------------------------------------+
```

---

## 3. Directory & Folder Tree Specification

### 3.1 Theme Structure (`wordpress/wp-content/themes/sahand-theme/`)
```
sahand-theme/
|-- style.css                       # Theme header definition & fallback styles
|-- rtl.css                         # RTL overrides for Persian layout (fa-IR)
|-- index.php                       # Generic fallback template
|-- front-page.php                  # Dedicated Homepage template
|-- home.php                        # Default blog/archive fallback
|-- header.php                      # Site header, semantic nav, language switcher
|-- footer.php                      # Semantic footer, colophon, legal, copyright
|-- 404.php                         # Localized 404 error page
|-- functions.php                   # Theme bootstrap, enqueue scripts, theme supports
|
|-- templates/                      # Modular page templates
|   |-- page-about.php              # About page (bio, philosophy, background)
|   |-- page-launchpad.php          # Launchpad showcase (products, tools, releases)
|   |-- page-ai-lab.php             # AI Lab hub (experiments, interactive tools)
|   |-- page-engineering.php       # Engineering hub (infrastructure, systems)
|   |-- page-roadmap.php            # Public interactive engineering roadmap
|   |-- page-contact.php            # Secure contact form with validation
|
|-- template-parts/                 # Reusable UI partials
|   |-- header/
|   |   |-- nav-desktop.php         # Desktop navbar with language switcher
|   |   |-- nav-mobile.php          # Slide-out responsive mobile navigation
|   |   `-- language-switcher.php   # Accessible trilingual selector
|   |-- cards/
|   |   |-- card-project.php        # Project card with tech badges and demo links
|   |   |-- card-product.php        # Product card with version, status, downloads
|   |   |-- card-insight.php        # Insight/article card with reading time
|   |   `-- card-ai-tool.php        # AI tool interactive/preview card
|   |-- footer/
|   |   `-- footer-widgets.php      # Micro-nav, system status, pgp key, links
|   `-- common/
|       |-- breadcrumbs.php         # Localized semantic breadcrumbs
|       |-- pagination.php          # Accessible numeric pagination
|       `-- meta-badge.php          # Version/status tag components
|
|-- single-sahand_project.php       # Single view for Projects (case study layout)
|-- single-sahand_product.php       # Single view for Launchpad products (changelog, docs)
|-- single-sahand_ai_tool.php       # Single view for AI Lab experiments
|-- single-sahand_insight.php       # Single view for Technical articles / insights
|-- archive-sahand_project.php      # Filterable archive for Projects
|-- archive-sahand_product.php      # Directory for Products
|-- archive-sahand_insight.php      # Directory for Insights
|
|-- inc/                            # Theme PHP helper functions
|   |-- setup.php                   # Theme setup, nav menus, image sizes
|   |-- enqueues.php                # CSS/JS enqueues with RTL detection
|   |-- template-tags.php           # Reusable output formatters
|   |-- multilingual.php            # Theme-level Polylang/WPML filters & helpers
|   `-- customizer.php              # Minimal theme customizer options (colors, logo)
|
|-- assets/                         # Static source assets
|   |-- css/
|   |   |-- main.css                # Base stylesheet (compiled or standard CSS)
|   |   |-- typography.css          # Font-face declarations (Vazirmatn, Inter, JetBrains)
|   |   `-- components.css          # Core design system component classes
|   |-- js/
|   |   |-- navigation.js           # Mobile drawer, keyboard traps, focus handling
|   |   |-- theme-toggle.php / .js  # Clean light theme defaults & micro-interactions
|   |   `-- main.js                 # Smooth interactions & dialog modals
|   |-- fonts/
|   |   |-- vazirmatn/              # WOFF2 files for Persian typography
|   |   |-- inter/                  # WOFF2 files for Latin UI typography
|   |   `-- jetbrains-mono/         # WOFF2 files for code blocks & engineering badges
|   `-- images/
|       |-- brand/                  # Logo mark, SVG iconography, favicon
|       `-- placeholders/           # High-precision architectural placeholders
|
`-- languages/                      # Theme gettext POT & translation files
    |-- sahand-theme.pot
    |-- fa_IR.po / .mo
    `-- tr_TR.po / .mo
```

### 3.2 Core Plugin Structure (`wordpress/wp-content/plugins/sahand-core/`)
```
sahand-core/
|-- sahand-core.php                 # Plugin entry point, constants, activation hooks
|-- uninstall.php                   # Safe cleanup procedures
|
|-- includes/
|   |-- class-sahand-core.php       # Central plugin loader / orchestrator
|   |-- class-autoloader.php        # PSR-4 compatible autoloader
|   |-- post-types/
|   |   |-- class-cpt-project.php   # 'sahand_project' registration & config
|   |   |-- class-cpt-product.php   # 'sahand_product' registration & config
|   |   |-- class-cpt-ai-tool.php   # 'sahand_ai_tool' registration & config
|   |   `-- class-cpt-insight.php   # 'sahand_insight' registration & config
|   |-- taxonomies/
|   |   |-- class-tax-category.php  # 'project_category'
|   |   |-- class-tax-tech-stack.php# 'tech_stack' (React, Python, Go, Docker, etc.)
|   |   |-- class-tax-product-type.php # 'product_type' (SaaS, CLI, Mobile, Script)
|   |   `-- class-tax-insight-topic.php# 'insight_topic'
|   |-- meta-boxes/
|   |   |-- class-meta-project.php  # Problem, Solution, Github URL, Demo URL, Status
|   |   |-- class-meta-product.php  # Version, Release date, Changelog, Downloads
|   |   `-- class-meta-ai-tool.php  # Model type, API parameters, Experiment status
|   |-- api/
|   |   |-- class-rest-controller.php # Base REST controller with authorization
|   |   |-- class-rest-projects.php   # Public & authenticated endpoints for projects
|   |   |-- class-rest-products.php   # Endpoint for version checks & changelogs
|   |   `-- class-rest-contact.php    # Nonce-verified contact submission endpoint
|   |-- security/
|   |   |-- class-security-sanitizer.php # Centralized sanitization & validation
|   |   `-- class-rate-limiter.php       # IP/Transients-based rate limiting
|   `-- admin/
|       |-- class-admin-columns.php  # Custom columns in WP Admin list views
|       |-- class-admin-settings.php # Plugin settings screen (options page)
|       `-- assets/                  # Admin-only CSS/JS for meta boxes
|
|-- languages/                      # Plugin gettext translation files
|   |-- sahand-core.pot
|   |-- fa_IR.po / .mo
|   `-- tr_TR.po / .mo
`-- README.txt                      # Standard WordPress plugin readme
```

---

## 4. Multilingual Plugin Evaluation & Architecture

### 4.1 Comparative Analysis: WPML vs. Polylang Pro

| Feature / Criteria | WPML (WordPress Multilingual) | Polylang Pro | Winner for SAHAND |
| :--- | :--- | :--- | :--- |
| **Performance & DB Overhead** | Heavy: Creates numerous tables (`wp_icl_*`), injects heavy SQL joins into standard queries, noticeable TTFB overhead. | **Extremely Lightweight:** Uses native WordPress taxonomy (`language` & `term_translations`), minimal joins, uses WP object cache. | **Polylang Pro** |
| **Native Post Type & Meta Integration** | Deep, but complex configuration screens; meta duplication can create data drift. | **Flawless Native Support:** Copies or synchronizes meta fields automatically without custom table overhead. | **Polylang Pro** |
| **URL Structure (`/fa/`, `/en/`, `/tr/`)** | Fully supported via directory or subdomains. | Fully supported via directories (`/fa/`, `/en/`, `/tr/`), removes language prefix for default language if desired, or keeps consistent `/fa/`. | **Tie** |
| **RTL Support & Switching** | Good, but loads extra assets and styles. | **Clean Core WP Integration:** Sets `is_rtl()` and text direction directly based on language locale. | **Polylang Pro** |
| **REST API Compatibility** | Requires WPML REST API extension; sometimes fragile across minor updates. | Native support for `?lang=fa` parameter in standard WP REST endpoints out of the box. | **Polylang Pro** |
| **Developer Experience & APIs** | Complex API functions (`icl_object_id`, hooks with string identifiers). | Intuitive native functions: `pll_the_languages()`, `pll_current_language()`, `pll__('string')`, `pll_register_string()`. | **Polylang Pro** |
| **Long-Term Maintainability** | High upgrade maintenance; frequent database upgrade scripts. | Minimal maintenance; respects core WordPress post/term architecture. | **Polylang Pro** |

### 4.2 Recommendation & Decision
**Recommended Selection: Polylang Pro** (with Polylang for WooCommerce/REST support if needed, or Polylang standard with customized functions).
- **Rationale:** Polylang avoids database bloat by treating languages as a native taxonomy on `wp_posts`. This ensures blazing-fast query speeds (essential for Core Web Vitals and minimalist engineering aesthetics), pristine REST API compatibility, and clean PHP integration.

### 4.3 URL Strategy
- **Persian (Default):** `https://sahandhaghi.site/fa/`
- **English:** `https://sahandhaghi.site/en/`
- **Turkish:** `https://sahandhaghi.site/tr/`
- **Root URL (`https://sahandhaghi.site/`):**
  - Redirects dynamically based on browser `Accept-Language`:
    - If browser prefers `fa` (or user is in Iran/Persian locale) -> `/fa/`
    - If browser prefers `tr` (or user is in Turkey/Azerbaijan locale) -> `/tr/`
    - All other locales fallback gracefully to `/en/` or default `/fa/` (configurable).
  - Remembers user's manual selection via a secure cookie (`pll_language`).
- **CPT Slug Translation:**
  - Projects:
    - Persian: `/fa/projects/slug-in-persian-or-english`
    - English: `/en/projects/slug-in-english`
    - Turkish: `/tr/projeler/slug-in-turkish`
  - Products / Launchpad:
    - Persian: `/fa/launchpad/slug`
    - English: `/en/launchpad/slug`
    - Turkish: `/tr/launchpad/slug`
  - Insights:
    - Persian: `/fa/insights/slug`
    - English: `/en/insights/slug`
    - Turkish: `/tr/insights/slug`

---

## 5. Database & Content Model

### 5.1 Native WordPress Table Mapping
All content is stored in core tables to ensure 100% portability, backup simplicity, and host compatibility.

```
+-------------------------------------------------------------+
|                           wp_posts                          |
| - ID (bigint)                                               |
| - post_title, post_name (slug), post_content, post_excerpt  |
| - post_type: 'sahand_project' | 'sahand_product' |          |
|              'sahand_ai_tool' | 'sahand_insight'            |
| - post_status: 'publish' | 'draft' | 'private'              |
+-------------------------------------------------------------+
                               | 1:N
+-------------------------------------------------------------+
|                          wp_postmeta                        |
| - meta_key / meta_value pairs for technical specifications  |
+-------------------------------------------------------------+
                               | N:M
+-------------------------------------------------------------+
|               wp_terms & wp_term_taxonomy                   |
| - project_category, tech_stack, product_type, insight_topic |
| - language (Polylang taxonomy linking post translations)    |
+-------------------------------------------------------------+
```

### 5.2 Custom Post Types & Metadata Schema

#### A. `sahand_project` (Engineering Projects & Case Studies)
- **Slug:** `projects` (localized)
- **Menu Icon:** `dashicons-portfolio`
- **Taxonomies:**
  - `project_category`: Web Systems, Distributed Systems, Financial Engineering, AI/ML, Embedded/IoT, Open Source.
  - `tech_stack`: Python, TypeScript, React, Go, Docker, PostgreSQL, Redis, Linux, TensorFlow.
- **Custom Post Meta (`wp_postmeta`):**
  | Meta Key | Type | Purpose | Admin UI |
  | :--- | :--- | :--- | :--- |
  | `_sahand_project_status` | string | `concept`, `in_progress`, `production`, `archived` | Dropdown Select |
  | `_sahand_project_problem` | text | The technical/business challenge solved | Textarea / WYSIWYG |
  | `_sahand_project_solution`| text | Architecture and engineering implementation | Textarea / WYSIWYG |
  | `_sahand_project_timeline`| string | e.g. "Q1 2026 - Q3 2026" or "Ongoing" | Text Input |
  | `_sahand_project_demo_url`| url | Live production or staging URL | URL Input |
  | `_sahand_project_github`  | url | GitHub repository link (public or private badge) | URL Input |
  | `_sahand_project_docs_url`| url | Technical documentation link | URL Input |
  | `_sahand_project_featured`| boolean | `1` or `0` for homepage highlight | Checkbox |
  | `_sahand_project_metrics` | json/text | Key performance indicators (e.g. latency, throughput) | Key-Value pairs |

#### B. `sahand_product` (Launchpad Products & Tools)
- **Slug:** `launchpad`
- **Menu Icon:** `dashicons-rocket`
- **Taxonomies:**
  - `product_type`: Desktop App, Web Application, CLI Tool, Developer Library, Microservice.
- **Custom Post Meta (`wp_postmeta`):**
  | Meta Key | Type | Purpose | Admin UI |
  | :--- | :--- | :--- | :--- |
  | `_sahand_product_version` | string | Current semver (e.g. `1.2.0`) | Text Input |
  | `_sahand_product_release_date` | date | Date of latest stable release | Date Picker |
  | `_sahand_product_status`  | string | `alpha`, `beta`, `stable`, `lts` | Select |
  | `_sahand_product_changelog`| markdown/html | Markdown release notes and historical changes | Textarea |
  | `_sahand_product_download_url` | url | Primary executable / asset download | URL Input |
  | `_sahand_product_demo_url`| url | Interactive live product sandbox | URL Input |
  | `_sahand_product_license` | string | e.g. `MIT`, `Apache 2.0`, `Proprietary` | Text Input |

#### C. `sahand_ai_tool` (AI Lab Experiments & Interactive Models)
- **Slug:** `ai-lab`
- **Menu Icon:** `dashicons-superhero`
- **Custom Post Meta (`wp_postmeta`):**
  | Meta Key | Type | Purpose | Admin UI |
  | :--- | :--- | :--- | :--- |
  | `_sahand_ai_model_family` | string | e.g., `gemini-2.5-flash`, `gemini-2.5-pro` | Text / Select |
  | `_sahand_ai_experiment_type` | string | `text_analysis`, `smart_translation`, `code_explainer`, `grounded_search` | Select |
  | `_sahand_ai_status` | string | `experimental`, `public_preview`, `internal_only` | Select |
  | `_sahand_ai_requires_auth`| boolean | Whether user must be logged in | Checkbox |

#### D. `sahand_insight` (Articles, Whitepapers & Research Notes)
- **Slug:** `insights`
- **Menu Icon:** `dashicons-welcome-write-blog`
- **Taxonomies:**
  - `insight_topic`: Architecture, Machine Learning, Systems Programming, Product Engineering, Security.
- **Custom Post Meta (`wp_postmeta`):**
  | Meta Key | Type | Purpose | Admin UI |
  | :--- | :--- | :--- | :--- |
  | `_sahand_reading_time` | integer | Estimated minutes to read | Number Input (Auto-calculated on save) |
  | `_sahand_peer_reviewed` | boolean | Indicates formal technical review | Checkbox |
  | `_sahand_canonical_override` | url | External original canonical if syndicated | URL Input |

### 5.3 Future Phase 10 Custom Database Tables (AI Interaction Schema)
When Phase 10 (AI Integration) is activated, two dedicated tables will be provisioned using `dbDelta()`:
1. `wp_sahand_ai_conversations`: `id`, `session_uuid`, `user_ip_hash`, `language_code`, `created_at`, `updated_at`.
2. `wp_sahand_ai_messages`: `id`, `conversation_id`, `role` (`user`|`model`), `prompt_tokens`, `completion_tokens`, `content`, `grounding_sources`, `created_at`.
*Note: No PII will be stored; IP addresses are hashed using a salted SHA-256 for privacy compliance.*

---

## 6. Design System Specification

### 6.1 Visual Aesthetics
- **Style:** Light, Architectural, Modernist, High-Clarity, Engineering-Grade.
- **Philosophy:** Content-first. Whitespace is an active structural element, not empty space.
- **Micro-Interactions:** Subtle, 150ms-250ms transitions. No jarring bouncy animations or gratuitous canvas 3D gimmicks that degrade battery life or readability.

### 6.2 Color Palette Tokens

| Token Name | Hex Code | Semantic Role | WCAG Contrast (on Background) |
| :--- | :--- | :--- | :--- |
| `--color-canvas` | `#FAFAFB` | Primary Page Background (Soft technical off-white) | Base |
| `--color-surface` | `#FFFFFF` | Card & Container Background | 1.05:1 |
| `--color-border-subtle` | `#E5E7EB` | Hairline dividers, card outlines (1px solid) | 1.2:1 |
| `--color-border-strong` | `#D1D5DB` | Interactive element borders, input fields | 1.6:1 |
| `--color-text-primary` | `#111827` | Headings, primary text, high-emphasis copy | 15.3:1 (AAA) |
| `--color-text-secondary`| `#4B5563` | Body copy, descriptions, metadata | 7.5:1 (AAA) |
| `--color-text-muted` | `#6B7280` | Timestamps, tags, subtle captions | 4.6:1 (AA) |
| `--color-accent` | `#0284C7` | Technical Cyan/Blue (Precision & Innovation) | 4.8:1 (AA) |
| `--color-accent-hover` | `#0369A1` | Active hover state for accent elements | 6.5:1 (AAA) |
| `--color-success` | `#059669` | Stable release badges, live status indicator | 4.9:1 (AA) |
| `--color-warning` | `#D97706` | In-progress / Beta indicator | 4.6:1 (AA) |
| `--color-code-bg` | `#F3F4F6` | Inline code chips and technical tags | Distinct |

### 6.3 Typography Stack

#### Persian Typography (`fa-IR`):
- **Primary Font:** **Vazirmatn** (Open-source variable font by Saber Rastikerdar), with fallbacks to system fonts:
  `font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, sans-serif;`
- **Features:** Optimized Persian numerals, full Arabic/Persian diacritics, clear dot spacing, balanced x-height for readability at both 14px and 48px.

#### Latin Typography (`en-US` & `tr-TR`):
- **Primary Font:** **Inter** (Variable), fallback to system fonts:
  `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`
- **Turkish Diacritics Support:** Full Latin-5 / Turkish character support (`ğ, ü, ş, ı, ö, ç, İ`).

#### Monospace / Code Typography (Universal across all 3 languages):
- **Font:** **JetBrains Mono** or **Fira Code**:
  `font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace;`
- **Usage:** Version badges, terminal snippets, API endpoints, architecture specs.

### 6.4 Spacing & Structural Rhythm
- **Base Grid:** 8pt incremental system (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`).
- **Container Max-Widths:**
  - Standard reading content: `768px` (optimal 65-75 characters per line).
  - Main container: `1200px`.
  - Full-width hero / tables: `1400px`.
- **Border Radius:**
  - Micro-badges / buttons: `4px` or `6px` (crisp, precise, avoiding oversized pill buttons).
  - Cards: `8px`.
  - Modals: `12px`.

### 6.5 Bidirectional (RTL/LTR) Layout Rules
- **Logical CSS Properties:** Use `margin-inline-start`, `padding-inline-end`, `text-align: start`, `inset-inline-start` instead of hardcoded `left`/`right`.
- **Iconography Flipping:** Directional icons (arrows, chevrons, step indicators) auto-flip in RTL via `[dir="rtl"] .icon-directional { transform: scaleX(-1); }`.
- **Media & Numbers:** Technical codes, URLs, and code blocks retain `dir="ltr"` and `text-align: left` even inside Persian pages.

---

## 7. Hosting Environment & Infrastructure Requirements

### 7.1 Production Server Specifications
- **Operating System:** Linux (Ubuntu 22.04 LTS or CloudLinux/Debian).
- **Web Server:** Nginx (recommended with fastcgi_cache) or Apache 2.4+ with `mod_rewrite` and `mod_headers`.
- **PHP Version:** **PHP 8.2 or 8.3** (strict types enabled in custom code).
  - Required Extensions: `curl`, `mbstring`, `openssl`, `json`, `mysqli`, `xml`, `gd` or `imagick`, `intl`.
  - Memory Limit (`memory_limit`): `256MB` (minimum), `512MB` (recommended).
  - Max Execution Time (`max_execution_time`): `60s` (300s for AI API streaming in Phase 10).
- **Database:** MySQL 8.0+ or MariaDB 10.6+ with `utf8mb4_unicode_520_ci` collation.
- **SSL / TLS:** TLS 1.3 with automated Let's Encrypt renewal. HSTS enabled.
- **Caching Layer:** Redis Object Cache (optional but recommended) or WP Super Cache / LiteSpeed Cache.

---

## 8. Security & Hardening Architecture

1. **WordPress Security Standards:**
   - Every form and AJAX/REST request requires a valid WordPress Nonce (`wp_verify_nonce()` or `check_ajax_referer()`).
   - Strict capability checks (`current_user_can('edit_posts')`) on all administrative or state-altering actions.
   - Comprehensive input sanitization: `sanitize_text_field()`, `sanitize_textarea_field()`, `esc_url_raw()`, `wp_kses_post()`.
   - Comprehensive output escaping: `esc_html()`, `esc_attr()`, `esc_url()`, `esc_textarea()`.
   - Safe SQL execution: 100% prepared queries via `$wpdb->prepare()`. Direct string concatenation in queries is strictly prohibited.
2. **REST API Security:**
   - Explicit `permission_callback` for every registered endpoint in `sahand-core`.
   - Rate limiting on public contact and search endpoints (transient-based IP limits, 5 submissions per 10 minutes).
3. **Environment Isolation:**
   - Sensitive credentials (e.g. Gemini API Key) will never be stored in theme files, database options exposed via REST, or client-side JavaScript.
   - Key configuration via `wp-config.php` constants (e.g. `define('SAHAND_GEMINI_API_KEY', '...');`) or server environment variables.
4. **Header Hardening:**
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - Content Security Policy (CSP) defined for scripts, fonts, and API origins.

---

## 9. SEO & Performance Engineering

1. **Multilingual SEO:**
   - Self-referential and alternating `hreflang` tags generated automatically in `<head>` for every translated post/page:
     ```html
     <link rel="alternate" hreflang="fa-IR" href="https://sahandhaghi.site/fa/projects/..." />
     <link rel="alternate" hreflang="en-US" href="https://sahandhaghi.site/en/projects/..." />
     <link rel="alternate" hreflang="tr-TR" href="https://sahandhaghi.site/tr/projeler/..." />
     <link rel="alternate" hreflang="x-default" href="https://sahandhaghi.site/fa/projects/..." />
     ```
   - Canonical links uniquely matching the current language URL.
   - Multi-sitemap output compatible with Yoast SEO, Rank Math, or Polylang XML sitemaps.
2. **Performance Targets:**
   - Core Web Vitals: Largest Contentful Paint (LCP) < 1.8s, Cumulative Layout Shift (CLS) < 0.05, Interaction to Next Paint (INP) < 100ms.
   - Zero render-blocking heavy JavaScript bundles.
   - Local self-hosted fonts in modern `.woff2` format with `font-display: swap`.
   - Responsive images with WebP/AVIF output using native `srcset` and `loading="lazy"`.

---

## 10. Comprehensive 12-Phase Roadmap

| Phase | Title | Core Deliverables | Target Artifacts |
| :--- | :--- | :--- | :--- |
| **01** | **Product Architecture** | Architecture blueprint, CPT data model, multilingual strategy, security rules | `docs/ARCHITECTURE_PHASE_01.md`, `PROJECT_STATUS.md`, `ROADMAP.md` |
| **02** | **Multilingual Foundation**| Polylang Pro configuration guide, language switcher markup, RTL/LTR detection, string registry | `sahand-theme/inc/multilingual.php`, language configs |
| **03** | **Brand & Design System** | Color tokens, typography stack, base CSS, accessible component library, icon system | `sahand-theme/assets/css/*`, component library |
| **04** | **Homepage Prototype** | Interactive trilingual prototype testing layout, language switcher, RTL flow, typography | Visual proof in dev environment & test harness |
| **05** | **WordPress Theme** | Complete `sahand-theme` source code (templates, header, footer, single, archives, style.css) | `wordpress/wp-content/themes/sahand-theme/*` |
| **06** | **Core Plugin** | Complete `sahand-core` plugin with 4 CPTs, taxonomies, meta boxes, REST API endpoints | `wordpress/wp-content/plugins/sahand-core/*` |
| **07** | **Portfolio Sections** | Single & archive templates for About, Projects, Engineering, Insights, and Contact | Template files, contact handler with rate limiting |
| **08** | **Launchpad** | Product showcase, changelog renderer, version badges, direct download/demo linking | Product templates, semver parser |
| **09** | **SEO & Performance** | Hreflang automation, OpenGraph metadata, schema.org JSON-LD, WebP pipelines, asset minification | SEO hooks, caching guidelines |
| **10** | **AI Integration** | Server-side Gemini API proxy, AI Assistant, Smart Translator, Code Explainer, usage telemetry | `sahand-core/includes/ai/*`, Gemini gateway |
| **11** | **Security & Testing** | RTL/LTR visual regression, REST API penetration test, nonce audit, mobile responsive audit | Audit report & test suite |
| **12** | **Production Deployment**| Host configuration, Nginx rules, SSL certs, database migration, domain DNS verification | Production checklist & deployment guide |

---

## 11. Technical Risks & Mitigation Matrix

| Risk | Impact | Probability | Architectural Mitigation |
| :--- | :--- | :--- | :--- |
| **Multilingual Slug Collisions** | High | Low | Enforce language prefixes (`/fa/`, `/en/`, `/tr/`) at the rewrite rules level; Polylang prevents slug duplication across differing locales. |
| **Persian RTL Layout Breakage** | Medium | Medium | Use modern CSS Logical Properties (`margin-inline-start`, `padding-inline-end`). Pair with automated visual checks in RTL mode. |
| **Shared Hosting Resource Limits** | High | Medium | Keep WordPress theme free of heavy runtime dependencies; offload asset compilation to build time. Cache queries with transients. |
| **AI API Latency & Timeouts (Phase 10)** | Medium | High | Decouple AI calls via background processing or asynchronous streaming server-sent events (SSE); implement client-side timeout guards and fallbacks. |
| **Database Migration Data Loss** | Critical | Low | Strictly adhere to native WordPress core schema (`wp_posts`, `wp_postmeta`); use zero destructive SQL alterations. |

---

## 12. Strategic Decisions Requiring Owner Approval

Before proceeding to **Phase 02 (Multilingual Foundation)**, please review and approve the following strategic decisions:

1. **Multilingual Core Plugin:**
   - **Proposal:** Standardize on **Polylang Pro** (lightweight, zero DB pollution, uses native WP taxonomies) rather than WPML (heavier, custom database tables).
   - *Confirmation required:* Approve Polylang Pro as the primary multilingual engine.
2. **Default URL Hierarchy:**
   - **Proposal:** Standardize on explicit prefixes for all languages:
     - Persian (Default): `https://sahandhaghi.site/fa/`
     - English: `https://sahandhaghi.site/en/`
     - Turkish: `https://sahandhaghi.site/tr/`
     - Root `https://sahandhaghi.site/` detects browser preference and redirects with cookie memory.
   - *Alternative:* Root `https://sahandhaghi.site/` serves Persian directly without `/fa/` prefix. (Explicit `/fa/` is recommended for clean SEO isolation).
3. **Typography Selection:**
   - **Proposal:** Persian text powered by **Vazirmatn** (modern, legible, variable weight), Latin text powered by **Inter**, code powered by **JetBrains Mono**.
   - *Confirmation required:* Approve typography pairing.
4. **Custom Post Type Slugs:**
   - **Proposal:** 
     - Projects: `projects`
     - Products/Launchpad: `launchpad`
     - AI Lab: `ai-lab`
     - Insights: `insights`
   - *Confirmation required:* Approve post type slug naming.
5. **Phase Progression Approval:**
   - Explicit confirmation to close Phase 01 and begin **Phase 02 (Multilingual Foundation & Language Switching Architecture)**.
