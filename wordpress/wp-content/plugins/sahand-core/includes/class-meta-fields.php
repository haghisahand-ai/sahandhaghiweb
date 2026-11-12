<?php
/**
 * Custom Meta Boxes & Fields Management for All Custom Post Types
 *
 * @package SahandCore
 */

if (!defined('ABSPATH')) {
    exit;
}

class Sahand_Meta_Fields {

    public static function init() {
        add_action('add_meta_boxes', array(__CLASS__, 'add_meta_boxes'));
        add_action('save_post_sahand_project', array(__CLASS__, 'save_project_meta'), 10, 1);
        add_action('save_post_sahand_product', array(__CLASS__, 'save_product_meta'), 10, 1);
        add_action('save_post_sahand_ai_tool', array(__CLASS__, 'save_ai_tool_meta'), 10, 1);
        add_action('save_post_sahand_insight', array(__CLASS__, 'save_insight_meta'), 10, 1);
    }

    public static function add_meta_boxes() {
        // 1. Project Specifications
        add_meta_box(
            'sahand_project_specs',
            __('Project Engineering Specifications', 'sahand-core'),
            array(__CLASS__, 'render_project_specs_box'),
            'sahand_project',
            'normal',
            'high'
        );

        // 2. Product Release Specifications
        add_meta_box(
            'sahand_product_specs',
            __('Launchpad Release Specifications', 'sahand-core'),
            array(__CLASS__, 'render_product_specs_box'),
            'sahand_product',
            'normal',
            'high'
        );

        // 3. AI Tool Architecture & Metrics
        add_meta_box(
            'sahand_ai_tool_specs',
            __('AI Tool Architecture & Model Metrics', 'sahand-core'),
            array(__CLASS__, 'render_ai_tool_specs_box'),
            'sahand_ai_tool',
            'normal',
            'high'
        );

        // 4. Insight Editorial & Research Metadata
        add_meta_box(
            'sahand_insight_specs',
            __('Research Insight & Academic Metadata', 'sahand-core'),
            array(__CLASS__, 'render_insight_specs_box'),
            'sahand_insight',
            'normal',
            'high'
        );
    }

    /**
     * Render Project Specs Meta Box
     */
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

    /**
     * Render Launchpad Product Specs Meta Box
     */
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

    /**
     * Render AI Tool Specs Meta Box
     */
    public static function render_ai_tool_specs_box($post) {
        wp_nonce_field('sahand_save_ai_tool_specs', 'sahand_ai_tool_nonce');

        $model      = get_post_meta($post->ID, '_sahand_ai_model', true) ?: 'gemini-3.8-flash';
        $task       = get_post_meta($post->ID, '_sahand_ai_task', true) ?: 'Reasoning & Inference';
        $latency    = get_post_meta($post->ID, '_sahand_ai_latency', true) ?: '45ms';
        $status     = get_post_meta($post->ID, '_sahand_ai_status', true) ?: 'active';
        $endpoint   = get_post_meta($post->ID, '_sahand_ai_endpoint', true);
        $parameters = get_post_meta($post->ID, '_sahand_ai_parameters', true);
        $demo_url   = get_post_meta($post->ID, '_sahand_ai_demo_url', true);
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label for="sahand_ai_model"><strong><?php esc_html_e('Model Architecture:', 'sahand-core'); ?></strong></label><br>
            <input type="text" name="sahand_ai_model" id="sahand_ai_model" value="<?php echo esc_attr($model); ?>" placeholder="e.g. gemini-3.8-flash" style="width: 100%;">
          </div>
          <div>
            <label for="sahand_ai_task"><strong><?php esc_html_e('Specialized Task / Modality:', 'sahand-core'); ?></strong></label><br>
            <input type="text" name="sahand_ai_task" id="sahand_ai_task" value="<?php echo esc_attr($task); ?>" placeholder="e.g. Algorithmic Order Routing" style="width: 100%;">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label for="sahand_ai_latency"><strong><?php esc_html_e('Inference Latency:', 'sahand-core'); ?></strong></label><br>
            <input type="text" name="sahand_ai_latency" id="sahand_ai_latency" value="<?php echo esc_attr($latency); ?>" placeholder="e.g. 35ms p95" style="width: 100%;">
          </div>
          <div>
            <label for="sahand_ai_parameters"><strong><?php esc_html_e('Parameters / Context:', 'sahand-core'); ?></strong></label><br>
            <input type="text" name="sahand_ai_parameters" id="sahand_ai_parameters" value="<?php echo esc_attr($parameters); ?>" placeholder="e.g. 1M Context Window" style="width: 100%;">
          </div>
          <div>
            <label for="sahand_ai_status"><strong><?php esc_html_e('Operational Status:', 'sahand-core'); ?></strong></label><br>
            <select name="sahand_ai_status" id="sahand_ai_status" style="width: 100%;">
              <option value="research" <?php selected($status, 'research'); ?>><?php esc_html_e('Research / Experimental', 'sahand-core'); ?></option>
              <option value="active" <?php selected($status, 'active'); ?>><?php esc_html_e('Active Production', 'sahand-core'); ?></option>
              <option value="deprecated" <?php selected($status, 'deprecated'); ?>><?php esc_html_e('Deprecated', 'sahand-core'); ?></option>
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label for="sahand_ai_endpoint"><strong><?php esc_html_e('API Gateway Endpoint:', 'sahand-core'); ?></strong></label><br>
            <input type="text" name="sahand_ai_endpoint" id="sahand_ai_endpoint" value="<?php echo esc_attr($endpoint); ?>" placeholder="/wp-json/sahand/v1/ai/generate" style="width: 100%;">
          </div>
          <div>
            <label for="sahand_ai_demo_url"><strong><?php esc_html_e('Playground / Demo URL:', 'sahand-core'); ?></strong></label><br>
            <input type="url" name="sahand_ai_demo_url" id="sahand_ai_demo_url" value="<?php echo esc_url($demo_url); ?>" placeholder="https://..." style="width: 100%;">
          </div>
        </div>
        <?php
    }

