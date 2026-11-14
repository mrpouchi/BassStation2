import type { TextPatch } from '../overlay';

// French text for the content set(s) below, in the same shape as the English data.
// Generated from translation tables; tests check that it matches and is complete.

export const FR_CONCEPTS: Readonly<Record<string, TextPatch>> = {
  frequency: {
    term: 'Fréquence',
    definition: 'Nombre de répétitions d’une onde par seconde, mesuré en hertz (Hz).',
  },
  amplitude: {
    term: 'Amplitude',
    definition: 'La taille d’une onde : le volume d’un son.',
  },
  waveform: {
    term: 'Forme d’onde',
    definition:
      'La forme d’un cycle de l’onde. Elle détermine les harmoniques que contient le son.',
  },
  pitch: {
    term: 'Hauteur',
    definition: 'Le caractère aigu ou grave d’une note. C’est notre perception de la fréquence.',
  },
  harmonics: {
    term: 'Harmoniques',
    definition:
      'Sons plus faibles à des multiples entiers de la fréquence fondamentale, qui donnent sa couleur au son.',
  },
  timbre: {
    term: 'Timbre',
    definition: 'La couleur sonore qui distingue deux sons de même hauteur et de même volume.',
  },
  oscillator: {
    term: 'Oscillateur',
    definition:
      'Le circuit qui génère une forme d’onde répétitive. C’est la source sonore d’un synthétiseur.',
  },
  octave: {
    term: 'Octave',
    definition: 'L’intervalle entre une fréquence et le double de cette fréquence.',
  },
  semitone: {
    term: 'Demi-ton',
    definition: 'Le plus petit intervalle d’un clavier. Douze forment une octave.',
  },
  cent: {
    term: 'Cent',
    definition: 'Un centième de demi-ton, utilisé pour l’accordage fin.',
  },
  'pulse-width': {
    term: 'Largeur d’impulsion',
    definition:
      'La part de chaque cycle pendant laquelle une onde d’impulsion est « haute ». 50 % donne une onde carrée.',
  },
  'sub-oscillator': {
    term: 'Sub-oscillateur',
    definition:
      'Un oscillateur supplémentaire calé une ou deux octaves sous l’oscillateur principal.',
  },
  mixer: {
    term: 'Mixer',
    definition: 'Combine plusieurs sources sonores à des niveaux réglables.',
  },
  noise: {
    term: 'Bruit',
    definition: 'Un signal aléatoire contenant toutes les fréquences, sans hauteur définie.',
  },
  'ring-modulation': {
    term: 'Modulation en anneau',
    definition:
      'Multiplie deux signaux et produit les fréquences somme et différence. Le résultat est souvent métallique.',
  },
  filter: {
    term: 'Filtre',
    definition: 'Retire ou accentue certaines parties du spectre de fréquences.',
  },
  'low-pass': {
    term: 'Filtre passe-bas',
    definition: 'Laisse passer les basses fréquences et retire celles au-dessus de la coupure.',
  },
  'band-pass': {
    term: 'Filtre passe-bande',
    definition: 'Laisse passer une bande autour d’une fréquence centrale et retire le reste.',
  },
  'high-pass': {
    term: 'Filtre passe-haut',
    definition: 'Laisse passer les hautes fréquences et retire celles sous la coupure.',
  },
  cutoff: {
    term: 'Fréquence de coupure',
    definition: 'La fréquence à partir de laquelle un filtre agit.',
  },
  resonance: {
    term: 'Résonance',
    definition: 'Une accentuation des fréquences situées juste à la coupure.',
  },
  'filter-slope': {
    term: 'Pente du filtre',
    definition:
      'La raideur avec laquelle un filtre atténue au-delà de sa coupure, en dB par octave.',
  },
  overdrive: {
    term: 'Overdrive',
    definition: 'Saturation qui ajoute des harmoniques en poussant le signal jusqu’à l’écrêtage.',
  },
  distortion: {
    term: 'Distorsion',
    definition:
      'Déformation volontaire d’une forme d’onde, qui ajoute des harmoniques et de l’agressivité.',
  },
  envelope: {
    term: 'Enveloppe',
    definition: 'Une forme qui fait évoluer un paramètre pendant la durée d’une note.',
  },
  adsr: {
    term: 'ADSR',
    definition: 'Attack, Decay, Sustain, Release : les quatre étapes d’une enveloppe classique.',
  },
  attack: {
    term: 'Attack',
    definition: 'Temps entre l’appui sur la touche et le sommet de l’enveloppe.',
  },
  decay: {
    term: 'Decay',
    definition: 'Temps pour descendre du sommet jusqu’au niveau de sustain.',
  },
  sustain: {
    term: 'Sustain',
    definition: 'Le niveau maintenu tant que la touche reste enfoncée.',
  },
  release: {
    term: 'Release',
    definition: 'Temps entre le relâchement de la touche et le retour à zéro.',
  },
  vca: {
    term: 'VCA',
    definition:
      'Amplificateur contrôlé en tension : l’étage qui fixe le volume final de chaque note.',
  },
  lfo: {
    term: 'LFO',
    definition:
      'Oscillateur basse fréquence : une onde lente, en général inaudible, utilisée pour créer du mouvement.',
  },
  modulation: {
    term: 'Modulation',
    definition: 'Utiliser un signal pour faire varier un paramètre automatiquement.',
  },
  'modulation-depth': {
    term: 'Profondeur de modulation',
    definition: 'L’intensité avec laquelle une source de modulation agit sur sa destination.',
  },
  vibrato: {
    term: 'Vibrato',
    definition: 'Une légère variation périodique de la hauteur.',
  },
  'oscillator-sync': {
    term: 'Synchro d’oscillateurs',
    definition:
      'Forcer un oscillateur à recommencer son cycle chaque fois qu’un autre termine le sien.',
  },
  portamento: {
    term: 'Portamento',
    definition: 'Un glissement continu de hauteur d’une note à la suivante.',
  },
  legato: {
    term: 'Legato',
    definition: 'Jouer de façon que chaque note chevauche la suivante.',
  },
  arpeggiator: {
    term: 'Arpégiateur',
    definition: 'Joue les notes tenues l’une après l’autre selon un motif rythmique.',
  },
  sequencer: {
    term: 'Séquenceur pas à pas',
    definition: 'Enregistre et rejoue une suite de notes pas à pas.',
  },
  tempo: {
    term: 'Tempo',
    definition: 'La vitesse de la musique en battements par minute (BPM).',
  },
  velocity: {
    term: 'Vélocité',
    definition: 'La force (vitesse) avec laquelle une touche est frappée.',
  },
  aftertouch: {
    term: 'Aftertouch',
    definition: 'La pression exercée sur une touche après l’avoir enfoncée.',
  },
  'key-tracking': {
    term: 'Suivi de clavier',
    definition: 'Faire suivre à un paramètre la note jouée au clavier.',
  },
  paraphony: {
    term: 'Paraphonie',
    definition:
      'Plusieurs notes jouées par des oscillateurs séparés, partageant un seul filtre et un seul amplificateur.',
  },
  midi: {
    term: 'MIDI',
    definition:
      'Le protocole standard qu’utilisent les instruments pour échanger des notes et des données de contrôle.',
  },
  patch: {
    term: 'Patch',
    definition: 'Un ensemble mémorisé de tous les réglages qui composent un son.',
  },
};

