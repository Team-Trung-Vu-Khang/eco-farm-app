import { describe, expect, it } from "vitest";
import { toSafeInternalPath } from "./safe-redirect";

describe("toSafeInternalPath", () => {
  it("chấp nhận đường dẫn nội bộ", () => {
    expect(toSafeInternalPath("/farm/1?tab=a#x")).toBe("/farm/1?tab=a#x");
    expect(toSafeInternalPath("/enterprise")).toBe("/enterprise");
  });

  it.each([
    "https://evil.com",
    "//evil.com",
    "/\\evil.com",
    "javascript:alert(1)",
    "evil.com",
    "",
    null,
    undefined,
  ])("chặn %s", (input) => {
    expect(toSafeInternalPath(input)).toBeNull();
  });
});
