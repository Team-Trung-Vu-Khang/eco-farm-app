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
import { MapContainer } from "react-leaflet";
import { PlantCard } from "./PlantCard";
import { AllPlantsMapContent } from "./AllPlantsMapContent";
import { type PlantEntry } from "./types";

interface Step2PlantEntryProps {
  plants: PlantEntry[];
  addPlant: () => void;
  removePlant: (id: string) => void;
  updatePlant: (id: string, partial: Partial<PlantEntry>) => void;
  scopedGeographicalUnits: any[];
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
}

export const Step2PlantEntry: React.FC<Step2PlantEntryProps> = ({
  plants,
  addPlant,
  removePlant,
  updatePlant,
  scopedGeographicalUnits,
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
}) => {
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
              </div>
              <p className="text-sm text-blue-700/80">
                Mỗi cây có thể thuộc một lô/vị trí khác nhau trong vùng canh
                tác.
              </p>
            </div>
          </div>

          {/* Right: import button */}
          {!initialData && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportOpen(true)}
              className="bg-white hover:bg-blue-50 text-blue-700 border-blue-200 sm:w-auto shrink-0"
            >
              <Upload className="w-4 h-4 mr-2" /> Nhập từ Excel
            </Button>
          )}
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
      </div>

      {/* Warning: unplaced or out-of-boundary plants block next step */}
      {(() => {
        const unplaced = plants.filter((p) => !p.plotId);
        const invalid = plants.filter((p) => p.plotId && p.isInvalidBoundary);
        if (unplaced.length === 0 && invalid.length === 0) return null;
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
                  Bấm vào lô trên bản đồ để đặt vị trí.
                </div>
              )}
              {invalid.length > 0 && (
                <div>
                  <span className="font-bold">
                    {invalid.length === 1
                      ? "1 cây đang nằm ngoài ranh giới hợp lệ."
                      : `${invalid.length} cây đang nằm ngoài ranh giới hợp lệ.`}
                  </span>{" "}
                  Áp dụng gợi ý hoặc di chuyển marker vào trong vùng hợp lệ.
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Plant list */}
        <div className="space-y-4">
          {plants.map((plant, idx) => (
            <PlantCard
              key={plant.entryId}
              plant={plant}
              index={idx}
              geographicalUnits={scopedGeographicalUnits}
              onUpdate={(partial) => updatePlant(plant.entryId, partial)}
              onRemove={() => removePlant(plant.entryId)}
              canRemove
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
                    activeId={effectiveActiveId}
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
                  activeId={effectiveActiveId}
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
    </div>
  );
};
