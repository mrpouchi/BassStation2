import { useMemo } from 'react';
import { modelFromValues } from './filterModel';
import { oscSemitones } from '@/engine/visuals/calibration';
import { filterGain, logFrequencies, responseCurve, toDb } from '@/engine/visuals/filter';
import { midiToHz } from '@/engine/visuals/notes';
import { harmonicAmplitudes, type OscShape } from '@/engine/visuals/waveforms';
import { num, str, useSynthValues } from '@/hooks/useSynthValues';
import { useHardwareUiStore } from '@/stores/hardwareUiStore';
import { clamp, linear, linePath, logScale } from './svg';
import { VizFrame } from './VizFrame';
import s from './VizFrame.module.css';

const IDS = [
  'filter.type',
  'filter.shape',
  'filter.slope',
  'filter.frequency',
  'filter.resonance',
  'osc1.waveform',
  'osc1.range',
  'osc1.coarse',
  'osc1.fine',
  'osc1.pwManual',
  'osc2.waveform',
  'osc2.range',
  'osc2.coarse',
  'osc2.fine',
  'osc2.pwManual',
  'mixer.osc1',
  'mixer.osc2',
] as const;

const W = 480;
const H = 200;
const PAD_L = 30;
const PAD_B = 18;
const F_MIN = 20;
const F_MAX = 20000;
const DB_MIN = -60;
const DB_MAX = 30;
const FREQS = logFrequencies(F_MIN, F_MAX, 240);

export function FilterVisualizer() {
  const v = useSynthValues(IDS);
  const note = useHardwareUiStore((st) => st.playedNote) ?? 57;
  const model = useMemo(() => modelFromValues(v), [v]);
  const curve = useMemo(() => responseCurve(model, FREQS), [model]);

  const mapX = logScale(F_MIN, F_MAX, PAD_L, W - 4);
  const mapY = linear(DB_MIN, DB_MAX, H - PAD_B, 4);
  const yDb = (db: number) => mapY(clamp(db, DB_MIN, DB_MAX));

  const bars = useMemo(() => {
    const out: { hz: number; inDb: number; outDb: number; osc: 1 | 2 }[] = [];
    for (const n of [1, 2] as const) {
      const level = num(v[`mixer.osc${n}`]) / 255;
      if (level === 0) continue;
      const f0 =
        midiToHz(note) *
        Math.pow(
          2,
          oscSemitones(
            str(v[`osc${n}.range`], '8'),
            num(v[`osc${n}.coarse`]),
            num(v[`osc${n}.fine`]),
          ) / 12,
        );
      const amps = harmonicAmplitudes(
        str(v[`osc${n}.waveform`], 'sawtooth') as OscShape,
        40,
        num(v[`osc${n}.pwManual`], 50) / 100,
      );
      amps.forEach((a, i) => {
        const hz = f0 * (i + 1);
        if (a <= 0.001 || hz > F_MAX) return;
        const inDb = toDb(a * level);
        out.push({ hz, inDb, outDb: inDb + toDb(filterGain(model, hz)), osc: n });
      });
    }
    return out;
  }, [v, note, model]);

  const acid = v['filter.type'] === 'acid';
  const area = `${linePath(FREQS, curve, mapX, yDb)}L${W - 4},${H - PAD_B}L${PAD_L},${H - PAD_B}Z`;
  const fc = model.cutoffHz;

  return (
    <VizFrame
      title="Filter response"
      readout={
        <>
          <span>
            Type{' '}
            <strong>
              {acid
                ? 'Acid (LP 24)'
                : `${model.shape.toUpperCase()} ${model.poles === 4 ? 24 : 12} dB`}
            </strong>
          </span>
          <span>
            Cutoff <strong>≈ {fc < 1000 ? fc.toFixed(0) : (fc / 1000).toFixed(1) + 'k'} Hz</strong>
          </span>
          <span>
            Peak <strong>{Math.max(...curve).toFixed(1)} dB</strong>
          </span>
        </>
      }
      caption="Line: idealised filter curve. Bars: harmonics of the oscillators mixed in, grey before the filter and coloured after it. The cutoff and resonance-to-Hz mappings are illustrative. The manual does not publish them."
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={s.svg}
        role="img"
        aria-label="Filter frequency response"
      >
        {[100, 1000, 10000].map((f) => (
          <g key={f}>
            <line x1={mapX(f)} x2={mapX(f)} y1={4} y2={H - PAD_B} className={s.grid} />
            <text x={mapX(f)} y={H - 4} textAnchor="middle" className={s.tick}>
              {f >= 1000 ? `${f / 1000}k` : f}
            </text>
          </g>
        ))}
        {[-48, -24, 0, 24].map((db) => (
          <g key={db}>
            <line
              x1={PAD_L}
              x2={W - 4}
              y1={mapY(db)}
              y2={mapY(db)}
              className={db === 0 ? s.axis : s.grid}
            />
            <text x={PAD_L - 4} y={mapY(db) + 3} textAnchor="end" className={s.tick}>
              {db}
            </text>
          </g>
        ))}
        {bars.map((b, i) => (
          <g key={i}>
            <rect
              x={mapX(b.hz) - 1}
              width={2}
              y={yDb(b.inDb)}
              height={Math.max(0, H - PAD_B - yDb(b.inDb))}
              className={s.barIn}
            />
            <rect
              x={mapX(b.hz) - 1}
              width={2}
              y={yDb(b.outDb)}
              height={Math.max(0, H - PAD_B - yDb(b.outDb))}
              className={b.osc === 1 ? s.barOut : s.barOut2}
            />
          </g>
        ))}
        <path d={area} className={s.area} />
        <path d={linePath(FREQS, curve, mapX, yDb)} className={s.primary} />
        <line x1={mapX(fc)} x2={mapX(fc)} y1={4} y2={H - PAD_B} className={s.marker} />
      </svg>
    </VizFrame>
  );
}
