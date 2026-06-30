import { useQuery } from "@tanstack/react-query";
import { contactGroupApi } from "../api/contact-group.api";
import type {
  ContactGroupPageResponse,
  ContactGroupQueryParams,
  ContactGroupRecord,
} from "../types/contact-group.type";
import { useSelectedWorkspaceId } from "@/features/workspace";

export const contactGroupKeys = {
  all: ["contact-groups"] as const,
  list: (workspaceId: number | string | null | undefined, params?: ContactGroupQueryParams) =>
    ["contact-groups", "list", workspaceId ?? "missing", params ?? {}] as const,
  detail: (workspaceId: number | string | null | undefined, id: number | string) =>
    ["contact-groups", "detail", workspaceId ?? "missing", id] as const,
};

interface UseContactGroupsOptions {
  params?: ContactGroupQueryParams;
  enabled?: boolean;
}

export function useContactGroups({
  params,
  enabled = true,
}: UseContactGroupsOptions = {}) {
  const workspaceId = useSelectedWorkspaceId();

  const queryResult = useQuery<
    ContactGroupPageResponse<ContactGroupRecord>,
    Error
  >({
    queryKey: contactGroupKeys.list(workspaceId, params),
    queryFn: () => {
      if (workspaceId === null || workspaceId === undefined || workspaceId === "") {
        throw new Error("Missing workspace id for contact groups");
      }

      return contactGroupApi.list(params, workspaceId);
    },
    enabled:
      enabled &&
      workspaceId !== null &&
      workspaceId !== undefined &&
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
