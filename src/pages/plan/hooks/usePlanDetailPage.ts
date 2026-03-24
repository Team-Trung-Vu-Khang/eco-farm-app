import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useGrowthCycleStore from "@/stores/useGrowthCycleStore";
import useRegionStore from "@/stores/useRegionStore";
import useSeasonStore from "@/stores/useSeasonStore";
import usePlanStore from "../../../stores/usePlanStore";
import useRegimenStore from "../../../stores/useRegimenStore";
import {
  summarizePlanSelections,
  summarizeTaskSelections,
} from "../utils/location";

export function usePlanDetailPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const getPlanById = usePlanStore((state) => state.getPlanById);
  const deletePlan = usePlanStore((state) => state.deletePlan);
  const { regions } = useRegionStore();
  const { growthCycles } = useGrowthCycleStore();
  const { seasons } = useSeasonStore();
  const regimens = useRegimenStore((state) => state.regimens);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const plan = getPlanById(Number(params.id));

  useEffect(() => {
    if (!plan) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy kế hoạch",
        variant: "destructive",
      });
      setLocation("/plan");
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
    handleEdit: () => setLocation(`/plan/${params.id}/edit`),
    handleDelete: () => setDeleteOpen(true),
    handleConfirmDelete: () => {
      if (!plan) return;
      deletePlan(plan.id);
      toast({ title: "Thành công", description: "Đã xóa kế hoạch" });
      setLocation("/plan");
    },
    goBack: () => setLocation("/plan"),
  };
}
