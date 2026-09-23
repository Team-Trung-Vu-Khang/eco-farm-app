import { RemoteMultiSelect } from "@/components/RemoteMultiSelect";
import { useCultivationZones } from "@/features/farm/hooks/useCultivationZones";
import { useSeeds } from "@/features/farm/hooks/useSeeds";
import type { FarmPlantHealthStatus } from "@/features/farm/types/farm.type";
import { useProductionSubjectVariants } from "@/features/foundation/hooks/useProductionSubjects";
import { useMasterData } from "@/features/master-data";
import {
  Button,
  Input,
  Label,
  RemoteAutoCompleteSelect,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers, MapPin, Search, Sprout } from "lucide-react";
import type { ReactNode } from "react";
import { PLANT_HEALTH_STATUS_LABELS } from "../../cultivation-region/components/types";
import { usePinnedOptions, useRemoteSearch } from "../hooks/useRemoteOptions";
import {
  parseMonths,
  type SearchCropFilters,
} from "../utils/plant-identification.utils";

const OPTION_PAGE = { page: 0, size: 20 } as const;

const HEALTH_OPTIONS = Object.entries(PLANT_HEALTH_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);

const toId = (value: string) => (value ? Number(value) : undefined);
const toIds = (values: string[]) =>
  values.length ? values.map(Number) : undefined;

interface SearchCropFilterBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  filters: SearchCropFilters;
  onFiltersChange: (partial: Partial<SearchCropFilters>) => void;
  onClear: () => void;
  activeFilterCount: number;
  isAgeRangeInvalid: boolean;
  totalElements: number;
}

const FilterField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium text-slate-600">{label}</Label>
    {children}
  </div>
);

const FilterGroup = ({
  icon,
  title,
  className,
  children,
}: {
  icon: ReactNode;
  title: string;
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("space-y-3", className)}>
    <h4 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
      {icon}
      {title}
    </h4>
    {children}
  </div>
);

