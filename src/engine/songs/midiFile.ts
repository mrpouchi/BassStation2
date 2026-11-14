/**
 * Standard MIDI File (SMF) reader, formats 0 and 1, PPQ or SMPTE timing.
 * Produces notes in seconds (tempo map applied) grouped by track, which is all
 * the Play Along feature needs. No dependencies; malformed files throw
 * MidiFileError with a readable message.
 */

export class MidiFileError extends Error {}

export interface SongNote {
  /** MIDI note number. */
  readonly note: number;
  readonly velocity: number;
  /** Start and length in seconds. */
  readonly start: number;
  readonly duration: number;
}

export interface SongTrack {
  /** Index of the track chunk in the file. */
  readonly index: number;
  readonly name: string;
  /** Channel (1–16) carrying most of the track's notes, or null without notes. */
  readonly channel: number | null;
  /** Drum tracks (channel 10) are never offered for the synth. */
  readonly isDrums: boolean;
  readonly notes: readonly SongNote[];
}

export interface Song {
  readonly title: string;
  readonly format: 0 | 1 | 2;
  readonly durationSec: number;
  /** Tempo at the start, in BPM. */
  readonly bpm: number;
  /** Time signature at the start [numerator, denominator]. */
  readonly timeSignature: readonly [number, number];
  /** Beat length at the start, in seconds (for the bar grid). */
  readonly beatSec: number;
  readonly tracks: readonly SongTrack[];
}

interface RawEvent {
  tick: number;
  kind: 'on' | 'off' | 'tempo' | 'name' | 'timesig' | 'end';
  channel?: number;
  note?: number;
  velocity?: number;
  value?: number;
  text?: string;
  sig?: [number, number];
}

class Reader {
  pos = 0;
  constructor(
    private readonly bytes: Uint8Array,
    private readonly end = bytes.length,
  ) {}
  get done() {
    return this.pos >= this.end;
  }
  u8(): number {
    if (this.pos >= this.end) throw new MidiFileError('Unexpected end of file.');
    return this.bytes[this.pos++] ?? 0;
  }
  u16(): number {
    return (this.u8() << 8) | this.u8();
  }
  u32(): number {
    return ((this.u8() << 24) | (this.u8() << 16) | (this.u8() << 8) | this.u8()) >>> 0;
  }
  vlq(): number {
    let v = 0;
    for (let i = 0; i < 4; i++) {
      const b = this.u8();
      v = (v << 7) | (b & 0x7f);
      if ((b & 0x80) === 0) return v;
    }
    throw new MidiFileError('Invalid variable-length number.');
  }
  ascii(n: number): string {
    let s = '';
    for (let i = 0; i < n; i++) s += String.fromCharCode(this.u8());
    return s;
  }
  slice(n: number): Uint8Array {
    if (this.pos + n > this.end) throw new MidiFileError('Unexpected end of file.');
    const out = this.bytes.subarray(this.pos, this.pos + n);
    this.pos += n;
    return out;
  }
}

const decodeText = (b: Uint8Array) => {
  let s = '';
  for (const c of b) s += String.fromCharCode(c);
  return s.trim();
};

