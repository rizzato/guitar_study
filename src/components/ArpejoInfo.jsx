import { playNote, playScaleSequence } from '../lib/audioEngine';
import { useTranslation } from '../lib/i18n';

export default function ArpejoInfo({
  tonalityName,
  currentDegree,
  chordName,
  quality,
  arpejoNotes = [],
  activeStep = null,
  onStepActive = () => {},
  onNoteToggle = () => {},
  isPlaying = false,
  setIsPlaying = () => {},
}) {
  const { t } = useTranslation();
  const rootNote = arpejoNotes[0]?.note || '';

  const handlePlayArpeggio = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    playScaleSequence(
      arpejoNotes,
      (stepIndex) => onStepActive(stepIndex),
      () => {
        setIsPlaying(false);
      },
      320
    );
  };

  return (
    <div className="chord-info glass-panel arpejo-info">
      <div className="chord-header">
        <div className="chord-name-block">
          <h2 className="chord-name">{t('arpejoTitle', { chord: chordName })}</h2>
          <span className="roman-numeral">{quality?.roman}</span>
          <button
            className={`play-chord-btn ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlayArpeggio}
            title={t('playArpejo')}
            disabled={isPlaying}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="7 4 20 12 7 20"></polygon>
            </svg>
            {isPlaying ? t('playing') : t('playArpejo')}
          </button>
        </div>
        <div className="chord-meta">
          <span className="degree-badge">{t('degreeBadge', { degree: currentDegree })} ({quality?.roman})</span>
          <span className="degree-name">{t('tetradLabel')}</span>
          <span className="key-context">{t('keyContext', { tonality: tonalityName })}</span>
        </div>
        <p className="quality-name">
          {t('arpejoDescription', { root: rootNote })}
        </p>
      </div>

      <div className="chord-voices">
        <h3>{t('arpejoNotesTitle')}</h3>
        <div className="solfejo-steps-grid">
          {arpejoNotes.map((s) => {
            const isLit = s.stepIndex === activeStep;
            const toneClass = `tone-${s.chordTone || 1}`;
            return (
              <button
                key={s.stepIndex}
                className={`solfejo-step-chip ${toneClass} ${isLit ? 'active' : ''}`}
                onClick={() => {
                  playNote(s.string, s.fret);
                  onNoteToggle(s.stepIndex);
                }}
                title={t('arpejoStepTitle', { num: s.stepIndex + 1, note: s.note, label: s.chordToneLabel, string: s.string, fret: s.fret })}
              >
                <span className="step-num">{s.chordToneLabel}</span>
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
