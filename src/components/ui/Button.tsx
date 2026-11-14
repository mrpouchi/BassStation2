import { Link, type LinkProps } from 'react-router-dom';
import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');
  return <button type={type} className={classes} {...rest} />;
}

interface ButtonLinkProps extends Omit<LinkProps, 'className'> {
  className?: string | undefined;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
}

/** A router link styled as a button (avoids nesting <button> inside <a>). */
export function ButtonLink({
  variant = 'secondary',
  size = 'md',
  className,
  ...rest
}: ButtonLinkProps) {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');
  return <Link className={classes} style={{ textDecoration: 'none' }} {...rest} />;
}
