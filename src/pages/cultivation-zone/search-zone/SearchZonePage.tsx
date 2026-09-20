import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  Combobox,
  DataTable,
  Dialog,
  DialogContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Activity,
  Building2,
  ChevronRight,
  Filter,
  Layers,
  MapPin,
  Maximize2,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sprout,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { useLocation } from "wouter";

import {
  useAdminProductionZoneGroups,
  useAdminWorkspaceProductionZones,
} from "@/features/farm/hooks/useAdminProductionZoneSearch";
import { useCultivationZoneById } from "@/features/farm/hooks/useCultivationZones";
import type {
  FarmAdminProductionZoneFilter,
  FarmAdminProductionZoneItem,
} from "@/features/farm/types/admin-production-zone.type";
import { useGeoProvinces } from "@/features/master-data";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  LAND_TYPES,
  type Coordinate,
  type Region,
} from "../../region-chart/constants";
import CultivationRegionDetailBody from "../cultivation-region/CultivationRegionDetailBody";
import { useCultivationRegionDetail } from "../cultivation-region/useCultivationRegionDetail";
import { mockSearchZoneRegions } from "./searchZone.mock";
import {
  RedMarker,
  MapChildLayers,
  MapBoundsSync,
} from "../../dashboard/components/FarmerZoneMapChildLayers";
import {
  FarmerZoneMapUnitDetailPanel,
  type SelectedUnitState,
} from "../../dashboard/components/FarmerZoneMapUnitDetailPanel";
import { useZoneGeographicTree } from "./hooks/useZoneGeographicTree";

type LatLngTuple = [number, number];

const MapCenterSync = ({
  center,
  zoom,
}: {
  center: LatLngTuple;
  zoom: number;
}) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, map, zoom]);

  return null;
};

interface AdvancedFiltersState {
  crops?: string[];
  varieties?: string[];
  provinces?: string[];
  districts?: string[];
  wards?: string[];
  status?: string[];
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

  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersState>(
    {},
  );

  // Selection State
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(
    null,
  );
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<{
    type: "region" | "area" | "plot";
    data: any;
  } | null>(null);

  // UI Toggle State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isCultivationRegionDetailOpen, setIsCultivationRegionDetailOpen] =
    useState(false);

  // Fetch provinces list from Master Data API for Combobox
  const { items: provincesList } = useGeoProvinces({
    params: { size: 100 },
  });

