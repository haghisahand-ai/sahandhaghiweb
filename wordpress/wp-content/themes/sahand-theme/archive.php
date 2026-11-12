<?php
/**
 * Archive template for posts and SAHAND custom post types.
 *
 * @package SahandTheme
 */
if (!defined('ABSPATH')) {
    exit;
}
get_header();
$archive_title = get_the_archive_title();
$archive_description = get_the_archive_description();
?>
<main id="primary" class="site-main archive-template">
  <div class="sahand-container" style="padding-block:clamp(3rem,7vw,6rem);">
    <header class="archive-header" style="max-width:900px;margin-bottom:3rem;">
      <p class="badge badge-tech"><?php esc_html_e('SAHAND / LIBRARY', 'sahand-theme'); ?></p>
      <h1 style="font-size:clamp(2.25rem,5vw,4rem);line-height:1.1;margin-top:1rem;"><?php echo esc_html(wp_strip_all_tags($archive_title)); ?></h1>
      <?php if ($archive_description) : ?><div class="archive-description" style="color:var(--color-text-secondary);margin-top:1rem;"><?php echo wp_kses_post($archive_description); ?></div><?php endif; ?>
    </header>
    <?php if (have_posts()) : ?>
      <div class="archive-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:1.25rem;">
        <?php while (have_posts()) : the_post(); ?>
          <article id="post-<?php the_ID(); ?>" <?php post_class('sahand-card'); ?>>
            <?php if (has_post_thumbnail()) : ?>
              <a href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true"><?php the_post_thumbnail('sahand-card', array('style' => 'width:100%;height:auto;border-radius:8px;margin-bottom:1rem;')); ?></a>
            <?php endif; ?>
            <p class="font-mono" style="font-size:.75rem;color:var(--color-text-muted);"><?php echo esc_html(get_the_date()); ?></p>
            <h2 style="font-size:1.35rem;line-height:1.3;margin:.65rem 0;"><a href="<?php the_permalink(); ?>" style="color:inherit;text-decoration:none;"><?php the_title(); ?></a></h2>
            <div style="color:var(--color-text-secondary);"><?php the_excerpt(); ?></div>
            <a href="<?php the_permalink(); ?>" class="badge badge-tech" style="margin-top:1.25rem;"><?php esc_html_e('Explore', 'sahand-theme'); ?> →</a>
          </article>
        <?php endwhile; ?>
      </div>
      <nav class="archive-pagination" aria-label="<?php esc_attr_e('Archive pages', 'sahand-theme'); ?>" style="margin-top:3rem;">
        <?php the_posts_pagination(array('prev_text' => esc_html__('Previous', 'sahand-theme'), 'next_text' => esc_html__('Next', 'sahand-theme'))); ?>
      </nav>
    <?php else : ?>
      <div class="sahand-card"><h2><?php esc_html_e('Nothing published here yet.', 'sahand-theme'); ?></h2><p><?php esc_html_e('Content will appear here when it is published from the WordPress dashboard.', 'sahand-theme'); ?></p></div>
    <?php endif; ?>
  </div>
</main>
<?php get_footer(); ?>
