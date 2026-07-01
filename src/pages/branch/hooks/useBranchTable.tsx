import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useDeleteBranch } from "@/features/branch";
import { branchColumns, branchFilters } from "../data/columns";
import type { BranchTableRow } from "../data/columns";

export function useBranchTable() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const deleteBranchMutation = useDeleteBranch({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã xóa chi nhánh khỏi hệ thống",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<BranchTableRow | null>(null);

  const handleDelete = (item: BranchTableRow) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      await deleteBranchMutation.deleteBranch({ id: deleteItem.id });
    }
    setDeleteOpen(false);
  };

  const handleView = (item: BranchTableRow) => {
    setLocation(`/branch/${item.id}/detail`);
  };

  const handleEdit = (item: BranchTableRow) => {
    setLocation(`/branch/${item.id}/edit`);
  };

  return {
    columns: branchColumns,
    filters: [...branchFilters],
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleView,
    handleEdit,
  };
}
