<?php
/**
 * Multilingual SEO & Metadata Manager for SAHAND Custom Post Types
 *
 * Handles dynamic, localized SEO meta tags (<title>, <meta name="description">,
 * canonical links, hreflang alternates, Open Graph, Twitter Cards, and Schema.org JSON-LD)
 * for each custom post type (sahand_project, sahand_product, sahand_ai_tool, sahand_insight).
 *
 * @package SahandCore
 */

if (!defined('ABSPATH')) {
    exit;
}

class Sahand_SEO_Manager {

    /**
     * Supported post types managed by the SEO engine
     */
    const MANAGED_POST_TYPES = array(
        'sahand_project',
        'sahand_product',
        'sahand_ai_tool',
        'sahand_insight',
    );

    /**
     * Language-specific configuration
     */
    private static $lang_configs = array(
        'fa' => array(
            'locale'          => 'fa_IR',
            'alternate_locales' => array('en_US', 'tr_TR'),
            'brand'           => 'سهند',
            'site_title'      => 'سهند | پلتفرم تخصصی فناوری و مهندسی سیستم‌ها',
            'default_og_image'=> 'assets/brand/sahand-logo-persian.svg',
            'project_suffix'  => 'پروژه مهندسی سهند',
            'product_suffix'  => 'سکوی محصولات سهند',
            'ai_tool_suffix'  => 'ابزار و مدل هوش مصنوعی سهند',
            'insight_suffix'  => 'دیدگاه‌ها و تحلیل‌های فنی سهند',
            'version_label'   => 'نسخه',
        ),
        'en' => array(
            'locale'          => 'en_US',
            'alternate_locales' => array('fa_IR', 'tr_TR'),
            'brand'           => 'SAHAND',
            'site_title'      => 'SAHAND | Technology & Systems Engineering Hub',
            'default_og_image'=> 'assets/brand/sahand-logo-horizontal-dark.svg',
            'project_suffix'  => 'Engineering Project | SAHAND',
            'product_suffix'  => 'Launchpad Product | SAHAND',
            'ai_tool_suffix'  => 'AI Research Tool | SAHAND',
            'insight_suffix'  => 'Technical Insights & Architecture | SAHAND',
            'version_label'   => 'v',
        ),
        'tr' => array(
            'locale'          => 'tr_TR',
            'alternate_locales' => array('fa_IR', 'en_US'),
            'brand'           => 'SAHAND',
            'site_title'      => 'SAHAND | Teknoloji ve Mühendislik Platformu',
            'default_og_image'=> 'assets/brand/sahand-logo-horizontal-dark.svg',
            'project_suffix'  => 'Mühendislik Projesi | SAHAND',
            'product_suffix'  => 'Ürün Lansmanı | SAHAND',
            'ai_tool_suffix'  => 'Yapay Zekâ Modeli | SAHAND',
            'insight_suffix'  => 'Teknik İnceleme ve Analiz | SAHAND',
            'version_label'   => 'v',
        ),
    );

    /**
     * Initialize SEO hooks
     */
    public static function init() {
        // Output SEO meta tags in <head>
        add_action('wp_head', array(__CLASS__, 'render_seo_meta'), 1);

        // Filter document title for native WP title output
        add_filter('pre_get_document_title', array(__CLASS__, 'filter_document_title'), 20);

        // Register SEO Override Meta Box in WordPress Admin
        add_action('add_meta_boxes', array(__CLASS__, 'add_seo_meta_box'));
        add_action('save_post', array(__CLASS__, 'save_seo_meta'));
    }

