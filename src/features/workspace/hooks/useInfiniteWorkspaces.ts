import { useInfiniteQuery } from "@tanstack/react-query";
import { workspaceApi } from "../api/workspace.api";
import { workspaceKeys } from "./useWorkspaces";
import type {
  WorkspacePageResponse,
  WorkspaceQueryParams,
  WorkspaceRecord,
} from "../types/workspace.type";

interface UseInfiniteWorkspacesOptions {
  enabled?: boolean;
}

export function useInfiniteWorkspaces(
  params?: Omit<WorkspaceQueryParams, "page">,
  { enabled = true }: UseInfiniteWorkspacesOptions = {},
) {
  const queryResult = useInfiniteQuery<WorkspacePageResponse<WorkspaceRecord>, Error>({
    queryKey: [...workspaceKeys.all, "infinite", params ?? {}] as const,
    queryFn: ({ pageParam = 0 }) =>
      workspaceApi.list({
        ...params,
        page: pageParam as number,
        size: params?.size ?? 20,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last || lastPage.page + 1 >= lastPage.totalPages
        ? undefined
        : lastPage.page + 1,
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const workspaces =
    queryResult.data?.pages.flatMap((page) => page.content) ?? [];

  return {
    ...queryResult,
    workspaces,
    totalElements: queryResult.data?.pages[0]?.totalElements ?? 0,
  };
}
