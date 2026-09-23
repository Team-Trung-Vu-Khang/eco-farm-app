import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  MapPin,
  Maximize2,
  Plus,
  Sprout,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { MapContainer } from "react-leaflet";
import { PlantCard } from "./PlantCard";
import { AllPlantsMapContent } from "./AllPlantsMapContent";
import { PlantEntryTable } from "./PlantEntryTable";
import { type PlantEntry, type VarietyOption } from "./types";

interface Step2PlantEntryProps {
  plants: PlantEntry[];
  addPlant: () => string;
  removePlant: (id: string) => void;
  updatePlant: (id: string, partial: Partial<PlantEntry>) => void;
  scopedGeographicalUnits: any[];
  /** Giống cây (Foundation) của vùng canh tác chọn ở bước 1 */
  productionVarietyOptions?: VarietyOption[];
  initialData: any;
  isImportOpen: boolean;
  setIsImportOpen: (open: boolean) => void;
  isMapExpanded: boolean;
  setIsMapExpanded: (open: boolean) => void;
  effectiveActiveId: string;
  handleSetActiveEntry: (id: string) => void;
  suggestedCorrection: { entryId: string; lat: number; lng: number } | null;
  setSuggestedCorrection: (val: any) => void;
  mapCenter: [number, number];
  handleAutoAssign: (
    entryId: string,
    plotId: string,
    lat: number,
    lng: number,
  ) => void;
  validateAndSnapToUnit: (entryId: string, lat: number, lng: number) => void;
  radius?: number;
  setRadius?: (val: number) => void;
  hasOnlyCenterPoint?: boolean;
}

