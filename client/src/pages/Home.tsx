/**
 * Meu Bebê Kids — Página inicial
 * Estilo "Nursery Soft" (ver ideas.md):
 * creme quente + coral #E8836B + verde-sálvia; Fraunces display + Nunito Sans;
 * selo rotativo de frete grátis; layout assimétrico no hero; chips de categoria.
 * CTAs de compra são altos, contrastantes e acessíveis ao toque no mobile.
 */
import { Fragment, useMemo, useState } from "react";
import ZoomImage from "@/components/ZoomImage";
import SiteHeader from "@/components/SiteHeader";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import { categories, WHATSAPP_NUMBER } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";
import {
  Truck,
  ShieldCheck,
  MessageCircle,
  Heart,
  Sparkles,
  Baby,
  Package,
  Instagram,
} from "lucide-react";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

function SeloFrete() {
  return (
    <div className="relative hidden h-36 w-36 shrink-0 items-center justify-center md:flex" aria-hidden>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite]">
        <defs>
          <path id="selo-path" d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0" />
        </defs>
        <text className="fill-[oklch(0.64_0.14_35)] font-sans text-[17px] font-bold tracking-[0.22em] uppercase">
          <textPath href="#selo-path">Frete Grátis ★ Para Todo o Brasil ★ </textPath>
        </text>
      </svg>
      <div className="z-10 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[oklch(0.7_0.14_35)] text-white shadow-lg">
        <Truck className="h-7 w-7" />
        <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider">Grátis</span>
      </div>
    </div>
  );
}

function EditorialBreak({ image }: { image: string }) {
  return (
    <aside className="editorial-break col-span-full relative overflow-hidden rounded-[2rem] border border-[oklch(0.88_0.04_63)] bg-[oklch(0.96_0.035_75)] p-5 shadow-[0_14px_32px_oklch(0.75_0.03_60/0.15)] sm:p-7 md:grid md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-8">
      <div className="relative z-10 max-w-xl">
        <span className="editorial-stamp inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[oklch(0.66_0.12_37)] font-sans text-[9px] font-extrabold leading-tight tracking-[0.12em] text-[oklch(0.61_0.1_37)] uppercase">
          Curado<br />com carinho
        </span>
        <p className="mt-4 font-sans text-xs font-bold tracking-[0.14em] text-[oklch(0.61_0.1_37)] uppercase">
          Detalhes que cuidam
        </p>
        <h3 className="mt-2 font-display text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-[oklch(0.32_0.035_40)] sm:text-4xl">
          Conforto para cada primeira descoberta.
        </h3>
        <p className="mt-3 max-w-md font-sans leading-relaxed text-[oklch(0.48_0.025_55)]">
          Escolhas leves, práticas e macias para deixar a rotina mais gostosa desde o primeiro dia.
        </p>
        <a href="#enxoval" className="mt-5 inline-flex items-center font-sans text-sm font-bold text-[oklch(0.61_0.1_37)] underline decoration-[oklch(0.74_0.12_45)] decoration-2 underline-offset-4 transition-colors hover:text-[oklch(0.5_0.09_37)]">
          Conhecer a curadoria de enxoval
        </a>
      </div>
      <div className="relative mt-6 md:mt-0">
        <div className="absolute inset-4 rounded-[2rem] bg-[oklch(0.89_0.09_50/0.42)] blur-2xl" aria-hidden />
        <img src={image} alt="Seleção de roupinhas para o enxoval" className="relative aspect-[16/10] w-full rounded-[1.65rem] border-[6px] border-white/70 object-cover saturate-[0.9] shadow-[0_14px_32px_oklch(0.65_0.035_50/0.2)]" />
      </div>
    </aside>
  );
}

