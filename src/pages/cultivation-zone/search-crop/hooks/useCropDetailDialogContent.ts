/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import L from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import useCropDetailStore from "../../../../stores/useCropDetailStore";
import useCultivationRegionStore from "../../../../stores/useCultivationRegionStore";
import useGrowthCycleStore from "../../../../stores/useGrowthCycleStore";
import usePersonnelStore from "../../../../stores/usePersonnelStore";
import usePlanStore, { type Plan } from "../../../../stores/usePlanStore";
import useRegionStore from "../../../../stores/useRegionStore";
import useTaskStore, { type Task } from "../../../../stores/useTaskStore";
import { DISTRICTS, PROVINCES } from "../../../region-chart/constants";
import type { CropDetail } from "../constants";
import { useCultivationRegionDetail } from "../../cultivation-region/useCultivationRegionDetail";
import type {
  Coordinate,
  CropGeoRefs,
  RegionIndex,
  ScopeMapData,
  ScopedGroupedSelections,
  TechnicalCrop,
} from "../components/crop-detail/types";

type LeafletMapInternal = L.Map & { _loaded?: boolean };

type UseCropDetailDialogContentParams = {
  id?: string;
  crop?: CropDetail;
};

export function useCropDetailDialogContent({
  id,
  crop,
}: UseCropDetailDialogContentParams) {
  const params = useParams<{ id: string }>();
  const resolvedId = id ?? params?.id;
  const [, setLocation] = useLocation();

  const [isScopeMapExpanded, setIsScopeMapExpanded] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [planFilter, setPlanFilter] = useState<Plan["purpose"]>("cultivation");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

  const scopeMapRef = useRef<L.Map | null>(null);
  const expandedScopeMapRef = useRef<L.Map | null>(null);
  const prevRegionIdRef = useRef<string | null>(null);

  const { growthCycles } = useGrowthCycleStore();
  const cultivationAreas = useCultivationRegionStore((state) => state.areas);
  const { getCropById } = useCropDetailStore();
  const { regions } = useRegionStore();
  const { plans } = usePlanStore();
  const { personnel } = usePersonnelStore();
  const tasks = useTaskStore((state) => state.tasks);

  const handleBack = () => {
    setLocation("/search-crop");
  };

  const navigateToPlans = () => {
    setLocation("/plan");
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const regionIndex = useMemo<RegionIndex>(() => {
    const regionById = new Map<string, any>();
    const areaById = new Map<string, { area: any; region: any }>();
    const plotById = new Map<string, { plot: any; area: any; region: any }>();

    for (const region of regions) {
      regionById.set(String(region.id), region);
      for (const area of region.subAreas || []) {
        areaById.set(String(area.id), { area, region });
        for (const plot of area.plots || []) {
          plotById.set(String(plot.id), { plot, area, region });
        }
      }
    }

    return { regionById, areaById, plotById };
  }, [regions]);

  const activeCrop = useMemo(() => {
    if (crop) return crop;
    if (resolvedId) return getCropById(resolvedId) ?? null;
    return null;
  }, [crop, resolvedId, getCropById]);

  const cropGeoRefs = useMemo<CropGeoRefs>(() => {
    if (!activeCrop) {
      return { region: null, area: null, plot: null };
    }

    if (activeCrop.plotId) {
      const plotRef = regionIndex.plotById.get(String(activeCrop.plotId));
      if (plotRef) {
        return {
          region: plotRef.region,
          area: plotRef.area,
          plot: plotRef.plot,
        };
      }
    }

    if (activeCrop.areaId) {
      const areaRef = regionIndex.areaById.get(String(activeCrop.areaId));
      if (areaRef) {
        return { region: areaRef.region, area: areaRef.area, plot: null };
      }
    }

    if (activeCrop.regionId) {
      const regionRef = regionIndex.regionById.get(String(activeCrop.regionId));
      if (regionRef) {
        return { region: regionRef, area: null, plot: null };
      }
    }

    return { region: null, area: null, plot: null };
  }, [activeCrop, regionIndex]);

  const getActiveScopeMap = () => {
    if (isScopeMapExpanded) return expandedScopeMapRef.current;
    return scopeMapRef.current;
  };

  const formatFullAddress = (region?: any) => {
    if (!region) return "";
    const province =
      PROVINCES.find((item) => item.id === region.provinceId)?.name || "";
    const district =
      DISTRICTS.find((item) => item.id === region.districtId)?.name || "";
    const ward = region.ward || "";
    const address = region.address || "";
    return [address, ward, district, province].filter(Boolean).join(", ");
  };

  const focusScopeMapToCoordinates = (coordinates?: Coordinate[]) => {
    if (!coordinates?.length) return;
    const map = getActiveScopeMap();
    if (!map) return;
    const bounds = L.latLngBounds(
      coordinates.map((coordinate) => [
        coordinate.lat,
        coordinate.lng,
      ] as [number, number]),
    );
    map.flyToBounds(bounds, { padding: [40, 40], duration: 1.1 });
  };

  const areaDetailId = useMemo(() => {
    if (activeCrop) {
      const candidateIds = new Set<string>();

      const pushCandidate = (value?: string | number | null) => {
        if (value === undefined || value === null) return;
        const stringValue = String(value);
        if (!stringValue) return;
        candidateIds.add(stringValue);
      };

      pushCandidate(activeCrop.plotId);
      pushCandidate(activeCrop.areaId);
      pushCandidate(activeCrop.regionId);
      pushCandidate(cropGeoRefs.plot?.id);
      pushCandidate(cropGeoRefs.area?.id);
      pushCandidate(cropGeoRefs.region?.id);

      if (candidateIds.size > 0) {
        const matchedArea = cultivationAreas.find((cultivationArea) =>
          (cultivationArea.targetIds || []).some((targetId) =>
            candidateIds.has(String(targetId)),
          ),
        );
        if (matchedArea) return matchedArea.id;
      }
    }

    return resolvedId;
  }, [activeCrop, cultivationAreas, cropGeoRefs, resolvedId]);

  const { area, details } = useCultivationRegionDetail(areaDetailId);

  const technicalCrops = details?.technicalConfig?.crops || [];

  const filteredTechnicalCrops = useMemo<TechnicalCrop[]>(() => {
    if (!activeCrop) return technicalCrops;

    const normalizedVariety = (activeCrop.variety || "").toLowerCase();
    const normalizedName = (activeCrop.name || "").toLowerCase();
    const normalizedCode = (activeCrop.code || "").toLowerCase();

    const matched = technicalCrops.filter((technicalCrop: any) => {
      const displayName = (
        technicalCrop.varietyName ||
        technicalCrop.crop ||
        ""
      ).toLowerCase();
      const displayCode = (technicalCrop.varietyCode || technicalCrop.id || "")
        .toString()
        .toLowerCase();

      return (
        (!!normalizedVariety && displayName.includes(normalizedVariety)) ||
        (!!normalizedName && displayName.includes(normalizedName)) ||
        (!!normalizedCode && displayCode.includes(normalizedCode))
      );
    });

    if (matched.length > 0) return matched;

    return [
      {
        id: activeCrop.id,
        crop: activeCrop.groupCropName,
        varietyName: activeCrop.name,
        seedType: activeCrop.seedType,
        varietyCode: activeCrop.code,
        illustration: activeCrop.image,
        selectedSeeds: [],
      },
    ];
  }, [technicalCrops, activeCrop]);

  const groupedCrops = useMemo(() => {
    return filteredTechnicalCrops.reduce(
      (accumulator: Record<string, TechnicalCrop[]>, technicalCrop) => {
        const cropName = technicalCrop.crop || "Khác";
        if (!accumulator[cropName]) accumulator[cropName] = [];
        accumulator[cropName].push(technicalCrop);
        return accumulator;
      },
      {},
    );
  }, [filteredTechnicalCrops]);

  const { scopedGroupedSelections, scopedSelectionCount } = useMemo(() => {
    const buildFallbackFromCrop = () => {
      if (!cropGeoRefs.region) {
        return { scopedGroupedSelections: {}, scopedSelectionCount: 0 };
      }

      const regionKey = String(cropGeoRefs.region.id);
      const areaKey = cropGeoRefs.area ? String(cropGeoRefs.area.id) : "none";
      const entities: any[] = [];

      if (cropGeoRefs.plot) {
        entities.push({
          ...cropGeoRefs.plot,
          regionId: cropGeoRefs.region.id,
          areaId: cropGeoRefs.area?.id,
          type: "Lô đất",
          typeCode: "plot",
        });
      } else if (cropGeoRefs.area) {
        entities.push({
          id: cropGeoRefs.area.id,
          name: cropGeoRefs.area.name,
          regionId: cropGeoRefs.region.id,
          areaId: cropGeoRefs.area.id,
          type: "Khu vực",
          typeCode: "area",
          coordinates: cropGeoRefs.area.coordinates,
        });
      } else {
        entities.push({
          id: cropGeoRefs.region.id,
          name: cropGeoRefs.region.name,
          regionId: cropGeoRefs.region.id,
          type: "Vùng trồng",
          typeCode: "region",
          coordinates: cropGeoRefs.region.coordinates,
        });
      }

      const areasPayload =
        cropGeoRefs.area || cropGeoRefs.plot
          ? {
              [areaKey]: {
                area: cropGeoRefs.area,
                entities,
              },
            }
          : {
              none: {
                area: null,
                entities,
              },
            };

      return {
        scopedGroupedSelections: {
          [regionKey]: {
            region: cropGeoRefs.region,
            areas: areasPayload,
          },
        },
        scopedSelectionCount: entities.length || 1,
      };
    };

    const countFromGroups = (groups: Record<string, any>) => {
      let count = 0;
      Object.values(groups || {}).forEach((group: any) => {
        const areaGroups = Object.values(group?.areas || {});
        if (areaGroups.length === 0) {
          count += 1;
          return;
        }
        areaGroups.forEach((areaGroup: any) => {
          const entityCount = (areaGroup?.entities || []).length;
          count += entityCount > 0 ? entityCount : 1;
        });
      });
      return count;
    };

    if (!details) {
      return buildFallbackFromCrop();
    }

    if (!activeCrop) {
      return {
        scopedGroupedSelections: details.groupedSelections,
        scopedSelectionCount:
          details.selectedEntities?.length ||
          countFromGroups(details.groupedSelections) ||
          0,
      };
    }

    const regionGroups = Object.values(details.groupedSelections || {});
    const resolvedRegionId = cropGeoRefs.region
      ? String(cropGeoRefs.region.id)
      : activeCrop.regionId
        ? String(activeCrop.regionId)
        : null;

    const targetRegionGroup = resolvedRegionId
      ? regionGroups.find((group: any) => String(group.region?.id) === resolvedRegionId)
      : regionGroups[0];

    if (!targetRegionGroup) {
      return buildFallbackFromCrop();
    }

    const filteredAreas: Record<string, any> = {};
    const areaEntries = Object.entries(targetRegionGroup.areas || {});

    if (cropGeoRefs.plot?.id) {
      const plotId = String(cropGeoRefs.plot.id);
      const targetAreaEntry = areaEntries.find(([, areaGroup]: any) =>
        (areaGroup.entities || []).some((entity: any) => {
          const entityPlotId = entity.plotId ?? entity.id;
          return entity.typeCode === "plot" && String(entityPlotId) === plotId;
        }),
      );

      if (targetAreaEntry) {
        const [areaKey, areaGroup] = targetAreaEntry;
        const entities = (areaGroup.entities || []).filter((entity: any) => {
          const entityPlotId = entity.plotId ?? entity.id;
          return entity.typeCode === "plot" && String(entityPlotId) === plotId;
        });
        filteredAreas[areaKey] = { ...areaGroup, entities };
      }
    } else if (cropGeoRefs.area?.id) {
      const areaId = String(cropGeoRefs.area.id);
      const targetAreaEntry = areaEntries.find(
        ([, areaGroup]: any) => areaGroup.area && String(areaGroup.area.id) === areaId,
      );

      if (targetAreaEntry) {
        const [areaKey, areaGroup] = targetAreaEntry;
        const entities = (areaGroup.entities || []).filter((entity: any) => {
          if (entity.typeCode === "area") {
            const entityAreaId = entity.areaId ?? entity.id;
            return String(entityAreaId) === areaId;
          }
          return entity.typeCode !== "plot";
        });
        filteredAreas[areaKey] = { ...areaGroup, entities };
      }
    }

    const hasFilteredAreas = Object.keys(filteredAreas).length > 0;

    if ((cropGeoRefs.area || cropGeoRefs.plot) && !hasFilteredAreas) {
      return buildFallbackFromCrop();
    }

    const scopedGroup = {
      ...targetRegionGroup,
      areas:
        cropGeoRefs.area || cropGeoRefs.plot
          ? filteredAreas
          : (targetRegionGroup.areas ?? {}),
    };

    const scopedRegionKey =
      targetRegionGroup.region?.id !== undefined
        ? String(targetRegionGroup.region.id)
        : resolvedRegionId || "region";

    const scoped = {
      [scopedRegionKey]: scopedGroup,
    };

    const selectionCount = countFromGroups(scoped);

    if (!selectionCount) {
      return buildFallbackFromCrop();
    }

    return {
      scopedGroupedSelections: scoped,
      scopedSelectionCount: selectionCount,
    };
  }, [details, activeCrop, cropGeoRefs]);

  const scopeMapData = useMemo<ScopeMapData | null>(() => {
    if (!activeCrop) return null;

    const explicitRegionIds = new Set<string>();
    const explicitAreaIds = new Set<string>();
    const explicitPlotIds = new Set<string>();

    const regionsMap = new Map<string, { region: any; explicit: boolean }>();
    const areasMap = new Map<string, { area: any; explicit: boolean }>();
    const plotsMap = new Map<string, { plot: any; explicit: boolean }>();

    const addRegion = (region: any, explicit: boolean) => {
      const key = String(region.id);
      const existing = regionsMap.get(key);
      if (existing) {
        if (explicit) existing.explicit = true;
        return;
      }
      regionsMap.set(key, { region, explicit });
    };

    const addArea = (areaItem: any, explicit: boolean) => {
      const key = String(areaItem.id);
      const existing = areasMap.get(key);
      if (existing) {
        if (explicit) existing.explicit = true;
        return;
      }
      areasMap.set(key, { area: areaItem, explicit });
    };

    const addPlot = (plot: any, explicit: boolean) => {
      const key = String(plot.id);
      const existing = plotsMap.get(key);
      if (existing) {
        if (explicit) existing.explicit = true;
        return;
      }
      plotsMap.set(key, { plot, explicit });
    };

    const registerRegionExplicit = (region: any) => {
      if (!region) return;
      explicitRegionIds.add(String(region.id));
      addRegion(region, true);
    };

    const registerAreaExplicit = (areaRef?: { area: any; region: any }) => {
      if (!areaRef) return;
      addRegion(areaRef.region, false);
      addArea(areaRef.area, true);
      explicitAreaIds.add(String(areaRef.area.id));
    };

    const registerPlotExplicit = (plotRef?: {
      plot: any;
      area: any;
      region: any;
    }) => {
      if (!plotRef) return;
      addRegion(plotRef.region, false);
      addArea(plotRef.area, false);
      addPlot(plotRef.plot, true);
      explicitPlotIds.add(String(plotRef.plot.id));
    };

    if (cropGeoRefs.region) {
      registerRegionExplicit(cropGeoRefs.region);
    } else if (activeCrop.regionId) {
      registerRegionExplicit(
        regionIndex.regionById.get(String(activeCrop.regionId)),
      );
    }

    if (cropGeoRefs.area) {
      registerAreaExplicit({
        area: cropGeoRefs.area,
        region:
          cropGeoRefs.region ||
          regionIndex.regionById.get(String(cropGeoRefs.area.regionId)),
      });
    } else if (activeCrop.areaId) {
      registerAreaExplicit(regionIndex.areaById.get(String(activeCrop.areaId)));
    }

    if (cropGeoRefs.plot) {
      registerPlotExplicit(
        cropGeoRefs.area && cropGeoRefs.region
          ? {
              plot: cropGeoRefs.plot,
              area: cropGeoRefs.area,
              region: cropGeoRefs.region,
            }
          : regionIndex.plotById.get(String(cropGeoRefs.plot.id)),
      );
    } else if (activeCrop.plotId) {
      registerPlotExplicit(regionIndex.plotById.get(String(activeCrop.plotId)));
    }

    const includeAreaTargets = (ids: string[], explicit = false) => {
      for (const targetId of ids) {
        const region = regionIndex.regionById.get(targetId);
        if (region) {
          addRegion(region, explicit);
          if (explicit) explicitRegionIds.add(String(region.id));
          for (const areaItem of region.subAreas || []) {
            addArea(areaItem, false);
            for (const plot of areaItem.plots || []) addPlot(plot, false);
          }
          continue;
        }

        const areaHit = regionIndex.areaById.get(targetId);
        if (areaHit) {
          addRegion(areaHit.region, false);
          addArea(areaHit.area, explicit);
          if (explicit) explicitAreaIds.add(String(areaHit.area.id));
          for (const plot of areaHit.area.plots || []) addPlot(plot, false);
          continue;
        }

        const plotHit = regionIndex.plotById.get(targetId);
        if (plotHit) {
          addRegion(plotHit.region, false);
          addArea(plotHit.area, false);
          addPlot(plotHit.plot, explicit);
          if (explicit) explicitPlotIds.add(String(plotHit.plot.id));
        }
      }
    };

    if (
      regionsMap.size === 0 &&
      areasMap.size === 0 &&
      plotsMap.size === 0 &&
      area?.targetIds?.length
    ) {
      includeAreaTargets(area.targetIds.map(String), false);
    }

    const regionsToRender = Array.from(regionsMap.values());
    const areasToRender = Array.from(areasMap.values());
    const plotsToRender = Array.from(plotsMap.values());

    const allCoordinates: Coordinate[] = [];
    for (const region of regionsToRender) {
      allCoordinates.push(...(region.region.coordinates || []));
    }
    for (const areaItem of areasToRender) {
      allCoordinates.push(...(areaItem.area.coordinates || []));
    }
    for (const plot of plotsToRender) {
      allCoordinates.push(...(plot.plot.coordinates || []));
    }
    if (activeCrop.coordinate) {
      allCoordinates.push(activeCrop.coordinate);
    }

    const bounds =
      allCoordinates.length > 0
        ? allCoordinates.map((coordinate) => [
            coordinate.lat,
            coordinate.lng,
          ] as [number, number])
        : null;

    return {
      regions: regionsToRender,
      areas: areasToRender,
      plots: plotsToRender,
      bounds,
      explicitRegionIds,
      explicitAreaIds,
      explicitPlotIds,
    };
  }, [activeCrop, area?.targetIds, regionIndex, cropGeoRefs]);

  const scopeMapBounds = scopeMapData?.bounds ?? null;

  useEffect(() => {
    const coordinates = cropGeoRefs.region?.coordinates;
    if (!coordinates || coordinates.length === 0) return;

    const targetMap = isScopeMapExpanded
      ? expandedScopeMapRef.current
      : scopeMapRef.current;
    if (!targetMap) return;

    const points = coordinates.map((coordinate) => [
      coordinate.lat,
      coordinate.lng,
    ] as [number, number]);
    const bounds =
      points.length === 1
        ? L.latLngBounds(points[0], points[0])
        : L.latLngBounds(points);
    const padding = isScopeMapExpanded ? [60, 60] : [40, 40];

    const flyToRegion = () => {
      targetMap.flyToBounds(bounds, { padding, duration: 0.9 });
    };

    const mapWithLoaded = targetMap as LeafletMapInternal;
    if (mapWithLoaded._loaded) {
      flyToRegion();
      return;
    }

    targetMap.once("load", flyToRegion);
    return () => {
      targetMap.off("load", flyToRegion);
    };
  }, [cropGeoRefs.region?.id, isScopeMapExpanded]);

  const cropMarkerIcon = useMemo(() => {
    if (!activeCrop) return undefined;
    return L.divIcon({
      className: "",
      html: `<div style="
          width:18px;
          height:18px;
          border-radius:9999px;
          background:#22c55e;
          border:2px solid #fff;
          box-shadow:0 0 10px rgba(34,197,94,0.6);
        "></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
  }, [activeCrop?.id]);

  const scopeTargetIds = useMemo(() => {
    const regionIds = new Set<string>();
    const areaIds = new Set<string>();
    const plotIds = new Set<string>();

    for (const item of scopeMapData?.regions || []) {
      regionIds.add(String(item.region.id));
    }
    for (const item of scopeMapData?.areas || []) {
      areaIds.add(String(item.area.id));
    }
    for (const item of scopeMapData?.plots || []) {
      plotIds.add(String(item.plot.id));
    }

    return { regionIds, areaIds, plotIds };
  }, [scopeMapData]);

  const baseRelevantPlans = useMemo(() => {
    const intersects = (ids: string[] | undefined, targets: Set<string>) =>
      (ids || []).some((value) => targets.has(String(value)));

    return plans.filter((plan) => {
      return (
        intersects(plan.selectedPlotIds, scopeTargetIds.plotIds) ||
        intersects(plan.selectedZoneIds, scopeTargetIds.areaIds) ||
        intersects(plan.selectedRegionIds, scopeTargetIds.regionIds)
      );
    });
  }, [plans, scopeTargetIds]);

  const relevantPlans = useMemo(() => {
    const statusRank: Record<Plan["status"], number> = {
      active: 0,
      draft: 1,
      completed: 2,
      cancelled: 3,
    };

    return baseRelevantPlans
      .filter((plan) => plan.purpose === planFilter)
      .sort((left, right) => {
        const leftRank = statusRank[left.status] ?? 99;
        const rightRank = statusRank[right.status] ?? 99;
        if (leftRank !== rightRank) return leftRank - rightRank;
        return (
          new Date(right.startDate).getTime() -
          new Date(left.startDate).getTime()
        );
      });
  }, [baseRelevantPlans, planFilter]);

  const incurredTasks = useMemo(() => {
    const incurredPlanNames = new Set(
      baseRelevantPlans
        .filter((plan) => plan.purpose === "incurred")
        .map((plan) => plan.name),
    );

    const isInScope = (task: Task) => {
      if (!task.geographicalSelections || task.geographicalSelections.length === 0) {
        return true;
      }

      return task.geographicalSelections.some((selection) => {
        return (
          scopeTargetIds.regionIds.has(String(selection.regionId)) ||
          scopeTargetIds.areaIds.has(String(selection.areaId)) ||
          scopeTargetIds.plotIds.has(String(selection.plotId))
        );
      });
    };

    return tasks.filter(
      (task) => incurredPlanNames.has(task.plan) && isInScope(task),
    );
  }, [baseRelevantPlans, tasks, scopeTargetIds]);

  useEffect(() => {
    if (!baseRelevantPlans.length) return;

    const compareKey =
      areaDetailId || (activeCrop ? String(activeCrop.id) : resolvedId) || null;

    if (prevRegionIdRef.current !== compareKey) {
      prevRegionIdRef.current = compareKey;
      const purposes: Plan["purpose"][] = [
        "cultivation",
        "treatment",
        "amendment",
        "harvest",
        "incurred",
      ];
      const firstWithData = purposes.find((purpose) =>
        baseRelevantPlans.some((plan) => plan.purpose === purpose),
      );
      if (firstWithData) setPlanFilter(firstWithData);
    }
  }, [baseRelevantPlans, areaDetailId, activeCrop, resolvedId]);

  return {
    handleBack,
    navigateToPlans,
    activeCrop,
    area,
    details,
    cropGeoRefs,
    scopedGroupedSelections: scopedGroupedSelections as ScopedGroupedSelections,
    scopedSelectionCount,
    scopeMapData,
    scopeMapBounds,
    isScopeMapExpanded,
    setIsScopeMapExpanded,
    focusScopeMapToCoordinates,
    formatFullAddress,
    cropMarkerIcon,
    regionIndex,
    scopeMapRef,
    expandedScopeMapRef,
    filteredTechnicalCrops,
    groupedCrops,
    personnel,
    selectedStaffId,
    setSelectedStaffId,
    growthCycles,
    baseRelevantPlans,
    relevantPlans,
    planFilter,
    setPlanFilter,
    incurredTasks,
    regions,
    selectedTask,
    setSelectedTask,
    isTaskDetailOpen,
    setIsTaskDetailOpen,
    openTaskDetail,
  };
}
