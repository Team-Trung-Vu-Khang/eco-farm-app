import type { Query, QueryClient } from "@tanstack/react-query";

/**
 * Danh sách các query key toàn cục (không phụ thuộc vào workspace đang chọn).
 * Mọi query khác KHÔNG nằm trong danh sách này mặc định được xem là thuộc Workspace.
 */
export function isGlobalQueryKey(queryKey: readonly unknown[]): boolean {
  if (!Array.isArray(queryKey) || queryKey.length === 0) {
    return false;
  }

  const [scope, subScope] = queryKey;

  // 1. Thông tin phiên đăng nhập người dùng (token/auth chung)
  // Lưu ý: "auth-current-user" mang theo queryKey chứa workspaceId và header X-Workspace-Id
  // để lấy danh sách roleCodes riêng theo từng workspace, nên KHÔNG nằm trong danh sách global này.
  if (scope === "auth" || scope === "authToken") {
    return true;
  }

  // 2. Danh mục hành chính quốc gia (Tỉnh / Thành, Quận / Huyện, Xã / Phường)
  if (scope === "geo-locations") {
    return true;
  }

  // 3. Danh bạ ngân hàng & chuẩn đóng gói / đo lường dùng chung hệ thống
  if (
    scope === "bank-directory" ||
    scope === "enterprise-bank-selector-banks" ||
    scope === "base-units" ||
    scope === "packaging-types" ||
    scope === "medicine-toxicity-groups" ||
    scope === "certificate-standards"
  ) {
    return true;
  }

  // 4. Danh sách chọn Workspace (picker list & infinite scroll)
  // Chỉ loại trừ danh sách chọn; thông tin chi tiết workspace ("detail") vẫn được làm mới
  if (
    (scope === "workspaces" || scope === "admin-workspaces") &&
    (subScope === "list" || subScope === "infinite")
  ) {
    return true;
  }

  return false;
}

/**
 * Predicate kiểm tra xem query có thuộc phạm vi của Workspace hay không.
 * Theo nguyên lý "Default-to-Workspace", mọi query không phải là global đều là workspace-scoped.
 */
export function isWorkspaceScopedQuery(query: Query): boolean {
  return !isGlobalQueryKey(query.queryKey);
}

/**
 * Thực hiện chuyển đổi cache toàn diện khi đổi Workspace:
 * 1. Cancel in-flight: Hủy ngay các request đang bay dở để tránh race condition ghi đè data cũ.
 * 2. Remove inactive: Xóa sạch cache của các màn hình đang đóng để tránh flash data cũ khi điều hướng sau này.
 * 3. Invalidate & refetch active: Làm mới và gọi lại ngay lập tức toàn bộ các API đang hiển thị trên màn hình hiện tại.
 */
export async function executeWorkspaceCacheTransition(
  queryClient: QueryClient,
  _newWorkspaceId?: string | number | null,
): Promise<void> {
  // 1. Hủy các query đang fetch dở của workspace cũ
  await queryClient.cancelQueries({
    predicate: isWorkspaceScopedQuery,
  });

  // 2. Xóa cache của các query inactive (màn hình không mở)
  queryClient.removeQueries({
    predicate: isWorkspaceScopedQuery,
    type: "inactive",
  });

  // 3. Invalidate và kích hoạt refetch ngay lập tức cho các query đang active
  await queryClient.invalidateQueries({
    predicate: isWorkspaceScopedQuery,
    refetchType: "all",
  });
}
