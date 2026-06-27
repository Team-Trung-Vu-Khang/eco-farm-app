import { apiClient } from "@/shared/lib/axios";
import { MASTER_DATA_PATHS, type MasterDataCatalog } from "@/shared/constants/master-data.constants";

import type {
  BusinessLineCreateRequest,
  BusinessLineRecord,
  BusinessLineUpdateRequest,
  CertificateIssuerCreateRequest,
  CertificateIssuerRecord,
  CertificateIssuerUpdateRequest,
  CertificateStandardCreateRequest,
  CertificateStandardRecord,
  CertificateStandardUpdateRequest,
  MasterDataCreateRequest,
  MasterDataDeleteResponse,
  MasterDataPageResponse,
  MasterDataQueryParams,
  MasterDataRecord,
  MasterDataUpdateRequest,
  PositionResponsibilitiesQueryParams,
  PositionResponsibilitiesResponse,
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

  listPositionResponsibilities: (
    positionId: number | string,
    params?: PositionResponsibilitiesQueryParams,
  ) =>
    apiClient
      .get<PositionResponsibilitiesResponse>(
        `${MASTER_DATA_PATHS.base}/positions/${positionId}/responsibilities`,
        { params },
      )
      .then((response) => response.data),

  listCertificateIssuers: (params?: MasterDataQueryParams) =>
    apiClient
      .get<MasterDataPageResponse<CertificateIssuerRecord>>(
        `${MASTER_DATA_PATHS.base}/certificate-issuers`,
        { params },
      )
      .then((response) => response.data),

  listBusinessLines: (params?: MasterDataQueryParams) =>
    apiClient
      .get<MasterDataPageResponse<BusinessLineRecord>>(
        MASTER_DATA_PATHS.businessLines,
        { params },
      )
      .then((response) => response.data),

  getCertificateIssuerById: (id: number | string) =>
    apiClient
      .get<CertificateIssuerRecord>(
        `${MASTER_DATA_PATHS.base}/certificate-issuers/${id}`,
      )
      .then((response) => response.data),

  getBusinessLineById: (id: number | string) =>
    apiClient
      .get<BusinessLineRecord>(
        `${MASTER_DATA_PATHS.businessLines}/${id}`,
      )
      .then((response) => response.data),

  createCertificateIssuer: (payload: CertificateIssuerCreateRequest) =>
    apiClient
      .post<CertificateIssuerRecord>(
        `${MASTER_DATA_PATHS.base}/certificate-issuers`,
        payload,
      )
      .then((response) => response.data),

  createBusinessLine: (payload: BusinessLineCreateRequest) =>
    apiClient
      .post<BusinessLineRecord>(
        MASTER_DATA_PATHS.businessLines,
        payload,
      )
      .then((response) => response.data),

  updateCertificateIssuer: (
    id: number | string,
    payload: CertificateIssuerUpdateRequest,
  ) =>
    apiClient
      .put<CertificateIssuerRecord>(
        `${MASTER_DATA_PATHS.base}/certificate-issuers/${id}`,
        payload,
      )
      .then((response) => response.data),

  updateBusinessLine: (
    id: number | string,
    payload: BusinessLineUpdateRequest,
  ) =>
    apiClient
      .put<BusinessLineRecord>(
        `${MASTER_DATA_PATHS.businessLines}/${id}`,
        payload,
      )
      .then((response) => response.data),

  deleteCertificateIssuer: (id: number | string): Promise<void> =>
    apiClient
      .delete(`${MASTER_DATA_PATHS.base}/certificate-issuers/${id}`)
      .then(() => undefined),

  deleteBusinessLine: (id: number | string): Promise<void> =>
    apiClient
      .delete(`${MASTER_DATA_PATHS.businessLines}/${id}`)
      .then(() => undefined),

  listCertificateStandards: (params?: MasterDataQueryParams) =>
    apiClient
      .get<MasterDataPageResponse<CertificateStandardRecord>>(
        `${MASTER_DATA_PATHS.base}/certificate-standards`,
        { params },
      )
      .then((response) => response.data),

  getCertificateStandardById: (id: number | string) =>
    apiClient
      .get<CertificateStandardRecord>(
        `${MASTER_DATA_PATHS.base}/certificate-standards/${id}`,
      )
      .then((response) => response.data),

  createCertificateStandard: (payload: CertificateStandardCreateRequest) =>
    apiClient
      .post<CertificateStandardRecord>(
        `${MASTER_DATA_PATHS.base}/certificate-standards`,
        payload,
      )
      .then((response) => response.data),

  updateCertificateStandard: (
    id: number | string,
    payload: CertificateStandardUpdateRequest,
  ) =>
    apiClient
      .put<CertificateStandardRecord>(
        `${MASTER_DATA_PATHS.base}/certificate-standards/${id}`,
        payload,
      )
      .then((response) => response.data),

  deleteCertificateStandard: (id: number | string): Promise<void> =>
    apiClient
      .delete(`${MASTER_DATA_PATHS.base}/certificate-standards/${id}`)
      .then(() => undefined),
};
