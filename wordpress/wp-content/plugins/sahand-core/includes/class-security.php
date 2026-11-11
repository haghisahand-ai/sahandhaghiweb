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
     * Verify a nonce and the caller's capability for the target object.
     *
     * For object-level capabilities such as edit_post, pass the object ID.
     *
     * @param string $nonce_name
     * @param string $action
     * @param string $capability
     * @param int    $object_id
     * @return bool
     */
    public static function verify_authorized_action($nonce_name, $action, $capability = 'edit_posts', $object_id = 0) {
        if (!isset($_POST[$nonce_name]) || !is_scalar($_POST[$nonce_name])) {
            return false;
        }

        $nonce = sanitize_text_field(wp_unslash($_POST[$nonce_name]));
        if (!wp_verify_nonce($nonce, $action)) {
            return false;
        }

        if (empty($capability)) {
            return true;
        }

        if ('edit_post' === $capability) {
            $object_id = absint($object_id);
            if (!$object_id || !current_user_can('edit_post', $object_id)) {
                return false;
            }

            return true;
        }

        return current_user_can($capability);
    }

    /**
     * Ephemeral IP rate limiter using WordPress transients.
     *
     * Note: transient read/increment/write is not atomic under concurrent
     * requests. Use an atomic store or edge/WAF rate limiting for strict
     * production enforcement.
     *
     * @param string $action_key Unique identifier for action.
     * @param int    $max_requests Maximum allowed requests in window.
     * @param int    $window_seconds Window duration in seconds.
     * @return bool True if allowed, false if limit exceeded.
     */
    public static function check_rate_limit($action_key, $max_requests = 5, $window_seconds = 600) {
        $ip_address = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : 'unknown';
        $ip_hash = hash('sha256', $ip_address . wp_salt('auth'));
        $transient_key = 'sahand_rate_' . substr(hash('sha256', $action_key . $ip_hash), 0, 32);

        $current_hits = (int) get_transient($transient_key);

        if ($current_hits >= absint($max_requests)) {
            return false;
        }

        set_transient($transient_key, $current_hits + 1, absint($window_seconds));
        return true;
    }

    /**
     * Sanitize an alphanumeric semantic-version string.
     *
     * @param string $version
     * @return string
     */
    public static function sanitize_semver($version) {
        return preg_replace('/[^0-9a-zA-Z\.\-\+]/', '', trim((string) $version));
    }

    /**
     * Validate and normalize a JSON payload.
     *
     * @param string $raw_json
     * @return string
     */
    public static function sanitize_json_payload($raw_json) {
        $decoded = json_decode((string) $raw_json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return '';
        }

        return wp_json_encode($decoded);
    }
}
