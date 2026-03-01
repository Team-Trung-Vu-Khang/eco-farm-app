export interface GeographicalUnit {
  id: string;
  name: string;
  level: number;
  type: string;
  coordinates?: any[];
}

export interface PlotNode extends GeographicalUnit {
  isSelected: boolean;
}

export interface AreaNode extends GeographicalUnit {
  isSelected: boolean;
  plots: PlotNode[];
}

export interface RegionNode extends GeographicalUnit {
  isSelected: boolean;
  areas: AreaNode[];
}

export interface TreeData {
  regions: GeographicalUnit[];
  areas: GeographicalUnit[];
  plots: GeographicalUnit[];
  areasByRegion: Record<string, GeographicalUnit[]>;
  plotsByArea: Record<string, GeographicalUnit[]>;
  selectedHierarchy: RegionNode[];
  selectedScopeUnits: GeographicalUnit[];
}

export const buildGeographicalTree = (
  geographicalUnits: GeographicalUnit[],
  selectedScopeIds: string[],
  regionStore: any,
): TreeData => {
  const regions = geographicalUnits.filter((u) => u.level === 3);
  const areas = geographicalUnits.filter((u) => u.level === 2);
  const plots = geographicalUnits.filter((u) => u.level === 1);

  const areasByRegion: Record<string, GeographicalUnit[]> = {};
  areas.forEach((area) => {
    const ac = regionStore.getAreaById?.(area.id);
    const rid = ac?.region?.id?.toString() || "";
    if (!areasByRegion[rid]) areasByRegion[rid] = [];
    areasByRegion[rid].push(area);
  });

  const plotsByArea: Record<string, GeographicalUnit[]> = {};
  plots.forEach((plot) => {
    const pc = regionStore.getPlotById?.(plot.id);
    const aid = pc?.area?.id?.toString() || "";
    if (!plotsByArea[aid]) plotsByArea[aid] = [];
    plotsByArea[aid].push(plot);
  });

  const selectedHierarchy: RegionNode[] = regions
    .filter(
      (r) =>
        selectedScopeIds.includes(r.id) ||
        (areasByRegion[r.id] || []).some(
          (a) =>
            selectedScopeIds.includes(a.id) ||
            (plotsByArea[a.id] || []).some((p) =>
              selectedScopeIds.includes(p.id),
            ),
        ),
    )
    .map((r) => ({
      ...r,
      isSelected: selectedScopeIds.includes(r.id),
      areas: (areasByRegion[r.id] || [])
        .filter(
          (a) =>
            selectedScopeIds.includes(a.id) ||
            selectedScopeIds.includes(r.id) ||
            (plotsByArea[a.id] || []).some((p) =>
              selectedScopeIds.includes(p.id),
            ),
        )
        .map((a) => ({
          ...a,
          isSelected:
            selectedScopeIds.includes(a.id) || selectedScopeIds.includes(r.id),
          plots: (plotsByArea[a.id] || [])
            .filter(
              (p) =>
                selectedScopeIds.includes(p.id) ||
                selectedScopeIds.includes(a.id) ||
                selectedScopeIds.includes(r.id),
            )
            .map((p) => ({
              ...p,
              isSelected:
                selectedScopeIds.includes(p.id) ||
                selectedScopeIds.includes(a.id) ||
                selectedScopeIds.includes(r.id),
            })),
        })),
    }));

  const selectedScopeUnits = geographicalUnits.filter((u) =>
    selectedScopeIds.includes(u.id),
  );

  return {
    regions,
    areas,
    plots,
    areasByRegion,
    plotsByArea,
    selectedHierarchy,
    selectedScopeUnits,
  };
};
