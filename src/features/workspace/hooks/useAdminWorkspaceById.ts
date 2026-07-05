import { useQuery } from "@tanstack/react-query";
import { adminWorkspaceApi } from "../api/admin-workspace.api";
import type { WorkspaceRecord } from "../types/workspace.type";

export const adminWorkspaceDetailKeys = {
  all: ["admin-workspaces", "detail"] as const,
  byId: (id: number | string) => ["admin-workspaces", "detail", id] as const,
};

interface UseAdminWorkspaceByIdOptions {
  enabled?: boolean;
}

export function useAdminWorkspaceById(
  id: number | string | null | undefined,
  { enabled = true }: UseAdminWorkspaceByIdOptions = {},
) {
  const queryResult = useQuery<WorkspaceRecord, Error>({
    queryKey: adminWorkspaceDetailKeys.byId(id ?? ""),
    queryFn: () => {
      if (id === null || id === undefined || id === "") {
        throw new Error("Missing workspace id");
      }

      return adminWorkspaceApi.getById(id);
    },
    enabled: enabled && id !== null && id !== undefined && id !== "",
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
