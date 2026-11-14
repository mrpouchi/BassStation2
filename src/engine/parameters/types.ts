/**
 * Canonical type definitions for the Bass Station II parameter model.
 *
 * Every sound/performance/global value lives in exactly one ParameterDefinition
 * (see src/data/synthesizer/parameters). Physical panel elements are described
 * separately as ControlDefinitions that *target* parameters — e.g. the single
 * "Coarse" knob edits osc1.coarse or osc2.coarse depending on the Osc Select switch.
 */

export type SectionId =
  | 'master'
  | 'oscillators'
  | 'sub-oscillator'
  | 'lfos'
  | 'mixer'
  | 'filter'
  | 'envelopes'
  | 'arpeggiator'
  | 'portamento'
  | 'effects'
  | 'performance'
  | 'modulation-matrix'
  | 'voice'
  | 'global';

/** Where the value lives on the instrument. */
export type ParameterScope =
  /** Saved in a patch. */
  | 'patch'
  /** Instrument-wide setting, not part of a patch. */
  | 'global'
  /** Real-time performance input (wheels, aftertouch, sustain). */
  | 'performance'
  /** Panel routing state (e.g. which oscillator the shared knobs edit). */
  | 'panel';

/** How the user reaches a parameter on the hardware. */
export type ParameterAccess =
  | { kind: 'panel' }
  /** Hold Function/Exit and press a key `presses` times (On-Key function). */
  | { kind: 'on-key'; key: OnKeyName; presses: number }
  /** Hold Function/Exit while turning a panel control. */
  | { kind: 'function-modifier'; controlId: string }
  /** Not reachable from the panel; only via MIDI/SysEx or software. */
  | { kind: 'midi-only' };

/** The 25 keys of the Bass Station II keyboard, named as printed in the manual. */
export type OnKeyName =
  | 'lower C'
  | 'lower C#'
  | 'lower D'
  | 'lower D#'
  | 'lower E'
  | 'lower F'
  | 'lower F#'
  | 'lower G'
  | 'lower G#'
  | 'lower A'
  | 'lower A#'
  | 'lower B'
  | 'middle C'
  | 'upper C#'
  | 'upper D'
  | 'upper D#'
  | 'upper E'
  | 'upper F'
  | 'upper F#'
  | 'upper G'
  | 'upper G#'
  | 'upper A'
  | 'upper A#'
  | 'upper B'
  | 'upper C';

// ---------------------------------------------------------------------------
// MIDI
// ---------------------------------------------------------------------------

/**
 * Verification status against real hardware. Documentation alone never
 * upgrades a parameter beyond 'requires-testing'.
 */
export type MidiVerification =
  | 'input-verified'
  | 'output-verified'
  | 'both-verified'
  | 'not-supported'
  | 'requires-testing';

export type MidiMapping =
  /** Single 7-bit CC, or a CC pair written "msb:lsb" in the manual. */
  | { type: 'cc'; cc: number; lsbCc?: number }
  /** NRPN written "msb:lsb" in the manual. */
  | { type: 'nrpn'; msb: number; lsb: number }
  | { type: 'program-change' }
  | { type: 'pitch-bend' }
  | { type: 'channel-pressure' }
  | { type: 'rpn'; msb: number; lsb: number };

export interface MidiInfo {
  /** null when Novation documents no MIDI message for the parameter. */
  readonly mapping: MidiMapping | null;
  /** Range text exactly as printed in the manual's MIDI parameters list. */
  readonly documentedRange?: string;
  readonly verification: MidiVerification;
  readonly notes?: string;
}

// ---------------------------------------------------------------------------
// Educational metadata
// ---------------------------------------------------------------------------

export interface ParameterEducation {
  /** One-paragraph plain-language explanation. */
  readonly explanation: string;
  readonly increase: string;
  readonly decrease: string;
  /** A short hands-on experiment the user can try. */
  readonly experiment?: string;
}

/** Reference into the official manual (Bass Station II user guide v5.0). */
export interface SourceReference {
  readonly page: number;
  readonly note?: string;
}

// ---------------------------------------------------------------------------
// Parameter definitions
// ---------------------------------------------------------------------------

/** Whether a numeric range came from the manual or was inferred. */
export type RangeSource = 'documented' | 'inferred';

interface ParameterBase {
  readonly id: string;
  /** Official name as printed on the panel or in the manual. */
  readonly name: string;
  readonly section: SectionId;
  readonly scope: ParameterScope;
  readonly access: ParameterAccess;
  readonly description: string;
  readonly education: ParameterEducation;
  readonly concepts: readonly string[];
  readonly related: readonly string[];
  readonly midi: MidiInfo;
  readonly source: SourceReference;
  /** Visualizers affected by this value. */
  readonly visuals: readonly VisualId[];
  /** True when the manual does not state the default and the app chose one. */
  readonly defaultInferred?: boolean;
}

export type VisualId = 'waveform' | 'filter' | 'envelope' | 'lfo' | 'mixer' | 'keyboard';

export interface ContinuousParameter extends ParameterBase {
  readonly kind: 'continuous';
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly defaultValue: number;
  readonly unit?: string;
  /** Centre-detented ("centre-off") control. */
  readonly bipolar?: boolean;
  readonly rangeSource: RangeSource;
  /** Label shown instead of the number for specific values (e.g. 0 → "Off"). */
  readonly valueLabels?: Readonly<Record<number, string>>;
}

export interface EnumOption {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
}

export interface EnumParameter extends ParameterBase {
  readonly kind: 'enum';
  readonly options: readonly EnumOption[];
  readonly defaultValue: string;
}

export interface ToggleParameter extends ParameterBase {
  readonly kind: 'toggle';
  readonly defaultValue: boolean;
  readonly labels?: readonly [off: string, on: string];
}

export type ParameterDefinition = ContinuousParameter | EnumParameter | ToggleParameter;
export type ParameterKind = ParameterDefinition['kind'];
export type ParameterValue = number | string | boolean;

// ---------------------------------------------------------------------------
// Physical controls
// ---------------------------------------------------------------------------

export type ControlType =
  | 'knob'
  | 'large-knob'
  | 'rotary-switch'
  | 'slider'
  | 'switch'
  | 'button'
  | 'select-button'
  | 'wheel'
  | 'display'
  | 'led'
  | 'keyboard';

/**
 * What a control edits. Either a parameter id, or a routing node that picks a
 * target from the current value of a panel selector parameter.
 */
export type ControlTarget =
  | { readonly param: string }
  /** Edits several parameters at once (e.g. faders with Env Select on Amp+Mod). */
  | { readonly params: readonly string[] }
  | { readonly via: string; readonly routes: Readonly<Record<string, ControlTarget>> }
  | { readonly action: string };

export interface ControlDefinition {
  readonly id: string;
  /** Label printed on the panel. */
  readonly label: string;
  readonly section: SectionId;
  readonly type: ControlType;
  /** Callout number in the manual's hardware overview (pp. 8–12), when it has one. */
  readonly callout?: number;
  readonly description: string;
  readonly target: ControlTarget | null;
  /** Secondary function printed on/near the control (e.g. "Legato" on Arp On). */
  readonly secondary?: { readonly label: string; readonly description: string };
  /** What the control edits while Function/Exit is held (e.g. extended sub-osc tuning). */
  readonly functionTarget?: ControlTarget;
  readonly source: SourceReference;
}
