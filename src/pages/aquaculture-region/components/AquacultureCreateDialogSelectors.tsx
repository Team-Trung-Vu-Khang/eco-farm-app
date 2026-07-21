import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Award,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Layers,
  MapPin,
  Plus,
  Search,
  Target,
  Users,
} from "lucide-react";
import type { GeographicalSelection } from "./types";
import {
  AQUACULTURE_CERTIFICATES,
  AQUACULTURE_ENTERPRISES,
  AQUACULTURE_MANAGERS,
  AQUACULTURE_REGION_TREE,
} from "../data/create-dummy";

type EnterpriseSelectorProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export const AquacultureEnterpriseSelector = ({
  selectedId,
  onSelect,
}: EnterpriseSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedId, setTempSelectedId] = useState(selectedId);

  const selectedEnterprise = AQUACULTURE_ENTERPRISES.find(
    (item) => item.id === selectedId,
  );

  const filteredEnterprises = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return AQUACULTURE_ENTERPRISES.filter((item) =>
      item.name.toLowerCase().includes(keyword),
    );
  }, [searchTerm]);

  return (
    <>
      <div
        className={cn(
          "group border rounded-lg p-3 transition-all min-h-10 flex items-center",
          selectedEnterprise
            ? "bg-white border-slate-200"
            : "bg-slate-50 border-dashed border-slate-300",
          "hover:shadow-sm cursor-pointer",
        )}
        onClick={() => {
          setTempSelectedId(selectedId);
          setIsOpen(true);
        }}
      >
        {selectedEnterprise ? (
          <div className="flex items-start gap-4 w-full">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden shadow-sm">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] py-0 h-4 bg-primary/5 text-primary border-primary/20"
                >
                  {selectedEnterprise.id}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-[10px] py-0 h-4 bg-slate-100 capitalize font-medium"
                >
                  {selectedEnterprise.name}
                </Badge>
              </div>
              <div className="font-bold text-slate-900 text-base leading-tight mb-1">
                {selectedEnterprise.name}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 text-slate-400 group-hover:text-primary p-0 rounded-full hover:bg-primary/10"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full gap-3 text-muted-foreground group-hover:text-primary transition-all py-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Search className="w-6 h-6 opacity-40 group-hover:opacity-100" />
            </div>
            <div className="text-sm font-semibold">Bấm để chọn đơn vị quản lý</div>
            <div className="text-[11px] opacity-60">
              Tìm kiếm trong dữ liệu thủy sản mẫu
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) setSearchTerm("");
          setIsOpen(open);
        }}
      >
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Chọn đơn vị quản lý
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-5 border-b shrink-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Tìm kiếm..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-3">
              {filteredEnterprises.map((item) => {
                const isSelected = tempSelectedId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTempSelectedId(item.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer group w-full text-left",
                      isSelected
                        ? "bg-primary/10 border-primary/40 opacity-70"
                        : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-sm truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Đơn vị quản lý mẫu
                        </div>
                      </div>
                    </div>
                    {isSelected ? (
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
                        <div className="w-2 h-2 rounded-full bg-transparent" />
                      </div>
                    )}
                  </button>
                );
              })}
              {filteredEnterprises.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Search className="w-6 h-6 text-slate-300" />
                  </div>
                  <div className="text-slate-500 font-medium text-sm">
                    Không tìm thấy đơn vị phù hợp
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                onSelect(tempSelectedId);
                setIsOpen(false);
              }}
            >
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

type TreeSelection = GeographicalSelection & { id: string };

type GeoDialogProps = {
  selectedSelections: GeographicalSelection[];
  onSelect: (selections: GeographicalSelection[]) => void;
};

