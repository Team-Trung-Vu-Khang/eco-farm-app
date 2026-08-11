import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useAquacultureGrowthPlanStore from "../../../stores/useAquacultureGrowthPlanStore";

export function useAquacultureGrowthPage(basePath = "/plan-aquaculture-growth") {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const plans = useAquacultureGrowthPlanStore((state) => state.plans);
  const deletePlan = useAquacultureGrowthPlanStore((state) => state.deletePlan);
  const getStatistics = useAquacultureGrowthPlanStore((state) => state.getStatistics);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleDelete = (item: { id: number; name: string }) => {
    setDeleteItem({ id: item.id, name: item.name });
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deletePlan(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa kế hoạch" });
    }
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  const handleDuplicate = (item: { id: number; name: string }) => {
    useAquacultureGrowthPlanStore.getState().duplicatePlan(item.id);
    toast({ title: "Thành công", description: "Đã nhân bản kế hoạch" });
  };

  return {
    plans,
    statistics: getStatistics(),
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleDuplicate,
    goToCreate: () => setLocation(`${basePath}/create/workflow`),
    goToView: (id: number) => setLocation(`${basePath}/${id}`),
    goToEdit: (id: number) =>
      setLocation(`${basePath}/create/workflow/plan/${id}/edit`),
  };
}
