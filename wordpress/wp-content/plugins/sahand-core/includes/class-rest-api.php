<?php
/**
 * REST API Controller with Security Controls
 *
 * @package SahandCore
 */

if (!defined('ABSPATH')) {
    exit;
}

class Sahand_REST_API {

    const NAMESPACE = 'sahand/v1';

    public static function init() {
        add_action('rest_api_init', array(__CLASS__, 'register_routes'));
    }

    public static function register_routes() {
        // System Health & Security Telemetry
        register_rest_route(self::NAMESPACE, '/health', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array(__CLASS__, 'get_health_status'),
            'permission_callback' => '__return_true',
        ));

        // Public Projects Query Endpoint
        register_rest_route(self::NAMESPACE, '/projects', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array(__CLASS__, 'get_projects'),
            'permission_callback' => '__return_true',
            'args'                => array(
                'lang' => array(
                    'required'          => false,
                    'sanitize_callback' => 'sanitize_text_field',
                    'default'           => 'fa',
                ),
            ),
        ));

        // Secure Contact Form Ingress Endpoint
        register_rest_route(self::NAMESPACE, '/contact', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array(__CLASS__, 'handle_contact_submission'),
            'permission_callback' => '__return_true',
            'args'                => array(
                'name' => array(
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ),
                'email' => array(
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_email',
                ),
                'message' => array(
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_textarea_field',
                ),
                '_wpnonce' => array(
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ),
            ),
        ));
    }

    public static function get_health_status() {
        return new WP_REST_Response(array(
            'status'       => 'operational',
            'platform'     => 'SAHAND Personal Technology Hub',
            'version'      => SAHAND_CORE_VERSION,
            'architecture' => 'Decoupled WordPress Theme + Plugin',
            'languages'    => array('fa', 'en', 'tr'),
            'security'     => 'Defense-in-Depth / Rate-Limiting Armed',
            'timestamp'    => gmdate('c'),
        ), 200);
    }

    public static function get_projects($request) {
        $lang = $request->get_param('lang') ?: 'fa';

        $query_args = array(
            'post_type'      => 'sahand_project',
            'post_status'    => 'publish',
            'posts_per_page' => 12,
            'orderby'        => 'date',
            'order'          => 'DESC',
        );

        $query = new WP_Query($query_args);
        $projects = array();

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $id = get_the_ID();
                $projects[] = array(
                    'id'        => $id,
                    'title'     => get_the_title(),
                    'slug'      => get_post_field('post_name', $id),
                    'excerpt'   => get_the_excerpt(),
                    'status'    => get_post_meta($id, '_sahand_project_status', true),
                    'github'    => get_post_meta($id, '_sahand_project_github', true),
                    'demo_url'  => get_post_meta($id, '_sahand_project_demo_url', true),
                    'timeline'  => get_post_meta($id, '_sahand_project_timeline', true),
                    'permalink' => get_permalink($id),
                );
            }
            wp_reset_postdata();
        }

        return new WP_REST_Response(array('success' => true, 'data' => $projects), 200);
    }

    public static function handle_contact_submission($request) {
        // Enforce Transient Rate Limiting: max 5 submissions per 10 minutes
        if (!Sahand_Security::check_rate_limit('contact_form', 5, 600)) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Rate limit exceeded. Please wait before submitting another message.',
            ), 429);
        }

        // Verify Nonce
        $nonce = $request->get_param('_wpnonce');
        if (!wp_verify_nonce($nonce, 'sahand_contact_nonce')) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Invalid or expired security token.',
            ), 403);
        }

        $name    = $request->get_param('name');
        $email   = $request->get_param('email');
        $message = $request->get_param('message');

        if (!is_email($email)) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Invalid email address.',
            ), 400);
        }

        // In a production environment, send notification email to admin
        $admin_email = get_option('admin_email');
        $subject = sprintf('[SAHAND Hub Contact] Message from %s', $name);
        $headers = array('Content-Type: text/plain; charset=UTF-8', 'Reply-To: ' . $email);
        $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";

        wp_mail($admin_email, $subject, $body, $headers);

        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Your message has been securely submitted.',
        ), 200);
    }
}
