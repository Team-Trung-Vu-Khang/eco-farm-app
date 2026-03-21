import useEnterpriseStore from "@/stores/useEnterpriseStore";
import { StepperForm, type Step } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import useCultivationRegionStore from "../../../../stores/useCultivationRegionStore";
import useFarmingMethodStore from "../../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../../stores/useIrrigationSystemStore";
import usePersonnelStore from "../../../../stores/usePersonnelStore";
import useRegionStore from "../../../../stores/useRegionStore";
import useSeedStore from "../../../../stores/useSeedStore";
import { type Plant } from "../../../region-chart/constants";
import { ImportPlantDialog } from "./ImportPlantDialog";
import { type PlantEntry, makeEmptyPlant } from "./types";
import { Step1GeographicalSelection } from "./Step1GeographicalSelection";
import { Step2PlantEntry } from "./Step2PlantEntry";
import { Step3Confirmation } from "./Step3Confirmation";

interface PlantIdentificationFormProps {
  initialData?: Partial<Plant>;
  initialList?: Partial<Plant>[];
  onSubmit: (data: any) => void;
}

const PlantIdentificationForm = ({
  initialData,
  initialList,
  onSubmit,
}: PlantIdentificationFormProps) => {
  const { areas } = useCultivationRegionStore();
  const { personnel } = usePersonnelStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const { seeds } = useSeedStore();

  const { enterprises } = useEnterpriseStore();
  const [, setLocation] = useLocation();

  // ---- Share state ----
  const [enterpriseId, setEnterpriseId] = useState(
    initialData?.enterpriseId || "",
  );
  const [cultivationRegionId, setCultivationRegionId] = useState(
    initialData?.cultivationRegionId || "",
  );
  const [selectedScopeIds, setSelectedScopeIds] = useState<string[]>(() => {
    if (initialData?.plotId) return [initialData.plotId];
    if (initialList && initialList.length > 0) {
      const ids = initialList.map((p) => p.plotId).filter(Boolean) as string[];
      return Array.from(new Set(ids));
    }
    return [];
  });

  const [isImportOpen, setIsImportOpen] = useState(false);

  // ---- Per-plant list ----
  const [plants, setPlants] = useState<PlantEntry[]>(() => {
    if (initialData) {
      return [
        {
          entryId: initialData.id || `plant-${Date.now()}`,
          height: initialData.height?.toString() || "",
          ageValue: initialData.ageValue?.toString() || "",
          ageUnit: initialData.ageUnit || "years",
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
        ageUnit: item.ageUnit || "years",
        plantedDate: item.plantedDate || new Date().toISOString().split("T")[0],
        note: item.note || "",
        plotId: item.plotId || "",
        coordinate: item.coordinate || { lat: 11.548, lng: 106.896 },
        isInvalidBoundary: false,
      }));
    }
    return [makeEmptyPlant()];
  });

  const updatePlant = (entryId: string, partial: Partial<PlantEntry>) => {
    setPlants((prev) =>
      prev.map((p) => (p.entryId === entryId ? { ...p, ...partial } : p)),
    );
  };
  const removePlant = (entryId: string) => {
    setPlants((prev) => prev.filter((p) => p.entryId !== entryId));
  };
  const addPlant = () => {
    setPlants((prev) => [...prev, makeEmptyPlant()]);
  };

  // ---- Derived: cultivation area ----
  const filteredCultivationRegions = useMemo(() => {
    if (!enterpriseId) return [];
    return areas.filter(
      (a) =>
        a.enterpriseId === enterpriseId ||
        a.enterpriseId === `ent-${enterpriseId}` ||
        `ent-${a.enterpriseId}` === enterpriseId,
    );
  }, [areas, enterpriseId]);

  const selectedCultivationRegion = areas.find(
    (a) => a.id === cultivationRegionId,
  );

  // ---- Logic to find smallest geographical units ----
  const geographicalUnits = useMemo(() => {
    if (!selectedCultivationRegion) return [];
    const regionStore = useRegionStore.getState();
    const result: {
      id: string;
      name: string;
      type: string;
      level: number; // 1: Plot, 2: Area, 3: Region
      coordinates?: { lat: number; lng: number }[];
    }[] = [];

    const processedIds = new Set<string>();

    selectedCultivationRegion.targetIds.forEach((id) => {
      // 1. Check if ID is a plot
      const pc = regionStore.getPlotById(id);
      if (pc && !processedIds.has(pc.plot.id)) {
        result.push({
          id: pc.plot.id,
          name: pc.plot.name,
          type: "Lô trồng",
          level: 1,
          coordinates: pc.plot.coordinates,
        });
        processedIds.add(pc.plot.id);

        // Also add its Area and Region context if not already added
        if (pc.area && !processedIds.has(pc.area.id.toString())) {
          result.push({
            id: pc.area.id.toString(),
            name: pc.area.name,
            type: "Khu vực",
            level: 2,
            coordinates: pc.area.coordinates,
          });
          processedIds.add(pc.area.id.toString());
        }
        if (pc.region && !processedIds.has(pc.region.id.toString())) {
          result.push({
            id: pc.region.id.toString(),
            name: pc.region.name,
            type: "Vùng trồng",
            level: 3,
            coordinates: pc.region.coordinates,
          });
          processedIds.add(pc.region.id.toString());
        }
        return;
      }

      // 2. Check if ID is an Area
      const ac = regionStore.getAreaById(id);
      if (ac && !processedIds.has(ac.area.id.toString())) {
        result.push({
          id: ac.area.id.toString(),
          name: ac.area.name,
          type: "Khu vực",
          level: 2,
          coordinates: ac.area.coordinates,
        });
        processedIds.add(ac.area.id.toString());

        ac.area.plots?.forEach((p: any) => {
          if (!processedIds.has(p.id)) {
            result.push({
              id: p.id,
              name: p.name,
              type: "Lô trồng",
              level: 1,
              coordinates: p.coordinates,
            });
            processedIds.add(p.id);
          }
        });

        if (ac.region && !processedIds.has(ac.region.id.toString())) {
          result.push({
            id: ac.region.id.toString(),
            name: ac.region.name,
            type: "Vùng trồng",
            level: 3,
            coordinates: ac.region.coordinates,
          });
          processedIds.add(ac.region.id.toString());
        }
        return;
      }

      // 3. Check if ID is a Region
      const region = regionStore.regions.find((r: any) => String(r.id) === id);
      if (region && !processedIds.has(region.id.toString())) {
        result.push({
          id: region.id.toString(),
          name: region.name,
          type: "Vùng trồng",
          level: 3,
          coordinates: region.coordinates,
        });
        processedIds.add(region.id.toString());

        region.subAreas?.forEach((sa: any) => {
          if (!processedIds.has(sa.id.toString())) {
            result.push({
              id: sa.id.toString(),
              name: sa.name,
              type: "Khu vực",
              level: 2,
              coordinates: sa.coordinates,
            });
            processedIds.add(sa.id.toString());
          }
          sa.plots?.forEach((p: any) => {
            if (!processedIds.has(p.id)) {
              result.push({
                id: p.id,
                name: p.name,
                type: "Lô trồng",
                level: 1,
                coordinates: p.coordinates,
              });
              processedIds.add(p.id);
            }
          });
        });
      }
    });

    return result;
  }, [selectedCultivationRegion]);

  const scopedGeographicalUnits = useMemo(() => {
    if (!selectedScopeIds || selectedScopeIds.length === 0)
      return geographicalUnits;

    const regionStore = useRegionStore.getState();
    const resultIds = new Set<string>();

    selectedScopeIds.forEach((id) => {
      const scopeUnit = geographicalUnits.find((u) => u.id === id);
      if (!scopeUnit) return;

      if (scopeUnit.level === 3) {
        geographicalUnits.forEach((u) => resultIds.add(u.id));
      } else if (scopeUnit.level === 2) {
        resultIds.add(id);
        const ac = regionStore.getAreaById?.(id);
        const childPlotIds = (ac?.area?.plots || []).map((p: any) => p.id);
        childPlotIds.forEach((pid: string) => resultIds.add(pid));
      } else {
        resultIds.add(id);
      }
    });

    return geographicalUnits.filter((u) => resultIds.has(u.id));
  }, [selectedScopeIds, geographicalUnits]);

  // Smallest units for map rendering (only Plot if exists, else Area, else Region)
  // This is for Polygon rendering to avoid overlapping colors
  const smallestUnits = useMemo(() => {
    // Find the level with items
    const hasPlots = geographicalUnits.some((u) => u.level === 1);
    const hasAreas = geographicalUnits.some((u) => u.level === 2);

    if (hasPlots) return geographicalUnits.filter((u) => u.level === 1);
    if (hasAreas) return geographicalUnits.filter((u) => u.level === 2);
    return geographicalUnits;
  }, [geographicalUnits]);

  const findGeographicalUnit = (lat: number, lng: number) => {
    // Priority: Plot (level 1) > Area (level 2) > Region (level 3)
    const pt = turf.point([lng, lat]);

    // Use selectedScopeIds to find strictly within the chosen scope
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
      } catch (e) {
        // skip errors
      }
    }
    return null;
  };

  // ---- Technical config (based on area only, no per-plant plot needed for Step 1) ----
  const activeConfig = useMemo(() => {
    if (!selectedCultivationRegion) return null;
    return {
      managerIds: selectedCultivationRegion.managerIds || [],
      farmingMethodId: selectedCultivationRegion.farmingMethodId,
      irrigationMethodId: selectedCultivationRegion.irrigationMethodId,
      selectedCrops: selectedCultivationRegion.selectedCrops || [],
      seedSelections: selectedCultivationRegion.seedSelections || {},
    };
  }, [selectedCultivationRegion]);

  const managers = useMemo(() => {
    if (!activeConfig?.managerIds) return [];
    return personnel.filter((p: any) =>
      activeConfig.managerIds.includes(String(p.id)),
    );
  }, [activeConfig, personnel]);
  const farmingMethod = farmingMethods.find(
    (m: any) => m.id === activeConfig?.farmingMethodId,
  );
  const irrigationMethod = irrigationSystems.find(
    (s: any) => s.id === activeConfig?.irrigationMethodId,
  );

  const selectedCropsData = useMemo(() => {
    if (!activeConfig) return [];
    const result: any[] = [];
    if (
      activeConfig.seedSelections &&
      Object.keys(activeConfig.seedSelections).length > 0
    ) {
      Object.entries(activeConfig.seedSelections).forEach(([, seedIds]) => {
        (seedIds as string[]).forEach((seedId) => {
          const seed = seeds.find((s) => s.id === seedId);
          if (seed) result.push(seed);
        });
      });
    } else {
      activeConfig.selectedCrops.forEach((vId: string) => {
        result.push(...seeds.filter((s) => s.id === vId));
      });
    }
    return result;
  }, [activeConfig, seeds]);

  const [isMapExpanded, setIsMapExpanded] = useState(false);
  // ---- Active plant on map ----
  const [activeEntryId, setActiveEntryId] = useState<string>("");
  const [suggestedCorrection, setSuggestedCorrection] = useState<{
    entryId: string;
    lat: number;
    lng: number;
  } | null>(null);

  const handleSetActiveEntry = (id: string) => {
    setActiveEntryId(id);
    setTimeout(() => {
      const element = document.getElementById(`plant-item-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
  };

  // Resolve effective active entry (fallback to first plant that has a plot)
  const effectiveActiveId =
    activeEntryId || plants.find((p) => p.plotId)?.entryId || "";

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
          } catch {}
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
    _plotId: string, // ignored, we re-calculate
    lat: number,
    lng: number,
  ) => {
    validateAndSnapToUnit(entryId, lat, lng);
  };

  // ---- Submit: one plant per entry ----
  const handleComplete = () => {
    const newPlantArr = plants.map((p) => {
      return {
        ...initialData,
        height: p.height,
        enterpriseId,
        ageValue: p.ageValue,
        ageUnit: p.ageUnit,
        plantedDate: p.plantedDate,
        note: p.note,
        plotId: p.plotId,
        cultivationRegionId,
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

  const selectedEnterprise = enterprises.find(
    (e) => e.id.toString() === enterpriseId,
  );

  // ---- Default map center ----
  const mapCenter = useMemo(() => {
    const withCoord = plants.find((p) => p.plotId);
    if (withCoord)
      return [withCoord.coordinate.lat, withCoord.coordinate.lng] as [
        number,
        number,
      ];
    if (smallestUnits[0]?.coordinates?.[0]) {
      return [
        smallestUnits[0].coordinates[0].lat,
        smallestUnits[0].coordinates[0].lng,
      ] as [number, number];
    }
    return [11.548, 106.896] as [number, number];
  }, [plants, smallestUnits]);

  const steps: Step[] = [
    {
      id: "selection",
      title: "Chọn vùng canh tác",
      description: "Chọn đơn vị sở hữu và vùng canh tác",
      isValid: !!(
        enterpriseId &&
        cultivationRegionId &&
        selectedScopeIds.length > 0
      ),
      content: (
        <Step1GeographicalSelection
          enterpriseId={enterpriseId}
          setEnterpriseId={setEnterpriseId}
          cultivationRegionId={cultivationRegionId}
          setCultivationRegionId={setCultivationRegionId}
          filteredCultivationRegions={filteredCultivationRegions}
          selectedCultivationRegion={selectedCultivationRegion}
          geographicalUnits={geographicalUnits}
          selectedScopeIds={selectedScopeIds}
          onScopeChange={setSelectedScopeIds}
          manager={managers}
          farmingMethod={farmingMethod}
          irrigationMethod={irrigationMethod}
          selectedCropsData={selectedCropsData}
          setPlants={setPlants}
        />
      ),
    },
    {
      id: "plants",
      title: "Thông tin cây trồng",
      description: "Thêm từng cây trồng, chọn vị trí và điền thông tin",
      isValid: plants.length > 0 && plants.every((p) => p.plotId),
      content: (
        <Step2PlantEntry
          plants={plants}
          addPlant={addPlant}
          removePlant={removePlant}
          updatePlant={updatePlant}
          scopedGeographicalUnits={scopedGeographicalUnits}
          initialData={initialData}
          isImportOpen={isImportOpen}
          setIsImportOpen={setIsImportOpen}
          isMapExpanded={isMapExpanded}
          setIsMapExpanded={setIsMapExpanded}
          effectiveActiveId={effectiveActiveId}
          handleSetActiveEntry={handleSetActiveEntry}
          suggestedCorrection={suggestedCorrection}
          setSuggestedCorrection={setSuggestedCorrection}
          mapCenter={mapCenter}
          handleAutoAssign={handleAutoAssign}
          validateAndSnapToUnit={validateAndSnapToUnit}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin trước khi lưu",
      isValid: true,
      content: (
        <Step3Confirmation
          plants={plants}
          initialData={initialData}
          selectedEnterprise={selectedEnterprise}
          selectedCultivationRegion={selectedCultivationRegion}
          geographicalUnits={geographicalUnits}
          manager={managers}
          farmingMethod={farmingMethod}
          irrigationMethod={irrigationMethod}
          selectedCropsData={selectedCropsData}
        />
      ),
    },
  ];

  return (
    <>
      <StepperForm
        steps={steps}
        onComplete={handleComplete}
        onCancel={() => setLocation("/plant-identification")}
        completeLabel={initialData ? "Cập nhật cây trồng" : "Lưu cây trồng"}
      />
      <ImportPlantDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={(importedList) => {
          if (importedList.length === 0) return;
          const newPlants: PlantEntry[] = importedList.map((item, index) => {
            const coord = item.coordinate || { lat: 11.548, lng: 106.896 };
            let autoPlotId = item.plotId || "";
            let invalid = true;

            if (!autoPlotId) {
              const pt = turf.point([coord.lng, coord.lat]);
              // Strictly check against selectedScopeIds only
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
          setPlants((prev) => {
            // override the initial empty plant row if untouched
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
        }}
      />
    </>
  );
};

export default PlantIdentificationForm;
