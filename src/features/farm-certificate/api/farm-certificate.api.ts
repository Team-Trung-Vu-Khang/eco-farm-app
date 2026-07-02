import { apiClient } from "@/shared/lib/axios";
import type {
  FarmCertificateCreateRequest,
  FarmCertificateCreateResponse,
  FarmCertificateDeleteResponse,
  FarmCertificatePageResponse,
  FarmCertificateQueryParams,
  FarmCertificateRecord,
  FarmCertificateUpdateRequest,
  FarmCertificateUpdateResponse,
} from "../types/farm-certificate.type";

const FARM_CERTIFICATE_PATH = "/api/farm/certificates" as const;

export const farmCertificateApi = {
  list(params: FarmCertificateQueryParams = {}) {
    return apiClient
      .get<FarmCertificatePageResponse<FarmCertificateRecord>>(
        FARM_CERTIFICATE_PATH,
        { params },
      )
      .then((response) => response.data);
  },

  create(payload: FarmCertificateCreateRequest) {
    return apiClient
      .post<FarmCertificateCreateResponse>(FARM_CERTIFICATE_PATH, payload)
      .then((response) => response.data);
  },

  getById(id: number | string) {
    return apiClient
      .get<FarmCertificateRecord>(`${FARM_CERTIFICATE_PATH}/${id}`)
      .then((response) => response.data);
  },

  update(id: number | string, payload: FarmCertificateUpdateRequest) {
    return apiClient
      .put<FarmCertificateUpdateResponse>(
        `${FARM_CERTIFICATE_PATH}/${id}`,
        payload,
      )
      .then((response) => response.data);
  },

  delete(id: number | string): Promise<FarmCertificateDeleteResponse> {
    return apiClient
      .delete(`${FARM_CERTIFICATE_PATH}/${id}`)
      .then(() => undefined);
  },
};
