import { CROP_OPTIONS } from "@/constants/crops";
import type {
  CreateSeasonForm,
  SeasonDocument,
  SeasonFormData,
  SeasonStatus,
} from "../types/types";

export const EMPTY_SEASON_FORM: SeasonFormData = {
  code: "",
  name: "",
  description: "",
  duration: 0,
  status: "planning",
  scope: "crop",
  cropId: undefined,
  varietyId: undefined,
  growthCycleIds: [],
  selectedStages: {},
  documents: [],
};

export const SEASON_STATUS_OPTIONS: {
  label: string;
  value: SeasonStatus;
}[] = [
  { value: "planning", label: "Đang lập kế hoạch" },
  { value: "active", label: "Đang triển khai" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

export function getCropImage(cropName: string) {
  return CROP_OPTIONS.find((crop) => crop.name === cropName)?.image;
}

export function resetSeasonScopeFields(formData: SeasonFormData) {
  return {
    ...formData,
    cropId: undefined,
    varietyId: undefined,
    growthCycleIds: [],
    selectedStages: {},
  };
}

export function validateSeasonForm(formData: CreateSeasonForm) {
  return Boolean(formData.code && formData.name && formData.duration > 0);
}

export function removeGrowthCycleFromForm(
  formData: SeasonFormData,
  cycleId: string,
) {
  const nextStages = { ...formData.selectedStages };
  delete nextStages[cycleId];

  return {
    ...formData,
    growthCycleIds: formData.growthCycleIds.filter((id) => id !== cycleId),
    selectedStages: nextStages,
  };
}

export function mapFilesToSeasonDocuments(files: (File | SeasonDocument)[]) {
  return files.map((file) => {
    if (file instanceof File) {
      return {
        name: file.name,
        type: "technical" as const,
        id: `${Date.now()}-${file.name}`,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
      };
    }

    return file;
  });
}
