// Ciclo de vida da sequência de solfejo: parar de verdade quando o contexto muda,
// e ainda assim completar normalmente quando ninguém interrompe.
import assert from 'node:assert/strict';

// audioEngine consulta window.AudioContext; sem ele, playNote sai cedo e o teste
// exercita só o cronômetro, que é o que importa aqui.
globalThis.window = {};

const { playScaleSequence, stopScaleSequence } = await import('../src/lib/audioEngine.js');

const notes = n => Array.from({ length: n }, (_, i) => ({ string: 6, fret: i, stepIndex: i }));
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 1. stopScaleSequence interrompe de fato e NÃO dispara onComplete.
let steps = [];
let completed = false;
playScaleSequence(notes(20), s => steps.push(s), () => { completed = true; }, 10);

await sleep(35);
const stepsAtStop = steps.length;
assert.ok(stepsAtStop >= 2, `esperava pelo menos 2 passos antes de parar, houve ${stepsAtStop}`);
stopScaleSequence();

await sleep(80);
assert.equal(steps.length, stepsAtStop, `passos continuaram depois do stop: ${stepsAtStop} -> ${steps.length}`);
assert.equal(completed, false, 'onComplete disparou numa sequência abandonada');

// 2. Sem interrupção, a sequência completa: todos os passos, depois null, depois onComplete.
steps = [];
completed = false;
playScaleSequence(notes(4), s => steps.push(s), () => { completed = true; }, 10);

await sleep(120);
assert.deepEqual(steps, [0, 1, 2, 3, null], `sequência de passos inesperada: ${JSON.stringify(steps)}`);
assert.equal(completed, true, 'onComplete não disparou numa sequência completa');

// 3. Uma nova sequência cancela a anterior (nenhum passo antigo vaza).
playScaleSequence(notes(20), () => {}, () => {}, 10);
steps = [];
playScaleSequence(notes(3), s => steps.push(s), () => {}, 10);
await sleep(80);
assert.deepEqual(steps, [0, 1, 2, null], `sequência anterior vazou: ${JSON.stringify(steps)}`);

stopScaleSequence();
console.log('Ciclo de vida da sequência: 3 casos OK (stop, completar, substituir).');
