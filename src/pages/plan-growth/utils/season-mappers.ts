import type { GrowthCycle } from "../../growth-cycle/types/types";

export function mapSeasonToGrowthCycle(season: any): GrowthCycle {
  return {
    id: String(season.id),
    name: season.name || season.code || `Season #${season.id}`,
    cycleType: "plant",
    scope: "crop",
    scopeNames: [],
    cropId: String(season.productionSubject?.id ?? ""),
    cropName: season.productionSubject?.name || "",
    totalDays: (season.stages || []).reduce(
      (total: number, stage: any) => total + (Number(stage.durationDays) || 0),
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
  };
}

export function mapSeasonsToGrowthCycles(seasons: any[]): GrowthCycle[] {
  return seasons.map(mapSeasonToGrowthCycle);
}
