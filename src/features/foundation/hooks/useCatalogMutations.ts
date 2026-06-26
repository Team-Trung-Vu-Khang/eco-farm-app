import { useMutation, useQueryClient } from "@tanstack/react-query";
import { catalogApi } from "../api/foundation.api";
import { catalogKeys } from "./useCatalog";
import type {
  CatalogType,
  CatalogRecordRequest,
  CatalogRecordResponse,
} from "../types/foundation.type";

/**
 * Mutation hooks cho Foundation Catalog (dùng chung cho 5 catalog types).
 * Sau mỗi mutation thành công → tự động invalidate danh sách của catalog type đó.
 *
 * @example
 * const { createCatalog } = useCatalogMutations("crop-groups");
 * createCatalog.mutate({ name: "Rau củ", status: "active" });
 */
export function useCatalogMutations(catalog: CatalogType) {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: catalogKeys.all(catalog) });

  const createCatalog = useMutation<
    CatalogRecordResponse,
    Error,
    CatalogRecordRequest
  >({
    mutationFn: (data) => catalogApi.create(catalog, data),
    onSuccess: invalidateList,
  });

  const updateCatalog = useMutation<
    CatalogRecordResponse,
    Error,
    { id: number; data: CatalogRecordRequest }
  >({
    mutationFn: ({ id, data }) => catalogApi.update(catalog, id, data),
    onSuccess: (_, { id }) => {
      // Invalidate cả list lẫn detail
      queryClient.invalidateQueries({ queryKey: catalogKeys.all(catalog) });
      queryClient.invalidateQueries({
        queryKey: catalogKeys.detail(catalog, id),
      });
    },
  });

  const deleteCatalog = useMutation<void, Error, number>({
    mutationFn: (id) => catalogApi.delete(catalog, id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createCatalog, updateCatalog, deleteCatalog };
}
