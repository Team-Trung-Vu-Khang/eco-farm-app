import { useQuery } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { contactApi } from "../api/contact.api";
import type {
  ContactPageResponse,
  ContactQueryParams,
  ContactRecord,
} from "../types/contact.type";

export const contactKeys = {
  all: ["contacts"] as const,
  list: (workspaceId: number | string | null | undefined, params?: ContactQueryParams) =>
    ["contacts", "list", workspaceId ?? "missing", params ?? {}] as const,
  detail: (workspaceId: number | string | null | undefined, id: number | string) =>
    ["contacts", "detail", workspaceId ?? "missing", id] as const,
};

interface UseContactsOptions {
  params?: ContactQueryParams;
  enabled?: boolean;
}

export function useContacts({ params, enabled = true }: UseContactsOptions = {}) {
  const workspaceId = useSelectedWorkspaceId();

  const queryResult = useQuery<ContactPageResponse<ContactRecord>, Error>({
    queryKey: contactKeys.list(workspaceId, params),
    queryFn: () => {
      if (workspaceId === null || workspaceId === undefined || workspaceId === "") {
        throw new Error("Missing workspace id for contacts");
      }

      return contactApi.list(params, workspaceId);
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