  const provinceOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả Tỉnh / Thành phố" }];
    provincesList.forEach((p) => {
      options.push({
        value: p.name,
        label: p.fullName || p.name,
      });
    });
    return options;
  }, [provincesList]);

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
      province: advancedFilters.provinces?.[0],
      district: advancedFilters.districts?.[0],
      ward: advancedFilters.wards?.[0],
      status: advancedFilters.status?.[0]?.toUpperCase(),
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

  // Query 3: Zone full detail for map & detail dialog
  const { data: zoneDetailResponse } = useCultivationZoneById(
    selectedZoneId || 0,
    {
      enabled: !!selectedZoneId,
      workspaceId: selectedWorkspaceId || undefined,
    },
  );

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

  // Execute dynamic geographic tree query based on zone scopes & selected workspace
  const { zoneNode } = useZoneGeographicTree(
    selectedZoneItem,
    zoneDetailResponse,
    selectedWorkspaceId,
  );

  const activeBounds: [number, number][] | null = useMemo(() => {
    return selectedUnit?.data?.boundary || zoneNode?.boundary || null;
  }, [selectedUnit, zoneNode]);

  const rawCenter = useMemo(() => {
    return (
      selectedUnit?.data?.centerPoint ||
      (selectedUnit?.data?.coordinates
        ? [selectedUnit.data.coordinates.lat, selectedUnit.data.coordinates.lng]
        : null) ||
      zoneNode?.centerPoint ||
      (zoneNode?.coordinates
        ? [zoneNode.coordinates.lat, zoneNode.coordinates.lng]
        : null)
    );
  }, [selectedUnit, zoneNode]);

  const hasValidCenterPoint = useMemo(() => {
    return Boolean(
      rawCenter &&
      !isNaN(Number(rawCenter[0])) &&
      !isNaN(Number(rawCenter[1])) &&
      Number(rawCenter[0]) !== 0 &&
      Number(rawCenter[1]) !== 0,
    );
  }, [rawCenter]);

  const activeCenter: [number, number] = useMemo(() => {
    if (hasValidCenterPoint && rawCenter) {
      return [Number(rawCenter[0]), Number(rawCenter[1])];
    }
    if (activeBounds && activeBounds.length > 0) {
      const sumLat = activeBounds.reduce((acc, curr) => acc + curr[0], 0);
      const sumLng = activeBounds.reduce((acc, curr) => acc + curr[1], 0);
      return [sumLat / activeBounds.length, sumLng / activeBounds.length];
    }
    return [11.53, 106.88];
  }, [rawCenter, activeBounds, hasValidCenterPoint]);

  const activeName =
    selectedUnit?.data?.name || zoneNode?.name || "Bản đồ vùng canh tác";

  const handleNavigateToDetail = useCallback(() => {
    if (!selectedUnit) return;
    const rawId = selectedUnit.data.id || "1";
    const numericId = String(rawId).replace(/^(ZONE|REGION|AREA|PLOT)-/i, "");

    let path = "";
    if (selectedUnit.type === "region") {
      path = `/region-distribution/detail/${numericId}`;
    } else if (selectedUnit.type === "area") {
      path = `/area-distribution/detail/${numericId}`;
    } else if (selectedUnit.type === "plot") {
      path = `/plot-distribution/detail/${numericId}`;
    }

    if (path) {
      window.open(path, "_blank");
    }
  }, [selectedUnit]);

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
    if (advancedFilters.provinces?.length) count++;
    if (advancedFilters.districts?.length) count++;
    if (advancedFilters.wards?.length) count++;
    if (advancedFilters.status?.length) count++;
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
        {/* TOP HEADER: Search & Summary Banner */}
        <div className="bg-white border-b rounded-md p-4 shadow-xs">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm vùng canh tác theo tên, mã vùng, giống áp dụng..."
                  className="pl-10 border-slate-200 focus:ring-primary shadow-xs bg-slate-50/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    <span className="text-primary bg-white rounded-sm text-xs w-5 h-5 flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                <Button className="font-bold" onClick={handleSearch}>
                  Tìm kiếm
                </Button>
              </div>
            </div>

            {/* Results Summary Banner */}
            <div className="relative overflow-hidden rounded-xl border border-green-200 bg-linear-to-r from-green-50 via-white to-green-50 p-5 shadow-xs">
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-green-900 uppercase tracking-wide">
                    Kết quả tìm kiếm toàn hệ thống
                  </h3>
                  <p className="text-sm text-green-700/80 font-medium">
                    Đã tìm thấy{" "}
                    <span className="text-green-600 font-black px-1.5 py-0.5 bg-white rounded-md border border-green-100 shadow-xs">
                      {totalZones}
                    </span>{" "}
                    vùng canh tác phù hợp trên{" "}
                    <span className="text-green-600 font-bold">
                      {workspaceGroups.length}
                    </span>{" "}
                    Đơn vị sở hữu.
                  </p>
                </div>
              </div>
            </div>

            {/* ADVANCED FILTER PANEL */}
            {isAdvancedSearchOpen && (
              <div className="pt-2 animate-in slide-in-from-top-2 duration-200">
                <Card className="bg-white rounded-xl border border-slate-100 shadow-md overflow-hidden">
                  <CardHeader className="px-6 py-4 bg-slate-50/50 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm">
                        <Filter size={18} />
                        Bộ lọc nâng cao
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAdvancedFilters({})}
                        className="text-primary hover:text-primary/80 text-xs font-bold"
                      >
                        Xóa tất cả
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Address: Searchable Combobox for Province from API */}
                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-slate-500 uppercase">
                          Tỉnh / Thành phố
                        </Label>
                        <Combobox
                          options={provinceOptions}
                          value={advancedFilters.provinces?.[0] || ""}
                          onChange={(val) =>
                            setAdvancedFilters((prev) => ({
                              ...prev,
                              provinces: val ? [val] : undefined,
                            }))
                          }
                          placeholder="Chọn hoặc tìm Tỉnh/Thành..."
                          searchPlaceholder="Tìm kiếm Tỉnh / Thành phố..."
                          emptyText="Không tìm thấy Tỉnh/Thành nào"
                        />
                      </div>

                      {/* Area Range with Validation */}
                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-slate-500 uppercase">
                          Khoảng diện tích (ha)
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

                      {/* Status: Select Control */}
                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-slate-500 uppercase">
                          Trạng thái
                        </Label>
                        <Select
                          value={advancedFilters.status?.[0] || "ALL"}
                          onValueChange={(val) =>
                            setAdvancedFilters((prev) => ({
                              ...prev,
                              status: val === "ALL" ? undefined : [val],
                            }))
                          }
                        >
                          <SelectTrigger className="w-full bg-white border-slate-200">
                            <SelectValue placeholder="Tất cả trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">
                              Tất cả trạng thái
                            </SelectItem>
                            <SelectItem value="ACTIVE">
                              Hoạt động (ACTIVE)
                            </SelectItem>
                            <SelectItem value="INACTIVE">
                              Ngưng hoạt động (INACTIVE)
                            </SelectItem>
                            <SelectItem value="ARCHIVED">
                              Lưu trữ (ARCHIVED)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
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
                        setSelectedUnit(null);
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
            {/* Map & Detail Container */}
            <div className="flex-1 flex gap-4 min-h-100 relative">
              {/* Leaflet Map */}
              <div className="flex-1 bg-white rounded-xl border overflow-hidden relative shadow-xs">
                <MapContainer
                  center={activeCenter}
                  zoom={14}
                  className="w-full h-full z-10"
                  zoomControl={false}
                >
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                  <MapBoundsSync
                    bounds={activeBounds}
                    centerPoint={activeCenter}
                  />

                  {/* Render Zone Main Boundary */}
                  {(selectedZoneItem || selectedUnit) &&
                    activeBounds &&
                    activeBounds.length > 0 && (
                      <Polygon
                        positions={activeBounds}
                        pathOptions={{
                          color: "#10b981",
                          fillColor: "#10b981",
                          fillOpacity: 0.15,
                          weight: 2.5,
                        }}
                      />
                    )}

                  {/* Render Child Areas & Plots Boundaries and Markers */}
                  {(selectedZoneItem || selectedUnit) && (
                    <MapChildLayers
                      zone={zoneNode}
                      onSelectUnit={(type, data) =>
                        setSelectedUnit({ type, data })
                      }
                    />
                  )}

                  {/* Render Main Center Marker */}
                  {(selectedZoneItem || selectedUnit) &&
                    hasValidCenterPoint && (
                      <Marker position={activeCenter} icon={RedMarker()}>
                        <Tooltip sticky direction="top" opacity={0.95}>
                          <div style={{ fontWeight: 600, fontSize: 12 }}>
                            {activeName}
                          </div>
                          <div style={{ fontSize: 10, color: "#64748b" }}>
                            Tọa độ trung tâm
                          </div>
                        </Tooltip>
                      </Marker>
                    )}
                </MapContainer>

                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-4 right-4 z-20 bg-white/90 shadow-md font-bold text-xs"
                  onClick={() => setIsMapExpanded(!isMapExpanded)}
                >
                  <Maximize2 size={14} className="mr-1.5" />
                  {isMapExpanded ? "Thu nhỏ bản đồ" : "Phóng to bản đồ"}
                </Button>
              </div>

              {/* Zone Detail Panel (Right Side of Map) */}
              <div className="w-80 bg-white rounded-xl border p-4 shadow-xs flex flex-col overflow-y-auto">
                <FarmerZoneMapUnitDetailPanel
                  selectedZone={zoneNode}
                  selectedUnit={selectedUnit}
                  onSelectUnit={setSelectedUnit}
                  onNavigateToDetail={handleNavigateToDetail}
                />
                {selectedZoneItem && (
                  <Button
                    className="w-full rounded-xl font-bold text-xs h-10 mt-3 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    onClick={() => setIsCultivationRegionDetailOpen(true)}
                  >
                    Xem chi tiết đầy đủ vùng canh tác
                    <ChevronRight size={14} className="ml-1" />
                  </Button>
                )}
              </div>
            </div>

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
                      setSelectedUnit(null);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dialog xem chi tiết đầy đủ 6 tab của vùng canh tác */}
        <Dialog
          open={isCultivationRegionDetailOpen}
          onOpenChange={setIsCultivationRegionDetailOpen}
        >
          <DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] max-h-[92vh] overflow-y-auto p-6 flex flex-col justify-start items-stretch">
            {selectedZoneItem && (
              <CultivationRegionDetailBody
                area={{
                  id: String(selectedZoneItem.id),
                  name: selectedZoneItem.name,
                  targetName: selectedZoneItem.name,
                  targetIds: [selectedZoneItem.id],
                  scope: "region",
                  enterpriseId: String(selectedZoneItem.workspaceId),
                  managerIds: [],
                  selectedCrops: selectedZoneItem.variantNames || [],
                  certificateIds: [],
                  farmingMethodId: "N/A",
                  irrigationMethodId: "N/A",
                  status: (
                    selectedZoneItem.status || "active"
                  ).toLowerCase() as any,
                }}
                details={zoneDetailData.details}
                onBack={() => setIsCultivationRegionDetailOpen(false)}
                onEdit={() => {}}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
};

export default SearchZonePage;
