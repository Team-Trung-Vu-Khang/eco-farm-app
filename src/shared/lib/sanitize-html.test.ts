import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "./sanitize-html";

describe("sanitizeHtml", () => {
  it("giữ nguyên HTML định dạng của editor", () => {
    const html =
      '<p class="editor-paragraph" style="text-align: center;"><strong style="color: rgb(255, 0, 0);">Đỏ</strong></p>' +
      '<table><tbody><tr><td colspan="2">x</td></tr></tbody></table>' +
      '<img src="https://cdn.example.com/a.png" width="300"><a href="https://example.com" target="_blank">link</a>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it("giữ iframe YouTube", () => {
    const html =
      '<iframe src="https://www.youtube-nocookie.com/embed/abc" allowfullscreen="true" frameborder="0"></iframe>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it("xoá script, event handler, javascript: URL và iframe lạ", () => {
    const out = sanitizeHtml(
      '<p>ok</p><script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">x</a><iframe src="https://evil.com"></iframe>',
    );
    expect(out).toBe('<p>ok</p><img src="x"><a>x</a>');
  });

  it("trả về chuỗi rỗng cho null/undefined", () => {
    expect(sanitizeHtml(null)).toBe("");
    expect(sanitizeHtml(undefined)).toBe("");
  });
});
