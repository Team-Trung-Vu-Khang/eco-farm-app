import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Layers,
  MapPin,
  Search,
  CheckSquare,
  Square,
  Lock,
} from "lucide-react";

export interface MockPlot {
  id: string;
  code: string;
  name: string;
}

export interface MockArea {
  id: string;
  code: string;
  name: string;
  plots: MockPlot[];
}

export interface MockRegion {
  id: string;
  code: string;
  name: string;
  areas: MockArea[];
}

export interface SelectedGeographicalItem {
  id: string;
  codeName: string;
  label: string;
  type: "region" | "area" | "plot";
}

export const MOCK_GEOGRAPHICAL_DATA: MockRegion[] = [
  {
    id: "region-1",
    code: "VCA",
    name: "Vùng Canh Tác Lúa A",
    areas: [
      {
        id: "area-11",
        code: "KHU-A1",
        name: "Khu A1 (Lúa hữu cơ)",
        plots: [
          { id: "plot-101", code: "LO-01", name: "Lô 01 — Ruộng giống ST25" },
          { id: "plot-102", code: "LO-02", name: "Lô 02 — Ruộng hữu cơ đợt 1" },
          { id: "plot-103", code: "LO-03", name: "Lô 03 — Ruộng hữu cơ đợt 2" },
        ],
      },
      {
        id: "area-12",
        code: "KHU-A2",
        name: "Khu A2 (Lúa thử nghiệm)",
        plots: [
          { id: "plot-104", code: "LO-04", name: "Lô 04 — Ruộng thử nghiệm N01" },
          { id: "plot-105", code: "LO-05", name: "Lô 05 — Ruộng thử nghiệm N02" },
        ],
      },
    ],
  },
  {
    id: "region-2",
    code: "VCB",
    name: "Vùng Canh Tác Rau B",
    areas: [
      {
        id: "area-21",
        code: "KHU-B1",
        name: "Khu B1 (Rau ăn lá VietGAP)",
        plots: [
          { id: "plot-201", code: "LO-06", name: "Lô 06 — Luống cải ngọt" },
          { id: "plot-202", code: "LO-07", name: "Lô 07 — Luống xà lách" },
        ],
      },
      {
        id: "area-22",
        code: "KHU-B2",
        name: "Khu B2 (Củ quả an toàn)",
        plots: [
          { id: "plot-203", code: "LO-08", name: "Lô 08 — Luống cà chua" },
          { id: "plot-204", code: "LO-09", name: "Lô 09 — Luống dưa leo" },
          { id: "plot-205", code: "LO-10", name: "Lô 10 — Luống ớt chuông" },
        ],
      },
    ],
  },
  {
    id: "region-3",
    code: "VCC",
    name: "Vùng Canh Tác Cây Ăn Trái C",
    areas: [
      {
        id: "area-31",
        code: "KHU-C1",
        name: "Khu C1 (Vườn xoài Cát Hòa Lộc)",
        plots: [
          { id: "plot-301", code: "LO-11", name: "Lô 11 — Vườn xoài A1" },
          { id: "plot-302", code: "LO-12", name: "Lô 12 — Vườn xoài A2" },
        ],
      },
    ],
  },
];

interface HarvestGeographicalSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItems?: SelectedGeographicalItem[];
  onConfirmSelections?: (items: SelectedGeographicalItem[]) => void;
  onSelect?: (selectedPath: string) => void;
  initialValue?: string;
}

