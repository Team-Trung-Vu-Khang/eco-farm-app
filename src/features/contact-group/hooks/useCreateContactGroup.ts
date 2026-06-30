import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { contactGroupApi } from "../api/contact-group.api";
import { contactGroupKeys } from "./useContactGroups";
import type {
  ContactGroupCreateRequest,
  ContactGroupCreateResponse,
} from "../types/contact-group.type";

interface UseCreateContactGroupOptions {
  onSuccess?: (
    data: ContactGroupCreateResponse,
    variables: ContactGroupCreateRequest,
  ) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
}

export function useCreateContactGroup({
  onSuccess,
  onError,
  invalidateList = true,
}: UseCreateContactGroupOptions = {}) {
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();

  const mutation = useMutation<
    ContactGroupCreateResponse,
    Error,
    ContactGroupCreateRequest
  >({
    mutationFn: (payload) => {
      if (workspaceId === null || workspaceId === undefined || workspaceId === "") {
        throw new Error("Missing workspace id for contact group create");
      }

      return contactGroupApi.create(payload, workspaceId);
    },
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({
          queryKey: contactGroupKeys.all,
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    createContactGroup: mutation.mutateAsync,
  };
}
