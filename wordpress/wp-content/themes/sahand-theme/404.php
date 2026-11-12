<?php
/**
 * Not Found template.
 *
 * @package SahandTheme
 */
if (!defined('ABSPATH')) {
    exit;
}
get_header();
?>
<main id="primary" class="site-main error-404">
  <div class="sahand-container sahand-container-narrow" style="padding-block:clamp(5rem,12vw,9rem);text-align:center;">
    <p class="badge badge-tech">ERROR 404</p>
    <h1 style="font-size:clamp(2.5rem,7vw,5rem);margin:1rem 0;"><?php esc_html_e('Page not found', 'sahand-theme'); ?></h1>
    <p style="color:var(--color-text-secondary);"><?php esc_html_e('The requested page may have moved or is not available.', 'sahand-theme'); ?></p>
    <p style="margin-top:2rem;"><a class="badge badge-stable" href="<?php echo esc_url(home_url('/')); ?>"><?php esc_html_e('Return to SAHAND', 'sahand-theme'); ?> →</a></p>
    <?php get_search_form(); ?>
  </div>
</main>
<?php get_footer(); ?>
