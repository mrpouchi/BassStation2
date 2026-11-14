import { MidiFileError, parseMidiFile } from '@/engine/songs/midiFile';
import { useSongStore, type StoredSong } from '@/stores/songStore';
import { deleteKey, readAll, writeKey } from './storage/db';

/** Largest MIDI file accepted (backing tracks are typically 5–50 KB). */
export const MAX_SONG_BYTES = 2 * 1024 * 1024;

interface SongRecord {
  format: 1;
  id: string;
  fileName: string;
  addedAt: number;
  bytes: Uint8Array;
}

/** Byte data as stored; structured clones may come from another realm, so no instanceof. */
function asBytes(v: unknown): Uint8Array | null {
  const tag = Object.prototype.toString.call(v);
  if (tag === '[object Uint8Array]') return new Uint8Array(v as ArrayLike<number>);
  if (tag === '[object ArrayBuffer]') return new Uint8Array(v as ArrayBuffer);
  return null;
}

function parseSongRecord(v: unknown): SongRecord | null {
  if (typeof v !== 'object' || v === null) return null;
  const o = v as Record<string, unknown>;
  const bytes = asBytes(o.bytes);
  if (
    o.format !== 1 ||
    typeof o.id !== 'string' ||
    typeof o.fileName !== 'string' ||
    typeof o.addedAt !== 'number' ||
    !bytes
  )
    return null;
  return { format: 1, id: o.id, fileName: o.fileName, addedAt: o.addedAt, bytes };
}

const titleFromFile = (fileName: string) => fileName.replace(/\.(mid|midi|smf)$/i, '').trim();

function toStored(r: SongRecord): StoredSong {
  return {
    id: r.id,
    fileName: r.fileName,
    addedAt: r.addedAt,
    size: r.bytes.length,
    song: parseMidiFile(r.bytes, titleFromFile(r.fileName)),
  };
}

export async function loadSongs(): Promise<{ invalid: number }> {
  let invalid = 0;
  const songs: StoredSong[] = [];
  for (const item of await readAll('songs')) {
    try {
      const record = parseSongRecord(item);
      if (!record) throw new MidiFileError('Invalid record.');
      songs.push(toStored(record));
    } catch {
      invalid++;
    }
  }
  songs.sort((a, b) => a.song.title.localeCompare(b.song.title));
  useSongStore.getState().setAll(songs);
  return { invalid };
}

export type ImportOutcome =
  | { ok: true; song: StoredSong; persisted: boolean }
  | { ok: false; fileName: string; error: string };

/** Parses a MIDI file and saves it. A file that cannot be parsed is rejected, not stored. */
export async function importSong(fileName: string, data: ArrayBuffer): Promise<ImportOutcome> {
  if (data.byteLength > MAX_SONG_BYTES)
    return { ok: false, fileName, error: 'File is larger than 2 MB.' };
  const record: SongRecord = {
    format: 1,
    id: `song-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    fileName,
    addedAt: Date.now(),
    bytes: new Uint8Array(data.slice(0)),
  };
  let stored: StoredSong;
  try {
    stored = toStored(record);
  } catch (e) {
    return { ok: false, fileName, error: e instanceof Error ? e.message : 'Unreadable file.' };
  }
  useSongStore.getState().add(stored);
  try {
    await writeKey('songs', record.id, record);
    return { ok: true, song: stored, persisted: true };
  } catch {
    return { ok: true, song: stored, persisted: false };
  }
}

export async function deleteSong(id: string): Promise<void> {
  useSongStore.getState().remove(id);
  await deleteKey('songs', id).catch(() => undefined);
}
