import { useQuery } from "@tanstack/react-query";
import { adminWorkspaceApi } from "../api/admin-workspace.api";
import type {
  WorkspacePageResponse,
  WorkspaceQueryParams,
  WorkspaceRecord,
} from "../types/workspace.type";

export const adminWorkspaceKeys = {
  all: ["admin-workspaces"] as const,
  list: (params?: WorkspaceQueryParams) =>
    ["admin-workspaces", "list", params ?? {}] as const,
};

interface UseAdminWorkspacesOptions {
  params?: WorkspaceQueryParams;
  enabled?: boolean;
}

export function useAdminWorkspaces({
  params,
  enabled = true,
}: UseAdminWorkspacesOptions = {}) {
  const queryResult = useQuery<WorkspacePageResponse<WorkspaceRecord>, Error>({
    queryKey: adminWorkspaceKeys.list(params),
    queryFn: () => adminWorkspaceApi.list(params),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    response: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}
