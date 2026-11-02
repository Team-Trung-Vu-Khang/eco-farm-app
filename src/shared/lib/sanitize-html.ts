import DOMPurify from "dompurify";

// Editor (eco-shared-ui) xuất video YouTube dạng <iframe>, chỉ giữ lại iframe từ nguồn này
const ALLOWED_IFRAME_SRC =
  /^https:\/\/(www\.)?(youtube-nocookie\.com|youtube\.com)\/embed\//;

DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  if (data.tagName !== "iframe") return;
  const src = (node as Element).getAttribute?.("src") ?? "";
  if (!ALLOWED_IFRAME_SRC.test(src)) {
    node.parentNode?.removeChild(node);
  }
});

/**
 * Làm sạch HTML trước khi render bằng dangerouslySetInnerHTML (chống XSS).
 * Giữ nguyên thẻ định dạng, class, style; chỉ loại bỏ script, event handler, javascript: URL.
 */
export function sanitizeHtml(html: unknown): string {
  if (html === null || html === undefined) return "";
  return DOMPurify.sanitize(String(html), {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "target"],
  });
}
