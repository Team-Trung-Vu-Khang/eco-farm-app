import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationApi } from "../api/organization.api";
import { organizationDetailKeys } from "./useOrganizationById";
import { organizationKeys } from "./useOrganizations";

interface UseDeleteOrganizationOptions {
  onSuccess?: (
    data: void,
    variables: {
      id: number | string;
      workspaceId: number | string;
    },
  ) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
  invalidateDetail?: boolean;
}

export function useDeleteOrganization({
  onSuccess,
  onError,
  invalidateList = true,
  invalidateDetail = true,
}: UseDeleteOrganizationOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    void,
    Error,
    {
      id: number | string;
      workspaceId: number | string;
    }
  >({
    mutationFn: ({ id, workspaceId }) =>
      organizationApi.delete(id, workspaceId),
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({
          queryKey: organizationKeys.all,
        });
      }

      if (invalidateDetail) {
        await queryClient.invalidateQueries({
          queryKey: organizationDetailKeys.byId(
            variables.id,
            variables.workspaceId,
          ),
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    deleteOrganization: mutation.mutateAsync,
  };
}
