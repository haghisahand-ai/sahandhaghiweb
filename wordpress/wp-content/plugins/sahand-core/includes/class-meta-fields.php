<?php
/**
 * Custom Meta Boxes & Fields Management
 *
 * @package SahandCore
 */

if (!defined('ABSPATH')) {
    exit;
}

class Sahand_Meta_Fields {

    public static function init() {
        add_action('add_meta_boxes', array(__CLASS__, 'add_meta_boxes'));
        add_action('save_post', array(__CLASS__, 'save_project_meta'));
        add_action('save_post', array(__CLASS__, 'save_product_meta'));
    }

    public static function add_meta_boxes() {
        // Project Specifications Meta Box
        add_meta_box(
            'sahand_project_specs',
            __('Project Engineering Specifications', 'sahand-core'),
            array(__CLASS__, 'render_project_specs_box'),
            'sahand_project',
            'normal',
            'high'
        );

        // Product Release Specifications Meta Box
        add_meta_box(
            'sahand_product_specs',
            __('Launchpad Release Specifications', 'sahand-core'),
            array(__CLASS__, 'render_product_specs_box'),
            'sahand_product',
            'normal',
            'high'
        );
    }

    public static function render_project_specs_box($post) {
        wp_nonce_field('sahand_save_project_specs', 'sahand_project_nonce');

        $status   = get_post_meta($post->ID, '_sahand_project_status', true) ?: 'production';
        $github   = get_post_meta($post->ID, '_sahand_project_github', true);
        $demo     = get_post_meta($post->ID, '_sahand_project_demo_url', true);
        $timeline = get_post_meta($post->ID, '_sahand_project_timeline', true);
        $problem  = get_post_meta($post->ID, '_sahand_project_problem', true);
        $solution = get_post_meta($post->ID, '_sahand_project_solution', true);
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label for="sahand_project_status"><strong><?php esc_html_e('Project Status:', 'sahand-core'); ?></strong></label><br>
            <select name="sahand_project_status" id="sahand_project_status" style="width: 100%;">
              <option value="concept" <?php selected($status, 'concept'); ?>><?php esc_html_e('Concept / Research', 'sahand-core'); ?></option>
              <option value="in_progress" <?php selected($status, 'in_progress'); ?>><?php esc_html_e('Active Development', 'sahand-core'); ?></option>
              <option value="production" <?php selected($status, 'production'); ?>><?php esc_html_e('Production / Live', 'sahand-core'); ?></option>
              <option value="archived" <?php selected($status, 'archived'); ?>><?php esc_html_e('Archived', 'sahand-core'); ?></option>
            </select>
          </div>
          <div>
            <label for="sahand_project_timeline"><strong><?php esc_html_e('Timeline:', 'sahand-core'); ?></strong></label><br>
            <input type="text" name="sahand_project_timeline" id="sahand_project_timeline" value="<?php echo esc_attr($timeline); ?>" placeholder="e.g. Q1 2026 - Q3 2026" style="width: 100%;">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label for="sahand_project_github"><strong><?php esc_html_e('GitHub Repository URL:', 'sahand-core'); ?></strong></label><br>
            <input type="url" name="sahand_project_github" id="sahand_project_github" value="<?php echo esc_url($github); ?>" placeholder="https://github.com/..." style="width: 100%;">
          </div>
          <div>
            <label for="sahand_project_demo_url"><strong><?php esc_html_e('Live Demo / Staging URL:', 'sahand-core'); ?></strong></label><br>
            <input type="url" name="sahand_project_demo_url" id="sahand_project_demo_url" value="<?php echo esc_url($demo); ?>" placeholder="https://..." style="width: 100%;">
          </div>
        </div>

        <div style="margin-bottom: 1rem;">
          <label for="sahand_project_problem"><strong><?php esc_html_e('Problem Definition / Technical Challenge:', 'sahand-core'); ?></strong></label><br>
          <textarea name="sahand_project_problem" id="sahand_project_problem" rows="3" style="width: 100%;"><?php echo esc_textarea($problem); ?></textarea>
        </div>

        <div>
          <label for="sahand_project_solution"><strong><?php esc_html_e('Architectural Solution & Engineering Implementation:', 'sahand-core'); ?></strong></label><br>
          <textarea name="sahand_project_solution" id="sahand_project_solution" rows="3" style="width: 100%;"><?php echo esc_textarea($solution); ?></textarea>
        </div>
        <?php
    }

