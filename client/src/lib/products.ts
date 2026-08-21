/**
 * Meu Bebê Kids — Catálogo de produtos
 * Estilo: "Nursery Soft" (editorial infantil premium) — ver ideas.md
 * Preços Shopee + 50%, arredondados de forma comercial.
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number; // preço base Shopee (informação interna)
  image: string;
  category: "kits" | "macacoes" | "conjuntos" | "enxoval";
  tags: string[];
  badge?: string;
  featured?: boolean;
  pieceCount?: number;
  sizes: string[];
}

export const products: Product[] = [
  {
    id: "kit-6-body-menina",
    name: "Kit 6 Peças Body Menina Animado",
    description:
      "Seis bodys fofinhos com estampa de bichinhos e laços de renda. Algodão macio, perfeito para o dia a dia da sua princesa.",
    price: 71.9,
    originalPrice: 47.89,
    image: "/manus-storage/prod_kit6_body_menina_7936bf8a.png",
    category: "conjuntos",
    tags: ["Menina", "Bodys", "Verão"],
    badge: "Mais Vendido",
    pieceCount: 6,
    sizes: ["P", "M", "G", "GG"],
  },
  {
    id: "kit-5-macacao-menino-liso",
    name: "Kit 5 Macacão Zíper Menino Liso",
    description:
      "Cinco macacões lisos em cores vibrantes com zíper frontal e vira-pé. Algodão macio que abraça o bebê o dia todo.",
    price: 119.9,
    originalPrice: 79.89,
    image: "/manus-storage/prod_kit5_macacao_menino_liso_d665d065.png",
    category: "macacoes",
    tags: ["Menino", "Zíper Frontal", "Vira-pé"],
    pieceCount: 5,
    sizes: ["P", "M", "G", "GG"],
  },
  {
    id: "kit-10-pecas-menino",
    name: "Kit 10 Peças Conjunto Menino",
    description:
      "Dez peças entre camisetas e bermudas com estampas divertidas — carro, dinossauro, bichinhos. Completa o guarda-roupa de verão.",
    price: 110.9,
    originalPrice: 73.89,
    image: "/manus-storage/prod_kit10_pecas_menino_clean_1095a737.png",
    category: "conjuntos",
    tags: ["Menino", "Verão", "Estampado"],
    pieceCount: 10,
    sizes: ["RN", "P", "M", "G"],  },
  {
    id: "kit-5-macacao-ziper-menina",
    name: "Kit 5 Macacões Zíper Menina",
    description:
      "Cinco macacões florais em tons pastel com zíper frontal. Praticidade e delicadeza para as noites tranquilas.",
    price: 119.9,
    originalPrice: 79.89,
    image: "/manus-storage/prod_kit5_zipper_menina_est_f02be5ef.png",
    category: "macacoes",
    tags: ["Menina", "Zíper Frontal", "Floral"],
    badge: "Novidade",
    pieceCount: 5,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-5-macacao-estampado-menino",
    name: "Kit 5 Macacão Estampado Zíper Menino",
    description:
      "Cinco macacões com estampas exclusivas — ursos, raposas, flores — zíper frontal e algodão macio.",
    price: 119.9,
    originalPrice: 79.89,
    image: "/manus-storage/prod_kit5_macacao_estampado_menino_251827ef.png",
    category: "macacoes",
    tags: ["Menino", "Zíper Frontal", "Estampado"],
    pieceCount: 5,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-6-pecas-menina",
    name: "Kit 6 Peças Menina Bebê",
    description:
      "Regatas e calcinhas com estampa de morangos e flores em rosa e vermelho. Conforto e fofura para o calor.",
    price: 71.9,
    originalPrice: 47.89,
    image: "/manus-storage/prod_kit6_pecas_menina_cc37967d.png",
    category: "conjuntos",
    tags: ["Menina", "Verão", "Regata"],
    pieceCount: 6,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-5-macacao-ziper-menina-liso",
    name: "Kit 5 Macacão Zíper Menina Liso",
    description:
      "Zíper frontal que facilita vestir e trocar. Cinco macacões lisos em rosê, creme, lavanda, coral e menta.",
    price: 119.9,
    originalPrice: 79.89,
    image: "/manus-storage/prod_kit5_macacao_zipper_menina_liso_ffc8b229.png",
    category: "macacoes",
    tags: ["Menina", "Zíper Frontal", "Liso"],
    pieceCount: 5,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-10-macacao-ziper-liso",
    name: "Kit 10 Macacão Zíper Liso Suedine",
    description:
      "Dez macacões em suedine — lisos e estampados — para menino e menina. Muito mais economia para o enxoval.",
    price: 233.6,
    originalPrice: 155.7,
    image: "/manus-storage/prod_kit10_macacao_zipper_liso_clean_1cffcc90.png",
    category: "macacoes",
    tags: ["Unissex", "Suedine", "Zíper Frontal"],
    badge: "Melhor Custo",
    pieceCount: 10,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-enxoval-10-pecas",
    name: "Kit Enxoval Bebê 10 Peças",
    description:
      "Seu enxoval pronto em um único kit: macacões, bodys, peças práticas e delicadas para os primeiros meses do bebê.",
    price: 133.9,
    originalPrice: 89.21,
    image: "/manus-storage/prod_kit_enxoval_10pecas_5d319ac3.png",
    category: "enxoval",
    tags: ["Enxoval", "Unissex", "100% Algodão"],
    pieceCount: 10,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-3-macacao-menina-pecas",
    name: "Kit 3 Macacão com Colarinho Menina",
    description:
      "Três macacões com colarinho fofo — ursinho, girassol e urso listrado. Rende mais no enxoval e facilita as trocas.",
    price: 71.9,
    originalPrice: 47.9,
    image: "/manus-storage/prod_kit3_macacao_menina_pecas_deab65a1.png",
    category: "macacoes",
    tags: ["Menina", "Colarinho", "Algodão"],
    pieceCount: 3,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-5-macacao-premium",
    name: "Kit 5 Macacão Premium Menino",
    description:
      "Cinco macacões premium em cores sofisticadas — marinho, jeans, verde, cinza e creme. Conforto para todos os dias.",
    price: 101.9,
    originalPrice: 67.89,
    image: "/manus-storage/prod_kit5_macacao_premium_4b5031a9.png",
    category: "macacoes",
    tags: ["Menino", "Premium", "Zíper Frontal"],
    pieceCount: 5,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-6-conjunto-menino-estampado",
    name: "Kit 6 Peças Conjunto Bebê Menino Estampado",
    description:
      "Camisetas divertidas com aviões, leões e baleias + bermudas combinando. O look completo para o pequeno aventureiro.",
    price: 71.9,
    originalPrice: 47.89,
    image: "/manus-storage/prod_kit6_conjunto_menino_estampado_8d120ea2.png",
    category: "conjuntos",
    tags: ["Menino", "Verão", "Animado"],
    pieceCount: 6,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-4-pecas-inverno-menina",
    name: "Kit 4 Peças Inverno Menina",
    description:
      "Blusinhas com ursinhos em rosa, magenta, cinza e creme com calças combinando. Quentinho para os dias frios.",
    price: 56.9,
    originalPrice: 37.89,
    image: "/manus-storage/prod_kit4_pecas_inverno_menina_6e00a50c.png",
    category: "conjuntos",
    tags: ["Menina", "Inverno", "Ursinho"],
    pieceCount: 4,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-3-macacao-ziper-menino",
    name: "Kit 3 Macacão Estampado Zíper Menino",
    description:
      "Três macacões com florais delicados e zíper frontal. Algodão macio que abraça o dia todo e as noites tranquilas.",
    price: 83.9,
    originalPrice: 55.89,
    image: "/manus-storage/prod_kit3_zipper_menino_floral_5023fbfc.png",
    category: "macacoes",
    tags: ["Unissex", "Floral", "Zíper Frontal"],
    pieceCount: 3,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-4-conjuntos-menino-inverno",
    name: "Kit 4 Peças Conjuntos Menino Inverno Algodão",
    description:
      "Quatro conjuntos de blusa + calça em tons de menta, marinho e creme com estampas de ursinhos. Inverno aconchegante.",
    price: 56.9,
    originalPrice: 37.89,
    image: "/manus-storage/prod_kit4_conjuntos_menino_inverno_ede81842.png",
    category: "conjuntos",
    tags: ["Menino", "Inverno", "Algodão"],
    pieceCount: 4,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-3-macacao-ziper-menino-liso",
    name: "Kit 3 Macacão Zíper Menino Liso",
    description:
      "Três macacões lisos com bordadinho de ursinho — branco, creme e vermelho suave. Vira-pé e zíper frontal.",
    price: 83.9,
    originalPrice: 55.89,
    image: "/manus-storage/prod_kit3_macacao_zipper_menino_liso_6d5ae8fc.png",
    category: "macacoes",
    tags: ["Menino", "Liso", "Vira-pé"],
    pieceCount: 3,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-3-macacao-ziper-menina-liso",
    name: "Kit 3 Macacão Zíper Menina Liso",
    description:
      "Três macacões lisos em rosa, creme e lavanda com lacinho e vira-pé. Para as noites tranquilas da sua bebê.",
    price: 83.9,
    originalPrice: 55.9,
    image: "/manus-storage/prod_kit3_macacao_zipper_menina_liso_39a27235.png",
    category: "macacoes",
    tags: ["Menina", "Liso", "Zíper Frontal"],
    pieceCount: 3,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-4-pecas-inverno-bebe-menino",
    name: "Kit 4 Peças Inverno Bebê Menino",
    description:
      "Quatro macacões com estampa de bichinhos — ursinhos, dinossauros e raposas. Zíper frontal para facilitar a troca.",
    price: 56.9,
    originalPrice: 37.87,
    image: "/manus-storage/prod_kit4_pecas_inverno_bebe_menino_80cea935.png",
    category: "conjuntos",
    tags: ["Menino", "Inverno", "Estampado"],
    pieceCount: 4,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-enxoval-18-pecas",
    name: "Kit Enxoval Bebê 18 Peças Maternidade",
    description:
      "Enxoval maternidade completo com 18 peças: bodys, macacões, gorros, sapatinhos e luvas em tons pastel.",
    price: 139.5,
    originalPrice: 93.01,
    image: "/manus-storage/prod_kit_enxoval_18pecas_cdc4ef1b.png",
    category: "enxoval",
    tags: ["Enxoval", "Maternidade", "18 Peças"],
    badge: "Completo",
    pieceCount: 18,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-3-macacao-estampado-menino",
    name: "Kit 3 Macacão Estampado Menino",
    description:
      "Três macacões com colarinho — ursinho marinho, vermelho e raposa azul. Conforto e praticidade no dia a dia.",
    price: 71.9,
    originalPrice: 47.89,
    image: "/manus-storage/prod_kit3_macacao_estampado_menino_clean_4814d314.png",
    category: "macacoes",
    tags: ["Menino", "Colarinho", "Algodão"],
    pieceCount: 3,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-10-pecas-menina",
    name: "Kit 10 Peças Menina Bebê",
    description:
      "Dez peças entre blusinhas e shorts em rosa, azul e amarelo com coelhinhas, gatinhas e ursinhas.",
    price: 110.9,
    originalPrice: 73.89,
    image: "/manus-storage/prod_kit10_pecas_menina_clean_49208b5a.png",
    category: "conjuntos",
    tags: ["Menina", "Verão", "10 Peças"],
    pieceCount: 10,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-5-macacao-estampado-menina",
    name: "Kit 5 Macacão Estampado Menina Algodão",
    description:
      "Cinco macacões estampados — corações, coelhinha, gatinha e florais — em algodão macio e aconchegante.",
    price: 101.9,
    originalPrice: 67.89,
    image: "/manus-storage/prod_kit5_macacao_estampado_menina_clean_14946f09.png",
    category: "macacoes",
    tags: ["Menina", "Estampado", "Algodão"],
    pieceCount: 5,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-2-macacao-premium-menino",
    name: "Kit 2 Macacão Premium Menino Curto",
    description:
      "Dois macacões curtos premium — marinheiro e leãozinho — em algodão macio. Qualidade que se sente no toque.",
    price: 171.0,
    originalPrice: 114.0,
    image: "/manus-storage/prod_kit2_premium_menino_clean_02de1358.png",
    category: "kits",
    tags: ["Menino", "Premium", "Verão"],
    badge: "Premium",
    pieceCount: 2,
    sizes: ["RN", "P", "M", "G"],
  },
  {
    id: "kit-2-macacao-premium-menina",
    name: "Kit 2 Macacão Premium Menina Curto",
    description:
      "Dois macacões curtos premium — coelhinha rosa e ursinho creme — o presente perfeito para a sua pequena.",
    price: 171.0,
    originalPrice: 114.0,
    image: "/manus-storage/prod_kit2_premium_menina_ecd88834.png",
    category: "kits",
    tags: ["Menina", "Premium", "Verão"],
    badge: "Premium",
    pieceCount: 2,
    sizes: ["RN", "P", "M", "G"],
  },
];

export const categories = [
  { id: "todos", label: "Todos" },
  { id: "macacoes", label: "Macacões" },
  { id: "conjuntos", label: "Conjuntos" },
  { id: "enxoval", label: "Enxoval" },
  { id: "kits", label: "Premium" },
] as const;

export const WHATSAPP_NUMBER = "5548998201160";

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
