/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SAHAND — Neural Network & Engineering Data-Flow Topology Generator
 * Pure mathematical utilities for generating deterministic SVG graph topologies,
 * synaptic curves, and data-packet trajectories with zero runtime GPU overhead.
 */

export interface NetworkNode {
  id: string;
  x: number;
  y: number;
  radius: number;
  layer: number;
  label?: string;
  sublabel?: string;
  type: 'input' | 'hidden' | 'latent' | 'output' | 'gateway';
  activationPotential: number; // 0.0 to 1.0 for styling intensity
}

export interface NetworkSynapse {
  id: string;
  fromId: string;
  toId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  weight: number; // 0.2 to 1.0 (controls stroke width / opacity)
  pathD: string;
  packetDuration: number; // in seconds (e.g., 3s to 7s)
  packetDelay: number; // in seconds
}

export interface NetworkTopology {
  width: number;
  height: number;
  nodes: NetworkNode[];
  synapses: NetworkSynapse[];
}

/**
 * Computes a smooth cubic Bézier curve between two nodes.
 * Uses horizontal inflection handles to simulate electronic circuit and neural tensor paths.
 */
export function generateBezierPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  curvature: number = 0.5
): string {
  const dx = (x2 - x1) * curvature;
  const cx1 = Number((x1 + dx).toFixed(2));
  const cy1 = Number(y1.toFixed(2));
  const cx2 = Number((x2 - dx).toFixed(2));
  const cy2 = Number(y2.toFixed(2));
  return `M ${Number(x1.toFixed(2))} ${Number(y1.toFixed(2))} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${Number(x2.toFixed(2))} ${Number(y2.toFixed(2))}`;
}

/**
 * Computes a chamfered orthogonal circuit path between two coordinates.
 */
export function generateOrthogonalPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  midRatio: number = 0.5
): string {
  const midX = Number((x1 + (x2 - x1) * midRatio).toFixed(2));
  return `M ${Number(x1.toFixed(2))} ${Number(y1.toFixed(2))} L ${midX} ${Number(y1.toFixed(2))} L ${midX} ${Number(y2.toFixed(2))} L ${Number(x2.toFixed(2))} ${Number(y2.toFixed(2))}`;
}

/**
 * Generates an AI neural-network topology featuring:
 * - 4 distinct computation stages: Inputs -> Dense Hidden -> Latent Attention -> Output Predictions
 * - Directed cubic Bézier synaptic connections with calibrated weights
 * - Support for RTL mirroring
 */
export function generateAiLabTopology(
  width: number = 1440,
  height: number = 520,
  isRtl: boolean = false
): NetworkTopology {
  const layerXFractions = [0.12, 0.38, 0.65, 0.90];
  const layerNodeCounts = [3, 4, 4, 3];
  const layerTypes: ('input' | 'hidden' | 'latent' | 'output')[] = [
    'input',
    'hidden',
    'latent',
    'output',
  ];

  const nodes: NetworkNode[] = [];
  const synapses: NetworkSynapse[] = [];

  // Generate nodes per layer
  layerNodeCounts.forEach((count, layerIdx) => {
    const rawXFraction = layerXFractions[layerIdx];
    const xFraction = isRtl ? 1 - rawXFraction : rawXFraction;
    const x = Number((width * xFraction).toFixed(2));

    const ySpacing = height / (count + 1);

    for (let i = 0; i < count; i++) {
      const y = Number((ySpacing * (i + 1) + (i % 2 === 0 ? 10 : -10)).toFixed(2));
      const type = layerTypes[layerIdx];
      const radius = type === 'input' || type === 'output' ? 5 : 4;
      const activationPotential = Number((0.4 + ((layerIdx + i) % 5) * 0.12).toFixed(2));

      nodes.push({
        id: `node-${layerIdx}-${i}`,
        x,
        y,
        radius,
        layer: layerIdx,
        type,
        activationPotential,
        label:
          layerIdx === 0
            ? `x${i}`
            : layerIdx === 3
            ? `y${i}`
            : `h${layerIdx},${i}`,
      });
    }
  });

  // Generate synaptic connections between adjacent layers
  for (let l = 0; l < layerNodeCounts.length - 1; l++) {
    const currentLayerNodes = nodes.filter((n) => n.layer === l);
    const nextLayerNodes = nodes.filter((n) => n.layer === l + 1);

    currentLayerNodes.forEach((fromNode, fromIndex) => {
      nextLayerNodes.forEach((toNode, toIndex) => {
        // Filter out dense clutter: only connect if distance index is reasonable
        // to maintain a high-elegance, airy neural web
        const indexDiff = Math.abs(fromIndex - toIndex);
        if (indexDiff > 2) return;

        const weight = Number((0.25 + (1 - indexDiff * 0.25) * 0.55).toFixed(2));
        const packetDuration = Number((4.5 + ((fromIndex + toIndex) % 4) * 0.9).toFixed(2));
        const packetDelay = Number((((fromIndex * 2 + toIndex) % 6) * 0.7).toFixed(2));

        const pathD = generateBezierPath(
          fromNode.x,
          fromNode.y,
          toNode.x,
          toNode.y,
          0.45
        );

        synapses.push({
          id: `synapse-${fromNode.id}->${toNode.id}`,
          fromId: fromNode.id,
          toId: toNode.id,
          x1: fromNode.x,
          y1: fromNode.y,
          x2: toNode.x,
          y2: toNode.y,
          weight,
          pathD,
          packetDuration,
          packetDelay,
        });
      });
    });
  }

  return { width, height, nodes, synapses };
}

