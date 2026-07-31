import {
  getBassStringOptions,
  getBassToneOptions,
  hasVoicingVariation,
  getVoicingFamily,
} from '../lib/musicTheory';
import { useTranslation } from '../lib/i18n';

export default function VoicingBar({ bassString, bassTone, onChange }) {
  const { t, lang } = useTranslation();
  const familyKey = getVoicingFamily(bassString, bassTone);
  const familyText = familyKey ? (t(familyKey) !== familyKey ? t(familyKey) : familyKey) : null;

  return (
    <div className="voicing-bar">
      <div className="voicing-field">
        <span className="voicing-label" id="vb-corda">{t('bassStringLabel')}</span>
        <div className="chip-row" role="radiogroup" aria-labelledby="vb-corda">
          {getBassStringOptions().map(s => {
            const avail = hasVoicingVariation(s.value, bassTone);
            const labelText = t('stringNumLabel', { num: s.value });
            return (
              <button
                key={s.value}
                className={`voicing-chip ${bassString === s.value ? 'on' : ''}`}
                role="radio"
                aria-checked={bassString === s.value}
                aria-label={t('stringAriaLabel', { num: s.value })}
                disabled={!avail}
                title={avail ? undefined : t('voicingUnavailable')}
                onClick={() => onChange({ bassString: s.value })}
              >
                {labelText}
              </button>
            );
          })}
        </div>
      </div>

      <div className="voicing-field">
        <span className="voicing-label" id="vb-baixo">{t('bassToneLabel')}</span>
        <div className="chip-row" role="radiogroup" aria-labelledby="vb-baixo">
          {getBassToneOptions(lang).map(b => {
            const avail = hasVoicingVariation(bassString, b.value);
            const hintText = t(`hint_${b.hintKey}`) || b.hint;
            return (
              <button
                key={b.value}
                className={`voicing-chip wide ${bassTone === b.value ? 'on' : ''}`}
                role="radio"
                aria-checked={bassTone === b.value}
                aria-label={`${b.label}, ${hintText}`}
                disabled={!avail}
                title={avail ? undefined : t('voicingUnavailable')}
                onClick={() => onChange({ bassTone: b.value })}
              >
                <span className="chip-tone">{b.value}</span>
                <span className="chip-hint">{hintText}</span>
              </button>
            );
          })}
        </div>
      </div>

      {familyText && <span className="voicing-family">{familyText}</span>}
    </div>
  );
}
