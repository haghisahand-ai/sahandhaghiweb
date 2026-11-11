<?php
/**
 * SAHAND Theme Bootstrap
 *
 * @package SahandTheme
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

// Define theme directory constants
define('SAHAND_THEME_VERSION', '1.0.0');
define('SAHAND_THEME_DIR', get_template_directory());
define('SAHAND_THEME_URI', get_template_directory_uri());

// Load modular theme includes
require_once SAHAND_THEME_DIR . '/inc/setup.php';
require_once SAHAND_THEME_DIR . '/inc/enqueues.php';
require_once SAHAND_THEME_DIR . '/inc/multilingual.php';
require_once SAHAND_THEME_DIR . '/inc/security.php';
