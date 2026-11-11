<?php
/**
 * Master Plugin Orchestrator
 *
 * @package SahandCore
 */

if (!defined('ABSPATH')) {
    exit;
}

class Sahand_Core {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Singleton pattern
    }

    public static function activate() {
        // Register post types and taxonomies upon activation to flush rewrite rules
        Sahand_Post_Types::register_all();
        Sahand_Taxonomies::register_all();
        flush_rewrite_rules();
    }

    public static function deactivate() {
        flush_rewrite_rules();
    }

    public function run() {
        // Hook Post Types and Taxonomies to 'init'
        add_action('init', array('Sahand_Post_Types', 'register_all'));
        add_action('init', array('Sahand_Taxonomies', 'register_all'));

        // Hook Meta Boxes
        Sahand_Meta_Fields::init();

        // Hook Multilingual SEO Manager & Dynamic Meta Tags
        Sahand_SEO_Manager::init();

        // Hook REST API
        Sahand_REST_API::init();

        // Localization
        add_action('init', array($this, 'load_plugin_textdomain'));
    }

    public function load_plugin_textdomain() {
        load_plugin_textdomain('sahand-core', false, dirname(plugin_basename(SAHAND_CORE_FILE)) . '/languages');
    }
}
