/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as turf from "@turf/turf";
import { useMemo, useState, useEffect } from "react";
import usePlantStore from "../../../../stores/usePlantStore";
import { type Plant } from "../../../region-chart/constants";
import { type PlantEntry, makeEmptyPlant } from "../components/types";
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

/** Convert API boundary (latitude/longitude) → map coords ({lat,lng}) */
function boundaryToCoords(
  boundary?: Array<{ latitude?: number; longitude?: number }>,
): { lat: number; lng: number }[] {
  if (!boundary) return [];
  return boundary
    .map((p) => ({ lat: p.latitude ?? 0, lng: p.longitude ?? 0 }))
    .filter((c) => c.lat !== 0 || c.lng !== 0);
}

export const plantEntrySchema = z.object({
  entryId: z.string(),
  height: z.string().optional(),
  ageValue: z.string().optional(),
  ageUnit: z.enum(["days", "months", "years"]),
  plantedDate: z.string(),
  note: z.string().optional(),
  plotId: z.string().min(1, "Vui lòng chọn vị trí canh tác cho cây trồng"),
  coordinate: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  isInvalidBoundary: z.boolean().optional(),
});

export const plantFormSchema = z.object({
  cultivationRegionId: z.string().min(1, "Vui lòng chọn vùng canh tác"),
  selectedScopeIds: z
    .array(z.string())
    .min(1, "Vui lòng chọn ít nhất một phạm vi"),
  plants: z
    .array(plantEntrySchema)
    .min(1, "Vui lòng thêm ít nhất một cây trồng"),
});

export type PlantFormValues = z.infer<typeof plantFormSchema>;

interface UsePlantIdentificationFormProps {
  initialData?: Partial<Plant>;
  initialList?: Partial<Plant>[];
  onSubmit: (data: any) => void;
}