    /**
     * Detects current language code ('fa', 'en', 'tr') with intelligent fallbacks
     */
    public static function get_current_language($post_id = null) {
        // 1. Polylang API
        if ($post_id && function_exists('pll_get_post_language')) {
            $lang = pll_get_post_language($post_id, 'slug');
            if ($lang && in_array($lang, array('fa', 'en', 'tr'), true)) {
                return $lang;
            }
        }

        if (function_exists('pll_current_language')) {
            $lang = pll_current_language('slug');
            if ($lang && in_array($lang, array('fa', 'en', 'tr'), true)) {
                return $lang;
            }
        }

        // 2. URL Prefix Analysis (/fa/, /en/, /tr/)
        $uri = isset($_SERVER['REQUEST_URI']) ? sanitize_text_field(wp_unslash($_SERVER['REQUEST_URI'])) : '';
        if (preg_match('#^/(fa|en|tr)(/|$)#i', $uri, $matches)) {
            return strtolower($matches[1]);
        }

        // 3. Theme Helper Fallback
        if (function_exists('sahand_get_current_lang')) {
            return sahand_get_current_lang();
        }

        return 'fa';
    }

    /**
     * Core SEO data generator for any post or custom post type
     *
     * @param int|WP_Post|null $post Optional post object or ID.
     * @param string|null      $lang Optional language code ('fa', 'en', 'tr').
     * @return array Complete SEO metadata array.
     */
    public static function get_seo_data($post = null, $lang = null) {
        $post = get_post($post);
        if (!$post) {
            return array();
        }

        $post_id   = $post->ID;
        $post_type = $post->post_type;
        $lang      = $lang ?: self::get_current_language($post_id);
        $config    = self::$lang_configs[$lang] ?? self::$lang_configs['fa'];

        // Title generation
        $seo_title = get_post_meta($post_id, '_sahand_seo_title', true);
        if (empty($seo_title)) {
            $seo_title = self::generate_dynamic_title($post, $lang, $config);
        }

        // Description generation
        $seo_desc = get_post_meta($post_id, '_sahand_seo_description', true);
        if (empty($seo_desc)) {
            $seo_desc = self::generate_dynamic_description($post, $lang);
        }
        $seo_desc = self::truncate_clean($seo_desc, 155);

        // Canonical URL & Translation Hreflangs
        $canonical_url = get_permalink($post_id);
        $hreflangs     = self::get_post_translations($post_id, $lang);

        // Image Resolution
        $og_image = get_post_meta($post_id, '_sahand_seo_og_image', true);
        if (empty($og_image) && has_post_thumbnail($post_id)) {
            $thumbnail_src = wp_get_attachment_image_src(get_post_thumbnail_id($post_id), 'large');
            if (!empty($thumbnail_src[0])) {
                $og_image = $thumbnail_src[0];
            }
        }
        if (empty($og_image)) {
            $og_image = home_url('/' . $config['default_og_image']);
        }

        // Robots directive
        $is_noindex = (bool) get_post_meta($post_id, '_sahand_seo_noindex', true);
        $robots     = $is_noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large';

        // Open Graph Type
        $og_type = 'website';
        if ($post_type === 'sahand_insight') {
            $og_type = 'article';
        } elseif ($post_type === 'sahand_product') {
            $og_type = 'product';
        }

        // Schema.org JSON-LD
        $schema = self::generate_schema_json_ld($post, $canonical_url, $og_image, $seo_title, $seo_desc, $lang);

        return array(
            'post_id'           => $post_id,
            'post_type'         => $post_type,
            'lang'              => $lang,
            'locale'            => $config['locale'],
            'alternate_locales' => $config['alternate_locales'],
            'title'             => $seo_title,
            'description'       => $seo_desc,
            'canonical_url'     => $canonical_url,
            'hreflangs'         => $hreflangs,
            'og_type'           => $og_type,
            'og_title'          => $seo_title,
            'og_description'    => $seo_desc,
            'og_url'            => $canonical_url,
            'og_image'          => $og_image,
            'og_site_name'      => $config['site_title'],
            'twitter_card'      => 'summary_large_image',
            'twitter_title'     => $seo_title,
            'twitter_description'=> $seo_desc,
            'twitter_image'     => $og_image,
            'robots'            => $robots,
            'schema_json_ld'    => $schema,
        );
    }

