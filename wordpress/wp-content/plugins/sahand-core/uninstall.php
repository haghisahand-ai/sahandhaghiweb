<?php
/**
 * Safe Plugin Uninstallation
 *
 * @package SahandCore
 */

// If uninstall not called from WordPress, exit
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

// Safety check: Only administrators can execute uninstallation
if (!current_user_can('activate_plugins')) {
    return;
}

// Clear any transients created by rate-limiters
global $wpdb;
$wpdb->query(
    $wpdb->prepare(
        "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
        $wpdb->esc_like('_transient_sahand_rate_') . '%'
    )
);

// Note: Post data (sahand_project, sahand_product, etc.) is preserved by default
// to prevent accidental data loss. A complete purge requires explicit database administrator action.