function readTrack(r: Reader, length: number): RawEvent[] {
  const end = r.pos + length;
  const events: RawEvent[] = [];
  let tick = 0;
  let running = 0;
  while (r.pos < end) {
    tick += r.vlq();
    let status = r.u8();
    if (status < 0x80) {
      // Running status: reuse the previous channel status; this byte is data.
      if (running === 0) throw new MidiFileError('Data byte without a status byte.');
      r.pos--;
      status = running;
    }
    if (status === 0xff) {
      const type = r.u8();
      const data = r.slice(r.vlq());
      if (type === 0x2f) {
        events.push({ tick, kind: 'end' });
        break;
      }
      if (type === 0x51 && data.length === 3) {
        const usPerQuarter = ((data[0] ?? 0) << 16) | ((data[1] ?? 0) << 8) | (data[2] ?? 0);
        if (usPerQuarter > 0) events.push({ tick, kind: 'tempo', value: usPerQuarter });
      } else if (type === 0x03) {
        events.push({ tick, kind: 'name', text: decodeText(data) });
      } else if (type === 0x58 && data.length >= 2) {
        events.push({ tick, kind: 'timesig', sig: [data[0] ?? 4, 2 ** (data[1] ?? 2)] });
      }
      continue;
    }
    if (status === 0xf0 || status === 0xf7) {
      r.slice(r.vlq()); // SysEx: skipped
      continue;
    }
    if (status >= 0xf0) throw new MidiFileError(`Unsupported status byte ${status}.`);
    running = status;
    const type = status & 0xf0;
    const channel = (status & 0x0f) + 1;
    const d1 = r.u8();
    const d2 = type === 0xc0 || type === 0xd0 ? 0 : r.u8();
    if (type === 0x90 && d2 > 0) events.push({ tick, kind: 'on', channel, note: d1, velocity: d2 });
    else if (type === 0x80 || (type === 0x90 && d2 === 0))
      events.push({ tick, kind: 'off', channel, note: d1 });
  }
  r.pos = end;
  return events;
}

/** Converts ticks to seconds using every tempo change in the file. */
function tempoMap(tempos: { tick: number; usPerQuarter: number }[], ppq: number) {
  const sorted = [...tempos].sort((a, b) => a.tick - b.tick);
  if (sorted[0]?.tick !== 0) sorted.unshift({ tick: 0, usPerQuarter: 500_000 });
  const segments: { tick: number; sec: number; secPerTick: number }[] = [];
  let sec = 0;
  for (let i = 0; i < sorted.length; i++) {
    const t = sorted[i];
    if (!t) continue;
    const prev = segments[segments.length - 1];
    if (prev) sec = prev.sec + (t.tick - prev.tick) * prev.secPerTick;
    segments.push({ tick: t.tick, sec, secPerTick: t.usPerQuarter / 1e6 / ppq });
  }
  return (tick: number) => {
    let seg = segments[0];
    for (const s of segments) {
      if (s.tick > tick) break;
      seg = s;
    }
    return seg ? seg.sec + (tick - seg.tick) * seg.secPerTick : 0;
  };
}

