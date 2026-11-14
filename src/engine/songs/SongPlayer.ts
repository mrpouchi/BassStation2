import type { SongNote } from './midiFile';

export interface PlayerClock {
  /** Milliseconds, same timebase as Web MIDI send timestamps (performance.now()). */
  now(): number;
  every(ms: number, fn: () => void): () => void;
}

export interface PlayerOutput {
  /** Send bytes at a timestamp (ms, PlayerClock timebase). */
  send(bytes: readonly number[], at: number): void;
}

export interface PlayerOptions {
  channel: number;
  transpose: number;
  /** Playback speed: 1 = original tempo. */
  rate: number;
  loop: { start: number; end: number } | null;
}

const LOOKAHEAD_MS = 120;
const TICK_MS = 25;

/**
 * Plays notes to a MIDI output with a lookahead scheduler: every 25 ms it
 * sends the notes that start in the next 120 ms with exact timestamps, so
 * timing does not depend on the UI thread. Every note-on is paired with a
 * note-off; stopping silences everything that is sounding.
 */
export class SongPlayer {
  private notes: readonly SongNote[] = [];
  private opts: PlayerOptions = { channel: 1, transpose: 0, rate: 1, loop: null };
  private stopTimer: (() => void) | null = null;
  /** Song position (s) at wall time `anchorMs`. */
  private anchorPos = 0;
  private anchorMs = 0;
  /** Song time up to which notes have been scheduled. */
  private scheduledTo = 0;
  private sounding = new Map<number, number>(); // note → scheduled off time (ms)
  private onEnd: (() => void) | null = null;
  private duration = 0;

  constructor(
    private readonly output: PlayerOutput,
    private readonly clock: PlayerClock,
  ) {}

  get playing(): boolean {
    return this.stopTimer !== null;
  }

  load(notes: readonly SongNote[], duration: number): void {
    this.stop();
    this.notes = notes;
    this.duration = duration;
    this.anchorPos = 0;
  }

  setOptions(patch: Partial<PlayerOptions>): void {
    const pos = this.position();
    const channelChange = patch.channel !== undefined && patch.channel !== this.opts.channel;
    const pitchChange = patch.transpose !== undefined && patch.transpose !== this.opts.transpose;
    if (this.playing && (channelChange || pitchChange)) this.silence();
    this.opts = { ...this.opts, ...patch };
    if (this.playing) this.reanchor(pos);
    else this.anchorPos = pos;
  }

  /** Current song position in seconds. */
  position(): number {
    if (!this.playing) return this.anchorPos;
    const pos = this.anchorPos + ((this.clock.now() - this.anchorMs) / 1000) * this.opts.rate;
    const loop = this.opts.loop;
    if (loop && pos >= loop.end) {
      const len = loop.end - loop.start;
      return len > 0 ? loop.start + ((pos - loop.start) % len) : loop.start;
    }
    return Math.min(pos, this.duration);
  }

  play(onEnd?: () => void): void {
    if (this.playing) return;
    this.onEnd = onEnd ?? null;
    if (this.anchorPos >= this.duration) this.anchorPos = this.opts.loop?.start ?? 0;
    this.reanchor(this.anchorPos);
    this.stopTimer = this.clock.every(TICK_MS, () => this.tick());
    this.tick();
  }

  pause(): void {
    if (!this.playing) return;
    this.anchorPos = this.position();
    this.halt();
  }

  stop(): void {
    this.halt();
    this.anchorPos = this.opts.loop?.start ?? 0;
  }

  seek(sec: number): void {
    const pos = Math.max(0, Math.min(this.duration, sec));
    if (this.playing) {
      this.silence();
      this.reanchor(pos);
    } else this.anchorPos = pos;
  }

  private halt(): void {
    const wasPlaying = this.playing;
    this.stopTimer?.();
    this.stopTimer = null;
    if (wasPlaying) this.silence();
  }

  private reanchor(pos: number): void {
    this.anchorPos = pos;
    this.anchorMs = this.clock.now();
    this.scheduledTo = pos;
  }

  private status(type: number) {
    return type | ((this.opts.channel - 1) & 0x0f);
  }

  /** Note-offs now for everything sounding, plus All Notes Off. */
  private silence(): void {
    const now = this.clock.now();
    for (const note of this.sounding.keys()) this.output.send([this.status(0x80), note, 0], now);
    this.sounding.clear();
    this.output.send([this.status(0xb0), 123, 0], now);
  }

  private songToMs(sec: number): number {
    return this.anchorMs + ((sec - this.anchorPos) / this.opts.rate) * 1000;
  }

  private tick(): void {
    const now = this.clock.now();
    for (const [note, off] of this.sounding) if (off <= now) this.sounding.delete(note);

    const horizon = this.anchorPos + ((now + LOOKAHEAD_MS - this.anchorMs) / 1000) * this.opts.rate;
    const loop = this.opts.loop;
    const end = loop ? loop.end : this.duration;
    const to = Math.min(horizon, end);
    this.scheduleRange(this.scheduledTo, to, loop ? loop.end : Infinity);
    this.scheduledTo = Math.max(this.scheduledTo, to);

    if (horizon >= end) {
      if (loop && loop.end > loop.start) {
        // Continue from the loop start; anchor so the timeline stays continuous.
        const loopEndMs = this.songToMs(loop.end);
        this.anchorPos = loop.start;
        this.anchorMs = loopEndMs;
        this.scheduledTo = loop.start;
        this.tick();
      } else if (now >= this.songToMs(this.duration)) {
        this.halt();
        this.anchorPos = this.duration;
        this.onEnd?.();
      }
    }
  }

  private scheduleRange(from: number, to: number, cutAt: number): void {
    if (to <= from) return;
    for (const n of this.notes) {
      if (n.start < from) continue;
      if (n.start >= to) break;
      const note = n.note + this.opts.transpose;
      if (note < 0 || note > 127) continue;
      const onMs = this.songToMs(n.start);
      const offMs = this.songToMs(Math.min(n.start + n.duration, cutAt)) - 1;
      const previousOff = this.sounding.get(note);
      if (previousOff !== undefined && previousOff > onMs) {
        this.output.send([this.status(0x80), note, 0], onMs - 1);
      }
      this.output.send([this.status(0x90), note, Math.max(1, Math.min(127, n.velocity))], onMs);
      this.output.send([this.status(0x80), note, 0], Math.max(onMs + 1, offMs));
      this.sounding.set(note, Math.max(onMs + 1, offMs));
    }
  }
}

/** Index of the note sounding (or most recently started) at `sec`, or -1. */
export function noteIndexAt(notes: readonly SongNote[], sec: number): number {
  let lo = 0;
  let hi = notes.length - 1;
  let found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const n = notes[mid];
    if (!n) break;
    if (n.start <= sec) {
      found = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return found;
}

export const browserClock: PlayerClock = {
  now: () => performance.now(),
  every: (ms, fn) => {
    const id = setInterval(fn, ms);
    return () => clearInterval(id);
  },
};
