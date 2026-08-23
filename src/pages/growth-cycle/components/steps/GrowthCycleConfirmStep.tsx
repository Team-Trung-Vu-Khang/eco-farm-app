import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Calendar,
  ChevronRight,
  Layers,
  Layout,
  TreeDeciduous,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import type { GrowthCycleFormValues } from "../../schemas/growthCycleSchema";
import { formatDaysToDuration, parseDurationToDays } from "../../utils/duration";
import type {
  CatalogRecordResponse,
  FoundationCropResponse,
  FoundationCropVarietyResponse,
} from "../../../../features/foundation/types/foundation.type";

interface GrowthCycleConfirmStepProps {
  varieties: FoundationCropVarietyResponse[];
  crops: FoundationCropResponse[];
  cropGroups: CatalogRecordResponse[];
}

export function GrowthCycleConfirmStep({
  varieties,
  crops,
  cropGroups,
}: GrowthCycleConfirmStepProps) {
  const { watch } = useFormContext<GrowthCycleFormValues>();
  const formData = watch();

  const groupNames = (formData.groupIds || []).map(
    (id) => cropGroups.find((group) => String(group.id) === id)?.name || id,
  );
  const cropNames = (formData.cropIds || []).map(
    (id) => crops.find((crop) => String(crop.id) === id)?.name || id,
  );
  const varietyNames = (formData.varietyIds || []).map(
    (id) => varieties.find((variety) => String(variety.id) === id)?.name || id,
  );

  const scopeLabel =
    formData.scope === "group"
      ? "Theo nhóm cây trồng"
      : formData.scope === "crop"
        ? "Theo cây trồng"
        : "Theo giống cây trồng";
  const scopeSelectionLabel =
    formData.scope === "group"
      ? "Nhóm cây trồng"
      : formData.scope === "crop"
        ? "Cây trồng"
        : "Giống cây trồng";
  const scopeSelectionNames =
    formData.scope === "group"
      ? groupNames
      : formData.scope === "crop"
        ? cropNames
        : varietyNames;
  const totalDays = useMemo(
    () =>
      formData.stages.reduce(
        (sum, stage) => sum + parseDurationToDays(String(stage.duration)),
        0,
      ),
    [formData.stages],
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex items-center gap-2 text-primary">
        <Layout className="w-5 h-5" />
        <h3 className="font-bold text-lg">Xác nhận chu kỳ sinh trưởng</h3>
      </div>

      <Card className="border-none shadow-none bg-muted/30">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
          <div className="flex justify-between items-center py-2 border-b border-muted col-span-full">
            <span className="text-sm text-muted-foreground">Tên chu kỳ:</span>
            <span className="font-bold text-base text-slate-900">{formData.name || "-"}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-sm text-muted-foreground">Nhóm chu kỳ:</span>
            <Badge variant="default">
              <span className="flex items-center gap-2">
                <TreeDeciduous className="w-3.5 h-3.5" />
                Chu kỳ
              </span>
            </Badge>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-sm text-muted-foreground">Phạm vi:</span>
            <Badge variant="default">{scopeLabel}</Badge>
          </div>
          <div className="flex justify-between items-start py-2 border-b border-muted col-span-full">
            <span className="text-sm text-muted-foreground shrink-0">
              {scopeSelectionLabel}:
            </span>
            <div className="flex flex-wrap justify-end gap-1.5">
              {scopeSelectionNames.length > 0 ? (
                scopeSelectionNames.map((name, idx) => (
                  <Badge
                    key={`${name}-${idx}`}
                    variant="outline"
                    className="font-bold"
                  >
                    {name}
                  </Badge>
                ))
              ) : (
                <span className="font-bold">-</span>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-sm text-muted-foreground">
              Tổng thời gian:
            </span>
            <Badge className="bg-blue-50 text-blue-700 border-blue-100 font-bold">
              {formatDaysToDuration(totalDays) || "0 ngày"}
            </Badge>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-sm text-muted-foreground">Số giai đoạn:</span>
            <span className="font-bold">
              {formData.stages.length} giai đoạn
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Layers className="w-3 h-3" />
          Chi tiết các giai đoạn
        </span>
        <div className="space-y-2">
          {formData.stages.map((stage, index) => (
            <div
              key={stage.id}
              className="flex items-center justify-between p-4 rounded-lg bg-white border shadow-sm group hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-sm">Giai đoạn {index + 1}</p>
                  <p className="text-xs text-muted-foreground">{stage.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-[10px] font-bold">
                  {stage.duration}
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
