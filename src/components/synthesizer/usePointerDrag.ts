import { useRef, type PointerEvent } from 'react';

/**
 * Vertical drag helper: reports a normalised delta (dragging up = positive).
 * `pixelsForFullRange` sets sensitivity; holding Shift makes it 5× finer.
 */
export function usePointerDrag(
  onStart: () => number,
  onChange: (normalized: number) => void,
  pixelsForFullRange = 180,
  onEnd?: () => void,
) {
  const state = useRef<{ y: number; start: number } | null>(null);

  return {
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      state.current = { y: e.clientY, start: onStart() };
      e.preventDefault();
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      const s = state.current;
      if (!s) return;
      const scale = e.shiftKey ? pixelsForFullRange * 5 : pixelsForFullRange;
      onChange(Math.min(1, Math.max(0, s.start + (s.y - e.clientY) / scale)));
    },
    onPointerUp: (e: PointerEvent<HTMLElement>) => {
      if (state.current) e.currentTarget.releasePointerCapture(e.pointerId);
      state.current = null;
      onEnd?.();
    },
    onPointerCancel: () => {
      state.current = null;
      onEnd?.();
    },
  };
}
