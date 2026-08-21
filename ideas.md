# Ideas — Meu Bebê Kids (loja de roupas de bebê)

## Três abordagens estilísticas

### 1. "Nursery Soft" — Editorial pastel acolhedor
Estética inspirada em editoriais infantis premium (Mini Rodini, Zara Kids): tons creme,
verde-sálvia e terracota suave, tipografia serifada display + sans humanista, muito
respiro, fotos grandes. Emoção: ternura, curadoria, calma. Probabilidade: 0.07

### 2. "Doodle Joy" — Infantil lúdico com formas orgânicas
Fundo claro com manchas/pontos doodle coloridos, fontes arredondadas display (baloo/
fredoka), botões pill gigantes, cores vivas (rosa, amarelo, azul bebê). Emoção: alegria,
brincadeira. Probabilidade: 0.05

### 3. "Warm Catalog" — Catálogo quente estilo revista brasileira
Estética de catálogo/revista com molduras duplas, selos, carimbo de "FRETE GRÁTIS",
cores creme + laranja queimado + rosa antigo, tipografia serifada condensada + monoespaçada
para preços. Emoção: artesanal, confiável, "feita com carinho". Probabilidade: 0.04

## DIREÇÃO ESCOLHIDA: 1. Nursery Soft (editorial pastel acolhedor)

### Design Movement
Editorial infantil premium (New Scandinavian childrenswear branding) — referências:
Mini Rodini, Bobo Choses, Zara Kids editorial. Combina com a natureza do negócio
(maternidade, delicadeza) e diferencia da Shopee (visual poluído e vermelho agressivo).

### Core Principles
1. Calma e confiança: cores quentes suaves, nada de vermelho agressivo ou contadores de urgência
2. Curadoria visual: fotos grandes dos kits, muito espaço em branco
3. Carinho explícito: linguagem materna ("procuramos pelo seu bebê", "vestidinho")
4. Conversão sem agressividade: o caminho para o WhatsApp é o protagonista discreto

### Color Philosophy
Base creme-quente (oklch 0.975 0.01 85) evoca algodão e berço; o signature color é um
**coral suave (#E8836B / oklch 0.7 0.14 35)** que remete à pele de bebê e traz calor
sem ser agressivo. Verde-sálvia (oklch 0.72 0.08 145) como cor secundária de apoio
(enxoval/natureza). Marrom-chocolate para texto (nunca preto puro). Intenção: abraço,
não gritaria de promoção.

### Layout Paradigm
Assimétrico: hero com texto à esquerda e colagem de fotos à direita; seções alternando
alinhamento; "shelf" de produtos com cards de alturas variadas; faixa horizontal de
benefícios (frete grátis) atravessando a tela inteira; rodapé com formulário de
endereço integrado ao carrinho lateral (drawer).

### Signature Elements
1. Selo circular "Frete Grátis p/ Todo o Brasil" rotacionado estilo carimbo
2. Dots/nuvens sutis em SVG como texturas de fundo
3. Chips de categoria em pill com borda (Enxoval, Menino, Menina, Kits)

### Interaction Philosophy
Toques macios: cards elevam 4px no hover com sombra suave; botão de adicionar ao carrinho
com micro-bounce; drawer do carrinho desliza suavemente da direita; contador no ícone do
carrinho com pop scale.

### Animation
Entradas com fade+translateY 24px stagger 60ms; hover de card 200ms ease-out; modal/drawer
250ms cubic-bezier(0.23,1,0.32,1); botão :active scale(0.97) 150ms.

## Style Decisions

### Evolução premium e animação de boas-vindas
O primeiro viewport deve funcionar como uma pequena abertura editorial: uma auréola pêssego se revela atrás da colagem de produtos, o texto entra em sequência curta e os produtos chegam com deslocamentos suaves e assimétricos. O movimento tem de fazer a cliente sentir cuidado e qualidade — nunca simular urgência ou bloquear a compra.

No celular, a sequência será breve, usará somente `opacity` e `transform` e manterá o CTA “Comprar kits agora” visível imediatamente. Pessoas que ativarem redução de movimento terão a experiência estática, preservando o contraste, a hierarquia premium e a facilidade de compra.

### Revisão editorial aplicada
Os cards deixam de exibir sinais de marketplace como prioridade visual e passam a usar moldura creme, camada de suavização e selo editorial “Seleção especial”. A vitrine intercala uma pausa curada entre grupos de produtos, com composição assimétrica e a assinatura circular da marca. A marca no cabeçalho usa wordmark Fraunces maior, “Bebê” em coral itálico e o símbolo coral de roupinha como marca de reconhecimento imediato.

### Typography System
Display: "Recoleta-style" → usaremos **Fraunces** (serif display com personalidade,
ótima em pesos altos e optical size). Corpo: **Nunito Sans** (humanista, redonda,
infantil sem ser infantil demais). Preços em Fraunces semibold coral. Hierarquia:
H1 Fraunces 56–72px, H2 36–44px, corpo 16px Nunito Sans, labels uppercase tracking 0.08em.

### Brand Essence
Meu Bebê Kids — enxoval e roupinhas do RN ao 16, curadoria de mãe para mãe, com frete
grátis para todo o Brasil e atendimento humano no WhatsApp. Adjetivos: acolhedora,
cuidadosa, confiável.

### Brand Voice
Carinhosa, direta, maternal. Headlines: "Roupinhas feitas com carinho, direto pra sua
casa." / CTA: "Garantir no WhatsApp". Microcopy: "Chama no zap e a gente arruma tudo pra você".
Banido: "Bem-vindo ao nosso site", "Compre agora".

### Wordmark & Logo
Logotipo: texto "Meu Bebê Kids" em Fraunces com "Bebê" em itálico coral; símbolo:
macacãozinho/zapato em traço contínuo dentro de círculo coral (gerar ícone SVG/PNG).

### Signature Brand Color
Coral suave #E8836B (oklch 0.7 0.14 35) — inconfundível, quente, maternal.

### WhatsApp (requisito do usuário)
- Pedidos finalizados via WhatsApp: +55 48 99820-1160
- Drawer do carrinho pede: nome, telefone, endereço completo (rua, número, bairro,
  cidade, estado) e CEP do destinatário
- Mensagem formatada: lista de itens com quantidades e valores, subtotal, endereço, CEP
