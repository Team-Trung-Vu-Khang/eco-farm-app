import React, { useState, useMemo } from "react";
import {
  Badge,
  Button,
  Card,
  cn,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronDown, Layers, MapPin, Maximize2, Sparkles, X } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { HealthFormFields } from "./HealthFormFields";
import type { HealthStatusType } from "@/features/health-diary/types/health-diary.types";
import {
  RedMarker,
  MapBoundsSync,
  MapChildLayers,
} from "@/pages/dashboard/components/FarmerZoneMapChildLayers";
import { FarmerZoneSelectionModal } from "@/pages/dashboard/components/FarmerZoneSelectionModal";
import {
  FarmerZoneMapUnitDetailPanel,
  type SelectedUnitState,
} from "@/pages/dashboard/components/FarmerZoneMapUnitDetailPanel";

interface ZoneScopeHealthBlockProps {
  selectedZone: any;
  allZones?: any[];
  onSelectZone?: (zoneId: string) => void;
  onSubmit: (payload: {
    targetScopeNames: string[];
    status: HealthStatusType;
    notes: string;
    imageUrls: string[];
  }) => void;
  isSubmitting?: boolean;
}

export const ZoneScopeHealthBlock: React.FC<ZoneScopeHealthBlockProps> = ({
  selectedZone,
  allZones = [],
  onSelectZone,
  onSubmit,
  isSubmitting = false,
}) => {
  const [searchZoneQuery, setSearchZoneQuery] = useState("");
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<SelectedUnitState | null>(
    null,
  );

  // Filter zones for modal
  const filteredZones = useMemo(() => {
    if (!allZones || allZones.length === 0)
      return selectedZone ? [selectedZone] : [];
    return allZones.filter(
      (z: any) =>
        z.name?.toLowerCase().includes(searchZoneQuery.toLowerCase()) ||
        z.description?.toLowerCase().includes(searchZoneQuery.toLowerCase()),
    );
  }, [allZones, selectedZone, searchZoneQuery]);

  // Extract geographic scopes hierarchy from selectedZone
  const scopeTree = useMemo(() => {
    if (!selectedZone) return [];
    if (Array.isArray(selectedZone.scopes) && selectedZone.scopes.length > 0) {
      return selectedZone.scopes;
    }
    return [
      {
        id: selectedZone.id || "zone-1",
        name: selectedZone.name || "Vùng trồng chính",
        type: "region",
        areas: selectedZone.areas || [],
      },
    ];
  }, [selectedZone]);

  // Selected Scope Node IDs tracking for Cascading Selection
  const [selectedScopeIds, setSelectedScopeIds] = useState<string[]>([]);

  // Collect all child IDs under a node
  const getAllChildIds = (node: any): string[] => {
    let ids: string[] = [String(node.id)];
    if (Array.isArray(node.areas)) {
      node.areas.forEach((area: any) => {
        ids.push(String(area.id));
        if (Array.isArray(area.plots)) {
          area.plots.forEach((plot: any) => ids.push(String(plot.id)));
        }
      });
    } else if (Array.isArray(node.plots)) {
      node.plots.forEach((plot: any) => ids.push(String(plot.id)));
    }
    return ids;
  };

  // Toggle node automatically selects/deselects all children
  const handleToggleNode = (id: string, node: any) => {
    const targetIds = getAllChildIds(node);
    const isChecked = !selectedScopeIds.includes(String(id));
    if (isChecked) {
      setSelectedScopeIds((prev) =>
        Array.from(new Set([...prev, ...targetIds])),
      );
    } else {
      setSelectedScopeIds((prev) =>
        prev.filter((item) => !targetIds.includes(item)),
      );
    }
  };

  // Get selected unit names for display
  const selectedScopeNames = useMemo(() => {
    const names: string[] = [];
    scopeTree.forEach((region: any) => {
      if (selectedScopeIds.includes(String(region.id))) {
        names.push(region.name);
      }
      (region.areas || []).forEach((area: any) => {
        if (selectedScopeIds.includes(String(area.id))) {
          names.push(area.name);
        }
        (area.plots || []).forEach((plot: any) => {
          if (selectedScopeIds.includes(String(plot.id))) {
            names.push(plot.name);
          }
        });
      });
    });
    return Array.from(new Set(names));
  }, [scopeTree, selectedScopeIds]);

  // Leaflet Map Active Center & Bounds based on selectedUnit or selectedZone
  const activeBounds: [number, number][] | null =
    selectedUnit?.data?.boundary || selectedZone?.boundary || null;

  const rawCenter =
    selectedUnit?.data?.centerPoint ||
    (selectedUnit?.data?.coordinates
      ? [selectedUnit.data.coordinates.lat, selectedUnit.data.coordinates.lng]
      : null) ||
    selectedZone?.centerPoint ||
    (selectedZone?.coordinates
      ? [selectedZone.coordinates.lat, selectedZone.coordinates.lng]
      : null);

  const activeCenter: [number, number] = useMemo(() => {
    if (
      rawCenter &&
      !isNaN(Number(rawCenter[0])) &&
      !isNaN(Number(rawCenter[1]))
    ) {
      return [Number(rawCenter[0]), Number(rawCenter[1])];
    }
    if (activeBounds && activeBounds.length > 0) {
      const sumLat = activeBounds.reduce((acc, curr) => acc + curr[0], 0);
      const sumLng = activeBounds.reduce((acc, curr) => acc + curr[1], 0);
      return [sumLat / activeBounds.length, sumLng / activeBounds.length];
    }
    return [13.9833, 108.0];
  }, [rawCenter, activeBounds]);

  const activeName =
    selectedUnit?.data?.name || selectedZone?.name || "Vùng trồng";

  const handleFormSubmit = (formData: {
    status: HealthStatusType;
    notes: string;
    imageUrls: string[];
  }) => {
    const scopesToSubmit =
      selectedScopeNames.length > 0
        ? selectedScopeNames
        : [selectedZone?.name || "Vùng trồng"];
    onSubmit({
      targetScopeNames: scopesToSubmit,
      ...formData,
    });
  };

  const isZoneSelected = Boolean(selectedZone && selectedZone.id);

  if (!isZoneSelected) {
    return (
      <Card className="border border-amber-200/80 bg-linear-to-b from-amber-50/40 via-white to-white rounded-2xl shadow-xs overflow-hidden p-6 sm:p-10 text-center space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs animate-bounce">
            <MapPin className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center justify-center gap-2">
            <span>Chưa chọn Vùng canh tác</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Vui lòng chọn một <strong className="text-emerald-700 font-bold">Vùng canh tác</strong> ở góc trên trang trước. Sau đó hệ thống mới hiển thị bản đồ địa lý và biểu mẫu cập nhật sức khỏe phạm vi vùng.
          </p>
        </div>

        {/* Visual Step Guidance */}
        <div className="max-w-md mx-auto bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 text-left space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 pb-2 border-b border-slate-200/60">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Các bước thực hiện:</span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-extrabold text-slate-900">Chọn Vùng canh tác ở góc trên</p>
                <p className="text-[11px] text-amber-800">Cần chọn vùng để đồng bộ bản đồ địa lý</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 opacity-60 px-2">
              <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-bold text-slate-800">Chọn phạm vi vùng / khu vực / lô cần cập nhật</p>
                <p className="text-[11px] text-slate-500">Bấm trực tiếp trên bản đồ hoặc danh sách bên phải</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 opacity-60 px-2">
              <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-bold text-slate-800">Gửi thông tin nhật ký sức khỏe phạm vi vùng</p>
                <p className="text-[11px] text-slate-500">Cập nhật chỉ số sức khỏe, ảnh và ghi chú</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Modal Dialog for Zone Selection */}
      <FarmerZoneSelectionModal
        isOpen={isZoneDialogOpen}
        onOpenChange={setIsZoneDialogOpen}
        searchZoneQuery={searchZoneQuery}
        onSearchChange={setSearchZoneQuery}
        filteredZones={filteredZones}
        selectedZone={selectedZone}
        onSelectZone={(zoneId) => {
          if (onSelectZone) onSelectZone(zoneId);
          setIsZoneDialogOpen(false);
        }}
      />

      {/* ── MAIN GRID: MAP AREA & DETAIL PANEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-auto lg:h-[600px]">
        {/* Left Column (lg:col-span-8): Map Area */}
        <div className="lg:col-span-8 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs relative h-[450px] lg:h-[600px] flex flex-col z-0">
          <MapContainer
            center={activeCenter}
            zoom={14}
            className="h-full w-full flex-1 z-0"
            zoomControl={false}
          >
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            <MapBoundsSync bounds={activeBounds} centerPoint={activeCenter} />

            {/* Render Zone Main Boundary */}
            {activeBounds && activeBounds.length > 0 && (
              <Polygon
                positions={activeBounds}
                pathOptions={{
                  color: "#10b981",
                  fillColor: "#10b981",
                  fillOpacity: 0.15,
                  weight: 2.5,
                }}
              />
            )}

            {/* Render Child Areas & Plots Boundaries and Markers */}
            <MapChildLayers
              zone={selectedZone}
              onSelectUnit={(type, data) => setSelectedUnit({ type, data })}
            />

            {/* Render Main Center Marker */}
            {activeCenter && (
              <Marker position={activeCenter} icon={RedMarker()}>
                <Tooltip sticky direction="top" opacity={0.95}>
                  <div style={{ fontWeight: 600, fontSize: 12 }}>
                    {activeName}
                  </div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>
                    Tọa độ trung tâm
                  </div>
                </Tooltip>
              </Marker>
            )}
          </MapContainer>

          {/* Map Expand Control Button */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={() => setIsMapExpanded(true)}
              className="p-2.5 rounded-xl bg-white/90 backdrop-blur-md shadow-xs hover:bg-white text-slate-600 transition-all active:scale-95 border border-slate-200 cursor-pointer"
              title="Phóng to bản đồ"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Map Legend Overlay */}
          <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xs border border-slate-200 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500" />
              <span>Vùng trồng (Zone)</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <div className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500" />
              <span>Khu vực (Area)</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <div className="w-3 h-3 rounded-sm bg-orange-500/20 border border-orange-500" />
              <span>Lô (Plot)</span>
            </div>
          </div>
        </div>

        {/* Map Expansion Fullscreen Dialog */}
        <Dialog open={isMapExpanded} onOpenChange={setIsMapExpanded}>
          <DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] p-0 overflow-hidden border-none shadow-2xl rounded-2xl z-[10000]">
            <DialogHeader className="sr-only">
              <DialogTitle>Bản đồ chi tiết vùng canh tác</DialogTitle>
            </DialogHeader>

            <div className="flex h-full">
              {/* Fullscreen Map */}
              <div className="flex-1 relative h-full">
                <MapContainer
                  center={activeCenter}
                  zoom={14}
                  className="h-full w-full z-0"
                  zoomControl={false}
                >
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                  <MapBoundsSync
                    bounds={activeBounds}
                    centerPoint={activeCenter}
                  />

                  {activeBounds && activeBounds.length > 0 && (
                    <Polygon
                      positions={activeBounds}
                      pathOptions={{
                        color: "#10b981",
                        fillColor: "#10b981",
                        fillOpacity: 0.15,
                        weight: 2.5,
                      }}
                    />
                  )}

                  <MapChildLayers
                    zone={selectedZone}
                    onSelectUnit={(type, data) =>
                      setSelectedUnit({ type, data })
                    }
                  />

                  {activeCenter && (
                    <Marker position={activeCenter} icon={RedMarker()}>
                      <Tooltip sticky direction="top" opacity={0.95}>
                        <div style={{ fontWeight: 600, fontSize: 12 }}>
                          {activeName}
                        </div>
                      </Tooltip>
                    </Marker>
                  )}
                </MapContainer>
                <button
                  onClick={() => setIsMapExpanded(false)}
                  className="absolute top-4 right-4 z-[1000] p-2.5 rounded-xl bg-white/90 backdrop-blur-md shadow-md hover:bg-white text-slate-600 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fullscreen Sidebar Tree */}
              <div className="w-[420px] bg-white border-l border-slate-200 p-4 overflow-y-auto shrink-0">
                <FarmerZoneMapUnitDetailPanel
                  selectedZone={selectedZone}
                  selectedUnit={selectedUnit}
                  onSelectUnit={(unit) => setSelectedUnit(unit)}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Right Column (lg:col-span-4): Detail Panel */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-xs border border-slate-200 h-[450px] lg:h-[600px] flex flex-col overflow-hidden p-4">
          <FarmerZoneMapUnitDetailPanel
            selectedZone={selectedZone}
            selectedUnit={selectedUnit}
            onSelectUnit={(unit) => setSelectedUnit(unit)}
          />
        </div>
      </div>

      {/* ── BOTTOM SECTION: HEALTH FORM FIELDS ── */}
      <HealthFormFields
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Cập nhật sức khỏe phạm vi vùng"
      />
    </div>
  );
};