    /**
     * Generates a tailored, dynamic title for each custom post type
     */
    private static function generate_dynamic_title($post, $lang, $config) {
        $raw_title = get_the_title($post);

        switch ($post->post_type) {
            case 'sahand_project':
                if ($lang === 'fa') {
                    return $raw_title . ' | ' . $config['project_suffix'];
                }
                return $raw_title . ' — ' . $config['project_suffix'];

            case 'sahand_product':
                $version = get_post_meta($post->ID, '_sahand_product_version', true);
                $version_str = $version ? ' ' . $config['version_label'] . $version : '';
                if ($lang === 'fa') {
                    return $raw_title . $version_str . ' | ' . $config['product_suffix'];
                }
                return $raw_title . $version_str . ' — ' . $config['product_suffix'];

            case 'sahand_ai_tool':
                if ($lang === 'fa') {
                    return $raw_title . ' | ' . $config['ai_tool_suffix'];
                }
                return $raw_title . ' — ' . $config['ai_tool_suffix'];

            case 'sahand_insight':
                if ($lang === 'fa') {
                    return $raw_title . ' | ' . $config['insight_suffix'];
                }
                return $raw_title . ' — ' . $config['insight_suffix'];

            default:
                return $raw_title . ' | ' . $config['brand'];
        }
    }

    /**
     * Generates a compelling, high-CTR meta description based on post type specs
     */
    private static function generate_dynamic_description($post, $lang) {
        $post_id   = $post->ID;
        $post_type = $post->post_type;

        if ($post_type === 'sahand_project') {
            $problem  = get_post_meta($post_id, '_sahand_project_problem', true);
            $solution = get_post_meta($post_id, '_sahand_project_solution', true);
            if (!empty($problem) || !empty($solution)) {
                $parts = array_filter(array($problem, $solution));
                return implode(' — ', $parts);
            }
        } elseif ($post_type === 'sahand_product') {
            $version = get_post_meta($post_id, '_sahand_product_version', true);
            $status  = get_post_meta($post_id, '_sahand_product_status', true);
            $excerpt = !empty($post->post_excerpt) ? $post->post_excerpt : wp_strip_all_tags($post->post_content);
            if ($version) {
                $status_tag = $status ? ' [' . strtoupper($status) . ']' : '';
                $prefix = ($lang === 'fa') ? 'نگارش ' . $version . $status_tag . ': ' : 'Release v' . $version . $status_tag . ': ';
                return $prefix . $excerpt;
            }
        }

        if (!empty($post->post_excerpt)) {
            return $post->post_excerpt;
        }

        if (!empty($post->post_content)) {
            return wp_strip_all_tags($post->post_content);
        }

        // Generic fallback
        if ($lang === 'fa') {
            return 'مستندات و مشخصات فنی ' . get_the_title($post) . ' در پلتفرم مهندسی و فناوری سهند.';
        } elseif ($lang === 'tr') {
            return 'SAHAND platformunda ' . get_the_title($post) . ' projesine ait teknik dökümantasyon ve analiz.';
        }
        return 'Technical documentation and architectural specifications for ' . get_the_title($post) . ' on SAHAND.';
    }

