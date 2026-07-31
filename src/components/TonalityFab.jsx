import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CircleOfFifths from './CircleOfFifths';
import { getTonalityName, SCALES, normalizeTonality } from '../lib/musicTheory';

// Espelha .tonality-panel.saindo no CSS. Entrada é 260ms; a saída é mais curta
// de propósito, porque sair devagar faz a interface parecer lenta.
const SAIDA_MS = 170;

const semMovimento = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// A tonalidade deixou de ser uma tela e virou um botão flutuante: ela é escolhida
// uma vez e revisitada raramente, mas quando é revisitada precisa estar a um
// toque, sem rolagem. No canto inferior fica na zona do polegar, que é a cena
// "violão na mão" descrita no PRODUCT.md.
export default function TonalityFab({ tonality, onChange, open, onOpenChange }) {
  const painelRef = useRef(null);
  const overlayRef = useRef(null);
  const botaoRef = useRef(null);
  const { scale } = normalizeTonality(tonality);

  // `open` é a intenção; `montado` é o que está na tela. Eles divergem durante a
  // animação de saída, que precisa terminar antes de o painel desaparecer.
  const [montado, setMontado] = useState(open);
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    if (open) { setSaindo(false); setMontado(true); return; }
    if (!montado) return;
    if (semMovimento()) { setMontado(false); return; }
    setSaindo(true);
    const t = setTimeout(() => { setSaindo(false); setMontado(false); }, SAIDA_MS);
    return () => clearTimeout(t);
  }, [open, montado]);

  // O painel nasce de onde o botão está: mesma posição, mesmo tamanho, mesmo raio.
  // Medido em useLayoutEffect para o primeiro quadro já sair transformado — em
  // useEffect haveria um quadro com o painel inteiro antes da animação começar.
  useLayoutEffect(() => {
    if (!montado || saindo) return;
    const painel = painelRef.current;
    const botao = botaoRef.current;
    if (!painel || !botao) return;

    // Medir sem tocar na animação. getBoundingClientRect devolveria a caixa JÁ
    // TRANSFORMADA pelo quadro inicial, e suspender a animação para medir a
    // cancelava (o reflow entre `none` e `''` faz o browser tratá-la como já
    // consumida, e o painel ficava parado no estado inicial).
    //
    // offsetWidth ignora transform, e o centro do painel é o centro da
    // sobreposição, que não é transformada — daí não precisar medi-lo.
    const overlay = overlayRef.current;
    if (!overlay) return;
    const o = overlay.getBoundingClientRect();
    const b = botao.getBoundingClientRect();

    painel.style.setProperty('--morph-x', `${(b.left + b.width / 2) - (o.left + o.width / 2)}px`);
    painel.style.setProperty('--morph-y', `${(b.top + b.height / 2) - (o.top + o.height / 2)}px`);
    painel.style.setProperty('--morph-scale', `${b.width / painel.offsetWidth}`);
  }, [montado, saindo]);

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

      {montado && (
        <div className={`tonality-overlay ${saindo ? 'saindo' : ''}`} ref={overlayRef}>
          <div
            className={`tonality-panel ${saindo ? 'saindo' : ''}`}
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
