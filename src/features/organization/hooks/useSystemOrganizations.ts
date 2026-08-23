import { useQuery } from "@tanstack/react-query";
import { organizationApi } from "../api/organization.api";
import type { OrganizationPageResponse, OrganizationQueryParams, OrganizationRecord } from "../types/organization.type";

export function useSystemOrganizations(params: OrganizationQueryParams = {}) {
  const query = useQuery<OrganizationPageResponse<OrganizationRecord>, Error>({
    queryKey: ["system-organizations", params],
    queryFn: () => organizationApi.listSystem(params),
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    items: (query.data?.content ?? []).filter(
      (item): item is OrganizationRecord => Boolean(item),
    ),
    response: query.data ?? null,
    loading: query.isLoading,
    error: query.error?.message ?? null,
  };
}
