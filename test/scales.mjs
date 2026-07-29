// Trava a teoria dos quatro campos harmônicos.
//
// As qualidades de acorde são DERIVADAS dos intervalos calculados, não tabeladas
// por grau. Isso remove a chance de a tabela discordar da escala — mas cria
// outra: um erro no conjunto de intervalos passaria silencioso e o app ensinaria
// harmonia errada a um público que percebe. Este arquivo é a defesa contra isso:
// os 28 graus estão escritos à mão, conferidos contra a teoria, e comparados com
// o que o motor produz.
import assert from 'node:assert/strict';
import {
  SCALES, getDiatonicChords, getTwoOctaveScale, getModeName,
  getDegreeName, getTonalityName, getScaleNotes,
  buildVoicingConfig, buildVoicing, getBassToneOptions,
  getBassStringOptions, hasVoicingVariation,
} from '../src/lib/musicTheory.js';

// grau -> "romano symbol", conferido na mão
const ESPERADO = {
  major:         ['I maj7', 'ii m7', 'iii m7', 'IV maj7', 'V 7', 'vi m7', 'viiø m7(b5)'],
  minorNatural:  ['i m7', 'iiø m7(b5)', 'III maj7', 'iv m7', 'v m7', 'VI maj7', 'VII 7'],
  minorHarmonic: ['i m(maj7)', 'iiø m7(b5)', 'III+ maj7(#5)', 'iv m7', 'V 7', 'VI maj7', 'vii° °7'],
  minorMelodic:  ['i m(maj7)', 'ii m7', 'III+ maj7(#5)', 'IV 7', 'V 7', 'viø m7(b5)', 'viiø m7(b5)'],
};

const TONICAS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const STRING_MIDI = { 6: 40, 5: 45, 4: 50, 3: 55, 2: 59, 1: 64 };

// 1. Qualidade de cada grau, em cada campo, em todas as 12 tônicas.
for (const [scale, esperado] of Object.entries(ESPERADO)) {
  for (const tonic of TONICAS) {
    const acordes = getDiatonicChords({ tonic, scale });
    assert.equal(acordes.length, 7, `${tonic} ${scale}: esperava 7 graus`);
    acordes.forEach((c, i) => {
      const obtido = `${c.quality.roman} ${c.quality.symbol}`;
      assert.equal(obtido, esperado[i],
        `${tonic} ${SCALES[scale].label} grau ${i + 1}: esperava "${esperado[i]}", obteve "${obtido}"`);
      assert.ok(!c.quality.symbol.includes('?'),
        `${tonic} ${SCALES[scale].label} grau ${i + 1}: tétrade fora do catálogo`);
    });
  }
}

// 2. A escala tem 7 notas distintas em todas as combinações.
for (const scale of Object.keys(SCALES)) {
  for (const tonic of TONICAS) {
    const notas = getScaleNotes({ tonic, scale });
    assert.equal(notas.length, 7, `${tonic} ${scale}: escala com ${notas.length} notas`);
    assert.equal(new Set(notas).size, 7, `${tonic} ${scale}: nota repetida em ${notas.join(' ')}`);
  }
}

// 3. Solfejo 3NPS: 15 notas ascendentes, dentro das 17 casas, 3 por corda.
let combinacoes = 0, maiorTraste = 0, maiorSpan = 0;
for (const scale of Object.keys(SCALES)) {
  for (const tonic of TONICAS) {
    for (let d = 1; d <= 7; d++) {
      combinacoes++;
      const s = getTwoOctaveScale({ tonic, scale }, d, [{ string: 6, fret: 5 }]);
      assert.equal(s.length, 15, `${tonic} ${scale} grau ${d}: ${s.length} notas, esperava 15`);

      for (let i = 1; i < s.length; i++) {
        assert.ok(s[i].midi > s[i - 1].midi,
          `${tonic} ${scale} grau ${d}: passo ${i + 1} não sobe (${s[i - 1].midi} -> ${s[i].midi})`);
      }
      const frets = s.map(x => x.fret);
      const maxF = Math.max(...frets), minF = Math.min(...frets);
      assert.ok(maxF <= 17, `${tonic} ${scale} grau ${d}: traste ${maxF} estoura o braço`);
      assert.ok(minF >= 0, `${tonic} ${scale} grau ${d}: traste negativo`);
      if (maxF > maiorTraste) maiorTraste = maxF;
      if (maxF - minF > maiorSpan) maiorSpan = maxF - minF;

      const porCorda = s.reduce((a, n) => (a[n.string] = (a[n.string] || 0) + 1, a), {});
      for (const [corda, qtd] of Object.entries(porCorda)) {
        assert.equal(qtd, 3, `${tonic} ${scale} grau ${d}: corda ${corda} com ${qtd} notas, esperava 3`);
      }
    }
  }
}

// 4. A 7ª só se chama Sensível quando dista um semitom da tônica.
assert.equal(getDegreeName(7, { tonic: 'A', scale: 'major' }), 'Sensível');
assert.equal(getDegreeName(7, { tonic: 'A', scale: 'minorNatural' }), 'Subtônica');
assert.equal(getDegreeName(7, { tonic: 'A', scale: 'minorHarmonic' }), 'Sensível');
assert.equal(getDegreeName(7, { tonic: 'A', scale: 'minorMelodic' }), 'Sensível');

