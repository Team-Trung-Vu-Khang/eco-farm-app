import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { MOBILE_HOME_PATH } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { isAcceptedMobileRoute } from "./mobileRouteUtils";

export interface MobileRouteGuardProps {
  children: ReactNode;
}

/**
 * MobileRouteGuard
 * Trên giao diện mobile (bottom tab), nếu người dùng đang ở một trang không thuộc
 * danh sách các trang được chấp nhận (không có trên bottom tab hoặc subpage tương ứng),
 * tự động chuyển hướng về trang chủ (/home).
 */
export function MobileRouteGuard({ children }: MobileRouteGuardProps) {
  const [location, setLocation] = useLocation();
  const isAccepted = isAcceptedMobileRoute(location);

  useEffect(() => {
    if (!isAccepted) {
      setLocation(MOBILE_HOME_PATH, { replace: true });
    }
  }, [isAccepted, location, setLocation]);

  // Khi route chưa được chấp nhận, không render nội dung để tránh mount các trang admin không tương thích
  if (!isAccepted) {
    return null;
  }

  return <>{children}</>;
}
