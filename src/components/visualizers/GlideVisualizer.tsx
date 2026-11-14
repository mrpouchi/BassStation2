import { useMemo } from 'react';
import { glidePitch, glideSeconds } from '@/engine/visuals/glide';
import { num, useSynthValues } from '@/hooks/useSynthValues';
import { linear, linePath } from './svg';
import { VizFrame } from './VizFrame';
import s from './VizFrame.module.css';
import { t } from '@/i18n/t';

const W = 480;
const H = 160;
const PAD = 8;

export function GlideVisualizer() {
  const v = useSynthValues(['portamento.glideTime', 'voice.glideDivergence'] as const);
  const glide = num(v['portamento.glideTime']);
  const div = num(v['voice.glideDivergence']);
  const window = Math.max(0.5, Math.min(12, glideSeconds(glide) * (1 + div / 5) * 3 + 0.2));
  const ts = useMemo(
    () => Array.from({ length: 300 }, (_, i) => (i / 299) * window - 0.1),
    [window],
  );
  const osc1 = useMemo(() => ts.map((t) => (t < 0 ? 0 : glidePitch(0, 12, glide, t))), [ts, glide]);
  const osc2 = useMemo(
    () => ts.map((t) => (t < 0 ? 0 : glidePitch(0, 12, glide, t, div))),
    [ts, glide, div],
  );
  const mapX = linear(-0.1, window - 0.1, PAD, W - PAD);
  const mapY = linear(-1, 13, H - 18, PAD);

  return (
    <VizFrame
      title={t('Glide')}
      readout={
        <>
          <span>
            {t('Glide')}{' '}
            <strong>
              {glide === 0
                ? t('Off')
                : `≈ ${glideSeconds(glide) < 1 ? Math.round(glideSeconds(glide) * 1000) + ' ms' : glideSeconds(glide).toFixed(1) + ' s'}`}
            </strong>
          </span>
          {div > 0 && (
            <span>
              {t('Divergence')} <strong>{div}</strong>: {t('Osc 2 lags behind')}
            </span>
          )}
        </>
      }
      caption={t(
        'Pitch moving from C to the C an octave above. Novation does not publish glide times, so this time scale is illustrative.',
      )}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={s.svg}
        role="img"
        aria-label={t('Pitch glide over time')}
      >
        <line x1={mapX(0)} x2={mapX(0)} y1={PAD} y2={H - 18} className={s.marker} />
        <text x={mapX(0) + 4} y={PAD + 10} className={s.tick}>
          new note
        </text>
        <line x1={PAD} x2={W - PAD} y1={mapY(0)} y2={mapY(0)} className={s.grid} />
        <line x1={PAD} x2={W - PAD} y1={mapY(12)} y2={mapY(12)} className={s.grid} />
        <text x={W - PAD} y={mapY(12) - 4} textAnchor="end" className={s.tick}>
          +12 st
        </text>
        {div > 0 && <path d={linePath(ts, osc2, mapX, mapY)} className={s.secondary} />}
        <path d={linePath(ts, osc1, mapX, mapY)} className={s.primary} />
      </svg>
    </VizFrame>
  );
}