// 5. Modo por grau e nome da tonalidade.
assert.equal(getModeName(5, { tonic: 'A', scale: 'minorHarmonic' }), 'Frígio dominante');
assert.equal(getModeName(1, { tonic: 'C', scale: 'major' }), 'Jônio (Maior)');
assert.equal(getTonalityName({ tonic: 'A', scale: 'minorNatural' }), 'Am');
assert.equal(getTonalityName('F'), 'F');

// 6. Retrocompatibilidade: string continua significando maior.
assert.deepEqual(
  getDiatonicChords('C').map(c => c.quality.roman),
  getDiatonicChords({ tonic: 'C', scale: 'major' }).map(c => c.quality.roman),
);

// 7. Lá menor natural é o relativo de Dó maior: mesmas sete notas.
assert.deepEqual(
  [...getScaleNotes({ tonic: 'A', scale: 'minorNatural' })].sort(),
  [...getScaleNotes('C')].sort(),
);

// 8. Todo voicing oferecido pela interface é DIGITÁVEL, não só de span curto.
//
//    A versão anterior deste bloco validava apenas o span (max - min <= 5) e
//    aprovava formas impossíveis: com a terça no baixo em cordas adjacentes, os
//    trastes saíam 5-7-3-5 — span 4, aprovado, e a mão tendo que apertar o traste
//    3 na 4ª corda enquanto segura o 7 na 5ª. Span não vê a ORDEM.
//
//    O critério que importa é o salto de traste para trás entre cordas
//    fisicamente vizinhas e ambas tocadas. Corda pulada não conta: é o vão que
//    caracteriza drop-3 e não atrapalha a mão.
const SALTO_MAXIMO_PARA_TRAS = 3;

let voicings = 0, maiorSpanAcorde = 0, piorSalto = 0;
for (const scale of Object.keys(SCALES)) {
  for (const tonic of TONICAS) {
    for (let d = 1; d <= 7; d++) {
      for (const st of getBassStringOptions()) {
      for (const b of getBassToneOptions()) {
        if (!hasVoicingVariation(st.value, b.value)) continue;
        voicings++;
        const cfg = buildVoicingConfig(st.value, b.value);
        assert.equal(cfg.length, 4, `voicing com ${cfg.length} vozes`);
        assert.equal(new Set(cfg.map(v => v.chordTone)).size, 4, `grau repetido no voicing`);
        assert.equal(cfg[0].chordTone, b.value, `baixo ${b.value}: a voz mais grave não é o grau pedido`);
        assert.equal(cfg[0].string, st.value, `a voz mais grave não caiu na corda ${st.value}`);

        const r = buildVoicing({ tonic, scale }, d, cfg);
        const onde = `${tonic} ${SCALES[scale].label} grau ${d} corda ${st.value} baixo ${b.value}`;
        assert.ok(r.playable, `${onde}: impraticável, span ${r.span}`);
        if (r.span > maiorSpanAcorde) maiorSpanAcorde = r.span;

        const vozes = [...r.voices].sort((a, b2) => b2.string - a.string);
        for (const v of vozes) {
          assert.ok(v.fret >= 0 && v.fret <= 17, `${onde}: traste ${v.fret} fora do braço`);
        }
        // as alturas têm que subir do baixo para o agudo
        for (let i = 1; i < vozes.length; i++) {
          const midiAnterior = STRING_MIDI[vozes[i - 1].string] + vozes[i - 1].fret;
          const midiAtual = STRING_MIDI[vozes[i].string] + vozes[i].fret;
          assert.ok(midiAtual > midiAnterior, `${onde}: voz ${i + 1} não está acima da anterior`);

          if (vozes[i - 1].string - vozes[i].string !== 1) continue;
          const salto = vozes[i].fret - vozes[i - 1].fret;
          if (salto < piorSalto) piorSalto = salto;
          assert.ok(salto >= -SALTO_MAXIMO_PARA_TRAS,
            `${onde}: salto de ${salto} trastes entre cordas vizinhas ${vozes[i - 1].string} e ${vozes[i].string} — indigitável`);
        }
      }
      }
    }
  }
}

// A lacuna declarada tem que continuar declarada: se alguém adicionar uma forma
// para 4ª corda + terça no baixo, ela precisa passar o critério ergonômico acima,
// e este assert força a revisão consciente.
assert.equal(hasVoicingVariation(4, 3), false,
  'apareceu variação para 4ª corda + terça no baixo — valide a ergonomia antes de oferecer');

console.log(`Teoria dos 4 campos: 28 graus x 12 tônicas OK.`);
console.log(`Voicings: ${voicings} combinações OK — digitáveis, ascendentes (maior span ${maiorSpanAcorde}, pior salto ${piorSalto}).`);
console.log(`Solfejo 3NPS: ${combinacoes} combinações OK (maior traste ${maiorTraste}, maior span ${maiorSpan}).`);
