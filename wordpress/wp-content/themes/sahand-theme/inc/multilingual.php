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
 * Returns current language code ('fa', 'en', 'tr') with safe fallback
 */
function sahand_get_current_lang() {
    if (function_exists('pll_current_language')) {
        return pll_current_language('slug') ?: 'fa';
    }
    return 'fa';
}

/**
 * Renders the accessible trilingual switcher component
 */
function sahand_render_language_switcher() {
    $current_lang = sahand_get_current_lang();

    $languages = array(
        'fa' => array('slug' => 'fa', 'label' => 'فا', 'name' => 'فارسی', 'dir' => 'rtl'),
        'en' => array('slug' => 'en', 'label' => 'EN', 'name' => 'English', 'dir' => 'ltr'),
        'tr' => array('slug' => 'tr', 'label' => 'TR', 'name' => 'Türkçe', 'dir' => 'ltr'),
    );

    echo '<div class="lang-switcher" role="navigation" aria-label="' . esc_attr__('Language Switcher', 'sahand-theme') . '">';

    foreach ($languages as $code => $data) {
        $is_current = ($current_lang === $code);
        $active_class = $is_current ? ' current-lang' : '';
        $aria_current = $is_current ? ' aria-current="true"' : '';

        // Get translated URL if Polylang is active, or build canonical route
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
 * Injects canonical hreflang tags into <head> for trilingual SEO
 */
function sahand_output_hreflang_tags() {
    // Avoid duplicates on CPT pages managed by sahand-core SEO engine
    if (is_singular(array('sahand_project', 'sahand_product', 'sahand_ai_tool', 'sahand_insight'))) {
        return;
    }

    if (!is_singular() && !is_front_page()) {
        return;
    }

    $langs = array('fa', 'en', 'tr');
    foreach ($langs as $lang) {
        $url = home_url('/' . $lang . '/');
        echo '<link rel="alternate" hreflang="' . esc_attr($lang) . '" href="' . esc_url($url) . '" />' . "\n";
    }
    echo '<link rel="alternate" hreflang="x-default" href="' . esc_url(home_url('/fa/')) . '" />' . "\n";
}
add_action('wp_head', 'sahand_output_hreflang_tags', 2);
