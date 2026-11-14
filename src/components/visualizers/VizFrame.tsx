import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/Badge';
import { useVizOptions } from '@/hooks/valuesOverride';
import styles from './VizFrame.module.css';
import { t } from '@/i18n/t';

interface VizFrameProps {
  title: string;
  controls?: ReactNode;
  readout?: ReactNode;
  caption: string;
  children: ReactNode;
}

/** Shared frame making clear that visualisations are theoretical models. */
export function VizFrame({ title, controls, readout, caption, children }: VizFrameProps) {
  const { hideReadout } = useVizOptions();
  return (
    <figure className={styles.frame} style={{ margin: 0 }}>
      <div className={styles.head}>
        <span className={styles.title}>{title}</span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {controls}
          <Badge
            tone="info"
            title={t('A mathematical illustration, not a measurement of the analog circuit.')}
          >
            {t('Theoretical model')}
          </Badge>
        </span>
      </div>
      {children}
      {readout && !hideReadout && <div className={styles.readout}>{readout}</div>}
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
