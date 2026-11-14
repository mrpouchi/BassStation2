import { CONTROLS } from '@/data/synthesizer/controls';
import { PARAMETERS } from '@/data/synthesizer/parameters';

export interface RegistryStats {
  parameters: number;
  controls: number;
  onKey: number;
  midiDocumented: number;
  midiVerified: number;
  inferredRanges: number;
}

export function computeRegistryStats(): RegistryStats {
  return {
    parameters: PARAMETERS.length,
    controls: CONTROLS.length,
    onKey: PARAMETERS.filter((p) => p.access.kind === 'on-key').length,
    midiDocumented: PARAMETERS.filter((p) => p.midi.mapping !== null).length,
    midiVerified: PARAMETERS.filter((p) => p.midi.verification.endsWith('-verified')).length,
    inferredRanges: PARAMETERS.filter(
      (p) => p.kind === 'continuous' && p.rangeSource === 'inferred',
    ).length,
  };
}
