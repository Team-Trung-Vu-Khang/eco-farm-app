import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { initialData } from "../mocks";
import type { Docs } from "../types";

export function useDocs() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [data, setData] = useState<Docs[]>(initialData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Docs | null>(null);

  const handleDelete = (item: Docs) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleEdit = (item: Docs) => {
    setLocation(`/docs/update/${item.id}`);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa tài liệu kỹ thuật" });
    }
    setDeleteOpen(false);
  };

  return {
    data,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleEdit,
    handleConfirmDelete,
  };
}
