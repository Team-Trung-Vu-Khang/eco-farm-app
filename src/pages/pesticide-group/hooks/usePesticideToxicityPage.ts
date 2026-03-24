import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  emptyPesticideToxicityFormData,
  initialPesticideToxicities,
} from "../data/constants";
import type { PesticideToxicityFormData, PesticideToxicityItem } from "../types";

export function usePesticideToxicityPage() {
  const { toast } = useToast();

  const [data, setData] = useState<PesticideToxicityItem[]>(
    initialPesticideToxicities,
  );
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PesticideToxicityItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<PesticideToxicityItem | null>(
    null,
  );
  const [formData, setFormData] = useState<PesticideToxicityFormData>(
    emptyPesticideToxicityFormData,
  );

  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyPesticideToxicityFormData);
    setFormOpen(true);
  };

  const handleEdit = (item: PesticideToxicityItem) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      whoClass: item.whoClass,
      colorBand: item.colorBand,
      ld50Range: item.ld50Range,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: PesticideToxicityItem) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, ...formData } : item,
        ),
      );
      toast({
        title: "Thành công",
        description: "Đã cập nhật phân loại độ độc tính",
      });
    } else {
      const newItem: PesticideToxicityItem = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm phân loại độ độc tính mới",
      });
    }

    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa phân loại độ độc tính",
      });
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    data,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
  };
}
