import { useState, useEffect, useCallback, useRef } from 'react';
import ExerciseSetup from './components/ExerciseSetup';
import Fretboard from './components/Fretboard';
import ChordInfo from './components/ChordInfo';
import SolfejoInfo from './components/SolfejoInfo';
import ArpejoInfo from './components/ArpejoInfo';
import Navigation from './components/Navigation';
import VoicingBar from './components/VoicingBar';
import {
  buildVoicing,
  buildVoicingConfig,
  getChordName,
  analyzeChordQuality,
  getDegreeName,
  getModeName,
  getDiatonicChords,
  getTonalityName,
  getTwoOctaveScale,
  getArpeggioNotes,
} from './lib/musicTheory';
import { playChord, stopScaleSequence } from './lib/audioEngine';
import './App.css';

function App() {
  const [exerciseConfig, setExerciseConfig] = useState(null);
  const [lastSetup, setLastSetup] = useState(null);
  const [currentDegree, setCurrentDegree] = useState(1);
  const [studyMode, setStudyMode] = useState('chord'); // 'chord' | 'solfejo' | 'arpejo'

  // O voicing é estado vivo da tela de exercício, não um compromisso feito no
  // setup: trocar a inversão redesenha o braço na hora, sem sair do grau em que o
  // estudante está.
  const [bassString, setBassString] = useState(6);
  const [bassTone, setBassTone] = useState(1);

  // Existe uma única nota corrente, tenha ela chegado ali pela reprodução ou por
  // um clique. Dois estados independentes unidos por `||` na renderização deixavam
  // duas notas acesas ao mesmo tempo, e o clique não tinha caminho de volta.
  const [activeStep, setActiveStep] = useState(null);
  const [isSolfejoPlaying, setIsSolfejoPlaying] = useState(false);

  const isExerciseStarted = exerciseConfig !== null;

  // Clicar na nota já acesa apaga; clicar noutra move a luz.
  const toggleStep = useCallback((stepIndex) => {
    setActiveStep(prev => (prev === stepIndex ? null : stepIndex));
  }, []);

  // Any change of degree, mode or screen abandons the notes currently on the
  // fretboard, so the running sequence must die with them: otherwise it keeps
  // playing the old scale and keeps lighting steps in the panel that replaced it.
  const resetPlayback = useCallback(() => {
    stopScaleSequence();
    setActiveStep(null);
    setIsSolfejoPlaying(false);
  }, []);

  const handleStart = (key) => {
    setExerciseConfig({ key });
    setLastSetup({ tonality: key });
    setCurrentDegree(1);
    resetPlayback();
  };

  // Trocar o voicing move a caixa de posição em que a escala é gerada, então a
  // sequência tocando precisa morrer junto — senão o solfejo continua na posição
  // antiga enquanto o braço já mostra a nova.
  const changeVoicing = useCallback((next) => {
    if (next.bassString !== undefined) setBassString(next.bassString);
    if (next.bassTone !== undefined) setBassTone(next.bassTone);
    resetPlayback();
  }, [resetPlayback]);

  const handleBack = useCallback(() => {
    setExerciseConfig(null);
    setCurrentDegree(1);
    resetPlayback();
  }, [resetPlayback]);

  const handleNext = useCallback(() => {
    setCurrentDegree(prev => (prev % 7) + 1);
    resetPlayback();
  }, [resetPlayback]);

  const handlePrev = useCallback(() => {
    setCurrentDegree(prev => prev === 1 ? 7 : prev - 1);
    resetPlayback();
  }, [resetPlayback]);

  // Keyboard navigation (active in all modes)
  useEffect(() => {
    if (!isExerciseStarted) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); handleNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); handlePrev(); }
      if (e.key === 'Escape') { e.preventDefault(); handleBack(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExerciseStarted, handleNext, handlePrev, handleBack]);

  // Calculate current voicing
  const voicingResult = isExerciseStarted
    ? buildVoicing(exerciseConfig.key, currentDegree, buildVoicingConfig(bassString, bassTone))
    : { voices: [], span: 0, playable: true };

  // Calculate 2-octave scale starting from current degree root note aligned with chord frets
  const solfejoNotes = isExerciseStarted
    ? getTwoOctaveScale(exerciseConfig.key, currentDegree, voicingResult.voices)
    : [];

  // Calculate 2-octave arpeggio (1, 3, 5, 7) starting from lowest chord note
  const arpejoNotes = isExerciseStarted
    ? getArpeggioNotes(exerciseConfig.key, currentDegree, voicingResult.voices)
    : [];

  // Auto-play chord when chord/degree changes (only in chord mode).
  // As vozes vão por ref de propósito: `voicingResult` é recalculado a cada render,
  // então como dependência ele dispararia um strum por render em vez de por grau.
  const voicesRef = useRef(voicingResult.voices);
  voicesRef.current = voicingResult.voices;

  useEffect(() => {
    if (isExerciseStarted && studyMode === 'chord' && voicesRef.current.length > 0) {
      playChord(voicesRef.current);
    }
  }, [currentDegree, isExerciseStarted, studyMode]);

  const chordName = isExerciseStarted ? getChordName(exerciseConfig.key, currentDegree) : '';
  const quality = isExerciseStarted ? analyzeChordQuality(exerciseConfig.key, currentDegree) : null;
  const degreeName = isExerciseStarted ? getDegreeName(currentDegree, exerciseConfig.key) : '';
  const modeName = isExerciseStarted ? getModeName(currentDegree, exerciseConfig.key) : '';
  const diatonicChords = isExerciseStarted ? getDiatonicChords(exerciseConfig.key) : [];
  const tonalityName = isExerciseStarted ? getTonalityName(exerciseConfig.key) : '';

  return (
    <div className="app-container">
      <header>
        <h1>Guitar Harmony Study</h1>
        <p>Estudo de Harmonia Funcional no Bra&ccedil;o do Viol&atilde;o</p>
      </header>

      <main>
        {!isExerciseStarted ? (
          <ExerciseSetup onStart={handleStart} initialSetup={lastSetup} />
        ) : (
          <div className="exercise-area">
            {/* Top controls: Back button & Mode Switcher */}
            <div className="top-control-bar">
              <button className="back-btn" onClick={handleBack}>
                &larr; Voltar &agrave; Configura&ccedil;&atilde;o
              </button>

              <div className="mode-toggle-group">
                <button
                  className={`mode-btn ${studyMode === 'chord' ? 'active' : ''}`}
                  onClick={() => {
                    setStudyMode('chord');
                    resetPlayback();
                  }}
                >
                  Acordes
                </button>
                <button
                  className={`mode-btn ${studyMode === 'solfejo' ? 'active' : ''}`}
                  onClick={() => {
                    setStudyMode('solfejo');
                    resetPlayback();
                  }}
                >
                  Solfejo
                </button>
                <button
                  className={`mode-btn ${studyMode === 'arpejo' ? 'active' : ''}`}
                  onClick={() => {
                    setStudyMode('arpejo');
                    resetPlayback();
                  }}
                >
                  Arpejo
                </button>
              </div>
            </div>

            {/* Mode-dependent info panel */}
            {studyMode === 'chord' && (
              <ChordInfo
                chordName={chordName}
                quality={quality}
                currentDegree={currentDegree}
                degreeName={degreeName}
                tonalityName={tonalityName}
                voicing={voicingResult.voices}
                span={voicingResult.span}
                playable={voicingResult.playable}
              />
            )}
            {studyMode === 'solfejo' && (
              <SolfejoInfo
                tonalityName={tonalityName}
                currentDegree={currentDegree}
                chordName={chordName}
                quality={quality}
                modeName={modeName}
                solfejoNotes={solfejoNotes}
                activeStep={activeStep}
                onStepActive={setActiveStep}
                onNoteToggle={toggleStep}
                isPlaying={isSolfejoPlaying}
                setIsPlaying={setIsSolfejoPlaying}
              />
            )}
            {studyMode === 'arpejo' && (
              <ArpejoInfo
                tonalityName={tonalityName}
                currentDegree={currentDegree}
                chordName={chordName}
                quality={quality}
                arpejoNotes={arpejoNotes}
                activeStep={activeStep}
                onStepActive={setActiveStep}
                onNoteToggle={toggleStep}
                isPlaying={isSolfejoPlaying}
                setIsPlaying={setIsSolfejoPlaying}
              />
            )}

            <VoicingBar bassString={bassString} bassTone={bassTone} onChange={changeVoicing} />

            {/* Fretboard */}
            <Fretboard
              voicing={voicingResult.voices}
              playable={voicingResult.playable}
              mode={studyMode}
              solfejoNotes={studyMode === 'arpejo' ? arpejoNotes : solfejoNotes}
              activeStep={activeStep}
              onNoteToggle={toggleStep}
            />

            {/* Navigation & Diatonic Chords Bar (Available in BOTH modes) */}
            <Navigation
              currentDegree={currentDegree}
              tonalityName={tonalityName}
              diatonicChords={diatonicChords}
              onNext={handleNext}
              onPrev={handlePrev}
            />

            <div className="diatonic-bar">
              <h3>Campo Harm&ocirc;nico de {getTonalityName(exerciseConfig.key)} (Selecione o Grau)</h3>
              <div className="diatonic-chords">
                {diatonicChords.map(c => (
                  <button
                    key={c.degree}
                    className={`diatonic-chip ${c.degree === currentDegree ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentDegree(c.degree);
                      resetPlayback();
                    }}
                  >
                    <span className="chip-roman">{c.quality.roman}</span>
                    <span className="chip-name">{c.chordName}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer>
        <p>Use <kbd>&larr;</kbd> <kbd>&rarr;</kbd> para navegar entre graus &bull; <kbd>Esc</kbd> para voltar</p>
      </footer>
    </div>
  );
}

export default App;
