import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useBranchStore from "@/stores/useBranchStore";

export function useBranchDetail() {
  const [, setLocation] = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  // Get branch ID from route params
  const [, params] = useRoute("/branch/:id/detail");
  const branchId = params?.id ? parseInt(params.id) : undefined;

  // Fetch branch from store
  const getBranchById = useBranchStore((state) => state.getBranchById);
  const deleteBranch = useBranchStore((state) => state.deleteBranch);
  const branch = branchId ? getBranchById(branchId) : undefined;

  const handleDelete = () => {
    if (branchId) {
      deleteBranch(branchId);
      toast({
        title: "Đã xóa chi nhánh",
        description: `Chi nhánh ${branch?.name} đã được xóa thành công.`,
      });
      setShowDeleteDialog(false);
      setLocation("/branch");
    }
  };

  return {
    branch,
    branchId,
    showDeleteDialog,
    setShowDeleteDialog,
    handleDelete,
    handleBack: () => setLocation("/branch"),
    handleEdit: () => setLocation(`/branch/${branchId}/edit`),
  };
}
