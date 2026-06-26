import { apiClient } from "@/shared/lib/axios";
import { MASTER_DATA_PATHS, type MasterDataCatalog } from "@/shared/constants/master-data.constants";

import type {
  MasterDataCreateRequest,
  MasterDataDeleteResponse,
  MasterDataPageResponse,
  MasterDataQueryParams,
  MasterDataRecord,
  MasterDataUpdateRequest,
} from "../types/master-data.type";

export const masterDataApi = {
  list: <C extends MasterDataCatalog>(
    catalog: C,
    params?: MasterDataQueryParams,
  ) =>
    apiClient
      .get<MasterDataPageResponse<MasterDataRecord<C>>>(
        `${MASTER_DATA_PATHS.base}/${catalog}`,
        { params },
      )
      .then((response) => response.data),

  getById: <C extends MasterDataCatalog>(catalog: C, id: number | string) =>
    apiClient
      .get<MasterDataRecord<C>>(`${MASTER_DATA_PATHS.base}/${catalog}/${id}`)
      .then((response) => response.data),

  create: <C extends MasterDataCatalog>(
    catalog: C,
    payload: MasterDataCreateRequest<C>,
  ) =>
    apiClient
      .post<MasterDataRecord<C>>(`${MASTER_DATA_PATHS.base}/${catalog}`, payload)
      .then((response) => response.data),

  update: <C extends MasterDataCatalog>(
    catalog: C,
    id: number | string,
    payload: MasterDataUpdateRequest<C>,
  ) =>
    apiClient
      .put<MasterDataRecord<C>>(
        `${MASTER_DATA_PATHS.base}/${catalog}/${id}`,
        payload,
      )
      .then((response) => response.data),

  delete: <C extends MasterDataCatalog>(
    catalog: C,
    id: number | string,
  ): Promise<MasterDataDeleteResponse> =>
    apiClient
      .delete(`${MASTER_DATA_PATHS.base}/${catalog}/${id}`)
      .then(() => undefined),
};
