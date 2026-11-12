<?php
/**
 * Standard page template.
 *
 * @package SahandTheme
 */
if (!defined('ABSPATH')) {
    exit;
}
get_header();
?>
<main id="primary" class="site-main page-template">
  <div class="sahand-container" style="padding-block:clamp(3rem,7vw,6rem);">
    <?php while (have_posts()) : the_post(); ?>
      <article id="page-<?php the_ID(); ?>" <?php post_class('sahand-page-content'); ?>>
        <header class="entry-header" style="max-width:900px;margin:0 auto 2.5rem;">
          <p class="badge badge-tech"><?php esc_html_e('SAHAND / KNOWLEDGE HUB', 'sahand-theme'); ?></p>
          <h1 class="entry-title" style="font-size:clamp(2.25rem,5vw,4rem);line-height:1.12;margin-top:1rem;"><?php the_title(); ?></h1>
          <?php if (has_excerpt()) : ?>
            <p class="entry-summary" style="font-size:1.15rem;color:var(--color-text-secondary);margin-top:1rem;"><?php echo esc_html(get_the_excerpt()); ?></p>
          <?php endif; ?>
        </header>
        <?php if (has_post_thumbnail()) : ?>
          <div class="page-featured-image" style="max-width:1100px;margin:0 auto 2rem;">
            <?php the_post_thumbnail('large', array('style' => 'width:100%;height:auto;border-radius:12px;')); ?>
          </div>
        <?php endif; ?>
        <div class="entry-content sahand-container-narrow" style="line-height:1.9;">
          <?php the_content(); ?>
          <?php wp_link_pages(array('before' => '<nav class="page-links">' . esc_html__('Pages:', 'sahand-theme'), 'after' => '</nav>')); ?>
        </div>
      </article>
    <?php endwhile; ?>
  </div>
</main>
<?php get_footer(); ?>
