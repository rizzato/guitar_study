import { playNote, playChord } from '../lib/audioEngine';

export default function ChordInfo({ chordName, quality, currentDegree, degreeName, selectedKey, voicing, span, playable }) {
  if (!quality || !voicing.length) return null;

  return (
    <div className={`chord-info glass-panel ${!playable ? 'unplayable' : ''}`}>
      {!playable && (
        <div className="playability-warning">
          <span className="warning-icon">&#9888;</span>
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
          >
            🔊
          </button>
        </div>
        <div className="chord-meta">
          <span className="degree-badge">Grau {currentDegree}</span>
          <span className="degree-name">{degreeName}</span>
          <span className="key-context">em {selectedKey} maior</span>
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
