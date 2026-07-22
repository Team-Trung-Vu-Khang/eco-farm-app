import React, { useState, useMemo } from "react";
import {
  Badge,
  cn,
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
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronDown,
  ChevronRight,
  Layers,
  MapPin,
  Trash2,
  Search,
  Building,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { GeographicalHierarchyDisplay } from "./GeographicalHierarchyDisplay";
import type { PlantEntry } from "./types";

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
}: PlantCardProps) => {
  const [expanded, setExpanded] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

  const selectedUnit = useMemo(() => {
    return geographicalUnits.find((u) => u.id === plant.plotId);
  }, [geographicalUnits, plant.plotId]);

  // Centroid/center coordinate calculation
  const getUnitCenter = (unit: any): { lat: number; lng: number } => {
    if (unit && unit.coordinates && unit.coordinates.length > 0) {
      let latSum = 0;
      let lngSum = 0;
      unit.coordinates.forEach((c: any) => {
        latSum += c.lat;
        lngSum += c.lng;
      });
      return {
        lat: latSum / unit.coordinates.length,
        lng: lngSum / unit.coordinates.length,
      };
    }
    return { lat: 11.548, lng: 106.896 };
  };

  // Helper to build hierarchy display array for selectedUnit
  const selectedHierarchy = useMemo(() => {
    if (!selectedUnit) return [];

    let region: any = null;
    let area: any = null;
    let plot: any = null;

    if (selectedUnit.level === 3) {
      region = selectedUnit;
    } else if (selectedUnit.level === 2) {
      area = selectedUnit;
      if (selectedUnit.parentId) {
        region = geographicalUnits.find((u) => u.id === selectedUnit.parentId);
      }
    } else if (selectedUnit.level === 1) {
      plot = selectedUnit;
      if (selectedUnit.parentId) {
        area = geographicalUnits.find((u) => u.id === selectedUnit.parentId);
        if (area && area.parentId) {
          region = geographicalUnits.find((u) => u.id === area.parentId);
        }
      }
    }

    const res: any[] = [];
    if (region) {
      res.push({
        id: region.id,
        name: region.name,
        areas: area
          ? [
              {
                id: area.id,
                name: area.name,
                plots: plot
                  ? [
                      {
                        id: plot.id,
                        name: plot.name,
                      },
                    ]
                  : [],
              },
            ]
          : [],
      });
    } else if (area) {
      res.push({
        id: "temp-reg",
        name: "—",
        areas: [
          {
            id: area.id,
            name: area.name,
            plots: plot
              ? [
                  {
                    id: plot.id,
                    name: plot.name,
                  },
                ]
              : [],
          },
        ],
      });
    } else if (plot) {
      res.push({
        id: "temp-reg",
        name: "—",
        areas: [
          {
            id: "temp-area",
            name: "—",
            plots: [
              {
                id: plot.id,
                name: plot.name,
              },
            ],
          },
        ],
      });
    }

    return res;
  }, [selectedUnit, geographicalUnits]);

  const getUnitPath = (unit: any) => {
    const parts: string[] = [];
    let current = unit;
    while (current) {
      if (current.parentId) {
        const parent = geographicalUnits.find((u) => u.id === current.parentId);
        if (parent) {
          parts.unshift(parent.name);
          current = parent;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return parts.join(" → ");
  };

  // Grouping hierarchy
  const { regions, areasByRegion, plotsByArea, orphanAreas, orphanPlots } =
    useMemo(() => {
      const r: any[] = [];
      const abr: Record<string, any[]> = {};
      const pba: Record<string, any[]> = {};
      const oa: any[] = [];
      const op: any[] = [];

      geographicalUnits.forEach((u) => {
        if (u.level === 3) {
          r.push(u);
        } else if (u.level === 2) {
          if (u.parentId) {
            if (!abr[u.parentId]) abr[u.parentId] = [];
            abr[u.parentId].push(u);
          } else {
            oa.push(u);
          }
        } else if (u.level === 1) {
          if (u.parentId) {
            if (!pba[u.parentId]) pba[u.parentId] = [];
            pba[u.parentId].push(u);
          } else {
            op.push(u);
          }
        }
      });

      return {
        regions: r,
        areasByRegion: abr,
        plotsByArea: pba,
        orphanAreas: oa,
        orphanPlots: op,
      };
    }, [geographicalUnits]);

  // Tree states for collapsible rows
  const [expandedRegions, setExpandedRegions] = useState<string[]>(
    regions.map((r) => r.id),
  );
  const [expandedAreas, setExpandedAreas] = useState<string[]>(
    geographicalUnits.filter((u) => u.level === 2).map((a) => a.id),
  );

  const displayUnits = useMemo(() => {
    const lower = search.toLowerCase();
    const sorted = [...geographicalUnits].sort((a, b) => a.level - b.level);
    if (!lower) return sorted;
    return sorted.filter((u) => {
      const nameMatch = (u.name ?? "").toLowerCase().includes(lower);
      const typeMatch = (u.type ?? "").toLowerCase().includes(lower);
      const pathMatch = getUnitPath(u).toLowerCase().includes(lower);
      return nameMatch || typeMatch || pathMatch;
    });
  }, [geographicalUnits, search]);

  const levelIcon = (level: number) => {
    const iconClass = "w-4 h-4";
    switch (level) {
      case 3:
        return <Layers className={iconClass} />;
      case 2:
        return <MapPin className={iconClass} />;
      default:
        return <Building className={iconClass} />;
    }
  };

  const handleSelectUnit = (unit: any) => {
    onUpdate({
      plotId: unit.id,
      coordinate: getUnitCenter(unit),
      isInvalidBoundary: false,
    });
    setOpenModal(false);
  };

  return (
    <div
      id={`plant-${plant.entryId}`}
      className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white"
    >
      {/* Card Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 bg-slate-50 border-b cursor-pointer select-none"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-800 text-sm truncate flex items-center gap-2">
            {`Cá thể ${index + 1}`}
          </div>
        </div>

        {selectedUnit ? (
          <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/5 border border-primary/20 px-3 py-1 rounded-full font-medium shrink-0">
            {levelIcon(selectedUnit.level)}
            {selectedUnit.name}
          </div>
        ) : (
          <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-medium shrink-0">
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
              <Trash2 className="w-4 h-4" />
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
        <div className="p-5 space-y-4">
          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Position Picker */}
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <Label className="text-xs font-bold text-slate-700">
                Vị trí chăn nuôi (Chuồng/Lô/Khu vực){" "}
                <span className="text-red-500">*</span>
              </Label>
              {selectedUnit ? (
                <div className="relative group">
                  <GeographicalHierarchyDisplay
                    selectedHierarchy={selectedHierarchy}
                    onEdit={() => {
                      setSearch("");
                      setOpenModal(true);
                    }}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setOpenModal(true);
                  }}
                  className="w-full flex flex-col items-center justify-center py-6 text-center gap-2 text-muted-foreground hover:text-primary bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <MapPin className="w-6 h-6 text-slate-400" />
                  <div className="text-sm font-medium">
                    Chọn vị trí chăn nuôi...
                  </div>
                </button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`height-${plant.entryId}`} className="text-xs">
                Chiều cao (m/kg)
              </Label>
              <Input
                id={`height-${plant.entryId}`}
                type="number"
                step="0.1"
                placeholder="VD: 25.5"
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
                  <SelectTrigger className="w-28">
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
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <Label
                htmlFor={`date-${plant.entryId}`}
                className="text-xs flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Ngày nhận nuôi
              </Label>
              <Input
                type="date"
                value={plant.plantedDate}
                id={`date-${plant.entryId}`}
                onChange={(e) => onUpdate({ plantedDate: e.target.value })}
              />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor={`note-${plant.entryId}`} className="text-xs">
              Ghi chú
            </Label>
            <Input
              id={`note-${plant.entryId}`}
              placeholder="Nhập ghi chú thêm..."
              value={plant.note}
              onChange={(e) => onUpdate({ note: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Hierarchical location selector modal (Matching GeographicalScopeModal style) */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Chọn vị trí chăn nuôi
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Chọn một Vùng chăn nuôi, Khu vực hoặc Chuồng/Lô chăn nuôi cho cá
              thể này.
            </p>
          </DialogHeader>

          <div className="px-6 pb-5 border-b shrink-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Tìm kiếm vùng, khu vực, chuồng..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
              {search ? (
                // Search results matching search styling of GeographicalScopeModal
                <div className="space-y-2">
                  {displayUnits.length > 0 ? (
                    displayUnits.map((u) => {
                      const isSelected = plant.plotId === u.id;
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => handleSelectUnit(u)}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                            isSelected
                              ? "bg-primary/10 border-primary/40"
                              : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                              {levelIcon(u.level)}
                            </div>
                            <div className="text-left">
                              <div className="font-bold text-slate-800 text-sm">
                                {u.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                {u.type}
                              </div>
                            </div>
                          </div>
                          {isSelected ? (
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded border-2 border-slate-200 shrink-0" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-sm italic">
                      Không tìm thấy vị trí khớp với từ khóa
                    </div>
                  )}
                </div>
              ) : (
                // Hierarchical tree view matching GeographicalScopeModal
                <div className="space-y-4">
                  {regions.map((r) => {
                    const regAreas = areasByRegion[r.id] || [];
                    const isSelected = plant.plotId === r.id;
                    const isExpanded = expandedRegions.includes(r.id);

                    return (
                      <div key={r.id} className="space-y-2">
                        <div className="flex items-center gap-2 group">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedRegions((prev) =>
                                prev.includes(r.id)
                                  ? prev.filter((x) => x !== r.id)
                                  : [...prev, r.id],
                              )
                            }
                            className="p-1 hover:bg-slate-100 rounded transition-colors shrink-0"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                          <div
                            onClick={() => handleSelectUnit(r)}
                            className={cn(
                              "flex-1 flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                              isSelected
                                ? "bg-primary/10 border-primary/40"
                                : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <Layers className="w-4 h-4" />
                              </div>
                              <div className="text-left">
                                <div className="font-bold text-slate-800 text-sm">
                                  {r.name}
                                </div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                  Vùng chăn nuôi
                                </div>
                              </div>
                            </div>
                            {isSelected ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] bg-primary/10 text-primary border-none"
                                >
                                  Đã chọn
                                </Badge>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded border-2 border-slate-200 group-hover:border-primary transition-colors shrink-0" />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="ml-6 pl-4 border-l-2 border-slate-100 space-y-2 py-1">
                            {regAreas.map((area) => {
                              const areaPlots = plotsByArea[area.id] || [];
                              const isAreaSelected = plant.plotId === area.id;
                              const isAreaExpanded = expandedAreas.includes(
                                area.id,
                              );

                              return (
                                <div key={area.id} className="space-y-2">
                                  <div className="flex items-center gap-2 group">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedAreas((prev) =>
                                          prev.includes(area.id)
                                            ? prev.filter((x) => x !== area.id)
                                            : [...prev, area.id],
                                        )
                                      }
                                      className="p-1 hover:bg-slate-100 rounded transition-colors shrink-0"
                                    >
                                      {isAreaExpanded ? (
                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                      ) : (
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                      )}
                                    </button>
                                    <div
                                      onClick={() => handleSelectUnit(area)}
                                      className={cn(
                                        "flex-1 flex items-center justify-between p-2.5 rounded-xl border-2 transition-all cursor-pointer",
                                        isAreaSelected
                                          ? "bg-primary/10 border-primary/40"
                                          : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                                      )}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                                          <MapPin className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-slate-700 text-xs text-left">
                                          {area.name}
                                        </span>
                                      </div>
                                      {isAreaSelected ? (
                                        <div className="flex items-center gap-2">
                                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                          <Badge
                                            variant="secondary"
                                            className="text-[9px] bg-primary/10 text-primary border-none h-4 py-0"
                                          >
                                            Đã chọn
                                          </Badge>
                                        </div>
                                      ) : (
                                        <div className="w-4 h-4 rounded border border-slate-200 group-hover:border-primary transition-colors shrink-0" />
                                      )}
                                    </div>
                                  </div>

                                  {isAreaExpanded && (
                                    <div className="ml-5 pl-4 border-l-2 border-slate-50 space-y-1 py-1">
                                      {areaPlots.map((plot) => {
                                        const isPlotSelected =
                                          plant.plotId === plot.id;

                                        return (
                                          <div
                                            key={plot.id}
                                            onClick={() =>
                                              handleSelectUnit(plot)
                                            }
                                            className={cn(
                                              "flex items-center justify-between p-2 rounded-lg border-2 transition-all cursor-pointer group",
                                              isPlotSelected
                                                ? "bg-primary/10 border-primary/40"
                                                : "bg-white border-slate-50 hover:border-primary/20 hover:bg-slate-50",
                                            )}
                                          >
                                            <div className="flex items-center gap-2.5">
                                              <div
                                                className={cn(
                                                  "w-2 h-2 rounded-full transition-colors",
                                                  isPlotSelected
                                                    ? "bg-primary"
                                                    : "bg-slate-200 group-hover:bg-primary/50",
                                                )}
                                              />
                                              <span className="font-medium text-slate-600 text-xs text-left">
                                                {plot.name}
                                              </span>
                                            </div>
                                            {isPlotSelected ? (
                                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                                            ) : (
                                              <div className="w-3.5 h-3.5 rounded border border-slate-200 group-hover:border-primary transition-colors shrink-0" />
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Orphan Areas / Plots if any */}
                  {orphanAreas.length > 0 &&
                    orphanAreas.map((area) => {
                      const areaPlots = plotsByArea[area.id] || [];
                      const isAreaSelected = plant.plotId === area.id;
                      const isAreaExpanded = expandedAreas.includes(area.id);

                      return (
                        <div key={area.id} className="space-y-2">
                          <div className="flex items-center gap-2 group">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedAreas((prev) =>
                                  prev.includes(area.id)
                                    ? prev.filter((x) => x !== area.id)
                                    : [...prev, area.id],
                                )
                              }
                              className="p-1 hover:bg-slate-100 rounded transition-colors shrink-0"
                            >
                              {isAreaExpanded ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                            <div
                              onClick={() => handleSelectUnit(area)}
                              className={cn(
                                "flex-1 flex items-center justify-between p-2.5 rounded-xl border-2 transition-all cursor-pointer",
                                isAreaSelected
                                  ? "bg-primary/10 border-primary/40"
                                  : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-slate-800 text-sm text-left">
                                  {area.name}
                                </span>
                              </div>
                              {isAreaSelected ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] bg-primary/10 text-primary border-none"
                                  >
                                    Đã chọn
                                  </Badge>
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded border border-slate-200 group-hover:border-primary transition-colors shrink-0" />
                              )}
                            </div>
                          </div>

                          {isAreaExpanded && (
                            <div className="ml-6 pl-4 border-l-2 border-slate-100 space-y-2 py-1">
                              {areaPlots.map((plot) => {
                                const isPlotSelected = plant.plotId === plot.id;

                                return (
                                  <div
                                    key={plot.id}
                                    onClick={() => handleSelectUnit(plot)}
                                    className={cn(
                                      "flex items-center justify-between p-2 rounded-lg border-2 transition-all cursor-pointer",
                                      isPlotSelected
                                        ? "bg-primary/10 border-primary/40"
                                        : "bg-white border-slate-50 hover:border-primary/20 hover:bg-slate-50",
                                    )}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <div
                                        className={cn(
                                          "w-2 h-2 rounded-full transition-colors",
                                          isPlotSelected
                                            ? "bg-primary"
                                            : "bg-slate-200 group-hover:bg-primary/50",
                                        )}
                                      />
                                      <span className="font-medium text-slate-600 text-xs text-left">
                                        {plot.name}
                                      </span>
                                    </div>
                                    {isPlotSelected ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                                    ) : (
                                      <div className="w-3.5 h-3.5 rounded border border-slate-200 group-hover:border-primary transition-colors shrink-0" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                  {orphanPlots.length > 0 && (
                    <div className="space-y-2 pl-6">
                      {orphanPlots.map((plot) => {
                        const isPlotSelected = plant.plotId === plot.id;

                        return (
                          <div
                            key={plot.id}
                            onClick={() => handleSelectUnit(plot)}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-lg border-2 transition-all cursor-pointer",
                              isPlotSelected
                                ? "bg-primary/10 border-primary/40"
                                : "bg-white border-slate-50 hover:border-primary/20 hover:bg-slate-50",
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={cn(
                                  "w-2 h-2 rounded-full transition-colors",
                                  isPlotSelected
                                    ? "bg-primary"
                                    : "bg-slate-200 group-hover:bg-primary/50",
                                )}
                              />
                              <span className="font-medium text-slate-600 text-xs text-left">
                                {plot.name}
                              </span>
                            </div>
                            {isPlotSelected ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded border border-slate-200 group-hover:border-primary transition-colors shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
