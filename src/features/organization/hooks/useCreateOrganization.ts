import { useMutation, useQueryClient } from "@tanstack/react-query";

import { organizationApi } from "../api/organization.api";
import { organizationKeys } from "./useOrganizations";
import type {
  OrganizationCreateRequest,
  OrganizationRecord,
} from "../types/organization.type";

interface UseCreateOrganizationOptions {
  onSuccess?: (
    data: OrganizationRecord,
    variables: {
      payload: OrganizationCreateRequest;
      workspaceId: number | string;
    },
  ) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
}

export function useCreateOrganization({
  onSuccess,
  onError,
  invalidateList = true,
}: UseCreateOrganizationOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    OrganizationRecord,
    Error,
    {
      payload: OrganizationCreateRequest;
      workspaceId: number | string;
    }
  >({
    mutationFn: ({ payload, workspaceId }) =>
      organizationApi.create(payload, workspaceId),
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({
          queryKey: organizationKeys.all,
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    createOrganization: mutation.mutateAsync,
  };
}
