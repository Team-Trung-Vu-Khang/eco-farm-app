import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { PlantDistributionListItem } from "../data/constants";
import usePlantDistributionStore from "@/stores/usePlantDistributionStore";

export const usePlantDistributionListPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { records, deleteRecord } = usePlantDistributionStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] =
    useState<PlantDistributionListItem | null>(null);

  return {
    data: records,
    deleteOpen,
    setDeleteOpen,
    handleAdd: () => setLocation("/distribution-detail/create"),
    handleEdit: (item: PlantDistributionListItem) =>
      setLocation(`/distribution-detail/${item.id}/edit`),
    handleDelete: (item: PlantDistributionListItem) => {
      setDeletingItem(item);
      setDeleteOpen(true);
    },
    handleConfirmDelete: () => {
      if (!deletingItem) return;
      deleteRecord(deletingItem.id);
      toast({ title: "Thành công", description: "Đã xóa phân bổ cây trồng" });
      setDeleteOpen(false);
      setDeletingItem(null);
    },
  };
};
