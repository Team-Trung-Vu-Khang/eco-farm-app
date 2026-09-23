import treeMarkerIcon from "@/assets/tree.webp";
import PageWrapper from "@/components/PageWrapper";
import { plantIdentificationApi } from "@/features/farm/api/farm.api";
import { useCultivationZones } from "@/features/farm/hooks/useCultivationZones";
import { plantKeys } from "@/features/farm/hooks/usePlantIdentifications";
import { useSeeds } from "@/features/farm/hooks/useSeeds";
import type {
  FarmPlantHealthStatus,
  FarmPlantIdentificationResponse,
  PlantIdentificationQueryParams,
} from "@/features/farm/types/farm.type";
import { useProductionSubjectVariants } from "@/features/foundation/hooks/useProductionSubjects";
import { useMasterData } from "@/features/master-data";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  Badge,
  Button,
  Input,
  Label,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ChevronRight,
  Filter,
  Loader2,
  Maximize2,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sprout,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import type { CropDetail } from "../constants";
import { CropDetailDialog } from "./components/CropDetailDialog";
import {
  PLANT_HEALTH_STATUS_LABELS,
  PLANT_HEALTH_STATUS_STYLES,
} from "../cultivation-region/components/types";

type LatLngTuple = [number, number];
type PlantItem = FarmPlantIdentificationResponse;

const PAGE_SIZE = 20;
const DEFAULT_CENTER: LatLngTuple = [11.53, 106.88];
const ALL = "__all__";
const DAYS_PER_MONTH = 30;

const cropMarkerIcon = L.icon({
  iconUrl: treeMarkerIcon,
  iconSize: [36, 36],
  iconAnchor: [18, 34],
});

/**
 * Bộ lọc nâng cao — chỉ gồm các tham số API
 * GET /farm/production-identifications hỗ trợ.
 */
interface AdvancedFilters {
  healthStatus?: FarmPlantHealthStatus;
  /** Giống cây */
  productionSubjectVariantId?: number;
  /** Hạt giống */
  subjectVariantId?: number;
  /** Tuổi cây (tháng) — quy đổi sang ngày khi gọi API */
  ageFromMonths?: number;
  ageToMonths?: number;
  /** Vùng canh tác (OR) */
  productionZoneIds?: number[];
  /** Loại chứng nhận (OR) */
  agricultureCertificateIds?: number[];
}

const toQueryParams = (
  keyword: string,
  filters: AdvancedFilters,
): PlantIdentificationQueryParams => ({
  domainCode: "CROP",
  keyword: keyword.trim() || undefined,
  healthStatus: filters.healthStatus,
  productionSubjectVariantId: filters.productionSubjectVariantId,
  subjectVariantId: filters.subjectVariantId,
  durationDaysFrom:
    filters.ageFromMonths !== undefined
      ? filters.ageFromMonths * DAYS_PER_MONTH
      : undefined,
  durationDaysTo:
    filters.ageToMonths !== undefined
      ? filters.ageToMonths * DAYS_PER_MONTH
      : undefined,
  productionZoneIds: filters.productionZoneIds?.length
    ? filters.productionZoneIds
    : undefined,
  agricultureCertificateIds: filters.agricultureCertificateIds?.length
    ? filters.agricultureCertificateIds
    : undefined,
});

const countActiveFilters = (filters: AdvancedFilters) =>
  Object.values(filters).filter((value) =>
    Array.isArray(value) ? value.length > 0 : value !== undefined,
  ).length;

const getCoordinate = (plant: PlantItem): LatLngTuple | null =>
  typeof plant.latitude === "number" && typeof plant.longitude === "number"
    ? [plant.latitude, plant.longitude]
    : null;

const getVarietyName = (plant: PlantItem) =>
  plant.productionSubjectVariant?.name ||
  plant.subjectVariant?.name ||
  "Chưa có giống";

/** Vị trí: Lô · Khu vực · Vùng theo phạm vi được gán */
const getLocationText = (plant: PlantItem) => {
  const location = plant.location;
  if (!location) return "";
  const plot = location.plot;
  const area = location.area ?? plot?.area;
  const region = location.region ?? area?.region;
  return [plot?.name, area?.name, region?.name].filter(Boolean).join(" · ");
};

