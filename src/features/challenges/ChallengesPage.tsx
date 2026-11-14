import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { CHALLENGE_TYPES, CHALLENGES } from '@/data/challenges/challenges';
import { useProgressStore } from '@/stores/progressStore';
import styles from './Challenges.module.css';

type Filter = 'all' | 'unsolved' | 'solved';

export function ChallengesPage() {
  const records = useProgressStore((s) => s.challenges);
  const [filter, setFilter] = useState<Filter>('all');
  const solved = CHALLENGES.filter((c) => records[c.id]?.solvedAt).length;

  return (
    <>
      <PageHeader
        eyebrow="Challenges"
        title="Practice by doing"
        description="Identify controls, recreate sounds, fix broken patches and read plots. Each check explains what is still off. Attempts are unlimited and nothing is locked."
      />
      <div className={styles.filters}>
        <SegmentedControl
          label="Filter challenges"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'unsolved', label: 'To do' },
            { value: 'solved', label: 'Solved' },
          ]}
        />
        <span>
          {solved} of {CHALLENGES.length} solved
        </span>
      </div>
      {CHALLENGE_TYPES.map((type) => {
        const items = CHALLENGES.filter((c) => c.type === type.id).filter((c) => {
          const isSolved = Boolean(records[c.id]?.solvedAt);
          return filter === 'all' || (filter === 'solved' ? isSolved : !isSolved);
        });
        if (items.length === 0) return null;
        return (
          <section key={type.id} className={styles.group}>
            <div className={styles.groupHead}>
              <h2>{type.name}</h2>
              <p>{type.description}</p>
            </div>
            <div className={styles.cards}>
              {items.map((c) => {
                const r = records[c.id];
                return (
                  <Link key={c.id} to={`/challenges/${c.id}`} className={styles.card}>
                    <span className={styles.cardTitle}>{c.title}</span>
                    <span className={styles.cardBrief}>{c.brief}</span>
                    <span className={styles.meta}>
                      <Badge>{c.level === 'beginner' ? 'Beginner' : 'Intermediate'}</Badge>
                      {r?.solvedAt ? (
                        <Badge tone="success">Solved</Badge>
                      ) : r ? (
                        <Badge tone="warning">
                          {r.attempts} attempt{r.attempts === 1 ? '' : 's'}
                        </Badge>
                      ) : null}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
