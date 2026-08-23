import type { GrowthCycle } from "../../growth-cycle/types/types";

/** Normalize farm/master-data season responses for the animal plan UI. */
export function mapSeasonsToGrowthCycles(seasons: any[]): GrowthCycle[] {
  return seasons.map((season) => ({
    id: String(season.id),
    name: season.name || season.code || `Lứa nuôi #${season.id}`,
    cycleType: "animal",
    scope: "livestock",
    scopeNames: [],
    cropId: String(season.productionSubject?.id ?? ""),
    cropName: season.productionSubject?.name || "",
    totalDays: (season.stages || []).reduce(
      (total: number, stage: any) =>
        total + (Number(stage.durationDays) || 0),
      0,
    ),
    numStages: (season.stages || []).length,
    stages: (season.stages || []).map((stage: any, index: number) => ({
      id: String(stage.id ?? `${season.id}-${index}`),
      name: stage.name || `Giai đoạn ${index + 1}`,
      duration: Number(stage.durationDays) || 0,
      usePdf: false,
      content: stage.description || "",
    })),
    createdAt: 0,
    updatedAt: 0,
  }));
}