export function HarvestGeographicalSelectorDialog({
  open,
  onOpenChange,
  selectedItems = [],
  onConfirmSelections,
  onSelect,
}: HarvestGeographicalSelectorDialogProps) {
  const [search, setSearch] = useState("");
  const [tempItems, setTempItems] = useState<SelectedGeographicalItem[]>(selectedItems);

  // Sync temp items when modal opens
  useEffect(() => {
    if (open) {
      setTempItems(selectedItems);
    }
  }, [open, selectedItems]);

  // Expand states for regions and areas
  const [expandedRegions, setExpandedRegions] = useState<string[]>(
    MOCK_GEOGRAPHICAL_DATA.map((r) => r.id),
  );
  const [expandedAreas, setExpandedAreas] = useState<string[]>(
    MOCK_GEOGRAPHICAL_DATA.flatMap((r) => r.areas.map((a) => a.id)),
  );

  const toggleExpandRegion = (id: string) => {
    setExpandedRegions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const toggleExpandArea = (id: string) => {
    setExpandedAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const isItemSelected = (id: string) => tempItems.some((item) => item.id === id);

  // Select/Unselect Region (Clears all child Areas and Plots inside this Region)
  const toggleRegionSelect = (region: MockRegion) => {
    const isSelected = isItemSelected(region.id);
    if (isSelected) {
      setTempItems((prev) => prev.filter((i) => i.id !== region.id));
    } else {
      // Remove any child areas and child plots under this region
      const childAreaIds = new Set(region.areas.map((a) => a.id));
      const childPlotIds = new Set(region.areas.flatMap((a) => a.plots.map((p) => p.id)));

      setTempItems((prev) => {
        const cleaned = prev.filter(
          (i) => !childAreaIds.has(i.id) && !childPlotIds.has(i.id),
        );
        return [
          ...cleaned,
          {
            id: region.id,
            codeName: region.name,
            label: region.name,
            type: "region",
          },
        ];
      });
    }
  };

  // Select/Unselect Area (Clears all child Plots inside this Area)
  const toggleAreaSelect = (region: MockRegion, area: MockArea) => {
    if (isItemSelected(region.id)) return; // Covered by parent Region

    const isSelected = isItemSelected(area.id);
    if (isSelected) {
      setTempItems((prev) => prev.filter((i) => i.id !== area.id));
    } else {
      // Remove any child plots under this area
      const childPlotIds = new Set(area.plots.map((p) => p.id));
      const areaPath = `${region.name} › ${area.name}`;

      setTempItems((prev) => {
        const cleaned = prev.filter((i) => !childPlotIds.has(i.id));
        return [
          ...cleaned,
          {
            id: area.id,
            codeName: areaPath,
            label: area.name,
            type: "area",
          },
        ];
      });
    }
  };

  // Select/Unselect Plot
  const togglePlotSelect = (region: MockRegion, area: MockArea, plot: MockPlot) => {
    if (isItemSelected(region.id) || isItemSelected(area.id)) return; // Covered by parent Region or Area

    const isSelected = isItemSelected(plot.id);
    if (isSelected) {
      setTempItems((prev) => prev.filter((i) => i.id !== plot.id));
    } else {
      const plotPath = `${region.name} › ${area.name} › ${plot.name}`;
      setTempItems((prev) => [
        ...prev,
        {
          id: plot.id,
          codeName: plotPath,
          label: plot.name,
          type: "plot",
        },
      ]);
    }
  };

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return MOCK_GEOGRAPHICAL_DATA;

    return MOCK_GEOGRAPHICAL_DATA.map((region) => {
      const matchRegion =
        region.name.toLowerCase().includes(query) ||
        region.code.toLowerCase().includes(query);

      const filteredAreas = region.areas
        .map((area) => {
          const matchArea =
            area.name.toLowerCase().includes(query) ||
            area.code.toLowerCase().includes(query);

          const filteredPlots = area.plots.filter(
            (plot) =>
              plot.name.toLowerCase().includes(query) ||
              plot.code.toLowerCase().includes(query),
          );

          if (matchArea || filteredPlots.length > 0) {
            return {
              ...area,
              plots: matchArea ? area.plots : filteredPlots,
            };
          }
          return null;
        })
        .filter(Boolean) as MockArea[];

      if (matchRegion || filteredAreas.length > 0) {
        return {
          ...region,
          areas: matchRegion ? region.areas : filteredAreas,
        };
      }
      return null;
    }).filter(Boolean) as MockRegion[];
  }, [search]);

  const handleConfirm = () => {
    if (onConfirmSelections) {
      onConfirmSelections(tempItems);
    }
    if (onSelect && tempItems.length > 0) {
      onSelect(tempItems[0].codeName);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
            <MapPin className="w-5 h-5 text-orange-500" />
            Chọn các vùng địa lý thu hoạch
          </DialogTitle>
          <p className="text-xs text-slate-500 mt-1">
            Quy tắc: Khi chọn <b>Vùng</b> thì không chọn <b>Khu/Lô</b> thuộc vùng đó; khi chọn <b>Khu</b> thì không chọn các <b>Lô</b> con thuộc khu đó.
          </p>
        </DialogHeader>

        {/* Search */}
        <div className="px-6 py-4 border-b shrink-0 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 z-10" />
            <Input
              placeholder="Tìm kiếm vùng, khu vực, lô..."
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tree List */}
        <ScrollArea className="flex-1 p-6 overflow-y-auto max-h-[420px]">
          <div className="space-y-4">
            {filteredData.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Không tìm thấy vùng địa lý phù hợp
              </div>
            ) : (
              filteredData.map((region) => {
                const isRegExpanded = expandedRegions.includes(region.id);
                const regSelected = isItemSelected(region.id);

                return (
                  <div
                    key={region.id}
                    className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-xs"
                  >
                    {/* Region Row */}
                    <div
                      className={`flex items-center justify-between p-3 transition-colors cursor-pointer ${
                        regSelected
                          ? "bg-orange-50/90 border-orange-200"
                          : "hover:bg-slate-50"
                      }`}
                      onClick={() => toggleRegionSelect(region)}
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandRegion(region.id);
                          }}
                          className="p-1 hover:bg-slate-200/50 rounded-md text-slate-400"
                        >
                          {isRegExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        <Layers className="w-4 h-4 text-orange-500 shrink-0" />
                        <div className="flex-1 truncate">
                          <span className="text-xs font-bold text-slate-800">
                            {region.name}
                          </span>
                          <span className="ml-2 font-mono text-[10px] text-slate-400">
                            [{region.code}]
                          </span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant={regSelected ? "default" : "outline"}
                        className={`h-7 px-2.5 text-[11px] font-semibold rounded-lg ${
                          regSelected
                            ? "bg-orange-500 text-white"
                            : "border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRegionSelect(region);
                        }}
                      >
                        {regSelected ? (
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        ) : null}
                        {regSelected ? "Đã chọn Vùng" : "Chọn vùng"}
                      </Button>
                    </div>

                    {/* Areas */}
                    {isRegExpanded && (
                      <div className="pl-6 pr-3 py-2 space-y-2 bg-slate-50/30 border-t border-slate-100">
                        {region.areas.map((area) => {
                          const isAreaExpanded = expandedAreas.includes(area.id);
                          const areaSelected = isItemSelected(area.id);
                          const isParentRegSelected = regSelected;

                          return (
                            <div
                              key={area.id}
                              className={`border rounded-lg bg-white overflow-hidden transition-all ${
                                isParentRegSelected ? "opacity-75 border-slate-100 bg-slate-50/60" : "border-slate-100"
                              }`}
                            >
                              <div
                                className={`flex items-center justify-between p-2.5 transition-all ${
                                  isParentRegSelected
                                    ? "cursor-not-allowed bg-slate-50/80"
                                    : areaSelected
                                    ? "bg-amber-50/80 border-amber-200 cursor-pointer"
                                    : "hover:bg-slate-50 cursor-pointer"
                                }`}
                                onClick={() => {
                                  if (!isParentRegSelected) {
                                    toggleAreaSelect(region, area);
                                  }
                                }}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleExpandArea(area.id);
                                    }}
                                    className="p-0.5 hover:bg-slate-200/50 rounded text-slate-400"
                                  >
                                    {isAreaExpanded ? (
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    ) : (
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                  <span className="text-xs font-semibold text-slate-700 truncate">
                                    {area.name}
                                  </span>
                                  <span className="font-mono text-[10px] text-slate-400">
                                    [{area.code}]
                                  </span>
                                </div>

                                {isParentRegSelected ? (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] bg-slate-100 text-slate-400 border-slate-200 gap-1"
                                  >
                                    <Lock className="w-3 h-3 text-slate-400" />
                                    Đã thuộc Vùng đã chọn
                                  </Badge>
                                ) : (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant={areaSelected ? "default" : "outline"}
                                    className={`h-6 px-2 text-[10px] font-semibold rounded-md ${
                                      areaSelected
                                        ? "bg-amber-500 text-white"
                                        : "border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-600"
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleAreaSelect(region, area);
                                    }}
                                  >
                                    {areaSelected ? (
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                    ) : null}
                                    {areaSelected ? "Đã chọn Khu" : "Chọn khu"}
                                  </Button>
                                )}
                              </div>

                              {/* Plots */}
                              {isAreaExpanded && (
                                <div className="pl-6 pr-2 py-2 space-y-1.5 border-t border-slate-50 bg-slate-50/50">
                                  {area.plots.map((plot) => {
                                    const plotSelected = isItemSelected(plot.id);
                                    const isParentAreaSelected = areaSelected;
                                    const isCoveredByParent = isParentRegSelected || isParentAreaSelected;

                                    return (
                                      <div
                                        key={plot.id}
                                        onClick={() => {
                                          if (!isCoveredByParent) {
                                            togglePlotSelect(region, area, plot);
                                          }
                                        }}
                                        className={`flex items-center justify-between p-2 rounded-md border text-xs transition-all ${
                                          isCoveredByParent
                                            ? "opacity-60 bg-slate-100/60 border-slate-100 cursor-not-allowed text-slate-400"
                                            : plotSelected
                                            ? "border-emerald-300 bg-emerald-50/90 font-bold text-emerald-800 cursor-pointer shadow-xs"
                                            : "border-slate-100 bg-white hover:border-emerald-200 text-slate-700 cursor-pointer"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 truncate">
                                          {isCoveredByParent ? (
                                            <Lock className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                          ) : plotSelected ? (
                                            <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                          ) : (
                                            <Square className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                          )}
                                          <span className="truncate">{plot.name}</span>
                                          <span className="font-mono text-[10px] text-slate-400">
                                            [{plot.code}]
                                          </span>
                                        </div>

                                        {isCoveredByParent ? (
                                          <span className="text-[10px] text-slate-400 italic">
                                            (Đã thuộc {isParentRegSelected ? "Vùng" : "Khu"})
                                          </span>
                                        ) : plotSelected ? (
                                          <Badge className="bg-emerald-100 text-emerald-700 border-none text-[10px] py-0 px-1.5">
                                            Đã chọn Lô
                                          </Badge>
                                        ) : null}
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
              })
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 truncate flex-1">
            {tempItems.length > 0 ? (
              <span>
                Đã chọn:{" "}
                <span className="font-bold text-orange-700">
                  {tempItems.length} đơn vị địa lý
                </span>
              </span>
            ) : (
              "Chưa chọn vị trí nào"
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 px-4 text-xs rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirm}
              className="h-9 px-5 text-xs font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white"
            >
              Xác nhận lựa chọn ({tempItems.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
