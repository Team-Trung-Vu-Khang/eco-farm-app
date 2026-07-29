/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as turf from "@turf/turf";
import type { Plant } from "@/pages/region-chart/constants";
import {
  makeEmptyPlant,
  type PlantEntry,
} from "@/pages/aquaculture-region/components/types";
import {
  useCultivationZones,
  useCultivationZoneById,
  regionApi,
  areaApi,
  plotApi,
} from "@/features/farm";
import { useQueries } from "@tanstack/react-query";
import { regionKeys } from "@/features/farm/hooks/useRegions";
import { areaKeys } from "@/features/farm/hooks/useAreas";
import { plotKeys } from "@/features/farm/hooks/usePlots";

const boundaryToCoords = (
  boundary?: Array<{ latitude?: number; longitude?: number } | { lat?: number; lng?: number }>,
): { lat: number; lng: number }[] => {
  if (!boundary) return [];
  return boundary
    .map((p: any) => ({
      lat: p.latitude ?? p.lat ?? 0,
      lng: p.longitude ?? p.lng ?? 0,
    }))
    .filter((c) => c.lat !== 0 || c.lng !== 0);
};

type PlantFormValues = {
  cultivationRegionId: string;
  selectedScopeIds: string[];
  plants: PlantEntry[];
};

interface UseAquacultureIdentificationFormProps {
  initialData?: Partial<Plant>;
  initialList?: Partial<Plant>[];
  onSubmit: (data: any) => void;
}

