import { ArpVisualizer } from './ArpVisualizer';
import { EnvelopeVisualizer } from './EnvelopeVisualizer';
import { FilterVisualizer } from './FilterVisualizer';
import { GlideVisualizer } from './GlideVisualizer';
import { KeyRangeVisualizer } from './KeyRangeVisualizer';
import { LfoVisualizer } from './LfoVisualizer';
import { WaveformVisualizer } from './WaveformVisualizer';

export type VisualKind = 'waveform' | 'filter' | 'envelope' | 'lfo' | 'arp' | 'glide' | 'keyboard';

export function LessonVisual({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case 'waveform':
      return <WaveformVisualizer />;
    case 'filter':
      return <FilterVisualizer />;
    case 'envelope':
      return <EnvelopeVisualizer />;
    case 'lfo':
      return <LfoVisualizer />;
    case 'arp':
      return <ArpVisualizer />;
    case 'glide':
      return <GlideVisualizer />;
    case 'keyboard':
      return <KeyRangeVisualizer />;
  }
}
