import { chapter1, chapter2 } from './chapter1-2';
import { chapter3, chapter4, chapter5 } from './chapter3-5';
import { chapter6, chapter7, chapter8 } from './chapter6-8';
import { CURRICULUM, type ChapterOutline, type LessonOutline } from './curriculum';
import type { Lesson } from './types';

/** Lesson content keyed by "chapterId/lessonId". */
const BY_CHAPTER: Record<string, Lesson[]> = {
  'sound-fundamentals': chapter1,
  oscillators: chapter2,
  mixer: chapter3,
  filters: chapter4,
  envelopes: chapter5,
  modulation: chapter6,
  performance: chapter7,
  'sound-design': chapter8,
};

export const LESSONS: ReadonlyMap<string, Lesson> = new Map(
  Object.entries(BY_CHAPTER).flatMap(([chapterId, lessons]) =>
    lessons.map((l) => [`${chapterId}/${l.id}`, l] as const),
  ),
);

export function lessonKey(chapterId: string, lessonId: string): string {
  return `${chapterId}/${lessonId}`;
}

export function findLesson(chapterId: string, lessonId: string): Lesson | undefined {
  return LESSONS.get(lessonKey(chapterId, lessonId));
}

export function isLessonAvailable(chapterId: string, lessonId: string): boolean {
  return LESSONS.has(lessonKey(chapterId, lessonId));
}

export interface LessonRef {
  chapter: ChapterOutline;
  outline: LessonOutline;
  key: string;
}

/** All lessons in curriculum order. */
export const LESSON_ORDER: readonly LessonRef[] = CURRICULUM.flatMap((chapter) =>
  chapter.lessons.map((outline) => ({ chapter, outline, key: lessonKey(chapter.id, outline.id) })),
);
