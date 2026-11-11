<?php
/**
 * Theme Setup and Core Support Declarations
 *
 * @package SahandTheme
 */

if (!defined('ABSPATH')) {
    exit; // Prevent direct access
}

function sahand_theme_setup() {
    // Make theme available for translation
    load_theme_textdomain('sahand-theme', get_template_directory() . '/languages');

    // Add default posts and comments RSS feed links to head
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails on posts and pages
    add_theme_support('post-thumbnails');
    set_post_thumbnail_size(1200, 630, true);
    add_image_size('sahand-card', 640, 360, true);
    add_image_size('sahand-logo', 180, 180, true);

    // Register primary navigation menu
    register_nav_menus(array(
        'primary' => esc_html__('Primary Navigation', 'sahand-theme'),
        'footer'  => esc_html__('Footer Navigation', 'sahand-theme'),
    ));

    // Switch default core markup to output valid HTML5
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
        'navigation-widgets',
    ));

    // Responsive embedded content
    add_theme_support('responsive-embeds');

    // Disable full block patterns if unneeded
    remove_theme_support('core-block-patterns');
}
add_action('after_setup_theme', 'sahand_theme_setup');
