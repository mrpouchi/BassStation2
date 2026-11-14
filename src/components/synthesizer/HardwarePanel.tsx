import { SECTION_BARS, at, span } from './layout';
import { lfoHz } from '@/engine/visuals/calibration';
import { parametersOnKey, stepValue } from '@/engine/parameters/registry';
import { num, useSynthValues } from '@/hooks/useSynthValues';
import { useHardwareUiStore } from '@/stores/hardwareUiStore';
import { useSynthStore } from '@/stores/synthStore';
import styles from './Hardware.module.css';
import { HwFader } from './HwFader';
import { HwKeyboard } from './HwKeyboard';
import { HwKnob } from './HwKnob';
import { HwSelectButton } from './HwSelectButton';
import { HwSwitch } from './HwSwitch';
import { HwToggleButton } from './HwToggleButton';
import { HwWheel } from './HwWheel';
import { LedDisplay } from './LedDisplay';

const WAVE_LEDS = [
  ['sine', '∿'],
  ['triangle', '⋀'],
  ['sawtooth', '⩘'],
  ['pulse', '⊓'],
] as const;
const LFO_LEDS = [
  ['triangle', '⋀'],
  ['sawtooth', '⩗'],
  ['square', '⊓'],
  ['sample-hold', 'S+H'],
] as const;
const RANGE_LEDS = [
  ['16', "16'"],
  ['8', "8'"],
  ['4', "4'"],
  ['2', "2'"],
] as const;

/**
 * Faithful virtual reproduction of the Bass Station II top panel. Positions
 * follow the manual's hardware overview figure (user guide v5.0, p. 8).
 */
