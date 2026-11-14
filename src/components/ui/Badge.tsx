import type { ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'info' | 'danger';

interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  title?: string;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', dot = false, title, children }: BadgeProps) {
  const classes = [styles.badge, tone !== 'neutral' && styles[tone], dot && styles.dot]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={classes} title={title}>
      {children}
    </span>
  );
}