    /**
     * Generates Schema.org JSON-LD structured data
     */
    private static function generate_schema_json_ld($post, $url, $og_image, $title, $description, $lang) {
        $in_language = ($lang === 'fa') ? 'fa-IR' : (($lang === 'tr') ? 'tr-TR' : 'en-US');

        $base = array(
            '@context'         => 'https://schema.org',
            'inLanguage'       => $in_language,
            'mainEntityOfPage' => $url,
            'publisher'        => array(
                '@type' => 'Organization',
                'name'  => 'SAHAND',
                'url'   => 'https://sahandhaghi.site',
                'logo'  => array(
                    '@type' => 'ImageObject',
                    'url'   => 'https://sahandhaghi.site/assets/brand/sahand-emblem-color.svg',
                ),
            ),
        );

        switch ($post->post_type) {
            case 'sahand_project':
                $github = get_post_meta($post->ID, '_sahand_project_github', true);
                return array_merge($base, array(
                    '@type'               => 'SoftwareSourceCode',
                    'name'                => $title,
                    'description'         => $description,
                    'codeRepository'      => $github ?: null,
                    'programmingLanguage' => 'Python / PHP / TypeScript',
                    'author'              => array(
                        '@type' => 'Person',
                        'name'  => 'Sahand Haghi',
                        'url'   => 'https://sahandhaghi.site',
                    ),
                ));

            case 'sahand_product':
                $version = get_post_meta($post->ID, '_sahand_product_version', true) ?: '1.0.0';
                return array_merge($base, array(
                    '@type'               => 'SoftwareApplication',
                    'name'                => $title,
                    'description'         => $description,
                    'softwareVersion'     => $version,
                    'applicationCategory' => 'DeveloperApplication',
                    'operatingSystem'     => 'Cross-platform / Web / Linux',
                    'image'               => $og_image,
                    'offers'              => array(
                        '@type'         => 'Offer',
                        'price'         => '0',
                        'priceCurrency' => 'USD',
                    ),
                ));

            case 'sahand_ai_tool':
                return array_merge($base, array(
                    '@type'               => 'WebApplication',
                    'name'                => $title,
                    'description'         => $description,
                    'applicationCategory' => 'ArtificialIntelligenceApplication',
                    'image'               => $og_image,
                ));

            case 'sahand_insight':
                return array_merge($base, array(
                    '@type'         => 'TechArticle',
                    'headline'      => $title,
                    'description'   => $description,
                    'image'         => $og_image,
                    'datePublished' => get_the_date('c', $post),
                    'dateModified'  => get_the_modified_date('c', $post),
                    'author'        => array(
                        '@type' => 'Person',
                        'name'  => 'Sahand Haghi',
                        'url'   => 'https://sahandhaghi.site',
                    ),
                ));

            default:
                return array_merge($base, array(
                    '@type'       => 'WebPage',
                    'name'        => $title,
                    'description' => $description,
                ));
        }
    }

    /**
     * Resolves localized alternate URLs (hreflang) across all 3 languages
     */
    private static function get_post_translations($post_id, $current_lang) {
        $langs = array('fa', 'en', 'tr');
        $hreflangs = array();

        if (function_exists('pll_get_post')) {
            foreach ($langs as $lang) {
                $translated_id = pll_get_post($post_id, $lang);
                if ($translated_id) {
                    $hreflangs[$lang] = get_permalink($translated_id);
                }
            }
        }

        // Fallback: build canonical localized path
        if (empty($hreflangs)) {
            $post = get_post($post_id);
            $slug = $post ? $post->post_name : '';
            $cpt_slugs = array(
                'sahand_project' => 'projects',
                'sahand_product' => 'launchpad',
                'sahand_ai_tool' => 'ai-lab',
                'sahand_insight' => 'insights',
            );
            $type_slug = $cpt_slugs[$post->post_type] ?? 'item';

            foreach ($langs as $lang) {
                $hreflangs[$lang] = home_url('/' . $lang . '/' . $type_slug . '/' . $slug . '/');
            }
        }

        return $hreflangs;
    }

