import { useQuery } from "@tanstack/react-query";
import { organizationApi } from "../api/organization.api";
import type { OrganizationRecord } from "../types/organization.type";

export const organizationDetailKeys = {
  all: ["organizations", "detail"] as const,
  byId: (id: number | string, workspaceId?: number | string) =>
    ["organizations", "detail", workspaceId ?? "missing", id] as const,
};

interface UseOrganizationByIdOptions {
  enabled?: boolean;
}

export function useOrganizationById(
  id: number | string,
  workspaceId: number | string,
  { enabled = true }: UseOrganizationByIdOptions = {},
) {
  const queryResult = useQuery<OrganizationRecord, Error>({
    queryKey: organizationDetailKeys.byId(id, workspaceId),
    queryFn: () => organizationApi.getById(id, workspaceId),
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
