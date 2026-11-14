import type { TextPatch } from '../overlay';

// French text for the content set(s) below, in the same shape as the English data.
// Generated from translation tables; tests check that it matches and is complete.

export const FR_PRESETS: Readonly<Record<string, TextPatch>> = {
  'example-sub-bass': {
    description:
      'Dent de scie plus un sub sinus, passe-bas fermé, enveloppe serrée. Construit dans la leçon 8.1.',
  },
  'example-acid': {
    description:
      'Filtre Acid, résonance élevée, balayage court de la Mod Env. Activez l’arpégiateur avec Latch.',
  },
  'example-sync-lead': {
    description:
      'Osc 2 en hard sync une quinte au-dessus. Balayez Osc 2 avec la molette de modulation (Mod Wh : Osc 2 Pitch).',
  },
  'example-pwm-pad': {
    description:
      'Deux oscillateurs en impulsion avec une modulation lente de largeur d’impulsion par le LFO 2, attaque et release lentes.',
  },
  'example-pluck': {
    description: 'Triangle et carré, filtre balayé par l’enveloppe, sans sustain.',
  },
  'example-tom': {
    description:
      'Sinus avec un balayage de hauteur rapide vers le bas et une enveloppe d’amplitude à durée fixe.',
  },
};
