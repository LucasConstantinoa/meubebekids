import { and, desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  customerOrderItems,
  customerOrders,
  productImages,
  productSizes,
  storeProducts,
  type InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) _db = drizzle(process.env.DATABASE_URL);
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const { values, updateSet } = prepareUserUpsert(user);
  await db.insert(users).values(values).onDuplicateKeyUpdate({
    set: updateSet,
  });
}

export function prepareUserUpsert(user: InsertUser, now = new Date()) {
  const initialRole = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  const values: InsertUser = { ...user, role: initialRole, lastSignedIn: now };
  const updateSet: Partial<Pick<InsertUser, "name" | "email" | "loginMethod" | "role" | "lastSignedIn">> = { lastSignedIn: now };

  // A sessão apenas renova o último acesso. Campos de identidade e privilégios
  // só mudam quando vierem explicitamente no login ou na sincronização OAuth.
  if (user.name !== undefined) updateSet.name = user.name;
  if (user.email !== undefined) updateSet.email = user.email;
  if (user.loginMethod !== undefined) updateSet.loginMethod = user.loginMethod;
  if (user.role !== undefined) updateSet.role = user.role;
  else if (user.openId === ENV.ownerOpenId) updateSet.role = "admin";

  return { values, updateSet };
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  return (await db.select().from(users).where(eq(users.openId, openId)).limit(1))[0];
}

export type ProductInput = {
  id: string; name: string; description: string; priceCents: number; category: string;
  badge?: string | null; tags: string[]; shopeeUrl?: string | null; active: boolean; featured: boolean;
  images: { url: string; storageKey?: string | null; alt?: string | null }[];
  sizes: { size: string; available: boolean }[];
};

function parseTags(tagsJson: string) { try { return JSON.parse(tagsJson) as string[]; } catch { return []; } }

async function hydrateProducts(includePrivate = false, onlyActive = false) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(storeProducts).where(onlyActive ? eq(storeProducts.active, true) : undefined).orderBy(desc(storeProducts.updatedAt));
  if (!rows.length) return [];
  const ids = rows.map(row => row.id);
  const [images, sizes] = await Promise.all([
    db.select().from(productImages).where(inArray(productImages.productId, ids)).orderBy(productImages.position),
    db.select().from(productSizes).where(inArray(productSizes.productId, ids)).orderBy(productSizes.position),
  ]);
  return rows.map(row => {
    const result = {
      id: row.id, name: row.name, description: row.description, price: row.priceCents / 100,
      category: row.category, badge: row.badge ?? undefined, tags: parseTags(row.tagsJson), active: row.active, featured: row.featured,
      images: images.filter(image => image.productId === row.id).map(image => ({ url: image.url, storageKey: image.storageKey, alt: image.alt })),
      sizes: sizes.filter(size => size.productId === row.id).map(size => ({ size: size.size, available: size.available })),
    };
    return includePrivate ? { ...result, shopeeUrl: row.shopeeUrl ?? "" } : result;
  });
}

export const listPublicProducts = () => hydrateProducts(false, true);
export const listAdminProducts = () => hydrateProducts(true, false);

export async function saveProduct(input: ProductInput) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.insert(storeProducts).values({
    id: input.id, name: input.name, description: input.description, priceCents: input.priceCents,
    category: input.category, badge: input.badge || null, tagsJson: JSON.stringify(input.tags),
    shopeeUrl: input.shopeeUrl || null, active: input.active, featured: input.featured,
  }).onDuplicateKeyUpdate({ set: {
    name: input.name, description: input.description, priceCents: input.priceCents, category: input.category,
    badge: input.badge || null, tagsJson: JSON.stringify(input.tags), shopeeUrl: input.shopeeUrl || null, active: input.active, featured: input.featured,
  } });
  await db.delete(productImages).where(eq(productImages.productId, input.id));
  await db.delete(productSizes).where(eq(productSizes.productId, input.id));
  if (input.images.length) await db.insert(productImages).values(input.images.map((image, position) => ({ productId: input.id, url: image.url, storageKey: image.storageKey || null, alt: image.alt || input.name, position })));
  if (input.sizes.length) await db.insert(productSizes).values(input.sizes.map((item, position) => ({ productId: input.id, size: item.size, available: item.available, position })));
}

export async function archiveProduct(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.update(storeProducts).set({ active: false }).where(eq(storeProducts.id, id));
}

export async function createTrackedOrder(input: { customerName: string; customerPhone: string; items: { productId: string; size: string; quantity: number }[] }) {
  const db = await getDb();
  if (!db) return { recorded: false as const, reason: "database_unavailable" };
  const ids = input.items.map(item => item.productId).filter((id, index, values) => values.indexOf(id) === index);
  const rows = await db.select().from(storeProducts).where(and(inArray(storeProducts.id, ids), eq(storeProducts.active, true)));
  if (rows.length !== ids.length) return { recorded: false as const, reason: "catalog_not_managed" };
  const sizes = await db.select().from(productSizes).where(inArray(productSizes.productId, ids));
  const resolved = input.items.map(item => ({ item, product: rows.find(product => product.id === item.productId), available: sizes.some(size => size.productId === item.productId && size.size === item.size && size.available) }));
  if (resolved.some(entry => !entry.product || !entry.available)) return { recorded: false as const, reason: "invalid_item" };
  const totalCents = resolved.reduce((total, entry) => total + entry.product!.priceCents * entry.item.quantity, 0);
  const inserted = await db.insert(customerOrders).values({ customerName: input.customerName, customerPhone: input.customerPhone, totalCents });
  const orderId = Number(inserted[0].insertId);
  await db.insert(customerOrderItems).values(resolved.map(entry => ({ orderId, productId: entry.product!.id, productName: entry.product!.name, unitPriceCents: entry.product!.priceCents, size: entry.item.size, quantity: entry.item.quantity })));
  return { recorded: true as const, orderId };
}

export async function listOrders() {
  const db = await getDb();
  if (!db) return { total: 0, orders: [] };
  const orders = await db.select().from(customerOrders).orderBy(desc(customerOrders.createdAt)).limit(100);
  if (!orders.length) return { total: 0, orders: [] };
  const items = await db.select().from(customerOrderItems).where(inArray(customerOrderItems.orderId, orders.map(order => order.id)));
  return { total: orders.length, orders: orders.map(order => ({ ...order, items: items.filter(item => item.orderId === order.id) })) };
}

export async function updateOrderStatus(id: number, status: "new" | "responded" | "completed") {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.update(customerOrders).set({ status }).where(eq(customerOrders.id, id));
  return { success: true as const };
}
