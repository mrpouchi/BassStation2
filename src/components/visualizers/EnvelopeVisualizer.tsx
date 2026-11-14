import { attackSeconds, decaySeconds, releaseSeconds } from '@/engine/visuals/calibration';
import { useMemo } from 'react';
import { envelopeDuration, envelopeLevel, type EnvelopeSettings } from '@/engine/visuals/envelope';
import { bool, num, str, useSynthValues } from '@/hooks/useSynthValues';
import { linear, linePath } from './svg';
import { VizFrame } from './VizFrame';
import s from './VizFrame.module.css';

const IDS = [
  'ampEnv.attack',
  'ampEnv.decay',
  'ampEnv.sustain',
  'ampEnv.release',
  'ampEnv.fixedDuration',
  'modEnv.attack',
  'modEnv.decay',
  'modEnv.sustain',
  'modEnv.release',
  'modEnv.fixedDuration',
  'panel.envSelect',
] as const;

const W = 480;
const H = 170;
const PAD_B = 18;
const PAD = 6;

function settings(v: Readonly<Record<string, unknown>>, p: 'ampEnv' | 'modEnv'): EnvelopeSettings {
  return {
    attack: num(v[`${p}.attack`] as number),
    decay: num(v[`${p}.decay`] as number),
    sustain: num(v[`${p}.sustain`] as number, 127),
    release: num(v[`${p}.release`] as number),
    fixedDuration: bool(v[`${p}.fixedDuration`] as boolean),
  };
}

function fmt(sec: number): string {
  return sec < 1 ? `${Math.round(sec * 1000)} ms` : `${sec.toFixed(1)} s`;
}

export function EnvelopeVisualizer() {
  const v = useSynthValues(IDS);
  const amp = useMemo(() => settings(v, 'ampEnv'), [v]);
  const mod = useMemo(() => settings(v, 'modEnv'), [v]);
  const focus = str(v['panel.envSelect'], 'amp');
  // Hold the key long enough to show attack + decay, then a little sustain (0.25–4 s).
  const GATE = Math.min(
    4,
    Math.max(
      0.25,
      Math.max(attackOf(amp) + decayOf(amp), attackOf(mod) + decayOf(mod)) * 1.4 + 0.1,
    ),
  );

  const total = Math.min(
    Math.max(envelopeDuration(amp, GATE), envelopeDuration(mod, GATE), GATE * 1.5),
    25,
  );
  const ts = useMemo(() => Array.from({ length: 400 }, (_, i) => (i / 399) * total), [total]);
  const ampY = useMemo(() => ts.map((t) => envelopeLevel(amp, t, GATE)), [ts, amp, GATE]);
  const modY = useMemo(() => ts.map((t) => envelopeLevel(mod, t, GATE)), [ts, mod, GATE]);

  const mapX = linear(0, total, PAD, W - PAD);
  const mapY = linear(0, 1, H - PAD_B, PAD);
  const showAmp = focus !== 'mod';
  const showMod = focus !== 'amp';

  return (
    <VizFrame
      title="Envelopes"
      readout={
        <>
          <span>
            Amp A/D/R{' '}
            <strong>
              {fmt(attackOf(amp))} · {fmt(decayOf(amp))} · {fmt(releaseOf(amp))}
            </strong>
          </span>
          <span>
            Mod A/D/R{' '}
            <strong>
              {fmt(attackOf(mod))} · {fmt(decayOf(mod))} · {fmt(releaseOf(mod))}
            </strong>
          </span>
        </>
      }
      caption="Level over time for one held note (dashed line = key released, timed to show the whole shape). The mid-travel times (attack ≈ 250 ms, decay ≈ 150 ms, release ≈ 360 ms) come from the manual. Other points are interpolated. The Env Select switch decides which curve is highlighted."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className={s.svg} role="img" aria-label="Envelope curves">
        <line x1={PAD} x2={W - PAD} y1={mapY(0)} y2={mapY(0)} className={s.axis} />
        <line x1={mapX(GATE)} x2={mapX(GATE)} y1={PAD} y2={H - PAD_B} className={s.marker} />
        <text x={mapX(GATE) + 4} y={PAD + 10} className={s.tick}>
          key up
        </text>
        <text x={W - PAD} y={H - 4} textAnchor="end" className={s.tick}>
          {fmt(total)}
        </text>
        <text x={PAD} y={H - 4} className={s.tick}>
          0
        </text>
        <path d={linePath(ts, modY, mapX, mapY)} className={showMod ? s.secondary : s.ghost} />
        <path d={linePath(ts, ampY, mapX, mapY)} className={showAmp ? s.primary : s.ghost} />
      </svg>
      <div className={s.legend}>
        <span>
          <i className={s.swatch} style={{ background: 'var(--accent)' }} />
          Amp Env
        </span>
        <span>
          <i className={s.swatch} style={{ background: 'var(--info)' }} />
          Mod Env
        </span>
      </div>
    </VizFrame>
  );
}

const attackOf = (e: EnvelopeSettings) => attackSeconds(e.attack);
const decayOf = (e: EnvelopeSettings) => decaySeconds(e.decay);
const releaseOf = (e: EnvelopeSettings) => releaseSeconds(e.release);
