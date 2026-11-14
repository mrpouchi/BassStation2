import { useMemo } from 'react';
import { lfo1PitchSemitones, lfo2FilterOctaves, lfoHz } from '@/engine/visuals/calibration';
import { sampleLfo } from '@/engine/visuals/lfo';
import type { LfoShape } from '@/engine/visuals/waveforms';
import { num, str, useSynthValues } from '@/hooks/useSynthValues';
import { linear, linePath } from './svg';
import { VizFrame } from './VizFrame';
import s from './VizFrame.module.css';

const IDS = [
  'lfo1.waveform',
  'lfo1.speed',
  'lfo1.delay',
  'lfo1.slew',
  'lfo2.waveform',
  'lfo2.speed',
  'lfo2.delay',
  'lfo2.slew',
  'osc1.lfo1Depth',
  'osc2.lfo1Depth',
  'filter.lfo2Depth',
] as const;

const W = 480;
const H = 170;
const PAD = 6;
const PAD_B = 18;
const WINDOW = 2; // seconds

function fmtHz(hz: number) {
  return hz < 10 ? hz.toFixed(2) : hz.toFixed(1);
}

export function LfoVisualizer() {
  const v = useSynthValues(IDS);
  const shape1 = str(v['lfo1.waveform'], 'triangle') as LfoShape;
  const shape2 = str(v['lfo2.waveform'], 'triangle') as LfoShape;
  const [sp1, d1, sl1] = [num(v['lfo1.speed']), num(v['lfo1.delay']), num(v['lfo1.slew'])];
  const [sp2, d2, sl2] = [num(v['lfo2.speed']), num(v['lfo2.delay']), num(v['lfo2.slew'])];
  // Above ~40 Hz the shape is unreadable in a 2 s window; sample more densely.
  const points = (hz: number) => Math.min(4000, Math.max(400, Math.ceil(hz * WINDOW * 24)));
  const a = useMemo(
    () =>
      sampleLfo({ shape: shape1, speed: sp1, delay: d1, slew: sl1 }, WINDOW, points(lfoHz(sp1))),
    [shape1, sp1, d1, sl1],
  );
  const b = useMemo(
    () =>
      sampleLfo({ shape: shape2, speed: sp2, delay: d2, slew: sl2 }, WINDOW, points(lfoHz(sp2))),
    [shape2, sp2, d2, sl2],
  );

  const mapX = linear(0, WINDOW, PAD, W - PAD);
  const rowH = (H - PAD_B - PAD) / 2;
  const map1 = linear(-1.1, 1.1, PAD + rowH, PAD);
  const map2 = linear(-1.1, 1.1, PAD + 2 * rowH, PAD + rowH);
  const pitch1 = lfo1PitchSemitones(num(v['osc1.lfo1Depth']));
  const filterOct = lfo2FilterOctaves(num(v['filter.lfo2Depth']));

  return (
    <VizFrame
      title="LFOs"
      readout={
        <>
          <span>
            LFO 1 <strong>≈ {fmtHz(lfoHz(sp1))} Hz</strong> → Osc 1 pitch{' '}
            <strong>±{Math.abs(pitch1).toFixed(1)} st</strong>
          </span>
          <span>
            LFO 2 <strong>≈ {fmtHz(lfoHz(sp2))} Hz</strong> → filter{' '}
            <strong>±{Math.abs(filterOct).toFixed(2)} oct</strong>
          </span>
        </>
      }
      caption="Two seconds after a key press, including delay fade-in and slew. The depth readouts use the manual's calibration (LFO 1: 32 = one octave; LFO 2 → filter: 16 = one octave). The Hz values interpolate the documented points (52 ≈ 3 Hz, 75 ≈ 7.9 Hz, max ≈ 190 Hz). In Sync mode the rate follows the tempo instead."
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={s.svg}
        role="img"
        aria-label="LFO 1 and LFO 2 over time"
      >
        <line x1={PAD} x2={W - PAD} y1={map1(0)} y2={map1(0)} className={s.grid} />
        <line x1={PAD} x2={W - PAD} y1={map2(0)} y2={map2(0)} className={s.grid} />
        <text x={PAD} y={PAD + 10} className={s.tick}>
          LFO 1
        </text>
        <text x={PAD} y={PAD + rowH + 10} className={s.tick}>
          LFO 2
        </text>
        <path d={linePath(a.t, a.y, mapX, map1)} className={s.primary} />
        <path d={linePath(b.t, b.y, mapX, map2)} className={s.secondary} />
        <text x={W - PAD} y={H - 4} textAnchor="end" className={s.tick}>
          2 s
        </text>
        <text x={PAD} y={H - 4} className={s.tick}>
          key down
        </text>
      </svg>
    </VizFrame>
  );
}
