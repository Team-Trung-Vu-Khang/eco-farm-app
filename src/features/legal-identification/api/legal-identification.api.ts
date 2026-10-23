import { apiClient } from "@/shared/lib/axios";
import type {
  LegalIdentificationCreateRequest,
  LegalIdentificationCreateResponse,
  LegalIdentificationDeleteResponse,
  LegalIdentificationPageResponse,
  LegalIdentificationQueryParams,
  LegalIdentificationResponse,
  LegalIdentificationUpdateRequest,
  LegalIdentificationUpdateResponse,
} from "../types/legal-identification.type";

import { FARM_ENDPOINTS } from "@/shared/constants";

export const legalIdentificationApi = {
  list(params: LegalIdentificationQueryParams = {}) {
    return apiClient
      .get<LegalIdentificationPageResponse>(FARM_ENDPOINTS.legalIdentifications, {
        params,
      })
      .then((response) => response.data);
  },

  getById(id: number | string) {
    return apiClient
      .get<LegalIdentificationResponse>(`${FARM_ENDPOINTS.legalIdentifications}/${id}`)
      .then((response) => response.data);
  },

  create(payload: LegalIdentificationCreateRequest) {
    return apiClient
      .post<LegalIdentificationCreateResponse>(
        FARM_ENDPOINTS.legalIdentifications,
        payload,
      )
      .then((response) => response.data);
  },

  update(id: number | string, payload: LegalIdentificationUpdateRequest) {
    return apiClient
      .put<LegalIdentificationUpdateResponse>(
        `${FARM_ENDPOINTS.legalIdentifications}/${id}`,
        payload,
      )
      .then((response) => response.data);
  },

  delete(id: number | string): Promise<LegalIdentificationDeleteResponse> {
    return apiClient
      .delete(`${FARM_ENDPOINTS.legalIdentifications}/${id}`)
      .then(() => undefined);
  },
};