const formatAge = (durationDays?: number) => {
  if (durationDays === undefined || durationDays === null) return "";
  if (durationDays >= 365) return `${Math.floor(durationDays / 365)} năm`;
  if (durationDays >= DAYS_PER_MONTH)
    return `${Math.floor(durationDays / DAYS_PER_MONTH)} tháng`;
  return `${durationDays} ngày`;
};

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "";

const parseMonths = (value: string) => {
  if (value === "") return undefined;
  const months = Number(value);
  return Number.isFinite(months) && months >= 0 ? months : undefined;
};

/** Chuyển dữ liệu API sang CropDetail để dùng lại dialog chi tiết hiện có */
const toCropDetail = (plant: PlantItem): CropDetail => {
  const location = plant.location;
  const plot = location?.plot;
  const area = location?.area ?? plot?.area;
  const region = location?.region ?? area?.region;
  const coordinate = getCoordinate(plant);

  return {
    id: String(plant.id),
    code: plant.code || `#${plant.id}`,
    name: getVarietyName(plant),
    image: treeMarkerIcon,
    plantedDate: plant.plantedAt ?? plant.startedAt ?? "",
    seedType: plant.subjectVariant?.name ?? "",
    variety: plant.productionSubjectVariant?.name ?? "",
    groupCropName: "",
    notes: plant.notes ?? "",
    status:
      plant.healthStatus === "PEST" || plant.healthStatus === "TREATING"
        ? "diseased"
        : plant.healthStatus === "HARVESTED"
          ? "harvesting"
          : plant.healthStatus === "DEAD"
            ? "removed"
            : "healthy",
    regionId: region?.id ?? 0,
    regionName: region?.name ?? "",
    areaId: area?.id ?? 0,
    areaName: area?.name ?? "",
    plotId: plot ? String(plot.id) : "",
    plotName: plot?.name ?? "",
    coordinate: coordinate
      ? { lat: coordinate[0], lng: coordinate[1] }
      : { lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] },
    growthStage: "",
    expectedHarvestDate: "",
    actualAge: plant.durationDays
      ? Math.floor(plant.durationDays / DAYS_PER_MONTH)
      : 0,
    certifications: [],
    cultivationHistory: [],
    diseaseHistory: [],
    harvestHistory: [],
  };
};