    public static function render_product_specs_box($post) {
        wp_nonce_field('sahand_save_product_specs', 'sahand_product_nonce');

        $version   = get_post_meta($post->ID, '_sahand_product_version', true) ?: '1.0.0';
        $status    = get_post_meta($post->ID, '_sahand_product_status', true) ?: 'stable';
        $download  = get_post_meta($post->ID, '_sahand_product_download_url', true);
        $changelog = get_post_meta($post->ID, '_sahand_product_changelog', true);
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label for="sahand_product_version"><strong><?php esc_html_e('SemVer Version:', 'sahand-core'); ?></strong></label><br>
            <input type="text" name="sahand_product_version" id="sahand_product_version" value="<?php echo esc_attr($version); ?>" placeholder="1.0.0" style="width: 100%;">
          </div>
          <div>
            <label for="sahand_product_status"><strong><?php esc_html_e('Release Status:', 'sahand-core'); ?></strong></label><br>
            <select name="sahand_product_status" id="sahand_product_status" style="width: 100%;">
              <option value="alpha" <?php selected($status, 'alpha'); ?>><?php esc_html_e('Alpha', 'sahand-core'); ?></option>
              <option value="beta" <?php selected($status, 'beta'); ?>><?php esc_html_e('Beta', 'sahand-core'); ?></option>
              <option value="stable" <?php selected($status, 'stable'); ?>><?php esc_html_e('Stable / Production', 'sahand-core'); ?></option>
            </select>
          </div>
        </div>

        <div style="margin-bottom: 1rem;">
          <label for="sahand_product_download_url"><strong><?php esc_html_e('Download / Access URL:', 'sahand-core'); ?></strong></label><br>
          <input type="url" name="sahand_product_download_url" id="sahand_product_download_url" value="<?php echo esc_url($download); ?>" placeholder="https://..." style="width: 100%;">
        </div>

        <div>
          <label for="sahand_product_changelog"><strong><?php esc_html_e('Changelog & Release Notes:', 'sahand-core'); ?></strong></label><br>
          <textarea name="sahand_product_changelog" id="sahand_product_changelog" rows="4" style="width: 100%;"><?php echo esc_textarea($changelog); ?></textarea>
        </div>
        <?php
    }

    public static function save_project_meta($post_id) {
        if (!Sahand_Security::verify_authorized_action('sahand_project_nonce', 'sahand_save_project_specs', 'edit_post')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (isset($_POST['sahand_project_status'])) {
            $allowed_statuses = array('concept', 'in_progress', 'production', 'archived');
            $status = sanitize_text_field(wp_unslash($_POST['sahand_project_status']));
            if (in_array($status, $allowed_statuses, true)) {
                update_post_meta($post_id, '_sahand_project_status', $status);
            }
        }

        if (isset($_POST['sahand_project_timeline'])) {
            update_post_meta($post_id, '_sahand_project_timeline', sanitize_text_field(wp_unslash($_POST['sahand_project_timeline'])));
        }

        if (isset($_POST['sahand_project_github'])) {
            update_post_meta($post_id, '_sahand_project_github', esc_url_raw(wp_unslash($_POST['sahand_project_github'])));
        }

        if (isset($_POST['sahand_project_demo_url'])) {
            update_post_meta($post_id, '_sahand_project_demo_url', esc_url_raw(wp_unslash($_POST['sahand_project_demo_url'])));
        }

        if (isset($_POST['sahand_project_problem'])) {
            update_post_meta($post_id, '_sahand_project_problem', sanitize_textarea_field(wp_unslash($_POST['sahand_project_problem'])));
        }

        if (isset($_POST['sahand_project_solution'])) {
            update_post_meta($post_id, '_sahand_project_solution', sanitize_textarea_field(wp_unslash($_POST['sahand_project_solution'])));
        }
    }

    public static function save_product_meta($post_id) {
        if (!Sahand_Security::verify_authorized_action('sahand_product_nonce', 'sahand_save_product_specs', 'edit_post')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (isset($_POST['sahand_product_version'])) {
            $version = Sahand_Security::sanitize_semver(wp_unslash($_POST['sahand_product_version']));
            update_post_meta($post_id, '_sahand_product_version', $version);
        }

        if (isset($_POST['sahand_product_status'])) {
            $status = sanitize_text_field(wp_unslash($_POST['sahand_product_status']));
            if (in_array($status, array('alpha', 'beta', 'stable'), true)) {
                update_post_meta($post_id, '_sahand_product_status', $status);
            }
        }

        if (isset($_POST['sahand_product_download_url'])) {
            update_post_meta($post_id, '_sahand_product_download_url', esc_url_raw(wp_unslash($_POST['sahand_product_download_url'])));
        }

        if (isset($_POST['sahand_product_changelog'])) {
            update_post_meta($post_id, '_sahand_product_changelog', sanitize_textarea_field(wp_unslash($_POST['sahand_product_changelog'])));
        }
    }
}
