import { useQuery } from "@tanstack/react-query";
import { organizationApi } from "../api/organization.api";
import type {
  OrganizationPageResponse,
  OrganizationQueryParams,
  OrganizationRecord,
} from "../types/organization.type";

export const organizationKeys = {
  all: ["organizations"] as const,
  list: (params?: OrganizationQueryParams, workspaceId?: number | string) =>
    ["organizations", "list", workspaceId ?? "missing", params ?? {}] as const,
};

interface UseOrganizationsOptions {
  enabled?: boolean;
}

export function useOrganizations(
  params: OrganizationQueryParams | undefined,
  workspaceId: number | string,
  { enabled = true }: UseOrganizationsOptions = {},
) {
  const queryResult = useQuery<
    OrganizationPageResponse<OrganizationRecord>,
    Error
  >({
    queryKey: organizationKeys.list(params, workspaceId),
    queryFn: () => organizationApi.list(params ?? {}, workspaceId),
    enabled: enabled && workspaceId !== undefined && workspaceId !== null && workspaceId !== "",
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
