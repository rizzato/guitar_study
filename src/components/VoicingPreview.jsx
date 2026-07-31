import React from 'react';
import { buildVoicing, buildVoicingConfig } from '../lib/musicTheory';
import { useTranslation } from '../lib/i18n';

export default function VoicingPreview({ voicingMode, bassString, bassTone, manualConfig }) {
  const { lang } = useTranslation();

  const config = voicingMode === 'manual'
    ? manualConfig
    : buildVoicingConfig(bassString, bassTone);

  // We use C Major degree 1 as a neutral key to compute the relative fret shapes
  const result = buildVoicing({ tonic: 'C', scale: 'major' }, 1, config);

  const playedVoices = result.voices.filter(v => v.fret !== null && v.fret > 0);

  if (playedVoices.length === 0) {
    return (
      <div className="voicing-preview-empty">
        <p>{lang === 'pt-BR' ? 'Nenhuma corda ativa' : 'No strings active'}</p>
      </div>
    );
  }

  const minFret = Math.min(...playedVoices.map(v => v.fret));

  // The 6th string (lowest pitch, thickest) is drawn at the top, and the 1st string (highest pitch, thinnest) is drawn at the bottom
  const strings = [6, 5, 4, 3, 2, 1];

  // Map chord tones to standard functional colors
  const toneColors = {
    1: 'var(--tone-root, #f59e0b)',
    3: 'var(--tone-third, #ec4899)',
    5: 'var(--tone-fifth, #06b6d4)',
    7: 'var(--tone-seventh, #a855f7)'
  };

  return (
    <div className={`voicing-preview-container ${!result.playable ? 'unplayable' : ''}`}>
      <div className="voicing-preview-header">
        <span className="voicing-preview-title">
          {lang === 'pt-BR' ? 'Desenho do Acorde (Preview)' : 'Chord Shape Preview'}
        </span>
        {!result.playable && (
          <span className="voicing-preview-alert">
            {lang === 'pt-BR' ? 'Incompatível/Difícil' : 'Stretch / Complex'}
          </span>
        )}
      </div>

      <div className="voicing-preview-grid-wrapper">
        <svg className="chord-chart-svg horizontal" viewBox="0 0 160 120">
          {/* Draw fret lines (vertical, 5 lines representing 4 frets) */}
          {Array.from({ length: 5 }).map((_, fIdx) => {
            const x = 24 + fIdx * 28;
            const isNut = fIdx === 0;
            return (
              <line
                key={fIdx}
                x1={x}
                y1="14"
                x2={x}
                y2="106"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth={isNut ? 3 : 1}
              />
            );
          })}

          {/* Draw string lines (horizontal, 6 strings) */}
          {strings.map((sNum, sIdx) => {
            const y = 20 + sIdx * 16;
            const voice = playedVoices.find(v => v.string === sNum);
            const isPlayed = !!voice;

            return (
              <g key={sNum}>
                {/* String line */}
                <line
                  x1="24"
                  y1={y}
                  x2="140"
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth={1.2 + (sNum - 1) * 0.3} // Thickest string (6) is at the top
                />

                {/* X on left of nut if muted */}
                {!isPlayed ? (
                  <text
                    x="12"
                    y={y + 3.5}
                    textAnchor="middle"
                    fill="rgba(239, 68, 68, 0.6)"
                    fontSize="9"
                    fontWeight="800"
                    fontFamily="sans-serif"
                  >
                    X
                  </text>
                ) : (
                  /* Draw finger circle if played */
                  voice.fret - minFret >= 0 && (
                    <g>
                      {/* Circle representing finger position */}
                      <circle
                        cx={24 + (voice.fret - minFret) * 28 + 14}
                        cy={y}
                        r="7.5"
                        fill={toneColors[voice.chordTone] || 'rgba(255, 255, 255, 0.15)'}
                        filter="drop-shadow(0 1px 3px rgba(0,0,0,0.4))"
                      />
                      {/* Chord tone label inside circle */}
                      <text
                        x={24 + (voice.fret - minFret) * 28 + 14}
                        y={y + 3}
                        textAnchor="middle"
                        fill="#06060f"
                        fontSize="8.5"
                        fontWeight="800"
                        fontFamily="sans-serif"
                      >
                        {voice.chordTone}
                      </text>
                    </g>
                  )
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="voicing-preview-legend">
        <span className="legend-item"><span className="legend-dot root" />Tônica (1)</span>
        <span className="legend-item"><span className="legend-dot third" />Terça (3)</span>
        <span className="legend-item"><span className="legend-dot fifth" />Quinta (5)</span>
        <span className="legend-item"><span className="legend-dot seventh" />Sétima (7)</span>
      </div>
    </div>
  );
}
