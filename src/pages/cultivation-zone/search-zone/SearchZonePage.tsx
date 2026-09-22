import PageWrapper from "@/components/PageWrapper";
import { RemoteMultiSelect } from "@/components/RemoteMultiSelect";
import type { CultivationRegion } from "@/stores/useCultivationRegionStore";
import { ZoneDetailDialog } from "./components/ZoneDetailDialog";
import {
  Badge,
  Button,
  cn,
  DataTable,
  RemoteAutoCompleteSelect,
  Input,
  Label,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Activity,
  Building2,
  ChevronRight,
  Layers,
  MapPin,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sprout,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useLocation } from "wouter";

import {
  useAdminProductionZoneGroups,
  useAdminWorkspaceProductionZones,
} from "@/features/farm/hooks/useAdminProductionZoneSearch";
import type {
  FarmAdminProductionZoneFilter,
  FarmAdminProductionZoneItem,
} from "@/features/farm/types/admin-production-zone.type";
import { useGeoProvinces, useGeoWards } from "@/features/master-data";
import {
  useProductionSubjects,
  useProductionSubjectVariants,
} from "@/features/foundation";
import { useAdminWorkspaces } from "@/features/workspace/hooks/useAdminWorkspaces";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  LAND_TYPES,
  type Coordinate,
  type Region,
} from "../../region-chart/constants";
import { useCultivationRegionDetail } from "../cultivation-region/useCultivationRegionDetail";
import { mockSearchZoneRegions } from "./searchZone.mock";

interface AdvancedFiltersState {
  // Province/ward are selected by code (remote search) but the API
  // filters by name, so both are kept.
  provinceCode?: string;
  provinceName?: string;
  wardCode?: string;
  wardName?: string;
  productionSubjectId?: number;
  productionSubjectVariantId?: number;
  workspaceIds?: number[];
  minArea?: number;
  maxArea?: number;
  hasActivePlan?: boolean;
}

