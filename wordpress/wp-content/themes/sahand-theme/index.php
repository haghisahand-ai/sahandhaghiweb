<?php
/**
 * Main Template Fallback
 *
 * @package SahandTheme
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>

<main id="primary" class="site-main" style="padding-block: 4rem;">
  <div class="sahand-container">
    <?php
    if (have_posts()) :
        while (have_posts()) :
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class('sahand-card'); ?> style="margin-bottom: 2rem;">
              <header class="entry-header" style="margin-bottom: 1rem;">
                <h1 class="entry-title" style="font-size: 2rem; font-weight: 700;">
                  <a href="<?php the_permalink(); ?>" style="color: inherit; text-decoration: none;">
                    <?php the_title(); ?>
                  </a>
                </h1>
                <div class="entry-meta font-mono" style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.5rem;">
                  <span><?php echo get_the_date(); ?></span>
                </div>
              </header>

              <div class="entry-content" style="line-height: 1.8; color: var(--color-text-secondary);">
                <?php the_content(); ?>
              </div>
            </article>
            <?php
        endwhile;

        the_posts_pagination(array(
            'prev_text' => '← ' . esc_html__('Previous', 'sahand-theme'),
            'next_text' => esc_html__('Next', 'sahand-theme') . ' →',
        ));
    else :
        ?>
        <div class="sahand-card text-center" style="padding: 4rem 2rem; text-align: center;">
          <h1 style="font-size: 1.5rem; margin-bottom: 0.75rem; font-weight: 700;">
            <?php esc_html_e('No Content Found', 'sahand-theme'); ?>
          </h1>
          <p style="color: var(--color-text-secondary);">
            <?php esc_html_e('The requested content does not exist or has not been published yet.', 'sahand-theme'); ?>
          </p>
        </div>
        <?php
    endif;
    ?>
  </div>
</main>

<?php
get_footer();
