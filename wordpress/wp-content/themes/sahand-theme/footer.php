<?php
/**
 * The footer for SAHAND Theme
 *
 * @package SahandTheme
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
  <footer id="colophon" class="site-footer" style="border-top: 1px solid var(--color-border-subtle); background: var(--color-surface); padding-block: 2.5rem; margin-top: 4rem;">
    <div class="sahand-container" style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; font-size: 0.8125rem; color: var(--color-text-muted);">
      <div class="footer-identity" style="display: flex; align-items: center; gap: 0.5rem;">
        <strong style="color: var(--color-text-primary); font-family: var(--font-mono);">SAHAND</strong>
        <span>— <?php esc_html_e('Personal Technology Hub', 'sahand-theme'); ?></span>
      </div>

      <div class="footer-security font-mono" style="font-size: 0.75rem;">
        <span>🔒 <?php esc_html_e('Defense-in-Depth Architecture · Zero Trust', 'sahand-theme'); ?></span>
      </div>

      <div class="footer-copyright font-mono" style="font-size: 0.75rem;">
        <span>© <?php echo esc_html(gmdate('Y')); ?> SAHAND HAGHI. <?php esc_html_e('All rights reserved.', 'sahand-theme'); ?></span>
      </div>
    </div>
  </footer>
</div><!-- #page -->

<?php wp_footer(); ?>
</body>
</html>
