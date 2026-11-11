<?php
/**
 * Plugin Name: SAHAND Core
 * Plugin URI: https://sahandhaghi.site
 * Description: Independent functionality and business logic plugin for the SAHAND Personal Technology Hub. Manages Custom Post Types (Projects, Launchpad Products, AI Tools, Insights), Taxonomies, Custom Metadata, REST API endpoints, and Security Hardening.
 * Version: 1.0.0
 * Author: Sahand Haghi & Engineering Team
 * Author URI: https://sahandhaghi.site
 * License: GPL-2.0-or-later
 * Text Domain: sahand-core
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 8.2
 */

if (!defined('ABSPATH')) {
    header('HTTP/1.0 403 Forbidden');
    exit('Direct access forbidden.');
}

// Plugin Constants
define('SAHAND_CORE_VERSION', '1.0.0');
define('SAHAND_CORE_DIR', plugin_dir_path(__FILE__));
define('SAHAND_CORE_URI', plugin_dir_url(__FILE__));
define('SAHAND_CORE_FILE', __FILE__);

// Include Central Orchestrator
require_once SAHAND_CORE_DIR . 'includes/class-security.php';
require_once SAHAND_CORE_DIR . 'includes/class-post-types.php';
require_once SAHAND_CORE_DIR . 'includes/class-taxonomies.php';
require_once SAHAND_CORE_DIR . 'includes/class-meta-fields.php';
require_once SAHAND_CORE_DIR . 'includes/class-seo.php';
require_once SAHAND_CORE_DIR . 'includes/class-rest-api.php';
require_once SAHAND_CORE_DIR . 'includes/class-sahand-core.php';

// Activation & Deactivation Hooks
register_activation_hook(__FILE__, array('Sahand_Core', 'activate'));
register_deactivation_hook(__FILE__, array('Sahand_Core', 'deactivate'));

// Initialize Core Plugin
function sahand_core_init() {
    $core = Sahand_Core::get_instance();
    $core->run();
}
add_action('plugins_loaded', 'sahand_core_init');
