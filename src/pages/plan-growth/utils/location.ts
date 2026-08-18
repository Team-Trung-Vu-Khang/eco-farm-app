import type { Region, SubArea } from "@/pages/region-chart/constants";
import type { Plan } from "../types";
import type {
  GeographicalSelection,
  PlanFormData,
  SelectionSummaryGroup,
} from "../types";

type RegionLike = Region & {
  subAreas?: SubArea[];
};

function findRegion(regions: RegionLike[], regionId: string) {
  return regions.find((item) => String(item.id) === String(regionId));
}

function findArea(region: RegionLike, areaId?: string) {
  return region.subAreas?.find((item) => String(item.id) === String(areaId));
}

function findPlot(area: SubArea | undefined, plotId?: string) {
  return area?.plots?.find((item) => String(item.id) === String(plotId));
}

export function summarizeSelections(
  selections: GeographicalSelection[],
  regions: RegionLike[],
): SelectionSummaryGroup[] {
  const summary: SelectionSummaryGroup[] = [];

  selections.forEach((selection) => {
    const region = findRegion(regions, selection.regionId);
    if (!region) return;

    let regionGroup = summary.find(
      (item) => item.regionId === String(region.id),
    );
    if (!regionGroup) {
      regionGroup = {
        regionId: String(region.id),
        regionName: region.name,
        items: [],
      };
      summary.push(regionGroup);
    }

    if (selection.type === "region") {
      regionGroup.items.push({
        type: "region",
        id: String(region.id),
        name: "Toàn bộ vùng",
      });
      return;
    }

    if (selection.type === "area") {
      const area = findArea(region, selection.areaId);
      if (area) {
        regionGroup.items.push({
          type: "area",
          id: String(area.id),
          name: area.name,
        });
      }
      return;
    }

    const area = findArea(region, selection.areaId);
    const plot = findPlot(area, selection.plotId);
    if (plot) {
      regionGroup.items.push({
        type: "plot",
        id: String(plot.id),
        name: plot.name,
        parentName: area?.name,
      });
    }
  });

  return summary;
}

export function summarizeTaskSelections(
  selections: GeographicalSelection[] | undefined,
  regions: RegionLike[],
) {
  if (!selections) return [];

  return summarizeSelections(selections, regions).map((group) => ({
    regionId: group.regionId,
    regionName: group.regionName,
    items: group.items.map((item) => ({
      type: item.type,
      name: item.name,
    })),
  }));
}

export function deriveSelectionState(
  selections: GeographicalSelection[],
  regions: RegionLike[],
  fallbackCrop = "",
  fallbackVariety = "",
) {
  const regionIds = new Set<string>();
  const zoneIds = new Set<string>();
  const plotIds = new Set<string>();
  let crop = fallbackCrop;
  let variety = fallbackVariety;

  selections.forEach((selection) => {
    const region = findRegion(regions, selection.regionId);
    if (!region) return;

    if (region.cropVarieties?.length) {
      crop = region.cropVarieties[0].name;
      variety = region.cropVarieties[0].variety;
    }

    regionIds.add(String(region.id));

    if (selection.type === "region") {
      region.subAreas?.forEach((area) => {
        zoneIds.add(String(area.id));
        area.plots?.forEach((plot) => {
          plotIds.add(String(plot.id));
        });
      });
      return;
    }

    if (selection.type === "area") {
      const area = findArea(region, selection.areaId);
      if (area) {
        zoneIds.add(String(area.id));
        area.plots?.forEach((plot) => {
          plotIds.add(String(plot.id));
        });
      }
      return;
    }

    plotIds.add(String(selection.plotId));
    const area = findArea(region, selection.areaId);
    if (area) {
      zoneIds.add(String(area.id));
    }
  });

  return {
    selectedRegionIds: Array.from(regionIds),
    selectedZoneIds: Array.from(zoneIds),
    selectedPlotIds: Array.from(plotIds),
    crop,
    variety,
  };
}

export function calculateSelectedArea(
  formData: Pick<
    PlanFormData,
    "selectedRegionIds" | "selectedZoneIds" | "selectedPlotIds"
  >,
  regions: RegionLike[],
) {
  let total = 0;

  (regions || []).forEach((region) => {
    if (!formData.selectedRegionIds.includes(String(region.id))) return;

    const regionZoneIds = region.subAreas?.map((item) => String(item.id)) || [];
    const isWholeRegion =
      regionZoneIds.length > 0 &&
      regionZoneIds.every((id: string) => formData.selectedZoneIds.includes(id));

    if (isWholeRegion) {
      total += region.area || 0;
      return;
    }

    region.subAreas?.forEach((area) => {
      if (!formData.selectedZoneIds.includes(String(area.id))) return;

      const areaPlotIds = area.plots?.map((item) => String(item.id)) || [];
      const isWholeArea =
        areaPlotIds.length > 0 &&
        areaPlotIds.every((id: string) => formData.selectedPlotIds.includes(id));

      if (isWholeArea) {
        total += area.area || 0;
        return;
      }

      area.plots?.forEach((plot) => {
        if (formData.selectedPlotIds.includes(String(plot.id))) {
          total += plot.area || 0;
        }
      });
    });
  });

  return total.toFixed(1);
}

export function reconstructSelectionsFromPlan(plan: Plan, regions: RegionLike[]) {
  const selections: GeographicalSelection[] = [];
  let enterpriseId = "";

  (plan.selectedRegionIds || []).forEach((regionId) => {
    const region = findRegion(regions, regionId);
    if (!region) return;

    const regionZoneIds =
      region.subAreas?.map((item) => String(item.id)) || [];
    const isWholeRegion =
      regionZoneIds.length === 0 ||
      (regionZoneIds.length > 0 &&
        regionZoneIds.every((id: string) =>
          (plan.selectedZoneIds || []).includes(id),
        ));

    if (isWholeRegion) {
      selections.push({
        id: `region-${regionId}`,
        type: "region",
        regionId: String(regionId),
      });
      enterpriseId ||= region.enterpriseId;
      return;
    }

    region.subAreas?.forEach((area) => {
      if (!(plan.selectedZoneIds || []).includes(String(area.id))) return;

      const areaPlotIds = area.plots?.map((item) => String(item.id)) || [];
      const isWholeArea =
        areaPlotIds.length === 0 ||
        (areaPlotIds.length > 0 &&
          areaPlotIds.every((id: string) =>
            (plan.selectedPlotIds || []).includes(id),
          ));

      if (isWholeArea) {
        selections.push({
          id: `area-${area.id}`,
          type: "area",
          regionId: String(regionId),
          areaId: String(area.id),
        });
        enterpriseId ||= region.enterpriseId;
        return;
      }

      area.plots?.forEach((plot) => {
        if (!(plan.selectedPlotIds || []).includes(String(plot.id))) return;
        selections.push({
          id: `plot-${plot.id}`,
          type: "plot",
          regionId: String(regionId),
          areaId: String(area.id),
          plotId: String(plot.id),
        });
        enterpriseId ||= region.enterpriseId;
      });
    });
  });

  return { selections, enterpriseId };
}

export function summarizePlanSelections(plan: Plan, regions: RegionLike[]) {
  return summarizeSelections(reconstructSelectionsFromPlan(plan, regions).selections, regions);
}
