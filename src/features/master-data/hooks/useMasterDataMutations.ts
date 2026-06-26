import { useMutation, useQueryClient } from "@tanstack/react-query";
import { masterDataApi } from "../api/master-data.api";
import { masterDataKeys } from "./useMasterData";
import type {
  MasterDataCatalog,
  MasterDataCreateRequest,
  MasterDataRecord,
  MasterDataUpdateRequest,
} from "../types/master-data.type";

export function useCreateMasterData<C extends MasterDataCatalog>(
  catalog: C,
) {
  const queryClient = useQueryClient();

  return useMutation<MasterDataRecord<C>, Error, MasterDataCreateRequest<C>>({
    mutationFn: (data) => masterDataApi.create(catalog, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: masterDataKeys.all(catalog),
      });
    },
  });
}

export function useUpdateMasterData<C extends MasterDataCatalog>(
  catalog: C,
) {
  const queryClient = useQueryClient();

  return useMutation<
    MasterDataRecord<C>,
    Error,
    { id: number | string; data: MasterDataUpdateRequest<C> }
  >({
    mutationFn: ({ id, data }) => masterDataApi.update(catalog, id, data),
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({
        queryKey: masterDataKeys.all(catalog),
      });
      await queryClient.invalidateQueries({
        queryKey: masterDataKeys.detail(catalog, id),
      });
    },
  });
}

export function useDeleteMasterData<C extends MasterDataCatalog>(
  catalog: C,
) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number | string>({
    mutationFn: (id) => masterDataApi.delete(catalog, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: masterDataKeys.all(catalog),
      });
    },
  });
}

export function useMasterDataMutations<C extends MasterDataCatalog>(
  catalog: C,
) {
  const createMasterData = useCreateMasterData(catalog);
  const updateMasterData = useUpdateMasterData(catalog);
  const deleteMasterData = useDeleteMasterData(catalog);

  return { createMasterData, updateMasterData, deleteMasterData };
}
