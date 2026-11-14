import { EMPTY_GRADE, gradePlayedNote, markMissed, summarize } from './grading';
import {
  MidiFileError,
  monophonic,
  parseMidiFile,
  pickBassTrack,
  playableTracks,
} from './midiFile';
import { noteIndexAt, SongPlayer, type PlayerClock } from './SongPlayer';
import { conductor, name, smf, tempo, track } from '@/test/smf';

// --------------------------------------------------------------------- parser

describe('parseMidiFile', () => {
  it('reads tracks, names, tempo, time signature and note timing', () => {
    const bass = track([
      [0, ...name('Bass')],
      [0, 0x91, 40, 100],
      [480, 0x81, 40, 0], // one beat at 120 BPM = 0.5 s
      [0, 0x91, 43, 90],
      [240, 43, 0], // running status, velocity 0 = note off
    ]);
    const song = parseMidiFile(smf([conductor(120), bass]));
    expect(song.title).toBe('My Tune');
    expect(song.bpm).toBe(120);
    expect(song.timeSignature).toEqual([3, 4]);
    expect(song.beatSec).toBeCloseTo(0.5);
    const t = song.tracks[1]!;
    expect(t.name).toBe('Bass');
    expect(t.channel).toBe(2);
    expect(t.notes).toEqual([
      { note: 40, velocity: 100, start: 0, duration: 0.5 },
      { note: 43, velocity: 90, start: 0.5, duration: 0.25 },
    ]);
    expect(song.durationSec).toBeCloseTo(0.75);
  });

  it('applies tempo changes from the conductor track', () => {
    const bass = track([
      [0, 0x90, 40, 100],
      [960, 0x80, 40, 0], // 2 beats: 1 beat at 120 (0.5 s) + 1 beat at 60 (1 s)
    ]);
    const song = parseMidiFile(smf([conductor(120, [[480, ...tempo(60)]]), bass]));
    expect(song.tracks[1]!.notes[0]!.duration).toBeCloseTo(1.5);
  });

  it('closes notes left hanging at the end of the track', () => {
    const t = track([
      [0, 0x90, 50, 80],
      [480, 0xb0, 7, 100],
    ]);
    const song = parseMidiFile(smf([t], 480, 0), 'Fallback');
    expect(song.title).toBe('Fallback');
    expect(song.tracks[0]!.notes[0]).toMatchObject({ note: 50, start: 0, duration: 0.5 });
  });

  it('rejects files that are not MIDI', () => {
    expect(() => parseMidiFile(new Uint8Array([1, 2, 3]))).toThrow(MidiFileError);
    expect(() => parseMidiFile(new TextEncoder().encode('MThd but not really a file'))).toThrow(
      MidiFileError,
    );
  });
});

describe('track helpers', () => {
  const song = parseMidiFile(
    smf([
      conductor(),
      track([
        [0, ...name('Piano')],
        [0, 0x90, 60, 90],
        [480, 0x80, 60, 0],
      ]),
      track([
        [0, ...name('Drums')],
        [0, 0x99, 36, 90],
        [480, 0x89, 36, 0],
      ]),
      track([
        [0, ...name('Low line')],
        [0, 0x92, 30, 90],
        [480, 0x82, 30, 0],
      ]),
    ]),
  );

  it('never offers drum tracks and picks the lowest line without a "bass" name', () => {
    expect(playableTracks(song).map((t) => t.name)).toEqual(['Piano', 'Low line']);
    expect(pickBassTrack(song)?.name).toBe('Low line');
  });

  it('reduces overlapping notes and chords to one note at a time', () => {
    const mono = monophonic([
      { note: 40, velocity: 1, start: 0, duration: 1 },
      { note: 47, velocity: 1, start: 0, duration: 1 }, // chord: dropped
      { note: 43, velocity: 1, start: 0.5, duration: 1 }, // cuts the first
    ]);
    expect(mono.map((n) => [n.note, n.duration])).toEqual([
      [40, 0.5],
      [43, 1],
    ]);
  });

  it('finds the note at a time', () => {
    const notes = [
      { note: 1, velocity: 1, start: 0, duration: 1 },
      { note: 2, velocity: 1, start: 1, duration: 1 },
    ];
    expect(noteIndexAt(notes, -1)).toBe(-1);
    expect(noteIndexAt(notes, 0.5)).toBe(0);
    expect(noteIndexAt(notes, 1)).toBe(1);
  });
});

