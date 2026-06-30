import { useQuery } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { contactApi } from "../api/contact.api";
import type { ContactRecord } from "../types/contact.type";

export const contactDetailKeys = {
  all: ["contacts", "detail"] as const,
  byId: (workspaceId: number | string | null | undefined, id: number | string) =>
    ["contacts", "detail", workspaceId ?? "missing", id] as const,
};

interface UseContactByIdOptions {
  enabled?: boolean;
}

export function useContactById(
  id: number | string | null | undefined,
  { enabled = true }: UseContactByIdOptions = {},
) {
  const workspaceId = useSelectedWorkspaceId();

  const queryResult = useQuery<ContactRecord, Error>({
    queryKey: contactDetailKeys.byId(workspaceId, id ?? ""),
    queryFn: () => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === "" ||
        id === null ||
        id === undefined ||
        id === ""
      ) {
        throw new Error("Missing contact id or workspace id");
      }

      return contactApi.getById(id, workspaceId);
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
