import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useSeasonMutations } from "@/features/master-data/hooks/useSeasons";
import type { MasterDataSeasonResponse } from "@/features/master-data/types/master-data.type";

export function useSeasonPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { deleteSeason } = useSeasonMutations();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<MasterDataSeasonResponse | null>(null);

  const handleAdd = () => setLocation("/season/create");

  const handleEdit = (season: MasterDataSeasonResponse) => {
    setLocation(`/season/${season.id}/edit`);
  };

  const handleDelete = (season: MasterDataSeasonResponse) => {
    setDeleteItem(season);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      try {
        await deleteSeason.mutateAsync(deleteItem.id);
        toast({ title: "Thành công", description: "Đã xóa mùa vụ" });
      } catch (error) {
        toast({
          title: "Lỗi",
          description:
            error instanceof Error
              ? error.message
              : "Không thể xóa mùa vụ. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    }

    setDeleteOpen(false);
  };

  return {
    deleteOpen,
    handleAdd,
    handleConfirmDelete,
    handleDelete,
    handleEdit,
    setDeleteOpen,
  };
}
