/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SAHAND — Neural Network & Engineering Data-Flow SVG Background
 * 
 * High-performance, zero-CPU SVG data-flow background visualizing neural network
 * topology and distributed engineering pipelines with hardware-accelerated CSS animations.
 */

import React, { useMemo } from 'react';
import { generateAiLabTopology, generateEngineeringTopology } from '../utils/neuralFlow';

export interface NeuralDataFlowBackgroundProps {
  variant?: 'ai-lab' | 'engineering';
  theme?: 'dark' | 'light';
  isRtl?: boolean;
  isGenerating?: boolean;
  reducedMotion?: boolean;
  className?: string;
  showLabels?: boolean;
}

export default function NeuralDataFlowBackground({
  variant = 'ai-lab',
  theme = 'dark',
  isRtl = false,
  isGenerating = false,
  reducedMotion = false,
  className = '',
  showLabels = true,
}: NeuralDataFlowBackgroundProps) {
  // Generate deterministic network topology based on variant and language direction
  const topology = useMemo(() => {
    if (variant === 'ai-lab') {
      return generateAiLabTopology(1440, 520, isRtl);
    }
    return generateEngineeringTopology(1440, 480, isRtl);
  }, [variant, isRtl]);

  const isLight = theme === 'light';

  // Theme-sensitive color definitions
  const baseLineColor = isLight ? 'rgba(15, 23, 42, 0.12)' : 'rgba(56, 189, 248, 0.12)';
  const activePacketColor = isLight
    ? isGenerating
      ? '#0284C7'
      : '#0369A1'
    : isGenerating
    ? '#00F2FE'
    : '#38BDF8';
  const nodeFill = isLight ? '#FFFFFF' : '#070B14';
  const nodeStroke = isLight ? '#0284C7' : '#38BDF8';
  const labelColor = isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.35)';
  const gridDotColor = isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(56, 189, 248, 0.08)';

  // Speed multiplier when generating inference
  const speedMultiplier = isGenerating ? 0.5 : 1.0;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
      data-testid={`neural-flow-bg-${variant}`}
    >
      {/* Dynamic Keyframe Styles for Hardware-Accelerated SVG Dash Animation */}
      <style>{`
        @keyframes neuralFlowForward {
          from {
            stroke-dashoffset: 240;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes neuralPulseGlow {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.15);
          }
        }
        .synapse-packet-anim {
          animation: neuralFlowForward var(--flow-duration, 5s) linear infinite;
          animation-delay: var(--flow-delay, 0s);
        }
        .node-pulse-anim {
          animation: neuralPulseGlow var(--pulse-duration, 4s) ease-in-out infinite;
          transform-origin: center;
        }
        @media (prefers-reduced-motion: reduce) {
          .synapse-packet-anim, .node-pulse-anim {
            animation: none !important;
          }
        }
      `}</style>

      {/* Primary Scalable Vector Network Container */}
      <svg
        viewBox={`0 0 ${topology.width} ${topology.height}`}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-60 transition-opacity duration-700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Linear Gradient for Static Synaptic Pathways */}
          <linearGradient id={`neuralGrad-${variant}`} x1={isRtl ? '100%' : '0%'} y1="0%" x2={isRtl ? '0%' : '100%'} y2="0%">
            <stop offset="0%" stopColor={isLight ? '#0284C7' : '#38BDF8'} stopOpacity={isLight ? 0.25 : 0.20} />
            <stop offset="50%" stopColor={isLight ? '#0369A1' : '#00F2FE'} stopOpacity={isLight ? 0.35 : 0.30} />
            <stop offset="100%" stopColor={isLight ? '#059669' : '#34D399'} stopOpacity={isLight ? 0.25 : 0.20} />
          </linearGradient>

          {/* Glowing Head Gradient for Flowing Packets */}
          <linearGradient id={`packetGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={activePacketColor} stopOpacity="0" />
            <stop offset="80%" stopColor={activePacketColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          {/* Soft Glow Radial Gradient for Latent Hubs */}
          <radialGradient id="hubRadialGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={activePacketColor} stopOpacity={isGenerating ? 0.5 : 0.25} />
            <stop offset="100%" stopColor={activePacketColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Coordinate Grid Intersection Dots (Subtle Matrix) */}
        <g opacity={0.6}>
          {[120, 360, 600, 840, 1080, 1320].map((gx) =>
            [80, 180, 280, 380, 480].map((gy) => (
              <circle
                key={`grid-${gx}-${gy}`}
                cx={gx}
                cy={gy}
                r={1}
                fill={gridDotColor}
              />
            ))
          )}
        </g>

        {/* 2. Base Synaptic Conduits (Static Hairline Routing Tracks) */}
        <g opacity={0.7}>
          {topology.synapses.map((synapse) => (
            <path
              key={`base-${synapse.id}`}
              d={synapse.pathD}
              stroke={`url(#neuralGrad-${variant})`}
              strokeWidth={Math.max(1, synapse.weight * 1.5)}
              strokeLinecap="round"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* 3. Flowing Data Packets (Hardware-accelerated via stroke-dashoffset) */}
        {!reducedMotion && (
          <g>
            {topology.synapses.map((synapse) => {
              const duration = Math.max(2, synapse.packetDuration * speedMultiplier);
              return (
                <path
                  key={`pulse-${synapse.id}`}
                  d={synapse.pathD}
                  stroke={`url(#packetGrad-${variant})`}
                  strokeWidth={Math.max(1.8, synapse.weight * 2.4)}
                  strokeLinecap="round"
                  strokeDasharray="16 220"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  className="synapse-packet-anim"
                  style={
                    {
                      '--flow-duration': `${duration}s`,
                      '--flow-delay': `${synapse.packetDelay}s`,
                    } as React.CSSProperties
                  }
                />
              );
            })}
          </g>
        )}

        {/* 4. Synaptic Nodes & Activation Hubs */}
        <g>
          {topology.nodes.map((node) => {
            const isImportant = node.type === 'gateway' || node.type === 'latent';
            return (
              <g key={`node-grp-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
                {/* Latent Hub Outer Glow Ring */}
                {isImportant && !reducedMotion && (
                  <circle
                    r={node.radius * 3.2}
                    fill="url(#hubRadialGlow)"
                    className="node-pulse-anim"
                    style={{ '--pulse-duration': '3.5s' } as React.CSSProperties}
                  />
                )}

                {/* Node Outer Orbit Ring */}
                <circle
                  r={node.radius + 2.5}
                  stroke={nodeStroke}
                  strokeWidth="0.8"
                  strokeOpacity={isLight ? 0.35 : 0.45}
                  strokeDasharray={isImportant ? '2 2' : undefined}
                  fill="none"
                />

                {/* Node Solid Core */}
                <circle
                  r={node.radius}
                  fill={nodeFill}
                  stroke={nodeStroke}
                  strokeWidth="1.4"
                  className={!reducedMotion ? 'node-pulse-anim' : undefined}
                  style={
                    {
                      '--pulse-duration': `${3 + (node.layer % 3)}s`,
                    } as React.CSSProperties
                  }
                />

                {/* Node Center Apex Pip */}
                <circle
                  r={Math.max(1.2, node.radius * 0.4)}
                  fill={activePacketColor}
                  opacity={node.activationPotential}
                />

                {/* Precision Unboxed Monospace Mathematical & Pipeline Coordinates */}
                {showLabels && node.label && (
                  <text
                    x={isRtl ? -node.radius - 6 : node.radius + 6}
                    y={3}
                    textAnchor={isRtl ? 'end' : 'start'}
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="8.5"
                    fontWeight="500"
                    fill={labelColor}
                    letterSpacing="0.05em"
                  >
                    {node.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Gentle Radial Scrim Gradient to ensure zero text interference */}
      <div
        className={`absolute inset-0 ${
          isLight
            ? 'bg-gradient-to-t from-[#FAFAFB]/80 via-transparent to-[#FAFAFB]/80'
            : 'bg-gradient-to-t from-[#070A11]/85 via-transparent to-[#070A11]/80'
        } pointer-events-none`}
      />
    </div>
  );
}
