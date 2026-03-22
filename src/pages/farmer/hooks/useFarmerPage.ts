import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { useLocation } from "wouter";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import type { Enterprise } from "../../enterprise/data/constants";

export function useFarmerPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const enterprises = useEnterpriseStore((state) => state.enterprises);
  const deleteEnterprise = useEnterpriseStore(
    (state) => state.deleteEnterprise,
  );

  const farmerData = enterprises.filter((item) => item.type === "farm");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Enterprise | null>(null);

  const handleDelete = (item: Enterprise) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteEnterprise(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa nông hộ khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
  };

  const handleView = (item: Enterprise) => setLocation(`/farmer/${item.id}`);
  const handleEdit = (item: Enterprise) =>
    setLocation(`/farmer/${item.id}/edit`);

  return {
    farmerData,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleView,
    handleEdit,
  };
}
