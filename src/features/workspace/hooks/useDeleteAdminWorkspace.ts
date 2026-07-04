import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminWorkspaceApi } from "../api/admin-workspace.api";
import { adminWorkspaceKeys } from "./useAdminWorkspaces";
import { adminWorkspaceDetailKeys } from "./useAdminWorkspaceById";

interface UseDeleteAdminWorkspaceOptions {
  onSuccess?: (data: void, variables: number | string) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
  invalidateDetail?: boolean;
}

export function useDeleteAdminWorkspace({
  onSuccess,
  onError,
  invalidateList = true,
  invalidateDetail = true,
}: UseDeleteAdminWorkspaceOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, number | string>({
    mutationFn: (id) => adminWorkspaceApi.delete(id),
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({ queryKey: adminWorkspaceKeys.all });
      }

      if (invalidateDetail) {
        await queryClient.invalidateQueries({
          queryKey: adminWorkspaceDetailKeys.byId(variables),
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    deleteWorkspace: mutation.mutateAsync,
  };
}