export function HardwarePanel() {
  const ui = useHardwareUiStore();
  const setValue = useSynthStore((s) => s.setValue);
  const values = useSynthValues([
    'voice.oscSync',
    'performance.octave',
    'lfo1.speed',
    'lfo2.speed',
    'lfo1.speedSync',
    'lfo2.speedSync',
  ] as const);
  const syncOn = values['voice.oscSync'] === true;
  const select = useSynthStore((s) => s.select);

  const onKeyParam =
    ui.functionActive && ui.onKey ? parametersOnKey(ui.onKey.key)[ui.onKey.presses - 1] : undefined;
  const nudgeOnKey = (dir: 1 | -1) => {
    if (!onKeyParam) return;
    const current = useSynthStore.getState().values[onKeyParam.id];
    if (current === undefined) return;
    setValue(onKeyParam.id, stepValue(onKeyParam, current, dir));
  };
  const octave = num(values['performance.octave']);
  const changeOctave = (dir: 1 | -1, reset: boolean) => {
    setValue('performance.octave', reset ? 0 : octave + dir);
    ui.touch('performance.octave');
    select('performance.octave');
  };
  const blink = (n: 1 | 2) =>
    values[`lfo${n}.speedSync`] === 'sync' ? undefined : lfoHz(num(values[`lfo${n}.speed`]));

  return (
    <div className={styles.wrap}>
      <div className={styles.panel} role="group" aria-label="Bass Station II virtual panel">
        {SECTION_BARS.map((b) => (
          <div key={b.label} className={styles.bar} style={span(b.x1, b.x2, b.y)}>
            {b.label}
          </div>
        ))}
        <div className={styles.divider} style={span(190, 884, 240)} />

        {/* ---------------- Master ---------------- */}
        <HwKnob controlId="master.volume" x={240} y={185} />
        <div className={styles.place} style={at(311, 178)}>
          <LedDisplay />
        </div>
        <div className={styles.place} style={at(291, 206)}>
          <button
            type="button"
            className={styles.hwButton}
            disabled
            title="Saving to patch memories happens on the hardware. Saving presets in the app arrives with the Sound Library."
          >
            Save
          </button>
        </div>
        <div
          className={styles.place}
          style={{ ...at(330, 207), flexDirection: 'row', gap: 'calc(var(--u) * 4)' }}
        >
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              className={`${styles.hwButton} ${styles.arrowButton}`}
              disabled={!onKeyParam}
              aria-label={dir < 0 ? 'Patch/Value down' : 'Patch/Value up'}
              title={
                onKeyParam
                  ? `Change ${onKeyParam.name}`
                  : 'Changes the value of an On-Key function. Hold Function and press a key first. Patch memories are on the hardware.'
              }
              onClick={() => nudgeOnKey(dir)}
            >
              {dir < 0 ? '◀' : '▶'}
            </button>
          ))}
        </div>
        <span className={`${styles.place} ${styles.label} ${styles.dim}`} style={at(330, 220)}>
          Patch / Value
        </span>
        <div className={styles.brand} style={at(232, 220)}>
          Bass Station II
          <small>Analogue synthesizer</small>
        </div>

        {/* ---------------- Oscillators ---------------- */}
        <HwKnob controlId="osc.coarse" x={382} y={182} />
        <HwSelectButton
          controlId="osc.range"
          x={384}
          y={218}
          layout="row-above"
          label="Range"
          captions={RANGE_LEDS}
        />
        <HwKnob controlId="osc.fine" x={421} y={182} />
        <HwSelectButton
          controlId="osc.waveform"
          x={422}
          y={218}
          layout="row-above"
          label="Waveform"
          captions={WAVE_LEDS}
        />
        <HwKnob controlId="osc.modEnvDepth" x={462} y={182} />
        <HwKnob controlId="osc.lfo1Depth" x={500} y={182} />
        <span className={`${styles.place} ${styles.label} ${styles.dim}`} style={at(481, 203)}>
          ⌊—— Pitch ——⌋
        </span>
        <HwKnob controlId="osc.pulseWidth" x={538} y={182} />
        <HwSwitch
          controlId="osc.pwSource"
          x={540}
          y={219}
          orientation="horizontal"
          captions={{ 'mod-env': 'Mod Env', lfo2: 'LFO 2', manual: 'Manual' }}
          compact
          title="PW source"
        />
        <HwSwitch
          controlId="osc.select"
          x={476}
          y={225}
          orientation="horizontal"
          captions={{ osc1: '1', osc2: '2' }}
          leds
          title="Osc Select"
        />
        <button
          type="button"
          className={`${styles.place} ${styles.option}`}
          style={{ ...at(512, 227), flexDirection: 'row' }}
          onClick={() => select('voice.oscSync')}
          title="Sync 1-2 LED. Turn sync on or off with Function + upper D."
        >
          <span className={[styles.led, syncOn && styles.ledOn].filter(Boolean).join(' ')} />
          Sync 1-2
        </button>

        {/* ---------------- Sub oscillator ---------------- */}
        <HwSwitch
          controlId="sub.octave"
          x={578}
          y={176}
          orientation="vertical"
          leds
          labelSide="before"
          captions={{ '-1': '-1', '-2': '-2' }}
        />
        <span className={`${styles.place} ${styles.label}`} style={at(580, 194)}>
          Octave
        </span>
        <HwSwitch
          controlId="sub.wave"
          x={578}
          y={218}
          orientation="vertical"
          leds
          labelSide="before"
          captions={{ sine: '∿', 'narrow-pulse': '⊓̲', square: '⊓' }}
        />

        {/* ---------------- Mixer ---------------- */}
        <HwKnob controlId="mixer.osc1" x={609} y={178} label="Osc 1" />
        <HwKnob controlId="mixer.osc2" x={663} y={178} label="Osc 2" />
        <HwKnob controlId="mixer.sub" x={609} y={214} label="Sub Osc" />
        <HwSwitch
          controlId="mixer.source"
          x={636}
          y={203}
          orientation="vertical"
          order={['ext', 'ring', 'noise']}
          captions={{ ext: 'Ext', ring: 'Ring', noise: 'Noise' }}
        />
        <HwKnob controlId="mixer.sourceLevel" x={663} y={214} label="Level" />

        {/* ---------------- Filter ---------------- */}
        <HwSwitch
          controlId="filter.type"
          x={710}
          y={168}
          orientation="horizontal"
          leds
          captions={{ classic: 'Classic', acid: 'Acid' }}
          title="Type"
        />
        <HwSwitch
          controlId="filter.slope"
          x={710}
          y={198}
          orientation="horizontal"
          leds
          captions={{ '12': '12dB', '24': '24dB' }}
          title="Slope"
        />
        <HwSwitch
          controlId="filter.shape"
          x={710}
          y={226}
          orientation="horizontal"
          leds
          captions={{ lp: 'LP', bp: 'BP', hp: 'HP' }}
          title="Shape"
        />
        <HwKnob controlId="filter.overdrive" x={755} y={178} />
        <HwKnob controlId="filter.resonance" x={795} y={178} />
        <HwKnob controlId="filter.modEnvDepth" x={755} y={214} />
        <HwKnob controlId="filter.lfo2Depth" x={795} y={214} />
        <HwKnob controlId="filter.frequency" x={848} y={195} size="lg" />

        {/* ---------------- Arpeggiator ---------------- */}
        <HwKnob controlId="arp.tempo" x={240} y={262} scale={['40', '240']} />
        <HwKnob controlId="arp.rhythm" x={290} y={262} scale={['1', '32']} />
        <HwKnob controlId="arp.mode" x={330} y={260} size="xs" />
        <HwKnob controlId="arp.octaves" x={330} y={292} size="xs" label="Arp Octaves / SEQ" />
        <HwToggleButton controlId="arp.on" x={248} y={299} ledSide="left" />
        <HwToggleButton controlId="arp.latch" x={282} y={299} ledSide="right" />

        {/* ---------------- Portamento ---------------- */}
        <HwKnob controlId="portamento.glideTime" x={379} y={264} />

        {/* ---------------- LFOs ---------------- */}
        <HwSelectButton
          controlId="lfo1.wave"
          x={418}
          y={268}
          layout="column-right"
          tall
          captions={LFO_LEDS}
          blinkHz={blink(1)}
        />
        <HwKnob controlId="lfo1.knob" x={455} y={262} />
        <HwSwitch
          controlId="lfo.delaySpeed"
          x={479}
          y={288}
          orientation="vertical"
          captions={{ delay: 'Delay', speed: 'Speed' }}
        />
        <HwKnob controlId="lfo2.knob" x={505} y={262} />
        <HwSelectButton
          controlId="lfo2.wave"
          x={538}
          y={268}
          layout="column-left"
          tall
          captions={LFO_LEDS}
          blinkHz={blink(2)}
        />

        {/* ---------------- Envelopes ---------------- */}
        <HwSwitch
          controlId="env.select"
          x={590}
          y={272}
          orientation="vertical"
          labelSide="before"
          captions={{ amp: 'Amp Env', mod: 'Mod Env', both: 'Amp+Mod Env' }}
          title="Env Select"
        />
        <HwFader controlId="env.attack" x={634} y={276} />
        <HwFader controlId="env.decay" x={662} y={276} />
        <HwFader controlId="env.sustain" x={690} y={276} />
        <HwFader controlId="env.release" x={718} y={276} />
        <HwSwitch
          controlId="env.triggering"
          x={768}
          y={274}
          orientation="vertical"
          leds
          order={['autoglide', 'single', 'multi']}
          title="Triggering"
        />

        {/* ---------------- Effects ---------------- */}
        <HwKnob controlId="effects.distortion" x={823} y={262} />
        <HwKnob controlId="effects.oscFilterMod" x={859} y={262} />

        {/* ---------------- Keyboard area ---------------- */}
        <div className={styles.place} style={at(232, 331)}>
          <button
            type="button"
            className={[styles.hwButton, ui.transposeArmed && styles.hwButtonActive]
              .filter(Boolean)
              .join(' ')}
            aria-pressed={ui.transposeArmed}
            title="Transpose: activate, then press a key (relative to middle C)"
            onClick={ui.toggleTranspose}
          >
            Transpose
          </button>
        </div>
        <div className={styles.place} style={at(283, 333)}>
          <button
            type="button"
            className={[styles.hwButton, ui.functionActive && styles.hwButtonActive]
              .filter(Boolean)
              .join(' ')}
            aria-pressed={ui.functionActive}
            title="Function/Exit: activate, then press a key for its On-Key function. Press the key again for extended functions."
            onClick={ui.toggleFunction}
          >
            Function
          </button>
          <span className={`${styles.label} ${styles.dim}`}>Exit</span>
        </div>
        <div
          className={styles.place}
          style={{ ...at(254, 361), flexDirection: 'row', gap: 'calc(var(--u) * 4)' }}
        >
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              className={`${styles.hwButton} ${styles.arrowButton}`}
              aria-label={dir < 0 ? 'Octave down' : 'Octave up'}
              title="Octave shift. Alt-click resets (on the hardware: press both buttons)."
              disabled={(dir < 0 && octave <= -4) || (dir > 0 && octave >= 5)}
              onClick={(e) => changeOctave(dir, e.altKey)}
            >
              {dir < 0 ? '◀' : '▶'}
            </button>
          ))}
        </div>
        <span className={`${styles.place} ${styles.label} ${styles.dim}`} style={at(254, 374)}>
          Octave · Reset
        </span>
        <HwWheel controlId="performance.pitchWheel" x={232} y={455} spring />
        <HwWheel controlId="performance.modWheel" x={282} y={455} />
        <HwKeyboard />
      </div>
    </div>
  );
}
