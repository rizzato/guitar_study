// ============================================================
// Music Theory Engine for Guitar Harmony Study
// ============================================================

// All 12 chromatic notes (using sharps as canonical)
const CHROMATIC_SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHROMATIC_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Keys that use flats
const FLAT_KEYS = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];

// Major scale intervals in semitones from root
const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

// Standard guitar tuning (string 6 to string 1) - MIDI note numbers
const STANDARD_TUNING = [
  { string: 6, note: 'E', octave: 2, midi: 40 },
  { string: 5, note: 'A', octave: 2, midi: 45 },
  { string: 4, note: 'D', octave: 3, midi: 50 },
  { string: 3, note: 'G', octave: 3, midi: 55 },
  { string: 2, note: 'B', octave: 3, midi: 59 },
  { string: 1, note: 'E', octave: 4, midi: 64 },
];

// Chord quality for each scale degree (1-indexed)
const DEGREE_QUALITIES = {
  1: { symbol: 'maj7', roman: 'I',     name: 'Maior com sétima maior' },
  2: { symbol: 'm7',   roman: 'ii',    name: 'Menor com sétima menor' },
  3: { symbol: 'm7',   roman: 'iii',   name: 'Menor com sétima menor' },
  4: { symbol: 'maj7', roman: 'IV',    name: 'Maior com sétima maior' },
  5: { symbol: '7',    roman: 'V',     name: 'Dominante (sétima menor)' },
  6: { symbol: 'm7',   roman: 'vi',    name: 'Menor com sétima menor' },
  7: { symbol: 'm7(b5)', roman: 'vii\u00F8', name: 'Meio-diminuto' },
};

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
  return FLAT_KEYS.includes(key);
}

export function indexToNote(index, key) {
  const normalized = ((index % 12) + 12) % 12;
  if (usesFlats(key)) {
    return CHROMATIC_FLATS[normalized];
  }
  return CHROMATIC_SHARPS[normalized];
}

export function getMajorScale(root) {
  const rootIdx = noteToIndex(root);
  if (rootIdx === -1) return [];
  return MAJOR_SCALE_INTERVALS.map(interval => indexToNote(rootIdx + interval, root));
}

export function getScaleDegreeNote(key, degree) {
  const scale = getMajorScale(key);
  const normalizedDegree = ((degree - 1) % 7 + 7) % 7;
  return scale[normalizedDegree];
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

export function analyzeChordQuality(key, degree) {
  const root = getScaleDegreeNote(key, degree);
  const third = getChordToneNote(key, degree, 3);
  const fifth = getChordToneNote(key, degree, 5);
  const seventh = getChordToneNote(key, degree, 7);

  const i3 = getInterval(root, third);
  const i5 = getInterval(root, fifth);
  const i7 = getInterval(root, seventh);

  return {
    root, third, fifth, seventh,
    intervals: { third: i3, fifth: i5, seventh: i7 },
    ...DEGREE_QUALITIES[degree],
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

// Major scale 2-octave intervals (semitones from root)
const TWO_OCTAVE_INTERVALS = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24];

/**
 * Map step index (0..14) of a 2-octave major scale to a guitar string (6..1)
 */
const SCALE_STRING_MAP = [
  6, 6, 6, // 1, 2, 3
  5, 5, 5, // 4, 5, 6
  4, 4, 4, // 7, 1, 2
  3, 3, 3, // 3, 4, 5
  2, 2,    // 6, 7
  1,       // 1
];

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
  const parentIntervals = [0, 2, 4, 5, 7, 9, 11];

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

const GREEK_MODES = {
  1: 'Modo J\u00F4nico (Maior)',
  2: 'Modo D\u00F3rico',
  3: 'Modo Fr\u00EDgio',
  4: 'Modo L\u00EDdio',
  5: 'Modo Mixol\u00EDdio',
  6: 'Modo E\u00F3lio (Menor)',
  7: 'Modo L\u00F3crio',
};

export function getModeName(degree) {
  return GREEK_MODES[degree] || '';
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

export function getDegreeName(degree) {
  return DEGREE_NAMES_PT[degree] || '';
}

export function getChordToneOptions() {
  return [
    { value: 1, label: 'T\u00F4nica (1)' },
    { value: 3, label: 'Ter\u00E7a (3)' },
    { value: 5, label: 'Quinta (5)' },
    { value: 7, label: 'S\u00E9tima (7)' },
  ];
}

export function getDiatonicChords(key) {
  return Array.from({ length: 7 }, (_, i) => {
    const degree = i + 1;
    return {
      degree,
      degreeName: DEGREE_NAMES_PT[degree],
      chordName: getChordName(key, degree),
      quality: DEGREE_QUALITIES[degree],
      root: getScaleDegreeNote(key, degree),
    };
  });
}