export const usePlantIdentificationForm = ({
  initialData,
  initialList,
  onSubmit,
}: UsePlantIdentificationFormProps) => {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string>("");
  const [suggestedCorrection, setSuggestedCorrection] = useState<{
    entryId: string;
    lat: number;
    lng: number;
  } | null>(null);

  // ---- Default values ----
  const defaultPlants = useMemo<PlantEntry[]>(() => {
    if (initialData) {
      return [
        {
          entryId: initialData.id || `plant-${Date.now()}`,
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
        entryId: item.id || `plant-${Date.now()}-${index}`,
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
    return [makeEmptyPlant()];
  }, [initialData, initialList]);

  const defaultScopeIds = useMemo<string[]>(() => {
    if (initialData?.plotId) return [initialData.plotId];
    if (initialList && initialList.length > 0) {
      const ids = initialList.map((p) => p.plotId).filter(Boolean) as string[];
      return Array.from(new Set(ids));
    }
    return [];
  }, [initialData, initialList]);

  // ---- React Hook Form Setup ----
  const { control, watch, setValue, getValues } = useForm<PlantFormValues>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      cultivationRegionId: initialData?.cultivationRegionId || "",
      selectedScopeIds: defaultScopeIds,
      plants: defaultPlants,
    },
  });

  const { append, remove, update } = useFieldArray({
    control,
    name: "plants",
  });

  const cultivationRegionId = watch("cultivationRegionId");
  const selectedScopeIds = watch("selectedScopeIds");
  const plants = watch("plants");

  const setCultivationRegionId = (id: string) =>
    setValue("cultivationRegionId", id);
  const setSelectedScopeIds = (ids: string[]) =>
    setValue("selectedScopeIds", ids);

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
      update(idx, { ...currentPlants[idx], ...partial });
    }
  };

  const removePlant = (entryId: string) => {
    const currentPlants = getValues("plants");
    const idx = currentPlants.findIndex((p) => p.entryId === entryId);
    if (idx !== -1) {
      remove(idx);
    }
  };

  // ---- Fetch Cultivation Zones from API ----
  const { items: apiCultivationRegions } = useCultivationZones();
  const filteredCultivationRegions = apiCultivationRegions;

  const selectedCultivationRegion = useMemo(() => {
    return apiCultivationRegions.find(
      (a) => String(a.id) === String(cultivationRegionId),
    );
  }, [apiCultivationRegions, cultivationRegionId]);

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
    scopeEntityIds.regionIds.forEach((id, i) => {
      if (regionDetailQueries[i]?.data)
        regions[String(id)] = regionDetailQueries[i].data;
    });
    scopeEntityIds.areaIds.forEach((id, i) => {
      if (areaDetailQueries[i]?.data)
        areas[String(id)] = areaDetailQueries[i].data;
    });
    scopeEntityIds.plotIds.forEach((id, i) => {
      if (plotDetailQueries[i]?.data)
        plots[String(id)] = plotDetailQueries[i].data;
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
    }[] = [];
    const processedIds = new Set<string>();

    const addUnit = (
      id: string,
      name: string,
      type: string,
      level: number,
      coords?: { lat: number; lng: number }[],
    ) => {
      if (!id || processedIds.has(id)) return;
      result.push({ id, name, type, level, coordinates: coords });
      processedIds.add(id);
    };

    selectedCultivationRegion.scopes.forEach((scope: any) => {
      if (scope.scopeType === "PLOT" && scope.plot) {
        const plot = scope.plot;
        const pId = String(plot.id);
        const plotData = geoDetailMap.plots[pId];
        addUnit(
          pId,
          plot.name,
          "Lô trồng",
          1,
          boundaryToCoords(plotData?.boundary),
        );

        if (plot.area) {
          const aId = String(plot.area.id);
          const areaData = geoDetailMap.areas[aId];
          addUnit(
            aId,
            plot.area.name,
            "Khu vực",
            2,
            boundaryToCoords(areaData?.boundary),
          );

          if (plot.area.region) {
            const rId = String(plot.area.region.id);
            const regionData = geoDetailMap.regions[rId];
            addUnit(
              rId,
              plot.area.region.name,
              "Vùng trồng",
              3,
              boundaryToCoords(regionData?.boundary),
            );
          }
        }
      } else if (scope.scopeType === "AREA" && scope.area) {
        const area = scope.area;
        const aId = String(area.id);
        const areaData = geoDetailMap.areas[aId];
        addUnit(
          aId,
          area.name,
          "Khu vực",
          2,
          boundaryToCoords(areaData?.boundary),
        );

        // Child plots — from area detail response
        (areaData?.plots ?? []).forEach((p: any) => {
          addUnit(
            String(p.id),
            p.name,
            "Lô trồng",
            1,
            boundaryToCoords(p.boundary),
          );
        });

        if (area.region) {
          const rId = String(area.region.id);
          const regionData = geoDetailMap.regions[rId];
          addUnit(
            rId,
            area.region.name,
            "Vùng trồng",
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
          "Vùng trồng",
          3,
          boundaryToCoords(regionData?.boundary),
        );

        // Child areas & plots — from region detail response
        (regionData?.areas ?? []).forEach((sa: any) => {
          addUnit(
            String(sa.id),
            sa.name,
            "Khu vực",
            2,
            boundaryToCoords(sa.boundary),
          );
          (sa.plots ?? []).forEach((p: any) => {
            addUnit(
              String(p.id),
              p.name,
              "Lô trồng",
              1,
              boundaryToCoords(p.boundary),
            );
          });
        });
      }
    });

    return result;
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
            if (!plotsByAreaId[aId]) plotsByAreaId[aId] = [];
            if (!plotsByAreaId[aId].includes(u.id))
              plotsByAreaId[aId].push(u.id);
          });
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

  // ---- Auto-validate and snap on geographicalUnits / selectedScopeIds load ----
  useEffect(() => {
    if (geographicalUnits.length === 0) return;

    let changed = false;
    const currentPlants = getValues("plants") || [];
    const updatedPlants = currentPlants.map((p) => {
      const unit = findGeographicalUnit(p.coordinate.lat, p.coordinate.lng);
      if (unit) {
        if (!p.plotId || p.plotId !== unit.id || p.isInvalidBoundary) {
          changed = true;
          return { ...p, plotId: unit.id, isInvalidBoundary: false };
        }
      } else {
        if (!p.isInvalidBoundary) {
          changed = true;
          return { ...p, isInvalidBoundary: true };
        }
      }
      return p;
    });

    if (changed) {
      setValue("plants", updatedPlants);
    }
  }, [geographicalUnits, selectedScopeIds]);

  // ---- Derive managers, methods, crops from detail API response ----
  const managers: any[] = useMemo(
    () => cultivationRegionDetail?.personnel ?? [],
    [cultivationRegionDetail],
  );

  const farmingMethod = useMemo(
    () => cultivationRegionDetail?.farmingMethod,
    [cultivationRegionDetail],
  );

  const irrigationMethod = useMemo(
    () => cultivationRegionDetail?.irrigationSystem,
    [cultivationRegionDetail],
  );

  const selectedCropsData: any[] = useMemo(
    () => cultivationRegionDetail?.seeds ?? [],
    [cultivationRegionDetail],
  );

  const handleSetActiveEntry = (id: string) => {
    setActiveEntryId(id);
    setTimeout(() => {
      const element = document.getElementById(`plant-item-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
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

  const addPlant = () => {
    let [lat, lng] = mapCenter;

    const currentPlants = getValues("plants") || [];
    const isCoordinateTaken = (l: number, g: number) => {
      return currentPlants.some(
        (p) =>
          Math.abs(p.coordinate.lat - l) < 0.00002 &&
          Math.abs(p.coordinate.lng - g) < 0.00002,
      );
    };

    let attempts = 0;
    const offsetStep = 0.00004;
    while (isCoordinateTaken(lat, lng) && attempts < 100) {
      attempts++;
      const angle = attempts * 0.5 * Math.PI;
      const radius = offsetStep * (1 + attempts * 0.1);
      lat = mapCenter[0] + radius * Math.sin(angle);
      lng = mapCenter[1] + radius * Math.cos(angle);
    }

    const unit = findGeographicalUnit(lat, lng);
    append({
      entryId: `plant-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      height: "",
      ageValue: "",
      ageUnit: "years",
      plantedDate: new Date().toISOString().split("T")[0],
      note: "",
      plotId: unit ? unit.id : "",
      coordinate: { lat, lng },
      isInvalidBoundary: false,
    });
  };

  // ---- Boundary validation helper ----
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

    return {
      plotName,
      areaName,
      regionName: selectedCultivationRegion?.name || "",
      scopeType: "REGION" as const,
    };
  };

  const handleComplete = () => {
    const nextPlantCode = (index: number) => {
      if (initialData?.code) return initialData.code;

      const maxNumericCode = usePlantStore
        .getState()
        .plants.map((item) => item.code || "")
        .map((code) => code.match(/^(?:PL-|PLANT-)?(\d+)$/i)?.[1])
        .filter(Boolean)
        .map((value) => Number(value))
        .filter((value) => !Number.isNaN(value))
        .reduce((max, current) => Math.max(max, current), 0);

      return `PL-${String(maxNumericCode + index + 1).padStart(3, "0")}`;
    };

    const newPlantArr = plants.map((p, index) => {
      const { plotName, areaName, regionName, scopeType } =
        resolveLocationNames(p.plotId);

      const generatedCode = nextPlantCode(index);

      return {
        ...initialData,
        code: generatedCode,
        name: initialData?.name || plotName || `Cây trồng ${generatedCode}`,
        type: initialData?.type || "Cây trồng",
        status: initialData?.status || "healthy",
        height: p.height,
        enterpriseId: undefined,
        ageValue: p.ageValue,
        ageUnit: p.ageUnit,
        age: p.ageValue
          ? `${p.ageValue} ${p.ageUnit === "years" ? "năm" : p.ageUnit === "months" ? "tháng" : "ngày"}`
          : undefined,
        plantedDate: p.plantedDate,
        note: p.note,
        plotId: p.plotId,
        scopeType,
        cultivationRegionId,
        regionName,
        areaName,
        coordinate: p.coordinate,
        id:
          initialData?.id ||
          `pl-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      } as any;
    });

    if (initialData) {
      onSubmit(newPlantArr[0]);
    } else {
      onSubmit(newPlantArr);
    }
  };

  const handleImport = (importedList: any[]) => {
    if (importedList.length === 0) return;
    const newPlants: PlantEntry[] = importedList.map((item, index) => {
      const coord = item.coordinate || { lat: 11.548, lng: 106.896 };
      let autoPlotId = item.plotId || "";
      let invalid = true;

      if (!autoPlotId) {
        const pt = turf.point([coord.lng, coord.lat]);
        const sortedUnits = geographicalUnits
          .filter((u) => selectedScopeIds.includes(u.id))
          .sort((a, b) => a.level - b.level);

        for (const unit of sortedUnits) {
          if (unit.coordinates && unit.coordinates.length >= 3) {
            try {
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
        const unitExists = geographicalUnits.some((u) => u.id === autoPlotId && selectedScopeIds.includes(u.id));
        invalid = !unitExists;
      }

      return {
        entryId: `plant-import-${Date.now()}-${index}`,
        height: item.height?.toString() || "",
        ageValue: item.ageValue?.toString() || "",
        ageUnit: item.ageUnit || "years",
        plantedDate:
          item.plantedDate || new Date().toISOString().split("T")[0],
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
  };
};
