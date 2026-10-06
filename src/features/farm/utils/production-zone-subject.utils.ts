import type {
  FarmProductionZoneSubjectRequest,
  FarmProductionZoneSubjectVariantRequest,
  FarmProductionZoneSubjectResponse,
} from "../types/farm.type";

/**
 * Xây dựng mảng subjects 3 cấp (Cây trồng -> Giống -> Hạt giống) từ dữ liệu form.
 *
 * Quy tắc:
 * 1. Nếu vùng không chọn hạt giống (useSpecificSeeds = false / seedIds rỗng):
 *    - Mỗi cây trồng có thể chọn hoặc không chọn giống tùy ý.
 * 2. Nếu vùng có chọn hạt giống (useSpecificSeeds = true):
 *    - Mỗi cây trồng chọn giống, mỗi giống chọn hạt giống tương ứng.
 */
export function buildProductionZoneSubjects(params: {
  cropIds?: (string | number)[] | null;
  varietyIds?: (string | number)[] | null;
  varietyCropMap?: Record<string, string | number | undefined | null> | null;
  varietySeedMap?: Record<
    string,
    (string | number)[] | number[] | string[] | undefined | null
  > | null;
  seedIds?: (string | number)[] | null;
  useSpecificSeeds?: boolean | null;
}): FarmProductionZoneSubjectRequest[] {
  const {
    cropIds = [],
    varietyIds = [],
    varietyCropMap = {},
    varietySeedMap = {},
    seedIds = [],
    useSpecificSeeds = false,
  } = params;

  const validCropIds = Array.from(
    new Set((cropIds ?? [])?.map(Number).filter((id) => !isNaN(id) && id > 0)),
  );
  const validVarietyIds = Array.from(
    new Set(
      (varietyIds ?? [])?.map(Number).filter((id) => !isNaN(id) && id > 0),
    ),
  );
  const validSeedIds = Array.from(
    new Set((seedIds ?? [])?.map(Number).filter((id) => !isNaN(id) && id > 0)),
  );

  return validCropIds.map((cropId) => {
    // Lấy các giống thuộc cây trồng này
    const varietiesOfCrop = validVarietyIds.filter((vId) => {
      const parentCropId = Number(varietyCropMap?.[String(vId)]);
      return parentCropId === cropId;
    });

    const variants: FarmProductionZoneSubjectVariantRequest[] =
      varietiesOfCrop.map((vId) => {
        let seedsOfVariety: number[] = [];
        if (useSpecificSeeds) {
          const mappedSeeds = (varietySeedMap?.[String(vId)] || [])
            .map(Number)
            .filter((sId) => validSeedIds.includes(sId));
          seedsOfVariety = mappedSeeds;
        }
        return {
          productionSubjectVariantId: vId,
          ...(seedsOfVariety.length > 0 ? { seedIds: seedsOfVariety } : {}),
        };
      });

    return {
      productionSubjectId: cropId,
      ...(variants.length > 0 ? { variants } : {}),
    };
  });
}

/**
 * Trích xuất dữ liệu form từ response subjects của Vùng canh tác.
 */
export function parseProductionZoneSubjects(
  subjects?: FarmProductionZoneSubjectResponse[],
) {
  if (!subjects || subjects.length === 0) {
    return {
      cropIds: [] as string[],
      varietyIds: [] as number[],
      seedIds: [] as number[],
      varietyCropMap: {} as Record<string, string>,
      varietySeedMap: {} as Record<string, number[]>,
      varietyLabels: {} as Record<string, string>,
      seedLabels: {} as Record<string, string>,
      useSpecificSeeds: false,
    };
  }

  const cropIds: string[] = [];
  const varietyIds: number[] = [];
  const seedIds: number[] = [];
  const varietyCropMap: Record<string, string> = {};
  const varietySeedMap: Record<string, number[]> = {};
  const varietyLabels: Record<string, string> = {};
  const seedLabels: Record<string, string> = {};

  subjects.forEach((subj) => {
    if (!subj.id) return;
    cropIds.push(String(subj.id));

    (subj.variants ?? []).forEach((v) => {
      if (!v.id) return;
      varietyIds.push(v.id);
      varietyCropMap[String(v.id)] = String(subj.id);
      if (v.name) varietyLabels[String(v.id)] = v.name;

      const seedsOfVariant: number[] = [];
      (v.seeds ?? []).forEach((seed) => {
        if (!seed.id) return;
        seedIds.push(seed.id);
        seedsOfVariant.push(seed.id);
        if (seed.name) seedLabels[String(seed.id)] = seed.name;
      });

      if (seedsOfVariant.length > 0) {
        varietySeedMap[String(v.id)] = seedsOfVariant;
      }
    });
  });

  return {
    cropIds,
    varietyIds,
    seedIds,
    varietyCropMap,
    varietySeedMap,
    varietyLabels,
    seedLabels,
    useSpecificSeeds: seedIds.length > 0,
  };
}
