// ============================================================
// Music Theory Engine for Guitar Harmony Study
// ============================================================

// All 12 chromatic notes (using sharps as canonical)
const CHROMATIC_SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHROMATIC_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Keys that use flats
const FLAT_KEYS = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];

// Tônicas menores que grafam com bemol. Ré/Sol/Dó/Fá menores porque seus
// relativos maiores (Fá/Sib/Mib/Láb) têm bemol; as demais porque a própria
// tônica já vem escrita com bemol na lista de tonalidades do app.
const FLAT_MINOR_TONICS = ['D', 'G', 'C', 'F', 'Bb', 'Eb'];

// Major scale intervals in semitones from root
const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

// ------------------------------------------------------------
// Campos harmônicos
// ------------------------------------------------------------
// A melódica aparece só na forma ascendente. O solfejo deste app é ascendente
// por construção e nunca desce, então a forma descendente (que é o menor
// natural) não teria onde ser usada.
export const SCALES = {
  major: {
    label: 'Maior',
    suffix: '',            // sufixo do nome da tonalidade: "F"
    intervals: [0, 2, 4, 5, 7, 9, 11],
    modes: ['Jônio (Maior)', 'Dórico', 'Frígio', 'Lídio', 'Mixolídio', 'Eólio', 'Lócrio'],
  },
  minorNatural: {
    label: 'Menor natural',
    suffix: 'm',           // "Am"
    intervals: [0, 2, 3, 5, 7, 8, 10],
    modes: ['Eólio (Menor natural)', 'Lócrio', 'Jônio', 'Dórico', 'Frígio', 'Lídio', 'Mixolídio'],
  },
  minorHarmonic: {
    label: 'Menor harmônica',
    suffix: 'm',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    modes: ['Menor harmônica', 'Lócrio ♮6', 'Jônio ♯5', 'Dórico ♯4', 'Frígio dominante', 'Lídio ♯2', 'Superlócrio ♭♭7'],
  },
  minorMelodic: {
    label: 'Menor melódica',
    suffix: 'm',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    modes: ['Menor melódica', 'Dórico ♭2', 'Lídio ♯5', 'Lídio dominante', 'Mixolídio ♭6', 'Lócrio ♮2', 'Superlócrio (alterada)'],
  },
};

/**
 * Aceita a tonalidade como string ('F' = maior, retrocompatível) ou como
 * objeto { tonic, scale }.
 */
export function normalizeTonality(key) {
  if (typeof key === 'string') return { tonic: key, scale: 'major' };
  return { tonic: key.tonic, scale: key.scale in SCALES ? key.scale : 'major' };
}

export function getScaleIntervals(key) {
  return SCALES[normalizeTonality(key).scale].intervals;
}

/** Nome da tonalidade como o estudante a lê: "F", "Am", "C#m". */
export function getTonalityName(key) {
  const { tonic, scale } = normalizeTonality(key);
  return `${tonic}${SCALES[scale].suffix}`;
}

// Trio de semitons (terça, quinta, sétima) -> tétrade. Derivar daqui em vez de
// tabelar por grau significa que a qualidade nunca discorda da escala que a
// gerou, em nenhum dos quatro campos.
const TETRAD_BY_INTERVALS = {
  '4,7,11':  { symbol: 'maj7',      triad: 'maior',       name: 'Maior com sétima maior' },
  '3,7,10':  { symbol: 'm7',        triad: 'menor',       name: 'Menor com sétima menor' },
  '4,7,10':  { symbol: '7',         triad: 'maior',       name: 'Dominante (sétima menor)' },
  '3,6,10':  { symbol: 'm7(b5)',    triad: 'diminuto',    name: 'Meio-diminuto' },
  '3,6,9':   { symbol: '°7',   triad: 'diminuto7',   name: 'Diminuto (sétima diminuta)' },
  '3,7,11':  { symbol: 'm(maj7)',   triad: 'menor',       name: 'Menor com sétima maior' },
  '4,8,11':  { symbol: 'maj7(#5)',  triad: 'aumentado',   name: 'Maior com sétima maior e quinta aumentada' },
};

