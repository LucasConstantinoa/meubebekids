import { boolean, index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/** Catálogo público. O link de compra na Shopee fica isolado e só é exposto no admin. */
export const storeProducts = mysqlTable("storeProducts", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  description: text("description").notNull(),
  priceCents: int("priceCents").notNull(),
  category: varchar("category", { length: 40 }).notNull(),
  badge: varchar("badge", { length: 60 }),
  tagsJson: text("tagsJson").notNull(),
  shopeeUrl: varchar("shopeeUrl", { length: 2048 }),
  active: boolean("active").default(true).notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const productImages = mysqlTable("productImages", {
  id: int("id").autoincrement().primaryKey(),
  productId: varchar("productId", { length: 100 }).notNull(),
  url: text("url").notNull(),
  storageKey: varchar("storageKey", { length: 512 }),
  alt: varchar("alt", { length: 180 }),
  position: int("position").default(0).notNull(),
}, table => [index("productImages_product_idx").on(table.productId)]);

export const productSizes = mysqlTable("productSizes", {
  id: int("id").autoincrement().primaryKey(),
  productId: varchar("productId", { length: 100 }).notNull(),
  size: varchar("size", { length: 20 }).notNull(),
  available: boolean("available").default(true).notNull(),
  position: int("position").default(0).notNull(),
}, table => [index("productSizes_product_idx").on(table.productId)]);

/** Cada linha representa um pedido que chegou a ser encaminhado ao WhatsApp. */
export const customerOrders = mysqlTable("customerOrders", {
  id: int("id").autoincrement().primaryKey(),
  customerName: varchar("customerName", { length: 180 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 40 }).notNull(),
  totalCents: int("totalCents").notNull(),
  status: mysqlEnum("status", ["new", "responded", "completed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const customerOrderItems = mysqlTable("customerOrderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: varchar("productId", { length: 100 }).notNull(),
  productName: varchar("productName", { length: 180 }).notNull(),
  unitPriceCents: int("unitPriceCents").notNull(),
  size: varchar("size", { length: 20 }).notNull(),
  quantity: int("quantity").notNull(),
}, table => [index("orderItems_order_idx").on(table.orderId)]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
