import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationApi } from "../api/organization.api";
import { organizationDetailKeys } from "./useOrganizationById";
import { organizationKeys } from "./useOrganizations";
import type {
  OrganizationRecord,
  OrganizationUpdateRequest,
} from "../types/organization.type";

interface UseUpdateOrganizationOptions {
  onSuccess?: (
    data: OrganizationRecord,
    variables: {
      id: number | string;
      payload: OrganizationUpdateRequest;
      workspaceId: number | string;
    },
  ) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
  invalidateDetail?: boolean;
}

export function useUpdateOrganization({
  onSuccess,
  onError,
  invalidateList = true,
  invalidateDetail = true,
}: UseUpdateOrganizationOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    OrganizationRecord,
    Error,
    {
      id: number | string;
      payload: OrganizationUpdateRequest;
      workspaceId: number | string;
    }
  >({
    mutationFn: ({ id, payload, workspaceId }) =>
      organizationApi.update(id, payload, workspaceId),
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
    updateOrganization: mutation.mutateAsync,
  };
}
