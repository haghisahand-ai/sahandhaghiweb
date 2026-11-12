<?php
/**
 * Single content and custom post type template.
 *
 * @package SahandTheme
 */
if (!defined('ABSPATH')) {
    exit;
}
get_header();
?>
<main id="primary" class="site-main single-template">
  <div class="sahand-container" style="padding-block:clamp(3rem,7vw,6rem);">
    <?php while (have_posts()) : the_post(); ?>
      <?php
      $post_type = get_post_type();
      $is_project = ('sahand_project' === $post_type);
      $is_product = ('sahand_product' === $post_type);
      $eyebrow = $is_project ? __('ENGINEERING CASE STUDY', 'sahand-theme') : ($is_product ? __('DIGITAL PRODUCT', 'sahand-theme') : strtoupper(str_replace('sahand_', '', (string) $post_type)));
      ?>
      <article id="post-<?php the_ID(); ?>" <?php post_class('sahand-article'); ?>>
        <header class="entry-header" style="max-width:980px;margin:0 auto 2.5rem;">
          <p class="badge badge-tech"><?php echo esc_html($eyebrow); ?></p>
          <h1 class="entry-title" style="font-size:clamp(2.25rem,5vw,4.25rem);line-height:1.1;margin-top:1rem;"><?php the_title(); ?></h1>
          <div class="entry-meta" style="color:var(--color-text-muted);margin-top:1rem;">
            <time datetime="<?php echo esc_attr(get_the_date(DATE_W3C)); ?>"><?php echo esc_html(get_the_date()); ?></time>
            <?php if ($is_product) :
              $version = get_post_meta(get_the_ID(), '_sahand_product_version', true);
              $status = get_post_meta(get_the_ID(), '_sahand_product_status', true);
              if ($version) : ?> · <span><?php echo esc_html(sprintf(__('Version %s', 'sahand-theme'), $version)); ?></span><?php endif;
              if ($status) : ?> · <span><?php echo esc_html(ucfirst($status)); ?></span><?php endif;
            endif; ?>
            <?php if ($is_project) :
              $status = get_post_meta(get_the_ID(), '_sahand_project_status', true);
              $timeline = get_post_meta(get_the_ID(), '_sahand_project_timeline', true);
              if ($status) : ?> · <span><?php echo esc_html(ucwords(str_replace('_', ' ', $status))); ?></span><?php endif;
              if ($timeline) : ?> · <span><?php echo esc_html($timeline); ?></span><?php endif;
            endif; ?>
          </div>
          <?php if (has_excerpt()) : ?><p class="entry-summary" style="font-size:1.15rem;color:var(--color-text-secondary);margin-top:1.25rem;max-width:800px;"><?php echo esc_html(get_the_excerpt()); ?></p><?php endif; ?>
        </header>
        <?php if (has_post_thumbnail()) : ?>
          <div class="featured-image" style="max-width:1100px;margin:0 auto 2.5rem;">
            <?php the_post_thumbnail('large', array('style' => 'width:100%;height:auto;border-radius:12px;')); ?>
          </div>
        <?php endif; ?>
        <div class="entry-content sahand-container-narrow" style="line-height:1.9;">
          <?php the_content(); ?>
          <?php
          if ($is_project) {
              $problem = get_post_meta(get_the_ID(), '_sahand_project_problem', true);
              $solution = get_post_meta(get_the_ID(), '_sahand_project_solution', true);
              $github = get_post_meta(get_the_ID(), '_sahand_project_github', true);
              $demo = get_post_meta(get_the_ID(), '_sahand_project_demo_url', true);
              if ($problem || $solution) : ?>
                <section class="project-engineering-details" style="margin-top:3rem;">
                  <?php if ($problem) : ?><h2><?php esc_html_e('Problem & Technical Challenge', 'sahand-theme'); ?></h2><p><?php echo nl2br(esc_html($problem)); ?></p><?php endif; ?>
                  <?php if ($solution) : ?><h2><?php esc_html_e('Engineering Approach', 'sahand-theme'); ?></h2><p><?php echo nl2br(esc_html($solution)); ?></p><?php endif; ?>
                </section>
              <?php endif;
              if ($github || $demo) : ?>
                <div class="project-links" style="display:flex;flex-wrap:wrap;gap:1rem;margin-top:2rem;">
                  <?php if ($github) : ?><a class="badge badge-tech" href="<?php echo esc_url($github); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Source Repository', 'sahand-theme'); ?> ↗</a><?php endif; ?>
                  <?php if ($demo) : ?><a class="badge badge-stable" href="<?php echo esc_url($demo); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e('Open Demo', 'sahand-theme'); ?> ↗</a><?php endif; ?>
                </div>
              <?php endif;
          } elseif ($is_product) {
              $download = get_post_meta(get_the_ID(), '_sahand_product_download_url', true);
              $changelog = get_post_meta(get_the_ID(), '_sahand_product_changelog', true);
              if ($changelog) : ?><section style="margin-top:3rem;"><h2><?php esc_html_e('Release Notes', 'sahand-theme'); ?></h2><p><?php echo nl2br(esc_html($changelog)); ?></p></section><?php endif;
              if ($download) : ?><p style="margin-top:2rem;"><a class="badge badge-stable" href="<?php echo esc_url($download); ?>" rel="nofollow noopener noreferrer"><?php esc_html_e('Access Product', 'sahand-theme'); ?> ↗</a></p><?php endif;
          }
          ?>
        </div>
      </article>
    <?php endwhile; ?>
  </div>
</main>
<?php get_footer(); ?>
