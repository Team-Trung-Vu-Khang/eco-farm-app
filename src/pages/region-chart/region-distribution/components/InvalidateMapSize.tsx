import { useEffect } from "react";
import { useMap } from "react-leaflet";

/**
 * Component hỗ trợ tự động tính toán lại kích thước Leaflet container:
 * - Gọi map.invalidateSize() ngay khi mount, qua requestAnimationFrame và các mốc timeout (150ms, 400ms) để đón đầu hiệu ứng render chuyển bước của Stepper.
 * - Sử dụng ResizeObserver quan sát trực tiếp phần tử DOM của container để cập nhật ngay khi kích thước thay đổi (xoay màn hình di động, mở rộng/thu nhỏ modal, điều chỉnh layout).
 */
export const InvalidateMapSize = () => {
  const map = useMap();

  useEffect(() => {
    // 1. Kích hoạt ngay lập tức
    map.invalidateSize();

    // 2. Chạy sau animation frame và các mốc thời gian chuyển step
    const frame = window.requestAnimationFrame(() => {
      map.invalidateSize();
    });
    const timer1 = window.setTimeout(() => {
      map.invalidateSize();
    }, 150);
    const timer2 = window.setTimeout(() => {
      map.invalidateSize();
    }, 400);

    // 3. Sử dụng ResizeObserver để lắng nghe thay đổi kích thước DOM container
    const container = map.getContainer();
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && container) {
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(container);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [map]);

  return null;
};
