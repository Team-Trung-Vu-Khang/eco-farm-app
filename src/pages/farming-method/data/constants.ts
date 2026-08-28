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
  return {
    id: item.id,
    farmingMethodId: item.productionMethod?.id ?? item.farmingMethodId,
    code: item.code || undefined,
    name: item.productionMethod?.name ?? item.farmingMethodName ?? item.farmingMethodCode ?? "",
    description: item.description || "",
    status: (item.status as MethodStatus) || "active",
    updatedAt: item.updatedAt ? item.updatedAt.split("T")[0] : "",
    relatedCrops: (item.subjects && item.subjects.length > 0)
      ? item.subjects.map((sub) => ({
          cropGroupId: sub.subjectGroupId || null,
          cropGroup: sub.subjectGroupName || "",
          cropId: sub.subjectId,
          crop: sub.subjectName || "",
          varietyIds: sub.variants?.map((v) => v.id) || [],
          varieties: sub.variants?.map((v) => v.name || "") || [],
        }))
      : (item.crops || []).map((crop) => ({
          cropGroupId: crop.cropGroupId || null,
          cropGroup: crop.cropGroupName || "",
          cropId: crop.cropId,
          crop: crop.cropName || "",
          varietyIds: crop.varieties?.map((v) => v.id) || [],
          varieties: crop.varieties?.map((v) => v.name || "") || [],
        })),
  };
};
