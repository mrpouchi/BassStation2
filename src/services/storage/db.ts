import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

/**
 * Local persistence (IndexedDB). No backend: everything stays on this device.
 *
 * Schema changes MUST bump DB_VERSION and append a migration to MIGRATIONS.
 * Migrations run in order from the stored version to DB_VERSION.
 */
export const DB_NAME = 'bass-station-academy';
export const DB_VERSION = 2;

export interface AcademyDB extends DBSchema {
  /** Small key/value settings (theme, last view…). */
  preferences: { key: string; value: unknown };
  /** Working state restored between visits (current panel values…). */
  session: { key: string; value: unknown };
  /** Saved presets (Phase 6). */
  presets: { key: string; value: unknown };
  /** Learning and challenge progress (Phases 3–4). */
  progress: { key: string; value: unknown };
  /** MIDI files imported for Play Along (raw bytes, parsed on load). */
  songs: { key: string; value: unknown };
}

type Migration = (db: IDBPDatabase<AcademyDB>) => void;

const MIGRATIONS: readonly Migration[] = [
  // v0 → v1: initial stores.
  (db) => {
    db.createObjectStore('preferences');
    db.createObjectStore('session');
    db.createObjectStore('presets');
    db.createObjectStore('progress');
  },
  // v1 → v2: imported MIDI files for Play Along.
  (db) => {
    db.createObjectStore('songs');
  },
];

let dbPromise: Promise<IDBPDatabase<AcademyDB>> | null = null;

export function getDb(): Promise<IDBPDatabase<AcademyDB>> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available in this browser.'));
  }
  dbPromise ??= openDB<AcademyDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      for (let v = oldVersion; v < DB_VERSION; v++) MIGRATIONS[v]?.(db);
    },
  }).catch((error: unknown) => {
    dbPromise = null;
    throw error;
  });
  return dbPromise;
}

export type StoreName = 'preferences' | 'session' | 'presets' | 'progress' | 'songs';

export async function readKey(store: StoreName, key: string): Promise<unknown> {
  return (await getDb()).get(store, key);
}

export async function writeKey(store: StoreName, key: string, value: unknown): Promise<void> {
  await (await getDb()).put(store, value, key);
}

export async function deleteKey(store: StoreName, key: string): Promise<void> {
  await (await getDb()).delete(store, key);
}

export async function readAll(store: StoreName): Promise<unknown[]> {
  return (await getDb()).getAll(store);
}

/** Test helper: forget the cached connection. */
export function resetDbConnectionForTests(): void {
  dbPromise = null;
}
