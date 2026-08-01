import PageWrapper from "@/components/PageWrapper";
import useEnterpriseStore from "@/stores/useEnterpriseStore";
import useRegionStore from "@/stores/useRegionStore";
import {
  Badge,
  Button,
  Combobox,
  DataTable,
  Dialog,
  DialogContent,
  Input,
  Label,
  ScrollArea,
  cn,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Activity,
  Award,
  Building2,
  ChevronRight,
  Filter,
  Layers,
  MapPin,
  Maximize2,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { PROVINCES, type Region } from "../../region-chart/constants";
import { MOCK_ANIMALS, type AnimalDetail } from "./data/animalSearchMockData";

interface AdvancedFilters {
  // Group 1: Animal Info
  groupCropNames?: string[];
  varieties?: string[];
  seedTypes?: string[];
  age?: number;
  status?: string[];

  // Group 2: Husbandry Zone
  regionIds?: number[];

  // Group 3: Certifications
  certifications?: string[];
}

type SearchView = "regions" | "animals";

const getRegionStatusBadge = (status: string) => {
  const config = {
    active: {
      label: "Hoạt động",
      variant: "default" as const,
      className: "bg-emerald-500 text-white",
    },
    inactive: {
      label: "Ngưng",
      variant: "destructive" as const,
      className: "",
    },
    "under-construction": {
      label: "Đang xây dựng",
      variant: "secondary" as const,
      className: "bg-amber-100 text-amber-700",
    },
  };
  const regionStatus =
    status === "active"
      ? "active"
      : status === "under-construction"
        ? "under-construction"
        : "inactive";
  const item = config[regionStatus as keyof typeof config];
  return (
    <Badge
      variant={item.variant}
      className={cn(
        "text-[10px] uppercase font-bold px-1.5 py-0",
        item.className,
      )}
    >
      {item.label}
    </Badge>
  );
};

const RegionListItem = ({
  region,
  enterprises,
  filteredAnimals,
  isActive,
  onClick,
}: {
  region: Region;
  enterprises: Array<{ id: string | number; name?: string }>;
  filteredAnimals: AnimalDetail[];
  isActive: boolean;
  onClick: () => void;
}) => {
  const matchesSearchInRegion = filteredAnimals.filter(
    (a) => a.regionId === region.id,
  );

  const enterprise = enterprises.find(
    (e) => String(e.id) === String(region.enterpriseId),
  );

  return (
    <div
      className={cn(
        "p-4 border-b hover:bg-slate-50 cursor-pointer transition-all duration-200 border-l-4",
        isActive
          ? "bg-primary/5 border-l-primary shadow-inner"
          : "border-l-transparent bg-white",
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <Badge
          variant="outline"
          className="text-[9px] font-black text-slate-400 border-slate-200 uppercase px-1"
        >
          {region.code}
        </Badge>
        {getRegionStatusBadge(region.status)}
      </div>

      <h4
        className={cn(
          "font-bold text-sm mb-1 line-clamp-1",
          isActive ? "text-primary" : "text-slate-800",
        )}
      >
        {region.name}
      </h4>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2">
        <MapPin size={12} className="text-red-500 shrink-0" />
        <span className="truncate">
          {PROVINCES.find((p) => p.id === region.provinceId)?.name ||
            region.provinceId}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded bg-blue-50">
            <Building2 size={10} className="text-blue-600" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium truncate max-w-20">
            {enterprise?.name || "Đơn vị sở hữu"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <div className="p-1 rounded bg-emerald-50">
            <Layers size={10} className="text-emerald-600" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
            {matchesSearchInRegion.length} con
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1">
          <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-600 text-[9px] font-bold border-none px-1.5"
          >
            {region.area} ha
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-primary group-hover:translate-x-1 transition-transform">
          <span>Chi tiết</span>
          <ChevronRight size={10} />
        </div>
      </div>
    </div>
  );
};

// Simplified HusbandryZoneDialog Component
interface HusbandryZoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selections: Region[]) => void;
  initialSelections: Region[];
}

const HusbandryZoneDialog = ({
  open,
  onOpenChange,
  onConfirm,
  initialSelections = [],
}: HusbandryZoneDialogProps) => {
  const { regions } = useRegionStore();
  const { enterprises } = useEnterpriseStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelections, setTempSelections] =
    useState<Region[]>(initialSelections);

  useEffect(() => {
    if (open) {
      setTempSelections(initialSelections);
    }
  }, [open, initialSelections]);

  const filteredRegions = regions.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleSelection = (region: Region) => {
    setTempSelections((prev) =>
      prev.some((s) => s.id === region.id)
        ? prev.filter((s) => s.id !== region.id)
        : [...prev, region],
    );
  };

  const handleConfirm = () => {
    onConfirm(tempSelections);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col overflow-hidden rounded-3xl border-none p-0 shadow-2xl">
        <div className="p-6 bg-slate-50 border-b">
          <h3 className="font-bold text-lg text-slate-800">
            Chọn Vùng Chăn Nuôi
          </h3>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm vùng chăn nuôi theo tên hoặc mã..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-white border-slate-200"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 p-6 bg-white overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {filteredRegions.map((region) => {
              const isSelected = tempSelections.some((s) => s.id === region.id);
              const enterprise = enterprises.find(
                (e) => String(e.id) === String(region.enterpriseId),
              );

              return (
                <div
                  key={region.id}
                  onClick={() => toggleSelection(region)}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-slate-100 hover:border-slate-200 bg-white",
                  )}
                >
                  <div>
                    <div className="flex gap-2 items-center mb-1">
                      <Badge variant="outline" className="text-[9px] font-bold">
                        {region.code}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {enterprise?.name}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-800">
                      {region.name}
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border flex items-center justify-center border-slate-300">
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center p-6 border-t bg-slate-50">
          <div className="text-xs font-bold text-slate-500">
            Đã chọn:{" "}
            <span className="text-primary text-sm font-black">
              {tempSelections.length}
            </span>{" "}
            vùng chăn nuôi
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button size="sm" onClick={handleConfirm}>
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AnimalIdentificationSearchFarmPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { regions } = useRegionStore();
  const { enterprises } = useEnterpriseStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeAnimal, setActiveAnimal] = useState<AnimalDetail | null>(null);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({});
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [currentView, setCurrentView] = useState<SearchView>("regions");
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);

  // Derive unique search options from mock animals
  const animalGroupOptions = useMemo(() => {
    const groups = Array.from(
      new Set(MOCK_ANIMALS.map((a) => a.groupCropName)),
    );
    return groups.map((g) => ({ value: g, label: g }));
  }, []);

  const varietyOptions = useMemo(() => {
    const varieties = Array.from(new Set(MOCK_ANIMALS.map((a) => a.variety)));
    return varieties.map((v) => ({ value: v, label: v }));
  }, []);

  const statusOptions = [
    { value: "healthy", label: "Khỏe mạnh" },
    { value: "diseased", label: "Có dấu hiệu bệnh" },
    { value: "harvesting", label: "Sắp xuất chuồng" },
  ];

  const filteredAnimals = useMemo(() => {
    return MOCK_ANIMALS.filter((animal) => {
      // Basic search
      const matchesSearch =
        animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.variety.toLowerCase().includes(searchQuery.toLowerCase());

      // Advanced filters - Group 1
      const matchesStatus =
        advancedFilters.status && advancedFilters.status.length > 0
          ? advancedFilters.status.includes(animal.status)
          : true;

      const matchesAnimalGroup =
        advancedFilters.groupCropNames &&
        advancedFilters.groupCropNames.length > 0
          ? advancedFilters.groupCropNames.includes(animal.groupCropName)
          : true;

      const matchesVariety =
        advancedFilters.varieties && advancedFilters.varieties.length > 0
          ? advancedFilters.varieties.includes(animal.variety)
          : true;

      const matchesSeedType =
        advancedFilters.seedTypes && advancedFilters.seedTypes.length > 0
          ? advancedFilters.seedTypes.includes(animal.seedType)
          : true;

      const matchesAge = advancedFilters.age
        ? Math.abs(animal.actualAge - advancedFilters.age) <= 2 // Within 2 months
        : true;

      // Advanced filters - Group 2 (Husbandry Zone)
      const matchesRegion =
        advancedFilters.regionIds && advancedFilters.regionIds.length > 0
          ? advancedFilters.regionIds.includes(animal.regionId)
          : true;

      // Advanced filters - Group 3 (Certifications)
      const matchesCertification =
        advancedFilters.certifications &&
        advancedFilters.certifications.length > 0
          ? animal.certifications.some((c) =>
              advancedFilters.certifications?.includes(c.name),
            )
          : true;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAnimalGroup &&
        matchesVariety &&
        matchesSeedType &&
        matchesAge &&
        matchesRegion &&
        matchesCertification
      );
    });
  }, [searchQuery, advancedFilters]);

  const handleSearch = () => {
    toast({
      title: "Tìm kiếm hoàn tất",
      description: `Đã tìm thấy ${filteredAnimals.length} cá thể phù hợp với tiêu chí chăn nuôi.`,
    });
  };

  const handleViewRegion = (regionId: number) => {
    setSelectedRegionId(regionId);
    setCurrentView("animals");

    // Auto-select first animal in this region
    const animalsInRegion = filteredAnimals.filter(
      (a) => a.regionId === regionId,
    );
    if (animalsInRegion.length > 0) {
      setActiveAnimal(animalsInRegion[0]);
    } else {
      setActiveAnimal(null);
    }
  };

  const clearFilters = () => {
    setAdvancedFilters({});
    setSearchQuery("");
    setCurrentView("regions");
    setSelectedRegionId(null);
    setActiveAnimal(null);
  };

  const resetToRegionsView = () => {
    if (currentView !== "regions") {
      setCurrentView("regions");
      setSelectedRegionId(null);
      setActiveAnimal(null);
    }
  };

  const activeFilterCount = Object.keys(advancedFilters).filter((key) => {
    const value = advancedFilters[key as keyof AdvancedFilters];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === "number") {
      return value > 0;
    }
    return value !== undefined && value !== null;
  }).length;

  return (
    <PageWrapper title="Tìm kiếm & Truy xuất nguồn gốc chăn nuôi">
      <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50">
        {/* TOP HEADER: Search & Advanced Search */}
        <div className="bg-white border-b rounded-md p-4 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Nhập tên vật nuôi, mã định danh tai, giống..."
                  className="pl-10 border-slate-200 focus:ring-primary shadow-sm bg-slate-50/50"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    resetToRegionsView();
                  }}
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  variant={isAdvancedSearchOpen ? "default" : "outline"}
                  onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
                >
                  <Filter className="h-4 w-4" />
                  <span>Bộ lọc nâng cao</span>
                  {activeFilterCount > 0 && (
                    <span className="text-primary bg-white rounded text-xs w-5 h-5 flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                <Button className="font-bold" onClick={handleSearch}>
                  Tìm kiếm
                </Button>
              </div>
            </div>

            {/* Premium Search Results Banner */}
            <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-linear-to-r from-primary/5 via-white to-primary/5 p-5 shadow-sm mt-4">
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary uppercase tracking-wide">
                    Kết quả tìm kiếm cá thể
                  </h3>
                  <p className="text-sm text-slate-600 font-medium">
                    Đã tìm thấy{" "}
                    <span className="text-primary font-black px-1.5 py-0.5 bg-white rounded-md border border-primary/10 shadow-xs">
                      {filteredAnimals.length}
                    </span>{" "}
                    cá thể vật nuôi phù hợp với tiêu chí chăn nuôi của bạn.
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Filter Panel */}
            {isAdvancedSearchOpen && (
              <div className="pt-2 animate-in slide-in-from-top-2 duration-200">
                <div className="bg-white rounded-xl border border-slate-100 shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50/50 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm">
                      <Filter size={18} />
                      Bộ lọc nâng cao
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-primary hover:text-primary/80 text-xs font-bold"
                    >
                      Xóa tất cả
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-x divide-slate-100">
                    {/* Column 1: Animal Information */}
                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[11px] mb-4">
                        <Activity size={14} />
                        1. Thông tin vật nuôi
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-bold text-slate-600">
                              Nhóm vật nuôi
                            </Label>
                            {advancedFilters.groupCropNames?.length ? (
                              <button
                                onClick={() =>
                                  setAdvancedFilters({
                                    ...advancedFilters,
                                    groupCropNames: [],
                                  })
                                }
                                className="text-[10px] text-primary font-bold hover:underline"
                              >
                                Xóa
                              </button>
                            ) : null}
                          </div>
                          <Combobox
                            options={animalGroupOptions}
                            value={advancedFilters.groupCropNames?.[0] || ""}
                            onChange={(v) => {
                              setAdvancedFilters({
                                ...advancedFilters,
                                groupCropNames: [v],
                              });
                              resetToRegionsView();
                            }}
                            placeholder="Chọn nhóm vật nuôi..."
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-bold text-slate-600">
                              Giống vật nuôi
                            </Label>
                            {advancedFilters.varieties?.length ? (
                              <button
                                onClick={() =>
                                  setAdvancedFilters({
                                    ...advancedFilters,
                                    varieties: [],
                                  })
                                }
                                className="text-[10px] text-primary font-bold hover:underline"
                              >
                                Xóa
                              </button>
                            ) : null}
                          </div>
                          <Combobox
                            options={varietyOptions}
                            value={advancedFilters.varieties?.[0] || ""}
                            onChange={(v) => {
                              setAdvancedFilters({
                                ...advancedFilters,
                                varieties: [v],
                              });
                              resetToRegionsView();
                            }}
                            placeholder="Chọn giống vật nuôi..."
                            className="w-full"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-600">
                              Độ tuổi (tháng)
                            </Label>
                            <Input
                              type="number"
                              placeholder="Nhập tháng"
                              value={advancedFilters.age || ""}
                              onChange={(e) => {
                                setAdvancedFilters({
                                  ...advancedFilters,
                                  age: parseInt(e.target.value) || undefined,
                                });
                                resetToRegionsView();
                              }}
                              className="w-full h-10 rounded-xl"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <Label className="text-xs font-bold text-slate-600">
                                Trạng thái
                              </Label>
                            </div>
                            <Combobox
                              options={statusOptions}
                              value={advancedFilters.status?.[0] || ""}
                              onChange={(v) => {
                                setAdvancedFilters({
                                  ...advancedFilters,
                                  status: [v],
                                });
                                resetToRegionsView();
                              }}
                              placeholder="Trạng thái..."
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Husbandry Zone */}
                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[11px] mb-4">
                        <MapPin size={14} />
                        2. Vùng chăn nuôi
                      </div>

                      <div className="p-4 rounded-xl border border-slate-100 border-dashed bg-slate-50 space-y-4">
                        <div className="space-y-3">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Vùng đã chọn
                          </div>
                          <div className="min-h-15 p-3 rounded-2xl bg-white border border-slate-100 text-xs text-slate-400 flex items-center justify-center text-center">
                            {advancedFilters.regionIds?.length
                              ? `Đã chọn ${advancedFilters.regionIds.length} vùng`
                              : "Chưa chọn vùng nào"}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full justify-center gap-2 h-12 rounded-2xl bg-white border-slate-200 text-primary font-black shadow-sm hover:bg-slate-50"
                          onClick={() => setIsZoneDialogOpen(true)}
                        >
                          <MapPin size={16} />
                          Chọn vùng chăn nuôi
                        </Button>
                      </div>
                    </div>

                    {/* Column 3: Certifications */}
                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[11px] mb-4">
                        <Award size={14} />
                        3. Chứng nhận chất lượng
                      </div>

                      <div className="p-4 rounded-xl border border-slate-100 bg-white min-h-35">
                        <div className="flex flex-wrap gap-2">
                          {[
                            "VietGAP chăn nuôi",
                            "GlobalGAP",
                            "Organic USDA",
                            "An toàn dịch bệnh",
                          ].map((cert) => (
                            <Badge
                              key={cert}
                              variant={
                                advancedFilters.certifications?.includes(cert)
                                  ? "default"
                                  : "outline"
                              }
                              className={cn(
                                "cursor-pointer py-2 px-4 rounded-xl text-xs font-bold transition-all",
                                advancedFilters.certifications?.includes(cert)
                                  ? "bg-primary border-primary shadow-md shadow-primary/20"
                                  : "bg-white text-slate-600 border-slate-100",
                              )}
                              onClick={() => {
                                const current =
                                  advancedFilters.certifications || [];
                                const updated = current.includes(cert)
                                  ? current.filter((c) => c !== cert)
                                  : [...current, cert];
                                setAdvancedFilters({
                                  ...advancedFilters,
                                  certifications: updated,
                                });
                                resetToRegionsView();
                              }}
                            >
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MAIN BODY: Sidebar | Content */}
        <div className="flex-1 flex relative">
          {/* Sidebar Toggle Button */}
          {isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="absolute left-4 top-4 z-40 w-10 h-10 bg-white shadow-xl border border-slate-100 rounded-xl flex items-center justify-center text-primary hover:bg-slate-50 transition-all animate-in fade-in zoom-in duration-300"
              title="Mở danh sách vùng chăn nuôi"
            >
              <PanelLeftOpen size={20} />
            </button>
          )}

          {/* LEFT SIDEBAR: Region List */}
          <div
            className={cn(
              "bg-white border-r flex flex-col z-30 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out",
              isSidebarCollapsed ? "w-0 opacity-0" : "w-85 lg:w-100",
            )}
          >
            <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between min-w-60">
              <h3 className="font-black text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-primary" />
                Vùng chăn nuôi (
                {
                  regions.filter((r) =>
                    filteredAnimals.some((a) => a.regionId === r.id),
                  ).length
                }
                )
              </h3>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                title="Thu gọn"
              >
                <PanelLeftClose size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto split-scrollbar min-w-60">
              {regions
                .filter((region) =>
                  filteredAnimals.some((a) => a.regionId === region.id),
                )
                .map((region) => (
                  <RegionListItem
                    key={region.id}
                    region={region}
                    enterprises={enterprises}
                    filteredAnimals={filteredAnimals}
                    isActive={selectedRegionId === region.id}
                    onClick={() => handleViewRegion(region.id)}
                  />
                ))}

              {filteredAnimals.length === 0 && (
                <div className="p-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-slate-200" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">
                    Không tìm thấy vùng phù hợp
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT CONTENT: Balanced double panels (Animals table + Animal detail card) */}
          <div className="flex-1 flex flex-col bg-slate-50 relative p-6 space-y-6">
            {!selectedRegionId ? (
              <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center mb-6">
                  <MapPin size={64} className="text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">
                  Chọn vùng chăn nuôi để xem chi tiết
                </h3>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                {(() => {
                  const currentRegion = regions.find(
                    (r) => r.id === selectedRegionId,
                  );
                  const animalsInThisRegion = filteredAnimals.filter(
                    (a) => a.regionId === selectedRegionId,
                  );

                  return (
                    <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                      {/* Owner Enterprise / Vùng Header */}
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border">
                            <Building2 size={24} className="text-slate-300" />
                          </div>
                          <div>
                            <h2 className="font-black text-lg text-slate-800">
                              {enterprises.find(
                                (e) =>
                                  String(e.id) ===
                                  String(currentRegion?.enterpriseId),
                              )?.name || "Đơn vị sở hữu"}
                            </h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                              Vùng: {currentRegion?.name}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="font-black py-1 px-3"
                        >
                          {animalsInThisRegion.length} cá thể
                        </Badge>
                      </div>

                      {/* Content Split: Animals list table (span 8) + Animal details card (span 4) */}
                      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
                        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 overflow-hidden flex flex-col">
                          <div className="p-4 bg-slate-50/50 border-b font-black text-xs uppercase tracking-widest text-slate-500">
                            Danh sách vật nuôi trong vùng
                          </div>
                          <div className="flex-1 overflow-auto p-4">
                            <DataTable
                              columns={
                                [
                                  {
                                    key: "code",
                                    label: "Mã định danh tai",
                                    render: (value: string) => (
                                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg text-xs font-mono">
                                        {value}
                                      </span>
                                    ),
                                  },
                                  {
                                    key: "name",
                                    label: "Tên & Giống",
                                    render: (
                                      value: string,
                                      item: AnimalDetail,
                                    ) => (
                                      <div>
                                        <div className="font-black text-slate-800 text-sm leading-tight">
                                          {value}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                                          {item.variety}
                                        </div>
                                      </div>
                                    ),
                                  },
                                  {
                                    key: "plantedDate",
                                    label: "Ngày nhận nuôi",
                                    render: (value: string) => (
                                      <span className="text-xs font-bold text-slate-600">
                                        {new Date(value).toLocaleDateString(
                                          "vi-VN",
                                        )}
                                      </span>
                                    ),
                                  },
                                  {
                                    key: "actualAge",
                                    label: "Tuổi (tháng)",
                                    render: (value: number) => (
                                      <span className="text-xs font-bold text-slate-600">
                                        {value} tháng
                                      </span>
                                    ),
                                  },
                                  {
                                    key: "plotName",
                                    label: "Chuồng/Lô",
                                    render: (value: string) => (
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] border-slate-200 text-slate-500 font-bold"
                                      >
                                        {value}
                                      </Badge>
                                    ),
                                  },
                                ] as Column<AnimalDetail>[]
                              }
                              data={animalsInThisRegion}
                              onView={setActiveAnimal}
                            />
                          </div>
                        </div>

                        {/* Right Detail Card for Selected Animal */}
                        <div className="lg:col-span-4 bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 overflow-y-auto split-scrollbar flex flex-col">
                          {activeAnimal ? (
                            <div className="space-y-4 flex-1 flex flex-col">
                              <img
                                src={activeAnimal.image}
                                className="w-full h-36 object-cover rounded-2xl mb-2 shadow-xs border border-slate-100"
                                alt={activeAnimal.name}
                              />
                              <div className="space-y-1">
                                <h4 className="font-black text-lg text-slate-800 leading-tight">
                                  {activeAnimal.name}
                                </h4>
                                <Badge className="bg-primary/10 text-primary uppercase font-black text-xs px-2 py-0.5">
                                  {activeAnimal.code}
                                </Badge>
                              </div>

                              <div className="space-y-3 pt-2 text-xs divide-y divide-slate-100 flex-1">
                                <div className="flex justify-between items-center py-2">
                                  <span className="text-slate-400 font-medium">
                                    Giống vật nuôi:
                                  </span>
                                  <span className="text-slate-800 font-bold">
                                    {activeAnimal.variety}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                  <span className="text-slate-400 font-medium">
                                    Giai đoạn:
                                  </span>
                                  <span className="text-slate-800 font-bold">
                                    {activeAnimal.growthStage}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                  <span className="text-slate-400 font-medium">
                                    Vị trí chăn nuôi:
                                  </span>
                                  <span className="text-slate-800 font-bold">
                                    {activeAnimal.plotName}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                  <span className="text-slate-400 font-medium">
                                    Hiện trạng:
                                  </span>
                                  <Badge className="bg-emerald-500 text-white text-[9px] uppercase font-black px-1.5 py-0">
                                    {activeAnimal.status === "healthy"
                                      ? "Khỏe mạnh"
                                      : activeAnimal.status}
                                  </Badge>
                                </div>
                                <div className="py-2">
                                  <span className="text-slate-400 font-medium block mb-1">
                                    Ghi chú:
                                  </span>
                                  <p className="text-slate-600 italic">
                                    "{activeAnimal.notes}"
                                  </p>
                                </div>
                              </div>

                              <Button
                                className="w-full h-11 rounded-xl font-black shadow-lg shadow-primary/10 mt-auto gap-2"
                                onClick={() =>
                                  setLocation(
                                    `/animal-identification/${activeAnimal.id}`,
                                  )
                                }
                              >
                                <Maximize2 size={16} />
                                Xem chi tiết đầy đủ
                              </Button>
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 italic text-center text-sm py-12">
                              Chọn một vật nuôi trong bảng để xem thông số chi
                              tiết
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Husbandry Zone Picker Dialog */}
        <HusbandryZoneDialog
          open={isZoneDialogOpen}
          onOpenChange={setIsZoneDialogOpen}
          initialSelections={regions.filter((r) =>
            advancedFilters.regionIds?.includes(r.id),
          )}
          onConfirm={(selections) => {
            setAdvancedFilters({
              ...advancedFilters,
              regionIds: selections.map((s) => s.id),
            });
            resetToRegionsView();
          }}
        />
      </div>
    </PageWrapper>
  );
};

export default AnimalIdentificationSearchFarmPage;
