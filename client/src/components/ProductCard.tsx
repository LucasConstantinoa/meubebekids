/**
 * Meu Bebê Kids — Card de Produto
 * Estilo "Nursery Soft": cartão creme com moldura editorial suave, imagem
 * tratada como seleção de boutique, preço em Fraunces coral e CTA alto para mobile.
 *
 * Novidades: seletor de tamanho (RN, P, M, G) antes de adicionar
 * ao carrinho e clique na imagem abre visualização ampliada.
 */
import { useCart } from "@/contexts/CartContext";
import { formatBRL, type Product } from "@/lib/products";
import { ShoppingBag, ZoomIn } from "lucide-react";
import { toast } from "sonner";

interface Props {
  product: Product;
  onZoomImage: (image: string, name: string) => void;
}

export default function ProductCard({ product, onZoomImage }: Props) {
  const { addItem } = useCart();

  const handleAdd = () => {
    const btn = document.getElementById(
      `size-${product.id}`,
    ) as HTMLSelectElement | null;
    const size = btn?.value || product.sizes[0];
    addItem(product.id, size);
    toast.success(`${product.name} (${size}) adicionado!`);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-[1.8rem] border border-[oklch(0.9_0.025_65)] bg-white/85 p-1.5 shadow-[0_3px_16px_oklch(0.75_0.025_60/0.16)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_35px_oklch(0.75_0.025_60/0.23)]">
      <div className="relative overflow-hidden rounded-[1.35rem] bg-[oklch(0.94_0.028_75)]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onClick={() => onZoomImage(product.image, product.name)}
          className="aspect-square w-full cursor-zoom-in object-cover saturate-[0.91] contrast-[0.97] transition-transform duration-300 group-hover:scale-[1.025]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[oklch(0.28_0.02_55/0.18)] to-transparent" aria-hidden />
        <button
          onClick={() => onZoomImage(product.image, product.name)}
          aria-label={`Ampliar ${product.name}`}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[oklch(0.55_0.03_40)] opacity-100 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white max-sm:h-12 max-sm:w-12 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-[oklch(0.98_0.012_80/0.91)] px-3 py-1 font-sans text-[10px] font-bold tracking-[0.09em] text-[oklch(0.56_0.06_38)] uppercase shadow-sm backdrop-blur-sm">
          Seleção especial
        </span>
        <span className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-[oklch(0.28_0.02_55/0.58)] px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm sm:hidden">
          <ZoomIn className="h-3 w-3" /> Toque para ampliar
        </span>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
        <div className="flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[oklch(0.88_0.03_40)] px-2 py-0.5 font-sans text-[11px] text-[oklch(0.55_0.03_40)]"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-2 font-display text-base leading-snug text-[oklch(0.35_0.03_40)]">
          {product.name}
        </h3>
        <p className="mt-1 flex-1 font-sans text-sm leading-relaxed text-[oklch(0.55_0.02_60)]">
          {product.description}
        </p>
        <div className="mt-3 space-y-2.5">
          <div className="flex items-center gap-2">
            <label
              htmlFor={`size-${product.id}`}
              className="whitespace-nowrap font-sans text-xs font-medium text-[oklch(0.5_0.03_40)]"
            >
              Tamanho:
            </label>
            <select
              id={`size-${product.id}`}
              defaultValue={product.sizes[0]}
              className="flex-1 rounded-full border border-[oklch(0.88_0.03_40)] bg-white px-3 py-1.5 font-sans text-sm text-[oklch(0.35_0.03_40)] outline-none transition-colors focus:border-[oklch(0.7_0.14_35)] focus:ring-2 focus:ring-[oklch(0.7_0.14_35/0.25)]"
            >
              {product.sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end justify-between gap-2">
            <div>
              <span className="font-display text-xl font-semibold text-[oklch(0.62_0.15_35)]">
                {formatBRL(product.price)}
              </span>
              <p className="mt-0.5 font-sans text-[11px] font-medium text-[oklch(0.5_0.05_145)]">
                Frete grátis
              </p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="mt-1 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[oklch(0.7_0.14_35)] px-4 font-sans text-base font-bold text-white shadow-[0_7px_18px_oklch(0.7_0.14_35/0.25)] transition-all duration-150 hover:bg-[oklch(0.64_0.14_35)] active:scale-[0.98]"
          >
            <ShoppingBag className="h-5 w-5" />
            Adicionar ao carrinho
          </button>
          </div>
        </div>
      </div>
  );
}
