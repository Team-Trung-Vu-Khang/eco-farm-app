import { useQuery } from "@tanstack/react-query";
import { branchApi } from "../api/branch.api";
import type { BranchRecord } from "../types/branch.type";

export const branchDetailKeys = {
  all: ["branches", "detail"] as const,
  byId: (id: number | string, workspaceId?: number | string) =>
    ["branches", "detail", workspaceId ?? "missing", id] as const,
};

interface UseBranchByIdOptions {
  enabled?: boolean;
}

export function useBranchById(
  id: number | string,
  workspaceId: number | string,
  { enabled = true }: UseBranchByIdOptions = {},
) {
  const queryResult = useQuery<BranchRecord, Error>({
    queryKey: branchDetailKeys.byId(id, workspaceId),
    queryFn: () => branchApi.getById(id, workspaceId),
    enabled:
      enabled &&
      workspaceId !== undefined &&
      workspaceId !== null &&
      workspaceId !== "" &&
      id !== undefined &&
      id !== null &&
      id !== "",
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
