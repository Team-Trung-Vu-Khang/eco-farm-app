export type MethodStatus = "active" | "inactive";

export type RelatedCrop = {
  cropGroupId: number | null;
  cropGroup: string;
  cropId: number;
  crop: string;
  varietyIds: number[];
  varieties: string[];
};

export type FarmingMethodCropRow = {
  id: number;
  farmingMethodId?: number;
  code: string;
  name: string;
  description: string;
  relatedCrops: RelatedCrop[];
  status: MethodStatus;
  updatedAt: string;
};

export type RelatedCropForm = {
  cropGroupId: number | null;
  cropGroup: string;
  cropId: number;
  crop: string;
  varietyIds: number[];
  varieties: string;
};

export type VarietyOption = { id: number; name: string };

export type CropOption = {
  cropGroupId: number | null;
  cropGroup: string;
  cropId: number;
  crop: string;
  varieties: VarietyOption[];
};

export type FarmingMethodCropFormData = {
  code: string;
  farmingMethodId: string;
  description: string;
  status: MethodStatus;
  relatedCrops: RelatedCropForm[];
};
