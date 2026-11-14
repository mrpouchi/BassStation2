import { LOWEST_KEY_MIDI, midiToHz, noteName } from '@/engine/visuals/notes';
import { num, useSynthValues } from '@/hooks/useSynthValues';
import { VizFrame } from './VizFrame';
import s from './VizFrame.module.css';

const W = 480;
const H = 120;
const FIRST = 12; // C-1 in Novation naming… drawing span C0–C8 (MIDI 24–108)
const LAST = 108;

export function KeyRangeVisualizer() {
  const v = useSynthValues(['performance.octave', 'performance.transpose'] as const);
  const shift = num(v['performance.octave']) * 12 + num(v['performance.transpose']);
  const low = LOWEST_KEY_MIDI + shift;
  const high = low + 24;
  const x = (m: number) => 8 + ((m - FIRST) / (LAST - FIRST)) * (W - 16);
  const whites = [] as number[];
  for (let m = FIRST; m <= LAST; m++) if ([0, 2, 4, 5, 7, 9, 11].includes(m % 12)) whites.push(m);

  return (
    <VizFrame
      title="Keyboard range"
      readout={
        <>
          <span>
            25 keys play{' '}
            <strong>
              {noteName(low)} – {noteName(high)}
            </strong>
          </span>
          <span>
            Lowest key <strong>{midiToHz(low).toFixed(1)} Hz</strong> at 8'
          </span>
        </>
      }
      caption="Where the two-octave keyboard sits in the full MIDI range. Octave shifts move it in 12-semitone steps (−4 to +5) and Transpose in single semitones (±12). Note names follow Novation's convention (A3 = 440 Hz)."
    >
      <svg viewBox={`0 0 ${W} ${H}`} className={s.svg} role="img" aria-label="Keyboard range">
        <rect
          x={x(low)}
          y={14}
          width={x(high + 1) - x(low)}
          height={70}
          rx={3}
          className={s.area}
        />
        {whites.map((m) => (
          <line
            key={m}
            x1={x(m)}
            x2={x(m)}
            y1={20}
            y2={80}
            className={m % 12 === 0 ? s.axis : s.grid}
          />
        ))}
        {whites
          .filter((m) => m % 12 === 0)
          .map((m) => (
            <text key={m} x={x(m)} y={H - 18} textAnchor="middle" className={s.tick}>
              {noteName(m)}
            </text>
          ))}
        <line x1={x(low)} x2={x(low)} y1={10} y2={88} className={s.primary} />
        <line x1={x(high)} x2={x(high)} y1={10} y2={88} className={s.primary} />
      </svg>
    </VizFrame>
  );
}
