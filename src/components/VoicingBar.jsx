import {
  getBassStringOptions,
  getBassToneOptions,
  hasVoicingVariation,
  getVoicingFamily,
} from '../lib/musicTheory';
import { useTranslation } from '../lib/i18n';

export default function VoicingBar({
  voicingMode = 'shortcuts',
  bassString = 6,
  bassTone = 1,
  manualConfig = [],
  onChange,
}) {
  const { t, lang } = useTranslation();

  const familyKey = getVoicingFamily(bassString, bassTone);
  const familyText = familyKey ? (t(familyKey) !== familyKey ? t(familyKey) : familyKey) : null;

  const strings = [6, 5, 4, 3, 2, 1];

  const handleManualStringChange = (stringNum, toneVal) => {
    const cleanConfig = manualConfig.filter(c => c.string !== stringNum);
    if (toneVal) {
      cleanConfig.push({ string: stringNum, chordTone: toneVal });
    }
    // Sort config by string descending (6, 5, 4, 3, 2, 1) or keep as is
    cleanConfig.sort((a, b) => b.string - a.string);
    onChange({ manualConfig: cleanConfig });
  };

  return (
    <div className="voicing-panel-container">
      {/* Mode Selector Tab */}
      <div className="voicing-mode-tabs">
        <button
          className={`voicing-tab-btn ${voicingMode === 'shortcuts' ? 'active' : ''}`}
          onClick={() => onChange({ voicingMode: 'shortcuts' })}
        >
          {lang === 'pt-BR' ? 'Atalhos Curados' : 'Curated Shortcuts'}
        </button>
        <button
          className={`voicing-tab-btn ${voicingMode === 'manual' ? 'active' : ''}`}
          onClick={() => onChange({ voicingMode: 'manual' })}
        >
          {lang === 'pt-BR' ? 'Intervalo por Corda' : 'Custom Intervals'}
        </button>
      </div>

      {voicingMode === 'shortcuts' ? (
        <div className="voicing-bar shortcuts-mode">
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
      ) : (
        <div className="voicing-bar manual-mode">
          <span className="voicing-label">
            {lang === 'pt-BR' 
              ? 'Atribua um grau (1, 3, 5, 7) para cada corda:' 
              : 'Assign an interval (1, 3, 5, 7) to each string:'}
          </span>
          <div className="manual-strings-grid">
            {strings.map(sNum => {
              const activeTone = manualConfig.find(c => c.string === sNum)?.chordTone || '';
              return (
                <div key={sNum} className="manual-string-col">
                  <label className="manual-string-label">
                    {t('stringNumLabel', { num: sNum })}
                  </label>
                  <div className="manual-select-wrapper">
                    <select
                      value={activeTone}
                      onChange={(e) => handleManualStringChange(sNum, e.target.value ? Number(e.target.value) : null)}
                      className="manual-select"
                    >
                      <option value="">{lang === 'pt-BR' ? 'Muda (X)' : 'Mute'}</option>
                      <option value="1">1 (Tônica)</option>
                      <option value="3">3 (Terça)</option>
                      <option value="5">5 (Quinta)</option>
                      <option value="7">7 (Sétima)</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
