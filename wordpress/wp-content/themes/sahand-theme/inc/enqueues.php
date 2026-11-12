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

    // Google Fonts (Vazirmatn for Persian, Inter for Latin, JetBrains Mono for Code).
    wp_enqueue_style(
        'sahand-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Vazirmatn:wght@300;400;500;600;700;800&display=swap',
        array(),
        null
    );

    wp_enqueue_style('sahand-style', get_stylesheet_uri(), array('sahand-fonts'), $theme_version);

    if (is_rtl()) {
        wp_enqueue_style('sahand-rtl', get_template_directory_uri() . '/rtl.css', array('sahand-style'), $theme_version);
    }

    // Load the approved intro assets only on the unlocalized root portal.
    if (function_exists('sahand_is_root_intro_request') && sahand_is_root_intro_request()) {
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
    }
}
add_action('wp_enqueue_scripts', 'sahand_theme_scripts');
