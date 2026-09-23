import {
  History,
  Home,
  Map,
  NotebookPen,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export interface MobileNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Các tiền tố đường dẫn cũng coi là đang ở tab này */
  matchPrefixes: string[];
  /** Hành động chính — hiển thị nút nổi ở giữa thanh điều hướng */
  isPrimary?: boolean;
}

export const MOBILE_HOME_PATH = "/home";

export const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  {
    label: "Trang chủ",
    href: MOBILE_HOME_PATH,
    icon: Home,
    matchPrefixes: [MOBILE_HOME_PATH],
  },
  {
    label: "Vùng trồng",
    href: "/dashboard",
    icon: Map,
    matchPrefixes: ["/dashboard"],
  },
  {
    label: "Cập nhật",
    href: "/diary/incident",
    icon: NotebookPen,
    matchPrefixes: ["/diary/incident"],
    isPrimary: true,
  },
  {
    label: "Lịch sử",
    href: "/diary/daily-history",
    icon: History,
    matchPrefixes: ["/diary/daily-history", "/diary/update"],
  },
  {
    label: "Tài khoản",
    href: "/profile",
    icon: UserRound,
    matchPrefixes: ["/profile"],
  },
];

export const isNavItemActive = (item: MobileNavItem, location: string) =>
  item.matchPrefixes.some(
    (prefix) => location === prefix || location.startsWith(`${prefix}/`),
  );
