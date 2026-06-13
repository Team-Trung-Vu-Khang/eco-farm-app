import { useParams } from "wouter";
import useCropFoundationStore from "@/stores/useCropFoundationStore";
import type { CropFoundation } from "../types/types";
import {
  generateSeedInfo,
  generateCropFoundationStatus,
  generateFarmingHistory,
  generateDiseaseHistory,
  generateHarvestHistory,
  generateIoTData,
} from "../utils/mockGenerators";

export function useCropFoundationDetail() {
  const { id } = useParams();
  const { getCropFoundationById } = useCropFoundationStore();
  const baseCropFoundation = getCropFoundationById(Number(id));

  const cropFoundation: CropFoundation | null = baseCropFoundation
    ? {
        ...baseCropFoundation,
        seedInfo: baseCropFoundation.seedInfo || generateSeedInfo(),
        statusInfo:
          baseCropFoundation.statusInfo || generateCropFoundationStatus(),
        farmingHistory:
          baseCropFoundation.farmingHistory || generateFarmingHistory(),
        diseaseHistory:
          baseCropFoundation.diseaseHistory || generateDiseaseHistory(),
        harvestHistory:
          baseCropFoundation.harvestHistory || generateHarvestHistory(),
        iotData: baseCropFoundation.iotData || generateIoTData(),
      }
    : null;

  return {
    id,
    cropFoundation,
  };
}