const ROMAN_BASE = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

function buildRoman(degree, triad) {
  const base = ROMAN_BASE[degree - 1];
  if (triad === 'maior') return base;
  if (triad === 'aumentado') return `${base}+`;
  if (triad === 'diminuto') return `${base.toLowerCase()}ø`;      // meio-diminuto
  if (triad === 'diminuto7') return `${base.toLowerCase()}°`;     // diminuto
  return base.toLowerCase();                                           // menor
}

// Standard guitar tuning (string 6 to string 1) - MIDI note numbers
const STANDARD_TUNING = [
  { string: 6, note: 'E', octave: 2, midi: 40 },
  { string: 5, note: 'A', octave: 2, midi: 45 },
  { string: 4, note: 'D', octave: 3, midi: 50 },
  { string: 3, note: 'G', octave: 3, midi: 55 },
  { string: 2, note: 'B', octave: 3, midi: 59 },
  { string: 1, note: 'E', octave: 4, midi: 64 },
];

// Degree names in Portuguese
const DEGREE_NAMES_PT = {
  1: 'T\u00F4nica',
  2: 'Supert\u00F4nica',
  3: 'Mediante',
  4: 'Subdominante',
  5: 'Dominante',
  6: 'Superdominante',
  7: 'Sens\u00EDvel',
};

// ------------------------------------------------------------
// Variações de voicing da mesma tétrade
// ------------------------------------------------------------
// Duas dimensões que o violonista de fato usa: em qual corda cai o baixo (a
// região do braço) e qual grau está no baixo (a inversão).
//
// A tabela é enumerada, não calculada, e isso é deliberado. Uma fórmula que
// combinasse os dois eixos livremente produziria formas indigitáveis — drop-2 com
// a terça no baixo em cordas adjacentes põe 7 e 1 vizinhos, e como 7->1 é um
// semitom enquanto subir uma corda soma 5, o traste cai 4 obrigatoriamente. Aqui
// a lista É o conjunto verificado: não existe combinação inválida a alcançar.
//
// Cada entrada saiu de força bruta sobre 5 conjuntos de cordas x 24 ordens de voz
// x 4032 combinações de campo/tônica/grau, exigindo: tocável, alturas ascendentes
// do baixo ao agudo, e salto de traste para trás nunca abaixo de -2 entre cordas
// fisicamente vizinhas e ambas tocadas (corda pulada não conta — o vão é o que
// caracteriza drop-3 e não atrapalha a mão).
const VOICING_VARIATIONS = {
  6: {
    1: { strings: [6, 4, 3, 2], order: [1, 7, 3, 5], family: 'drop-3' },
    3: { strings: [6, 4, 3, 2], order: [3, 1, 5, 7], family: 'drop-3' },
    5: { strings: [6, 5, 4, 3], order: [5, 1, 3, 7], family: 'drop-2' },
    7: { strings: [6, 4, 3, 2], order: [7, 5, 1, 3], family: 'drop-3' },
  },
  5: {
    1: { strings: [5, 4, 3, 2], order: [1, 5, 7, 3], family: 'drop-2' },
    3: { strings: [5, 3, 2, 1], order: [3, 1, 5, 7], family: 'drop-3' },
    5: { strings: [5, 4, 3, 2], order: [5, 1, 3, 7], family: 'drop-2' },
    7: { strings: [5, 3, 2, 1], order: [7, 5, 1, 3], family: 'drop-3' },
  },
  4: {
    1: { strings: [4, 3, 2, 1], order: [1, 5, 7, 3], family: 'drop-2' },
    // Terça no baixo com o voicing todo nas quatro cordas agudas não tem forma
    // digitável: a melhor disponível salta -3. Ausente de propósito.
    5: { strings: [4, 3, 2, 1], order: [5, 1, 3, 7], family: 'drop-2' },
    7: { strings: [4, 3, 2, 1], order: [7, 3, 5, 1], family: 'drop-2' },
  },
};

