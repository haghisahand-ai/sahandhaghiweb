/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SAHAND — Neural Network Topology & Path Geometry Unit Tests
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateBezierPath,
  generateOrthogonalPath,
  generateAiLabTopology,
  generateEngineeringTopology,
} from './neuralFlow';

test('generateBezierPath creates valid SVG cubic Bézier command', () => {
  const path = generateBezierPath(100, 200, 400, 300, 0.5);
  assert.match(path, /^M 100 200 C \d+(\.\d+)? 200, \d+(\.\d+)? 300, 400 300$/);
});

test('generateOrthogonalPath creates valid rectilinear path', () => {
  const path = generateOrthogonalPath(100, 100, 300, 250, 0.5);
  assert.match(path, /^M 100 100 L 200 100 L 200 250 L 300 250$/);
});

test('generateAiLabTopology builds 4 interconnected neural layers', () => {
  const topology = generateAiLabTopology(1440, 500, false);
  
  assert.equal(topology.width, 1440);
  assert.equal(topology.height, 500);
  
  // Total nodes: 3 + 4 + 4 + 3 = 14
  assert.equal(topology.nodes.length, 14);

  // Check layer distribution
  const layer0 = topology.nodes.filter((n) => n.layer === 0);
  const layer1 = topology.nodes.filter((n) => n.layer === 1);
  const layer2 = topology.nodes.filter((n) => n.layer === 2);
  const layer3 = topology.nodes.filter((n) => n.layer === 3);

  assert.equal(layer0.length, 3);
  assert.equal(layer1.length, 4);
  assert.equal(layer2.length, 4);
  assert.equal(layer3.length, 3);

  // Verify synapses exist between layers
  assert.ok(topology.synapses.length > 10, 'Should have multiple synaptic paths');
  
  // Check that all synapses connect valid existing node IDs
  const nodeIds = new Set(topology.nodes.map((n) => n.id));
  for (const syn of topology.synapses) {
    assert.ok(nodeIds.has(syn.fromId), `From ID ${syn.fromId} must exist`);
    assert.ok(nodeIds.has(syn.toId), `To ID ${syn.toId} must exist`);
    assert.ok(syn.pathD.startsWith('M'), 'Path must be valid SVG command');
    assert.ok(syn.packetDuration > 0, 'Duration must be positive');
  }
});

test('generateAiLabTopology properly mirrors coordinates for RTL direction', () => {
  const ltrTopology = generateAiLabTopology(1000, 400, false);
  const rtlTopology = generateAiLabTopology(1000, 400, true);

  // Layer 0 in LTR should have small X, in RTL should have large X
  const ltrL0 = ltrTopology.nodes.find((n) => n.layer === 0)!;
  const rtlL0 = rtlTopology.nodes.find((n) => n.layer === 0)!;

  assert.ok(ltrL0.x < 300, 'LTR layer 0 starts on left');
  assert.ok(rtlL0.x > 700, 'RTL layer 0 starts on right');
  assert.equal(ltrL0.x + rtlL0.x, 1000, 'LTR and RTL coordinates should mirror symmetrically');
});

test('generateEngineeringTopology builds distributed pipeline with valid routes', () => {
  const eng = generateEngineeringTopology(1200, 600, false);
  assert.ok(eng.nodes.length >= 8);
  assert.ok(eng.synapses.length >= 6);

  // Check gateway presence
  const gateways = eng.nodes.filter((n) => n.type === 'gateway');
  assert.ok(gateways.length > 0, 'Must have gateway nodes');
});
