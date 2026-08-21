import { TRPCError } from "@trpc/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";
import { archiveProduct, createTrackedOrder, listAdminProducts, listOrders, listPublicProducts, saveProduct, updateOrderStatus, upsertUser } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";

const productInput = z.object({
  id: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  name: z.string().min(3).max(180), description: z.string().min(10).max(5000),
  priceCents: z.number().int().positive(), category: z.string().min(2).max(40),
  badge: z.string().max(60).optional().nullable(), tags: z.array(z.string().min(1).max(40)).max(8),
  shopeeUrl: z.string().url().optional().nullable(), active: z.boolean(), featured: z.boolean(),
  images: z.array(z.object({ url: z.string().url().or(z.string().startsWith("/manus-storage/")), storageKey: z.string().max(512).optional().nullable(), alt: z.string().max(180).optional().nullable() })).min(1).max(8),
  sizes: z.array(z.object({ size: z.string().min(1).max(20), available: z.boolean() })).min(1).max(10),
});

function matchesSecret(value: string, expected: string) {
  const valueHash = createHash("sha256").update(value).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(valueHash, expectedHash);
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  adminAuth: router({
    login: publicProcedure.input(z.object({ email: z.string().email().max(320), password: z.string().min(1).max(512) })).mutation(async ({ input, ctx }) => {
      const configuredEmail = ENV.adminLoginEmail.trim().toLowerCase();
      const configuredPassword = ENV.adminLoginPassword;
      const validEmail = configuredEmail && matchesSecret(input.email.trim().toLowerCase(), configuredEmail);
      const validPassword = configuredPassword && matchesSecret(input.password, configuredPassword);
      if (!validEmail || !validPassword) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciais administrativas inválidas." });
      }

      const openId = "local_store_administrator";
      await upsertUser({ openId, name: "Administradora da loja", email: configuredEmail, loginMethod: "password", role: "admin", lastSignedIn: new Date() });
      const sessionToken = await sdk.createSessionToken(openId, { name: "Administradora", expiresInMs: ONE_YEAR_MS });
      ctx.res.cookie(COOKIE_NAME, sessionToken, { ...getSessionCookieOptions(ctx.req), maxAge: ONE_YEAR_MS });
      return { success: true } as const;
    }),
  }),
  catalog: router({
    list: publicProcedure.query(() => listPublicProducts()),
    trackWhatsAppOrder: publicProcedure.input(z.object({
      customerName: z.string().min(2).max(180), customerPhone: z.string().min(8).max(40),
      items: z.array(z.object({ productId: z.string().min(1), size: z.string().min(1).max(20), quantity: z.number().int().min(1).max(99) })).min(1).max(50),
    })).mutation(({ input }) => createTrackedOrder(input)),
  }),
  admin: router({
    products: adminProcedure.query(() => listAdminProducts()),
    saveProduct: adminProcedure.input(productInput).mutation(({ input }) => saveProduct(input)),
    archiveProduct: adminProcedure.input(z.object({ id: z.string().min(1).max(100) })).mutation(({ input }) => archiveProduct(input.id)),
    orders: adminProcedure.query(() => listOrders()),
    updateOrderStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "responded", "completed"]) })).mutation(({ input }) => updateOrderStatus(input.id, input.status)),
    uploadImage: adminProcedure.input(z.object({ fileName: z.string().min(1).max(120), mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]), dataBase64: z.string().min(8).max(7_000_000) })).mutation(async ({ input }) => {
      const bytes = Buffer.from(input.dataBase64, "base64");
      if (!bytes.length || bytes.length > 5 * 1024 * 1024) throw new Error("A imagem deve ter no máximo 5 MB");
      const extension = input.mimeType === "image/png" ? "png" : input.mimeType === "image/webp" ? "webp" : "jpg";
      return storagePut(`products/${crypto.randomUUID()}.${extension}`, bytes, input.mimeType);
    }),
  }),
});

export type AppRouter = typeof appRouter;
