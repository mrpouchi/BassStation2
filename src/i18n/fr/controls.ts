import type { TextPatch } from '../overlay';

// French text for the content set(s) below, in the same shape as the English data.
// Generated from translation tables; tests check that it matches and is complete.

export const FR_CONTROLS: Readonly<Record<string, TextPatch>> = {
  'master.display': {
    description:
      'Afficheur de trois caractères indiquant le numéro de patch, le décalage d’octave et les valeurs des paramètres.',
  },
  'master.orgValue': {
    description:
      'Des LED en flèche qui s’allument quand une commande ne correspond plus à la valeur mémorisée dans le patch. Elles indiquent dans quel sens tourner pour la retrouver.',
  },
  'master.patchDown': {
    description: 'Sélectionne le patch précédent, ou diminue la valeur d’une fonction On-Key.',
  },
  'master.patchUp': {
    description: 'Sélectionne le patch suivant, ou augmente la valeur d’une fonction On-Key.',
  },
  'master.save': {
    description:
      'Enregistre les réglages actuels dans une mémoire de patch. Appuyez deux fois pour confirmer.',
  },
  'master.volume': {
    description: 'Volume de la sortie et du casque.',
  },
  'osc.select': {
    description: 'Affecte les commandes d’oscillateur à Osc 1 ou Osc 2.',
  },
  'osc.range': {
    description: "Passe de 16' à 8', 4' et 2' pour l’oscillateur sélectionné.",
  },
  'osc.waveform': {
    description:
      'Passe par sinus, triangle, dent de scie et impulsion pour l’oscillateur sélectionné.',
  },
  'osc.coarse': {
    description: 'Accorde l’oscillateur sélectionné sur ±1 octave.',
    secondary: {
      description: 'Accord grossier étendu du sub-oscillateur.',
    },
  },
  'osc.fine': {
    description: 'Accorde finement l’oscillateur sélectionné sur ±100 cents.',
    secondary: {
      description: 'Accord fin étendu du sub-oscillateur.',
    },
  },
  'osc.modEnvDepth': {
    description:
      'Modulation de hauteur de l’oscillateur sélectionné par la Mod Envelope. Neutre au centre.',
  },
  'osc.lfo1Depth': {
    description: 'Modulation de hauteur de l’oscillateur sélectionné par le LFO 1.',
  },
  'osc.pwSource': {
    description:
      'Choisit si le potentiomètre Pulse Width règle la profondeur de la Mod Env, celle du LFO 2 ou la largeur manuelle.',
  },
  'osc.pulseWidth': {
    description:
      'Largeur manuelle ou profondeur de modulation, selon le switch de source PW. N’agit qu’avec la forme d’onde Pulse.',
  },
  'osc.syncLed': {
    description: 'S’allume quand Osc 1-2 Sync (une fonction On-Key) est activée.',
  },
  'sub.octave': {
    description: 'Sub-oscillateur une (-1) ou deux (-2) octaves sous Osc 1.',
  },
  'sub.wave': {
    description: 'Sinus, impulsion étroite ou carré pour le sub-oscillateur.',
  },
  'lfo.delaySpeed': {
    description: 'Choisit si les potentiomètres de LFO règlent la vitesse ou le délai.',
  },
  'lfo1.wave': {
    description:
      'Passe par triangle, dent de scie, carré et sample & hold pour le LFO 1. La LED montre la vitesse et la forme.',
  },
  'lfo2.wave': {
    description: 'Passe par triangle, dent de scie, carré et sample & hold pour le LFO 2.',
  },
  'lfo1.knob': {
    description: 'Vitesse (ou valeur de sync) ou délai du LFO 1, selon le switch Delay/Speed.',
  },
  'lfo2.knob': {
    description: 'Vitesse (ou valeur de sync) ou délai du LFO 2, selon le switch Delay/Speed.',
  },
  'mixer.osc1': {
    description: 'Niveau de l’oscillateur 1.',
  },
  'mixer.osc2': {
    description: 'Niveau de l’oscillateur 2.',
  },
  'mixer.sub': {
    description: 'Niveau du sub-oscillateur.',
  },
  'mixer.source': {
    description:
      'Affecte le potentiomètre de niveau partagé au bruit, au Ring Mod ou à l’entrée externe.',
  },
  'mixer.sourceLevel': {
    description: 'Niveau de la source choisie par le switch Noise/Ring/Ext.',
  },
  'filter.type': {
    description: 'Classic (variable) ou Acid (passe-bas à échelle de diodes).',
  },
  'filter.shape': {
    description: 'LP, BP ou HP. Type Classic uniquement.',
  },
  'filter.slope': {
    description: '12 dB ou 24 dB par octave. Type Classic uniquement.',
  },
  'filter.frequency': {
    description: 'Coupure du filtre (LP/HP) ou fréquence centrale (BP).',
  },
  'filter.resonance': {
    description: 'Accentuation à la fréquence du filtre.',
  },
  'filter.overdrive': {
    description: 'Distorsion avant le filtre.',
  },
  'filter.modEnvDepth': {
    description: 'Modulation de la fréquence du filtre par la Mod Envelope.',
  },
  'filter.lfo2Depth': {
    description: 'Modulation de la fréquence du filtre par le LFO 2.',
  },
  'env.select': {
    description: 'Affecte les faders à l’Amp Env, à la Mod Env ou aux deux.',
  },
  'env.attack': {
    description: 'Fader d’attaque de la ou des enveloppes choisies par Env Select.',
  },
  'env.decay': {
    description: 'Fader de decay de la ou des enveloppes choisies par Env Select.',
  },
  'env.sustain': {
    description: 'Fader de sustain de la ou des enveloppes choisies par Env Select.',
  },
  'env.release': {
    description: 'Fader de release de la ou des enveloppes choisies par Env Select.',
  },
  'env.triggering': {
    description: 'Déclenchement Single, Multi ou Autoglide de la ou des enveloppes sélectionnées.',
  },
  'arp.on': {
    description: 'Active et désactive l’arpégiateur.',
    secondary: {
      description:
        'Pendant l’enregistrement d’une séquence : lie le pas actuel au suivant (legato).',
    },
  },
  'arp.latch': {
    description:
      'Joue le motif actuel en continu. Arpégiateur éteint, sert de maintien des touches (Key Hold).',
    secondary: {
      description: 'Pendant l’enregistrement d’une séquence : insère un pas de silence.',
    },
  },
  'arp.tempo': {
    description: 'Tempo de l’arpégiateur et du séquenceur, 40–240 BPM.',
  },
  'arp.rhythm': {
    description: 'Choisit l’un des 32 motifs rythmiques.',
  },
  'arp.mode': {
    description: 'Sélecteur à 8 positions : Up, Down, UpDn, UpDn2, Played, Random, Record, Play.',
  },
  'arp.octaves': {
    description:
      'Sélecteur à 4 positions : étendue en octaves (1–4). Il choisit la séquence (1–4) quand Arp Mode est sur Record ou Play.',
    secondary: {
      description: 'Choisit l’une des quatre séquences mémorisées en mode Record/Play.',
    },
  },
  'portamento.glideTime': {
    description: 'Temps de portamento. Tourné à fond à gauche, il est désactivé.',
  },
  'effects.distortion': {
    description: 'Quantité de distorsion après le filtre.',
  },
  'effects.oscFilterMod': {
    description: 'Modulation de la fréquence du filtre directement par Osc 2.',
  },
  keyboard: {
    description:
      'Clavier de 25 notes sensible à la vélocité, avec aftertouch. Chaque touche porte aussi une fonction On-Key.',
  },
  'performance.pitchWheel': {
    description: 'Molette de pitch bend à rappel.',
  },
  'performance.modWheel': {
    description: 'Molette de modulation.',
  },
  'performance.octaveDown': {
    description:
      'Décale le clavier d’une octave vers le bas. Appuyez sur les deux boutons d’octave pour réinitialiser.',
  },
  'performance.octaveUp': {
    description:
      'Décale le clavier d’une octave vers le haut. Appuyez sur les deux boutons d’octave pour réinitialiser.',
  },
  'performance.transpose': {
    description: 'Maintenez et appuyez sur une touche pour transposer jusqu’à ±12 demi-tons.',
  },
  'performance.function': {
    description: 'Maintenez pour accéder aux fonctions On-Key. Annule aussi Save.',
  },
};
