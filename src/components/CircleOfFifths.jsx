import { useTranslation } from '../lib/i18n';

// Ordem do círculo de quintas. Cada raio carrega a maior e a sua relativa menor,
// que é a mesma armadura — a forma do controle é a própria teoria que o app ensina.
const SPOKES = [
  { major: 'C',  minor: 'A'  },
  { major: 'G',  minor: 'E'  },
  { major: 'D',  minor: 'B'  },
  { major: 'A',  minor: 'F#' },
  { major: 'E',  minor: 'C#' },
  { major: 'B',  minor: 'G#' },
  { major: 'Gb', minor: 'Eb' },
  { major: 'Db', minor: 'Bb' },
  { major: 'Ab', minor: 'F'  },
  { major: 'Eb', minor: 'C'  },
  { major: 'Bb', minor: 'G'  },
  { major: 'F',  minor: 'D'  },
];

const SIZE = 440;
const C = SIZE / 2;

const R = {
  majorOut: 208, majorIn: 158,
  minorOut: 154, minorIn: 110,
};

const GAP_DEG = 2.2;
const rad = deg => (deg * Math.PI) / 180;

function polar(radius, deg) {
  const a = rad(deg - 90);
  return { x: C + radius * Math.cos(a), y: C + radius * Math.sin(a) };
}

function arcPath(rIn, rOut, midDeg, spanDeg) {
  const half = rad((spanDeg - GAP_DEG) / 2);
  const mid = rad(midDeg - 90);
  const a0 = mid - half;
  const a1 = mid + half;
  const big = spanDeg - GAP_DEG > 180 ? 1 : 0;
  const p = (r, a) => `${C + r * Math.cos(a)} ${C + r * Math.sin(a)}`;
  return [
    `M ${p(rIn, a0)}`,
    `L ${p(rOut, a0)}`,
    `A ${rOut} ${rOut} 0 ${big} 1 ${p(rOut, a1)}`,
    `L ${p(rIn, a1)}`,
    `A ${rIn} ${rIn} 0 ${big} 0 ${p(rIn, a0)}`,
    'Z',
  ].join(' ');
}

export default function CircleOfFifths({ tonality, onChange }) {
  const { t } = useTranslation();
  const isMinor = tonality.scale !== 'major';
  const spokeIndex = SPOKES.findIndex(s => (isMinor ? s.minor : s.major) === tonality.tonic);

  const pickTonic = (tonic, minor) => onChange({ tonic, scale: minor ? 'minorNatural' : 'major' });

  const handleKeyDown = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (step !== undefined) {
      e.preventDefault();
      const next = SPOKES[(spokeIndex + step + SPOKES.length) % SPOKES.length];
      pickTonic(isMinor ? next.minor : next.major, isMinor);
      return;
    }
    const spoke = SPOKES[spokeIndex] ?? SPOKES[0];
    if (e.key === 'ArrowUp' && isMinor) { e.preventDefault(); pickTonic(spoke.major, false); return; }
    if (e.key === 'ArrowDown' && !isMinor) { e.preventDefault(); pickTonic(spoke.minor, true); return; }
  };

  return (
    <div
      className="circle-focusable"
      role="group"
      aria-label={t('circleAriaGroup')}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <svg className="circle-fifths" viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <g role="radiogroup" aria-label={t('circleSpokeGroup')}>
          {SPOKES.map((s, i) => {
            const mid = i * 30;
            const majorOn = !isMinor && tonality.tonic === s.major;
            const minorOn = isMinor && tonality.tonic === s.minor;
            const mp = polar((R.majorOut + R.majorIn) / 2, mid);
            const np = polar((R.minorOut + R.minorIn) / 2, mid);

            return (
              <g key={s.major}>
                <path
                  className={`circle-sector outer ${majorOn ? 'on' : ''}`}
                  d={arcPath(R.majorIn, R.majorOut, mid, 30)}
                  role="radio" aria-checked={majorOn} aria-label={`${s.major} ${t('majorLabelSuffix')}`}
                  onClick={() => pickTonic(s.major, false)}
                />
                <text className={`circle-label major ${majorOn ? 'on' : ''}`} x={mp.x} y={mp.y}>{s.major}</text>

                <path
                  className={`circle-sector inner ${minorOn ? 'on' : ''}`}
                  d={arcPath(R.minorIn, R.minorOut, mid, 30)}
                  role="radio" aria-checked={minorOn} aria-label={`${s.minor} ${t('minorLabelSuffix')}`}
                  onClick={() => pickTonic(s.minor, true)}
                />
                <text className={`circle-label minor ${minorOn ? 'on' : ''}`} x={np.x} y={np.y}>{s.minor}m</text>
              </g>
            );
          })}
        </g>

        <text className="circle-center-tonic" x={C} y={C - 2}>
          {tonality.tonic}{isMinor ? 'm' : ''}
        </text>
        <circle className="circle-focus-ring" cx={C} cy={C} r={R.majorOut + 6} />
      </svg>
    </div>
  );
}
