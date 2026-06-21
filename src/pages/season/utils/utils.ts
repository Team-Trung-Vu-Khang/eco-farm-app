import { CROP_OPTIONS } from "@/constants/crops";
import { animalCycleOptions } from "@/pages/growth-cycle/data/cycleSelectionData";
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
  seasonType: "plant",
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
  return (
    CROP_OPTIONS.find((crop) => crop.name === cropName)?.image ||
    animalCycleOptions.find((option) => option.name === cropName)?.image
  );
}

export function calculateDurationFromStageMap(
  selectedStages: Record<string, Record<string, string | number>>,
) {
  let totalDays = 0;

  Object.values(selectedStages).forEach((stageMap) => {
    Object.values(stageMap).forEach((duration) => {
      const str = String(duration || "").trim();
      if (!str) return;

      const yearMatch = str.match(/(\d+)\s*năm/);
      const monthMatch = str.match(/(\d+)\s*tháng/);
      const dayMatch = str.match(/(\d+)\s*ngày/);

      if (yearMatch) {
        totalDays += Number(yearMatch[1]) * 365;
        return;
      }

      if (monthMatch) {
        totalDays += Number(monthMatch[1]) * 30;
        return;
      }

      if (dayMatch) {
        totalDays += Number(dayMatch[1]);
        return;
      }

      const numericValue = Number(str);
      if (!Number.isNaN(numericValue) && numericValue > 0) {
        totalDays += numericValue;
      }
    });
  });

  return totalDays;
}

export function calculateDurationFromSeasonForm(formData: SeasonFormData) {
  const fromStages = calculateDurationFromStageMap(formData.selectedStages);
  if (fromStages > 0) {
    return fromStages;
  }

  return formData.duration > 0 ? formData.duration : 0;
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
  const nextGrowthCycleIds = formData.growthCycleIds.filter((id) => id !== cycleId);

  return {
    ...formData,
    duration:
      nextGrowthCycleIds.length > 0 ? calculateDurationFromStageMap(nextStages) : 0,
    growthCycleIds: nextGrowthCycleIds,
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
