import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MOCK_REGIONS } from "@/pages/region-chart/constants";
import useAquacultureDistributionStore from "@/stores/useAquacultureDistributionStore";
import type {
  AquacultureDistribution,
} from "../AquacultureDistributionDetailPage";

export type AquacultureScope = "region" | "area" | "plot";
export type DistributionMethod = "thac-tham-canh" | "thac-ban-tham-canh";

export type UnitEntry = {
  id: string;
  name: string;
  species: string;
  quantity: number;
  averageWeight: number;
};

const SPECIES_OPTIONS = [
  "Tôm thẻ chân trắng",
  "Tôm sú giống",
  "Cá rô phi đơn tính",
  "Cá mú chấm nâu",
];

const METHOD_OPTIONS: Array<{ value: DistributionMethod; label: string }> = [
  { value: "thac-tham-canh", label: "Nuôi thâm canh tuần hoàn" },
  { value: "thac-ban-tham-canh", label: "Nuôi bán thâm canh" },
];

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const closedPath = (coordinates?: Array<{ lat: number; lng: number }>) => {
  if (!coordinates || coordinates.length < 3) return [];
  const path = coordinates.map((coord) => [coord.lat, coord.lng] as [number, number]);
  const [firstLat, firstLng] = path[0];
  const [lastLat, lastLng] = path[path.length - 1];
  if (firstLat !== lastLat || firstLng !== lastLng) {
    path.push([firstLat, firstLng]);
  }
  return path;
};

