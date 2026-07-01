import { useQuery } from "@tanstack/react-query";
import { branchApi } from "../api/branch.api";
import type {
  BranchPageResponse,
  BranchQueryParams,
  BranchRecord,
} from "../types/branch.type";

export const branchKeys = {
  all: ["branches"] as const,
  list: (params?: BranchQueryParams, workspaceId?: number | string) =>
    ["branches", "list", workspaceId ?? "missing", params ?? {}] as const,
};

interface UseBranchesOptions {
  enabled?: boolean;
}

export function useBranches(
  params: BranchQueryParams | undefined,
  workspaceId: number | string,
  { enabled = true }: UseBranchesOptions = {},
) {
  const queryResult = useQuery<BranchPageResponse<BranchRecord>, Error>({
    queryKey: branchKeys.list(params, workspaceId),
    queryFn: () => branchApi.list(params ?? {}, workspaceId),
    enabled:
      enabled &&
      workspaceId !== undefined &&
      workspaceId !== null &&
      workspaceId !== "",
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
