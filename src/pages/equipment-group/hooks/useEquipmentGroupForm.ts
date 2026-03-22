import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { initialEquipmentGroups } from "../data/constants";
import type { EquipmentGroup, EquipmentGroupFormData } from "../types";

export function useEquipmentGroupForm() {
  const { toast } = useToast();
  const [data, setData] = useState<EquipmentGroup[]>(initialEquipmentGroups);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<EquipmentGroup | null>(null);
  const [deleteItem, setDeleteItem] = useState<EquipmentGroup | null>(null);

  const [formData, setFormData] = useState<EquipmentGroupFormData>({
    code: "",
    name: "",
    description: "",
    status: "active",
  });

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      status: "active",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: EquipmentGroup) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: EquipmentGroup) => {
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
        description: "Đã cập nhật danh mục máy móc",
      });
    } else {
      const newItem: EquipmentGroup = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm danh mục máy móc mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa danh mục máy móc",
      });
    }
    setDeleteOpen(false);
  };

  return {
    data,
    formData,
    setFormData,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
  };
}
