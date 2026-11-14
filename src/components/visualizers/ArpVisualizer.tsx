import { useMemo } from 'react';
import { arpSequence, type ArpMode } from '@/engine/visuals/arp';
import { noteName } from '@/engine/visuals/notes';
import { bool, num, str, useSynthValues } from '@/hooks/useSynthValues';
import { linear } from './svg';
import { VizFrame } from './VizFrame';
import s from './VizFrame.module.css';
import { t } from '@/i18n/t';

const W = 480;
const H = 170;
const STEPS = 16;
/** Example chord: E, C, G played in that order (C major). */
const HELD = [52, 48, 55];

export function ArpVisualizer() {
  const v = useSynthValues(['arp.on', 'arp.mode', 'arp.octaves'] as const);
  const rawMode = str(v['arp.mode'], 'up');
  const sequencerMode = rawMode === 'record' || rawMode === 'play';
  const mode = (sequencerMode ? 'up' : rawMode) as ArpMode;
  const octaves = num(v['arp.octaves'], 1);
  const seq = useMemo(() => arpSequence(HELD, mode, octaves, STEPS), [mode, octaves]);
  const lo = Math.min(...HELD);
  const hi = Math.max(...HELD) + 12 * (octaves - 1);
  const mapX = linear(0, STEPS, 8, W - 8);
  const mapY = linear(lo - 1, hi + 1, H - 20, 8);
  const cell = (W - 16) / STEPS;

  return (
    <VizFrame
      title={t('Arpeggio pattern')}
      readout={
        <>
          <span>
            {t('Held chord')} <strong>{HELD.map(noteName).join(' ')}</strong>{' '}
            {t('(played E, C, G)')}
          </span>
          <span>
            {t('Mode')} <strong>{sequencerMode ? t('sequencer (shown as Up)') : rawMode}</strong>
          </span>
          <span>
            Arp <strong>{bool(v['arp.on']) ? t('On') : t('Off')}</strong>
          </span>
        </>
      }
      caption={t(
        'Note order for the first 16 steps, following the Arp Mode table (p. 52). Every step is drawn the same length here. The Rhythm pattern decides the real timing, rests and accents. Random uses a fixed example sequence.',
      )}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={s.svg}
        role="img"
        aria-label={t('Arpeggiator note order')}
      >
        {Array.from({ length: hi - lo + 3 }, (_, i) => lo - 1 + i).map((n) => (
          <line key={n} x1={8} x2={W - 8} y1={mapY(n)} y2={mapY(n)} className={s.grid} />
        ))}
        {seq.map((n, i) => (
          <rect
            key={i}
            x={mapX(i) + 1}
            y={mapY(n) - 4}
            width={cell - 3}
            height={8}
            rx={2}
            className={s.barOut}
          />
        ))}
        {Array.from({ length: STEPS / 4 + 1 }, (_, i) => (
          <line key={i} x1={mapX(i * 4)} x2={mapX(i * 4)} y1={8} y2={H - 20} className={s.axis} />
        ))}
        <text x={8} y={H - 4} className={s.tick}>
          step 1
        </text>
        <text x={W - 8} y={H - 4} textAnchor="end" className={s.tick}>
          16
        </text>
      </svg>
    </VizFrame>
  );
}
