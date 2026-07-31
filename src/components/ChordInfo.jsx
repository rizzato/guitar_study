import { playNote, playChord } from '../lib/audioEngine';

export default function ChordInfo({ chordName, quality, currentDegree, degreeName, tonalityName, voicing, span, playable }) {
  if (!quality || !voicing.length) return null;

  return (
    <div className={`chord-info glass-panel ${!playable ? 'unplayable' : ''}`}>
      {!playable && (
        <div className="playability-warning" role="alert">
          <svg className="warning-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>
            Abertura de <strong>{span} trastes</strong> &mdash; excede o m&aacute;ximo de 5 casas.
            Este acorde n&atilde;o &eacute; execut&aacute;vel nesta disposi&ccedil;&atilde;o.
          </span>
        </div>
      )}

      <div className="chord-header">
        <div className="chord-name-block">
          <h2 className="chord-name">{chordName}</h2>
          <span className="roman-numeral">{quality.roman}</span>
          <button
            className="play-chord-btn"
            onClick={() => playChord(voicing)}
            title="Tocar este acorde"
            aria-label={`Tocar o acorde ${chordName}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="7 4 20 12 7 20"></polygon>
            </svg>
          </button>
        </div>
        <div className="chord-meta">
          <span className="degree-badge">Grau {currentDegree}</span>
          <span className="degree-name">{degreeName}</span>
          <span className="key-context">em {tonalityName}</span>
        </div>
        <p className="quality-name">{quality.name}</p>
        {playable && (
          <p className="span-info">Abertura: {span} {span === 1 ? 'traste' : 'trastes'}</p>
        )}
      </div>

      <div className="chord-voices">
        <h3>Vozes do Acorde (clique para ouvir a nota)</h3>
        <div className="voices-grid">
          {[...voicing].sort((a, b) => b.string - a.string).map(v => (
            <div
              key={v.string}
              className={`voice-card tone-${v.chordTone} clickable`}
              onClick={() => playNote(v.string, v.fret)}
              title={`Ouvir ${v.note}`}
            >
              <div className="voice-string">{v.string}&ordf; corda</div>
              <div className="voice-note">{v.note}</div>
              <div className="voice-info">
                <span className="voice-fret">Traste {v.fret}</span>
                <span className="voice-interval">{v.chordToneLabel}</span>
                <span className="voice-interval-detail">{v.intervalName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
