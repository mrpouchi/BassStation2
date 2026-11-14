import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import {
  EMPTY_GRADE,
  gradePlayedNote,
  markMissed,
  summarize,
  type GradeState,
} from '@/engine/songs/grading';
import { monophonic, pickBassTrack, playableTracks, type Song } from '@/engine/songs/midiFile';
import { browserClock, noteIndexAt, SongPlayer } from '@/engine/songs/SongPlayer';
import { noteName } from '@/engine/visuals/notes';
import { getMidiController } from '@/services/midiController';
import { deleteSong, importSong } from '@/services/songRepository';
import { useHardwareUiStore } from '@/stores/hardwareUiStore';
import { selectInputConnected, selectOutputConnected, useMidiStore } from '@/stores/midiStore';
import { useSongStore } from '@/stores/songStore';
import { formatTime } from '@/engine/songs/time';
import { PianoRoll, SongOverview } from './PianoRoll';
import styles from './PlayAlong.module.css';

type Mode = 'synth' | 'you';

function readFileBuffer(file: File): Promise<ArrayBuffer> {
  if (typeof file.arrayBuffer === 'function') return file.arrayBuffer();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error ?? new Error('Could not read the file.'));
    reader.readAsArrayBuffer(file);
  });
}

export function PlayAlongPage() {
  const songs = useSongStore((s) => s.songs);
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('song') ?? songs[0]?.id ?? null;
  const entry = songs.find((s) => s.id === selectedId) ?? songs[0];
  const song = entry?.song;

  const [messages, setMessages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const onFiles = async (files: FileList | File[]) => {
    const out: string[] = [];
    let firstId: string | null = null;
    for (const file of Array.from(files)) {
      if (!/\.(mid|midi|smf)$/i.test(file.name)) {
        out.push(`${file.name}: not a MIDI file (.mid).`);
        continue;
      }
      const result = await importSong(file.name, await readFileBuffer(file));
      if (result.ok) {
        firstId ??= result.song.id;
        if (!result.persisted)
          out.push(
            `${result.song.song.title}: loaded, but storage is unavailable, so it will not be kept.`,
          );
      } else out.push(`${result.fileName}: ${result.error}`);
    }
    setMessages(out);
    if (firstId) setParams({ song: firstId }, { replace: true });
  };

  return (
    <>
      <PageHeader
        eyebrow="Play Along"
        title="Play bass lines on your Bass Station II"
        description="Import MIDI files (for example backing tracks exported from iReal Pro). The Academy finds the bass line, shows it as a piano roll and either plays it on your synth over USB MIDI or listens while you play it."
      />
      <div className={styles.layout}>
        <Card
          title="Songs"
          subtitle="Stored in this browser only."
          actions={
            <Button size="sm" variant="primary" onClick={() => fileInput.current?.click()}>
              Import .mid
            </Button>
          }
        >
          <input
            ref={fileInput}
            type="file"
            accept=".mid,.midi,audio/midi,audio/x-midi"
            multiple
            hidden
            aria-label="Import MIDI files"
            onChange={(e) => {
              if (e.target.files) void onFiles(e.target.files);
              e.target.value = '';
            }}
          />
          <div
            className={[styles.drop, dragOver && styles.dropActive].filter(Boolean).join(' ')}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              void onFiles(e.dataTransfer.files);
            }}
          >
            {songs.length === 0 ? (
              <EmptyState title="No songs yet">
                Drop .mid files here or use Import. Several files at once are fine.
              </EmptyState>
            ) : (
              <ul className={styles.songList}>
                {songs.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      className={[styles.songItem, s.id === entry?.id && styles.songActive]
                        .filter(Boolean)
                        .join(' ')}
                      aria-current={s.id === entry?.id ? 'true' : undefined}
                      onClick={() => setParams({ song: s.id }, { replace: true })}
                    >
                      <span>{s.song.title}</span>
                      <small>
                        {s.song.bpm} BPM · {formatTime(s.song.durationSec)}
                      </small>
                    </button>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Remove ${s.song.title}`}
                      onClick={() => void deleteSong(s.id)}
                    >
                      ✕
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {messages.length > 0 && (
            <ul className={styles.messages} role="status">
              {messages.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
        </Card>

        {song && entry ? (
          <SongPlayerView key={entry.id} song={song} />
        ) : (
          <Card title="How it works">
            <ol className={styles.steps}>
              <li>
                Import one or more MIDI files. Files with a track named “Bass” are detected
                automatically.
              </li>
              <li>
                Connect your Bass Station II on the <Link to="/hardware">Hardware</Link> page. The
                Academy itself makes no sound: your synth plays the notes, with your sound.
              </li>
              <li>
                Choose <strong>Synth plays</strong> to hear the line, or <strong>You play</strong>{' '}
                to play it on the synth’s keyboard and see which notes you got right.
              </li>
            </ol>
          </Card>
        )}
      </div>
    </>
  );
}

function SongPlayerView({ song }: { song: Song }) {
  const controller = getMidiController();
  const outConnected = useMidiStore(selectOutputConnected);
  const inConnected = useMidiStore(selectInputConnected);
  const midiStatus = useMidiStore((s) => s.status);

  const tracks = useMemo(() => playableTracks(song), [song]);
  const [trackIndex, setTrackIndex] = useState(() => pickBassTrack(song)?.index ?? -1);
  const track = tracks.find((t) => t.index === trackIndex) ?? tracks[0];
  const notes = useMemo(() => (track ? monophonic(track.notes) : []), [track]);

  const [mode, setMode] = useState<Mode>('synth');
  const [rate, setRate] = useState(100);
  const [transpose, setTranspose] = useState(0);
  const [loopOn, setLoopOn] = useState(false);
  const beatsPerBar = song.timeSignature[0] || 4;
  const barSec = song.beatSec * beatsPerBar;
  const bars = Math.max(1, Math.ceil(song.durationSec / Math.max(0.001, barSec)));
  const [loopBars, setLoopBars] = useState<[number, number]>([1, Math.min(4, bars)]);
  const [anyOctave, setAnyOctave] = useState(true);
  const loop = useMemo(
    () =>
      loopOn && barSec > 0
        ? {
            start: (loopBars[0] - 1) * barSec,
            end: Math.min(song.durationSec, loopBars[1] * barSec),
          }
        : null,
    [loopOn, loopBars, barSec, song.durationSec],
  );

  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [grade, setGrade] = useState<GradeState>(EMPTY_GRADE);

  const modeRef = useRef(mode);
  modeRef.current = mode;
  const player = useMemo(
    () =>
      new SongPlayer(
        {
          send: (bytes, at) => {
            if (modeRef.current === 'synth') controller.sendTimed(bytes, at);
          },
        },
        browserClock,
      ),
    [controller],
  );

  useEffect(() => {
    player.load(notes, song.durationSec);
    setPosition(0);
    setPlaying(false);
    setGrade(EMPTY_GRADE);
  }, [player, notes, song.durationSec]);

  useEffect(() => {
    player.setOptions({
      channel: controller.midiChannel,
      transpose,
      rate: rate / 100,
      loop: loop && loop.end - loop.start >= 0.25 ? loop : null,
    });
  }, [player, controller, transpose, rate, loop]);

  useEffect(() => () => player.stop(), [player]);

  // Follow the playhead while playing.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const frame = () => {
      setPosition(player.position());
      if (player.playing) raf = requestAnimationFrame(frame);
      else setPlaying(false);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [playing, player]);

  // "You play": judge notes arriving from the synth's keyboard.
  const tolerance = 0.18 * (rate / 100);
  useEffect(() => {
    if (mode !== 'you' || !playing) return;
    return useHardwareUiStore.subscribe((s, prev) => {
      if (s.playedAt === prev.playedAt || s.heldKey !== -1 || s.playedNote === null) return;
      const note = s.playedNote;
      const at = player.position();
      setGrade((g) =>
        gradePlayedNote(g, notes, note, at, { window: tolerance, anyOctave, transpose }),
      );
    });
  }, [mode, playing, player, notes, tolerance, anyOctave, transpose]);

  useEffect(() => {
    if (mode === 'you' && playing) setGrade((g) => markMissed(g, notes, position, tolerance));
  }, [mode, playing, notes, position, tolerance]);

  const toggle = useCallback(() => {
    if (player.playing) {
      player.pause();
      setPosition(player.position());
      setPlaying(false);
    } else {
      if (player.position() <= (loop?.start ?? 0) + 0.01) setGrade(EMPTY_GRADE);
      player.play(() => setPlaying(false));
      setPlaying(true);
    }
  }, [player, loop]);

  const stop = () => {
    player.stop();
    setPosition(player.position());
    setPlaying(false);
  };

  const seek = (sec: number) => {
    player.seek(sec);
    setPosition(player.position());
    setGrade(EMPTY_GRADE);
  };

  // Space toggles playback (outside text fields).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.code !== 'Space' || t?.closest('input, textarea, select, button, [role=slider]'))
        return;
      e.preventDefault();
      toggle();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [toggle]);

  const currentIndex = noteIndexAt(notes, position);
  const currentNote = notes[currentIndex];
  const sounding = currentNote !== undefined && position < currentNote.start + currentNote.duration;
  const nextNote = notes[currentIndex + 1];
  const stats = summarize(grade);
  const bar = barSec > 0 ? Math.floor(position / barSec) + 1 : 1;
  const beat = song.beatSec > 0 ? (Math.floor(position / song.beatSec) % beatsPerBar) + 1 : 1;

  if (!track) {
    return (
      <Card title={song.title}>
        <EmptyState title="No playable track">
          This file has no notes outside the drum channel.
        </EmptyState>
      </Card>
    );
  }

  return (
    <div className={styles.main}>
      <Card
        title={song.title}
        subtitle={`${song.bpm} BPM · ${song.timeSignature[0]}/${song.timeSignature[1]} · ${bars} bars · ${notes.length} notes in “${track.name}”`}
      >
        <div className={styles.status}>
          {mode === 'synth' ? (
            outConnected ? (
              <Badge tone="success" dot>
                Playing on your synth · MIDI channel {controller.midiChannel}
              </Badge>
            ) : (
              <>
                <Badge tone="warning" dot>
                  No synth connected: the roll runs silently
                </Badge>
                {midiStatus !== 'ready' &&
                midiStatus !== 'unsupported' &&
                midiStatus !== 'insecure' ? (
                  <Button size="sm" onClick={() => void controller.connect()}>
                    Connect MIDI
                  </Button>
                ) : (
                  <ButtonLink size="sm" to="/hardware">
                    Hardware page
                  </ButtonLink>
                )}
              </>
            )
          ) : inConnected ? (
            <Badge tone="success" dot>
              Listening to your keyboard
            </Badge>
          ) : (
            <>
              <Badge tone="warning" dot>
                Connect your synth to be graded
              </Badge>
              <ButtonLink size="sm" to="/hardware">
                Hardware page
              </ButtonLink>
            </>
          )}
        </div>

        <div className={styles.transport}>
          <Button variant="primary" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? '❚❚ Pause' : '▶ Play'}
          </Button>
          <Button onClick={stop}>■ Stop</Button>
          <span className={`${styles.clock} mono`} aria-live="off">
            {formatTime(position)} / {formatTime(song.durationSec)} · bar {bar}.{beat}
          </span>
          <div className={styles.nowPlaying} aria-live="polite">
            <span className={styles.nowLabel}>Now</span>
            <strong className="mono">
              {sounding && currentNote ? noteName(currentNote.note + transpose) : '–'}
            </strong>
            <span className={styles.nowLabel}>Next</span>
            <span className="mono">{nextNote ? noteName(nextNote.note + transpose) : '–'}</span>
          </div>
        </div>

        <PianoRoll
          notes={notes}
          position={position}
          beatSec={song.beatSec}
          beatsPerBar={beatsPerBar}
          transpose={transpose}
          current={sounding ? currentIndex : -1}
          results={grade.results}
          loop={loop}
        />
        <SongOverview notes={notes} duration={song.durationSec} position={position} onSeek={seek} />
      </Card>

      <div className={styles.settings}>
        <Card title="Playback">
          <SegmentedControl
            label="Mode"
            value={mode}
            onChange={(m) => {
              setMode(m);
              setGrade(EMPTY_GRADE);
            }}
            options={[
              { value: 'synth', label: 'Synth plays' },
              { value: 'you', label: 'You play' },
            ]}
            fullWidth
          />
          {tracks.length > 1 && (
            <label className={styles.field}>
              Track
              <select
                className={styles.select}
                value={track.index}
                onChange={(e) => setTrackIndex(Number(e.target.value))}
              >
                {tracks.map((t) => (
                  <option key={t.index} value={t.index}>
                    {t.name} ({t.notes.length} notes)
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className={styles.field}>
            Tempo {rate}% ({Math.round((song.bpm * rate) / 10) / 10} BPM)
            <input
              type="range"
              min={40}
              max={150}
              step={5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </label>
          <label className={styles.field}>
            Transpose {transpose > 0 ? `+${transpose}` : transpose} semitones
            <input
              type="range"
              min={-24}
              max={24}
              step={1}
              value={transpose}
              onChange={(e) => setTranspose(Number(e.target.value))}
            />
          </label>
          <div className={styles.row}>
            <Button size="sm" onClick={() => setTranspose((t) => Math.max(-24, t - 12))}>
              −1 octave
            </Button>
            <Button size="sm" onClick={() => setTranspose((t) => Math.min(24, t + 12))}>
              +1 octave
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setTranspose(0)}>
              Reset
            </Button>
          </div>
          <div className={styles.loopRow}>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={loopOn}
                onChange={(e) => setLoopOn(e.target.checked)}
              />
              Loop bars
            </label>
            <input
              className={styles.num}
              type="number"
              min={1}
              max={bars}
              value={loopBars[0]}
              aria-label="Loop from bar"
              onChange={(e) => {
                const v = Math.max(1, Math.min(bars, Number(e.target.value) || 1));
                setLoopBars(([, b]) => [v, Math.max(v, b)]);
              }}
            />
            <span>to</span>
            <input
              className={styles.num}
              type="number"
              min={1}
              max={bars}
              value={loopBars[1]}
              aria-label="Loop to bar"
              onChange={(e) => {
                const v = Math.max(1, Math.min(bars, Number(e.target.value) || 1));
                setLoopBars(([a]) => [Math.min(a, v), v]);
              }}
            />
          </div>
          <p className={styles.hint}>
            The Bass Station II is monophonic, so overlapping notes are trimmed to one at a time.
            Space plays and pauses.
          </p>
        </Card>

        {mode === 'you' && (
          <Card
            title="Your take"
            subtitle="Notes are judged within a short window around each start."
          >
            <div className={styles.score}>
              <div>
                <strong>{stats.judged ? Math.round(stats.accuracy * 100) : 0}%</strong>
                <span>accuracy</span>
              </div>
              <div>
                <strong className={styles.good}>{stats.hit}</strong>
                <span>right</span>
              </div>
              <div>
                <strong className={styles.bad}>{stats.wrong}</strong>
                <span>wrong note</span>
              </div>
              <div>
                <strong>{stats.missed}</strong>
                <span>missed</span>
              </div>
            </div>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={anyOctave}
                onChange={(e) => setAnyOctave(e.target.checked)}
              />
              Accept the right note in any octave
            </label>
            <p className={styles.hint}>
              Tip: slow the tempo down and loop a few bars until you hit them all.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
