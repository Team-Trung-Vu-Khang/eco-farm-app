import { useMutation, useQueryClient } from "@tanstack/react-query";
import { legalIdentificationApi } from "../api/legal-identification.api";
import { legalIdentificationKeys } from "./useLegalIdentifications";

interface UseDeleteLegalIdentificationOptions {
  onSuccess?: (data: void, variables: { id: number | string }) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
}

export function useDeleteLegalIdentification({
  onSuccess,
  onError,
  invalidateList = true,
}: UseDeleteLegalIdentificationOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, { id: number | string }>({
    mutationFn: ({ id }) => legalIdentificationApi.delete(id),
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
    deleteLegalIdentification: mutation.mutateAsync,
  };
}