    /**
     * Render Insight Specs Meta Box
     */
    public static function render_insight_specs_box($post) {
        wp_nonce_field('sahand_save_insight_specs', 'sahand_insight_nonce');

        $reading_time  = get_post_meta($post->ID, '_sahand_insight_reading_time', true) ?: '6';
        $difficulty    = get_post_meta($post->ID, '_sahand_insight_difficulty', true) ?: 'intermediate';
        $canonical_url = get_post_meta($post->ID, '_sahand_insight_canonical_url', true);
        $peer_reviewed = get_post_meta($post->ID, '_sahand_insight_peer_reviewed', true) ?: 'no';
        $key_takeaway  = get_post_meta($post->ID, '_sahand_insight_key_takeaway', true);
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label for="sahand_insight_reading_time"><strong><?php esc_html_e('Reading Time (Minutes):', 'sahand-core'); ?></strong></label><br>
            <input type="number" name="sahand_insight_reading_time" id="sahand_insight_reading_time" min="1" max="180" value="<?php echo esc_attr($reading_time); ?>" style="width: 100%;">
          </div>
          <div>
            <label for="sahand_insight_difficulty"><strong><?php esc_html_e('Technical Depth:', 'sahand-core'); ?></strong></label><br>
            <select name="sahand_insight_difficulty" id="sahand_insight_difficulty" style="width: 100%;">
              <option value="fundamental" <?php selected($difficulty, 'fundamental'); ?>><?php esc_html_e('Fundamental', 'sahand-core'); ?></option>
              <option value="intermediate" <?php selected($difficulty, 'intermediate'); ?>><?php esc_html_e('Intermediate', 'sahand-core'); ?></option>
              <option value="advanced" <?php selected($difficulty, 'advanced'); ?>><?php esc_html_e('Advanced / Architectural', 'sahand-core'); ?></option>
            </select>
          </div>
          <div>
            <label for="sahand_insight_peer_reviewed"><strong><?php esc_html_e('Peer Reviewed / Verified:', 'sahand-core'); ?></strong></label><br>
            <select name="sahand_insight_peer_reviewed" id="sahand_insight_peer_reviewed" style="width: 100%;">
              <option value="no" <?php selected($peer_reviewed, 'no'); ?>><?php esc_html_e('No', 'sahand-core'); ?></option>
              <option value="yes" <?php selected($peer_reviewed, 'yes'); ?>><?php esc_html_e('Yes', 'sahand-core'); ?></option>
            </select>
          </div>
        </div>

        <div style="margin-bottom: 1rem;">
          <label for="sahand_insight_canonical_url"><strong><?php esc_html_e('External Canonical URL (if syndicated):', 'sahand-core'); ?></strong></label><br>
          <input type="url" name="sahand_insight_canonical_url" id="sahand_insight_canonical_url" value="<?php echo esc_url($canonical_url); ?>" placeholder="https://..." style="width: 100%;">
        </div>

        <div>
          <label for="sahand_insight_key_takeaway"><strong><?php esc_html_e('Core Architectural Takeaway / Thesis:', 'sahand-core'); ?></strong></label><br>
          <textarea name="sahand_insight_key_takeaway" id="sahand_insight_key_takeaway" rows="3" style="width: 100%;"><?php echo esc_textarea($key_takeaway); ?></textarea>
        </div>
        <?php
    }

