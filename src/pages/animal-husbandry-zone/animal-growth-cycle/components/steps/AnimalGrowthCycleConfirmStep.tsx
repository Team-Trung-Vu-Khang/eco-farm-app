import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Calendar, ChevronRight, Layers, Layout, PawPrint } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import type { AnimalGrowthCycleFormValues } from "../../schemas/animalGrowthCycleSchema";
import type { FoundationCropResponse, FoundationCropVarietyResponse } from "../../../../../features/foundation/types/foundation.type";
import { productionSubjectGroupApi } from "../../../../../features/foundation/api/foundation.api";
import type { PageResponse, ProductionSubjectGroupResponse } from "../../../../../features/foundation/types/foundation.type";
import { formatDaysToDuration, parseDurationToDays } from "../../utils/duration";

interface AnimalGrowthCycleConfirmStepProps { varieties: FoundationCropVarietyResponse[]; crops: FoundationCropResponse[]; }

export function AnimalGrowthCycleConfirmStep({ varieties, crops }: AnimalGrowthCycleConfirmStepProps) {
  const { watch } = useFormContext<AnimalGrowthCycleFormValues>();
  const formData = watch();
  const cropName = crops.filter((crop) => (formData.cropIds || []).includes(String(crop.id))).map((crop) => crop.name).join(", ");
  const varietyName = varieties.filter((variety) => (formData.varietyIds || []).includes(String(variety.id))).map((variety) => variety.name).join(", ");
  const { data: groupResponse } = useQuery<PageResponse<ProductionSubjectGroupResponse>>({ queryKey: ["animal-growth-cycle-groups", "LIVESTOCK"], queryFn: () => productionSubjectGroupApi.list({ domainCode: "LIVESTOCK", page: 0, size: 100, status: "active" }), staleTime: 300_000 });
  const groupName = (formData.groupIds || []).map((id) => groupResponse?.content.find((group) => String(group.id) === id)?.name || id).join(", ") || "-";
  const totalDays = useMemo(() => formData.stages.reduce((sum, stage) => sum + parseDurationToDays(String(stage.duration)), 0), [formData.stages]);

  return <div className="mx-auto max-w-4xl space-y-6 py-4">
    <div className="flex items-center gap-2 text-primary"><Layout className="h-5 w-5" /><h3 className="text-lg font-bold">Xác nhận chu kỳ sinh trưởng</h3></div>
    <Card className="border-none bg-muted/30 shadow-none"><CardContent className="grid grid-cols-1 gap-x-12 gap-y-4 p-6 md:grid-cols-2">
      <div className="col-span-full flex items-center justify-between border-b border-muted py-2"><span className="text-sm text-muted-foreground">Tên chu kỳ:</span><span className="text-base font-bold text-slate-900">{formData.name || "-"}</span></div>
      <div className="flex items-center justify-between border-b border-muted py-2"><span className="text-sm text-muted-foreground">Nhóm chu kỳ:</span><Badge variant="default"><span className="flex items-center gap-2"><PawPrint className="h-3.5 w-3.5" />Vụ nuôi</span></Badge></div>
      <div className="flex items-center justify-between border-b border-muted py-2"><span className="text-sm text-muted-foreground">Phạm vi:</span><Badge variant="default">{formData.scope === "group" ? "Theo nhóm vật nuôi" : formData.scope === "crop" ? "Theo vật nuôi" : "Theo giống vật nuôi"}</Badge></div>
      <div className="col-span-full flex items-start justify-between border-b border-muted py-2"><span className="shrink-0 text-sm text-muted-foreground">{formData.scope === "group" ? "Nhóm vật nuôi:" : formData.scope === "crop" ? "Vật nuôi:" : "Giống vật nuôi:"}</span><Badge variant="outline" className="font-bold">{formData.scope === "group" ? groupName : formData.scope === "crop" ? cropName || "-" : varietyName || "-"}</Badge></div>
      <div className="flex items-center justify-between border-b border-muted py-2"><span className="text-sm text-muted-foreground">Tổng thời gian:</span><Badge className="border-blue-100 bg-blue-50 font-bold text-blue-700">{formatDaysToDuration(totalDays) || "0 ngày"}</Badge></div>
      <div className="flex items-center justify-between border-b border-muted py-2"><span className="text-sm text-muted-foreground">Số giai đoạn:</span><span className="font-bold">{formData.stages.length} giai đoạn</span></div>
    </CardContent></Card>
    <div className="space-y-4"><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground"><Layers className="h-3 w-3" />Chi tiết các giai đoạn</span><div className="space-y-2">{formData.stages.map((stage, index) => <div key={stage.id} className="group flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm transition-all hover:border-primary/30"><div className="flex items-center gap-4"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-600"><Calendar className="h-4 w-4" /></div><div><p className="text-sm font-bold">Giai đoạn {index + 1}</p><p className="text-xs text-muted-foreground">{stage.name}</p></div></div><div className="flex items-center gap-4"><Badge variant="outline" className="text-[10px] font-bold">{stage.duration}</Badge><ChevronRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" /></div></div>)}</div></div>
  </div>;
}
