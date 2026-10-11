import {
  MOBILE_HOME_PATH,
  MOBILE_NAV_ITEMS,
  isNavItemActive,
  resolveAdminMenu,
  type AdminMenuSection,
  type MobileNavItem,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AUTH_PATHS } from "../../shared/constants/auth.constants";

const adminSidebarMenu = resolveAdminMenu({ isDev: true, isMevi: true });

function extractAllSidebarHrefs(sections: AdminMenuSection[]): string[] {
  const hrefs: string[] = [];
  sections.forEach((section) => {
    if ("items" in section && Array.isArray(section.items)) {
      section.items.forEach((item) => {
        if (item.href) hrefs.push(item.href);
        item.children?.forEach((child) => {
          if (child.href) hrefs.push(child.href);
        });
      });
    }
  });
  return hrefs;
}

const SIDEBAR_HREFS = extractAllSidebarHrefs(adminSidebarMenu);

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
 * 5. Các trang tính năng thuộc Sidebar hệ thống và các trang con của chúng (/enterprise, /crop, /personnel...)
 */
export function isAcceptedMobileRoute(
  pathname: string,
  navItems: MobileNavItem[] = MOBILE_NAV_ITEMS,
): boolean {
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

  // 3. Khớp với bất kỳ tab nào trong navItems (Trang chủ, Vườn, Ghi nhật ký, Nhật ký, Tài khoản...)
  if (navItems.some((item) => isNavItemActive(item, normalizedPath))) {
    return true;
  }

  // 4. Toàn bộ các trang con thuộc phân hệ Nhật ký / Lịch sử
  if (
    normalizedPath.startsWith("/diary") ||
    normalizedPath.startsWith("/history")
  ) {
    return true;
  }

  // 5. Toàn bộ các trang thuộc tính năng Sidebar và sub-pages tương ứng
  if (
    SIDEBAR_HREFS.some((href) => {
      const cleanHref = href.split("?")[0].replace(/\/$/, "");
      if (!cleanHref || cleanHref === "/") return false;
      return (
        normalizedPath === cleanHref ||
        normalizedPath.startsWith(`${cleanHref}/`)
      );
    })
  ) {
    return true;
  }

  return false;
}
