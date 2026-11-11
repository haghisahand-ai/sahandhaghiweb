<?php
/**
 * SAHAND Theme — Neural Data-Flow SVG Background Component
 *
 * Lightweight, zero-CPU SVG data-flow background visualizing neural network
 * topology and distributed engineering pipelines with hardware-accelerated CSS animations.
 *
 * @package SahandTheme
 */

if (!defined('ABSPATH')) {
    exit;
}

$variant = $args['variant'] ?? 'ai-lab'; // 'ai-lab' | 'engineering'
$theme = $args['theme'] ?? 'dark'; // 'dark' | 'light'
$is_rtl = is_rtl();

$is_light = $theme === 'light';
$gradient_id = 'wp-neural-grad-' . esc_attr($variant);
$packet_id = 'wp-packet-grad-' . esc_attr($variant);

$active_color = $is_light ? '#0284C7' : '#38BDF8';
$node_fill = $is_light ? '#FFFFFF' : '#070B14';
$node_stroke = $is_light ? '#0284C7' : '#38BDF8';
?>
<div class="sahand-neural-bg absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true" data-variant="<?php echo esc_attr($variant); ?>">
  <svg viewBox="0 0 1440 500" preserveAspectRatio="xMidYMid slice" class="w-full h-full opacity-60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="<?php echo $gradient_id; ?>" x1="<?php echo $is_rtl ? '100%' : '0%'; ?>" y1="0%" x2="<?php echo $is_rtl ? '0%' : '100%'; ?>" y2="0%">
        <stop offset="0%" stop-color="<?php echo $is_light ? '#0284C7' : '#38BDF8'; ?>" stop-opacity="<?php echo $is_light ? '0.25' : '0.20'; ?>" />
        <stop offset="50%" stop-color="<?php echo $is_light ? '#0369A1' : '#00F2FE'; ?>" stop-opacity="<?php echo $is_light ? '0.35' : '0.30'; ?>" />
        <stop offset="100%" stop-color="<?php echo $is_light ? '#059669' : '#34D399'; ?>" stop-opacity="<?php echo $is_light ? '0.25' : '0.20'; ?>" />
      </linearGradient>

      <linearGradient id="<?php echo $packet_id; ?>" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="<?php echo $active_color; ?>" stop-opacity="0" />
        <stop offset="80%" stop-color="<?php echo $active_color; ?>" stop-opacity="0.8" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="1" />
      </linearGradient>
    </defs>

    <!-- Conduits & Packets (Pure CSS stroke-dashoffset animation) -->
    <g class="sahand-neural-network">
      <?php if ($variant === 'ai-lab') : ?>
        <!-- Neural Synapse Tracks -->
        <path d="M 172 140 C 330 140, 390 114, 547 114" stroke="url(#<?php echo $gradient_id; ?>)" stroke-width="1.5" />
        <path d="M 172 140 C 330 140, 390 208, 547 208" stroke="url(#<?php echo $gradient_id; ?>)" stroke-width="1.8" />
        <path d="M 172 260 C 330 260, 390 208, 547 208" stroke="url(#<?php echo $gradient_id; ?>)" stroke-width="1.4" />
        <path d="M 172 260 C 330 260, 390 322, 547 322" stroke="url(#<?php echo $gradient_id; ?>)" stroke-width="1.6" />
        <path d="M 547 114 C 720 114, 780 140, 936 140" stroke="url(#<?php echo $gradient_id; ?>)" stroke-width="1.8" />
        <path d="M 547 208 C 720 208, 780 260, 936 260" stroke="url(#<?php echo $gradient_id; ?>)" stroke-width="1.5" />
        <path d="M 936 140 C 1110 140, 1160 140, 1296 140" stroke="url(#<?php echo $gradient_id; ?>)" stroke-width="2" />
        <path d="M 936 260 C 1110 260, 1160 260, 1296 260" stroke="url(#<?php echo $gradient_id; ?>)" stroke-width="1.6" />

        <!-- Animated Data Flow Packets -->
        <path d="M 172 140 C 330 140, 390 114, 547 114" stroke="url(#<?php echo $packet_id; ?>)" stroke-width="2.4" stroke-dasharray="16 220" class="synapse-packet-anim" style="--flow-duration: 4.8s;" />
        <path d="M 172 260 C 330 260, 390 208, 547 208" stroke="url(#<?php echo $packet_id; ?>)" stroke-width="2.4" stroke-dasharray="16 220" class="synapse-packet-anim" style="--flow-duration: 5.5s; --flow-delay: 1.2s;" />
        <path d="M 547 208 C 720 208, 780 260, 936 260" stroke="url(#<?php echo $packet_id; ?>)" stroke-width="2.4" stroke-dasharray="16 220" class="synapse-packet-anim" style="--flow-duration: 4.2s; --flow-delay: 2.1s;" />
        <path d="M 936 140 C 1110 140, 1160 140, 1296 140" stroke="url(#<?php echo $packet_id; ?>)" stroke-width="2.6" stroke-dasharray="16 220" class="synapse-packet-anim" style="--flow-duration: 3.8s; --flow-delay: 0.7s;" />
      <?php else : ?>
        <!-- Engineering Pipeline Routing Buses -->
        <path d="M 144 168 L 324 168 L 324 120 L 504 120" stroke="url(#<?php echo $gradient_id; ?>)" stroke-width="1.6" />
        <path d="M 144 312 L 324 312 L 324 240 L 504 240" stroke="url(#<?php echo $gradient_id; ?>)" stroke-width="1.6" />
        <path d="M 504 120 L 698 120 L 698 96 L 892 96" stroke="url(#<?php echo $gradient_id; ?>)" stroke-width="1.8" />
        <path d="M 504 240 L 698 240 L 698 216 L 892 216" stroke="url(#<?php echo $gradient_id; ?>)" stroke-width="1.8" />
        <path d="M 892 96 L 1079 96 L 1079 168 L 1267 168" stroke="url(#<?php echo $gradient_id; ?>)" stroke-width="2" />

        <!-- Animated Pipeline Data Flow Packets -->
        <path d="M 144 168 L 324 168 L 324 120 L 504 120" stroke="url(#<?php echo $packet_id; ?>)" stroke-width="2.4" stroke-dasharray="16 220" class="synapse-packet-anim" style="--flow-duration: 4.5s;" />
        <path d="M 504 240 L 698 240 L 698 216 L 892 216" stroke="url(#<?php echo $packet_id; ?>)" stroke-width="2.4" stroke-dasharray="16 220" class="synapse-packet-anim" style="--flow-duration: 5.2s; --flow-delay: 1.4s;" />
        <path d="M 892 96 L 1079 96 L 1079 168 L 1267 168" stroke="url(#<?php echo $packet_id; ?>)" stroke-width="2.6" stroke-dasharray="16 220" class="synapse-packet-anim" style="--flow-duration: 3.9s; --flow-delay: 0.8s;" />
      <?php endif; ?>
    </g>
  </svg>
  <div class="absolute inset-0 bg-gradient-to-t <?php echo $is_light ? 'from-[#FAFAFB]/80 via-transparent to-[#FAFAFB]/80' : 'from-[#070A11]/85 via-transparent to-[#070A11]/80'; ?> pointer-events-none"></div>
</div>