/**
 * Generates an Engineering Pipeline DAG topology featuring:
 * - Ingress edge nodes -> Routing / Cache bus -> Core application workers -> Storage/API Gateways
 * - Clean orthogonal & hybrid routing paths
 */
export function generateEngineeringTopology(
  width: number = 1440,
  height: number = 480,
  isRtl: boolean = false
): NetworkTopology {
  const stages = [
    { name: 'EDGE', xFrac: 0.10, yFracs: [0.35, 0.65], type: 'input' as const, label: 'WAF / CDN' },
    { name: 'PROXY', xFrac: 0.35, yFracs: [0.25, 0.50, 0.75], type: 'gateway' as const, label: 'NGINX FASTCGI' },
    { name: 'CORE', xFrac: 0.62, yFracs: [0.20, 0.45, 0.70], type: 'hidden' as const, label: 'PHP-FPM THEME & CORE' },
    { name: 'GATEWAY', xFrac: 0.88, yFracs: [0.35, 0.65], type: 'output' as const, label: 'DB / GEMINI API' },
  ];

  const nodes: NetworkNode[] = [];
  const synapses: NetworkSynapse[] = [];

  stages.forEach((stage, stageIdx) => {
    const rawXFraction = stage.xFrac;
    const xFraction = isRtl ? 1 - rawXFraction : rawXFraction;
    const x = Number((width * xFraction).toFixed(2));

    stage.yFracs.forEach((yFrac, idx) => {
      const y = Number((height * yFrac).toFixed(2));
      nodes.push({
        id: `eng-${stageIdx}-${idx}`,
        x,
        y,
        radius: stage.type === 'gateway' ? 6 : 4.5,
        layer: stageIdx,
        type: stage.type,
        activationPotential: 0.8,
        label: `${stage.name}_${idx}`,
        sublabel: stage.label,
      });
    });
  });

  // Connect adjacent stages with orthogonal routing conduits
  for (let s = 0; s < stages.length - 1; s++) {
    const fromNodes = nodes.filter((n) => n.layer === s);
    const toNodes = nodes.filter((n) => n.layer === s + 1);

    fromNodes.forEach((fromNode, fi) => {
      toNodes.forEach((toNode, ti) => {
        if (Math.abs(fi - ti) > 1 && s !== 1) return;

        const pathD = generateOrthogonalPath(
          fromNode.x,
          fromNode.y,
          toNode.x,
          toNode.y,
          0.45 + (fi * 0.1)
        );

        synapses.push({
          id: `eng-syn-${fromNode.id}->${toNode.id}`,
          fromId: fromNode.id,
          toId: toNode.id,
          x1: fromNode.x,
          y1: fromNode.y,
          x2: toNode.x,
          y2: toNode.y,
          weight: 0.6,
          pathD,
          packetDuration: Number((4.0 + ((fi + ti) % 3) * 1.2).toFixed(2)),
          packetDelay: Number(((fi * 1.5 + ti * 0.8) % 4).toFixed(2)),
        });
      });
    });
  }

  return { width, height, nodes, synapses };
}
