import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useGrowthCycleStore from "@/stores/useGrowthCycleStore";
import useRegionStore from "@/stores/useRegionStore";
import useSeasonStore from "@/stores/useSeasonStore";
import useAquacultureGrowthPlanStore from "../../../stores/useAquacultureGrowthPlanStore";
import { useTreatmentStore } from "../../../stores/useTreatmentStore";
import { useAmendmentRegimenStore } from "../../../stores/useAmendmentRegimenStore";
import {
  summarizePlanSelections,
  summarizeTaskSelections,
} from "../utils/location";

export function useAquacultureGrowthDetailPage(basePath = "/plan-aquaculture-growth") {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const getPlanById = useAquacultureGrowthPlanStore((state) => state.getPlanById);
  const deletePlan = useAquacultureGrowthPlanStore((state) => state.deletePlan);
  const { regions } = useRegionStore();
  const { growthCycles } = useGrowthCycleStore();
  const { seasons } = useSeasonStore();
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

  const [deleteOpen, setDeleteOpen] = useState(false);
  const plan = getPlanById(Number(params.id));

  useEffect(() => {
    if (!plan) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy kế hoạch",
        variant: "destructive",
      });
      setLocation(basePath);
    }
  }, [plan, setLocation, toast]);

  const selectionSummary = useMemo(
    () => (plan ? summarizePlanSelections(plan, regions) : []),
    [plan, regions],
  );

  return {
    params,
    plan,
    regions,
    growthCycles,
    seasons,
    regimens,
    deleteOpen,
    setDeleteOpen,
    selectionSummary,
    summarizeTaskSelections: (selections: any[] | undefined) =>
      summarizeTaskSelections(selections as any, regions),
    handleEdit: () => setLocation(`${basePath}/${params.id}/edit`),
    handleDelete: () => setDeleteOpen(true),
    goToWorkflow: () => setLocation(`${basePath}/${params.id}/workflow`),
    handleConfirmDelete: () => {
      if (!plan) return;
      deletePlan(plan.id);
      toast({ title: "Thành công", description: "Đã xóa kế hoạch" });
      setLocation(basePath);
    },
    goBack: () => setLocation(basePath),
  };
}