    /**
     * Save Project Meta
     */
    public static function save_project_meta($post_id) {
        if ('sahand_project' !== get_post_type($post_id) || wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        if (!Sahand_Security::verify_authorized_action('sahand_project_nonce', 'sahand_save_project_specs', 'edit_post', $post_id)) {
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

    /**
     * Save Product Meta
     */
    public static function save_product_meta($post_id) {
        if ('sahand_product' !== get_post_type($post_id) || wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        if (!Sahand_Security::verify_authorized_action('sahand_product_nonce', 'sahand_save_product_specs', 'edit_post', $post_id)) {
            return;
        }

        if (isset($_POST['sahand_product_version'])) {
            $version = Sahand_Security::sanitize_semver(wp_unslash($_POST['sahand_product_version']));
            if (preg_match('/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/', $version)) {
                update_post_meta($post_id, '_sahand_product_version', $version);
            }
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

    /**
     * Save AI Tool Meta
     */
    public static function save_ai_tool_meta($post_id) {
        if ('sahand_ai_tool' !== get_post_type($post_id) || wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        if (!Sahand_Security::verify_authorized_action('sahand_ai_tool_nonce', 'sahand_save_ai_tool_specs', 'edit_post', $post_id)) {
            return;
        }

        if (isset($_POST['sahand_ai_model'])) {
            update_post_meta($post_id, '_sahand_ai_model', sanitize_text_field(wp_unslash($_POST['sahand_ai_model'])));
        }

        if (isset($_POST['sahand_ai_task'])) {
            update_post_meta($post_id, '_sahand_ai_task', sanitize_text_field(wp_unslash($_POST['sahand_ai_task'])));
        }

        if (isset($_POST['sahand_ai_latency'])) {
            update_post_meta($post_id, '_sahand_ai_latency', sanitize_text_field(wp_unslash($_POST['sahand_ai_latency'])));
        }

        if (isset($_POST['sahand_ai_parameters'])) {
            update_post_meta($post_id, '_sahand_ai_parameters', sanitize_text_field(wp_unslash($_POST['sahand_ai_parameters'])));
        }

        if (isset($_POST['sahand_ai_status'])) {
            $status = sanitize_text_field(wp_unslash($_POST['sahand_ai_status']));
            if (in_array($status, array('research', 'active', 'deprecated'), true)) {
                update_post_meta($post_id, '_sahand_ai_status', $status);
            }
        }

        if (isset($_POST['sahand_ai_endpoint'])) {
            update_post_meta($post_id, '_sahand_ai_endpoint', sanitize_text_field(wp_unslash($_POST['sahand_ai_endpoint'])));
        }

        if (isset($_POST['sahand_ai_demo_url'])) {
            update_post_meta($post_id, '_sahand_ai_demo_url', esc_url_raw(wp_unslash($_POST['sahand_ai_demo_url'])));
        }
    }

    /**
     * Save Insight Meta
     */
    public static function save_insight_meta($post_id) {
        if ('sahand_insight' !== get_post_type($post_id) || wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        if (!Sahand_Security::verify_authorized_action('sahand_insight_nonce', 'sahand_save_insight_specs', 'edit_post', $post_id)) {
            return;
        }

        if (isset($_POST['sahand_insight_reading_time'])) {
            $reading_time = absint($_POST['sahand_insight_reading_time']);
            update_post_meta($post_id, '_sahand_insight_reading_time', $reading_time ?: 5);
        }

        if (isset($_POST['sahand_insight_difficulty'])) {
            $diff = sanitize_text_field(wp_unslash($_POST['sahand_insight_difficulty']));
            if (in_array($diff, array('fundamental', 'intermediate', 'advanced'), true)) {
                update_post_meta($post_id, '_sahand_insight_difficulty', $diff);
            }
        }

        if (isset($_POST['sahand_insight_peer_reviewed'])) {
            $peer = sanitize_text_field(wp_unslash($_POST['sahand_insight_peer_reviewed']));
            update_post_meta($post_id, '_sahand_insight_peer_reviewed', ('yes' === $peer) ? 'yes' : 'no');
        }

        if (isset($_POST['sahand_insight_canonical_url'])) {
            update_post_meta($post_id, '_sahand_insight_canonical_url', esc_url_raw(wp_unslash($_POST['sahand_insight_canonical_url'])));
        }

        if (isset($_POST['sahand_insight_key_takeaway'])) {
            update_post_meta($post_id, '_sahand_insight_key_takeaway', sanitize_textarea_field(wp_unslash($_POST['sahand_insight_key_takeaway'])));
        }
    }
}
