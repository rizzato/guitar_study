export default function Navigation({ currentDegree, selectedKey, diatonicChords, onNext, onPrev }) {
  const currentChord = diatonicChords.find(c => c.degree === currentDegree);

  return (
    <div className="navigation glass-panel">
      <button className="nav-btn nav-prev" onClick={onPrev} title="Grau anterior (←)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Anterior</span>
      </button>

      <div className="nav-center">
        <div className="nav-degree-indicator">
          <span className="nav-roman">{currentChord?.quality.roman}</span>
          <span className="nav-divider">&bull;</span>
          <span className="nav-key">{selectedKey} maior</span>
        </div>
        <div className="nav-progress">
          {[1, 2, 3, 4, 5, 6, 7].map(d => (
            <div
              key={d}
              className={`progress-dot ${d === currentDegree ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      <button className="nav-btn nav-next" onClick={onNext} title="Pr&oacute;ximo grau (→)">
        <span>Pr&oacute;ximo</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
}