export function getBassStringOptions() {
  return [
    { value: 6, label: '6ª' },
    { value: 5, label: '5ª' },
    { value: 4, label: '4ª' },
  ];
}

export function getBassToneOptions() {
  return [
    { value: 1, label: 'Tônica', hint: 'fundamental', hintKey: 'root' },
    { value: 3, label: 'Terça', hint: '1ª inversão', hintKey: 'inv1' },
    { value: 5, label: 'Quinta', hint: '2ª inversão', hintKey: 'inv2' },
    { value: 7, label: 'Sétima', hint: '3ª inversão', hintKey: 'inv3' },
  ];
}

/** Existe variação para esta combinação? Nem toda existe, e isso é honesto. */
export function hasVoicingVariation(bassString, bassTone) {
  return Boolean(VOICING_VARIATIONS[bassString]?.[bassTone]);
}

const FAMILY_KEYS = {
  'drop-2': 'family_drop2',
  'drop-3': 'family_drop3',
  'drop-2-4': 'family_drop24',
};

/** A família (drop-2 / drop-3) da variação ativa, para exibir ao estudante. */
export function getVoicingFamily(bassString, bassTone) {
  const family = VOICING_VARIATIONS[bassString]?.[bassTone]?.family;
  return FAMILY_KEYS[family] || family || '';
}

/**
 * Monta a configuração de vozes da variação escolhida.
 * @param {number} bassString - 6, 5 ou 4: onde cai a voz mais grave
 * @param {number} bassTone - 1, 3, 5 ou 7: qual grau está no baixo
 */
export function buildVoicingConfig(bassString, bassTone) {
  const v = VOICING_VARIATIONS[bassString]?.[bassTone]
    || VOICING_VARIATIONS[bassString]?.[1]
    || VOICING_VARIATIONS[6][1];
  return v.order.map((chordTone, i) => ({ string: v.strings[i], chordTone }));
}

// Chord tone labels
const CHORD_TONE_LABELS = {
  1: 'T\u00F4nica (1)',
  3: 'Ter\u00E7a (3)',
  5: 'Quinta (5)',
  7: 'S\u00E9tima (7)',
};

export function noteToIndex(note) {
  let idx = CHROMATIC_SHARPS.indexOf(note);
  if (idx === -1) idx = CHROMATIC_FLATS.indexOf(note);
  return idx;
}

export function usesFlats(key) {
  const { tonic, scale } = normalizeTonality(key);
  // A armadura de um campo menor é a do seu relativo maior: Ré menor grafa como
  // Fá maior (bemóis), Lá menor como Dó maior (sem acidente).
  if (scale === 'major') return FLAT_KEYS.includes(tonic);
  return FLAT_MINOR_TONICS.includes(tonic);
}

export function indexToNote(index, key) {
  const normalized = ((index % 12) + 12) % 12;
  if (usesFlats(key)) {
    return CHROMATIC_FLATS[normalized];
  }
  return CHROMATIC_SHARPS[normalized];
}

export function getScaleNotes(key) {
  const { tonic } = normalizeTonality(key);
  const rootIdx = noteToIndex(tonic);
  if (rootIdx === -1) return [];
  return getScaleIntervals(key).map(interval => indexToNote(rootIdx + interval, key));
}

/** Mantido para quem só quer a escala maior de uma tônica. */
export function getMajorScale(root) {
  return MAJOR_SCALE_INTERVALS.map(i => indexToNote(noteToIndex(root) + i, root));
}

export function getScaleDegreeNote(key, degree) {
  const notes = getScaleNotes(key);
  const normalizedDegree = ((degree - 1) % 7 + 7) % 7;
  return notes[normalizedDegree];
}

export function getActualScaleDegree(currentDegree, chordTone) {
  const offset = chordTone - 1;
  return ((currentDegree - 1 + offset) % 7) + 1;
}

