import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { contactGroupApi } from "../api/contact-group.api";
import { contactGroupDetailKeys } from "./useContactGroupById";
import { contactGroupKeys } from "./useContactGroups";
import type {
  ContactGroupRecord,
  ContactGroupUpdateRequest,
  ContactGroupUpdateResponse,
} from "../types/contact-group.type";

interface UseUpdateContactGroupOptions {
  onSuccess?: (
    data: ContactGroupUpdateResponse,
    variables: {
      id: number | string;
      payload: ContactGroupUpdateRequest;
    },
  ) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
  invalidateDetail?: boolean;
}

export function useUpdateContactGroup({
  onSuccess,
  onError,
  invalidateList = true,
  invalidateDetail = true,
}: UseUpdateContactGroupOptions = {}) {
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();

  const mutation = useMutation<
    ContactGroupRecord,
    Error,
    { id: number | string; payload: ContactGroupUpdateRequest }
  >({
    mutationFn: ({ id, payload }) => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === ""
      ) {
        throw new Error("Missing workspace id for contact group update");
      }

      return contactGroupApi.update(id, payload, workspaceId);
    },
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({
          queryKey: contactGroupKeys.all,
        });
      }

      if (invalidateDetail) {
        await queryClient.invalidateQueries({
          queryKey: contactGroupDetailKeys.byId(
            workspaceId,
            variables.id,
          ),
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    updateContactGroup: mutation.mutateAsync,
  };
}
