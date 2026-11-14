import type { TextPatch } from '../overlay';

// French text for the content set(s) below, in the same shape as the English data.
// Generated from translation tables; tests check that it matches and is complete.

export const FR_PARAMETERS: Readonly<Record<string, TextPatch>> = {
  'master.volume': {
    name: 'Volume',
    description: 'Volume du patch. Il règle aussi le niveau du casque.',
    education: {
      explanation: 'Règle le niveau de sortie général du synthé et du casque.',
      increase: 'Plus fort.',
      decrease: 'Moins fort.',
    },
  },
  'master.patch': {
    name: 'Patch',
    description: 'Mémoire de patch actuelle : 0–63 usine, 64–127 utilisateur (Init Patch).',
    education: {
      explanation:
        'Un patch est une photo mémorisée de tous les réglages du son. Choisir un autre patch efface les modifications non enregistrées : enregistrez d’abord.',
      increase: 'Patch suivant.',
      decrease: 'Patch précédent.',
    },
  },
  'panel.oscSelect': {
    name: 'Osc Select',
    options: [
      {
        label: 'Osc 1',
      },
      {
        label: 'Osc 2',
      },
    ],
    description:
      'Affecte les commandes partagées de la section Oscillator à l’oscillateur 1 ou à l’oscillateur 2.',
    education: {
      explanation:
        'Le Bass Station II a deux oscillateurs identiques mais un seul jeu de commandes. Ce switch choisit l’oscillateur modifié par les commandes. L’autre garde ses réglages.',
      increase: 'Sélectionne l’oscillateur 2.',
      decrease: 'Sélectionne l’oscillateur 1.',
    },
  },
  'panel.pwSource': {
    name: 'Source de modulation de largeur d’impulsion',
    options: [
      {
        label: 'Mod Env',
      },
      {
        label: 'LFO 2',
      },
      {
        label: 'Manual',
      },
    ],
    description:
      'Choisit quelle valeur de largeur d’impulsion le potentiomètre Pulse Width règle : la profondeur de la Mod Env, celle du LFO 2, ou la largeur manuelle.',
    education: {
      explanation:
        'Les trois sources de largeur d’impulsion peuvent agir en même temps. Ce switch décide seulement laquelle le potentiomètre Pulse Width modifie.',
      increase: 'Passe par Mod Env → LFO 2 → Manual.',
      decrease: 'Revient en arrière.',
    },
  },
  'osc1.waveform': {
    name: 'Forme d’onde Osc 1',
    options: [
      {
        label: 'Sinus',
        description: 'Son pur : une fondamentale sans harmoniques.',
      },
      {
        label: 'Triangle',
        description: 'Son doux : des harmoniques impaires qui s’atténuent vite.',
      },
      {
        label: 'Dent de scie',
        description: 'Son brillant et bourdonnant qui contient toutes les harmoniques.',
      },
      {
        label: 'Impulsion',
        description: 'Son creux dont la couleur dépend de la largeur d’impulsion.',
      },
    ],
    description: 'Choisit la forme d’onde de base de l’oscillateur 1.',
    education: {
      explanation:
        'La forme d’onde est la matière brute de tout son soustractif. Chaque forme contient une recette d’harmoniques différente, et le filtre ne peut retirer que les harmoniques déjà présentes.',
      increase:
        'Aller du sinus vers la dent de scie ajoute des harmoniques : le son devient plus brillant et plus riche.',
      decrease:
        'Revenir vers le sinus retire des harmoniques : le son devient plus pur et plus sombre.',
      experiment:
        'Tenez une note et passez par les quatre formes d’onde. Remarquez comme le sinus sonne « vide » et la dent de scie « pleine ».',
    },
  },
  'osc1.range': {
    name: 'Range Osc 1',
    options: [
      {
        label: "16'",
        description: 'Une octave sous le diapason.',
      },
      {
        label: "8'",
        description: 'Diapason (A3 = 440 Hz).',
      },
      {
        label: "4'",
        description: 'Une octave au-dessus du diapason.',
      },
      {
        label: "2'",
        description: 'Deux octaves au-dessus du diapason.',
      },
    ],
    description: 'Règle l’octave de base de l’oscillateur 1 en pieds, comme les jeux d’orgue.',
    education: {
      explanation:
        'Range utilise les « pieds » traditionnels de l’orgue. Diviser le nombre de pieds par deux double la fréquence, ce qui monte la hauteur d’exactement une octave.',
      increase: "Aller vers 2' monte la hauteur par octaves entières.",
      decrease: "Aller vers 16' baisse la hauteur par octaves entières.",
      experiment:
        "Mettez Osc 1 et Osc 2 sur la même forme d’onde, puis l’un en 8' et l’autre en 16'. Vous entendrez un intervalle d’octave qui se fond en un son plus épais.",
    },
  },
  'osc1.coarse': {
    name: 'Coarse Osc 1',
    description: 'Accorde l’oscillateur 1 sur ±1 octave, affiché en demi-tons.',
    education: {
      explanation:
        'L’accord grossier décale la hauteur par demi-tons. Accorder les deux oscillateurs sur un intervalle musical, comme +7 demi-tons (une quinte), transforme un appui sur une touche en accord de deux notes.',
      increase: 'Monte la hauteur, jusqu’à 12 demi-tons (une octave).',
      decrease: 'Baisse la hauteur, jusqu’à 12 demi-tons (une octave).',
      experiment:
        'Réglez Coarse d’Osc 2 sur +7 avec les deux oscillateurs dans le mixer. Jouez une seule note et écoutez la quinte façon « power chord ».',
    },
  },
  'osc1.fine': {
    name: 'Fine Osc 1',
    description: 'Accorde finement l’oscillateur 1 sur ±100 cents (±1 demi-ton).',
    education: {
      explanation:
        'Un cent est un centième de demi-ton. Désaccorder légèrement un oscillateur par rapport à l’autre fait entrer et sortir les deux ondes de phase. On l’entend comme un lent « battement » qui épaissit le son.',
      increase:
        'Monte légèrement la hauteur. De petites valeurs face à l’autre oscillateur créent un battement façon chorus.',
      decrease:
        'Baisse légèrement la hauteur. Un désaccord plus grand rend le battement plus rapide et plus faux.',
      experiment:
        'Mélangez les deux oscillateurs en dent de scie et réglez Fine d’Osc 2 vers +8 cents. Écoutez le mouvement, puis essayez +30.',
    },
  },
  'osc1.modEnvDepth': {
    name: 'Profondeur Mod Env sur la hauteur d’Osc 1',
    description:
      'Quantité dont la Mod Envelope fait varier la hauteur de l’oscillateur 1. Neutre au centre.',
    education: {
      explanation:
        'La Mod Envelope peut faire varier la hauteur pendant la durée d’une note. Avec le Sustain au maximum, une valeur de 8 déplace la hauteur d’une octave, et la valeur maximale couvre huit octaves.',
      increase:
        'Les valeurs positives font monter la hauteur avec l’enveloppe, utile pour les « zaps » et les sons de laser.',
      decrease:
        'Les valeurs négatives font descendre la hauteur pendant l’attaque, ce qui donne des sons de percussion classiques et des « piou ».',
      experiment:
        'Réglez Mod Env sur Attack 0, Decay court, Sustain 0, puis cette profondeur sur +30. Chaque note démarre alors avec une variation rapide de hauteur… puis essayez une valeur négative.',
    },
  },
  'osc1.lfo1Depth': {
    name: 'Profondeur LFO 1 sur la hauteur d’Osc 1',
    description: 'Quantité dont le LFO 1 module la hauteur de l’oscillateur 1.',
    education: {
      explanation:
        'Le LFO 1 monte et baisse la hauteur en boucle. De petites quantités avec un LFO triangle produisent un vibrato. La commande est plus fine en dessous de ±12. Le manuel indique 6 pour un demi-ton, 12 pour un ton, 32 pour une octave.',
      increase: 'Variation de hauteur plus large : du vibrato subtil aux balayages de sirène.',
      decrease:
        'Les valeurs négatives inversent la forme du LFO avant qu’elle n’atteigne la hauteur.',
      experiment:
        'Choisissez un LFO 1 triangle à vitesse modérée et réglez cette profondeur vers 4. Passez ensuite le LFO en carré pour entendre un trille.',
    },
  },
  'osc1.pwManual': {
    name: 'Largeur d’impulsion Osc 1 (manuelle)',
    description:
      'Largeur d’impulsion fixe (rapport cyclique) de l’oscillateur 1. N’agit qu’avec la forme d’onde Pulse.',
    education: {
      explanation:
        'Une onde d’impulsion passe une partie de chaque cycle en « haut » et le reste en « bas ». À 50 %, c’est une onde carrée, qui n’a que des harmoniques impaires et un son creux. Les impulsions plus étroites gagnent des harmoniques et sonnent plus fines et nasillardes.',
      increase: 'Va vers une impulsion positive étroite (95 %) : son plus fin et nasal.',
      decrease:
        'Va vers une impulsion négative étroite (5 %) : tout aussi fin. 5 % et 95 % contiennent les mêmes harmoniques.',
      experiment:
        'Choisissez la forme Pulse, mettez le switch de source PW sur Manual et balayez de 50 à 90. Regardez l’onde se resserrer pendant que le son s’amincit.',
    },
  },
  'osc1.pwModEnv': {
    name: 'Quantité Mod Env sur la largeur d’impulsion d’Osc 1',
    description:
      'De combien la Mod Envelope fait varier la largeur d’impulsion de l’oscillateur 1.',
    education: {
      explanation:
        'Au lieu d’une largeur fixe, la Mod Envelope peut faire varier la largeur au cours de chaque note. Le contenu harmonique évolue alors pendant que la note joue.',
      increase: 'L’impulsion se resserre à mesure que l’enveloppe monte.',
      decrease: 'Les valeurs négatives font varier la largeur dans l’autre sens.',
    },
  },
  'osc1.pwLfo2': {
    name: 'Quantité LFO 2 sur la largeur d’impulsion d’Osc 1',
    description:
      'De combien le LFO 2 balaie la largeur d’impulsion de l’oscillateur 1 (modulation de largeur d’impulsion, PWM).',
    education: {
      explanation:
        'La modulation de largeur d’impulsion (PWM) permet au LFO 2 de faire aller et venir la largeur. On obtient un mouvement ample, façon chorus, qu’un seul oscillateur ne peut pas produire autrement.',
      increase: 'Balayages plus profonds et plus larges de la largeur d’impulsion.',
      decrease:
        'Les valeurs négatives inversent le LFO avant qu’il n’atteigne la largeur d’impulsion.',
      experiment:
        'Forme Pulse, source PW sur LFO 2, LFO 2 triangle lent : montez cette quantité jusqu’à ce que le son se mette à « respirer ».',
    },
  },
  'osc2.waveform': {
    name: 'Forme d’onde Osc 2',
    options: [
      {
        label: 'Sinus',
        description: 'Son pur : une fondamentale sans harmoniques.',
      },
      {
        label: 'Triangle',
        description: 'Son doux : des harmoniques impaires qui s’atténuent vite.',
      },
      {
        label: 'Dent de scie',
        description: 'Son brillant et bourdonnant qui contient toutes les harmoniques.',
      },
      {
        label: 'Impulsion',
        description: 'Son creux dont la couleur dépend de la largeur d’impulsion.',
      },
    ],
    description: 'Choisit la forme d’onde de base de l’oscillateur 2.',
    education: {
      explanation:
        'La forme d’onde est la matière brute de tout son soustractif. Chaque forme contient une recette d’harmoniques différente, et le filtre ne peut retirer que les harmoniques déjà présentes.',
      increase:
        'Aller du sinus vers la dent de scie ajoute des harmoniques : le son devient plus brillant et plus riche.',
      decrease:
        'Revenir vers le sinus retire des harmoniques : le son devient plus pur et plus sombre.',
      experiment:
        'Tenez une note et passez par les quatre formes d’onde. Remarquez comme le sinus sonne « vide » et la dent de scie « pleine ».',
    },
  },
  'osc2.range': {
    name: 'Range Osc 2',
    options: [
      {
        label: "16'",
        description: 'Une octave sous le diapason.',
      },
      {
        label: "8'",
        description: 'Diapason (A3 = 440 Hz).',
      },
      {
        label: "4'",
        description: 'Une octave au-dessus du diapason.',
      },
      {
        label: "2'",
        description: 'Deux octaves au-dessus du diapason.',
      },
    ],
    description: 'Règle l’octave de base de l’oscillateur 2 en pieds, comme les jeux d’orgue.',
    education: {
      explanation:
        'Range utilise les « pieds » traditionnels de l’orgue. Diviser le nombre de pieds par deux double la fréquence, ce qui monte la hauteur d’exactement une octave.',
      increase: "Aller vers 2' monte la hauteur par octaves entières.",
      decrease: "Aller vers 16' baisse la hauteur par octaves entières.",
      experiment:
        "Mettez Osc 1 et Osc 2 sur la même forme d’onde, puis l’un en 8' et l’autre en 16'. Vous entendrez un intervalle d’octave qui se fond en un son plus épais.",
    },
  },
  'osc2.coarse': {
    name: 'Coarse Osc 2',
    description: 'Accorde l’oscillateur 2 sur ±1 octave, affiché en demi-tons.',
    education: {
      explanation:
        'L’accord grossier décale la hauteur par demi-tons. Accorder les deux oscillateurs sur un intervalle musical, comme +7 demi-tons (une quinte), transforme un appui sur une touche en accord de deux notes.',
      increase: 'Monte la hauteur, jusqu’à 12 demi-tons (une octave).',
      decrease: 'Baisse la hauteur, jusqu’à 12 demi-tons (une octave).',
      experiment:
        'Réglez Coarse d’Osc 2 sur +7 avec les deux oscillateurs dans le mixer. Jouez une seule note et écoutez la quinte façon « power chord ».',
    },
  },
  'osc2.fine': {
    name: 'Fine Osc 2',
    description: 'Accorde finement l’oscillateur 2 sur ±100 cents (±1 demi-ton).',
    education: {
      explanation:
        'Un cent est un centième de demi-ton. Désaccorder légèrement un oscillateur par rapport à l’autre fait entrer et sortir les deux ondes de phase. On l’entend comme un lent « battement » qui épaissit le son.',
      increase:
        'Monte légèrement la hauteur. De petites valeurs face à l’autre oscillateur créent un battement façon chorus.',
      decrease:
        'Baisse légèrement la hauteur. Un désaccord plus grand rend le battement plus rapide et plus faux.',
      experiment:
        'Mélangez les deux oscillateurs en dent de scie et réglez Fine d’Osc 2 vers +8 cents. Écoutez le mouvement, puis essayez +30.',
    },
  },
  'osc2.modEnvDepth': {
    name: 'Profondeur Mod Env sur la hauteur d’Osc 2',
    description:
      'Quantité dont la Mod Envelope fait varier la hauteur de l’oscillateur 2. Neutre au centre.',
    education: {
      explanation:
        'La Mod Envelope peut faire varier la hauteur pendant la durée d’une note. Avec le Sustain au maximum, une valeur de 8 déplace la hauteur d’une octave, et la valeur maximale couvre huit octaves.',
      increase:
        'Les valeurs positives font monter la hauteur avec l’enveloppe, utile pour les « zaps » et les sons de laser.',
      decrease:
        'Les valeurs négatives font descendre la hauteur pendant l’attaque, ce qui donne des sons de percussion classiques et des « piou ».',
      experiment:
        'Réglez Mod Env sur Attack 0, Decay court, Sustain 0, puis cette profondeur sur +30. Chaque note démarre alors avec une variation rapide de hauteur… puis essayez une valeur négative.',
    },
  },
  'osc2.lfo1Depth': {
    name: 'Profondeur LFO 1 sur la hauteur d’Osc 2',
    description: 'Quantité dont le LFO 1 module la hauteur de l’oscillateur 2.',
    education: {
      explanation:
        'Le LFO 1 monte et baisse la hauteur en boucle. De petites quantités avec un LFO triangle produisent un vibrato. La commande est plus fine en dessous de ±12. Le manuel indique 6 pour un demi-ton, 12 pour un ton, 32 pour une octave.',
      increase: 'Variation de hauteur plus large : du vibrato subtil aux balayages de sirène.',
      decrease:
        'Les valeurs négatives inversent la forme du LFO avant qu’elle n’atteigne la hauteur.',
      experiment:
        'Choisissez un LFO 1 triangle à vitesse modérée et réglez cette profondeur vers 4. Passez ensuite le LFO en carré pour entendre un trille.',
    },
  },
  'osc2.pwManual': {
    name: 'Largeur d’impulsion Osc 2 (manuelle)',
    description:
      'Largeur d’impulsion fixe (rapport cyclique) de l’oscillateur 2. N’agit qu’avec la forme d’onde Pulse.',
    education: {
      explanation:
        'Une onde d’impulsion passe une partie de chaque cycle en « haut » et le reste en « bas ». À 50 %, c’est une onde carrée, qui n’a que des harmoniques impaires et un son creux. Les impulsions plus étroites gagnent des harmoniques et sonnent plus fines et nasillardes.',
      increase: 'Va vers une impulsion positive étroite (95 %) : son plus fin et nasal.',
      decrease:
        'Va vers une impulsion négative étroite (5 %) : tout aussi fin. 5 % et 95 % contiennent les mêmes harmoniques.',
      experiment:
        'Choisissez la forme Pulse, mettez le switch de source PW sur Manual et balayez de 50 à 90. Regardez l’onde se resserrer pendant que le son s’amincit.',
    },
  },
  'osc2.pwModEnv': {
    name: 'Quantité Mod Env sur la largeur d’impulsion d’Osc 2',
    description:
      'De combien la Mod Envelope fait varier la largeur d’impulsion de l’oscillateur 2.',
    education: {
      explanation:
        'Au lieu d’une largeur fixe, la Mod Envelope peut faire varier la largeur au cours de chaque note. Le contenu harmonique évolue alors pendant que la note joue.',
      increase: 'L’impulsion se resserre à mesure que l’enveloppe monte.',
      decrease: 'Les valeurs négatives font varier la largeur dans l’autre sens.',
    },
  },
  'osc2.pwLfo2': {
    name: 'Quantité LFO 2 sur la largeur d’impulsion d’Osc 2',
    description:
      'De combien le LFO 2 balaie la largeur d’impulsion de l’oscillateur 2 (modulation de largeur d’impulsion, PWM).',
    education: {
      explanation:
        'La modulation de largeur d’impulsion (PWM) permet au LFO 2 de faire aller et venir la largeur. On obtient un mouvement ample, façon chorus, qu’un seul oscillateur ne peut pas produire autrement.',
      increase: 'Balayages plus profonds et plus larges de la largeur d’impulsion.',
      decrease:
        'Les valeurs négatives inversent le LFO avant qu’il n’atteigne la largeur d’impulsion.',
      experiment:
        'Forme Pulse, source PW sur LFO 2, LFO 2 triangle lent : montez cette quantité jusqu’à ce que le son se mette à « respirer ».',
    },
  },
  'sub.octave': {
    name: 'Octave du sub-oscillateur',
    options: [
      {
        label: '-1',
        description: 'Une octave sous Osc 1.',
      },
      {
        label: '-2',
        description: 'Deux octaves sous Osc 1.',
      },
    ],
    description: 'Place le sub-oscillateur une ou deux octaves sous l’oscillateur 1.',
    education: {
      explanation:
        'Le sub-oscillateur suit toujours l’oscillateur 1, une ou deux octaves plus bas. Il ajoute du poids sous le son sans changer la note entendue.',
      increase: '-1 : grave plus serré et plus percutant.',
      decrease: '-2 : sub-basse très profonde, qu’on ressent autant qu’on l’entend.',
    },
  },
  'sub.wave': {
    name: 'Forme du sub-oscillateur',
    options: [
      {
        label: 'Sinus',
        description: 'Sub-basse propre et ronde.',
      },
      {
        label: 'Impulsion étroite',
        description: 'Grave bourdonnant et tranchant.',
      },
      {
        label: 'Carré',
        description: 'Grave creux et solide.',
      },
    ],
    description: 'Forme d’onde du sub-oscillateur : sinus, impulsion étroite ou carré.',
    education: {
      explanation:
        'Un sub sinus n’ajoute qu’une fondamentale grave pure. Le carré et l’impulsion étroite ajoutent des harmoniques, ce qui garde le sub audible sur de petites enceintes.',
      increase: 'Vers le carré : plus d’harmoniques, plus de présence.',
      decrease: 'Vers le sinus : plus pur et plus profond.',
    },
  },
  'sub.coarse': {
    name: 'Coarse du sub-oscillateur',
    description:
      'Accord étendu du sub-oscillateur : le désaccorde par rapport à Osc 1. Maintenez Function et tournez Coarse.',
    education: {
      explanation:
        'Avec l’accord étendu, les trois oscillateurs peuvent être à des hauteurs différentes. Une seule touche joue alors un intervalle, voire un accord de trois notes. À 0, le sub suit exactement Osc 1.',
      increase: 'Monte le sub-oscillateur par rapport à Osc 1.',
      decrease: 'Baisse le sub-oscillateur par rapport à Osc 1.',
    },
  },
  'sub.fine': {
    name: 'Fine du sub-oscillateur',
    description: 'Accord fin étendu du sub-oscillateur. Maintenez Function et tournez Fine.',
    education: {
      explanation: 'Accorde finement le sub-oscillateur par rapport à Osc 1, en cents.',
      increase: 'Sub légèrement plus haut.',
      decrease: 'Sub légèrement plus bas.',
    },
  },
  'mixer.osc1': {
    name: 'Osc 1',
    description: 'Niveau de l’oscillateur 1 dans le mélange.',
    education: {
      explanation:
        'Le mixer mélange jusqu’à six sources avant le filtre. Osc 1 est au maximum dans l’Init Patch.',
      increase: 'Plus de cette source dans le signal envoyé au filtre.',
      decrease: 'Moins de cette source. Tourné à fond à gauche, elle disparaît.',
    },
  },
  'mixer.osc2': {
    name: 'Osc 2',
    description: 'Niveau de l’oscillateur 2 dans le mélange.',
    education: {
      explanation:
        'Ajouter Osc 2 à Osc 1, surtout légèrement désaccordé ou à un intervalle, est la base de la plupart des sons de synthé épais.',
      increase: 'Plus de cette source dans le signal envoyé au filtre.',
      decrease: 'Moins de cette source. Tourné à fond à gauche, elle disparaît.',
    },
  },
  'mixer.sub': {
    name: 'Sub',
    description: 'Niveau du sub-oscillateur dans le mélange.',
    education: {
      explanation:
        'Le sub-oscillateur ajoute du poids dans les graves, une ou deux octaves sous Osc 1.',
      increase: 'Plus de cette source dans le signal envoyé au filtre.',
      decrease: 'Moins de cette source. Tourné à fond à gauche, elle disparaît.',
    },
  },
  'mixer.noise': {
    name: 'Bruit',
    description: 'Niveau du bruit blanc dans le mélange.',
    education: {
      explanation:
        'Le bruit blanc contient toutes les fréquences à la fois. Il n’a pas de hauteur et sert pour le souffle, les percussions, le vent et le claquement au début d’une note.',
      increase: 'Plus de cette source dans le signal envoyé au filtre.',
      decrease: 'Moins de cette source. Tourné à fond à gauche, elle disparaît.',
    },
  },
  'mixer.ringMod': {
    name: 'Ring Mod',
    description: 'Niveau de la sortie du modulateur en anneau (Osc 1 × Osc 2) dans le mélange.',
    education: {
      explanation:
        'Le modulateur en anneau multiplie Osc 1 par Osc 2. La sortie contient la somme et la différence de leurs fréquences. Elles sont souvent sans rapport harmonique, ce qui donne des sons métalliques, proches de la cloche.',
      increase: 'Plus de cette source dans le signal envoyé au filtre.',
      decrease: 'Moins de cette source. Tourné à fond à gauche, elle disparaît.',
    },
  },
  'mixer.external': {
    name: 'Externe',
    description: 'Niveau du signal audio de l’entrée EXT IN (face arrière) dans le mélange.',
    education: {
      explanation:
        'N’importe quel signal audio externe, comme une boîte à rythmes ou une voix, peut passer par le filtre et les enveloppes du Bass Station II.',
      increase: 'Plus de cette source dans le signal envoyé au filtre.',
      decrease: 'Moins de cette source. Tourné à fond à gauche, elle disparaît.',
    },
  },
  'panel.mixerSource': {
    name: 'Noise / Ring / Ext',
    options: [
      {
        label: 'Bruit',
      },
      {
        label: 'Ring',
      },
      {
        label: 'Ext',
      },
    ],
    description:
      'Affecte le quatrième potentiomètre de niveau du mixer au bruit, au Ring Mod ou à l’entrée externe.',
    education: {
      explanation:
        'Trois sources partagent un même potentiomètre de niveau. Réglez le niveau d’une source, puis passez à une autre : le premier niveau reste tel quel.',
      increase: 'Passe par Noise → Ring → Ext.',
      decrease: 'Revient en arrière.',
    },
  },
  'filter.type': {
    name: 'Type de filtre',
    options: [
      {
        label: 'Classic',
        description: 'Filtre variable : les switches Shape et Slope sont actifs.',
      },
      {
        label: 'Acid',
        description:
          'Passe-bas 4 pôles (24 dB/oct) à échelle de diodes. Shape et Slope sont inactifs.',
      },
    ],
    description:
      'Choisit le filtre multimode Classic ou le filtre passe-bas Acid à échelle de diodes.',
    education: {
      explanation:
        'Classic est un filtre souple dont vous choisissez la forme et la pente. Acid est un passe-bas fixe à 24 dB/oct inspiré des filtres à échelle de diodes des synthés basse du début des années 80, avec son propre caractère « squelchy ».',
      increase: 'Acid : passe-bas fixe avec un mordant résonant caractéristique.',
      decrease: 'Classic : choisissez LP/BP/HP et une pente de 12 ou 24 dB.',
    },
  },
  'filter.shape': {
    name: 'Forme du filtre',
    options: [
      {
        label: 'LP',
        description: 'Passe-bas : retire les fréquences au-dessus de la coupure.',
      },
      {
        label: 'BP',
        description: 'Passe-bande : garde une bande autour de la fréquence centrale.',
      },
      {
        label: 'HP',
        description: 'Passe-haut : retire les fréquences sous la coupure.',
      },
    ],
    description: 'Réponse passe-bas, passe-bande ou passe-haut. N’agit qu’avec le type Classic.',
    education: {
      explanation:
        'La forme du filtre décide quelle partie du spectre reste. Le passe-bas est le choix soustractif classique : il assombrit un son en retirant ses harmoniques aiguës.',
      increase: 'Vers HP : sons plus fins, sans les graves.',
      decrease: 'Vers LP : sons plus sombres et plus chauds, sans les aigus.',
    },
  },
  'filter.slope': {
    name: 'Pente du filtre',
    options: [
      {
        label: '12 dB',
        description: 'Pente douce : 12 dB par octave.',
      },
      {
        label: '24 dB',
        description: 'Pente raide : 24 dB par octave.',
      },
    ],
    description:
      'Raideur de l’atténuation du filtre au-delà de la coupure. N’agit qu’avec le type Classic.',
    education: {
      explanation:
        'La pente fixe à quel point les fréquences au-delà de la coupure sont rejetées. À 24 dB/oct, une fréquence située une octave après la coupure a une amplitude environ 16 fois plus faible. À 12 dB/oct, environ 4 fois plus faible.',
      increase: '24 dB : filtrage plus ferme et plus net.',
      decrease: '12 dB : filtrage plus doux et plus ouvert. Davantage d’harmoniques passent.',
    },
  },
  'filter.frequency': {
    name: 'Fréquence',
    description: 'Fréquence de coupure (LP/HP) ou fréquence centrale (BP) du filtre.',
    education: {
      explanation:
        'La coupure est la commande la plus expressive d’un synthé soustractif. Elle décide où le filtre commence à retirer des harmoniques. C’est le grand potentiomètre parce que c’est celui que vous manipulerez le plus.',
      increase: 'Ouvre le filtre : plus brillant, davantage d’harmoniques passent.',
      decrease: 'Ferme le filtre : plus sombre et plus étouffé, jusqu’à ce que le son disparaisse.',
      experiment:
        'Avec une dent de scie, tenez une note et balayez lentement Frequency de complètement ouvert à complètement fermé. Ce « wow », c’est la synthèse soustractive.',
    },
  },
  'filter.resonance': {
    name: 'Résonance',
    description: 'Accentue une bande étroite de fréquences autour de la coupure.',
    education: {
      explanation:
        'La résonance renvoie une partie de la sortie du filtre vers son entrée. Cela crée une crête à la fréquence de coupure : les balayages de filtre deviennent vocaux et prononcés. Des réglages très élevés peuvent approcher l’auto-oscillation.',
      increase: 'Une crête plus marquée : caractère « squelchy », sifflant, vocal.',
      decrease: 'Une réponse de filtre plus plate et plus douce.',
      experiment:
        'Réglez la résonance vers 90 et balayez le potentiomètre Frequency. La crête « chante » en traversant les harmoniques.',
    },
  },
  'filter.overdrive': {
    name: 'Overdrive',
    description: 'Distorsion avant le filtre, appliquée à la sortie du mixer.',
    education: {
      explanation:
        'L’overdrive sature le signal avant qu’il n’atteigne le filtre. Les harmoniques ajoutées sont ensuite façonnées par le filtre, ce qui sonne différemment d’une distorsion ajoutée après.',
      increase: 'Plus de saturation et de grain à l’entrée du filtre.',
      decrease: 'Un signal plus propre à l’entrée du filtre.',
    },
  },
  'filter.modEnvDepth': {
    name: 'Profondeur Mod Env sur le filtre',
    description: 'Quantité dont la Mod Envelope balaie la fréquence du filtre.',
    education: {
      explanation:
        'La Mod Envelope peut ouvrir et fermer le filtre au cours de chaque note. À profondeur maximale, avec le Sustain au maximum, le balayage couvre huit octaves.',
      increase:
        'Positive : le filtre s’ouvre quand l’enveloppe monte. C’est la basse « pincée » classique.',
      decrease:
        'Négative : le filtre se ferme quand l’enveloppe monte, ce qui donne des gonflements inversés.',
      experiment:
        'Réglez Frequency bas, Decay de la Mod Env court, Sustain à 0, puis montez cette profondeur. Chaque note démarre brillante et se referme vite.',
    },
  },
  'filter.lfo2Depth': {
    name: 'Profondeur LFO 2 sur le filtre',
    description: 'Quantité dont le LFO 2 module la fréquence du filtre.',
    education: {
      explanation:
        'Le LFO 2 fait monter et descendre la coupure en boucle, ce qui donne des effets wah-wah et wobble. Le manuel donne l’échelle : 1 = 76 cents, 16 = une octave, 32 = deux octaves.',
      increase: 'Balayages de filtre plus larges.',
      decrease: 'Les valeurs négatives inversent la forme du LFO.',
      experiment:
        'Choisissez un LFO 2 triangle lent et réglez cette profondeur sur 24. Le son s’éclaircit et s’assombrit lentement.',
    },
  },
  'filter.tracking': {
    name: 'Suivi de clavier du filtre',
    valueLabels: {
      '0': 'Total',
      '7': 'Aucun',
    },
    description:
      'À quel point la coupure suit le clavier. 0 = suivi total, 7 = aucun suivi. Maintenez Function et appuyez deux fois sur la touche Filter Freq.',
    education: {
      explanation:
        'Avec le suivi de clavier, les notes aiguës ouvrent davantage le filtre. La brillance reste ainsi homogène sur tout le clavier, comme les instruments acoustiques qui deviennent plus brillants dans l’aigu.',
      increase: 'Moins de suivi : les notes aiguës sonnent plus sombres que les graves.',
      decrease: 'Plus de suivi : le filtre suit la note jouée.',
    },
  },
  'panel.envSelect': {
    name: 'Env Select',
    options: [
      {
        label: 'Amp Env',
      },
      {
        label: 'Mod Env',
      },
      {
        label: 'Amp+Mod Env',
      },
    ],
    description:
      'Affecte les quatre faders ADSR et le switch Triggering à l’Amp Envelope, à la Mod Envelope, ou aux deux.',
    education: {
      explanation:
        'Les deux enveloppes partagent les mêmes faders. L’Amp Env façonne toujours le volume. La Mod Env façonne la hauteur des oscillateurs, la largeur d’impulsion et la fréquence du filtre (via leurs commandes de profondeur Mod Env).',
      increase: 'Passe par Amp → Mod → Amp+Mod.',
      decrease: 'Revient en arrière.',
    },
  },
  'ampEnv.attack': {
    name: 'Attack Amp Env',
    description:
      'Temps que met l’Amp Env pour monter de zéro à son maximum après l’appui sur une touche.',
    education: {
      explanation:
        'L’attaque est l’apparition progressive de chaque note. Les instruments pincés et frappés ont une attaque quasi nulle, alors que les cordes frottées et les nappes gonflent lentement. Le manuel indique environ 250 ms à mi-course et plus de 5 s en haut.',
      increase: 'Apparition plus lente : notes douces qui gonflent.',
      decrease: 'Départ instantané : notes percussives et immédiates.',
    },
  },
  'ampEnv.decay': {
    name: 'Decay Amp Env',
    description:
      'Temps que met l’Amp Env pour descendre de son sommet jusqu’au niveau de Sustain pendant que la touche est tenue.',
    education: {
      explanation:
        'Le decay ne compte que si le Sustain est sous le maximum. C’est le temps que met l’enveloppe pour redescendre de son sommet au niveau de sustain, environ 150 ms à mi-course.',
      increase: 'Redescente plus longue et plus lente après le sommet.',
      decrease: 'Chute rapide vers le niveau de sustain : son vif et « pincé ».',
    },
  },
  'ampEnv.sustain': {
    name: 'Sustain Amp Env',
    description:
      'Niveau maintenu par l’Amp Env tant que la touche reste enfoncée. Le sustain est un niveau, pas une durée.',
    education: {
      explanation:
        'Le sustain est la seule commande ADSR qui règle un niveau et non une durée. Il décide de ce qui reste une fois l’attaque et le decay terminés, tant que la touche est tenue.',
      increase: 'Les notes restent fortes tant qu’elles sont tenues, comme un orgue.',
      decrease:
        'Les notes s’éteignent même tenues. À 0, elles deviennent inaudibles après le decay.',
    },
  },
  'ampEnv.release': {
    name: 'Release Amp Env',
    description: 'Temps que met l’Amp Env pour retomber à zéro après le relâchement de la touche.',
    education: {
      explanation:
        'Le release est la durée pendant laquelle une note continue de sonner après le relâchement. La réponse n’est pas linéaire : environ 360 ms à mi-course et plus de 10 s en haut.',
      increase: 'Les notes continuent de sonner et s’éteignent doucement après le relâchement.',
      decrease: 'Les notes s’arrêtent dès que la touche est relâchée.',
    },
  },
  'ampEnv.triggering': {
    name: 'Triggering Amp Env',
    options: [
      {
        label: 'Single',
        description:
          'Redéclenche seulement sur les notes détachées. Les notes legato ne redéclenchent pas.',
      },
      {
        label: 'Multi',
        description: 'Redéclenche à chaque note, quelle que soit la façon de jouer.',
      },
      {
        label: 'Autoglide',
        description: 'Comme Single, mais le portamento ne s’applique qu’aux notes legato.',
      },
    ],
    description: 'Comment l’Amp Env réagit au jeu legato et au portamento.',
    education: {
      explanation:
        'Legato signifie des notes qui se chevauchent. Single et Autoglide laissent une enveloppe tenue continuer en douceur sur la note legato suivante. Multi la redémarre toujours, donc chaque note a sa propre attaque.',
      increase: 'Vers Autoglide : glide uniquement sur les notes qui se chevauchent.',
      decrease: 'Vers Single : pas de redéclenchement sur les notes legato.',
    },
  },
  'ampEnv.retrigger': {
    name: 'Retrigger Amp Env',
    labels: ['r-0', 'r-1'],
    description: 'Activé, l’Amp Env redémarre (boucle) à la fin de son étape de decay.',
    education: {
      explanation:
        'Une enveloppe en boucle répète son cycle attaque-decay tant que la touche est tenue. Elle se comporte alors comme un LFO dont vous dessinez la forme avec les faders ADSR.',
      increase: 'Activé : l’enveloppe boucle.',
      decrease: 'Désactivé : une enveloppe normale qui ne se joue qu’une fois.',
    },
  },
  'ampEnv.retriggerCount': {
    name: 'Nombre de retriggers Amp Env',
    valueLabels: {
      '0': '∞',
    },
    description:
      'Nombre de boucles quand Retrigger Amp Env est activé (0 = boucle sans fin, 1–16).',
    education: {
      explanation:
        'Limite le nombre de répétitions d’une enveloppe en retrigger. 0 signifie qu’elle boucle sans fin.',
      increase: 'Plus de répétitions avant que l’enveloppe arrête de boucler.',
      decrease: 'Moins de répétitions. 0 boucle sans fin.',
    },
  },
  'ampEnv.fixedDuration': {
    name: 'Sustain à durée fixe Amp Env',
    labels: ['d-0', 'd-1'],
    description:
      'Donne à l’étape de sustain de l’Amp Env une durée fixe réglée par le fader Decay. L’étape de decay est supprimée.',
    education: {
      explanation:
        'Avec un sustain à durée fixe, l’enveloppe passe au release après un temps donné, même si la touche reste enfoncée. Idéal pour les sons de percussion. Il a priorité sur le retrigger d’enveloppe.',
      increase: 'Activé : la longueur de la note ne dépend plus de la durée d’appui.',
      decrease: 'Désactivé : un ADSR standard.',
    },
  },
  'modEnv.attack': {
    name: 'Attack Mod Env',
    description:
      'Temps que met la Mod Env pour monter de zéro à son maximum après l’appui sur une touche.',
    education: {
      explanation:
        'L’attaque de la Mod Env règle la vitesse à laquelle la modulation atteint son intensité maximale. Pour un balayage de filtre, c’est le temps que met le filtre à s’ouvrir.',
      increase: 'Montée de la modulation plus lente.',
      decrease: 'La modulation agit immédiatement.',
    },
  },
  'modEnv.decay': {
    name: 'Decay Mod Env',
    description:
      'Temps que met la Mod Env pour descendre de son sommet jusqu’au niveau de Sustain pendant que la touche est tenue.',
    education: {
      explanation:
        'Le decay ne compte que si le Sustain est sous le maximum. C’est le temps que met l’enveloppe pour redescendre de son sommet au niveau de sustain, environ 150 ms à mi-course.',
      increase: 'Redescente plus longue et plus lente après le sommet.',
      decrease: 'Chute rapide vers le niveau de sustain : son vif et « pincé ».',
    },
  },
  'modEnv.sustain': {
    name: 'Sustain Mod Env',
    description:
      'Niveau maintenu par la Mod Env tant que la touche reste enfoncée. Le sustain est un niveau, pas une durée.',
    education: {
      explanation:
        'Le sustain est la seule commande ADSR qui règle un niveau et non une durée. Il décide de ce qui reste une fois l’attaque et le decay terminés, tant que la touche est tenue.',
      increase: 'La modulation reste forte tant que la touche est tenue.',
      decrease: 'La modulation retombe après le decay.',
    },
  },
  'modEnv.release': {
    name: 'Release Mod Env',
    description: 'Temps que met la Mod Env pour retomber à zéro après le relâchement de la touche.',
    education: {
      explanation:
        'Le release est la durée pendant laquelle une note continue de sonner après le relâchement. La réponse n’est pas linéaire : environ 360 ms à mi-course et plus de 10 s en haut.',
      increase: 'Les notes continuent de sonner et s’éteignent doucement après le relâchement.',
      decrease: 'Les notes s’arrêtent dès que la touche est relâchée.',
    },
  },
  'modEnv.triggering': {
    name: 'Triggering Mod Env',
    options: [
      {
        label: 'Single',
        description:
          'Redéclenche seulement sur les notes détachées. Les notes legato ne redéclenchent pas.',
      },
      {
        label: 'Multi',
        description: 'Redéclenche à chaque note, quelle que soit la façon de jouer.',
      },
      {
        label: 'Autoglide',
        description: 'Comme Single, mais le portamento ne s’applique qu’aux notes legato.',
      },
    ],
    description: 'Comment la Mod Env réagit au jeu legato et au portamento.',
    education: {
      explanation:
        'Legato signifie des notes qui se chevauchent. Single et Autoglide laissent une enveloppe tenue continuer en douceur sur la note legato suivante. Multi la redémarre toujours, donc chaque note a sa propre attaque.',
      increase: 'Vers Autoglide : glide uniquement sur les notes qui se chevauchent.',
      decrease: 'Vers Single : pas de redéclenchement sur les notes legato.',
    },
  },
  'modEnv.retrigger': {
    name: 'Retrigger Mod Env',
    labels: ['r-0', 'r-1'],
    description: 'Activé, la Mod Env redémarre (boucle) à la fin de son étape de decay.',
    education: {
      explanation:
        'Une enveloppe en boucle répète son cycle attaque-decay tant que la touche est tenue. Elle se comporte alors comme un LFO dont vous dessinez la forme avec les faders ADSR.',
      increase: 'Activé : l’enveloppe boucle.',
      decrease: 'Désactivé : une enveloppe normale qui ne se joue qu’une fois.',
    },
  },
  'modEnv.retriggerCount': {
    name: 'Nombre de retriggers Mod Env',
    valueLabels: {
      '0': '∞',
    },
    description:
      'Nombre de boucles quand Retrigger Mod Env est activé (0 = boucle sans fin, 1–16).',
    education: {
      explanation:
        'Limite le nombre de répétitions d’une enveloppe en retrigger. 0 signifie qu’elle boucle sans fin.',
      increase: 'Plus de répétitions avant que l’enveloppe arrête de boucler.',
      decrease: 'Moins de répétitions. 0 boucle sans fin.',
    },
  },
  'modEnv.fixedDuration': {
    name: 'Sustain à durée fixe Mod Env',
    labels: ['d-0', 'd-1'],
    description:
      'Donne à l’étape de sustain de la Mod Env une durée fixe réglée par le fader Decay. L’étape de decay est supprimée.',
    education: {
      explanation:
        'Avec un sustain à durée fixe, l’enveloppe passe au release après un temps donné, même si la touche reste enfoncée. Idéal pour les sons de percussion. Il a priorité sur le retrigger d’enveloppe.',
      increase: 'Activé : la longueur de la note ne dépend plus de la durée d’appui.',
      decrease: 'Désactivé : un ADSR standard.',
    },
  },
  'panel.lfoDelaySpeed': {
    name: 'LFO Delay/Speed',
    options: [
      {
        label: 'Delay',
      },
      {
        label: 'Speed',
      },
    ],
    description:
      'Choisit si les deux potentiomètres de LFO règlent la vitesse ou le délai des LFO.',
    education: {
      explanation:
        'Chaque LFO a un potentiomètre à deux fonctions. Ce switch décide s’ils règlent la vitesse des LFO ou la lenteur de leur apparition.',
      increase: 'Speed : les potentiomètres règlent la vitesse (ou la division de sync).',
      decrease: 'Delay : les potentiomètres règlent le temps d’apparition.',
    },
  },
  'lfo1.waveform': {
    name: 'Forme d’onde LFO 1',
    options: [
      {
        label: 'Triangle',
        description: 'Montée et descente douces et régulières : vibrato, balayages doux.',
      },
      {
        label: 'Dent de scie',
        description: 'Rampe descendante, puis un saut vers le haut.',
      },
      {
        label: 'Carré',
        description: 'Saute entre deux valeurs : trilles, effets hachés.',
      },
      {
        label: 'S&H',
        description: 'Marches aléatoires : bips façon ordinateur.',
      },
    ],
    description: 'Forme d’onde du LFO 1.',
    education: {
      explanation:
        'Un LFO est un oscillateur trop lent pour être entendu. Sa forme est celle du mouvement qu’il applique. Le LFO 1 agit sur la hauteur des oscillateurs (via les commandes LFO 1 depth des oscillateurs, la molette de modulation et l’aftertouch).',
      increase: 'Vers S&H : mouvement plus abrupt, en marches.',
      decrease: 'Vers Triangle : mouvement doux et continu.',
    },
  },
  'lfo1.speed': {
    name: 'Vitesse LFO 1',
    description:
      'Vitesse du LFO 1, de zéro à environ 190 Hz. Tournez le potentiomètre du LFO avec Delay/Speed sur Speed.',
    education: {
      explanation:
        'La vitesse règle combien de fois par seconde la modulation se répète. Les vitesses lentes donnent des balayages, les vitesses moyennes du vibrato et du wobble, et les plus rapides atteignent les fréquences audio. Les valeurs de l’Init Patch sont 75 ≈ 7,9 Hz et 52 ≈ 3 Hz.',
      increase: 'Mouvement plus rapide.',
      decrease: 'Mouvement plus lent.',
    },
  },
  'lfo1.delay': {
    name: 'Délai LFO 1',
    valueLabels: {
      '0': 'Off',
    },
    description:
      'Temps d’apparition du LFO 1 après l’appui sur une touche. Tournez le potentiomètre du LFO avec Delay/Speed sur Delay.',
    education: {
      explanation:
        'Les chanteurs et les violonistes commencent souvent une note stable et ajoutent le vibrato ensuite. Le délai du LFO imite cela en faisant apparaître la modulation progressivement.',
      increase: 'La modulation apparaît plus lentement.',
      decrease: 'La modulation commence immédiatement.',
    },
  },
  'lfo1.keySync': {
    name: 'Key Sync LFO 1',
    description: 'Redémarre le LFO 1 au début de sa forme d’onde à chaque appui sur une touche.',
    education: {
      explanation:
        'Sans key sync, le LFO tourne librement et chaque note le prend à un point aléatoire. Avec key sync, chaque note démarre la modulation au même endroit, ce qui la rend prévisible et reproductible.',
      increase: 'Activé : chaque note redémarre le cycle du LFO depuis le début.',
      decrease: 'Désactivé : le LFO tourne librement et chaque note diffère.',
    },
  },
  'lfo1.speedSync': {
    name: 'Speed/Sync LFO 1',
    options: [
      {
        label: 'SPd',
        description: 'Le potentiomètre du LFO règle une vitesse libre.',
      },
      {
        label: 'Snc',
        description: 'Le potentiomètre du LFO choisit une division synchronisée au tempo.',
      },
    ],
    description:
      'Indique si le potentiomètre du LFO 1 (en mode Speed) règle une vitesse libre ou une division synchronisée au tempo.',
    education: {
      explanation:
        'En mode Sync, le LFO se cale sur le tempo interne de l’arpégiateur ou sur une horloge MIDI externe : son mouvement reste en rythme avec la musique.',
      increase: 'Snc : la vitesse suit le tempo.',
      decrease: 'SPd : vitesse libre en Hz.',
    },
  },
  'lfo1.syncValue': {
    name: 'Valeur de sync LFO 1',
    options: [
      {
        label: '64b',
        description: '64 temps — 1 cycle pour 16 mesures (1536 ticks MIDI)',
      },
      {
        label: '48b',
        description: '48 temps — 1 cycle pour 12 mesures (1152 ticks MIDI)',
      },
      {
        label: '42b',
        description: '42 temps — 2 cycles pour 21 mesures (1002 ticks MIDI)',
      },
      {
        label: '36b',
        description: '36 temps — 1 cycle pour 9 mesures (864 ticks MIDI)',
      },
      {
        label: '32b',
        description: '32 temps — 1 cycle pour 8 mesures (768 ticks MIDI)',
      },
      {
        label: '30b',
        description: '30 temps — 2 cycles pour 15 mesures (720 ticks MIDI)',
      },
      {
        label: '28b',
        description: '28 temps — 1 cycle pour 7 mesures (672 ticks MIDI)',
      },
      {
        label: '24b',
        description: '24 temps — 1 cycle pour 6 mesures (576 ticks MIDI)',
      },
      {
        label: '213',
        description: '21 + 2/3 — 3 cycles pour 16 mesures (512 ticks MIDI)',
      },
      {
        label: '20b',
        description: '20 temps — 1 cycle pour 5 mesures (480 ticks MIDI)',
      },
      {
        label: '183',
        description: '18 + 2/3 — 3 cycles pour 14 mesures (448 ticks MIDI)',
      },
      {
        label: '18b',
        description: '18 temps — 1 cycle pour 18 temps (2 cycles pour 9 mesures) (432 ticks MIDI)',
      },
      {
        label: '16b',
        description: '16 temps — 1 cycle pour 4 mesures (384 ticks MIDI)',
      },
      {
        label: '133',
        description: '13 + 1/3 — 3 cycles pour 4 mesures (320 ticks MIDI)',
      },
      {
        label: '12b',
        description: '12 temps — 1 cycle pour 12 temps (1 cycle pour 3 mesures) (288 ticks MIDI)',
      },
      {
        label: '102',
        description: '10 + 2/3 — 3 cycles pour 8 mesures (256 ticks MIDI)',
      },
      {
        label: '8b',
        description: '8 temps — 1 cycle pour 2 mesures (192 ticks MIDI)',
      },
      {
        label: '6b',
        description: '6 temps — 1 cycle pour 6 temps (2 cycles pour 3 mesures) (144 ticks MIDI)',
      },
      {
        label: '5b3',
        description: '5 + 1/3 — 3 cycles pour 4 mesures (128 ticks MIDI)',
      },
      {
        label: '4b',
        description: '4 temps — 1 cycle pour 1 mesure (96 ticks MIDI)',
      },
      {
        label: '3b',
        description: '3 temps — 1 cycle pour 3 temps (4 cycles pour 3 mesures) (72 ticks MIDI)',
      },
      {
        label: '8x3',
        description: '2 + 2/3 — 3 cycles pour 2 mesures (64 ticks MIDI)',
      },
      {
        label: '2n',
        description: 'blanche — 2 cycles pour 1 mesure (48 ticks MIDI)',
      },
      {
        label: '4d',
        description:
          'noire pointée — 2 cycles pour 3 temps (8 cycles pour 3 mesures) (36 ticks MIDI)',
      },
      {
        label: '4x3',
        description: '1 + 1/3 — 3 cycles pour 1 mesure (32 ticks MIDI)',
      },
      {
        label: '4n',
        description: 'noire — 4 cycles pour 1 mesure (24 ticks MIDI)',
      },
      {
        label: '8d',
        description:
          'croche pointée — 4 cycles pour 3 temps (16 cycles pour 3 mesures) (18 ticks MIDI)',
      },
      {
        label: '4t',
        description: 'triolet de noires — 6 cycles pour 1 mesure (16 ticks MIDI)',
      },
      {
        label: '8n',
        description: 'croche — 8 cycles pour 1 mesure (12 ticks MIDI)',
      },
      {
        label: '16d',
        description:
          'double croche pointée — 8 cycles pour 3 temps (32 cycles pour 3 mesures) (9 ticks MIDI)',
      },
      {
        label: '8t',
        description: 'triolet de croches — 12 cycles pour 1 mesure (8 ticks MIDI)',
      },
      {
        label: '16n',
        description: 'double croche — 16 cycles pour 1 mesure (6 ticks MIDI)',
      },
      {
        label: '16t',
        description: 'triolet de doubles croches — 24 cycles pour 1 mesure (4 ticks MIDI)',
      },
      {
        label: '32n',
        description: 'triple croche — 32 cycles pour 1 mesure (3 ticks MIDI)',
      },
      {
        label: '32t',
        description: 'triolet de triples croches — 48 cycles pour 1 mesure (2 ticks MIDI)',
      },
    ],
    description:
      'Vitesse synchronisée au tempo du LFO 1, choisie avec le potentiomètre du LFO quand Speed/Sync est sur Snc.',
    education: {
      explanation:
        'Les valeurs de sync vont d’un cycle toutes les 16 mesures (64b) à 48 cycles par mesure (32t). L’afficheur utilise des codes courts comme 4n (noire) et 8t (triolet de croches).',
      increase: 'Divisions plus courtes : mouvement plus rapide et rythmique.',
      decrease: 'Divisions plus longues : balayages lents qui évoluent sur plusieurs mesures.',
    },
  },
  'lfo1.slew': {
    name: 'Slew LFO 1',
    description: 'Adoucit les angles vifs de la forme d’onde du LFO 1.',
    education: {
      explanation:
        'Le slew arrondit les sauts brusques. Un LFO carré qui alterne entre deux hauteurs se met à glisser de l’une à l’autre. Des réglages élevés peuvent empêcher l’onde d’atteindre sa pleine amplitude.',
      increase:
        'Angles plus doux et plus ronds, avec une amplitude maximale plus faible aux valeurs élevées.',
      decrease: 'Angles vifs, non modifiés.',
    },
  },
  'lfo2.waveform': {
    name: 'Forme d’onde LFO 2',
    options: [
      {
        label: 'Triangle',
        description: 'Montée et descente douces et régulières : vibrato, balayages doux.',
      },
      {
        label: 'Dent de scie',
        description: 'Rampe descendante, puis un saut vers le haut.',
      },
      {
        label: 'Carré',
        description: 'Saute entre deux valeurs : trilles, effets hachés.',
      },
      {
        label: 'S&H',
        description: 'Marches aléatoires : bips façon ordinateur.',
      },
    ],
    description: 'Forme d’onde du LFO 2.',
    education: {
      explanation:
        'Un LFO est un oscillateur trop lent pour être entendu. Sa forme est celle du mouvement qu’il applique. Le LFO 2 agit sur la largeur d’impulsion et la fréquence du filtre (via les commandes de profondeur PW LFO 2 et Filter LFO 2).',
      increase: 'Vers S&H : mouvement plus abrupt, en marches.',
      decrease: 'Vers Triangle : mouvement doux et continu.',
    },
  },
  'lfo2.speed': {
    name: 'Vitesse LFO 2',
    description:
      'Vitesse du LFO 2, de zéro à environ 190 Hz. Tournez le potentiomètre du LFO avec Delay/Speed sur Speed.',
    education: {
      explanation:
        'La vitesse règle combien de fois par seconde la modulation se répète. Les vitesses lentes donnent des balayages, les vitesses moyennes du vibrato et du wobble, et les plus rapides atteignent les fréquences audio. Les valeurs de l’Init Patch sont 75 ≈ 7,9 Hz et 52 ≈ 3 Hz.',
      increase: 'Mouvement plus rapide.',
      decrease: 'Mouvement plus lent.',
    },
  },
  'lfo2.delay': {
    name: 'Délai LFO 2',
    valueLabels: {
      '0': 'Off',
    },
    description:
      'Temps d’apparition du LFO 2 après l’appui sur une touche. Tournez le potentiomètre du LFO avec Delay/Speed sur Delay.',
    education: {
      explanation:
        'Les chanteurs et les violonistes commencent souvent une note stable et ajoutent le vibrato ensuite. Le délai du LFO imite cela en faisant apparaître la modulation progressivement.',
      increase: 'La modulation apparaît plus lentement.',
      decrease: 'La modulation commence immédiatement.',
    },
  },
  'lfo2.keySync': {
    name: 'Key Sync LFO 2',
    description: 'Redémarre le LFO 2 au début de sa forme d’onde à chaque appui sur une touche.',
    education: {
      explanation:
        'Sans key sync, le LFO tourne librement et chaque note le prend à un point aléatoire. Avec key sync, chaque note démarre la modulation au même endroit, ce qui la rend prévisible et reproductible.',
      increase: 'Activé : chaque note redémarre le cycle du LFO depuis le début.',
      decrease: 'Désactivé : le LFO tourne librement et chaque note diffère.',
    },
  },
  'lfo2.speedSync': {
    name: 'Speed/Sync LFO 2',
    options: [
      {
        label: 'SPd',
        description: 'Le potentiomètre du LFO règle une vitesse libre.',
      },
      {
        label: 'Snc',
        description: 'Le potentiomètre du LFO choisit une division synchronisée au tempo.',
      },
    ],
    description:
      'Indique si le potentiomètre du LFO 2 (en mode Speed) règle une vitesse libre ou une division synchronisée au tempo.',
    education: {
      explanation:
        'En mode Sync, le LFO se cale sur le tempo interne de l’arpégiateur ou sur une horloge MIDI externe : son mouvement reste en rythme avec la musique.',
      increase: 'Snc : la vitesse suit le tempo.',
      decrease: 'SPd : vitesse libre en Hz.',
    },
  },
  'lfo2.syncValue': {
    name: 'Valeur de sync LFO 2',
    options: [
      {
        label: '64b',
        description: '64 temps — 1 cycle pour 16 mesures (1536 ticks MIDI)',
      },
      {
        label: '48b',
        description: '48 temps — 1 cycle pour 12 mesures (1152 ticks MIDI)',
      },
      {
        label: '42b',
        description: '42 temps — 2 cycles pour 21 mesures (1002 ticks MIDI)',
      },
      {
        label: '36b',
        description: '36 temps — 1 cycle pour 9 mesures (864 ticks MIDI)',
      },
      {
        label: '32b',
        description: '32 temps — 1 cycle pour 8 mesures (768 ticks MIDI)',
      },
      {
        label: '30b',
        description: '30 temps — 2 cycles pour 15 mesures (720 ticks MIDI)',
      },
      {
        label: '28b',
        description: '28 temps — 1 cycle pour 7 mesures (672 ticks MIDI)',
      },
      {
        label: '24b',
        description: '24 temps — 1 cycle pour 6 mesures (576 ticks MIDI)',
      },
      {
        label: '213',
        description: '21 + 2/3 — 3 cycles pour 16 mesures (512 ticks MIDI)',
      },
      {
        label: '20b',
        description: '20 temps — 1 cycle pour 5 mesures (480 ticks MIDI)',
      },
      {
        label: '183',
        description: '18 + 2/3 — 3 cycles pour 14 mesures (448 ticks MIDI)',
      },
      {
        label: '18b',
        description: '18 temps — 1 cycle pour 18 temps (2 cycles pour 9 mesures) (432 ticks MIDI)',
      },
      {
        label: '16b',
        description: '16 temps — 1 cycle pour 4 mesures (384 ticks MIDI)',
      },
      {
        label: '133',
        description: '13 + 1/3 — 3 cycles pour 4 mesures (320 ticks MIDI)',
      },
      {
        label: '12b',
        description: '12 temps — 1 cycle pour 12 temps (1 cycle pour 3 mesures) (288 ticks MIDI)',
      },
      {
        label: '102',
        description: '10 + 2/3 — 3 cycles pour 8 mesures (256 ticks MIDI)',
      },
      {
        label: '8b',
        description: '8 temps — 1 cycle pour 2 mesures (192 ticks MIDI)',
      },
      {
        label: '6b',
        description: '6 temps — 1 cycle pour 6 temps (2 cycles pour 3 mesures) (144 ticks MIDI)',
      },
      {
        label: '5b3',
        description: '5 + 1/3 — 3 cycles pour 4 mesures (128 ticks MIDI)',
      },
      {
        label: '4b',
        description: '4 temps — 1 cycle pour 1 mesure (96 ticks MIDI)',
      },
      {
        label: '3b',
        description: '3 temps — 1 cycle pour 3 temps (4 cycles pour 3 mesures) (72 ticks MIDI)',
      },
      {
        label: '8x3',
        description: '2 + 2/3 — 3 cycles pour 2 mesures (64 ticks MIDI)',
      },
      {
        label: '2n',
        description: 'blanche — 2 cycles pour 1 mesure (48 ticks MIDI)',
      },
      {
        label: '4d',
        description:
          'noire pointée — 2 cycles pour 3 temps (8 cycles pour 3 mesures) (36 ticks MIDI)',
      },
      {
        label: '4x3',
        description: '1 + 1/3 — 3 cycles pour 1 mesure (32 ticks MIDI)',
      },
      {
        label: '4n',
        description: 'noire — 4 cycles pour 1 mesure (24 ticks MIDI)',
      },
      {
        label: '8d',
        description:
          'croche pointée — 4 cycles pour 3 temps (16 cycles pour 3 mesures) (18 ticks MIDI)',
      },
      {
        label: '4t',
        description: 'triolet de noires — 6 cycles pour 1 mesure (16 ticks MIDI)',
      },
      {
        label: '8n',
        description: 'croche — 8 cycles pour 1 mesure (12 ticks MIDI)',
      },
      {
        label: '16d',
        description:
          'double croche pointée — 8 cycles pour 3 temps (32 cycles pour 3 mesures) (9 ticks MIDI)',
      },
      {
        label: '8t',
        description: 'triolet de croches — 12 cycles pour 1 mesure (8 ticks MIDI)',
      },
      {
        label: '16n',
        description: 'double croche — 16 cycles pour 1 mesure (6 ticks MIDI)',
      },
      {
        label: '16t',
        description: 'triolet de doubles croches — 24 cycles pour 1 mesure (4 ticks MIDI)',
      },
      {
        label: '32n',
        description: 'triple croche — 32 cycles pour 1 mesure (3 ticks MIDI)',
      },
      {
        label: '32t',
        description: 'triolet de triples croches — 48 cycles pour 1 mesure (2 ticks MIDI)',
      },
    ],
    description:
      'Vitesse synchronisée au tempo du LFO 2, choisie avec le potentiomètre du LFO quand Speed/Sync est sur Snc.',
    education: {
      explanation:
        'Les valeurs de sync vont d’un cycle toutes les 16 mesures (64b) à 48 cycles par mesure (32t). L’afficheur utilise des codes courts comme 4n (noire) et 8t (triolet de croches).',
      increase: 'Divisions plus courtes : mouvement plus rapide et rythmique.',
      decrease: 'Divisions plus longues : balayages lents qui évoluent sur plusieurs mesures.',
    },
  },
  'lfo2.slew': {
    name: 'Slew LFO 2',
    description: 'Adoucit les angles vifs de la forme d’onde du LFO 2.',
    education: {
      explanation:
        'Le slew arrondit les sauts brusques. Un LFO carré qui alterne entre deux hauteurs se met à glisser de l’une à l’autre. Des réglages élevés peuvent empêcher l’onde d’atteindre sa pleine amplitude.',
      increase:
        'Angles plus doux et plus ronds, avec une amplitude maximale plus faible aux valeurs élevées.',
      decrease: 'Angles vifs, non modifiés.',
    },
  },
  'effects.distortion': {
    name: 'Distorsion',
    description: 'Distorsion après le filtre, appliquée avant le VCA.',
    education: {
      explanation:
        'La distorsion vient après le filtre mais avant l’amplificateur. Son caractère reste donc constant pendant que l’Amp Envelope fait apparaître et disparaître la note.',
      increase: 'Son plus dur et plus agressif.',
      decrease: 'Sortie plus propre.',
    },
  },
  'effects.oscFilterMod': {
    name: 'Osc Filter Mod',
    valueLabels: {
      '0': 'Off',
    },
    description:
      'Module la fréquence du filtre directement avec l’oscillateur 2, à fréquence audio.',
    education: {
      explanation:
        'Osc 2 module la coupure à fréquence audio, et non à la vitesse lente d’un LFO. On obtient des sons complexes, souvent métalliques ou grondants. Le résultat dépend de presque tous les réglages d’Osc 2.',
      increase: 'Plus de modulation du filtre à fréquence audio : plus dur et plus complexe.',
      decrease: 'Moins de modulation. 0 la désactive.',
      experiment:
        'Ajoutez un peu d’Osc Filter Mod, puis bougez la molette de pitch. La hauteur d’Osc 2 change radicalement le caractère du son.',
    },
  },
  'portamento.glideTime': {
    name: 'Temps de glide',
    valueLabels: {
      '0': 'Off',
    },
    description:
      'Temps de portamento : la durée du glissement de hauteur d’une note à la suivante.',
    education: {
      explanation:
        'Le portamento fait glisser la hauteur entre les notes au lieu de sauter. Le switch Triggering des enveloppes décide si le glide s’applique à toutes les notes ou seulement aux notes legato (qui se chevauchent).',
      increase: 'Glissements plus lents et plus marqués.',
      decrease: 'Glissements plus rapides. Tourné à fond à gauche, le glide est désactivé.',
    },
  },
  'arp.on': {
    name: 'Arp On',
    description: 'Active ou désactive l’arpégiateur.',
    education: {
      explanation:
        'Un arpégiateur joue une à une les notes que vous tenez, selon un motif qui se répète. Tenez un accord de do majeur : il joue do, mi, sol en rythme.',
      increase: 'Activé : les notes tenues deviennent un motif rythmique.',
      decrease: 'Désactivé : le clavier joue normalement.',
    },
  },
  'arp.latch': {
    name: 'Latch',
    description:
      'Fait continuer le motif de l’arpège après le relâchement des touches. Arpégiateur éteint, sert de maintien des touches (Key Hold).',
    education: {
      explanation:
        'Latch fait tourner dans l’arpégiateur le dernier accord joué, ce qui libère vos mains pour le filtre et les autres commandes.',
      increase: 'Activé : le motif continue sans tenir les touches.',
      decrease: 'Désactivé : le motif s’arrête quand vous relâchez les touches.',
    },
  },
  'arp.tempo': {
    name: 'Tempo',
    description:
      'Tempo de l’arpégiateur et du séquenceur, 40–240 BPM. Désactivé automatiquement quand une horloge MIDI externe est détectée.',
    education: {
      explanation:
        'Le tempo règle la vitesse de l’arpégiateur et du séquenceur en battements par minute. Quand une horloge MIDI externe arrive, c’est elle qui prend le relais.',
      increase: 'Motifs plus rapides.',
      decrease: 'Motifs plus lents.',
    },
  },
  'arp.rhythm': {
    name: 'Rhythm',
    description:
      'Choisit l’un des 32 motifs rythmiques prédéfinis de l’arpège. La complexité augmente avec le numéro.',
    education: {
      explanation:
        'Le rythme 1 est une suite régulière de noires. Les numéros plus élevés ajoutent des silences et des doubles croches pour des grooves plus syncopés. Chaque motif dure deux mesures.',
      increase: 'Rythmes plus complexes et plus chargés.',
      decrease: 'Rythmes plus simples et plus réguliers.',
    },
  },
  'arp.mode': {
    name: 'Arp Mode',
    options: [
      {
        label: 'Up',
        description: 'Montant : commence par la note jouée la plus grave.',
      },
      {
        label: 'Down',
        description: 'Descendant : commence par la note jouée la plus aiguë.',
      },
      {
        label: 'UpDn',
        description: 'Monte et descend alternativement.',
      },
      {
        label: 'UpDn2',
        description:
          'Comme UpDn, mais la note la plus grave et la plus aiguë sont jouées deux fois.',
      },
      {
        label: 'Played',
        description: 'Les notes dans l’ordre où vous les avez jouées.',
      },
      {
        label: 'Random',
        description: 'Les notes tenues dans un ordre aléatoire qui change sans cesse.',
      },
      {
        label: 'Record',
        description: 'Enregistre une séquence pas à pas (jusqu’à 32 notes ou silences).',
      },
      {
        label: 'Play',
        description: 'Rejoue la séquence enregistrée sélectionnée.',
      },
    ],
    description:
      'Sélecteur à 8 positions qui règle l’ordre des notes, ou passe l’arpégiateur en séquenceur Record/Play.',
    education: {
      explanation:
        'Arp Mode décide de l’ordre dans lequel les notes tenues sont jouées. Les deux dernières positions transforment l’arpégiateur en séquenceur 32 pas.',
      increase: 'Vers Random, puis vers les modes séquenceur.',
      decrease: 'Vers le simple Up.',
    },
  },
  'arp.octaves': {
    name: 'Arp Octaves',
    description: 'Nombre d’octaves couvertes par le motif d’arpège (1–4).',
    education: {
      explanation:
        'Avec 2 octaves, le motif joue normalement puis se répète une octave plus haut. Chaque octave supplémentaire ajoute une répétition plus haut : un motif de 4 notes passe à 8, 12 ou 16 notes.',
      increase: 'Motifs plus larges et plus longs qui montent plus haut.',
      decrease: 'Les motifs restent dans les notes que vous tenez.',
    },
  },
  'arp.sequence': {
    name: 'SEQ',
    description:
      'Choisit l’une des quatre séquences globales. C’est la commande Arp Octaves quand Arp Mode est sur Record ou Play.',
    education: {
      explanation:
        'Le séquenceur mémorise quatre séquences de 32 notes ou silences maximum, conservées à l’extinction. Le numéro de séquence actuel est enregistré avec le patch.',
      increase: 'Choisit un emplacement de séquence plus haut.',
      decrease: 'Choisit un emplacement de séquence plus bas.',
    },
  },
  'arp.swing': {
    name: 'Arp Swing',
    description:
      'Décale le placement entre les notes impaires et paires de l’arpège. 50 = placement droit.',
    education: {
      explanation:
        'Le swing retarde une note sur deux pour un groove « shuffle », plus humain. Au-dessus de 50, l’écart entre notes impaires et paires s’allonge ; en dessous, il raccourcit.',
      increase: 'Plus de shuffle.',
      decrease: 'Swing inversé (notes paires avancées).',
    },
  },
  'arp.seqRetrig': {
    name: 'Seq Retrig',
    description: 'Redémarre la séquence toutes les deux mesures, même si elle n’est pas terminée.',
    education: {
      explanation:
        'Une séquence enregistrée peut ne pas avoir la longueur du motif rythmique choisi. Retrig la force à redémarrer en phase avec le rythme de deux mesures. Retrig désactivé, elle boucle librement.',
      increase: 'Activé : la séquence se recale toutes les deux mesures.',
      decrease: 'Désactivé : la séquence joue en entier et se décale par rapport au rythme.',
    },
  },
  'performance.pitchWheel': {
    name: 'Molette de pitch',
    description:
      'Molette à rappel qui fait varier la hauteur. L’amplitude est réglée par Pitch Bend Range.',
    education: {
      explanation:
        'La molette de pitch fait monter ou descendre les notes et revient toujours au centre quand on la lâche. Par défaut, sa variation maximale est de 12 demi-tons.',
      increase: 'Fait monter la hauteur.',
      decrease: 'Fait descendre la hauteur.',
    },
  },
  'performance.modWheel': {
    name: 'Molette de modulation',
    description: 'Molette de modulation. Sa cible est réglée par les fonctions On-Key Mod Wh.',
    education: {
      explanation:
        'La molette de modulation ajoute de l’expression en temps réel. Sur le Bass Station II, elle peut agir sur la coupure du filtre, le LFO 1 vers la hauteur (vibrato), le LFO 2 vers le filtre et la hauteur d’Osc 2, chacun avec sa propre quantité.',
      increase: 'Plus de chaque modulation affectée.',
      decrease: 'Moins de modulation.',
    },
  },
  'performance.aftertouch': {
    name: 'Aftertouch',
    description:
      'Pression exercée sur une touche après l’avoir frappée. Sa cible est réglée par les fonctions On-Key Aftertouch.',
    education: {
      explanation:
        'Appuyer plus fort sur une touche tenue ajoute de l’expression, par exemple en ouvrant le filtre ou en ajoutant du vibrato.',
      increase: 'Plus de pression, plus de modulation.',
      decrease: 'Moins de pression.',
    },
  },
  'performance.sustain': {
    name: 'Pédale de sustain',
    description: 'Entrée de pédale de sustain en face arrière.',
    education: {
      explanation:
        'Tant que la pédale est enfoncée, les notes continuent de sonner après le relâchement des touches.',
      increase: 'Pédale enfoncée.',
      decrease: 'Pédale relâchée.',
    },
  },
  'performance.octave': {
    name: 'Octave',
    description:
      'Décalage d’octave du clavier : jusqu’à 4 octaves vers le bas ou 5 vers le haut. Appuyez sur les deux boutons pour réinitialiser.',
    education: {
      explanation:
        'Décale tout le clavier par octaves pour que les 25 touches atteignent n’importe quel registre.',
      increase: 'Le clavier joue plus haut.',
      decrease: 'Le clavier joue plus bas.',
    },
  },
  'performance.transpose': {
    name: 'Transpose',
    description: 'Transpose le clavier en demi-tons (±12), par rapport au do central.',
    education: {
      explanation:
        'Maintenez Transpose et appuyez sur une touche. Le clavier se décale pour que le do central joue la note choisie.',
      increase: 'Tonalité plus haute.',
      decrease: 'Tonalité plus basse.',
    },
  },
  'modWheel.filterFreq': {
    name: 'Mod Wh : Filter Freq',
    description: 'Amplitude du contrôle de la coupure du filtre par la molette de modulation.',
    education: {
      explanation:
        'Permet à la molette de modulation d’ouvrir ou de fermer le filtre comme un second potentiomètre Frequency. Les valeurs positives ouvrent le filtre quand on pousse la molette.',
      increase: 'Valeurs positives : plus de modulation dans le sens positif.',
      decrease: 'Valeurs négatives : la modulation agit dans le sens inverse.',
    },
  },
  'modWheel.lfo1ToOscPitch': {
    name: 'Mod Wh : LFO 1 vers Osc Pitch',
    description:
      'Quantité de modulation de hauteur par le LFO 1 (deux oscillateurs) appliquée par la molette de modulation.',
    education: {
      explanation:
        'Le réglage classique « vibrato à la molette ». Il s’ajoute aux commandes LFO 1 depth du panneau, jusqu’à 8 octaves de variation de hauteur.',
      increase: 'Valeurs positives : plus de modulation dans le sens positif.',
      decrease: 'Valeurs négatives : la modulation agit dans le sens inverse.',
    },
  },
  'modWheel.lfo2ToFilterFreq': {
    name: 'Mod Wh : LFO 2 vers Filter Freq',
    description:
      'Quantité de modulation du filtre par le LFO 2 appliquée par la molette de modulation.',
    education: {
      explanation:
        'Fait apparaître un effet wah ou wobble quand on bouge la molette. S’ajoute à la profondeur Filter LFO 2 du panneau.',
      increase: 'Valeurs positives : plus de modulation dans le sens positif.',
      decrease: 'Valeurs négatives : la modulation agit dans le sens inverse.',
    },
  },
  'modWheel.osc2Pitch': {
    name: 'Mod Wh : Osc 2 Pitch',
    description: 'Quantité de variation de hauteur d’Osc 2 appliquée par la molette de modulation.',
    education: {
      explanation:
        'Balaie Osc 2 plus loin que la molette de pitch, jusqu’à 8 octaves. Excellent avec Osc 1-2 Sync.',
      increase: 'Valeurs positives : plus de modulation dans le sens positif.',
      decrease: 'Valeurs négatives : la modulation agit dans le sens inverse.',
    },
  },
  'aftertouch.filterFreq': {
    name: 'Aftertouch : Filter Freq',
    description:
      'Quantité de variation de la coupure du filtre appliquée par la pression sur les touches.',
    education: {
      explanation:
        'Appuyer plus fort sur une touche tenue ouvre le filtre (ou le ferme avec des valeurs négatives).',
      increase: 'Valeurs positives : plus de modulation dans le sens positif.',
      decrease: 'Valeurs négatives : la modulation agit dans le sens inverse.',
    },
  },
  'aftertouch.lfo1ToOscPitch': {
    name: 'Aftertouch : LFO 1 vers Osc Pitch',
    description:
      'Quantité de modulation de hauteur par le LFO 1 appliquée par la pression sur les touches.',
    education: {
      explanation:
        'Permet d’appuyer dans une note pour ajouter du vibrato, comme le ferait un violoniste.',
      increase: 'Valeurs positives : plus de modulation dans le sens positif.',
      decrease: 'Valeurs négatives : la modulation agit dans le sens inverse.',
    },
  },
  'aftertouch.lfo2Speed': {
    name: 'Aftertouch : LFO 2 Speed',
    description: 'De combien la pression sur les touches change la vitesse du LFO 2.',
    education: {
      explanation:
        'La pression accélère le LFO 2 (ou le ralentit avec des valeurs négatives) : les wobbles s’accélèrent quand vous appuyez.',
      increase: 'Valeurs positives : plus de modulation dans le sens positif.',
      decrease: 'Valeurs négatives : la modulation agit dans le sens inverse.',
    },
  },
  'voice.bendRange': {
    name: 'Pitch Bend Range',
    description:
      'Variation maximale de la molette de pitch, en demi-tons. Les valeurs négatives inversent le sens de la molette.',
    education: {
      explanation:
        'Règle jusqu’où la molette de pitch peut faire varier une note, jusqu’à deux octaves dans chaque sens.',
      increase: 'Variations plus larges.',
      decrease: 'Variations plus étroites. Les valeurs négatives inversent la molette.',
    },
  },
  'voice.oscSync': {
    name: 'Osc 1-2 Sync',
    description:
      'Synchronise (hard sync) Osc 2 sur Osc 1. La LED Sync 1-2 s’allume quand c’est activé.',
    education: {
      explanation:
        'Avec la sync, chaque nouveau cycle d’Osc 1 force Osc 2 à redémarrer sa forme d’onde. Accorder Osc 2 au-dessus d’Osc 1 ajoute alors des harmoniques fortes et déchirantes, tandis que la hauteur reste calée sur Osc 1. Baissez Osc 1 dans le mixer pour bien entendre l’effet.',
      increase: 'Activé : Osc 2 est réinitialisé par Osc 1 à chaque cycle.',
      decrease: 'Désactivé : les oscillateurs tournent indépendamment.',
      experiment:
        'Activez la sync, ne gardez qu’Osc 2 dans le mixer, puis montez Coarse d’Osc 2 pour le « cri » classique de la sync.',
    },
  },
  'voice.paraphonic': {
    name: 'Mode paraphonique',
    labels: ['P-0', 'P-1'],
    description:
      'Permet aux deux oscillateurs de jouer deux touches différentes. Ils partagent toujours un seul filtre et un seul amplificateur.',
    education: {
      explanation:
        'Le Bass Station II est monophonique par nature. En mode paraphonique, deux touches tenues sont réparties sur les deux oscillateurs. Les deux notes passent toujours par le même filtre et la même enveloppe d’amplitude.',
      increase: 'Activé : jeu à deux notes.',
      decrease: 'Désactivé : synthé monophonique classique.',
    },
  },
  'voice.oscError': {
    name: 'Oscillator Error',
    description:
      'Désaccord aléatoire à chaque appui sur une touche. 0 = aucun, 7 ≈ jusqu’à un demi-ton.',
    education: {
      explanation:
        'Ajoute un léger désaccord pseudo-aléatoire à chaque note, qui imite la dérive des vieux synthés analogiques.',
      increase: 'Plus de désaccord aléatoire par note.',
      decrease: 'Accordage stable.',
    },
  },
  'voice.glideDivergence': {
    name: 'Glide Divergence',
    description: 'Fait glisser Osc 2 plus lentement qu’Osc 1 (0 = glide identique).',
    education: {
      explanation:
        'Avec la divergence, les deux oscillateurs atteignent la nouvelle note à des moments différents. Le glide devient étalé et courbé.',
      increase: 'Osc 2 suit avec plus de retard.',
      decrease: 'Les deux oscillateurs glissent ensemble.',
    },
  },
  'velocity.ampEnv': {
    name: 'Velocity : Amp Env',
    description:
      'De combien la vélocité agit sur le volume. 0 = même volume quelle que soit la force de jeu.',
    education: {
      explanation:
        'La vélocité est la vitesse à laquelle une touche est frappée. Avec des valeurs positives, jouer plus fort donne un son plus fort. Le manuel conseille environ +40 pour un toucher naturel.',
      increase: 'Réponse plus dynamique.',
      decrease: 'Moins de réponse. Les valeurs négatives l’inversent.',
    },
  },
  'velocity.modEnv': {
    name: 'Velocity : Mod Env',
    description:
      'De combien la vélocité module l’intensité de tout ce que contrôle la Mod Envelope.',
    education: {
      explanation:
        'Avec des valeurs positives, jouer plus fort donne des effets de Mod Env plus profonds, comme un claquement de filtre plus brillant.',
      increase: 'Jouer plus fort donne plus de modulation.',
      decrease: 'Moins de réponse. Les valeurs négatives l’inversent.',
    },
  },
  'voice.vcaLimit': {
    name: 'VCA : Limiter',
    description:
      'Un limiteur simple sur l’étage VCA pour dompter les crêtes, par exemple avec une résonance élevée.',
    education: {
      explanation:
        'Le Bass Station II peut produire une très grande dynamique, surtout près de l’auto-oscillation du filtre. Le limiteur écrase les crêtes : montez ensuite la sortie pour compenser.',
      increase: 'Limitation plus forte : plus compressé et moins fort.',
      decrease: 'Pas de limitation.',
    },
  },
  'global.midiChannel': {
    name: 'Canal MIDI',
    description: 'Canal MIDI d’émission et de réception. Conservé à l’extinction.',
    education: {
      explanation: 'L’application et le synthé doivent utiliser le même canal pour communiquer.',
      increase: 'Canal plus élevé.',
      decrease: 'Canal plus bas.',
    },
  },
  'global.local': {
    name: 'Local',
    description:
      'Indique si le clavier joue le synthé interne. Revient toujours sur On après un redémarrage.',
    education: {
      explanation:
        'Mettez Local sur Off quand un logiciel (DAW) renvoie le clavier vers le synthé. Cela évite les notes doublées.',
      increase: 'On : le clavier joue le synthé.',
      decrease: 'Off : le clavier n’envoie que du MIDI.',
    },
  },
  'global.tune': {
    name: 'Tune',
    description: 'Accordage fin général, ±50 cents. Conservé à l’extinction.',
    education: {
      explanation:
        'Accorde tout l’instrument sur d’autres instruments. ±50 cents correspond à un quart de ton.',
      increase: 'Plus haut.',
      decrease: 'Plus bas.',
    },
  },
  'global.inputGain': {
    name: 'Input Gain',
    description: 'Gain de l’entrée audio EXT IN en face arrière. 0 dB = gain unitaire.',
    education: {
      explanation:
        'Adapte les sources micro, instrument ou ligne avant qu’elles n’atteignent le niveau External du mixer.',
      increase: 'Plus de gain d’entrée.',
      decrease: 'Moins de gain d’entrée.',
    },
  },
  'global.tuningTable': {
    name: 'Table d’accordage',
    valueLabels: {
      '0': 'Standard',
    },
    description:
      'Choisit une table de micro-accordage. 0 est l’accordage standard, et la table active peut être enregistrée avec le patch.',
    education: {
      explanation:
        'Les tables d’accordage attribuent à chaque touche une autre fréquence pour jouer des gammes hors du tempérament égal occidental, comme les shrutis indiens ou l’intonation juste.',
      increase: 'Table d’accordage suivante.',
      decrease: 'Table d’accordage précédente.',
    },
  },
  'global.overlayBank': {
    name: 'Banque d’overlays AFX',
    valueLabels: {
      '0': 'Aucun',
    },
    description:
      'Mode AFX : choisit une banque d’overlays (o-1…o-8) ou aucune (o-0). Enregistré avec le patch.',
    education: {
      explanation:
        'Le mode AFX, conçu avec Richard D. James, mémorise des réglages de paramètres différents sur chacune des 25 touches. Le clavier devient alors un ensemble de variations d’un même patch.',
      increase: 'Banque d’overlays suivante.',
      decrease: 'Banque précédente. 0 désactive les overlays.',
    },
  },
  'global.overlayWriteProtect': {
    name: 'Protection en écriture des overlays AFX',
    labels: ['r-0', 'r-1'],
    description: 'Empêche les modifications accidentelles des overlays pendant le jeu.',
    education: {
      explanation:
        'Avec la protection, vous pouvez tourner les commandes librement sans modifier vos overlays mémorisés.',
      increase: 'Activé : les overlays sont en lecture seule.',
      decrease: 'Désactivé : les overlays sont modifiables.',
    },
  },
};
