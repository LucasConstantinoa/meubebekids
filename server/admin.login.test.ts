import { describe, expect, it, vi } from "vitest";

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return { ...actual, upsertUser: vi.fn().mockResolvedValue(undefined) };
});

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { COOKIE_NAME } from "../shared/const";

describe("adminAuth.login", () => {
  it("accepts the configured administrative credentials and writes a session cookie", async () => {
    const email = process.env.ADMIN_LOGIN_EMAIL;
    const password = process.env.ADMIN_LOGIN_PASSWORD;
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();

    const cookies: Array<{ name: string; value: string }> = [];
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {
        cookie: (name: string, value: string) => { cookies.push({ name, value }); },
      } as TrpcContext["res"],
    };

    const result = await appRouter.createCaller(ctx).adminAuth.login({
      email: email!,
      password: password!,
    });

    expect(result).toEqual({ success: true });
    expect(cookies).toHaveLength(1);
    expect(cookies[0]?.name).toBe(COOKIE_NAME);
    expect(cookies[0]?.value.length).toBeGreaterThan(20);
  });
});
