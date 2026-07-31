// ============================================================
// Web Audio API Guitar Synthesizer Engine
// ============================================================

let audioCtx = null;
let masterCompressor = null;
let masterGain = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();

      // Create a dynamics compressor to glue the parallel sound waves and prevent digital clipping
      masterCompressor = audioCtx.createDynamicsCompressor();
      masterCompressor.threshold.setValueAtTime(-16, audioCtx.currentTime); // Squeeze peaks exceeding -16dB
      masterCompressor.knee.setValueAtTime(8, audioCtx.currentTime);
      masterCompressor.ratio.setValueAtTime(4, audioCtx.currentTime); // 4:1 compression ratio
      masterCompressor.attack.setValueAtTime(0.005, audioCtx.currentTime); // Fast 5ms attack
      masterCompressor.release.setValueAtTime(0.12, audioCtx.currentTime); // 120ms release

      // Master output gain limiter
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.85, audioCtx.currentTime);

      // Connect signal path: compressor -> master gain -> speakers
      masterCompressor.connect(masterGain);
      masterGain.connect(audioCtx.destination);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

const STRING_BASE_MIDI = {
  6: 40, // E2 (82.4Hz)
  5: 45, // A2
  4: 50, // D3
  3: 55, // G3
  2: 59, // B3
  1: 64, // E4 (329.6Hz)
};

/**
 * Calculate MIDI pitch from string number (1-6) and fret number (0-15)
 */
export function getMidiNote(stringNum, fretNum) {
  const base = STRING_BASE_MIDI[stringNum];
  if (base === undefined) return 60;
  return base + fretNum;
}

/**
 * Convert MIDI note number to frequency in Hz
 */
export function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Play a single guitar note with realistic pluck acoustics and equalization
 */
export function playNote(stringNum, fretNum, startTimeOffset = 0, duration = 2.0) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const midi = getMidiNote(stringNum, fretNum);
  const freq = midiToFreq(midi);
  const startTime = ctx.currentTime + startTimeOffset;

  // Fletcher-Munson equal-loudness pitch compensation factor:
  // Lower strings (6 and 5) get boosted to compensate for the human ear's lower bass sensitivity
  const loudnessFactor = 1.0 + (6 - stringNum) * 0.12; // 6th string gets ~1.6x factor, 1st gets 1.0x
  const basePeakVolume = 0.24 * loudnessFactor; // Prevents individual node over-saturation

  // Master note gain
  const noteGain = ctx.createGain();

  // Low-pass filter for guitar string brightness decay
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  // Higher notes have higher initial cutoff
  const initialCutoff = Math.min(freq * 8, 8000);
  filter.frequency.setValueAtTime(initialCutoff, startTime);
  filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.5, 200), startTime + duration * 0.8);

  // Oscillators for fundamental & harmonics (gives acoustic timber)
  const osc1 = ctx.createOscillator(); // Fundamental (Triangle for body)
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(freq, startTime);

  const osc2 = ctx.createOscillator(); // Sine for pure fundamental depth
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq, startTime);

  const osc3 = ctx.createOscillator(); // Sawtooth (attenuated) for string pluck bite
  osc3.type = 'sawtooth';
  osc3.frequency.setValueAtTime(freq, startTime);

  const osc3Gain = ctx.createGain();
  osc3Gain.gain.setValueAtTime(0.12, startTime);
  osc3Gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12); // Quick pluck transient

  // Gain envelope for main vibration decay
  noteGain.gain.setValueAtTime(0.0001, startTime);
  noteGain.gain.linearRampToValueAtTime(basePeakVolume, startTime + 0.008); // Fast attack
  noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // Natural string decay

  // Connect routing
  osc1.connect(noteGain);
  osc2.connect(noteGain);
  osc3.connect(osc3Gain);
  osc3Gain.connect(noteGain);

  noteGain.connect(filter);
  // Route to our shared master compressor instead of directly to speakers
  filter.connect(masterCompressor);

  // Start & Stop
  osc1.start(startTime);
  osc2.start(startTime);
  osc3.start(startTime);

  osc1.stop(startTime + duration);
  osc2.stop(startTime + duration);
  osc3.stop(startTime + duration);
}

/**
 * Play a complete chord with natural guitar strumming (down-strum delay)
 *
 * @param {Array<{string: number, fret: number}>} voices - Array of chord voices
 * @param {number} strumSpeedMs - Delay between string plucks in ms (default 35ms)
 */
export function playChord(voices = [], strumSpeedMs = 35) {
  if (!voices || voices.length === 0) return;

  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }

  // Sort from lowest string (6) to highest string (1) for natural down-strum
  const sortedVoices = [...voices].sort((a, b) => b.string - a.string);

  sortedVoices.forEach((v, index) => {
    const delaySec = (index * strumSpeedMs) / 1000;
    playNote(v.string, v.fret, delaySec, 2.5);
  });
}

let currentScaleTimer = null;

/**
 * Stop any running scale sequence. Safe to call when nothing is playing.
 * Does not fire onComplete: the caller is abandoning the sequence, not finishing it.
 */
export function stopScaleSequence() {
  if (currentScaleTimer) {
    clearInterval(currentScaleTimer);
    currentScaleTimer = null;
  }
}

/**
 * Play a sequence of scale notes step-by-step for solfège.
 * Calls onStepActive(stepIndex) at each note timing, and onComplete() when done.
 */
export function playScaleSequence(scaleNotes = [], onStepActive, onComplete, stepIntervalMs = 300) {
  stopScaleSequence();

  if (!scaleNotes || scaleNotes.length === 0) return;

  let index = 0;

  const playCurrentStep = () => {
    if (index >= scaleNotes.length) {
      stopScaleSequence();
      if (onStepActive) onStepActive(null);
      if (onComplete) onComplete();
      return;
    }

    const item = scaleNotes[index];
    playNote(item.string, item.fret, 0, 1.2);
    if (onStepActive) onStepActive(item.stepIndex);
    index++;
  };

  playCurrentStep();
  currentScaleTimer = setInterval(playCurrentStep, stepIntervalMs);
}
