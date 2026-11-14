import { useMemo, useState } from 'react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { oscSemitones } from '@/engine/visuals/calibration';
import { midiToHz, noteName } from '@/engine/visuals/notes';
import { sampleMix } from '@/engine/visuals/oscillatorMix';
import { useSynthValues } from '@/hooks/useSynthValues';
import { useHardwareUiStore } from '@/stores/hardwareUiStore';
import { OSC_IDS, toMixInput } from './oscInput';
import { linear, linePath } from './svg';
import { VizFrame } from './VizFrame';
import s from './VizFrame.module.css';

type Layer = 'mix' | 'sources';
const W = 480;
const H = 180;
const PAD = 8;

export function WaveformVisualizer() {
  const values = useSynthValues(OSC_IDS);
  const note = useHardwareUiStore((st) => st.playedNote) ?? 57;
  const [layer, setLayer] = useState<Layer>('mix');
  const input = useMemo(() => toMixInput(values), [values]);
  const data = useMemo(() => sampleMix(input, 2, 640), [input]);

  const mapX = linear(0, 2, PAD, W - PAD);
  const mapY = linear(-1.15, 1.15, H - PAD, PAD);
  const silent = Object.values(input.levels).every((l) => l === 0);
  const osc1Hz =
    midiToHz(note) *
    Math.pow(2, oscSemitones(input.osc1.range, input.osc1.coarse, input.osc1.fine) / 12);

  return (
    <VizFrame
      title="Waveform"
      controls={
        <SegmentedControl
          label="Waveform layers"
          value={layer}
          onChange={setLayer}
          options={[
            { value: 'mix', label: 'Mixer output' },
            { value: 'sources', label: 'Sources' },
          ]}
        />
      }
      readout={
        <>
          <span>
            Note <strong>{noteName(note)}</strong>
          </span>
          <span>
            Osc 1{' '}
            <strong>
              {osc1Hz < 1000 ? osc1Hz.toFixed(1) : (osc1Hz / 1000).toFixed(2) + 'k'} Hz
            </strong>
          </span>
          {input.sync && (
            <span>
              <strong>Sync on</strong>: Osc 2 restarts with every Osc 1 cycle
            </span>
          )}
        </>
      }
      caption="Two cycles of Oscillator 1. The mix is scaled to fit, so its shape stays readable. Real analog waveforms have rounded edges and drift. Play a key on the panel to change the note."
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={s.svg}
        role="img"
        aria-label="Oscillator waveform plot"
      >
        <line x1={PAD} x2={W - PAD} y1={mapY(0)} y2={mapY(0)} className={s.axis} />
        <line x1={mapX(1)} x2={mapX(1)} y1={PAD} y2={H - PAD} className={s.grid} />
        {layer === 'mix' ? (
          silent ? (
            <text x={W / 2} y={H / 2 - 12} textAnchor="middle" className={s.tick}>
              All mixer levels are at zero, so there is no signal.
            </text>
          ) : (
            <path d={linePath(data.x, data.mix, mapX, mapY)} className={s.primary} />
          )
        ) : (
          <>
            <path d={linePath(data.x, data.osc1, mapX, mapY)} className={s.primary} />
            <path d={linePath(data.x, data.osc2, mapX, mapY)} className={s.secondary} />
            <path d={linePath(data.x, data.sub, mapX, mapY)} className={s.tertiary} />
          </>
        )}
      </svg>
      {layer === 'sources' && (
        <div className={s.legend}>
          <span>
            <i className={s.swatch} style={{ background: 'var(--accent)' }} />
            Osc 1
          </span>
          <span>
            <i className={s.swatch} style={{ background: 'var(--info)' }} />
            Osc 2
          </span>
          <span>
            <i className={s.swatch} style={{ background: 'var(--success)' }} />
            Sub
          </span>
        </div>
      )}
    </VizFrame>
  );
}
