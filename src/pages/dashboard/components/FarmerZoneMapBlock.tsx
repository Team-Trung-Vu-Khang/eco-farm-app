import { useState, useEffect, useMemo } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  MapPin,
  Maximize2,
  Activity,
  Stethoscope,
  Layers,
  ChevronDown,
  Search,
  Check,
  X,
  ChevronRight,
  Building2,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { useLocation } from "wouter";
import type { DashboardZoneNode } from "../hooks/useDashboardData";
import { farmerZoneTreeData } from "../constants";
import { GeographyScopeTree } from "./GeographyScopeTree";

const RedMarker = () =>
  divIcon({
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 30px; height: 30px; background-color: #ef4444; border-radius: 50%; opacity: 0.3; transform: scale(1.4); animation: pulse 2s infinite;"></div>
        <div style="position: absolute; width: 14px; height: 14px; background-color: #ef4444; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      </style>
    `,
    className: "custom-center-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

const MapBoundsSync = ({
  bounds,
  centerPoint,
}: {
  bounds: [number, number][] | null;
  centerPoint: [number, number] | null;
}) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (centerPoint) {
      map.setView(centerPoint, 15);
    }
  }, [bounds, centerPoint, map]);
  return null;
};

interface FarmerZoneMapBlockProps {
  zoneTreeData?: DashboardZoneNode[];
  isLoading?: boolean;
}

export function FarmerZoneMapBlock({
  isLoading,
  zoneTreeData = [],
}: FarmerZoneMapBlockProps) {
  const [, setLocation] = useLocation();
  const activeTreeData = zoneTreeData;
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    activeTreeData[0]?.id || "",
  );
  const [searchZoneQuery, setSearchZoneQuery] = useState("");
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<{
    type: "region" | "area" | "plot";
    data: any;
  } | null>(null);

  useEffect(() => {
    if (
      activeTreeData.length > 0 &&
      (!selectedZoneId || !activeTreeData.some((z) => z.id === selectedZoneId))
    ) {
      setSelectedZoneId(activeTreeData[0].id);
    }
  }, [activeTreeData, selectedZoneId]);

  const handleNavigateToDetail = () => {
    if (!selectedUnit) return;
    const rawId = selectedUnit.data.id || "1";
    const numericId = String(rawId).replace(/^(ZONE|REGION|AREA|PLOT)-/i, "");

    let path = "";
    if (selectedUnit.type === "region") {
      path = `/cultivation-region/${numericId}`;
    } else if (selectedUnit.type === "area") {
      path = `/cultivation-area/${numericId}`;
    } else if (selectedUnit.type === "plot") {
      path = `/cultivation-plot/${numericId}`;
    }

    if (path) {
      window.open(path, "_blank");
    }
  };

  const selectedZone =
    activeTreeData.find((z) => z.id === selectedZoneId) ||
    activeTreeData[0] ||
    null;

  const filteredZones = activeTreeData.filter(
    (z) =>
      z.name.toLowerCase().includes(searchZoneQuery.toLowerCase()) ||
      z.description.toLowerCase().includes(searchZoneQuery.toLowerCase()),
  );

  const handleSelectZone = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setSelectedUnit(null);
    setIsZoneDialogOpen(false);
  };

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
    selectedUnit?.data?.name || selectedZone?.name || "Bản đồ canh tác";

  return (
    <div className="space-y-6">
      {/* Header Section: Enterprise / Farmer Zone Title & Modal Dialog Trigger Button */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-800 leading-tight">
              {selectedZone?.name || "Bản đồ vùng canh tác"}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {selectedZone?.description ||
                "Chi tiết bản đồ & Phạm vi địa lý cây trồng"}
            </p>
          </div>
        </div>

        {/* Button to open Zone Selection Modal Dialog */}
        <button
          type="button"
          onClick={() => setIsZoneDialogOpen(true)}
          className="flex items-center justify-between gap-2.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-300/80 rounded-xl shadow-xs transition-all hover:border-emerald-500 shrink-0"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{selectedZone?.name || "Chọn vùng"}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        </button>
      </div>

      {/* Modal Dialog for Zone Selection */}
      <Dialog open={isZoneDialogOpen} onOpenChange={setIsZoneDialogOpen}>
        <DialogContent className="max-w-xl w-[92vw] rounded-3xl p-6 bg-white shadow-2xl border-none">
          <DialogHeader className="pb-3 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-800">
                  Chọn Vùng Canh Tác Nông Hộ
                </DialogTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Danh sách tất cả các vùng canh tác thuộc quyền sở hữu của Nông
                  hộ
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Search input in Dialog */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên vùng, mô tả..."
                value={searchZoneQuery}
                onChange={(e) => setSearchZoneQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
              />
            </div>

            {/* Zone List Grid */}
            <div className="max-h-[360px] overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100">
              {filteredZones.length > 0 ? (
                filteredZones.map((zone) => {
                  const isSelected = zone.id === selectedZone.id;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => handleSelectZone(zone.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all border pt-3.5 first:pt-3.5 ${
                        isSelected
                          ? "bg-emerald-50/80 border-emerald-500 shadow-sm"
                          : "bg-white hover:bg-slate-50 border-slate-200/80"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 pr-2">
                          <div
                            className={`text-xs font-bold ${isSelected ? "text-emerald-950" : "text-slate-800"}`}
                          >
                            {zone.name}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                            <span>{zone.description}</span>
                            <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border">
                              {zone.totalAreaHa} ha
                            </span>
                            <span className="text-emerald-700 font-medium">
                              {zone.areas.length} khu vực
                            </span>
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-slate-400 italic">
                  Không tìm thấy vùng canh tác phù hợp
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Grid: Map Area & Detail Panel with FIXED HEIGHT h-[480px] lg:h-[640px] */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[640px]">
        {/* Left Column (lg:col-span-8): Map Area with fixed height */}
        <div className="lg:col-span-8 rounded-2xl overflow-hidden border-4 border-white bg-white shadow-xl relative h-[480px] lg:h-[640px] flex flex-col z-0">
          <MapContainer
            center={activeCenter}
            zoom={14}
            className="h-full w-full flex-1 z-0"
            zoomControl={false}
          >
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            <MapBoundsSync bounds={activeBounds} centerPoint={activeCenter} />

            {activeBounds && activeBounds.length > 0 && (
              <Polygon
                positions={activeBounds}
                pathOptions={{
                  color: "#10b981",
                  fillColor: "#10b981",
                  fillOpacity: 0.25,
                  weight: 2,
                }}
              />
            )}

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
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setIsMapExpanded(true)}
              className="p-2.5 rounded-xl bg-white/90 backdrop-blur-md shadow-xl hover:bg-white text-slate-600 transition-all active:scale-95 border border-white/60"
              title="Phóng to bản đồ"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/60 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <div className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500" />
              <span>Vùng trồng (Zone)</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500" />
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
          <DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] p-0 overflow-hidden border-none shadow-2xl rounded-3xl z-[10000]">
            <DialogHeader className="sr-only">
              <DialogTitle>Bản đồ chi tiết vùng canh tác</DialogTitle>
            </DialogHeader>

            <div className="flex h-full">
              {/* Fullscreen Map */}
              <div className="flex-1 relative bg-slate-100">
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
                        fillOpacity: 0.25,
                        weight: 2,
                      }}
                    />
                  )}

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
                <button
                  onClick={() => setIsMapExpanded(false)}
                  className="absolute top-4 right-4 z-[1000] p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl hover:bg-white text-slate-600 transition-all active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fullscreen Sidebar Tree */}
              <div className="w-[420px] bg-white border-l border-slate-200 p-4 overflow-y-auto space-y-4 shrink-0">
                <div className="flex items-center justify-between border-b pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-xs uppercase tracking-widest text-slate-700">
                      Phạm vi địa lý cây trồng
                    </span>
                  </div>
                  {selectedUnit && (
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      Đang xem chi tiết
                    </Badge>
                  )}
                </div>

                {selectedUnit ? (
                  <div className="animate-in fade-in duration-200 space-y-4">
                    {/* Unit Type Badge & Code */}
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`uppercase font-bold px-2.5 py-1 text-[10px] ${
                          selectedUnit.type === "region"
                            ? "bg-blue-500 text-white"
                            : selectedUnit.type === "area"
                              ? "bg-emerald-500 text-white"
                              : "bg-orange-500 text-white"
                        }`}
                      >
                        {selectedUnit.type === "region"
                          ? "Vùng trồng"
                          : selectedUnit.type === "area"
                            ? "Khu vực"
                            : "Lô"}
                      </Badge>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {selectedUnit.data.id || "N/A"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 leading-tight">
                      {selectedUnit.data.name}
                    </h3>

                    {/* Grid Stats: Area (ha) & Status */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                          Diện tích
                        </p>
                        <p className="text-base font-bold text-slate-800">
                          {selectedUnit.data.areaHa ||
                            selectedUnit.data.totalAreaHa ||
                            0}{" "}
                          ha
                        </p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                          Trạng thái
                        </p>
                        <p className="text-sm font-bold text-emerald-600">
                          {selectedUnit.data.status || "Active"}
                        </p>
                      </div>
                    </div>

                    {/* Health Indicators (Sick & Treating trees) */}
                    <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Chỉ số sức khỏe cây trồng
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-red-600 bg-red-50 border border-red-200 px-2 py-1.5 rounded-xl font-semibold">
                          <Activity className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            Bệnh: {selectedUnit.data.sickTrees || 0} cây
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1.5 rounded-xl font-semibold">
                          <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            Điều trị: {selectedUnit.data.treatingTrees || 0} cây
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <Button
                        variant="outline"
                        className="w-full rounded-xl font-bold text-xs h-9"
                        onClick={() => setSelectedUnit(null)}
                      >
                        Quay lại Cây địa lý
                      </Button>
                      <Button
                        className="w-full rounded-xl font-bold text-xs h-10 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                        onClick={handleNavigateToDetail}
                      >
                        Xem quản lý chi tiết
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <GeographyScopeTree
                      zone={selectedZone}
                      selectedUnit={selectedUnit}
                      onSelectUnit={(type, data) =>
                        setSelectedUnit({ type, data })
                      }
                    />
                    <p className="text-[11px] text-slate-400 italic text-center pt-1">
                      Chọn một đơn vị trên cây phạm vi để xem chi tiết
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Right Column (lg:col-span-4): FIXED HEIGHT h-[480px] lg:h-[640px] Detail Panel */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-xl border-4 border-white h-[480px] lg:h-[640px] flex flex-col overflow-hidden p-4">
          {/* Fixed Header Inside Panel */}
          <div className="flex items-center justify-between border-b pb-2.5 mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-xs uppercase tracking-widest text-slate-700">
                Phạm vi địa lý cây trồng
              </span>
            </div>
            {selectedUnit && (
              <Badge
                variant="outline"
                className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                Đang xem chi tiết
              </Badge>
            )}
          </div>

          {/* Internal Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto split-scrollbar pr-1 space-y-4">
            {selectedUnit ? (
              <div className="animate-in fade-in duration-200 space-y-4">
                {/* Unit Type Badge & Code */}
                <div className="flex items-center justify-between">
                  <Badge
                    className={`uppercase font-bold px-2.5 py-1 text-[10px] ${
                      selectedUnit.type === "region"
                        ? "bg-blue-500 text-white"
                        : selectedUnit.type === "area"
                          ? "bg-emerald-500 text-white"
                          : "bg-orange-500 text-white"
                    }`}
                  >
                    {selectedUnit.type === "region"
                      ? "Vùng trồng"
                      : selectedUnit.type === "area"
                        ? "Khu vực"
                        : "Lô"}
                  </Badge>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {selectedUnit.data.id || "N/A"}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 leading-tight">
                  {selectedUnit.data.name}
                </h3>

                {/* Grid Stats: Area (ha) & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      Diện tích
                    </p>
                    <p className="text-base font-bold text-slate-800">
                      {selectedUnit.data.areaHa ||
                        selectedUnit.data.totalAreaHa ||
                        0}{" "}
                      ha
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      Trạng thái
                    </p>
                    <p className="text-sm font-bold text-emerald-600">
                      {selectedUnit.data.status || "Active"}
                    </p>
                  </div>
                </div>

                {/* Health Indicators (Sick & Treating trees) */}
                <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Chỉ số sức khỏe cây trồng
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-red-600 bg-red-50 border border-red-200 px-2 py-1.5 rounded-xl font-semibold">
                      <Activity className="w-3.5 h-3.5 shrink-0" />
                      <span>Bệnh: {selectedUnit.data.sickTrees || 0} cây</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1.5 rounded-xl font-semibold">
                      <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Điều trị: {selectedUnit.data.treatingTrees || 0} cây
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl font-bold text-xs h-9"
                    onClick={() => setSelectedUnit(null)}
                  >
                    Quay lại Cây địa lý
                  </Button>
                  <Button
                    className="w-full rounded-xl font-bold text-xs h-10 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                    onClick={handleNavigateToDetail}
                  >
                    Xem quản lý chi tiết
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Geography Scope Tree */}
                <GeographyScopeTree
                  zone={selectedZone}
                  selectedUnit={selectedUnit}
                  onSelectUnit={(type, data) => setSelectedUnit({ type, data })}
                />

                <p className="text-[11px] text-slate-400 italic text-center pt-1">
                  Chọn một đơn vị trên cây phạm vi để xem chi tiết
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
