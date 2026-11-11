<?php
/**
 * Central Security Engine for SAHAND Core
 *
 * @package SahandCore
 */

if (!defined('ABSPATH')) {
    exit;
}

class Sahand_Security {

    /**
     * Verify Nonce with capability check
     *
     * @param string $nonce_name
     * @param string $action
     * @param string $capability
     * @return bool
     */
    public static function verify_authorized_action($nonce_name, $action, $capability = 'edit_posts') {
        if (!isset($_POST[$nonce_name])) {
            return false;
        }

        if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST[$nonce_name])), $action)) {
            return false;
        }

        if (!empty($capability) && !current_user_can($capability)) {
            return false;
        }

        return true;
    }

    /**
     * Ephemeral IP Rate Limiter using Transients
     *
     * @param string $action_key Unique identifier for action (e.g. 'contact_form')
     * @param int $max_requests Maximum allowed requests in window
     * @param int $window_seconds Window duration in seconds
     * @return bool True if allowed, false if limit exceeded
     */
    public static function check_rate_limit($action_key, $max_requests = 5, $window_seconds = 600) {
        $ip_address = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : 'unknown';
        // Salted hash for privacy compliance (GDPR)
        $ip_hash = hash('sha256', $ip_address . wp_salt('auth'));
        $transient_key = 'sahand_rate_' . substr(hash('sha256', $action_key . $ip_hash), 0, 32);

        $current_hits = (int) get_transient($transient_key);

        if ($current_hits >= $max_requests) {
            return false;
        }

        set_transient($transient_key, $current_hits + 1, $window_seconds);
        return true;
    }

    /**
     * Sanitize alphanumeric semver string
     */
    public static function sanitize_semver($version) {
        return preg_replace('/[^0-9a-zA-Z\.\-\+]/', '', trim($version));
    }

    /**
     * Sanitize technical metrics or JSON safely
     */
    public static function sanitize_json_payload($raw_json) {
        $decoded = json_decode($raw_json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return '';
        }
        return wp_json_encode($decoded);
    }
}
