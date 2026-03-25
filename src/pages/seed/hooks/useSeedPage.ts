import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useSeedStore from "../../../stores/useSeedStore";
import type { Variety } from "../types/types";
import { cropOptions, originOptions, supplierOptions } from "../data/mocks";

export function useSeedPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { seeds, deleteSeed } = useSeedStore();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Variety | null>(null);

  const tableFilters = [
    { key: "crop", label: "Loại cây", options: cropOptions },
    { key: "supplier", label: "Nhà cung cấp", options: supplierOptions },
    { key: "origin", label: "Xuất xứ", options: originOptions },
  ];

  const handleAdd = () => setLocation("/seed/create");
  const handleEdit = (item: Variety) => setLocation(`/seed/${item.id}/edit`);
  const handleView = (item: Variety) => setLocation(`/seed/${item.id}`);
  const handleDelete = (item: Variety) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteSeed(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa giống cây trồng" });
    }
    setDeleteOpen(false);
  };

  return {
    deleteOpen,
    handleAdd,
    handleConfirmDelete,
    handleDelete,
    handleEdit,
    handleView,
    seeds,
    setDeleteOpen,
    tableFilters,
  };
}
