/**
 * Meu Bebê Kids — Visualização ampliada de imagem (lightbox mobile-friendly)
 *
 * v3 — reconstruído SEM Dialog do shadcn/ui.
 * O Dialog do Radix no mobile estava renderizando o backdrop por cima do
 * conteúdo (imagem presa no canto com fundo escuro cobrindo tudo).
 * Agora usamos um portal nativo com posição fixed e z-index 9999, o que
 * garante que o conteúdo sempre fique por cima do backdrop no iOS/Android.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, ZoomIn, ShoppingBag } from "lucide-react";

export interface ZoomState {
  image: string;
  name: string;
}

interface ZoomImageProps {
  zoom: ZoomState | null;
  onClose: () => void;
  /** Navegação entre imagens de uma galeria (opcional). */
  images?: ZoomState[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
  /** Chamado ao tocar em "Adicionar ao carrinho" dentro do lightbox. */
  onAddToCart?: () => void;
}

const MAX_SCALE = 3;
const DOUBLE_TAP_MS = 250;
const DOUBLE_TAP_MAX_DIST = 20; // px

export default function ZoomImage({
  zoom,
  onClose,
  images,
  currentIndex = 0,
  onNavigate,
  onAddToCart,
}: ZoomImageProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [added, setAdded] = useState(false);
  // Direção da navegação: -1 = vem da esquerda (anterior), +1 = vem da direita (próximo)
  const [slideDir, setSlideDir] = useState<number>(0);
  const prevIndex = useRef(currentIndex);

  // Estado de gestos
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const panStart = useRef<{
    x: number;
    y: number;
    ox: number;
    oy: number;
  } | null>(null);
  const lastTouchDist = useRef<number | null>(null);
  const lastTap = useRef<{ x: number; y: number; t: number } | null>(null);
  const moved = useRef(false);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = images?.length ?? 0;
  const prev = total > 0 && currentIndex > 0;
  const next = total > 0 && currentIndex < total - 1;

  // Reset zoom/pan ao trocar de imagem
  useEffect(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = null;
    lastTap.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom?.image]);

  // Trava o scroll do body enquanto aberto
  useEffect(() => {
    document.body.style.overflow = zoom ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [zoom]);

  const toggleZoom = useCallback(() => {
    setScale((s) => {
      const nextScale = s > 1 ? 1 : 2.2;
      if (nextScale === 1) setOffset({ x: 0, y: 0 });
      return nextScale;
    });
  }, []);

  const handleAddToCart = useCallback(() => {
    onAddToCart?.();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }, [onAddToCart]);

  // Fecha o lightbox ao navegar para outra imagem (o card da página abre
  // o lightbox novamente na imagem nova), garantindo um único lightbox visível
  useEffect(() => {
    setAdded(false);
  }, [currentIndex]);

  // Detecta direção do deslize para animar a entrada da nova imagem
  useEffect(() => {
    const dir = prevIndex.current < currentIndex ? 1 : -1;
    prevIndex.current = currentIndex;
    setSlideDir(dir);
  }, [currentIndex]);

  // Limita o pan para não sair da área da imagem
  const clampOffset = useCallback((ox: number, oy: number, s: number) => {
    if (s <= 1) return { x: 0, y: 0 };
    const maxPan = (s - 1) * 200; // limite conservador em px
    return {
      x: Math.min(maxPan, Math.max(-maxPan, ox)),
      y: Math.min(maxPan, Math.max(-maxPan, oy)),
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    moved.current = false;
    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
      lastTouchDist.current = null;
      if (scale > 1) {
        // Quando ampliado: iniciar pan
        panStart.current = {
          x: t.clientX,
          y: t.clientY,
          ox: offset.x,
          oy: offset.y,
        };
      }
    } else if (e.touches.length === 2) {
      lastTouchDist.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      touchStart.current = null;
      panStart.current = null;
      if (tapTimer.current) {
        clearTimeout(tapTimer.current);
        tapTimer.current = null;
        lastTap.current = null;
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDist.current !== null) {
      // Pinch zoom
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const ratio = dist / lastTouchDist.current;
      lastTouchDist.current = dist;
      setScale((s) => {
        const ns = Math.min(MAX_SCALE, Math.max(1, s * ratio));
        if (ns <= 1) setOffset({ x: 0, y: 0 });
        return ns;
      });
      moved.current = true;
    } else if (e.touches.length === 1 && panStart.current && scale > 1) {
      // Pan quando ampliado
      const t = e.touches[0];
      const dx = t.clientX - panStart.current.x;
      const dy = t.clientY - panStart.current.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved.current = true;
      setOffset((o) =>
        clampOffset(
          panStart.current!.ox + dx,
          panStart.current!.oy + dy,
          scale,
        ),
      );
    } else if (e.touches.length === 1 && touchStart.current && scale === 1) {
      // Em escala 1: deslizar para navegar/fechar
      const t = e.touches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved.current = true;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx > 0 && prev) {
          touchStart.current = null;
          onNavigate?.(currentIndex - 1);
        } else if (dx < 0 && next) {
          touchStart.current = null;
          onNavigate?.(currentIndex + 1);
        }
      } else if (dy > 70 && Math.abs(dy) > Math.abs(dx) * 1.5) {
        touchStart.current = null;
        onClose();
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Double-tap detection: se houve apenas um toque rápido sem arrastar
    const last = e.changedTouches?.[0];
    if (
      last &&
      !moved.current &&
      e.touches.length === 0 &&
      scale <= 1 &&
      !panStart.current
    ) {
      const now = Date.now();
      if (
        lastTap.current &&
        now - lastTap.current.t < DOUBLE_TAP_MS &&
        Math.hypot(
          last.clientX - lastTap.current.x,
          last.clientY - lastTap.current.y,
        ) < DOUBLE_TAP_MAX_DIST
      ) {
        if (tapTimer.current) {
          clearTimeout(tapTimer.current);
          tapTimer.current = null;
        }
        toggleZoom();
        lastTap.current = null;
      } else {
        lastTap.current = { x: last.clientX, y: last.clientY, t: now };
      }
    }
    touchStart.current = null;
    panStart.current = null;
    lastTouchDist.current = null;
  };

  if (!zoom) return null;

  const navArrows: ReactNode =
    total > 1 ? (
      <>
        {prev && (
          <button
            onClick={() => onNavigate?.(currentIndex - 1)}
            aria-label="Imagem anterior"
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-transform active:scale-90"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {next && (
          <button
            onClick={() => onNavigate?.(currentIndex + 1)}
            aria-label="Próxima imagem"
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-transform active:scale-90"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </>
    ) : null;

  // Botão "Adicionar ao carrinho" — barra fixa na parte inferior em telas
  // mobile (com o título do produto), e flutuante à direita apenas no desktop
  const addToCartBar: ReactNode = onAddToCart ? (
    <div className="absolute inset-x-0 bottom-0 z-20 sm:hidden">
      <div className="bg-gradient-to-t from-[oklch(0.15_0.02_40/0.97)] via-[oklch(0.15_0.02_40/0.7)] to-transparent px-4 pb-2 pt-10">
        <button
          onClick={handleAddToCart}
          aria-label="Adicionar ao carrinho"
          className={`flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold shadow-lg transition-all active:scale-[0.98] ${
            added
              ? "bg-[oklch(0.55_0.12_145)] text-white"
              : "bg-[oklch(0.65_0.16_35)] text-white"
          }`}
        >
          <ShoppingBag className="h-5 w-5" />
          {added ? "Adicionado!" : "Adicionar ao carrinho"}
        </button>
        <p className="pb-3 pt-1.5 text-center text-[11px] text-white/60">
          {scale > 1
            ? "Arraste para mover • Botão abaixo para voltar ao normal"
            : "Toque duas vezes para ampliar • Deslize para navegar"}
        </p>
      </div>
    </div>
  ) : null;

  // Barra inferior alternativa usada apenas quando NÃO há onAddToCart (caso
  // de visualização simples), com contador e botão de ampliar centralizados
  const bottomBar: ReactNode = (
    <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-4 bg-gradient-to-t from-black/60 to-transparent px-4 pb-6 pt-10">
      {total > 1 && (
        <>
          <button
            onClick={() => prev && onNavigate?.(currentIndex - 1)}
            disabled={!prev}
            aria-label="Anterior"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/15 text-white transition-transform active:scale-90 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="min-w-[44px] text-center text-xs text-white/80">
            {currentIndex + 1} / {total}
          </span>
          <button
            onClick={() => next && onNavigate?.(currentIndex + 1)}
            disabled={!next}
            aria-label="Próxima"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/15 text-white transition-transform active:scale-90 disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
      <button
        onClick={toggleZoom}
        aria-label="Ampliar"
        className="flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-full bg-white/15 px-4 text-sm font-medium text-white transition-transform active:scale-90"
      >
        <ZoomIn className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">
          {scale > 1 ? "Voltar ao normal" : "Ampliar"}
        </span>
      </button>
      <p className="hidden text-[11px] text-white/60 md:block">
        {scale > 1
          ? "Arraste para mover • Botão para voltar ao normal"
          : "Toque duas vezes para ampliar • Deslize para navegar"}
      </p>
    </div>
  );

  const addToCartBtn: ReactNode = onAddToCart ? (
    <button
      onClick={handleAddToCart}
      aria-label="Adicionar ao carrinho"
      className={`absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 sm:flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-lg transition-all active:scale-90 ${
        added
          ? "bg-[oklch(0.55_0.12_145)] text-white"
          : "bg-[oklch(0.65_0.16_35)] text-white hover:brightness-105"
      }`}
      style={{ minWidth: 44 }}
    >
      <ShoppingBag className="h-4 w-4" />
      {added ? "Adicionado!" : "Adicionar ao carrinho"}
    </button>
  ) : null;

  const lightbox = (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[oklch(0.2_0.02_40/0.95)]"
      style={{ animation: "zoomfade-in 220ms cubic-bezier(0.23,1,0.32,1)" }}
    >
      {/* Barra superior: título + fechar */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 bg-gradient-to-b from-black/60 to-transparent p-4 pb-10">
        <p className="line-clamp-1 flex-1 px-2 text-sm font-medium text-white">
          {zoom.name}
        </p>
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/15 text-white transition-transform active:scale-90"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Área da imagem com gestos */}
      <div
        className="flex h-full w-full items-center justify-center overflow-hidden px-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: scale > 1 ? "none" : "manipulation" }}
      >
        {/* A camada externa é recriada a cada produto para reiniciar a animação
            inclusive em deslizes consecutivos. A camada interna mantém apenas
            o transform de zoom/pan, evitando conflito entre dois transforms. */}
        <div
          key={`${zoom.image}-${currentIndex}`}
          className="flex max-h-[82vh] max-w-full items-center justify-center"
          style={{
            animation:
              slideDir !== 0
                ? `slide-in 320ms cubic-bezier(0.23, 1, 0.32, 1) both`
                : "none",
            // Próximo produto entra da direita; anterior entra da esquerda.
            "--slide-x": slideDir > 0 ? "72px" : "-72px",
          } as React.CSSProperties}
        >
          <img
            ref={imgRef}
            src={zoom.image}
            alt={zoom.name}
            onDoubleClick={(e) => {
              e.preventDefault();
              toggleZoom();
            }}
            draggable={false}
            className="max-h-[82vh] max-w-full select-none rounded-xl object-contain"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin: "center",
              transition:
                scale === 1
                  ? "transform 200ms cubic-bezier(0.23, 1, 0.32, 1)"
                  : "none",
              cursor: scale > 1 ? "grab" : "zoom-in",
              WebkitUserSelect: "none",
              userSelect: "none",
            }}
          />
        </div>
      </div>

      {navArrows}
      {addToCartBtn}
      {onAddToCart ? addToCartBar : bottomBar}
    </div>
  );

  return createPortal(lightbox, document.body);
}
