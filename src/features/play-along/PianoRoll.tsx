import { memo, useEffect, useMemo, useRef, useState } from 'react';
import type { SongNote } from '@/engine/songs/midiFile';
import type { NoteResult } from '@/engine/songs/grading';
import { noteName } from '@/engine/visuals/notes';
import { formatTime } from '@/engine/songs/time';
import styles from './PlayAlong.module.css';

interface PianoRollProps {
  notes: readonly SongNote[];
  position: number;
  /** Seconds shown across the width. */
  span?: number;
  beatSec: number;
  beatsPerBar: number;
  transpose: number;
  current: number;
  results: ReadonlyMap<number, NoteResult>;
  loop: { start: number; end: number } | null;
}

/** Drawing height in CSS pixels (the SVG is drawn 1:1, never stretched). */
const H = 280;
const GUTTER = 44;
/** The playhead sits at this fraction of the roll, so upcoming notes are visible. */
const PLAYHEAD = 0.25;

/** Scrolling piano roll: time left→right, pitch bottom→top, playhead fixed. */
export const PianoRoll = memo(function PianoRoll({
  notes,
  position,
  span = 8,
  beatSec,
  beatsPerBar,
  transpose,
  current,
  results,
  loop,
}: PianoRollProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [W, setW] = useState(900);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry?.contentRect.width;
      if (w && w > 0) setW(Math.round(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [lo, hi] = useMemo(() => {
    if (notes.length === 0) return [36, 60];
    let min = 127;
    let max = 0;
    for (const n of notes) {
      min = Math.min(min, n.note);
      max = Math.max(max, n.note);
    }
    return [min - 2 + transpose, max + 2 + transpose];
  }, [notes, transpose]);
  const rows = Math.max(12, hi - lo + 1);
  const rowH = H / rows;
  const pxPerSec = (W - GUTTER) / span;
  const t0 = position - span * PLAYHEAD;
  const x = (sec: number) => GUTTER + (sec - t0) * pxPerSec;
  const y = (note: number) => H - (note - lo + 1) * rowH;

  const barSec = beatSec * beatsPerBar;
  const gridLines: { x: number; bar: boolean; label?: number }[] = [];
  if (beatSec > 0) {
    const first = Math.max(0, Math.floor(t0 / beatSec));
    for (let b = first; b * beatSec <= t0 + span; b++) {
      const bar = b % beatsPerBar === 0;
      gridLines.push({
        x: x(b * beatSec),
        bar,
        ...(bar && { label: Math.round(b / beatsPerBar) + 1 }),
      });
    }
  }

  const visible: { n: SongNote; i: number }[] = [];
  for (let i = 0; i < notes.length; i++) {
    const n = notes[i];
    if (!n) continue;
    if (n.start > t0 + span) break;
    if (n.start + n.duration >= t0) visible.push({ n, i });
  }

  return (
    <svg
      ref={ref}
      className={styles.roll}
      viewBox={`0 0 ${W} ${H}`}
      height={H}
      role="img"
      aria-label={`Piano roll. Bar ${barSec > 0 ? Math.floor(position / barSec) + 1 : 1}.`}
    >
      {Array.from({ length: rows }, (_, r) => {
        const note = lo + r;
        const black = [1, 3, 6, 8, 10].includes(((note % 12) + 12) % 12);
        return (
          <rect
            key={note}
            x={GUTTER}
            y={y(note)}
            width={W - GUTTER}
            height={rowH}
            className={black ? styles.rowBlack : styles.rowWhite}
          />
        );
      })}
      {loop && (
        <rect
          x={Math.max(GUTTER, x(loop.start))}
          y={0}
          width={Math.max(0, Math.min(W, x(loop.end)) - Math.max(GUTTER, x(loop.start)))}
          height={H}
          className={styles.loopZone}
        />
      )}
      {gridLines.map((g) => (
        <g key={g.x}>
          <line
            x1={g.x}
            x2={g.x}
            y1={0}
            y2={H}
            className={g.bar ? styles.barLine : styles.beatLine}
          />
          {g.label !== undefined && g.x > GUTTER && (
            <text x={g.x + 3} y={11} className={styles.barLabel}>
              {g.label}
            </text>
          )}
        </g>
      ))}
      {visible.map(({ n, i }) => {
        const r = results.get(i);
        const cls = [
          styles.note,
          i === current && styles.noteCurrent,
          r === 'hit' && styles.noteHit,
          r === 'wrong' && styles.noteWrong,
          r === 'missed' && styles.noteMissed,
        ]
          .filter(Boolean)
          .join(' ');
        const nx = Math.max(GUTTER, x(n.start));
        const w = Math.max(2, x(n.start + n.duration) - nx - 1);
        return (
          <g key={i}>
            <rect
              x={nx}
              y={y(n.note + transpose) + 1}
              width={w}
              height={rowH - 2}
              rx={2}
              className={cls}
            />
            {w > 26 && rowH >= 9 && (
              <text
                x={nx + 3}
                y={y(n.note + transpose) + rowH - 3}
                className={styles.noteLabel}
                style={{ fontSize: Math.min(11, rowH - 3) }}
              >
                {noteName(n.note + transpose)}
              </text>
            )}
          </g>
        );
      })}
      <rect x={0} y={0} width={GUTTER} height={H} className={styles.gutter} />
      {Array.from({ length: rows }, (_, r) => lo + r)
        .filter((note) => note % 12 === 0)
        .map((note) => (
          <text key={note} x={4} y={y(note) + rowH - 2} className={styles.gutterLabel}>
            {noteName(note)}
          </text>
        ))}
      <line x1={x(position)} x2={x(position)} y1={0} y2={H} className={styles.playhead} />
    </svg>
  );
});

/** Whole-song strip: click to jump. */
export function SongOverview({
  notes,
  duration,
  position,
  onSeek,
}: {
  notes: readonly SongNote[];
  duration: number;
  position: number;
  onSeek: (sec: number) => void;
}) {
  const [lo, hi] = useMemo(() => {
    let min = 127;
    let max = 0;
    for (const n of notes) {
      min = Math.min(min, n.note);
      max = Math.max(max, n.note);
    }
    return notes.length ? [min, max] : [0, 1];
  }, [notes]);
  const range = Math.max(1, hi - lo);
  const d = Math.max(0.001, duration);
  const marks = useMemo(
    () =>
      notes.map((n, i) => (
        <rect
          key={i}
          x={(n.start / d) * 1000}
          y={36 - ((n.note - lo) / range) * 32 - 3}
          width={Math.max(1, (n.duration / d) * 1000)}
          height={3}
          className={styles.overviewNote}
        />
      )),
    [notes, d, lo, range],
  );
  return (
    <svg
      className={styles.overview}
      viewBox="0 0 1000 40"
      preserveAspectRatio="none"
      role="slider"
      tabIndex={0}
      aria-label="Song position"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(position)}
      aria-valuetext={`${formatTime(position)} of ${formatTime(duration)}`}
      onPointerDown={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onSeek(((e.clientX - r.left) / r.width) * duration);
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') onSeek(position + 5);
        else if (e.key === 'ArrowLeft') onSeek(position - 5);
        else if (e.key === 'Home') onSeek(0);
        else return;
        e.preventDefault();
      }}
    >
      {marks}
      <rect
        x={(position / d) * 1000 - 1}
        y={0}
        width={2}
        height={40}
        className={styles.overviewHead}
      />
    </svg>
  );
}
