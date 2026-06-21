import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useGrowthCycleStore from "../../stores/useGrowthCycleStore";
import useSeasonStore from "../../stores/useSeasonStore";
import useVarietyStore from "../../stores/useVarietyStore";
import { SeasonFormPage } from "./components/SeasonFormPage";
import type { CreateSeasonForm, SeasonFormData } from "./types/types";
import {
  EMPTY_SEASON_FORM,
  calculateDurationFromStageMap,
  calculateDurationFromSeasonForm,
  mapFilesToSeasonDocuments,
  removeGrowthCycleFromForm,
  validateSeasonForm,
} from "./utils/utils";

export default function CreateSeasonPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { growthCycles } = useGrowthCycleStore();
  const { addSeason } = useSeasonStore();
  const { varieties } = useVarietyStore();

  const [formData, setFormData] = useState<SeasonFormData>(EMPTY_SEASON_FORM);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = () => {
    const resolvedFormData = {
      ...formData,
      duration: calculateDurationFromSeasonForm(formData),
    };

    if (!validateSeasonForm(resolvedFormData as CreateSeasonForm)) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    addSeason({
      code: resolvedFormData.code,
      name: resolvedFormData.name,
      description: resolvedFormData.description,
      duration: resolvedFormData.duration,
      status: "planning",
      seasonType: resolvedFormData.seasonType,
      scope: resolvedFormData.scope,
      cropId: resolvedFormData.cropId,
      varietyId: resolvedFormData.varietyId,
      growthCycleIds: resolvedFormData.growthCycleIds,
      selectedStages: resolvedFormData.selectedStages,
      documents: mapFilesToSeasonDocuments(resolvedFormData.documents),
    });

    toast({ title: "Thành công", description: "Đã tạo mùa vụ mới" });
    setLocation("/season");
  };

  return (
    <SeasonFormPage
      title="Thêm mới mùa vụ"
      description="Thiết lập kế hoạch mùa vụ và quy trình canh tác"
      dialogOpen={dialogOpen}
      formData={formData}
      growthCycles={growthCycles}
      onBack={() => setLocation("/season")}
      onCycleConfirm={(growthCycleId, selectedStages) => {
        const selectedCycle = growthCycles.find((cycle) => cycle.id === growthCycleId);
        setFormData({
          ...formData,
          duration: growthCycleId
            ? calculateDurationFromStageMap(selectedStages) ||
              selectedCycle?.totalDays ||
              0
            : 0,
          growthCycleIds: growthCycleId ? [growthCycleId] : [],
          selectedStages,
        });
      }}
      onDialogOpenChange={setDialogOpen}
      onFormChange={setFormData}
      onRemoveCycle={(cycleId) =>
        setFormData((currentForm) =>
          removeGrowthCycleFromForm(currentForm, cycleId),
        )
      }
      onSubmit={handleSave}
      submitLabel="Lưu mùa vụ"
      varieties={varieties}
    />
  );
}
