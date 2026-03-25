import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useSeasonStore from "../../../stores/useSeasonStore";
import type { Season } from "../types/types";

export function useSeasonPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { seasons, deleteSeason } = useSeasonStore();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Season | null>(null);

  const handleAdd = () => setLocation("/season/create");

  const handleEdit = (season: Season) => {
    setLocation(`/season/${season.id}/edit`);
  };

  const handleDelete = (season: Season) => {
    setDeleteItem(season);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteSeason(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa mùa vụ" });
    }

    setDeleteOpen(false);
  };

  return {
    deleteOpen,
    handleAdd,
    handleConfirmDelete,
    handleDelete,
    handleEdit,
    seasons,
    setDeleteOpen,
  };
}