export function getChordToneNote(key, currentDegree, chordTone) {
  const actualDegree = getActualScaleDegree(currentDegree, chordTone);
  return getScaleDegreeNote(key, actualDegree);
}

export function getInterval(noteA, noteB) {
  const idxA = noteToIndex(noteA);
  const idxB = noteToIndex(noteB);
  return ((idxB - idxA) % 12 + 12) % 12;
}

export function getIntervalName(semitones) {
  const names = {
    0: 'Un\u00EDssono',
    1: '2\u00AA menor',
    2: '2\u00AA maior',
    3: '3\u00AA menor',
    4: '3\u00AA maior',
    5: '4\u00AA justa',
    6: 'Tr\u00EDtono',
    7: '5\u00AA justa',
    8: '5\u00AA aum / 6\u00AA menor',
    9: '6\u00AA maior',
    10: '7\u00AA menor',
    11: '7\u00AA maior',
  };
  return names[((semitones % 12) + 12) % 12] || '';
}

export function analyzeChordQuality(key, degree, lang = 'pt-BR') {
  const dict = translations[lang] || translations['pt-BR'];
  const root = getScaleDegreeNote(key, degree);
  const third = getChordToneNote(key, degree, 3);
  const fifth = getChordToneNote(key, degree, 5);
  const seventh = getChordToneNote(key, degree, 7);

  const i3 = getInterval(root, third);
  const i5 = getInterval(root, fifth);
  const i7 = getInterval(root, seventh);

  const norm = ((degree - 1) % 7 + 7) % 7 + 1;
  const tetrad = TETRAD_BY_INTERVALS[`${i3},${i5},${i7}`]
    || { symbol: '?', triad: 'menor', name: 'Tétrade fora do catálogo' };

  let tetradTranslationKey = '';
  if (tetrad.symbol === 'maj7') tetradTranslationKey = 'tetrad_maj7';
  else if (tetrad.symbol === 'm7') tetradTranslationKey = 'tetrad_m7';
  else if (tetrad.symbol === '7') tetradTranslationKey = 'tetrad_7';
  else if (tetrad.symbol === 'm7(b5)') tetradTranslationKey = 'tetrad_m7_b5';
  else if (tetrad.symbol === '°7') tetradTranslationKey = 'tetrad_dim7';
  else if (tetrad.symbol === 'm(maj7)') tetradTranslationKey = 'tetrad_m_maj7';
  else if (tetrad.symbol === 'maj7(#5)') tetradTranslationKey = 'tetrad_maj7_sharp5';

  const translatedName = dict[tetradTranslationKey] || tetrad.name;

  return {
    root, third, fifth, seventh,
    intervals: { third: i3, fifth: i5, seventh: i7 },
    symbol: tetrad.symbol,
    name: translatedName,
    roman: buildRoman(norm, tetrad.triad),
    triad: tetrad.triad,
  };
}

export function getChordName(key, degree) {
  const quality = analyzeChordQuality(key, degree);
  return `${quality.root}${quality.symbol}`;
}

export function findFretPosition(stringNumber, targetNote) {
  const stringInfo = STANDARD_TUNING.find(s => s.string === stringNumber);
  if (!stringInfo) return null;

  const openNoteIdx = noteToIndex(stringInfo.note);
  const targetIdx = noteToIndex(targetNote);
  if (openNoteIdx === -1 || targetIdx === -1) return null;

  const fret = ((targetIdx - openNoteIdx) % 12 + 12) % 12;
  return fret <= 17 ? fret : null;
}

export function findAllFretPositions(stringNumber, targetNote) {
  const stringInfo = STANDARD_TUNING.find(s => s.string === stringNumber);
  if (!stringInfo) return [];

  const openNoteIdx = noteToIndex(stringInfo.note);
  const targetIdx = noteToIndex(targetNote);
  if (openNoteIdx === -1 || targetIdx === -1) return [];

  const positions = [];
  const baseFret = ((targetIdx - openNoteIdx) % 12 + 12) % 12;
  for (let f = baseFret; f <= 17; f += 12) {
    positions.push(f);
  }
  return positions;
}

