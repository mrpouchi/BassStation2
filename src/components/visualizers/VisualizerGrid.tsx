import { EnvelopeVisualizer } from './EnvelopeVisualizer';
import { FilterVisualizer } from './FilterVisualizer';
import { LfoVisualizer } from './LfoVisualizer';
import { WaveformVisualizer } from './WaveformVisualizer';

export function VisualizerGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
        gap: 16,
      }}
    >
      <WaveformVisualizer />
      <FilterVisualizer />
      <EnvelopeVisualizer />
      <LfoVisualizer />
    </div>
  );
}