    /**
     * Outputs all SEO, Open Graph, Twitter, and JSON-LD tags into the HTML <head>
     */
    public static function render_seo_meta() {
        if (!is_singular(self::MANAGED_POST_TYPES)) {
            return;
        }

        $data = self::get_seo_data(get_the_ID());
        if (empty($data)) {
            return;
        }

        echo "\n<!-- SAHAND Dynamic Multilingual SEO Engine -->\n";
        echo '<meta name="description" content="' . esc_attr($data['description']) . '" />' . "\n";
        echo '<meta name="robots" content="' . esc_attr($data['robots']) . '" />' . "\n";
        echo '<link rel="canonical" href="' . esc_url($data['canonical_url']) . '" />' . "\n";

        // Multilingual hreflang alternates
        if (!empty($data['hreflangs'])) {
            foreach ($data['hreflangs'] as $code => $url) {
                echo '<link rel="alternate" hreflang="' . esc_attr($code) . '" href="' . esc_url($url) . '" />' . "\n";
            }
            if (isset($data['hreflangs']['fa'])) {
                echo '<link rel="alternate" hreflang="x-default" href="' . esc_url($data['hreflangs']['fa']) . '" />' . "\n";
            }
        }

        // Open Graph Meta Tags
        echo '<meta property="og:locale" content="' . esc_attr($data['locale']) . '" />' . "\n";
        if (!empty($data['alternate_locales'])) {
            foreach ($data['alternate_locales'] as $alt) {
                echo '<meta property="og:locale:alternate" content="' . esc_attr($alt) . '" />' . "\n";
            }
        }
        echo '<meta property="og:type" content="' . esc_attr($data['og_type']) . '" />' . "\n";
        echo '<meta property="og:title" content="' . esc_attr($data['og_title']) . '" />' . "\n";
        echo '<meta property="og:description" content="' . esc_attr($data['og_description']) . '" />' . "\n";
        echo '<meta property="og:url" content="' . esc_url($data['og_url']) . '" />' . "\n";
        echo '<meta property="og:site_name" content="' . esc_attr($data['og_site_name']) . '" />' . "\n";
        if (!empty($data['og_image'])) {
            echo '<meta property="og:image" content="' . esc_url($data['og_image']) . '" />' . "\n";
        }

        // Twitter Card Meta Tags
        echo '<meta name="twitter:card" content="' . esc_attr($data['twitter_card']) . '" />' . "\n";
        echo '<meta name="twitter:title" content="' . esc_attr($data['twitter_title']) . '" />' . "\n";
        echo '<meta name="twitter:description" content="' . esc_attr($data['twitter_description']) . '" />' . "\n";
        if (!empty($data['twitter_image'])) {
            echo '<meta name="twitter:image" content="' . esc_url($data['twitter_image']) . '" />' . "\n";
        }

        // Schema.org Structured Data (JSON-LD)
        if (!empty($data['schema_json_ld'])) {
            $json = wp_json_encode($data['schema_json_ld'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            echo '<script type="application/ld+json">' . "\n" . $json . "\n" . '</script>' . "\n";
        }
        echo "<!-- /SAHAND Dynamic Multilingual SEO Engine -->\n\n";
    }

    /**
     * Intercepts WordPress's document title filter
     */
    public static function filter_document_title($title) {
        if (is_singular(self::MANAGED_POST_TYPES)) {
            $data = self::get_seo_data(get_the_ID());
            if (!empty($data['title'])) {
                return $data['title'];
            }
        }
        return $title;
    }

    /**
     * Truncates text cleanly at word boundaries
     */
    public static function truncate_clean($text, $max_length = 155) {
        $text = wp_strip_all_tags($text);
        $text = preg_replace('/\s+/', ' ', trim($text));
        if (mb_strlen($text, 'UTF-8') <= $max_length) {
            return $text;
        }

        $substr = mb_substr($text, 0, $max_length, 'UTF-8');
        $last_space = mb_strrpos($substr, ' ', 0, 'UTF-8');
        if ($last_space !== false) {
            $substr = mb_substr($substr, 0, $last_space, 'UTF-8');
        }

        return trim($substr) . '...';
    }

    /**
     * Adds SEO Overrides Meta Box in WordPress Admin
     */
    public static function add_seo_meta_box() {
        foreach (self::MANAGED_POST_TYPES as $post_type) {
            add_meta_box(
                'sahand_seo_settings',
                __('SAHAND Multilingual SEO Settings & Overrides', 'sahand-core'),
                array(__CLASS__, 'render_seo_meta_box'),
                $post_type,
                'normal',
                'low'
            );
        }
    }

    /**
     * Renders the SEO Meta Box fields in the post editor
     */
    public static function render_seo_meta_box($post) {
        wp_nonce_field('sahand_save_seo_meta', 'sahand_seo_nonce');

        $seo_title = get_post_meta($post->ID, '_sahand_seo_title', true);
        $seo_desc  = get_post_meta($post->ID, '_sahand_seo_description', true);
        $seo_image = get_post_meta($post->ID, '_sahand_seo_og_image', true);
        $noindex   = (bool) get_post_meta($post->ID, '_sahand_seo_noindex', true);

        // Preview generated defaults
        $data = self::get_seo_data($post->ID);
        ?>
        <div style="font-size: 13px;">
          <p class="description" style="margin-bottom: 1rem;">
            <?php esc_html_e('Configure custom multilingual SEO metadata. Leave blank to automatically generate optimal high-ranking titles and descriptions from the post specifications and target language.', 'sahand-core'); ?>
          </p>

          <div style="margin-bottom: 1rem;">
            <label for="sahand_seo_title"><strong><?php esc_html_e('Custom SEO Title Override:', 'sahand-core'); ?></strong></label><br>
            <input type="text" name="sahand_seo_title" id="sahand_seo_title" value="<?php echo esc_attr($seo_title); ?>" placeholder="<?php echo esc_attr($data['title'] ?? ''); ?>" style="width: 100%; margin-top: 4px;">
            <small style="color: #666;"><?php esc_html_e('Recommended length: 45–60 characters.', 'sahand-core'); ?></small>
          </div>

          <div style="margin-bottom: 1rem;">
            <label for="sahand_seo_description"><strong><?php esc_html_e('Custom Meta Description Override:', 'sahand-core'); ?></strong></label><br>
            <textarea name="sahand_seo_description" id="sahand_seo_description" rows="3" style="width: 100%; margin-top: 4px;" placeholder="<?php echo esc_attr($data['description'] ?? ''); ?>"><?php echo esc_textarea($seo_desc); ?></textarea>
            <small style="color: #666;"><?php esc_html_e('Recommended length: 120–155 characters.', 'sahand-core'); ?></small>
          </div>

          <div style="margin-bottom: 1rem;">
            <label for="sahand_seo_og_image"><strong><?php esc_html_e('Custom Social Share Image URL (Open Graph / Twitter):', 'sahand-core'); ?></strong></label><br>
            <input type="url" name="sahand_seo_og_image" id="sahand_seo_og_image" value="<?php echo esc_url($seo_image); ?>" placeholder="https://..." style="width: 100%; margin-top: 4px;">
          </div>

          <div>
            <label>
              <input type="checkbox" name="sahand_seo_noindex" value="1" <?php checked($noindex, true); ?>>
              <strong><?php esc_html_e('Discourage Search Engines from indexing this post (noindex, nofollow)', 'sahand-core'); ?></strong>
            </label>
          </div>
        </div>
        <?php
    }

    /**
     * Saves custom SEO fields with authorization and nonce checks
     */
    public static function save_seo_meta($post_id) {
        if (!Sahand_Security::verify_authorized_action('sahand_seo_nonce', 'sahand_save_seo_meta', 'edit_post')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (isset($_POST['sahand_seo_title'])) {
            update_post_meta($post_id, '_sahand_seo_title', sanitize_text_field(wp_unslash($_POST['sahand_seo_title'])));
        }

        if (isset($_POST['sahand_seo_description'])) {
            update_post_meta($post_id, '_sahand_seo_description', sanitize_textarea_field(wp_unslash($_POST['sahand_seo_description'])));
        }

        if (isset($_POST['sahand_seo_og_image'])) {
            update_post_meta($post_id, '_sahand_seo_og_image', esc_url_raw(wp_unslash($_POST['sahand_seo_og_image'])));
        }

        $noindex = isset($_POST['sahand_seo_noindex']) ? 1 : 0;
        update_post_meta($post_id, '_sahand_seo_noindex', $noindex);
    }
}

/**
 * Public Helper Function: Retrieve structured SEO data array for any CPT post
 *
 * @param int|WP_Post|null $post_id Post ID or WP_Post instance.
 * @param string|null      $lang    Optional language code ('fa', 'en', 'tr').
 * @return array
 */
function sahand_core_get_seo_data($post_id = null, $lang = null) {
    return Sahand_SEO_Manager::get_seo_data($post_id, $lang);
}

/**
 * Public Helper Function: Renders and outputs all SEO meta tags directly
 */
function sahand_core_render_seo_meta() {
    Sahand_SEO_Manager::render_seo_meta();
}
