import {
  Badge,
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
} from "@tankhang1/eco-shared-ui";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Layers,
  MapPin,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";
import type { TreeData } from "./GeographicalTree";

interface GeographicalScopeModalProps {
  selectedScopeIds: string[];
  onSelect: (ids: string[]) => void;
  treeData: TreeData;
  regionStore: any;
  customTrigger?: React.ReactNode;
}

export const GeographicalScopeModal = ({
  selectedScopeIds,
  onSelect,
  treeData,
  regionStore,
  customTrigger,
}: GeographicalScopeModalProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tempIds, setTempIds] = useState<string[]>(selectedScopeIds);
  const {
    regions,
    areas,
    plots,
    areasByRegion,
    plotsByArea,
    selectedScopeUnits,
  } = treeData;

  const [expandedRegions, setExpandedRegions] = useState<string[]>(
    regions.map((r) => r.id),
  );
  const [expandedAreas, setExpandedAreas] = useState<string[]>(
    areas.map((a) => a.id),
  );

  const lowerSearch = search.toLowerCase();
  const filteredRegions = regions.filter(
    (r) => !search || r.name.toLowerCase().includes(lowerSearch),
  );

  const toggleId = (id: string, level: number) => {
    const isCurrentlySelected = tempIds.includes(id);

    if (isCurrentlySelected) {
      setTempIds([]);
      return;
    }

    const nextIds = new Set<string>();

    if (level === 3) {
      nextIds.add(id);
      const regionAreas = areasByRegion[id] || [];
      regionAreas.forEach((area) => {
        nextIds.add(area.id);
        (plotsByArea[area.id] || []).forEach((plot) => nextIds.add(plot.id));
      });
    } else if (level === 2) {
      nextIds.add(id);
      (plotsByArea[id] || []).forEach((plot) => nextIds.add(plot.id));
    } else {
      nextIds.add(id);
    }

    setTempIds(Array.from(nextIds));
  };

  const confirm = () => {
    onSelect(tempIds);
    setOpen(false);
  };

  return (
    <>
      {customTrigger ? (
        <div
          onClick={() => {
            setTempIds(selectedScopeIds);
            setOpen(true);
          }}
        >
          {customTrigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setTempIds(selectedScopeIds);
            setOpen(true);
          }}
          className="h-8 px-3 text-xs cursor-pointer border border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary font-bold gap-2 transition-all rounded-lg flex items-center justify-center shrink-0"
        >
          <Plus className="w-3 h-3" />
          {selectedScopeUnits.length > 0
            ? `Chỉnh sửa (${selectedScopeUnits.length})`
            : "Chọn vị trí địa lý"}
        </button>
      )}

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setSearch("");
        }}
      >
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Chọn phạm vi địa lý
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Chọn một Vùng trồng, Khu vực hoặc Lô đất. Cây trồng ở bước 2 sẽ bị
              giới hạn trong phạm vi đã chọn.
            </p>
          </DialogHeader>

          <div className="px-6 pb-5 border-b shrink-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Tìm kiếm vùng, khu vực, lô..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
              {filteredRegions.length === 0 && regions.length > 0 && search && (
                <div className="space-y-2">
                  {areas
                    .filter((a) => a.name.toLowerCase().includes(lowerSearch))
                    .map((area: any) => {
                      const ac = regionStore.getAreaById?.(area.id);
                      const rid = ac?.region?.id?.toString() || "";
                      const isInherited = tempIds.includes(rid);

                      return (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => toggleId(area.id, 2)}
                          disabled={isInherited}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                            tempIds.includes(area.id)
                              ? "bg-primary/10 border-primary/40"
                              : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                            isInherited && "opacity-60 cursor-not-allowed",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                              <Layers className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-sm">
                                {area.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                Khu vực
                              </div>
                            </div>
                          </div>
                          {tempIds.includes(area.id) ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          ) : (
                            <div className="w-5 h-5 rounded border-2 border-slate-200" />
                          )}
                        </button>
                      );
                    })}
                  {plots
                    .filter((p) => p.name.toLowerCase().includes(lowerSearch))
                    .map((plot: any) => {
                      const pc = regionStore.getPlotById?.(plot.id);
                      const aid = pc?.area?.id?.toString() || "";
                      const ac = regionStore.getAreaById?.(aid);
                      const rid = ac?.region?.id?.toString() || "";
                      const isInherited =
                        tempIds.includes(rid) || tempIds.includes(aid);

                      return (
                        <button
                          key={plot.id}
                          type="button"
                          onClick={() => toggleId(plot.id, 1)}
                          disabled={isInherited}
                          className={cn(
                            "w-full flex items-center justify-between p-2.5 rounded-lg border-2 transition-all cursor-pointer",
                            tempIds.includes(plot.id)
                              ? "bg-primary/10 border-primary/40"
                              : "bg-white border-slate-50 hover:border-primary/20 hover:bg-slate-50",
                            isInherited && "opacity-60 cursor-not-allowed",
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                            <span className="font-medium text-slate-600 text-xs">
                              {plot.name}
                            </span>
                          </div>
                          {tempIds.includes(plot.id) ? (
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          ) : (
                            <div className="w-4 h-4 rounded border border-slate-200" />
                          )}
                        </button>
                      );
                    })}
                </div>
              )}

              {filteredRegions.map((r) => (
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
                      {expandedRegions.includes(r.id) ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <div
                      onClick={() => toggleId(r.id, 3)}
                      className={cn(
                        "flex-1 flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                        tempIds.includes(r.id)
                          ? "bg-primary/10 border-primary/40"
                          : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">
                            {r.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Vùng trồng
                          </div>
                        </div>
                      </div>
                      {tempIds.includes(r.id) ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-primary/10 text-primary border-none"
                          >
                            Đã chọn
                          </Badge>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded border-2 border-slate-200 group-hover:border-primary transition-colors" />
                      )}
                    </div>
                  </div>

                  {expandedRegions.includes(r.id) && (
                    <div className="ml-6 pl-4 border-l-2 border-slate-100 space-y-2 py-1">
                      {(areasByRegion[r.id] || []).map((area: any) => {
                        const isInheritedArea = tempIds.includes(r.id);
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
                                {expandedAreas.includes(area.id) ? (
                                  <ChevronDown className="w-4 h-4 text-slate-400" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-slate-400" />
                                )}
                              </button>
                              <div
                                onClick={() =>
                                  !isInheritedArea && toggleId(area.id, 2)
                                }
                                className={cn(
                                  "flex-1 flex items-center justify-between p-2.5 rounded-xl border-2 transition-all cursor-pointer",
                                  tempIds.includes(area.id)
                                    ? "bg-primary/10 border-primary/40"
                                    : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                                  isInheritedArea &&
                                    "opacity-60 cursor-not-allowed",
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                                    <Layers className="w-4 h-4" />
                                  </div>
                                  <span className="font-bold text-slate-700 text-xs">
                                    {area.name}
                                  </span>
                                </div>
                                {tempIds.includes(area.id) ? (
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    <Badge
                                      variant="secondary"
                                      className="text-[9px] bg-primary/10 text-primary border-none h-4 py-0"
                                    >
                                      Đã chọn
                                    </Badge>
                                  </div>
                                ) : (
                                  <div className="w-4 h-4 rounded border border-slate-200 group-hover:border-primary transition-colors" />
                                )}
                              </div>
                            </div>

                            {expandedAreas.includes(area.id) && (
                              <div className="ml-5 pl-4 border-l-2 border-slate-50 space-y-1 py-1">
                                {(plotsByArea[area.id] || []).map(
                                  (plot: any) => {
                                    const isInheritedPlot =
                                      isInheritedArea ||
                                      tempIds.includes(area.id);
                                    return (
                                      <div
                                        key={plot.id}
                                        onClick={() =>
                                          !isInheritedPlot &&
                                          toggleId(plot.id, 1)
                                        }
                                        className={cn(
                                          "flex items-center justify-between p-2 rounded-lg border-2 transition-all cursor-pointer group",
                                          tempIds.includes(plot.id)
                                            ? "bg-primary/10 border-primary/40"
                                            : "bg-white border-slate-50 hover:border-primary/20 hover:bg-slate-50",
                                          isInheritedPlot &&
                                            "opacity-60 cursor-not-allowed",
                                        )}
                                      >
                                        <div className="flex items-center gap-2.5">
                                          <div
                                            className={cn(
                                              "w-2 h-2 rounded-full transition-colors",
                                              tempIds.includes(plot.id)
                                                ? "bg-primary"
                                                : "bg-slate-200 group-hover:bg-primary/50",
                                            )}
                                          />
                                          <span className="font-medium text-slate-600 text-xs">
                                            {plot.name}
                                          </span>
                                        </div>
                                        {tempIds.includes(plot.id) ? (
                                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                        ) : (
                                          <div className="w-3.5 h-3.5 rounded border border-slate-200 group-hover:border-primary transition-colors" />
                                        )}
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {filteredRegions.length === 0 && !search && (
                <div className="text-center py-12">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Search className="w-6 h-6 text-slate-300" />
                  </div>
                  <div className="text-slate-500 font-medium text-sm">
                    Không có dữ liệu địa lý
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={confirm} disabled={tempIds.length === 0}>
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
