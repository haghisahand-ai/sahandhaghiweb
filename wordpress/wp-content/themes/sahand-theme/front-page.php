<?php
/**
 * Front Page Controller & Internal Website Experience
 *
 * @package SahandTheme
 */

if (!defined('ABSPATH')) {
    exit;
}

// 1. Show the intro portal only at the bare site root.
// Language-prefixed front pages must render the actual localized homepage,
// even when the visitor has no Polylang cookie.
if (function_exists('sahand_is_root_intro_request') && sahand_is_root_intro_request()) {
    get_header();
    get_template_part('template-parts/intro/intro-portal');
    get_footer();
    exit;
}

// 2. Localized Platform: Render Redesigned High-Impact Editorial Engineering Platform
get_header();
$current_lang = function_exists('sahand_get_current_lang') ? sahand_get_current_lang() : 'fa';
?>

<main id="primary" class="site-main" style="background-color: var(--color-canvas-dark); color: #FFFFFF;">
  
  <!-- =========================================================================
       SECTION 01: EDITORIAL ARCHITECTURAL HERO (DARK OBSIDIAN & BLUEPRINT)
       ========================================================================= -->
  <section class="hero-editorial" style="position: relative; padding-block: 5rem 6rem; border-bottom: 1px solid var(--color-border-dark); overflow: hidden;">
    <div class="sahand-container" style="position: relative; z-index: 2;">
      
      <!-- Top Meta Tag Ribbon -->
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 2rem;">
        <div class="badge" style="background: rgba(2, 132, 199, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: var(--color-accent-electric);">
          <span>● <?php esc_html_e('DISTRIBUTED SYSTEMS · AI RESEARCH · ALGORITHMIC ENGINES', 'sahand-theme'); ?></span>
        </div>
        <div class="font-mono" style="font-size: 0.75rem; color: rgba(255, 255, 255, 0.45);">
          <span>SAHAND // PERSONAL TECHNOLOGY HUB</span> · <span>FA / EN / TR</span>
        </div>
      </div>

      <!-- Asymmetric Editorial Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 3.5rem; align-items: center;">
        
        <!-- Left Column: Giant Typographic Statement -->
        <div>
          <h1 style="font-size: clamp(2.25rem, 5vw, 3.75rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 1.5rem;">
            <?php
            if ($current_lang === 'fa') {
                echo esc_html('معماری سیستم‌های پیشرفته با دقت و انضباط مهندسی');
            } elseif ($current_lang === 'tr') {
                echo esc_html('Yüksek Matematiksel Hassasiyetle Ölçeklenebilir Sistemler');
            } else {
                echo esc_html('Engineering Scalable Systems with Mathematical Precision');
            }
            ?>
          </h1>

          <p style="font-size: 1.125rem; color: var(--color-text-secondary-dark); line-height: 1.7; margin-bottom: 2.5rem; font-weight: 300;">
            <?php
            if ($current_lang === 'fa') {
                echo esc_html('توسعه پلتفرم‌های مقیاس‌پذیر، زیرساخت‌های معاملاتی فرکانس‌بالا، و ابزارهای هوشمند نسل آینده بر پایه معماری چندلایه، امن و مستقل.');
            } elseif ($current_lang === 'tr') {
                echo esc_html('Derinlemesine güvenlik mimarisi üzerine kurulu yüksek işlem kapasiteli finansal işlem motorları, yapay zeka araçları ve bağımsız dijital ürünler.');
            } else {
                echo esc_html('Architecting high-throughput financial trading systems, sovereign AI toolkits, and robust decoupled platforms built on defense-in-depth cybersecurity.');
            }
            ?>
          </p>

          <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
            <a href="<?php echo esc_url(home_url('/' . $current_lang . '/projects/')); ?>" class="badge badge-stable" style="padding: 0.75rem 1.5rem; font-size: 0.875rem; text-decoration: none; border-radius: var(--radius-md);">
              <?php esc_html_e('Explore Case Studies', 'sahand-theme'); ?> →
            </a>
            <a href="<?php echo esc_url(home_url('/' . $current_lang . '/ai-lab/')); ?>" class="badge badge-tech" style="padding: 0.75rem 1.5rem; font-size: 0.875rem; text-decoration: none; border-radius: var(--radius-md); background: rgba(255, 255, 255, 0.05); color: #FFFFFF;">
              <?php esc_html_e('AI Research Lab', 'sahand-theme'); ?>
            </a>
          </div>
        </div>

        <!-- Right Column: System Matrix Artwork -->
        <div style="background: linear-gradient(180deg, #0F1626 0%, #070A11 100%); border: 1px solid var(--color-border-dark); border-radius: var(--radius-lg); padding: 2rem; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
          <div class="font-mono" style="display: flex; justify-content: space-between; font-size: 0.75rem; border-bottom: 1px solid var(--color-border-dark); padding-bottom: 1rem; margin-bottom: 1.5rem;">
            <span style="color: var(--color-accent-electric);">PLATFORM ARCHITECTURE</span>
            <span style="color: var(--color-warning);">EVOLVING</span>
          </div>

          <div class="font-mono" style="font-size: 0.8125rem; display: flex; flex-direction: column; gap: 0.85rem;">
            <div style="padding: 0.85rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: var(--radius-sm); display: flex; justify-content: space-between;">
              <span>Trading Systems Research</span>
              <span style="color: var(--color-accent-electric);">Research</span>
            </div>
            <div style="padding: 0.85rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: var(--radius-sm); display: flex; justify-content: space-between;">
              <span>AI Integration Layer</span>
              <span style="color: var(--color-warning);">Planned</span>
            </div>
            <div style="padding: 0.85rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: var(--radius-sm); display: flex; justify-content: space-between;">
              <span>WordPress Platform</span>
              <span style="color: #C084FC;">Theme + Core Plugin</span>
            </div>
          </div>

          <div class="font-mono" style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--color-border-dark); display: flex; justify-content: space-between; font-size: 0.75rem; color: rgba(255, 255, 255, 0.45);">
            <span>ARCHITECTURE: MODULAR</span>
            <span style="color: var(--color-accent-electric); font-weight: 700;">STATUS: IN DEVELOPMENT</span>
          </div>
        </div>

      </div>

    </div>
  </section>

  <!-- =========================================================================
       SECTION 02: CAPABILITIES & DOMAINS (CONTRAST EDITORIAL LIGHT)
       ========================================================================= -->
  <section style="background-color: var(--color-canvas); color: var(--color-text-primary); padding-block: 5rem; border-bottom: 1px solid var(--color-border-subtle);">
    <div class="sahand-container">
      
      <div style="display: flex; flex-direction: column; margin-bottom: 3.5rem; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 2rem;">
        <span class="font-mono" style="font-size: 0.75rem; font-weight: 700; color: var(--color-accent); text-transform: uppercase;">02 // CAPABILITIES & DOMAINS</span>
        <h2 style="font-size: clamp(1.75rem, 3.5vw, 2.5rem); font-weight: 800; margin-top: 0.5rem;">
          <?php esc_html_e('Core Engineering Disciplines & Systems Expertise', 'sahand-theme'); ?>
        </h2>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;">
        
        <div class="sahand-card">
          <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 0.75rem;">
            <?php esc_html_e('Artificial Intelligence', 'sahand-theme'); ?>
          </h3>
          <p style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 1rem;">
            <?php esc_html_e('AI application research, model integration patterns, and secure server-side architecture.', 'sahand-theme'); ?>
          </p>
          <div class="badge badge-tech">AI · LLM · RAG</div>
        </div>

        <div class="sahand-card">
          <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 0.75rem;">
            <?php esc_html_e('Financial Engineering', 'sahand-theme'); ?>
          </h3>
          <p style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 1rem;">
            <?php esc_html_e('Research into algorithmic trading architectures, market data processing, and execution workflows.', 'sahand-theme'); ?>
          </p>
          <div class="badge badge-tech">Python · Quant Research</div>
        </div>

        <div class="sahand-card">
          <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 0.75rem;">
            <?php esc_html_e('Cybersecurity', 'sahand-theme'); ?>
          </h3>
          <p style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 1rem;">
            <?php esc_html_e('Threat modeling, access-control design, secure coding, and defense-in-depth practices.', 'sahand-theme'); ?>
          </p>
          <div class="badge badge-tech">STRIDE · Access Control · AppSec</div>
        </div>

        <div class="sahand-card">
          <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 0.75rem;">
            <?php esc_html_e('Systems Architecture', 'sahand-theme'); ?>
          </h3>
          <p style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 1rem;">
            <?php esc_html_e('Custom WordPress architecture, PHP components, content modeling, and maintainable integrations.', 'sahand-theme'); ?>
          </p>
          <div class="badge badge-tech">WordPress · PHP · MySQL</div>
        </div>

      </div>

    </div>
  </section>

</main>

<?php
get_footer();
