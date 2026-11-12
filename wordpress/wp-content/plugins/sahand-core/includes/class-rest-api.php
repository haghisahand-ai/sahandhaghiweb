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
        add_shortcode('sahand_contact_form', array(__CLASS__, 'render_contact_form'));
    }

    /**
     * Render a working public contact form.
     *
     * Add [sahand_contact_form] to the Contact page in WordPress.
     */
    public static function render_contact_form() {
        wp_register_script('sahand-contact-form', false, array(), SAHAND_CORE_VERSION, true);
        wp_enqueue_script('sahand-contact-form');

        $endpoint = rest_url(self::NAMESPACE . '/contact');
        $inline_script = 'document.addEventListener("submit", async function(event) {
            var form = event.target;
            if (!form.matches("[data-sahand-contact-form]")) return;
            event.preventDefault();
            var status = form.querySelector("[data-form-status]");
            var submit = form.querySelector("button[type=submit]");
            if (submit) submit.disabled = true;
            if (status) status.textContent = "Sending...";
            var payload = {
                name: form.elements.name.value,
                email: form.elements.email.value,
                message: form.elements.message.value,
                website: form.elements.website.value
            };
            try {
                var response = await fetch(' . wp_json_encode($endpoint) . ', {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(payload),
                    credentials: "same-origin"
                });
                var result = await response.json();
                if (!response.ok || !result.success) throw new Error(result.message || "Unable to send message.");
                form.reset();
                if (status) status.textContent = result.message || "Message sent.";
            } catch (error) {
                if (status) status.textContent = error.message || "Message could not be sent.";
            } finally {
                if (submit) submit.disabled = false;
            }
        });';
        wp_add_inline_script('sahand-contact-form', $inline_script);

        ob_start();
        ?>
        <form data-sahand-contact-form class="sahand-contact-form" style="display:grid;gap:1rem;max-width:680px;">
          <p><label for="sahand-contact-name"><?php esc_html_e('Name', 'sahand-core'); ?></label><input id="sahand-contact-name" name="name" type="text" maxlength="100" autocomplete="name" required style="display:block;width:100%;padding:.8rem;border:1px solid #d1d5db;border-radius:8px;"></p>
          <p><label for="sahand-contact-email"><?php esc_html_e('Email', 'sahand-core'); ?></label><input id="sahand-contact-email" name="email" type="email" maxlength="254" autocomplete="email" required style="display:block;width:100%;padding:.8rem;border:1px solid #d1d5db;border-radius:8px;"></p>
          <p><label for="sahand-contact-message"><?php esc_html_e('Message', 'sahand-core'); ?></label><textarea id="sahand-contact-message" name="message" rows="6" maxlength="5000" required style="display:block;width:100%;padding:.8rem;border:1px solid #d1d5db;border-radius:8px;"></textarea></p>
          <p aria-hidden="true" style="position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important;"><label for="sahand-contact-website">Leave this field empty</label><input id="sahand-contact-website" name="website" type="text" tabindex="-1" autocomplete="off"></p>
          <p><button type="submit" class="button button-primary"><?php esc_html_e('Send message', 'sahand-core'); ?></button></p>
          <p data-form-status role="status" aria-live="polite"></p>
        </form>
        <?php
        return ob_get_clean();
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
                    'maxLength'         => 254,
                    'sanitize_callback' => 'sanitize_email',
                ),
                'message' => array(
                    'required'          => true,
                    'type'              => 'string',
                    'maxLength'         => 5000,
                    'sanitize_callback' => 'sanitize_textarea_field',
                ),
                'website' => array(
                    'required'          => false,
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

        // Polylang supports the "lang" WP_Query argument. Apply it only
        // when the multilingual plugin is active.
        $language = $request->get_param('lang');
        if (function_exists('pll_languages_list') && in_array($language, array('fa', 'en', 'tr'), true)) {
            $query_args['lang'] = $language;
        }

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
        // The public form is anonymous: a WordPress nonce exposed to every
        // visitor is not authentication or meaningful CSRF protection.
        // Require a same-site browser Origin and use a honeypot plus rate limits.
        $origin = $request->get_header('origin');
        $origin_host = is_string($origin) ? wp_parse_url($origin, PHP_URL_HOST) : '';
        $origin_scheme = is_string($origin) ? wp_parse_url($origin, PHP_URL_SCHEME) : '';
        $site_host = wp_parse_url(home_url('/'), PHP_URL_HOST);
        $site_scheme = wp_parse_url(home_url('/'), PHP_URL_SCHEME);
        if (
            !$origin_host ||
            !$site_host ||
            strtolower($origin_host) !== strtolower($site_host) ||
            !$origin_scheme ||
            strtolower($origin_scheme) !== strtolower((string) $site_scheme)
        ) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Request origin is not allowed.',
            ), 403);
        }

        $honeypot = $request->get_param('website');
        if (is_string($honeypot) && '' !== trim($honeypot)) {
            return new WP_REST_Response(array('success' => true), 200);
        }

        if (!Sahand_Security::check_rate_limit('contact_form', 5, 600)) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => 'Rate limit exceeded. Please wait before submitting another message.',
            ), 429);
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
