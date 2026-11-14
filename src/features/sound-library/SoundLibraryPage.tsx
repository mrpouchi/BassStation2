import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { EXAMPLE_PRESETS } from '@/data/presets/examples';
import { getSection } from '@/data/synthesizer/sections';
import {
  CATEGORY_LABELS,
  comparePresets,
  newId,
  parseImportFile,
  patchValues,
  PRESET_CATEGORIES,
  toExportFile,
  valuesForLoad,
  type Preset,
  type PresetCategory,
} from '@/engine/presets/presets';
import { changedSoundParameters } from '@/engine/tasks/tasks';
import { deletePreset, savePreset } from '@/services/presetRepository';
import { usePersistenceStore } from '@/stores/persistenceStore';
import { usePresetStore } from '@/stores/presetStore';
import { useSynthStore } from '@/stores/synthStore';
import styles from './SoundLibrary.module.css';

type Sort = 'recent' | 'name';

function download(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function readFileText(file: File): Promise<string> {
  if (typeof file.text === 'function') return file.text();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read the file.'));
    reader.readAsText(file);
  });
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'preset';

export function SoundLibraryPage() {
  const presets = usePresetStore((s) => s.presets);
  const storage = usePersistenceStore((s) => s.status);
  const values = useSynthStore((s) => s.values);
  const replaceValues = useSynthStore((s) => s.replaceValues);
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<PresetCategory | 'all'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState<Sort>('recent');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [compareWith, setCompareWith] = useState<string>('current');
  const [message, setMessage] = useState<string | null>(null);

  const all = useMemo(() => [...presets, ...EXAMPLE_PRESETS], [presets]);
  const selected = all.find((p) => p.id === selectedId) ?? null;
  const isExample = selected ? EXAMPLE_PRESETS.some((e) => e.id === selected.id) : false;

  const filter = (list: readonly Preset[]) =>
    list
      .filter((p) => category === 'all' || p.category === category)
      .filter((p) => !favoritesOnly || p.favorite)
      .filter((p) => {
        const q = query.trim().toLowerCase();
        return (
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
        );
      })
      .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : b.updatedAt - a.updatedAt));

  const mine = filter(presets);
  const examples = favoritesOnly ? [] : filter(EXAMPLE_PRESETS);
  const changedCount = changedSoundParameters(values).length;

  const load = (p: Preset) => {
    replaceValues(valuesForLoad(useSynthStore.getState().values, p), 'preset');
    setMessage(`Loaded “${p.name}” into Synth Lab.`);
  };

  const onImport = async (file: File) => {
    const result = parseImportFile(await readFileText(file));
    for (const p of result.presets) await savePreset(p);
    const parts = [
      `Imported ${result.presets.length} preset${result.presets.length === 1 ? '' : 's'}.`,
    ];
    if (result.rejectedParameters > 0)
      parts.push(`${result.rejectedParameters} unknown or invalid parameter values were ignored.`);
    if (result.errors.length > 0) parts.push(result.errors.join(' '));
    setMessage(parts.join(' '));
  };

  const compareTarget =
    compareWith === 'current'
      ? { name: 'Current settings', values: patchValues(values) }
      : all.find((p) => p.id === compareWith);
  const diff =
    selected && compareTarget ? comparePresets(selected.values, compareTarget.values) : [];

  return (
    <>
      <PageHeader
        eyebrow="Sound Library"
        title="Your presets"
        description="Save the sounds you design, describe how you made them, compare them and load them back into Synth Lab. Presets are stored on this device."
        actions={
          <div className={styles.row}>
            <Button variant="primary" onClick={() => setCreating(true)}>
              Save current sound
            </Button>
            <Button onClick={() => fileRef.current?.click()}>Import</Button>
            <Button
              disabled={presets.length === 0}
              onClick={() => download('bass-station-academy-presets.json', toExportFile(presets))}
            >
              Export all
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              aria-label="Import presets file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onImport(f);
                e.target.value = '';
              }}
            />
          </div>
        }
      />

      {storage === 'unavailable' && (
        <p className={styles.notice}>
          Local storage is unavailable in this browser session. Presets will be lost when you close
          the page. Export them to keep them.
        </p>
      )}
      {message && (
        <p className={styles.notice} role="status">
          {message}
        </p>
      )}

      {creating && (
        <Card
          title="Save current sound"
          subtitle={`${changedCount} sound parameter${changedCount === 1 ? '' : 's'} differ from the Init Patch.`}
        >
          <PresetForm
            initial={{ name: '', description: '', category: 'other', tags: [] }}
            submitLabel="Save preset"
            onCancel={() => setCreating(false)}
            onSubmit={async (meta) => {
              const now = Date.now();
              const preset: Preset = {
                id: newId(),
                favorite: false,
                values: patchValues(values),
                createdAt: now,
                updatedAt: now,
                ...meta,
              };
              await savePreset(preset);
              setCreating(false);
              setSelectedId(preset.id);
              setMessage(`Saved “${preset.name}”.`);
            }}
          />
        </Card>
      )}

      <div className={styles.toolbar} style={{ marginTop: creating ? 16 : 0 }}>
        <input
          className={`${styles.input} ${styles.search}`}
          type="search"
          placeholder="Search name, description or tag…"
          aria-label="Search presets"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className={styles.select}
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as PresetCategory | 'all')}
        >
          <option value="all">All categories</option>
          {PRESET_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          aria-label="Sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
        >
          <option value="recent">Recently changed</option>
          <option value="name">Name</option>
        </select>
        <label className={styles.row}>
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(e) => setFavoritesOnly(e.target.checked)}
          />{' '}
          Favourites
        </label>
      </div>

      <div className={styles.layout}>
        <div>
          <p className={styles.sectionTitle}>My presets ({mine.length})</p>
          {presets.length === 0 ? (
            <EmptyState title="No saved presets yet">
              Design a sound in Synth Lab, then click “Save current sound”. You can also load one of
              the examples below.
            </EmptyState>
          ) : mine.length === 0 ? (
            <p className={styles.muted}>No presets match these filters.</p>
          ) : (
            <PresetList
              items={mine}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onToggleFavorite={(p) => void savePreset({ ...p, favorite: !p.favorite })}
            />
          )}
          {examples.length > 0 && (
            <>
              <p className={styles.sectionTitle}>Academy examples ({examples.length})</p>
              <PresetList items={examples} selectedId={selectedId} onSelect={setSelectedId} />
            </>
          )}
        </div>

        <div className={styles.side}>
          {!selected ? (
            <Card title="Details">
              <p className={styles.muted}>Select a preset to load, edit, compare or export it.</p>
            </Card>
          ) : (
            <>
              <Card
                title={selected.name}
                subtitle={`${CATEGORY_LABELS[selected.category]} · ${Object.keys(selected.values).length} stored values`}
                actions={isExample ? <Badge tone="info">Example</Badge> : undefined}
              >
                {selected.description && <p>{selected.description}</p>}
                {selected.tags.length > 0 && (
                  <div className={styles.row}>
                    {selected.tags.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                )}
                <div className={styles.row}>
                  <Button variant="primary" onClick={() => load(selected)}>
                    Load
                  </Button>
                  <Button
                    onClick={() => {
                      load(selected);
                      navigate('/synth-lab');
                    }}
                  >
                    Load &amp; open Synth Lab
                  </Button>
                </div>
                <div className={styles.row}>
                  <Button
                    size="sm"
                    onClick={async () => {
                      const now = Date.now();
                      const copy: Preset = {
                        ...selected,
                        id: newId(),
                        name: `${selected.name} (copy)`,
                        favorite: false,
                        createdAt: now,
                        updatedAt: now,
                        tags: selected.tags.filter((t) => t !== 'example'),
                      };
                      await savePreset(copy);
                      setSelectedId(copy.id);
                      setMessage(`Duplicated as “${copy.name}”.`);
                    }}
                  >
                    Duplicate
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      download(`${slug(selected.name)}.json`, toExportFile([selected]))
                    }
                  >
                    Export
                  </Button>
                  {!isExample && (
                    <>
                      <Button
                        size="sm"
                        title="Replace this preset's sound with your current Synth Lab settings"
                        onClick={async () => {
                          if (
                            !window.confirm(
                              `Overwrite “${selected.name}” with your current settings?`,
                            )
                          )
                            return;
                          await savePreset({
                            ...selected,
                            values: patchValues(values),
                            updatedAt: Date.now(),
                          });
                          setMessage(`Updated “${selected.name}” with the current settings.`);
                        }}
                      >
                        Overwrite with current
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          if (!window.confirm(`Delete “${selected.name}”? This cannot be undone.`))
                            return;
                          await deletePreset(selected.id);
                          setSelectedId(null);
                          setMessage(`Deleted “${selected.name}”.`);
                        }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </Card>

              {!isExample && (
                <Card title="Edit details">
                  <PresetForm
                    key={selected.id}
                    initial={selected}
                    submitLabel="Save details"
                    onSubmit={async (meta) => {
                      await savePreset({ ...selected, ...meta, updatedAt: Date.now() });
                      setMessage('Details saved.');
                    }}
                  />
                </Card>
              )}

              <Card title="Compare">
                <label className={styles.field}>
                  Compare “{selected.name}” with
                  <select
                    className={styles.select}
                    value={compareWith}
                    onChange={(e) => setCompareWith(e.target.value)}
                  >
                    <option value="current">Current Synth Lab settings</option>
                    {all
                      .filter((p) => p.id !== selected.id)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </label>
                {diff.length === 0 ? (
                  <p className={styles.muted}>The two sounds are identical.</p>
                ) : (
                  <table className={styles.diff}>
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>{selected.name}</th>
                        <th>{compareTarget?.name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diff.map((d) => (
                        <tr key={d.id}>
                          <td>
                            {d.name}
                            <span className={styles.itemDesc}>{getSection(d.section).name}</span>
                          </td>
                          <td className="mono">{d.a}</td>
                          <td className="mono">{d.b}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
      <p className={styles.muted} style={{ marginTop: 24 }}>
        Preset files use the Academy’s own JSON format. Sending presets to the synth’s patch
        memories (SysEx) is not supported, because Novation does not document the patch format. With
        a MIDI connection you can send the current settings parameter by parameter from the Hardware
        page.
      </p>
    </>
  );
}

function PresetList({
  items,
  selectedId,
  onSelect,
  onToggleFavorite,
}: {
  items: readonly Preset[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleFavorite?: (p: Preset) => void;
}) {
  return (
    <div className={styles.list}>
      {items.map((p) => (
        <div
          key={p.id}
          className={[styles.item, p.id === selectedId && styles.itemSelected]
            .filter(Boolean)
            .join(' ')}
          onClick={() => onSelect(p.id)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(p.id)}
          role="button"
          tabIndex={0}
          aria-pressed={p.id === selectedId}
        >
          {onToggleFavorite ? (
            <button
              type="button"
              className={[styles.star, p.favorite && styles.starOn].filter(Boolean).join(' ')}
              aria-label={
                p.favorite ? `Remove ${p.name} from favourites` : `Add ${p.name} to favourites`
              }
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(p);
              }}
            >
              {p.favorite ? '★' : '☆'}
            </button>
          ) : (
            <span />
          )}
          <span style={{ minWidth: 0 }}>
            <span className={styles.itemName}>{p.name}</span>
            <span className={styles.itemDesc}>{p.description || 'No description'}</span>
          </span>
          <Badge>{CATEGORY_LABELS[p.category]}</Badge>
        </div>
      ))}
    </div>
  );
}

interface Meta {
  name: string;
  description: string;
  category: PresetCategory;
  tags: string[];
}

function PresetForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: Meta;
  submitLabel: string;
  onSubmit: (meta: Meta) => void | Promise<void>;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [category, setCategory] = useState<PresetCategory>(initial.category);
  const [tags, setTags] = useState(initial.tags.join(', '));
  const valid = name.trim().length > 0;

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        void onSubmit({
          name: name.trim().slice(0, 80),
          description: description.trim().slice(0, 1000),
          category,
          tags: [
            ...new Set(
              tags
                .split(',')
                .map((t) => t.trim().toLowerCase())
                .filter(Boolean),
            ),
          ].slice(0, 12),
        });
      }}
    >
      <label className={styles.field}>
        Name
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          required
        />
      </label>
      <label className={styles.field}>
        Description: how you made it, what to try
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
        />
      </label>
      <div className={styles.row}>
        <label className={styles.field} style={{ flex: 1 }}>
          Category
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value as PresetCategory)}
          >
            {PRESET_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field} style={{ flex: 2 }}>
          Tags (comma-separated)
          <input className={styles.input} value={tags} onChange={(e) => setTags(e.target.value)} />
        </label>
      </div>
      <div className={styles.row}>
        <Button type="submit" variant="primary" disabled={!valid}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
