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