// Maximum fret span that a hand can cover (5 frets)
const MAX_FRET_SPAN = 5;

/**
 * Find the best combination of fret positions that minimizes the span
 * across all notes. Includes open strings (fret 0) in the span calculation
 * so voicings stay compact — e.g. fret 12 is preferred over fret 0 when
 * other notes are near the 12th fret.
 *
 * @param {Array<number[]>} positionsPerVoice - Array of possible fret positions per voice
 * @returns {{ positions: number[], span: number, playable: boolean }}
 */
function findBestFretCombination(positionsPerVoice) {
  let bestCombo = null;
  let bestSpan = Infinity;
  let bestAvg = Infinity;

  function search(index, current) {
    if (index === positionsPerVoice.length) {
      // Calculate span across ALL positions (including open strings)
      // to keep voicings compact and equidistant
      const span = Math.max(...current) - Math.min(...current);
      const avg = current.reduce((s, v) => s + v, 0) / current.length;

      // Prefer: smallest span first, then lowest average position
      if (span < bestSpan || (span === bestSpan && avg < bestAvg)) {
        bestCombo = [...current];
        bestSpan = span;
        bestAvg = avg;
      }
      return;
    }

    for (const pos of positionsPerVoice[index]) {
      current.push(pos);
      search(index + 1, current);
      current.pop();
    }
  }

  search(0, []);

  return {
    positions: bestCombo,
    span: bestSpan,
    playable: bestSpan <= MAX_FRET_SPAN,
  };
}

/**
 * Build a complete voicing for a chord at a given degree.
 * Optimizes fret positions so that all fretted notes fit within MAX_FRET_SPAN.
 * Open strings (fret 0) are excluded from span calculation since they
 * don't require a finger.
 *
 * @param {string} key - The key (e.g., 'F')
 * @param {number} degree - Current scale degree (1-7)
 * @param {Array<{string: number, chordTone: number}>} voicingConfig
 * @returns {{ voices: Array, span: number, playable: boolean }}
 */
export function buildVoicing(key, degree, voicingConfig) {
  const root = getScaleDegreeNote(key, degree);

  // 1. Resolve each voice's note and all possible fret positions
  const voiceData = voicingConfig.map(({ string, chordTone }) => {
    const note = getChordToneNote(key, degree, chordTone);
    const positions = findAllFretPositions(string, note);
    const semitones = getInterval(root, note);
    const intervalName = getIntervalName(semitones);
    return { string, chordTone, note, positions, semitones, intervalName };
  });

  // 2. Find optimal fret combination
  const positionsPerVoice = voiceData.map(v => v.positions);
  const { positions: bestPositions, span, playable } = findBestFretCombination(positionsPerVoice);

  // 3. Build result with optimal positions
  const voices = voiceData.map((v, i) => ({
    string: v.string,
    chordTone: v.chordTone,
    chordToneLabel: CHORD_TONE_LABELS[v.chordTone],
    note: v.note,
    fret: bestPositions ? bestPositions[i] : v.positions[0],
    intervalName: v.intervalName,
    semitones: v.semitones,
  }));

  return { voices, span, playable };
}

// Strict 3-Notes-Per-String layout maps (15 steps = 5 strings x 3 notes/string)
const STRICT_3NPS_MAP_6 = [6,6,6, 5,5,5, 4,4,4, 3,3,3, 2,2,2];
const STRICT_3NPS_MAP_5 = [5,5,5, 4,4,4, 3,3,3, 2,2,2, 1,1,1];

