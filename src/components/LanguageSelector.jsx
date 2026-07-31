import { useTranslation, LANGUAGES } from '../lib/i18n';

export default function LanguageSelector() {
  const { lang, setLanguage } = useTranslation();

  return (
    <div className="language-selector" role="radiogroup" aria-label="Idioma / Language">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          className={`lang-btn ${lang === l.code ? 'active' : ''}`}
          role="radio"
          aria-checked={lang === l.code}
          onClick={() => setLanguage(l.code)}
          title={l.label}
        >
          <span className="lang-flag">{l.flag}</span>
          <span className="lang-code">{l.short}</span>
        </button>
      ))}
    </div>
  );
}
