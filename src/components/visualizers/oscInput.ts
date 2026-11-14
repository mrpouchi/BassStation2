import type { ParameterValue } from '@/engine/parameters/types';
import type { OscillatorMixInput } from '@/engine/visuals/oscillatorMix';
import type { OscShape, SubShape } from '@/engine/visuals/waveforms';
import { bool, num, str } from '@/hooks/useSynthValues';

export const OSC_IDS = [
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
  'sub.wave',
  'sub.octave',
  'sub.coarse',
  'sub.fine',
  'mixer.osc1',
  'mixer.osc2',
  'mixer.sub',
  'mixer.noise',
  'mixer.ringMod',
  'voice.oscSync',
] as const;

/** Builds the visual engine input from parameter values (manual pulse width only). */
export function toMixInput(v: Readonly<Record<string, ParameterValue>>): OscillatorMixInput {
  const osc = (n: 1 | 2) => ({
    shape: str(v[`osc${n}.waveform`], 'sawtooth') as OscShape,
    range: str(v[`osc${n}.range`], '8'),
    coarse: num(v[`osc${n}.coarse`]),
    fine: num(v[`osc${n}.fine`]),
    pw: num(v[`osc${n}.pwManual`], 50) / 100,
  });
  return {
    osc1: osc(1),
    osc2: osc(2),
    sub: {
      shape: str(v['sub.wave'], 'sine') as SubShape,
      octave: Number(str(v['sub.octave'], '-1')),
      coarse: num(v['sub.coarse']),
      fine: num(v['sub.fine']),
    },
    levels: {
      osc1: num(v['mixer.osc1']),
      osc2: num(v['mixer.osc2']),
      sub: num(v['mixer.sub']),
      noise: num(v['mixer.noise']),
      ring: num(v['mixer.ringMod']),
    },
    sync: bool(v['voice.oscSync']),
  };
}
