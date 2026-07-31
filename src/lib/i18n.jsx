import { createContext, useContext, useState, useEffect } from 'react';

export const LANGUAGES = [
  { code: 'pt-BR', label: 'Português (BR)', flag: '🇧🇷', short: 'PT' },
  { code: 'en', label: 'English', flag: '🇺🇸', short: 'EN' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', short: 'FR' },
  { code: 'es', label: 'Español', flag: '🇪🇸', short: 'ES' },
];

export const translations = {
  'pt-BR': {
    // Header & Footer
    appTitle: 'Guitar Harmony Study',
    appSubtitle: 'Estudo de Harmonia Funcional no Braço do Violão',
    footerNav: 'Use {left} {right} para navegar entre graus',

    // Modes
    modeChord: 'Acordes',
    modeSolfejo: 'Solfejo',
    modeArpejo: 'Arpejo',
    studyModeGroupLabel: 'Modo de estudo',

    // Voicing Bar
    bassStringLabel: 'Baixo na corda',
    bassToneLabel: 'Grau no baixo',
    voicingUnavailable: 'Sem forma digitável nesta combinação',
    stringNumLabel: '{num}ª corda',
    stringAriaLabel: 'Baixo na {num}ª corda',

    // Degree Names
    degree_1: 'Tônica',
    degree_2: 'Supertônica',
    degree_3: 'Mediante',
    degree_4: 'Subdominante',
    degree_5: 'Dominante',
    degree_6: 'Superdominante',
    degree_7: 'Sensível',

    // Scale Types
    scale_major: 'Maior',
    scale_minorNatural: 'Menor natural',
    scale_minorHarmonic: 'Menor harmônica',
    scale_minorMelodic: 'Menor melódica',

    // Greek Modes
    mode_major_1: 'Jônio (Maior)',
    mode_major_2: 'Dórico',
    mode_major_3: 'Frígio',
    mode_major_4: 'Lídio',
    mode_major_5: 'Mixolídio',
    mode_major_6: 'Eólio (Menor)',
    mode_major_7: 'Lócrio',

    mode_minorNatural_1: 'Eólio (Menor natural)',
    mode_minorNatural_2: 'Lócrio',
    mode_minorNatural_3: 'Jônio',
    mode_minorNatural_4: 'Dórico',
    mode_minorNatural_5: 'Frígio',
    mode_minorNatural_6: 'Lídio',
    mode_minorNatural_7: 'Mixolídio',

    mode_minorHarmonic_1: 'Menor harmônica',
    mode_minorHarmonic_2: 'Lócrio ♮6',
    mode_minorHarmonic_3: 'Jônio ♯5',
    mode_minorHarmonic_4: 'Dórico ♯4',
    mode_minorHarmonic_5: 'Frígio dominante',
    mode_minorHarmonic_6: 'Lídio ♯2',
    mode_minorHarmonic_7: 'Superlócrio ♭♭7',

    mode_minorMelodic_1: 'Menor melódica',
    mode_minorMelodic_2: 'Dórico ♭2',
    mode_minorMelodic_3: 'Lídio ♯5',
    mode_minorMelodic_4: 'Lídio dominante',
    mode_minorMelodic_5: 'Mixolídio ♭6',
    mode_minorMelodic_6: 'Lócrio ♮2',
    mode_minorMelodic_7: 'Superlócrio (alterada)',

    // Tetrad Names
    tetrad_maj7: 'Maior com sétima maior',
    tetrad_m7: 'Menor com sétima menor',
    tetrad_7: 'Dominante (sétima menor)',
    tetrad_m7_b5: 'Meio-diminuto',
    tetrad_dim7: 'Diminuto (sétima diminuta)',
    tetrad_m_maj7: 'Menor com sétima maior',
    tetrad_maj7_sharp5: 'Maior com sétima maior e quinta aumentada',

    // Intervals
    interval_root: 'Tônica (1)',
    interval_third: 'Terça (3)',
    interval_fifth: 'Quinta (5)',
    interval_seventh: 'Sétima (7)',

    // Inversions / Hints
    hint_root: 'Fundamental',
    hint_inv1: '1ª inv. (Terça no baixo)',
    hint_inv2: '2ª inv. (Quinta no baixo)',
    hint_inv3: '3ª inv. (Sétima no baixo)',

    // Voicing Families
    family_drop2: 'Drop-2 em cordas fechadas',
    family_drop3: 'Drop-3 com baixo solto',
    family_drop24: 'Drop-2 e 4 estendido',

    // ChordInfo
    playChord: 'Tocar este acorde',
    playChordAria: 'Tocar o acorde {chord}',
    degreeBadge: 'Grau {degree}',
    keyContext: 'em {tonality}',
    spanWarning: 'Abertura de {span} trastes — excede o máximo de 5 casas. Este acorde não é executável nesta disposição.',
    spanInfo: 'Abertura: {span} {unit}',
    fretSingular: 'traste',
    fretPlural: 'trastes',
    chordVoicesTitle: 'Vozes do Acorde (clique para ouvir a nota)',
    listenNote: 'Ouvir {note}',
    voiceFret: 'Traste {fret}',
    voiceStringNum: '{num}ª corda',

    // SolfejoInfo
    scaleInRoot: 'Escala em {root}',
    playSolfejo: 'Tocar Solfejo',
    playing: 'Tocando…',
    solfejoDescription: '2 oitavas iniciando na nota {root} (Grau {roman} do campo harmônico de {tonality}). Clique nas notas no braço ou no botão de som para ouvir.',
    solfejoSeqTitle: 'Sequência do Solfejo (15 notas • 2 Oitavas)',
    stepNumTitle: 'Passo {num}: {note} (Corda {string}, Traste {fret})',

    // ArpejoInfo
    arpejoTitle: 'Arpejo de {chord}',
    playArpejo: 'Tocar Arpejo',
    tetradLabel: 'Tétrade (1 • 3 • 5 • 7)',
    arpejoDescription: 'Tônica, Terça, Quinta e Sétima ascendentes em 2 oitavas a partir da nota mais grave ({root}). Clique em qualquer nota no braço ou no botão de som para ouvir.',
    arpejoNotesTitle: 'Notas do Arpejo (Tétrade asc.)',
    arpejoStepTitle: 'Passo {num}: {note} ({label}) - Corda {string}, Traste {fret}',

    // Navigation & Control Bar
    harmonicFieldTitle: 'Campo Harmônico de {tonality}',
    harmonicFieldGroup: 'Grau do campo harmônico',
    prevDegree: 'Grau anterior',
    nextDegree: 'Próximo grau',

    // Circle of Fifths & Tonality FAB
    tonalityFabLabel: 'Tonalidade: {name}, {scale}. Tocar para trocar.',
    selectTonalityTitle: 'Escolher tonalidade',
    circleAriaGroup: 'Tonalidade. Setas esquerda e direita percorrem as quintas, para cima e para baixo alternam maior e menor relativa, teclas 1 a 3 escolhem a forma do menor.',
    circleSpokeGroup: 'Tônica e modo',
    circleFormGroup: 'Forma do menor',
    formToRelative: '(leva à relativa menor)',
    majorLabelSuffix: 'maior',
    minorLabelSuffix: 'menor',

    // Fretboard
    fretboardAria: 'Braço do violão com {count} casas',
    noteOnFret: 'Tocar nota {note} (Corda {string}, Traste {fret})',
    fretNum: 'Traste {fret}',
  },

  'en': {
    // Header & Footer
    appTitle: 'Guitar Harmony Study',
    appSubtitle: 'Functional Harmony Study on the Guitar Fretboard',
    footerNav: 'Use {left} {right} to navigate degrees',

    // Modes
    modeChord: 'Chords',
    modeSolfejo: 'Solfège',
    modeArpejo: 'Arpeggio',
    studyModeGroupLabel: 'Study mode',

    // Voicing Bar
    bassStringLabel: 'Bass on string',
    bassToneLabel: 'Bass degree',
    voicingUnavailable: 'No playable shape in this combination',
    stringNumLabel: 'String {num}',
    stringAriaLabel: 'Bass on string {num}',

    // Degree Names
    degree_1: 'Tonic',
    degree_2: 'Supertonic',
    degree_3: 'Mediant',
    degree_4: 'Subdominant',
    degree_5: 'Dominant',
    degree_6: 'Submediant',
    degree_7: 'Leading Tone',

    // Scale Types
    scale_major: 'Major',
    scale_minorNatural: 'Natural minor',
    scale_minorHarmonic: 'Harmonic minor',
    scale_minorMelodic: 'Melodic minor',

    // Greek Modes
    mode_major_1: 'Ionian (Major)',
    mode_major_2: 'Dorian',
    mode_major_3: 'Phrygian',
    mode_major_4: 'Lydian',
    mode_major_5: 'Mixolydian',
    mode_major_6: 'Aeolian (Minor)',
    mode_major_7: 'Locrian',

    mode_minorNatural_1: 'Aeolian (Natural minor)',
    mode_minorNatural_2: 'Locrian',
    mode_minorNatural_3: 'Ionian',
    mode_minorNatural_4: 'Dorian',
    mode_minorNatural_5: 'Phrygian',
    mode_minorNatural_6: 'Lydian',
    mode_minorNatural_7: 'Mixolydian',

    mode_minorHarmonic_1: 'Harmonic minor',
    mode_minorHarmonic_2: 'Locrian ♮6',
    mode_minorHarmonic_3: 'Ionian ♯5',
    mode_minorHarmonic_4: 'Dorian ♯4',
    mode_minorHarmonic_5: 'Phrygian dominant',
    mode_minorHarmonic_6: 'Lydian ♯2',
    mode_minorHarmonic_7: 'Superlocrian ♭♭7',

    mode_minorMelodic_1: 'Melodic minor',
    mode_minorMelodic_2: 'Dorian ♭2',
    mode_minorMelodic_3: 'Lydian ♯5',
    mode_minorMelodic_4: 'Lydian dominant',
    mode_minorMelodic_5: 'Mixolydian ♭6',
    mode_minorMelodic_6: 'Locrian ♮2',
    mode_minorMelodic_7: 'Superlocrian (altered)',

    // Tetrad Names
    tetrad_maj7: 'Major 7th',
    tetrad_m7: 'Minor 7th',
    tetrad_7: 'Dominant 7th',
    tetrad_m7_b5: 'Half-diminished',
    tetrad_dim7: 'Diminished 7th',
    tetrad_m_maj7: 'Minor major 7th',
    tetrad_maj7_sharp5: 'Major 7th sharp 5th',

    // Intervals
    interval_root: 'Root (1)',
    interval_third: 'Third (3)',
    interval_fifth: 'Fifth (5)',
    interval_seventh: 'Seventh (7)',

    // Inversions / Hints
    hint_root: 'Root position',
    hint_inv1: '1st inv. (Third in bass)',
    hint_inv2: '2nd inv. (Fifth in bass)',
    hint_inv3: '3rd inv. (Seventh in bass)',

    // Voicing Families
    family_drop2: 'Drop-2 on closed strings',
    family_drop3: 'Drop-3 with open bass',
    family_drop24: 'Extended Drop-2 & 4',

    // ChordInfo
    playChord: 'Play this chord',
    playChordAria: 'Play chord {chord}',
    degreeBadge: 'Degree {degree}',
    keyContext: 'in {tonality}',
    spanWarning: 'Fret span of {span} frets — exceeds the 5-fret limit. This voicing is unplayable.',
    spanInfo: 'Span: {span} {unit}',
    fretSingular: 'fret',
    fretPlural: 'frets',
    chordVoicesTitle: 'Chord Voices (click to hear note)',
    listenNote: 'Listen to {note}',
    voiceFret: 'Fret {fret}',
    voiceStringNum: 'String {num}',

    // SolfejoInfo
    scaleInRoot: 'Scale in {root}',
    playSolfejo: 'Play Solfège',
    playing: 'Playing…',
    solfejoDescription: '2 octaves starting on {root} (Degree {roman} of {tonality}). Click notes on fretboard or play button to listen.',
    solfejoSeqTitle: 'Solfège Sequence (15 notes • 2 Octaves)',
    stepNumTitle: 'Step {num}: {note} (String {string}, Fret {fret})',

    // ArpejoInfo
    arpejoTitle: 'Arpeggio of {chord}',
    playArpejo: 'Play Arpeggio',
    tetradLabel: 'Tetrad (1 • 3 • 5 • 7)',
    arpejoDescription: 'Ascending Root, Third, Fifth, and Seventh across 2 octaves starting from the lowest note ({root}). Click notes to listen.',
    arpejoNotesTitle: 'Arpeggio Notes (Ascending Tetrad)',
    arpejoStepTitle: 'Step {num}: {note} ({label}) - String {string}, Fret {fret}',

    // Navigation & Control Bar
    harmonicFieldTitle: 'Harmonic Field of {tonality}',
    harmonicFieldGroup: 'Degree of harmonic field',
    prevDegree: 'Previous degree',
    nextDegree: 'Next degree',

    // Circle of Fifths & Tonality FAB
    tonalityFabLabel: 'Key: {name}, {scale}. Tap to change.',
    selectTonalityTitle: 'Select Key',
    circleAriaGroup: 'Key. Left/Right arrows navigate fifths, Up/Down toggle relative major/minor, keys 1 to 3 select minor form.',
    circleSpokeGroup: 'Tonic and mode',
    circleFormGroup: 'Minor form',
    formToRelative: '(leads to relative minor)',
    majorLabelSuffix: 'major',
    minorLabelSuffix: 'minor',

    // Fretboard
    fretboardAria: 'Guitar fretboard with {count} frets',
    noteOnFret: 'Play note {note} (String {string}, Fret {fret})',
    fretNum: 'Fret {fret}',
  },

  'fr': {
    // Header & Footer
    appTitle: 'Guitar Harmony Study',
    appSubtitle: 'Étude d\'Harmonie Fonctionnelle sur la Touche de la Guitare',
    footerNav: 'Utilisez {left} {right} pour naviguer entre les degrés',

    // Modes
    modeChord: 'Accords',
    modeSolfejo: 'Solfège',
    modeArpejo: 'Arpège',
    studyModeGroupLabel: 'Mode d\'étude',

    // Voicing Bar
    bassStringLabel: 'Basse sur corde',
    bassToneLabel: 'Degré à la basse',
    voicingUnavailable: 'Aucune forme jouable dans cette combinaison',
    stringNumLabel: '{num}e corde',
    stringAriaLabel: 'Basse sur la {num}e corde',

    // Degree Names
    degree_1: 'Tonique',
    degree_2: 'Sus-tonique',
    degree_3: 'Médiante',
    degree_4: 'Sous-dominante',
    degree_5: 'Dominante',
    degree_6: 'Sus-dominante',
    degree_7: 'Sensible',

    // Scale Types
    scale_major: 'Majeure',
    scale_minorNatural: 'Mineure naturelle',
    scale_minorHarmonic: 'Mineure harmonique',
    scale_minorMelodic: 'Mineure mélodique',

    // Greek Modes
    mode_major_1: 'Ionien (Majeur)',
    mode_major_2: 'Dorien',
    mode_major_3: 'Phrygien',
    mode_major_4: 'Lydien',
    mode_major_5: 'Mixolydien',
    mode_major_6: 'Éolien (Mineur)',
    mode_major_7: 'Locrien',

    mode_minorNatural_1: 'Éolien (Mineure naturelle)',
    mode_minorNatural_2: 'Locrien',
    mode_minorNatural_3: 'Ionien',
    mode_minorNatural_4: 'Dorien',
    mode_minorNatural_5: 'Phrygien',
    mode_minorNatural_6: 'Lydien',
    mode_minorNatural_7: 'Mixolydien',

    mode_minorHarmonic_1: 'Mineure harmonique',
    mode_minorHarmonic_2: 'Locrien ♮6',
    mode_minorHarmonic_3: 'Ionien ♯5',
    mode_minorHarmonic_4: 'Dorien ♯4',
    mode_minorHarmonic_5: 'Phrygien dominant',
    mode_minorHarmonic_6: 'Lydien ♯2',
    mode_minorHarmonic_7: 'Superlocrien ♭♭7',

    mode_minorMelodic_1: 'Mineure mélodique',
    mode_minorMelodic_2: 'Dorien ♭2',
    mode_minorMelodic_3: 'Lydien ♯5',
    mode_minorMelodic_4: 'Lydien dominant',
    mode_minorMelodic_5: 'Mixolydien ♭6',
    mode_minorMelodic_6: 'Locrien ♮2',
    mode_minorMelodic_7: 'Superlocrien (altéré)',

    // Tetrad Names
    tetrad_maj7: 'Majeur 7e majeure',
    tetrad_m7: 'Mineur 7e mineure',
    tetrad_7: '7e de dominante',
    tetrad_m7_b5: 'Demi-diminué',
    tetrad_dim7: 'Diminué 7e diminuée',
    tetrad_m_maj7: 'Mineur 7e majeure',
    tetrad_maj7_sharp5: 'Majeur 7e majeure 5e augmentée',

    // Intervals
    interval_root: 'Tonique (1)',
    interval_third: 'Tierce (3)',
    interval_fifth: 'Quinte (5)',
    interval_seventh: 'Septième (7)',

    // Inversions / Hints
    hint_root: 'Position fondamentale',
    hint_inv1: '1er renv. (Tierce à la basse)',
    hint_inv2: '2e renv. (Quinte à la basse)',
    hint_inv3: '3e renv. (Septième à la basse)',

    // Voicing Families
    family_drop2: 'Drop-2 sur cordes fermées',
    family_drop3: 'Drop-3 avec basse ouverte',
    family_drop24: 'Drop-2 et 4 étendu',

    // ChordInfo
    playChord: 'Jouer cet accord',
    playChordAria: 'Jouer l\'accord {chord}',
    degreeBadge: 'Degré {degree}',
    keyContext: 'en {tonality}',
    spanWarning: 'Écartement de {span} cases — dépasse le maximum de 5 cases. Cet accord est injouable.',
    spanInfo: 'Écartement : {span} {unit}',
    fretSingular: 'case',
    fretPlural: 'cases',
    chordVoicesTitle: 'Voix de l\'Accord (cliquez pour écouter la note)',
    listenNote: 'Écouter {note}',
    voiceFret: 'Case {fret}',
    voiceStringNum: '{num}e corde',

    // SolfejoInfo
    scaleInRoot: 'Échelle en {root}',
    playSolfejo: 'Jouer le Solfège',
    playing: 'En lecture…',
    solfejoDescription: '2 octaves commençant sur {root} (Degré {roman} du champ harmonique de {tonality}). Cliquez sur les notes pour écouter.',
    solfejoSeqTitle: 'Séquence du Solfège (15 notes • 2 Octaves)',
    stepNumTitle: 'Étape {num} : {note} (Corde {string}, Case {fret})',

    // ArpejoInfo
    arpejoTitle: 'Arpège de {chord}',
    playArpejo: 'Jouer l\'Arpège',
    tetradLabel: 'Tétrade (1 • 3 • 5 • 7)',
    arpejoDescription: 'Tonique, Tierce, Quinte et Septième ascendantes sur 2 octaves à partir de la note la plus grave ({root}). Cliquez sur les notes pour écouter.',
    arpejoNotesTitle: 'Notes de l\'Arpège (Tétrade asc.)',
    arpejoStepTitle: 'Étape {num} : {note} ({label}) - Corde {string}, Case {fret}',

    // Navigation & Control Bar
    harmonicFieldTitle: 'Champ Harmonique de {tonality}',
    harmonicFieldGroup: 'Degré du champ harmonique',
    prevDegree: 'Degré précédent',
    nextDegree: 'Degré suivant',

    // Circle of Fifths & Tonality FAB
    tonalityFabLabel: 'Tonalité : {name}, {scale}. Appuyer pour changer.',
    selectTonalityTitle: 'Choisir la tonalité',
    circleAriaGroup: 'Tonalité. Flèches gauche/droite parcourent les quintes, haut/bas alternent majeur et mineur relatif, touches 1 à 3 choisissent la forme mineure.',
    circleSpokeGroup: 'Tonique et mode',
    circleFormGroup: 'Forme du mineur',
    formToRelative: '(mène au mineur relatif)',
    majorLabelSuffix: 'majeur',
    minorLabelSuffix: 'mineur',

    // Fretboard
    fretboardAria: 'Touche de guitare avec {count} cases',
    noteOnFret: 'Jouer la note {note} (Corde {string}, Case {fret})',
    fretNum: 'Case {fret}',
  },

  'es': {
    // Header & Footer
    appTitle: 'Guitar Harmony Study',
    appSubtitle: 'Estudio de Armonía Funcional en el Mástil de la Guitarra',
    footerNav: 'Usa {left} {right} para navegar entre grados',

    // Modes
    modeChord: 'Acordes',
    modeSolfejo: 'Solfeo',
    modeArpejo: 'Arpegio',
    studyModeGroupLabel: 'Modo de estudio',

    // Voicing Bar
    bassStringLabel: 'Bajo en la cuerda',
    bassToneLabel: 'Grado en el bajo',
    voicingUnavailable: 'Sin forma digitable en esta combinación',
    stringNumLabel: '{num}ª cuerda',
    stringAriaLabel: 'Bajo en la {num}ª cuerda',

    // Degree Names
    degree_1: 'Tónica',
    degree_2: 'Supertónica',
    degree_3: 'Mediante',
    degree_4: 'Subdominante',
    degree_5: 'Dominante',
    degree_6: 'Superdominante',
    degree_7: 'Sensible',

    // Scale Types
    scale_major: 'Mayor',
    scale_minorNatural: 'Menor natural',
    scale_minorHarmonic: 'Menor armónica',
    scale_minorMelodic: 'Menor melódica',

    // Greek Modes
    mode_major_1: 'Jónico (Mayor)',
    mode_major_2: 'Dórico',
    mode_major_3: 'Frigio',
    mode_major_4: 'Lidio',
    mode_major_5: 'Mixolidio',
    mode_major_6: 'Eolio (Menor)',
    mode_major_7: 'Lócrio',

    mode_minorNatural_1: 'Eolio (Menor natural)',
    mode_minorNatural_2: 'Lócrio',
    mode_minorNatural_3: 'Jónico',
    mode_minorNatural_4: 'Dórico',
    mode_minorNatural_5: 'Frigio',
    mode_minorNatural_6: 'Lidio',
    mode_minorNatural_7: 'Mixolidio',

    mode_minorHarmonic_1: 'Menor armónica',
    mode_minorHarmonic_2: 'Lócrio ♮6',
    mode_minorHarmonic_3: 'Jónico ♯5',
    mode_minorHarmonic_4: 'Dórico ♯4',
    mode_minorHarmonic_5: 'Frigio dominante',
    mode_minorHarmonic_6: 'Lidio ♯2',
    mode_minorHarmonic_7: 'Superlócrio ♭♭7',

    mode_minorMelodic_1: 'Menor melódica',
    mode_minorMelodic_2: 'Dórico ♭2',
    mode_minorMelodic_3: 'Lidio ♯5',
    mode_minorMelodic_4: 'Lidio dominante',
    mode_minorMelodic_5: 'Mixolidio ♭6',
    mode_minorMelodic_6: 'Lócrio ♮2',
    mode_minorMelodic_7: 'Superlócrio (alterada)',

    // Tetrad Names
    tetrad_maj7: 'Mayor con séptima mayor',
    tetrad_m7: 'Menor con séptima menor',
    tetrad_7: 'Dominante (séptima menor)',
    tetrad_m7_b5: 'Semidiminuido',
    tetrad_dim7: 'Disminuido (séptima disminuida)',
    tetrad_m_maj7: 'Menor con séptima mayor',
    tetrad_maj7_sharp5: 'Mayor con séptima mayor y 5ª aumentada',

    // Intervals
    interval_root: 'Tónica (1)',
    interval_third: 'Tercera (3)',
    interval_fifth: 'Quinta (5)',
    interval_seventh: 'Séptima (7)',

    // Inversions / Hints
    hint_root: 'Posición fundamental',
    hint_inv1: '1ª inv. (Tercera en bajo)',
    hint_inv2: '2ª inv. (Quinta en bajo)',
    hint_inv3: '3ª inv. (Séptima en bajo)',

    // Voicing Families
    family_drop2: 'Drop-2 en cuerdas cerradas',
    family_drop3: 'Drop-3 con bajo al aire',
    family_drop24: 'Drop-2 y 4 extendido',

    // ChordInfo
    playChord: 'Tocar este acorde',
    playChordAria: 'Tocar el acorde {chord}',
    degreeBadge: 'Grado {degree}',
    keyContext: 'en {tonality}',
    spanWarning: 'Alcance de {span} trastes — excede el máximo de 5 trastes. Este acorde no es ejecutable.',
    spanInfo: 'Alcance: {span} {unit}',
    fretSingular: 'traste',
    fretPlural: 'trastes',
    chordVoicesTitle: 'Voces del Acorde (haz clic para escuchar)',
    listenNote: 'Escuchar {note}',
    voiceFret: 'Traste {fret}',
    voiceStringNum: '{num}ª cuerda',

    // SolfejoInfo
    scaleInRoot: 'Escala en {root}',
    playSolfejo: 'Tocar Solfeo',
    playing: 'Tocando…',
    solfejoDescription: '2 octavas iniciando en {root} (Grado {roman} de {tonality}). Haz clic en las notas para escuchar.',
    solfejoSeqTitle: 'Secuencia del Solfeo (15 notas • 2 Octavas)',
    stepNumTitle: 'Paso {num}: {note} (Cuerda {string}, Traste {fret})',

    // ArpejoInfo
    arpejoTitle: 'Arpegio de {chord}',
    playArpejo: 'Tocar Arpegio',
    tetradLabel: 'Tétrada (1 • 3 • 5 • 7)',
    arpejoDescription: 'Tónica, Tercera, Quinta y Séptima ascendentes en 2 octavas desde la nota más grave ({root}). Haz clic en las notas para escuchar.',
    arpejoNotesTitle: 'Notas del Arpegio (Tétrada asc.)',
    arpejoStepTitle: 'Paso {num}: {note} ({label}) - Cuerda {string}, Traste {fret}',

    // Navigation & Control Bar
    harmonicFieldTitle: 'Campo Armónico de {tonality}',
    harmonicFieldGroup: 'Grado del campo armónico',
    prevDegree: 'Grado anterior',
    nextDegree: 'Siguiente grado',

    // Circle of Fifths & Tonality FAB
    tonalityFabLabel: 'Tonalidad: {name}, {scale}. Tocar para cambiar.',
    selectTonalityTitle: 'Elegir tonalidad',
    circleAriaGroup: 'Tonalidad. Flechas izquierda/derecha recorren las quintas, arriba/abajo alternan mayor y menor relativa, teclas 1 a 3 eligen forma menor.',
    circleSpokeGroup: 'Tónica y modo',
    circleFormGroup: 'Forma del menor',
    formToRelative: '(lleva a la relativa menor)',
    majorLabelSuffix: 'mayor',
    minorLabelSuffix: 'menor',

    // Fretboard
    fretboardAria: 'Mástil de guitarra con {count} trastes',
    noteOnFret: 'Tocar nota {note} (Cuerda {string}, Traste {fret})',
    fretNum: 'Traste {fret}',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('app_lang');
    if (saved && translations[saved]) return saved;
    const browserLang = navigator.language || navigator.userLanguage || '';
    if (browserLang.startsWith('en')) return 'en';
    if (browserLang.startsWith('fr')) return 'fr';
    if (browserLang.startsWith('es')) return 'es';
    return 'pt-BR';
  });

  const setLanguage = (newLang) => {
    if (translations[newLang]) {
      setLangState(newLang);
      localStorage.setItem('app_lang', newLang);
    }
  };

  const t = (key, params = {}) => {
    const dict = translations[lang] || translations['pt-BR'];
    let text = dict[key] || translations['pt-BR'][key] || key;
    Object.keys(params).forEach(p => {
      text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
