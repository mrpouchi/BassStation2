import type { TextPatch } from '../overlay';

// French text for the content set(s) below, in the same shape as the English data.
// Generated from translation tables; tests check that it matches and is complete.

export const FR_CURRICULUM: Readonly<Record<string, TextPatch>> = {
  'sound-fundamentals': {
    title: 'Les bases du son',
    lessons: [
      {
        title: 'Fréquence',
      },
      {
        title: 'Amplitude',
      },
      {
        title: 'Formes d’onde',
      },
      {
        title: 'Hauteur',
      },
      {
        title: 'Harmoniques',
      },
    ],
  },
  oscillators: {
    title: 'Oscillateurs',
    lessons: [
      {
        title: 'Oscillateur 1',
      },
      {
        title: 'Oscillateur 2',
      },
      {
        title: 'Dent de scie',
      },
      {
        title: 'Carré',
      },
      {
        title: 'Impulsion',
      },
      {
        title: 'Octave',
      },
      {
        title: 'Demi-ton',
      },
      {
        title: 'Largeur d’impulsion',
      },
    ],
  },
  mixer: {
    title: 'Mixer',
    lessons: [
      {
        title: 'Équilibre des oscillateurs',
      },
      {
        title: 'Bruit',
      },
      {
        title: 'Sub-oscillateur',
      },
      {
        title: 'Mélange des signaux',
      },
    ],
  },
  filters: {
    title: 'Filtres',
    lessons: [
      {
        title: 'Filtres passe-bas',
      },
      {
        title: 'Fréquence de coupure',
      },
      {
        title: 'Résonance',
      },
      {
        title: 'Pente du filtre',
      },
      {
        title: 'Overdrive',
      },
      {
        title: 'Modulation du filtre',
      },
    ],
  },
  envelopes: {
    title: 'Enveloppes',
    lessons: [
      {
        title: 'Attack',
      },
      {
        title: 'Decay',
      },
      {
        title: 'Sustain',
      },
      {
        title: 'Release',
      },
      {
        title: 'Enveloppe d’amplitude',
      },
      {
        title: 'Enveloppe de modulation',
      },
    ],
  },
  modulation: {
    title: 'Modulation',
    lessons: [
      {
        title: 'LFO 1',
      },
      {
        title: 'LFO 2',
      },
      {
        title: 'Profondeur de modulation',
      },
      {
        title: 'Routage de la modulation',
      },
      {
        title: 'Destinations de modulation',
      },
    ],
  },
  performance: {
    title: 'Jeu',
    lessons: [
      {
        title: 'Arpégiateur',
      },
      {
        title: 'Séquenceur',
      },
      {
        title: 'Glide',
      },
      {
        title: 'Commandes du clavier',
      },
      {
        title: 'Fonctions de jeu',
      },
    ],
  },
  'sound-design': {
    title: 'Création sonore',
    lessons: [
      {
        title: 'Sons de basse',
      },
      {
        title: 'Leads',
      },
      {
        title: 'Nappes (pads)',
      },
      {
        title: 'Superposition de sons',
      },
      {
        title: 'Créer des presets originaux',
      },
    ],
  },
};

