import { useState, useEffect, useCallback, useRef } from 'react';
import Fretboard from './components/Fretboard';
import ChordInfo from './components/ChordInfo';
import SolfejoInfo from './components/SolfejoInfo';
import ArpejoInfo from './components/ArpejoInfo';
import VoicingBar from './components/VoicingBar';
import TonalityFab from './components/TonalityFab';
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from './lib/i18n';
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
  const { t, lang } = useTranslation();
  const [tonality, setTonality] = useState({ tonic: 'F', scale: 'major' });
  const [isTonalityOpen, setIsTonalityOpen] = useState(false);
  const [currentDegree, setCurrentDegree] = useState(1);
  const [studyMode, setStudyMode] = useState('chord'); // 'chord' | 'solfejo' | 'arpejo'

  const [bassString, setBassString] = useState(6);
  const [bassTone, setBassTone] = useState(1);

  const [activeStep, setActiveStep] = useState(null);
  const [isSolfejoPlaying, setIsSolfejoPlaying] = useState(false);

  const toggleStep = useCallback((stepIndex) => {
    setActiveStep(prev => (prev === stepIndex ? null : stepIndex));
  }, []);

  const resetPlayback = useCallback(() => {
    stopScaleSequence();
    setActiveStep(null);
    setIsSolfejoPlaying(false);
  }, []);

  const changeTonality = useCallback((next) => {
    setTonality(next);
    setCurrentDegree(1);
    resetPlayback();
  }, [resetPlayback]);

  const changeVoicing = useCallback((next) => {
    if (next.bassString !== undefined) setBassString(next.bassString);
    if (next.bassTone !== undefined) setBassTone(next.bassTone);
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTonalityOpen) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); handleNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); handlePrev(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isTonalityOpen]);

  const voicingResult = buildVoicing(tonality, currentDegree, buildVoicingConfig(bassString, bassTone));
  const solfejoNotes = getTwoOctaveScale(tonality, currentDegree, voicingResult.voices);
  const arpejoNotes = getArpeggioNotes(tonality, currentDegree, voicingResult.voices);

  const voicesRef = useRef(voicingResult.voices);
  voicesRef.current = voicingResult.voices;

  useEffect(() => {
    if (studyMode === 'chord' && voicesRef.current.length > 0) {
      playChord(voicesRef.current);
    }
  }, [currentDegree, studyMode, tonality]);

  const chordName = getChordName(tonality, currentDegree);
  const quality = analyzeChordQuality(tonality, currentDegree, lang);
  const degreeName = getDegreeName(currentDegree, tonality, lang);
  const modeName = getModeName(currentDegree, tonality, lang);
  const diatonicChords = getDiatonicChords(tonality, lang);
  const tonalityName = getTonalityName(tonality);

  return (
    <div className="app-container">
      <header>
        <div className="brand-block">
          <h1>{t('appTitle')}</h1>
        </div>

        <div className="header-controls">
          <div className="mode-toggle-group" role="radiogroup" aria-label={t('studyModeGroupLabel')}>
            <button
              className={`mode-btn ${studyMode === 'chord' ? 'active' : ''}`}
              role="radio"
              aria-checked={studyMode === 'chord'}
              onClick={() => { setStudyMode('chord'); resetPlayback(); }}
            >
              {t('modeChord')}
            </button>
            <button
              className={`mode-btn ${studyMode === 'solfejo' ? 'active' : ''}`}
              role="radio"
              aria-checked={studyMode === 'solfejo'}
              onClick={() => { setStudyMode('solfejo'); resetPlayback(); }}
            >
              {t('modeSolfejo')}
            </button>
            <button
              className={`mode-btn ${studyMode === 'arpejo' ? 'active' : ''}`}
              role="radio"
              aria-checked={studyMode === 'arpejo'}
              onClick={() => { setStudyMode('arpejo'); resetPlayback(); }}
            >
              {t('modeArpejo')}
            </button>
          </div>

          <LanguageSelector />
        </div>
      </header>

      <main>
        <div className="exercise-area">
          <div className="degree-nav">
            <button className="degree-arrow" onClick={handlePrev} aria-label={t('prevDegree')}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div className="degree-nav-panel">
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
            </div>

            <button className="degree-arrow" onClick={handleNext} aria-label={t('nextDegree')}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <div className="control-bar">
            <div className="control-head">
              <span className="control-label">{t('harmonicFieldTitle', { tonality: tonalityName })}</span>
            </div>

            <div className="control-row">
              <div className="degree-row">
                <div className="diatonic-chords" role="radiogroup" aria-label={t('harmonicFieldGroup')}>
                  {diatonicChords.map(c => (
                    <button
                      key={c.degree}
                      className={`diatonic-chip ${c.degree === currentDegree ? 'active' : ''}`}
                      role="radio"
                      aria-checked={c.degree === currentDegree}
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

            {studyMode === 'chord' && (
              <VoicingBar
                bassString={bassString}
                bassTone={bassTone}
                onChange={changeVoicing}
              />
            )}
          </div>

          <Fretboard
            voicing={voicingResult.voices}
            playable={voicingResult.playable}
            mode={studyMode}
            solfejoNotes={studyMode === 'arpejo' ? arpejoNotes : solfejoNotes}
            activeStep={activeStep}
            onNoteToggle={toggleStep}
          />
        </div>
      </main>

      <TonalityFab
        tonality={tonality}
        onChange={changeTonality}
        open={isTonalityOpen}
        onOpenChange={setIsTonalityOpen}
      />

      <footer>
        <p>{t('footerNav', { left: '←', right: '→' })}</p>
      </footer>
    </div>
  );
}

export default App;