/**
 * Generate a 2-octave scale starting from the root note of scale degree `degree` (1-7)
 * aligned with the position/frets of the active chord voicing using a strict 3-notes-per-string (3NPS) pattern.
 * Guaranteed to have exactly 3 notes per string without any string having 4 notes.
 *
 * @param {string} key - Parent key (e.g. 'F', 'B')
 * @param {number} degree - Degree root to start from (1-7, default 1)
 * @param {Array<{ string: number, fret: number }>} [voicing] - Active chord voicing
 * @returns {Array<{ stepIndex: number, string: number, fret: number, note: string, degree: number, modeDegree: number, chordTone: number, midi: number }>}
 */
export function getTwoOctaveScale(key, degree = 1, voicing = []) {
  const parentIntervals = getScaleIntervals(key);

  const parentRootNote = getScaleDegreeNote(key, 1);
  const parentRootIdx = noteToIndex(parentRootNote);

  const modeRootNote = getScaleDegreeNote(key, degree);
  const modeRootIdx = noteToIndex(modeRootNote);

  // Determine target position (fret region) based on current chord voicing
  const frettedNotes = (voicing || []).filter(v => v.fret > 0);
  const minChordFret = frettedNotes.length > 0
    ? Math.min(...frettedNotes.map(v => v.fret))
    : 1;

  const degreeOffsetInParent = parentIntervals[degree - 1];

  // Evaluate candidate roots on String 6 & 5
  const candidateRoots = [];

  // String 6 candidates
  const fretOn6 = ((modeRootIdx - 4) % 12 + 12) % 12;
  [fretOn6, fretOn6 + 12].forEach(fret => {
    if (fret >= 0 && fret <= 17) {
      candidateRoots.push({ string: 6, fret, midi: 40 + fret, layout: STRICT_3NPS_MAP_6 });
    }
  });

  // String 5 candidates
  const fretOn5 = ((modeRootIdx - 9) % 12 + 12) % 12;
  [fretOn5, fretOn5 + 12].forEach(fret => {
    if (fret >= 0 && fret <= 17) {
      candidateRoots.push({ string: 5, fret, midi: 45 + fret, layout: STRICT_3NPS_MAP_5 });
    }
  });

  // Filter root candidates where ALL 15 notes stay within frets 0..17 under strict 3NPS
  const valid3NPSRoots = [];

  candidateRoots.forEach(cand => {
    let allValid = true;
    let maxF = 0;
    for (let k = 0; k < 15; k++) {
      const parentIdx = (degree - 1) + k;
      const parentDegreeIndex = parentIdx % 7;
      const octaveCount = Math.floor(parentIdx / 7);

      const semitoneFromParentRoot = parentIntervals[parentDegreeIndex] + (octaveCount * 12);
      const semitoneOffsetFromModeRoot = semitoneFromParentRoot - degreeOffsetInParent;

      const targetMidi = cand.midi + semitoneOffsetFromModeRoot;
      const targetString = cand.layout[k];
      const stMidi = STANDARD_TUNING.find(st => st.string === targetString).midi;
      const fret = targetMidi - stMidi;

      if (fret < 0 || fret > 17) {
        allValid = false;
        break;
      }
      if (fret > maxF) maxF = fret;
    }

    if (allValid) {
      valid3NPSRoots.push({ ...cand, maxFret: maxF });
    }
  });

  // Pick best valid candidate closest to minChordFret
  const chosenRoot = valid3NPSRoots.length > 0
    ? valid3NPSRoots.sort((a, b) => Math.abs(a.fret - minChordFret) - Math.abs(b.fret - minChordFret))[0]
    : candidateRoots[0];

  const layout = chosenRoot.layout;
  const modeRootMidi = chosenRoot.midi;

  const scale = [];

  for (let k = 0; k < 15; k++) {
    const parentIdx = (degree - 1) + k;
    const parentDegreeIndex = parentIdx % 7;
    const octaveCount = Math.floor(parentIdx / 7);

    const semitoneFromParentRoot = parentIntervals[parentDegreeIndex] + (octaveCount * 12);
    const semitoneOffsetFromModeRoot = semitoneFromParentRoot - degreeOffsetInParent;

    const targetMidi = modeRootMidi + semitoneOffsetFromModeRoot;
    const noteName = indexToNote(parentRootIdx + parentIntervals[parentDegreeIndex], key);

    const modeDegree = (k % 7) + 1;
    const parentDegree = parentDegreeIndex + 1;

    let targetString = layout[k];
    const stMidi = STANDARD_TUNING.find(st => st.string === targetString).midi;
    let fret = targetMidi - stMidi;

    // Fallback safety if fret < 0 or fret > 17
    if (fret < 0 || fret > 17) {
      for (let s = targetString; s >= 1; s--) {
        const sm = STANDARD_TUNING.find(st => st.string === s).midi;
        const f = targetMidi - sm;
        if (f >= 0 && f <= 17) {
          targetString = s;
          fret = f;
          break;
        }
      }
      if (fret > 17) fret = 17;
    }

    scale.push({
      stepIndex: k,
      string: targetString,
      fret,
      note: noteName,
      modeDegree,
      degree: parentDegree,
      midi: targetMidi,
      chordTone: modeDegree === 1 ? 1 : (modeDegree === 3 ? 3 : (modeDegree === 5 ? 5 : (modeDegree === 7 ? 7 : 0))),
    });
  }

  return scale;
}

