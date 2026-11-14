import { Link } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { CURRICULUM } from '@/data/lessons/curriculum';
import { LESSON_ORDER, lessonKey, nextLessonKey } from '@/data/lessons';
import { useProgressStore } from '@/stores/progressStore';
import styles from './LearnPage.module.css';
import { t } from '@/i18n/t';

export function LearnPage() {
  const completed = useProgressStore((s) => s.lessons);
  const total = LESSON_ORDER.length;
  const done = LESSON_ORDER.filter((l) => completed[l.key]).length;
  const next = nextLessonKey(completed);

  return (
    <>
      <PageHeader
        eyebrow={t('Learn')}
        title={t('Curriculum')}
        description={t(
          'Eight chapters, from what sound is to designing your own patches. Each lesson has an objective, an explanation, a demonstration, an experiment and an exercise with feedback. Open any lesson in any order. Nothing is locked.',
        )}
      />
      <div className={styles.summary}>
        <span>{t('{done} of {total} lessons completed', { done, total })}</span>
        {next && (
          <ButtonLink to={`/learn/${next}`} variant="primary">
            {done === 0 ? t('Start with lesson 1') : t('Continue learning')}
          </ButtonLink>
        )}
      </div>
      <div className={styles.chapters}>
        {CURRICULUM.map((chapter) => {
          const chapterDone = chapter.lessons.filter(
            (l) => completed[lessonKey(chapter.id, l.id)],
          ).length;
          return (
            <Card
              key={chapter.id}
              title={chapter.title}
              subtitle={t('{done} / {total} completed', {
                done: chapterDone,
                total: chapter.lessons.length,
              })}
              actions={
                <span className={styles.number}>{String(chapter.number).padStart(2, '0')}</span>
              }
            >
              <div className={styles.progress} aria-hidden>
                <div
                  className={styles.progressBar}
                  style={{ width: `${(chapterDone / chapter.lessons.length) * 100}%` }}
                />
              </div>
              <ul className={styles.lessons}>
                {chapter.lessons.map((l, i) => {
                  const key = lessonKey(chapter.id, l.id);
                  return (
                    <li key={l.id}>
                      <Link className={styles.lessonLink} to={`/learn/${key}`}>
                        <span>
                          {chapter.number}.{i + 1} {l.title}
                        </span>
                        {completed[key] && (
                          <span className={styles.check} aria-label={t('completed')}>
                            ✓
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>
    </>
  );
}