export function parseMidiFile(input: ArrayBuffer | Uint8Array, fallbackTitle = 'Untitled'): Song {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  const r = new Reader(bytes);
  if (bytes.length < 14 || r.ascii(4) !== 'MThd') throw new MidiFileError('Not a MIDI file.');
  const headerLength = r.u32();
  const format = r.u16();
  const trackCount = r.u16();
  const division = r.u16();
  r.pos = 8 + headerLength;
  if (format > 2) throw new MidiFileError(`Unknown MIDI file format ${format}.`);

  let toSec: (tick: number) => number;
  const tempos: { tick: number; usPerQuarter: number }[] = [];
  const rawTracks: RawEvent[][] = [];
  for (let i = 0; i < trackCount && !r.done; i++) {
    const id = r.ascii(4);
    const length = r.u32();
    if (id !== 'MTrk') {
      r.slice(length); // unknown chunk
      i--;
      continue;
    }
    if (r.pos + length > bytes.length) throw new MidiFileError('Truncated track.');
    const events = readTrack(r, length);
    rawTracks.push(events);
    for (const e of events)
      if (e.kind === 'tempo' && e.value) tempos.push({ tick: e.tick, usPerQuarter: e.value });
  }
  if (rawTracks.length === 0) throw new MidiFileError('The file contains no tracks.');

  let ppq = 480;
  if (division & 0x8000) {
    // SMPTE: -frames per second (high byte), ticks per frame (low byte).
    const fps = 256 - (division >> 8);
    const perFrame = division & 0xff;
    const secPerTick = 1 / (fps * perFrame || 1);
    toSec = (tick) => tick * secPerTick;
  } else {
    ppq = division || 480;
    toSec = tempoMap(tempos, ppq);
  }

  let title = '';
  let timeSignature: [number, number] = [4, 4];
  const tracks: SongTrack[] = rawTracks.map((events, index) => {
    let name = '';
    const open = new Map<string, { tick: number; velocity: number }[]>();
    const notes: SongNote[] = [];
    const perChannel = new Map<number, number>();
    let lastTick = 0;
    const close = (key: string, note: number, tick: number) => {
      const started = open.get(key)?.shift();
      if (!started) return;
      const start = toSec(started.tick);
      notes.push({
        note,
        velocity: started.velocity,
        start,
        duration: Math.max(0.01, toSec(tick) - start),
      });
    };
    for (const e of events) {
      lastTick = Math.max(lastTick, e.tick);
      if (e.kind === 'name' && !name && e.text) name = e.text;
      else if (e.kind === 'timesig' && e.tick === 0 && e.sig) timeSignature = e.sig;
      else if (e.kind === 'on' && e.note !== undefined && e.channel !== undefined) {
        const key = `${e.channel}:${e.note}`;
        const list = open.get(key) ?? [];
        list.push({ tick: e.tick, velocity: e.velocity ?? 100 });
        open.set(key, list);
        perChannel.set(e.channel, (perChannel.get(e.channel) ?? 0) + 1);
      } else if (e.kind === 'off' && e.note !== undefined && e.channel !== undefined) {
        close(`${e.channel}:${e.note}`, e.note, e.tick);
      }
    }
    // Notes never switched off end with the track.
    for (const [key, list] of open)
      for (let i = list.length; i > 0; i--) close(key, Number(key.split(':')[1]), lastTick);
    notes.sort((a, b) => a.start - b.start || a.note - b.note);
    const channel =
      [...perChannel.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c)[0] ?? null;
    if (index === 0 && notes.length === 0 && name) title = name;
    return { index, name: name || `Track ${index + 1}`, channel, isDrums: channel === 10, notes };
  });

  const firstTempo = [...tempos].sort((a, b) => a.tick - b.tick)[0];
  const usPerQuarter = firstTempo && firstTempo.tick === 0 ? firstTempo.usPerQuarter : 500_000;
  const quarterSec = division & 0x8000 ? 0.5 : usPerQuarter / 1e6;
  const beatSec = quarterSec * (4 / timeSignature[1]);
  const durationSec = Math.max(
    0,
    ...tracks.flatMap((t) => t.notes.map((n) => n.start + n.duration)),
  );

  return {
    title: title || fallbackTitle,
    format: format as 0 | 1 | 2,
    durationSec,
    bpm: Math.round((60 / quarterSec) * 10) / 10,
    timeSignature,
    beatSec,
    tracks,
  };
}

/** Tracks that can be played on a monophonic synth: has notes, not drums. */
export function playableTracks(song: Song): SongTrack[] {
  return song.tracks.filter((t) => t.notes.length > 0 && !t.isDrums);
}

/**
 * The track most likely to be the bass line: one named "bass", otherwise the
 * playable track with the lowest average pitch.
 */
export function pickBassTrack(song: Song): SongTrack | undefined {
  const playable = playableTracks(song);
  const named = playable.find((t) => /bass/i.test(t.name));
  if (named) return named;
  const avg = (t: SongTrack) => t.notes.reduce((s, n) => s + n.note, 0) / t.notes.length;
  return [...playable].sort((a, b) => avg(a) - avg(b))[0];
}

/**
 * Reduces a track to one note at a time (the synth is monophonic by default):
 * when notes overlap, the newer note cuts the older one; simultaneous notes
 * keep the lowest.
 */
export function monophonic(notes: readonly SongNote[]): SongNote[] {
  const out: SongNote[] = [];
  for (const n of notes) {
    const prev = out[out.length - 1];
    if (prev && Math.abs(prev.start - n.start) < 0.005) continue; // chord: keep the lowest
    if (prev && prev.start + prev.duration > n.start)
      out[out.length - 1] = { ...prev, duration: Math.max(0.01, n.start - prev.start) };
    out.push(n);
  }
  return out;
}
