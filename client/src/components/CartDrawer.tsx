/**
 * Meu Bebê Kids — Drawer do Carrinho
 * Estilo "Nursery Soft": fundo creme, coral suave #E8836B, Fraunces para
 * títulos, Nunito Sans para corpo, transições suaves ease-out 250ms e CTAs
 * de compra altos, largos e contrastantes para a experiência mobile.
 */
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCart, type DeliveryInfo } from "@/contexts/CartContext";
import type { Product } from "@/lib/products";
import { formatBRL } from "@/lib/products";
import { openWhatsAppCheckout } from "@/lib/whatsapp";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Loader2, Minus, Plus, ShoppingBag, Trash2, Truck, MessageCircle, MapPin } from "lucide-react";
import { toast } from "sonner";

function inputClass(base: string): string {
  return `${base} border-[oklch(0.88_0.02_60)] bg-white focus-visible:ring-[oklch(0.7_0.14_35)]`;
}

/** Seletor de tamanho compacto usado dentro do carrinho. */
function SizePicker({
  product,
  value,
  onChange,
}: {
  product: Product;
  value: string;
  onChange: (size: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-7 w-auto gap-1 rounded-full border-[oklch(0.88_0.03_40)] bg-white px-2.5 text-xs font-sans font-medium text-[oklch(0.45_0.03_40)]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {product.sizes.map((s) => (
          <SelectItem key={s} value={s} className="text-xs">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function CartDrawer() {
  const {
    items,
    delivery,
    isOpen,
    setOpen,
    removeItem,
    updateQuantity,
    updateItemSize,
    clearCart,
    total,
    getProduct,
    setDelivery,
  } = useCart();

  const [form, setForm] = useState<DeliveryInfo>(delivery);
  const [step, setStep] = useState<"cart" | "delivery">("cart");
  const [cepLoading, setCepLoading] = useState(false);
  const [checkoutState, setCheckoutState] = useState<"idle" | "sending" | "success">("idle");
  const trackOrder = trpc.catalog.trackWhatsAppOrder.useMutation();

  const setField = (field: keyof DeliveryInfo, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  /** Busca endereço no ViaCEP e preenche rua, bairro, cidade e UF. */
  const handleCepChange = async (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    setField("cep", digits.replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9));
    if (digits.length === 8) {
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        if (data.erro) {
          toast.error("CEP não encontrado. Confira e tente novamente.");
          setCepLoading(false);
          return;
        }
        setForm((f) => ({
          ...f,
          rua: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
        toast.success("Endereço preenchido automaticamente!");
      } catch {
        toast.error("Não foi possível buscar o endereço. Preencha manualmente.");
      } finally {
        setCepLoading(false);
      }
    }
  };

  const handleCheckout = async () => {
    const required: { field: keyof DeliveryInfo; label: string }[] = [
      { field: "nome", label: "Nome" },
      { field: "telefone", label: "Telefone" },
      { field: "rua", label: "Rua" },
      { field: "numero", label: "Número" },
      { field: "bairro", label: "Bairro" },
      { field: "cidade", label: "Cidade" },
      { field: "estado", label: "Estado" },
      { field: "cep", label: "CEP" },
    ];
    const missing = required.find(
      (r) => !form[r.field].trim(),
    );
    if (missing) {
      toast.error(`Preencha o campo: ${missing.label}`);
      return;
    }
    if (!/^\d{5}-?\d{3}$/.test(form.cep.replace(/\s/g, ""))) {
      toast.error("CEP inválido. Use o formato 00000-000.");
      return;
    }
    try {
      setCheckoutState("sending");
      await trackOrder.mutateAsync({
        customerName: form.nome,
        customerPhone: form.telefone,
        items: items.map((item) => ({
          productId: item.productId,
          size: item.size ?? "Único",
          quantity: item.quantity,
        })),
      });
      setDelivery(form);
      setCheckoutState("success");
      openWhatsAppCheckout(items, getProduct, form);
      clearCart();
      toast.success("Pedido registrado! Agora confirme no WhatsApp.");
    } catch {
      setCheckoutState("idle");
      toast.error("Não foi possível registrar o pedido. Tente novamente em instantes.");
    }
  };

  const canCheckout = items.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={(o) => { setOpen(o); if (!o) { setStep("cart"); setCheckoutState("idle"); } }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto bg-[oklch(0.975_0.012_80)] border-l-[oklch(0.9_0.02_60)]"
      >
        <SheetHeader className="border-b border-[oklch(0.9_0.02_60)] pb-4">
          <SheetTitle className="font-display flex items-center gap-2 text-[oklch(0.35_0.03_40)]">
            <ShoppingBag className="h-5 w-5 text-[oklch(0.7_0.14_35)]" />
            {step === "cart" ? "Seu Carrinho" : "Dados de Entrega"}
          </SheetTitle>
          <p className="text-sm text-[oklch(0.5_0.02_60)] font-sans">
            {items.length} {items.length === 1 ? "item" : "itens"} no carrinho
          </p>
        </SheetHeader>

        {step === "cart" ? (
          <>
            <div className="mt-4 space-y-3">
              {items.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-14 text-center">
                  <ShoppingBag className="h-12 w-12 text-[oklch(0.82_0.05_40)]" />
                  <p className="font-display text-lg text-[oklch(0.45_0.02_50)]">
                    Seu carrinho está vazio
                  </p>
                  <p className="text-sm text-[oklch(0.55_0.02_60)] max-w-[240px]">
                    Escolha as roupinhas do seu bebê e a gente cuida do resto.
                  </p>
                </div>
              )}
              {items.map((item) => {
                const p = getProduct(item.productId);
                if (!p) return null;
                return (
                  <div
                    key={item.productId}
                    className="flex gap-3 rounded-2xl border border-[oklch(0.92_0.02_60)] bg-white/70 p-3 backdrop-blur-sm"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="truncate font-display text-sm leading-snug text-[oklch(0.35_0.03_40)]">
                        {p.name}
                      </p>
                      <p className="mt-1 font-display font-semibold text-[oklch(0.62_0.15_35)]">
                        {formatBRL(p.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          aria-label="Diminuir quantidade"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[oklch(0.85_0.03_40)] bg-white text-[oklch(0.55_0.03_40)] transition-transform duration-150 hover:scale-105 active:scale-95"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[20px] text-center font-display text-sm font-semibold text-[oklch(0.35_0.03_40)]">
                          {item.quantity}
                        </span>
                        <button
                          aria-label="Aumentar quantidade"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[oklch(0.85_0.03_40)] bg-white text-[oklch(0.55_0.03_40)] transition-transform duration-150 hover:scale-105 active:scale-95"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          aria-label="Remover item"
                          onClick={() => removeItem(item.productId)}
                          className="ml-auto text-[oklch(0.62_0.06_30)] transition-colors hover:text-[oklch(0.55_0.2_28)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="font-sans text-xs font-medium text-[oklch(0.5_0.03_40)]">Tamanho:</span>
                        <SizePicker
                          product={p}
                          value={item.size ?? "Único"}
                          onChange={(s) => updateItemSize(item.productId, s)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {canCheckout && (
              <div className="mt-5 space-y-3 border-t border-[oklch(0.9_0.02_60)] pt-4">
                <div className="flex items-center justify-between font-display text-base text-[oklch(0.35_0.03_40)]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[oklch(0.62_0.15_35)]">
                    {formatBRL(total)}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-[oklch(0.93_0.04_145)]/40 px-3 py-2 text-sm text-[oklch(0.45_0.06_145)]">
                  <Truck className="h-4 w-4 shrink-0" />
                  <span>
                    <strong>Frete grátis</strong> para todo o Brasil
                  </span>
                </div>
                <Button
                  onClick={() => setStep("delivery")}
                  className="h-14 w-full rounded-2xl bg-[oklch(0.7_0.14_35)] font-display text-base font-bold text-white shadow-[0_7px_18px_oklch(0.7_0.14_35/0.22)] transition-all duration-150 hover:bg-[oklch(0.64_0.14_35)] active:scale-[0.98]"
                >
                  Continuar para entrega
                </Button>
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="w-full text-[oklch(0.55_0.03_40)] hover:bg-[oklch(0.92_0.01_60)]"
                >
                  Limpar carrinho
                </Button>
              </div>
            )}
          </>
        ) : checkoutState === "success" ? (
          <div className="flex min-h-[480px] flex-col items-center justify-center px-2 text-center" role="status" aria-live="polite">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-[oklch(0.93_0.05_145)] text-[oklch(0.48_0.1_145)] shadow-[0_10px_26px_oklch(0.62_0.08_145/0.2)]">
              <CheckCircle2 className="h-11 w-11" />
            </div>
            <p className="mt-6 font-display text-3xl leading-tight text-[oklch(0.33_0.04_45)]">Pedido enviado!</p>
            <p className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-[oklch(0.5_0.025_55)]">Seu pedido foi registrado com sucesso. O WhatsApp foi aberto para você confirmar os detalhes com a loja.</p>
            <div className="mt-6 flex items-center gap-2 rounded-full bg-[oklch(0.94_0.05_35)] px-4 py-2 text-xs font-bold text-[oklch(0.55_0.1_35)]">
              <MessageCircle className="h-4 w-4" /> Confirmação pelo WhatsApp
            </div>
            <Button type="button" onClick={() => { setOpen(false); setCheckoutState("idle"); }} className="mt-8 h-12 w-full max-w-xs rounded-2xl bg-[oklch(0.68_0.14_35)] font-bold hover:bg-[oklch(0.61_0.14_35)]">Continuar navegando</Button>
          </div>
        ) : (
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void handleCheckout();
            }}
          >
            <div className="space-y-1">
              <Label htmlFor="nome" className="font-sans text-[oklch(0.45_0.02_50)]">
                Nome completo *
              </Label>
              <Input
                id="nome"
                value={form.nome}
                onChange={(e) => setField("nome", e.target.value)}
                className={inputClass("rounded-xl")}
                placeholder="Ex.: Maria Silva"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="telefone" className="font-sans text-[oklch(0.45_0.02_50)]">
                Telefone / WhatsApp *
              </Label>
              <Input
                id="telefone"
                value={form.telefone}
                onChange={(e) => setField("telefone", e.target.value)}
                className={inputClass("rounded-xl")}
                placeholder="(48) 99999-9999"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1 col-span-1">
                <Label htmlFor="cep" className="font-sans text-[oklch(0.45_0.02_50)]">
                  CEP *
                </Label>
                <Input
                  id="cep"
                  value={form.cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  className={inputClass("rounded-xl")}
                  placeholder="00000-000"
                  maxLength={9}
                />
                {cepLoading && (
                  <p className="flex items-center gap-1 text-[11px] text-[oklch(0.55_0.03_40)]">
                    <MapPin className="h-3 w-3 animate-pulse" /> Buscando endereço…
                  </p>
                )}
              </div>
              <div className="space-y-1 col-span-2">
                <Label htmlFor="rua" className="font-sans text-[oklch(0.45_0.02_50)]">
                  Rua / Logradouro *
                </Label>
                <Input
                  id="rua"
                  value={form.rua}
                  onChange={(e) => setField("rua", e.target.value)}
                  className={inputClass("rounded-xl")}
                  placeholder="Ex.: Rua das Flores"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label htmlFor="numero" className="font-sans text-[oklch(0.45_0.02_50)]">
                  Número *
                </Label>
                <Input
                  id="numero"
                  value={form.numero}
                  onChange={(e) => setField("numero", e.target.value)}
                  className={inputClass("rounded-xl")}
                  placeholder="123"
                />
              </div>
              <div className="space-y-1 col-span-2">
                <Label htmlFor="complemento" className="font-sans text-[oklch(0.45_0.02_50)]">
                  Complemento
                </Label>
                <Input
                  id="complemento"
                  value={form.complemento}
                  onChange={(e) => setField("complemento", e.target.value)}
                  className={inputClass("rounded-xl")}
                  placeholder="Apto, bloco..."
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="bairro" className="font-sans text-[oklch(0.45_0.02_50)]">
                Bairro *
              </Label>
              <Input
                id="bairro"
                value={form.bairro}
                onChange={(e) => setField("bairro", e.target.value)}
                className={inputClass("rounded-xl")}
                placeholder="Ex.: Centro"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1 col-span-2">
                <Label htmlFor="cidade" className="font-sans text-[oklch(0.45_0.02_50)]">
                  Cidade *
                </Label>
                <Input
                  id="cidade"
                  value={form.cidade}
                  onChange={(e) => setField("cidade", e.target.value)}
                  className={inputClass("rounded-xl")}
                  placeholder="Ex.: Florianópolis"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="estado" className="font-sans text-[oklch(0.45_0.02_50)]">
                  UF *
                </Label>
                <Input
                  id="estado"
                  value={form.estado}
                  onChange={(e) => setField("estado", e.target.value.toUpperCase())}
                  className={inputClass("rounded-xl")}
                  placeholder="SC"
                  maxLength={2}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="observacoes" className="font-sans text-[oklch(0.45_0.02_50)]">
                Observações (opcional)
              </Label>
              <Textarea
                id="observacoes"
                value={form.observacoes}
                onChange={(e) => setField("observacoes", e.target.value)}
                className={inputClass("rounded-xl min-h-16")}
                placeholder="Tamanhos, preferências de cor..."
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-[oklch(0.9_0.02_60)] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-[oklch(0.55_0.02_60)]">Total + frete</p>
                <p className="font-display text-lg font-semibold text-[oklch(0.62_0.15_35)]">
                  {formatBRL(total)} <span className="text-sm font-normal text-[oklch(0.5_0.03_145)]">frete grátis</span>
                </p>
              </div>
              <Button
                type="submit"
                disabled={checkoutState === "sending" || trackOrder.isPending}
                className="h-14 w-full rounded-2xl bg-[#25D366] font-display text-base font-bold text-white shadow-[0_7px_18px_rgb(37_211_102/0.25)] transition-all duration-150 hover:bg-[#1fb855] active:scale-[0.98] sm:w-auto"
              >
                {checkoutState === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5" />}
                {checkoutState === "sending" ? "Registrando pedido..." : "Enviar pedido"}
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setStep("cart")}
              className="w-full text-center text-sm text-[oklch(0.6_0.03_40)] underline underline-offset-2 hover:text-[oklch(0.5_0.03_40)]"
            >
              Voltar ao carrinho
            </button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
