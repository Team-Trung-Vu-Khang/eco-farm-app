import { useQuery } from "@tanstack/react-query";

import { organizationApi } from "../api/organization.api";
import { organizationKeys } from "./useOrganizations";
import type {
  OrganizationPageResponse,
  OrganizationQueryParams,
  OrganizationRecord,
} from "../types/organization.type";

interface UseOrganizationSearchOptions {
  enabled?: boolean;
}

export function useOrganizationSearch(
  params: OrganizationQueryParams | undefined,
  workspaceId: number | string,
  { enabled = true }: UseOrganizationSearchOptions = {},
) {
  const queryResult = useQuery<
    OrganizationPageResponse<OrganizationRecord>,
    Error
  >({
    queryKey: [...organizationKeys.list(params, workspaceId), "search"] as const,
    queryFn: () => organizationApi.search(params ?? {}, workspaceId),
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
