import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(role: AuthenticatedUser["role"]): TrpcContext {
  return {
    user: {
      id: 99,
      openId: "non-admin-user",
      email: "customer@example.com",
      name: "Customer",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("admin access", () => {
  it("blocks a regular customer from accessing managed products", async () => {
    const caller = appRouter.createCaller(createContext("user"));

    await expect(caller.admin.products()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("blocks a regular customer from changing an order status", async () => {
    const caller = appRouter.createCaller(createContext("user"));

    await expect(caller.admin.updateOrderStatus({ id: 1, status: "responded" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("requires the administrator password session for managed operations", async () => {
    const caller = appRouter.createCaller(createContext("admin"));

    await expect(caller.admin.products()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
