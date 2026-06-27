import { apiClient } from "@/shared/lib/axios";
import {
  MASTER_DATA_PATHS,
  type MasterDataCatalog,
} from "@/shared/constants/master-data.constants";

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
  EquipmentToolGroupCreateRequest,
  EquipmentToolGroupRecord,
  EquipmentToolGroupUpdateRequest,
  IoTDeviceGroupCreateRequest,
  IoTDeviceGroupRecord,
  IoTDeviceGroupUpdateRequest,
  MasterDataCreateRequest,
  MasterDataDeleteResponse,
  MasterDataPageResponse,
  MasterDataQueryParams,
  MasterDataRecord,
  MasterDataUpdateRequest,
  FertilizerGroupCreateRequest,
  FertilizerGroupRecord,
  FertilizerGroupUpdateRequest,
  MaterialGroupCreateRequest,
  MaterialGroupRecord,
  MaterialGroupUpdateRequest,
  PesticideGroupCreateRequest,
  PesticideGroupRecord,
  PesticideGroupUpdateRequest,
  PesticideOriginCreateRequest,
  PesticideOriginRecord,
  PesticideOriginUpdateRequest,
  PesticideToxicityClassCreateRequest,
  PesticideToxicityClassRecord,
  PesticideToxicityClassUpdateRequest,
  PlanGroupCreateRequest,
  PlanTypeCreateRequest,
  PlanTypeRecord,
  PlanTypeUpdateRequest,
  PositionResponsibilitiesQueryParams,
  PositionResponsibilitiesResponse,
  ProvinceWardQueryParams,
  VsicIndustryCreateRequest,
  VsicIndustryChildrenRecord,
  VsicIndustryRecord,
  VsicIndustryTreeQueryParams,
  VsicIndustryTreeResponse,
  VsicIndustryUpdateRequest,
  PlanGroupRecord,
  PlanGroupUpdateRequest,
  ProvinceRecord,
  ProvinceWardRecord,
} from "../types/master-data.type";

