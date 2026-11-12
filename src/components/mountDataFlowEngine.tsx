/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SAHAND — Dynamic Data-Flow Engine WordPress Mount / Hydration Helper
 *
 * Enables dynamic mounting and unmounting of the React SVG Data-Flow engine
 * into WordPress theme templates (e.g. #sahand-ai-lab-flow, #sahand-engineering-flow).
 */

import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import NeuralDataFlowBackground, { NeuralDataFlowBackgroundProps } from './NeuralDataFlowBackground';

const activeRoots = new Map<Element, Root>();

export interface MountOptions extends NeuralDataFlowBackgroundProps {
  container: string | HTMLElement;
}

/**
 * Dynamically mounts the SVG data-flow visualization engine into a container element.
 */
export function mountDataFlowEngine(options: MountOptions): Root | null {
  const { container, ...props } = options;
  const targetElement = typeof container === 'string' ? document.querySelector(container) : container;

  if (!targetElement) {
    console.warn(`[SAHAND Flow Engine] Target container not found:`, container);
    return null;
  }

  // If already mounted, unmount first
  if (activeRoots.has(targetElement)) {
    activeRoots.get(targetElement)?.unmount();
    activeRoots.delete(targetElement);
  }

  const root = createRoot(targetElement);
  root.render(<NeuralDataFlowBackground {...props} />);
  activeRoots.set(targetElement, root);
  return root;
}

/**
 * Unmounts the data-flow engine from a container.
 */
export function unmountDataFlowEngine(container: string | HTMLElement): boolean {
  const targetElement = typeof container === 'string' ? document.querySelector(container) : container;
  if (!targetElement || !activeRoots.has(targetElement)) {
    return false;
  }

  activeRoots.get(targetElement)?.unmount();
  activeRoots.delete(targetElement);
  return true;
}

/**
 * Auto-initializes data-flow engines on elements containing `data-sahand-data-flow`
 */
export function autoInitDataFlowEngines(): void {
  if (typeof document === 'undefined') return;

  const containers = document.querySelectorAll<HTMLElement>('[data-sahand-data-flow]');
  containers.forEach((el) => {
    const variant = (el.getAttribute('data-sahand-data-flow') || 'ai-lab') as 'ai-lab' | 'engineering';
    const theme = (el.getAttribute('data-theme') || 'dark') as 'dark' | 'light';
    const isRtl = el.getAttribute('dir') === 'rtl' || document.documentElement.dir === 'rtl';

    mountDataFlowEngine({
      container: el,
      variant,
      theme,
      isRtl,
    });
  });
}

// Attach to window for WordPress theme script integration
if (typeof window !== 'undefined') {
  (window as unknown as { SahandDataFlowEngine: unknown }).SahandDataFlowEngine = {
    mount: mountDataFlowEngine,
    unmount: unmountDataFlowEngine,
    autoInit: autoInitDataFlowEngines,
  };
}
