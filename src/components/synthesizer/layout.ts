import type { CSSProperties } from 'react';

/**
 * Coordinates are measured in pixels on the hardware-overview figure of the
 * Bass Station II user guide v5.0 (p. 8), whose panel spans x 185–915 and
 * y 140–575 (top panel + keyboard). The virtual panel keeps this aspect ratio,
 * so every control sits where it does on the real instrument.
 */
export const PANEL = { x0: 185, y0: 140, width: 730, height: 435 } as const;

export function at(x: number, y: number): CSSProperties {
  return {
    left: `${((x - PANEL.x0) / PANEL.width) * 100}%`,
    top: `${((y - PANEL.y0) / PANEL.height) * 100}%`,
  };
}

/** Horizontal span (for section bars and strips). */
export function span(x1: number, x2: number, y: number): CSSProperties {
  return {
    left: `${((x1 - PANEL.x0) / PANEL.width) * 100}%`,
    width: `${((x2 - x1) / PANEL.width) * 100}%`,
    top: `${((y - PANEL.y0) / PANEL.height) * 100}%`,
  };
}

export interface SectionBar {
  label: string;
  x1: number;
  x2: number;
  y: number;
}

/** Cyan section header bars: top row above the controls, second row below. */
export const SECTION_BARS: readonly SectionBar[] = [
  { label: 'Master', x1: 190, x2: 362, y: 150 },
  { label: 'Oscillators', x1: 367, x2: 556, y: 150 },
  { label: 'Sub Osc', x1: 562, x2: 596, y: 150 },
  { label: 'Mixer', x1: 600, x2: 681, y: 150 },
  { label: 'Filter', x1: 686, x2: 884, y: 150 },
  { label: 'Arpeggiator', x1: 205, x2: 357, y: 315 },
  { label: 'Porta', x1: 361, x2: 398, y: 315 },
  { label: 'LFOs', x1: 402, x2: 556, y: 315 },
  { label: 'Envelopes', x1: 561, x2: 800, y: 315 },
  { label: 'Effects', x1: 805, x2: 884, y: 315 },
];

/** Keyboard geometry: 15 white keys spanning x 312–885, y 347–575. */
export const KEYBOARD = { x1: 312, x2: 885, y1: 347, y2: 575 } as const;
