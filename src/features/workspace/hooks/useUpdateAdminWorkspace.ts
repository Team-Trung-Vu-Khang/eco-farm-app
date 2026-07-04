import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminWorkspaceApi } from "../api/admin-workspace.api";
import type { WorkspaceCreateRequest, WorkspaceRecord } from "../types/workspace.type";
import { adminWorkspaceKeys } from "./useAdminWorkspaces";
import { adminWorkspaceDetailKeys } from "./useAdminWorkspaceById";

interface UseUpdateAdminWorkspaceOptions {
  onSuccess?: (
    data: WorkspaceRecord,
    variables: { id: number | string; payload: WorkspaceCreateRequest },
  ) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
  invalidateDetail?: boolean;
}

export function useUpdateAdminWorkspace({
  onSuccess,
  onError,
  invalidateList = true,
  invalidateDetail = true,
}: UseUpdateAdminWorkspaceOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    WorkspaceRecord,
    Error,
    { id: number | string; payload: WorkspaceCreateRequest }
  >({
    mutationFn: ({ id, payload }) => adminWorkspaceApi.update(id, payload),
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({ queryKey: adminWorkspaceKeys.all });
      }

      if (invalidateDetail) {
        await queryClient.invalidateQueries({
          queryKey: adminWorkspaceDetailKeys.byId(variables.id),
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    updateWorkspace: mutation.mutateAsync,
  };
}
