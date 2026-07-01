import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { branchApi } from "../api/branch.api";
import { branchDetailKeys } from "./useBranchById";
import { branchKeys } from "./useBranches";

interface UseDeleteBranchOptions {
  onSuccess?: (data: void, variables: { id: number | string }) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
  invalidateDetail?: boolean;
}

export function useDeleteBranch({
  onSuccess,
  onError,
  invalidateList = true,
  invalidateDetail = true,
}: UseDeleteBranchOptions = {}) {
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();

  const mutation = useMutation<void, Error, { id: number | string }>({
    mutationFn: ({ id }) => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === ""
      ) {
        throw new Error("Missing workspace id for branch delete");
      }

      return branchApi.delete(id, workspaceId);
    },
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({
          queryKey: branchKeys.all,
        });
      }

      if (invalidateDetail) {
        await queryClient.invalidateQueries({
          queryKey: branchDetailKeys.byId(variables.id, workspaceId),
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    deleteBranch: mutation.mutateAsync,
  };
}
