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
        register_rest_route(self::NAMESPACE, '/health', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array(__CLASS__, 'get_health_status'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route(self::NAMESPACE, '/projects', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array(__CLASS__, 'get_projects'),
            'permission_callback' => '__return_true',
            'args'                => array(
                'lang' => array(
                    'required'          => false,
                    'sanitize_callback' => 'sanitize_text_field',
                    'default'           => 'fa',
                    'validate_callback' => array(__CLASS__, 'validate_language'),
                ),
            ),
        ));

        register_rest_route(self::NAMESPACE, '/contact', array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => array(__CLASS__, 'handle_contact_submission'),
            'permission_callback' => '__return_true',
            'args'                => array(
                'name' => array(
                    'required'          => true,
                    'type'              => 'string',
                    'maxLength'         => 100,
                    'sanitize_callback' => 'sanitize_text_field',
                ),
                'email' => array(
                    'required'          => true,
                    'type'              => 'string',
                    'format'            => 'email',
                    'sanitize_callback' => 'sanitize_email',
                ),
                'message' => array(
                    'required'          => true,
                    'type'              => 'string',
                    'maxLength'         => 5000,
                    'sanitize_callback' => 'sanitize_textarea_field',
                ),
                '_wpnonce' => array(
                    'required'          => true,
                    'type'              => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                ),
            ),
        ));
    }

    public static function validate_language($value) {
        return in_array($value, array('fa', 'en', 'tr'), true);
    }

    public static function get_health_status() {
        return new WP_REST_Response(array(
            'status'    => 'ok',
            'timestamp' => gmdate('c'),
        ), 200);
    }

    public static function get_projects($request) {
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
                    'status'    => sanitize_text_field(get_post_meta($id, '_sahand_project_status', true)),
                    'github'    => esc_url_raw(get_post_meta($id, '_sahand_project_github', true)),
                    'demo_url'  => esc_url_raw(get_post_meta($id, '_sahand_project_demo_url', true)),
                    'timeline'  => sanitize_text_field(get_post_meta($id, '_sahand_project_timeline', true)),
                    'permalink' => get_permalink($id),
                );
            }
            wp_reset_postdata();
        }

        return new WP_REST_Response(array('success' => true, 'data' => $projects), 200);
    }

    public static function handle_contact_submission($request) {
        if (!Sahand_Security::check_rate_limit('contact_form', 5, 600)) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Rate limit exceeded. Please wait before submitting another message.',
            ), 429);
        }

        $nonce = $request->get_param('_wpnonce');
        if (!is_string($nonce) || !wp_verify_nonce($nonce, 'sahand_contact_nonce')) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Invalid or expired security token.',
            ), 403);
        }

        $name    = sanitize_text_field((string) $request->get_param('name'));
        $email   = sanitize_email((string) $request->get_param('email'));
        $message = sanitize_textarea_field((string) $request->get_param('message'));

        if ('' === trim($name) || !is_email($email) || '' === trim($message)) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Please provide a valid name, email address, and message.',
            ), 400);
        }

        $admin_email = sanitize_email(get_option('admin_email'));
        if (!is_email($admin_email)) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Contact delivery is not configured. Please use an alternative contact method.',
            ), 503);
        }

        $subject = sprintf('[SAHAND Hub Contact] Message from %s', $name);
        $headers = array(
            'Content-Type: text/plain; charset=UTF-8',
            'Reply-To: ' . $email,
        );
        $body = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}";

        $sent = wp_mail($admin_email, $subject, $body, $headers);
        if (!$sent) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'The message could not be delivered. Please try again later.',
            ), 503);
        }

        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Your message has been delivered.',
        ), 200);
    }
}
