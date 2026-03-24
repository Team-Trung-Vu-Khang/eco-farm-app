import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  emptyMaterialGroupFormData,
  initialMaterialGroups,
} from "../data/constants";
import type { MaterialGroup, MaterialGroupFormData } from "../types/types";

export function useMaterialGroupPage() {
  const { toast } = useToast();

  const [data, setData] = useState<MaterialGroup[]>(initialMaterialGroups);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<MaterialGroup | null>(null);
  const [deleteItem, setDeleteItem] = useState<MaterialGroup | null>(null);
  const [formData, setFormData] = useState<MaterialGroupFormData>(
    emptyMaterialGroupFormData,
  );

  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyMaterialGroupFormData);
    setFormOpen(true);
  };

  const handleEdit = (item: MaterialGroup) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: MaterialGroup) => {
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
        description: "Đã cập nhật danh mục vật tư",
      });
    } else {
      const newItem: MaterialGroup = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm danh mục vật tư mới",
      });
    }

    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa danh mục vật tư",
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