/** Ô tìm kiếm + bộ lọc — bố cục giống trang Tìm kiếm vùng canh tác */
export function SearchCropFilterBar({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  filters,
  onFiltersChange,
  onClear,
  activeFilterCount,
  isAgeRangeInvalid,
  totalElements,
}: SearchCropFilterBarProps) {
  const varietySearch = useRemoteSearch();
  const seedSearch = useRemoteSearch();
  const zoneSearch = useRemoteSearch();
  const certificateSearch = useRemoteSearch();

  const varieties = useProductionSubjectVariants({
    params: {
      ...OPTION_PAGE,
      domainCode: "CROP",
      keyword: varietySearch.keyword,
    },
  });
  const seeds = useSeeds({
    params: { ...OPTION_PAGE, keyword: seedSearch.keyword },
  });
  const zones = useCultivationZones({
    params: { ...OPTION_PAGE, domainCode: "CROP", keyword: zoneSearch.keyword },
  });
  const certificates = useMasterData("certificate-standards", {
    params: { ...OPTION_PAGE, keyword: certificateSearch.keyword },
  });

  const zoneOptions = usePinnedOptions(
    zones.items.map((zone) => ({
      value: String(zone.id),
      label: zone.name || zone.code || `#${zone.id}`,
    })),
  );
  const certificateOptions = usePinnedOptions(
    certificates.items.map((certificate) => ({
      value: String(certificate.id),
      label: certificate.name || certificate.code,
    })),
  );

  const ageInputClass = cn(
    isAgeRangeInvalid &&
      "border-red-500 bg-red-50/50 focus-visible:ring-red-500",
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      {/* Ô tìm kiếm + số kết quả */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Tìm theo mã cây, tên/mã giống cây hoặc hạt giống..."
            className="h-10 border-slate-200 bg-white pl-9"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button className="h-10 font-semibold" onClick={onSearch}>
            Tìm kiếm
          </Button>
          {(activeFilterCount > 0 || searchQuery) && (
            <Button
              variant="ghost"
              className="h-10 text-slate-500 hover:text-slate-900"
              onClick={onClear}
            >
              Xóa lọc
              {activeFilterCount > 0 && ` (${activeFilterCount})`}
            </Button>
          )}
        </div>
        <div className="hidden items-center gap-2 border-l border-slate-100 pl-4 text-sm text-slate-500 lg:flex">
          <Layers className="h-4 w-4 text-primary" />
          <span>
            <span className="font-bold text-slate-900">{totalElements}</span>{" "}
            cây trồng
          </span>
        </div>
      </div>

      <div className="p-4">
        <FilterGroup icon={<Sprout size={13} />} title="Thông tin cây trồng">
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2 lg:grid-cols-4">
            <FilterField label="Giống cây">
              <RemoteAutoCompleteSelect
                options={varieties.items.map((variety) => ({
                  value: String(variety.id),
                  label: variety.name,
                }))}
                value={filters.productionSubjectVariantId?.toString() ?? ""}
                onChange={(value) =>
                  onFiltersChange({ productionSubjectVariantId: toId(value) })
                }
                onSearch={varietySearch.setSearch}
                loading={varieties.isFetching}
                placeholder="Tất cả giống cây"
                searchPlaceholder="Tìm kiếm giống cây..."
                emptyText="Không tìm thấy giống cây nào"
              />
            </FilterField>

            <FilterField label="Hạt giống">
              <RemoteAutoCompleteSelect
                options={seeds.items.map((seed) => ({
                  value: String(seed.id),
                  label: seed.name || seed.code || `#${seed.id}`,
                }))}
                value={filters.subjectVariantId?.toString() ?? ""}
                onChange={(value) =>
                  onFiltersChange({ subjectVariantId: toId(value) })
                }
                onSearch={seedSearch.setSearch}
                loading={seeds.isFetching}
                placeholder="Tất cả hạt giống"
                searchPlaceholder="Tìm kiếm hạt giống..."
                emptyText="Không tìm thấy hạt giống nào"
              />
            </FilterField>

            <FilterField label="Hiện trạng sức khỏe">
              <RemoteAutoCompleteSelect
                options={HEALTH_OPTIONS}
                value={filters.healthStatus ?? ""}
                onChange={(value) =>
                  onFiltersChange({
                    healthStatus: (value || undefined) as
                      FarmPlantHealthStatus | undefined,
                  })
                }
                onSearch={() => {}}
                placeholder="Tất cả hiện trạng"
                searchPlaceholder="Tìm hiện trạng..."
                emptyText="Không có hiện trạng phù hợp"
              />
            </FilterField>

            <FilterField label="Tuổi cây (tháng)">
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={0}
                  placeholder="Từ tháng"
                  className={ageInputClass}
                  value={filters.ageFromMonths ?? ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ageFromMonths: parseMonths(e.target.value),
                    })
                  }
                />
                <Input
                  type="number"
                  min={0}
                  placeholder="Đến tháng"
                  className={ageInputClass}
                  value={filters.ageToMonths ?? ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ageToMonths: parseMonths(e.target.value),
                    })
                  }
                />
              </div>
              {isAgeRangeInvalid && (
                <p className="mt-1 text-[11px] font-bold text-red-500">
                  ⚠️ Tuổi "Từ" không được lớn hơn "Đến"
                </p>
              )}
            </FilterField>
          </div>
        </FilterGroup>

        <FilterGroup
          icon={<MapPin size={13} />}
          title="Vùng canh tác & chứng nhận"
          className="mt-5 border-t border-slate-100 pt-5"
        >
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
            <FilterField label="Vùng canh tác">
              <RemoteMultiSelect
                options={zoneOptions.options}
                value={(filters.productionZoneIds ?? []).map(String)}
                onChange={(next) => {
                  zoneOptions.pin(next);
                  onFiltersChange({ productionZoneIds: toIds(next) });
                }}
                onSearch={zoneSearch.setSearch}
                loading={zones.isFetching}
                placeholder="Tất cả vùng canh tác"
                searchPlaceholder="Tìm kiếm vùng canh tác..."
                emptyText="Không tìm thấy vùng canh tác nào"
              />
            </FilterField>

            <FilterField label="Chứng nhận">
              <RemoteMultiSelect
                options={certificateOptions.options}
                value={(filters.agricultureCertificateIds ?? []).map(String)}
                onChange={(next) => {
                  certificateOptions.pin(next);
                  onFiltersChange({ agricultureCertificateIds: toIds(next) });
                }}
                onSearch={certificateSearch.setSearch}
                loading={certificates.isFetching}
                placeholder="Tất cả chứng nhận"
                searchPlaceholder="Tìm kiếm chứng nhận..."
                emptyText="Không tìm thấy chứng nhận nào"
              />
            </FilterField>
          </div>
        </FilterGroup>
      </div>
    </div>
  );
}
