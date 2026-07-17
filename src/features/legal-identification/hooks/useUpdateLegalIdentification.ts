import { useMutation, useQueryClient } from "@tanstack/react-query";
import { legalIdentificationApi } from "../api/legal-identification.api";
import { legalIdentificationKeys } from "./useLegalIdentifications";
import type {
  LegalIdentificationResponse,
  LegalIdentificationUpdateRequest,
  LegalIdentificationUpdateResponse,
} from "../types/legal-identification.type";

interface UseUpdateLegalIdentificationOptions {
  onSuccess?: (
    data: LegalIdentificationUpdateResponse,
    variables: {
      id: number | string;
      payload: LegalIdentificationUpdateRequest;
    },
  ) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
  invalidateDetail?: boolean;
}

export function useUpdateLegalIdentification({
  onSuccess,
  onError,
  invalidateList = true,
  invalidateDetail = true,
}: UseUpdateLegalIdentificationOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    LegalIdentificationResponse,
    Error,
    { id: number | string; payload: LegalIdentificationUpdateRequest }
  >({
    mutationFn: ({ id, payload }) => legalIdentificationApi.update(id, payload),
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({
          queryKey: legalIdentificationKeys.all,
        });
      }

      if (invalidateDetail) {
        await queryClient.invalidateQueries({
          queryKey: legalIdentificationKeys.detail(variables.id),
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    updateLegalIdentification: mutation.mutateAsync,
  };
}
