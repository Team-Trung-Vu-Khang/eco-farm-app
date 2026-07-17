import { useMutation, useQueryClient } from "@tanstack/react-query";
import { legalIdentificationApi } from "../api/legal-identification.api";
import { legalIdentificationKeys } from "./useLegalIdentifications";
import type {
  LegalIdentificationCreateRequest,
  LegalIdentificationCreateResponse,
} from "../types/legal-identification.type";

interface UseCreateLegalIdentificationOptions {
  onSuccess?: (
    data: LegalIdentificationCreateResponse,
    variables: LegalIdentificationCreateRequest,
  ) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
}

export function useCreateLegalIdentification({
  onSuccess,
  onError,
  invalidateList = true,
}: UseCreateLegalIdentificationOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    LegalIdentificationCreateResponse,
    Error,
    LegalIdentificationCreateRequest
  >({
    mutationFn: (payload) => legalIdentificationApi.create(payload),
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({
          queryKey: legalIdentificationKeys.all,
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    createLegalIdentification: mutation.mutateAsync,
  };
}
