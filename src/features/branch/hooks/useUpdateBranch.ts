import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { branchApi } from "../api/branch.api";
import { branchDetailKeys } from "./useBranchById";
import { branchKeys } from "./useBranches";
import type {
  BranchRecord,
  BranchUpdateRequest,
} from "../types/branch.type";

interface UseUpdateBranchOptions {
  onSuccess?: (
    data: BranchRecord,
    variables: { id: number | string; payload: BranchUpdateRequest },
  ) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
  invalidateDetail?: boolean;
}

export function useUpdateBranch({
  onSuccess,
  onError,
  invalidateList = true,
  invalidateDetail = true,
}: UseUpdateBranchOptions = {}) {
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();

  const mutation = useMutation<
    BranchRecord,
    Error,
    { id: number | string; payload: BranchUpdateRequest }
  >({
    mutationFn: ({ id, payload }) => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === ""
      ) {
        throw new Error("Missing workspace id for branch update");
      }

      return branchApi.update(id, payload, workspaceId);
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
    updateBranch: mutation.mutateAsync,
  };
}
