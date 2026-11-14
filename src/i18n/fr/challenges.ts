import type { TextPatch } from '../overlay';

// French text for the content set(s) below, in the same shape as the English data.
// Generated from translation tables; tests check that it matches and is complete.

export const FR_CHALLENGES: Readonly<Record<string, TextPatch>> = {
  'find-cutoff': {
    title: 'Le potentiomètre de la brillance',
    brief:
      'Une commande du panneau est plus grande que toutes les autres, parce que c’est celle qu’on manipule le plus.',
    task: {
      prompt: 'Cliquez sur la commande qui règle la fréquence de coupure du filtre.',
      feedback: 'Le grand potentiomètre Frequency de la section Filter.',
    },
    takeaway:
      'La fréquence du filtre a droit au grand potentiomètre, car balayer la coupure est le geste le plus expressif d’un synthé soustractif.',
  },
  'find-release': {
    title: 'Laisser sonner',
    brief: 'Vous voulez que les notes continuent de sonner un moment après avoir lâché la touche.',
    task: {
      prompt:
        'Cliquez sur la commande qui règle le temps d’extinction de l’Amp Envelope après le relâchement de la touche.',
      feedback: 'Le fader Release (avec Env Select sur Amp Env ou Amp+Mod).',
    },
    takeaway:
      'Le release est une durée : le temps que met l’enveloppe à retomber à zéro après le relâchement de la touche.',
  },
  'find-vibrato': {
    title: 'Où est le vibrato ?',
    brief:
      'Le vibrato, c’est le LFO 1 appliqué à la hauteur de l’oscillateur. Quel potentiomètre règle sa profondeur pour l’oscillateur sélectionné ?',
    task: {
      prompt:
        'Cliquez sur le potentiomètre qui règle de combien le LFO 1 fait varier la hauteur d’Osc 1.',
      feedback: 'LFO 1 depth dans la section Oscillators (avec Osc Select sur 1).',
    },
    takeaway:
      'La profondeur de modulation se règle à la destination : la section des oscillateurs a sa propre commande LFO 1 depth.',
  },
  'octave-up-bass': {
    title: 'Épaissir la basse',
    brief:
      'Rendez la basse plus lourde : ajoutez le sub-oscillateur deux octaves plus bas en sinus, et gardez Osc 1 dans le mélange.',
    task: {
      prompt: 'Ajoutez un sub sinus profond sous Osc 1.',
      conditions: [
        {
          hint: 'Montez le niveau du Sub dans le Mixer.',
        },
        {
          hint: 'Switch Sub Octave sur -2.',
        },
        {
          hint: 'Forme du sub : sinus.',
        },
        {
          hint: 'Gardez Osc 1 audible.',
        },
      ],
    },
    takeaway: 'Un sub sinus ajoute du poids sans ajouter d’harmoniques qui encombrent le mix.',
  },
  'acid-squelch': {
    title: 'Squelch',
    brief:
      'Réglez le filtre classique de la basse acid : type Acid, coupure plutôt basse, résonance élevée et balayage d’enveloppe positif.',
    task: {
      prompt: 'Configurez un balayage de filtre acid.',
      conditions: [
        {
          hint: 'Type de filtre : Acid.',
        },
        {
          hint: 'Baissez la fréquence.',
        },
        {
          hint: 'Montez fortement la résonance.',
        },
        {
          hint: 'Profondeur de Mod Env positive sur le filtre.',
        },
        {
          hint: 'Baissez le sustain de la Mod Env pour que le balayage retombe.',
        },
      ],
    },
    takeaway:
      'La résonance associée à un balayage d’enveloppe dans un passe-bas à échelle de diodes donne le « squelch » vocal de la basse acid.',
  },
  'sync-scream': {
    title: 'Lead synchronisé',
    brief:
      'Créez le lead classique en hard sync : sync activée, seul Osc 2 audible, Osc 2 accordé bien au-dessus d’Osc 1.',
    task: {
      prompt: 'Mettez en place la synchro d’oscillateurs.',
      conditions: [
        {
          hint: 'Activez Osc 1-2 Sync (Function + D aigu).',
        },
        {
          hint: 'Baissez Osc 1 dans le mixer pour n’entendre que l’Osc 2 synchronisé.',
        },
        {
          hint: 'Montez Osc 2.',
        },
        {
          hint: 'Réglez Coarse d’Osc 2 au moins +5 demi-tons au-dessus d’Osc 1.',
        },
      ],
    },
    takeaway:
      'Avec la sync, la hauteur d’Osc 2 change son timbre, pas sa note. La note reste calée sur Osc 1.',
  },
  'why-saw': {
    title: 'Pourquoi partir d’une dent de scie ?',
    brief: 'La plupart des patchs soustractifs classiques partent d’une onde en dent de scie.',
    task: {
      prompt:
        'Pourquoi la dent de scie est-elle un si bon point de départ en synthèse soustractive ?',
      options: [
        {
          label:
            'Elle contient toutes les harmoniques, donc le filtre a le plus de matière à façonner',
          feedback: 'Exact : un filtre ne peut retirer que des harmoniques qui existent.',
        },
        {
          label: 'C’est la forme d’onde la plus forte',
          feedback: 'Le volume dépend du mixer et du VCA. Ici, c’est la richesse qui compte.',
        },
        {
          label: 'Elle n’a pas d’harmoniques, donc elle est facile à filtrer',
          feedback: 'Ça décrit un sinus. Filtrer un sinus ne change presque rien.',
        },
        {
          label: 'Seules les dents de scie peuvent être filtrées',
          feedback:
            'Toutes les sources peuvent être filtrées, mais celles riches en harmoniques changent le plus.',
        },
      ],
    },
    takeaway:
      'La synthèse soustractive part d’un son riche et en retire. La dent de scie est la matière brute la plus riche.',
  },
  'overdrive-vs-distortion': {
    title: 'Avant ou après ?',
    brief:
      'Le Bass Station II a deux types de saturation : Overdrive dans la section Filter et Distortion dans Effects.',
    task: {
      prompt: 'Quelle est la différence essentielle entre Overdrive et Distortion ?',
      options: [
        {
          label: 'L’Overdrive est avant le filtre, la Distortion après',
          feedback:
            'Exact : les harmoniques de l’overdrive sont ensuite façonnées par le filtre, alors que la distorsion agit sur le signal filtré (avant le VCA).',
        },
        {
          label: 'C’est le même circuit avec deux potentiomètres',
          feedback: 'Ils se trouvent à des endroits différents du chemin du signal (p. 42, 47).',
        },
        {
          label: 'La Distortion n’agit que sur le sub-oscillateur',
          feedback: 'La Distortion agit sur tout le signal filtré.',
        },
        {
          label: 'L’Overdrive est après le VCA',
          feedback: 'L’Overdrive s’applique à la sortie du mixer, avant le filtre.',
        },
      ],
    },
    takeaway: 'La place d’un effet dans le chemin du signal change son rendu.',
  },
  'env-vs-lfo': {
    title: 'Une fois ou en boucle ?',
    brief: 'Les enveloppes et les LFO sont tous deux des sources de modulation.',
    task: {
      prompt: 'Qu’est-ce qui distingue une enveloppe d’un LFO ?',
      options: [
        {
          label: 'Une enveloppe se déroule une fois par note, alors qu’un LFO se répète en continu',
          feedback: 'Exact (sauf si vous activez le retrigger d’enveloppe, qui la fait boucler).',
        },
        {
          label: 'Un LFO ne peut agir que sur le volume',
          feedback:
            'Sur le Bass Station II, les LFO agissent sur la hauteur, la largeur d’impulsion et le filtre. C’est l’Amp Env qui contrôle le volume.',
        },
        {
          label: 'Les enveloppes sont plus rapides',
          feedback: 'Les deux peuvent être rapides ou lents.',
        },
        {
          label: 'Il n’y a aucune différence',
          feedback: 'Leurs formes dans le temps sont fondamentalement différentes.',
        },
      ],
    },
    takeaway: 'Enveloppe : une forme unique liée à la touche. LFO : un cycle qui se répète.',
  },
  'match-pulse': {
    title: 'Reproduire la forme d’onde',
    brief:
      'Recréez la forme d’onde affichée à gauche. Les cibles restent cachées, mais vous recevez des indices après chaque vérification.',
    task: {
      prompt: 'Faites correspondre Osc 1 à l’image cible.',
      conditions: [
        {
          hint: 'L’onde saute entre deux niveaux. Quelle forme d’onde fait ça ?',
        },
        {
          hint: 'Elle n’est haute que pendant environ un quart de chaque cycle.',
        },
      ],
    },
    takeaway: 'Une impulsion à 25 % : haute pendant un quart de chaque cycle.',
  },
  'match-filter': {
    title: 'Reproduire la courbe de filtre',
    brief: 'Recréez la réponse de filtre affichée : forme, pente, coupure et résonance.',
    task: {
      prompt: 'Faites correspondre votre filtre à la courbe cible.',
      conditions: [
        {
          hint: 'La forme n’est pas un passe-bas, il faut donc le type Classic.',
        },
        {
          hint: 'Les basses fréquences sont retirées et les hautes passent.',
        },
        {
          hint: 'La pente est douce.',
        },
        {
          hint: 'La coupure est dans le bas-médium (environ 500 Hz–1 kHz).',
        },
        {
          hint: 'Il y a une crête nette à la coupure.',
        },
      ],
    },
    takeaway: 'Un passe-haut 12 dB résonant, utile pour des sons fins et tranchants.',
  },
  'match-envelope': {
    title: 'Reproduire l’enveloppe',
    brief: 'Recréez la forme d’Amp Envelope affichée.',
    task: {
      prompt: 'Façonnez votre Amp Envelope comme la cible.',
      conditions: [
        {
          hint: 'La montée est nettement progressive, mais pas extrêmement lente.',
        },
        {
          hint: 'Le niveau tenu est d’environ la moitié.',
        },
        {
          hint: 'La descente vers le niveau tenu prend un temps perceptible.',
        },
        {
          hint: 'La queue après le relâchement est longue.',
        },
      ],
    },
    takeaway: 'On peut lire les réglages ADSR directement sur une courbe d’enveloppe.',
  },
  'no-sound': {
    title: 'Silence',
    brief: 'Un élève dit que son patch ne produit aucun son. Chargez-le et trouvez pourquoi.',
    task: {
      prompt: 'Rendez le patch de nouveau audible.',
      conditions: [
        {
          hint: 'Regardez le Mixer : une source est-elle montée ?',
        },
      ],
    },
    takeaway: 'Quand il n’y a pas de son, suivez le signal : source → mixer → filtre → ampli.',
  },
  muffled: {
    title: 'Sous une couverture',
    brief: 'Ce patch sonne extrêmement terne et faible, comme entendu à travers un mur.',
    task: {
      prompt: 'Rendez-lui sa brillance.',
      conditions: [
        {
          hint: 'Quelque chose dans le filtre retire presque toutes les harmoniques.',
        },
      ],
    },
    takeaway: 'Un filtre passe-bas presque fermé retire presque toutes les harmoniques.',
  },
  seasick: {
    title: 'Lead qui a le mal de mer',
    brief:
      'La hauteur du lead oscille violemment, sur plusieurs octaves. On voulait un léger vibrato.',
    task: {
      prompt: 'Transformez cette oscillation en léger vibrato sur les deux oscillateurs.',
      conditions: [
        {
          hint: 'Quelque chose fait beaucoup trop varier la hauteur d’Osc 1. Vérifiez la section Oscillator avec Osc Select sur 1.',
        },
        {
          hint: 'Osc 2 a le même problème. Passez Osc Select sur 2.',
        },
      ],
    },
    takeaway:
      'Chaque oscillateur a son propre LFO 1 depth. 6 ≈ un demi-ton, donc un vibrato demande de petites valeurs.',
  },
  'read-wave': {
    title: 'Nommez cette onde',
    brief: 'Regardez la courbe et identifiez la forme d’onde de l’oscillateur.',
    task: {
      prompt: 'Quelle forme d’onde est affichée ?',
      options: [
        {
          label: 'Dent de scie',
          feedback:
            'Une dent de scie monte dans un sens puis saute. Cette onde monte et descend de façon symétrique.',
        },
        {
          label: 'Triangle',
          feedback: 'Exact : des montées et descentes droites et symétriques.',
        },
        {
          label: 'Carré',
          feedback: 'Un carré saute entre deux niveaux plats.',
        },
        {
          label: 'Sinus',
          feedback: 'Un sinus est arrondi. Celle-ci a des angles vifs.',
        },
      ],
    },
    takeaway: 'Triangle : rampes symétriques, peu d’harmoniques, son doux.',
  },
  'read-filter': {
    title: 'Quel filtre ?',
    brief: 'Identifiez la forme du filtre d’après sa courbe de réponse.',
    task: {
      prompt: 'Quelle forme de filtre produit cette réponse ?',
      options: [
        {
          label: 'Passe-bas',
          feedback: 'Un passe-bas laisserait passer tout ce qui est sous la coupure.',
        },
        {
          label: 'Passe-haut',
          feedback: 'Un passe-haut laisserait passer tout ce qui est au-dessus de la coupure.',
        },
        {
          label: 'Passe-bande',
          feedback:
            'Exact : seule une bande autour de la fréquence centrale passe, et les deux côtés chutent.',
        },
      ],
    },
    takeaway:
      'Le passe-bande garde une bande autour de la fréquence centrale, ce qui donne des sons fins, façon téléphone, ou vocaux.',
  },
  'read-envelope': {
    title: 'Quel profil d’instrument ?',
    brief: 'Observez cette Amp Envelope.',
    task: {
      prompt: 'Quel type de son a une enveloppe comme celle-ci ?',
      options: [
        {
          label: 'Une corde pincée',
          feedback:
            'Exact : attaque instantanée, puis le son s’éteint même si la touche reste enfoncée.',
        },
        {
          label: 'Un orgue',
          feedback:
            'Un orgue garde son niveau maximal tant que la touche est enfoncée (sustain élevé).',
        },
        {
          label: 'Une nappe de cordes jouée lentement à l’archet',
          feedback: 'Elle aurait une attaque lente.',
        },
      ],
    },
    takeaway: 'Attaque nulle, decay court, sustain nul : le profil d’un son pincé.',
  },
};

export const FR_CHALLENGE_TYPES: Readonly<Record<string, TextPatch>> = {
  identification: {
    name: 'Identifier un paramètre',
    description: 'Trouvez la bonne commande sur le panneau.',
  },
  manipulation: {
    name: 'Manipuler des paramètres',
    description: 'Obtenez le résultat décrit en tournant les bonnes commandes.',
  },
  comprehension: {
    name: 'Comprendre les notions',
    description: 'Vérifiez que vous comprenez pourquoi les choses fonctionnent.',
  },
  reconstruction: {
    name: 'Reconstruire un son',
    description: 'Recréez un réglage à partir de ses courbes.',
  },
  troubleshooting: {
    name: 'Dépannage',
    description: 'Un patch est cassé. Trouvez pourquoi et réparez-le.',
  },
  interpretation: {
    name: 'Lecture de courbes',
    description: 'Lisez une courbe de forme d’onde, de filtre ou d’enveloppe.',
  },
};
