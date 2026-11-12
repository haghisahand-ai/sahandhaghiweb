<?php
/**
 * Core Security, Authorization & Hardening
 *
 * @package SahandCore
 */

if (!defined('ABSPATH')) {
    exit;
}

class Sahand_Security {

    /**
     * Initialize security hooks
     */
    public static function init() {
        // Enforce upload directory execution restrictions
        add_action('admin_init', array(__CLASS__, 'protect_upload_directory'));
        
        // Disable XML-RPC for DDoS mitigation
        add_filter('xmlrpc_enabled', '__return_false');
        
        // Remove WordPress version disclosure
        add_filter('the_generator', '__return_empty_string');
    }

    /**
     * Verify a nonce and the caller's capability for the target object.
     *
     * For object-level capabilities such as edit_post, pass the object ID.
     *
     * @param string $nonce_name  Field name containing the nonce
     * @param string $action      Nonce action name
     * @param string $capability  Required capability (default 'edit_posts')
     * @param int    $object_id   Target post/object ID for object-level checks
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
     * Check rate limit using the atomic Sahand_Rate_Limiter
     *
     * @param string $action_key Category or action identifier
     * @param int    $max_requests Maximum allowed requests
     * @param int    $window_seconds Duration of window
     * @return array Result array from rate limiter
     */
    public static function check_rate_limit($action_key, $max_requests = 5, $window_seconds = 600) {
        if (class_exists('Sahand_Rate_Limiter')) {
            return Sahand_Rate_Limiter::check_and_increment($action_key, $max_requests, $window_seconds);
        }

        // Fallback transient implementation if class not loaded
        $client_ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '127.0.0.1';
        $ip_hash = hash('sha256', $client_ip . wp_salt('auth'));
        $transient_key = 'sh_rate_' . substr(hash('sha256', $action_key . $ip_hash), 0, 32);

        $current_hits = (int) get_transient($transient_key);
        if ($current_hits >= absint($max_requests)) {
            return array(
                'allowed'     => false,
                'current'     => $current_hits,
                'max'         => absint($max_requests),
                'retry_after' => absint($window_seconds),
                'storage'     => 'transient_fallback',
            );
        }

        set_transient($transient_key, $current_hits + 1, absint($window_seconds));
        return array(
            'allowed'     => true,
            'current'     => $current_hits + 1,
            'max'         => absint($max_requests),
            'retry_after' => 0,
            'storage'     => 'transient_fallback',
        );
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

    /**
     * Prevent direct execution of PHP scripts in the WordPress uploads directory
     */
    public static function protect_upload_directory() {
        $upload_dir = wp_upload_dir();
        $basedir = $upload_dir['basedir'];

        if (!is_dir($basedir) || !is_writable($basedir)) {
            return;
        }

        $htaccess_file = trailingslashit($basedir) . '.htaccess';
        if (!file_exists($htaccess_file)) {
            $rules = "# SAHAND Security: Disable PHP execution in uploads\n"
                   . "<Files *.php>\n"
                   . "deny from all\n"
                   . "</Files>\n"
                   . "Options -Indexes -ExecCGI\n";
            @file_put_contents($htaccess_file, $rules);
        }
    }
}
