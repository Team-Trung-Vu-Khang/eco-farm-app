import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useEnterpriseStore from "@/stores/useEnterpriseStore";
import type { Enterprise } from "@/pages/enterprise/data/constants";

export function useCooperative() {
  const { toast } = useToast();
  const enterprises = useEnterpriseStore((state) => state.enterprises);
  const deleteEnterprise = useEnterpriseStore((state) => state.deleteEnterprise);
  const data = enterprises.filter((item) => item.type === "cooperative");
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
        description: "Đã xóa đơn vị khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
  };

  return {
    data,
    deleteOpen,
    deleteItem,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
  };
}
