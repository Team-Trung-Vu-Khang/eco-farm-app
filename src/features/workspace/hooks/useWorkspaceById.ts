import { useQuery } from "@tanstack/react-query";
import { workspaceApi } from "../api/workspace.api";
import type { WorkspaceRecord } from "../types/workspace.type";

export const workspaceDetailKeys = {
  all: ["workspaces", "detail"] as const,
  byId: (id: number | string) => ["workspaces", "detail", id] as const,
};

interface UseWorkspaceByIdOptions {
  enabled?: boolean;
}

export function useWorkspaceById(
  id: number | string,
  { enabled = true }: UseWorkspaceByIdOptions = {},
) {
  const queryResult = useQuery<WorkspaceRecord, Error>({
    queryKey: workspaceDetailKeys.byId(id),
    queryFn: () => workspaceApi.getById(id),
    enabled: enabled && id !== undefined && id !== null && id !== "",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    item: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}
