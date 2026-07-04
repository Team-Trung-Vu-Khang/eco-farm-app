import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminWorkspaceApi } from "../api/admin-workspace.api";
import type { WorkspaceCreateRequest, WorkspaceRecord } from "../types/workspace.type";
import { adminWorkspaceKeys } from "./useAdminWorkspaces";

interface UseCreateAdminWorkspaceOptions {
  onSuccess?: (data: WorkspaceRecord, variables: WorkspaceCreateRequest) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
}

export function useCreateAdminWorkspace({
  onSuccess,
  onError,
  invalidateList = true,
}: UseCreateAdminWorkspaceOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<WorkspaceRecord, Error, WorkspaceCreateRequest>({
    mutationFn: (payload) => adminWorkspaceApi.create(payload),
    onSuccess: async (data, variables, context) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({ queryKey: adminWorkspaceKeys.all });
      }

      onSuccess?.(data, variables);
      return context;
    },
    onError,
  });

  return {
    ...mutation,
    createWorkspace: mutation.mutateAsync,
  };
}
