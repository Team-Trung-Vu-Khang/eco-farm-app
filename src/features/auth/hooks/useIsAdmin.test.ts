import { describe, expect, it } from "vitest";
import { isUserAdmin } from "./useIsAdmin";

const jwt = (payload: object) =>
  `h.${btoa(JSON.stringify(payload)).replace(/=+$/, "")}.s`;

describe("isUserAdmin", () => {
  it("nhận admin từ roleCodes", () => {
    expect(isUserAdmin({ roleCodes: ["MEVI_ADMIN"] })).toBe(true);
  });

  it("nhận admin từ workspaceRoles", () => {
    expect(isUserAdmin({ workspaceRoles: [{ roleCode: "SUPER_ADMIN" }] })).toBe(true);
  });

  it("user thường không phải admin", () => {
    expect(isUserAdmin({ roleCodes: ["FARMER"], workspaceRoles: [] })).toBe(false);
  });

  it("fallback đọc role từ JWT", () => {
    expect(isUserAdmin(null, jwt({ roles: ["ADMIN"] }))).toBe(true);
    expect(isUserAdmin(null, jwt({ role: "FARMER" }))).toBe(false);
  });

  it("token hỏng không gây lỗi", () => {
    expect(isUserAdmin(null, "not-a-jwt")).toBe(false);
  });
});