export const useAquacultureIdentificationForm = ({
  initialData,
  initialList,
  onSubmit,
}: UseAquacultureIdentificationFormProps) => {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string>("");
  const [suggestedCorrection, setSuggestedCorrection] = useState<{
    entryId: string;
    lat: number;
    lng: number;
  } | null>(null);

  const defaultPlants = useMemo<PlantEntry[]>(() => {
    if (initialData) {
      return [
        {
          entryId: initialData.id || `aq-plant-${Date.now()}`,
          speciesId: (initialData as any).speciesId || "201",
          height: initialData.height?.toString() || "",
          ageValue: initialData.ageValue?.toString() || "",
          ageUnit:
            (initialData.ageUnit as "days" | "months" | "years") || "years",
          plantedDate:
            initialData.plantedDate || new Date().toISOString().split("T")[0],
          note: initialData.note || "",
          plotId: initialData.plotId || "",
          coordinate: initialData.coordinate || { lat: 11.548, lng: 106.896 },
          isInvalidBoundary: false,
        },
      ];
    }

    if (initialList && initialList.length > 0) {
      return initialList.map((item, index) => ({
        entryId: item.id || `aq-plant-${Date.now()}-${index}`,
        speciesId: (item as any).speciesId || "201",
        height: item.height?.toString() || "",
        ageValue: item.ageValue?.toString() || "",
        ageUnit: (item.ageUnit as "days" | "months" | "years") || "years",
        plantedDate: item.plantedDate || new Date().toISOString().split("T")[0],
        note: item.note || "",
        plotId: item.plotId || "",
        coordinate: item.coordinate || { lat: 11.548, lng: 106.896 },
        isInvalidBoundary: false,
      }));
    }

    return [makeEmptyPlant(11.548, 106.896)];
  }, [initialData, initialList]);

  // ---- Fetch Cultivation Zones from API ----
  const { items: apiCultivationRegions } = useCultivationZones({
    params: { domainCode: "AQUACULTURE" },
  });
  const filteredCultivationRegions = apiCultivationRegions;

  // Resolve default region ID on mount or load
  const defaultRegionId = useMemo(() => {
    if (initialData?.cultivationRegionId) {
      return String(initialData.cultivationRegionId);
    }
    if (apiCultivationRegions.length > 0) {
      return String(apiCultivationRegions[0].id);
    }
    return "";
  }, [apiCultivationRegions, initialData]);

  const { control, watch, setValue, getValues } = useForm<PlantFormValues>({
    defaultValues: {
      cultivationRegionId: defaultRegionId,
      selectedScopeIds: [],
      plants: defaultPlants,
    },
  });

  // Sync default values when apiCultivationRegions loads
  useEffect(() => {
    if (defaultRegionId && !getValues("cultivationRegionId")) {
      setValue("cultivationRegionId", defaultRegionId);
    }
  }, [defaultRegionId, setValue, getValues]);

  const { append, remove, update } = useFieldArray({
    control,
    name: "plants",
  });

  const cultivationRegionId = watch("cultivationRegionId");
  const selectedScopeIds = watch("selectedScopeIds");
  const plants = watch("plants");

  const selectedCultivationRegion = useMemo(() => {
    return apiCultivationRegions.find(
      (a) => String(a.id) === String(cultivationRegionId),
    );
  }, [apiCultivationRegions, cultivationRegionId]);

  // Set default scopes when region changes
  useEffect(() => {
    if (selectedCultivationRegion) {
      const scopeIds = (selectedCultivationRegion.scopes || [])
        .map((s: any) => {
          if (s.scopeType === "REGION") return String(s.region?.id ?? "");
          if (s.scopeType === "AREA") return String(s.area?.id ?? "");
          if (s.scopeType === "PLOT") return String(s.plot?.id ?? "");
          return "";
        })
        .filter(Boolean);
      setValue("selectedScopeIds", scopeIds);
    }
  }, [selectedCultivationRegion, setValue]);

  // ---- Fetch full detail of selected cultivation region ----
  const { data: cultivationRegionDetail } = useCultivationZoneById(
    Number(cultivationRegionId),
    { enabled: !!cultivationRegionId },
  );

  // Step 1: extract unique region/area/plot IDs referenced in the cultivation zone scopes
  const scopeEntityIds = useMemo(() => {
    const scopes: any[] = selectedCultivationRegion?.scopes ?? [];
    const rIds = new Set<number>();
    const aIds = new Set<number>();
    const pIds = new Set<number>();
    scopes.forEach((s) => {
      if (s.scopeType === "REGION" && s.region) rIds.add(Number(s.region.id));
      if (s.scopeType === "AREA" && s.area) {
        aIds.add(Number(s.area.id));
        if (s.area.region) rIds.add(Number(s.area.region.id));
      }
      if (s.scopeType === "PLOT" && s.plot) {
        pIds.add(Number(s.plot.id));
        if (s.plot.area) {
          aIds.add(Number(s.plot.area.id));
          if (s.plot.area.region) rIds.add(Number(s.plot.area.region.id));
        }
      }
    });
    return { regionIds: [...rIds], areaIds: [...aIds], plotIds: [...pIds] };
  }, [selectedCultivationRegion]);

  // Step 2: batch-fetch details (boundary coords) for each geo entity
  const regionDetailQueries = useQueries({
    queries: scopeEntityIds.regionIds.map((id) => ({
      queryKey: regionKeys.detail(id),
      queryFn: () => regionApi.getById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const areaDetailQueries = useQueries({
    queries: scopeEntityIds.areaIds.map((id) => ({
      queryKey: areaKeys.detail(id),
      queryFn: () => areaApi.getById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const plotDetailQueries = useQueries({
    queries: scopeEntityIds.plotIds.map((id) => ({
      queryKey: plotKeys.detail(id),
      queryFn: () => plotApi.getById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })),
  });

  // Step 3: build ID-keyed lookup maps so geographicalUnits can use them
  const geoDetailMap = useMemo(() => {
    const regions: Record<string, any> = {};
    const areas: Record<string, any> = {};
    const plots: Record<string, any> = {};

    // 1. Populate from region detail responses (including nested areas and plots)
    scopeEntityIds.regionIds.forEach((id, i) => {
      const reg = regionDetailQueries[i]?.data;
      if (reg) {
        regions[String(id)] = reg;
        (reg.areas || []).forEach((sa: any) => {
          areas[String(sa.id)] = sa;
          (sa.plots || []).forEach((p: any) => {
            plots[String(p.id)] = p;
          });
        });
      }
    });

    // 2. Populate from area detail responses (including nested plots)
    scopeEntityIds.areaIds.forEach((id, i) => {
      const area = areaDetailQueries[i]?.data;
      if (area) {
        areas[String(id)] = area;
        (area.plots || []).forEach((p: any) => {
          plots[String(p.id)] = p;
        });
      }
    });

    // 3. Populate from plot detail responses
    scopeEntityIds.plotIds.forEach((id, i) => {
      const plot = plotDetailQueries[i]?.data;
      if (plot) {
        plots[String(id)] = plot;
      }
    });

    return { regions, areas, plots };
  }, [
    scopeEntityIds,
    regionDetailQueries,
    areaDetailQueries,
    plotDetailQueries,
  ]);

  // Step 4: build geographicalUnits using API boundary data
  const geographicalUnits = useMemo(() => {
    if (!selectedCultivationRegion?.scopes) return [];
    const result: {
      id: string;
      name: string;
      type: string;
      level: number;
      coordinates?: { lat: number; lng: number }[];
      parentId?: string;
    }[] = [];
    const processedIds = new Set<string>();

    const addUnit = (
      id: string,
      name: string,
      type: string,
      level: number,
      coords?: { lat: number; lng: number }[],
      parentId?: string,
    ) => {
      if (!id) return;
      const existing = result.find((u) => u.id === id);
      if (existing) {
        if (parentId && !existing.parentId) {
          existing.parentId = parentId;
        }
        return;
      }
      result.push({ id, name, type, level, coordinates: coords, parentId });
      processedIds.add(id);
    };

    selectedCultivationRegion.scopes.forEach((scope: any) => {
      if (scope.scopeType === "PLOT" && scope.plot) {
        const plot = scope.plot;
        const pId = String(plot.id);
        const plotData = geoDetailMap.plots[pId];
        const aId = plot.area ? String(plot.area.id) : undefined;
        addUnit(
          pId,
          plot.name,
          "Lô nuôi",
          1,
          boundaryToCoords(plotData?.boundary),
          aId,
        );

        if (plot.area) {
          const areaData = geoDetailMap.areas[aId!];
          const rId = plot.area.region
            ? String(plot.area.region.id)
            : undefined;
          addUnit(
            aId!,
            plot.area.name,
            "Khu vực",
            2,
            boundaryToCoords(areaData?.boundary),
            rId,
          );

          if (plot.area.region) {
            const regionData = geoDetailMap.regions[rId!];
            addUnit(
              rId!,
              plot.area.region.name,
              "Vùng nuôi trồng",
              3,
              boundaryToCoords(regionData?.boundary),
            );
          }
        }
      } else if (scope.scopeType === "AREA" && scope.area) {
        const area = scope.area;
        const aId = String(area.id);
        const areaData = geoDetailMap.areas[aId];
        const rId = area.region ? String(area.region.id) : undefined;
        addUnit(
          aId,
          area.name,
          "Khu vực",
          2,
          boundaryToCoords(areaData?.boundary),
          rId,
        );

        // Child plots — from area detail response
        (areaData?.plots ?? []).forEach((p: any) => {
          addUnit(
            String(p.id),
            p.name,
            "Lô nuôi",
            1,
            boundaryToCoords(p.boundary),
            aId,
          );
        });

        if (area.region) {
          const regionData = geoDetailMap.regions[rId!];
          addUnit(
            rId!,
            area.region.name,
            "Vùng nuôi trồng",
            3,
            boundaryToCoords(regionData?.boundary),
          );
        }
      } else if (scope.scopeType === "REGION" && scope.region) {
        const reg = scope.region;
        const rId = String(reg.id);
        const regionData = geoDetailMap.regions[rId];
        addUnit(
          rId,
          reg.name,
          "Vùng nuôi trồng",
          3,
          boundaryToCoords(regionData?.boundary),
        );

        // Child areas & plots — from region detail response
        (regionData?.areas ?? []).forEach((sa: any) => {
          const saId = String(sa.id);
          addUnit(
            saId,
            sa.name,
            "Khu vực",
            2,
            boundaryToCoords(sa.boundary),
            rId,
          );
          (sa.plots ?? []).forEach((p: any) => {
            addUnit(
              String(p.id),
              p.name,
              "Lô nuôi",
              1,
              boundaryToCoords(p.boundary),
              saId,
            );
          });
        });
      }
    });

    return result;
  }, [selectedCultivationRegion, geoDetailMap]);

  const { areasByRegion, plotsByArea } = useMemo(() => {
    const scopes: any[] = selectedCultivationRegion?.scopes ?? [];
    const abr: Record<string, any[]> = {};
    const pba: Record<string, any[]> = {};

    scopes.forEach((scope: any) => {
      if (scope.scopeType === "AREA" && scope.area) {
        const rId = String(scope.area.region?.id ?? "");
        if (rId) {
          if (!abr[rId]) abr[rId] = [];
          if (!abr[rId].some((a) => a.id === String(scope.area.id))) {
            abr[rId].push({
              id: String(scope.area.id),
              name: scope.area.name,
              level: 2,
              type: "Khu vực",
            });
          }
        }
      } else if (scope.scopeType === "PLOT" && scope.plot) {
        const area = scope.plot.area;
        if (area) {
          const aId = String(area.id);
          const rId = String(area.region?.id ?? "");
          if (!pba[aId]) pba[aId] = [];
          if (!pba[aId].some((p) => p.id === String(scope.plot.id))) {
            pba[aId].push({
              id: String(scope.plot.id),
              name: scope.plot.name,
              level: 1,
              type: "Lô nuôi",
            });
          }
          if (rId) {
            if (!abr[rId]) abr[rId] = [];
            if (!abr[rId].some((a) => a.id === aId)) {
              abr[rId].push({
                id: aId,
                name: area.name,
                level: 2,
                type: "Khu vực",
              });
            }
          }
        }
      } else if (scope.scopeType === "REGION" && scope.region) {
        const rId = String(scope.region.id);
        const regionData = geoDetailMap.regions[rId];
        if (regionData) {
          (regionData.areas ?? []).forEach((sa: any) => {
            const aId = String(sa.id);
            if (!abr[rId]) abr[rId] = [];
            if (!abr[rId].some((a) => a.id === aId)) {
              abr[rId].push({
                id: aId,
                name: sa.name,
                level: 2,
                type: "Khu vực",
              });
            }
            (sa.plots ?? []).forEach((p: any) => {
              const pId = String(p.id);
              if (!pba[aId]) pba[aId] = [];
              if (!pba[aId].some((item) => item.id === pId)) {
                pba[aId].push({
                  id: pId,
                  name: p.name,
                  level: 1,
                  type: "Lô nuôi",
                });
              }
            });
          });
        }
      }
    });

    return { areasByRegion: abr, plotsByArea: pba };
  }, [selectedCultivationRegion, geoDetailMap]);

  const scopedGeographicalUnits = useMemo(() => {
    if (!selectedScopeIds || selectedScopeIds.length === 0)
      return geographicalUnits;
    const scopes: any[] = selectedCultivationRegion?.scopes ?? [];

    const plotsByAreaId: Record<string, string[]> = {};
    const plotsByRegionId: Record<string, string[]> = {};
    const areasByRegionId: Record<string, string[]> = {};

    scopes.forEach((s) => {
      if (s.scopeType === "PLOT" && s.plot?.area) {
        const pId = String(s.plot.id);
        const aId = String(s.plot.area.id);
        const rId = s.plot.area.region ? String(s.plot.area.region.id) : null;

        if (!plotsByAreaId[aId]) plotsByAreaId[aId] = [];
        if (!plotsByAreaId[aId].includes(pId)) plotsByAreaId[aId].push(pId);
        if (rId) {
          if (!plotsByRegionId[rId]) plotsByRegionId[rId] = [];
          if (!plotsByRegionId[rId].includes(pId))
            plotsByRegionId[rId].push(pId);
          if (!areasByRegionId[rId]) areasByRegionId[rId] = [];
          if (!areasByRegionId[rId].includes(aId))
            areasByRegionId[rId].push(aId);
        }
      } else if (s.scopeType === "AREA" && s.area?.region) {
        const rId = String(s.area.region.id);
        const aId = String(s.area.id);
        if (!areasByRegionId[rId]) areasByRegionId[rId] = [];
        if (!areasByRegionId[rId].includes(aId)) areasByRegionId[rId].push(aId);
        // include plots under the area from geographicalUnits
        geographicalUnits
          .filter((u) => u.level === 1)
          .forEach((u) => {
            const pId = u.id;
            const plotData = geoDetailMap.plots[pId];
            if (plotData?.area && String(plotData.area.id) === aId) {
              if (!plotsByAreaId[aId]) plotsByAreaId[aId] = [];
              if (!plotsByAreaId[aId].includes(pId))
                plotsByAreaId[aId].push(pId);
              if (!plotsByRegionId[rId]) plotsByRegionId[rId] = [];
              if (!plotsByRegionId[rId].includes(pId))
                plotsByRegionId[rId].push(pId);
            }
          });
      } else if (s.scopeType === "REGION" && s.region) {
        const rId = String(s.region.id);
        const regionData = geoDetailMap.regions[rId];
        if (regionData) {
          (regionData.areas ?? []).forEach((sa: any) => {
            const aId = String(sa.id);
            if (!areasByRegionId[rId]) areasByRegionId[rId] = [];
            if (!areasByRegionId[rId].includes(aId))
              areasByRegionId[rId].push(aId);
            (sa.plots ?? []).forEach((p: any) => {
              const pId = String(p.id);
              if (!plotsByAreaId[aId]) plotsByAreaId[aId] = [];
              if (!plotsByAreaId[aId].includes(pId))
                plotsByAreaId[aId].push(pId);
              if (!plotsByRegionId[rId]) plotsByRegionId[rId] = [];
              if (!plotsByRegionId[rId].includes(pId))
                plotsByRegionId[rId].push(pId);
            });
          });
        }
      }
    });

    const resultIds = new Set<string>();
    selectedScopeIds.forEach((id) => {
      resultIds.add(id);
      if (plotsByAreaId[id]) {
        plotsByAreaId[id].forEach((pid) => resultIds.add(pid));
      }
      if (plotsByRegionId[id]) {
        plotsByRegionId[id].forEach((pid) => resultIds.add(pid));
      }
      if (areasByRegionId[id]) {
        areasByRegionId[id].forEach((aid) => {
          resultIds.add(aid);
          if (plotsByAreaId[aid]) {
            plotsByAreaId[aid].forEach((pid) => resultIds.add(pid));
          }
        });
      }
    });

    return geographicalUnits.filter((u) => resultIds.has(u.id));
  }, [geographicalUnits, selectedScopeIds, selectedCultivationRegion]);

  // Smallest units for map rendering (only Plot if exists, else Area, else Region)
  const smallestUnits = useMemo(() => {
    const hasPlots = geographicalUnits.some((u) => u.level === 1);
    const hasAreas = geographicalUnits.some((u) => u.level === 2);

    if (hasPlots) return geographicalUnits.filter((u) => u.level === 1);
    if (hasAreas) return geographicalUnits.filter((u) => u.level === 2);
    return geographicalUnits;
  }, [geographicalUnits]);

  const findGeographicalUnit = (lat: number, lng: number) => {
    const pt = turf.point([lng, lat]);

    const sortedUnits = geographicalUnits
      .filter((u) => selectedScopeIds.includes(u.id))
      .sort((a, b) => a.level - b.level);

    for (const unit of sortedUnits) {
      if (!unit.coordinates || unit.coordinates.length < 3) continue;
      try {
        const polyCoords = [
          ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
          [unit.coordinates[0].lng, unit.coordinates[0].lat],
        ];
        const poly = turf.polygon([polyCoords]);
        if (turf.booleanPointInPolygon(pt, poly)) {
          return unit;
        }
      } catch {
        // skip errors
      }
    }
    return null;
  };

  // Resolve effective active entry
  const effectiveActiveId = activeEntryId || plants[0]?.entryId || "";

  // ---- Default map center ----
  const mapCenter = useMemo(() => {
    const withCoord = plants.find((p) => p.plotId);
    if (withCoord)
      return [withCoord.coordinate.lat, withCoord.coordinate.lng] as [
        number,
        number,
      ];

    const unitsWithCoords = smallestUnits.filter(
      (u) => u.coordinates && u.coordinates.length >= 3,
    );
    if (unitsWithCoords.length > 0) {
      const allCoords = unitsWithCoords.flatMap((u) => u.coordinates ?? []) as {
        lat: number;
        lng: number;
      }[];
      if (allCoords.length > 0) {
        const avgLat =
          allCoords.reduce((s, c) => s + c.lat, 0) / allCoords.length;
        const avgLng =
          allCoords.reduce((s, c) => s + c.lng, 0) / allCoords.length;
        return [avgLat, avgLng] as [number, number];
      }
    }

    return [11.548, 106.896] as [number, number];
  }, [plants, smallestUnits]);

  const setCultivationRegionId = (id: string) => {
    setValue("cultivationRegionId", id);
    setValue("selectedScopeIds", []);
  };

  const setSelectedScopeIds = (ids: string[]) => {
    setValue("selectedScopeIds", ids);
  };

  const setPlants = (action: any) => {
    const currentPlants = getValues("plants");
    const nextPlants =
      typeof action === "function" ? action(currentPlants) : action;
    setValue("plants", nextPlants);
  };

  const updatePlant = (entryId: string, partial: Partial<PlantEntry>) => {
    const currentPlants = getValues("plants");
    const idx = currentPlants.findIndex((p) => p.entryId === entryId);
    if (idx !== -1) {
      update(idx, { ...currentPlants[idx], ...partial } as any);
    }
  };

  const removePlant = (entryId: string) => {
    const currentPlants = getValues("plants");
    const idx = currentPlants.findIndex((p) => p.entryId === entryId);
    if (idx !== -1) {
      remove(idx);
    }
  };

  const addPlant = () => {
    append({
      entryId: `plant-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      speciesId: "201",
      height: "",
      ageValue: "",
      ageUnit: "years",
      plantedDate: new Date().toISOString().split("T")[0],
      note: "",
      plotId: "",
      coordinate: { lat: 11.548, lng: 106.896 },
      isInvalidBoundary: false,
    });
  };

  const validateAndSnapToUnit = (
    plantEntryId: string,
    lat: number,
    lng: number,
  ) => {
    const unit = findGeographicalUnit(lat, lng);

    if (unit) {
      setSuggestedCorrection(null);
      updatePlant(plantEntryId, {
        plotId: unit.id,
        coordinate: { lat, lng },
        isInvalidBoundary: false,
      });
    } else {
      let nearestSuggestion: {
        lat: number;
        lng: number;
        entryId: string;
      } | null = null;
      let minDistance = Infinity;

      geographicalUnits
        .filter((u) => selectedScopeIds.includes(u.id))
        .forEach((u) => {
          if (!u.coordinates || u.coordinates.length < 3) return;
          try {
            const pt = turf.point([lng, lat]);
            const polyCoords = [
              ...u.coordinates.map((c: any) => [c.lng, c.lat]),
              [u.coordinates[0].lng, u.coordinates[0].lat],
            ];
            const poly = turf.polygon([polyCoords]);
            const line = turf.polygonToLine(poly);
            const snapped = turf.nearestPointOnLine(line as any, pt);

            const distance = turf.distance(pt, snapped);
            if (distance < minDistance) {
              minDistance = distance;
              const [snapLng, snapLat] = snapped.geometry.coordinates;
              nearestSuggestion = {
                entryId: plantEntryId,
                lat: snapLat,
                lng: snapLng,
              };
            }
          } catch {
            // ignore
          }
        });

      if (nearestSuggestion) {
        setSuggestedCorrection(nearestSuggestion);
      }

      updatePlant(plantEntryId, {
        coordinate: { lat, lng },
        isInvalidBoundary: true,
      });
    }
  };

  const handleAutoAssign = (
    entryId: string,
    _plotId: string,
    lat: number,
    lng: number,
  ) => {
    validateAndSnapToUnit(entryId, lat, lng);
  };

  // ---- Submit: one plant per entry ----
  const resolveLocationNames = (targetId: string) => {
    let plotName = "";
    let areaName = "";
    let regionName = "";

    const scopes = selectedCultivationRegion?.scopes ?? [];

    for (const s of scopes) {
      if (s.scopeType === "PLOT" && s.plot && String(s.plot.id) === targetId) {
        plotName = s.plot.name || "";
        areaName = s.plot.area?.name || "";
        regionName = s.plot.area?.region?.name || "";
        return { plotName, areaName, regionName, scopeType: "PLOT" as const };
      }
      if (s.scopeType === "AREA" && s.area && String(s.area.id) === targetId) {
        areaName = s.area.name || "";
        regionName = s.area.region?.name || "";
        return { plotName, areaName, regionName, scopeType: "AREA" as const };
      }
      if (
        s.scopeType === "REGION" &&
        s.region &&
        String(s.region.id) === targetId
      ) {
        regionName = s.region.name || "";
        return { plotName, areaName, regionName, scopeType: "REGION" as const };
      }
    }

    const plotData = geoDetailMap.plots[targetId];
    if (plotData) {
      plotName = plotData.name || "";
      areaName = plotData.area?.name || "";
      regionName = plotData.area?.region?.name || "";
      return { plotName, areaName, regionName, scopeType: "PLOT" as const };
    }

    const areaData = geoDetailMap.areas[targetId];
    if (areaData) {
      areaName = areaData.name || "";
      regionName = areaData.region?.name || "";
      return { plotName, areaName, regionName, scopeType: "AREA" as const };
    }

    const regionData = geoDetailMap.regions[targetId];
    if (regionData) {
      regionName = regionData.name || "";
      return { plotName, areaName, regionName, scopeType: "REGION" as const };
    }

    return { plotName, areaName, regionName, scopeType: "REGION" as const };
  };

  const handleComplete = () => {
    const data = getValues("plants");
    const mapped = data.map((p) => {
      const { plotName, areaName, regionName, scopeType } = resolveLocationNames(
        p.plotId,
      );
      return {
        ...p,
        plotName,
        areaName,
        regionName,
        scopeType,
        cultivationRegionId,
      };
    });
    onSubmit(mapped);
  };

  const handleImport = (importedPlants: any[]) => {
    const newPlants = importedPlants.map((item, index) => {
      const coord = item.coordinate || { lat: 11.548, lng: 106.896 };
      let autoPlotId = item.plotId || "";
      let invalid = false;

      if (!autoPlotId) {
        const unit = findGeographicalUnit(coord.lat, coord.lng);
        if (unit) {
          autoPlotId = unit.id;
        } else {
          // snap to closest if selectedScopeIds exists
          let minDistance = Infinity;
          for (const unit of geographicalUnits) {
            if (!selectedScopeIds.includes(unit.id)) continue;
            if (!unit.coordinates || unit.coordinates.length < 3) continue;
            try {
              const pt = turf.point([coord.lng, coord.lat]);
              const polyCoords = [
                ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
                [unit.coordinates[0].lng, unit.coordinates[0].lat],
              ];
              const poly = turf.polygon([polyCoords]);
              if (turf.booleanPointInPolygon(pt, poly)) {
                autoPlotId = unit.id;
                invalid = false;
                break;
              }
            } catch {
              // skip invalid polygon
            }
          }
        }
      } else {
        const unitExists = geographicalUnits.some(
          (u) => u.id === autoPlotId && selectedScopeIds.includes(u.id),
        );
        invalid = !unitExists;
      }

      return {
        entryId: `plant-import-${Date.now()}-${index}`,
        speciesId: item.speciesId || "201",
        height: item.height?.toString() || "",
        ageValue: item.ageValue?.toString() || "",
        ageUnit: item.ageUnit || "years",
        plantedDate: item.plantedDate || new Date().toISOString().split("T")[0],
        note: item.note || "",
        plotId: autoPlotId,
        coordinate: coord,
        isInvalidBoundary: invalid,
      };
    });

    setPlants((prev: any[]) => {
      if (
        prev.length === 1 &&
        !prev[0].height &&
        !prev[0].ageValue &&
        !prev[0].plotId
      ) {
        return newPlants;
      }
      return [...prev, ...newPlants];
    });
  };

  // ---- Derive managers, methods, crops from detail API response ----
  const managers: any[] = useMemo(
    () => cultivationRegionDetail?.personnel ?? [],
    [cultivationRegionDetail],
  );

  const farmingMethod = useMemo(
    () =>
      cultivationRegionDetail?.productionMethod ||
      cultivationRegionDetail?.farmingMethod,
    [cultivationRegionDetail],
  );

  const irrigationMethod = useMemo(
    () =>
      cultivationRegionDetail?.rearingMethod ||
      cultivationRegionDetail?.irrigationSystem,
    [cultivationRegionDetail],
  );

  const selectedCropsData: any[] = useMemo(() => {
    const list =
      cultivationRegionDetail?.subjectVariants ||
      cultivationRegionDetail?.seeds ||
      [];
    return list.map((item: any) => ({
      ...item,
      cropVarietyCode:
        item.cropVarietyCode || item.subjectVariantCode || item.varietyCode,
      cropVarietyName:
        item.cropVarietyName || item.subjectVariantName || item.varietyName,
      cropName: item.cropName || item.productionSubjectName || item.crop,
    }));
  }, [cultivationRegionDetail]);

  const handleSetActiveEntry = (id: string) => {
    setActiveEntryId(id);
    setTimeout(() => {
      const element = document.getElementById(`plant-item-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
  };

  return {
    isImportOpen,
    setIsImportOpen,
    isMapExpanded,
    setIsMapExpanded,
    effectiveActiveId,
    suggestedCorrection,
    setSuggestedCorrection,
    cultivationRegionId,
    selectedScopeIds,
    plants,
    setCultivationRegionId,
    setSelectedScopeIds,
    setPlants,
    addPlant,
    removePlant,
    updatePlant,
    handleSetActiveEntry,
    validateAndSnapToUnit,
    handleAutoAssign,
    handleComplete,
    handleImport,
    mapCenter,
    selectedCultivationRegion,
    geographicalUnits,
    scopedGeographicalUnits,
    managers,
    farmingMethod,
    irrigationMethod,
    selectedCropsData,
    filteredCultivationRegions,
    findGeographicalUnit,
    areasByRegion,
    plotsByArea,
  };
};
