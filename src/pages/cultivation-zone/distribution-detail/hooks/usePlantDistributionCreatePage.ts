import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import {
  MOCK_SEEDS,
  type DistributionMethod,
  type DistributionScope,
  type PlantEntry,
  type PlantLocation,
  type RowConfig,
} from "../constants";
import {
  MOCK_AREAS,
  MOCK_PLOTS,
  MOCK_REGIONS,
} from "@/pages/region-chart/constants";
import usePlantDistributionStore from "@/stores/usePlantDistributionStore";

export const getSeedColor = (seedId: string) => {
  const colors = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ec4899",
    "#8b5cf6",
    "#06b6d4",
    "#ef4444",
    "#10b981",
  ];
  const index = MOCK_SEEDS.findIndex((seed) => seed.id === seedId);
  return colors[index % colors.length];
};

export const usePlantDistributionCreatePage = () => {
  const [, setLocation] = useLocation();
  const [matchEdit, editParams] = useRoute("/distribution-detail/:id/edit");
  const editingId = matchEdit ? editParams?.id : undefined;
  const { addRecord, updateRecord, getRecordById } = usePlantDistributionStore();

  const [scope, setScope] = useState<DistributionScope>("region");
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);
  const [selectedPlotIds, setSelectedPlotIds] = useState<string[]>([]);
  const [selectedSeedIds, setSelectedSeedIds] = useState<string[]>([]);
  const [distributionMethod, setDistributionMethod] =
    useState<DistributionMethod>("zone");
  const [plantEntries, setPlantEntries] = useState<PlantEntry[]>([]);
  const [rowConfigs, setRowConfigs] = useState<RowConfig[]>([]);
  const [plantLocations, setPlantLocations] = useState<PlantLocation[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  useEffect(() => {
    if (!editingId) return;

    const record = getRecordById(editingId);
    if (!record) return;

    setScope(record.scope);
    setSelectedRegionId(record.selectedRegionId || "");
    setSelectedAreaIds(record.selectedAreaIds || []);
    setSelectedPlotIds(record.selectedPlotIds || []);
    setSelectedSeedIds(record.selectedSeedIds || []);
    setDistributionMethod(record.distributionMethod);
    setPlantEntries(record.plantEntries || []);
    setRowConfigs(record.rowConfigs || []);
    setPlantLocations(record.plantLocations || []);
  }, [editingId, getRecordById]);

  const selectedRegion = useMemo(
    () =>
      MOCK_REGIONS.find((region) => region.id.toString() === selectedRegionId),
    [selectedRegionId],
  );

  const selectedAreas = useMemo(
    () =>
      MOCK_AREAS.filter((area) => selectedAreaIds.includes(area.id.toString())),
    [selectedAreaIds],
  );

  const selectedPlots = useMemo(
    () => MOCK_PLOTS.filter((plot) => selectedPlotIds.includes(plot.id)),
    [selectedPlotIds],
  );

  const selectedSeeds = useMemo(
    () => MOCK_SEEDS.filter((seed) => selectedSeedIds.includes(seed.id)),
    [selectedSeedIds],
  );

  const availableVarieties = useMemo(
    () => Array.from(new Set(selectedSeeds.map((seed) => seed.variety))),
    [selectedSeeds],
  );

  const totalPlants = useMemo(
    () =>
      distributionMethod === "zone"
        ? plantEntries.reduce((sum, entry) => sum + entry.quantity, 0)
        : rowConfigs.reduce((sum, row) => sum + row.quantity, 0),
    [distributionMethod, plantEntries, rowConfigs],
  );

  const toggleArea = (id: string) => {
    setSelectedAreaIds((prev) =>
      prev.includes(id)
        ? prev.filter((areaId) => areaId !== id)
        : [...prev, id],
    );
  };

  const togglePlot = (id: string) => {
    setSelectedPlotIds((prev) =>
      prev.includes(id)
        ? prev.filter((plotId) => plotId !== id)
        : [...prev, id],
    );
  };

  const toggleSeed = (id: string) => {
    setSelectedSeedIds((prev) =>
      prev.includes(id)
        ? prev.filter((seedId) => seedId !== id)
        : [...prev, id],
    );
  };

  const addPlantEntry = () => {
    setPlantEntries((prev) => [
      ...prev,
      {
        id: `entry-${Date.now()}`,
        variety: "",
        seedId: "",
        quantity: 0,
      },
    ]);
  };

  const updatePlantEntry = (
    id: string,
    field: keyof PlantEntry,
    value: string | number,
  ) => {
    setPlantEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const removePlantEntry = (id: string) => {
    setPlantEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const addRowConfig = () => {
    const nextRowNumber =
      rowConfigs.length > 0
        ? Math.max(...rowConfigs.map((row) => row.rowNumber)) + 1
        : 1;

    setRowConfigs((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        rowNumber: nextRowNumber,
        variety: "",
        seedId: "",
        quantity: 0,
      },
    ]);
  };

  const updateRowConfig = (
    id: string,
    field: keyof RowConfig,
    value: string | number,
  ) => {
    setRowConfigs((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const removeRowConfig = (id: string) => {
    setRowConfigs((prev) => prev.filter((row) => row.id !== id));
  };

  const updatePlantLocation = (id: string, lat: number, lng: number) => {
    setPlantLocations((prev) =>
      prev.map((plant) =>
        plant.id === id ? { ...plant, coordinate: { lat, lng } } : plant,
      ),
    );
  };

  const generatePlantLocations = () => {
    const locations: PlantLocation[] = [];
    const baseCoord = selectedRegion
      ? selectedRegion.coordinates[0]
      : { lat: 11.53, lng: 106.88 };

    if (distributionMethod === "zone") {
      plantEntries.forEach((entry, entryIndex) => {
        for (let i = 0; i < entry.quantity; i += 1) {
          locations.push({
            id: `loc-${Date.now()}-${entryIndex}-${i}`,
            plantCode: `PLANT-${String(entryIndex + 1).padStart(3, "0")}-${String(i + 1).padStart(4, "0")}`,
            seedId: entry.seedId,
            coordinate: {
              lat: baseCoord.lat + Math.random() * 0.01,
              lng: baseCoord.lng + Math.random() * 0.01,
            },
            plantedDate: new Date().toISOString().split("T")[0],
          });
        }
      });
    } else {
      rowConfigs.forEach((row) => {
        for (let i = 0; i < row.quantity; i += 1) {
          locations.push({
            id: `loc-${Date.now()}-${row.rowNumber}-${i}`,
            plantCode: `R${String(row.rowNumber).padStart(2, "0")}-P${String(i + 1).padStart(4, "0")}`,
            seedId: row.seedId,
            coordinate: {
              lat: baseCoord.lat + row.rowNumber * 0.0001,
              lng: baseCoord.lng + i * 0.0001,
            },
            plantedDate: new Date().toISOString().split("T")[0],
            rowNumber: row.rowNumber,
          });
        }
      });
    }

    setPlantLocations(locations);
  };

  const resetScopeSelections = (nextScope: DistributionScope) => {
    setScope(nextScope);
    setSelectedAreaIds([]);
    setSelectedPlotIds([]);
  };

  const resetDistributionMethod = (nextMethod: DistributionMethod) => {
    setDistributionMethod(nextMethod);
    setPlantEntries([]);
    setRowConfigs([]);
  };

  const handleComplete = () => {
    const targetName =
      scope === "region"
        ? selectedRegion?.name || ""
        : scope === "area"
          ? selectedAreas.map((a) => a.name).join(", ")
          : selectedPlots.map((p) => p.name).join(", ");

    const payload = {
      name: `Phân bổ ${availableVarieties.join(" - ") || "cây trồng"}`,
      scope,
      targetName,
      distributionMethod,
      totalPlants,
      seedVarieties: selectedSeedIds.length,
      status: "active" as const,
      selectedRegionId,
      selectedAreaIds,
      selectedPlotIds,
      selectedSeedIds,
      plantEntries,
      rowConfigs,
      plantLocations,
    };

    if (editingId) {
      updateRecord(editingId, payload);
    } else {
      addRecord(payload);
    }

    setLocation("/distribution-detail");
  };

  return {
    scope,
    selectedRegionId,
    selectedAreaIds,
    selectedPlotIds,
    selectedSeedIds,
    distributionMethod,
    plantEntries,
    rowConfigs,
    plantLocations,
    selectedPlantId,
    selectedRegion,
    selectedAreas,
    selectedPlots,
    selectedSeeds,
    availableVarieties,
    totalPlants,
    setSelectedRegionId,
    setSelectedPlantId,
    setPlantLocations,
    resetScopeSelections,
    resetDistributionMethod,
    toggleArea,
    togglePlot,
    toggleSeed,
    addPlantEntry,
    updatePlantEntry,
    removePlantEntry,
    addRowConfig,
    updateRowConfig,
    removeRowConfig,
    updatePlantLocation,
    generatePlantLocations,
    handleComplete,
    isEditing: !!editingId,
    handleCancel: () => setLocation("/distribution-detail"),
    goToList: () => setLocation("/distribution-detail"),
  };
};