export const masterDataApi = {
  list: <C extends MasterDataCatalog>(
    catalog: C,
    params?: MasterDataQueryParams,
  ) =>
    apiClient
      .get<
        MasterDataPageResponse<MasterDataRecord<C>>
      >(`${MASTER_DATA_PATHS.base}/${catalog}`, { params })
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
      .post<
        MasterDataRecord<C>
      >(`${MASTER_DATA_PATHS.base}/${catalog}`, payload)
      .then((response) => response.data),

  update: <C extends MasterDataCatalog>(
    catalog: C,
    id: number | string,
    payload: MasterDataUpdateRequest<C>,
  ) =>
    apiClient
      .put<
        MasterDataRecord<C>
      >(`${MASTER_DATA_PATHS.base}/${catalog}/${id}`, payload)
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
      .get<
        MasterDataPageResponse<CertificateIssuerRecord>
      >(`${MASTER_DATA_PATHS.base}/certificate-issuers`, { params })
      .then((response) => response.data),

  listBusinessLines: (params?: MasterDataQueryParams) =>
    apiClient
      .get<
        MasterDataPageResponse<BusinessLineRecord>
      >(MASTER_DATA_PATHS.businessLines, { params })
      .then((response) => response.data),

  getCertificateIssuerById: (id: number | string) =>
    apiClient
      .get<CertificateIssuerRecord>(
        `${MASTER_DATA_PATHS.base}/certificate-issuers/${id}`,
      )
      .then((response) => response.data),

  getBusinessLineById: (id: number | string) =>
    apiClient
      .get<BusinessLineRecord>(`${MASTER_DATA_PATHS.businessLines}/${id}`)
      .then((response) => response.data),

  listGeoProvinces: (params?: MasterDataQueryParams) =>
    apiClient
      .get<MasterDataPageResponse<ProvinceRecord>>(
        MASTER_DATA_PATHS.geoProvinces,
        { params },
      )
      .then((response) => response.data),

  getGeoProvinceByCode: (code: string) =>
    apiClient
      .get<ProvinceRecord>(`${MASTER_DATA_PATHS.geoProvinces}/${code}`)
      .then((response) => response.data),

  listGeoWards: (params: ProvinceWardQueryParams) =>
    apiClient
      .get<MasterDataPageResponse<ProvinceWardRecord>>(MASTER_DATA_PATHS.geoWards, {
        params,
      })
      .then((response) => response.data),

  listEquipmentToolGroups: (params?: MasterDataQueryParams) =>
    apiClient
      .get<MasterDataPageResponse<EquipmentToolGroupRecord>>(
        MASTER_DATA_PATHS.equipmentToolGroups,
        { params },
      )
      .then((response) => response.data),

  getEquipmentToolGroupById: (id: number | string) =>
    apiClient
      .get<EquipmentToolGroupRecord>(
        `${MASTER_DATA_PATHS.equipmentToolGroups}/${id}`,
      )
      .then((response) => response.data),

  createEquipmentToolGroup: (payload: EquipmentToolGroupCreateRequest) =>
    apiClient
      .post<EquipmentToolGroupRecord>(
        MASTER_DATA_PATHS.equipmentToolGroups,
        payload,
      )
      .then((response) => response.data),

  updateEquipmentToolGroup: (
    id: number | string,
    payload: EquipmentToolGroupUpdateRequest,
  ) =>
    apiClient
      .put<EquipmentToolGroupRecord>(
        `${MASTER_DATA_PATHS.equipmentToolGroups}/${id}`,
        payload,
      )
      .then((response) => response.data),

  deleteEquipmentToolGroup: (id: number | string): Promise<void> =>
    apiClient
      .delete(`${MASTER_DATA_PATHS.equipmentToolGroups}/${id}`)
      .then(() => undefined),

  listIoTDeviceGroups: (params?: MasterDataQueryParams) =>
    apiClient
      .get<MasterDataPageResponse<IoTDeviceGroupRecord>>(
        `${MASTER_DATA_PATHS.base}/iot-device-groups`,
        { params },
      )
      .then((response) => response.data),

  getIoTDeviceGroupById: (id: number | string) =>
    apiClient
      .get<IoTDeviceGroupRecord>(
        `${MASTER_DATA_PATHS.base}/iot-device-groups/${id}`,
      )
      .then((response) => response.data),

  createIoTDeviceGroup: (payload: IoTDeviceGroupCreateRequest) =>
    apiClient
      .post<IoTDeviceGroupRecord>(
        `${MASTER_DATA_PATHS.base}/iot-device-groups`,
        payload,
      )
      .then((response) => response.data),

  updateIoTDeviceGroup: (
    id: number | string,
    payload: IoTDeviceGroupUpdateRequest,
  ) =>
    apiClient
      .put<IoTDeviceGroupRecord>(
        `${MASTER_DATA_PATHS.base}/iot-device-groups/${id}`,
        payload,
      )
      .then((response) => response.data),

  deleteIoTDeviceGroup: (id: number | string): Promise<void> =>
    apiClient
      .delete(`${MASTER_DATA_PATHS.base}/iot-device-groups/${id}`)
      .then(() => undefined),

  createCertificateIssuer: (payload: CertificateIssuerCreateRequest) =>
    apiClient
      .post<CertificateIssuerRecord>(
        `${MASTER_DATA_PATHS.base}/certificate-issuers`,
        payload,
      )
      .then((response) => response.data),

  createBusinessLine: (payload: BusinessLineCreateRequest) =>
    apiClient
      .post<BusinessLineRecord>(MASTER_DATA_PATHS.businessLines, payload)
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

  listFertilizerGroups: (params?: MasterDataQueryParams) =>
    apiClient
      .get<MasterDataPageResponse<FertilizerGroupRecord>>(
        MASTER_DATA_PATHS.fertilizerGroups,
        { params },
      )
      .then((response) => response.data),

  getFertilizerGroupById: (id: number | string) =>
    apiClient
      .get<FertilizerGroupRecord>(`${MASTER_DATA_PATHS.fertilizerGroups}/${id}`)
      .then((response) => response.data),

  createFertilizerGroup: (payload: FertilizerGroupCreateRequest) =>
    apiClient
      .post<FertilizerGroupRecord>(MASTER_DATA_PATHS.fertilizerGroups, payload)
      .then((response) => response.data),

  updateFertilizerGroup: (
    id: number | string,
    payload: FertilizerGroupUpdateRequest,
  ) =>
    apiClient
      .put<FertilizerGroupRecord>(
        `${MASTER_DATA_PATHS.fertilizerGroups}/${id}`,
        payload,
      )
      .then((response) => response.data),

  deleteFertilizerGroup: (id: number | string): Promise<void> =>
    apiClient
      .delete(`${MASTER_DATA_PATHS.fertilizerGroups}/${id}`)
      .then(() => undefined),

  listMaterialGroups: (params?: MasterDataQueryParams) =>
    apiClient
      .get<MasterDataPageResponse<MaterialGroupRecord>>(
        MASTER_DATA_PATHS.materialGroups,
        { params },
      )
      .then((response) => response.data),

  getMaterialGroupById: (id: number | string) =>
    apiClient
      .get<MaterialGroupRecord>(`${MASTER_DATA_PATHS.materialGroups}/${id}`)
      .then((response) => response.data),

  createMaterialGroup: (payload: MaterialGroupCreateRequest) =>
    apiClient
      .post<MaterialGroupRecord>(MASTER_DATA_PATHS.materialGroups, payload)
      .then((response) => response.data),

  updateMaterialGroup: (
    id: number | string,
    payload: MaterialGroupUpdateRequest,
  ) =>
    apiClient
      .put<MaterialGroupRecord>(
        `${MASTER_DATA_PATHS.materialGroups}/${id}`,
        payload,
      )
      .then((response) => response.data),

  deleteMaterialGroup: (id: number | string): Promise<void> =>
    apiClient
      .delete(`${MASTER_DATA_PATHS.materialGroups}/${id}`)
      .then(() => undefined),

  listPesticideGroups: (params?: MasterDataQueryParams) =>
    apiClient
      .get<MasterDataPageResponse<PesticideGroupRecord>>(
        MASTER_DATA_PATHS.pesticideGroups,
        { params },
      )
      .then((response) => response.data),

  getPesticideGroupById: (id: number | string) =>
    apiClient
      .get<PesticideGroupRecord>(`${MASTER_DATA_PATHS.pesticideGroups}/${id}`)
      .then((response) => response.data),

  createPesticideGroup: (payload: PesticideGroupCreateRequest) =>
    apiClient
      .post<PesticideGroupRecord>(MASTER_DATA_PATHS.pesticideGroups, payload)
      .then((response) => response.data),

  updatePesticideGroup: (
    id: number | string,
    payload: PesticideGroupUpdateRequest,
  ) =>
    apiClient
      .put<PesticideGroupRecord>(
        `${MASTER_DATA_PATHS.pesticideGroups}/${id}`,
        payload,
      )
      .then((response) => response.data),

  deletePesticideGroup: (id: number | string): Promise<void> =>
    apiClient
      .delete(`${MASTER_DATA_PATHS.pesticideGroups}/${id}`)
      .then(() => undefined),

  listPesticideOrigins: (params?: MasterDataQueryParams) =>
    apiClient
      .get<MasterDataPageResponse<PesticideOriginRecord>>(
        MASTER_DATA_PATHS.pesticideOrigins,
        { params },
      )
      .then((response) => response.data),

  getPesticideOriginById: (id: number | string) =>
    apiClient
      .get<PesticideOriginRecord>(
        `${MASTER_DATA_PATHS.pesticideOrigins}/${id}`,
      )
      .then((response) => response.data),

  createPesticideOrigin: (payload: PesticideOriginCreateRequest) =>
    apiClient
      .post<PesticideOriginRecord>(MASTER_DATA_PATHS.pesticideOrigins, payload)
      .then((response) => response.data),

  updatePesticideOrigin: (
    id: number | string,
    payload: PesticideOriginUpdateRequest,
  ) =>
    apiClient
      .put<PesticideOriginRecord>(
        `${MASTER_DATA_PATHS.pesticideOrigins}/${id}`,
        payload,
      )
      .then((response) => response.data),

  deletePesticideOrigin: (id: number | string): Promise<void> =>
    apiClient
      .delete(`${MASTER_DATA_PATHS.pesticideOrigins}/${id}`)
      .then(() => undefined),

  listPesticideToxicityClasses: (params?: MasterDataQueryParams) =>
    apiClient
      .get<MasterDataPageResponse<PesticideToxicityClassRecord>>(
        MASTER_DATA_PATHS.pesticideToxicityClasses,
        { params },
      )
      .then((response) => response.data),

  getPesticideToxicityClassById: (id: number | string) =>
    apiClient
      .get<PesticideToxicityClassRecord>(
        `${MASTER_DATA_PATHS.pesticideToxicityClasses}/${id}`,
      )
      .then((response) => response.data),

  createPesticideToxicityClass: (
    payload: PesticideToxicityClassCreateRequest,
  ) =>
    apiClient
      .post<PesticideToxicityClassRecord>(
        MASTER_DATA_PATHS.pesticideToxicityClasses,
        payload,
      )
      .then((response) => response.data),

  updatePesticideToxicityClass: (
    id: number | string,
    payload: PesticideToxicityClassUpdateRequest,
  ) =>
    apiClient
      .put<PesticideToxicityClassRecord>(
        `${MASTER_DATA_PATHS.pesticideToxicityClasses}/${id}`,
        payload,
      )
      .then((response) => response.data),

  deletePesticideToxicityClass: (id: number | string): Promise<void> =>
    apiClient
      .delete(`${MASTER_DATA_PATHS.pesticideToxicityClasses}/${id}`)
      .then(() => undefined),

  listPlanGroups: (params?: MasterDataQueryParams) =>
    apiClient
      .get<
        MasterDataPageResponse<PlanGroupRecord>
      >(MASTER_DATA_PATHS.planGroups, { params })
      .then((response) => response.data),

  getPlanGroupById: (id: number | string) =>
    apiClient
      .get<PlanGroupRecord>(`${MASTER_DATA_PATHS.planGroups}/${id}`)
      .then((response) => response.data),

  createPlanGroup: (payload: PlanGroupCreateRequest) =>
    apiClient
      .post<PlanGroupRecord>(MASTER_DATA_PATHS.planGroups, payload)
      .then((response) => response.data),

  updatePlanGroup: (
    id: number | string,
    payload: PlanGroupUpdateRequest,
  ) =>
    apiClient
      .put<PlanGroupRecord>(`${MASTER_DATA_PATHS.planGroups}/${id}`, payload)
      .then((response) => response.data),

  deletePlanGroup: (id: number | string): Promise<void> =>
    apiClient
      .delete(`${MASTER_DATA_PATHS.planGroups}/${id}`)
      .then(() => undefined),

  listPlanTypes: (params?: MasterDataQueryParams) =>
    apiClient
      .get<
        MasterDataPageResponse<PlanTypeRecord>
      >(MASTER_DATA_PATHS.planTypes, { params })
      .then((response) => response.data),

  getPlanTypeById: (id: number | string) =>
    apiClient
      .get<PlanTypeRecord>(`${MASTER_DATA_PATHS.planTypes}/${id}`)
      .then((response) => response.data),

  createPlanType: (payload: PlanTypeCreateRequest) =>
    apiClient
      .post<PlanTypeRecord>(MASTER_DATA_PATHS.planTypes, payload)
      .then((response) => response.data),

  updatePlanType: (id: number | string, payload: PlanTypeUpdateRequest) =>
    apiClient
      .put<PlanTypeRecord>(`${MASTER_DATA_PATHS.planTypes}/${id}`, payload)
      .then((response) => response.data),

  deletePlanType: (id: number | string): Promise<void> =>
    apiClient
      .delete(`${MASTER_DATA_PATHS.planTypes}/${id}`)
      .then(() => undefined),

  listVsicIndustries: (params?: MasterDataQueryParams) =>
    apiClient
      .get<
        MasterDataPageResponse<VsicIndustryRecord>
      >(MASTER_DATA_PATHS.vsicIndustries, { params })
      .then((response) => response.data),

  getVsicIndustryById: (id: number | string) =>
    apiClient
      .get<VsicIndustryRecord>(`${MASTER_DATA_PATHS.vsicIndustries}/${id}`)
      .then((response) => response.data),

  getVsicIndustryByCode: (code: string) =>
    apiClient
      .get<VsicIndustryRecord>(`${MASTER_DATA_PATHS.vsicIndustries}/${code}`)
      .then((response) => response.data),

  listVsicIndustryChildrenByCode: (code: string) =>
    apiClient
      .get<VsicIndustryChildrenRecord>(
        `${MASTER_DATA_PATHS.vsicIndustries}/${code}/children`,
      )
      .then((response) => response.data),

  listVsicIndustryTree: (params?: VsicIndustryTreeQueryParams) =>
    apiClient
      .get<VsicIndustryTreeResponse>(
        `${MASTER_DATA_PATHS.vsicIndustries}/tree`,
        { params },
      )
      .then((response) => response.data),

  createVsicIndustry: (payload: VsicIndustryCreateRequest) =>
    apiClient
      .post<VsicIndustryRecord>(MASTER_DATA_PATHS.vsicIndustries, payload)
      .then((response) => response.data),

  updateVsicIndustry: (
    id: number | string,
    payload: VsicIndustryUpdateRequest,
  ) =>
    apiClient
      .put<VsicIndustryRecord>(
        `${MASTER_DATA_PATHS.vsicIndustries}/${id}`,
        payload,
      )
      .then((response) => response.data),

  updateVsicIndustryByCode: (
    code: string,
    payload: VsicIndustryUpdateRequest,
  ) =>
    apiClient
      .put<VsicIndustryRecord>(
        `${MASTER_DATA_PATHS.vsicIndustries}/${code}`,
        payload,
      )
      .then((response) => response.data),

  deleteVsicIndustry: (id: number | string): Promise<void> =>
    apiClient
      .delete(`${MASTER_DATA_PATHS.vsicIndustries}/${id}`)
      .then(() => undefined),

  deleteVsicIndustryByCode: (code: string): Promise<void> =>
    apiClient
      .delete(`${MASTER_DATA_PATHS.vsicIndustries}/${code}`)
      .then(() => undefined),

  listCertificateStandards: (params?: MasterDataQueryParams) =>
    apiClient
      .get<
        MasterDataPageResponse<CertificateStandardRecord>
      >(`${MASTER_DATA_PATHS.base}/certificate-standards`, { params })
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
