import type { VisualKind } from '@/components/visualizers/LessonVisual';
import type { ParameterValue } from '@/engine/parameters/types';
import type { Task } from '@/engine/tasks/tasks';

/**
 * A complete lesson: objective, explanation, visual demonstration,
 * interactive experiment, practical exercise, validation feedback.
 */
export interface Lesson {
  readonly id: string;
  readonly objective: string;
  readonly explanation: readonly string[];
  readonly demonstration: {
    readonly visual: VisualKind;
    /** Applied on top of the Init Patch for the demo only (never touches the user's state). */
    readonly values: Readonly<Record<string, ParameterValue>>;
    readonly caption: string;
  };
  readonly experiment: {
    readonly steps: readonly string[];
    readonly parameters: readonly string[];
    readonly visual: VisualKind;
    /** Optional starting point (Init Patch + these values) the user can load. */
    readonly start?: Readonly<Record<string, ParameterValue>>;
  };
  readonly exercise: Task;
  /** Shown when the exercise is passed: what the learner just achieved. */
  readonly success: string;
}
