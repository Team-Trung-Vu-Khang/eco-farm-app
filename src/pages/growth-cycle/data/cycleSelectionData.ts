import { CROP_OPTIONS } from "@/constants/crops";

export type CyclePrimaryOptionType = "plant";

export interface CyclePrimaryOption {
  id: string;
  name: string;
  group: string;
  image: string;
  description: string;
}

export interface CycleBreedOption {
  id: string;
  primaryId: string;
  name: string;
  code: string;
  image: string;
  description: string;
}

export const plantCycleOptions: CyclePrimaryOption[] = CROP_OPTIONS.map((crop) => ({
  id: crop.id,
  name: crop.name,
  group: crop.group,
  image: crop.image,
  description: `${crop.group} phổ biến trong hệ thống trồng trọt.`,
}));
