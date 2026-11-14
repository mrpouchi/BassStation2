import { useEffect, useState } from 'react';
import { findParameter, parametersOnKey } from '@/engine/parameters/registry';
import { useHardwareUiStore } from '@/stores/hardwareUiStore';
import { useSynthStore } from '@/stores/synthStore';
import { displayText } from './displayText';
import styles from './Hardware.module.css';
import { t } from '@/i18n/t';

const SHOW_MS = 1600;

/**
 * Three-character display: shows the value being edited, the active On-Key
 * function's value, or otherwise the patch number (p. 17).
 */
export function LedDisplay() {
  const touched = useHardwareUiStore((s) => s.touched);
  const onKey = useHardwareUiStore((s) => s.onKey);
  const functionActive = useHardwareUiStore((s) => s.functionActive);
  const values = useSynthStore((s) => s.values);
  const [, force] = useState(0);

  useEffect(() => {
    if (!touched) return;
    const t = setTimeout(() => force((n) => n + 1), SHOW_MS + 20);
    return () => clearTimeout(t);
  }, [touched]);

  let text: string;
  let changed = false;
  const onKeyParam = onKey ? parametersOnKey(onKey.key)[onKey.presses - 1] : undefined;
  const recent =
    touched && Date.now() - touched.at < SHOW_MS ? findParameter(touched.id) : undefined;

  if (functionActive && onKeyParam) {
    const v = values[onKeyParam.id];
    text = v === undefined ? '---' : displayText(onKeyParam, v);
    changed = v !== onKeyParam.defaultValue;
  } else if (functionActive) {
    text = 'Fn';
  } else if (recent) {
    const v = values[recent.id];
    text = v === undefined ? '---' : displayText(recent, v);
    changed = v !== recent.defaultValue;
  } else {
    text = String(values['master.patch'] ?? 0);
  }

  return (
    <div
      className={styles.display}
      role="status"
      aria-live="polite"
      aria-label={t('Display: {text}', { text })}
    >
      <span className={styles.digits}>{text.padStart(3, ' ')}</span>
      <span
        className={styles.orgArrows}
        aria-hidden
        title={t('Org. Value: lit when a value differs from the Init Patch')}
      >
        <span className={changed ? styles.orgOn : undefined}>▶</span>
        <span className={changed ? styles.orgOn : undefined}>◀</span>
      </span>
    </div>
  );
}