// --------------------------------------------------------------------- player

function fakeClock() {
  let now = 1000;
  let fn: (() => void) | null = null;
  const clock: PlayerClock = {
    now: () => now,
    every: (_ms, f) => {
      fn = f;
      return () => (fn = null);
    },
  };
  return {
    clock,
    advance(ms: number) {
      for (let i = 0; i < ms; i += 25) {
        now += 25;
        fn?.();
      }
    },
    get running() {
      return fn !== null;
    },
  };
}

describe('SongPlayer', () => {
  const notes = [
    { note: 40, velocity: 100, start: 0, duration: 0.5 },
    { note: 43, velocity: 80, start: 1, duration: 0.5 },
  ];

  it('sends timestamped note on/off pairs on the chosen channel, transposed', () => {
    const t = fakeClock();
    const sent: [number[], number][] = [];
    const p = new SongPlayer({ send: (b, at) => sent.push([[...b], at]) }, t.clock);
    p.load(notes, 1.5);
    p.setOptions({ channel: 3, transpose: 12 });
    p.play();
    t.advance(1100);
    expect(sent).toEqual([
      [[0x92, 52, 100], 1000],
      [[0x82, 52, 0], 1499],
      [[0x92, 55, 80], 2000],
      [[0x82, 55, 0], 2499],
    ]);
  });

  it('scales time with the rate and reports the position', () => {
    const t = fakeClock();
    const sent: [number[], number][] = [];
    const p = new SongPlayer({ send: (b, at) => sent.push([[...b], at]) }, t.clock);
    p.load(notes, 1.5);
    p.setOptions({ rate: 0.5 });
    p.play();
    t.advance(2100);
    expect(sent.find(([b]) => b[1] === 43)?.[1]).toBe(3000); // 1 s of song at half speed
    expect(p.position()).toBeCloseTo(1.05, 1);
  });

  it('silences everything on stop and ends by itself', () => {
    const t = fakeClock();
    const sent: number[][] = [];
    const onEnd = vi.fn();
    const p = new SongPlayer({ send: (b) => sent.push([...b]) }, t.clock);
    p.load(notes, 1.5);
    p.play(onEnd);
    t.advance(100);
    p.stop();
    expect(sent.slice(-2)).toEqual([
      [0x80, 40, 0],
      [0xb0, 123, 0],
    ]);
    expect(p.playing).toBe(false);
    p.play(onEnd);
    t.advance(1700);
    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(t.running).toBe(false);
  });

  it('loops a section', () => {
    const t = fakeClock();
    const ons: number[] = [];
    const p = new SongPlayer(
      { send: (b, at) => (b[0] === 0x90 ? ons.push(at) : undefined) },
      t.clock,
    );
    p.load(notes, 1.5);
    p.setOptions({ loop: { start: 0, end: 1 } });
    p.play();
    t.advance(2100);
    expect(ons).toEqual([1000, 2000, 3000]); // note 1 only, every second
  });
});

// -------------------------------------------------------------------- grading

describe('grading', () => {
  const notes = [
    { note: 40, velocity: 1, start: 0, duration: 0.5 },
    { note: 43, velocity: 1, start: 1, duration: 0.5 },
    { note: 45, velocity: 1, start: 2, duration: 0.5 },
  ];
  const opts = { window: 0.15, anyOctave: false, transpose: 0 };

  it('marks right, wrong, missed and extra notes', () => {
    let g = gradePlayedNote(EMPTY_GRADE, notes, 40, 0.05, opts);
    g = gradePlayedNote(g, notes, 44, 1.1, opts);
    g = gradePlayedNote(g, notes, 50, 1.6, opts); // nothing near
    g = markMissed(g, notes, 3, 0.15);
    expect(summarize(g)).toMatchObject({ hit: 1, wrong: 1, missed: 1, extra: 1, judged: 3 });
  });

  it('accepts other octaves and follows the transpose when asked', () => {
    const g = gradePlayedNote(EMPTY_GRADE, notes, 64, 0, {
      window: 0.15,
      anyOctave: true,
      transpose: 12,
    });
    expect(g.results.get(0)).toBe('hit');
  });
});
