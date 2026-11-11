# SAHAND — Master Development Roadmap

**Product:** SAHAND Personal Technology Hub (`https://sahandhaghi.site`)  
**Architecture:** Decoupled WordPress Theme (`sahand-theme`) + Core Plugin (`sahand-core`)  
**Languages:** Persian (`fa-IR`, default RTL), English (`en-US`, LTR), Turkish (`tr-TR`, LTR)  

---

## Phase Overview & Execution Strategy

```
[Phase 01: Architecture] ---> [Phase 02: Multilingual] ---> [Phase 03: Design System]
           |
           v
[Phase 04: Prototype]   ---> [Phase 05: WP Theme]    ---> [Phase 06: WP Core Plugin]
           |
           v
[Phase 07: Portfolio]   ---> [Phase 08: Launchpad]   ---> [Phase 09: SEO & Perf]
           |
           v
[Phase 10: AI Integration] -> [Phase 11: Security & Test] -> [Phase 12: Deployment]
```

---

## Detailed Milestone Breakdown

### Phase 01: Product Definition and Architecture
- **Objective:** Establish the foundational architecture, system boundaries, database mapping, hosting prerequisites, multilingual strategy, and risk mitigations.
- **Key Artifacts:** `docs/ARCHITECTURE_PHASE_01.md`, `PROJECT_STATUS.md`, `ROADMAP.md`.
- **Status:** **Completed — Awaiting Owner Approval.**

### Phase 02: Multilingual Foundation
- **Objective:** Establish the trilingual routing engine, configure Polylang Pro taxonomies, implement language switcher components, and verify RTL/LTR locale switching logic.
- **Key Artifacts:** Language switching hooks, RTL/LTR detection utilities, string translation registry (`sahand-theme/inc/multilingual.php`).
- **Status:** Queued (Requires Phase 01 signoff).

### Phase 03: Brand and Design System
- **Objective:** Translate the Mount Sahand brand philosophy into a high-precision design system: semantic color tokens, typography hierarchy (Vazirmatn + Inter + JetBrains Mono), spacing scale, card primitives, and accessible form elements.
- **Key Artifacts:** Core stylesheets (`assets/css/main.css`, `typography.css`, `components.css`), font asset configurations.
- **Status:** Queued.

### Phase 04: Homepage Prototype
- **Objective:** Construct a fully functional, interactive trilingual prototype of the Homepage to visually and structurally validate typography, RTL flow, responsive grid, and language switcher behavior in real-time.
- **Key Artifacts:** Trilingual UI prototype, verification screenshots, responsive testing.
- **Status:** Queued.

### Phase 05: WordPress Theme (`sahand-theme`)
- **Objective:** Build the complete standalone WordPress theme directory: `style.css`, `header.php`, `footer.php`, `front-page.php`, `index.php`, 404, templates, navigation menus, and RTL stylesheet (`rtl.css`).
- **Key Artifacts:** `wordpress/wp-content/themes/sahand-theme/*`.
- **Status:** Queued.

### Phase 06: WordPress Core Plugin (`sahand-core`)
- **Objective:** Build the independent core plugin registering 4 Custom Post Types (`sahand_project`, `sahand_product`, `sahand_ai_tool`, `sahand_insight`), custom taxonomies, structured meta boxes, and secure REST API endpoints.
- **Key Artifacts:** `wordpress/wp-content/plugins/sahand-core/*`.
- **Status:** Queued.

### Phase 07: Portfolio Sections
- **Objective:** Implement single and archive templates for About, Projects, Engineering, Insights, and Contact. Connect contact submission handling with nonce verification and transient rate-limiting.
- **Key Artifacts:** Single CPT templates, archive filters, contact form handler.
- **Status:** Queued.

### Phase 08: Launchpad
- **Objective:** Build the product and digital tool release center: version tracking, semver badges, downloadable asset linking, changelog renderers, and interactive demo framing.
- **Key Artifacts:** `single-sahand_product.php`, `page-launchpad.php`, changelog component.
- **Status:** Queued.

### Phase 09: SEO and Performance
- **Objective:** Implement trilingual `hreflang` generation, XML sitemap integration, OpenGraph and Twitter card metadata, semantic schema.org markup, WebP image sizing, and aggressive Core Web Vitals optimization.
- **Key Artifacts:** SEO hooks, schema generator, caching and minification configuration.
- **Status:** Queued.

### Phase 10: AI Integration
- **Objective:** Implement a secure, server-side Gemini API proxy inside `sahand-core`. Build the SAHAND AI Assistant, Smart Translator, Code Explainer, and AI Tools directory grounded in published website content.
- **Key Artifacts:** `sahand-core/includes/api/class-rest-ai.php`, AI interaction UI, usage telemetry.
- **Status:** Queued.

### Phase 11: Security and Testing
- **Objective:** Comprehensive testing: visual regression across all 3 languages, RTL alignment audit, mobile viewport verification, SQL injection and XSS penetration checks, REST API rate-limiting validation.
- **Key Artifacts:** Security audit report, browser verification logs.
- **Status:** Queued.

### Phase 12: Production Deployment
- **Objective:** Production rollout on `https://sahandhaghi.site`: Nginx server block configuration, SSL/TLS certificate setup, database export/import, rewrite rule verification, and post-launch health monitoring.
- **Key Artifacts:** Nginx configuration file, deployment checklist, disaster recovery guide.
- **Status:** Queued.
