import { ON_KEY_LAYOUT } from '@/data/synthesizer/onKeyLayout';
import { parametersOnKey } from '@/engine/parameters/registry';
import { keyToMidi, noteName } from '@/engine/visuals/notes';
import { num, useSynthValues } from '@/hooks/useSynthValues';
import { useHardwareUiStore } from '@/stores/hardwareUiStore';
import { useSynthStore } from '@/stores/synthStore';
import styles from './Hardware.module.css';
import { KEYBOARD, PANEL } from './layout';
import { t } from '@/i18n/t';

const WHITE_PATTERN = [0, 2, 4, 5, 7, 9, 11];
const BLACK_OFFSETS: Record<number, number> = { 1: 0, 3: 1, 6: 3, 8: 4, 10: 5 };

interface KeyGeom {
  index: number;
  black: boolean;
  center: number; // image px
  left: number;
  width: number;
}

const WHITE_W = (KEYBOARD.x2 - KEYBOARD.x1) / 15;
const BLACK_W = WHITE_W * 0.6;

const KEYS: readonly KeyGeom[] = Array.from({ length: 25 }, (_, index) => {
  const octave = Math.floor(index / 12);
  const pc = index % 12;
  const blackAfter = BLACK_OFFSETS[pc];
  if (blackAfter === undefined) {
    const whiteIndex = octave * 7 + WHITE_PATTERN.indexOf(pc);
    const left = KEYBOARD.x1 + whiteIndex * WHITE_W;
    return { index, black: false, center: left + WHITE_W / 2, left, width: WHITE_W };
  }
  const boundary = KEYBOARD.x1 + (octave * 7 + blackAfter + 1) * WHITE_W;
  return { index, black: true, center: boundary, left: boundary - BLACK_W / 2, width: BLACK_W };
});

const GROUPS: { label: string; from: number; to: number }[] = [
  { label: 'Mod Wheel', from: 0, to: 3 },
  { label: 'Aftertouch', from: 4, to: 6 },
  { label: 'LFO', from: 7, to: 12 },
  { label: 'Osc', from: 13, to: 14 },
  { label: 'Velocity', from: 15, to: 16 },
  { label: 'VCA', from: 17, to: 17 },
  { label: 'Arp', from: 18, to: 19 },
  { label: 'Global', from: 20, to: 24 },
];

const pct = (x: number) => `${((x - KEYBOARD.x1) / (KEYBOARD.x2 - KEYBOARD.x1)) * 100}%`;

/**
 * 25-key keyboard with the On-Key label strip. Normal mode: sets the note shown
 * in the visualisers (no audio). Function mode: opens On-Key functions (press again
 * for extended ones). Transpose mode: sets the transpose relative to middle C.
 */
export function HwKeyboard() {
  const v = useSynthValues(['performance.octave', 'performance.transpose'] as const);
  const ui = useHardwareUiStore();
  const setValue = useSynthStore((s) => s.setValue);
  const select = useSynthStore((s) => s.select);

  const press = (k: KeyGeom) => {
    const entry = ON_KEY_LAYOUT[k.index];
    if (ui.transposeArmed) {
      setValue('performance.transpose', k.index - 12);
      ui.touch('performance.transpose');
      ui.toggleTranspose();
      return;
    }
    if (ui.functionActive && entry) {
      const params = parametersOnKey(entry.key);
      const presses = ui.selectOnKey(entry.key, params.length);
      const p = params[presses - 1];
      if (p) select(p.id);
      return;
    }
    ui.pressKey(
      k.index,
      keyToMidi(k.index, num(v['performance.octave']), num(v['performance.transpose'])),
    );
  };

  const STRIP_Y = 321;
  const stripTop = ((STRIP_Y - PANEL.y0) / PANEL.height) * 100;
  const left = ((KEYBOARD.x1 - PANEL.x0) / PANEL.width) * 100;
  const width = ((KEYBOARD.x2 - KEYBOARD.x1) / PANEL.width) * 100;

  return (
    <>
      <div
        className={[styles.strip, ui.functionActive && styles.stripActive]
          .filter(Boolean)
          .join(' ')}
        style={{
          left: `${left}%`,
          width: `${width}%`,
          top: `${stripTop}%`,
          height: `${((KEYBOARD.y1 - STRIP_Y) / PANEL.height) * 100}%`,
        }}
        aria-hidden
      >
        {GROUPS.map((g) => {
          const a = KEYS[g.from];
          const b = KEYS[g.to];
          if (!a || !b) return null;
          return (
            <span
              key={g.label}
              className={styles.groupBar}
              style={{
                left: pct(a.center - 14),
                width: `calc(${pct(b.center + 14)} - ${pct(a.center - 14)})`,
                top: 0,
              }}
            >
              {g.label}
            </span>
          );
        })}
        {KEYS.map((k) => {
          const entry = ON_KEY_LAYOUT[k.index];
          const isSel = ui.functionActive && ui.onKey?.key === entry?.key;
          return (
            <span
              key={k.index}
              className={[styles.stripLabel, isSel && styles.stripLabelSelected]
                .filter(Boolean)
                .join(' ')}
              style={
                k.black
                  ? { left: pct(k.center), top: '24%' }
                  : { left: pct(k.center), bottom: '2%' }
              }
            >
              {entry?.label}
            </span>
          );
        })}
      </div>
      <div
        className={styles.keyboard}
        style={{
          left: `${left}%`,
          width: `${width}%`,
          top: `${((KEYBOARD.y1 - PANEL.y0) / PANEL.height) * 100}%`,
          height: `${((KEYBOARD.y2 - KEYBOARD.y1) / PANEL.height) * 100}%`,
        }}
      >
        {KEYS.map((k) => {
          const entry = ON_KEY_LAYOUT[k.index];
          const midi = keyToMidi(
            k.index,
            num(v['performance.octave']),
            num(v['performance.transpose']),
          );
          const label =
            ui.functionActive && entry
              ? `${entry.group}: ${entry.label}`
              : ui.transposeArmed
                ? t('Transpose to {n}', { n: `${k.index - 12 >= 0 ? '+' : ''}${k.index - 12}` })
                : t('Key {note}', { note: noteName(midi) });
          return (
            <button
              key={k.index}
              type="button"
              aria-label={label}
              title={label}
              className={[
                styles.key,
                k.black ? styles.black : styles.white,
                ui.heldKey === k.index && styles.keyDown,
                ui.functionActive && styles.keyFunction,
                ui.functionActive && ui.onKey?.key === entry?.key && styles.keyOnKeySelected,
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                left: pct(k.left),
                width: `${(k.width / (KEYBOARD.x2 - KEYBOARD.x1)) * 100}%`,
              }}
              onPointerDown={() => press(k)}
              onPointerUp={ui.releaseKey}
              onPointerLeave={() => ui.heldKey === k.index && ui.releaseKey()}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  press(k);
                }
              }}
              onKeyUp={ui.releaseKey}
            />
          );
        })}
      </div>
    </>
  );
}