export const FR_SECTIONS: Readonly<Record<string, TextPatch>> = {
  master: {
    name: 'Master',
    summary: 'Volume, sélection et enregistrement des patchs.',
  },
  oscillators: {
    name: 'Oscillateurs',
    summary: 'Deux oscillateurs qui génèrent les formes d’onde brutes.',
  },
  'sub-oscillator': {
    name: 'Sub-oscillateur',
    summary: 'Ajoute du poids une ou deux octaves sous Osc 1.',
  },
  mixer: {
    name: 'Mixer',
    summary: 'Mélange six sources avant le filtre.',
  },
  filter: {
    name: 'Filtre',
    summary: 'Retire des harmoniques pour sculpter le timbre.',
  },
  envelopes: {
    name: 'Enveloppes',
    summary: 'Façonnent le volume et la modulation pendant la durée d’une note.',
  },
  lfos: {
    name: 'LFO',
    summary: 'Deux oscillateurs lents qui créent un mouvement cyclique.',
  },
  effects: {
    name: 'Effets',
    summary: 'Distorsion après le filtre et modulation du filtre à fréquence audio.',
  },
  portamento: {
    name: 'Portamento',
    summary: 'Glissement de hauteur entre les notes.',
  },
  arpeggiator: {
    name: 'Arpégiateur',
    summary: 'Arpégiateur et séquenceur 32 pas.',
  },
  performance: {
    name: 'Jeu',
    summary: 'Molettes, aftertouch, sustain, octave et transposition.',
  },
  'modulation-matrix': {
    name: 'Molette de modulation et aftertouch',
    summary: 'Routages On-Key de la molette et de l’aftertouch.',
  },
  voice: {
    name: 'Voix',
    summary: 'Sync, paraphonie, vélocité, plage de pitch bend et autres réglages de voix.',
  },
  global: {
    name: 'Global',
    summary: 'Réglages de tout l’instrument : MIDI, accordage, gain d’entrée, mode AFX.',
  },
};
