import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { products as legacyProducts } from "@/lib/products";
import { Check, Copy, ExternalLink, ImagePlus, Loader2, LockKeyhole, LogOut, PackagePlus, Pencil, Plus, Send, ShoppingBag, Sparkles, Trash2, Upload, X } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

type AdminImage = { url: string; storageKey?: string | null; alt?: string | null };
type AdminSize = { size: string; available: boolean };
type AdminProduct = {
  id: string; name: string; description: string; price: number; category: string; badge?: string;
  tags: string[]; active: boolean; featured: boolean; shopeeUrl: string; images: AdminImage[]; sizes: AdminSize[];
};

type Draft = Omit<AdminProduct, "price"> & { price: string; imageLink: string; newSize: string };
const SIZE_OPTIONS = ["RN", "P", "M", "G", "GG"];
const CATEGORY_OPTIONS = ["kits", "macacoes", "conjuntos", "enxoval"];

function cleanSlug(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 96) || `produto-${Date.now()}`;
}

function emptyDraft(): Draft {
  return { id: "", name: "", description: "", price: "", category: "kits", badge: "", tags: [], active: true, featured: false, shopeeUrl: "", images: [], sizes: SIZE_OPTIONS.map(size => ({ size, available: true })), imageLink: "", newSize: "" };
}

function productToDraft(product: AdminProduct): Draft {
  return { ...product, price: product.price.toFixed(2).replace(".", ","), badge: product.badge ?? "", imageLink: "", newSize: "" };
}

export function duplicateProductDraft(product: AdminProduct): Draft {
  return { ...productToDraft(product), id: "", name: `${product.name} — cópia`, active: false, featured: false, imageLink: "", newSize: "" };
}

export default function Admin() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center bg-[oklch(0.975_0.012_78)]"><Loader2 className="h-7 w-7 animate-spin text-[oklch(0.68_0.14_35)]" /></div>;
  if (!user || user.loginMethod !== "password") return <AdminLogin />;
  if (user.role !== "admin") return <AccessDenied />;
  return <DashboardLayout><AdminContent /></DashboardLayout>;
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = trpc.adminAuth.login.useMutation({
    onSuccess: () => { toast.success("Acesso liberado."); window.location.reload(); },
    onError: () => toast.error("E-mail ou senha não conferem."),
  });
  const submit = (event: FormEvent) => { event.preventDefault(); login.mutate({ email, password }); };
  return <main className="grid min-h-screen place-items-center bg-[oklch(0.975_0.012_78)] px-5"><section className="w-full max-w-md rounded-[2rem] border border-[oklch(0.9_0.025_65)] bg-white p-8 text-center shadow-[0_18px_50px_oklch(0.55_0.04_55/0.12)]"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[oklch(0.94_0.05_35)] text-[oklch(0.58_0.12_35)]"><LockKeyhole className="h-6 w-6" /></span><h1 className="mt-5 font-display text-3xl text-[oklch(0.3_0.03_45)]">Área da loja</h1><p className="mt-3 font-sans text-sm leading-relaxed text-[oklch(0.5_0.025_55)]">Entre com as credenciais da administradora para cadastrar produtos e acompanhar os pedidos encaminhados.</p><form onSubmit={submit} className="mt-7 space-y-3 text-left"><input type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)} className="admin-input" placeholder="Seu e-mail administrativo" /><input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} className="admin-input" placeholder="Sua senha" /><Button type="submit" disabled={login.isPending} className="h-14 w-full rounded-2xl bg-[oklch(0.68_0.14_35)] font-bold hover:bg-[oklch(0.61_0.14_35)]">{login.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LockKeyhole className="mr-2 h-5 w-5" />}Entrar no painel</Button></form></section></main>;
}

function AccessDenied() {
  return <main className="grid min-h-screen place-items-center bg-[oklch(0.975_0.012_78)] px-5"><section className="w-full max-w-md rounded-[2rem] border border-[oklch(0.9_0.025_65)] bg-white p-8 text-center shadow-sm"><LockKeyhole className="mx-auto h-8 w-8 text-[oklch(0.63_0.11_35)]" /><h1 className="mt-4 font-display text-2xl text-[oklch(0.3_0.03_45)]">Acesso restrito</h1><p className="mt-3 text-sm text-muted-foreground">Esta conta não possui autorização administrativa. Entre com a conta proprietária da loja.</p></section></main>;
}

