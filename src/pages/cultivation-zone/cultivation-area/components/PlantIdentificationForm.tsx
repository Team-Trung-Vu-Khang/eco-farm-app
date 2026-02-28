import useEnterpriseStore from "@/stores/useEnterpriseStore";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StepperForm,
  type Step,
} from "@tankhang1/eco-shared-ui";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import {
  AlertTriangle,
  Beaker,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Layers,
  MapPin,
  Maximize2,
  Plus,
  Search,
  Sprout,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { useLocation } from "wouter";
import useCultivationAreaStore from "../../../../stores/useCultivationAreaStore";
import useFarmingMethodStore from "../../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../../stores/useIrrigationSystemStore";
import usePersonnelStore from "../../../../stores/usePersonnelStore";
import useRegionStore from "../../../../stores/useRegionStore";
import useSeedStore from "../../../../stores/useSeedStore";
import { type Plant } from "../../../region-chart/constants";
import { EnterpriseSelector } from "./EnterpriseSelector";
import { ImportPlantDialog } from "./ImportPlantDialog";
import L from "leaflet";

interface PlantIdentificationFormProps {
  initialData?: Partial<Plant>;
  initialList?: Partial<Plant>[];
  onSubmit: (data: any) => void;
}

const getMarkerIcon = (color: string = "red") => {
  return L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-" +
      color +
      ".png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png",
  });
};

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

