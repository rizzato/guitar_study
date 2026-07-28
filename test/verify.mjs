import { getTwoOctaveScale, getAllKeys } from '../src/lib/musicTheory.js';

const keys = getAllKeys();
let totalTested = 0;
let errors = 0;
let maxFretOverall = 0;

keys.forEach(k => {
  for (let d = 1; d <= 7; d++) {
    totalTested++;
    const s = getTwoOctaveScale(k, d, [{ string: 6, fret: 11 }]);
    let ok = true;
    for (let i = 1; i < s.length; i++) {
      if (s[i].midi <= s[i - 1].midi) {
        ok = false;
        console.error(`ERRO em ${k} grau ${d} passo ${i + 1}: ${s[i - 1].midi} >= ${s[i].midi}`);
      }
    }
    const frets = s.map(x => x.fret);
    const maxF = Math.max(...frets);
    if (maxF > maxFretOverall) maxFretOverall = maxF;
    if (maxF > 17) {
      ok = false;
      console.error(`ERRO de estouro de traste em ${k} grau ${d}: traste ${maxF} > 17`);
    }
    if (!ok) errors++;
  }
});

console.log(`\nTestes Concluídos (Braço de 17 Casas): ${totalTested} combinações.`);
console.log(`Erros Encontrados: ${errors}`);
console.log(`Maior Traste Utilizado em Todo o App: ${maxFretOverall} (limite do braço: 17)`);
