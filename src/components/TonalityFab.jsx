import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CircleOfFifths from './CircleOfFifths';
import { getTonalityName, SCALES, normalizeTonality } from '../lib/musicTheory';
import { useTranslation } from '../lib/i18n';

// Espelha .tonality-panel.saindo no CSS. Entrada é 260ms; a saída é mais curta
// de propósito, porque sair devagar faz a interface parecer lenta.
const SAIDA_MS = 170;

const semMovimento = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function TonalityFab({ tonality, onChange, open, onOpenChange }) {
  const { t } = useTranslation();
  const painelRef = useRef(null);
  const overlayRef = useRef(null);
  const botaoRef = useRef(null);
  const { scale } = normalizeTonality(tonality);
  const scaleLabel = t(`scale_${scale}`) || SCALES[scale].label;

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

  useLayoutEffect(() => {
    if (!montado || saindo) return;
    const painel = painelRef.current;
    const botao = botaoRef.current;
    if (!painel || !botao) return;

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
        aria-label={t('tonalityFabLabel', { name: getTonalityName(tonality), scale: scaleLabel })}
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
            aria-label={t('selectTonalityTitle')}
          >
            <CircleOfFifths tonality={tonality} onChange={onChange} />
          </div>
        </div>
      )}
    </>
  );
}
