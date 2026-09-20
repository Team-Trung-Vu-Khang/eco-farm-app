import {
  areaApi,
  plotApi,
  regionApi,
  useCultivationZoneById,
  useCultivationZones,
} from "@/features/farm";
import { areaKeys } from "@/features/farm/hooks/useAreas";
import { plotKeys } from "@/features/farm/hooks/usePlots";
import { regionKeys } from "@/features/farm/hooks/useRegions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries } from "@tanstack/react-query";
import * as turf from "@turf/turf";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { type Plant } from "../../../region-chart/constants";
import { type PlantEntry, makeEmptyPlant } from "../components/types";

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
  // API yêu cầu ít nhất một trong Giống cây / Hạt giống, thiếu sẽ trả 400
  varietyId: z.string().min(1, "Vui lòng chọn giống cây hoặc hạt giống"),
  variantKind: z.enum(["production", "subject"]).optional(),
  healthStatus: z
    .enum(["HEALTHY", "PEST", "HARVESTED", "TREATING", "DEAD"])
    .optional(),
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
  const [radius, setRadius] = useState<number>(100);

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
          varietyId: (initialData as any).varietyId || "",
          variantKind: (initialData as any).variantKind || undefined,
          healthStatus: (initialData as any).healthStatus || undefined,
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
        varietyId: (item as any).varietyId || "",
        variantKind: (item as any).variantKind || undefined,
        healthStatus: (item as any).healthStatus || undefined,
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
  const { items: apiCultivationRegions, loading: isLoadingCultivationRegions } =
    useCultivationZones({
      params: { domainCode: "CROP" },
    });
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
  // Step 1: Collect region IDs referenced in cultivation zone scopes
  const regionIds = useMemo(() => {
    const scopes: any[] = selectedCultivationRegion?.scopes ?? [];
    const rIds = new Set<number>();
    scopes.forEach((s) => {
      if (s.scopeType === "REGION" && s.region?.id) {
        rIds.add(Number(s.region.id));
      }
      if (s.scopeType === "AREA" && s.area?.region?.id) {
        rIds.add(Number(s.area.region.id));
      }
      if (s.scopeType === "PLOT" && s.plot?.area?.region?.id) {
        rIds.add(Number(s.plot.area.region.id));
      }
    });
    return Array.from(rIds);
  }, [selectedCultivationRegion]);

  // Execute Region Detail API queries
  const regionDetailQueries = useQueries({
    queries: regionIds.map((id) => ({
      queryKey: regionKeys.detail(id),
      queryFn: () => regionApi.getById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })),
  });

  // Step 2: Collect Area IDs from scopes AND from Region Detail API responses
  const areaIds = useMemo(() => {
    const aIds = new Set<number>();

    const scopes: any[] = selectedCultivationRegion?.scopes ?? [];
    scopes.forEach((s) => {
      if (s.scopeType === "AREA" && s.area?.id) {
        aIds.add(Number(s.area.id));
      }
      if (s.scopeType === "PLOT" && s.plot?.area?.id) {
        aIds.add(Number(s.plot.area.id));
      }
    });

    regionDetailQueries.forEach((q) => {
      if (q.data) {
        const subAreas = q.data.areas || q.data.productionAreas || [];
        subAreas.forEach((sa: any) => {
          if (sa.id) aIds.add(Number(sa.id));
        });
      }
    });

    return Array.from(aIds);
  }, [selectedCultivationRegion, regionDetailQueries]);

  // Execute Area Detail API queries (calls areaApi.getById for every area under the region!)
  const areaDetailQueries = useQueries({
    queries: areaIds.map((id) => ({
      queryKey: areaKeys.detail(id),
      queryFn: () => areaApi.getById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })),
  });

  // Step 3: Collect Plot IDs from scopes, Region Detail API responses AND Area Detail API responses
  const plotIds = useMemo(() => {
    const pIds = new Set<number>();

    const scopes: any[] = selectedCultivationRegion?.scopes ?? [];
    scopes.forEach((s) => {
      if (s.scopeType === "PLOT" && s.plot?.id) {
        pIds.add(Number(s.plot.id));
      }
    });

    regionDetailQueries.forEach((q) => {
      if (q.data) {
        const subAreas = q.data.areas || q.data.productionAreas || [];
        subAreas.forEach((sa: any) => {
          const subPlots = sa.plots || sa.productionUnits || [];
          subPlots.forEach((sp: any) => {
            if (sp.id) pIds.add(Number(sp.id));
          });
        });
      }
    });

    areaDetailQueries.forEach((q) => {
      if (q.data) {
        const subPlots = q.data.plots || q.data.productionUnits || [];
        subPlots.forEach((sp: any) => {
          if (sp.id) pIds.add(Number(sp.id));
        });
      }
    });

    return Array.from(pIds);
  }, [selectedCultivationRegion, regionDetailQueries, areaDetailQueries]);

  // Execute Plot Detail API queries (calls plotApi.getById for every plot under the area!)
  const plotDetailQueries = useQueries({
    queries: plotIds.map((id) => ({
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
    regionIds.forEach((id, i) => {
      const reg = regionDetailQueries[i]?.data;
      if (reg) {
        regions[String(id)] = reg;
        (reg.areas || reg.productionAreas || []).forEach((sa: any) => {
          areas[String(sa.id)] = sa;
          (sa.plots || sa.productionUnits || []).forEach((p: any) => {
            plots[String(p.id)] = p;
          });
        });
      }
    });

    // 2. Populate from area detail responses (including nested plots)
    areaIds.forEach((id, i) => {
      const area = areaDetailQueries[i]?.data;
      if (area) {
        areas[String(id)] = area;
        (area.plots || area.productionUnits || []).forEach((p: any) => {
          plots[String(p.id)] = p;
        });
      }
    });

    // 3. Populate from plot detail responses
    plotIds.forEach((id, i) => {
      const plot = plotDetailQueries[i]?.data;
      if (plot) {
        plots[String(id)] = plot;
      }
    });

    return { regions, areas, plots };
  }, [
    regionIds,
    areaIds,
    plotIds,
    regionDetailQueries,
    areaDetailQueries,
    plotDetailQueries,
  ]);

  const centerPointObj = useMemo(() => {
    let cp =
      selectedCultivationRegion?.centerPoint ||
      cultivationRegionDetail?.centerPoint;

    if (!cp && selectedCultivationRegion?.scopes) {
      for (const s of selectedCultivationRegion.scopes as any[]) {
        const entityCp =
          s.region?.centerPoint || s.area?.centerPoint || s.plot?.centerPoint;
        if (entityCp?.latitude && entityCp?.longitude) {
          cp = entityCp;
          break;
        }
      }
    }

    if (!cp && geoDetailMap) {
      for (const rId of Object.keys(geoDetailMap.regions)) {
        if (geoDetailMap.regions[rId]?.centerPoint?.latitude) {
          cp = geoDetailMap.regions[rId].centerPoint;
          break;
        }
      }
    }

    if (cp?.latitude && cp?.longitude) {
      return { lat: Number(cp.latitude), lng: Number(cp.longitude) };
    }

    // Default fallback to standard map center
    return { lat: 11.548, lng: 106.896 };
  }, [selectedCultivationRegion, cultivationRegionDetail, geoDetailMap]);

  useEffect(() => {
    const metaRadius = (selectedCultivationRegion?.metadataJson as any)?.radius;
    if (typeof metaRadius === "number" && metaRadius > 0) {
      setRadius(metaRadius);
    } else {
      setRadius(100);
    }
  }, [selectedCultivationRegion]);

  const generateCircleBoundary = (
    center: { lat: number; lng: number },
    radiusMeters: number,
  ): { lat: number; lng: number }[] => {
    if (!center.lat || !center.lng || radiusMeters <= 0) return [];
    try {
      const circlePoly = turf.circle(
        [center.lng, center.lat],
        radiusMeters / 1000,
        { steps: 64, units: "kilometers" },
      );
      return circlePoly.geometry.coordinates[0].map(([lng, lat]) => ({
        lat,
        lng,
      }));
    } catch {
      return [];
    }
  };

  // Step 4: build geographicalUnits, areasByRegion, and plotsByArea from API detail responses
  const { geographicalUnits, areasByRegion, plotsByArea } = useMemo(() => {
    if (!selectedCultivationRegion?.scopes) {
      return { geographicalUnits: [], areasByRegion: {}, plotsByArea: {} };
    }

    const unitsMap = new Map<
      string,
      {
        id: string;
        name: string;
        type: string;
        level: number;
        coordinates?: { lat: number; lng: number }[];
      }
    >();

    const abr: Record<string, any[]> = {};
    const pba: Record<string, any[]> = {};

    const resolveCoords = (
      boundary?: Array<{ latitude?: number; longitude?: number }>,
      entityCenter?: { latitude?: number; longitude?: number },
    ) => {
      const bCoords = boundaryToCoords(boundary);
      if (bCoords.length >= 3) return bCoords;
      const cPt =
        entityCenter?.latitude && entityCenter?.longitude
          ? {
              lat: Number(entityCenter.latitude),
              lng: Number(entityCenter.longitude),
            }
          : centerPointObj;
      if (cPt && radius > 0) {
        return generateCircleBoundary(cPt, radius);
      }
      return bCoords;
    };

    const addUnit = (
      id: string,
      name: string,
      type: string,
      level: number,
      coords?: { lat: number; lng: number }[],
    ) => {
      if (!id || unitsMap.has(id)) return;
      unitsMap.set(id, { id, name, type, level, coordinates: coords });
    };

    // 1. Parse from Region Detail API responses
    Object.keys(geoDetailMap.regions).forEach((rId) => {
      const reg = geoDetailMap.regions[rId];
      addUnit(
        rId,
        reg.name || `Vùng trồng #${rId}`,
        "Vùng trồng",
        3,
        resolveCoords(reg.boundary, reg.centerPoint),
      );

      const subAreas = reg.areas || reg.productionAreas || [];
      subAreas.forEach((sa: any) => {
        const aId = String(sa.id);
        if (!abr[rId]) abr[rId] = [];
        if (!abr[rId].some((item) => item.id === aId)) {
          abr[rId].push({ id: aId, name: sa.name, level: 2, type: "Khu vực" });
        }
        addUnit(
          aId,
          sa.name,
          "Khu vực",
          2,
          resolveCoords(sa.boundary, sa.centerPoint),
        );

        const subPlots = sa.plots || sa.productionUnits || [];
        subPlots.forEach((sp: any) => {
          const pId = String(sp.id);
          if (!pba[aId]) pba[aId] = [];
          if (!pba[aId].some((item) => item.id === pId)) {
            pba[aId].push({
              id: pId,
              name: sp.name,
              level: 1,
              type: "Lô trồng",
            });
          }
          addUnit(
            pId,
            sp.name,
            "Lô trồng",
            1,
            resolveCoords(sp.boundary, sp.centerPoint),
          );
        });
      });
    });

    // 2. Parse from Area Detail API responses
    Object.keys(geoDetailMap.areas).forEach((aId) => {
      const area = geoDetailMap.areas[aId];
      const rId = area.region?.id
        ? String(area.region.id)
        : area.productionRegion?.id
          ? String(area.productionRegion.id)
          : "";
      if (rId) {
        if (!abr[rId]) abr[rId] = [];
        if (!abr[rId].some((item) => item.id === aId)) {
          abr[rId].push({
            id: aId,
            name: area.name,
            level: 2,
            type: "Khu vực",
          });
        }
      }
      addUnit(
        aId,
        area.name,
        "Khu vực",
        2,
        resolveCoords(area.boundary, area.centerPoint),
      );

      const subPlots = area.plots || area.productionUnits || [];
      subPlots.forEach((sp: any) => {
        const pId = String(sp.id);
        if (!pba[aId]) pba[aId] = [];
        if (!pba[aId].some((item) => item.id === pId)) {
          pba[aId].push({ id: pId, name: sp.name, level: 1, type: "Lô trồng" });
        }
        addUnit(
          pId,
          sp.name,
          "Lô trồng",
          1,
          resolveCoords(sp.boundary, sp.centerPoint),
        );
      });
    });

    // 3. Parse from Plot Detail API responses
    Object.keys(geoDetailMap.plots).forEach((pId) => {
      const plot = geoDetailMap.plots[pId];
      const aId = plot.area?.id ? String(plot.area.id) : "";
      if (aId) {
        if (!pba[aId]) pba[aId] = [];
        if (!pba[aId].some((item) => item.id === pId)) {
          pba[aId].push({
            id: pId,
            name: plot.name,
            level: 1,
            type: "Lô trồng",
          });
        }
      }
      addUnit(
        pId,
        plot.name,
        "Lô trồng",
        1,
        resolveCoords(plot.boundary, plot.centerPoint),
      );
    });

    // 4. Parse fallback from selectedCultivationRegion.scopes
    const scopes: any[] = selectedCultivationRegion?.scopes ?? [];
    scopes.forEach((scope: any) => {
      if (scope.scopeType === "PLOT" && scope.plot) {
        const pId = String(scope.plot.id);
        addUnit(
          pId,
          scope.plot.name,
          "Lô trồng",
          1,
          resolveCoords(scope.plot.boundary, scope.plot.centerPoint),
        );
        if (scope.plot.area) {
          const aId = String(scope.plot.area.id);
          addUnit(
            aId,
            scope.plot.area.name,
            "Khu vực",
            2,
            resolveCoords(
              scope.plot.area.boundary,
              scope.plot.area.centerPoint,
            ),
          );
          if (scope.plot.area.region) {
            const rId = String(scope.plot.area.region.id);
            addUnit(
              rId,
              scope.plot.area.region.name,
              "Vùng trồng",
              3,
              resolveCoords(
                scope.plot.area.region.boundary,
                scope.plot.area.region.centerPoint,
              ),
            );
          }
        }
      } else if (scope.scopeType === "AREA" && scope.area) {
        const aId = String(scope.area.id);
        addUnit(
          aId,
          scope.area.name,
          "Khu vực",
          2,
          resolveCoords(scope.area.boundary, scope.area.centerPoint),
        );
        if (scope.area.region) {
          const rId = String(scope.area.region.id);
          addUnit(
            rId,
            scope.area.region.name,
            "Vùng trồng",
            3,
            resolveCoords(
              scope.area.region.boundary,
              scope.area.region.centerPoint,
            ),
          );
        }
      } else if (scope.scopeType === "REGION" && scope.region) {
        const rId = String(scope.region.id);
        addUnit(
          rId,
          scope.region.name,
          "Vùng trồng",
          3,
          resolveCoords(scope.region.boundary, scope.region.centerPoint),
        );
      }
    });

    return {
      geographicalUnits: Array.from(unitsMap.values()),
      areasByRegion: abr,
      plotsByArea: pba,
    };
  }, [selectedCultivationRegion, geoDetailMap, radius, centerPointObj]);

  const scopedGeographicalUnits = useMemo(() => {
    if (!selectedScopeIds || selectedScopeIds.length === 0)
      return geographicalUnits;

    const resultIds = new Set<string>();

    selectedScopeIds.forEach((id) => {
      resultIds.add(id);

      // Nếu chọn Vùng -> lấy toàn bộ Khu vực & Lô trực thuộc
      if (areasByRegion[id]) {
        areasByRegion[id].forEach((area) => {
          resultIds.add(area.id);
          if (plotsByArea[area.id]) {
            plotsByArea[area.id].forEach((plot) => resultIds.add(plot.id));
          }
        });
      }

      // Nếu chọn Khu vực -> lấy toàn bộ Lô trực thuộc
      if (plotsByArea[id]) {
        plotsByArea[id].forEach((plot) => resultIds.add(plot.id));
      }
    });

    // Thêm các đơn vị cha (Khu vực & Vùng) cho bất kỳ Lô nào có trong resultIds
    geographicalUnits.forEach((u) => {
      if (resultIds.has(u.id) && u.level === 1) {
        Object.keys(plotsByArea).forEach((aId) => {
          if (plotsByArea[aId].some((p) => p.id === u.id)) {
            resultIds.add(aId);
            Object.keys(areasByRegion).forEach((rId) => {
              if (areasByRegion[rId].some((a) => a.id === aId)) {
                resultIds.add(rId);
              }
            });
          }
        });
      }
    });

    return geographicalUnits.filter((u) => resultIds.has(u.id));
  }, [geographicalUnits, selectedScopeIds, areasByRegion, plotsByArea]);

  // Smallest units for map rendering and initial coordinates (from scopedGeographicalUnits)
  const smallestUnits = useMemo(() => {
    const units =
      scopedGeographicalUnits.length > 0
        ? scopedGeographicalUnits
        : geographicalUnits;
    const hasPlots = units.some((u) => u.level === 1);
    const hasAreas = units.some((u) => u.level === 2);

    if (hasPlots) return units.filter((u) => u.level === 1);
    if (hasAreas) return units.filter((u) => u.level === 2);
    return units;
  }, [scopedGeographicalUnits, geographicalUnits]);

  const findGeographicalUnit = (lat: number, lng: number) => {
    const pt = turf.point([lng, lat]);

    // Ưu tiên kiểm tra Lô trồng (level 1) trước, rồi đến Khu vực (level 2) và Vùng trồng (level 3)
    const sortedUnits = scopedGeographicalUnits
      .filter((u) => u.coordinates && u.coordinates.length >= 3)
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
        // skip invalid polygon
      }
    }
    return null;
  };

  const getUnitCenter = (unit: any): { lat: number; lng: number } | null => {
    if (!unit?.coordinates || unit.coordinates.length < 3) return null;
    try {
      const polyCoords = [
        ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
        [unit.coordinates[0].lng, unit.coordinates[0].lat],
      ];
      const poly = turf.polygon([polyCoords]);
      const center = turf.centerOfMass(poly);
      const [lng, lat] = center.geometry.coordinates;

      if (turf.booleanPointInPolygon(center, poly)) {
        return { lat, lng };
      }

      const avgLat =
        unit.coordinates.reduce((s: number, c: any) => s + c.lat, 0) /
        unit.coordinates.length;
      const avgLng =
        unit.coordinates.reduce((s: number, c: any) => s + c.lng, 0) /
        unit.coordinates.length;
      return { lat: avgLat, lng: avgLng };
    } catch {
      if (unit.coordinates && unit.coordinates.length > 0) {
        return { lat: unit.coordinates[0].lat, lng: unit.coordinates[0].lng };
      }
      return null;
    }
  };

  // ---- Auto-validate and snap default plant coordinate to smallest scoped unit ----
  const generateUniqueCoordinate = (
    baseCenter: [number, number],
    existingPlants: PlantEntry[],
  ) => {
    const isCoordinateTaken = (l: number, g: number) => {
      return existingPlants.some(
        (p) =>
          Math.abs(p.coordinate.lat - l) < 0.00003 &&
          Math.abs(p.coordinate.lng - g) < 0.00003,
      );
    };

    let lat = baseCenter[0];
    let lng = baseCenter[1];

    if (!isCoordinateTaken(lat, lng)) {
      const unit = findGeographicalUnit(lat, lng);
      if (unit) return { coordinate: { lat, lng }, unit };
    }

    const offsetStep = 0.00004;
    for (let attempts = 1; attempts <= 120; attempts++) {
      const angle = attempts * 0.5 * Math.PI;
      const radius = offsetStep * (1 + Math.floor(attempts / 4) * 0.5);
      const candidateLat = baseCenter[0] + radius * Math.sin(angle);
      const candidateLng = baseCenter[1] + radius * Math.cos(angle);

      if (!isCoordinateTaken(candidateLat, candidateLng)) {
        const unit = findGeographicalUnit(candidateLat, candidateLng);
        if (unit) {
          return {
            coordinate: { lat: candidateLat, lng: candidateLng },
            unit,
          };
        }
      }
    }

    const fallbackUnit = findGeographicalUnit(lat, lng);
    return { coordinate: { lat, lng }, unit: fallbackUnit };
  };

  const hasInitializedCoordsRef = useRef(false);

  useEffect(() => {
    if (smallestUnits.length === 0) return;

    const currentPlants = getValues("plants") || [];
    if (currentPlants.length === 0) return;

    let changed = false;
    const updatedPlants = currentPlants.map((p, index) => {
      const isDefaultFallback =
        Math.abs(p.coordinate.lat - 11.548) < 0.001 &&
        Math.abs(p.coordinate.lng - 106.896) < 0.001;

      const unit = findGeographicalUnit(p.coordinate.lat, p.coordinate.lng);

      if (
        isDefaultFallback &&
        (!hasInitializedCoordsRef.current || !p.plotId)
      ) {
        const targetUnit = smallestUnits.find(
          (u) => u.coordinates && u.coordinates.length >= 3,
        );
        if (targetUnit) {
          const baseCenter = getUnitCenter(targetUnit);
          if (baseCenter) {
            const { coordinate, unit: newUnit } = generateUniqueCoordinate(
              [baseCenter.lat, baseCenter.lng],
              currentPlants.slice(0, index),
            );
            changed = true;
            return {
              ...p,
              coordinate,
              plotId: newUnit ? newUnit.id : targetUnit.id,
              isInvalidBoundary: false,
            };
          }
        }
      } else if (unit) {
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
    hasInitializedCoordsRef.current = true;
  }, [smallestUnits, selectedScopeIds]);

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
    if (!cultivationRegionDetail) return [];

    const results: any[] = [];

    if (
      cultivationRegionDetail.subjectVariants &&
      cultivationRegionDetail.subjectVariants.length > 0
    ) {
      cultivationRegionDetail.subjectVariants.forEach((sv) => {
        results.push({
          ...sv,
          id: sv.id,
          cropVarietyCode: sv.subjectVariantCode,
          cropVarietyName: sv.subjectVariantName,
          cropName: sv.productionSubjectName,
          variantKind: "subject" as const,
        });
      });
    }

    if (
      cultivationRegionDetail.productionSubjectVariants &&
      cultivationRegionDetail.productionSubjectVariants.length > 0
    ) {
      cultivationRegionDetail.productionSubjectVariants.forEach((pv) => {
        results.push({
          ...pv,
          id: pv.id,
          cropVarietyCode: pv.code,
          cropVarietyName: pv.name,
          cropName: pv.name,
          variantKind: "production" as const,
        });
      });
    }

    if (
      results.length === 0 &&
      cultivationRegionDetail.seeds &&
      cultivationRegionDetail.seeds.length > 0
    ) {
      cultivationRegionDetail.seeds.forEach((s) => {
        results.push({
          ...s,
          id: s.id,
          cropVarietyCode: s.cropVarietyCode,
          cropVarietyName: s.cropVarietyName,
          cropName: s.cropName,
          variantKind: undefined,
        });
      });
    }

    return results;
  }, [cultivationRegionDetail]);

  const defaultVarietyId = useMemo(
    () => (selectedCropsData.length > 0 ? String(selectedCropsData[0].id) : ""),
    [selectedCropsData],
  );

  const defaultVariantKind = useMemo(
    () =>
      selectedCropsData.length > 0
        ? (selectedCropsData[0].variantKind as
            | "production"
            | "subject"
            | undefined)
        : undefined,
    [selectedCropsData],
  );

  useEffect(() => {
    if (!defaultVarietyId) return;
    const currentPlants = getValues("plants") || [];
    let updated = false;
    const nextPlants = currentPlants.map((p) => {
      if (!p.varietyId) {
        updated = true;
        return {
          ...p,
          varietyId: defaultVarietyId,
          variantKind: p.variantKind || defaultVariantKind,
        };
      }
      return p;
    });
    if (updated) {
      setValue("plants", nextPlants);
    }
  }, [defaultVarietyId, defaultVariantKind, getValues, setValue]);

  const handleSetActiveEntry = (id: string) => {
    setActiveEntryId(id);
    setTimeout(() => {
      const element = document.getElementById(`plant-item-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
  };

  const effectiveActiveId = activeEntryId || plants[0]?.entryId || "";

  // ---- Default map center ----
  const mapCenter = useMemo(() => {
    const withValidCoord = plants.find((p) => p.plotId && !p.isInvalidBoundary);
    if (withValidCoord) {
      return [withValidCoord.coordinate.lat, withValidCoord.coordinate.lng] as [
        number,
        number,
      ];
    }

    const unitWithCoord = smallestUnits.find(
      (u) => u.coordinates && u.coordinates.length >= 3,
    );
    if (unitWithCoord) {
      const center = getUnitCenter(unitWithCoord);
      if (center) return [center.lat, center.lng] as [number, number];
    }

    return [11.548, 106.896] as [number, number];
  }, [plants, smallestUnits]);

  const addPlant = () => {
    const currentPlants = getValues("plants") || [];
    const { coordinate, unit } = generateUniqueCoordinate(
      mapCenter,
      currentPlants,
    );

    append({
      entryId: `plant-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      height: "",
      ageValue: "",
      ageUnit: "years",
      plantedDate: new Date().toISOString().split("T")[0],
      note: "",
      plotId: unit ? unit.id : "",
      coordinate,
      isInvalidBoundary: false,
      varietyId: defaultVarietyId,
      variantKind: defaultVariantKind,
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
    const newPlantArr = plants.map((p, index) => {
      const { plotName, areaName, regionName, scopeType } =
        resolveLocationNames(p.plotId);

      // Nếu tạo mới, giữ code undefined/rỗng để Backend tự động sinh PL-xxx
      const plantCode = initialData?.code || undefined;

      return {
        ...initialData,
        code: plantCode,
        name: initialData?.name || plotName || `Cây trồng ${index + 1}`,
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
        // Giống cây / hạt giống & hiện trạng — mapper cần để dựng payload
        varietyId: p.varietyId,
        variantKind: p.variantKind,
        healthStatus: p.healthStatus,
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

  const hasOnlyCenterPoint = useMemo(() => {
    if (!selectedCultivationRegion) return true;
    let hasRealBoundary = false;
    Object.keys(geoDetailMap.regions).forEach((rId) => {
      if (boundaryToCoords(geoDetailMap.regions[rId]?.boundary).length >= 3)
        hasRealBoundary = true;
    });
    Object.keys(geoDetailMap.areas).forEach((aId) => {
      if (boundaryToCoords(geoDetailMap.areas[aId]?.boundary).length >= 3)
        hasRealBoundary = true;
    });
    Object.keys(geoDetailMap.plots).forEach((pId) => {
      if (boundaryToCoords(geoDetailMap.plots[pId]?.boundary).length >= 3)
        hasRealBoundary = true;
    });
    (selectedCultivationRegion?.scopes ?? []).forEach((s: any) => {
      if (
        boundaryToCoords(s.plot?.boundary).length >= 3 ||
        boundaryToCoords(s.area?.boundary).length >= 3 ||
        boundaryToCoords(s.region?.boundary).length >= 3
      ) {
        hasRealBoundary = true;
      }
    });
    return !hasRealBoundary;
  }, [selectedCultivationRegion, geoDetailMap]);

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
        const unitExists = geographicalUnits.some(
          (u) => u.id === autoPlotId && selectedScopeIds.includes(u.id),
        );
        invalid = !unitExists;
      }

      return {
        entryId: `plant-import-${Date.now()}-${index}`,
        height: item.height?.toString() || "",
        ageValue: item.ageValue?.toString() || "",
        ageUnit: item.ageUnit || "years",
        plantedDate: item.plantedDate || new Date().toISOString().split("T")[0],
        note: item.note || "",
        plotId: autoPlotId,
        coordinate: coord,
        isInvalidBoundary: invalid,
        // Giống chọn trong hộp thoại import, fallback về giống đầu của vùng
        varietyId: item.varietyId || defaultVarietyId,
        variantKind: item.variantKind || defaultVariantKind,
        // Cột "Hiện trạng sức khỏe" trong file Excel (nếu có)
        healthStatus: item.healthStatus || undefined,
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
    isLoadingCultivationRegions,
    findGeographicalUnit,
    areasByRegion,
    plotsByArea,
    radius,
    setRadius,
    hasOnlyCenterPoint,
  };
};
