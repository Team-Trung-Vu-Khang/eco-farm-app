import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useToast, type Step } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useGrowthCycleStore from "@/stores/useGrowthCycleStore";
import useRegionStore from "@/stores/useRegionStore";
import useSeasonStore from "@/stores/useSeasonStore";
import usePlanStore from "../../../stores/usePlanStore";
import { useTreatmentStore } from "../../../stores/useTreatmentStore";
import { useAmendmentRegimenStore } from "../../../stores/useAmendmentRegimenStore";
import type {
  GeographicalSelection,
  MaterialAllocation,
  PlanFormData,
  TaskAllocation,
} from "../types";
import {
  calculateSelectedArea,
  deriveSelectionState,
  reconstructSelectionsFromPlan,
  summarizeSelections,
  summarizeTaskSelections,
} from "../utils/location";

function createEmptyFormData(): PlanFormData {
  return {
    code: "",
    name: "",
    description: "",
    seasonId: "",
    seasonName: "",
    startDate: "",
    endDate: "",
    selectedRegionIds: [],
    selectedZoneIds: [],
    selectedPlotIds: [],
    crop: "",
    variety: "",
    purpose: "cultivation",
    growthCycleId: "",
    regimenId: "",
    selectedStages: [],
    status: "draft",
    materialAllocations: [],
    taskAllocations: [],
  };
}