export const useAquacultureDistributionCreatePage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { addRecord } = useAquacultureDistributionStore();

  const [scope, setScope] = useState<AquacultureScope>("region");
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);
  const [selectedPlotIds, setSelectedPlotIds] = useState<string[]>([]);
  const [method, setMethod] =
    useState<DistributionMethod>("thac-tham-canh");
  const [unitEntries, setUnitEntries] = useState<UnitEntry[]>([
    {
      id: `unit-${Date.now()}`,
      name: "Ao nuôi số 1",
      species: SPECIES_OPTIONS[0],
      quantity: 12000,
      averageWeight: 18,
    },
  ]);

  const selectedRegion = useMemo(
    () => MOCK_REGIONS.find((region) => region.id.toString() === selectedRegionId),
    [selectedRegionId],
  );

  const selectedAreas = useMemo(
    () =>
      selectedRegion
        ? selectedRegion.subAreas.filter((area) =>
            selectedAreaIds.includes(area.id.toString()),
          )
        : [],
    [selectedAreaIds, selectedRegion],
  );

  const selectedPlots = useMemo(
    () =>
      selectedAreas.flatMap((area) =>
        area.plots.filter((plot) => selectedPlotIds.includes(plot.id)),
      ),
    [selectedAreaIds, selectedAreas, selectedPlotIds],
  );

  const totalStock = useMemo(
    () => unitEntries.reduce((sum, entry) => sum + entry.quantity, 0),
    [unitEntries],
  );

  const plannedUnitCount = useMemo(
    () => unitEntries.reduce((sum, entry) => sum + Math.max(1, Math.ceil(entry.quantity / 3000)), 0),
    [unitEntries],
  );

  const averageWeight = useMemo(() => {
    if (unitEntries.length === 0) return 0;
    const totalWeight = unitEntries.reduce(
      (sum, entry) => sum + entry.averageWeight * entry.quantity,
      0,
    );
    return totalStock > 0 ? totalWeight / totalStock : 0;
  }, [totalStock, unitEntries]);

  const selectedMethodLabel =
    METHOD_OPTIONS.find((item) => item.value === method)?.label ||
    "Nuôi thâm canh tuần hoàn";

  const scopeLabel =
    scope === "region" ? "Vùng nuôi" : scope === "area" ? "Khu vực" : "Ao nuôi";

  const varieties = useMemo(
    () =>
      Array.from(
        unitEntries.reduce((map, entry) => {
          map.set(entry.species, (map.get(entry.species) || 0) + entry.quantity);
          return map;
        }, new Map<string, number>()),
      ).map(([name, count], index) => ({
        name,
        count,
        color: ["#16a34a", "#0ea5e9", "#7c3aed", "#ca8a04"][index % 4],
      })),
    [unitEntries],
  );

  const toggleArea = (id: string) => {
    setSelectedAreaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const togglePlot = (id: string) => {
    setSelectedPlotIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const addUnitEntry = () => {
    setUnitEntries((prev) => [
      ...prev,
      {
        id: `unit-${Date.now()}-${prev.length}`,
        name: `Ao nuôi ${prev.length + 1}`,
        species: SPECIES_OPTIONS[0],
        quantity: 10000,
        averageWeight: 15,
      },
    ]);
  };

  const updateUnitEntry = (
    id: string,
    field: keyof UnitEntry,
    value: string | number,
  ) => {
    setUnitEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const removeUnitEntry = (id: string) => {
    setUnitEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleComplete = () => {
    const baseRegion = selectedRegion;
    const fallbackPoint = baseRegion?.coordinates?.[0] || {
      lat: 10.403,
      lng: 106.804,
    };
    const selectedTargetName =
      selectedPlots[0]?.name || selectedAreas[0]?.name || baseRegion?.name || "Chưa xác định";
    const nextUnits = unitEntries.flatMap((entry, entryIndex) => {
      const unitCount = Math.max(1, Math.ceil(entry.quantity / 3000));
      return Array.from({ length: unitCount }).map((_, index) => ({
        id: `aq-unit-${Date.now()}-${entryIndex}-${index}`,
        code: `AQU-${String(entryIndex * 10 + index + 1).padStart(3, "0")}`,
        name: `${entry.name} - ${index + 1}`,
        species: entry.species,
        status: (index % 5 === 0 ? "warning" : "healthy") as const,
        weight: entry.averageWeight,
        stockedDate: new Date().toISOString().split("T")[0],
        coordinate: {
          lat: fallbackPoint.lat + entryIndex * 0.001 + index * 0.0002,
          lng: fallbackPoint.lng + entryIndex * 0.001 + index * 0.0002,
        },
      }));
    });

    const payload: Omit<AquacultureDistribution, "id" | "code"> = {
      name: `Phân bổ thủy sản ${selectedTargetName}`,
      scope: scope === "region" ? "Vùng nuôi" : scope === "area" ? "Khu nuôi" : "Ao nuôi",
      targetName: selectedTargetName,
      method: METHOD_OPTIONS.find((item) => item.value === method)?.label ||
        "Nuôi thâm canh tuần hoàn",
      totalStock,
      status: "active",
      stockedDate: new Date().toISOString().split("T")[0],
      expectedHarvest: addDays(new Date(), 180).toISOString().split("T")[0],
      areaSize: Number((totalStock / 16000).toFixed(1)) || 1,
      healthScore: 96,
      waterTemp: 29,
      salinity: 15.8,
      varieties,
      units: nextUnits,
      center: [fallbackPoint.lat, fallbackPoint.lng],
      polygon: closedPath(baseRegion?.coordinates),
    };

    addRecord(payload);
    toast({
      title: "Thành công",
      description: "Đã tạo phân bổ nuôi trồng thủy sản mới",
    });
    setLocation("/aquaculture-distribution-detail");
  };

  const handleCancel = () => {
    setLocation("/aquaculture-distribution-detail");
  };

  const goToList = () => {
    setLocation("/aquaculture-distribution-detail");
  };

  return {
    scope,
    selectedRegionId,
    selectedAreaIds,
    selectedPlotIds,
    method,
    unitEntries,
    totalStock,
    plannedUnitCount,
    averageWeight,
    varieties,
    selectedMethodLabel,
    scopeLabel,
    selectedRegion,
    selectedAreas,
    selectedPlots,
    speciesOptions: SPECIES_OPTIONS,
    methodOptions: METHOD_OPTIONS,
    setScope,
    setSelectedRegionId,
    toggleArea,
    togglePlot,
    setMethod,
    addUnitEntry,
    updateUnitEntry,
    removeUnitEntry,
    handleComplete,
    handleCancel,
    goToList,
  };
};
