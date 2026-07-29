import { useState } from 'react';
import CircleOfFifths from './CircleOfFifths';

export default function ExerciseSetup({ onStart, initialSetup }) {
  const [tonality, setTonality] = useState(initialSetup?.tonality || { tonic: 'F', scale: 'major' });

  return (
    <div className="setup-panel">
      <div className="setup-section">
        <label className="setup-label">Tonalidade</label>
        <CircleOfFifths tonality={tonality} onChange={setTonality} />
      </div>

      <button className="start-btn" onClick={() => onStart(tonality)}>
        <span>Iniciar Exerc&iacute;cio</span>
        <span className="start-arrow">&rarr;</span>
      </button>
    </div>
  );
}
