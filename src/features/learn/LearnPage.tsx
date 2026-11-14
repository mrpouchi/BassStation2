import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { CURRICULUM } from '@/data/lessons/curriculum';
import styles from './LearnPage.module.css';

export function LearnPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learn"
        title="Curriculum"
        description="Eight chapters, from what sound is to designing your own patches. Every lesson has an objective, an explanation, a live demonstration, an experiment, an exercise and feedback."
      />
      <p className={styles.notice}>
        The chapter structure is set. Lesson content is being written and lessons open as they are
        completed. You can revisit any lesson at any time, and nothing is locked.
      </p>
      <div className={styles.chapters}>
        {CURRICULUM.map((chapter) => (
          <Card
            key={chapter.id}
            title={chapter.title}
            actions={
              <span className={styles.number}>{String(chapter.number).padStart(2, '0')}</span>
            }
          >
            <ul className={styles.lessons}>
              {chapter.lessons.map((l) => (
                <li key={l.id}>
                  <span>{l.title}</span>
                  <Badge tone={l.status === 'available' ? 'success' : 'neutral'}>
                    {l.status === 'available' ? 'Available' : 'In writing'}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
