/** Minimal stroke icons (24×24 grid) for navigation. */
import type { SVGProps } from 'react';

const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const DashboardIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="7" height="9" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="5" rx="1.5" />
    <rect x="13.5" y="11.5" width="7" height="9" rx="1.5" />
    <rect x="3.5" y="15.5" width="7" height="5" rx="1.5" />
  </svg>
);
export const LearnIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z" />
    <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z" />
  </svg>
);
export const SynthIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="7" cy="8" r="2.5" />
    <circle cx="17" cy="8" r="2.5" />
    <path d="M7 5.5V8M17 8l1.6-1.6" />
    <rect x="3" y="13" width="18" height="7" rx="1.5" />
    <path d="M7.5 13v4M12 13v4M16.5 13v4" />
  </svg>
);
export const ChallengeIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" />
  </svg>
);
export const LibraryIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M4 7.5h16M4 12h16M4 16.5h10" />
  </svg>
);
export const BrandMark = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" aria-hidden {...p}>
    <rect
      x="0.5"
      y="0.5"
      width="31"
      height="31"
      rx="7"
      fill="#1b1b1d"
      stroke="rgb(255 255 255 / 0.14)"
    />
    <path
      d="M6 20 L11 12 L11 20 L16 12 L16 20 L21 12 L21 20 L26 12"
      fill="none"
      stroke="#ee7a3c"
      strokeWidth="2.4"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);
