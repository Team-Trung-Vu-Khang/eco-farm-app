import { useQuery } from "@tanstack/react-query";
import { adminProductionZoneApi } from "../api/admin-production-zone.api";
import type {
  FarmAdminProductionZoneFilter,
  FarmAdminProductionZoneGroupsResponse,
  PageResponseFarmAdminProductionZoneItem,
} from "../types/admin-production-zone.type";

export const adminProductionZoneKeys = {
  all: () => ["admin", "production-zones"] as const,
  groups: (filter?: FarmAdminProductionZoneFilter, page = 0, size = 100) =>
    ["admin", "production-zones", "groups", filter ?? {}, page, size] as const,
  workspaceZones: (
    workspaceId: number | null,
    filter?: FarmAdminProductionZoneFilter,
    page = 0,
    size = 20,
  ) =>
    [
      "admin",
      "production-zones",
      "workspace-zones",
      workspaceId,
      filter ?? {},
      page,
      size,
    ] as const,
};

interface UseAdminProductionZoneGroupsOptions {
  filter?: FarmAdminProductionZoneFilter;
  page?: number;
  size?: number;
  enabled?: boolean;
}

export function useAdminProductionZoneGroups({
  filter,
  page = 0,
  size = 100,
  enabled = true,
}: UseAdminProductionZoneGroupsOptions = {}) {
  const queryResult = useQuery<FarmAdminProductionZoneGroupsResponse, Error>({
    queryKey: adminProductionZoneKeys.groups(filter, page, size),
    queryFn: () => adminProductionZoneApi.getGroups(filter, page, size),
    enabled,
  });

  return {
    ...queryResult,
    groups: queryResult.data?.content ?? [],
    totalZones: queryResult.data?.totalZones ?? 0,
    totalWorkspaces: queryResult.data?.totalElements ?? queryResult.data?.content?.length ?? 0,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}

interface UseAdminWorkspaceProductionZonesOptions {
  workspaceId: number | null;
  filter?: FarmAdminProductionZoneFilter;
  page?: number;
  size?: number;
  enabled?: boolean;
}

export function useAdminWorkspaceProductionZones({
  workspaceId,
  filter,
  page = 0,
  size = 20,
  enabled = true,
}: UseAdminWorkspaceProductionZonesOptions) {
  const isEnabled = enabled && workspaceId !== null && workspaceId !== undefined && workspaceId > 0;

  const queryResult = useQuery<PageResponseFarmAdminProductionZoneItem, Error>({
    queryKey: adminProductionZoneKeys.workspaceZones(workspaceId, filter, page, size),
    queryFn: () => adminProductionZoneApi.getWorkspaceZones(workspaceId!, filter, page, size),
    enabled: isEnabled,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    pageResponse: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}
