import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  useIsMobile,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin, Maximize2, Layers, ChevronDown, X } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation } from "wouter";
import type { DashboardZoneNode } from "../hooks/useDashboardData";

import {
  RedMarker,
  MapChildLayers,
  MapBoundsSync,
} from "./FarmerZoneMapChildLayers";
import {
  FarmerZoneMapUnitDetailPanel,
  type SelectedUnitState,
} from "./FarmerZoneMapUnitDetailPanel";
import { FarmerZoneSelectionModal } from "./FarmerZoneSelectionModal";

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
  const isMobile = useIsMobile();
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<SelectedUnitState | null>(
    null,
  );

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
      path = `/region-distribution/detail/${numericId}`;
    } else if (selectedUnit.type === "area") {
      path = `/area-distribution/detail/${numericId}`;
    } else if (selectedUnit.type === "plot") {
      path = `/plot-distribution/detail/${numericId}`;
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
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      {/* Điện thoại: gộp tiêu đề + nút chọn vùng thành 1 hàng bấm được */}
      {isMobile ? (
        <button
          type="button"
          onClick={() => setIsZoneDialogOpen(true)}
          className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 text-left shadow-sm active:bg-slate-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800">
              {selectedZone?.name || "Chọn vùng canh tác"}
            </p>
            <p className="truncate text-[11px] text-slate-500">
              {selectedZone?.description || "Bấm để chọn vùng"}
            </p>
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <ChevronDown className="h-4 w-4" />
          </span>
        </button>
      ) : (
        /* Header Section: Enterprise / Farmer Zone Title & Modal Dialog Trigger Button */
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
      )}

      {/* Modal Dialog for Zone Selection */}
      <FarmerZoneSelectionModal
        isOpen={isZoneDialogOpen}
        onOpenChange={setIsZoneDialogOpen}
        searchZoneQuery={searchZoneQuery}
        onSearchChange={setSearchZoneQuery}
        filteredZones={filteredZones}
        selectedZone={selectedZone}
        onSelectZone={handleSelectZone}
      />

      {/* Main Grid: Map Area & Detail Panel */}
      <div
        className={
          isMobile
            ? "grid grid-cols-1 gap-4"
            : "grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[640px]"
        }
      >
        {/* Left Column (lg:col-span-8): Map Area */}
        <div
          className={
            isMobile
              ? "rounded-2xl overflow-hidden border-2 border-white bg-white shadow-sm relative h-[300px] flex flex-col z-0"
              : "lg:col-span-8 rounded-2xl overflow-hidden border-4 border-white bg-white shadow-xl relative h-[480px] lg:h-[640px] flex flex-col z-0"
          }
        >
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
          <div
            className={
              isMobile
                ? "absolute top-3 right-3 z-10"
                : "absolute top-4 right-4 z-10"
            }
          >
            <button
              onClick={() => setIsMapExpanded(true)}
              className="p-2.5 rounded-xl bg-white/90 backdrop-blur-md shadow-xl hover:bg-white text-slate-600 transition-all active:scale-95 border border-white/60"
              title="Phóng to bản đồ"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Map Legend Overlay */}
          <div
            className={
              isMobile
                ? "absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-xl border border-white/60 space-y-1 text-[10px]"
                : "absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/60 space-y-2 text-xs"
            }
          >
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
          <DialogContent
            className={
              isMobile
                ? "max-w-full w-screen h-dvh p-0 overflow-hidden border-none shadow-2xl rounded-none z-[10000]"
                : "max-w-[96vw] w-[96vw] h-[92vh] p-0 overflow-hidden border-none shadow-2xl rounded-3xl z-[10000]"
            }
          >
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
                    onSelectUnit={(type, data) =>
                      setSelectedUnit({ type, data })
                    }
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
                <button
                  onClick={() => setIsMapExpanded(false)}
                  className="absolute top-4 right-4 z-[1000] p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl hover:bg-white text-slate-600 transition-all active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fullscreen Sidebar Tree — điện thoại: ẩn để bản đồ chiếm toàn màn hình */}
              {!isMobile && (
                <div className="w-[420px] bg-white border-l border-slate-200 p-4 overflow-y-auto shrink-0">
                  <FarmerZoneMapUnitDetailPanel
                    selectedZone={selectedZone}
                    selectedUnit={selectedUnit}
                    onSelectUnit={setSelectedUnit}
                    onNavigateToDetail={handleNavigateToDetail}
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Right Column (lg:col-span-4): Detail Panel */}
        <div
          className={
            isMobile
              ? "bg-white rounded-2xl shadow-sm border border-slate-200 max-h-[420px] flex flex-col overflow-hidden p-4"
              : "lg:col-span-4 bg-white rounded-2xl shadow-xl border-4 border-white h-[480px] lg:h-[640px] flex flex-col overflow-hidden p-4"
          }
        >
          <FarmerZoneMapUnitDetailPanel
            selectedZone={selectedZone}
            selectedUnit={selectedUnit}
            onSelectUnit={setSelectedUnit}
            onNavigateToDetail={handleNavigateToDetail}
          />
        </div>
      </div>
    </div>
  );
}
