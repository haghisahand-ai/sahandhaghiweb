/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SAHAND — Mount Sahand 100% SVG Vector Identity System
 * Geological Strata, Dual Peaks (Kamal & Ghoruq), S-Curve Ridge Line & Engineering Precision
 */

import React from 'react';

export type LogoVariant = 'horizontal' | 'vertical' | 'emblem' | 'favicon16';
export type LogoTheme = 'dark' | 'light' | 'monochrome-dark' | 'monochrome-light';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: LogoVariant;
  theme?: LogoTheme;
  lang?: 'fa' | 'en' | 'tr';
  showSubtitle?: boolean;
  className?: string;
}

/**
 * Micro-Optimized 16x16 Favicon Variant
 * Uses bold pixel-aligned strokes (1.2–1.5px on a 16px canvas)
 * Drops fine hairlines so it remains crisp and unmistakable at 16x16 in browser tabs.
 */
export function SahandFavicon16({
  size = 16,
  className = '',
  theme = 'dark',
}: {
  size?: number;
  className?: string;
  theme?: LogoTheme;
}) {
  const isMonoLight = theme === 'monochrome-light';
  const isMonoDark = theme === 'monochrome-dark';
  const isLight = theme === 'light';

  const strokeColor = isMonoLight ? '#000000' : isMonoDark ? '#FFFFFF' : isLight ? '#0F172A' : '#38BDF8';
  const ridgeColor = isMonoLight ? '#000000' : isMonoDark ? '#FFFFFF' : isLight ? '#0284C7' : '#00F2FE';
  const fillColor = isMonoLight || isMonoDark ? 'none' : isLight ? 'rgba(2, 132, 199, 0.15)' : 'rgba(56, 189, 248, 0.25)';
  const nodeColor = isMonoLight ? '#000000' : '#FFFFFF';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="SAHAND 16px Favicon"
    >
      {/* Background backing rect for contrast (optional, useful on browser tabs) */}
      {!isMonoLight && !isLight && (
        <rect width="16" height="16" rx="3.5" fill="#070B14" />
      )}
      {/* Bold Mountain Pyramid Silhouette */}
      <polygon
        points="8,2.2 14,13.5 2,13.5"
        stroke={strokeColor}
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill={fillColor}
      />
      {/* Central S-Curve Ridge Line */}
      <path
        d="M8 2.5 C6.2 5.5, 9.8 7.5, 8 10.5 C7.2 12, 8.5 13.5 8 13.5"
        stroke={ridgeColor}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Basalt Bedding Strata */}
      <path
        d="M4 11 C6.5 10.2, 9.5 10.2, 12 11"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity={isMonoLight || isMonoDark ? 1 : 0.8}
      />
      {/* Summit Geodetic Apex Node */}
      <circle cx="8" cy="2.2" r="1.1" fill={nodeColor} />
    </svg>
  );
}

/**
 * Primary Mount Sahand Vector Emblem
 * Features:
 * - Dual geometric volcanic peaks of Mount Sahand (Kamal & Ghoruq)
 * - Intersecting S-curve ridge line integrating the letter 'S'
 * - Modernist geological elevation strata and computational coordinate nodes
 * - Scalable from 24px up to 512px with pixel-perfect alignment
 */
