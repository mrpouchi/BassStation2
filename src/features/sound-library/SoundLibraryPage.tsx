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
import { t, tn } from '@/i18n/t';

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
          p.tags.some((tag) => tag.includes(q))
        );
      })
      .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : b.updatedAt - a.updatedAt));

  const mine = filter(presets);
  const examples = favoritesOnly ? [] : filter(EXAMPLE_PRESETS);
  const changedCount = changedSoundParameters(values).length;

  const load = (p: Preset) => {
    replaceValues(valuesForLoad(useSynthStore.getState().values, p), 'preset');
    setMessage(t('Loaded “{name}” into Synth Lab.', { name: p.name }));
  };

  const onImport = async (file: File) => {
    const result = parseImportFile(await readFileText(file));
    for (const p of result.presets) await savePreset(p);
    const parts = [
      tn(result.presets.length, 'Imported {count} preset.', 'Imported {count} presets.'),
    ];
    if (result.rejectedParameters > 0)
      parts.push(
        t('{n} unknown or invalid parameter values were ignored.', {
          n: result.rejectedParameters,
        }),
      );
    if (result.errors.length > 0) parts.push(result.errors.map((e) => t(e)).join(' '));
    setMessage(parts.join(' '));
  };

  const compareTarget =
    compareWith === 'current'
      ? { name: t('Current settings'), values: patchValues(values) }
      : all.find((p) => p.id === compareWith);
  const diff =
    selected && compareTarget ? comparePresets(selected.values, compareTarget.values) : [];

  return (
    <>
      <PageHeader
        eyebrow={t('Sound Library')}
        title={t('Your presets')}
        description={t(
          'Save the sounds you design, describe how you made them, compare them and load them back into Synth Lab. Presets are stored on this device.',
        )}
        actions={
          <div className={styles.row}>
            <Button variant="primary" onClick={() => setCreating(true)}>
              {t('Save current sound')}
            </Button>
            <Button onClick={() => fileRef.current?.click()}>{t('Import')}</Button>
            <Button
              disabled={presets.length === 0}
              onClick={() => download('bass-station-academy-presets.json', toExportFile(presets))}
            >
              {t('Export all')}
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              aria-label={t('Import presets file')}
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
          {t(
            'Local storage is unavailable in this browser session. Presets will be lost when you close the page. Export them to keep them.',
          )}
        </p>
      )}
      {message && (
        <p className={styles.notice} role="status">
          {message}
        </p>
      )}

      {creating && (
        <Card
          title={t('Save current sound')}
          subtitle={tn(
            changedCount,
            '{count} sound parameter differs from the Init Patch.',
            '{count} sound parameters differ from the Init Patch.',
          )}
        >
          <PresetForm
            initial={{ name: '', description: '', category: 'other', tags: [] }}
            submitLabel={t('Save preset')}
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
              setMessage(t('Saved “{name}”.', { name: preset.name }));
            }}
          />
        </Card>
      )}

      <div className={styles.toolbar} style={{ marginTop: creating ? 16 : 0 }}>
        <input
          className={`${styles.input} ${styles.search}`}
          type="search"
          placeholder={t('Search name, description or tag…')}
          aria-label={t('Search presets')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className={styles.select}
          aria-label={t('Category')}
          value={category}
          onChange={(e) => setCategory(e.target.value as PresetCategory | 'all')}
        >
          <option value="all">{t('All categories')}</option>
          {PRESET_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {t(CATEGORY_LABELS[c])}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          aria-label={t('Sort')}
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
        >
          <option value="recent">{t('Recently changed')}</option>
          <option value="name">{t('Name')}</option>
        </select>
        <label className={styles.row}>
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(e) => setFavoritesOnly(e.target.checked)}
          />{' '}
          {t('Favourites')}
        </label>
      </div>

      <div className={styles.layout}>
        <div>
          <p className={styles.sectionTitle}>{t('My presets ({n})', { n: mine.length })}</p>
          {presets.length === 0 ? (
            <EmptyState title={t('No saved presets yet')}>
              {t(
                'Design a sound in Synth Lab, then click “Save current sound”. You can also load one of the examples below.',
              )}
            </EmptyState>
          ) : mine.length === 0 ? (
            <p className={styles.muted}>{t('No presets match these filters.')}</p>
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
              <p className={styles.sectionTitle}>
                {t('Academy examples ({n})', { n: examples.length })}
              </p>
              <PresetList items={examples} selectedId={selectedId} onSelect={setSelectedId} />
            </>
          )}
        </div>

        <div className={styles.side}>
          {!selected ? (
            <Card title={t('Details')}>
              <p className={styles.muted}>
                {t('Select a preset to load, edit, compare or export it.')}
              </p>
            </Card>
          ) : (
            <>
              <Card
                title={selected.name}
                subtitle={t('{category} · {n} stored values', {
                  category: t(CATEGORY_LABELS[selected.category]),
                  n: Object.keys(selected.values).length,
                })}
                actions={isExample ? <Badge tone="info">{t('Example')}</Badge> : undefined}
              >
                {selected.description && <p>{selected.description}</p>}
                {selected.tags.length > 0 && (
                  <div className={styles.row}>
                    {selected.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                )}
                <div className={styles.row}>
                  <Button variant="primary" onClick={() => load(selected)}>
                    {t('Load')}
                  </Button>
                  <Button
                    onClick={() => {
                      load(selected);
                      navigate('/synth-lab');
                    }}
                  >
                    {t('Load & open Synth Lab')}
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
                        name: t('{name} (copy)', { name: selected.name }),
                        favorite: false,
                        createdAt: now,
                        updatedAt: now,
                        tags: selected.tags.filter((tag) => tag !== 'example'),
                      };
                      await savePreset(copy);
                      setSelectedId(copy.id);
                      setMessage(t('Duplicated as “{name}”.', { name: copy.name }));
                    }}
                  >
                    {t('Duplicate')}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      download(`${slug(selected.name)}.json`, toExportFile([selected]))
                    }
                  >
                    {t('Export')}
                  </Button>
                  {!isExample && (
                    <>
                      <Button
                        size="sm"
                        title={t(
                          "Replace this preset's sound with your current Synth Lab settings",
                        )}
                        onClick={async () => {
                          if (
                            !window.confirm(
                              t('Overwrite “{name}” with your current settings?', {
                                name: selected.name,
                              }),
                            )
                          )
                            return;
                          await savePreset({
                            ...selected,
                            values: patchValues(values),
                            updatedAt: Date.now(),
                          });
                          setMessage(
                            t('Updated “{name}” with the current settings.', {
                              name: selected.name,
                            }),
                          );
                        }}
                      >
                        {t('Overwrite with current')}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          if (
                            !window.confirm(
                              t('Delete “{name}”? This cannot be undone.', { name: selected.name }),
                            )
                          )
                            return;
                          await deletePreset(selected.id);
                          setSelectedId(null);
                          setMessage(t('Deleted “{name}”.', { name: selected.name }));
                        }}
                      >
                        {t('Delete')}
                      </Button>
                    </>
                  )}
                </div>
              </Card>

              {!isExample && (
                <Card title={t('Edit details')}>
                  <PresetForm
                    key={selected.id}
                    initial={selected}
                    submitLabel={t('Save details')}
                    onSubmit={async (meta) => {
                      await savePreset({ ...selected, ...meta, updatedAt: Date.now() });
                      setMessage(t('Details saved.'));
                    }}
                  />
                </Card>
              )}

              <Card title={t('Compare')}>
                <label className={styles.field}>
                  {t('Compare “{name}” with', { name: selected.name })}
                  <select
                    className={styles.select}
                    value={compareWith}
                    onChange={(e) => setCompareWith(e.target.value)}
                  >
                    <option value="current">{t('Current Synth Lab settings')}</option>
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
                  <p className={styles.muted}>{t('The two sounds are identical.')}</p>
                ) : (
                  <table className={styles.diff}>
                    <thead>
                      <tr>
                        <th>{t('Parameter')}</th>
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
        {t(
          'Preset files use the Academy’s own JSON format. Sending presets to the synth’s patch memories (SysEx) is not supported, because Novation does not document the patch format. With a MIDI connection you can send the current settings parameter by parameter from the Hardware page.',
        )}
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
                p.favorite
                  ? t('Remove {name} from favourites', { name: p.name })
                  : t('Add {name} to favourites', { name: p.name })
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
            <span className={styles.itemDesc}>{p.description || t('No description')}</span>
          </span>
          <Badge>{t(CATEGORY_LABELS[p.category])}</Badge>
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
                .map((tag) => tag.trim().toLowerCase())
                .filter(Boolean),
            ),
          ].slice(0, 12),
        });
      }}
    >
      <label className={styles.field}>
        {t('Name')}
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          required
        />
      </label>
      <label className={styles.field}>
        {t('Description: how you made it, what to try')}
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
        />
      </label>
      <div className={styles.row}>
        <label className={styles.field} style={{ flex: 1 }}>
          {t('Category')}
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value as PresetCategory)}
          >
            {PRESET_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(CATEGORY_LABELS[c])}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field} style={{ flex: 2 }}>
          {t('Tags (comma-separated)')}
          <input className={styles.input} value={tags} onChange={(e) => setTags(e.target.value)} />
        </label>
      </div>
      <div className={styles.row}>
        <Button type="submit" variant="primary" disabled={!valid}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            {t('Cancel')}
          </Button>
        )}
      </div>
    </form>
  );
}
