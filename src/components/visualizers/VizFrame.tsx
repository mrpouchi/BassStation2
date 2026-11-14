import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/Badge';
import styles from './VizFrame.module.css';

interface VizFrameProps {
  title: string;
  controls?: ReactNode;
  readout?: ReactNode;
  caption: string;
  children: ReactNode;
}

/** Shared frame making clear that visualisations are theoretical models. */
export function VizFrame({ title, controls, readout, caption, children }: VizFrameProps) {
  return (
    <figure className={styles.frame} style={{ margin: 0 }}>
      <div className={styles.head}>
        <span className={styles.title}>{title}</span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {controls}
          <Badge
            tone="info"
            title="A mathematical illustration, not a measurement of the analog circuit."
          >
            Theoretical model
          </Badge>
        </span>
      </div>
      {children}
      {readout && <div className={styles.readout}>{readout}</div>}
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
