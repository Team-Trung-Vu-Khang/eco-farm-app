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
  AQUACULTURE_IDENTIFICATION_GEO_UNITS,
  AQUACULTURE_IDENTIFICATION_REGIONS,
} from "../data/dummy";

const boundaryToCoords = (
  boundary?: Array<{ lat: number; lng: number }>,
): { lat: number; lng: number }[] => boundary ?? [];

const scopeToGeographicalUnitId = (scope: any) => {
  if (scope.scopeType === "REGION") return String(scope.region?.id ?? "");
  if (scope.scopeType === "AREA") return String(scope.area?.id ?? "");
  if (scope.scopeType === "PLOT") return String(scope.plot?.id ?? "");
  return "";
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
          coordinate: initialData.coordinate || { lat: 10.403, lng: 106.804 },
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
        coordinate: item.coordinate || { lat: 10.403, lng: 106.804 },
        isInvalidBoundary: false,
      }));
    }

    return [makeEmptyPlant(10.403, 106.804)];
  }, [initialData, initialList]);

  const defaultRegion =
    AQUACULTURE_IDENTIFICATION_REGIONS.find(
      (region) => region.id === initialData?.cultivationRegionId,
    ) || AQUACULTURE_IDENTIFICATION_REGIONS[0];

  const scopeIdsForRegion = (region: (typeof AQUACULTURE_IDENTIFICATION_REGIONS)[number]) =>
    region.scopes.map(scopeToGeographicalUnitId).filter(Boolean);

  const { control, watch, setValue, getValues } = useForm<PlantFormValues>({
    defaultValues: {
      cultivationRegionId:
        initialData?.cultivationRegionId || defaultRegion.id || "",
      selectedScopeIds: scopeIdsForRegion(defaultRegion),
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

  const selectedCultivationRegion = useMemo(
    () =>
      AQUACULTURE_IDENTIFICATION_REGIONS.find(
        (region) => region.id === cultivationRegionId,
      ) || defaultRegion,
    [cultivationRegionId],
  );

  const filteredCultivationRegions = AQUACULTURE_IDENTIFICATION_REGIONS;

  const setCultivationRegionId = (id: string) => {
    setValue("cultivationRegionId", id);
    const region = AQUACULTURE_IDENTIFICATION_REGIONS.find((item) => item.id === id);
    setValue(
      "selectedScopeIds",
      region ? scopeIdsForRegion(region) : [],
    );
  };

  const setSelectedScopeIds = (ids: string[]) => setValue("selectedScopeIds", ids);

  const setPlants = (action: any) => {
    const currentPlants = getValues("plants");
    const nextPlants =
      typeof action === "function" ? action(currentPlants) : action;
    setValue("plants", nextPlants);
  };

  const updatePlant = (entryId: string, partial: Partial<PlantEntry>) => {
    const currentPlants = getValues("plants");
    const idx = currentPlants.findIndex((p) => p.entryId === entryId);
    if (idx !== -1) update(idx, { ...currentPlants[idx], ...partial });
  };

  const removePlant = (entryId: string) => {
    const currentPlants = getValues("plants");
    const idx = currentPlants.findIndex((p) => p.entryId === entryId);
    if (idx !== -1) remove(idx);
  };

  const addPlant = () => {
    append(makeEmptyPlant(10.403, 106.804));
  };

  const geographicalUnits = useMemo(() => {
    return AQUACULTURE_IDENTIFICATION_GEO_UNITS.map((unit) => ({
      ...unit,
      coordinates: boundaryToCoords(unit.coordinates),
    }));
  }, []);

  const scopedGeographicalUnits = geographicalUnits;

  const findGeographicalUnit = (lat: number, lng: number) => {
    const pt = turf.point([lng, lat]);
    const sortedUnits = [...geographicalUnits].sort((a, b) => a.level - b.level);
    for (const unit of sortedUnits) {
      if (!unit.coordinates || unit.coordinates.length < 3) continue;
      try {
        const polyCoords = [
          ...unit.coordinates.map((c) => [c.lng, c.lat]),
          [unit.coordinates[0].lng, unit.coordinates[0].lat],
        ];
        const poly = turf.polygon([polyCoords]);
        if (turf.booleanPointInPolygon(pt, poly)) return unit;
      } catch {
        // ignore invalid shapes in dummy data
      }
    }
    return null;
  };

  const activePlant = useMemo(
    () => plants.find((p) => p.entryId === activeEntryId) || plants[0],
    [activeEntryId, plants],
  );

  const handleSetActiveEntry = (id: string) => setActiveEntryId(id);

  useEffect(() => {
    if (!activeEntryId && plants.length > 0) {
      setActiveEntryId(plants[0].entryId);
    }
  }, [activeEntryId, plants]);

  const validateAndSnapToUnit = (entryId: string, lat: number, lng: number) => {
    const unit = findGeographicalUnit(lat, lng);
    updatePlant(entryId, {
      coordinate: { lat, lng },
      plotId: unit?.id || "",
      isInvalidBoundary: !unit,
    });
  };

  const handleAutoAssign = (
    entryId: string,
    plotId: string,
    lat: number,
    lng: number,
  ) => {
    updatePlant(entryId, {
      coordinate: { lat, lng },
      plotId,
      isInvalidBoundary: false,
    });
  };

  const handleComplete = () => {
    onSubmit(getValues("plants"));
  };

  const handleImport = (importedPlants: any[]) => {
    const nextPlants = importedPlants.map((plant, index) => ({
      entryId: plant.entryId || plant.id || `aq-import-${Date.now()}-${index}`,
      speciesId: plant.speciesId || "201",
      height: plant.height?.toString() || "",
      ageValue: plant.ageValue?.toString() || "",
      ageUnit: plant.ageUnit || "years",
      plantedDate: plant.plantedDate || new Date().toISOString().split("T")[0],
      note: plant.note || "",
      plotId: plant.plotId || "",
      coordinate: plant.coordinate || { lat: 10.403, lng: 106.804 },
      isInvalidBoundary: false,
    }));
    setValue("plants", nextPlants);
    if (nextPlants.length > 0) setActiveEntryId(nextPlants[0].entryId);
  };

  const selectedCropsData = selectedCultivationRegion?.cropVarieties || [];
  const managers = selectedCultivationRegion?.personnel || [];
  const farmingMethod = selectedCultivationRegion?.farmingMethod || null;
  const irrigationMethod = selectedCultivationRegion?.irrigationSystem || null;
  const mapCenter: [number, number] = [10.403, 106.804];

  return {
    isImportOpen,
    setIsImportOpen,
    isMapExpanded,
    setIsMapExpanded,
    effectiveActiveId: activePlant?.entryId || "",
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
  };
};
