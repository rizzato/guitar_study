import assert from 'node:assert/strict';
import { getDiatonicChords } from '../src/lib/musicTheory.js';

// Simulate the identical chord coloring logic used in App.jsx
function computeChordColors(fields, lang = 'pt-BR') {
  const chordCounts = {};
  const colors = ['#1e40af', '#065f46', '#854d0e', '#701a75', '#991b1b', '#3730a3', '#155e75', '#581c87'];

  fields.forEach(field => {
    const chordsOfField = getDiatonicChords(field.tonality, lang);
    chordsOfField.forEach(c => {
      const name = c.chordName;
      chordCounts[name] = (chordCounts[name] || 0) + 1;
    });
  });

  const colorMap = {};
  let colorIdx = 0;
  Object.keys(chordCounts).forEach(name => {
    if (chordCounts[name] > 1) {
      colorMap[name] = colors[colorIdx % colors.length];
      colorIdx++;
    }
  });

  return { chordCounts, colorMap };
}

// Test case 1: Single field in stack - no repeating chords colored
const singleFieldStack = [
  { tonality: { tonic: 'C', scale: 'major' } }
];
const result1 = computeChordColors(singleFieldStack);
assert.equal(Object.keys(result1.colorMap).length, 0, 'Com apenas um campo, nenhum acorde deve ser colorido.');

// Test case 2: C Major and G Major stacked
// Diatonic chords of C Major: Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7b5
// Diatonic chords of G Major: Gmaj7, Am7, Bm7, Cmaj7, D7, Em7, F#m7b5
// Repeating chords: Cmaj7, Em7, Am7
const twoFieldsStack = [
  { tonality: { tonic: 'C', scale: 'major' } },
  { tonality: { tonic: 'G', scale: 'major' } }
];
const result2 = computeChordColors(twoFieldsStack);

assert.ok(result2.chordCounts['Cmaj7'] > 1, 'Cmaj7 deve se repetir.');
assert.ok(result2.chordCounts['Em7'] > 1, 'Em7 deve se repetir.');
assert.ok(result2.chordCounts['Am7'] > 1, 'Am7 deve se repetir.');
assert.equal(result2.chordCounts['Dm7'], 1, 'Dm7 não deve se repetir.');

assert.ok('Cmaj7' in result2.colorMap, 'Cmaj7 deve receber uma cor.');
assert.ok('Em7' in result2.colorMap, 'Em7 deve receber uma cor.');
assert.ok('Am7' in result2.colorMap, 'Am7 deve receber uma cor.');
assert.ok(!('Dm7' in result2.colorMap), 'Dm7 não deve receber uma cor.');

// Ensure colored repeating chords get unique colors
const uniqueColors = new Set(Object.values(result2.colorMap));
assert.equal(uniqueColors.size, 3, 'Acordes repetidos distintos devem ter cores distintas.');

console.log('Testes de pilha de campos harmônicos (chord coloring) concluídos com sucesso!');

// Test case 3: Voicing Preview Fret & Interval Calculation
import { buildVoicing, buildVoicingConfig } from '../src/lib/musicTheory.js';

const config = buildVoicingConfig(6, 1); // Bass on 6, inversion 1 (Drop-2 root position)
const voicingResult = buildVoicing({ tonic: 'C', scale: 'major' }, 1, config);

const played = voicingResult.voices.filter(v => v.fret !== null && v.fret > 0);
assert.equal(played.length, 4, 'Drop-2 root position deve ter 4 vozes ativas.');

const minFret = Math.min(...played.map(v => v.fret));
assert.equal(minFret, 8, 'Em Dó maior grau 1, o menor traste do Drop-2 na 6ª corda deve ser o traste 8 (nota Dó).');

// Verify relative frets relative to minFret (8)
// Cmaj7: C on string 6 (fret 8, relative 0), B on string 4 (fret 9, relative 1), E on string 3 (fret 9, relative 1), G on string 2 (fret 8, relative 0)
const voice6 = played.find(v => v.string === 6);
const voice4 = played.find(v => v.string === 4);
const voice3 = played.find(v => v.string === 3);
const voice2 = played.find(v => v.string === 2);

assert.equal(voice6.fret - minFret, 0, '6ª corda deve estar no traste relativo 0.');
assert.equal(voice4.fret - minFret, 1, '4ª corda deve estar no traste relativo 1.');
assert.equal(voice3.fret - minFret, 1, '3ª corda deve estar no traste relativo 1.');
assert.equal(voice2.fret - minFret, 0, '2ª corda deve estar no traste relativo 0.');

assert.equal(voice6.chordTone, 1, '6ª corda deve ser a tônica (1).');
assert.equal(voice4.chordTone, 7, '4ª corda deve ser a sétima (7).');
assert.equal(voice3.chordTone, 3, '3ª corda deve ser a terça (3).');
assert.equal(voice2.chordTone, 5, '2ª corda deve ser a quinta (5).');

console.log('Testes de desenho do acorde (Voicing Preview) concluídos com sucesso!');
