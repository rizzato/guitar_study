import { playNote, playScaleSequence } from '../lib/audioEngine';

export default function ArpejoInfo({
  selectedKey,
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
          <h2 className="chord-name">Arpejo de {chordName}</h2>
          <span className="roman-numeral">{quality?.roman}</span>
          <button
            className={`play-chord-btn ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlayArpeggio}
            title="Tocar arpejo da tétrade"
            disabled={isPlaying}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="7 4 20 12 7 20"></polygon>
            </svg>
            {isPlaying ? 'Tocando…' : 'Tocar Arpejo'}
          </button>
        </div>
        <div className="chord-meta">
          <span className="degree-badge">Grau {currentDegree} ({quality?.roman})</span>
          <span className="degree-name">T&eacute;trade (1 &bull; 3 &bull; 5 &bull; 7)</span>
          <span className="key-context">em {selectedKey} maior</span>
        </div>
        <p className="quality-name">
          T&ocirc;nica, Ter&ccedil;a, Quinta e S&eacute;tima ascendentes em 2 oitavas a partir da nota mais grave ({rootNote}).
          Clique em qualquer nota no bra&ccedil;o ou no bot&atilde;o de som para ouvir.
        </p>
      </div>

      <div className="chord-voices">
        <h3>Notas do Arpejo (T&eacute;trade asc.)</h3>
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
                title={`Passo ${s.stepIndex + 1}: ${s.note} (${s.chordToneLabel}) - Corda ${s.string}, Traste ${s.fret}`}
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
