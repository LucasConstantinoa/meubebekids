import { describe, expect, it } from "vitest";
import { prepareUserUpsert } from "./db";

describe("admin session persistence", () => {
  it("keeps the password login method and admin role when renewing a local admin session", () => {
    const now = new Date("2026-08-21T03:10:00.000Z");
    const initial = prepareUserUpsert({ openId: "local_store_administrator", name: "Administradora", email: "admin@example.com", loginMethod: "password", role: "admin" }, now);
    const renewal = prepareUserUpsert({ openId: "local_store_administrator" }, now);

    expect(initial.values).toMatchObject({ role: "admin", loginMethod: "password" });
    expect(renewal.updateSet).toEqual({ lastSignedIn: now });
    expect(renewal.updateSet).not.toHaveProperty("role");
    expect(renewal.updateSet).not.toHaveProperty("loginMethod");
  });
});
