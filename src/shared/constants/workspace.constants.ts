import {
  DEFAULT_WORKSPACE_FEATURE_PREFIXES,
  formatWorkspaceFeatureName,
  stripWorkspaceFeaturePrefix,
  WORKSPACE_CHANGE_EVENT,
  WORKSPACE_DATA_UPDATED_EVENT,
  type WorkspaceFeatureType,
  type FormatWorkspaceFeatureNameOptions,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

/**
 * Constant cấu hình của eco-farm-app (kế thừa từ shared-ui và có thể override nếu cần)
 */
export const APP_WORKSPACE_FEATURE_PREFIXES: Record<string, string> = {
  ...DEFAULT_WORKSPACE_FEATURE_PREFIXES,
};

/**
 * Hàm format tên workspace tiện ích của app, mặc định sử dụng APP_WORKSPACE_FEATURE_PREFIXES
 * và cho phép options.customPrefix / options.prefixes override bất cứ lúc nào.
 */
export function formatAppWorkspaceFeatureName(
  name?: string | null,
  feature: WorkspaceFeatureType = "farm",
  options?: FormatWorkspaceFeatureNameOptions,
): string {
  return formatWorkspaceFeatureName(name, feature, {
    prefixes: APP_WORKSPACE_FEATURE_PREFIXES,
    ...options,
  });
}

/**
 * Hàm bóc tách loại bỏ tiền tố prefix của app (để tránh người dùng nhập trùng prefix vào input)
 */
export function stripAppWorkspaceFeaturePrefix(
  name?: string | null,
  feature: WorkspaceFeatureType = "farm",
  options?: FormatWorkspaceFeatureNameOptions,
): string {
  return stripWorkspaceFeaturePrefix(name, feature, {
    prefixes: APP_WORKSPACE_FEATURE_PREFIXES,
    ...options,
  });
}

export const WORKSPACE_API_PATHS = {
  center: "/api/center/workspaces",
  current: "/api/center/workspaces/current",
  admin: "/api/admin/workspaces",
} as const;

export {
  DEFAULT_WORKSPACE_FEATURE_PREFIXES,
  formatWorkspaceFeatureName,
  stripWorkspaceFeaturePrefix,
  WORKSPACE_CHANGE_EVENT,
  WORKSPACE_DATA_UPDATED_EVENT,
  type WorkspaceFeatureType,
  type FormatWorkspaceFeatureNameOptions,
};

