import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  ScrollArea,
  Badge,
  cn,
  Combobox,
} from "@tankhang1/eco-shared-ui";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import {
  Calendar,
  MapPin,
  Save,
  X,
  Search,
  Plus,
  Layers,
  ChevronDown,
  ChevronRight,
  Trash2,
  CheckCircle2,
  Beaker,
  Maximize2,
  Shrink,
  User,
  Sprout,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { Link } from "wouter";
import useRegionStore from "../../../../stores/useRegionStore";
import useCultivationAreaStore from "../../../../stores/useCultivationAreaStore";
import usePersonnelStore from "../../../../stores/usePersonnelStore";
import useFarmingMethodStore from "../../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../../stores/useIrrigationSystemStore";
import useSeedStore from "../../../../stores/useSeedStore";
import { type Plant } from "../../../region-chart/constants";

interface PlantIdentificationFormProps {
  initialData?: Partial<Plant>;
  onSubmit: (data: Omit<Plant, "id"> | Plant) => void;
}

// --- Local Refined Components ---

const SingleSelectionCard = ({
  selectedUnit,
  onRemove,
  regions,
}: {
  selectedUnit: any;
  onRemove: () => void;
  regions: any[];
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!selectedUnit) return null;

  // Resolve hierarchy for the selected unit
  const region = regions.find((r) => r.id.toString() === selectedUnit.regionId);

  const area = region?.subAreas?.find(
    (sa: any) => sa.id.toString() === selectedUnit.areaId,
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all group animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "p-2.5 rounded-xl shrink-0 transition-colors duration-300 bg-primary/10 text-primary group-hover:bg-primary/20",
            )}
          >
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-bold tracking-wider py-0 px-1.5 h-4 border-primary/20 text-primary bg-primary/5"
              >
                {selectedUnit.type}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                onClick={onRemove}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1 truncate">
              {selectedUnit.name}
            </div>
            <div className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium">
              ID: {selectedUnit.id}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-2"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
            <span>Phân cấp quản lý</span>
          </button>

          {isExpanded && (
            <div className="mt-4 ml-3 relative">
              <div className="absolute left-0 top-0 bottom-4 w-px bg-slate-200" />
              <div className="space-y-4">
                {/* Region Level */}
                {region && (
                  <div className="flex items-center gap-3 relative z-10 pl-4">
                    <div className="absolute left-0 w-4 h-px bg-slate-200 top-1/2" />
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
                        Vùng trồng
                      </div>
                      <div className="text-xs font-bold text-slate-700">
                        {region.name}
                      </div>
                    </div>
                  </div>
                )}

                {/* Area Level */}
                {area && (
                  <div className="relative pl-4">
                    <div className="absolute left-0 w-4 h-px bg-slate-200 top-4" />
                    <div className="flex items-center gap-3 relative z-10 pl-4">
                      <div className="absolute left-0 w-4 h-px bg-slate-200 top-1/2" />
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs shrink-0">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
                          Khu vực
                        </div>
                        <div className="text-xs font-bold text-slate-700">
                          {area.name}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SingleGeographicalSelector = ({
  units,
  selectedId,
  onSelect,
  disabled,
}: {
  units: any[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUnits = useMemo(() => {
    return units.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.type.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [units, searchTerm]);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="w-full h-10 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 justify-start text-muted-foreground font-normal"
      >
        <Plus className="w-4 h-4 mr-2" />
        {selectedId ? "Thay đổi vị trí cụ thể" : "Chọn vị trí cụ thể"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-slate-50 border-b">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Chọn vị trí cụ thể
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm vị trí..."
                className="pl-10 h-10 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ScrollArea className="h-80 pr-4">
              <div className="space-y-2">
                {filteredUnits.map((u) => (
                  <div
                    key={u.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                      selectedId === u.id
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "hover:bg-slate-50 border-transparent hover:border-slate-200",
                    )}
                    onClick={() => {
                      onSelect(u.id);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          selectedId === u.id
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-400",
                        )}
                      >
                        {u.type === "Lô trồng" ? (
                          <MapPin className="w-4 h-4" />
                        ) : (
                          <Layers className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">
                          {u.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase font-medium">
                          {u.type}
                        </div>
                      </div>
                    </div>
                    {selectedId === u.id && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                ))}
                {filteredUnits.length === 0 && (
                  <div className="text-center py-10 text-muted-foreground text-sm">
                    {units.length === 0
                      ? "Vui lòng chọn Vùng canh tác trước"
                      : "Không tìm thấy vị trí nào"}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter className="p-4 bg-slate-50 border-t">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              Hủy bỏ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Map Content component to be reused between small and large view
const MapContent = ({
  formData,
  currentRegion,
  currentArea,
  currentPlot,
  selectableUnits,
  onLocationChange,
}: {
  formData: Partial<Plant>;
  currentRegion: any;
  currentArea: any;
  currentPlot: any;
  selectableUnits: any[];
  onLocationChange: (lat: number, lng: number) => void;
}) => {
  // Logic: Smallest unit gets vivid color, parents get grey
  const isPlotLevel = !!currentPlot;
  const isAreaLevel = !isPlotLevel && !!currentArea;

  const regionPathOptions = {
    color: isPlotLevel || isAreaLevel ? "#94a3b8" : "#3b82f6", // Grey if area/plot selected
    weight: 1,
    fillOpacity: 0.05,
  };

  const areaPathOptions = {
    color: isPlotLevel ? "#94a3b8" : isAreaLevel ? "#10b981" : "#10b981", // Grey if plot selected
    weight: 1,
    fillOpacity: isAreaLevel ? 0.2 : 0.1,
  };

  const plotPathOptions = {
    color: "#f59e0b",
    weight: 2,
    fillOpacity: 0.2,
  };

  return (
    <>
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Esri"
      />

      {currentRegion?.coordinates && (
        <Polygon
          positions={currentRegion.coordinates.map((c: any) => [c.lat, c.lng])}
          pathOptions={regionPathOptions}
        />
      )}

      {currentArea?.coordinates && (
        <Polygon
          positions={currentArea.coordinates.map((c: any) => [c.lat, c.lng])}
          pathOptions={areaPathOptions}
        />
      )}

      {currentPlot?.coordinates && (
        <Polygon
          positions={currentPlot.coordinates.map((c: any) => [c.lat, c.lng])}
          pathOptions={plotPathOptions}
        />
      )}

      {/* Selectable Boundaries (Background) */}
      {!currentPlot &&
        selectableUnits.map((unit) => {
          if (!unit.coordinates || unit.coordinates.length < 3) return null;
          // Don't show if it's the current area (already shown vividly)
          if (unit.id === currentArea?.id) return null;

          return (
            <Polygon
              key={unit.id}
              positions={unit.coordinates.map((c: any) => [c.lat, c.lng])}
              pathOptions={{
                color: "#E67E22",
                weight: 2,
                fillOpacity: 0.1,
                dashArray: "6, 6",
              }}
            />
          );
        })}

      {formData.coordinate && (
        <Marker
          position={[formData.coordinate.lat, formData.coordinate.lng]}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
              onLocationChange(position.lat, position.lng);
            },
          }}
        />
      )}

      <LocationPicker
        onLocationSelect={(lat, lng) => onLocationChange(lat, lng)}
      />
      {formData.coordinate && (
        <RecenterMap
          lat={formData.coordinate.lat}
          lng={formData.coordinate.lng}
        />
      )}
    </>
  );
};

// Map Event component to handle clicking on the map to set coordinate
const LocationPicker = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Component to recenter map when coordinates change manually
const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};
const PlantIdentificationForm = ({
  initialData,
  onSubmit,
}: PlantIdentificationFormProps) => {
  const { regions } = useRegionStore();
  const { areas } = useCultivationAreaStore();
  const { personnel } = usePersonnelStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const { seeds } = useSeedStore();

  const [formData, setFormData] = useState<Partial<Plant>>({
    code: "",
    name: "",
    height: "",
    ageValue: "",
    ageUnit: "years",
    plantedDate: new Date().toISOString().split("T")[0],
    coordinate: { lat: 11.548, lng: 106.896 },
    plotId: "",
    cultivationAreaId: "",
    note: "",
    ...initialData,
  });

  const [selectedRegionId, setSelectedRegionId] = useState<number | "">("");
  const [selectedAreaId, setSelectedAreaId] = useState<string | "">("");

  // Populate selections if initialData exists
  useEffect(() => {
    if (initialData?.cultivationAreaId) {
      handleChange("cultivationAreaId", initialData.cultivationAreaId);
    }
    if (initialData?.plotId) {
      const regionStore = useRegionStore.getState();
      const plotContext = regionStore.getPlotById(initialData.plotId);
      if (plotContext) {
        setSelectedRegionId(plotContext.region.id);
        setSelectedAreaId(plotContext.area.id);
      }
    }
  }, [initialData]);

  const handleChange = (field: keyof Plant, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const selectedCultivationArea = areas.find(
    (a) => a.id === formData.cultivationAreaId,
  );

  // Logic to find smallest geographical units within a cultivation area
  const smallestUnits = (() => {
    if (!selectedCultivationArea) return [];

    const regionStore = useRegionStore.getState();
    const result: {
      id: string;
      name: string;
      type: string;
      plotId: string;
      regionId?: string;
      areaId?: string;
      coordinates?: { lat: number; lng: number }[];
    }[] = [];

    selectedCultivationArea.targetIds.forEach((id) => {
      if (selectedCultivationArea.scope === "plot") {
        const plotContext = regionStore.getPlotById(id);
        if (plotContext) {
          result.push({
            id: plotContext.plot.id,
            name: plotContext.plot.name,
            type: "Lô trồng",
            plotId: plotContext.plot.id,
            regionId: plotContext.region.id.toString(),
            areaId: plotContext.area.id.toString(),
            coordinates: plotContext.plot.coordinates,
          });
        }
      } else if (selectedCultivationArea.scope === "area") {
        const areaContext = regionStore.getAreaById(id);
        if (areaContext) {
          if (areaContext.area.plots && areaContext.area.plots.length > 0) {
            areaContext.area.plots.forEach((p: any) => {
              result.push({
                id: p.id,
                name: p.name,
                type: "Lô trồng",
                plotId: p.id,
                regionId: areaContext.region.id.toString(),
                areaId: areaContext.area.id.toString(),
                coordinates: p.coordinates,
              });
            });
          } else {
            result.push({
              id: areaContext.area.id,
              name: areaContext.area.name,
              type: "Khu vực",
              plotId: areaContext.area.id,
              regionId: areaContext.region.id.toString(),
              areaId: areaContext.area.id.toString(),
              coordinates: areaContext.area.coordinates,
            });
          }
        }
      } else if (selectedCultivationArea.scope === "region") {
        const region = regionStore.regions.find(
          (r: any) => String(r.id) === id,
        );
        if (region) {
          const hasAnyPlots = (region.subAreas || []).some(
            (sa: any) => sa.plots && sa.plots.length > 0,
          );

          if (
            !hasAnyPlots &&
            (!region.subAreas || region.subAreas.length === 0)
          ) {
            // Case: Region has no Sub-Areas and no Plots
            result.push({
              id: region.id.toString(),
              name: region.name,
              type: "Vùng trồng",
              plotId: region.id.toString(),
              regionId: region.id.toString(),
              coordinates: region.coordinates,
            });
          } else {
            // Standard drill down
            region.subAreas?.forEach((sa: any) => {
              if (sa.plots && sa.plots.length > 0) {
                sa.plots.forEach((p: any) => {
                  result.push({
                    id: p.id,
                    name: p.name,
                    type: "Lô trồng",
                    plotId: p.id,
                    regionId: region.id.toString(),
                    areaId: sa.id.toString(),
                    coordinates: p.coordinates,
                  });
                });
              } else {
                result.push({
                  id: sa.id,
                  name: sa.name,
                  type: "Khu vực",
                  plotId: sa.id,
                  regionId: region.id.toString(),
                  areaId: sa.id.toString(),
                  coordinates: sa.coordinates,
                });
              }
            });
          }
        }
      }
    });

    return result;
  })();

  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isLocationInvalid, setIsLocationInvalid] = useState(false);
  const [isUnitRequired, setIsUnitRequired] = useState(false);

  const findUnitByCoordinate = (lat: number, lng: number) => {
    const pt = turf.point([lng, lat]);

    for (const region of regions) {
      for (const area of region.subAreas || []) {
        // Check Plots first
        for (const plot of area.plots || []) {
          if (plot.coordinates && plot.coordinates.length >= 3) {
            const polyCoords = [
              ...plot.coordinates.map((c: any) => [c.lng, c.lat]),
              [plot.coordinates[0].lng, plot.coordinates[0].lat],
            ];
            const poly = turf.polygon([polyCoords]);
            if (turf.booleanPointInPolygon(pt, poly)) {
              return { region, area, plot, level: "plot" };
            }
          }
        }
        // Then Check Area
        if (area.coordinates && area.coordinates.length >= 3) {
          const polyCoords = [
            ...area.coordinates.map((c: any) => [c.lng, c.lat]),
            [area.coordinates[0].lng, area.coordinates[0].lat],
          ];
          const poly = turf.polygon([polyCoords]);
          if (turf.booleanPointInPolygon(pt, poly)) {
            return { region, area, plot: null, level: "area" };
          }
        }
      }
    }
    return null;
  };

  const activeConfig = useMemo(() => {
    if (!selectedCultivationArea) return null;

    // Use Plot ID or Area ID as the key for nested configs
    const unitId = formData.plotId || selectedAreaId || selectedRegionId;
    const config = selectedCultivationArea.configs?.[String(unitId)];

    return {
      managerId: selectedCultivationArea.managerId,
      farmingMethodId:
        config?.farmingMethodId || selectedCultivationArea.farmingMethodId,
      irrigationMethodId:
        config?.irrigationMethodId ||
        selectedCultivationArea.irrigationMethodId,
      selectedCrops:
        config?.selectedCrops || selectedCultivationArea.selectedCrops || [],
      seedSelections:
        config?.seedSelections || selectedCultivationArea.seedSelections || {},
    };
  }, [
    selectedCultivationArea,
    formData.plotId,
    selectedAreaId,
    selectedRegionId,
  ]);

  const manager = personnel.find(
    (p: any) => String(p.id) === String(activeConfig?.managerId),
  );
  const farmingMethod = farmingMethods.find(
    (m: any) => m.id === activeConfig?.farmingMethodId,
  );
  const irrigationMethod = irrigationSystems.find(
    (s: any) => s.id === activeConfig?.irrigationMethodId,
  );

  // Group seeds by their variety to match the structure in seedSelections
  const selectedCropsData = useMemo(() => {
    if (!activeConfig) return [];

    const result: any[] = [];

    // If we have explicit seedSelections: varietyId -> seedIds[]
    if (
      activeConfig.seedSelections &&
      Object.keys(activeConfig.seedSelections).length > 0
    ) {
      Object.entries(activeConfig.seedSelections).forEach(
        ([_varietyId, seedIds]) => {
          seedIds.forEach((seedId) => {
            const seed = seeds.find((s) => s.id === seedId);
            if (seed) result.push(seed);
          });
        },
      );
    } else {
      // Fallback to selectedCrops (which are variety IDs)
      activeConfig.selectedCrops.forEach((vId: string) => {
        const varietySeeds = seeds.filter((s) => s.id === vId);
        result.push(...varietySeeds);
      });
    }

    return result;
  }, [activeConfig, seeds]);

  const currentRegion = regions.find((r: any) => r.id === selectedRegionId);
  const currentArea = currentRegion?.subAreas?.find(
    (a: any) => String(a.id) === String(selectedAreaId),
  );
  const currentPlot = currentArea?.plots?.find(
    (p: any) => String(p.id) === String(formData.plotId),
  );

  const validateCoordinate = (lat: number, lng: number) => {
    // Get the boundary of the smallest current unit
    const boundary = currentPlot?.coordinates || currentArea?.coordinates;
    if (!boundary || boundary.length < 3) return { isValid: true, lat, lng };

    try {
      const pt = turf.point([lng, lat]);
      // Ensure polygon is closed for turf
      const polyCoords = [
        ...boundary.map((c: any) => [c.lng, c.lat]),
        [boundary[0].lng, boundary[0].lat],
      ];
      const poly = turf.polygon([polyCoords]);

      if (turf.booleanPointInPolygon(pt, poly)) {
        return { isValid: true, lat, lng };
      }

      // If outside, find nearest point on boundary
      const line = turf.polygonToLine(poly);
      const snapped = turf.nearestPointOnLine(line as any, pt);
      const [snapLng, snapLat] = snapped.geometry.coordinates;

      return { isValid: false, lat: snapLat, lng: snapLng };
    } catch (error) {
      console.error("Geospatial validation error:", error);
      return { isValid: true, lat, lng };
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    // Case 1: No unit selected yet or need to sync with map click
    if (!formData.plotId) {
      const detected = findUnitByCoordinate(lat, lng);
      if (detected) {
        const unitId = detected.plot ? detected.plot.id : detected.area.id;

        // Find which CultivationArea (from useCultivationAreaStore) covers this unit
        const parentCA = areas.find((ca) => {
          if (ca.scope === "plot")
            return detected.plot && ca.targetIds.includes(detected.plot.id);
          if (ca.scope === "area")
            return ca.targetIds.includes(detected.area.id);
          if (ca.scope === "region")
            return ca.targetIds.includes(String(detected.region.id));
          return false;
        });

        if (parentCA) {
          setSelectedRegionId(detected.region.id);
          setSelectedAreaId(detected.area.id.toString());
          handleChange("cultivationAreaId", parentCA.id);
          handleChange("plotId", unitId);
          handleChange("coordinate", { lat, lng });
          return;
        }
      }
      setIsUnitRequired(true);
      return;
    }

    // Case 2: Unit selected - enforce boundary
    const validated = validateCoordinate(lat, lng);

    if (!validated.isValid) {
      setIsLocationInvalid(true);
    }
    handleChange("coordinate", { lat: validated.lat, lng: validated.lng });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as any);
  };

  const cultivationAreaOptions = useMemo(
    () =>
      areas.map((a) => ({
        id: a.id,
        label: a.name,
        value: a.id,
      })),
    [areas],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-sm font-semibold">
                Thông tin chung
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã định danh</Label>
                <Input
                  id="code"
                  placeholder="VD: PL-001"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Tên cây trồng</Label>
                <Input
                  id="name"
                  placeholder="VD: Sầu riêng Dona"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-sm font-semibold">
                Thông số sinh trưởng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Chiều cao (m)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    placeholder="VD: 2.5"
                    value={formData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ageValue">Độ tuổi</Label>
                  <div className="flex gap-2">
                    <Input
                      id="ageValue"
                      type="number"
                      placeholder="Số"
                      className="flex-1"
                      value={formData.ageValue}
                      onChange={(e) => handleChange("ageValue", e.target.value)}
                    />
                    <Select
                      value={formData.ageUnit}
                      onValueChange={(val) => handleChange("ageUnit", val)}
                    >
                      <SelectTrigger className="w-25">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Ngày</SelectItem>
                        <SelectItem value="months">Tháng</SelectItem>
                        <SelectItem value="years">Năm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plantedDate">Ngày trồng</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="plantedDate"
                    type="date"
                    className="pl-10"
                    value={formData.plantedDate}
                    onChange={(e) =>
                      handleChange("plantedDate", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú</Label>
                <textarea
                  id="note"
                  rows={4}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                  placeholder="Ghi nhận các thông tin như độ rỗng tán, phạm vi rễ hoặc các đặc điểm khác..."
                  value={formData.note}
                  onChange={(e) => handleChange("note", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Geography & Map */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-sm font-semibold">
                Định danh cây trồng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Vùng canh tác</Label>
                  <Combobox
                    options={cultivationAreaOptions}
                    value={formData.cultivationAreaId || ""}
                    onChange={(val) => {
                      handleChange("cultivationAreaId", val);
                      handleChange("plotId", "");
                    }}
                    placeholder="Chọn vùng canh tác..."
                    searchPlaceholder="Tìm vùng canh tác..."
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Vị trí cụ thể (Đơn vị nhỏ nhất)</Label>

                  {formData.plotId ? (
                    <SingleSelectionCard
                      selectedUnit={smallestUnits.find(
                        (u) => u.id === formData.plotId,
                      )}
                      regions={regions}
                      onRemove={() => handleChange("plotId", "")}
                    />
                  ) : (
                    <SingleGeographicalSelector
                      units={smallestUnits}
                      selectedId={formData.plotId || ""}
                      onSelect={(val) => {
                        handleChange("plotId", val);
                        const regionStore = useRegionStore.getState();
                        const plotContext = regionStore.getPlotById(val);
                        if (plotContext) {
                          setSelectedRegionId(plotContext.region.id);
                          setSelectedAreaId(plotContext.area.id);
                          if (plotContext.plot.coordinates?.[0]) {
                            handleChange(
                              "coordinate",
                              plotContext.plot.coordinates[0],
                            );
                          }
                        } else {
                          const areaContext = regionStore.getAreaById(val);
                          if (areaContext) {
                            setSelectedRegionId(areaContext.region.id);
                            setSelectedAreaId(areaContext.area.id);
                            if (areaContext.area.coordinates?.[0]) {
                              handleChange(
                                "coordinate",
                                areaContext.area.coordinates[0],
                              );
                            }
                          }
                        }
                      }}
                      disabled={!formData.cultivationAreaId}
                    />
                  )}

                  {!formData.plotId && formData.cultivationAreaId && (
                    <p className="text-[10px] text-destructive">
                      * Bạn phải chọn đơn vị địa lý nhỏ nhất
                    </p>
                  )}
                </div>
              </div>

              {selectedCultivationArea && (
                <div className="mt-6 pt-6 border-t space-y-4">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    Cấu hình kỹ thuật vùng canh tác
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl border bg-slate-50/50">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-500 font-medium leading-none mb-1">
                          Quản lý
                        </div>
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {manager?.fullName || "Chưa phân công"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl border bg-slate-50/50">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                        <Beaker className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-500 font-medium leading-none mb-1">
                          Kỹ thuật
                        </div>
                        <div className="text-sm text-slate-900 leading-tight">
                          <div className="font-semibold truncate">
                            {farmingMethod?.name || "Chưa thiết lập"}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {irrigationMethod?.name || "Chưa thiết lập"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dedicated Seed Information Block */}
                  <div className="space-y-4 pt-2">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-green-500" />
                      Thông tin giống cây trồng
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedCropsData.map((c: any) => (
                        <div
                          key={c.id}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
                        >
                          <div className="w-12 h-12 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                            {c.illustration ? (
                              <img
                                src={
                                  typeof c.illustration === "string"
                                    ? c.illustration
                                    : URL.createObjectURL(c.illustration)
                                }
                                alt={c.varietyName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Sprout className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-bold text-primary font-mono uppercase bg-primary/5 px-1.5 py-0.5 rounded-md">
                                {c.varietyCode}
                              </span>
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {c.varietyName}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                              <span className="flex items-center gap-1">
                                <User className="w-2.5 h-2.5" />
                                {c.supplier}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5" />
                                {c.origin}
                              </span>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className="text-[9px] px-1.5 py-0 border-green-200 text-green-600 bg-green-50/50"
                              >
                                Nảy mầm: {c.germinationRate}%
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-[9px] px-1.5 py-0 border-blue-200 text-blue-600 bg-blue-50/50"
                              >
                                Đồng đều: {c.uniformity}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedCropsData.length === 0 && (
                      <div className="py-6 text-center text-muted-foreground italic border-2 border-dashed rounded-2xl bg-slate-50/30">
                        Chưa có thông tin cây trồng cho vùng này
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="flex justify-between items-center">
                  <span>Vị trí trên bản đồ</span>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Lat:
                      </span>
                      <input
                        type="number"
                        step="0.000001"
                        className="w-24 h-6 px-1 text-[10px] font-mono border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-primary/30"
                        value={formData.coordinate?.lat || ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
                            handleLocationChange(
                              val,
                              formData.coordinate?.lng || 0,
                            );
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Lng:
                      </span>
                      <input
                        type="number"
                        step="0.000001"
                        className="w-24 h-6 px-1 text-[10px] font-mono border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-primary/30"
                        value={formData.coordinate?.lng || ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
                            handleLocationChange(
                              formData.coordinate?.lat || 0,
                              val,
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                </Label>
                <div className="h-80 rounded-xl overflow-hidden border border-slate-100 relative z-0 group/map">
                  <MapContainer
                    center={
                      formData.coordinate
                        ? [formData.coordinate.lat, formData.coordinate.lng]
                        : [11.548, 106.896]
                    }
                    zoom={17}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <MapContent
                      formData={formData}
                      currentRegion={currentRegion}
                      currentArea={currentArea}
                      currentPlot={currentPlot}
                      selectableUnits={smallestUnits}
                      onLocationChange={handleLocationChange}
                    />
                  </MapContainer>

                  <button
                    type="button"
                    onClick={() => setIsMapExpanded(true)}
                    className="absolute top-4 right-4 z-1000 p-2 bg-white/90 backdrop-blur shadow-sm border border-slate-100 rounded-lg text-slate-500 hover:text-primary hover:bg-white transition-all opacity-0 group-hover/map:opacity-100"
                    title="Mở rộng bản đồ"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-4 left-4 z-1000 bg-white/90 backdrop-blur shadow-sm border border-slate-100 px-3 py-1.5 rounded-lg text-[11px] text-slate-500 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-primary" />
                    Bấm vào bản đồ hoặc kéo marker để chọn vị trí
                  </div>
                </div>

                {/* Expanded Map Dialog */}
                <Dialog open={isMapExpanded} onOpenChange={setIsMapExpanded}>
                  <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden border-none flex flex-col">
                    <DialogHeader className="p-4 bg-white border-b shrink-0 flex flex-row items-center justify-between space-y-0">
                      <DialogTitle className="flex items-center gap-2 text-base">
                        <MapPin className="w-5 h-5 text-primary" />
                        Chọn vị trí trên bản đồ lớn
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 relative">
                      <MapContainer
                        center={
                          formData.coordinate
                            ? [formData.coordinate.lat, formData.coordinate.lng]
                            : [11.548, 106.896]
                        }
                        zoom={18}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <MapContent
                          formData={formData}
                          currentRegion={currentRegion}
                          currentArea={currentArea}
                          currentPlot={currentPlot}
                          selectableUnits={smallestUnits}
                          onLocationChange={handleLocationChange}
                        />
                      </MapContainer>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-1000 bg-white/95 backdrop-blur shadow-lg border border-primary/20 px-6 py-3 rounded-2xl text-sm font-medium text-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span>
                          Kéo marker hoặc nhấn vào bất cứ đâu để gán tọa độ cho
                          cây
                        </span>
                      </div>
                    </div>
                    <DialogFooter className="p-4 bg-slate-50 border-t shrink-0">
                      <Button
                        type="button"
                        className="w-full md:w-auto px-10"
                        onClick={() => setIsMapExpanded(false)}
                      >
                        Xác nhận vị trí
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Invalid Location Warning Dialog */}
                <Dialog
                  open={isLocationInvalid}
                  onOpenChange={setIsLocationInvalid}
                >
                  <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-none">
                    <div className="p-8 text-center space-y-4">
                      <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          Vị trí không hợp lệ
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed px-4">
                          Tọa độ cây trồng phải nằm trong phạm vi vùng/lô đã
                          chọn. Marker đã được tự động đưa về ranh giới gần nhất
                          để đảm bảo tính chính xác.
                        </p>
                      </div>
                      <Button
                        className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl"
                        onClick={() => setIsLocationInvalid(false)}
                      >
                        Tôi đã hiểu
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Unit Selection Required Dialog */}
                <Dialog open={isUnitRequired} onOpenChange={setIsUnitRequired}>
                  <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-none">
                    <div className="p-8 text-center space-y-4">
                      <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-amber-500 animate-bounce" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          Chưa chọn đơn vị địa lý
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed px-4">
                          Vui lòng chọn Vùng canh tác và Lô/Thửa trước khi xác
                          định vị trí cây, hoặc click vào một vị trí hợp lệ trên
                          bản đồ để chúng tôi tự động nhận diện đơn vị.
                        </p>
                      </div>
                      <Button
                        className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl"
                        onClick={() => setIsUnitRequired(false)}
                      >
                        Đã hiểu
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 mt-4">
            <Link href="/plant-identification">
              <Button variant="outline" type="button">
                <X className="w-4 h-4 mr-2" />
                Hủy bỏ
              </Button>
            </Link>
            <Button type="submit" className="px-8" disabled={!formData.plotId}>
              <Save className="w-4 h-4 mr-2" />
              Lưu thông tin
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlantIdentificationForm;
