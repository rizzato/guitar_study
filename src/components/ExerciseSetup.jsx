import { useState } from 'react';
import { getStringInfo, getChordToneOptions } from '../lib/musicTheory';
import CircleOfFifths from './CircleOfFifths';

export default function ExerciseSetup({ onStart, initialSetup }) {
  const [tonality, setTonality] = useState(initialSetup?.tonality || { tonic: 'F', scale: 'major' });
  const [selectedStrings, setSelectedStrings] = useState(initialSetup?.selectedStrings || [6, 5, 4, 3]);
  const [assignments, setAssignments] = useState(initialSetup?.assignments || {
    6: 1,  // Tonica
    5: 5,  // Quinta
    4: 7,  // Setima
    3: 3,  // Terca
  });

  const strings = getStringInfo();
  const chordTones = getChordToneOptions();

  const toggleString = (stringNum) => {
    setSelectedStrings(prev => {
      if (prev.includes(stringNum)) {
        const next = prev.filter(s => s !== stringNum);
        const newAssignments = { ...assignments };
        delete newAssignments[stringNum];
        setAssignments(newAssignments);
        return next;
      } else {
        const next = [...prev, stringNum].sort((a, b) => b - a);
        setAssignments(prev => ({ ...prev, [stringNum]: 1 }));
        return next;
      }
    });
  };

  const updateAssignment = (stringNum, chordTone) => {
    setAssignments(prev => ({ ...prev, [stringNum]: Number(chordTone) }));
  };

  const handleStart = () => {
    const voicingConfig = selectedStrings
      .sort((a, b) => b - a)
      .map(s => ({ string: s, chordTone: assignments[s] || 1 }));
    onStart(
      { key: tonality, voicingConfig },
      { tonality, selectedStrings, assignments }
    );
  };

  return (
    <div className="setup-panel">
      <div className="setup-section">
        <label className="setup-label">Tonalidade</label>
        <CircleOfFifths tonality={tonality} onChange={setTonality} />
      </div>

      <div className="setup-section">
        <label className="setup-label">Cordas e Graus do Acorde</label>
        <div className="string-config">
          {strings.map(s => {
            const isSelected = selectedStrings.includes(s.string);
            return (
              <div key={s.string} className={`string-row ${isSelected ? 'active' : ''}`}>
                <button
                  className={`string-toggle ${isSelected ? 'on' : 'off'}`}
                  onClick={() => toggleString(s.string)}
                >
                  <span className="string-number">{s.string}</span>
                  <span className="string-note">{s.note}{s.octave}</span>
                </button>

                {isSelected && (
                  <select
                    className="chord-tone-select"
                    value={assignments[s.string] || 1}
                    onChange={e => updateAssignment(s.string, e.target.value)}
                  >
                    {chordTones.map(ct => (
                      <option key={ct.value} value={ct.value}>{ct.label}</option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        className="start-btn"
        onClick={handleStart}
        disabled={selectedStrings.length === 0}
      >
        <span>Iniciar Exerc&iacute;cio</span>
        <span className="start-arrow">&rarr;</span>
      </button>
    </div>
  );
}
