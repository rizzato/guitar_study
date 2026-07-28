import { useState, useEffect, useCallback } from 'react';
import ExerciseSetup from './components/ExerciseSetup';
import Fretboard from './components/Fretboard';
import ChordInfo from './components/ChordInfo';
import SolfejoInfo from './components/SolfejoInfo';
import ArpejoInfo from './components/ArpejoInfo';
import Navigation from './components/Navigation';
import {
  buildVoicing,
  getChordName,
  analyzeChordQuality,
  getDegreeName,
  getModeName,
  getDiatonicChords,
  getTwoOctaveScale,
  getArpeggioNotes,
} from './lib/musicTheory';
import { playChord } from './lib/audioEngine';
import './App.css';

function App() {
  const [exerciseConfig, setExerciseConfig] = useState(null);
  const [lastSetup, setLastSetup] = useState(null);
  const [currentDegree, setCurrentDegree] = useState(1);
  const [studyMode, setStudyMode] = useState('chord'); // 'chord' | 'solfejo' | 'arpejo'

  const [activeSolfejoStep, setActiveSolfejoStep] = useState(null);
  const [clickedSolfejoStep, setClickedSolfejoStep] = useState(null);
  const [isSolfejoPlaying, setIsSolfejoPlaying] = useState(false);

  const isExerciseStarted = exerciseConfig !== null;

  const handleStart = ({ key, voicingConfig }, setupState) => {
    setExerciseConfig({ key, voicingConfig });
    setLastSetup(setupState);
    setCurrentDegree(1);
    setActiveSolfejoStep(null);
    setClickedSolfejoStep(null);
  };

  const handleBack = () => {
    setExerciseConfig(null);
    setCurrentDegree(1);
    setActiveSolfejoStep(null);
    setClickedSolfejoStep(null);
  };

  const handleNext = useCallback(() => {
    setCurrentDegree(prev => (prev % 7) + 1);
    setActiveSolfejoStep(null);
    setClickedSolfejoStep(null);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentDegree(prev => prev === 1 ? 7 : prev - 1);
    setActiveSolfejoStep(null);
    setClickedSolfejoStep(null);
  }, []);

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
  }, [isExerciseStarted, handleNext, handlePrev]);

  // Calculate current voicing
  const voicingResult = isExerciseStarted
    ? buildVoicing(exerciseConfig.key, currentDegree, exerciseConfig.voicingConfig)
    : { voices: [], span: 0, playable: true };

  // Calculate 2-octave scale starting from current degree root note aligned with chord frets
  const solfejoNotes = isExerciseStarted
    ? getTwoOctaveScale(exerciseConfig.key, currentDegree, voicingResult.voices)
    : [];

  // Calculate 2-octave arpeggio (1, 3, 5, 7) starting from lowest chord note
  const arpejoNotes = isExerciseStarted
    ? getArpeggioNotes(exerciseConfig.key, currentDegree, voicingResult.voices)
    : [];

  // Auto-play chord when chord/degree changes (only in chord mode)
  useEffect(() => {
    if (isExerciseStarted && studyMode === 'chord' && voicingResult.voices.length > 0) {
      playChord(voicingResult.voices);
    }
  }, [currentDegree, isExerciseStarted, studyMode]);

  const chordName = isExerciseStarted ? getChordName(exerciseConfig.key, currentDegree) : '';
  const quality = isExerciseStarted ? analyzeChordQuality(exerciseConfig.key, currentDegree) : null;
  const degreeName = getDegreeName(currentDegree);
  const modeName = getModeName(currentDegree);
  const diatonicChords = isExerciseStarted ? getDiatonicChords(exerciseConfig.key) : [];

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
                    setActiveSolfejoStep(null);
                    setClickedSolfejoStep(null);
                  }}
                >
                  🎸 Acordes (Harmonia)
                </button>
                <button
                  className={`mode-btn ${studyMode === 'solfejo' ? 'active' : ''}`}
                  onClick={() => {
                    setStudyMode('solfejo');
                    setActiveSolfejoStep(null);
                    setClickedSolfejoStep(null);
                  }}
                >
                  🎼 Solfejo da Escala
                </button>
                <button
                  className={`mode-btn ${studyMode === 'arpejo' ? 'active' : ''}`}
                  onClick={() => {
                    setStudyMode('arpejo');
                    setActiveSolfejoStep(null);
                    setClickedSolfejoStep(null);
                  }}
                >
                  🎹 Arpejo do Acorde (T&eacute;trade)
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
                selectedKey={exerciseConfig.key}
                voicing={voicingResult.voices}
                span={voicingResult.span}
                playable={voicingResult.playable}
              />
            )}
            {studyMode === 'solfejo' && (
              <SolfejoInfo
                selectedKey={exerciseConfig.key}
                currentDegree={currentDegree}
                chordName={chordName}
                quality={quality}
                modeName={modeName}
                solfejoNotes={solfejoNotes}
                activeSolfejoStep={activeSolfejoStep}
                clickedSolfejoStep={clickedSolfejoStep}
                onStepActive={(stepIndex) => setActiveSolfejoStep(stepIndex)}
                onNoteClick={(stepIndex) => setClickedSolfejoStep(stepIndex)}
                isPlaying={isSolfejoPlaying}
                setIsPlaying={setIsSolfejoPlaying}
              />
            )}
            {studyMode === 'arpejo' && (
              <ArpejoInfo
                selectedKey={exerciseConfig.key}
                currentDegree={currentDegree}
                chordName={chordName}
                quality={quality}
                degreeName={degreeName}
                arpejoNotes={arpejoNotes}
                activeStep={activeSolfejoStep}
                clickedStep={clickedSolfejoStep}
                onStepActive={(stepIndex) => setActiveSolfejoStep(stepIndex)}
                onNoteClick={(stepIndex) => setClickedSolfejoStep(stepIndex)}
                isPlaying={isSolfejoPlaying}
                setIsPlaying={setIsSolfejoPlaying}
              />
            )}

            {/* Fretboard */}
            <Fretboard
              voicing={voicingResult.voices}
              playable={voicingResult.playable}
              mode={studyMode}
              solfejoNotes={studyMode === 'arpejo' ? arpejoNotes : solfejoNotes}
              activeSolfejoStep={activeSolfejoStep}
              clickedSolfejoStep={clickedSolfejoStep}
              onSolfejoNoteClick={(stepIndex) => setClickedSolfejoStep(stepIndex)}
            />

            {/* Navigation & Diatonic Chords Bar (Available in BOTH modes) */}
            <Navigation
              currentDegree={currentDegree}
              selectedKey={exerciseConfig.key}
              diatonicChords={diatonicChords}
              onNext={handleNext}
              onPrev={handlePrev}
            />

            <div className="diatonic-bar">
              <h3>Campo Harm&ocirc;nico de {exerciseConfig.key} Maior (Selecione o Grau)</h3>
              <div className="diatonic-chords">
                {diatonicChords.map(c => (
                  <button
                    key={c.degree}
                    className={`diatonic-chip ${c.degree === currentDegree ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentDegree(c.degree);
                      setActiveSolfejoStep(null);
                      setClickedSolfejoStep(null);
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
