import { useQuery } from "@tanstack/react-query";
import { workspaceApi } from "../api/workspace.api";
import type {
  WorkspacePageResponse,
  WorkspaceQueryParams,
  WorkspaceRecord,
} from "../types/workspace.type";

export const workspaceKeys = {
  all: ["workspaces"] as const,
  list: (params?: WorkspaceQueryParams) =>
    ["workspaces", "list", params ?? {}] as const,
};

interface UseWorkspacesOptions {
  enabled?: boolean;
}

export function useWorkspaces(
  params?: WorkspaceQueryParams,
  { enabled = true }: UseWorkspacesOptions = {},
) {
  const queryResult = useQuery<WorkspacePageResponse<WorkspaceRecord>, Error>({
    queryKey: workspaceKeys.list(params),
    queryFn: () => workspaceApi.list(params),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    response: queryResult.data ?? null,
    // Keep the UI from showing an endless spinner during background refetches.
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}
