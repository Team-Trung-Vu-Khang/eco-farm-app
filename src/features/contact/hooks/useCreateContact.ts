import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { contactApi } from "../api/contact.api";
import { contactKeys } from "./useContacts";
import type {
  ContactCreateRequest,
  ContactCreateResponse,
} from "../types/contact.type";

interface UseCreateContactOptions {
  onSuccess?: (
    data: ContactCreateResponse,
    variables: ContactCreateRequest,
  ) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
}

export function useCreateContact({
  onSuccess,
  onError,
  invalidateList = true,
}: UseCreateContactOptions = {}) {
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();

  const mutation = useMutation<
    ContactCreateResponse,
    Error,
    ContactCreateRequest
  >({
    mutationFn: (payload) => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === ""
      ) {
        throw new Error("Missing workspace id for contact create");
      }

      return contactApi.create(payload, workspaceId);
    },
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({
          queryKey: contactKeys.all,
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    createContact: mutation.mutateAsync,
  };
}
