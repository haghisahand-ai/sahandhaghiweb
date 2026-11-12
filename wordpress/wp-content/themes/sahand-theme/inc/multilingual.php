<?php
/**
 * Multilingual Architecture Helpers (Polylang Integration)
 *
 * @package SahandTheme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Returns current language code ('fa', 'en', 'tr') with safe fallback.
 */
function sahand_get_current_lang() {
    if (function_exists('pll_current_language')) {
        $language = pll_current_language('slug');
        if (in_array($language, array('fa', 'en', 'tr'), true)) {
            return $language;
        }
    }

    return 'fa';
}

/**
 * Determines whether the current request is the unlocalized site root.
 *
 * The intro portal belongs only on the bare WordPress front-page URL.
 * A language-prefixed front page (for example /en/) must never be mistaken
 * for the root portal, even when the Polylang cookie is absent or stale.
 */
function sahand_is_root_intro_request() {
    if (!is_front_page() || is_admin() || isset($_GET['lang'])) {
        return false;
    }

    $home_path = wp_parse_url(home_url('/'), PHP_URL_PATH);
    $request_path = isset($_SERVER['REQUEST_URI'])
        ? wp_parse_url(wp_unslash($_SERVER['REQUEST_URI']), PHP_URL_PATH)
        : '';

    if (!is_string($home_path) || !is_string($request_path)) {
        return false;
    }

    $normalize_path = static function ($path) {
        $path = '/' . ltrim($path, '/');
        $path = untrailingslashit($path);
        return '' === $path ? '/' : $path;
    };

    return $normalize_path($request_path) === $normalize_path($home_path);
}

/**
 * Renders the accessible trilingual switcher component.
 */
function sahand_render_language_switcher() {
    $current_lang = sahand_get_current_lang();

    $languages = array(
        'fa' => array('label' => 'فا', 'name' => 'فارسی'),
        'en' => array('label' => 'EN', 'name' => 'English'),
        'tr' => array('label' => 'TR', 'name' => 'Türkçe'),
    );

    echo '<div class="lang-switcher" role="navigation" aria-label="' . esc_attr__('Language Switcher', 'sahand-theme') . '">';

    foreach ($languages as $code => $data) {
        $is_current = ($current_lang === $code);
        $active_class = $is_current ? ' current-lang' : '';
        $aria_current = $is_current ? ' aria-current="true"' : '';

        $target_url = home_url('/' . $code . '/');
        if (function_exists('pll_the_languages')) {
            $translations = pll_the_languages(array('raw' => 1));
            if (!empty($translations[$code]['url'])) {
                $target_url = $translations[$code]['url'];
            }
        }

        echo '<a href="' . esc_url($target_url) . '" class="lang-btn' . esc_attr($active_class) . '"' . $aria_current . ' hreflang="' . esc_attr($code) . '" title="' . esc_attr($data['name']) . '">';
        echo esc_html($data['label']);
        echo '</a>';
    }

    echo '</div>';
}

/**
 * Inject hreflang tags for pages with real translations.
 */
function sahand_output_hreflang_tags() {
    if (is_singular(array('sahand_project', 'sahand_product', 'sahand_ai_tool', 'sahand_insight'))) {
        return;
    }

    if (!is_singular() && !is_front_page()) {
        return;
    }

    if (function_exists('pll_the_languages')) {
        $translations = pll_the_languages(array('raw' => 1));
        if (is_array($translations)) {
            foreach ($translations as $language) {
                if (!empty($language['slug']) && !empty($language['url'])) {
                    echo '<link rel="alternate" hreflang="' . esc_attr($language['slug']) . '" href="' . esc_url($language['url']) . '" />' . "\n";
                }
            }
            return;
        }
    }

    // Without a multilingual plugin, do not publish fictitious language alternates.
}
add_action('wp_head', 'sahand_output_hreflang_tags', 2);
