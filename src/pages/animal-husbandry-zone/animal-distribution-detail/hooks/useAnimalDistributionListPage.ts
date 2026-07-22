import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { AnimalDistributionListItem } from "../data/constants";
import useAnimalDistributionStore from "@/stores/useAnimalDistributionStore";

export const useAnimalDistributionListPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { records, deleteRecord } = useAnimalDistributionStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] =
    useState<AnimalDistributionListItem | null>(null);

  return {
    data: records,
    deleteOpen,
    setDeleteOpen,
    handleAdd: () => setLocation("/animal-distribution-detail/create"),
    handleEdit: (item: AnimalDistributionListItem) =>
      setLocation(`/animal-distribution-detail/${item.id}/edit`),
    handleDelete: (item: AnimalDistributionListItem) => {
      setDeletingItem(item);
      setDeleteOpen(true);
    },
    handleConfirmDelete: () => {
      if (!deletingItem) return;
      deleteRecord(deletingItem.id);
      toast({ title: "Thành công", description: "Đã xóa phân bổ vật nuôi" });
      setDeleteOpen(false);
      setDeletingItem(null);
    },
  };
};
