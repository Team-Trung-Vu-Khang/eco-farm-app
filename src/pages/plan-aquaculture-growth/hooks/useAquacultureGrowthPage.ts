import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import usePlanStore from "../../../stores/usePlanStore";

export function useAquacultureGrowthPage(basePath = "/plan-aquaculture-growth") {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const plans = usePlanStore((state) => state.plans);
  const deletePlan = usePlanStore((state) => state.deletePlan);

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
    usePlanStore.getState().duplicatePlan(item.id);
    toast({ title: "Thành công", description: "Đã nhân bản kế hoạch" });
  };

  const aquaculturePlans = plans.filter(
    (plan) =>
      plan.code.startsWith("AQ-") ||
      plan.seasonName.toLowerCase().includes("vụ nuôi") ||
      ["Tôm thẻ chân trắng", "Cá tra", "Cá rô phi"].includes(plan.crop),
  );

  const statistics = aquaculturePlans.reduce(
    (acc, plan) => {
      acc.total += 1;
      if (plan.status === "active") acc.active += 1;
      if (plan.status === "draft") acc.draft += 1;
      if (plan.status === "completed") acc.completed += 1;
      return acc;
    },
    { active: 0, draft: 0, completed: 0, total: 0 },
  );

  return {
    plans: aquaculturePlans,
    statistics,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleDuplicate,
    goToCreate: () => setLocation(`${basePath}/create`),
    goToView: (id: number) => setLocation(`${basePath}/${id}`),
    goToEdit: (id: number) => setLocation(`${basePath}/${id}/edit`),
  };
}
