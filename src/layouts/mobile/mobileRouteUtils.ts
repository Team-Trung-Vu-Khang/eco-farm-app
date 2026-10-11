import {
  MOBILE_HOME_PATH,
  MOBILE_NAV_ITEMS,
  isNavItemActive,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AUTH_PATHS } from "../../shared/constants/auth.constants";

/**
 * Kiểm tra xem một pathname có thuộc các page được chấp nhận trên giao diện mobile (bottom tab) hay không.
 *
 * Các page được chấp nhận bao gồm:
 * 1. Các route xác thực: /auth/*
 * 2. Trang chủ: "/" hoặc "/home" (MOBILE_HOME_PATH)
 * 3. Các tab trong MOBILE_NAV_ITEMS:
 *    - Trang chủ (/home)
 *    - Vườn (/dashboard)
 *    - Ghi nhật ký (/diary/incident)
 *    - Nhật ký (/diary/daily-history, /diary/update, /diary/history)
 *    - Tài khoản (/profile)
 * 4. Các trang phụ trợ thuộc phân hệ Nhật ký (/diary/*, /history/*)
 */
export function isAcceptedMobileRoute(pathname: string): boolean {
  const rawPath = pathname.split("?")[0].split("#")[0].trim() || "/";
  const normalizedPath =
    rawPath.length > 1 && rawPath.endsWith("/")
      ? rawPath.slice(0, -1)
      : rawPath;

  // 1. Luôn cho phép các luồng xác thực / đăng nhập OAuth callback
  if (
    normalizedPath.startsWith(AUTH_PATHS.callback) ||
    normalizedPath.startsWith("/auth")
  ) {
    return true;
  }

  // 2. Trang chủ root hoặc MOBILE_HOME_PATH (/home)
  if (
    normalizedPath === "/" ||
    normalizedPath === MOBILE_HOME_PATH ||
    normalizedPath.startsWith(`${MOBILE_HOME_PATH}/`)
  ) {
    return true;
  }

  // 3. Khớp với bất kỳ tab nào trong MOBILE_NAV_ITEMS (Trang chủ, Vườn, Ghi nhật ký, Nhật ký, Tài khoản)
  if (MOBILE_NAV_ITEMS.some((item) => isNavItemActive(item, normalizedPath))) {
    return true;
  }

  // 4. Toàn bộ các trang con thuộc phân hệ Nhật ký / Lịch sử
  if (
    normalizedPath.startsWith("/diary") ||
    normalizedPath.startsWith("/history")
  ) {
    return true;
  }

  return false;
}
