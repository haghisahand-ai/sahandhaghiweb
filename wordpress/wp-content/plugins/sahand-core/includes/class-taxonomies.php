<?php
/**
 * Custom Taxonomies Registration
 *
 * @package SahandCore
 */

if (!defined('ABSPATH')) {
    exit;
}

class Sahand_Taxonomies {

    public static function register_all() {
        self::register_project_categories();
        self::register_tech_stack();
        self::register_product_types();
        self::register_insight_topics();
    }

    private static function register_project_categories() {
        $labels = array(
            'name'          => _x('Project Categories', 'taxonomy general name', 'sahand-core'),
            'singular_name' => _x('Project Category', 'taxonomy singular name', 'sahand-core'),
            'search_items'  => __('Search Project Categories', 'sahand-core'),
            'all_items'     => __('All Categories', 'sahand-core'),
            'edit_item'     => __('Edit Category', 'sahand-core'),
            'add_new_item'  => __('Add New Category', 'sahand-core'),
        );

        register_taxonomy('project_category', array('sahand_project'), array(
            'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'project-category'),
            'show_in_rest'      => true,
        ));
    }

    private static function register_tech_stack() {
        $labels = array(
            'name'          => _x('Technologies', 'taxonomy general name', 'sahand-core'),
            'singular_name' => _x('Technology', 'taxonomy singular name', 'sahand-core'),
            'search_items'  => __('Search Technologies', 'sahand-core'),
            'all_items'     => __('All Technologies', 'sahand-core'),
            'add_new_item'  => __('Add New Technology', 'sahand-core'),
        );

        register_taxonomy('tech_stack', array('sahand_project', 'sahand_product', 'sahand_ai_tool'), array(
            'hierarchical'      => false,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'tech'),
            'show_in_rest'      => true,
        ));
    }

    private static function register_product_types() {
        $labels = array(
            'name'          => _x('Product Types', 'taxonomy general name', 'sahand-core'),
            'singular_name' => _x('Product Type', 'taxonomy singular name', 'sahand-core'),
        );

        register_taxonomy('product_type', array('sahand_product'), array(
            'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'product-type'),
            'show_in_rest'      => true,
        ));
    }

    private static function register_insight_topics() {
        $labels = array(
            'name'          => _x('Insight Topics', 'taxonomy general name', 'sahand-core'),
            'singular_name' => _x('Insight Topic', 'taxonomy singular name', 'sahand-core'),
        );

        register_taxonomy('insight_topic', array('sahand_insight'), array(
            'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'topic'),
            'show_in_rest'      => true,
        ));
    }
}
