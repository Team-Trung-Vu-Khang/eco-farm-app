import { useMemo } from "react";
import type { Region } from "../region-chart/constants";
import { getAquacultureDetailDraft } from "./data/detail-dummy";

export interface PersonnelItem {
  id: number;
  fullName: string;
  avatarUrl: string | null;
  positionName: string;
  positionCode: string;
}

export interface CertificateItem {
  id: number;
  code: string;
  name: string;
}

export interface AquacultureRegionDetails {
  managers: any[];
  personnel: PersonnelItem[];
  certificates: CertificateItem[];
  selectedCerts: any[];
  regionStats: {
    total: number;
    healthy: number;
    treating: number;
    diseased: number;
  };
  region: Region | null;
  selectedEntities: any[];
  groupedSelections: Record<string, any>;
  totalArea: number;
  enterprise: any;
  entityConfigs: Array<{
    entity: any;
    farmingMethod: any;
    irrigationMethod: any;
    crops: any[];
  }>;
  technicalConfig: {
    farmingMethod: any;
    irrigationMethod: any;
    crops: any[];
  };
  harvestStats: {
    totalVolume: number;
    lastVolume: number;
    lastChange: number;
    avgVolume: number;
    avgChange: number;
  };
  harvestBatches: Array<{
    id: string;
    date: string;
    volume: number;
    quality: string;
    staff: string;
    notes?: string;
  }>;
}

export const useAquacultureRegionDetail = (id?: string | null) => {
  const numericId = id ? parseInt(String(id), 10) : 0;

  const draft = useMemo(() => getAquacultureDetailDraft(numericId), [numericId]);

  const area = draft.area;
  const details = draft.details as AquacultureRegionDetails;

  return {
    area,
    details,
    loading: false,
  };
};

