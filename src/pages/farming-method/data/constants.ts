import type {
  FarmingMethodCropFormData,
  RelatedCropForm,
  RelatedCrop,
  FarmingMethodCropRow,
  MethodStatus,
} from "../types/types";
import type { FarmingMethodCropResponse } from "../../../features/foundation/types/foundation.type";

export const emptyRelatedCropForm = (): RelatedCropForm => ({
  cropGroupId: null,
  cropGroup: "",
  cropId: 0,
  crop: "",
  varietyIds: [],
  varieties: "",
});

export const createEmptyForm = (): FarmingMethodCropFormData => ({
  code: "",
  farmingMethodId: "",
  description: "",
  status: "active",
  relatedCrops: [emptyRelatedCropForm()],
});

export const toRelatedCropForm = (related: RelatedCrop): RelatedCropForm => ({
  cropGroupId: related.cropGroupId,
  cropGroup: related.cropGroup,
  cropId: related.cropId,
  crop: related.crop,
  varietyIds: related.varietyIds,
  varieties: related.varieties.join(", "),
});

export const apiToRow = (
  item: FarmingMethodCropResponse,
): FarmingMethodCropRow => {
  const relatedCrops = item.subjects?.map((subject) => ({
    cropGroupId: subject.subjectGroupId || null,
    cropGroup: subject.subjectGroupName || "",
    cropId: subject.subjectId,
    crop: subject.subjectName || subject.subjectCode || "",
    varietyIds: subject.variants?.map((variant) => variant.id) || [],
    varieties: subject.variants?.map((variant) => variant.name || "") || [],
  })) ?? (item.crops || []).map((crop) => ({
    cropGroupId: crop.cropGroupId || null,
    cropGroup: crop.cropGroupName || "",
    cropId: crop.cropId,
    crop: crop.cropName || "",
    varietyIds: crop.varieties?.map((variety) => variety.id) || [],
    varieties: crop.varieties?.map((variety) => variety.name || "") || [],
  }));

  return {
    id: item.id,
    farmingMethodId: item.productionMethod?.id ?? item.farmingMethodId,
    code: item.code || undefined,
    name:
      item.productionMethod?.name ||
      item.productionMethod?.code ||
      item.farmingMethodName ||
      item.farmingMethodCode ||
      "",
    description: item.description || "",
    status: (item.status as MethodStatus) || "active",
    updatedAt: item.updatedAt ? item.updatedAt.split("T")[0] : "",
    relatedCrops,
  };
};
