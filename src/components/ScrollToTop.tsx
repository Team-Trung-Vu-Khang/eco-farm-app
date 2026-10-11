import { useEffect } from "react";
import { useLocation } from "wouter";
import { useIsMobile } from "@Team-Trung-Vu-Khang/eco-shared-ui";

/**
 * Tự động cuộn lên đầu trang mỗi khi chuyển trang (route change) trên giao diện mobile.
 */
export function ScrollToTop() {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [location, isMobile]);

  return null;
}

export default ScrollToTop;
