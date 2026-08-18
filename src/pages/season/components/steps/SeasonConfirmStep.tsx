import React from "react";
import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Calendar,
  ChevronRight,
  Layers,
  Layout,
  TreeDeciduous,
  PawPrint,
  Fish,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { SeasonFormValues } from "../../schemas/seasonFormSchema";
import type { Variety } from "@/pages/variety/types";
import { calculateTotalDuration, getDomainLabel } from "../../utils/utils";
import {
  animalBreedOptions,
  animalCycleOptions,
  plantCycleOptions,
} from "../../data/cycleSelectionData";

interface SeasonConfirmStepProps {
  varieties: Variety[];
}

export function SeasonConfirmStep({ varieties }: SeasonConfirmStepProps) {
  const { watch } = useFormContext<SeasonFormValues>();
  const formData = watch();

  // Helper to resolve primary/child selection labels
  const getSelectedLabels = () => {
    let primaryName = formData.selectedPrimaryId || "-";
    let childName = formData.selectedChildId || "-";

    if (formData.domainCode === "CROP") {
      const matchPrimary = plantCycleOptions.find(
        (c) => c.id === formData.selectedPrimaryId
      );
      if (matchPrimary) primaryName = matchPrimary.name;

      const matchChild = varieties.find(
        (v) => String(v.id) === formData.selectedChildId
      );
      if (matchChild) childName = matchChild.varietyName;
    } else {
      const matchPrimary = animalCycleOptions.find(
        (c) => c.id === formData.selectedPrimaryId
      );
      if (matchPrimary) primaryName = matchPrimary.name;

      const matchChild = animalBreedOptions.find(
        (b) => b.id === formData.selectedChildId
      );
      if (matchChild) childName = matchChild.name;
    }

    return { primaryName, childName };
  };

  const { primaryName, childName } = getSelectedLabels();
  const totalDuration = calculateTotalDuration(formData.stages as any);

  const getDomainIcon = () => {
    switch (formData.domainCode) {
      case "CROP":
        return <TreeDeciduous className="w-3.5 h-3.5" />;
      case "LIVESTOCK":
        return <PawPrint className="w-3.5 h-3.5" />;
      case "AQUACULTURE":
        return <Fish className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex items-center gap-2 text-primary">
        <Layout className="w-5 h-5" />
        <h3 className="font-bold text-lg">Xác nhận thông tin mùa vụ</h3>
      </div>

      <Card className="border-none shadow-none bg-muted/30">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
          <div className="flex justify-between items-center py-2 border-b border-muted col-span-full">
            <span className="text-sm text-muted-foreground">Tên mùa vụ:</span>
            <span className="font-bold text-base text-slate-900">
              {formData.name || "-"}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-sm text-muted-foreground">Loại mùa vụ:</span>
            <Badge variant="default">
              <span className="flex items-center gap-1.5">
                {getDomainIcon()}
                {getDomainLabel(formData.domainCode)}
              </span>
            </Badge>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-sm text-muted-foreground">Mã mùa vụ:</span>
            <span className="font-bold">{formData.code || "(Tự động sinh)"}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-sm text-muted-foreground">Đối tượng:</span>
            <span className="font-bold">{primaryName}</span>
          </div>

          {formData.selectedChildId && (
            <div className="flex justify-between items-center py-2 border-b border-muted">
              <span className="text-sm text-muted-foreground">Giống / dòng:</span>
              <span className="font-bold">{childName}</span>
            </div>
          )}

          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-sm text-muted-foreground">Tổng thời gian:</span>
            <Badge className="bg-blue-50 text-blue-700 border-blue-100 font-bold">
              {totalDuration} ngày
            </Badge>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-muted col-span-full">
            <span className="text-sm text-muted-foreground">Trạng thái:</span>
            <Badge variant={formData.status === "active" ? "default" : "secondary"}>
              {formData.status === "active"
                ? "Đang hoạt động"
                : formData.status === "inactive"
                ? "Tạm ngưng"
                : "Lưu trữ"}
            </Badge>
          </div>

          {formData.description && (
            <div className="col-span-full py-2 space-y-1">
              <span className="text-sm text-muted-foreground block">Mô tả:</span>
              <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border">
                {formData.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Layers className="w-3 h-3" />
          Chi tiết các giai đoạn
        </span>
        <div className="space-y-2">
          {formData.stages && formData.stages.length > 0 ? (
            formData.stages.map((stage, index) => (
              <div
                key={index}
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
                    {stage.durationDays || 0} ngày
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed rounded-lg bg-muted/10">
              Chưa có giai đoạn nào được tạo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
