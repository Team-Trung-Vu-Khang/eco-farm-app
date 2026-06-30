import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { contactApi } from "../api/contact.api";
import { contactDetailKeys } from "./useContactById";
import { contactKeys } from "./useContacts";

interface UseDeleteContactOptions {
  onSuccess?: (data: void, variables: { id: number | string }) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
  invalidateDetail?: boolean;
}

export function useDeleteContact({
  onSuccess,
  onError,
  invalidateList = true,
  invalidateDetail = true,
}: UseDeleteContactOptions = {}) {
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();

  const mutation = useMutation<void, Error, { id: number | string }>({
    mutationFn: ({ id }) => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === ""
      ) {
        throw new Error("Missing workspace id for contact delete");
      }

      return contactApi.delete(id, workspaceId);
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
    deleteContact: mutation.mutateAsync,
  };
}
