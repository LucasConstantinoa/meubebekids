/**
 * Meu Bebê Kids — Cabeçalho
 * Estilo "Nursery Soft": fixo com fundo creme translúcido que ganha opacidade
 * ao rolar, wordmark Fraunces mais presente, ícone coral e contador do carrinho com pop.
 */
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Truck } from "lucide-react";

export default function SiteHeader() {
  const { itemCount, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Faixa superior: frete grátis */}
      <div className="bg-[oklch(0.7_0.14_35)] text-white">
        <div className="container flex items-center justify-center gap-2 py-1.5">
          <Truck className="h-4 w-4" />
          <span className="font-sans text-xs font-semibold tracking-wide sm:text-sm">
            Envio grátis para todo o Brasil — chame no WhatsApp e receba em casa
          </span>
        </div>
      </div>
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          scrolled
            ? "bg-[oklch(0.975_0.012_80/0.92)] shadow-[0_2px_16px_oklch(0.85_0.02_60/0.4)] backdrop-blur-md"
            : "bg-[oklch(0.975_0.012_80)]"
        }`}
      >
        <div className="container flex h-[4.5rem] items-center justify-between">
          <a href="#topo" aria-label="Meu Bebê Kids — início" className="flex items-center gap-3">
            <img
              src="/manus-storage/logo_meubebe_5e284adf.svg"
              alt="Meu Bebê Kids"
              className="h-11 w-11 shrink-0 drop-shadow-[0_5px_10px_oklch(0.7_0.14_35/0.18)]"
            />
            <span className="font-display text-[1.35rem] leading-none tracking-[-0.035em] text-[oklch(0.32_0.035_40)] sm:text-2xl">
              Meu <em className="font-semibold italic text-[oklch(0.64_0.14_35)]">Bebê</em> Kids
            </span>
          </a>
          <nav className="hidden items-center gap-6 font-sans text-sm font-medium text-[oklch(0.45_0.03_40)] md:flex">
            <a href="#produtos" className="transition-colors hover:text-[oklch(0.64_0.14_35)]">Produtos</a>
            <a href="#enxoval" className="transition-colors hover:text-[oklch(0.64_0.14_35)]">Enxoval</a>
            <a href="#sobre" className="transition-colors hover:text-[oklch(0.64_0.14_35)]">Sobre nós</a>
          </nav>
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir carrinho"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[oklch(0.88_0.03_40)] bg-white text-[oklch(0.55_0.03_40)] transition-all duration-150 hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[oklch(0.7_0.14_35)] px-1 font-display text-[11px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>
    </>
  );
}
