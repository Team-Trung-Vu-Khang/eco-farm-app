import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { contactApi } from "../api/contact.api";
import { contactDetailKeys } from "./useContactById";
import { contactKeys } from "./useContacts";
import type {
  ContactRecord,
  ContactUpdateRequest,
  ContactUpdateResponse,
} from "../types/contact.type";

interface UseUpdateContactOptions {
  onSuccess?: (
    data: ContactUpdateResponse,
    variables: {
      id: number | string;
      payload: ContactUpdateRequest;
    },
  ) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
  invalidateDetail?: boolean;
}

export function useUpdateContact({
  onSuccess,
  onError,
  invalidateList = true,
  invalidateDetail = true,
}: UseUpdateContactOptions = {}) {
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();

  const mutation = useMutation<
    ContactRecord,
    Error,
    { id: number | string; payload: ContactUpdateRequest }
  >({
    mutationFn: ({ id, payload }) => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === ""
      ) {
        throw new Error("Missing workspace id for contact update");
      }

      return contactApi.update(id, payload, workspaceId);
    },
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({
          queryKey: contactKeys.all,
        });
      }

      if (invalidateDetail) {
        await queryClient.invalidateQueries({
          queryKey: contactDetailKeys.byId(workspaceId, variables.id),
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    updateContact: mutation.mutateAsync,
  };
}
