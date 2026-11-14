import { SECTION_BARS, at, span } from './layout';
import { pos } from './panelMap';
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
import { t } from '@/i18n/t';

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
      <div className={styles.panel} role="group" aria-label={t('Bass Station II virtual panel')}>
        {SECTION_BARS.map((b) => (
          <div key={b.label} className={styles.bar} style={span(b.x1, b.x2, b.y)}>
            {b.label}
          </div>
        ))}
        <div className={styles.divider} style={span(190, 884, 240)} />

        {/* ---------------- Master ---------------- */}
        <HwKnob controlId="master.volume" {...pos('master.volume')} />
        <div className={styles.place} style={at(311, 178)}>
          <LedDisplay />
        </div>
        <div className={styles.place} style={at(291, 206)}>
          <button
            type="button"
            className={styles.hwButton}
            disabled
            title={t(
              'Saving to patch memories happens on the hardware. In the app, save presets in the Sound Library.',
            )}
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
              aria-label={dir < 0 ? t('Patch/Value down') : t('Patch/Value up')}
              title={
                onKeyParam
                  ? t('Change {name}', { name: onKeyParam.name })
                  : t(
                      'Changes the value of an On-Key function. Hold Function and press a key first. Patch memories are on the hardware.',
                    )
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
        <HwKnob controlId="osc.coarse" {...pos('osc.coarse')} />
        <HwSelectButton
          controlId="osc.range"
          {...pos('osc.range')}
          layout="row-above"
          label="Range"
          captions={RANGE_LEDS}
        />
        <HwKnob controlId="osc.fine" {...pos('osc.fine')} />
        <HwSelectButton
          controlId="osc.waveform"
          {...pos('osc.waveform')}
          layout="row-above"
          label="Waveform"
          captions={WAVE_LEDS}
        />
        <HwKnob controlId="osc.modEnvDepth" {...pos('osc.modEnvDepth')} />
        <HwKnob controlId="osc.lfo1Depth" {...pos('osc.lfo1Depth')} />
        <span className={`${styles.place} ${styles.label} ${styles.dim}`} style={at(481, 203)}>
          ⌊—— Pitch ——⌋
        </span>
        <HwKnob controlId="osc.pulseWidth" {...pos('osc.pulseWidth')} />
        <HwSwitch
          controlId="osc.pwSource"
          {...pos('osc.pwSource')}
          orientation="horizontal"
          captions={{ 'mod-env': 'Mod Env', lfo2: 'LFO 2', manual: 'Manual' }}
          compact
          title="PW source"
        />
        <HwSwitch
          controlId="osc.select"
          {...pos('osc.select')}
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
          title={t('Sync 1-2 LED. Turn sync on or off with Function + upper D.')}
        >
          <span className={[styles.led, syncOn && styles.ledOn].filter(Boolean).join(' ')} />
          Sync 1-2
        </button>

        {/* ---------------- Sub oscillator ---------------- */}
        <HwSwitch
          controlId="sub.octave"
          {...pos('sub.octave')}
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
          {...pos('sub.wave')}
          orientation="vertical"
          leds
          labelSide="before"
          captions={{ sine: '∿', 'narrow-pulse': '⊓̲', square: '⊓' }}
        />

        {/* ---------------- Mixer ---------------- */}
        <HwKnob controlId="mixer.osc1" {...pos('mixer.osc1')} label="Osc 1" />
        <HwKnob controlId="mixer.osc2" {...pos('mixer.osc2')} label="Osc 2" />
        <HwKnob controlId="mixer.sub" {...pos('mixer.sub')} label="Sub Osc" />
        <HwSwitch
          controlId="mixer.source"
          {...pos('mixer.source')}
          orientation="vertical"
          order={['ext', 'ring', 'noise']}
          captions={{ ext: 'Ext', ring: 'Ring', noise: 'Noise' }}
        />
        <HwKnob controlId="mixer.sourceLevel" {...pos('mixer.sourceLevel')} label="Level" />

        {/* ---------------- Filter ---------------- */}
        <HwSwitch
          controlId="filter.type"
          {...pos('filter.type')}
          orientation="horizontal"
          leds
          captions={{ classic: 'Classic', acid: 'Acid' }}
          title="Type"
        />
        <HwSwitch
          controlId="filter.slope"
          {...pos('filter.slope')}
          orientation="horizontal"
          leds
          captions={{ '12': '12dB', '24': '24dB' }}
          title="Slope"
        />
        <HwSwitch
          controlId="filter.shape"
          {...pos('filter.shape')}
          orientation="horizontal"
          leds
          captions={{ lp: 'LP', bp: 'BP', hp: 'HP' }}
          title="Shape"
        />
        <HwKnob controlId="filter.overdrive" {...pos('filter.overdrive')} />
        <HwKnob controlId="filter.resonance" {...pos('filter.resonance')} />
        <HwKnob controlId="filter.modEnvDepth" {...pos('filter.modEnvDepth')} />
        <HwKnob controlId="filter.lfo2Depth" {...pos('filter.lfo2Depth')} />
        <HwKnob controlId="filter.frequency" {...pos('filter.frequency')} size="lg" />

        {/* ---------------- Arpeggiator ---------------- */}
        <HwKnob controlId="arp.tempo" {...pos('arp.tempo')} scale={['40', '240']} />
        <HwKnob controlId="arp.rhythm" {...pos('arp.rhythm')} scale={['1', '32']} />
        <HwKnob controlId="arp.mode" {...pos('arp.mode')} size="xs" />
        <HwKnob
          controlId="arp.octaves"
          {...pos('arp.octaves')}
          size="xs"
          label="Arp Octaves / SEQ"
        />
        <HwToggleButton controlId="arp.on" {...pos('arp.on')} ledSide="left" />
        <HwToggleButton controlId="arp.latch" {...pos('arp.latch')} ledSide="right" />

        {/* ---------------- Portamento ---------------- */}
        <HwKnob controlId="portamento.glideTime" {...pos('portamento.glideTime')} />

        {/* ---------------- LFOs ---------------- */}
        <HwSelectButton
          controlId="lfo1.wave"
          {...pos('lfo1.wave')}
          layout="column-right"
          tall
          captions={LFO_LEDS}
          blinkHz={blink(1)}
        />
        <HwKnob controlId="lfo1.knob" {...pos('lfo1.knob')} />
        <HwSwitch
          controlId="lfo.delaySpeed"
          {...pos('lfo.delaySpeed')}
          orientation="vertical"
          captions={{ delay: 'Delay', speed: 'Speed' }}
        />
        <HwKnob controlId="lfo2.knob" {...pos('lfo2.knob')} />
        <HwSelectButton
          controlId="lfo2.wave"
          {...pos('lfo2.wave')}
          layout="column-left"
          tall
          captions={LFO_LEDS}
          blinkHz={blink(2)}
        />

        {/* ---------------- Envelopes ---------------- */}
        <HwSwitch
          controlId="env.select"
          {...pos('env.select')}
          orientation="vertical"
          labelSide="before"
          captions={{ amp: 'Amp Env', mod: 'Mod Env', both: 'Amp+Mod Env' }}
          title="Env Select"
        />
        <HwFader controlId="env.attack" {...pos('env.attack')} />
        <HwFader controlId="env.decay" {...pos('env.decay')} />
        <HwFader controlId="env.sustain" {...pos('env.sustain')} />
        <HwFader controlId="env.release" {...pos('env.release')} />
        <HwSwitch
          controlId="env.triggering"
          {...pos('env.triggering')}
          orientation="vertical"
          leds
          order={['autoglide', 'single', 'multi']}
          title="Triggering"
        />

        {/* ---------------- Effects ---------------- */}
        <HwKnob controlId="effects.distortion" {...pos('effects.distortion')} />
        <HwKnob controlId="effects.oscFilterMod" {...pos('effects.oscFilterMod')} />

        {/* ---------------- Keyboard area ---------------- */}
        <div className={styles.place} style={at(232, 331)}>
          <button
            type="button"
            className={[styles.hwButton, ui.transposeArmed && styles.hwButtonActive]
              .filter(Boolean)
              .join(' ')}
            aria-pressed={ui.transposeArmed}
            title={t('Transpose: activate, then press a key (relative to middle C)')}
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
            title={t(
              'Function/Exit: activate, then press a key for its On-Key function. Press the key again for extended functions.',
            )}
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
              aria-label={dir < 0 ? t('Octave down') : t('Octave up')}
              title={t('Octave shift. Alt-click resets (on the hardware: press both buttons).')}
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
        <HwWheel controlId="performance.pitchWheel" {...pos('performance.pitchWheel')} spring />
        <HwWheel controlId="performance.modWheel" {...pos('performance.modWheel')} />
        <HwKeyboard />
      </div>
    </div>
  );
}
