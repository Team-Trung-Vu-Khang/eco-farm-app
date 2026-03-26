import type { Dispatch, SetStateAction } from "react";
import {
  Badge,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Info, Layers, MapPin, Package } from "lucide-react";
import { cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { EnterpriseSelector } from "../../cultivation-zone/cultivation-region/components";
import GeographicalSelector from "../../plan/components/GeographicalSelector";
import type {
  AmendmentPlanFormData,
  GeographicalSelection,
  SelectionSummaryGroup,
  SoilAmendmentRegion,
} from "../types";

interface AmendmentPlanScopeStepProps {
  calculateArea: () => string;
  formData: AmendmentPlanFormData;
  handleGeographicalConfirm: (selections: GeographicalSelection[]) => void;
  regions: SoilAmendmentRegion[];
  selectedEnterpriseId: string;
  selectionSummary: SelectionSummaryGroup[];
  selections: GeographicalSelection[];
  setFormData: Dispatch<SetStateAction<AmendmentPlanFormData>>;
  setSelectedEnterpriseId: Dispatch<SetStateAction<string>>;
  setSelections: Dispatch<SetStateAction<GeographicalSelection[]>>;
}

export function AmendmentPlanScopeStep({
  calculateArea,
  formData,
  handleGeographicalConfirm,
  regions,
  selectedEnterpriseId,
  selectionSummary,
  selections,
  setFormData,
  setSelectedEnterpriseId,
  setSelections,
}: AmendmentPlanScopeStepProps) {
  const selectedRegionName =
    regions.find(
      (region) => String(region.id) === String(formData.selectedRegionId),
    )?.name || "Chưa chọn vùng";

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                1
              </span>
              Chọn vùng canh tác
            </h3>
            <Label className="text-sm font-medium">
              Đơn vị sở hữu <span className="text-red-500">*</span>
            </Label>
            <EnterpriseSelector
              onSelect={(value) => {
                setSelectedEnterpriseId(value);
                setSelections([]);
              }}
              selectedId={selectedEnterpriseId}
            />

            <div className="relative space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 p-5 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Vùng canh tác <span className="text-red-500">*</span>
                  </label>
                  {!selectedEnterpriseId && (
                    <Badge
                      className="border-amber-200 bg-amber-50 text-[10px] text-amber-600"
                      variant="outline"
                    >
                      Chọn đơn vị sở hữu trước
                    </Badge>
                  )}
                </div>

                <GeographicalSelector
                  enterpriseId={selectedEnterpriseId}
                  existingSelections={selections}
                  onConfirm={handleGeographicalConfirm}
                  regions={regions || []}
                />

                {selectionSummary.length > 0 && (
                  <div className="mt-4 space-y-3 rounded-xl border border-emerald-100/50 bg-white/50 p-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-800/60">
                      <Layers className="h-3 w-3" />
                      Phạm vi đã chọn ({selections.length} mục)
                    </div>
                    <div className="space-y-3">
                      {selectionSummary.map((group) => (
                        <div key={group.regionId} className="space-y-2">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                            <div className="h-1 w-1 rounded-full bg-emerald-500" />
                            {group.regionName}
                          </div>
                          <div className="flex flex-wrap gap-1.5 pl-2.5">
                            {group.items.map((item, index) => (
                              <Badge
                                key={`${item.id}-${index}`}
                                className={cn(
                                  "h-5 border-emerald-100 px-2 py-0 text-[10px] font-medium shadow-sm",
                                  item.type === "region"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : item.type === "area"
                                      ? "border-blue-100 bg-blue-50 text-blue-700"
                                      : "border-slate-200 bg-white text-slate-600",
                                )}
                                variant="outline"
                              >
                                <span className="mr-1 text-[8px] font-black uppercase opacity-70">
                                  {item.type === "region"
                                    ? "Vùng"
                                    : item.type === "area"
                                      ? "Khu"
                                      : "Lô"}
                                </span>
                                {item.name}
                                {item.parentName && (
                                  <span className="ml-1 font-normal italic opacity-50">
                                    ({item.parentName})
                                  </span>
                                )}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-slate-700">Ghi chú phạm vi</Label>
            <Textarea
              className="bg-white"
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Nhập ghi chú thêm..."
              value={formData.description}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
              <Package className="h-4 w-4 text-emerald-600" />
              Tóm tắt phạm vi đã chọn
            </h3>
            <div className="space-y-6 rounded-3xl bg-linear-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-emerald-100">
                    Khu vực cải tạo
                  </p>
                  <h4 className="text-xl font-black leading-tight">
                    {selectedRegionName}
                  </h4>
                  <div className="mt-2 flex items-center gap-3">
                    <Badge className="h-5 bg-white/20 font-bold text-white">
                      {formData.selectedPlotIds.length} LÔ ĐẤT
                    </Badge>
                    <Badge className="h-5 bg-white/20 font-bold text-white">
                      {calculateArea()} HA
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2">
                  <Info className="h-3.5 w-3.5 text-emerald-200" />
                  <span className="text-xs font-bold uppercase tracking-wide text-emerald-100">
                    Thông báo phạm vi
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-white">
                  Kế hoạch cải tạo đất này sẽ áp dụng cho tất cả các lô đất
                  được chọn trong danh sách.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
