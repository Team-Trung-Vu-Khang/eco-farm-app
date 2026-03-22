import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { INITIAL_DATA } from "../data/constants";
import type { Cooperative } from "../types/types";

export function useCooperative() {
  const { toast } = useToast();
  const [data, setData] = useState<Cooperative[]>(INITIAL_DATA);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Cooperative | null>(null);

  const handleDelete = (item: Cooperative) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
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
