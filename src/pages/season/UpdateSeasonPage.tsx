import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useGrowthCycleStore from "../../stores/useGrowthCycleStore";
import useSeasonStore from "../../stores/useSeasonStore";
import useVarietyStore from "../../stores/useVarietyStore";
import { SeasonFormPage } from "./components/SeasonFormPage";
import type { CreateSeasonForm, Season, SeasonFormData } from "./types/types";
import {
  calculateDurationFromStageMap,
  calculateDurationFromSeasonForm,
  mapFilesToSeasonDocuments,
  removeGrowthCycleFromForm,
  validateSeasonForm,
} from "./utils/utils";

export default function UpdateSeasonPage() {
  const [, params] = useRoute("/season/:id/edit");
  const { getSeasonById } = useSeasonStore();

  if (!params?.id) {
    return null;
  }

  const season = getSeasonById(params.id);
  if (!season) {
    return null;
  }

  return <UpdateSeasonContent season={season} />;
}

function UpdateSeasonContent({ season }: { season: Season }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { growthCycles } = useGrowthCycleStore();
  const { updateSeason } = useSeasonStore();
  const { varieties } = useVarietyStore();

  const [formData, setFormData] = useState<SeasonFormData>({
    code: season.code,
    name: season.name,
    description: season.description,
    duration: season.duration,
    status: season.status,
    seasonType: season.seasonType ?? "plant",
    scope: season.scope,
    cropId: season.cropId,
    varietyId: season.varietyId,
    growthCycleIds: season.growthCycleIds,
    selectedStages: season.selectedStages || {},
    documents: season.documents,
  });
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

    updateSeason(season.id, {
      code: resolvedFormData.code,
      name: resolvedFormData.name,
      description: resolvedFormData.description,
      duration: resolvedFormData.duration,
      status: resolvedFormData.status,
      seasonType: resolvedFormData.seasonType,
      scope: resolvedFormData.scope,
      cropId: resolvedFormData.cropId,
      varietyId: resolvedFormData.varietyId,
      growthCycleIds: resolvedFormData.growthCycleIds,
      selectedStages: resolvedFormData.selectedStages,
      documents: mapFilesToSeasonDocuments(resolvedFormData.documents),
    });

    toast({ title: "Thành công", description: "Đã cập nhật mùa vụ" });
    setLocation("/season");
  };

  return (
    <SeasonFormPage
      title="Cập nhật mùa vụ"
      description={`Chỉnh sửa thông tin mùa vụ: ${formData.name}`}
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
      showStatusField
      submitLabel="Lưu thay đổi"
      varieties={varieties}
    />
  );
}
