import { describe, expect, it } from "vitest";
import { duplicateProductDraft } from "./Admin";

describe("duplicateProductDraft", () => {
  it("preserva os dados comerciais, mas cria um rascunho oculto e sem destaque", () => {
    const draft = duplicateProductDraft({
      id: "kit-azul",
      name: "Kit azul",
      description: "Macacões confortáveis",
      price: 89.9,
      category: "kits",
      badge: "Mais vendido",
      tags: ["algodão"],
      active: true,
      featured: true,
      shopeeUrl: "https://shopee.com.br/produto",
      images: [{ url: "https://example.com/kit.jpg" }],
      sizes: [{ size: "M", available: true }],
    });

    expect(draft).toMatchObject({
      id: "",
      name: "Kit azul — cópia",
      description: "Macacões confortáveis",
      price: "89,90",
      active: false,
      featured: false,
      shopeeUrl: "https://shopee.com.br/produto",
      sizes: [{ size: "M", available: true }],
    });
  });
});
