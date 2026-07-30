import { useState, useEffect, useCallback, useRef } from 'react';
import Fretboard from './components/Fretboard';
import ChordInfo from './components/ChordInfo';
import SolfejoInfo from './components/SolfejoInfo';
import ArpejoInfo from './components/ArpejoInfo';
import VoicingBar from './components/VoicingBar';
import TonalityFab from './components/TonalityFab';
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
  // Não há mais tela de configuração: o app abre direto no exercício, com uma
  // tonalidade padrão, e a troca acontece pelo botão flutuante.
  const [tonality, setTonality] = useState({ tonic: 'F', scale: 'major' });
  const [isTonalityOpen, setIsTonalityOpen] = useState(false);
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

  // Trocar de tonalidade recomeça o campo harmônico do grau I: o grau atual não
  // significa a mesma coisa noutra tonalidade.
  const changeTonality = useCallback((next) => {
    setTonality(next);
    setCurrentDegree(1);
    resetPlayback();
  }, [resetPlayback]);

  // Trocar o voicing move a caixa de posição em que a escala é gerada, então a
  // sequência tocando precisa morrer junto — senão o solfejo continua na posição
  // antiga enquanto o braço já mostra a nova.
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

  // Keyboard navigation (active in all modes)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Com o seletor aberto as setas pertencem ao círculo, não ao grau.
      if (isTonalityOpen) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); handleNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); handlePrev(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isTonalityOpen]);

  // Calculate current voicing
  const voicingResult = buildVoicing(tonality, currentDegree, buildVoicingConfig(bassString, bassTone));

  // Calculate 2-octave scale starting from current degree root note aligned with chord frets
  const solfejoNotes = getTwoOctaveScale(tonality, currentDegree, voicingResult.voices);

  // Calculate 2-octave arpeggio (1, 3, 5, 7) starting from lowest chord note
  const arpejoNotes = getArpeggioNotes(tonality, currentDegree, voicingResult.voices);

  // Auto-play chord when chord/degree changes (only in chord mode).
  // As vozes vão por ref de propósito: `voicingResult` é recalculado a cada render,
  // então como dependência ele dispararia um strum por render em vez de por grau.
  const voicesRef = useRef(voicingResult.voices);
  voicesRef.current = voicingResult.voices;

  useEffect(() => {
    if (studyMode === 'chord' && voicesRef.current.length > 0) {
      playChord(voicesRef.current);
    }
  }, [currentDegree, studyMode, tonality]);

  const chordName = getChordName(tonality, currentDegree);
  const quality = analyzeChordQuality(tonality, currentDegree);
  const degreeName = getDegreeName(currentDegree, tonality);
  const modeName = getModeName(currentDegree, tonality);
  const diatonicChords = getDiatonicChords(tonality);
  const tonalityName = getTonalityName(tonality);

  return (
    <div className="app-container">
      {/* Título e modos na mesma linha: o cabeçalho gastava ~250px de altura
          só com marca, e no celular isso comia a primeira dobra inteira. */}
      <header>
        <h1>Guitar Harmony Study</h1>

        <div className="mode-toggle-group" role="radiogroup" aria-label="Modo de estudo">
          <button
            className={`mode-btn ${studyMode === 'chord' ? 'active' : ''}`}
            role="radio"
            aria-checked={studyMode === 'chord'}
            onClick={() => { setStudyMode('chord'); resetPlayback(); }}
          >
            Acordes
          </button>
          <button
            className={`mode-btn ${studyMode === 'solfejo' ? 'active' : ''}`}
            role="radio"
            aria-checked={studyMode === 'solfejo'}
            onClick={() => { setStudyMode('solfejo'); resetPlayback(); }}
          >
            Solfejo
          </button>
          <button
            className={`mode-btn ${studyMode === 'arpejo' ? 'active' : ''}`}
            role="radio"
            aria-checked={studyMode === 'arpejo'}
            onClick={() => { setStudyMode('arpejo'); resetPlayback(); }}
          >
            Arpejo
          </button>
        </div>
      </header>

      <main>
        <div className="exercise-area">
            {/* O acorde ativo é o herói e o alvo da navegação: as setas ladeiam
                ele em vez de morarem num painel separado. */}
            <div className="degree-nav">
              <button className="degree-arrow" onClick={handlePrev} aria-label="Grau anterior">
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

            {/* Só no modo Acordes. Fora dele o acorde não está na tela, e as três
                posições de referência colapsam em duas escalas — o solfejo 3NPS
                precisa de 5 cordas consecutivas, então só pode nascer na 6ª ou na
                5ª. Três botões para duas saídas é promessa falsa. */}
              </div>

              <button className="degree-arrow" onClick={handleNext} aria-label="Próximo grau">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            {/* Um bloco só de controles, acima do braço: grau e voicing juntos.
                Antes eram dois painéis, um acima e outro abaixo do braço, com o
                grau ainda declarado num terceiro lugar. */}
            <div className="control-bar">
              <div className="control-head">
                <span className="control-label">Campo Harm&ocirc;nico de {tonalityName}</span>
              </div>

          {/* Um só controle de grau. Os sete chips já são o indicador de
              progresso — melhor que sete pontos anônimos — e as setas ladeiam
              eles em vez de morarem num painel próprio. */}
          <div className="control-row">
            <div className="degree-row">

              <div className="diatonic-chords" role="radiogroup" aria-label="Grau do campo harmônico">
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

            {/* Fretboard */}
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
        <p>Use <kbd>&larr;</kbd> <kbd>&rarr;</kbd> para navegar entre graus</p>
      </footer>
    </div>
  );
}

export default App;
