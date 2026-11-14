import { useMemo } from 'react';
import { findControl } from '@/engine/parameters/registry';
import type { ControlType } from '@/engine/parameters/types';
import { t } from '@/i18n/t';
import { KEYBOARD, PANEL, SECTION_BARS } from './layout';
import { locateParameter } from './locate';
import styles from './PanelLocator.module.css';
import { CONTROL_POSITIONS, KEYS } from './panelMap';

const VIEW = `${PANEL.x0} ${PANEL.y0} ${PANEL.width} ${PANEL.height}`;
const KEY_TOP = KEYBOARD.y1 + 8;

/** A rough silhouette per control type, so the map reads like the panel. */
function Shape({
  type,
  x,
  y,
  className,
}: {
  type: ControlType | undefined;
  x: number;
  y: number;
  className: string | undefined;
}) {
  switch (type) {
    case 'large-knob':
      return <circle cx={x} cy={y} r={15} className={className} />;
    case 'knob':
    case 'rotary-switch':
      return <circle cx={x} cy={y} r={8} className={className} />;
    case 'slider':
      return <rect x={x - 4} y={y - 22} width={8} height={44} rx={2} className={className} />;
    case 'switch':
      return <rect x={x - 4} y={y - 9} width={8} height={18} rx={3} className={className} />;
    case 'wheel':
      return <rect x={x - 8} y={y - 45} width={16} height={90} rx={6} className={className} />;
    case 'display':
      return <rect x={x - 16} y={y - 9} width={32} height={18} rx={2} className={className} />;
    case 'led':
      return <circle cx={x} cy={y} r={4} className={className} />;
    default:
      return <rect x={x - 9} y={y - 5} width={18} height={10} rx={3} className={className} />;
  }
}

/** Short name drawn next to the highlighted control. */
function Tag({ x, y, text }: { x: number; y: number; text: string }) {
  const w = text.length * 7 + 12;
  const left = Math.min(Math.max(x - w / 2, PANEL.x0 + 4), PANEL.x0 + PANEL.width - w - 4);
  const top = y < 200 ? y + 26 : y - 44;
  return (
    <g>
      <rect x={left} y={top} width={w} height={18} rx={4} className={styles.tag} />
      <text x={left + w / 2} y={top + 13} className={styles.tagText}>
        {text}
      </text>
    </g>
  );
}

/**
 * A small map of the Bass Station II top panel with the controls that edit
 * `id` highlighted (orange), switches to set first (blue) and, for On-Key
 * functions, the Function button and the key to press.
 */
export function PanelLocator({ id, showSteps = true }: { id: string; showSteps?: boolean }) {
  const loc = useMemo(() => locateParameter(id), [id]);
  const fn = CONTROL_POSITIONS['performance.function'];
  const lit = new Set([...loc.controls, ...loc.selectors].map((p) => p.controlId));

  return (
    <figure className={styles.figure}>
      <svg
        viewBox={VIEW}
        className={styles.map}
        role="img"
        aria-label={t('Where it is on the panel: {steps}', { steps: loc.steps.join(' ') })}
      >
        <rect
          x={PANEL.x0}
          y={PANEL.y0}
          width={PANEL.width}
          height={PANEL.height}
          rx={10}
          className={styles.body}
        />
        {SECTION_BARS.map((b) => (
          <g key={b.label}>
            <rect
              x={b.x1}
              y={b.y - 5}
              width={b.x2 - b.x1}
              height={10}
              rx={2}
              className={styles.bar}
            />
            <text x={(b.x1 + b.x2) / 2} y={b.y + 3.5} className={styles.barLabel}>
              {b.label.toUpperCase()}
            </text>
          </g>
        ))}
        {/* Keyboard */}
        {KEYS.filter((k) => !k.black).map((k) => (
          <rect
            key={k.index}
            x={k.left + 0.5}
            y={KEY_TOP}
            width={k.width - 1}
            height={KEYBOARD.y2 - KEY_TOP - 4}
            className={loc.key?.index === k.index ? styles.keyLit : styles.keyWhite}
          />
        ))}
        {KEYS.filter((k) => k.black).map((k) => (
          <rect
            key={k.index}
            x={k.left}
            y={KEY_TOP}
            width={k.width}
            height={(KEYBOARD.y2 - KEY_TOP) * 0.6}
            className={loc.key?.index === k.index ? styles.keyLit : styles.keyBlack}
          />
        ))}
        {/* Every control, dimmed */}
        {Object.entries(CONTROL_POSITIONS).map(([cid, p]) =>
          cid === 'keyboard' || lit.has(cid) ? null : (
            <Shape key={cid} type={findControl(cid)?.type} x={p.x} y={p.y} className={styles.dot} />
          ),
        )}
        {loc.needsFunction && fn && (
          <g>
            <circle cx={fn.x} cy={fn.y} r={16} className={styles.ringSelector} />
            <circle cx={fn.x} cy={fn.y} r={7} className={styles.selector} />
          </g>
        )}
        {loc.selectors.map((p) => (
          <g key={`s-${p.controlId}`}>
            <circle cx={p.x} cy={p.y} r={16} className={styles.ringSelector} />
            <Shape
              type={findControl(p.controlId)?.type}
              x={p.x}
              y={p.y}
              className={styles.selector}
            />
          </g>
        ))}
        {loc.controls.map((p) => (
          <g key={`c-${p.controlId}`}>
            <circle cx={p.x} cy={p.y} r={26} className={styles.pulse} />
            <circle cx={p.x} cy={p.y} r={20} className={styles.ring} />
            <Shape
              type={findControl(p.controlId)?.type}
              x={p.x}
              y={p.y}
              className={styles.target}
            />
          </g>
        ))}
        {loc.controls[0] && (
          <Tag
            x={loc.controls[0].x}
            y={loc.controls[0].y}
            text={findControl(loc.controls[0].controlId)?.label ?? ''}
          />
        )}
        {loc.key && <circle cx={loc.key.x} cy={KEY_TOP + 30} r={18} className={styles.ring} />}
      </svg>
      {showSteps && (
        <figcaption className={styles.steps}>
          {loc.steps.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
