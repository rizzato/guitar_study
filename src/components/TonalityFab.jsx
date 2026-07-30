import { useEffect, useRef } from 'react';
import CircleOfFifths from './CircleOfFifths';
import { getTonalityName, SCALES, normalizeTonality } from '../lib/musicTheory';

// A tonalidade deixou de ser uma tela e virou um botão flutuante: ela é escolhida
// uma vez e revisitada raramente, mas quando é revisitada precisa estar a um
// toque, sem rolagem. No canto inferior fica na zona do polegar, que é a cena
// "violão na mão" descrita no PRODUCT.md.
export default function TonalityFab({ tonality, onChange, open, onOpenChange }) {
  const painelRef = useRef(null);
  const botaoRef = useRef(null);
  const { scale } = normalizeTonality(tonality);

  useEffect(() => {
    if (!open) return;

    const fechar = () => { onOpenChange(false); botaoRef.current?.focus(); };
    const onKey = (e) => {
      // Esc fecha aqui em vez de propagar: sem tela de configuração, não há
      // mais "voltar", e a sobreposição é o único contexto que Esc pode desfazer.
      if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); fechar(); }
    };
    const onClickFora = (e) => {
      if (painelRef.current && !painelRef.current.contains(e.target)) fechar();
    };

    document.addEventListener('keydown', onKey, true);
    document.addEventListener('mousedown', onClickFora);
    painelRef.current?.querySelector('.circle-focusable')?.focus();

    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('mousedown', onClickFora);
    };
  }, [open, onOpenChange]);

  return (
    <>
      <button
        ref={botaoRef}
        className={`tonality-fab ${open ? 'open' : ''}`}
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Tonalidade: ${getTonalityName(tonality)}, ${SCALES[scale].label}. Tocar para trocar.`}
      >
        <span className="fab-tonic">{getTonalityName(tonality)}</span>
      </button>

      {open && (
        <div className="tonality-overlay">
          <div
            className="tonality-panel"
            ref={painelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Escolher tonalidade"
          >
            <CircleOfFifths tonality={tonality} onChange={onChange} />
          </div>
        </div>
      )}
    </>
  );
}