export function usePlanForm(mode: "create" | "edit") {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const [dateWarning, setDateWarning] = useState<string | null>(null);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState("");

  const addPlan = usePlanStore((state) => state.addPlan);
  const updatePlan = usePlanStore((state) => state.updatePlan);
  const getPlanById = usePlanStore((state) => state.getPlanById);
  const seasons = useSeasonStore((state) => state.seasons);
  const { regions } = useRegionStore();
  const { growthCycles } = useGrowthCycleStore();
  const treatments = useTreatmentStore((state) => state.treatments);
  const amendmentRegimensRaw = useAmendmentRegimenStore((state) => state.regimens);

  const regimens = useMemo(() => {
    const mappedTreatments = treatments.map((t) => ({
      id: String(t.id),
      name: t.name,
      description: t.disease || t.name,
      type: "tri-benh" as const,
      provider: t.author || "Chưa rõ",
      category: t.disease || "Điều trị",
      crop: t.crop || "Tất cả",
      steps: t.procedures?.map((p: any) => ({
        id: String(p.id),
        day: p.startDay ? `Ngày ${p.startDay}` : `Ngày ${p.stepNumber}`,
        title: p.name,
        description: p.description,
      })) || [],
    }));

    const mappedAmendments = amendmentRegimensRaw.map((t) => ({
      id: String(t.id),
      name: t.name,
      description: t.soilIssue || t.name,
      type: "cai-tao-dat" as const,
      provider: t.authors?.[0]?.name || "Chưa rõ",
      category: t.soilIssue || "Cải tạo",
      crop: t.cropType || "Tất cả",
      steps: t.procedures?.map((p: any) => ({
        id: String(p.id),
        day: p.timing || `Ngày ${p.stepNumber}`,
        title: p.name,
        description: p.description,
      })) || [],
    }));

    return [...mappedTreatments, ...mappedAmendments];
  }, [treatments, amendmentRegimensRaw]);

  const plan = mode === "edit" ? getPlanById(Number(params.id)) : undefined;
  const initialSelectionState = useMemo(
    () =>
      mode === "edit" && plan
        ? reconstructSelectionsFromPlan(plan, regions)
        : null,
    [mode, plan, regions],
  );

  const [selections, setSelections] = useState<GeographicalSelection[]>(
    initialSelectionState?.selections || [],
  );
  const [formData, setFormData] = useState<PlanFormData>(() =>
    plan
      ? {
          code: plan.code || "",
          name: plan.name || "",
          description: plan.description || "",
          seasonId: plan.seasonId || "",
          seasonName: plan.seasonName || "",
          startDate: plan.startDate || "",
          endDate: plan.endDate || "",
          selectedRegionIds: plan.selectedRegionIds || [],
          selectedZoneIds: plan.selectedZoneIds || [],
          selectedPlotIds: plan.selectedPlotIds || [],
          crop: plan.crop || "",
          variety: plan.variety || "",
          purpose: plan.purpose || "cultivation",
          growthCycleId: plan.growthCycleId || "",
          regimenId: plan.regimenId || "",
          selectedStages: plan.selectedStages || [],
          materialAllocations:
            (plan.materialAllocations as MaterialAllocation[]) || [],
          taskAllocations: (plan.taskAllocations as TaskAllocation[]) || [],
          status: plan.status,
        }
      : createEmptyFormData(),
  );

  useEffect(() => {
    if (mode !== "edit" || !plan || regions.length === 0) return;

    setFormData({
      code: plan.code || "",
      name: plan.name || "",
      description: plan.description || "",
      seasonId: plan.seasonId || "",
      seasonName: plan.seasonName || "",
      startDate: plan.startDate || "",
      endDate: plan.endDate || "",
      selectedRegionIds: plan.selectedRegionIds || [],
      selectedZoneIds: plan.selectedZoneIds || [],
      selectedPlotIds: plan.selectedPlotIds || [],
      crop: plan.crop || "",
      variety: plan.variety || "",
      purpose: plan.purpose || "cultivation",
      growthCycleId: plan.growthCycleId || "",
      regimenId: plan.regimenId || "",
      selectedStages: plan.selectedStages || [],
      materialAllocations:
        (plan.materialAllocations as MaterialAllocation[]) || [],
      taskAllocations: (plan.taskAllocations as TaskAllocation[]) || [],
      status: plan.status,
    });
    setSelections(initialSelectionState?.selections || []);
    setSelectedEnterpriseId(initialSelectionState?.enterpriseId || "");
  }, [initialSelectionState, mode, plan, regions.length]);

  const selectionSummary = useMemo(
    () => summarizeSelections(selections, regions),
    [regions, selections],
  );

  const calculateArea = useCallback(
    () => calculateSelectedArea(formData, regions),
    [formData, regions],
  );

  const handleGeographicalConfirm = (
    newSelections: GeographicalSelection[],
  ) => {
    setSelections(newSelections);

    const nextSelectionState = deriveSelectionState(
      newSelections,
      regions,
      formData.crop,
      formData.variety,
    );

    setFormData((prev) => ({
      ...prev,
      ...nextSelectionState,
    }));
  };

  const handleSeasonChange = (seasonId: string) => {
    const season = seasons.find((item) => item.id === seasonId);
    if (!season) return;

    setFormData((prev) => ({
      ...prev,
      seasonId: season.id,
      seasonName: season.name,
    }));
    setDateWarning(null);
  };

  const handleAddMaterial = useCallback(
    (item: Omit<MaterialAllocation, "id">) => {
      setFormData((prev) => ({
        ...prev,
        materialAllocations: [
          ...prev.materialAllocations,
          { id: Date.now(), ...item },
        ],
      }));
    },
    [],
  );

  const handleRemoveMaterial = useCallback((id: number) => {
    setFormData((prev) => ({
      ...prev,
      materialAllocations: prev.materialAllocations.filter(
        (item) => item.id !== id,
      ),
    }));
  }, []);

  const handleAddTask = useCallback((item: Omit<TaskAllocation, "id">) => {
    setFormData((prev) => ({
      ...prev,
      taskAllocations: [...prev.taskAllocations, { id: Date.now(), ...item }],
    }));
  }, []);

  const handleRemoveTask = useCallback((id: number) => {
    setFormData((prev) => ({
      ...prev,
      taskAllocations: prev.taskAllocations.filter((item) => item.id !== id),
    }));
  }, []);

  const handleComplete = () => {
    const payload = {
      ...formData,
      area: calculateArea(),
      status: "active" as const,
    };

    if (mode === "edit" && params.id) {
      updatePlan(Number(params.id), payload as any);
      toast({
        title: "Thành công",
        description: `Đã cập nhật kế hoạch ${formData.name}`,
      });
      setLocation(`/plan/${params.id}`);
      return;
    }

    addPlan(payload as any);
    toast({
      title: "Thành công",
      description: `Đã tạo kế hoạch ${formData.name}`,
    });
    setLocation("/plan");
  };

  return {
    mode,
    plan,
    params,
    formData,
    setFormData,
    selections,
    setSelections,
    selectedEnterpriseId,
    setSelectedEnterpriseId,
    seasons,
    regions,
    regimens,
    growthCycles,
    selectionSummary,
    dateWarning,
    calculateArea,
    summarizeTaskSelections: (taskSelections: any[] | undefined) =>
      summarizeTaskSelections(taskSelections as any, regions),
    handleSeasonChange,
    handleGeographicalConfirm,
    handleAddMaterial,
    handleRemoveMaterial,
    handleAddTask,
    handleRemoveTask,
    handleComplete,
    goBack:
      mode === "edit" && params.id
        ? () => setLocation(`/plan/${params.id}`)
        : () => setLocation("/plan"),
    pageTitle: mode === "edit" ? "Chỉnh sửa Kế hoạch" : "Lập kế hoạch",
    pageDescription:
      mode === "edit" && plan
        ? `Cập nhật thông tin chi tiết cho kế hoạch ${plan.code}`
        : "Xây dựng lộ trình trồng trọt, phân bổ nguồn lực và giám sát",
    completeLabel: mode === "edit" ? "Lưu thay đổi" : "Kích hoạt Kế hoạch",
  };
}
