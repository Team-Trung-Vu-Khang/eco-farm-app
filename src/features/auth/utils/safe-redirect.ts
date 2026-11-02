/**
 * Chỉ chấp nhận đường dẫn nội bộ (bắt đầu bằng "/") để chống open redirect.
 * Chặn "//evil.com", "/\evil.com", "https://evil.com", "javascript:..."
 */
export function toSafeInternalPath(path: string | null | undefined): string | null {
  if (!path) return null;
  const value = path.trim();
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return null;
  }

  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    return url.pathname + url.search + url.hash;
  } catch {
    return null;
  }
}
