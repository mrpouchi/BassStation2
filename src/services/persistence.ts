import { isThemePreference, usePreferencesStore } from '@/stores/preferencesStore';
import { usePersistenceStore } from '@/stores/persistenceStore';
import { parseMidiSettings, useMidiStore, type StoredMidiSettings } from '@/stores/midiStore';
import { parseProgress, serializeProgress, useProgressStore } from '@/stores/progressStore';
import { useSynthStore } from '@/stores/synthStore';
import { loadPresets } from './presetRepository';
import { loadSongs } from './songRepository';
import { readKey, writeKey } from './storage/db';

const SAVE_DELAY_MS = 400;

/** Envelope for persisted panel state, so future formats can be migrated. */
interface StoredPanelState {
  format: 1;
  values: unknown;
}

function isStoredPanelState(v: unknown): v is StoredPanelState {
  return typeof v === 'object' && v !== null && (v as { format?: unknown }).format === 1;
}

/**
 * Restores saved state, then keeps IndexedDB in sync with the stores.
 * The app stays fully usable if storage is unavailable (e.g. private mode).
 */
export async function initPersistence(): Promise<void> {
  const status = usePersistenceStore.getState();
  try {
    const [theme, panel, progress, midi] = await Promise.all([
      readKey('preferences', 'theme'),
      readKey('session', 'panel'),
      readKey('progress', 'v1'),
      readKey('preferences', 'midi'),
    ]);
    const midiSettings = parseMidiSettings(midi);
    if (midiSettings) {
      useMidiStore.getState().set({
        receive: midiSettings.receive,
        send: midiSettings.send,
        preferredInputName: midiSettings.preferredInputName,
        preferredOutputName: midiSettings.preferredOutputName,
        verification: midiSettings.verification,
        learnedValues: midiSettings.learnedValues ?? {},
      });
    }
    const parsedProgress = parseProgress(progress);
    if (parsedProgress) useProgressStore.getState().load(parsedProgress);
    if (isThemePreference(theme)) usePreferencesStore.getState().setTheme(theme);
    if (isStoredPanelState(panel)) {
      const rejected = useSynthStore.getState().replaceValues(panel.values, 'system');
      if (rejected.length > 0) console.warn('Ignored invalid stored parameters:', rejected);
    }
    await loadPresets();
    await loadSongs();
    status.setStatus('ready');
  } catch (error) {
    status.setStatus('unavailable', error instanceof Error ? error.message : String(error));
    return;
  }

  usePreferencesStore.subscribe((s, prev) => {
    if (s.theme !== prev.theme) void writeKey('preferences', 'theme', s.theme).catch(reportError);
  });

  useMidiStore.subscribe((s, prev) => {
    if (
      s.receive === prev.receive &&
      s.send === prev.send &&
      s.preferredInputName === prev.preferredInputName &&
      s.preferredOutputName === prev.preferredOutputName &&
      s.verification === prev.verification &&
      s.learnedValues === prev.learnedValues
    )
      return;
    const payload: StoredMidiSettings = {
      format: 1,
      receive: s.receive,
      send: s.send,
      preferredInputName: s.preferredInputName,
      preferredOutputName: s.preferredOutputName,
      verification: s.verification,
      learnedValues: s.learnedValues,
    };
    void writeKey('preferences', 'midi', payload).catch(reportError);
  });

  useProgressStore.subscribe((s) => {
    void writeKey('progress', 'v1', serializeProgress(s)).catch(reportError);
  });

  let timer: ReturnType<typeof setTimeout> | undefined;
  useSynthStore.subscribe((s, prev) => {
    if (s.values === prev.values) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const payload: StoredPanelState = { format: 1, values: s.values };
      void writeKey('session', 'panel', payload).catch(reportError);
    }, SAVE_DELAY_MS);
  });
}

function reportError(error: unknown): void {
  usePersistenceStore
    .getState()
    .setStatus('unavailable', error instanceof Error ? error.message : String(error));
}
