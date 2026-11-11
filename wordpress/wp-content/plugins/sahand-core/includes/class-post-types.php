<?php
/**
 * Custom Post Types Registration
 *
 * @package SahandCore
 */

if (!defined('ABSPATH')) {
    exit;
}

class Sahand_Post_Types {

    public static function register_all() {
        self::register_projects();
        self::register_products();
        self::register_ai_tools();
        self::register_insights();
    }

    /**
     * Register Engineering Projects CPT
     */
    private static function register_projects() {
        $labels = array(
            'name'                  => _x('Projects', 'Post type general name', 'sahand-core'),
            'singular_name'         => _x('Project', 'Post type singular name', 'sahand-core'),
            'menu_name'             => _x('Projects', 'Admin Menu text', 'sahand-core'),
            'add_new'               => __('Add New', 'sahand-core'),
            'add_new_item'          => __('Add New Project', 'sahand-core'),
            'edit_item'             => __('Edit Project', 'sahand-core'),
            'new_item'              => __('New Project', 'sahand-core'),
            'view_item'             => __('View Project', 'sahand-core'),
            'search_items'          => __('Search Projects', 'sahand-core'),
            'not_found'             => __('No projects found.', 'sahand-core'),
            'not_found_in_trash'    => __('No projects found in Trash.', 'sahand-core'),
        );

        $args = array(
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => array('slug' => 'projects', 'with_front' => false),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => 20,
            'menu_icon'          => 'dashicons-portfolio',
            'supports'           => array('title', 'editor', 'thumbnail', 'excerpt'),
            'show_in_rest'       => true,
            'rest_base'          => 'projects',
        );

        register_post_type('sahand_project', $args);
    }

    /**
     * Register Launchpad Products CPT
     */
    private static function register_products() {
        $labels = array(
            'name'                  => _x('Products', 'Post type general name', 'sahand-core'),
            'singular_name'         => _x('Product', 'Post type singular name', 'sahand-core'),
            'menu_name'             => _x('Launchpad', 'Admin Menu text', 'sahand-core'),
            'add_new_item'          => __('Add New Product', 'sahand-core'),
            'edit_item'             => __('Edit Product', 'sahand-core'),
            'view_item'             => __('View Product', 'sahand-core'),
            'search_items'          => __('Search Products', 'sahand-core'),
        );

        $args = array(
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => array('slug' => 'launchpad', 'with_front' => false),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => 21,
            'menu_icon'          => 'dashicons-rocket',
            'supports'           => array('title', 'editor', 'thumbnail', 'excerpt'),
            'show_in_rest'       => true,
            'rest_base'          => 'products',
        );

        register_post_type('sahand_product', $args);
    }

    /**
     * Register AI Lab Experiments CPT
     */
    private static function register_ai_tools() {
        $labels = array(
            'name'                  => _x('AI Tools', 'Post type general name', 'sahand-core'),
            'singular_name'         => _x('AI Tool', 'Post type singular name', 'sahand-core'),
            'menu_name'             => _x('AI Lab', 'Admin Menu text', 'sahand-core'),
            'add_new_item'          => __('Add New AI Tool', 'sahand-core'),
            'edit_item'             => __('Edit AI Tool', 'sahand-core'),
        );

        $args = array(
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => array('slug' => 'ai-lab', 'with_front' => false),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => 22,
            'menu_icon'          => 'dashicons-superhero',
            'supports'           => array('title', 'editor', 'thumbnail', 'excerpt'),
            'show_in_rest'       => true,
            'rest_base'          => 'ai-tools',
        );

        register_post_type('sahand_ai_tool', $args);
    }

    /**
     * Register Technical Insights CPT
     */
    private static function register_insights() {
        $labels = array(
            'name'                  => _x('Insights', 'Post type general name', 'sahand-core'),
            'singular_name'         => _x('Insight', 'Post type singular name', 'sahand-core'),
            'menu_name'             => _x('Insights', 'Admin Menu text', 'sahand-core'),
            'add_new_item'          => __('Add New Insight', 'sahand-core'),
            'edit_item'             => __('Edit Insight', 'sahand-core'),
        );

        $args = array(
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => array('slug' => 'insights', 'with_front' => false),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => 23,
            'menu_icon'          => 'dashicons-welcome-write-blog',
            'supports'           => array('title', 'editor', 'thumbnail', 'excerpt'),
            'show_in_rest'       => true,
            'rest_base'          => 'insights',
        );

        register_post_type('sahand_insight', $args);
    }
}
