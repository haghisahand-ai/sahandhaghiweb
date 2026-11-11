# SAHAND — Premium Multilingual Interactive Intro & Security Architecture Specification
**Document Version:** 1.0  
**Domain:** `https://sahandhaghi.site`  
**Brand Identity:** SAHAND  
**Headline:** Beyond Technology. Building What's Next.  
**Subheadline:** Artificial Intelligence · Engineering · Innovation · Digital Products  
**Production Runtime:** WordPress Decoupled Architecture (`sahand-theme` + `sahand-core`)  

---

## 1. Visual Design Direction

### 1.1 Aesthetic Philosophy
The introduction experience acts as a high-precision, cinematic portal into the SAHAND technology hub. It balances:
- **Atmospheric Depth:** Deep spatial canvas (`#070B14` to `#0A101F`) evoking nocturnal calm and focused computational power.
- **Architectural & Neural Lighting:** Soft cyan (`#00F2FE`), precision cobalt (`#0284C7`), and sky blue (`#38BDF8`) luminescence. Nodes and connection threads communicate interconnected engineering systems and intelligence.
- **Mount Sahand Geometric Symbolism:** The brand emblem features stylized, sharp geometric vector contours of Mount Sahand integrated with computational node points and coordinate vertices.
- **Zero AI-Slop & Anti-Clutter:** No floating random 3D objects, no over-blurred glassmorphism, no gaming gamification. Every pixel, hairline border (`rgba(255,255,255,0.08)`), and label communicates engineering discipline and intent.

---

## 2. Intro Screen Layout

```
+-----------------------------------------------------------------------------------+
|  [SH] SAHAND // SYSTEM HUB V1.0             [WP // POLYLANG // SECURE] [MOTION]   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                                       / \                                         |
|                                      /   \                                        |
|                                     / / \ \  (Mount Sahand Emblem)                |
|                                    /_______ \                                     |
|                                                                                   |
|                                    S A H A N D                                    |
|                                                                                   |
|                    Beyond Technology. Building What's Next.                       |
|           (فراتر از فناوری. ساخت آنچه در راه است. / Teknolojinin Ötesinde...)      |
|                                                                                   |
|        Artificial Intelligence · Engineering · Innovation · Digital Products       |
|                                                                                   |
|   +-----------------------+ +-----------------------+ +-----------------------+   |
|   | فارسی                 | | English               | | Türkçe                |   |
|   | /fa/ · RTL            | | /en/ · LTR            | | /tr/ · LTR            |   |
|   | پلتفرم مهندسی سهند    | | Engineering Hub       | | Teknoloji Platformu   |   |
|   | [مشاهده پلتفرم <-]    | | [Enter Hub ->]        | | [Giriş Yap ->]        |   |
|   +-----------------------+ +-----------------------+ +-----------------------+   |
|                                                                                   |
|                             [ Enter SAHAND Platform -> ]                          |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|  LOCK: DEFENSE-IN-DEPTH SECURITY ARCHITECTURE | DOMAIN: SAHANDHAGHI.SITE | (C) 2026 |
+-----------------------------------------------------------------------------------+
```

---

## 3. Language Selector Design

### 3.1 Trilingual Architecture
1. **فارسی (Persian — `fa-IR`):**
   - **Route:** `/fa/`
   - **Direction:** RTL (Right-to-Left)
   - **Typography:** Vazirmatn
   - **Description:** ورود به پلتفرم مهندسی سهند
   - **Action Badge:** RTL chevron indicator (`←`)
2. **English (`en-US`):**
   - **Route:** `/en/`
   - **Direction:** LTR (Left-to-Right)
   - **Typography:** Inter
   - **Description:** Engineering & Technology Hub
   - **Action Badge:** LTR chevron indicator (`→`)
3. **Türkçe (Turkish — `tr-TR`):**
   - **Route:** `/tr/`
   - **Direction:** LTR (Left-to-Right)
   - **Typography:** Inter (supporting full Latin-5 diacritics: `ğ, ü, ş, ı, ö, ç, İ`)
   - **Description:** Mühendislik ve Teknoloji Platformu
   - **Action Badge:** LTR chevron indicator (`→`)

### 3.2 State & Micro-Interactions
- **Default State:** Subtle semi-transparent dark card (`rgba(255,255,255,0.03)`), crisp hairline border (`rgba(255,255,255,0.1)`), locale badge (`/fa/ · RTL`, `/en/ · LTR`, `/tr/ · LTR`).
- **Hover State:** Border transitions to `rgba(2, 132, 199, 0.6)`, background brightens to `rgba(255, 255, 255, 0.06)`, subtle cyan glow shadow (`0 0 25px rgba(2, 132, 199, 0.2)`), dynamic preview of the main headline in the hovered language.
- **Active / Selected State:** Solid deep navy background (`rgba(2, 132, 199, 0.15)`), active border (`#38BDF8`), elevated drop-shadow.

---

## 4. Animation & Motion Specification

