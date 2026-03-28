import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useBranchStore, { type Branch } from "../../../stores/useBranchStore";
import { branchColumns, branchFilters } from "../data/columns";

export function useBranchTable() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const deleteBranch = useBranchStore((state) => state.deleteBranch);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Branch | null>(null);

  const handleDelete = (item: Branch) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteBranch(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa chi nhánh khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
  };

  const handleView = (item: Branch) => {
    setLocation(`/branch/${item.id}/detail`);
  };

  const handleEdit = (item: Branch) => {
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
