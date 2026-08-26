import { useFormContext, Controller } from "react-hook-form";
import { useState } from "react";
import { Award, MapPin, ScrollText } from "lucide-react";
import {
  Badge,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { CultivationZoneFormValues } from "../data/cultivation-zone-form.schema";
import {
  CertificateSelector,
  GeographicalSelector,
  ManagerSelector,
  SelectionCard,
  OrganizationSelector,
} from "./index";
import { useRegions } from "@/features/farm/hooks/useRegions";
import { useDebounce } from "@/shared/hooks/useDebounce";
import type { GeographicalSelection } from "./types";
import type { FarmRegionResponse } from "@/features/farm/types/farm.type";

// Convert API regions to the shape GeographicalSelector expects
function toRegionOptions(apiRegions: FarmRegionResponse[]) {
  return apiRegions.map((r) => ({
    id: r.id,
    code: r.code,
    name: r.name ?? "",
    enterpriseId: (r.metadataJson?.enterpriseId as string) ?? "",
    subAreas: (r.areas ?? []).map((a) => ({
      id: a.id,
      name: a.name ?? "",
      plots: [],
    })),
  }));
}

interface ZoneGeneralInfoStepProps {
  showEnterprise?: boolean;
}

export const ZoneGeneralInfoStep = ({
  showEnterprise = false,
}: ZoneGeneralInfoStepProps = {}) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CultivationZoneFormValues>();

  const selections = watch("selections") ?? [];
  const enterpriseId = watch("enterpriseId") ?? "";
  const [regionSearch, setRegionSearch] = useState("");
  const debouncedRegionSearch = useDebounce(regionSearch, 300);

  const { items: apiRegions, isFetching: isRegionSearching } = useRegions({
    params: {
      size: 100,
      keyword: debouncedRegionSearch.trim() || undefined,
    },
  });
  const regionOptions = toRegionOptions(apiRegions);

  const geoSelections: GeographicalSelection[] = selections;

  const handleConfirmSelections = (newSelections: GeographicalSelection[]) => {
    setValue("selections", newSelections, { shouldValidate: true });
  };

  const groupedSelections = geoSelections.reduce<
    Record<string, GeographicalSelection[]>
  >((acc, sel) => {
    const key = sel.areaId || sel.regionId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(sel);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
        {/* Left column */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <ScrollText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-slate-800">Thông tin cơ bản</h3>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="zone-name" className="text-sm font-medium">
                    Tên vùng canh tác <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="zone-name"
                    placeholder="VD: Vùng trồng Sầu riêng chất lượng cao"
                    {...field}
                    className="h-10 border-slate-300 focus:border-primary focus:ring-primary/20"
                  />
                  {errors.name && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}
            />

            {showEnterprise && (
              <Controller
                control={control}
                name="enterpriseId"
                render={({ field }) => (
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">
                      Đơn vị sở hữu <span className="text-red-500">*</span>
                    </Label>
                    <OrganizationSelector
                      disabled={false}
                      selectedId={field.value ?? ""}
                      onSelect={(id) => {
                        if (id !== field.value) {
                          field.onChange(id);
                          setValue("selections", [], { shouldValidate: true });
                        }
                      }}
                    />
                    {errors.enterpriseId && (
                      <p className="text-xs font-medium text-red-500 mt-1">
                        {errors.enterpriseId.message}
                      </p>
                    )}
                  </div>
                )}
              />
            )}

            {/* Geographical scope */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700">
                  Phạm vi địa lý <span className="text-red-500">*</span>
                </Label>
                {geoSelections.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-none"
                  >
                    {geoSelections.length} lựa chọn
                  </Badge>
                )}
              </div>

              <GeographicalSelector
                regions={regionOptions}
                showEnterprise={showEnterprise}
                enterpriseId={enterpriseId}
                existingSelections={geoSelections}
                onConfirm={handleConfirmSelections}
                onRegionSearchChange={setRegionSearch}
                isRegionSearching={isRegionSearching}
              />

              <div className="grid grid-cols-1 gap-4 mt-2">
                {Object.entries(groupedSelections).map(([key, items]) => {
                  const first = items[0];
                  return (
                    <SelectionCard
                      key={key}
                      regionId={first.regionId}
                      areaId={first.areaId}
                      items={items}
                      regions={regionOptions}
                      onRemove={(ids) =>
                        handleConfirmSelections(
                          geoSelections.filter((s) => !ids.includes(s.id)),
                        )
                      }
                    />
                  );
                })}

                {geoSelections.length === 0 && (
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
              {errors.selections && (
                <p className="text-xs font-medium text-red-500 mt-1">
                  {errors.selections.message ??
                    errors.selections.root?.message ??
                    "Vui lòng chọn ít nhất 1 phạm vi địa lý"}
                </p>
              )}
            </div>

            {/* Notes */}
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <div className="grid gap-2 pt-2">
                  <Label className="text-sm font-medium">Ghi chú</Label>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Nhập thông tin ghi chú thêm..."
                    className="min-h-20 border-slate-300 resize-none hover:border-slate-400 focus:border-primary"
                  />
                </div>
              )}
            />
          </div>
        </div>

        {/* Right column — personnel */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-slate-800">Nhân sự phụ trách</h3>
          </div>

          <div className="space-y-6">
            {/* Manager selector */}
            <Controller
              control={control}
              name="personnelIds"
              render={({ field }) => {
                const ids = (field.value ?? []).map(String);
                return (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Nhân viên chịu trách nhiệm
                    </Label>
                    <ManagerSelector
                      selectedIds={ids}
                      onSelect={(selectedIds) =>
                        field.onChange(
                          selectedIds
                            .map((v) => parseInt(v, 10))
                            .filter((n) => !isNaN(n)),
                        )
                      }
                    />
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
