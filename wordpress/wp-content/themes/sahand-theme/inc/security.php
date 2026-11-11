<?php
/**
 * Hardening & Security Filters
 *
 * @package SahandTheme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Send Defense-in-Depth HTTP Security Headers
 */
function sahand_send_security_headers() {
    if (!headers_sent()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
    }
}
add_action('send_headers', 'sahand_send_security_headers');

/**
 * Remove WordPress generator and fingerprinting metadata from <head>
 */
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'wp_shortlink_wp_head');

/**
 * Disable XML-RPC completely
 */
add_filter('xmlrpc_enabled', '__return_false');

/**
 * Prevent user enumeration via author queries (?author=1)
 */
function sahand_block_author_enumeration() {
    if (!is_admin() && isset($_REQUEST['author']) && (is_numeric($_REQUEST['author']) || !empty($_REQUEST['author']))) {
        wp_safe_redirect(home_url('/'), 301);
        exit;
    }
}
add_action('template_redirect', 'sahand_block_author_enumeration');
