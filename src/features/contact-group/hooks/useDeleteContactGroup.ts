import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { contactGroupApi } from "../api/contact-group.api";
import { contactGroupDetailKeys } from "./useContactGroupById";
import { contactGroupKeys } from "./useContactGroups";

interface UseDeleteContactGroupOptions {
  onSuccess?: (
    data: void,
    variables: { id: number | string },
  ) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
  invalidateDetail?: boolean;
}

export function useDeleteContactGroup({
  onSuccess,
  onError,
  invalidateList = true,
  invalidateDetail = true,
}: UseDeleteContactGroupOptions = {}) {
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();

  const mutation = useMutation<void, Error, { id: number | string }>({
    mutationFn: ({ id }) => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === ""
      ) {
        throw new Error("Missing workspace id for contact group delete");
      }

      return contactGroupApi.delete(id, workspaceId);
    },
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({
          queryKey: contactGroupKeys.all,
        });
      }

      if (invalidateDetail) {
        await queryClient.invalidateQueries({
          queryKey: contactGroupDetailKeys.byId(workspaceId, variables.id),
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    deleteContactGroup: mutation.mutateAsync,
  };
}
