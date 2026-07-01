import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { branchApi } from "../api/branch.api";
import { branchKeys } from "./useBranches";
import type {
  BranchCreateRequest,
  BranchRecord,
} from "../types/branch.type";

interface UseCreateBranchOptions {
  onSuccess?: (data: BranchRecord, variables: BranchCreateRequest) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
}

export function useCreateBranch({
  onSuccess,
  onError,
  invalidateList = true,
}: UseCreateBranchOptions = {}) {
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();

  const mutation = useMutation<BranchRecord, Error, BranchCreateRequest>({
    mutationFn: (payload) => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === ""
      ) {
        throw new Error("Missing workspace id for branch create");
      }

      return branchApi.create(payload, workspaceId);
    },
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({
          queryKey: branchKeys.all,
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    createBranch: mutation.mutateAsync,
  };
}
