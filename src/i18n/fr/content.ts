import type { TextPatch } from '../overlay';
import { FR_CHALLENGES, FR_CHALLENGE_TYPES } from './challenges';
import { FR_CONTROLS } from './controls';
import { FR_CONCEPTS, FR_SECTIONS } from './glossary';
import { FR_CURRICULUM, FR_LESSONS } from './lessons';
import { FR_PARAMETERS } from './parameters';
import { FR_PRESETS } from './presets';

/** French content overlays by content-set name. Loaded on demand (see content.ts). */
export const FR_CONTENT: Readonly<Record<string, Readonly<Record<string, TextPatch>>>> = {
  lessons: FR_LESSONS,
  curriculum: FR_CURRICULUM,
  challenges: FR_CHALLENGES,
  challengeTypes: FR_CHALLENGE_TYPES,
  parameters: FR_PARAMETERS,
  controls: FR_CONTROLS,
  concepts: FR_CONCEPTS,
  sections: FR_SECTIONS,
  presets: FR_PRESETS,
};
