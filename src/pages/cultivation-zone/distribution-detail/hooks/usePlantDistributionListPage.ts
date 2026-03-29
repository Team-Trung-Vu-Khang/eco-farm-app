import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  PLANT_DISTRIBUTION_MOCK_DATA,
  type PlantDistributionListItem,
} from "../data/constants";

export const usePlantDistributionListPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [data, setData] = useState<PlantDistributionListItem[]>(
    PLANT_DISTRIBUTION_MOCK_DATA,
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] =
    useState<PlantDistributionListItem | null>(null);

  return {
    data,
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
      setData((previous) =>
        previous.filter((item) => item.id !== deletingItem.id),
      );
      toast({ title: "Thành công", description: "Đã xóa phân bổ cây trồng" });
      setDeleteOpen(false);
      setDeletingItem(null);
    },
  };
};