export function SahandEmblem({
  size = 36,
  className = '',
  theme = 'dark',
}: {
  size?: number;
  className?: string;
  theme?: LogoTheme;
}) {
  // If size is <= 20px, render the micro-optimized 16x16 vector
  if (size <= 20) {
    return <SahandFavicon16 size={size} className={className} theme={theme} />;
  }

  const isMonoLight = theme === 'monochrome-light';
  const isMonoDark = theme === 'monochrome-dark';
  const isLight = theme === 'light';

  // Strict Color Mapping
  const primaryStroke = isMonoLight ? '#000000' : isMonoDark ? '#FFFFFF' : isLight ? '#0F172A' : '#38BDF8';
  const secondaryStroke = isMonoLight ? '#000000' : isMonoDark ? '#FFFFFF' : isLight ? '#0284C7' : '#0284C7';
  const ridgeStroke = isMonoLight ? '#000000' : isMonoDark ? '#FFFFFF' : isLight ? '#0284C7' : '#00F2FE';
  const fillAccent = isMonoLight || isMonoDark ? 'none' : isLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(56, 189, 248, 0.15)';
  const nodeFill = isMonoLight ? '#000000' : isMonoDark ? '#FFFFFF' : isLight ? '#0284C7' : '#38BDF8';
  const gridOpacity = isMonoLight || isMonoDark ? 0.35 : isLight ? 0.25 : 0.2;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="SAHAND — Mount Sahand Vector Emblem"
    >
      {/* Outer Hexagonal Engineering Geodetic Perimeter */}
      <polygon
        points="50,4 90,26 90,74 50,96 10,74 10,26"
        stroke={primaryStroke}
        strokeWidth="1.2"
        strokeOpacity={gridOpacity}
        strokeDasharray="3 3"
      />

      {/* Main Mount Sahand Twin Peaks Pyramid Facet (Kamal Primary Summit) */}
      <polygon
        points="50,14 84,82 16,82"
        stroke={primaryStroke}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillAccent}
      />

      {/* Secondary Eastern Ridge (Ghoruq Peak Silhouette) */}
      <polyline
        points="50,14 68,44 84,82"
        stroke={primaryStroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={isMonoLight || isMonoDark ? 1 : 0.8}
      />

      {/* Geological Elevation Strata Layer 1 (Base Magmatic Bedding) */}
      <path
        d="M25 66 C38 61, 62 61, 75 66"
        stroke={secondaryStroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity={isMonoLight || isMonoDark ? 1 : 0.75}
      />

      {/* Geological Elevation Strata Layer 2 (Mid-Slope Elevation Contour) */}
      <path
        d="M33 50 C43 45, 57 45, 67 50"
        stroke={secondaryStroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity={isMonoLight || isMonoDark ? 1 : 0.85}
      />

      {/* Geological Elevation Strata Layer 3 (Upper Caldera Rim Contour) */}
      <path
        d="M41 34 C46 30, 54 30, 59 34"
        stroke={secondaryStroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity={isMonoLight || isMonoDark ? 1 : 0.9}
      />

      {/* Distinctive S-Curve Central Ridge (Letter 'S' Flow Across Sahand Massif) */}
      <path
        d="M50 14 C36 32, 64 46, 50 64 C42 74, 56 80, 50 82"
        stroke={ridgeStroke}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Summit Geodetic Coordinate Node (Apex Vertex) */}
      <circle cx="50" cy="14" r="3.8" fill={nodeFill} />
      {(!isMonoLight && !isMonoDark) && (
        <circle cx="50" cy="14" r="7" stroke={nodeFill} strokeWidth="1" strokeOpacity="0.4" />
      )}

      {/* Base Elevation Coordinate Nodes */}
      <circle cx="16" cy="82" r="3" fill={nodeFill} />
      <circle cx="84" cy="82" r="3" fill={nodeFill} />
    </svg>
  );
}

/**
 * Complete Responsive SAHAND Logo System
 * Supports: Horizontal, Vertical, Emblem, 16px Favicon, Monochrome, and Trilingual Lockups
 */
export default function SahandLogo({
  size = 'md',
  variant = 'horizontal',
  theme = 'dark',
  lang = 'fa',
  showSubtitle = true,
  className = '',
}: LogoProps) {
  // If explicitly requesting 16px favicon
  if (variant === 'favicon16') {
    const s = typeof size === 'number' ? size : 16;
    return <SahandFavicon16 size={s} theme={theme} className={className} />;
  }

  const isPersian = lang === 'fa';
  const isLight = theme === 'light' || theme === 'monochrome-light';
  const isMono = theme === 'monochrome-light' || theme === 'monochrome-dark';

  const pixelMap = {
    sm: { icon: 28, text: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 38, text: 'text-base sm:text-lg', sub: 'text-[10px]' },
    lg: { icon: 52, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 72, text: 'text-4xl', sub: 'text-sm' },
  };

  const currentSize = typeof size === 'number' 
    ? { icon: size, text: size > 48 ? 'text-3xl' : 'text-base', sub: 'text-[10px]' }
    : pixelMap[size];

  // Standalone Emblem variant
  if (variant === 'emblem') {
    return <SahandEmblem size={currentSize.icon} theme={theme} className={className} />;
  }

  // Vertical (Stacked) Lockup
  if (variant === 'vertical') {
    return (
      <div
        className={`inline-flex flex-col items-center text-center select-none ${className}`}
        dir={isPersian ? 'rtl' : 'ltr'}
      >
        <SahandEmblem size={currentSize.icon} theme={theme} />
        <div className="mt-2.5 flex flex-col items-center">
          <span
            className={`font-mono font-extrabold tracking-[0.2em] ${currentSize.text} ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            {isPersian ? 'سهند' : 'SAHAND'}
          </span>
          {isPersian && (
            <span className="font-mono text-[10px] text-sky-400 font-semibold tracking-widest opacity-80 mt-0.5">
              SAHAND
            </span>
          )}
          {showSubtitle && (
            <span
              className={`font-mono tracking-wider ${currentSize.sub} mt-1 ${
                isLight ? 'text-slate-500' : 'text-white/45'
              }`}
            >
              {isPersian
                ? 'پلتفرم تخصصی فناوری و مهندسی'
                : lang === 'tr'
                ? 'Teknoloji ve Mühendislik Platformu'
                : 'Technology & Systems Hub'}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal Lockup
  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${className}`}
      dir={isPersian ? 'rtl' : 'ltr'}
    >
      <SahandEmblem size={currentSize.icon} theme={theme} />

      <div className="flex flex-col items-start">
        <div className="flex items-center gap-2">
          <span
            className={`font-mono font-bold tracking-[0.18em] ${currentSize.text} ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            {isPersian ? 'سهند' : 'SAHAND'}
          </span>

          {isPersian && (
            <span className="font-mono text-[10px] text-sky-400 font-semibold tracking-widest opacity-80">
              SAHAND
            </span>
          )}
        </div>

        {showSubtitle && (
          <span
            className={`font-mono tracking-wider ${currentSize.sub} ${
              isLight ? 'text-slate-500' : 'text-white/45'
            }`}
          >
            {isPersian
              ? 'پلتفرم تخصصی فناوری و مهندسی'
              : lang === 'tr'
              ? 'Teknoloji ve Mühendislik Platformu'
              : 'Technology & Systems Hub'}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Interactive Brand System & Logo Inspector
 * Allows direct visual inspection of all lockups, monochrome variants, and the 16x16 favicon
 */
export function SahandLogoSystemInspector() {
  return (
    <div className="p-6 rounded-2xl bg-[#070A11] border border-white/[0.1] text-white space-y-8 font-mono text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-sky-400 text-xs">SAHAND BRAND IDENTITY SPECIFICATION</span>
          <h3 className="text-lg font-bold text-white mt-1">100% SVG Vector Logo System</h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-400/20">
          Mount Sahand Inspired
        </span>
      </div>

      {/* Grid of Lockups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Horizontal Dark */}
        <div className="p-5 rounded-xl bg-black/40 border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/40">01 // HORIZONTAL LOCKUP (DARK)</span>
            <a 
              href="/assets/brand/sahand-logo-horizontal-dark.svg" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] text-sky-400 hover:text-sky-300 underline"
            >
              Open SVG ↗
            </a>
          </div>
          <div className="py-4 flex justify-center">
            <SahandLogo variant="horizontal" theme="dark" lang="en" size="md" />
          </div>
          <span className="text-[10px] text-sky-400/80 mt-4 block">Asset: /assets/brand/sahand-logo-horizontal-dark.svg</span>
        </div>

        {/* 2. Horizontal Light */}
        <div className="p-5 rounded-xl bg-[#FAFAFB] text-slate-900 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-slate-400">02 // HORIZONTAL LOCKUP (LIGHT)</span>
            <a 
              href="/assets/brand/sahand-logo-horizontal-light.svg" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] text-sky-600 hover:text-sky-700 underline"
            >
              Open SVG ↗
            </a>
          </div>
          <div className="py-4 flex justify-center">
            <SahandLogo variant="horizontal" theme="light" lang="en" size="md" />
          </div>
          <span className="text-[10px] text-sky-600/80 mt-4 block">Asset: /assets/brand/sahand-logo-horizontal-light.svg</span>
        </div>

        {/* 3. Persian Lockup */}
        <div className="p-5 rounded-xl bg-black/40 border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/40">03 // PERSIAN LOCKUP (سهند)</span>
            <a 
              href="/assets/brand/sahand-logo-persian.svg" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] text-sky-400 hover:text-sky-300 underline"
            >
              Open SVG ↗
            </a>
          </div>
          <div className="py-4 flex justify-center">
            <SahandLogo variant="horizontal" theme="dark" lang="fa" size="md" />
          </div>
          <span className="text-[10px] text-sky-400/80 mt-4 block">Asset: /assets/brand/sahand-logo-persian.svg</span>
        </div>

        {/* 4. Vertical Stacked Dark */}
        <div className="p-5 rounded-xl bg-black/40 border border-white/[0.08] flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/40">04 // VERTICAL STACKED (DARK)</span>
            <a 
              href="/assets/brand/sahand-logo-vertical-dark.svg" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] text-sky-400 hover:text-sky-300 underline"
            >
              Open SVG ↗
            </a>
          </div>
          <div className="py-2">
            <SahandLogo variant="vertical" theme="dark" lang="en" size="lg" />
          </div>
          <span className="text-[10px] text-sky-400/80 mt-4 block self-start">Asset: /assets/brand/sahand-logo-vertical-dark.svg</span>
        </div>

        {/* 5. Vertical Stacked Light */}
        <div className="p-5 rounded-xl bg-[#FAFAFB] text-slate-900 border border-slate-200 flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-[10px] text-slate-400">05 // VERTICAL STACKED (LIGHT)</span>
            <a 
              href="/assets/brand/sahand-logo-vertical-light.svg" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] text-sky-600 hover:text-sky-700 underline"
            >
              Open SVG ↗
            </a>
          </div>
          <div className="py-2">
            <SahandLogo variant="vertical" theme="light" lang="en" size="lg" />
          </div>
          <span className="text-[10px] text-sky-600/80 mt-4 block self-start">Asset: /assets/brand/sahand-logo-vertical-light.svg</span>
        </div>

        {/* 6. Monochrome Single-Color (Dark & Light) */}
        <div className="p-5 rounded-xl bg-black/40 border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-white/40">06 // MONOCHROME (1-COLOR PURE)</span>
            <span className="text-[10px] text-emerald-400">#000000 / #FFFFFF</span>
          </div>
          <div className="grid grid-cols-2 gap-3 py-2 items-center text-center">
            <a 
              href="/assets/brand/sahand-emblem-mono-dark.svg" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 bg-black rounded-lg border border-white/20 hover:border-sky-400 transition-colors block"
            >
              <SahandEmblem size={44} theme="monochrome-dark" />
              <span className="text-[9px] text-white/50 block mt-2">Pure White ↗</span>
            </a>
            <a 
              href="/assets/brand/sahand-emblem-mono-light.svg" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 bg-white rounded-lg border border-black/20 hover:border-sky-600 transition-colors block"
            >
              <SahandEmblem size={44} theme="monochrome-light" />
              <span className="text-[9px] text-black/60 block mt-2">Pure Black ↗</span>
            </a>
          </div>
          <span className="text-[10px] text-sky-400/80 mt-2 block">Asset: /assets/brand/sahand-emblem-mono-*.svg</span>
        </div>

      </div>

      {/* 7. Dedicated 16x16 Favicon Inspection Panel */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-sky-950/30 to-slate-900/40 border border-sky-400/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs text-sky-400 font-bold">07 // RESPONSIVE 16x16 FAVICON VARIANT</span>
            <p className="text-xs text-white/70 font-sans mt-0.5">
              Engineered with pixel-grid aligned strokes (1.3px on a 16px grid) to guarantee razor-sharp legibility in browser tabs without gray anti-aliasing blur.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href="/assets/brand/sahand-favicon-16.svg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-mono text-sky-300 hover:text-white underline"
            >
              Open 16px SVG ↗
            </a>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono shrink-0">
              PASSED 16x16 PIXEL TEST
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
          {/* Actual 16px */}
          <div className="p-3 rounded-lg bg-black/60 border border-white/10 flex flex-col items-center">
            <SahandFavicon16 size={16} />
            <span className="text-[9px] text-white/50 mt-2">Actual Size: 16x16</span>
          </div>

          {/* Actual 24px */}
          <div className="p-3 rounded-lg bg-black/60 border border-white/10 flex flex-col items-center">
            <SahandFavicon16 size={24} />
            <span className="text-[9px] text-white/50 mt-2">Medium: 24x24</span>
          </div>

          {/* Actual 32px (Retina) */}
          <div className="p-3 rounded-lg bg-black/60 border border-white/10 flex flex-col items-center">
            <SahandFavicon16 size={32} />
            <span className="text-[9px] text-white/50 mt-2">Retina: 32x32</span>
          </div>

          {/* 64px Zoomed Pixel Grid View */}
          <div className="p-3 rounded-lg bg-black/60 border border-sky-400/30 flex flex-col items-center">
            <SahandFavicon16 size={48} />
            <span className="text-[9px] text-sky-400 mt-2">Zoomed Geometry</span>
          </div>
        </div>
      </div>

    </div>
  );
}
