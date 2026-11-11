<?php
/**
 * The header for SAHAND Theme
 *
 * @package SahandTheme
 */

if (!defined('ABSPATH')) {
    exit;
}

$current_lang = function_exists('sahand_get_current_lang') ? sahand_get_current_lang() : 'fa';
$direction = ($current_lang === 'fa') ? 'rtl' : 'ltr';
?>
<!doctype html>
<html <?php language_attributes(); ?> dir="<?php echo esc_attr($direction); ?>">
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="profile" href="https://gmpg.org/xfn/11">
  <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site-wrapper">
  <a class="skip-link screen-reader-text" href="#primary">
    <?php esc_html_e('Skip to content', 'sahand-theme'); ?>
  </a>

  <!-- Header is displayed on interior content pages -->
  <header id="masthead" class="site-header">
    <div class="sahand-container site-header-inner">
      <a href="<?php echo esc_url(home_url('/' . $current_lang . '/')); ?>" class="site-branding" rel="home">
        <svg width="32" height="32" viewBox="0 0 100 100" fill="none" class="site-emblem-svg" aria-hidden="true">
          <polygon points="50,4 90,26 90,74 50,96 10,74 10,26" stroke="#0284C7" stroke-width="1.5" stroke-opacity="0.3" stroke-dasharray="3 3"/>
          <polygon points="50,16 82,78 18,78" stroke="#0284C7" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="rgba(2, 132, 199, 0.12)"/>
          <path d="M26 64 C38 60, 62 60, 74 64" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round" stroke-opacity="0.7"/>
          <path d="M34 50 C44 46, 56 46, 66 50" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round" stroke-opacity="0.8"/>
          <path d="M50 16 C38 32, 62 44, 50 62 C40 72, 54 78, 50 78" stroke="#00F2FE" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="50" cy="16" r="3.5" fill="#0284C7"/>
        </svg>
        <span class="site-title"><?php echo ($current_lang === 'fa') ? 'سهند <span class="site-sub-brand">SAHAND</span>' : 'SAHAND'; ?></span>
      </a>

      <nav id="site-navigation" class="site-nav" aria-label="<?php esc_attr_e('Main Navigation', 'sahand-theme'); ?>">
        <?php
        wp_nav_menu(array(
            'theme_location' => 'primary',
            'menu_id'        => 'primary-menu',
            'container'      => false,
            'fallback_cb'    => function() use ($current_lang) {
                // Semantic fallback navigation if no WP menu is assigned yet
                echo '<ul>';
                $nav_items = array(
                    'home'        => esc_html__('Home', 'sahand-theme'),
                    'about'       => esc_html__('About', 'sahand-theme'),
                    'projects'    => esc_html__('Projects', 'sahand-theme'),
                    'launchpad'   => esc_html__('Launchpad', 'sahand-theme'),
                    'ai-lab'      => esc_html__('AI Lab', 'sahand-theme'),
                    'engineering' => esc_html__('Engineering', 'sahand-theme'),
                    'insights'    => esc_html__('Insights', 'sahand-theme'),
                    'contact'     => esc_html__('Contact', 'sahand-theme'),
                );
                foreach ($nav_items as $slug => $label) {
                    echo '<li><a href="' . esc_url(home_url('/' . $current_lang . '/' . ($slug === 'home' ? '' : $slug . '/'))) . '">' . esc_html($label) . '</a></li>';
                }
                echo '</ul>';
            },
        ));
        ?>
      </nav>

      <div class="header-actions">
        <?php
        if (function_exists('sahand_render_language_switcher')) {
            sahand_render_language_switcher();
        }
        ?>
      </div>
    </div>
  </header>
