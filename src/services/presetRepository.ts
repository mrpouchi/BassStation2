import { parsePreset, type Preset } from '@/engine/presets/presets';
import { usePresetStore } from '@/stores/presetStore';
import { deleteKey, readAll, writeKey } from './storage/db';

/** Persists presets in IndexedDB (one record per preset) and keeps the store in sync. */
export async function loadPresets(): Promise<{ invalid: number }> {
  const raw = await readAll('presets');
  const presets: Preset[] = [];
  let invalid = 0;
  for (const item of raw) {
    const r = parsePreset(item, { keepId: true });
    if (r.preset) presets.push(r.preset);
    else invalid++;
  }
  presets.sort((a, b) => b.updatedAt - a.updatedAt);
  usePresetStore.getState().setAll(presets);
  return { invalid };
}

export async function savePreset(preset: Preset): Promise<void> {
  usePresetStore.getState().upsert(preset);
  await writeKey('presets', preset.id, preset);
}

export async function deletePreset(id: string): Promise<void> {
  usePresetStore.getState().remove(id);
  await deleteKey('presets', id);
}
