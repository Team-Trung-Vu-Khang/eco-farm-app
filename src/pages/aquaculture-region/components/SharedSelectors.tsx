import { useFarmPersonnel, useMasterData } from "@/features/master-data";
import SharedGeographicalSelector, {
  type GeographicalSelectorProps as SharedGeographicalSelectorProps,
} from "@/shared/components/GeographicalSelector";
import { useSelectedWorkspaceId } from "@/features/workspace";
import useSeedStore from "@/stores/useSeedStore";
import {
  Badge,
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Award,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Layers,
  Loader2,
  MapPin,
  Search,
  Sprout,
  Target,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GeographicalSelection } from "./types";

type RegionOption = {
  id: string | number;
  name: string;
  enterpriseId?: string;
  subAreas?: Array<{
    id: string | number;
    name: string;
    plots?: Array<{ id: string; name: string }>;
  }>;
};

type VarietyOption = {
  varietyCode: string;
  varietyName: string;
};

interface SelectionCardProps {
  regionId: string;
  areaId?: string;
  items: GeographicalSelection[];
  regions: RegionOption[];
  onRemove: (ids: string[]) => void;
}

export const SelectionCard = ({
  regionId,
  areaId,
  items,
  regions,
  onRemove,
}: SelectionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const region = regions.find((r) => r.id.toString() === regionId);
  const area = region?.subAreas?.find((currentArea) => {
    return currentArea.id.toString() === areaId;
  });

  const primaryItem =
    items.find((item) => item.type === "area" || item.type === "region") ||
    items[0];

  const regionName =
    region?.name ||
    primaryItem?.regionName ||
    (primaryItem?.type === "region" ? primaryItem?.name : "");
  const areaName =
    area?.name ||
    primaryItem?.areaName ||
    (primaryItem?.type === "area" ? primaryItem?.name : "");

  const getTypeLabel = (type: GeographicalSelection["type"]) => {
    switch (type) {
      case "region":
        return "Vùng trồng";
      case "area":
        return "Khu vực";
      case "plot":
        return "Lô đất";
    }
  };

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
                onClick={() => onRemove(items.map((item) => item.id))}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              {areaName || regionName}
            </div>
            <div className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium">
              ID: {areaId || regionId}
            </div>
          </div>
        </div>

        {(primaryItem.type !== "region" || items.length > 1) && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
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
                <div className="absolute left-0 top-0 bottom-4 w-px bg-slate-200" />

                <div className="space-y-4">
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
                        {regionName}
                      </div>
                    </div>
                    {items.some((item) => item.type === "region") && (
                      <Badge className="ml-auto bg-primary/10 text-primary border-none text-[10px]">
                        Đã chọn vùng
                      </Badge>
                    )}
                  </div>

                  {areaId && (
                    <div className="relative pl-4">
                      <div className="absolute left-0 w-4 h-px bg-slate-200 top-4" />

                      <div className="pl-4 relative">
                        {items.some((item) => item.type === "plot") && (
                          <div className="absolute left-3.75 top-4 bottom-4 w-px bg-slate-200" />
                        )}

                        <div className="flex items-center gap-3 relative z-10 py-1">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs shrink-0",
                              items.some((item) => item.type === "area")
                                ? "bg-primary/5 border-primary/20"
                                : "bg-slate-50 border-slate-100",
                            )}
                          >
                            <Layers
                              className={cn(
                                "w-3.5 h-3.5",
                                items.some((item) => item.type === "area")
                                  ? "text-primary"
                                  : "text-slate-400",
                              )}
                            />
                          </div>
                          <div>
                            <div
                              className={cn(
                                "text-[10px] uppercase font-bold tracking-wider leading-none mb-1",
                                items.some((item) => item.type === "area")
                                  ? "text-primary/60"
                                  : "text-slate-400",
                              )}
                            >
                              Khu vực
                            </div>
                            <div
                              className={cn(
                                "text-xs font-bold",
                                items.some((item) => item.type === "area")
                                  ? "text-slate-900"
                                  : "text-slate-700",
                              )}
                            >
                              {areaName}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 mt-3">
                          {items
                            .filter((item) => item.type === "plot")
                            .map((plotSelection) => {
                              const plot = area?.plots?.find((currentPlot) => {
                                return currentPlot.id === plotSelection.plotId;
                              });

                              return (
                                <div
                                  key={plotSelection.id}
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
                                      {plot?.name ||
                                        plotSelection.name ||
                                        plotSelection.plotId}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemove([plotSelection.id])}
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


export const GeographicalSelector = (
  props: Omit<SharedGeographicalSelectorProps, "multiSelect">,
) => <SharedGeographicalSelector {...props} multiSelect />;

interface ManagerSelectorProps {
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
}

export const ManagerSelector = ({
  selectedIds,
  onSelect,
}: ManagerSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [loadedPersonnel, setLoadedPersonnel] = useState<any[]>([]);

  const workspaceId = useSelectedWorkspaceId();

  // 1. Dynamic API search query with page size 100 (maximum limit) for infinite scroll
  const {
    items: newItems,
    response,
    loading,
  } = useFarmPersonnel({
    params: {
      keyword: searchTerm.trim() || undefined,
      page,
      size: 100,
    },
    workspaceId: typeof workspaceId === "number" ? workspaceId : undefined,
    enabled: true,
  });

  const { items: departmentItems } = useMasterData("departments", {
    params: { size: 100 },
  });

  const departments = useMemo(() => {
    return departmentItems
      .filter((d) => d.status === "active")
      .map((d) => d.name);
  }, [departmentItems]);

  // Reset page and loaded items when search keyword changes
  useEffect(() => {
    setPage(0);
    setLoadedPersonnel([]);
  }, [searchTerm]);

  // Append new items to loadedPersonnel list when they arrive
  useEffect(() => {
    if (newItems && newItems.length > 0) {
      setLoadedPersonnel((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const filtered = newItems.filter((item) => !existingIds.has(item.id));
        return [...prev, ...filtered];
      });
    }
  }, [newItems]);

  // Client-side department filtering on loaded personnel list
  const filteredManagers = useMemo(() => {
    return loadedPersonnel.filter((manager) => {
      const managerDept = manager.department?.name || manager.department || "";
      return departmentFilter === "all" || managerDept === departmentFilter;
    });
  }, [loadedPersonnel, departmentFilter]);

  // IntersectionObserver for infinite scroll trigger
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observerRef.current || !response || response.last || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [response, loading]);

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
              {selectedIds.map((id) => {
                const manager = loadedPersonnel.find(
                  (person) => person.id.toString() === id,
                );
                if (!manager) return null;

                const managerPos =
                  manager.position?.name || manager.position || "Nhân viên";

                return (
                  <div
                    key={id}
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
                        <User className="w-4 h-4 text-primary" />
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn quản lý vùng trồng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute z-100 left-3 top-2.5 h-4 w-4 text-muted-foreground" />
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
                  const managerPos =
                    manager.position?.name || manager.position || "Nhân viên";
                  const managerDept =
                    manager.department?.name || manager.department || "-";

                  return (
                    <div
                      key={manager.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        selectedIds.includes(manager.id.toString())
                          ? "bg-primary/5 border border-primary/20 shadow-sm"
                          : "hover:bg-slate-50 border border-transparent"
                      }`}
                      onClick={() => {
                        const id = manager.id.toString();
                        if (selectedIds.includes(id)) {
                          onSelect(
                            selectedIds.filter(
                              (selectedId) => selectedId !== id,
                            ),
                          );
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
                      {selectedIds.includes(manager.id.toString()) && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  );
                })}

                {/* Observer anchor for infinite scroll loading */}
                <div ref={observerRef} className="h-2 w-full bg-transparent" />

                {loading && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  </div>
                )}

                {filteredManagers.length === 0 && !loading && (
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

interface CertificateSelectorProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export const CertificateSelector = ({
  selectedIds,
  onToggle,
}: CertificateSelectorProps) => {
  const { items: standards, isLoading } = useMasterData(
    "certificate-standards",
    {
      params: {
        page: 0,
        size: 100,
      },
    },
  );

  if (isLoading) {
    return (
      <div className="text-xs text-muted-foreground animate-pulse p-4">
        Đang tải danh sách chứng nhận...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {standards.map((certificate) => {
          const isSelected = selectedIds.includes(String(certificate.id));
          const orgNames = certificate.issuers?.map((i) => i.name) ?? [];
          const imgUrl = certificate.stampUrl;

          return (
            <div
              key={certificate.id}
              className={`cursor-pointer border rounded-xl p-3 relative flex items-start gap-3 transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-sm"
                  : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
              }`}
              onClick={() => onToggle(String(certificate.id))}
            >
              <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={certificate.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Award
                    className={`w-6 h-6 ${
                      isSelected ? "text-primary" : "text-slate-400"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate pr-4">
                  {certificate.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {certificate.code}
                </div>
                {orgNames.length > 0 && (
                  <div className="text-xs text-slate-500 truncate mt-0.5">
                    {orgNames.join(", ")}
                  </div>
                )}
              </div>
              {isSelected && (
                <div className="absolute top-3 right-3 text-primary animate-in fade-in zoom-in">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface SeedSelectorDialogProps {
  isOpen: boolean;
  variety: VarietyOption | null;
  onSelect: (seedIds: string[]) => void;
  selectedSeedIds?: string[];
  onOpenChange: (open: boolean) => void;
}

export const SeedSelectorDialog = ({
  isOpen,
  variety,
  onSelect,
  selectedSeedIds = [],
  onOpenChange,
}: SeedSelectorDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const { seeds } = useSeedStore();

  const filteredSeeds = useMemo(() => {
    if (!variety) return [];

    return seeds.filter(
      (seed: any) =>
        seed.varietyCode === variety.varietyCode &&
        (seed.varietyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          seed.varietyCode.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [searchTerm, seeds, variety]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          setTempSelectedIds(selectedSeedIds);
        }
        onOpenChange(open);
      }}
    >
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
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <ScrollArea className="h-72 border rounded-xl bg-slate-50/50">
            <div className="p-2 space-y-2">
              {filteredSeeds.map((seed: any) => {
                const isSelected = tempSelectedIds.includes(seed.id);

                return (
                  <div
                    key={seed.id}
                    onClick={() => {
                      if (isSelected) {
                        setTempSelectedIds((prev) =>
                          prev.filter((id) => id !== seed.id),
                        );
                        return;
                      }
                      setTempSelectedIds((prev) => [...prev, seed.id]);
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
