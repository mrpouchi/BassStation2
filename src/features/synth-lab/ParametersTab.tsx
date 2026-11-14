import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { PARAMETERS } from '@/data/synthesizer/parameters';
import { SECTIONS } from '@/data/synthesizer/sections';
import { describeMidiMapping } from '@/engine/midi/describe';
import { formatValue } from '@/engine/parameters/registry';
import type { ParameterDefinition, SectionId } from '@/engine/parameters/types';
import { useSynthStore } from '@/stores/synthStore';
import styles from './SynthLabPage.module.css';

function matches(def: ParameterDefinition, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    def.name.toLowerCase().includes(q) ||
    def.description.toLowerCase().includes(q) ||
    def.concepts.some((c) => c.includes(q)) ||
    describeMidiMapping(def.midi.mapping).toLowerCase().includes(q)
  );
}

export function ParametersTab() {
  const [query, setQuery] = useState('');
  const [section, setSection] = useState<SectionId | 'all'>('all');
  const values = useSynthStore((s) => s.values);
  const selectedId = useSynthStore((s) => s.selectedId);
  const select = useSynthStore((s) => s.select);

  const groups = useMemo(() => {
    const visible = PARAMETERS.filter(
      (p) => (section === 'all' || p.section === section) && matches(p, query.trim()),
    );
    return SECTIONS.map((s) => ({
      section: s,
      params: visible.filter((p) => p.section === s.id),
    })).filter((g) => g.params.length > 0);
  }, [query, section]);

  const total = groups.reduce((n, g) => n + g.params.length, 0);

  return (
    <>
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="search"
          placeholder="Search parameters, concepts or MIDI numbers…"
          aria-label="Search parameters"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className={styles.selectInput}
          aria-label="Filter by section"
          value={section}
          onChange={(e) => setSection(e.target.value as SectionId | 'all')}
        >
          <option value="all">All sections</option>
          {SECTIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <span className={styles.count}>
          {total} of {PARAMETERS.length}
        </span>
      </div>

      {groups.length === 0 && (
        <EmptyState title="No parameters match">Try a different search term or section.</EmptyState>
      )}

      {groups.map(({ section: s, params }) => (
        <section key={s.id} className={styles.group} aria-labelledby={`sec-${s.id}`}>
          <h2 id={`sec-${s.id}`} className={styles.groupTitle}>
            {s.name} <span className={styles.groupSummary}>{s.summary}</span>
          </h2>
          <ul className={styles.list}>
            {params.map((p) => {
              const value = values[p.id];
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    className={[styles.row, selectedId === p.id && styles.rowSelected]
                      .filter(Boolean)
                      .join(' ')}
                    aria-pressed={selectedId === p.id}
                    onClick={() => select(p.id)}
                  >
                    <span className={styles.rowName}>
                      {p.name}
                      <span className={styles.rowSub}>{p.description}</span>
                    </span>
                    <span className={`${styles.rowValue} mono`}>
                      {value === undefined ? '—' : formatValue(p, value)}
                    </span>
                    <span className={`${styles.rowMidi} mono`}>
                      {describeMidiMapping(p.midi.mapping)}
                    </span>
                    <span className={styles.rowBadge}>
                      {p.access.kind === 'on-key' && <Badge tone="info">On-Key</Badge>}
                      {p.access.kind === 'function-modifier' && <Badge tone="info">Function</Badge>}
                      {p.scope === 'panel' && <Badge>Routing</Badge>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