export const Step2PlantEntry: React.FC<Step2PlantEntryProps> = ({
  plants,
  addPlant,
  removePlant,
  updatePlant,
  scopedGeographicalUnits,
  productionVarietyOptions = [],
  initialData,
  setIsImportOpen,
  isMapExpanded,
  setIsMapExpanded,
  effectiveActiveId,
  handleSetActiveEntry,
  suggestedCorrection,
  setSuggestedCorrection,
  mapCenter,
  handleAutoAssign,
  validateAndSnapToUnit,
  radius = 100,
  setRadius,
  hasOnlyCenterPoint = false,
}) => {
  // Chế độ hiển thị: "card" (thêm thủ công — luôn ở view sửa, không cần danh sách)
  // hoặc "table" (upload theo danh sách — bảng + Sửa để vào view sửa có nút Xong)
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  // editingEntryId: cây đang sửa trong chế độ "table"; null = đang xem bảng
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const unplacedCount = plants.filter((p) => !p.plotId).length;
  const invalidCount = plants.filter(
    (p) => p.plotId && p.isInvalidBoundary,
  ).length;
  const noVarietyCount = plants.filter(
    (p) => !p.productionVariantId && !p.subjectVariantId,
  ).length;

  // Cây đang được sửa (context của toàn bộ view hiện tại)
  const currentEditing = plants.find((p) => p.entryId === editingEntryId) ?? null;
  const gridPlant =
    currentEditing ?? (viewMode === "card" ? (plants[0] ?? null) : null);

  const gridPlantIndex = gridPlant
    ? plants.findIndex((p) => p.entryId === gridPlant.entryId)
    : 0;

  const startEdit = (entryId: string) => {
    setSuggestedCorrection(null);
    handleSetActiveEntry(entryId);
    setEditingEntryId(entryId);
  };

  const exitEdit = () => {
    setIsMapExpanded(false);
    setSuggestedCorrection(null);
    setEditingEntryId(null);
  };

  const handleAddPlant = () => {
    const entryId = addPlant();
    handleSetActiveEntry(entryId);
    setEditingEntryId(entryId);
  };

  const handleRemovePlant = (entryId: string) => {
    if (editingEntryId === entryId) setEditingEntryId(null);
    removePlant(entryId);
  };

  // Chọn cây qua tab trên bản đồ: chế độ thủ công đổi luôn cây đang sửa
  const handleSelectPlant = (entryId: string) => {
    handleSetActiveEntry(entryId);
    setSuggestedCorrection(null);
    if (viewMode === "card") setEditingEntryId(entryId);
  };

  const mapActiveId =
    effectiveActiveId ||
    (viewMode === "card" ? (gridPlant?.entryId ?? "") : "");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-linear-to-r from-blue-50 via-white to-blue-50 p-5 shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: icon + title + description */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3 className="text-base font-bold text-blue-900">
                  Danh sách cây trồng
                </h3>
                <span className="shrink-0 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                  {plants.length} cây
                </span>
                {gridPlant && (
                  <span className="shrink-0 px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                    Đang sửa cây {gridPlantIndex + 1}
                  </span>
                )}
              </div>
              <p className="text-sm text-blue-700/80">
                {gridPlant
                  ? "Chọn vị trí trên bản đồ hoặc điền trực tiếp. Dữ liệu được lưu ngay khi chỉnh sửa."
                  : "Chọn một cây để sửa chi tiết, hoặc thêm mới / nhập từ Excel."}
              </p>
            </div>
          </div>

          {/* Right: add + import buttons (ẩn khi đang edit trong chế độ bảng) */}
          {!(viewMode === "table" && currentEditing) && (
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              {!initialData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddPlant}
                  className="bg-white hover:bg-blue-50 text-blue-700 border-blue-200 shrink-0"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Thêm cây
                </Button>
              )}
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
          )}
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
      </div>

      {/* Configuration bar for radius when region only has centerPoint */}
      {hasOnlyCenterPoint && (
        <div className="p-4 rounded-xl border border-blue-200 bg-linear-to-r from-blue-50/80 via-white to-blue-50/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/60 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-blue-950 flex items-center gap-2">
                Bán kính vùng canh tác
                <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                  CenterPoint Only
                </span>
              </div>
              <div className="text-xs text-blue-700/80">
                Vùng chưa có ranh giới polygon. Tự động dựng ranh giới hình tròn quanh tọa độ tâm để kiểm tra vị trí cây.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative w-32">
              <input
                type="number"
                min={10}
                max={5000}
                value={radius || 100}
                onChange={(e) => setRadius?.(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-1.5 text-sm font-semibold rounded-lg border border-blue-200 bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xs text-blue-950"
              />
              <span className="absolute right-2.5 top-2 text-xs font-bold text-slate-400 pointer-events-none">
                m
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[50, 100, 200, 500].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadius?.(r)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all border shadow-xs cursor-pointer",
                    radius === r
                      ? "bg-blue-600 text-white border-blue-600 font-bold"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
                  )}
                >
                  {r}m
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Warning: unplaced or out-of-boundary plants block next step */}
      {!gridPlant &&
        (() => {
          const unplaced = plants.filter((p) => !p.plotId);
          const invalid = plants.filter((p) => p.plotId && p.isInvalidBoundary);
          const noVariety = plants.filter(
            (p) => !p.productionVariantId && !p.subjectVariantId,
          );
          if (
            unplaced.length === 0 &&
            invalid.length === 0 &&
            noVariety.length === 0
          )
            return null;
          return (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 animate-in fade-in slide-in-from-top-1 duration-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
              <div className="text-sm space-y-0.5">
                {unplaced.length > 0 && (
                  <div>
                    <span className="font-bold">
                      {unplaced.length === 1
                        ? "1 cây chưa được xác định vị trí."
                        : `${unplaced.length} cây chưa được xác định vị trí.`}
                    </span>{" "}
                    Bấm Sửa cây đó rồi chọn vị trí trên bản đồ.
                  </div>
                )}
                {invalid.length > 0 && (
                  <div>
                    <span className="font-bold">
                      {invalid.length === 1
                        ? "1 cây đang nằm ngoài ranh giới hợp lệ."
                        : `${invalid.length} cây đang nằm ngoài ranh giới hợp lệ.`}
                    </span>{" "}
                    Bấm Sửa để áp dụng gợi ý hoặc di chuyển marker vào trong vùng hợp lệ.
                  </div>
                )}
                {noVariety.length > 0 && (
                  <div>
                    <span className="font-bold">
                      {noVariety.length === 1
                        ? "1 cây chưa chọn giống cây / hạt giống."
                        : `${noVariety.length} cây chưa chọn giống cây / hạt giống.`}
                    </span>{" "}
                    Chọn giống cây hoặc hạt giống cho từng cây khi sửa.
                  </div>
                )}
              </div>
            </div>
          );
        })()}

      {/* Summary chips + mode toggle */}
      {(viewMode === "card" || !currentEditing) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {plants.length} cây
            </span>
            {unplacedCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                {unplacedCount} chưa định vị
              </span>
            )}
            {invalidCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                {invalidCount} ngoài ranh giới
              </span>
            )}
            {noVarietyCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold">
                {noVarietyCount} thiếu giống
              </span>
            )}
          </div>
          <div className="inline-flex items-center gap-0.5 p-0.5 bg-slate-100 border border-slate-200 rounded-lg shrink-0 w-max">
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                viewMode === "card"
                  ? "bg-white shadow-sm text-blue-700"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              Thêm thủ công
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                viewMode === "table"
                  ? "bg-white shadow-sm text-blue-700"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              Upload danh sách
            </button>
          </div>
        </div>
      )}

      {viewMode === "card" && plants.length === 0 ? (
        /* Chế độ thêm thủ công, chưa có cây nào */
        <div className="py-16 text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-2xl">
          Chưa có cây nào. Bấm{" "}
          <span className="font-semibold text-blue-600">Thêm cây</span> hoặc{" "}
          <span className="font-semibold text-blue-600">Nhập từ Excel</span>.
        </div>
      ) : gridPlant ? (
        /* View chỉnh sửa: card form bên trái + bản đồ bên phải.
           Chế độ thủ công: không truyền onExitEdit → không có nút Xong.
           Chế độ bảng: có nút Xong để quay về bảng. */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <PlantCard
              plant={gridPlant}
              index={gridPlantIndex}
              geographicalUnits={scopedGeographicalUnits}
              productionVarietyOptions={productionVarietyOptions}
              onUpdate={(partial) => updatePlant(gridPlant.entryId, partial)}
              onRemove={() => handleRemovePlant(gridPlant.entryId)}
              canRemove={!initialData}
              isInvalidBoundary={gridPlant.isInvalidBoundary}
              forceExpanded
              onExitEdit={viewMode === "table" ? exitEdit : undefined}
            />
          </div>

          {/* Right: map — chỉ hiển thị khi đang sửa cây */}
          <div className="lg:sticky lg:top-6">
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b py-3 px-5">
                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Vị trí cây đang sửa
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
                      const isActive = mapActiveId === p.entryId;
                      const hasPlot = !!p.plotId;
                      return (
                        <button
                          type="button"
                          key={p.entryId}
                          onClick={() => handleSelectPlant(p.entryId)}
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
                  <div className="absolute z-[1000] bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-800 text-xs px-3 py-2.5 rounded-xl animate-in fade-in slide-in-from-top-1 duration-300 shadow-sm">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-500" />
                      <span>
                        <span className="font-bold">Ngoài phạm vi hợp lệ!</span>{" "}
                        Vị trí bạn chọn nằm ngoài phạm vi hợp lệ. Di chuyển marker
                        vào trong vùng hợp lệ hoặc áp dụng gợi ý.{" "}
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
                    "h-96 lg:h-125 relative z-0 transition-all duration-100 ease-in-out",
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
                      activeId={mapActiveId}
                      geographicalUnits={scopedGeographicalUnits}
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
      ) : (
        /* Chế độ bảng (upload danh sách): DataTable full-width, không hiển thị bản đồ */
        <PlantEntryTable
          plants={plants}
          allPlants={plants}
          geographicalUnits={scopedGeographicalUnits}
          canRemove={!initialData}
          onEdit={startEdit}
          onRemove={handleRemovePlant}
        />
      )}

      {/* Expanded map dialog — chỉ khả dụng khi đang sửa cây */}
      {gridPlant && (
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
                    const isActive = mapActiveId === p.entryId;
                    const hasPlot = !!p.plotId;
                    return (
                      <button
                        key={p.entryId}
                        type="button"
                        onClick={() => handleSelectPlant(p.entryId)}
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
                          <span className="ml-1 text-[10px] text-red-400">*</span>
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
                        <span className="font-bold">Ngoài phạm vi hợp lệ!</span>{" "}
                        Vị trí bạn chọn nằm ngoài phạm vi hợp lệ. Di chuyển marker
                        vào trong vùng hợp lệ hoặc áp dụng gợi ý.
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
                  zoom={17}
                  style={{ height: "100%", width: "100%" }}
                >
                  <AllPlantsMapContent
                    clickable={true}
                    plants={plants}
                    activeId={mapActiveId}
                    geographicalUnits={scopedGeographicalUnits}
                    setActiveEntryId={handleSetActiveEntry}
                    onPlantMove={validateAndSnapToUnit}
                    onAutoAssign={handleAutoAssign}
                    suggestedCorrection={suggestedCorrection}
                  />
                </MapContainer>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};