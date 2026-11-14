import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { findParameter } from '@/engine/parameters/registry';
import { t } from '@/i18n/t';
import styles from './LocateOnHover.module.css';
import { PanelLocator } from './PanelLocator';

const WIDTH = 320;
const GAP = 8;

/**
 * Wraps a parameter name: hovering or focusing it shows a small map of the
 * panel with the control highlighted, so you can find it on the instrument.
 */
export function LocateOnHover({ id, children }: { id: string; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [box, setBox] = useState<{ left: number; top: number; above: boolean } | null>(null);
  const tipId = useId();

  const open = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const vw = window.innerWidth;
      const left = Math.min(Math.max(8, r.left + r.width / 2 - WIDTH / 2), vw - WIDTH - 8);
      // Prefer below; flip above when there is not enough room.
      const above = window.innerHeight - r.bottom < 260 && r.top > 260;
      setBox({ left, top: above ? r.top - GAP : r.bottom + GAP, above });
    }, 120);
  };
  const close = () => {
    window.clearTimeout(timer.current);
    setBox(null);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (!box) return;
    window.addEventListener('scroll', close, true);
    return () => window.removeEventListener('scroll', close, true);
  }, [box]);

  const def = findParameter(id);
  return (
    <span
      ref={ref}
      className={styles.anchor}
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onBlur={close}
      aria-describedby={box ? tipId : undefined}
    >
      {children}
      {box &&
        createPortal(
          <div
            id={tipId}
            role="tooltip"
            className={styles.tip}
            style={{
              left: box.left,
              top: box.top,
              width: WIDTH,
              transform: box.above ? 'translateY(-100%)' : undefined,
            }}
          >
            <p className={styles.title}>
              {t('Where to find it')}
              {def ? ` · ${def.name}` : ''}
            </p>
            <PanelLocator id={id} />
          </div>,
          document.body,
        )}
    </span>
  );
}
