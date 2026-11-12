<?php
/**
 * Hardening & Security Filters for SAHAND Theme
 *
 * @package SahandTheme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Send Defense-in-Depth HTTP Security Headers & Content Security Policy
 */
function sahand_send_security_headers() {
    if (headers_sent() || is_admin()) {
        return;
    }

    // Baseline Security Headers
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()');

    // Strict-Transport-Security when HTTPS is active
    if (is_ssl()) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    }

    // Content Security Policy (CSP)
    // Starting with Report-Only to avoid breaking third-party scripts or WordPress customizations
    // Filter 'sahand_enforce_csp' can be hooked to return true when ready for strict enforcement
    $enforce_csp = apply_filters('sahand_enforce_csp', false);
    $csp_header_name = $enforce_csp ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only';

    $csp_directives = array(
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // 'unsafe-inline' required for WP inline scripts & portal canvas
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' data: https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://generativelanguage.googleapis.com",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "form-action 'self'",
    );

    $csp_policy = implode('; ', $csp_directives);
    header("{$csp_header_name}: {$csp_policy}");
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
