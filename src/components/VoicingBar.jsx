import {
  getBassStringOptions,
  getBassToneOptions,
  hasVoicingVariation,
  getVoicingFamily,
} from '../lib/musicTheory';

// Variações do mesmo acorde, logo acima do braço. Dois eixos que o violonista já
// usa: em qual corda cai o baixo (região) e qual grau está no baixo (inversão).
// Combinação sem forma digitável aparece desabilitada em vez de oferecer armadilha.
export default function VoicingBar({ bassString, bassTone, onChange }) {
  const family = getVoicingFamily(bassString, bassTone);

  return (
    <div className="voicing-bar">
      <div className="voicing-field">
        <span className="voicing-label" id="vb-corda">Baixo na corda</span>
        <div className="chip-row" role="radiogroup" aria-labelledby="vb-corda">
          {getBassStringOptions().map(s => {
            const avail = hasVoicingVariation(s.value, bassTone);
            return (
              <button
                key={s.value}
                className={`voicing-chip ${bassString === s.value ? 'on' : ''}`}
                role="radio"
                aria-checked={bassString === s.value}
                aria-label={`Baixo na ${s.label} corda`}
                disabled={!avail}
                title={avail ? undefined : 'Sem forma digitável nesta combinação'}
                onClick={() => onChange({ bassString: s.value })}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="voicing-field">
        <span className="voicing-label" id="vb-baixo">Grau no baixo</span>
        <div className="chip-row" role="radiogroup" aria-labelledby="vb-baixo">
          {getBassToneOptions().map(b => {
            const avail = hasVoicingVariation(bassString, b.value);
            return (
              <button
                key={b.value}
                className={`voicing-chip wide ${bassTone === b.value ? 'on' : ''}`}
                role="radio"
                aria-checked={bassTone === b.value}
                aria-label={`${b.label}, ${b.hint}`}
                disabled={!avail}
                title={avail ? undefined : 'Sem forma digitável nesta combinação'}
                onClick={() => onChange({ bassTone: b.value })}
              >
                <span className="chip-tone">{b.value}</span>
                <span className="chip-hint">{b.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      {family && <span className="voicing-family">{family}</span>}
    </div>
  );
}
