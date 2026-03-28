import type { GeographicalSelection } from "../../plan/types";
import type {
  RegionLookup,
  TaskAssigneeOption,
  TaskSelectionSummaryGroup,
  TaskTeamList,
  TaskPersonnelList,
} from "../types/form";

export function buildTaskAssigneeOptions(
  assignedType: "individual" | "team",
  personnel: TaskPersonnelList,
  teams: TaskTeamList,
): TaskAssigneeOption[] {
  if (assignedType === "team") {
    return teams.map((team) => ({
      id: team.id,
      name: team.name,
      code: team.code,
      avatar: "",
    }));
  }

  return personnel.map((person) => ({
    id: person.id,
    name: person.fullName,
    code: person.taxCode || `NV${String(person.id).padStart(3, "0")}`,
    avatar: person.avatar,
  }));
}

export function filterRegionsBySelections<T extends RegionLookup>(
  regions: T[],
  selections: GeographicalSelection[],
  enabled: boolean,
) {
  if (!enabled || selections.length === 0) {
    return regions;
  }

  return regions
    .map((region) => {
      const isRegionSelected = selections.some(
        (selection) =>
          selection.type === "region" &&
          String(selection.regionId) === String(region.id),
      );

      if (isRegionSelected) {
        return region;
      }

      const filteredSubAreas = (region.subAreas || [])
        .map((area) => {
          const isAreaSelected = selections.some(
            (selection) =>
              selection.type === "area" &&
              String(selection.areaId) === String(area.id),
          );

          if (isAreaSelected) {
            return area;
          }

          const filteredPlots = (area.plots || []).filter((plot) =>
            selections.some(
              (selection) =>
                selection.type === "plot" &&
                String(selection.plotId) === String(plot.id),
            ),
          );

          return filteredPlots.length > 0
            ? { ...area, plots: filteredPlots }
            : null;
        })
        .filter(Boolean) as NonNullable<T["subAreas"]>;

      return filteredSubAreas.length > 0
        ? { ...region, subAreas: filteredSubAreas }
        : null;
    })
    .filter(Boolean) as T[];
}

export function getGeographicalSelectionSummary(
  selections: GeographicalSelection[],
  regions: RegionLookup[],
): TaskSelectionSummaryGroup[] {
  if (selections.length === 0) {
    return [];
  }

  const summary: TaskSelectionSummaryGroup[] = [];

  selections.forEach((selection) => {
    const region = regions.find(
      (item) => String(item.id) === String(selection.regionId),
    );

    if (!region) {
      return;
    }

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
        name: `Toàn bộ ${region.name}`,
      });
      return;
    }

    if (selection.type === "area") {
      const area = region.subAreas?.find(
        (item) => String(item.id) === String(selection.areaId),
      );

      if (area) {
        regionGroup.items.push({
          type: "area",
          id: String(area.id),
          name: area.name,
        });
      }

      return;
    }

    const area = region.subAreas?.find(
      (item) => String(item.id) === String(selection.areaId),
    );
    const plot = area?.plots?.find(
      (item) => String(item.id) === String(selection.plotId),
    );

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