export const FR_LESSONS: Readonly<Record<string, TextPatch>> = {
  'sound-fundamentals/frequency': {
    objective:
      'Comprendre la fréquence comme un nombre de cycles par seconde, et voir que la doubler monte la hauteur d’une octave.',
    explanation: [
      'Le son est une pression d’air qui va et vient. Un aller-retour complet est un cycle, et la fréquence compte combien de cycles ont lieu chaque seconde. Elle se mesure en hertz (Hz). La note A3 du Bass Station II (range 8′) vibre 440 fois par seconde.',
      'Notre oreille perçoit la fréquence en rapports. Doubler la fréquence donne toujours « la même note, plus haut » : un intervalle appelé octave. C’est pourquoi le bouton Range, qui double ou divise par deux la fréquence, avance par octaves entières.',
    ],
    demonstration: {
      caption:
        'Une onde sinusoïdale sur Osc 1. La courbe montre toujours deux cycles : une fréquence plus élevée signifie que chaque cycle dure moins longtemps.',
    },
    experiment: {
      steps: [
        'Jouez différentes touches du panneau et regardez la valeur en Hz sous la forme d’onde.',
        'Jouez deux do à une octave d’écart et comparez leurs fréquences : la plus haute est exactement le double.',
        'Changez Range d’Osc 1 entre 16′, 8′, 4′ et 2′ et regardez la fréquence se diviser ou se multiplier par deux.',
      ],
    },
    exercise: {
      prompt: 'A3 en 8′ vaut 440 Hz. Quelle est la fréquence de A4, une octave plus haut ?',
      options: [
        {
          label: '450 Hz',
          feedback: 'Une octave n’est pas un nombre fixe de hertz ajoutés. C’est un doublement.',
        },
        {
          label: '660 Hz',
          feedback: '660 Hz vaut 1,5 × 440 : une quinte juste au-dessus de A3, pas une octave.',
        },
        {
          label: '880 Hz',
          feedback: 'Exact : une octave plus haut double la fréquence, 2 × 440 = 880 Hz.',
        },
        {
          label: '220 Hz',
          feedback: 'Diviser la fréquence par deux descend d’une octave, vers A2.',
        },
      ],
    },
    success: 'Vous savez que la hauteur fonctionne en rapports : ×2, c’est une octave plus haut.',
  },
  'sound-fundamentals/amplitude': {
    objective:
      'Relier l’amplitude au volume et voir comment l’Amp Envelope la contrôle dans le temps.',
    explanation: [
      'L’amplitude est la taille de la variation de pression. Plus elle est grande, plus le son est fort. Sur une courbe, c’est la hauteur de l’onde, alors que la fréquence est la densité des cycles.',
      'Sur le Bass Station II, le VCA (amplificateur contrôlé en tension) fixe l’amplitude de chaque note. L’Amp Envelope le pilote, donc le volume peut changer pendant qu’une note joue. Le sustain fixe le niveau maintenu tant que la touche est enfoncée.',
    ],
    demonstration: {
      caption:
        'L’amplitude dans le temps : elle monte pendant l’attaque, se stabilise au niveau de sustain, puis retombe après le relâchement.',
    },
    experiment: {
      steps: [
        'Baissez le sustain de l’Amp Env et regardez la partie tenue de la courbe descendre.',
        'Mettez le sustain à 0 : la note devient muette une fois le decay terminé, même avec la touche enfoncée.',
      ],
    },
    exercise: {
      prompt:
        'Faites en sorte que les notes tenues se stabilisent à environ la moitié de l’amplitude.',
      conditions: [
        {
          hint: 'Placez le sustain de l’Amp Env vers le milieu (environ 64).',
        },
        {
          hint: 'Donnez un peu de temps au decay (≥ 10) pour voir la descente depuis le sommet.',
        },
      ],
    },
    success:
      'Vous avez utilisé l’enveloppe pour façonner l’amplitude : un volume qui évolue pendant la vie d’une note.',
  },
  'sound-fundamentals/waveforms': {
    objective: 'Reconnaître les quatre formes d’onde des oscillateurs et décrire leur caractère.',
    explanation: [
      'Chaque oscillateur propose sinus, triangle, dent de scie et impulsion. La forme d’un cycle décide du timbre : deux ondes de même hauteur et de même volume peuvent sonner complètement différemment.',
      'Les formes arrondies sonnent douces et pures. Les formes à angles vifs et à sauts sonnent brillantes et bourdonnantes, car les angles vifs sont faits de nombreuses harmoniques aiguës.',
    ],
    demonstration: {
      caption:
        'Vue Sources : Osc 1 en triangle (orange) et Osc 2 en dent de scie (bleu), à la même hauteur.',
    },
    experiment: {
      steps: [
        'Faites passer Osc 1 par les quatre formes d’onde et comparez-les.',
        'Passez la courbe en « Sources » pour voir chaque oscillateur séparément.',
      ],
    },
    exercise: {
      prompt: 'Quelle forme d’onde ne contient que la fréquence fondamentale, sans harmoniques ?',
      options: [
        {
          label: 'Dent de scie',
          feedback:
            'La dent de scie contient toutes les harmoniques, c’est pourquoi elle est la plus brillante.',
        },
        {
          label: 'Sinus',
          feedback: 'Exact : une onde sinusoïdale est une seule fréquence pure.',
        },
        {
          label: 'Impulsion',
          feedback:
            'Les ondes d’impulsion contiennent beaucoup d’harmoniques. Leur dosage dépend de la largeur.',
        },
        {
          label: 'Triangle',
          feedback:
            'Presque : un triangle a peu d’harmoniques, mais il garde des harmoniques impaires qui s’atténuent vite.',
        },
      ],
    },
    success: 'Vous savez associer chaque forme d’onde à son caractère sonore.',
  },
  'sound-fundamentals/pitch': {
    objective:
      'Utiliser Range et Coarse pour régler la hauteur des oscillateurs, et construire un intervalle musical avec deux oscillateurs.',
    explanation: [
      'La hauteur est la façon dont nous percevons la fréquence. Range déplace un oscillateur par octaves, Coarse par demi-tons (±12) et Fine par cents (±100).',
      'Avec les deux oscillateurs dans le mixer, accorder Osc 2 quelques demi-tons à côté d’Osc 1 fait jouer deux notes à chaque touche. +7 demi-tons, c’est une quinte juste, le « power chord » des basses et leads de synthé.',
    ],
    demonstration: {
      caption:
        'Osc 2 une quinte au-dessus d’Osc 1 : trois cycles d’Osc 2 pour deux cycles d’Osc 1 (rapport 3:2).',
    },
    experiment: {
      steps: [
        'Ajoutez Osc 2 dans le mixer.',
        'Tournez Coarse d’Osc 2 et regardez les deux ondes ne s’aligner qu’à certains intervalles (+7, +12).',
      ],
    },
    exercise: {
      prompt:
        'Faites jouer une quinte juste à chaque touche : Osc 2 sept demi-tons au-dessus d’Osc 1, les deux audibles.',
      conditions: [
        {
          hint: 'Sélectionnez Osc 2 et réglez Coarse sur +7,0 demi-tons.',
        },
        {
          hint: 'Gardez Range d’Osc 2 en 8′ pour qu’il reste dans la même octave qu’Osc 1.',
        },
        {
          hint: 'Gardez Range d’Osc 1 en 8′.',
        },
        {
          hint: 'Montez le niveau d’Osc 2 dans le mixer (≥ 128).',
        },
      ],
    },
    success: 'Vous avez construit un intervalle avec deux oscillateurs : une touche, deux notes.',
  },
  'sound-fundamentals/harmonics': {
    objective: 'Comprendre les harmoniques comme les briques du timbre et les voir sur un spectre.',
    explanation: [
      'Toute onde répétitive peut se décrire comme une somme de sinusoïdes à des multiples entiers de sa fréquence fondamentale : ×1, ×2, ×3… Ce sont les harmoniques, et leurs niveaux relatifs fixent le timbre.',
      'Une dent de scie a toutes les harmoniques, chacune plus faible (1/n). Un carré n’a que les impaires (1, 3, 5…). C’est important, car le filtre agit en retirant des harmoniques : on ne peut retirer que ce qui est là.',
    ],
    demonstration: {
      caption:
        'Barres : harmoniques d’une dent de scie. Le filtre est complètement ouvert, elles passent donc toutes.',
    },
    experiment: {
      steps: [
        'Faites passer Osc 1 entre dent de scie, impulsion (50 %), triangle et sinus, et regardez les barres.',
        'Remarquez comme le carré (impulsion à 50 %) saute une harmonique sur deux.',
      ],
    },
    exercise: {
      prompt: 'Une onde carrée (impulsion à 50 %) contient…',
      options: [
        {
          label: 'Seulement les harmoniques impaires (1, 3, 5, …)',
          feedback: 'Exact : c’est ce manque qui rend le son du carré creux.',
        },
        {
          label: 'Seulement les harmoniques paires',
          feedback: 'La fondamentale (harmonique 1) est impaire et toujours présente.',
        },
        {
          label: 'Toutes les harmoniques au même niveau',
          feedback:
            'Aucune vraie forme d’onde n’a des harmoniques égales. Elles diminuent avec la fréquence.',
        },
        {
          label: 'Aucune harmonique',
          feedback: 'Ce serait une onde sinusoïdale.',
        },
      ],
    },
    success:
      'Vous savez lire un spectre et connaissez les harmoniques que chaque forme d’onde offre au filtre.',
  },
  'oscillators/oscillator-1': {
    objective:
      'Utiliser les commandes partagées des oscillateurs et régler la forme d’onde et l’octave de l’oscillateur 1.',
    explanation: [
      'Le Bass Station II a deux oscillateurs identiques mais un seul jeu de commandes. Le switch Osc Select décide quel oscillateur les potentiomètres et boutons modifient, et l’autre garde ses réglages.',
      'L’oscillateur 1 est particulier : le sub-oscillateur le suit, et il pilote Osc 2 quand la Sync est activée.',
    ],
    demonstration: {
      caption: 'Osc 1 en triangle à 16′, une octave sous le diapason.',
    },
    experiment: {
      steps: [
        'Dans la vue matérielle, mettez Osc Select sur 1.',
        'Appuyez sur Waveform et Range et regardez leurs LED avancer.',
      ],
    },
    exercise: {
      prompt: 'Donnez à l’oscillateur 1 une onde triangle, une octave plus bas (16′).',
      conditions: [
        {
          hint: 'Sélectionnez Osc 1 et faites passer Waveform sur triangle.',
        },
        {
          hint: 'Faites passer Range sur 16′.',
        },
      ],
    },
    success: 'Vous savez configurer l’oscillateur 1 avec les commandes partagées.',
  },
  'oscillators/oscillator-2': {
    objective: 'Ajouter l’oscillateur 2 et le désaccorder légèrement pour épaissir le son.',
    explanation: [
      'Deux oscillateurs exactement à la même hauteur s’additionnent simplement. Désaccordez-en un de quelques cents et les ondes entrent et sortent lentement de phase. On entend un léger « battement » qui rend le son large et vivant.',
      'Ce son de dents de scie désaccordées est la base classique des basses, leads et nappes de synthé.',
    ],
    demonstration: {
      caption: 'Vue Sources : Osc 2 désaccordé de +30 cents s’éloigne lentement d’Osc 1.',
    },
    experiment: {
      steps: [
        'Montez Osc 2 dans le mixer.',
        'Bougez Fine d’Osc 2 et comparez la vue Sources avec un petit et un grand désaccord.',
      ],
    },
    exercise: {
      prompt:
        'Créez une paire désaccordée classique : deux dents de scie, Osc 2 légèrement plus haut.',
      conditions: [
        {
          hint: 'Mettez la forme d’onde d’Osc 2 en dent de scie.',
        },
        {
          hint: 'Montez le niveau d’Osc 2 dans le mixer à au moins 200.',
        },
        {
          hint: 'Désaccordez Fine d’Osc 2 entre +5 et +20 cents. De petites valeurs donnent un léger chorus.',
        },
      ],
    },
    success: 'Vous avez créé le son classique à deux oscillateurs désaccordés.',
  },
  'oscillators/sawtooth': {
    objective:
      'Comprendre pourquoi la dent de scie est la forme d’onde de référence en synthèse soustractive.',
    explanation: [
      'La dent de scie (une rampe montante puis un saut) contient toutes les harmoniques, la n-ième à 1/n de la fondamentale. C’est la matière brute la plus riche à sculpter avec un filtre.',
      'Les cuivres, les cordes et la plupart des sons de basse classiques partent de dents de scie.',
    ],
    demonstration: {
      caption:
        'La série harmonique de la dent de scie : toutes les barres sont présentes et décroissent doucement.',
    },
    experiment: {
      steps: [
        'Baissez lentement Frequency du filtre et regardez les harmoniques aiguës passer en gris (retirées).',
      ],
    },
    exercise: {
      prompt:
        'Quel est le niveau de la 4e harmonique d’une dent de scie par rapport à la fondamentale ?',
      options: [
        {
          label: '1/4 de la fondamentale',
          feedback: 'Exact : la n-ième harmonique d’une dent de scie a une amplitude de 1/n.',
        },
        {
          label: '1/16 de la fondamentale',
          feedback: '1/n² décrit les harmoniques impaires de l’onde triangle.',
        },
        {
          label: 'Elle est absente',
          feedback:
            'Ce sont les ondes carrées qui n’ont pas d’harmoniques paires, pas les dents de scie.',
        },
        {
          label: 'Au même niveau que la fondamentale',
          feedback:
            'Les harmoniques diminuent. Des niveaux égaux sonneraient comme un bruit agressif.',
        },
      ],
    },
    success: 'Vous connaissez la recette harmonique de la dent de scie.',
  },
  'oscillators/square': {
    objective: 'Créer une onde carrée et reconnaître son caractère creux.',
    explanation: [
      'Sur le Bass Station II, une onde carrée est la forme Pulse avec une largeur d’impulsion de 50 % : haute pendant la moitié du cycle, basse pendant l’autre moitié.',
      'Un carré n’a que des harmoniques impaires, ce qui donne le son creux et boisé des clarinettes et de nombreux sons de jeux vidéo rétro.',
    ],
    demonstration: {
      caption: 'Une impulsion à 50 % : autant de temps en haut qu’en bas.',
    },
    experiment: {
      steps: [
        'Choisissez Pulse sur Osc 1.',
        'Mettez le switch de source PW sur Manual et tournez Pulse Width sur 50.',
      ],
    },
    exercise: {
      prompt: 'Transformez l’oscillateur 1 en onde carrée parfaite.',
      conditions: [
        {
          hint: 'Mettez la forme d’onde d’Osc 1 sur Pulse.',
        },
        {
          hint: 'Réglez la largeur d’impulsion manuelle sur exactement 50 %.',
        },
      ],
    },
    success: 'Vous avez créé une onde carrée à partir de l’oscillateur en impulsion.',
  },
  'oscillators/pulse': {
    objective: 'Resserrer la largeur d’impulsion et entendre le son s’amincir.',
    explanation: [
      'Éloigner la largeur d’impulsion de 50 % crée des impulsions étroites. Les harmoniques paires reviennent et l’équilibre change : le son devient plus fin, plus nasal et plus « anche ».',
      '5 % et 95 % contiennent les mêmes harmoniques. C’est la même impulsion, à l’envers.',
    ],
    demonstration: {
      caption: 'Une impulsion à 12 % : un pic bref à chaque cycle.',
    },
    experiment: {
      steps: [
        'Balayez la largeur d’impulsion manuelle de 50 vers 95 et regardez la forme et les barres d’harmoniques.',
      ],
    },
    exercise: {
      prompt: 'Créez une impulsion étroite, fine et nasillarde sur l’oscillateur 1.',
      conditions: [
        {
          hint: 'Utilisez la forme Pulse.',
        },
        {
          hint: 'Poussez la largeur d’impulsion sous 20 % ou au-dessus de 80 %.',
        },
      ],
    },
    success: 'Vous avez utilisé la largeur d’impulsion pour régler le timbre.',
  },
  'oscillators/octave': {
    objective: 'Superposer des oscillateurs à l’octave avec les pieds de Range.',
    explanation: [
      'Range utilise les pieds des jeux d’orgue. 16′, 8′, 4′ et 2′ sont chacun séparés d’une octave, et 8′ correspond au diapason.',
      'Superposer des octaves (par exemple Osc 1 en 8′ et Osc 2 en 4′) ajoute de la brillance et de l’ampleur sans changer la note.',
    ],
    demonstration: {
      caption: 'Osc 2 en 4′ fait deux cycles pour chaque cycle d’Osc 1.',
    },
    experiment: {
      steps: ['Montez Osc 2 et changez son Range en regardant la vue Sources.'],
    },
    exercise: {
      prompt: 'Placez Osc 2 exactement une octave au-dessus d’Osc 1.',
      conditions: [
        {
          hint: 'Mettez Osc 1 en 8′.',
        },
        {
          hint: 'Mettez Osc 2 en 4′.',
        },
        {
          hint: 'Centrez Coarse d’Osc 2 (0) pour que Range seul fixe l’intervalle.',
        },
        {
          hint: 'Rendez Osc 2 audible dans le mixer (≥ 128).',
        },
      ],
    },
    success: 'Vous avez superposé des oscillateurs à l’octave.',
  },
  'oscillators/semitone': {
    objective: 'Voir que 12 demi-tons de Coarse équivalent à une octave de Range.',
    explanation: [
      'Le clavier est divisé en demi-tons, et douze forment une octave. Coarse accorde un oscillateur jusqu’à ±12 demi-tons : ses réglages extrêmes tombent exactement à une octave.',
      'Fine ajoute des cents (centièmes de demi-ton) pour désaccorder.',
    ],
    demonstration: {
      caption: 'Osc 2 avec Coarse à +12 en 8′ est identique à Osc 2 en 4′.',
    },
    experiment: {
      steps: ['Faites passer Coarse d’Osc 2 par +5, +7 et +12 et comparez l’alignement des ondes.'],
    },
    exercise: {
      prompt: 'Montez Osc 2 d’une octave avec Coarse uniquement (Range reste en 8′).',
      conditions: [
        {
          hint: 'Laissez Range d’Osc 2 en 8′.',
        },
        {
          hint: 'Tournez Coarse d’Osc 2 à fond à droite (+12,0).',
        },
        {
          hint: 'Rendez Osc 2 audible.',
        },
      ],
    },
    success: 'Vous avez montré que 12 demi-tons font une octave.',
  },
  'oscillators/pulse-width': {
    objective: 'Animer la largeur d’impulsion avec le LFO 2 (modulation de largeur d’impulsion).',
    explanation: [
      'La largeur d’impulsion peut varier automatiquement. Avec le switch de source PW sur LFO 2, le potentiomètre Pulse Width règle l’amplitude du balayage par le LFO 2. C’est la PWM, un mouvement riche façon chorus.',
      'La Mod Env peut aussi faire varier la largeur au cours de chaque note. Les trois sources peuvent agir en même temps : le switch choisit seulement celle que le potentiomètre modifie.',
    ],
    demonstration: {
      caption: 'Le LFO 2 (bleu) est le mouvement appliqué à la largeur d’impulsion.',
    },
    experiment: {
      steps: [
        'Choisissez Pulse sur Osc 1.',
        'Mettez le switch de source PW sur LFO 2 et montez le potentiomètre Pulse Width.',
        'Ralentissez le LFO 2 pour un balayage doux.',
      ],
    },
    exercise: {
      prompt: 'Mettez en place une modulation lente de largeur d’impulsion sur l’oscillateur 1.',
      conditions: [
        {
          hint: 'La PWM n’agit que sur la forme Pulse.',
        },
        {
          hint: 'Avec la source PW sur LFO 2, montez le potentiomètre Pulse Width (quantité LFO 2 sur PW d’Osc 1 ≥ 30).',
        },
        {
          hint: 'Ralentissez le LFO 2 (vitesse ≤ 70) pour un balayage doux.',
        },
      ],
    },
    success: 'Vous avez animé le timbre avec la PWM.',
  },
  'mixer/oscillator-balance': {
    objective: 'Équilibrer deux oscillateurs dans le mixer.',
    explanation: [
      'Le mixer décide de la part de chaque source qui atteint le filtre. Des niveaux égaux donnent un mélange équilibré ; privilégier un oscillateur laisse l’autre ajouter de la couleur en dessous.',
      'Toutes les sources sont additionnées avant le filtre : le filtre traite le mélange comme un seul son.',
    ],
    demonstration: {
      caption:
        'Sortie du mixer : une dent de scie et une impulsion une octave plus haut, à niveaux égaux.',
    },
    experiment: {
      steps: [
        'Bougez les niveaux d’Osc 1 et d’Osc 2 et regardez la sortie du mixer changer de forme.',
      ],
    },
    exercise: {
      prompt: 'Mélangez les deux oscillateurs à des niveaux à peu près égaux et modérés.',
      conditions: [
        {
          hint: 'Réglez le niveau d’Osc 1 entre 100 et 160.',
        },
        {
          hint: 'Réglez le niveau d’Osc 2 entre 100 et 160.',
        },
      ],
    },
    success: 'Vous avez équilibré deux sources dans le mixer.',
  },
  'mixer/noise': {
    objective: 'Utiliser le bruit blanc comme source sonore.',
    explanation: [
      'Le bruit blanc contient toutes les fréquences au hasard. Il n’a pas de hauteur, ce qui le rend parfait pour le vent, le souffle, les charlestons et le claquement d’une caisse claire.',
      'Le bruit partage le quatrième potentiomètre du mixer avec Ring et Ext. Mettez d’abord le switch Noise/Ring/Ext sur Noise.',
    ],
    demonstration: {
      caption: 'Le bruit seul : aucun cycle qui se répète.',
    },
    experiment: {
      steps: [
        'Mettez le switch sur Noise et montez le niveau.',
        'Baissez les oscillateurs pour entendre (et voir) le bruit seul.',
      ],
    },
    exercise: {
      prompt: 'Créez une source de bruit pur : bruit monté, tous les oscillateurs baissés.',
      conditions: [
        {
          hint: 'Passez le potentiomètre partagé sur Noise et montez-le (≥ 128).',
        },
        {
          hint: 'Baissez complètement le niveau d’Osc 1.',
        },
        {
          hint: 'Baissez complètement le niveau d’Osc 2.',
        },
        {
          hint: 'Baissez complètement le niveau du Sub.',
        },
      ],
    },
    success:
      'Vous avez créé une source de bruit, le point de départ de toute percussion de synthé.',
  },
  'mixer/sub-oscillator': {
    objective: 'Ajouter du poids dans les graves avec le sub-oscillateur.',
    explanation: [
      'Le sub-oscillateur suit Osc 1, une ou deux octaves plus bas. Un sub sinus ajoute un poids pur et profond, tandis que les subs carré et impulsion étroite restent audibles sur de petites enceintes.',
      'C’est le moyen le plus rapide d’obtenir une basse plus grosse.',
    ],
    demonstration: {
      caption: 'Vue Sources : le sub carré vert fait un cycle pour deux cycles d’Osc 1.',
    },
    experiment: {
      steps: [
        'Montez le niveau du Sub.',
        'Comparez les octaves -1 et -2 et les trois formes d’onde du sub.',
      ],
    },
    exercise: {
      prompt: 'Ajoutez un sub sinus profond deux octaves sous Osc 1.',
      conditions: [
        {
          hint: 'Montez le niveau du Sub (≥ 128).',
        },
        {
          hint: 'Mettez le switch Octave du sub sur -2.',
        },
        {
          hint: 'Choisissez la forme sinus pour le sub.',
        },
      ],
    },
    success: 'Vous avez ajouté du poids de sub-basse.',
  },
  'mixer/signal-mixing': {
    objective: 'Comprendre la modulation en anneau et l’entrée externe comme sources du mixer.',
    explanation: [
      'Le modulateur en anneau multiplie Osc 1 par Osc 2. La sortie contient la somme et la différence de leurs fréquences, en général sans rapport harmonique. Le résultat est métallique, proche de la cloche et du choc métallique.',
      'La source Ext fait passer n’importe quel signal audio de la prise EXT IN arrière par le filtre et les enveloppes.',
    ],
    demonstration: {
      caption: 'Ring mod de deux sinus à une quinte d’écart : une forme complexe qui bat.',
    },
    experiment: {
      steps: [
        'Passez le potentiomètre partagé sur Ring et montez-le.',
        'Désaccordez Coarse d’Osc 2 et regardez la forme changer.',
      ],
    },
    exercise: {
      prompt: 'Une modulation en anneau de 300 Hz par 200 Hz produit surtout quelles fréquences ?',
      options: [
        {
          label: '100 Hz et 500 Hz',
          feedback: 'Exact : la différence (300 − 200) et la somme (300 + 200).',
        },
        {
          label: '250 Hz',
          feedback: 'Une multiplication ne fait pas une moyenne.',
        },
        {
          label: '300 Hz et 200 Hz',
          feedback:
            'Les fréquences d’origine disparaissent en grande partie dans un modulateur en anneau.',
        },
        {
          label: '60 000 Hz',
          feedback: 'Ce sont les signaux qui sont multipliés, pas leurs fréquences.',
        },
      ],
    },
    success: 'Vous comprenez d’où viennent les sons métalliques du ring mod.',
  },
  'filters/low-pass': {
    objective: 'Décrire ce qu’un filtre passe-bas fait au spectre.',
    explanation: [
      'Un filtre passe-bas laisse passer les fréquences sous la coupure et atténue celles au-dessus. Retirer les harmoniques aiguës rend un son plus sombre et plus chaud. C’est l’essence de la synthèse soustractive.',
      'Le Bass Station II propose un filtre multimode Classic (LP/BP/HP) et un passe-bas Acid 24 dB à échelle de diodes.',
    ],
    demonstration: {
      caption:
        'Un passe-bas à coupure modérée : les harmoniques graves passent, les aiguës sont retirées.',
    },
    experiment: {
      steps: ['Passez Shape entre LP, BP et HP et regardez quelles barres restent.'],
    },
    exercise: {
      prompt: 'Un filtre passe-bas retire surtout…',
      options: [
        {
          label: 'Les fréquences au-dessus de la coupure',
          feedback: 'Exact : il laisse passer les graves et retire les aigus.',
        },
        {
          label: 'Les fréquences sous la coupure',
          feedback: 'Ça, c’est un filtre passe-haut.',
        },
        {
          label: 'Tout sauf la fréquence de coupure',
          feedback: 'Ça ressemble plutôt à un passe-bande (étroit).',
        },
        {
          label: 'Seulement le bruit',
          feedback: 'Les filtres agissent sur les fréquences, quelle que soit la source.',
        },
      ],
    },
    success: 'Vous savez ce qu’un filtre passe-bas retire.',
  },
  'filters/cutoff': {
    objective: 'Placer la fréquence de coupure pour régler la brillance.',
    explanation: [
      'La coupure est le point où le filtre commence à agir. C’est le grand potentiomètre Frequency, car c’est la commande la plus expressive du synthé.',
      'La balayer fait passer un son d’étouffé à brillant en un seul geste.',
    ],
    demonstration: {
      caption: 'Coupure vers 300 Hz sur une dent de scie.',
    },
    experiment: {
      steps: [
        'Balayez Frequency de complètement ouvert à presque fermé et regardez les barres colorées.',
      ],
    },
    exercise: {
      prompt: 'Assombrissez le son : placez une coupure passe-bas dans le bas-médium.',
      conditions: [
        {
          hint: 'Utilisez la forme LP.',
        },
        {
          hint: 'Réglez Frequency entre 80 et 140 (l’affichage indique environ 175 Hz à 1,2 kHz).',
        },
      ],
    },
    success: 'Vous avez placé la coupure pour contrôler la brillance.',
  },
  'filters/resonance': {
    objective: 'Ajouter de la résonance et voir la crête à la coupure.',
    explanation: [
      'La résonance renvoie une partie de la sortie du filtre vers son entrée. Cela accentue une bande étroite juste à la coupure : les balayages de filtre deviennent vocaux, sifflants et « squelchy ».',
      'À des réglages élevés, la crête peut dominer le son. La fonction On-Key VCA Limiter aide à maîtriser le niveau.',
    ],
    demonstration: {
      caption: 'Une forte crête de résonance qui accentue les harmoniques autour de la coupure.',
    },
    experiment: {
      steps: [
        'Montez la résonance, puis balayez Frequency et regardez la crête traverser les harmoniques.',
      ],
    },
    exercise: {
      prompt: 'Créez un filtre passe-bas très résonant.',
      conditions: [
        {
          hint: 'Montez la résonance à 90 ou plus.',
        },
        {
          hint: 'Baissez Frequency à 180 ou moins pour que la crête se place parmi les harmoniques.',
        },
      ],
    },
    success: 'Vous avez fait chanter le filtre.',
  },
  'filters/slope': {
    objective: 'Comparer les pentes de filtre 12 dB et 24 dB.',
    explanation: [
      'La pente indique la vitesse à laquelle le filtre atténue au-delà de la coupure. À 24 dB par octave, les fréquences une octave après la coupure sont bien plus faibles qu’à 12 dB.',
      '12 dB sonne ouvert et doux, 24 dB sonne ferme et précis. Slope ne fonctionne qu’avec Type = Classic, car Acid est toujours en 24 dB.',
    ],
    demonstration: {
      caption: 'Une pente de 12 dB : la courbe descend doucement, davantage d’harmoniques passent.',
    },
    experiment: {
      steps: ['Basculez Slope entre 12 et 24 dB et comparez la raideur de la courbe.'],
    },
    exercise: {
      prompt: 'Choisissez la pente plus douce de 12 dB sur le filtre Classic.',
      conditions: [
        {
          hint: 'Slope ne fonctionne qu’avec Type = Classic.',
        },
        {
          hint: 'Mettez Slope sur 12 dB.',
        },
      ],
    },
    success: 'Vous savez choisir entre un filtrage doux et un filtrage raide.',
  },
  'filters/overdrive': {
    objective:
      'Utiliser l’overdrive avant le filtre pour ajouter des harmoniques avant de filtrer.',
    explanation: [
      'L’overdrive sature la sortie du mixer avant le filtre et ajoute de nouvelles harmoniques. Le filtre façonne ensuite ces harmoniques, ce qui donne un caractère chaud et granuleux.',
      'Comparez avec Distortion dans la section Effects, qui vient après le filtre.',
    ],
    demonstration: {
      caption:
        'L’overdrive n’est pas dessiné sur ce spectre idéal. Il ajoute des harmoniques avant le filtre.',
    },
    experiment: {
      steps: ['Montez l’overdrive avec un filtre fermé, puis ouvrez le filtre.'],
    },
    exercise: {
      prompt: 'Saturez l’entrée du filtre : ajoutez une bonne dose d’overdrive.',
      conditions: [
        {
          hint: 'Montez l’overdrive à 60 ou plus.',
        },
      ],
    },
    success: 'Vous savez où se place l’overdrive dans le chemin du signal.',
  },
  'filters/filter-modulation': {
    objective: 'Balayer le filtre avec la Mod Envelope pour une basse « pincée ».',
    explanation: [
      'La Mod Envelope peut ouvrir le filtre au début de chaque note puis le laisser se refermer. Avec un decay court et un sustain bas, chaque note a un « pincement » brillant qui s’éteint vers un son plus sombre.',
      'La profondeur Mod Env du filtre règle l’étendue du balayage, jusqu’à huit octaves au maximum.',
    ],
    demonstration: {
      caption: 'La forme de la Mod Envelope qui va piloter le filtre.',
    },
    experiment: {
      steps: [
        'Baissez Frequency.',
        'Mettez Env Select sur Mod Env, puis un decay court et un sustain à 0.',
        'Montez la profondeur Mod Env du filtre.',
      ],
    },
    exercise: {
      prompt:
        'Construisez un son pincé balayé par l’enveloppe : filtre fermé, Mod Env courte, profondeur positive.',
      conditions: [
        {
          hint: 'Fermez le filtre (Frequency ≤ 120).',
        },
        {
          hint: 'Montez la profondeur Mod Env du filtre à au moins +30.',
        },
        {
          hint: 'Donnez à la Mod Env un decay court à moyen (30–80).',
        },
        {
          hint: 'Baissez le sustain de la Mod Env (≤ 20) pour que le filtre se referme.',
        },
      ],
    },
    success: 'Vous avez créé le son pincé classique au filtre d’enveloppe.',
  },
  'envelopes/attack': {
    objective: 'Façonner le début d’une note avec l’attaque.',
    explanation: [
      'L’attaque est le temps entre l’appui sur la touche et le niveau maximal. Proche de zéro, le son est percussif. Une attaque longue fait gonfler les notes, comme des cordes frottées ou des nappes.',
      'Le manuel indique environ 250 ms à mi-course et plus de 5 secondes en haut.',
    ],
    demonstration: {
      caption: 'Une attaque lente : la note apparaît progressivement.',
    },
    experiment: {
      steps: ['Bougez l’attaque de l’Amp Env et regardez la pente montante.'],
    },
    exercise: {
      prompt: 'Faites gonfler les notes lentement.',
      conditions: [
        {
          hint: 'Montez l’attaque de l’Amp Env à 90 ou plus.',
        },
      ],
    },
    success: 'Vous maîtrisez le début des notes.',
  },
  'envelopes/decay': {
    objective: 'Utiliser le decay avec un sustain bas pour des sons pincés.',
    explanation: [
      'Le decay est le temps entre le sommet et le niveau de sustain. Avec un sustain à zéro, le decay seul fixe la durée de la note, comme pour une corde pincée.',
      'À mi-course, environ 150 ms.',
    ],
    demonstration: {
      caption: 'Attaque nulle, decay court, pas de sustain : un son pincé.',
    },
    experiment: {
      steps: ['Mettez le sustain à 0, puis faites varier le decay.'],
    },
    exercise: {
      prompt: 'Créez une enveloppe de son pincé.',
      conditions: [
        {
          hint: 'Gardez l’attaque à 0 ou presque.',
        },
        {
          hint: 'Réglez le decay entre 40 et 75.',
        },
        {
          hint: 'Descendez le sustain à 10 ou moins.',
        },
      ],
    },
    success: 'Vous savez façonner des sons pincés et des « stabs ».',
  },
  'envelopes/sustain': {
    objective: 'Distinguer le sustain (un niveau) des autres étapes ADSR (des durées).',
    explanation: [
      'Attack, Decay et Release sont des durées. Sustain est un niveau : la hauteur que garde l’enveloppe tant que la touche reste enfoncée.',
      'Un orgue n’est que sustain, un piano n’en a pas (il décroît sans cesse).',
    ],
    demonstration: {
      caption: 'La partie plate est le niveau de sustain.',
    },
    experiment: {
      steps: [
        'Montez et baissez le sustain et regardez seule la hauteur de la partie plate changer.',
      ],
    },
    exercise: {
      prompt: 'Quel paramètre ADSR règle un niveau plutôt qu’une durée ?',
      options: [
        {
          label: 'Attack',
          feedback: 'L’attaque est le temps pour atteindre le sommet.',
        },
        {
          label: 'Decay',
          feedback: 'Le decay est le temps pour descendre au niveau de sustain.',
        },
        {
          label: 'Sustain',
          feedback: 'Exact : le sustain est le niveau maintenu tant que la touche est enfoncée.',
        },
        {
          label: 'Release',
          feedback: 'Le release est le temps d’extinction après le relâchement de la touche.',
        },
      ],
    },
    success: 'Vous connaissez la seule commande ADSR qui est un niveau.',
  },
  'envelopes/release': {
    objective: 'Laisser les notes sonner après le relâchement de la touche.',
    explanation: [
      'Le release est le temps d’extinction après avoir lâché la touche. Un release court arrête net les notes, un long les fait traîner, ce qui convient aux nappes et aux sons d’ambiance.',
      'Le release maximal dépasse 10 secondes, et la courbe n’est pas linéaire.',
    ],
    demonstration: {
      caption: 'Une longue queue de release après le repère de relâchement.',
    },
    experiment: {
      steps: ['Montez le release et regardez la queue après la ligne pointillée du relâchement.'],
    },
    exercise: {
      prompt: 'Donnez aux notes une longue queue qui s’attarde.',
      conditions: [
        {
          hint: 'Montez le release de l’Amp Env à 90 ou plus.',
        },
      ],
    },
    success: 'Vous maîtrisez la fin des notes.',
  },
  'envelopes/amp-envelope': {
    objective: 'Comprendre le déclenchement des enveloppes en jeu legato.',
    explanation: [
      'Triggering décide si les notes qui se chevauchent (legato) redémarrent les enveloppes. Multi redémarre à chaque note. Single ne redémarre que sur les notes détachées, pour que les phrases legato coulent. Autoglide fait comme Single, mais n’applique le glide qu’aux notes legato.',
      'Le switch Env Select décide si les faders et le switch Triggering modifient l’Amp Env, la Mod Env, ou les deux.',
    ],
    demonstration: {
      caption: 'Avec Multi, chaque nouvelle note relance la courbe depuis l’attaque.',
    },
    experiment: {
      steps: ['Dans la vue matérielle, réglez Env Select et faites changer le switch Triggering.'],
    },
    exercise: {
      prompt:
        'Quel mode de Triggering redémarre l’enveloppe à chaque note, même en jouant legato ?',
      options: [
        {
          label: 'Single',
          feedback: 'Single ne redéclenche pas sur les notes legato.',
        },
        {
          label: 'Multi',
          feedback: 'Exact : Multi redéclenche toujours.',
        },
        {
          label: 'Autoglide',
          feedback: 'Autoglide se comporte comme Single pour le déclenchement.',
        },
      ],
    },
    success: 'Vous savez choisir le bon déclenchement selon votre façon de jouer.',
  },
  'envelopes/mod-envelope': {
    objective: 'Utiliser la Mod Envelope sur la hauteur pour une chute percussive.',
    explanation: [
      'La Mod Envelope ne contrôle pas le volume. Elle module la hauteur, la largeur d’impulsion et la fréquence du filtre via leurs potentiomètres de profondeur Mod Env.',
      'Un balayage de hauteur rapide vers le bas au début de chaque note donne le classique tom de synthé ou le « piou ». Une profondeur de 8 correspond à une octave.',
    ],
    demonstration: {
      caption: 'Une Mod Env courte : attaque rapide, chute rapide.',
    },
    experiment: {
      steps: [
        'Mettez Env Select sur Mod, avec un decay court et un sustain nul.',
        'Passez la profondeur Mod Env sur la hauteur d’Osc 1 en négatif.',
      ],
    },
    exercise: {
      prompt: 'Créez un balayage de hauteur descendant sur Osc 1 au début de chaque note.',
      conditions: [
        {
          hint: 'Passez la profondeur Mod Env sur la hauteur d’Osc 1 en négatif (≤ −10).',
        },
        {
          hint: 'Gardez l’attaque de la Mod Env proche de 0.',
        },
        {
          hint: 'Decay de la Mod Env court (20–70).',
        },
        {
          hint: 'Sustain de la Mod Env à 0 pour que la hauteur revienne.',
        },
      ],
    },
    success: 'Vous avez utilisé la Mod Envelope comme source de modulation.',
  },
  'modulation/lfo-1': {
    objective: 'Créer un vibrato avec le LFO 1.',
    explanation: [
      'Le LFO 1 module la hauteur des oscillateurs via le potentiomètre LFO 1 depth de chacun. Un triangle doux vers 5–7 Hz avec une faible profondeur sonne comme un vibrato naturel.',
      'L’échelle du manuel : 6 = un demi-ton de variation, 12 = un ton, 32 = une octave.',
    ],
    demonstration: {
      caption: 'Le LFO 1 (orange) à la vitesse de l’Init, environ 7,9 Hz.',
    },
    experiment: {
      steps: [
        'Montez un peu LFO 1 depth d’Osc 1.',
        'Changez la vitesse et la forme d’onde du LFO 1.',
      ],
    },
    exercise: {
      prompt: 'Ajoutez un léger vibrato à Osc 1.',
      conditions: [
        {
          hint: 'Utilisez un LFO 1 triangle, doux.',
        },
        {
          hint: 'Une faible valeur de LFO 1 depth d’Osc 1 (2–8) donne au plus environ ±1 demi-ton.',
        },
        {
          hint: 'Réglez la vitesse du LFO 1 entre 55 et 90 (environ 3–12 Hz).',
        },
      ],
    },
    success: 'Vous avez créé un vibrato.',
  },
  'modulation/lfo-2': {
    objective: 'Faire bouger le filtre avec le LFO 2.',
    explanation: [
      'Le LFO 2 module la fréquence du filtre via le potentiomètre LFO 2 depth du filtre. Les vitesses lentes donnent des balayages évolutifs, les plus rapides du wah et du wobble.',
      'Une profondeur de 16 fait varier la coupure d’une octave.',
    ],
    demonstration: {
      caption: 'Le LFO 2 (bleu) balaie le filtre sur ±2 octaves.',
    },
    experiment: {
      steps: [
        'Baissez Frequency du filtre, puis montez la profondeur LFO 2 du filtre.',
        'Essayez différentes formes d’onde pour le LFO 2.',
      ],
    },
    exercise: {
      prompt: 'Mettez en place un balayage de filtre lent.',
      conditions: [
        {
          hint: 'Montez la profondeur LFO 2 du filtre à au moins 20.',
        },
        {
          hint: 'Ralentissez le LFO 2 (vitesse ≤ 60).',
        },
      ],
    },
    success: 'Vous avez fait bouger le filtre automatiquement.',
  },
  'modulation/modulation-depth': {
    objective: 'Lire les valeurs de profondeur de modulation comme des intervalles musicaux.',
    explanation: [
      'Les commandes de profondeur sont neutres au centre : 0 signifie aucune modulation, et les valeurs négatives inversent la source.',
      'Pour le LFO 1 vers la hauteur, l’échelle est musicale : 6 = demi-ton, 12 = ton, 22 = quinte, 32 = octave, 56 = deux octaves. La résolution est plus fine aux faibles valeurs, là où se trouve le vibrato.',
    ],
    demonstration: {
      caption: 'L’affichage du LFO 1 indique la variation en demi-tons.',
    },
    experiment: {
      steps: [
        'Réglez LFO 1 depth d’Osc 1 sur 6, 12, 22 puis 32 et lisez la variation en demi-tons.',
      ],
    },
    exercise: {
      prompt:
        'Sur la commande LFO 1 depth des oscillateurs, quelle valeur donne une variation de hauteur d’une octave ?',
      options: [
        {
          label: '12',
          feedback: '12 donne un ton (2 demi-tons).',
        },
        {
          label: '32',
          feedback: 'Exact : le manuel indique 32 = une octave.',
        },
        {
          label: '63',
          feedback: 'C’est bien plus qu’une octave.',
        },
        {
          label: '127',
          feedback: 'Le maximum est d’environ cinq octaves.',
        },
      ],
    },
    success: 'Vous savez régler une modulation à l’oreille et en chiffres.',
  },
  'modulation/modulation-routing': {
    objective: 'Router les contrôles d’expression avec les fonctions On-Key.',
    explanation: [
      'Certains routages sont sur le clavier : maintenez Function et appuyez sur une touche. Les fonctions Mod Wh et Aftertouch décident de ce que font la molette de modulation et la pression sur les touches.',
      'Par exemple, Aftertouch : Filter Freq (mi grave) permet d’appuyer plus fort sur une touche pour rendre le son plus brillant.',
    ],
    demonstration: {
      caption:
        'La molette et l’aftertouch dosent la modulation en temps réel. Ce sont des contrôles de jeu, non dessinés ici.',
    },
    experiment: {
      steps: [
        'Dans la vue matérielle, appuyez sur Function, puis sur la touche mi grave, puis utilisez ◀ ▶ pour changer la valeur.',
      ],
    },
    exercise: {
      prompt: 'Faites en sorte que la pression sur les touches ouvre fortement le filtre.',
      conditions: [
        {
          hint: 'Réglez Aftertouch : Filter Freq (Function + mi grave) sur +30 ou plus.',
        },
      ],
    },
    success: 'Vous avez routé un contrôle d’expression.',
  },
  'modulation/modulation-destinations': {
    objective: 'Savoir quelle source de modulation atteint quelle destination.',
    explanation: [
      'Sur le panneau : LFO 1 → hauteur des oscillateurs, LFO 2 → fréquence du filtre et largeur d’impulsion, Mod Env → hauteur, largeur d’impulsion et filtre.',
      'Osc Filter Mod est un cas à part : Osc 2 module le filtre à fréquence audio.',
    ],
    demonstration: {
      caption: 'Chaque LFO avec sa propre destination.',
    },
    experiment: {
      steps: [
        'Ouvrez la vue Référence, Commandes du panneau, et trouvez la cible de chaque commande de profondeur.',
      ],
    },
    exercise: {
      prompt: 'Quel LFO module la fréquence du filtre depuis le panneau ?',
      options: [
        {
          label: 'LFO 1',
          feedback: 'Le LFO 1 est relié à la hauteur des oscillateurs.',
        },
        {
          label: 'LFO 2',
          feedback: 'Exact : le potentiomètre LFO 2 depth du filtre.',
        },
        {
          label: 'Les deux',
          feedback: 'Seul le LFO 2 sert à moduler le filtre (p. 41).',
        },
      ],
    },
    success: 'Vous connaissez la carte des modulations du Bass Station II.',
  },
  'performance/arpeggiator': {
    objective: 'Transformer des accords en motifs avec l’arpégiateur.',
    explanation: [
      'L’arpégiateur joue les notes tenues une par une. Arp Mode règle l’ordre, Arp Octaves répète le motif plus haut, Rhythm choisit l’un des 32 motifs et Tempo règle la vitesse.',
      'Latch fait continuer le motif après le relâchement des touches.',
    ],
    demonstration: {
      caption: 'UpDn sur deux octaves avec un accord de do majeur.',
    },
    experiment: {
      steps: ['Changez Arp Mode et Octaves et regardez l’ordre des notes.'],
    },
    exercise: {
      prompt: 'Réglez l’arpégiateur pour monter et descendre sur deux octaves.',
      conditions: [
        {
          hint: 'Activez l’arpégiateur.',
        },
        {
          hint: 'Mettez Arp Mode sur UpDn.',
        },
        {
          hint: 'Mettez Arp Octaves sur 2.',
        },
      ],
    },
    success: 'Vous avez programmé un arpège.',
  },
  'performance/sequencer': {
    objective: 'Comprendre le séquenceur 32 pas intégré.',
    explanation: [
      'Passez Arp Mode sur Record et jouez des notes (Rest insère un silence, Legato lie les notes). Le mode Play rejoue ensuite la séquence, transposée selon la touche tenue.',
      'Quatre séquences sont mémorisées, choisies avec la commande SEQ (Arp Octaves). Rhythm fixe toujours le placement. Seq Retrig recale la séquence toutes les deux mesures.',
    ],
    demonstration: {
      caption: 'En Record et Play, le placement vient du motif Rhythm.',
    },
    experiment: {
      steps: ['Mettez Arp Mode sur Record et remarquez qu’Arp Octaves modifie maintenant SEQ.'],
    },
    exercise: {
      prompt: 'Combien de notes ou de silences une séquence peut-elle contenir ?',
      options: [
        {
          label: '8',
          feedback:
            'Huit est la longueur du plus court motif rythmique, pas la capacité d’une séquence.',
        },
        {
          label: '16',
          feedback: 'Les séquences peuvent dépasser 16 pas.',
        },
        {
          label: '32',
          feedback: 'Exact : jusqu’à 32 notes ou silences par séquence.',
        },
        {
          label: 'Illimité',
          feedback: 'La mémoire est limitée à 32 pas.',
        },
      ],
    },
    success: 'Vous savez comment le séquenceur est organisé.',
  },
  'performance/glide': {
    objective: 'Glisser entre les notes avec le portamento.',
    explanation: [
      'Glide Time fait glisser la hauteur de la note précédente vers la nouvelle. Tourné à fond à gauche, il est désactivé.',
      'Avec Triggering sur Autoglide, seules les notes qui se chevauchent (legato) glissent, idéal pour des lignes de basse expressives.',
    ],
    demonstration: {
      caption: 'La hauteur glisse d’une octave vers le haut.',
    },
    experiment: {
      steps: [
        'Montez Glide Time et regardez le glissement s’allonger.',
        'Ajoutez Glide Divergence (Function + touche Input Gain, deux fois) pour qu’Osc 2 suive en retard.',
      ],
    },
    exercise: {
      prompt: 'Mettez en place un glide qui n’agit qu’en jeu legato.',
      conditions: [
        {
          hint: 'Montez Glide Time à au moins 40.',
        },
        {
          hint: 'Mettez le switch Triggering de l’Amp Env sur Autoglide.',
        },
      ],
    },
    success: 'Vous savez glisser entre les notes.',
  },
  'performance/keyboard-controls': {
    objective: 'Décaler la tessiture du clavier avec Octave et Transpose.',
    explanation: [
      'Vingt-cinq touches couvrent deux octaves. Les boutons Octave les décalent de −4 à +5 octaves (appuyez sur les deux pour réinitialiser), et Transpose décale par demi-tons par rapport au do central.',
      'Transposer permet de jouer un morceau dans une autre tonalité avec le même doigté.',
    ],
    demonstration: {
      caption: 'Octave −1 : le clavier descend de douze demi-tons.',
    },
    experiment: {
      steps: [
        'Utilisez les boutons Octave dans la vue matérielle.',
        'Appuyez sur Transpose, puis sur une touche.',
      ],
    },
    exercise: {
      prompt: 'Descendez le clavier d’une octave pour jouer des basses.',
      conditions: [
        {
          hint: 'Appuyez une fois sur Octave ◀ (octave −1).',
        },
      ],
    },
    success: 'Vous pouvez atteindre n’importe quel registre.',
  },
  'performance/performance-features': {
    objective: 'Ajouter la sensibilité au toucher avec la vélocité.',
    explanation: [
      'La vélocité est la force avec laquelle vous frappez une touche. Velocity : Amp Env (Function + D# aigu) rend le jeu plus fort quand vous appuyez plus fort, et le manuel conseille environ +40 pour un toucher naturel. Velocity : Mod Env fait de même pour tout ce que contrôle la Mod Env.',
      'Associée à l’aftertouch et aux molettes, elle rend le synthé sensible à votre jeu.',
    ],
    demonstration: {
      caption: 'La vélocité ajuste la hauteur de cette courbe à chaque note.',
    },
    experiment: {
      steps: ['Dans la vue matérielle, appuyez sur Function, puis D# aigu, puis utilisez ◀ ▶.'],
    },
    exercise: {
      prompt: 'Donnez au synthé une réponse naturelle au toucher sur le volume.',
      conditions: [
        {
          hint: 'Réglez Velocity : Amp Env entre +30 et +50 (Function + D# aigu).',
        },
      ],
    },
    success: 'La dynamique de votre jeu façonne maintenant le son.',
  },
  'sound-design/bass-sounds': {
    objective: 'Combiner oscillateurs, sub, filtre et enveloppe pour une basse solide.',
    explanation: [
      'Une basse classique part d’une dent de scie avec un sub-oscillateur en dessous, un filtre passe-bas assez fermé et une enveloppe serrée (attaque rapide, release court).',
      'Tout ce que vous avez appris se rejoint ici.',
    ],
    demonstration: {
      caption: 'Les harmoniques graves dominent et les aigus sont atténués.',
    },
    experiment: {
      steps: ['Partez de l’Init, ajoutez le sub, fermez le filtre, resserrez l’enveloppe.'],
    },
    exercise: {
      prompt: 'Construisez un patch de sub-basse classique.',
      conditions: [
        {
          hint: 'Osc 1 en dent de scie.',
        },
        {
          hint: 'Niveau du Sub d’au moins 150.',
        },
        {
          hint: 'Fermez le filtre (Frequency ≤ 110).',
        },
        {
          hint: 'Attaque immédiate (≤ 5).',
        },
        {
          hint: 'Release court (≤ 30) pour garder des notes serrées.',
        },
      ],
    },
    success: 'Vous avez créé une basse de zéro.',
  },
  'sound-design/leads': {
    objective: 'Créer un lead expressif avec désaccord, glide et vibrato retardé.',
    explanation: [
      'Un lead doit percer : deux oscillateurs désaccordés, un peu de glide entre les notes et un vibrato qui apparaît après le début de la note (LFO 1 Delay).',
      'Le vibrato retardé, c’est la façon dont chanteurs et instrumentistes à cordes phrasent les notes longues.',
    ],
    demonstration: {
      caption: 'Le LFO 1 apparaît progressivement après l’appui sur la touche (delay).',
    },
    experiment: {
      steps: [
        'Désaccordez Osc 2, ajoutez du glide, puis réglez le délai du LFO 1 avec le switch Delay/Speed.',
      ],
    },
    exercise: {
      prompt: 'Construisez un lead : oscillateurs désaccordés, glide et vibrato retardé.',
      conditions: [
        {
          hint: 'Montez Osc 2 (≥ 150).',
        },
        {
          hint: 'Désaccordez Fine d’Osc 2 de +5 à +25 cents.',
        },
        {
          hint: 'Ajoutez un peu de glide (≥ 20).',
        },
        {
          hint: 'Un peu de LFO 1 sur la hauteur d’Osc 1 (2–10).',
        },
        {
          hint: 'Délai du LFO 1 ≥ 30 pour que le vibrato apparaisse progressivement.',
        },
      ],
    },
    success: 'Vous avez créé un lead qui chante.',
  },
  'sound-design/pads': {
    objective: 'Créer une nappe lente et large.',
    explanation: [
      'Les nappes gonflent et s’éteignent lentement : elles demandent une attaque et un release longs. Des oscillateurs désaccordés et un léger mouvement les gardent vivantes.',
      'Même sur un synthé monophonique, les nappes sont superbes pour des bourdons et des lignes lentes.',
    ],
    demonstration: {
      caption: 'Attaque lente et release long.',
    },
    experiment: {
      steps: [
        'Allongez l’attaque et le release, désaccordez Osc 2, ajoutez un mouvement lent du LFO 2 sur le filtre.',
      ],
    },
    exercise: {
      prompt: 'Créez une nappe qui gonfle et s’attarde.',
      conditions: [
        {
          hint: 'Attaque ≥ 80.',
        },
        {
          hint: 'Release ≥ 80.',
        },
        {
          hint: 'Niveau d’Osc 2 ≥ 100.',
        },
        {
          hint: 'Désaccordez Osc 2 de plus de 4 cents (dans un sens ou dans l’autre).',
        },
      ],
    },
    success: 'Vous avez créé une nappe évolutive.',
  },
  'sound-design/layering': {
    objective: 'Comprendre pourquoi des sources superposées et désaccordées sonnent plus gros.',
    explanation: [
      'Deux sources presque à la même hauteur interfèrent : leur somme gonfle et se creuse à mesure qu’elles entrent et sortent de phase. On l’entend comme de la largeur et du mouvement.',
      'Superposer des octaves (Range ou sub) ajoute du poids et de la brillance. Superposer des intervalles (Coarse) ajoute de l’harmonie.',
    ],
    demonstration: {
      caption: 'Osc 1, Osc 2 légèrement désaccordé et un sub, additionnés.',
    },
    experiment: {
      steps: ['Combinez Osc 1, Osc 2 et Sub dans différentes proportions.'],
    },
    exercise: {
      prompt:
        'Pourquoi désaccorder légèrement Osc 2 par rapport à Osc 1 rend-il le son plus large ?',
      options: [
        {
          label: 'Les ondes entrent et sortent de phase, ce qui crée un battement lent',
          feedback: 'Exact : cette dérive de phase s’entend comme un mouvement façon chorus.',
        },
        {
          label: 'Ça rend le son plus fort',
          feedback: 'Le volume change à peine. C’est le mouvement qui compte.',
        },
        {
          label: 'Ça retire des harmoniques',
          feedback: 'Désaccorder ajoute de la complexité. Ça ne filtre pas.',
        },
        {
          label: 'Ça décale le son d’une octave',
          feedback: 'Quelques cents, c’est bien moins qu’une octave (1200 cents).',
        },
      ],
    },
    success: 'Vous comprenez pourquoi la superposition fonctionne.',
  },
  'sound-design/original-presets': {
    objective: 'Créer un son original et l’enregistrer.',
    explanation: [
      'En création sonore, il n’y a pas une seule bonne réponse. Partez de l’Init Patch, changez quelque chose, regardez et écoutez ce que ça fait, et continuez.',
      'Quand le résultat vous plaît, enregistrez-le dans la bibliothèque de sons avec un nom et une description pour vous souvenir de comment il a été fait.',
    ],
    demonstration: {
      caption: 'Un point de départ possible. Le vôtre sera différent.',
    },
    experiment: {
      steps: [
        'Utilisez la vue matérielle ou la vue pédagogique pour modifier les paramètres de votre choix.',
      ],
    },
    exercise: {
      prompt:
        'Modifiez au moins 8 paramètres de son par rapport à l’Init Patch pour créer votre propre son.',
    },
    success: 'Vous avez créé un son original. Enregistrez-le dans la bibliothèque de sons.',
  },
};
