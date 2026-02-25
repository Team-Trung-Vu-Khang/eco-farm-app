import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StepperForm,
  Textarea,
  cn,
} from "@tankhang1/eco-shared-ui";
import {
  Award,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  Droplets,
  Layers,
  Leaf,
  MapPin,
  ScrollText,
  Search,
  Sprout,
  Target,
  User,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import useCultivationAreaStore from "../../../stores/useCultivationAreaStore";
import useEnterpriseCertificateStore from "../../../stores/useEnterpriseCertificateStore";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import useFarmingMethodStore from "../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../stores/useIrrigationSystemStore";
import usePersonnelStore from "../../../stores/usePersonnelStore";
import useRegionStore from "../../../stores/useRegionStore";
import useVarietyStore from "../../../stores/useVarietyStore";
import useDepartmentStore from "@/stores/useDepartmentStore";
import useSeedStore from "../../../stores/useSeedStore";
import { EnterpriseSelector } from "./components";

interface GeographicalSelection {
  id: string;
  type: "region" | "area" | "plot";
  regionId: string;
  areaId?: string;
  plotId?: string;
}

const SelectionCard = ({
  regionId,
  areaId,
  items,
  regions,
  onRemove,
}: {
  regionId: string;
  areaId?: string;
  items: GeographicalSelection[];
  regions: any[];
  onRemove: (ids: string[]) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const region = regions.find((r) => r.id.toString() === regionId);
  const area = region?.subAreas?.find((a: any) => a.id.toString() === areaId);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "region":
        return "Vùng trồng";
      case "area":
        return "Khu vực";
      case "plot":
        return "Lô đất";
      default:
        return "";
    }
  };

  const primaryItem =
    items.find((i) => i.type === "area" || i.type === "region") || items[0];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all group animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "p-2.5 rounded-xl shrink-0 transition-colors duration-300",
              primaryItem.type === "region"
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary group-hover:bg-primary/20",
            )}
          >
            {primaryItem.type === "region" ? (
              <MapPin className="w-5 h-5" />
            ) : (
              <Layers className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-bold tracking-wider py-0 px-1.5 h-4 border-primary/20 text-primary bg-primary/5"
              >
                {getTypeLabel(primaryItem.type)}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                onClick={() => onRemove(items.map((i) => i.id))}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              {area?.name || region?.name}
            </div>
            <div className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium">
              ID: {areaId || regionId}
            </div>
          </div>
        </div>

        {(primaryItem.type !== "region" || items.length > 1) && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
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
                {/* Main vertical stem on the left */}
                <div className="absolute left-0 top-0 bottom-4 w-px bg-slate-200" />

                <div className="space-y-4">
                  {/* Region Level */}
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
                        {region?.name}
                      </div>
                    </div>
                    {items.some((i) => i.type === "region") && (
                      <Badge className="ml-auto bg-primary/10 text-primary border-none text-[10px]">
                        Đã chọn vùng
                      </Badge>
                    )}
                  </div>

                  {/* Area Level & Plots */}
                  {areaId && (
                    <div className="relative pl-4">
                      {/* Branch from main stem to Area */}
                      <div className="absolute left-0 w-4 h-px bg-slate-200 top-4" />

                      <div className="pl-4 relative">
                        {/* Nested Stem if Plots exist */}
                        {items.some((i) => i.type === "plot") && (
                          <div className="absolute left-3.75 top-4 bottom-4 w-px bg-slate-200" />
                        )}

                        <div className="flex items-center gap-3 relative z-10 py-1">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs shrink-0",
                              items.some((i) => i.type === "area")
                                ? "bg-primary/5 border-primary/20"
                                : "bg-slate-50 border-slate-100",
                            )}
                          >
                            <Layers
                              className={cn(
                                "w-3.5 h-3.5",
                                items.some((i) => i.type === "area")
                                  ? "text-primary"
                                  : "text-slate-400",
                              )}
                            />
                          </div>
                          <div>
                            <div
                              className={cn(
                                "text-[10px] uppercase font-bold tracking-wider leading-none mb-1",
                                items.some((i) => i.type === "area")
                                  ? "text-primary/60"
                                  : "text-slate-400",
                              )}
                            >
                              Khu vực
                            </div>
                            <div
                              className={cn(
                                "text-xs font-bold",
                                items.some((i) => i.type === "area")
                                  ? "text-slate-900"
                                  : "text-slate-700",
                              )}
                            >
                              {area?.name}
                            </div>
                          </div>
                        </div>

                        {/* Plots Level */}
                        <div className="space-y-3 mt-3">
                          {items
                            .filter((i) => i.type === "plot")
                            .map((pSelection) => {
                              const plot = area?.plots?.find(
                                (p: any) => p.id === pSelection.plotId,
                              );
                              return (
                                <div
                                  key={pSelection.id}
                                  className="flex items-center gap-3 relative z-10 pl-8 group/plot"
                                >
                                  <div className="absolute left-3.75 w-4 h-px bg-slate-200 top-1/2" />
                                  <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shadow-xs shrink-0">
                                    <Target className="w-3.5 h-3.5 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-[10px] text-primary/60 font-bold uppercase tracking-wider leading-none mb-1">
                                      Lô đất
                                    </div>
                                    <div className="text-xs font-bold text-slate-900">
                                      {plot?.name || pSelection.plotId}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemove([pSelection.id])}
                                    className="h-6 w-6 p-0 opacity-0 group-hover/plot:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3 text-slate-400 hover:text-red-500" />
                                  </Button>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const GeographicalSelector = ({
  regions,
  onConfirm,
  enterpriseId,
  existingSelections,
}: {
  regions: any[];
  onConfirm: (selections: GeographicalSelection[]) => void;
  enterpriseId: string;
  existingSelections: GeographicalSelection[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);
  const [expandedAreas, setExpandedAreas] = useState<string[]>([]);
  const [tempSelections, setTempSelections] = useState<GeographicalSelection[]>(
    [],
  );

  useEffect(() => {
    if (isOpen) {
      setTempSelections(existingSelections);
    }
  }, [isOpen, existingSelections]);

  const filteredRegions = useMemo(() => {
    return regions.filter(
      (r) =>
        (!enterpriseId ||
          r.enterpriseId === `ent-${enterpriseId}` ||
          r.enterpriseId === enterpriseId) &&
        r.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [regions, enterpriseId, searchTerm]);

  const toggleRegion = (id: string) => {
    setExpandedRegions((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id],
    );
  };

  const toggleArea = (id: string) => {
    setExpandedAreas((prev) =>
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id],
    );
  };

  const isSelected = (
    type: "region" | "area" | "plot",
    regionId: string,
    areaId?: string,
    plotId?: string,
  ) => {
    // Exact match
    const exactMatch = tempSelections.some(
      (s) =>
        s.type === type &&
        s.regionId === regionId &&
        s.areaId === areaId &&
        s.plotId === plotId,
    );
    if (exactMatch) return true;

    // Parent check: if Region is selected, Area and Plot are considered selected
    if (type === "area" || type === "plot") {
      const regionSelected = tempSelections.some(
        (s) => s.type === "region" && s.regionId === regionId,
      );
      if (regionSelected) return true;
    }

    // Parent check: if Area is selected, Plot is considered selected
    if (type === "plot") {
      const areaSelected = tempSelections.some(
        (s) =>
          s.type === "area" && s.regionId === regionId && s.areaId === areaId,
      );
      if (areaSelected) return true;
    }

    return false;
  };

  const handleSelect = (
    type: "region" | "area" | "plot",
    regionId: string,
    areaId?: string,
    plotId?: string,
  ) => {
    // If a parent is already selected, don't allow selecting children
    if (type === "area") {
      const regionSelected = tempSelections.some(
        (s) => s.type === "region" && s.regionId === regionId,
      );
      if (regionSelected) return;
    }
    if (type === "plot") {
      const regionSelected = tempSelections.some(
        (s) => s.type === "region" && s.regionId === regionId,
      );
      const areaSelected = tempSelections.some(
        (s) =>
          s.type === "area" && s.regionId === regionId && s.areaId === areaId,
      );
      if (regionSelected || areaSelected) return;
    }

    const isCurrentlySelected = tempSelections.some(
      (s) =>
        s.type === type &&
        s.regionId === regionId &&
        s.areaId === areaId &&
        s.plotId === plotId,
    );

    if (isCurrentlySelected) {
      setTempSelections((prev) =>
        prev.filter(
          (s) =>
            !(
              s.type === type &&
              s.regionId === regionId &&
              s.areaId === areaId &&
              s.plotId === plotId
            ),
        ),
      );
    } else {
      setTempSelections((prev) => {
        // Clear children if parent is selected
        let next = [...prev];
        if (type === "region") {
          next = next.filter((s) => s.regionId !== regionId);
        } else if (type === "area") {
          next = next.filter(
            (s) => !(s.regionId === regionId && s.areaId === areaId),
          );
        }

        return [
          ...next,
          {
            id: Math.random().toString(36).substr(2, 9),
            type,
            regionId,
            areaId,
            plotId,
          },
        ];
      });
    }
  };

  const handleConfirm = () => {
    onConfirm(tempSelections);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={!enterpriseId}
        className="w-full h-12 cursor-pointer border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary font-bold gap-2 transition-all rounded-lg shadow-sm hover:shadow-md"
        variant="outline"
      >
        <Plus className="w-5 h-5" />
        Thêm phạm vi canh tác
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setSearchTerm("");
        }}
      >
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Chọn phạm vi canh tác
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Bạn có thể chọn Vùng trồng, Khu vực hoặc từng Lô đất cụ thể
            </p>
          </DialogHeader>

          <div className="px-6 pb-5 border-b shrink-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Tìm kiếm vùng, khu vực, lô..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
              {filteredRegions.map((r) => (
                <div key={r.id} className="space-y-2">
                  {/* Region Level */}
                  <div className="flex items-center gap-2 group">
                    <button
                      onClick={() => toggleRegion(r.id.toString())}
                      className="p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                      {expandedRegions.includes(r.id.toString()) ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <div
                      onClick={() => handleSelect("region", r.id.toString())}
                      className={cn(
                        "flex-1 flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                        isSelected("region", r.id.toString())
                          ? "bg-primary/10 border-primary/40 opacity-60 cursor-not-allowed"
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
                      {isSelected("region", r.id.toString()) ? (
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
                        <div className="w-5 h-5 rounded border-2 border-slate-200 group-hover:border-primary transition-colors flex items-center justify-center">
                          <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Areas Level */}
                  {expandedRegions.includes(r.id.toString()) && (
                    <div className="ml-6 pl-4 border-l-2 border-slate-100 space-y-2 py-1">
                      {r.subAreas?.map((area: any) => (
                        <div key={area.id} className="space-y-2">
                          <div className="flex items-center gap-2 group">
                            <button
                              onClick={() => toggleArea(area.id.toString())}
                              className="p-1 hover:bg-slate-100 rounded transition-colors"
                            >
                              {expandedAreas.includes(area.id.toString()) ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                            <div
                              onClick={() =>
                                handleSelect(
                                  "area",
                                  r.id.toString(),
                                  area.id.toString(),
                                )
                              }
                              className={cn(
                                "flex-1 flex items-center justify-between p-2.5 rounded-xl border-2 transition-all cursor-pointer",
                                isSelected(
                                  "area",
                                  r.id.toString(),
                                  area.id.toString(),
                                )
                                  ? "bg-primary/10 border-primary/40 opacity-60 cursor-not-allowed"
                                  : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
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
                              {isSelected(
                                "area",
                                r.id.toString(),
                                area.id.toString(),
                              ) ? (
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
                                <div className="w-4 h-4 rounded border border-slate-200 group-hover:border-primary transition-colors flex items-center justify-center">
                                  <Plus className="w-3 h-3 text-slate-300 group-hover:text-primary" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Plots Level */}
                          {expandedAreas.includes(area.id.toString()) && (
                            <div className="ml-5 pl-4 border-l-2 border-slate-50 space-y-1 py-1">
                              {area.plots?.map((plot: any) => (
                                <div
                                  key={plot.id}
                                  onClick={() =>
                                    handleSelect(
                                      "plot",
                                      r.id.toString(),
                                      area.id.toString(),
                                      plot.id,
                                    )
                                  }
                                  className={cn(
                                    "flex items-center justify-between p-2 rounded-lg border-2 transition-all cursor-pointer group",
                                    isSelected(
                                      "plot",
                                      r.id.toString(),
                                      area.id.toString(),
                                      plot.id,
                                    )
                                      ? "bg-primary/10 border-primary/40 opacity-60 cursor-not-allowed"
                                      : "bg-white border-slate-50 hover:border-primary/20 hover:bg-slate-50",
                                  )}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-primary transition-colors" />
                                    <span className="font-medium text-slate-600 text-xs text-primary/80">
                                      {plot.name}
                                    </span>
                                  </div>
                                  {isSelected(
                                    "plot",
                                    r.id.toString(),
                                    area.id.toString(),
                                    plot.id,
                                  ) ? (
                                    <div className="flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                      <span className="text-[9px] text-primary font-bold">
                                        LÔ #{plot.id.split("-").pop()}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="w-3.5 h-3.5 rounded-sm border border-slate-200 group-hover:border-primary transition-colors flex items-center justify-center">
                                      <Plus className="w-2.5 h-2.5 text-slate-300 group-hover:text-primary" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {filteredRegions.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Search className="w-6 h-6 text-slate-300" />
                  </div>
                  <div className="text-slate-500 font-medium text-sm">
                    Không tìm thấy dữ liệu phù hợp
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirm}>
              {tempSelections.length > existingSelections.length
                ? `Xác nhận (+${tempSelections.length - existingSelections.length})`
                : "Xác nhận"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ManagerSelector = ({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const { personnel } = usePersonnelStore();
  const selectedManager = personnel.find((m) => m.id.toString() === selectedId);
  const departmentsFromStore = useDepartmentStore((state) => state.departments);
  const departments = departmentsFromStore
    .filter((d) => d.status === "active")
    .map((d) => d.name);

  const filteredManagers = useMemo(() => {
    return personnel.filter((m) => {
      const matchesSearch =
        m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept =
        departmentFilter === "all" || m.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [searchTerm, departmentFilter, personnel]);

  return (
    <>
      <div
        className={`group border rounded-xl p-4 transition-all hover:shadow-sm cursor-pointer ${
          selectedManager
            ? "bg-white border-slate-200"
            : "bg-slate-50 border-dashed border-slate-300"
        }`}
        onClick={() => setIsOpen(true)}
      >
        {selectedManager ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
              {selectedManager.avatar ? (
                <img
                  src={selectedManager.avatar}
                  alt={selectedManager.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-800">
                {selectedManager.fullName}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
                <Badge
                  variant="outline"
                  className="font-normal text-xs bg-slate-100"
                >
                  {selectedManager.position}
                </Badge>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs">{selectedManager.department}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 group-hover:text-primary"
            >
              Thay đổi
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            <div className="w-10 h-10 rounded-full bg-white border border-dashed flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium">Chọn quản lý vùng trồng</div>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn quản lý vùng trồng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên, chức vụ..."
                  className="pl-10 bg-slate-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-35 bg-slate-50">
                  <SelectValue placeholder="Phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-75 pr-4">
              <div className="space-y-2">
                {filteredManagers.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedId === m.id.toString()
                        ? "bg-primary/5 border border-primary/20 shadow-sm"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                    onClick={() => {
                      onSelect(m.id.toString());
                      setIsOpen(false);
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold overflow-hidden text-slate-600">
                      {m.avatar ? (
                        <img
                          src={m.avatar}
                          alt={m.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        m.fullName.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-slate-900">
                        {m.fullName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {m.position} - {m.department}
                      </div>
                    </div>
                    {selectedId === m.id.toString() && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                ))}
                {filteredManagers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Không tìm thấy quản lý nào
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const CertificateSelector = ({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  const { standards } = useEnterpriseCertificateStore();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {standards.map((cert) => (
          <div
            key={cert.code}
            className={`cursor-pointer border rounded-xl p-3 relative flex items-start gap-3 transition-all ${
              selectedId === cert.code
                ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-sm"
                : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
            }`}
            onClick={() => onSelect(cert.code)}
          >
            <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              {cert.imageUrl ? (
                <img
                  src={cert.imageUrl}
                  alt={cert.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Award
                  className={`w-6 h-6 ${
                    selectedId === cert.code ? "text-primary" : "text-slate-400"
                  }`}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate pr-4">
                {cert.name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {cert.code}
              </div>
              <div className="text-xs text-slate-500 truncate mt-0.5">
                {cert.organizations.join(", ")}
              </div>
            </div>
            {selectedId === cert.code && (
              <div className="absolute top-3 right-3 text-primary animate-in fade-in zoom-in">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SeedSelectorDialog = ({
  isOpen,
  variety,
  onSelect,
  selectedSeedIds = [],
  onOpenChange,
}: {
  variety: any;
  onSelect: (seedIds: string[]) => void;
  selectedSeedIds?: string[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const { seeds } = useSeedStore();

  useEffect(() => {
    if (isOpen) {
      setTempSelectedIds(selectedSeedIds);
    }
  }, [isOpen]);

  const filteredSeeds = useMemo(() => {
    if (!variety) return [];

    return seeds.filter(
      (s) =>
        s.varietyCode === variety.varietyCode &&
        (s.varietyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.varietyCode.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [seeds, variety, searchTerm]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-primary" />
            Chọn hạt giống cho {variety?.varietyName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Tìm kiếm hạt giống..."
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="h-72 border rounded-xl bg-slate-50/50">
            <div className="p-2 space-y-2">
              {filteredSeeds.map((seed) => {
                const isSelected = tempSelectedIds.includes(seed.id);
                return (
                  <div
                    key={seed.id}
                    onClick={() => {
                      if (isSelected) {
                        setTempSelectedIds((prev) =>
                          prev.filter((id) => id !== seed.id),
                        );
                      } else {
                        setTempSelectedIds((prev) => [...prev, seed.id]);
                      }
                    }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all bg-white hover:border-primary/40",
                      isSelected && "bg-primary/5 border-primary",
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {seed.varietyName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {seed.varietyCode} - {seed.supplier}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                );
              })}
              {filteredSeeds.length === 0 && (
                <div className="text-center py-8 text-sm text-slate-400">
                  Không tìm thấy hạt giống phù hợp
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              onSelect(tempSelectedIds);
              onOpenChange(false);
            }}
            className="flex-1"
            disabled={tempSelectedIds.length === 0}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Page Component ---

const CultivationAreaCreatePage = () => {
  const [, setLocation] = useLocation();
  const { regions } = useRegionStore();
  const { addArea } = useCultivationAreaStore();
  const { standards } = useEnterpriseCertificateStore();
  const { personnel } = usePersonnelStore();
  const { varieties } = useVarietyStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const { seeds } = useSeedStore();

  // Dialog state
  const [seedDialogOpen, setSeedDialogOpen] = useState(false);
  const [activeSeedVariety, setActiveSeedVariety] = useState<any>(null);
  const [applyToAllDialogOpen, setApplyToAllDialogOpen] = useState(false);

  // State
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("");
  const [selections, setSelections] = useState<GeographicalSelection[]>([]);

  const [selectedCertId, setSelectedCertId] = useState<string>("");
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");

  /* Per-entity configuration state */
  const [activeConfigId, setActiveConfigId] = useState<string>("region-main");
  const [cropSearchTerm, setCropSearchTerm] = useState("");
  const [configs, setConfigs] = useState<
    Record<
      string,
      {
        farmingMethodId: string;
        irrigationMethodId: string;
        selectedCrops: string[];
        seedSelections?: Record<string, string[]>; // varietyId -> seedIds[]
      }
    >
  >({});

  // Computed values from selections
  const selectedRegions = useMemo(() => {
    const regionIds = [...new Set(selections.map((s) => s.regionId))];
    return regions.filter((r) => regionIds.includes(r.id.toString()));
  }, [regions, selections]);

  const selectedAreas = useMemo(() => {
    const areaIds = selections
      .filter((s) => s.areaId)
      .map((s) => s.areaId as string);
    return regions
      .flatMap((r) => r.subAreas || [])
      .filter((a) => areaIds.includes(a.id.toString()));
  }, [regions, selections]);

  const selectedPlots = useMemo(() => {
    const plotIds = selections
      .filter((s) => s.plotId)
      .map((s) => s.plotId as string);
    return regions
      .flatMap((r) => r.subAreas || [])
      .flatMap((a) => a.plots || [])
      .filter((p) => plotIds.includes(p.id));
  }, [regions, selections]);

  const selectedRegion = selectedRegions[0];

  const effectiveScope = useMemo(() => {
    if (selections.some((s) => s.type === "plot")) return "plot";
    if (selections.some((s) => s.type === "area")) return "area";
    return "region";
  }, [selections]);

  const entities = useMemo(() => {
    return selections.map((s) => {
      const region = regions.find((r) => r.id.toString() === s.regionId);
      const area = region?.subAreas?.find(
        (a: any) => a.id.toString() === s.areaId,
      );
      const plot = area?.plots?.find((p: any) => p.id === s.plotId);

      return {
        id: s.plotId || s.areaId || s.regionId,
        targetId: s.plotId || s.areaId || s.regionId,
        name:
          s.type === "region"
            ? region?.name
            : s.type === "area"
              ? area?.name
              : plot?.name,
        type:
          s.type === "region"
            ? "Vùng"
            : s.type === "area"
              ? "Khu vực"
              : "Lô đất",
        typeCode: s.type,
      };
    });
  }, [selections, regions]);

  // Steps Rendering
  const renderGeneralInfo = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
        {/* 2. Basic Info & Location */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <ScrollText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-slate-800">Thông tin cơ bản</h3>
          </div>

          <div className="space-y-4">
            <Label htmlFor="name" className="text-sm font-medium">
              Tên vùng canh tác <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="VD: Vùng trồng Sầu riêng chất lượng cao"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 border-slate-300 focus:border-primary focus:ring-primary/20"
            />

            <Label className="text-sm font-medium">
              Doanh nghiệp (Enterprise) <span className="text-red-500">*</span>
            </Label>
            <EnterpriseSelector
              selectedId={selectedEnterpriseId}
              onSelect={(val) => {
                setSelectedEnterpriseId(val);
                setSelections([]);
              }}
            />

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700">
                  Phạm vi địa lý <span className="text-red-500">*</span>
                </Label>
                {selections.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-none"
                  >
                    {selections.length} lựa chọn
                  </Badge>
                )}
              </div>

              <GeographicalSelector
                regions={regions}
                enterpriseId={selectedEnterpriseId}
                existingSelections={selections}
                onConfirm={(newSelections) => {
                  setSelections(newSelections);
                }}
              />

              <div className="grid grid-cols-1 gap-4 mt-2">
                {(() => {
                  const grouped: Record<string, GeographicalSelection[]> = {};
                  selections.forEach((s) => {
                    const key = s.areaId || s.regionId;
                    if (!grouped[key]) grouped[key] = [];
                    grouped[key].push(s);
                  });

                  return Object.entries(grouped).map(([key, items]) => {
                    const first = items[0];
                    return (
                      <SelectionCard
                        key={key}
                        regionId={first.regionId}
                        areaId={first.areaId}
                        items={items}
                        regions={regions}
                        onRemove={(ids) => {
                          setSelections(
                            selections.filter((s) => !ids.includes(s.id)),
                          );
                        }}
                      />
                    );
                  });
                })()}
                {selections.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50 text-center gap-2 animate-in fade-in duration-500">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-300">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-600">
                        Chưa có lựa chọn nào
                      </div>
                      <div className="text-[11px] text-slate-400 max-w-50 mx-auto mt-1">
                        Vui lòng thêm vị trí để tiếp tục
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2 pt-2">
              <Label className="text-sm font-medium">Ghi chú</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập thông tin ghi chú thêm..."
                className="min-h-20 border-slate-300 resize-none hover:border-slate-400 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* 3. Standards & Management */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-slate-800">
              Tiêu chuẩn & Quản lý
            </h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Giấy chứng nhận / Tiêu chuẩn
              </Label>
              <CertificateSelector
                selectedId={selectedCertId}
                onSelect={setSelectedCertId}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Nhân viên chịu trách nhiệm
              </Label>
              <ManagerSelector
                selectedId={selectedManagerId}
                onSelect={setSelectedManagerId}
              />
            </div>

            {selectedRegion?.cropVarieties &&
              selectedRegion.cropVarieties.length > 0 && (
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex gap-3 text-sm text-green-800 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-green-100 p-1.5 rounded-full h-fit">
                    <Sprout className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">
                      Cây trồng chủ lực của vùng
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedRegion.cropVarieties.map((crop: any) => (
                        <Badge
                          key={crop.id}
                          variant="outline"
                          className="bg-white text-green-700 border-green-200"
                        >
                          {crop.name} - {crop.variety}
                          {crop.seedType && (
                            <span className="ml-1 text-[10px] text-green-600/70 font-normal">
                              ({crop.seedType})
                            </span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
  const renderConfiguration = () => {
    const effectiveId =
      entities.find((e) => e.id === activeConfigId)?.id ||
      entities[0]?.id ||
      "region-main";

    // Initialize config if it doesn't exist for this entity
    const effectiveConfig = configs[effectiveId] || {
      farmingMethodId: "",
      irrigationMethodId: "",
      selectedCrops: [],
      seedSelections: {},
    };

    const availableCropsForConfig = (() => {
      if (!effectiveConfig.farmingMethodId) return [];
      // Return all active varieties, bypassing mock constraint
      let list = varieties.filter((v) => v.status === "active");

      if (cropSearchTerm) {
        const lowerSearch = cropSearchTerm.toLowerCase();
        list = list.filter(
          (v) =>
            v.varietyName.toLowerCase().includes(lowerSearch) ||
            v.crop.toLowerCase().includes(lowerSearch),
        );
      }

      return list;
    })();

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Scope Summary Banner - Full Width at Top */}
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-linear-to-r from-primary/5 via-white to-primary/5 p-6">
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white shadow-sm border flex items-center justify-center text-primary shrink-0">
              {effectiveScope === "plot" ? (
                <Target className="w-7 h-7" />
              ) : effectiveScope === "area" ? (
                <Layers className="w-7 h-7" />
              ) : (
                <MapPin className="w-7 h-7" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {effectiveScope === "region"
                  ? "Vùng trồng"
                  : effectiveScope === "area"
                    ? "Khu vực"
                    : "Lô đất"}
              </div>
              <div className="text-xl md:text-2xl font-bold text-slate-900 mt-0.5 truncate">
                {effectiveScope === "region"
                  ? selectedRegion?.name
                  : effectiveScope === "area"
                    ? `${selectedAreas.length} khu vực`
                    : `${selectedPlots.length} lô trồng`}
              </div>
              {effectiveScope === "region" && selectedRegion && (
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge
                    variant="outline"
                    className="bg-white font-mono text-xs"
                  >
                    {selectedRegion.code}
                  </Badge>
                  {name && (
                    <span className="text-slate-600 text-sm">{name}</span>
                  )}
                </div>
              )}
            </div>
            {entities.length > 0 && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-lg border">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Tiến độ</div>
                  <div className="text-lg font-bold text-primary">
                    {
                      entities.filter((e) => {
                        const cfg = configs[e.id];
                        return (
                          cfg?.farmingMethodId &&
                          (cfg?.selectedCrops?.length || 0) > 0
                        );
                      }).length
                    }
                    /{entities.length}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
        </div>

        {/* Main Content Area */}
        <div
          className={cn(
            "grid grid-cols-1 gap-6",
            entities.length > 0 ? "lg:grid-cols-[1fr_3fr]" : "grid-cols-1",
          )}
        >
          {/* Sidebar for multiple entities */}
          {entities.length > 0 && (
            <div className="w-full lg:w-72 shrink-0">
              <div className="sticky top-6">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold text-slate-700">
                    Danh sách thiết lập
                  </Label>
                  <Badge variant="secondary" className="text-xs">
                    {entities.length}
                  </Badge>
                </div>
                <ScrollArea className="h-150 border rounded-xl bg-white shadow-sm">
                  <div className="p-2 space-y-1">
                    {entities.map((entity) => {
                      const isConfigured =
                        configs[entity.id]?.farmingMethodId &&
                        (configs[entity.id]?.selectedCrops?.length || 0) > 0;
                      const isActive = effectiveId === entity.id;

                      return (
                        <div
                          key={entity.id}
                          onClick={() => setActiveConfigId(entity.id)}
                          className={`group relative p-3 rounded-lg text-sm cursor-pointer transition-all border ${
                            isActive
                              ? "bg-primary/10 border-primary/30 shadow-sm"
                              : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isConfigured
                                  ? "bg-green-100 text-green-600"
                                  : isActive
                                    ? "bg-primary/20 text-primary"
                                    : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {isConfigured ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <span className="text-xs font-bold">
                                  {entities.indexOf(entity) + 1}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-muted-foreground uppercase font-medium">
                                {entity.type}
                              </div>
                              <div
                                className={`truncate font-medium ${
                                  isActive ? "text-slate-900" : "text-slate-700"
                                }`}
                              >
                                {entity.name}
                              </div>
                            </div>
                          </div>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Configuration Cards */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Entity Name Badge (for multiple entities) */}
            {entities.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border rounded-lg">
                <span className="text-sm text-muted-foreground">
                  Đang thiết lập cho:
                </span>
                <Badge variant="default" className="font-semibold">
                  {entities.find((e) => e.id === effectiveId)?.name}
                </Badge>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Farming & Irrigation Card */}
              <Card className="border-none shadow-md bg-white">
                <CardHeader className="pb-3 border-b bg-linear-to-r from-green-50/50 to-white">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Sprout className="w-4 h-4 text-green-600" />
                    </div>
                    <span>Phương pháp canh tác</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Loại hình canh tác <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={effectiveConfig.farmingMethodId}
                      onValueChange={(val) => {
                        setConfigs((prev) => ({
                          ...prev,
                          [effectiveId]: {
                            ...prev[effectiveId],
                            farmingMethodId: val,
                          },
                        }));
                      }}
                    >
                      <SelectTrigger className="h-11 bg-white">
                        <SelectValue placeholder="Chọn phương pháp..." />
                      </SelectTrigger>
                      <SelectContent>
                        {farmingMethods.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            <span className="font-medium">{m.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Quyết định danh sách cây trồng phù hợp
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Hệ thống tưới tiêu <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={effectiveConfig.irrigationMethodId}
                      onValueChange={(val) => {
                        setConfigs((prev) => ({
                          ...prev,
                          [effectiveId]: {
                            ...prev[effectiveId],
                            irrigationMethodId: val,
                          },
                        }));
                      }}
                    >
                      <SelectTrigger className="h-11 bg-white">
                        <SelectValue placeholder="Chọn phương pháp tưới..." />
                      </SelectTrigger>
                      <SelectContent>
                        {irrigationSystems.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            <div className="flex items-center gap-2">
                              <Droplets className="w-4 h-4 text-blue-500" />
                              <span>{m.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Auto-fill button */}
                  {entities.length > 1 && (
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-dashed hover:bg-green-600 hover:text-white"
                        onClick={() => setApplyToAllDialogOpen(true)}
                      >
                        <span className="text-xs">
                          Áp dụng cho các vùng trồng khác
                        </span>
                      </Button>
                    </div>
                  )}

                  {/* Confirmation Dialog for Apply to All */}
                  <Dialog
                    open={applyToAllDialogOpen}
                    onOpenChange={setApplyToAllDialogOpen}
                  >
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Sprout className="w-5 h-5 text-green-600" />
                          Xác nhận đồng bộ cấu hình
                        </DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Bạn có chắc chắn muốn áp dụng phương pháp canh tác, hệ
                          thống tưới và danh sách cây trồng hiện tại cho{" "}
                          <span className="font-bold text-slate-900">
                            tất cả {entities.length - 1} mục còn lại
                          </span>{" "}
                          không?
                        </p>
                        <p className="text-xs text-amber-600 mt-3 flex gap-2 items-start bg-amber-50 p-3 rounded-lg border border-amber-100">
                          <span className="shrink-0 font-bold italic">
                            Lưu ý:
                          </span>
                          Hành động này sẽ ghi đè lên các cấu hình đã thiết lập
                          trước đó của các mục khác.
                        </p>
                      </div>
                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                          variant="ghost"
                          onClick={() => setApplyToAllDialogOpen(false)}
                        >
                          Hủy bỏ
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            const newConfigs = { ...configs };
                            entities.forEach((e) => {
                              newConfigs[e.id] = {
                                ...effectiveConfig,
                                seedSelections: {
                                  ...(effectiveConfig.seedSelections || {}),
                                },
                              };
                            });
                            setConfigs(newConfigs);
                            setApplyToAllDialogOpen(false);
                          }}
                        >
                          Đồng ý áp dụng
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* {!effectiveConfig.selectedCrops?.length &&
                    selectedRegion?.cropVarieties?.length && (
                      <div className="pt-2 border-t mt-4">
                        <div className="text-xs font-medium text-muted-foreground mb-2">
                          Gợi ý từ vùng trồng:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedRegion.cropVarieties.map((rc) => (
                            <Badge
                              key={rc.id}
                              variant="secondary"
                              className="cursor-pointer hover:bg-primary/20 transition-colors"
                              onClick={() => {
                                // Find matching crop in available list
                                const match = availableCropsForConfig.find(
                                  (c) =>
                                    c.crop === rc.name &&
                                    c.varietyName === rc.variety,
                                );
                                if (match) {
                                  const current =
                                    effectiveConfig.selectedCrops || [];
                                  if (!current.includes(match.id)) {
                                    setConfigs((prev) => ({
                                      ...prev,
                                      [effectiveId]: {
                                        ...prev[effectiveId],
                                        selectedCrops: [...current, match.id],
                                      },
                                    }));
                                  }
                                }
                              }}
                            >
                              + {rc.name} {rc.variety}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )} */}
                </CardContent>
              </Card>

              {/* Crop Selection Card */}
              <Card className="border-none shadow-md bg-white flex flex-col xl:row-span-1">
                <CardHeader className="pb-3 border-b bg-linear-to-r from-green-50/50 to-white">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-green-600" />
                    </div>
                    <span>Giống cây trồng</span>
                    {effectiveConfig.farmingMethodId && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {availableCropsForConfig.length} loại
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 flex-1 flex flex-col min-h-0">
                  {!effectiveConfig.farmingMethodId ? (
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-slate-50 text-slate-400 gap-3 py-12">
                      <Sprout className="w-10 h-10 opacity-50" />
                      <span className="text-sm text-center px-4">
                        Vui lòng chọn phương pháp canh tác trước
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                        <Input
                          value={cropSearchTerm}
                          placeholder="Tìm kiếm giống cây trồng..."
                          onChange={(e) => setCropSearchTerm(e.target.value)}
                          className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-lg"
                        />
                      </div>
                      <ScrollArea className="flex-1 h-100">
                        {availableCropsForConfig.length > 0 ? (
                          <div className="w-full space-y-2">
                            {availableCropsForConfig.map((crop) => {
                              const isSelected = (
                                effectiveConfig.selectedCrops || []
                              ).includes(crop.id);
                              return (
                                <div
                                  key={crop.id}
                                  onClick={() => {
                                    const current =
                                      effectiveConfig.selectedCrops || [];
                                    if (current.includes(crop.id)) {
                                      const newCrops = current.filter(
                                        (c) => c !== crop.id,
                                      );
                                      const newSeedSelections = {
                                        ...(effectiveConfig.seedSelections ||
                                          {}),
                                      };
                                      delete newSeedSelections[crop.id];

                                      setConfigs((prev) => ({
                                        ...prev,
                                        [effectiveId]: {
                                          ...prev[effectiveId],
                                          selectedCrops: newCrops,
                                          seedSelections: newSeedSelections,
                                        },
                                      }));
                                    } else {
                                      setActiveSeedVariety(crop);
                                      setSeedDialogOpen(true);
                                    }
                                  }}
                                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                    isSelected
                                      ? "bg-green-50 border-green-300 shadow-sm"
                                      : "bg-white border-slate-200 hover:border-green-200 hover:shadow-sm"
                                  }`}
                                >
                                  <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                    {crop.illustration ? (
                                      <img
                                        src={crop.illustration as string}
                                        alt={crop.varietyName}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <Leaf className="w-5 h-5" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col flex-1 shrink min-w-0">
                                    <div
                                      className={`text-sm shrink font-semibold truncate ${
                                        isSelected
                                          ? "text-green-900"
                                          : "text-slate-700"
                                      }`}
                                    >
                                      {crop.varietyName}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5 shrink">
                                      {crop.crop}
                                      {crop.seedType && (
                                        <span className="ml-1 text-slate-500">
                                          • {crop.seedType}
                                        </span>
                                      )}
                                    </div>
                                    {effectiveConfig.seedSelections?.[
                                      crop.id
                                    ] &&
                                      effectiveConfig.seedSelections[crop.id]
                                        .length > 0 && (
                                        <div className="mt-1.5 flex flex-wrap gap-1.5 min-w-0">
                                          {effectiveConfig.seedSelections[
                                            crop.id
                                          ].map((seedId) => {
                                            const seed = seeds.find(
                                              (s) => s.id === seedId,
                                            );
                                            if (!seed) return null;
                                            return (
                                              <Badge
                                                key={seedId}
                                                variant="secondary"
                                                className="whitespace-normal wrap-break-word h-auto py-0.5 leading-tight bg-primary/5 text-primary border-primary/20 text-[10px] px-1.5 font-semibold max-w-full truncate"
                                              >
                                                Hạt giống: {seed.varietyName}
                                              </Badge>
                                            );
                                          })}
                                        </div>
                                      )}
                                  </div>
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                                      isSelected
                                        ? "bg-green-500 border-green-500"
                                        : "border-slate-300"
                                    }`}
                                  >
                                    {isSelected && (
                                      <CheckCircle2 className="w-4 h-4 text-white" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center text-muted-foreground text-sm italic py-10">
                            Không có giống cây phù hợp
                          </div>
                        )}
                      </ScrollArea>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <SeedSelectorDialog
          isOpen={seedDialogOpen}
          onOpenChange={setSeedDialogOpen}
          variety={activeSeedVariety}
          selectedSeedIds={
            effectiveConfig.seedSelections?.[activeSeedVariety?.id]
          }
          onSelect={(seedIds) => {
            if (!activeSeedVariety) return;
            const varietyId = activeSeedVariety.id;
            const currentCrops = effectiveConfig.selectedCrops || [];
            const newCrops = currentCrops.includes(varietyId)
              ? currentCrops
              : [...currentCrops, varietyId];

            const newSeedSelections = {
              ...(effectiveConfig.seedSelections || {}),
              [varietyId]: seedIds,
            };

            setConfigs((prev) => ({
              ...prev,
              [effectiveId]: {
                ...prev[effectiveId],
                selectedCrops: newCrops,
                seedSelections: newSeedSelections,
              },
            }));
          }}
        />
      </div>
    );
  };

  const renderConfirmation = () => {
    const manager = personnel.find(
      (m) => m.id.toString() === selectedManagerId,
    );
    const certificate = standards.find((c) => c.code === selectedCertId);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
        <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm relative z-10">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-green-900 z-10 relative">
            Xác nhận thông tin
          </h3>
          <p className="text-green-700/80 mt-2 z-10 relative max-w-lg mx-auto">
            Vui lòng kiểm tra kỹ các thông tin dưới đây. Sau khi xác nhận, hệ
            thống sẽ tiến hành khởi tạo vùng canh tác mới.
          </p>

          {/* Decor */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-600 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-slate-500" />
              <h4 className="font-semibold text-slate-800">Thông tin chung</h4>
            </div>
            <div className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-muted-foreground w-1/3">
                      Tên hiển thị
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {name || "Chưa đặt tên"}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 text-muted-foreground">
                      Đối tượng
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {entities.map((e) => (
                          <Badge
                            key={e.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            <span className="text-[10px] opacity-60 mr-1 uppercase">
                              {e.typeCode}:
                            </span>
                            {e.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                  {manager && (
                    <tr className="border-b border-slate-100">
                      <td className="py-3 px-4 text-muted-foreground">
                        Quản lý
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold overflow-hidden">
                            {manager.avatar ? (
                              <img
                                src={manager.avatar}
                                alt={manager.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              manager.fullName.charAt(0)
                            )}
                          </div>
                          <span className="font-medium">
                            {manager.fullName}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {certificate && (
                    <tr>
                      <td className="py-3 px-4 text-muted-foreground">
                        Chứng nhận
                      </td>
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-orange-50 text-orange-700 text-xs font-medium">
                          <Award className="w-3 h-3" />
                          {certificate.name}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b p-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-500" />
              <h4 className="font-semibold text-slate-800">
                Phạm vi vùng canh tác ({entities.length} mục)
              </h4>
            </div>
            <div className="p-4 space-y-4">
              {entities.map((entity) => {
                const cfg = configs[entity.id] || {
                  farmingMethodId: "",
                  irrigationMethodId: "",
                  selectedCrops: [],
                };
                const farming = farmingMethods.find(
                  (m) => m.id === cfg.farmingMethodId,
                );
                const irrigation = irrigationSystems.find(
                  (m) => m.id === cfg.irrigationMethodId,
                );
                const selectedCrops = cfg.selectedCrops || [];

                return (
                  <div
                    key={entity.id}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <div className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <span className="text-muted-foreground font-normal uppercase text-xs">
                        {entity.type}
                      </span>
                      {entity.name}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-50 p-3 rounded-lg border">
                        <div className="text-xs text-muted-foreground mb-1">
                          Phương pháp
                        </div>
                        <div className="font-semibold text-primary">
                          {farming?.name || (
                            <span className="text-red-500 italic">
                              Chưa chọn
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border">
                        <div className="text-xs text-muted-foreground mb-1">
                          Tưới tiêu
                        </div>
                        <div className="font-semibold text-blue-600">
                          {irrigation?.name || (
                            <span className="text-red-500 italic">
                              Chưa chọn
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">
                        Giống cây trồng ({selectedCrops.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCrops.length > 0 ? (
                          selectedCrops.map((cid: string) => {
                            const crop = varieties.find((c) => c.id === cid);
                            return (
                              <Badge
                                key={cid}
                                variant="secondary"
                                className="pl-1 pr-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                              >
                                <span className="w-4 h-4 rounded-full bg-green-200 flex items-center justify-center mr-1.5 text-[10px]">
                                  <Leaf className="w-2.5 h-2.5" />
                                </span>
                                {crop?.varietyName}
                                {cfg.seedSelections?.[cid] &&
                                  cfg.seedSelections[cid].length > 0 && (
                                    <span className="ml-1 text-[10px] text-green-800/80 italic font-normal">
                                      •{" "}
                                      {cfg.seedSelections[cid]
                                        .map((sid) => {
                                          return seeds.find((s) => s.id === sid)
                                            ?.varietyName;
                                        })
                                        .join(", ")}
                                    </span>
                                  )}
                                {crop?.seedType && (
                                  <span className="ml-1 text-[10px] text-green-800/80">
                                    ({crop.seedType})
                                  </span>
                                )}
                              </Badge>
                            );
                          })
                        ) : (
                          <span className="text-red-500 italic text-xs">
                            Chưa chọn cây trồng
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {note && (
          <div className="mt-6 bg-yellow-50/50 border border-yellow-200/60 p-4 rounded-lg text-sm text-yellow-800">
            <span className="font-semibold mr-1">Ghi chú:</span> {note}
          </div>
        )}
      </div>
    );
  };

  const steps = [
    { id: "step-1", title: "Thông tin chung", content: renderGeneralInfo() },
    {
      id: "step-2",
      title: "Cấu hình canh tác",
      content: renderConfiguration(),
    },
    { id: "step-3", title: "Xác nhận & Lưu", content: renderConfirmation() },
  ];

  return (
    <AdminLayout
      title="Thiết lập vùng canh tác"
      description="Quy trình khởi tạo và cấu hình tiêu chuẩn cho đơn vị canh tác"
    >
      {/* Manual Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/cultivation-area")}
          className="gap-2 text-muted-foreground hover:text-primary pl-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <Card className="max-w-6xl mx-auto border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden ring-1 ring-slate-900/5">
        <CardContent className="p-0">
          <div className="p-6 md:p-8">
            <StepperForm
              steps={steps}
              completeLabel="Khởi tạo Vùng canh tác"
              onComplete={() => {
                const targetName = entities.map((e) => e.name).join(", ");
                const targetIds = entities.map((e) => e.targetId as string);

                // Handle submission
                addArea({
                  name,
                  scope: effectiveScope,
                  targetIds,
                  targetName,
                  enterpriseId: selectedEnterpriseId,
                  configs,
                  certificateId: selectedCertId,
                  managerId: selectedManagerId,
                  note,
                });
                setLocation("/cultivation-area");
              }}
              onCancel={() => setLocation("/cultivation-area")}
            />
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default CultivationAreaCreatePage;
