<?php
/**
 * REST API Ingress & Controller
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
        // 1. System Health Telemetry (Zero Fingerprinting)
        register_rest_route(self::NAMESPACE, '/health', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array(__CLASS__, 'get_health_status'),
            'permission_callback' => '__return_true',
        ));

        // 2. Public Projects Query Endpoint
        register_rest_route(self::NAMESPACE, '/projects', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array(__CLASS__, 'get_projects'),
            'permission_callback' => '__return_true',
            'args'                => array(
                'lang' => array(
                    'required'          => false,
                    'type'              => 'string',
                    'default'           => 'fa',
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => array(__CLASS__, 'validate_language'),
                ),
            ),
        ));

        // 3. Public Products (Launchpad) Query Endpoint
        register_rest_route(self::NAMESPACE, '/products', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array(__CLASS__, 'get_products'),
            'permission_callback' => '__return_true',
            'args'                => array(
                'lang' => array(
                    'required'          => false,
                    'type'              => 'string',
                    'default'           => 'fa',
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => array(__CLASS__, 'validate_language'),
                ),
            ),
        ));

        // 4. Public AI Tools Query Endpoint
        register_rest_route(self::NAMESPACE, '/ai-tools', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array(__CLASS__, 'get_ai_tools'),
            'permission_callback' => '__return_true',
        ));

        // 5. Public Insights Query Endpoint
        register_rest_route(self::NAMESPACE, '/insights', array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => array(__CLASS__, 'get_insights'),
            'permission_callback' => '__return_true',
        ));

        // 6. Secure Contact Form Ingress Endpoint
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
                    'maxLength'         => 120,
                    'sanitize_callback' => 'sanitize_email',
                ),
                'message' => array(
                    'required'          => true,
                    'type'              => 'string',
                    'maxLength'         => 5000,
                    'sanitize_callback' => 'sanitize_textarea_field',
                ),
                '_wpnonce' => array(
                    'required'          => false,
                    'type'              => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                ),
                '_sahand_hp' => array(
                    'required'          => false,
                    'type'              => 'string',
                    'default'           => '',
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
        $lang = $request->get_param('lang') ?: 'fa';

        $query_args = array(
            'post_type'      => 'sahand_project',
            'post_status'    => 'publish',
            'posts_per_page' => 50,
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

        return new WP_REST_Response($projects, 200);
    }

    public static function get_products($request) {
        $query_args = array(
            'post_type'      => 'sahand_product',
            'post_status'    => 'publish',
            'posts_per_page' => 50,
            'orderby'        => 'date',
            'order'          => 'DESC',
        );

        $query = new WP_Query($query_args);
        $products = array();

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $id = get_the_ID();
                $products[] = array(
                    'id'           => $id,
                    'title'        => get_the_title(),
                    'slug'         => get_post_field('post_name', $id),
                    'excerpt'      => get_the_excerpt(),
                    'version'      => sanitize_text_field(get_post_meta($id, '_sahand_product_version', true)),
                    'status'       => sanitize_text_field(get_post_meta($id, '_sahand_product_status', true)),
                    'download_url' => esc_url_raw(get_post_meta($id, '_sahand_product_download_url', true)),
                    'permalink'    => get_permalink($id),
                );
            }
            wp_reset_postdata();
        }

        return new WP_REST_Response($products, 200);
    }

    public static function get_ai_tools() {
        $query = new WP_Query(array(
            'post_type'      => 'sahand_ai_tool',
            'post_status'    => 'publish',
            'posts_per_page' => 20,
        ));

        $tools = array();
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $id = get_the_ID();
                $tools[] = array(
                    'id'         => $id,
                    'title'      => get_the_title(),
                    'model'      => sanitize_text_field(get_post_meta($id, '_sahand_ai_model', true)),
                    'task'       => sanitize_text_field(get_post_meta($id, '_sahand_ai_task', true)),
                    'latency'    => sanitize_text_field(get_post_meta($id, '_sahand_ai_latency', true)),
                    'status'     => sanitize_text_field(get_post_meta($id, '_sahand_ai_status', true)),
                    'endpoint'   => sanitize_text_field(get_post_meta($id, '_sahand_ai_endpoint', true)),
                    'demo_url'   => esc_url_raw(get_post_meta($id, '_sahand_ai_demo_url', true)),
                );
            }
            wp_reset_postdata();
        }

        return new WP_REST_Response($tools, 200);
    }

    public static function get_insights() {
        $query = new WP_Query(array(
            'post_type'      => 'sahand_insight',
            'post_status'    => 'publish',
            'posts_per_page' => 20,
        ));

        $insights = array();
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $id = get_the_ID();
                $insights[] = array(
                    'id'           => $id,
                    'title'        => get_the_title(),
                    'slug'         => get_post_field('post_name', $id),
                    'reading_time' => (int) get_post_meta($id, '_sahand_insight_reading_time', true),
                    'difficulty'   => sanitize_text_field(get_post_meta($id, '_sahand_insight_difficulty', true)),
                    'takeaway'     => sanitize_textarea_field(get_post_meta($id, '_sahand_insight_key_takeaway', true)),
                    'permalink'    => get_permalink($id),
                );
            }
            wp_reset_postdata();
        }

        return new WP_REST_Response($insights, 200);
    }

    public static function handle_contact_submission($request) {
        // 1. Enforce Atomic Rate Limiting: max 5 submissions per 10 minutes
        $rate_check = Sahand_Security::check_rate_limit('contact_form', 5, 600);
        if (!$rate_check['allowed']) {
            $response = new WP_REST_Response(array(
                'success'     => false,
                'message'     => 'Too many contact requests from this address. Please wait before retrying.',
                'retry_after' => $rate_check['retry_after'],
            ), 429);
            $response->header('Retry-After', (string) $rate_check['retry_after']);
            return $response;
        }

        // 2. Anti-Spam Honeypot Verification
        $honeypot = (string) $request->get_param('_sahand_hp');
        if (!empty($honeypot)) {
            // Silently discard automated spam submissions
            return new WP_REST_Response(array(
                'success' => true,
                'message' => 'Your message has been delivered.',
            ), 200);
        }

        // 3. Verify Nonce (accept from body parameter, query parameter, or X-WP-Nonce header)
        $nonce = (string) ($request->get_param('_wpnonce') ?: $request->get_header('x_wp_nonce'));
        if (empty($nonce) || !wp_verify_nonce($nonce, 'sahand_contact_nonce')) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Invalid or expired security token.',
            ), 403);
        }

        $name    = sanitize_text_field((string) $request->get_param('name'));
        $email   = sanitize_email((string) $request->get_param('email'));
        $message = sanitize_textarea_field((string) $request->get_param('message'));

        if ('' === trim($name) || !is_email($email) || '' === trim($message) || mb_strlen(trim($message)) < 5) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Please provide a valid name, email address, and a message of at least 5 characters.',
            ), 400);
        }

        // 4. Validate Admin Recipient Configuration
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

        // 5. Send Email and Check Delivery Return Status
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
