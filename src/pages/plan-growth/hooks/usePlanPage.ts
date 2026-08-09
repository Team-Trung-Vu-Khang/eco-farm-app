import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import usePlanStore from "../../../stores/usePlanStore";

export function usePlanPage(basePath = "/plan-growth") {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const plans = usePlanStore((state) => state.plans);
  const deletePlan = usePlanStore((state) => state.deletePlan);
  const getStatistics = usePlanStore((state) => state.getStatistics);

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
    goToEdit: (id: number) => setLocation(`${basePath}/${id}/edit`),
  };
}
