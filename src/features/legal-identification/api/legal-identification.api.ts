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

const LEGAL_IDENTIFICATION_PATH = "/api/farm/legal-identifications" as const;

export const legalIdentificationApi = {
  list(params: LegalIdentificationQueryParams = {}) {
    return apiClient
      .get<LegalIdentificationPageResponse>(LEGAL_IDENTIFICATION_PATH, {
        params,
      })
      .then((response) => response.data);
  },

  getById(id: number | string) {
    return apiClient
      .get<LegalIdentificationResponse>(`${LEGAL_IDENTIFICATION_PATH}/${id}`)
      .then((response) => response.data);
  },

  create(payload: LegalIdentificationCreateRequest) {
    return apiClient
      .post<LegalIdentificationCreateResponse>(
        LEGAL_IDENTIFICATION_PATH,
        payload,
      )
      .then((response) => response.data);
  },

  update(id: number | string, payload: LegalIdentificationUpdateRequest) {
    return apiClient
      .put<LegalIdentificationUpdateResponse>(
        `${LEGAL_IDENTIFICATION_PATH}/${id}`,
        payload,
      )
      .then((response) => response.data);
  },

  delete(id: number | string): Promise<LegalIdentificationDeleteResponse> {
    return apiClient
      .delete(`${LEGAL_IDENTIFICATION_PATH}/${id}`)
      .then(() => undefined);
  },
};
