<?php
/**
 * Enqueue scripts and styles
 *
 * @package SahandTheme
 */

if (!defined('ABSPATH')) {
    exit;
}

function sahand_theme_scripts() {
    $theme_version = wp_get_theme()->get('Version');

    // Google Fonts (Vazirmatn for Persian, Inter for Latin, JetBrains Mono for Code)
    wp_enqueue_style(
        'sahand-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Vazirmatn:wght@300;400;500;600;700;800&display=swap',
        array(),
        null
    );

    // Main stylesheet
    wp_enqueue_style('sahand-style', get_stylesheet_uri(), array('sahand-fonts'), $theme_version);

    // RTL Stylesheet for Persian
    if (is_rtl()) {
        wp_enqueue_style('sahand-rtl', get_template_directory_uri() . '/rtl.css', array('sahand-style'), $theme_version);
    }

    // Intro Portal Assets (enqueued only if root portal or explicit template is active)
    if (is_front_page() && !isset($_COOKIE['pll_language'])) {
        wp_enqueue_style(
            'sahand-intro-portal-css',
            get_template_directory_uri() . '/assets/css/intro-portal.css',
            array(),
            $theme_version
        );

        wp_enqueue_script(
            'sahand-intro-portal-js',
            get_template_directory_uri() . '/assets/js/intro-portal.js',
            array(),
            $theme_version,
            array('strategy' => 'defer', 'in_footer' => true)
        );

        wp_localize_script('sahand-intro-portal-js', 'sahandPortalConfig', array(
            'rootUrl'     => esc_url(home_url('/')),
            'cookiePath'  => '/',
            'routes'      => array(
                'fa' => esc_url(home_url('/fa/')),
                'en' => esc_url(home_url('/en/')),
                'tr' => esc_url(home_url('/tr/')),
            ),
        ));
    }
}
add_action('wp_enqueue_scripts', 'sahand_theme_scripts');