function AdminContent() {
  const utils = trpc.useUtils();
  const productsQuery = trpc.admin.products.useQuery();
  const ordersQuery = trpc.admin.orders.useQuery();
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Sessão encerrada com segurança.");
      window.location.assign("/admin");
    },
    onError: () => toast.error("Não foi possível encerrar a sessão. Tente novamente."),
  });
  const saveProduct = trpc.admin.saveProduct.useMutation({ onSuccess: async () => { await utils.admin.products.invalidate(); await utils.catalog.list.invalidate(); toast.success("Produto salvo na loja."); } });
  const archiveProduct = trpc.admin.archiveProduct.useMutation({ onSuccess: async () => { await utils.admin.products.invalidate(); await utils.catalog.list.invalidate(); toast.success("Produto removido da vitrine."); } });
  const uploadImage = trpc.admin.uploadImage.useMutation();
  const updateOrderStatus = trpc.admin.updateOrderStatus.useMutation({ onSuccess: async () => { await utils.admin.orders.invalidate(); toast.success("Status do pedido atualizado."); }, onError: () => toast.error("Não foi possível atualizar o pedido.") });
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const catalog = (productsQuery.data ?? []) as AdminProduct[];
  const orders = ordersQuery.data;
  const managedIds = useMemo(() => new Set(catalog.map(product => product.id)), [catalog]);

  const startNew = () => { setEditing(null); setDraft(emptyDraft()); document.getElementById("product-editor")?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const startEdit = (product: AdminProduct) => { setEditing(product); setDraft(productToDraft(product)); document.getElementById("product-editor")?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const startDuplicate = (product: AdminProduct) => {
    setEditing(null);
    setDraft(duplicateProductDraft(product));
    document.getElementById("product-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    toast.message("Produto copiado como rascunho. Revise e publique quando estiver pronto.");
  };
  const importLegacy = async () => {
    const pending = legacyProducts.filter(product => !managedIds.has(product.id));
    if (!pending.length) return toast.message("O catálogo atual já foi importado.");
    try {
      for (const product of pending) {
        await saveProduct.mutateAsync({ id: product.id, name: product.name, description: product.description, priceCents: Math.round(product.price * 100), category: product.category, badge: product.badge ?? null, tags: product.tags, active: true, featured: false, shopeeUrl: null, images: [{ url: product.image, alt: product.name }], sizes: product.sizes.map(size => ({ size, available: true })) });
      }
      toast.success(`${pending.length} produtos atuais importados para a administração.`);
    } catch { toast.error("Não foi possível importar todo o catálogo. Tente novamente."); }
  };

  return <div className="mx-auto max-w-6xl pb-16">
    <header className="rounded-[2rem] bg-[linear-gradient(135deg,oklch(0.31_0.035_48),oklch(0.46_0.07_40))] px-5 py-7 text-white shadow-[0_16px_40px_oklch(0.35_0.04_50/0.18)] sm:px-8">
      <p className="font-sans text-xs font-bold tracking-[0.14em] text-[oklch(0.9_0.045_72)] uppercase">Operação · Meu Bebê Kids</p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="font-display text-3xl leading-tight sm:text-4xl">Controle da sua loja</h1><p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-white/75">Cadastre produtos, determine os tamanhos disponíveis e acompanhe cada pedido enviado para o WhatsApp.</p></div><div className="grid gap-2 sm:flex sm:items-center"><Button type="button" variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending} className="h-12 rounded-2xl border-white/40 bg-white/10 px-5 font-bold text-white hover:bg-white/20 hover:text-white"><LogOut className="mr-2 h-4 w-4" />{logout.isPending ? "Saindo..." : "Sair"}</Button><Button onClick={startNew} className="h-14 rounded-2xl bg-[oklch(0.75_0.14_52)] px-5 font-bold text-[oklch(0.25_0.03_45)] hover:bg-[oklch(0.8_0.13_58)]"><PackagePlus className="mr-2 h-5 w-5" />Novo produto</Button></div></div>
    </header>

    <section className="mt-6 grid gap-4 sm:grid-cols-3">
      <Stat label="Produtos no painel" value={String(catalog.length)} icon={<ShoppingBag className="h-5 w-5" />} />
      <Stat label="Pedidos enviados ao WhatsApp" value={String(orders?.total ?? 0)} icon={<Send className="h-5 w-5" />} />
      <Stat label="Em destaque" value={String(catalog.filter(product => product.active && product.featured).length)} icon={<Sparkles className="h-5 w-5" />} />
    </section>

    <section id="product-editor" className="mt-7 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <ProductEditor draft={draft} setDraft={setDraft} editing={editing} saving={saveProduct.isPending} uploading={uploadImage.isPending} onUpload={async (file) => { const dataBase64 = await readFile(file); const result = await uploadImage.mutateAsync({ fileName: file.name, mimeType: file.type as "image/jpeg" | "image/png" | "image/webp", dataBase64 }); setDraft(current => ({ ...current, images: [...current.images, { url: result.url, storageKey: result.key, alt: current.name }] })); toast.success("Imagem enviada."); }} onSave={async () => { const priceCents = Math.round(Number(draft.price.replace(",", ".")) * 100); if (!draft.name || !draft.description || !priceCents || !draft.images.length) { toast.error("Preencha nome, descrição, preço e pelo menos uma foto."); return; } if (!draft.sizes.some(size => size.available)) { toast.error("Deixe pelo menos um tamanho disponível."); return; } await saveProduct.mutateAsync({ id: editing ? draft.id : cleanSlug(draft.id || draft.name), name: draft.name, description: draft.description, priceCents, category: draft.category, badge: draft.badge || null, tags: draft.tags, active: draft.active, featured: draft.featured, shopeeUrl: draft.shopeeUrl || null, images: draft.images.map(image => ({ url: image.url, storageKey: image.storageKey, alt: image.alt || draft.name })), sizes: draft.sizes }); setEditing(null); setDraft(emptyDraft()); }} />
      <OrdersPanel orders={orders?.orders ?? []} loading={ordersQuery.isLoading} pendingId={updateOrderStatus.isPending ? updateOrderStatus.variables?.id : null} onChangeStatus={(id, status) => updateOrderStatus.mutate({ id, status })} />
    </section>

    <section className="mt-7 rounded-[2rem] border border-[oklch(0.9_0.025_65)] bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-sans text-xs font-bold tracking-[0.12em] text-[oklch(0.61_0.1_38)] uppercase">Vitrine gerenciada</p><h2 className="mt-1 font-display text-2xl text-[oklch(0.3_0.03_45)]">Produtos e link de origem</h2><p className="mt-1 text-sm text-muted-foreground">O link da Shopee aparece somente aqui, nunca para a cliente.</p></div><Button variant="outline" onClick={importLegacy} disabled={saveProduct.isPending} className="h-11 rounded-xl border-[oklch(0.78_0.08_40)] text-[oklch(0.55_0.08_40)]"><Upload className="mr-2 h-4 w-4" />Importar catálogo atual</Button></div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">{catalog.length ? catalog.map(product => <article key={product.id} className="flex gap-3 rounded-2xl border border-[oklch(0.92_0.018_70)] p-3"><img src={product.images[0]?.url} alt="" className="h-20 w-20 rounded-xl bg-[oklch(0.95_0.02_70)] object-cover" /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h3 className="font-display text-base text-[oklch(0.32_0.03_45)]">{product.name}</h3><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${product.active ? "bg-[oklch(0.93_0.045_145)] text-[oklch(0.42_0.08_145)]" : "bg-muted text-muted-foreground"}`}>{product.active ? "Ativo" : "Oculto"}</span></div><div className="mt-1 flex flex-wrap gap-1">{product.featured && <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.95_0.055_82)] px-2 py-0.5 text-[10px] font-bold text-[oklch(0.52_0.09_72)]"><Sparkles className="h-3 w-3" />Destaque</span>}</div><p className="mt-1 text-sm font-bold text-[oklch(0.62_0.13_35)]">R$ {product.price.toFixed(2).replace(".", ",")}</p><div className="mt-2 flex flex-wrap gap-2"><button onClick={() => startEdit(product)} className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-[oklch(0.97_0.02_65)] px-3 text-xs font-bold text-[oklch(0.45_0.04_45)]"><Pencil className="h-3.5 w-3.5" />Editar</button><button onClick={() => startDuplicate(product)} className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-[oklch(0.94_0.04_55)] px-3 text-xs font-bold text-[oklch(0.48_0.06_45)]"><Copy className="h-3.5 w-3.5" />Duplicar</button><button onClick={() => archiveProduct.mutate({ id: product.id })} className="inline-flex min-h-10 items-center gap-1 rounded-xl px-3 text-xs font-bold text-destructive"><Trash2 className="h-3.5 w-3.5" />Ocultar</button>{product.shopeeUrl && <a href={product.shopeeUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 rounded-xl px-2 text-xs font-semibold text-[oklch(0.5_0.06_220)]"><ExternalLink className="h-3.5 w-3.5" />Shopee</a>}</div></div></article>) : <EmptyCatalog onImport={importLegacy} />}</div>
    </section>
  </div>;
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) { return <article className="rounded-[1.5rem] border border-[oklch(0.9_0.025_65)] bg-white p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(0.95_0.03_55)] text-[oklch(0.62_0.11_35)]">{icon}</div><p className="mt-3 text-2xl font-bold text-[oklch(0.32_0.03_45)]">{value}</p><p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p></article>; }

function EmptyCatalog({ onImport }: { onImport: () => void }) { return <div className="col-span-full rounded-2xl border border-dashed border-[oklch(0.83_0.05_45)] bg-[oklch(0.98_0.018_70)] p-7 text-center"><ImagePlus className="mx-auto h-7 w-7 text-[oklch(0.67_0.1_38)]" /><p className="mt-3 font-semibold text-[oklch(0.38_0.03_45)]">Seu catálogo ainda não está no painel.</p><p className="mt-1 text-sm text-muted-foreground">Importe os produtos atuais uma única vez para editá-los daqui em diante.</p><Button onClick={onImport} className="mt-4 h-11 rounded-xl bg-[oklch(0.68_0.14_35)]">Importar catálogo atual</Button></div>; }

function ProductEditor({ draft, setDraft, editing, saving, uploading, onUpload, onSave }: { draft: Draft; setDraft: React.Dispatch<React.SetStateAction<Draft>>; editing: AdminProduct | null; saving: boolean; uploading: boolean; onUpload: (file: File) => Promise<void>; onSave: () => Promise<void> }) {
  const addImageLink = () => { try { const url = new URL(draft.imageLink).toString(); setDraft(current => ({ ...current, imageLink: "", images: [...current.images, { url, alt: current.name }] })); } catch { toast.error("Informe um link de imagem válido."); } };
  const addSize = () => { const size = draft.newSize.trim().toUpperCase(); if (!size || draft.sizes.some(item => item.size === size)) return; setDraft(current => ({ ...current, newSize: "", sizes: [...current.sizes, { size, available: true }] })); };
  const submit = async (event: FormEvent) => { event.preventDefault(); await onSave(); };
  return <form onSubmit={submit} className="rounded-[2rem] border border-[oklch(0.9_0.025_65)] bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[oklch(0.95_0.03_55)] text-[oklch(0.62_0.11_35)]"><PackagePlus className="h-5 w-5" /></span><div><p className="font-sans text-xs font-bold tracking-[0.12em] text-[oklch(0.61_0.1_38)] uppercase">{editing ? "Edição" : "Cadastro"}</p><h2 className="font-display text-2xl text-[oklch(0.3_0.03_45)]">{editing ? "Atualizar produto" : "Novo produto"}</h2></div></div>
    <div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Nome do produto"><input value={draft.name} onChange={event => setDraft(current => ({ ...current, name: event.target.value }))} className="admin-input" placeholder="Ex.: Kit 5 macacões" /></Field><Field label="Preço de venda (R$)"><input inputMode="decimal" value={draft.price} onChange={event => setDraft(current => ({ ...current, price: event.target.value }))} className="admin-input" placeholder="119,90" /></Field><Field label="Categoria"><select value={draft.category} onChange={event => setDraft(current => ({ ...current, category: event.target.value }))} className="admin-input">{CATEGORY_OPTIONS.map(category => <option key={category}>{category}</option>)}</select></Field><Field label="Selo (opcional)"><input value={draft.badge || ""} onChange={event => setDraft(current => ({ ...current, badge: event.target.value }))} className="admin-input" placeholder="Ex.: Mais vendido" /></Field></div>
    <Field label="Descrição" className="mt-4"><textarea value={draft.description} onChange={event => setDraft(current => ({ ...current, description: event.target.value }))} className="admin-input min-h-28 resize-y" placeholder="Descreva tecido, peças, estação e diferenciais." /></Field>
    <Field label="Tags (separe por vírgula)" className="mt-4"><input value={draft.tags.join(", ")} onChange={event => setDraft(current => ({ ...current, tags: event.target.value.split(",").map(item => item.trim()).filter(Boolean).slice(0, 8) }))} className="admin-input" placeholder="Menina, Algodão, Verão" /></Field>
    <div className="mt-6 border-t border-[oklch(0.93_0.018_70)] pt-5"><div className="flex items-center justify-between gap-3"><div><h3 className="font-bold text-[oklch(0.35_0.03_45)]">Fotos do produto</h3><p className="mt-1 text-xs text-muted-foreground">Envie um arquivo ou salve uma foto por link.</p></div><label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-[oklch(0.95_0.03_55)] px-3 text-sm font-bold text-[oklch(0.48_0.06_40)]"><Upload className="h-4 w-4" />{uploading ? "Enviando..." : "Enviar foto"}<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" disabled={uploading} onChange={async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) await onUpload(file); event.target.value = ""; }} /></label></div><div className="mt-3 flex gap-2"><input value={draft.imageLink} onChange={event => setDraft(current => ({ ...current, imageLink: event.target.value }))} className="admin-input" placeholder="https://.../foto.jpg" /><button type="button" onClick={addImageLink} className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-xl border border-[oklch(0.78_0.08_40)] px-3 text-sm font-bold text-[oklch(0.55_0.08_40)]"><Plus className="h-4 w-4" />Link</button></div><div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">{draft.images.map((image, index) => <div key={`${image.url}-${index}`} className="group relative aspect-square overflow-hidden rounded-xl bg-muted"><img src={image.url} alt="Prévia" className="h-full w-full object-cover" /><button type="button" aria-label="Remover foto" onClick={() => setDraft(current => ({ ...current, images: current.images.filter((_, currentIndex) => currentIndex !== index) }))} className="absolute right-1 top-1 grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white"><X className="h-4 w-4" /></button></div>)}</div></div>
    <div className="mt-6 border-t border-[oklch(0.93_0.018_70)] pt-5"><h3 className="font-bold text-[oklch(0.35_0.03_45)]">Tamanhos disponíveis</h3><p className="mt-1 text-xs text-muted-foreground">Desative o que acabou: a cliente não conseguirá selecionar esse tamanho.</p><div className="mt-3 flex flex-wrap gap-2">{draft.sizes.map((item, index) => <button type="button" key={item.size} onClick={() => setDraft(current => ({ ...current, sizes: current.sizes.map((size, sizeIndex) => sizeIndex === index ? { ...size, available: !size.available } : size) }))} className={`min-h-11 rounded-xl border px-3 text-sm font-bold transition-colors ${item.available ? "border-[oklch(0.69_0.11_145)] bg-[oklch(0.94_0.05_145)] text-[oklch(0.38_0.08_145)]" : "border-muted bg-muted/60 text-muted-foreground line-through"}`}>{item.size}{item.available ? " · disponível" : " · indisponível"}</button>)}</div><div className="mt-3 flex gap-2"><input value={draft.newSize} onChange={event => setDraft(current => ({ ...current, newSize: event.target.value }))} className="admin-input" placeholder="Outro tamanho" /><button type="button" onClick={addSize} className="min-h-11 shrink-0 rounded-xl border border-[oklch(0.78_0.08_40)] px-3 text-sm font-bold text-[oklch(0.55_0.08_40)]">Adicionar</button></div></div>
    <div className="mt-6 border-t border-[oklch(0.93_0.018_70)] pt-5"><Field label="Link da Shopee — uso interno"><input type="url" value={draft.shopeeUrl} onChange={event => setDraft(current => ({ ...current, shopeeUrl: event.target.value }))} className="admin-input" placeholder="https://shopee.com.br/..." /></Field><label className="mt-4 flex min-h-11 items-center gap-3 rounded-xl bg-[oklch(0.98_0.018_70)] px-3 text-sm font-semibold text-[oklch(0.4_0.03_45)]"><input type="checkbox" checked={draft.active} onChange={event => setDraft(current => ({ ...current, active: event.target.checked }))} className="h-5 w-5 accent-[oklch(0.65_0.14_35)]" />Exibir este produto na vitrine</label><label className="mt-3 flex min-h-11 items-center gap-3 rounded-xl bg-[oklch(0.98_0.018_70)] px-3 text-sm font-semibold text-[oklch(0.4_0.03_45)]"><input type="checkbox" checked={draft.featured} onChange={event => setDraft(current => ({ ...current, featured: event.target.checked }))} className="h-5 w-5 accent-[oklch(0.65_0.14_35)]" />Destacar na página inicial</label></div>
    <Button type="submit" disabled={saving} className="mt-6 h-14 w-full rounded-2xl bg-[oklch(0.68_0.14_35)] text-base font-bold shadow-[0_7px_18px_oklch(0.7_0.14_35/0.22)] hover:bg-[oklch(0.61_0.14_35)]">{saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}{editing ? "Salvar alterações" : "Cadastrar produto"}</Button>
  </form>;
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) { return <label className={`block ${className}`}><span className="mb-1.5 block text-sm font-bold text-[oklch(0.4_0.03_45)]">{label}</span>{children}</label>; }

function OrdersPanel({ orders, loading, pendingId, onChangeStatus }: { orders: Array<{ id: number; customerName: string; customerPhone: string; totalCents: number; status: "new" | "responded" | "completed"; createdAt: Date; items: Array<{ id: number; productName: string; size: string; quantity: number }> }>; loading: boolean; pendingId: number | null; onChangeStatus: (id: number, status: "new" | "responded" | "completed") => void }) { const labels = { new: "Novo", responded: "Respondido", completed: "Concluído" } as const; return <aside className="rounded-[2rem] border border-[oklch(0.9_0.025_65)] bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[oklch(0.95_0.03_55)] text-[oklch(0.62_0.11_35)]"><Send className="h-5 w-5" /></span><div><p className="font-sans text-xs font-bold tracking-[0.12em] text-[oklch(0.61_0.1_38)] uppercase">Acompanhamento</p><h2 className="font-display text-2xl text-[oklch(0.3_0.03_45)]">Pedidos enviados</h2></div></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Atualize o status depois de atender cada cliente no WhatsApp.</p><div className="mt-5 space-y-3">{loading ? <Loader2 className="mx-auto my-10 h-6 w-6 animate-spin text-muted-foreground" /> : orders.length ? orders.map(order => <article key={order.id} className="rounded-2xl bg-[oklch(0.98_0.018_70)] p-4"><div className="flex items-start justify-between gap-2"><div><p className="font-bold text-[oklch(0.35_0.03_45)]">{order.customerName}</p><a href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="mt-0.5 block text-sm text-[oklch(0.5_0.09_145)]">{order.customerPhone}</a></div><span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("pt-BR")}</span></div><select aria-label={`Status do pedido de ${order.customerName}`} value={order.status} disabled={pendingId === order.id} onChange={event => onChangeStatus(order.id, event.target.value as "new" | "responded" | "completed")} className="admin-input mt-3 h-11 py-0 text-sm font-bold">{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ul className="mt-3 space-y-1 border-t border-[oklch(0.91_0.02_70)] pt-2 text-xs text-[oklch(0.45_0.03_50)]">{order.items.map(item => <li key={item.id}>{item.quantity}× {item.productName} · {item.size}</li>)}</ul><p className="mt-2 text-sm font-bold text-[oklch(0.61_0.13_35)]">R$ {(order.totalCents / 100).toFixed(2).replace(".", ",")}</p></article>) : <div className="rounded-2xl border border-dashed border-[oklch(0.85_0.04_65)] p-6 text-center text-sm text-muted-foreground">Nenhum pedido encaminhado ainda.</div>}</div></aside>; }

function readFile(file: File): Promise<string> { if (file.size > 5 * 1024 * 1024) return Promise.reject(new Error("A imagem deve ter até 5 MB.")); return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onerror = () => reject(new Error("Não foi possível ler a imagem.")); reader.onload = () => resolve(String(reader.result).split(",")[1] || ""); reader.readAsDataURL(file); }); }