const SearchZonePage = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const searchDebounce = useDebounce(searchQuery, 500);

  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersState>(
    {},
  );

  // Selection State
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(
    null,
  );
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);

  // UI Toggle State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCultivationRegionDetailOpen, setIsCultivationRegionDetailOpen] =
    useState(false);

  // ── Remote search terms for each filter select ──────────────────────────
  const [cropSearch, setCropSearch] = useState("");
  const [varietySearch, setVarietySearch] = useState("");
  const [provinceSearch, setProvinceSearch] = useState("");
  const [wardSearch, setWardSearch] = useState("");
  const [workspaceSearch, setWorkspaceSearch] = useState("");

  const debouncedCropSearch = useDebounce(cropSearch, 300);
  const debouncedVarietySearch = useDebounce(varietySearch, 300);
  const debouncedProvinceSearch = useDebounce(provinceSearch, 300);
  const debouncedWardSearch = useDebounce(wardSearch, 300);
  const debouncedWorkspaceSearch = useDebounce(workspaceSearch, 300);

  // Crops (production subjects) — remote keyword search
  const { items: cropsList, isFetching: isFetchingCrops } =
    useProductionSubjects({
      params: {
        domainCode: "CROP",
        size: 20,
        keyword: debouncedCropSearch.trim() || undefined,
      },
    });

  const cropOptions = useMemo(
    () =>
      cropsList.map((crop) => ({ value: String(crop.id), label: crop.name })),
    [cropsList],
  );

  // Crop varieties — remote keyword search, scoped to the selected crop
  const { items: varietiesList, isFetching: isFetchingVarieties } =
    useProductionSubjectVariants({
      params: {
        domainCode: "CROP",
        size: 20,
        subjectId: advancedFilters.productionSubjectId,
        keyword: debouncedVarietySearch.trim() || undefined,
      },
    });

  const varietyOptions = useMemo(
    () =>
      varietiesList.map((variety) => ({
        value: String(variety.id),
        label: variety.name,
      })),
    [varietiesList],
  );

  // Provinces — remote keyword search
  const { items: provincesList, isFetching: isFetchingProvinces } =
    useGeoProvinces({
      params: {
        size: 20,
        keyword: debouncedProvinceSearch.trim() || undefined,
      },
    });

  const provinceOptions = useMemo(
    () =>
      provincesList.map((province) => ({
        value: province.code,
        label: province.fullName || province.name,
      })),
    [provincesList],
  );

  // Wards — remote keyword search within the selected province
  const selectedProvinceCode = advancedFilters.provinceCode;

  const { items: wardsList, isFetching: isFetchingWards } = useGeoWards({
    params: {
      provinceCode: selectedProvinceCode ?? "",
      size: 20,
      keyword: debouncedWardSearch.trim() || undefined,
    },
    enabled: !!selectedProvinceCode,
  });

  const wardOptions = useMemo(
    () =>
      wardsList.map((w) => ({
        value: w.code,
        label: w.fullName || w.name,
      })),
    [wardsList],
  );

  // Owning units (workspaces) — remote keyword search, multi-value
  const { items: workspacesList, isFetching: isFetchingWorkspaces } =
    useAdminWorkspaces({
      params: {
        size: 20,
        keyword: debouncedWorkspaceSearch.trim() || undefined,
      },
    });

  // Keep already-selected workspaces visible even when the remote
  // result set no longer contains them.
  const [selectedWorkspaceOptions, setSelectedWorkspaceOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const workspaceOptions = useMemo(() => {
    const fetched = workspacesList.map((ws) => ({
      value: String(ws.id),
      label: ws.name,
    }));
    const fetchedValues = new Set(fetched.map((o) => o.value));
    const pinned = selectedWorkspaceOptions.filter(
      (o) => !fetchedValues.has(o.value),
    );
    return [...pinned, ...fetched];
  }, [workspacesList, selectedWorkspaceOptions]);

  // Validation: acreageFrom cannot be greater than acreageTo
  const isAreaRangeInvalid = useMemo(() => {
    return (
      advancedFilters.minArea !== undefined &&
      advancedFilters.maxArea !== undefined &&
      advancedFilters.minArea > advancedFilters.maxArea
    );
  }, [advancedFilters.minArea, advancedFilters.maxArea]);

  // Construct API filter
  const apiFilter = useMemo<FarmAdminProductionZoneFilter>(() => {
    return {
      keyword: searchDebounce.trim() || undefined,
      domainCode: "CROP",
      province: advancedFilters.provinceName,
      ward: advancedFilters.wardName,
      productionSubjectId: advancedFilters.productionSubjectId,
      productionSubjectVariantId: advancedFilters.productionSubjectVariantId,
      workspaceIds: advancedFilters.workspaceIds?.length
        ? advancedFilters.workspaceIds
        : undefined,
      hasActivePlan: advancedFilters.hasActivePlan,
      acreageFrom: isAreaRangeInvalid ? undefined : advancedFilters.minArea,
      acreageTo: isAreaRangeInvalid ? undefined : advancedFilters.maxArea,
    };
  }, [searchDebounce, advancedFilters, isAreaRangeInvalid]);

  // Query 1: Admin Production Zone Groups (System-wide search by workspace)
  const {
    groups: workspaceGroups,
    totalZones,
    loading: isGroupsLoading,
  } = useAdminProductionZoneGroups({ filter: apiFilter });

  // Query 2: Production zones inside selected workspace
  const { items: workspaceZones, loading: isZonesLoading } =
    useAdminWorkspaceProductionZones({
      workspaceId: selectedWorkspaceId,
      filter: apiFilter,
    });

  const zoneDetailData = useCultivationRegionDetail(
    selectedZoneId ? String(selectedZoneId) : null,
    selectedWorkspaceId,
  );

  // Active workspace info
  const selectedWorkspace = useMemo(() => {
    if (!selectedWorkspaceId) return null;
    return (
      workspaceGroups.find((g) => g.workspaceId === selectedWorkspaceId) ?? null
    );
  }, [workspaceGroups, selectedWorkspaceId]);

  // Selected zone item from workspace list
  const selectedZoneItem = useMemo(() => {
    if (!selectedZoneId) return null;
    return workspaceZones.find((z) => z.id === selectedZoneId) ?? null;
  }, [workspaceZones, selectedZoneId]);

  const handleSearch = () => {
    toast({
      title: "Tìm kiếm hoàn tất",
      description: `Đã tìm thấy ${totalZones} vùng canh tác phù hợp trên hệ thống.`,
    });
  };

  const getStatusLabel = (status: string) => {
    const config = {
      active: "Hoạt động",
      inactive: "Ngưng hoạt động",
      archived: "Lưu trữ",
    };
    return config[status as keyof typeof config] || status;
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || "").toLowerCase();
    const config = {
      active: { label: "Hoạt động", variant: "default" as const },
      inactive: { label: "Ngưng hoạt động", variant: "destructive" as const },
      archived: { label: "Lưu trữ", variant: "secondary" as const },
    };
    const current = config[s as keyof typeof config] || {
      label: status || "Không xác định",
      variant: "outline" as const,
    };

    return <Badge variant={current.variant}>{current.label}</Badge>;
  };

  const columns: Column<FarmAdminProductionZoneItem>[] = [
    {
      key: "code",
      label: "Mã vùng",
      render: (value) => (
        <span className="font-semibold text-slate-600 text-xs">
          {String(value || "--")}
        </span>
      ),
    },
    {
      key: "name",
      label: "Tên vùng canh tác",
      render: (value) => (
        <span className="font-bold text-slate-800 text-sm leading-tight">
          {String(value)}
        </span>
      ),
    },
    {
      key: "acreageHa",
      label: "Diện tích (ha)",
      render: (value) => (
        <span className="font-medium text-slate-700 text-xs">
          {value !== undefined && value !== null ? `${value} ha` : "--"}
        </span>
      ),
    },
    {
      key: "variantNames",
      label: "Giống áp dụng",
      render: (value) => {
        const variants = Array.isArray(value) ? value : [];
        if (!variants.length)
          return <span className="text-slate-400 text-xs">--</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {variants.map((v, i) => (
              <Badge
                key={i}
                variant="outline"
                className="text-[10px] bg-green-50 text-green-700 border-green-200"
              >
                {v}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => getStatusBadge(String(value)),
    },
  ];

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (advancedFilters.provinceCode) count++;
    if (advancedFilters.wardCode) count++;
    if (advancedFilters.productionSubjectId !== undefined) count++;
    if (advancedFilters.productionSubjectVariantId !== undefined) count++;
    if (advancedFilters.workspaceIds?.length) count++;
    if (
      advancedFilters.minArea !== undefined ||
      advancedFilters.maxArea !== undefined
    )
      count++;
    if (advancedFilters.hasActivePlan) count++;
    return count;
  }, [advancedFilters]);

  return (
    <PageWrapper title="Tìm kiếm vùng canh tác">
      <div className="min-h-[calc(100vh-64px)] flex flex-col bg-slate-50">
        {/* TOP HEADER: Search form + result summary */}
        <div className="bg-white border-b px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-xl border border-slate-200 bg-white">
              {/* Search bar + result count */}
              <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Tìm theo tên, mã vùng, giống áp dụng..."
                    className="h-10 border-slate-200 bg-white pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button className="h-10 font-semibold" onClick={handleSearch}>
                    Tìm kiếm
                  </Button>
                  {(activeFilterCount > 0 || searchQuery) && (
                    <Button
                      variant="ghost"
                      className="h-10 text-slate-500 hover:text-slate-900"
                      onClick={() => {
                        setAdvancedFilters({});
                        setSearchQuery("");
                      }}
                    >
                      Xóa lọc
                      {activeFilterCount > 0 && ` (${activeFilterCount})`}
                    </Button>
                  )}
                </div>
                <div className="hidden items-center gap-2 border-l border-slate-100 pl-4 text-sm text-slate-500 lg:flex">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>
                    <span className="font-bold text-slate-900">
                      {totalZones}
                    </span>{" "}
                    vùng ·{" "}
                    <span className="font-bold text-slate-900">
                      {workspaceGroups.length}
                    </span>{" "}
                    đơn vị
                  </span>
                </div>
              </div>

              {/* Filters */}
              <div className="p-4">
                {/* GROUP 1: Growing zone information */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <Sprout size={13} />
                    Thông tin vùng trồng
                  </h4>
                  <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-3">
                    {/* Crop: remote search from Production Subjects */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-600">
                        Cây trồng
                      </Label>
                      <RemoteAutoCompleteSelect
                        options={cropOptions}
                        value={
                          advancedFilters.productionSubjectId !== undefined
                            ? String(advancedFilters.productionSubjectId)
                            : ""
                        }
                        onChange={(val) =>
                          setAdvancedFilters((prev) => ({
                            ...prev,
                            productionSubjectId: val ? Number(val) : undefined,
                            // Reset variety when the crop changes
                            productionSubjectVariantId: undefined,
                          }))
                        }
                        onSearch={setCropSearch}
                        loading={isFetchingCrops}
                        placeholder="Tất cả cây trồng"
                        searchPlaceholder="Tìm kiếm cây trồng..."
                        emptyText="Không tìm thấy cây trồng nào"
                      />
                    </div>

                    {/* Variety: cascades from the selected crop */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-600">
                        Giống cây
                      </Label>
                      <RemoteAutoCompleteSelect
                        options={varietyOptions}
                        value={
                          advancedFilters.productionSubjectVariantId !==
                          undefined
                            ? String(advancedFilters.productionSubjectVariantId)
                            : ""
                        }
                        onChange={(val) =>
                          setAdvancedFilters((prev) => ({
                            ...prev,
                            productionSubjectVariantId: val
                              ? Number(val)
                              : undefined,
                          }))
                        }
                        onSearch={setVarietySearch}
                        loading={isFetchingVarieties}
                        placeholder="Tất cả giống cây"
                        searchPlaceholder="Tìm kiếm giống cây..."
                        emptyText="Không tìm thấy giống cây nào"
                      />
                    </div>

                    {/* Area Range with Validation */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-600">
                        Diện tích (ha)
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Từ ha"
                          min={0}
                          className={cn(
                            isAreaRangeInvalid &&
                              "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                          )}
                          value={advancedFilters.minArea ?? ""}
                          onChange={(e) =>
                            setAdvancedFilters((prev) => ({
                              ...prev,
                              minArea:
                                e.target.value !== ""
                                  ? Number(e.target.value)
                                  : undefined,
                            }))
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Đến ha"
                          min={0}
                          className={cn(
                            isAreaRangeInvalid &&
                              "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                          )}
                          value={advancedFilters.maxArea ?? ""}
                          onChange={(e) =>
                            setAdvancedFilters((prev) => ({
                              ...prev,
                              maxArea:
                                e.target.value !== ""
                                  ? Number(e.target.value)
                                  : undefined,
                            }))
                          }
                        />
                      </div>
                      {isAreaRangeInvalid && (
                        <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                          ⚠️ Diện tích "Từ" không được lớn hơn "Đến"
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* GROUP 2: Area information */}
                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                  <h4 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <MapPin size={13} />
                    Thông tin khu vực
                  </h4>
                  <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-3">
                    {/* Province from Master Data API */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-600">
                        Tỉnh / Thành
                      </Label>
                      <RemoteAutoCompleteSelect
                        options={provinceOptions}
                        value={advancedFilters.provinceCode || ""}
                        onChange={(val) => {
                          const province = provincesList.find(
                            (item) => item.code === val,
                          );
                          setAdvancedFilters((prev) => ({
                            ...prev,
                            provinceCode: val || undefined,
                            provinceName: province?.name,
                            // Reset ward when the province changes
                            wardCode: undefined,
                            wardName: undefined,
                          }));
                          setWardSearch("");
                        }}
                        onSearch={setProvinceSearch}
                        loading={isFetchingProvinces}
                        placeholder="Tất cả Tỉnh / Thành"
                        searchPlaceholder="Tìm kiếm Tỉnh / Thành..."
                        emptyText="Không tìm thấy Tỉnh/Thành nào"
                      />
                    </div>

                    {/* Ward: cascades from the selected province */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-600">
                        Phường / Xã
                      </Label>
                      <RemoteAutoCompleteSelect
                        options={wardOptions}
                        value={advancedFilters.wardCode || ""}
                        onChange={(val) => {
                          const ward = wardsList.find(
                            (item) => item.code === val,
                          );
                          setAdvancedFilters((prev) => ({
                            ...prev,
                            wardCode: val || undefined,
                            wardName: ward?.name,
                          }));
                        }}
                        onSearch={setWardSearch}
                        loading={isFetchingWards}
                        placeholder={
                          selectedProvinceCode
                            ? "Tất cả Phường / Xã"
                            : "Chọn Tỉnh/Thành trước"
                        }
                        searchPlaceholder="Tìm kiếm Phường / Xã..."
                        emptyText="Không tìm thấy Phường/Xã nào"
                        disabled={!selectedProvinceCode}
                      />
                    </div>

                    {/* Owning Unit: multi-value select */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-600">
                        Đơn vị sở hữu
                      </Label>
                      <RemoteMultiSelect
                        options={workspaceOptions}
                        value={(advancedFilters.workspaceIds ?? []).map(String)}
                        onChange={(next) => {
                          // Pin the chosen labels so they survive
                          // a narrowed remote result set.
                          setSelectedWorkspaceOptions(
                            next.map(
                              (val) =>
                                workspaceOptions.find(
                                  (o) => o.value === val,
                                ) ?? { value: val, label: val },
                            ),
                          );
                          setAdvancedFilters((prev) => ({
                            ...prev,
                            workspaceIds: next.length
                              ? next.map(Number)
                              : undefined,
                          }));
                        }}
                        onSearch={setWorkspaceSearch}
                        loading={isFetchingWorkspaces}
                        placeholder="Tất cả đơn vị sở hữu"
                        searchPlaceholder="Tìm kiếm đơn vị sở hữu..."
                        emptyText="Không tìm thấy đơn vị nào"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN BODY: Left Sidebar + Map/Table Content */}
        <div className="flex-1 flex overflow-hidden p-4 gap-4">
          {/* LEFT SIDEBAR: Workspaces List */}
          <div
            className={cn(
              "bg-white rounded-xl border flex flex-col transition-all duration-300 shadow-sm shrink-0",
              isSidebarCollapsed ? "w-16" : "w-80",
            )}
          >
            <div className="p-4 border-b flex items-center justify-between bg-slate-50/50">
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-700">
                  <Building2 size={16} className="text-primary" />
                  <span>Đơn vị sở hữu ({workspaceGroups.length})</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 ml-auto"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen size={18} />
                ) : (
                  <PanelLeftClose size={18} />
                )}
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {isGroupsLoading ? (
                <div className="p-6 text-center text-slate-400 text-xs italic">
                  Đang tải danh sách Đơn vị...
                </div>
              ) : workspaceGroups.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs italic">
                  Không tìm thấy Đơn vị nào
                </div>
              ) : (
                workspaceGroups.map((group) => {
                  const isActive = selectedWorkspaceId === group.workspaceId;

                  return (
                    <div
                      key={group.workspaceId}
                      className={cn(
                        "p-4 border-l-4 cursor-pointer transition-all hover:bg-slate-50 flex items-center gap-3",
                        isActive
                          ? "bg-primary/5 border-l-primary shadow-inner"
                          : "border-l-transparent bg-white",
                      )}
                      onClick={() => {
                        setSelectedWorkspaceId(group.workspaceId);
                        setSelectedZoneId(null);
                      }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border flex items-center justify-center shrink-0">
                        {group.imageUrl ? (
                          <img
                            src={group.imageUrl}
                            alt={group.workspaceName}
                            className="w-full h-full rounded-xl object-cover"
                          />
                        ) : (
                          <Building2 size={20} className="text-slate-400" />
                        )}
                      </div>

                      {!isSidebarCollapsed && (
                        <div className="flex-1 min-w-0">
                          <h4
                            className={cn(
                              "font-bold text-sm truncate leading-snug",
                              isActive ? "text-primary" : "text-slate-800",
                            )}
                          >
                            {group.workspaceName}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            {group.zoneCount} vùng canh tác
                          </p>
                        </div>
                      )}

                      {!isSidebarCollapsed && (
                        <ChevronRight
                          size={16}
                          className={cn(
                            "transition-transform shrink-0",
                            isActive
                              ? "text-primary rotate-90"
                              : "text-slate-300",
                          )}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            {/* Bottom DataTable Section */}
            <div className="bg-white rounded-xl border flex flex-col min-h-72 shadow-xs">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b">
                <div className="font-black text-xs uppercase tracking-widest text-slate-600 flex items-center gap-2">
                  <Sprout size={16} className="text-primary" />
                  <span>
                    Danh sách vùng canh tác{" "}
                    {selectedWorkspace
                      ? `— ${selectedWorkspace.workspaceName}`
                      : ""}
                  </span>
                </div>
                {selectedWorkspaceId !== null && (
                  <Badge variant="outline" className="font-bold">
                    {workspaceZones.length} vùng
                  </Badge>
                )}
              </div>

              <div className="flex-1 overflow-auto p-4">
                {selectedWorkspaceId === null ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Building2 className="w-12 h-12 text-slate-300 mb-3" />
                    <h4 className="text-sm font-bold text-slate-700">
                      Vui lòng chọn 1 Đơn vị sở hữu
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      Chọn một Đơn vị sở hữu ở danh sách bên trái để xem chi
                      tiết danh sách các vùng canh tác thuộc đơn vị đó.
                    </p>
                  </div>
                ) : isZonesLoading ? (
                  <div className="py-12 text-center text-slate-400 text-xs italic">
                    Đang tải danh sách vùng canh tác...
                  </div>
                ) : workspaceZones.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs italic">
                    Không có vùng canh tác nào phù hợp trong Đơn vị này
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={workspaceZones}
                    onView={(zone) => {
                      setSelectedZoneId(zone.id);
                      setIsCultivationRegionDetailOpen(true);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Zone profile dialog — crop-profile theme, zone tabs */}
        <ZoneDetailDialog
          open={isCultivationRegionDetailOpen}
          onOpenChange={setIsCultivationRegionDetailOpen}
          area={
            selectedZoneItem
              ? {
                  id: String(selectedZoneItem.id),
                  name: selectedZoneItem.name,
                  targetName: selectedZoneItem.name,
                  targetIds: [String(selectedZoneItem.id)],
                  scope: "region",
                  enterpriseId: String(selectedZoneItem.workspaceId),
                  managerIds: [],
                  selectedCrops: selectedZoneItem.variantNames || [],
                  certificateIds: [],
                  note: "",
                  createdAt: "",
                  farmingMethodId: "N/A",
                  irrigationMethodId: "N/A",
                  status: (
                    selectedZoneItem.status || "active"
                  ).toLowerCase() as CultivationRegion["status"],
                }
              : null
          }
          details={zoneDetailData.details}
          code={selectedZoneItem?.code}
          workspaceName={selectedWorkspace?.workspaceName}
        />
      </div>
    </PageWrapper>
  );
};

export default SearchZonePage;
