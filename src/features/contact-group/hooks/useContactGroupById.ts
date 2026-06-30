import { useQuery } from "@tanstack/react-query";
import { contactGroupApi } from "../api/contact-group.api";
import type { ContactGroupRecord } from "../types/contact-group.type";
import { useSelectedWorkspaceId } from "@/features/workspace";

export const contactGroupDetailKeys = {
  all: ["contact-groups", "detail"] as const,
  byId: (workspaceId: number | string | null | undefined, id: number | string) =>
    ["contact-groups", "detail", workspaceId ?? "missing", id] as const,
};

interface UseContactGroupByIdOptions {
  enabled?: boolean;
}

export function useContactGroupById(
  id: number | string | null | undefined,
  { enabled = true }: UseContactGroupByIdOptions = {},
) {
  const workspaceId = useSelectedWorkspaceId();

  const queryResult = useQuery<ContactGroupRecord, Error>({
    queryKey: contactGroupDetailKeys.byId(workspaceId, id ?? ""),
    queryFn: () => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === "" ||
        id === null ||
        id === undefined ||
        id === ""
      ) {
        throw new Error("Missing contact group id or workspace id");
      }

      return contactGroupApi.getById(id, workspaceId);
    },
    enabled:
      enabled &&
      workspaceId !== null &&
      workspaceId !== undefined &&
      workspaceId !== "" &&
      id !== null &&
      id !== undefined &&
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