1. **Neural Particle Network (HTML5 2D Canvas):**
   - 40–55 autonomous nodes with randomized velocity vectors (`vx, vy: [-0.22, 0.22]`).
   - Dynamic distance calculation: When two nodes approach within 140px, a hairline connection thread is drawn with dynamic opacity proportional to proximity.
   - Low CPU & GPU footprint: Uses standard 2D canvas context without WebGL overhead, ensuring 60fps even on low-power mobile devices.
2. **Reduced Motion Accessibility (`prefers-reduced-motion`):**
   - When the user enables reduced motion (either in OS settings or via the header toggle `MOTION: OFF`), canvas animations pause immediately, and transitions fall back to instant or simple opacity fades (150ms).
3. **Portal Transition:**
   - On language selection, a 350ms easing transition sets the `pll_language` cookie and smoothly navigates the viewport to the localized WordPress URL (`https://sahandhaghi.site/fa/`, `/en/`, or `/tr/`).

---

## 5. Responsive Behavior (Mobile & Tablet Layouts)

- **Mobile Viewports (< 640px):**
  - Grid collapses cleanly into a vertical stack (Persian at the top, English second, Turkish third).
  - Canvas node count automatically scales down to 25 nodes to preserve mobile battery and prevent frame drops.
  - Generous 48px touch targets meeting WCAG 2.2 touch-target criteria.
  - Directional padding adjusts (`px-4 py-8`).
- **Tablet Viewports (640px – 1024px):**
  - 3-column grid renders with compact horizontal spacing (`gap-3.5`).
  - Text scales proportionately using fluid typography (`clamp()`).
- **Desktop Viewports (> 1024px):**
  - Max container width constrained to `1000px` for optimal optical focus and balanced visual hierarchy.

---

## 6. WordPress Integration Approach

### 6.1 Architecture in `sahand-theme`
The intro experience will be integrated natively into `sahand-theme` through two complementary mechanisms:
1. **Root Controller (`index.php` / `front-page.php`):**
   - When a visitor visits the bare root domain `https://sahandhaghi.site/`:
     - If the user has a stored language preference cookie (`pll_language`), they are redirected directly to their saved language (`/fa/`, `/en/`, or `/tr/`).
     - If no cookie exists, the cinematic Intro Portal is rendered full-screen, allowing them to consciously choose their language and experience the brand introduction.
2. **Template Integration:**
   - Placed in `wordpress/wp-content/themes/sahand-theme/template-parts/intro/intro-portal.php`.
   - Vanilla JavaScript module in `assets/js/intro-portal.js` (compiled, lightweight, zero external runtime libraries, no React dependency in WordPress production).
   - Localized strings rendered via WordPress gettext: `__('Beyond Technology. Building What\'s Next.', 'sahand-theme')`.
   - On button click, sets the Polylang cookie via secure SameSite attributes:
     `document.cookie = "pll_language=" + lang + "; path=/; max-age=31536000; SameSite=Lax; Secure";`
     and immediately redirects to `window.location.href = "/" + lang + "/";`.

---

## 7. Security Considerations for the Intro Experience

Even a seemingly simple intro page must be designed with strict security controls:
1. **URL Whitelist Validation:**
   - The language switcher must only redirect to strictly validated paths (`/fa/`, `/en/`, `/tr/`). Unsanitized query parameters or open redirect vectors (`?redirect=...`) are strictly prohibited to prevent Open Redirect attacks (CWE-601).
2. **Cookie Hardening:**
   - The language preference cookie (`pll_language`) is flagged with `Secure` (HTTPS only), `SameSite=Lax`, and restricted to `path=/`.
3. **Content Security Policy (CSP):**
   - The canvas and inline SVGs adhere to a strict CSP:
     `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data:; connect-src 'self';`
4. **Clickjacking & Frame Protection:**
   - Protected against iframe embedding via HTTP header:
     `X-Frame-Options: SAMEORIGIN` and CSP `frame-ancestors 'self'`.
5. **No External CDN Dependencies:**
   - All fonts (Vazirmatn, Inter, JetBrains Mono) and scripts will be hosted locally on the WordPress server to eliminate supply-chain and CDN tampering risks.

---

## 8. Components & Files Inventory

### A. React Prototype (AI Studio Live Preview)
- `src/App.tsx`: Interactive working prototype demonstrating the intro experience, canvas neural animation, trilingual switching, and transition into the clean editorial platform.
- `src/index.css`: Typography definitions and font-face rules for Vazirmatn, Inter, and JetBrains Mono.

### B. WordPress Theme Deliverables (`sahand-theme`)
- `template-parts/intro/intro-portal.php`: Complete PHP/HTML markup for the full-screen portal.
- `assets/css/intro-portal.css`: Pure CSS styles for dark canvas, glowing borders, and responsive grid.
- `assets/js/intro-portal.js`: Lightweight, dependency-free vanilla JS for the neural node canvas, keyboard accessibility, and cookie handling.
- `front-page.php`: Controller rendering either the intro portal or the localized front page.

### C. Documentation Deliverables
- `docs/INTRO_EXPERIENCE_SPECIFICATION.md`: This comprehensive specification document.
- `docs/ARCHITECTURE_PHASE_01.md`: Master architectural blueprint.
- `PROJECT_STATUS.md`: Real-time tracking of deliverables and phase milestones.
- `ROADMAP.md`: Master 12-phase execution plan.