const MapViewSync = ({
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

const HealthBadge = ({ status }: { status?: FarmPlantHealthStatus | null }) =>
  status ? (
    <span
      className={cn(
        "shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-bold",
        PLANT_HEALTH_STATUS_STYLES[status],
      )}
    >
      {PLANT_HEALTH_STATUS_LABELS[status] ?? status}
    </span>
  ) : null;

const InfoRow = ({ label, value }: { label: string; value?: ReactNode }) =>
  value ? (
    <div className="flex items-start justify-between gap-3 py-2 text-sm">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-800">{value}</span>
    </div>
  ) : null;

const SearchCropPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<AdvancedFilters>({});
  const [appliedFilters, setAppliedFilters] = useState<AdvancedFilters>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCropDetailOpen, setIsCropDetailOpen] = useState(false);

  const queryParams = useMemo(
    () => toQueryParams(debouncedSearch, appliedFilters),
    [debouncedSearch, appliedFilters],
  );

  const plantsQuery = useInfiniteQuery({
    queryKey: [...plantKeys.all(), "search-crop", queryParams] as const,
    queryFn: ({ pageParam }) =>
      plantIdentificationApi.list({
        ...queryParams,
        page: pageParam,
        size: PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
  });

  const plants = useMemo(
    () => plantsQuery.data?.pages.flatMap((page) => page.content) ?? [],
    [plantsQuery.data],
  );
  const totalElements = plantsQuery.data?.pages[0]?.totalElements ?? 0;

  // Cây đang xem: cây đã chọn nếu còn trong kết quả, không thì cây đầu tiên
  const activePlant =
    plants.find((plant) => plant.id === selectedId) ?? plants[0] ?? null;

  // Nguồn dữ liệu cho bộ lọc nâng cao — chỉ tải khi mở bộ lọc
  const optionsEnabled = isAdvancedSearchOpen;
  const { items: varietyItems } = useProductionSubjectVariants({
    params: { domainCode: "CROP", page: 0, size: 100 },
    enabled: optionsEnabled,
  });
  const { items: seedItems } = useSeeds({
    params: { page: 0, size: 100 },
    enabled: optionsEnabled,
  });
  const { items: zoneItems } = useCultivationZones({
    params: { domainCode: "CROP", page: 0, size: 100 },
    enabled: optionsEnabled,
  });
  const certificatesQuery = useMasterData("certificate-standards", {
    params: { page: 0, size: 100 },
    enabled: optionsEnabled,
  });

  const activeFilterCount = countActiveFilters(appliedFilters);

  const setDraft = (partial: Partial<AdvancedFilters>) =>
    setDraftFilters((prev) => ({ ...prev, ...partial }));

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setSelectedId(null);
  };

  const clearFilters = () => {
    setDraftFilters({});
    setAppliedFilters({});
    setSelectedId(null);
  };

  const activeCoordinate = activePlant ? getCoordinate(activePlant) : null;
  const firstCoordinate = plants.map(getCoordinate).find(Boolean) ?? null;
  const mapCenter = activeCoordinate ?? firstCoordinate ?? DEFAULT_CENTER;
  const mapZoom = activeCoordinate ? 17 : 15;

  return (
    <PageWrapper title="Tìm kiếm & Truy xuất nguồn gốc">
      <div className="flex min-h-screen flex-col space-y-6 bg-slate-50 pb-12">
        {/* TOP HEADER: Tìm kiếm & Bộ lọc nâng cao */}
        <div className="z-40 space-y-4 rounded-md border-b bg-white p-4 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="relative w-full flex-1">
              <Search className="pointer-events-none absolute left-3 top-2.5 z-10 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Nhập mã cây, tên/mã giống cây hoặc hạt giống..."
                className="border-slate-200 bg-slate-50/50 pl-10 shadow-sm"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedId(null);
                }}
              />
            </div>

            <Button
              variant={isAdvancedSearchOpen ? "default" : "outline"}
              className="w-full gap-2 md:w-auto"
              onClick={() => setIsAdvancedSearchOpen((open) => !open)}
            >
              <Filter className="h-4 w-4" />
              <span>Bộ lọc nâng cao</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded bg-white text-xs text-primary">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {isAdvancedSearchOpen && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Giống cây</Label>
                  <Select
                    value={
                      draftFilters.productionSubjectVariantId
                        ? String(draftFilters.productionSubjectVariantId)
                        : ALL
                    }
                    onValueChange={(value) =>
                      setDraft({
                        productionSubjectVariantId:
                          value === ALL ? undefined : Number(value),
                      })
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Tất cả giống cây" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>Tất cả giống cây</SelectItem>
                      {varietyItems.map((variety) => (
                        <SelectItem key={variety.id} value={String(variety.id)}>
                          {variety.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Hạt giống</Label>
                  <Select
                    value={
                      draftFilters.subjectVariantId
                        ? String(draftFilters.subjectVariantId)
                        : ALL
                    }
                    onValueChange={(value) =>
                      setDraft({
                        subjectVariantId:
                          value === ALL ? undefined : Number(value),
                      })
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Tất cả hạt giống" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>Tất cả hạt giống</SelectItem>
                      {seedItems.map((seed) => (
                        <SelectItem key={seed.id} value={String(seed.id)}>
                          {seed.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Hiện trạng sức khỏe
                  </Label>
                  <Select
                    value={draftFilters.healthStatus ?? ALL}
                    onValueChange={(value) =>
                      setDraft({
                        healthStatus:
                          value === ALL
                            ? undefined
                            : (value as FarmPlantHealthStatus),
                      })
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>Tất cả</SelectItem>
                      {Object.entries(PLANT_HEALTH_STATUS_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Tuổi cây (tháng)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      placeholder="Từ"
                      className="bg-white"
                      value={draftFilters.ageFromMonths ?? ""}
                      onChange={(e) =>
                        setDraft({ ageFromMonths: parseMonths(e.target.value) })
                      }
                    />
                    <span className="text-slate-400">–</span>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Đến"
                      className="bg-white"
                      value={draftFilters.ageToMonths ?? ""}
                      onChange={(e) =>
                        setDraft({ ageToMonths: parseMonths(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Vùng canh tác</Label>
                  <MultiSelect
                    options={zoneItems.map((zone) => ({
                      value: String(zone.id),
                      label: zone.name || zone.code || `#${zone.id}`,
                      keywords: zone.code ? [zone.code] : undefined,
                    }))}
                    value={(draftFilters.productionZoneIds ?? []).map(String)}
                    onChange={(next) =>
                      setDraft({ productionZoneIds: next.map(Number) })
                    }
                    placeholder="Tất cả vùng canh tác"
                    searchPlaceholder="Tìm vùng canh tác..."
                    emptyText="Không có vùng canh tác"
                    clearable
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Chứng nhận</Label>
                  <MultiSelect
                    options={certificatesQuery.items.map((certificate) => ({
                      value: String(certificate.id),
                      label: certificate.name || certificate.code,
                      keywords: certificate.code ? [certificate.code] : undefined,
                    }))}
                    value={(draftFilters.agricultureCertificateIds ?? []).map(
                      String,
                    )}
                    onChange={(next) =>
                      setDraft({ agricultureCertificateIds: next.map(Number) })
                    }
                    placeholder="Tất cả chứng nhận"
                    searchPlaceholder="Tìm chứng nhận..."
                    emptyText="Không có loại chứng nhận"
                    clearable
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={clearFilters}>
                  <X className="h-4 w-4" /> Xóa bộ lọc
                </Button>
                <Button onClick={applyFilters}>Áp dụng</Button>
              </div>
            </div>
          )}
        </div>

        {/* MAIN BODY: Danh sách cây (trái) | Chi tiết cây (phải) */}
        <div className="relative flex flex-1 items-start gap-6 px-2">
          {isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="absolute left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white text-primary shadow-xl hover:bg-slate-50"
              title="Mở danh sách cây trồng"
            >
              <PanelLeftOpen size={20} />
            </button>
          )}

          {/* LEFT: danh sách cây trồng */}
          <div
            className={cn(
              "sticky top-4 z-30 flex max-h-[calc(100vh-32px)] shrink-0 flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300",
              isSidebarCollapsed
                ? "w-0 border-none p-0 opacity-0"
                : "w-85 lg:w-100",
            )}
          >
            <div className="flex min-w-60 items-center justify-between border-b bg-slate-50/50 p-4">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
                <Sprout size={14} className="text-primary" />
                Cây trồng ({totalElements})
              </h3>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary"
                title="Thu gọn"
              >
                <PanelLeftClose size={18} />
              </button>
            </div>

            <div className="min-w-60 flex-1 space-y-1.5 overflow-y-auto p-2">
              {plantsQuery.isLoading ? (
                <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang tải...
                </div>
              ) : plantsQuery.isError ? (
                <p className="p-10 text-center text-sm text-red-500">
                  Không tải được danh sách cây trồng
                </p>
              ) : plants.length === 0 ? (
                <div className="flex flex-col items-center p-10 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                    <Search className="h-8 w-8 text-slate-200" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">
                    Không tìm thấy cây trồng phù hợp
                  </p>
                </div>
              ) : (
                <>
                  {plants.map((plant) => {
                    const isActive = activePlant?.id === plant.id;
                    return (
                      <button
                        key={plant.id}
                        type="button"
                        onClick={() => setSelectedId(plant.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors",
                          isActive
                            ? "border-primary bg-primary/5"
                            : "border-transparent hover:bg-slate-50",
                        )}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                          <Sprout className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-bold text-slate-800">
                              {plant.code || `#${plant.id}`}
                            </span>
                            <HealthBadge status={plant.healthStatus} />
                          </div>
                          <p className="truncate text-[11px] text-slate-500">
                            {getVarietyName(plant)}
                          </p>
                          <p className="truncate text-[10px] text-slate-400">
                            {getLocationText(plant) ||
                              plant.productionZone?.name ||
                              ""}
                          </p>
                        </div>
                        <ChevronRight
                          size={14}
                          className={
                            isActive ? "text-primary" : "text-slate-300"
                          }
                        />
                      </button>
                    );
                  })}

                  {plantsQuery.hasNextPage && (
                    <Button
                      variant="ghost"
                      className="w-full text-xs"
                      disabled={plantsQuery.isFetchingNextPage}
                      onClick={() => void plantsQuery.fetchNextPage()}
                    >
                      {plantsQuery.isFetchingNextPage ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Tải thêm"
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT: chi tiết cây đang chọn */}
          <div className="relative flex min-w-0 flex-1 flex-col space-y-6">
            {!activePlant ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center opacity-40">
                <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-xl">
                  <Sprout size={64} className="text-slate-200" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-slate-400">
                  Chọn cây trồng để xem chi tiết
                </h3>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-slate-50">
                      <Sprout size={24} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-800">
                        {activePlant.code || `#${activePlant.id}`}
                      </h2>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        {getVarietyName(activePlant)}
                        {activePlant.productionZone?.name
                          ? ` · ${activePlant.productionZone.name}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <HealthBadge status={activePlant.healthStatus} />
                </div>

                <div className="grid h-100 shrink-0 grid-cols-1 gap-6 lg:grid-cols-12">
                  <div className="relative overflow-hidden rounded-xl border-4 border-white bg-white shadow-xl lg:col-span-8">
                    <MapContainer
                      center={mapCenter}
                      zoom={mapZoom}
                      className="z-0 h-full w-full"
                      zoomControl={false}
                      scrollWheelZoom
                    >
                      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                      <MapViewSync center={mapCenter} zoom={mapZoom} />
                      {plants.map((plant) => {
                        const coordinate = getCoordinate(plant);
                        if (!coordinate) return null;
                        return (
                          <Marker
                            key={plant.id}
                            position={coordinate}
                            icon={cropMarkerIcon}
                            title={plant.code}
                            eventHandlers={{
                              click: () => setSelectedId(plant.id),
                            }}
                          />
                        );
                      })}
                    </MapContainer>
                    {!activeCoordinate && (
                      <div className="absolute inset-x-0 bottom-3 z-[400] mx-auto w-max rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600 shadow">
                        Cây này chưa có tọa độ
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col overflow-y-auto rounded-xl border-4 border-white bg-white p-5 shadow-xl lg:col-span-4">
                    <Badge className="mb-3 self-start bg-primary/10 font-black uppercase text-primary">
                      {activePlant.code || `#${activePlant.id}`}
                    </Badge>
                    <div className="divide-y divide-slate-100">
                      <InfoRow
                        label="Giống cây"
                        value={activePlant.productionSubjectVariant?.name}
                      />
                      <InfoRow
                        label="Hạt giống"
                        value={activePlant.subjectVariant?.name}
                      />
                      <InfoRow
                        label="Vùng canh tác"
                        value={
                          activePlant.productionZone?.name ||
                          activePlant.cultivationZone?.name
                        }
                      />
                      <InfoRow
                        label="Vị trí"
                        value={getLocationText(activePlant)}
                      />
                      <InfoRow
                        label="Ngày trồng"
                        value={formatDate(
                          activePlant.plantedAt ?? activePlant.startedAt,
                        )}
                      />
                      <InfoRow
                        label="Tuổi cây"
                        value={formatAge(activePlant.durationDays)}
                      />
                      <InfoRow
                        label="Chiều cao"
                        value={
                          activePlant.height !== undefined &&
                          activePlant.height !== null
                            ? `${activePlant.height} m`
                            : undefined
                        }
                      />
                      <InfoRow label="Ghi chú" value={activePlant.notes} />
                    </div>
                    <Button
                      className="mt-auto h-11 gap-2 rounded-xl font-black"
                      onClick={() => setIsCropDetailOpen(true)}
                    >
                      <Maximize2 size={16} />
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <CropDetailDialog
        open={isCropDetailOpen}
        onOpenChange={setIsCropDetailOpen}
        crop={activePlant ? toCropDetail(activePlant) : null}
      />
    </PageWrapper>
  );
};

export default SearchCropPage;
