import { playNote, playScaleSequence } from '../lib/audioEngine';
import { useTranslation } from '../lib/i18n';

export default function SolfejoInfo({
  tonalityName,
  currentDegree,
  chordName,
  quality,
  modeName,
  solfejoNotes = [],
  activeStep = null,
  onStepActive = () => {},
  onNoteToggle = () => {},
  isPlaying = false,
  setIsPlaying = () => {},
}) {
  const { t } = useTranslation();
  const rootNote = solfejoNotes[0]?.note || '';

  const handlePlayScale = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    playScaleSequence(
      solfejoNotes,
      (stepIndex) => onStepActive(stepIndex),
      () => {
        setIsPlaying(false);
      },
      280
    );
  };

  return (
    <div className="chord-info glass-panel solfejo-info">
      <div className="chord-header">
        <div className="chord-name-block">
          <h2 className="chord-name">{t('scaleInRoot', { root: rootNote })}</h2>
          <span className="roman-numeral">{quality?.roman}</span>
          <button
            className={`play-chord-btn ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlayScale}
            title={t('playSolfejo')}
            disabled={isPlaying}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="7 4 20 12 7 20"></polygon>
            </svg>
            {isPlaying ? t('playing') : t('playSolfejo')}
          </button>
        </div>
        <div className="chord-meta">
          <span className="degree-badge">{t('degreeBadge', { degree: currentDegree })} ({chordName})</span>
          <span className="degree-name">{modeName}</span>
          <span className="key-context">{t('keyContext', { tonality: tonalityName })}</span>
        </div>
        <p className="quality-name">
          {t('solfejoDescription', { root: rootNote, roman: quality?.roman || '', tonality: tonalityName })}
        </p>
      </div>

      <div className="chord-voices">
        <h3>{t('solfejoSeqTitle')}</h3>
        <div className="solfejo-steps-grid">
          {solfejoNotes.map((s) => {
            const isLit = s.stepIndex === activeStep;
            const toneClass = s.chordTone > 0 ? `tone-${s.chordTone}` : 'tone-default';
            return (
              <button
                key={s.stepIndex}
                className={`solfejo-step-chip ${toneClass} ${isLit ? 'active' : ''}`}
                onClick={() => {
                  playNote(s.string, s.fret);
                  onNoteToggle(s.stepIndex);
                }}
                title={t('stepNumTitle', { num: s.stepIndex + 1, note: s.note, string: s.string, fret: s.fret })}
              >
                <span className="step-num">{s.stepIndex + 1}</span>
                <span className="step-note">{s.note}</span>
                <span className="step-string">C{s.string}:T{s.fret}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
