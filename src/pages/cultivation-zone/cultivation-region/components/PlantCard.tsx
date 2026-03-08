import React, { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  cn,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tankhang1/eco-shared-ui";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Layers,
  MapPin,
  Target,
  Trash2,
} from "lucide-react";
import * as turf from "@turf/turf";
import useRegionStore from "../../../../stores/useRegionStore";
import { PlantEntry } from "./types";

interface PlantCardProps {
  plant: PlantEntry;
  index: number;
  geographicalUnits: any[];
  onUpdate: (partial: Partial<PlantEntry>) => void;
  onRemove: () => void;
  canRemove: boolean;
  isInvalidBoundary?: boolean;
}

export const PlantCard = ({
  plant,
  index,
  geographicalUnits,
  onUpdate,
  onRemove,
  canRemove,
  isInvalidBoundary,
}: PlantCardProps) => {
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

  // Ref to prevent the useEffect from clearing errors set by handleValidate
  const skipErrorReset = useRef(false);

  useEffect(() => {
    setTempLat(plant.coordinate?.lat?.toString() || "");
    setTempLng(plant.coordinate?.lng?.toString() || "");
    if (skipErrorReset.current) {
      skipErrorReset.current = false;
      return; // errors were just set by handleValidate — don't clear them
    }
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

    // Always run hierarchical detection: Plot (1) > Area (2) > Region (3)
    const pt = turf.point([lng, lat]);
    const sortedUnits = [...geographicalUnits].sort(
      (a, b) => a.level - b.level,
    );

    for (const unit of sortedUnits) {
      if (!unit.coordinates || unit.coordinates.length < 3) continue;
      try {
        const polyCoords = [
          ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
          [unit.coordinates[0].lng, unit.coordinates[0].lat],
        ];
        const poly = turf.polygon([polyCoords]);
        if (turf.booleanPointInPolygon(pt, poly)) {
          // Found the most specific unit — assign it
          onUpdate({
            coordinate: { lat, lng },
            plotId: unit.id,
            isInvalidBoundary: false,
          });
          setValidationError(null);
          setSuggestion(null);
          return;
        }
      } catch {
        // skip invalid polygons
      }
    }

    // Coordinate not inside any unit — mark invalid and suggest nearest boundary
    if (geographicalUnits.length === 0) {
      // No boundary data at all — just update coordinate freely
      onUpdate({ coordinate: { lat, lng } });
      setValidationError(null);
      setSuggestion(null);
      return;
    }

    let nearestSuggestion: { lat: number; lng: number } | null = null;
    let minDistance = Infinity;
    for (const unit of geographicalUnits) {
      if (!unit.coordinates || unit.coordinates.length < 3) continue;
      try {
        const polyCoords = [
          ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
          [unit.coordinates[0].lng, unit.coordinates[0].lat],
        ];
        const poly = turf.polygon([polyCoords]);
        const line = turf.polygonToLine(poly);
        const snapped = turf.nearestPointOnLine(line as any, pt);
        const dist = turf.distance(pt, snapped);
        if (dist < minDistance) {
          minDistance = dist;
          const [snapLng, snapLat] = snapped.geometry.coordinates;
          nearestSuggestion = { lat: snapLat, lng: snapLng };
        }
      } catch {}
    }

    skipErrorReset.current = true;
    onUpdate({ coordinate: { lat, lng }, isInvalidBoundary: true });
    setValidationError(
      "Toạ độ nằm ngoài mọi ranh giới. Vị trí gợi ý gần nhất được hiển thị bên dưới.",
    );
    setSuggestion(nearestSuggestion);
  };

  const selectedUnit = geographicalUnits.find((u) => u.id === plant.plotId);

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
          {/* Detected location display */}
          {(() => {
            if (!selectedUnit) {
              return (
                <div className="bg-amber-50 border border-dashed border-amber-200 rounded-xl p-4 text-center">
                  <div className="text-amber-600 text-[11px] font-medium mb-1">
                    Chưa xác định được đơn vị địa lý
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Vui lòng kéo marker trên bản đồ hoặc nhập tọa độ để nhận
                    diện.
                  </div>
                </div>
              );
            }

            // Build the ancestor chain from geographicalUnits
            // Try to get full context from the store
            const regionStore = useRegionStore.getState();
            let regionUnit: any = null;
            let areaUnit: any = null;
            let plotUnit: any = null;

            if (selectedUnit.level === 1) {
              plotUnit = selectedUnit;
              // Find parent area and region via store
              const pc = regionStore.getPlotById?.(selectedUnit.id);
              if (pc) {
                if (pc.area)
                  areaUnit = geographicalUnits.find(
                    (u: any) => u.id === pc.area.id?.toString(),
                  ) || {
                    id: pc.area.id?.toString(),
                    name: pc.area.name,
                    type: "Khu vực",
                    level: 2,
                  };
                if (pc.region)
                  regionUnit = geographicalUnits.find(
                    (u: any) => u.id === pc.region.id?.toString(),
                  ) || {
                    id: pc.region.id?.toString(),
                    name: pc.region.name,
                    type: "Vùng trồng",
                    level: 3,
                  };
              } else {
                // fallback: look up level 2 and 3 via name matching in geographicalUnits
                areaUnit = geographicalUnits.find((u: any) => u.level === 2);
                regionUnit = geographicalUnits.find((u: any) => u.level === 3);
              }
            } else if (selectedUnit.level === 2) {
              areaUnit = selectedUnit;
              const ac = regionStore.getAreaById?.(selectedUnit.id);
              if (ac?.region)
                regionUnit = geographicalUnits.find(
                  (u: any) => u.id === ac.region.id?.toString(),
                ) || {
                  id: ac.region.id?.toString(),
                  name: ac.region.name,
                  type: "Vùng trồng",
                  level: 3,
                };
              else
                regionUnit = geographicalUnits.find((u: any) => u.level === 3);
            } else {
              regionUnit = selectedUnit;
            }

            const chain = [regionUnit, areaUnit, plotUnit].filter(Boolean);

            const levelIcon = (level: number) => {
              if (level === 1)
                return (
                  <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                );
              if (level === 2)
                return (
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                );
              return (
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              );
            };

            return (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                {/* Header: detected unit summary */}
                <div className="flex items-center gap-3 p-3 border-b bg-slate-50/60">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {selectedUnit.type}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900 truncate">
                      {selectedUnit.name}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-white text-green-600 border-green-200 shrink-0"
                  >
                    Đã xác định
                  </Badge>
                </div>

                {/* Hierarchy chain */}
                <div className="px-3 py-2.5">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3" />
                    Phân cấp quản lý
                  </div>
                  <div className="space-y-2">
                    {chain.map((unit: any, i: number) => {
                      const indent = i * 20; // px indent per level
                      const iconSize = 32; // w-8 = 32px
                      const halfIcon = iconSize / 2; // center of icon horizontally
                      return (
                        <div
                          key={unit.id}
                          className="flex items-center gap-2.5 relative"
                          style={{ paddingLeft: `${indent}px` }}
                        >
                          {/* L-shaped connector for non-root items */}
                          {i > 0 && (
                            <>
                              {/* Vertical segment from parent's icon center down */}
                              <div
                                className="absolute bg-slate-200"
                                style={{
                                  left: `${indent - 20 + halfIcon - 1}px`,
                                  top: `-10px`,
                                  width: "1px",
                                  height: "calc(50% + 10px)",
                                }}
                              />
                              {/* Horizontal segment connecting vertical to this icon */}
                              <div
                                className="absolute bg-slate-200"
                                style={{
                                  left: `${indent - 20 + halfIcon - 1}px`,
                                  top: "50%",
                                  width: `${20 - halfIcon + halfIcon}px`,
                                  height: "1px",
                                }}
                              />
                            </>
                          )}
                          {levelIcon(unit.level)}
                          <div className="min-w-0">
                            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              {unit.type}
                            </div>
                            <div
                              className={cn(
                                "text-sm font-semibold truncate",
                                i === chain.length - 1
                                  ? "text-primary"
                                  : "text-slate-700",
                              )}
                            >
                              {unit.name}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

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
                        const lat = suggestion.lat;
                        const lng = suggestion.lng;
                        setTempLat(lat.toString());
                        setTempLng(lng.toString());

                        // Try hierarchical detection on the snapped point first
                        const pt = turf.point([lng, lat]);
                        const sorted = [...geographicalUnits].sort(
                          (a, b) => a.level - b.level,
                        );
                        let foundId = "";
                        for (const unit of sorted) {
                          if (!unit.coordinates || unit.coordinates.length < 3)
                            continue;
                          try {
                            const polyCoords = [
                              ...unit.coordinates.map((c: any) => [
                                c.lng,
                                c.lat,
                              ]),
                              [
                                unit.coordinates[0].lng,
                                unit.coordinates[0].lat,
                              ],
                            ];
                            const poly = turf.polygon([polyCoords]);
                            if (turf.booleanPointInPolygon(pt, poly)) {
                              foundId = unit.id;
                              break;
                            }
                          } catch {}
                        }

                        // If on-boundary (not strictly inside), pick nearest unit
                        if (!foundId && sorted.length > 0) {
                          let minDist = Infinity;
                          for (const unit of sorted) {
                            if (
                              !unit.coordinates ||
                              unit.coordinates.length < 3
                            )
                              continue;
                            try {
                              const polyCoords = [
                                ...unit.coordinates.map((c: any) => [
                                  c.lng,
                                  c.lat,
                                ]),
                                [
                                  unit.coordinates[0].lng,
                                  unit.coordinates[0].lat,
                                ],
                              ];
                              const poly = turf.polygon([polyCoords]);
                              const line = turf.polygonToLine(poly);
                              const snapped = turf.nearestPointOnLine(
                                line as any,
                                pt,
                              );
                              const d = turf.distance(pt, snapped);
                              if (d < minDist) {
                                minDist = d;
                                foundId = unit.id;
                              }
                            } catch {}
                          }
                        }

                        onUpdate({
                          coordinate: { lat, lng },
                          plotId: foundId || plant.plotId,
                          isInvalidBoundary: false,
                        });
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
