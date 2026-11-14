import type { ReactNode } from 'react';
import { ParameterEditor } from '@/components/controls/ParameterEditor';
import { Card } from '@/components/ui/Card';
import { EnvelopeVisualizer } from '@/components/visualizers/EnvelopeVisualizer';
import { FilterVisualizer } from '@/components/visualizers/FilterVisualizer';
import { LfoVisualizer } from '@/components/visualizers/LfoVisualizer';
import { WaveformVisualizer } from '@/components/visualizers/WaveformVisualizer';
import { getParameter } from '@/engine/parameters/registry';
import { useSynthStore } from '@/stores/synthStore';
import styles from './LearningView.module.css';

/**
 * Learning View: the same parameter model as the Hardware View, laid out in
 * signal-flow order with plain-language hints and the matching visualiser.
 */
interface Stage {
  id: string;
  title: string;
  intro: string;
  columns: { title?: string; params: string[] }[];
  visual: ReactNode;
}

const STAGES: Stage[] = [
  {
    id: 'source',
    title: 'Sound source: oscillators',
    intro:
      'Every sound starts as a raw waveform. Choose its shape (which harmonics it has) and pitch. Both oscillators are shown side by side here. On the panel they share one set of controls.',
    columns: [
      {
        title: 'Oscillator 1',
        params: ['osc1.waveform', 'osc1.range', 'osc1.coarse', 'osc1.fine', 'osc1.pwManual'],
      },
      {
        title: 'Oscillator 2',
        params: [
          'osc2.waveform',
          'osc2.range',
          'osc2.coarse',
          'osc2.fine',
          'osc2.pwManual',
          'voice.oscSync',
        ],
      },
    ],
    visual: <WaveformVisualizer />,
  },
  {
    id: 'mixer',
    title: 'Mixer: blend the sources',
    intro:
      'Set how much of each source reaches the filter. The sub oscillator adds weight below Osc 1. Noise and the ring modulator add texture.',
    columns: [
      {
        title: 'Levels',
        params: ['mixer.osc1', 'mixer.osc2', 'mixer.sub', 'mixer.noise', 'mixer.ringMod'],
      },
      { title: 'Sub oscillator', params: ['sub.octave', 'sub.wave'] },
    ],
    visual: <WaveformVisualizer />,
  },
  {
    id: 'filter',
    title: 'Filter: sculpt the tone',
    intro:
      'Subtractive synthesis means removing harmonics. Watch the bars: the filter curve decides which harmonics survive.',
    columns: [
      { params: ['filter.type', 'filter.shape', 'filter.slope'] },
      { params: ['filter.frequency', 'filter.resonance', 'filter.overdrive'] },
    ],
    visual: <FilterVisualizer />,
  },
  {
    id: 'envelopes',
    title: 'Envelopes: shape over time',
    intro:
      'The Amp Envelope shapes the volume of every note. The Mod Envelope can sweep the filter or the pitch as the note plays.',
    columns: [
      {
        title: 'Amp Env',
        params: ['ampEnv.attack', 'ampEnv.decay', 'ampEnv.sustain', 'ampEnv.release'],
      },
      {
        title: 'Mod Env',
        params: [
          'modEnv.attack',
          'modEnv.decay',
          'modEnv.sustain',
          'modEnv.release',
          'filter.modEnvDepth',
        ],
      },
    ],
    visual: <EnvelopeVisualizer />,
  },
  {
    id: 'modulation',
    title: 'Modulation: add movement',
    intro:
      'LFOs repeat a slow wave to make things move. LFO 1 drives pitch (vibrato). LFO 2 drives the filter (wah, wobble) and pulse width.',
    columns: [
      {
        title: 'LFO 1 → pitch',
        params: ['lfo1.waveform', 'lfo1.speed', 'lfo1.delay', 'osc1.lfo1Depth', 'osc2.lfo1Depth'],
      },
      {
        title: 'LFO 2 → filter / PW',
        params: ['lfo2.waveform', 'lfo2.speed', 'filter.lfo2Depth', 'osc1.pwLfo2', 'osc2.pwLfo2'],
      },
    ],
    visual: <LfoVisualizer />,
  },
];

function ParamRow({ id }: { id: string }) {
  const def = getParameter(id);
  const select = useSynthStore((s) => s.select);
  return (
    <div className={styles.param}>
      <button
        type="button"
        className={styles.paramName}
        onClick={() => select(id)}
        title="Explain this parameter"
      >
        {def.name}
      </button>
      <ParameterEditor id={id} />
    </div>
  );
}

export function LearningView() {
  return (
    <div className={styles.stack}>
      <nav className={styles.flow} aria-label="Signal flow">
        Signal flow:
        {STAGES.map((s, i) => (
          <span key={s.id} style={{ display: 'contents' }}>
            {i > 0 && <span aria-hidden>→</span>}
            <a className={styles.flowStep} href={`#stage-${s.id}`}>
              {s.title.split(':')[0]}
            </a>
          </span>
        ))}
      </nav>
      {STAGES.map((stage, i) => (
        <Card
          key={stage.id}
          title={stage.title}
          actions={<span className={styles.step}>{String(i + 1).padStart(2, '0')}</span>}
        >
          <div id={`stage-${stage.id}`} className={styles.stage}>
            <p className={styles.hint}>{stage.intro}</p>
            {stage.visual}
            <div>
              <div className={styles.columns}>
                {stage.columns.map((col, j) => (
                  <div key={j}>
                    {col.title && <p className={styles.columnTitle}>{col.title}</p>}
                    <div className={styles.params}>
                      {col.params.map((id) => (
                        <ParamRow key={id} id={id} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
