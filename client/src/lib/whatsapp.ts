/**
 * Meu Bebê Kids — Finalização do pedido via WhatsApp
 * Estilo "Nursery Soft" (ver ideas.md).
 */
import { WHATSAPP_NUMBER, formatBRL, type Product } from "@/lib/products";
import type { CartItem, DeliveryInfo } from "@/contexts/CartContext";

export function buildWhatsAppMessage(
  items: CartItem[],
  getProduct: (id: string) => Product | undefined,
  delivery: DeliveryInfo,
): string {
  const lines: string[] = [];
  lines.push("*🧸 NOVO PEDIDO — MEU BEBÊ KIDS*");
  lines.push("");
  lines.push("*ITENS DO PEDIDO:*");

  let total = 0;
  items.forEach((item, idx) => {
    const p = getProduct(item.productId);
    if (!p) return;
    const subtotal = p.price * item.quantity;
    total += subtotal;
    lines.push(
      `${idx + 1}. ${p.name} — tamanho *${item.size ?? "Único"}* — ${item.quantity}x ${formatBRL(p.price)} = *${formatBRL(subtotal)}*`,
    );
  });

  lines.push("");
  lines.push(`*TOTAL: ${formatBRL(total)}*`);
  lines.push(`🚚 *Frete: GRÁTIS para todo o Brasil*`);
  lines.push("");
  lines.push("*📦 DADOS DE ENTREGA:*");
  lines.push(`Nome: ${delivery.nome || "—"}`);
  lines.push(`Telefone: ${delivery.telefone || "—"}`);
  lines.push(
    `Endereço: ${delivery.rua || "—"}${delivery.numero ? `, nº ${delivery.numero}` : ""}${delivery.complemento ? ` — ${delivery.complemento}` : ""}`,
  );
  lines.push(`Bairro: ${delivery.bairro || "—"}`);
  lines.push(`Cidade/UF: ${delivery.cidade || "—"}${delivery.estado ? `/${delivery.estado}` : ""}`);
  lines.push(`CEP: ${delivery.cep || "—"}`);
  if (delivery.observacoes?.trim()) {
    lines.push("");
    lines.push(`Observações: ${delivery.observacoes}`);
  }
  lines.push("");
  lines.push("Olá! Gostaria de confirmar este pedido. 💛");

  return lines.join("\n");
}

export function openWhatsAppCheckout(
  items: CartItem[],
  getProduct: (id: string) => Product | undefined,
  delivery: DeliveryInfo,
): void {
  const text = buildWhatsAppMessage(items, getProduct, delivery);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}