const CultivationAreaSelector = ({
  areas,
  selectedId,
  onSelect,
  disabled,
}: {
  areas: any[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAreas = useMemo(() => {
    return areas.filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [areas, searchTerm]);

  const selectedArea = areas.find((a) => a.id === selectedId);

  return (
    <>
      <div
        className={cn(
          "group border rounded-xl p-4 transition-all hover:shadow-sm cursor-pointer",
          selectedArea
            ? "bg-white border-slate-200"
            : "bg-slate-50 border-dashed border-slate-300",
          disabled && "opacity-60 cursor-not-allowed",
        )}
        onClick={() => !disabled && setIsOpen(true)}
      >
        {selectedArea ? (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 truncate">
                {selectedArea.name}
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                <span className="truncate">{selectedArea.targetName}</span>
              </div>
            </div>
            {!disabled && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 group-hover:text-primary"
              >
                Thay đổi
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2 text-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            <Plus className="w-5 h-5" />
            <div className="text-sm font-medium">Chọn vùng canh tác</div>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="border-b pb-6">
            <DialogTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Chọn vùng canh tác
            </DialogTitle>
          </DialogHeader>

          <div className="w-full p-4 space-y-4">
            <div className="flex flex-col w-full gap-3">
              <div className="w-full relative">
                <Search className="z-10 absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  className="w-full pl-10 h-10 bg-white"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm tên vùng, tên đối tượng, mã..."
                />
              </div>
              <ScrollArea className="h-80 pr-4 w-full">
                <div className="space-y-2">
                  {filteredAreas.map((a) => (
                    <div
                      key={a.id}
                      className={cn(
                        "flex items-center max-w-full justify-between p-3 rounded-xl border cursor-pointer transition-all",
                        selectedId === a.id
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "hover:bg-slate-50 bg-white border-slate-100",
                      )}
                      onClick={() => {
                        onSelect(a.id);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            selectedId === a.id
                              ? "bg-primary text-white"
                              : "bg-slate-100 text-slate-500",
                          )}
                        >
                          <Layers className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 max-w-full">
                          <div className="font-bold text-sm text-slate-900 truncate">
                            {a.name}
                          </div>
                          <div className="flex max-w-md items-center gap-2">
                            <div className="text-[10px] max-w-full text-muted-foreground font-medium uppercase tracking-wider">
                              {a.targetName}
                            </div>
                          </div>
                        </div>
                      </div>
                      {selectedId === a.id ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : (
                        <div className="w-4 h-4 rounded border border-slate-200" />
                      )}
                    </div>
                  ))}
                  {filteredAreas.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                      {areas.length === 0
                        ? "Không có vùng canh tác nào"
                        : "Không tìm thấy vùng canh tác"}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter className="w-full p-4 bg-slate-50 border-t">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
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
// ---- Multi-plant entry type ----
interface PlantEntry {
  entryId: string; // local UI id
  height: string;
  ageValue: string;
  ageUnit: string;
  plantedDate: string;
  note: string;
  plotId: string;
  coordinate: { lat: number; lng: number };
  isInvalidBoundary?: boolean;
}

const makeEmptyPlant = (): PlantEntry => ({
  entryId: `plant-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  height: "",
  ageValue: "",
  ageUnit: "years",
  plantedDate: new Date().toISOString().split("T")[0],
  note: "",
  plotId: "",
  coordinate: { lat: 11.548, lng: 106.896 },
  isInvalidBoundary: false,
});

// ---- Per-plant plot helper ----
const PlantCard = ({
  plant,
  index,
  smallestUnits,
  regions,
  onUpdate,
  onRemove,
  canRemove,
  setActiveEntry,
  isInvalidBoundary,
  setSuggestedCorrection,
}: {
  plant: PlantEntry;
  index: number;
  smallestUnits: any[];
  regions: any[];
  onUpdate: (partial: Partial<PlantEntry>) => void;
  onRemove: () => void;
  canRemove: boolean;
  setActiveEntry: () => void;
  isInvalidBoundary?: boolean;
  setSuggestedCorrection: (value: any) => void;
}) => {
  const [expanded, setExpanded] = useState(true);
  const [tempLat, setTempLat] = useState(
    plant.coordinate?.lat?.toString() || "",
  );
  const [tempLng, setTempLng] = useState(
    plant.coordinate?.lng?.toString() || "",
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    setTempLat(plant.coordinate?.lat?.toString() || "");
    setTempLng(plant.coordinate?.lng?.toString() || "");
    setValidationError(null);
    setSuggestion(null);
  }, [plant.coordinate?.lat, plant.coordinate?.lng]);

  const handleValidate = () => {
    const lat = parseFloat(tempLat);
    const lng = parseFloat(tempLng);
    if (isNaN(lat) || isNaN(lng)) {
      setValidationError("Vui lòng nhập toạ độ hợp lệ.");
      setSuggestion(null);
      return;
    }

    if (!plant.plotId) {
      setValidationError("Vui lòng chọn vị trí cụ thể (bên trên) trước.");
      setSuggestion(null);
      return;
    }

    const unit = smallestUnits.find((u) => u.id === plant.plotId);
    if (!unit || !unit.coordinates || unit.coordinates.length < 3) {
      onUpdate({ coordinate: { lat, lng } });
      setActiveEntry();
      setValidationError(null);
      setSuggestion(null);
      return;
    }

    try {
      const pt = turf.point([lng, lat]);
      const polyCoords = [
        ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
        [unit.coordinates[0].lng, unit.coordinates[0].lat],
      ];
      const poly = turf.polygon([polyCoords]);

      if (turf.booleanPointInPolygon(pt, poly)) {
        onUpdate({ coordinate: { lat, lng }, isInvalidBoundary: false });
        setActiveEntry();
        setValidationError(null);
        setSuggestion(null);
        setSuggestedCorrection(null);
      } else {
        const line = turf.polygonToLine(poly);
        const snapped = turf.nearestPointOnLine(line as any, pt);
        const [snapLng, snapLat] = snapped.geometry.coordinates;
        setValidationError("Toạ độ nằm ngoài ranh giới vị trí đã chọn.");
        setSuggestion({ lat: snapLat, lng: snapLng });
      }
    } catch {
      onUpdate({ coordinate: { lat, lng } });
      setActiveEntry();
      setValidationError(null);
      setSuggestion(null);
    }
  };

  const selectedUnit = smallestUnits.find((u) => u.id === plant.plotId);

  return (
    <div
      id={`plant-${plant.entryId}`}
      className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white"
    >
      {/* Card Header */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 border-b cursor-pointer select-none"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-800 text-sm truncate flex items-center gap-2">
            {`Cây trồng ${index + 1}`}
            {isInvalidBoundary && (
              <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Tọa độ lỗi
              </span>
            )}
          </div>
        </div>
        {plant.plotId ? (
          <div className="flex items-center gap-1 text-[10px] text-primary bg-primary/5 border border-primary/20 px-2 py-0.5 rounded-full font-medium shrink-0">
            <MapPin className="w-2.5 h-2.5" />
            {selectedUnit?.name || "Đã chọn"}
          </div>
        ) : (
          <div className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium shrink-0">
            Chưa chọn vị trí
          </div>
        )}
        <div className="flex items-center gap-1 shrink-0">
          {canRemove && (
            <button
              type="button"
              className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Card Body */}
      {expanded && (
        <div className="p-5 space-y-5">
          {/* Plot selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Vị trí cụ thể <span className="text-red-500">*</span>
            </Label>
            {plant.plotId ? (
              <SingleSelectionCard
                selectedUnit={selectedUnit}
                regions={regions}
                onRemove={() =>
                  onUpdate({
                    plotId: "",
                    coordinate: { lat: 11.548, lng: 106.896 },
                  })
                }
              />
            ) : (
              <SingleGeographicalSelector
                units={smallestUnits}
                selectedId={plant.plotId}
                onSelect={(val) => {
                  const regionStore = useRegionStore.getState();
                  const plotContext = regionStore.getPlotById(val);
                  let coord = { lat: 11.548, lng: 106.896 };
                  if (plotContext?.plot.coordinates?.[0]) {
                    coord = plotContext.plot.coordinates[0];
                  } else {
                    const areaContext = regionStore.getAreaById(val);
                    if (areaContext?.area.coordinates?.[0]) {
                      coord = areaContext.area.coordinates[0];
                    }
                  }
                  onUpdate({ plotId: val, coordinate: coord });
                }}
                disabled={smallestUnits.length === 0}
              />
            )}
            {!plant.plotId && smallestUnits.length > 0 && (
              <p className="text-[10px] text-destructive">
                * Vui lòng chọn vị trí cho cây này
              </p>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`height-${plant.entryId}`} className="text-xs">
                Chiều cao (m)
              </Label>
              <Input
                id={`height-${plant.entryId}`}
                type="number"
                step="0.1"
                placeholder="VD: 2.5"
                value={plant.height}
                onChange={(e) => onUpdate({ height: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Độ tuổi</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Số"
                  className="flex-1"
                  value={plant.ageValue}
                  onChange={(e) => onUpdate({ ageValue: e.target.value })}
                />
                <Select
                  value={plant.ageUnit}
                  onValueChange={(val) => onUpdate({ ageUnit: val })}
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
            <div className="space-y-2 col-span-2">
              <Label htmlFor={`date-${plant.entryId}`} className="text-xs">
                Ngày trồng
              </Label>
              <Input
                type="date"
                value={plant.plantedDate}
                id={`date-${plant.entryId}`}
                onChange={(e) => onUpdate({ plantedDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3 w-full">
            <div className="space-y-2 border border-slate-200 rounded-lg p-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <Label htmlFor={`coord-${plant.entryId}`} className="text-xs">
                  Tọa độ
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleValidate}
                  className="h-7 text-[10px] px-2"
                >
                  Kiểm tra & Cập nhật
                </Button>
              </div>
              <div className="flex gap-2 w-full">
                <div className="flex-1">
                  <Label htmlFor={`coord-${plant.entryId}`} className="text-xs">
                    Vĩ độ
                  </Label>
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Lat"
                    className="flex-1 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/30"
                    value={tempLat}
                    onChange={(e) => setTempLat(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`coord-${plant.entryId}`} className="text-xs">
                    Kinh độ
                  </Label>
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Lng"
                    className="flex-1 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/30"
                    value={tempLng}
                    onChange={(e) => setTempLng(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {validationError && (
              <div className="text-[10px] text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" />
                  {validationError}
                </div>
                {suggestion && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-slate-600">Gợi ý gần nhất:</span>
                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-red-200 font-bold">
                      {suggestion.lat.toFixed(5)}, {suggestion.lng.toFixed(5)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setTempLat(suggestion.lat.toString());
                        setTempLng(suggestion.lng.toString());
                        onUpdate({ coordinate: suggestion });
                        setActiveEntry();
                        setValidationError(null);
                        setSuggestion(null);
                      }}
                      className="ml-auto text-primary font-bold hover:underline"
                    >
                      Dùng gợi ý
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor={`note-${plant.entryId}`} className="text-xs">
              Ghi chú
            </Label>
            <textarea
              id={`note-${plant.entryId}`}
              rows={2}
              className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white resize-none"
              placeholder="Ghi nhận đặc điểm riêng của cây..."
              value={plant.note}
              onChange={(e) => onUpdate({ note: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ---- Map: multiple markers + all plot boundaries ----
const AllPlantsMapContent = ({
  activeId,
  onPlantMove,
  onAutoAssign,
  clickable,
  plants,
  smallestUnits,
  setActiveEntryId,
  suggestedCorrection,
}: {
  activeId: string;
  onPlantMove: (entryId: string, lat: number, lng: number) => void;
  onAutoAssign: (
    entryId: string,
    plotId: string,
    lat: number,
    lng: number,
  ) => void;
  clickable?: boolean;
  plants: PlantEntry[];
  smallestUnits: any[];
  setActiveEntryId: (id: string) => void;
  suggestedCorrection?: { entryId: string; lat: number; lng: number } | null;
}) => {
  const activePlant = plants.find((p) => p.entryId === activeId);

  const findCurrentPlot = (lng: number, lat: number) => {
    for (const unit of smallestUnits) {
      if (!unit.coordinates || unit.coordinates.length < 3) continue;
      try {
        const pt = turf.point([lng, lat]);
        const polyCoords = [
          ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
          [unit.coordinates[0].lng, unit.coordinates[0].lat],
        ];
        const poly = turf.polygon([polyCoords]);
        if (turf.booleanPointInPolygon(pt, poly)) {
          return unit.id;
        }
      } catch {
        return null;
      }
    }

    return null;
  };

  // Inner component to handle map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (!clickable || !activeId) return;
        const { lat, lng } = e.latlng;

        // If plant has no plotId: auto-detect which unit was clicked
        if (!activePlant?.plotId) {
          const plotId = findCurrentPlot(lng, lat);
          if (plotId) {
            onAutoAssign(activeId, plotId, lat, lng);
            return;
          }
          // Clicked outside all units — do nothing
          return;
        }

        // Plant already has a plotId — move within boundary
        onPlantMove(activeId, lat, lng);
      },
    });
    return null;
  };

  return (
    <>
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Esri"
      />
      <MapClickHandler />
      {/* Auto-pan to active plant */}
      {activePlant?.plotId && (
        <RecenterMap
          lat={activePlant.coordinate.lat}
          lng={activePlant.coordinate.lng}
        />
      )}
      {/* All plot boundaries — uniform color, active unit highlighted */}
      {smallestUnits.map((unit) => {
        if (!unit.coordinates || unit.coordinates.length < 3) return null;
        const isActiveUnit = activePlant?.plotId === unit.id;
        return (
          <Polygon
            key={unit.id}
            positions={unit.coordinates.map((c: any) => [c.lat, c.lng])}
            pathOptions={{
              color: isActiveUnit ? "#6366f1" : "#10b981",
              weight: isActiveUnit ? 2.5 : 1.5,
              fillOpacity: isActiveUnit ? 0.18 : 0.08,
              dashArray: isActiveUnit ? undefined : "6,4",
            }}
          />
        );
      })}
      {/* All plant markers */}
      {plants.map((p) => {
        // if (!p.plotId) return null;
        const isActive = p.entryId === activeId;

        return (
          <Marker
            key={p.entryId}
            position={[p.coordinate.lat, p.coordinate.lng]}
            draggable={isActive}
            opacity={isActive ? 1 : 0.6}
            icon={
              !p.plotId
                ? getMarkerIcon("yellow")
                : p.isInvalidBoundary
                  ? getMarkerIcon("red")
                  : getMarkerIcon("green")
            }
            eventHandlers={{
              click() {
                if (!isActive) {
                  document
                    .getElementById(`plant-${p.entryId}`)
                    ?.scrollIntoView({
                      block: "center",
                      behavior: "smooth",
                    });
                }
                setActiveEntryId(p.entryId);
              },
              dragend(e) {
                if (!isActive) return;
                const pos = e.target.getLatLng();

                if (!p.plotId) {
                  const plotId = findCurrentPlot(pos.lng, pos.lat);
                  if (plotId) {
                    onAutoAssign(p.entryId, plotId, pos.lat, pos.lng);
                    return;
                  }
                }

                onPlantMove(p.entryId, pos.lat, pos.lng);
              },
            }}
          />
        );
      })}
      {/* Ghost marker for suggested correction */}
      {suggestedCorrection &&
        suggestedCorrection.entryId === activeId &&
        activePlant && (
          <>
            <Polyline
              positions={[
                [activePlant.coordinate.lat, activePlant.coordinate.lng],
                [suggestedCorrection.lat, suggestedCorrection.lng],
              ]}
              pathOptions={{ color: "#ef4444", dashArray: "5, 5", weight: 2 }}
            />
            <Marker
              position={[suggestedCorrection.lat, suggestedCorrection.lng]}
              opacity={0.5}
              eventHandlers={{
                click() {
                  // Clicking suggestion might not do anything specific, users use the Apply button
                },
              }}
            />
          </>
        )}
    </>
  );
};

const PlantIdentificationForm = ({
  initialData,
  initialList,
  onSubmit,
}: PlantIdentificationFormProps) => {
  const { regions } = useRegionStore();
  const { areas } = useCultivationAreaStore();
  const { personnel } = usePersonnelStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const { seeds } = useSeedStore();

  const { enterprises } = useEnterpriseStore();
  const [, setLocation] = useLocation();

  // ---- Shared state ----
  const [enterpriseId, setEnterpriseId] = useState(
    initialData?.enterpriseId || "",
  );
  const [cultivationAreaId, setCultivationAreaId] = useState(
    initialData?.cultivationAreaId || "",
  );

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
  const filteredCultivationAreas = useMemo(() => {
    if (!enterpriseId) return [];
    return areas.filter(
      (a) =>
        a.enterpriseId === enterpriseId ||
        a.enterpriseId === `ent-${enterpriseId}` ||
        `ent-${a.enterpriseId}` === enterpriseId,
    );
  }, [areas, enterpriseId]);

  const selectedCultivationArea = areas.find((a) => a.id === cultivationAreaId);

  // ---- Logic to find smallest geographical units ----
  const smallestUnits = useMemo(() => {
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
      // 1. Check if ID is a plot
      const pc = regionStore.getPlotById(id);
      if (pc) {
        result.push({
          id: pc.plot.id,
          name: pc.plot.name,
          type: "Lô trồng",
          plotId: pc.plot.id,
          regionId: pc.region.id.toString(),
          areaId: pc.area.id.toString(),
          coordinates: pc.plot.coordinates,
        });
        return;
      }

      // 2. Check if ID is an Area
      const ac = regionStore.getAreaById(id);
      if (ac) {
        if (ac.area.plots && ac.area.plots.length > 0) {
          ac.area.plots.forEach((p: any) => {
            result.push({
              id: p.id,
              name: p.name,
              type: "Lô trồng",
              plotId: p.id,
              regionId: ac.region.id.toString(),
              areaId: ac.area.id.toString(),
              coordinates: p.coordinates,
            });
          });
        } else {
          result.push({
            id: ac.area.id,
            name: ac.area.name,
            type: "Khu vực",
            plotId: ac.area.id,
            regionId: ac.region.id.toString(),
            areaId: ac.area.id.toString(),
            coordinates: ac.area.coordinates,
          });
        }
        return;
      }

      // 3. Check if ID is a Region
      const region = regionStore.regions.find((r: any) => String(r.id) === id);
      if (region) {
        const hasPlots = (region.subAreas || []).some(
          (sa: any) => sa.plots && sa.plots.length > 0,
        );
        if (!hasPlots && (!region.subAreas || region.subAreas.length === 0)) {
          result.push({
            id: region.id.toString(),
            name: region.name,
            type: "Vùng trồng",
            plotId: region.id.toString(),
            regionId: region.id.toString(),
            coordinates: region.coordinates,
          });
        } else {
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
    });
    return result;
  }, [selectedCultivationArea]);

  // ---- Technical config (based on area only, no per-plant plot needed for Step 1) ----
  const activeConfig = useMemo(() => {
    if (!selectedCultivationArea) return null;
    return {
      managerId: selectedCultivationArea.managerId,
      farmingMethodId: selectedCultivationArea.farmingMethodId,
      irrigationMethodId: selectedCultivationArea.irrigationMethodId,
      selectedCrops: selectedCultivationArea.selectedCrops || [],
      seedSelections: selectedCultivationArea.seedSelections || {},
    };
  }, [selectedCultivationArea]);

  const manager = personnel.find(
    (p: any) => String(p.id) === String(activeConfig?.managerId),
  );
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
    const plant = plants.find((p) => p.entryId === plantEntryId);
    if (!plant || !plant.plotId) {
      updatePlant(plantEntryId, { coordinate: { lat, lng } });
      return;
    }

    const unit = smallestUnits.find((u) => u.id === plant.plotId);
    if (!unit || !unit.coordinates || unit.coordinates.length < 3) {
      updatePlant(plantEntryId, { coordinate: { lat, lng } });
      return;
    }

    try {
      const pt = turf.point([lng, lat]);
      const polyCoords = [
        ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
        [unit.coordinates[0].lng, unit.coordinates[0].lat],
      ];
      const poly = turf.polygon([polyCoords]);

      if (turf.booleanPointInPolygon(pt, poly)) {
        setSuggestedCorrection(null);
        updatePlant(plantEntryId, {
          coordinate: { lat, lng },
          isInvalidBoundary: false,
        });
      } else {
        // Snap to nearest boundary point for suggestion
        const line = turf.polygonToLine(poly);
        const snapped = turf.nearestPointOnLine(line as any, pt);
        const [snapLng, snapLat] = snapped.geometry.coordinates;
        setSuggestedCorrection({
          entryId: plantEntryId,
          lat: snapLat,
          lng: snapLng,
        });

        updatePlant(plantEntryId, {
          coordinate: { lat, lng },
          isInvalidBoundary: true,
        });
      }
    } catch {
      updatePlant(plantEntryId, { coordinate: { lat, lng } });
    }
  };

  const handleAutoAssign = (
    entryId: string,
    plotId: string,
    lat: number,
    lng: number,
  ) => {
    const unit = smallestUnits.find((u) => u.id === plotId);
    if (!unit || !unit.coordinates || unit.coordinates.length < 3) {
      updatePlant(entryId, { coordinate: { lat, lng }, plotId });
      return;
    }

    const pt = turf.point([lng, lat]);
    const polyCoords = [
      ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
      [unit.coordinates[0].lng, unit.coordinates[0].lat],
    ];

    const poly = turf.polygon([polyCoords]);

    if (turf.booleanPointInPolygon(pt, poly)) {
      setSuggestedCorrection(null);
      updatePlant(entryId, {
        plotId,
        coordinate: { lat, lng },
        isInvalidBoundary: false,
      });
    } else {
      // Snap to nearest boundary point for suggestion
      const line = turf.polygonToLine(poly);
      const snapped = turf.nearestPointOnLine(line as any, pt);
      const [snapLng, snapLat] = snapped.geometry.coordinates;
      setSuggestedCorrection({
        entryId: entryId,
        lat: snapLat,
        lng: snapLng,
      });

      updatePlant(entryId, {
        plotId,
        coordinate: { lat, lng },
        isInvalidBoundary: true,
      });
    }
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
        cultivationAreaId,
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
      description: "Chọn doanh nghiệp và vùng canh tác",
      isValid: !!(enterpriseId && cultivationAreaId),
      content: (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="relative overflow-hidden rounded-xl border border-green-200 bg-linear-to-r from-green-50 via-white to-green-50 p-5 shadow-sm">
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-green-900">
                  Định vị vùng canh tác
                </h3>
                <p className="text-sm text-green-700/80">
                  Chọn doanh nghiệp và vùng canh tác trước. Vị trí cụ thể của
                  từng cây sẽ được chọn ở bước tiếp theo.
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="grid md:grid-cols-2 gap-6 grid-col-1">
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b py-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Doanh nghiệp sở hữu <span className="text-red-500">*</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <EnterpriseSelector
                    selectedId={enterpriseId}
                    onSelect={(id) => {
                      setEnterpriseId(id);
                      setCultivationAreaId("");
                      setPlants((prev) =>
                        prev.map((p) => ({
                          ...p,
                          plotId: "",
                          coordinate: { lat: 11.548, lng: 106.896 },
                        })),
                      );
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b py-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    Vùng canh tác <span className="text-red-500">*</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <CultivationAreaSelector
                    areas={filteredCultivationAreas}
                    selectedId={cultivationAreaId}
                    onSelect={(val) => {
                      setCultivationAreaId(val);
                      setPlants((prev) =>
                        prev.map((p) => ({
                          ...p,
                          plotId: "",
                          coordinate: { lat: 11.548, lng: 106.896 },
                        })),
                      );
                    }}
                    disabled={!enterpriseId}
                  />
                  {!enterpriseId && (
                    <p className="text-xs text-muted-foreground italic">
                      Chọn doanh nghiệp trước để hiển thị các vùng canh tác.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {selectedCultivationArea && (
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
                <CardHeader className="border-b py-4 bg-slate-50/80">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-primary" />
                    Cấu hình kỹ thuật vùng canh tác
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          Kỹ thuật canh tác
                        </div>
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {farmingMethod?.name || "Chưa thiết lập"}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {irrigationMethod?.name || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Sprout className="w-3 h-3 text-green-500" />
                      Giống cây trồng
                    </div>
                    {selectedCropsData.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedCropsData.map((c: any) => (
                          <div
                            key={c.id}
                            className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm"
                          >
                            <div className="w-10 h-10 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
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
                                <Sprout className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[9px] font-bold text-primary font-mono uppercase bg-primary/5 px-1 py-0.5 rounded">
                                  {c.varietyCode}
                                </span>
                                <span className="text-xs font-bold text-slate-900 truncate">
                                  {c.varietyName}
                                </span>
                              </div>
                              <div className="flex gap-1 mt-1 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1 py-0 border-green-200 text-green-600 bg-green-50/50"
                                >
                                  Nảy mầm: {c.germinationRate}%
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1 py-0 border-blue-200 text-blue-600 bg-blue-50/50"
                                >
                                  Đồng đều: {c.uniformity}%
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-5 text-center text-muted-foreground italic border-2 border-dashed rounded-2xl bg-slate-50/30 text-sm">
                        Chưa có thông tin cây trồng cho vùng này
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "plants",
      title: "Thông tin cây trồng",
      description: "Thêm từng cây trồng, chọn vị trí và điền thông tin",
      isValid: plants.length > 0 && plants.every((p) => p.plotId),
      content: (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-linear-to-r from-blue-50 via-white to-blue-50 p-5 shadow-sm">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Sprout className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-blue-900">
                    Danh sách cây trồng
                  </h3>
                  <p className="text-sm text-blue-700/80">
                    Mỗi cây có thể thuộc một lô/vị trí khác nhau trong vùng canh
                    tác.
                  </p>
                </div>
                <div className="shrink-0 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">
                  {plants.length} cây
                </div>
              </div>
              {!initialData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsImportOpen(true)}
                  className="bg-white hover:bg-blue-50 text-blue-700 border-blue-200 shrink-0"
                >
                  <Upload className="w-4 h-4 mr-2" /> Nhập từ Excel
                </Button>
              )}
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left: Plant list */}
            <div className="space-y-4">
              {plants.map((plant, idx) => (
                <PlantCard
                  key={plant.entryId}
                  plant={plant}
                  index={idx}
                  smallestUnits={smallestUnits}
                  regions={regions}
                  setSuggestedCorrection={setSuggestedCorrection}
                  onUpdate={(partial) => updatePlant(plant.entryId, partial)}
                  onRemove={() => removePlant(plant.entryId)}
                  canRemove
                  setActiveEntry={() => setActiveEntryId(plant.entryId)}
                  isInvalidBoundary={plant.isInvalidBoundary}
                />
              ))}

              {!initialData && (
                <button
                  type="button"
                  onClick={addPlant}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-primary/30 text-primary hover:border-primary/60 hover:bg-primary/5 transition-all text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Thêm cây trồng
                </button>
              )}
            </div>

            {/* Right: Shared map */}
            <div className="lg:sticky lg:top-6">
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b py-3 px-5">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Vị trí các cây trên bản đồ
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsMapExpanded(true)}
                      className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 relative transition-all duration-100 ease-in-out">
                  {/* Plant selector tabs above map */}
                  {plants.length > 0 && (
                    <div className="px-4 py-3 border-b flex gap-2 flex-wrap bg-slate-50/60">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider self-center shrink-0">
                        Cây đang chỉnh:
                      </span>
                      {plants.map((p, idx) => {
                        const isActive = effectiveActiveId === p.entryId;
                        const hasPlot = !!p.plotId;
                        return (
                          <button
                            type="button"
                            key={p.entryId}
                            onClick={() => {
                              handleSetActiveEntry(p.entryId);
                              setSuggestedCorrection(null);
                              document
                                .getElementById(`plant-${p.entryId}`)
                                ?.scrollIntoView({
                                  block: "center",
                                  behavior: "smooth",
                                });
                            }}
                            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
                              isActive
                                ? "bg-indigo-500 text-white border-indigo-500 shadow-sm"
                                : hasPlot
                                  ? "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                                  : "bg-white text-slate-400 border-dashed border-slate-300 hover:border-indigo-300 hover:text-indigo-600"
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                            >
                              {idx + 1}
                            </span>
                            {`Cây ${idx + 1}`}
                            {!hasPlot && (
                              <span className="ml-1 text-[10px] text-red-400">
                                *
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {/* Out-of-bounds warning */}
                  {suggestedCorrection && (
                    <div className="absolute z-10 bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-800 text-xs px-3 py-2.5 rounded-xl animate-in fade-in slide-in-from-top-1 duration-300 shadow-sm">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-500" />
                        <span>
                          <span className="font-bold">
                            Ngoài phạm vi hợp lệ!
                          </span>{" "}
                          Vị trí bạn chọn nằm ngoài phạm vi hợp lệ. Di chuyển
                          marker vào trong vùng hợp lệ hoặc áp dụng gợi ý.{" "}
                          <span className="text-red-500">
                            Vĩ độ: {suggestedCorrection.lat} - Kinh độ:{" "}
                            {suggestedCorrection.lng}
                          </span>
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 text-[10px] shrink-0 sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {
                          updatePlant(suggestedCorrection.entryId, {
                            coordinate: {
                              lat: suggestedCorrection.lat,
                              lng: suggestedCorrection.lng,
                            },
                            isInvalidBoundary: false,
                          });
                          setSuggestedCorrection(null);
                        }}
                      >
                        Áp dụng gợi ý
                      </Button>
                    </div>
                  )}
                  <div
                    className={cn(
                      "h-125 relative z-0 transition-all duration-100 ease-in-out",
                      isMapExpanded ? "hidden opacity-0" : "",
                    )}
                  >
                    <MapContainer
                      center={mapCenter}
                      zoom={17}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <AllPlantsMapContent
                        clickable={true}
                        plants={plants}
                        activeId={effectiveActiveId}
                        smallestUnits={smallestUnits}
                        setActiveEntryId={handleSetActiveEntry}
                        onPlantMove={validateAndSnapToUnit}
                        onAutoAssign={handleAutoAssign}
                        suggestedCorrection={suggestedCorrection}
                      />
                    </MapContainer>
                    <div className="absolute bottom-4 left-4 z-1000 bg-white/90 backdrop-blur shadow-sm border border-slate-100 px-3 py-1.5 rounded-lg text-[11px] text-slate-500 flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-primary" />
                      Bấm bản đồ hoặc kéo marker để thay đổi vị trí
                    </div>
                    {/* Legend */}
                    <div className="absolute top-4 right-4 z-1000 bg-white/90 backdrop-blur shadow-sm border border-slate-100 px-3 py-2 rounded-lg space-y-1">
                      <div className="flex items-center gap-2 text-[10px] text-slate-600">
                        <div className="w-3 h-3 rounded-sm border-2 border-indigo-500 bg-indigo-500/20" />
                        Cây đang chỉnh
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-600">
                        <div className="w-3 h-3 rounded-sm border-2 border-green-500 bg-green-500/20" />
                        Lô đã có cây
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-600">
                        <div className="w-3 h-3 rounded-sm border-2 border-dashed border-orange-400 bg-orange-400/10" />
                        Lô trống
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Expanded map dialog */}
          <Dialog open={isMapExpanded} onOpenChange={setIsMapExpanded}>
            <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden border-none flex flex-col">
              <DialogHeader className="p-4 bg-white border-b shrink-0">
                <DialogTitle className="flex items-center gap-2 text-base">
                  <MapPin className="w-5 h-5 text-primary" />
                  Bản đồ toàn bộ cây trồng
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 relative flex flex-col">
                {/* Plant selector tabs above expanded map */}
                {plants.length > 0 && (
                  <div className="px-4 py-3 border-b flex gap-2 flex-wrap bg-slate-50/60 shrink-0">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider self-center shrink-0">
                      Cây đang chỉnh:
                    </span>
                    {plants.map((p, idx) => {
                      const isActive = effectiveActiveId === p.entryId;
                      const hasPlot = !!p.plotId;
                      return (
                        <button
                          key={p.entryId}
                          type="button"
                          onClick={() => handleSetActiveEntry(p.entryId)}
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
                            isActive
                              ? "bg-indigo-500 text-white border-indigo-500 shadow-sm"
                              : hasPlot
                                ? "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                                : "bg-white text-slate-400 border-dashed border-slate-300 hover:border-indigo-300 hover:text-indigo-600"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                          >
                            {idx + 1}
                          </span>
                          {`Cây ${idx + 1}`}
                          {!hasPlot && (
                            <span className="ml-1 text-[10px] text-red-400">
                              *
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
                <div className="flex-1 relative">
                  {suggestedCorrection && (
                    <div className="absolute z-[1000] bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-800 text-xs px-3 py-2.5 rounded-xl animate-in fade-in slide-in-from-top-1 duration-300 shadow-sm">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-500" />
                        <span>
                          <span className="font-bold">
                            Ngoài phạm vi hợp lệ!
                          </span>{" "}
                          Vị trí bạn chọn nằm ngoài phạm vi hợp lệ. Di chuyển
                          marker vào trong vùng hợp lệ hoặc áp dụng gợi ý.
                          <span className="text-red-500">
                            Vĩ độ: {suggestedCorrection.lat} - Kinh độ:{" "}
                            {suggestedCorrection.lng}
                          </span>
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 text-[10px] shrink-0 sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {
                          updatePlant(suggestedCorrection.entryId, {
                            coordinate: {
                              lat: suggestedCorrection.lat,
                              lng: suggestedCorrection.lng,
                            },
                            isInvalidBoundary: false,
                          });
                          setSuggestedCorrection(null);
                        }}
                      >
                        Áp dụng gợi ý
                      </Button>
                    </div>
                  )}

                  <MapContainer
                    center={mapCenter}
                    zoom={18}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <AllPlantsMapContent
                      activeId={effectiveActiveId}
                      onPlantMove={validateAndSnapToUnit}
                      onAutoAssign={handleAutoAssign}
                      clickable={true}
                      plants={plants}
                      smallestUnits={smallestUnits}
                      setActiveEntryId={handleSetActiveEntry}
                      suggestedCorrection={suggestedCorrection}
                    />
                  </MapContainer>
                </div>
              </div>
              <DialogFooter className="p-4 bg-slate-50 border-t shrink-0">
                <Button
                  type="button"
                  className="w-full md:w-auto px-10"
                  onClick={() => setIsMapExpanded(false)}
                >
                  Đóng bản đồ
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin trước khi lưu",
      isValid: true,
      content: (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm relative z-10">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-900 z-10 relative">
              Xác nhận thông tin
            </h3>
            <p className="text-green-700/80 mt-2 z-10 relative max-w-lg mx-auto">
              Sắp {initialData ? "cập nhật thông tin" : "lưu"}{" "}
              <span className="font-bold">{plants.length} cây trồng</span>{" "}
              {initialData ? "thuộc" : "vào"} vùng{" "}
              <span className="font-bold">
                {selectedCultivationArea?.name || "—"}
              </span>
              .
            </p>
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-600 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Overview row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col col-span-4 gap-4 w-full border rounded-xl p-4 shadow-sm bg-white">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden shadow-sm">
                  {selectedEnterprise?.image ? (
                    <img
                      src={selectedEnterprise?.image}
                      alt={selectedEnterprise?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Briefcase className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] py-0 h-4 bg-primary/5 text-primary border-primary/20"
                    >
                      {selectedEnterprise?.code}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-[10px] py-0 h-4 bg-slate-100 capitalize font-medium"
                    >
                      {selectedEnterprise?.type}
                    </Badge>
                  </div>
                  <div className="font-bold text-slate-900 text-base leading-tight mb-1">
                    {selectedEnterprise?.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <span className="font-medium text-slate-500">MST:</span>
                    <span>{selectedEnterprise?.taxCode}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-3 border-t border-slate-100">
                <div className="flex items-start gap-2.5 text-xs text-slate-600">
                  <div className="bg-slate-100 p-1 rounded-md shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="leading-relaxed">
                    <span className="font-medium text-slate-800 mr-1">
                      Địa chỉ:
                    </span>
                    {selectedEnterprise?.address}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-xl p-2 text-center shadow-sm">
              <div className="text-2xl font-bold text-primary">
                {plants.length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {initialData ? "Cây chờ cập nhật" : "Cây chờ thêm"}
              </div>
            </div>
            <div className="bg-white col-span-3 border rounded-xl p-4 text-center shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-left font-bold text-slate-900 truncate">
                    {selectedCultivationArea?.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                    <span className="truncate">
                      {selectedCultivationArea?.targetName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedCultivationArea && (
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-slate-500" />
                <h4 className="font-semibold text-slate-800">
                  Cấu hình kỹ thuật được áp dụng
                </h4>
              </div>
              <div className="p-6 space-y-5 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl border bg-slate-50/50">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-500 font-medium leading-none mb-1">
                        Quản lý phụ trách
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
                        Kỹ thuật canh tác
                      </div>
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {farmingMethod?.name || "Chưa thiết lập"}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {irrigationMethod?.name || ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Sprout className="w-3 h-3 text-green-500" />
                    Giống cây trồng
                  </div>
                  {selectedCropsData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedCropsData.map((c: any) => (
                        <div
                          key={c.id}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
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
                              <Sprout className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[9px] font-bold text-primary font-mono uppercase bg-primary/5 px-1 py-0.5 rounded">
                                {c.varietyCode}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {c.varietyName}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-5 text-center text-muted-foreground italic border-2 border-dashed rounded-2xl bg-slate-50/30 text-sm">
                      Chưa có thông tin cây trồng cho vùng này
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Plant list table */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-slate-500" />
              <h4 className="font-semibold text-slate-800">
                Danh sách cây trồng
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50/50">
                    <th className="text-left py-2.5 px-4 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                      #
                    </th>
                    <th className="text-left py-2.5 px-4 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                      Vị trí
                    </th>
                    <th className="text-left py-2.5 px-4 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                      Cao (m)
                    </th>
                    <th className="text-left py-2.5 px-4 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                      Tuổi
                    </th>
                    <th className="text-left py-2.5 px-4 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                      Tọa độ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {plants.map((p, idx) => {
                    const unit = smallestUnits.find((u) => u.id === p.plotId);
                    return (
                      <tr
                        key={p.entryId}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-muted-foreground text-xs">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {unit ? (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                              <MapPin className="w-2.5 h-2.5" />
                              {unit.name}
                            </span>
                          ) : (
                            <span className="text-red-400 italic text-xs">
                              Chưa chọn
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {p.height || "—"}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {p.ageValue
                            ? `${p.ageValue} ${p.ageUnit === "years" ? "năm" : p.ageUnit === "months" ? "tháng" : "ngày"}`
                            : "—"}
                        </td>
                        <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                          {p.plotId
                            ? `${p.coordinate.lat.toFixed(5)}, ${p.coordinate.lng.toFixed(5)}`
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Technical config */}
          {selectedCultivationArea && (
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-slate-500" />
                <h4 className="font-semibold text-slate-800">
                  Cấu hình kỹ thuật
                </h4>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                    Quản lý
                  </div>
                  <div className="font-medium text-slate-900">
                    {manager?.fullName || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                    Canh tác
                  </div>
                  <div className="font-medium text-slate-900">
                    {farmingMethod?.name || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                    Tưới tiêu
                  </div>
                  <div className="font-medium text-slate-900">
                    {irrigationMethod?.name || "—"}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
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

            // Auto-assign logic just like AllPlantsMapContent if possible
            if (!autoPlotId) {
              const pt = turf.point([coord.lng, coord.lat]);
              for (const unit of smallestUnits) {
                if (unit.coordinates && unit.coordinates.length >= 3) {
                  const polyCoords = [
                    ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
                    [unit.coordinates[0].lng, unit.coordinates[0].lat],
                  ];
                  const poly = turf.polygon([polyCoords]);
                  if (turf.booleanPointInPolygon(pt, poly)) {
                    autoPlotId = unit.id;
                    invalid = false; // valid coordinate because it landed inside one of the selectable zones!
                    break;
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
