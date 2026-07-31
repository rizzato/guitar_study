import { getStringInfo } from '../lib/musicTheory';
import { playNote } from '../lib/audioEngine';
import { useTranslation } from '../lib/i18n';

const FRET_COUNT = 17;
const FRET_MARKERS = [3, 5, 7, 9, 12, 15, 17];
const DOUBLE_MARKER = 12;

export default function Fretboard({
  voicing = [],
  playable = true,
  mode = 'chord',
  solfejoNotes = [],
  activeStep = null,
  onNoteToggle = () => {},
}) {
  const { t } = useTranslation();
  const strings = getStringInfo();
  const frets = Array.from({ length: FRET_COUNT + 1 }, (_, i) => i);

  const getActiveNote = (stringNum, fretNum) => {
    if (mode === 'solfejo' || mode === 'arpejo') {
      return solfejoNotes.find(v => v.string === stringNum && v.fret === fretNum);
    }
    return voicing.find(v => v.string === stringNum && v.fret === fretNum);
  };

  const getToneClass = (chordTone) => {
    switch (chordTone) {
      case 1: return 'tone-1';
      case 3: return 'tone-3';
      case 5: return 'tone-5';
      case 7: return 'tone-7';
      default: return 'tone-default';
    }
  };

  return (
    <div className={`fretboard-wrapper ${mode === 'chord' && !playable ? 'unplayable' : ''}`}>
      <div className="fretboard-container" aria-label={t('fretboardAria', { count: FRET_COUNT })}>
        {/* Open string labels */}
        <div className="open-string-labels">
          {strings.map(s => (
            <div key={s.string} className="open-label">
              {s.note}<sub>{s.octave}</sub>
            </div>
          ))}
          <div className="open-label fret-num-label"></div>
        </div>

        {/* Nut */}
        <div className="nut"></div>

        {/* Fretboard */}
        <div className="fretboard">
          {frets.map(fretNum => (
            <div key={fretNum} className={`fret-col ${fretNum === 0 ? 'open-col' : ''}`}>
              {/* String cells */}
              {strings.map(s => {
                const active = getActiveNote(s.string, fretNum);

                const isLit = (mode === 'solfejo' || mode === 'arpejo')
                  && active
                  && active.stepIndex === activeStep;

                let opacityClass = '';
                if ((mode === 'solfejo' || mode === 'arpejo') && active) {
                  opacityClass = isLit ? 'solfejo-lit' : 'solfejo-semi';
                } else if (mode === 'chord' && !playable) {
                  opacityClass = 'dim';
                }

                return (
                  <div key={s.string} className="fret-cell">
                    <div className={`string-line string-gauge-${s.string}`}></div>
                    {active && (
                      <div
                        className={`note-dot ${getToneClass(active.chordTone)} ${opacityClass}`}
                        onClick={() => {
                          playNote(s.string, fretNum);
                          if (mode === 'solfejo' || mode === 'arpejo') {
                            onNoteToggle(active.stepIndex);
                          }
                        }}
                        title={t('noteOnFret', { note: active.note, string: s.string, fret: fretNum })}
                      >
                        <span className="note-label">{active.note}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Fret marker */}
              {fretNum > 0 && FRET_MARKERS.includes(fretNum) && (
                <div className={`fret-marker-area ${fretNum === DOUBLE_MARKER ? 'double' : ''}`}>
                  <div className="marker-dot"></div>
                  {fretNum === DOUBLE_MARKER && <div className="marker-dot"></div>}
                </div>
              )}

              {/* Fret wire */}
              {fretNum > 0 && <div className="fret-wire"></div>}

              {/* Fret number */}
              <div className="fret-number">{fretNum}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