export default function Home() {
  const [filter, setFilter] = useState<string>("todos");
  const [zoomImage, setZoomImage] = useState<{ image: string; name: string } | null>(null);
  const { setOpen, addItem, catalogProducts } = useCart();

  // Galeria de todas as imagens para navegação no lightbox
  const gallery = useMemo(
    () => catalogProducts.map((p) => ({ image: p.image, name: p.name })),
    [catalogProducts],
  );
  const zoomIndex = useMemo(
    () => (zoomImage ? gallery.findIndex((g) => g.image === zoomImage.image) : -1),
    [zoomImage, gallery],
  );
  const handleZoomNavigate = (index: number) => {
    const target = gallery[index];
    if (target) setZoomImage({ image: target.image, name: target.name });
  };

  const filtered = useMemo(
    () =>
      filter === "todos"
        ? catalogProducts
        : catalogProducts.filter((p) => p.category === filter),
    [filter, catalogProducts],
  );

  const enxoval = useMemo(
    () => catalogProducts.filter((p) => p.category === "enxoval"),
    [catalogProducts],
  );
  const featuredProducts = useMemo(
    () => catalogProducts.filter((product) => product.featured).slice(0, 4),
    [catalogProducts],
  );

  return (
    <div id="topo" className="min-h-screen bg-[oklch(0.975_0.012_80)]">
      <SiteHeader />
      <CartDrawer />

      {/* HERO assimétrico — abertura premium: texto em sequência, produtos em camadas e CTA imediato */}
      <section className="premium-hero relative overflow-hidden">
        <div className="premium-aura pointer-events-none absolute left-1/2 top-1/2 -z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[34rem] md:w-[34rem]" aria-hidden />
        <svg className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 text-[oklch(0.93_0.04_145/0.5)]" viewBox="0 0 100 100" aria-hidden>
          <circle cx="20" cy="20" r="14" fill="currentColor" />
          <circle cx="60" cy="10" r="7" fill="currentColor" />
          <circle cx="85" cy="30" r="10" fill="currentColor" />
        </svg>
        <svg className="pointer-events-none absolute -bottom-20 -right-16 h-80 w-80 text-[oklch(0.93_0.05_40/0.5)]" viewBox="0 0 100 100" aria-hidden>
          <circle cx="70" cy="70" r="16" fill="currentColor" />
          <circle cx="35" cy="85" r="8" fill="currentColor" />
          <circle cx="90" cy="40" r="9" fill="currentColor" />
        </svg>
        <div className="container grid items-center gap-10 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div className="premium-hero-copy max-w-xl">
            <span className="premium-entry premium-entry-1 inline-flex items-center gap-2 rounded-full border border-[oklch(0.88_0.03_40)] bg-white/75 px-4 py-1.5 font-sans text-xs font-semibold tracking-[0.08em] text-[oklch(0.55_0.03_40)] uppercase shadow-[0_5px_18px_oklch(0.8_0.03_60/0.12)]">
              <Heart className="h-3.5 w-3.5 text-[oklch(0.7_0.14_35)]" />
              Curadoria de mãe para mãe
            </span>
            <h1 className="premium-entry premium-entry-2 mt-5 font-display text-4xl font-bold leading-[1.08] text-[oklch(0.32_0.035_40)] sm:text-5xl lg:text-6xl">
              Roupinhas feitas com <em className="text-[oklch(0.64_0.14_35)]">carinho</em>, direto pra sua casa
            </h1>
            <p className="premium-entry premium-entry-3 mt-5 font-sans text-lg leading-relaxed text-[oklch(0.5_0.02_60)]">
              Kits de macacões, conjuntos e enxovais completos para os primeiros
              meses do seu bebê — com algodão macio, zíper frontal e entrega
              gratuita em qualquer lugar do Brasil.
            </p>
            <div className="premium-entry premium-entry-4 mt-8 flex flex-wrap items-center gap-3">
              <a
                href={featuredProducts.length ? "#destaques" : "#produtos"}
                className="premium-cta flex h-14 w-full items-center justify-center rounded-2xl bg-[oklch(0.7_0.14_35)] px-7 font-display text-base font-semibold text-white shadow-[0_8px_24px_oklch(0.7_0.14_35/0.38)] transition-all duration-150 hover:bg-[oklch(0.64_0.14_35)] active:scale-[0.98] sm:w-auto"
              >
                {featuredProducts.length ? "Ver destaques" : "Comprar kits agora"}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-[oklch(0.85_0.03_40)] bg-white/80 px-6 font-display text-base font-semibold text-[oklch(0.45_0.03_40)] transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
              >
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
                Chamar no WhatsApp
              </a>
            </div>
            <div className="premium-entry premium-entry-5 mt-8 flex flex-wrap items-center gap-6 font-sans text-sm text-[oklch(0.5_0.02_60)]">
              <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-[oklch(0.6_0.08_145)]" /> Frete grátis p/ todo o Brasil</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[oklch(0.6_0.08_145)]" /> 100% algodão</span>
              <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[oklch(0.6_0.08_145)]" /> Kits prontos</span>
            </div>
          </div>
          <div className="premium-visual relative mx-auto w-full max-w-md">
            <SeloFrete />
            <div className="relative grid grid-cols-2 gap-4" style={{ perspective: "1200px" }}>
              <img
                src="/manus-storage/hero_kit5_azul_clean_072cbbe1.png"
                alt="Kit de macacões para bebê menino"
                className="premium-product-one aspect-[4/5] w-full rounded-[2rem] rounded-br-[4rem] object-cover shadow-[0_16px_40px_oklch(0.85_0.02_60/0.5)]"
              />
              <img
                src="/manus-storage/prod_kit5_macacao_menino_liso_32136423.png"
                alt="Kit 5 macacões com zíper frontal"
                className="premium-product-two mt-10 aspect-[4/5] w-full rounded-[2rem] rounded-tl-[4rem] object-cover shadow-[0_16px_40px_oklch(0.85_0.02_60/0.5)]"
              />
            </div>
            <div className="premium-proof absolute -bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/70 bg-white/90 px-5 py-2 font-display text-sm font-semibold text-[oklch(0.45_0.03_40)] shadow-[0_10px_25px_oklch(0.5_0.02_60/0.15)] backdrop-blur-sm">
              + de 2.000 mamães atendidas
            </div>
          </div>
        </div>
      </section>

      {/* DESTAQUES DO PAINEL — só aparecem quando a administradora seleciona produtos */}
      {featuredProducts.length > 0 && <section id="destaques" className="bg-[oklch(0.95_0.02_85)] py-14 md:py-20">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-sans text-sm font-semibold tracking-[0.12em] text-[oklch(0.64_0.14_35)] uppercase">Seleção especial</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-[oklch(0.32_0.035_40)] sm:text-4xl">Destaques para o seu bebê</h2>
              <p className="mt-2 max-w-2xl font-sans text-[oklch(0.5_0.02_60)]">Peças escolhidas com carinho pela nossa curadoria para deixar os primeiros meses ainda mais especiais.</p>
            </div>
            <a href="#produtos" className="inline-flex min-h-11 items-center rounded-xl border border-[oklch(0.78_0.08_40)] bg-white px-4 text-sm font-bold text-[oklch(0.55_0.08_40)]">Ver todos os produtos</a>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featuredProducts.map((product) => <ProductCard key={product.id} product={product} onZoomImage={(image, name) => setZoomImage({ image, name })} />)}</div>
        </div>
      </section>}

      {/* VITRINE DE PRODUTOS */}
      <section id="produtos" className="py-14 md:py-20">
        <div className="container">
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-sans text-sm font-semibold tracking-[0.12em] text-[oklch(0.64_0.14_35)] uppercase">
                Prateleira da semana
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-[oklch(0.32_0.035_40)] sm:text-4xl">
                Escolhidos com carinho, prontos pra encantar
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`rounded-full border px-4 py-2 font-sans text-sm font-medium transition-all duration-150 ${
                    filter === cat.id
                      ? "border-[oklch(0.7_0.14_35)] bg-[oklch(0.7_0.14_35)] text-white"
                      : "border-[oklch(0.88_0.03_40)] bg-white/80 text-[oklch(0.5_0.03_40)] hover:border-[oklch(0.75_0.09_38)]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          {/* pontuação decorativa entre título e grade */}
          <div className="mt-6 hidden items-center gap-2 md:flex" aria-hidden>
            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={i}
                className="rounded-full bg-[oklch(0.85_0.06_40)]"
                style={{ width: i === 3 ? 28 : 10, height: 10 }}
              />
            ))}
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, index) => (
              <Fragment key={p.id}>
                <ProductCard product={p} onZoomImage={(image, name) => setZoomImage({ image, name })} />
                {filter === "todos" && index === 3 && enxoval[0] && (
                  <EditorialBreak image={enxoval[0].image} />
                )}
              </Fragment>
            ))}
          </div>
          {/* Lightbox mobile-friendly: zoom, gestos e navegação entre produtos */}
          <ZoomImage
            zoom={zoomImage}
            onClose={() => setZoomImage(null)}
            images={gallery}
            currentIndex={zoomIndex >= 0 ? zoomIndex : 0}
            onNavigate={handleZoomNavigate}
            onAddToCart={() => {
              const idx = zoomIndex >= 0 ? zoomIndex : 0;
              const product = catalogProducts[idx];
              if (product?.sizes[0]) {
                addItem(product.id, product.sizes[0]);
                setOpen(true);
              }
            }}
          />
          {filtered.length === 0 && (
            <p className="py-16 text-center font-sans text-[oklch(0.55_0.02_60)]">
              Nenhum produto nesta categoria por enquanto.
            </p>
          )}
        </div>
      </section>

      {/* SEÇÃO ENXOVAL */}
      <section id="enxoval" className="relative bg-[oklch(0.95_0.02_85)] py-14 md:py-20">
        <div className="absolute left-6 top-10 hidden h-40 w-40 text-[oklch(0.9_0.05_145/0.6)] md:block" aria-hidden>
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <circle cx="20" cy="20" r="12" fill="currentColor" />
            <circle cx="55" cy="12" r="7" fill="currentColor" />
            <circle cx="80" cy="35" r="9" fill="currentColor" />
            <circle cx="40" cy="60" r="10" fill="currentColor" />
          </svg>
        </div>
        <div className="container">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_1.4fr]">
            <div className="order-2 md:order-1">
              <p className="font-sans text-sm font-semibold tracking-[0.12em] text-[oklch(0.64_0.14_35)] uppercase">
                Para a chegada do bebê
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-[oklch(0.32_0.035_40)] sm:text-4xl">
                Enxoval completo sem complicação
              </h2>
              <p className="mt-4 font-sans text-base leading-relaxed text-[oklch(0.5_0.02_60)]">
                Macacões, bodys, gorros, sapatinhos e luvas em um único kit —
                tudo que você precisa para receber seu bebê com praticidade.
                Monta seu pedido aqui e confirma tudo direto no WhatsApp com a
                gente.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-[oklch(0.92_0.02_60)] bg-white/70 p-4">
                  <Package className="h-8 w-8 shrink-0 text-[oklch(0.64_0.14_35)]" />
                  <div>
                    <p className="font-display font-semibold text-[oklch(0.38_0.04_40)]">
                      Kit 10 peças — R$ 133,90
                    </p>
                    <p className="font-sans text-sm text-[oklch(0.55_0.02_60)]">
                      Macacões, bodys e peças práticas para os primeiros meses.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-[oklch(0.92_0.02_60)] bg-white/70 p-4">
                  <Baby className="h-8 w-8 shrink-0 text-[oklch(0.64_0.14_35)]" />
                  <div>
                    <p className="font-display font-semibold text-[oklch(0.38_0.04_40)]">
                      Kit 18 peças maternidade — R$ 139,50
                    </p>
                    <p className="font-sans text-sm text-[oklch(0.55_0.02_60)]">
                      O enxoval completo: bodys, macacões, gorros e sapatinhos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 grid grid-cols-2 gap-4 md:order-2">
              {enxoval.map((p) => (
                <img
                  key={p.id}
                  src={p.image}
                  alt={p.name}
                  className="aspect-square w-full rounded-[2rem] object-cover shadow-[0_12px_32px_oklch(0.85_0.02_60/0.4)]"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE / COMO FUNCIONA */}
      <section id="sobre" className="py-14 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-sans text-sm font-semibold tracking-[0.12em] text-[oklch(0.64_0.14_35)] uppercase">
              Como funciona
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-[oklch(0.32_0.035_40)] sm:text-4xl">
              Simples assim: escolhe, carrinho e WhatsApp
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-[oklch(0.5_0.02_60)]">
              Você monta o pedido aqui no site, preenche o endereço de entrega e
              o carrinho prepara tudo direitinho. No final, é só confirmar pelo
              nosso WhatsApp e a gente cuida do resto — com envio gratuito para
              todo o Brasil.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Heart,
                title: "1. Escolha as roupinhas",
                text: "Navegue pelos kits, adicione ao carrinho e escolha as quantidades.",
              },
              {
                icon: Truck,
                title: "2. Preencha a entrega",
                text: "Informe nome, endereço completo e CEP do destinatário no carrinho.",
              },
              {
                icon: MessageCircle,
                title: "3. Confirme no WhatsApp",
                text: "O pedido vai pronto para o nosso zap. É só confirmar e aguardar em casa.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="rounded-3xl border border-[oklch(0.92_0.015_70)] bg-white/80 p-7 shadow-[0_2px_12px_oklch(0.85_0.02_60/0.5)]"
              >
                <s.icon className="h-8 w-8 text-[oklch(0.7_0.14_35)]" />
                <h3 className="mt-4 font-display text-lg font-semibold text-[oklch(0.38_0.04_40)]">
                  {s.title}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-[oklch(0.55_0.02_60)]">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA WHATSAPP */}
      <section className="relative overflow-hidden bg-[oklch(0.7_0.14_35)] py-14 text-white">
        <svg className="pointer-events-none absolute -left-16 bottom-8 h-56 w-56 text-white/10" viewBox="0 0 100 100" aria-hidden>
          <circle cx="40" cy="60" r="30" fill="currentColor" />
          <circle cx="80" cy="30" r="12" fill="currentColor" />
        </svg>
        <svg className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 text-white/10" viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="40" fill="currentColor" />
        </svg>
        <div className="container relative flex flex-col items-center gap-5 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Ficou com dúvida ou quer um kit especial?
          </h2>
          <p className="max-w-lg font-sans text-base text-white/85">
            Chama no zap que a gente arruma tudo pra você. Atendimento de mãe
            para mãe.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-display text-base font-semibold text-[oklch(0.64_0.14_35)] shadow-lg transition-all duration-150 hover:scale-[1.03] active:scale-[0.97]"
          >
            <MessageCircle className="h-5 w-5" />
            (48) 99820-1160
          </a>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="bg-[oklch(0.94_0.015_80)] py-10">
        <div className="container flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2.5">
            <img
              src="/manus-storage/logo_meubebe_5e284adf.svg"
              alt="Meu Bebê Kids"
              className="h-9 w-9"
            />
            <span className="font-display text-lg text-[oklch(0.38_0.04_40)]">
              Meu <em className="font-bold text-[oklch(0.64_0.14_35)] not-italic">Bebê</em> Kids
            </span>
          </div>
          <p className="max-w-md font-sans text-sm leading-relaxed text-[oklch(0.55_0.02_60)]">
            Roupinhas de bebê com entrega gratuita para todo o Brasil. Pedidos
            confirmados com todo o carinho pelo nosso WhatsApp.
          </p>
          <div className="flex items-center gap-4 font-sans text-sm text-[oklch(0.55_0.02_60)]">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-[#25D366]">
              <MessageCircle className="h-4 w-4" /> (48) 99820-1160
            </a>
            <span className="flex items-center gap-1.5">
              <Instagram className="h-4 w-4" /> @meubebekids
            </span>
          </div>
          <p className="font-sans text-xs text-[oklch(0.6_0.02_60)]">
            © {new Date().getFullYear()} Meu Bebê Kids. Feito com carinho.
          </p>
        </div>
      </footer>
    </div>
  );
}
