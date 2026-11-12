# SAHAND — Personal Technology Hub & Engineering Platform

**Domain:** `https://sahandhaghi.site`  
**GitHub:** [https://github.com/haghisahand-ai/sahandhaghiweb](https://github.com/haghisahand-ai/sahandhaghiweb)  
**Production Architecture:** WordPress CMS (Decoupled PHP Theme `sahand-theme` + Independent Core Plugin `sahand-core`)  
**Development & Prototyping Runtime:** Node.js 22 LTS, Express, TypeScript, Vite, React 19  
**Languages:** Persian (`fa-IR`, Default, RTL), English (`en-US`, LTR), Turkish (`tr-TR`, LTR)  

---

## 1. Architectural Philosophy

SAHAND is an advanced personal technology hub for Sahand Haghi, designed to showcase high-throughput software systems, algorithmic execution architectures, artificial intelligence models, and quantitative engineering research.

### Production Environment vs Prototyping Engine
1. **Production Platform (WordPress CMS):**
   - **`wordpress/wp-content/themes/sahand-theme/`**: Pure PHP presentation layer implementing the approved cinematic intro portal, responsive sections, SVG brand emblem, and dynamic page/single/archive templates.
   - **`wordpress/wp-content/plugins/sahand-core/`**: Independent business logic, 4 Custom Post Types (`sahand_project`, `sahand_product`, `sahand_ai_tool`, `sahand_insight`), atomic MySQL rate limiting table (`wp_sahand_rate_limits`), server-side AI Gateway (`class-ai-gateway.php`), REST API ingress (`/wp-json/sahand/v1/`), and multilingual SEO metadata engine.
   - Zero permanent Node.js or daemon process dependencies on shared hosting.
2. **Interactive Development & Validation Engine (`server.ts` + React SPA):**
   - Serves as the high-fidelity interactive sandbox, real-time AI latency diagnostic console, and design verification engine.

---

## 2. Directory Structure

```
├── .env.example                               # Environment secrets specification
├── docs/                                      # Engineering audit and security documentation
│   ├── ARCHITECTURE_PHASE_01.md               # Product architecture specification
│   ├── DEPLOYMENT.md                          # Staging and production deployment runbook
│   ├── ENVIRONMENT.md                         # Hosting and environment specifications
│   ├── SECURITY.md                            # Application security and threat model
│   ├── TECHNICAL_AUDIT.md                     # Comprehensive codebase audit & findings
│   └── TESTING.md                             # Test execution log and QA matrix
├── public/
│   └── downloads/                             # Production-ready packaged WordPress archives
│       ├── sahand-core.zip                    # Core functionality plugin (23 KB)
│       └── sahand-theme.zip                   # Master presentation theme (63.3 KB)
├── scripts/
│   └── package_wordpress.py                   # Automated zero-dependency archive builder
├── server.ts                                  # Express development server & API gateway
├── src/                                       # Interactive React prototype & test suites
│   ├── components/
│   │   ├── AiGatewayDiagnosticTool.tsx        # Real-time AI inference & latency console
│   │   └── WordPressEditionModal.tsx          # In-app WordPress packaging & file inspector
│   └── utils/
│       ├── aiExpertEngine.ts                  # Autonomous technical analysis engine
│       ├── neuralFlow.ts                      # Bézier & orthogonal topological math
│       ├── rateLimiter.ts                     # Concurrency-safe sliding window rate limiter
│       ├── securityValidator.ts               # Object authorization & input validators
│       └── seoHelper.ts                       # Dynamic Open Graph & Schema.org engine
└── wordpress/
    └── wp-content/
        ├── plugins/sahand-core/               # Independent WordPress core plugin
        └── themes/sahand-theme/               # Production WordPress theme
```

---

## 3. Quick Start (Development & Prototyping)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and supply GEMINI_API_KEY (optional; server falls back to sovereign engine if omitted)

# 3. Execute unit tests
npx --yes tsx --test src/utils/*.test.ts

# 4. Run local development server
npm run dev
# Access local hub at http://localhost:3000
```

---

## 4. Packaging WordPress for Staging Deployment

The repository includes a dedicated build script to generate production-ready zip files:

```bash
# Package WordPress Theme and Core Plugin
npm run package:wp
```

Generated archives are written to `public/downloads/`:
- `sahand-theme.zip`: Upload via **WordPress Dashboard > Appearance > Themes > Add New > Upload Theme**.
- `sahand-core.zip`: Upload via **WordPress Dashboard > Plugins > Add New > Upload Plugin**.

---

## 5. Security & Threat Mitigation Summary

- **Object-Level Authorization:** All CPT meta save handlers strictly verify `current_user_can('edit_post', $post_id)` with explicit `$post_id` parameters.
- **Atomic MySQL Rate Limiting:** Protected against concurrent race conditions via composite unique keys (`INSERT ... ON DUPLICATE KEY UPDATE hits = hits + 1`).
- **Cryptographic Nonces:** All contact submissions and administrative forms enforce nonce checks.
- **Content Security Policy:** Configured in `Content-Security-Policy-Report-Only` mode with toggle filter `sahand_enforce_csp`.
- **Upload Directory Execution Lock:** Automatic `.htaccess` denies direct PHP execution in `wp-content/uploads/`.