export const AquacultureGeographicalSelector = ({
  selectedSelections,
  onSelect,
}: GeoDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);
  const [expandedAreas, setExpandedAreas] = useState<string[]>([]);
  const [tempSelections, setTempSelections] = useState<TreeSelection[]>([]);

  const filteredRegions = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return AQUACULTURE_REGION_TREE;

    return AQUACULTURE_REGION_TREE.filter((region) => {
      if (region.name.toLowerCase().includes(keyword)) return true;
      return region.subAreas?.some((area) => {
        if (area.name.toLowerCase().includes(keyword)) return true;
        return area.plots?.some((plot) =>
          plot.name.toLowerCase().includes(keyword),
        );
      });
    });
  }, [searchTerm]);

  const toggleRegion = (id: string) => {
    setExpandedRegions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleArea = (id: string) => {
    setExpandedAreas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isSelected = (
    type: GeographicalSelection["type"],
    regionId: string,
    areaId?: string,
    plotId?: string,
  ) => {
    const exactMatch = tempSelections.some(
      (selection) =>
        selection.type === type &&
        selection.regionId === regionId &&
        selection.areaId === areaId &&
        selection.plotId === plotId,
    );
    if (exactMatch) return true;

    if (type === "area" || type === "plot") {
      const regionSelected = tempSelections.some(
        (selection) =>
          selection.type === "region" && selection.regionId === regionId,
      );
      if (regionSelected) return true;
    }

    if (type === "plot") {
      const areaSelected = tempSelections.some(
        (selection) =>
          selection.type === "area" &&
          selection.regionId === regionId &&
          selection.areaId === areaId,
      );
      if (areaSelected) return true;
    }

    return false;
  };

  const handleSelect = (
    type: GeographicalSelection["type"],
    regionId: string,
    areaId?: string,
    plotId?: string,
    name?: string,
    regionName?: string,
    areaName?: string,
  ) => {
    const isCurrentlySelected = tempSelections.some(
      (selection) =>
        selection.type === type &&
        selection.regionId === regionId &&
        selection.areaId === areaId &&
        selection.plotId === plotId,
    );

    if (isCurrentlySelected) {
      setTempSelections((prev) =>
        prev.filter(
          (selection) =>
            !(
              selection.type === type &&
              selection.regionId === regionId &&
              selection.areaId === areaId &&
              selection.plotId === plotId
            ),
        ),
      );
      return;
    }

    setTempSelections((prev) => {
      let next = [...prev];
      if (type === "region") {
        next = next.filter((selection) => selection.regionId !== regionId);
      } else if (type === "area") {
        next = next.filter(
          (selection) =>
            !(selection.regionId === regionId && selection.areaId === areaId),
        );
      }

      return [
        ...next,
        {
          id: Math.random().toString(36).slice(2, 11),
          type,
          regionId,
          areaId,
          plotId,
          name,
          regionName,
          areaName,
        },
      ];
    });
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          setTempSelections(selectedSelections as TreeSelection[]);
          setIsOpen(true);
        }}
        className="w-full h-12 cursor-pointer border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary font-bold gap-2 transition-all rounded-lg shadow-sm hover:shadow-md"
        variant="outline"
      >
        <Plus className="w-5 h-5" />
        Thêm phạm vi nuôi trồng
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (open) {
            setTempSelections(selectedSelections as TreeSelection[]);
          }
          setIsOpen(open);
          if (!open) setSearchTerm("");
        }}
      >
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Chọn phạm vi nuôi trồng
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Bạn có thể chọn vùng nuôi trồng, khu vực hoặc từng lô nuôi cụ thể
            </p>
          </DialogHeader>

          <div className="px-6 pb-5 border-b shrink-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Tìm kiếm phạm vi nuôi trồng..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
              {filteredRegions.map((region) => (
                <div key={region.id} className="space-y-2">
                  <div className="flex items-center gap-2 group">
                    <button
                      type="button"
                      onClick={() => toggleRegion(region.id)}
                      className="p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                      {expandedRegions.includes(region.id) ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <div
                      onClick={() =>
                        handleSelect("region", region.id, undefined, undefined, region.name)
                      }
                      className={cn(
                        "flex-1 flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                        isSelected("region", region.id)
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
                            {region.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Vùng nuôi trồng
                          </div>
                        </div>
                      </div>
                      {isSelected("region", region.id) ? (
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

                  {expandedRegions.includes(region.id) && (
                    <div className="ml-6 pl-4 border-l-2 border-slate-100 space-y-2 py-1">
                      {region.subAreas?.map((area) => {
                        const areaSelected = isSelected("area", region.id, area.id);
                        return (
                          <div key={area.id} className="space-y-2">
                            <div className="flex items-center gap-2 group">
                              <button
                                type="button"
                                onClick={() => toggleArea(area.id)}
                                className="p-1 hover:bg-slate-100 rounded transition-colors"
                              >
                                {expandedAreas.includes(area.id) ? (
                                  <ChevronDown className="w-4 h-4 text-slate-400" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-slate-400" />
                                )}
                              </button>
                              <div
                                onClick={() =>
                                  handleSelect(
                                    "area",
                                    region.id,
                                    area.id,
                                    undefined,
                                    area.name,
                                    region.name,
                                  )
                                }
                                className={cn(
                                  "flex-1 flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                                  areaSelected
                                    ? "bg-primary/10 border-primary/40 opacity-60 cursor-not-allowed"
                                    : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
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
                                {areaSelected ? (
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

                            {expandedAreas.includes(area.id) && (
                              <div className="ml-6 pl-4 border-l-2 border-slate-100 space-y-2 py-1">
                                {area.plots?.map((plot) => {
                                  const plotSelected = isSelected(
                                    "plot",
                                    region.id,
                                    area.id,
                                    plot.id,
                                  );

                                  return (
                                    <div key={plot.id} className="flex items-center gap-2 group">
                                      <div
                                        onClick={() =>
                                          handleSelect(
                                            "plot",
                                            region.id,
                                            area.id,
                                            plot.id,
                                            plot.name,
                                            region.name,
                                            area.name,
                                          )
                                        }
                                        className={cn(
                                          "flex-1 flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                                          plotSelected
                                            ? "bg-primary/10 border-primary/40 opacity-60 cursor-not-allowed"
                                            : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                                        )}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                            <Target className="w-4 h-4" />
                                          </div>
                                          <div>
                                            <div className="font-bold text-slate-800 text-sm">
                                              {plot.name}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                              Lô nuôi
                                            </div>
                                          </div>
                                        </div>
                                        {plotSelected ? (
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
            <Button
              onClick={() => {
                onSelect(tempSelections);
                setIsOpen(false);
              }}
            >
              {tempSelections.length ? `Xác nhận (+${tempSelections.length})` : "Xác nhận"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

type ManagerSelectorProps = {
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
};

export const AquacultureManagerSelector = ({
  selectedIds,
  onSelect,
}: ManagerSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const departments = useMemo(() => {
    return Array.from(
      new Set(
        AQUACULTURE_MANAGERS.map((manager) => manager.department).filter(
          Boolean,
        ),
      ),
    );
  }, []);

  const filteredManagers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return AQUACULTURE_MANAGERS.filter((manager) => {
      const managerPos = manager.position ?? "";
      const managerDept = manager.department ?? "";
      const matchesSearch =
        manager.fullName.toLowerCase().includes(keyword) ||
        managerPos.toLowerCase().includes(keyword) ||
        managerDept.toLowerCase().includes(keyword);
      const matchesDepartment =
        departmentFilter === "all" || managerDept === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [departmentFilter, searchTerm]);

  const selectedManagers = useMemo(
    () =>
      AQUACULTURE_MANAGERS.filter((manager) =>
        selectedIds.includes(String(manager.id)),
      ),
    [selectedIds],
  );

  return (
    <>
      <div
        className={`group border rounded-xl p-4 transition-all hover:shadow-sm cursor-pointer space-y-3 ${
          selectedIds.length > 0
            ? "bg-white border-slate-200"
            : "bg-slate-50 border-dashed border-slate-300"
        }`}
        onClick={() => setIsOpen(true)}
      >
        {selectedIds.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-tighter">
                Đã chọn {selectedIds.length} người
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-slate-400 group-hover:text-primary text-[10px] font-bold uppercase transition-all"
              >
                Chỉnh sửa
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedManagers.map((manager) => {
                const managerPos = manager.position ?? "Nhân viên";
                return (
                  <div
                    key={manager.id}
                    className="flex items-center gap-3 bg-slate-50/50 p-2 rounded-lg border border-slate-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
                      {manager.avatarUrl ? (
                        <img
                          alt={manager.fullName}
                          src={manager.avatarUrl}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-xs truncate">
                        {manager.fullName}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate uppercase font-medium">
                        {managerPos}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            <div className="w-10 h-10 rounded-full bg-white border border-dashed flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium">
              Chọn nhân sự chịu trách nhiệm
            </div>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn nhân sự chịu trách nhiệm</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute z-10 left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên, chức vụ..."
                  className="pl-10 bg-slate-50"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
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
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-75 pr-4">
              <div className="space-y-2">
                {filteredManagers.map((manager) => {
                  const managerPos = manager.position ?? "Nhân viên";
                  const managerDept = manager.department ?? "-";
                  const isSelected = selectedIds.includes(String(manager.id));

                  return (
                    <div
                      key={manager.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? "bg-primary/5 border border-primary/20 shadow-sm"
                          : "hover:bg-slate-50 border border-transparent"
                      }`}
                      onClick={() => {
                        const id = String(manager.id);
                        if (isSelected) {
                          onSelect(selectedIds.filter((selectedId) => selectedId !== id));
                          return;
                        }
                        onSelect([...selectedIds, id]);
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold overflow-hidden text-slate-600">
                        {manager.avatarUrl ? (
                          <img
                            alt={manager.fullName}
                            src={manager.avatarUrl}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          manager.fullName.charAt(0)
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-slate-900">
                          {manager.fullName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {managerPos} - {managerDept}
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  );
                })}

                {filteredManagers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Không tìm thấy nhân sự nào
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

type CertificateSelectorProps = {
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
};

export const AquacultureCertificateSelector = ({
  selectedIds,
  onSelect,
}: CertificateSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(selectedIds);

  const filteredCertificates = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return AQUACULTURE_CERTIFICATES.filter(
      (cert) =>
        cert.name.toLowerCase().includes(keyword) ||
        cert.code.toLowerCase().includes(keyword),
    );
  }, [searchTerm]);

  const selectedPreview = AQUACULTURE_CERTIFICATES.filter((cert) =>
    selectedIds.includes(String(cert.id)),
  );

  return (
    <>
      <div
        className={cn(
          "group border rounded-lg p-3 transition-all min-h-10 flex items-center",
          selectedPreview.length > 0
            ? "bg-white border-slate-200"
            : "bg-slate-50 border-dashed border-slate-300",
          "hover:shadow-sm cursor-pointer",
        )}
        onClick={() => {
          setTempSelectedIds(selectedIds);
          setIsOpen(true);
        }}
      >
        {selectedPreview.length > 0 ? (
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-tighter">
                Đã chọn {selectedPreview.length} chứng nhận
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-slate-400 group-hover:text-primary text-[10px] font-bold uppercase transition-all"
              >
                Chỉnh sửa
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedPreview.map((item) => (
                <Badge
                  key={item.id}
                  variant="secondary"
                  className="bg-slate-100 text-slate-700 border-slate-200"
                >
                  {item.name}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full gap-3 text-muted-foreground group-hover:text-primary transition-all py-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Award className="w-6 h-6 opacity-40 group-hover:opacity-100" />
            </div>
            <div className="text-sm font-semibold">Chọn chứng nhận áp dụng</div>
            <div className="text-[11px] opacity-60">
              Tìm kiếm trong dữ liệu thủy sản mẫu
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) setSearchTerm("");
          setIsOpen(open);
        }}
      >
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Chọn chứng nhận áp dụng
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-5 border-b shrink-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Tìm kiếm..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-3">
              {filteredCertificates.map((item) => {
                const isSelected = tempSelectedIds.includes(String(item.id));
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setTempSelectedIds((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== String(item.id))
                          : [...prev, String(item.id)],
                      )
                    }
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer group w-full text-left",
                      isSelected
                        ? "bg-primary/10 border-primary/40 opacity-70"
                        : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <Checkbox checked={isSelected} className="mt-1" />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-sm truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {item.code}
                        </div>
                      </div>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <div className="w-5 h-5 rounded border-2 border-slate-200 group-hover:border-primary transition-colors flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-transparent" />
                      </div>
                    )}
                  </button>
                );
              })}
              {filteredCertificates.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Search className="w-6 h-6 text-slate-300" />
                  </div>
                  <div className="text-slate-500 font-medium text-sm">
                    Không tìm thấy chứng nhận phù hợp
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                onSelect(tempSelectedIds);
                setIsOpen(false);
              }}
            >
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
