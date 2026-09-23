import { useSyncExternalStore } from "react";

/**
 * Giao diện trên điện thoại:
 * - "app"     : giao diện mobile mới (bottom navigation) — mặc định
 * - "classic" : giao diện hiện tại (sidebar của AdminLayout)
 */
export type MobileUiMode = "app" | "classic";

const STORAGE_KEY = "eco-farm:mobile-ui-mode";
const CHANGE_EVENT = "eco-farm:mobile-ui-mode-change";
const DEFAULT_MODE: MobileUiMode = "app";

// Dự phòng khi localStorage bị chặn (private mode): giữ lựa chọn trong phiên
let memoryMode: MobileUiMode | null = null;

const readMode = (): MobileUiMode => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "classic" || value === "app") return value;
  } catch {
    // ignore
  }
  return memoryMode ?? DEFAULT_MODE;
};

export const setMobileUiMode = (mode: MobileUiMode) => {
  memoryMode = mode;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore — memoryMode vẫn áp dụng trong phiên hiện tại
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

const subscribe = (onChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

export function useMobileUiMode() {
  return useSyncExternalStore(subscribe, readMode, () => DEFAULT_MODE);
}