/**
 * Generate 2-octave arpeggio notes (1, 3, 5, 7, 1', 3', 5', 7', 1'')
 * starting from the lowest note of the active chord voicing in the position box.
 *
 * @param {string} key - Parent key (e.g. 'F', 'B')
 * @param {number} degree - Scale degree (1-7)
 * @param {Array<{ string: number, fret: number }>} [voicing] - Active chord voicing
 * @returns {Array<{ stepIndex: number, string: number, fret: number, note: string, degree: number, chordTone: number, chordToneLabel: string, midi: number }>}
 */
export function getArpeggioNotes(key, degree = 1, voicing = []) {
  const fullScale = getTwoOctaveScale(key, degree, voicing);

  return fullScale
    .filter(s => s.chordTone > 0)
    .map((s, newIdx) => ({
      ...s,
      stepIndex: newIdx,
      chordToneLabel: CHORD_TONE_LABELS[s.chordTone] || `${s.chordTone}\u00AA`,
    }));
}

import { translations } from './i18n.js';

export function getModeName(degree, key = 'C', lang = 'pt-BR') {
  const dict = translations[lang] || translations['pt-BR'];
  const { scale } = normalizeTonality(key);
  const norm = ((degree - 1) % 7 + 7) % 7 + 1;
  const modeKey = `mode_${scale}_${norm}`;
  return dict[modeKey] || SCALES[scale]?.modes[norm - 1] || '';
}

export function getAllKeys() {
  return ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
}

export function getStringInfo() {
  return STANDARD_TUNING.map(s => ({
    ...s,
    label: `${s.string}\u00AA corda (${s.note})`,
  }));
}

export function getDegreeName(degree, key = 'C', lang = 'pt-BR') {
  const dict = translations[lang] || translations['pt-BR'];
  const norm = ((degree - 1) % 7 + 7) % 7 + 1;
  if (norm === 7) {
    const isSensible = getScaleIntervals(key)[6] === 11;
    if (isSensible) return dict.degree_7 || DEGREE_NAMES_PT[7];
    if (lang === 'en') return 'Subtonic';
    if (lang === 'fr') return 'Sous-tonique';
    if (lang === 'es') return 'Subtónica';
    return 'Subtônica';
  }
  return dict[`degree_${norm}`] || DEGREE_NAMES_PT[norm] || '';
}

export function getDiatonicChords(key, lang = 'pt-BR') {
  return Array.from({ length: 7 }, (_, i) => {
    const degree = i + 1;
    return {
      degree,
      degreeName: getDegreeName(degree, key, lang),
      chordName: getChordName(key, degree),
      quality: analyzeChordQuality(key, degree, lang),
      root: getScaleDegreeNote(key, degree),
    };
  });
}
