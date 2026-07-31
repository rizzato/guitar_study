import { useState, useEffect, useCallback, useRef } from 'react';
import Fretboard from './components/Fretboard';
import ChordInfo from './components/ChordInfo';
import SolfejoInfo from './components/SolfejoInfo';
import ArpejoInfo from './components/ArpejoInfo';
import VoicingBar from './components/VoicingBar';
import VoicingPreview from './components/VoicingPreview';
import CircleOfFifths from './components/CircleOfFifths';
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

  const [fields, setFields] = useState(() => [
    {
      id: 1,
      tonality: { tonic: 'F', scale: 'major' },
      voicingMode: 'shortcuts', // 'shortcuts' | 'manual'
      bassString: 6,
      bassTone: 1,
      manualConfig: [
        { string: 6, chordTone: 1 },
        { string: 4, chordTone: 7 },
        { string: 3, chordTone: 3 },
        { string: 2, chordTone: 5 }
      ],
      currentDegree: 1
    }
  ]);
  const [activeFieldIndex, setActiveFieldIndex] = useState(0);
  const [isTonalityOpen, setIsTonalityOpen] = useState(false);
  const [studyMode, setStudyMode] = useState('chord'); // 'chord' | 'solfejo' | 'arpejo'

  const [activeStep, setActiveStep] = useState(null);
  const [isSolfejoPlaying, setIsSolfejoPlaying] = useState(false);
  const [playTrigger, setPlayTrigger] = useState(0);

  // Temporary configuration for the new field being created in the modal
  const [modalVoicing, setModalVoicing] = useState({
    voicingMode: 'shortcuts',
    bassString: 6,
    bassTone: 1,
    manualConfig: [
      { string: 6, chordTone: 1 },
      { string: 4, chordTone: 7 },
      { string: 3, chordTone: 3 },
      { string: 2, chordTone: 5 }
    ]
  });

  const toggleStep = useCallback((stepIndex) => {
    setActiveStep(prev => (prev === stepIndex ? null : stepIndex));
  }, []);

  const resetPlayback = useCallback(() => {
    stopScaleSequence();
    setActiveStep(null);
    setIsSolfejoPlaying(false);
  }, []);

  const addField = useCallback((nextTonality) => {
    setFields(prev => {
      const newField = {
        id: Date.now() + Math.random(),
        tonality: nextTonality,
        voicingMode: modalVoicing.voicingMode,
        bassString: modalVoicing.bassString,
        bassTone: modalVoicing.bassTone,
        manualConfig: modalVoicing.manualConfig,
        currentDegree: 1
      };
      const updated = [...prev, newField];
      setActiveFieldIndex(updated.length - 1);
      return updated;
    });
    resetPlayback();
    setPlayTrigger(prev => prev + 1);
  }, [modalVoicing, resetPlayback]);

  const selectFieldDegree = useCallback((fieldIndex, degree) => {
    setActiveFieldIndex(fieldIndex);
    setFields(prev => {
      const nextFields = [...prev];
      if (nextFields[fieldIndex]) {
        nextFields[fieldIndex] = {
          ...nextFields[fieldIndex],
          currentDegree: degree
        };
      }
      return nextFields;
    });
    resetPlayback();
    setPlayTrigger(prev => prev + 1);
  }, [resetPlayback]);

  const handleNext = useCallback(() => {
    setFields(prev => {
      const nextFields = [...prev];
      const activeField = nextFields[activeFieldIndex];
      if (activeField) {
        nextFields[activeFieldIndex] = {
          ...activeField,
          currentDegree: (activeField.currentDegree % 7) + 1
        };
      }
      return nextFields;
    });
    resetPlayback();
    setPlayTrigger(prev => prev + 1);
  }, [activeFieldIndex, resetPlayback]);

  const handlePrev = useCallback(() => {
    setFields(prev => {
      const nextFields = [...prev];
      const activeField = nextFields[activeFieldIndex];
      if (activeField) {
        nextFields[activeFieldIndex] = {
          ...activeField,
          currentDegree: activeField.currentDegree === 1 ? 7 : activeField.currentDegree - 1
        };
      }
      return nextFields;
    });
    resetPlayback();
    setPlayTrigger(prev => prev + 1);
  }, [activeFieldIndex, resetPlayback]);

  const handleUp = useCallback(() => {
    setActiveFieldIndex(prev => (prev === 0 ? prev : prev - 1));
    resetPlayback();
    setPlayTrigger(prev => prev + 1);
  }, [resetPlayback]);

  const handleDown = useCallback(() => {
    setActiveFieldIndex(prev => (prev === fields.length - 1 ? prev : prev + 1));
    resetPlayback();
    setPlayTrigger(prev => prev + 1);
  }, [fields.length, resetPlayback]);

  const deleteField = useCallback((indexToDelete) => {
    if (fields.length <= 1) return;
    setFields(prev => prev.filter((_, idx) => idx !== indexToDelete));
    setActiveFieldIndex(prev => {
      if (prev >= fields.length - 1) return fields.length - 2;
      return prev;
    });
    resetPlayback();
    setPlayTrigger(prev => prev + 1);
  }, [fields.length, resetPlayback]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTonalityOpen) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); handleNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); handlePrev(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); handleUp(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); handleDown(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleUp, handleDown, isTonalityOpen]);

  const activeField = fields[activeFieldIndex] || fields[0];

  const chordName = getChordName(activeField.tonality, activeField.currentDegree);
  const quality = analyzeChordQuality(activeField.tonality, activeField.currentDegree, lang);
  const degreeName = getDegreeName(activeField.currentDegree, activeField.tonality, lang);
  const modeName = getModeName(activeField.currentDegree, activeField.tonality, lang);
  const tonalityName = getTonalityName(activeField.tonality);

  const isMinorChord = quality && quality.intervals && quality.intervals.third === 3;
  const isSolfejoOrArpejo = studyMode === 'solfejo' || studyMode === 'arpejo';

  // Transient state for minor scale form (Natural, Harmonic, Melodic)
  const [minorForm, setMinorForm] = useState('minorNatural');

  useEffect(() => {
    setMinorForm('minorNatural');
  }, [activeFieldIndex, activeField.currentDegree, studyMode]);

  const studyKey = (isMinorChord && isSolfejoOrArpejo)
    ? { tonic: quality.root, scale: minorForm }
    : activeField.tonality;

  const studyDegree = (isMinorChord && isSolfejoOrArpejo)
    ? 1
    : activeField.currentDegree;

  const voicingConfig = activeField.voicingMode === 'manual'
    ? activeField.manualConfig
    : buildVoicingConfig(activeField.bassString, activeField.bassTone);

  const voicingResult = buildVoicing(activeField.tonality, activeField.currentDegree, voicingConfig);
  const solfejoNotes = getTwoOctaveScale(studyKey, studyDegree, voicingResult.voices);
  const arpejoNotes = getArpeggioNotes(studyKey, studyDegree, voicingResult.voices);

  const voicesRef = useRef(voicingResult.voices);
  voicesRef.current = voicingResult.voices;

  useEffect(() => {
    if (studyMode === 'chord' && voicesRef.current.length > 0) {
      playChord(voicesRef.current);
    }
  }, [activeField.currentDegree, studyMode, activeField.tonality, activeField.bassString, activeField.bassTone, activeField.voicingMode, activeField.manualConfig, playTrigger]);

  // Compute coloring for repeating chords across the stack
  const chordColors = (() => {
    const chordCounts = {};
    const colors = [
      '#1e40af', // Deep Blue
      '#065f46', // Emerald
      '#854d0e', // Amber/Brown
      '#701a75', // Purple
      '#991b1b', // Red-brown
      '#3730a3', // Indigo-violet
      '#155e75', // Dark Cyan
      '#581c87', // Plum
    ];

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

    return colorMap;
  })();

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
          {/* Stacked Harmonic Fields */}
          <div className="harmonic-stack-container">
            <div className="stack-header">
              <h2>{lang === 'pt-BR' ? 'Campos Harmônicos' : 'Harmonic Fields'}</h2>
              <button
                className="add-stack-btn"
                onClick={() => setIsTonalityOpen(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                {lang === 'pt-BR' ? 'Adicionar Campo' : 'Add Field'}
              </button>
            </div>

            <div className="harmonic-stack">
              {fields.map((field, index) => {
                const fieldChords = getDiatonicChords(field.tonality, lang);
                const isFieldActive = index === activeFieldIndex;
                const fName = getTonalityName(field.tonality);

                return (
                  <div
                    key={field.id}
                    className={`stack-row ${isFieldActive ? 'active' : ''}`}
                    onClick={() => {
                      if (!isFieldActive) {
                        setActiveFieldIndex(index);
                        resetPlayback();
                        setPlayTrigger(prev => prev + 1);
                      }
                    }}
                  >
                    <div className="stack-row-header">
                      <span className="stack-row-title">
                        {fName}
                        {studyMode === 'chord' && (
                          <span className="stack-row-subtitle-voicing">
                            {field.voicingMode === 'manual'
                              ? ` (${lang === 'pt-BR' ? 'Personalizado' : 'Custom'})`
                              : ` (B:${field.bassString}ª, Inversão:${field.bassTone})`}
                          </span>
                        )}
                      </span>
                      <div className="stack-row-actions">
                        {fields.length > 1 && (
                          <button
                            className="stack-row-btn delete-btn"
                            title={lang === 'pt-BR' ? 'Remover campo' : 'Remove field'}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteField(index);
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="stack-row-body-wrapper">
                      {isFieldActive ? (
                        <button
                          className="row-nav-arrow left"
                          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                          aria-label={t('prevDegree')}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="15 18 9 12 15 6"></polyline>
                          </svg>
                        </button>
                      ) : (
                        <div className="row-nav-arrow-placeholder" />
                      )}

                      <div className="diatonic-chords" role="radiogroup" aria-label={t('harmonicFieldGroup')}>
                        {fieldChords.map(c => {
                          const isSelected = isFieldActive && c.degree === field.currentDegree;
                          const repeatColor = chordColors[c.chordName];
                          const chipStyle = repeatColor ? { border: `2px solid ${repeatColor}`, boxShadow: `0 0 10px ${repeatColor}66` } : {};

                          return (
                            <button
                              key={c.degree}
                              className={`diatonic-chip ${isSelected ? 'active' : ''}`}
                              style={chipStyle}
                              role="radio"
                              aria-checked={isSelected}
                              onClick={(e) => {
                                e.stopPropagation();
                                selectFieldDegree(index, c.degree);
                              }}
                            >
                              <span className="chip-roman">{c.quality.roman}</span>
                              <span className="chip-name">{c.chordName}</span>
                            </button>
                          );
                        })}
                      </div>

                      {isFieldActive ? (
                        <button
                          className="row-nav-arrow right"
                          onClick={(e) => { e.stopPropagation(); handleNext(); }}
                          aria-label={t('nextDegree')}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </button>
                      ) : (
                        <div className="row-nav-arrow-placeholder" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Fretboard
            voicing={voicingResult.voices}
            playable={voicingResult.playable}
            mode={studyMode}
            solfejoNotes={studyMode === 'arpejo' ? arpejoNotes : solfejoNotes}
            activeStep={activeStep}
            onNoteToggle={toggleStep}
          />

          {/* Bottom Presentation Window */}
          <div className="bottom-presentation-container">
            {isMinorChord && isSolfejoOrArpejo && (
              <div className="minor-form-selector-bar">
                <span className="selector-bar-label">
                  {lang === 'pt-BR' ? 'Variação da Escala Menor:' : 'Minor Scale Variation:'}
                </span>
                <div className="minor-form-buttons">
                  <button
                    className={`minor-form-btn ${minorForm === 'minorNatural' ? 'active' : ''}`}
                    onClick={() => {
                      setMinorForm('minorNatural');
                      resetPlayback();
                      setPlayTrigger(prev => prev + 1);
                    }}
                  >
                    {lang === 'pt-BR' ? 'Natural' : 'Natural'}
                  </button>
                  <button
                    className={`minor-form-btn ${minorForm === 'minorHarmonic' ? 'active' : ''}`}
                    onClick={() => {
                      setMinorForm('minorHarmonic');
                      resetPlayback();
                      setPlayTrigger(prev => prev + 1);
                    }}
                  >
                    {lang === 'pt-BR' ? 'Harmônica' : 'Harmonic'}
                  </button>
                  <button
                    className={`minor-form-btn ${minorForm === 'minorMelodic' ? 'active' : ''}`}
                    onClick={() => {
                      setMinorForm('minorMelodic');
                      resetPlayback();
                      setPlayTrigger(prev => prev + 1);
                    }}
                  >
                    {lang === 'pt-BR' ? 'Melódica' : 'Melodic'}
                  </button>
                </div>
              </div>
            )}

            <div className="degree-nav-panel compact">
              {studyMode === 'chord' && (
                <ChordInfo
                  chordName={chordName}
                  quality={quality}
                  currentDegree={activeField.currentDegree}
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
                  currentDegree={activeField.currentDegree}
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
                  currentDegree={activeField.currentDegree}
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
          </div>
        </div>
      </main>

      {/* Two-column Interactive configuration modal */}
      {isTonalityOpen && (
        <div className="tonality-overlay" onClick={() => setIsTonalityOpen(false)}>
          <div className="tonality-panel modal-config-panel animate-modal-enter" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{lang === 'pt-BR' ? 'Configurar Novo Campo Harmônico' : 'Configure New Harmonic Field'}</h3>
              <button className="close-modal-btn" onClick={() => setIsTonalityOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body-layout">
              {/* Left Column: Voicing Setup */}
              <div className="modal-voicing-section">
                <h4>{lang === 'pt-BR' ? '1. Escolha a Categoria e Vozes' : '1. Choose Voicing & Category'}</h4>
                <VoicingBar
                  voicingMode={modalVoicing.voicingMode}
                  bassString={modalVoicing.bassString}
                  bassTone={modalVoicing.bassTone}
                  manualConfig={modalVoicing.manualConfig}
                  onChange={(updated) => setModalVoicing(prev => ({ ...prev, ...updated }))}
                />
                <VoicingPreview
                  voicingMode={modalVoicing.voicingMode}
                  bassString={modalVoicing.bassString}
                  bassTone={modalVoicing.bassTone}
                  manualConfig={modalVoicing.manualConfig}
                />
              </div>

              {/* Right Column: Key Selection (Circle of Fifths) */}
              <div className="modal-key-section">
                <h4>{lang === 'pt-BR' ? '2. Escolha o Campo (Clique no Ciclo de Quintas)' : '2. Select Key (Click on Circle of Fifths)'}</h4>
                <CircleOfFifths
                  tonality={{ tonic: 'C', scale: 'major' }} // Standard neutral starting key in the wheel
                  onChange={(nextKey) => {
                    addField(nextKey);
                    setIsTonalityOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <footer>
        <p>{t('footerNav', { left: '←', right: '→' })}</p>
      </footer>
    </div>
  );
}

export default App;