import useGrowthCycleStore from "@/stores/useGrowthCycleStore";
import useRegionStore from "@/stores/useRegionStore";
import useSeasonStore from "@/stores/useSeasonStore";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useAmendmentRegimenStore } from "../../../stores/useAmendmentRegimenStore";
import { useTreatmentStore } from "../../../stores/useTreatmentStore";
import { useFarmPlanMutations } from "@/features/farm-workflow/hooks";
import type { TreatmentProcedure } from "@/pages/treatment/types/treatment.types";
import { usePlanPage } from "./usePlanPage";
import type { GeographicalSelection, Plan } from "../types";
import {
  summarizePlanSelections,
  summarizeTaskSelections,
} from "../utils/location";

type AmendmentRegimenSummary = {
  id: number;
  name: string;
  soilIssue?: string;
  cropType?: string;
  authors?: Array<{ name: string }>;
  procedures?: TreatmentProcedure[];
};

export function usePlanDetailPage(basePath = "/plan-growth") {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { plans } = usePlanPage(basePath);
  const { deletePlan } = useFarmPlanMutations();
  const { regions } = useRegionStore();
  const { growthCycles } = useGrowthCycleStore();
  const { seasons } = useSeasonStore();
  const treatments = useTreatmentStore((state) => state.treatments);
  const amendmentRegimensRaw = useAmendmentRegimenStore(
    (state) => state.regimens,
  ) as AmendmentRegimenSummary[];

  const regimens = useMemo(() => {
    const mappedTreatments = treatments.map((t) => ({
      id: String(t.id),
      name: t.name,
      description: t.disease || t.name,
      type: "tri-benh" as const,
      provider: t.author || "Chưa rõ",
      category: t.disease || "Điều trị",
      crop: t.crop || "Tất cả",
      steps:
        t.procedures?.map((p) => ({
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
      steps:
        t.procedures?.map((p) => ({
          id: String(p.id),
          day: p.timing || `Ngày ${p.stepNumber}`,
          title: p.name,
          description: p.description,
        })) || [],
    }));

    return [...mappedTreatments, ...mappedAmendments];
  }, [treatments, amendmentRegimensRaw]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const plan = useMemo(
    () => plans.find((item) => item.id === Number(params.id)),
    [plans, params.id],
  );

  useEffect(() => {
    if (!plan) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy kế hoạch",
        variant: "destructive",
      });
      setLocation(basePath);
    }
  }, [basePath, plan, setLocation, toast]);

  const selectionSummary = useMemo(
    () => (plan ? summarizePlanSelections(plan, regions) : []),
    [plan, regions],
  );

  const handleConfirmDelete = async () => {
    if (!plan) return;

    try {
      await deletePlan.mutateAsync(plan.id);
      toast({ title: "Thành công", description: "Đã xóa kế hoạch" });
      setLocation(basePath);
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa kế hoạch",
      });
    }
  };

  return {
    params,
    plan: plan as Plan | undefined,
    regions,
    growthCycles,
    seasons,
    regimens,
    deleteOpen,
    setDeleteOpen,
    selectionSummary,
    summarizeTaskSelections: (selections: GeographicalSelection[] | undefined) =>
      summarizeTaskSelections(selections, regions),
    handleEdit: () =>
      setLocation(`${basePath}/create/workflow/plan/${params.id}/edit`),
    handleDelete: () => setDeleteOpen(true),
    goToWorkflow: () => setLocation(`${basePath}/${params.id}/workflow`),
    handleConfirmDelete,
    goBack: () => setLocation(basePath),
  };
}
