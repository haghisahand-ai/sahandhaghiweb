<?php
/**
 * Cinematic Interactive Intro Portal
 *
 * @package SahandTheme
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<div id="sahand-intro-portal" class="sahand-intro-container" role="region" aria-label="<?php esc_attr_e('Interactive Brand Portal', 'sahand-theme'); ?>">
  <!-- HTML5 Canvas for Neural Geometric Particle Field -->
  <canvas id="sahand-neural-canvas" class="intro-canvas" aria-hidden="true"></canvas>

  <!-- Top System Bar -->
  <header class="intro-header">
    <div class="intro-brand-meta">
      <div class="intro-monogram">SH</div>
      <div class="intro-meta-text">
        <span class="intro-title">SAHAND</span>
        <span class="intro-version">SYSTEM HUB · V1.0</span>
      </div>
    </div>

    <div class="intro-controls">
      <div class="intro-badge">
        <span class="status-dot"></span>
        <span>WP ENGINE // POLYLANG // DEFENSE-IN-DEPTH</span>
      </div>
      <button id="toggle-motion-btn" class="intro-btn-sm" type="button" aria-pressed="false">
        MOTION: ON
      </button>
    </div>
  </header>

  <!-- Central Visual Core -->
  <main class="intro-core">
    <!-- Mount Sahand Geometric Emblem with S-Curve & Geological Elevation -->
    <div class="intro-emblem" aria-hidden="true">
      <div class="emblem-glow"></div>
      <svg viewBox="0 0 100 100" class="emblem-svg" fill="none" stroke="currentColor">
        <polygon points="50,4 90,26 90,74 50,96 10,74 10,26" stroke="#38BDF8" stroke-width="1.2" stroke-opacity="0.2" stroke-dasharray="3 3"/>
        <polygon points="50,16 82,78 18,78" stroke="#38BDF8" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="rgba(56, 189, 248, 0.15)"/>
        <path d="M26 64 C38 60, 62 60, 74 64" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round" stroke-opacity="0.7"/>
        <path d="M34 50 C44 46, 56 46, 66 50" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round" stroke-opacity="0.8"/>
        <path d="M50 16 C38 32, 62 44, 50 62 C40 72, 54 78, 50 78" stroke="#00F2FE" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="50,16 66,42 82,78" stroke="#38BDF8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.85"/>
        <circle cx="50" cy="16" r="3.5" fill="#38BDF8"/>
        <circle cx="18" cy="78" r="2.5" fill="#38BDF8"/>
        <circle cx="82" cy="78" r="2.5" fill="#38BDF8"/>
      </svg>
    </div>

    <h1 class="intro-brand-name">SAHAND</h1>

    <p id="intro-headline" class="intro-headline">
      Beyond Technology. Building What's Next.
    </p>

    <div class="intro-pills font-mono">
      <span>Artificial Intelligence</span>
      <span class="divider">·</span>
      <span>Engineering</span>
      <span class="divider">·</span>
      <span>Innovation</span>
      <span class="divider">·</span>
      <span>Digital Products</span>
    </div>

    <!-- Trilingual Region & Language Selection Grid -->
    <div class="intro-lang-grid" role="group" aria-label="<?php esc_attr_e('Select Language', 'sahand-theme'); ?>">
      
      <!-- Persian /fa/ -->
      <a href="<?php echo esc_url(sahand_get_language_home_url('fa')); ?>" class="lang-card" data-lang="fa" dir="rtl">
        <div class="lang-card-header">
          <span class="lang-native-name font-persian">فارسی</span>
          <span class="lang-tag font-mono">/fa/ · RTL</span>
        </div>
        <p class="lang-desc font-persian">ورود به پلتفرم مهندسی و نوآوری سهند</p>
        <div class="lang-cta font-persian">
          <span>ورود به سامانه</span>
          <span class="arrow-icon">←</span>
        </div>
      </a>

      <!-- English /en/ -->
      <a href="<?php echo esc_url(sahand_get_language_home_url('en')); ?>" class="lang-card" data-lang="en" dir="ltr">
        <div class="lang-card-header">
          <span class="lang-native-name font-latin">English</span>
          <span class="lang-tag font-mono">/en/ · LTR</span>
        </div>
        <p class="lang-desc font-latin">Engineering & Technology Platform</p>
        <div class="lang-cta font-latin">
          <span>Enter Hub</span>
          <span class="arrow-icon">→</span>
        </div>
      </a>

      <!-- Turkish /tr/ -->
      <a href="<?php echo esc_url(sahand_get_language_home_url('tr')); ?>" class="lang-card" data-lang="tr" dir="ltr">
        <div class="lang-card-header">
          <span class="lang-native-name font-latin">Türkçe</span>
          <span class="lang-tag font-mono">/tr/ · LTR</span>
        </div>
        <p class="lang-desc font-latin">Mühendislik ve Teknoloji Platformu</p>
        <div class="lang-cta font-latin">
          <span>Giriş Yap</span>
          <span class="arrow-icon">→</span>
        </div>
      </a>

    </div>
  </main>

  <!-- Telemetry Footer -->
  <footer class="intro-footer font-mono">
    <div class="footer-left">
      <span class="security-lock">🔒 DEFENSE-IN-DEPTH SECURITY ARCHITECTURE</span>
      <span class="sep">|</span>
      <span>DOMAIN: SAHANDHAGHI.SITE</span>
    </div>
    <div class="footer-right">
      <span>WORDPRESS THEME & CORE PLUGIN</span>
      <span class="sep">|</span>
      <span>© <?php echo esc_html(gmdate('Y')); ?> SAHAND HAGHI</span>
    </div>
  </footer>
</div>
