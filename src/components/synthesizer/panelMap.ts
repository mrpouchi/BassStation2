import { KEYBOARD } from './layout';

/**
 * Centre of every physical control, in the manual-figure coordinates used by
 * layout.ts. The virtual panel and the mini-map locator both read this table,
 * so they can never disagree about where a control is.
 */
export const CONTROL_POSITIONS: Readonly<Record<string, { x: number; y: number }>> = {
  // Master
  'master.volume': { x: 240, y: 185 },
  'master.display': { x: 311, y: 178 },
  'master.orgValue': { x: 340, y: 178 },
  'master.save': { x: 291, y: 206 },
  'master.patchDown': { x: 321, y: 207 },
  'master.patchUp': { x: 339, y: 207 },
  // Oscillators
  'osc.coarse': { x: 382, y: 182 },
  'osc.range': { x: 384, y: 218 },
  'osc.fine': { x: 421, y: 182 },
  'osc.waveform': { x: 422, y: 218 },
  'osc.modEnvDepth': { x: 462, y: 182 },
  'osc.lfo1Depth': { x: 500, y: 182 },
  'osc.pulseWidth': { x: 538, y: 182 },
  'osc.pwSource': { x: 540, y: 219 },
  'osc.select': { x: 476, y: 225 },
  'osc.syncLed': { x: 512, y: 227 },
  // Sub oscillator
  'sub.octave': { x: 578, y: 176 },
  'sub.wave': { x: 578, y: 218 },
  // Mixer
  'mixer.osc1': { x: 609, y: 178 },
  'mixer.osc2': { x: 663, y: 178 },
  'mixer.sub': { x: 609, y: 214 },
  'mixer.source': { x: 636, y: 203 },
  'mixer.sourceLevel': { x: 663, y: 214 },
  // Filter
  'filter.type': { x: 710, y: 168 },
  'filter.slope': { x: 710, y: 198 },
  'filter.shape': { x: 710, y: 226 },
  'filter.overdrive': { x: 755, y: 178 },
  'filter.resonance': { x: 795, y: 178 },
  'filter.modEnvDepth': { x: 755, y: 214 },
  'filter.lfo2Depth': { x: 795, y: 214 },
  'filter.frequency': { x: 848, y: 195 },
  // Arpeggiator
  'arp.tempo': { x: 240, y: 262 },
  'arp.rhythm': { x: 290, y: 262 },
  'arp.mode': { x: 330, y: 260 },
  'arp.octaves': { x: 330, y: 292 },
  'arp.on': { x: 248, y: 299 },
  'arp.latch': { x: 282, y: 299 },
  // Portamento
  'portamento.glideTime': { x: 379, y: 264 },
  // LFOs
  'lfo1.wave': { x: 418, y: 268 },
  'lfo1.knob': { x: 455, y: 262 },
  'lfo.delaySpeed': { x: 479, y: 288 },
  'lfo2.knob': { x: 505, y: 262 },
  'lfo2.wave': { x: 538, y: 268 },
  // Envelopes
  'env.select': { x: 590, y: 272 },
  'env.attack': { x: 634, y: 276 },
  'env.decay': { x: 662, y: 276 },
  'env.sustain': { x: 690, y: 276 },
  'env.release': { x: 718, y: 276 },
  'env.triggering': { x: 768, y: 274 },
  // Effects
  'effects.distortion': { x: 823, y: 262 },
  'effects.oscFilterMod': { x: 859, y: 262 },
  // Keyboard area
  'performance.transpose': { x: 232, y: 331 },
  'performance.function': { x: 283, y: 333 },
  'performance.octaveDown': { x: 246, y: 361 },
  'performance.octaveUp': { x: 262, y: 361 },
  'performance.pitchWheel': { x: 232, y: 455 },
  'performance.modWheel': { x: 282, y: 455 },
  keyboard: { x: (KEYBOARD.x1 + KEYBOARD.x2) / 2, y: (KEYBOARD.y1 + KEYBOARD.y2) / 2 },
};

export function pos(controlId: string): { x: number; y: number } {
  const p = CONTROL_POSITIONS[controlId];
  if (!p) throw new Error(`No panel position for control ${controlId}`);
  return p;
}

const WHITE_PATTERN = [0, 2, 4, 5, 7, 9, 11];
const BLACK_OFFSETS: Record<number, number> = { 1: 0, 3: 1, 6: 3, 8: 4, 10: 5 };
export const WHITE_KEY_W = (KEYBOARD.x2 - KEYBOARD.x1) / 15;
export const BLACK_KEY_W = WHITE_KEY_W * 0.6;

export interface KeyGeom {
  index: number;
  black: boolean;
  /** Centre x, image px. */
  center: number;
  left: number;
  width: number;
}

/** The 25 keys, lowest first. */
export const KEYS: readonly KeyGeom[] = Array.from({ length: 25 }, (_, index) => {
  const octave = Math.floor(index / 12);
  const pc = index % 12;
  const blackAfter = BLACK_OFFSETS[pc];
  if (blackAfter === undefined) {
    const whiteIndex = octave * 7 + WHITE_PATTERN.indexOf(pc);
    const left = KEYBOARD.x1 + whiteIndex * WHITE_KEY_W;
    return { index, black: false, center: left + WHITE_KEY_W / 2, left, width: WHITE_KEY_W };
  }
  const boundary = KEYBOARD.x1 + (octave * 7 + blackAfter + 1) * WHITE_KEY_W;
  return {
    index,
    black: true,
    center: boundary,
    left: boundary - BLACK_KEY_W / 2,
    width: BLACK_KEY_W,
  };
});
