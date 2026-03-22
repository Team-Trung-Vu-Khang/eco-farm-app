import { useParams } from "wouter";
import useCropStore from "../../../stores/useCropStore";
import type { Crop } from "../types/types";
import {
  generateSeedInfo,
  generateCropStatus,
  generateFarmingHistory,
  generateDiseaseHistory,
  generateHarvestHistory,
  generateIoTData,
} from "../utils/mockGenerators";

export function useCropDetail() {
  const { id } = useParams();
  const { getCropById } = useCropStore();
  const baseCrop = getCropById(Number(id));

  const crop: Crop | null = baseCrop
    ? {
        ...baseCrop,
        seedInfo: baseCrop.seedInfo || generateSeedInfo(),
        statusInfo: baseCrop.statusInfo || generateCropStatus(),
        farmingHistory: baseCrop.farmingHistory || generateFarmingHistory(),
        diseaseHistory: baseCrop.diseaseHistory || generateDiseaseHistory(),
        harvestHistory: baseCrop.harvestHistory || generateHarvestHistory(),
        iotData: baseCrop.iotData || generateIoTData(),
      }
    : null;

  return {
    id,
    crop,
  };
}
