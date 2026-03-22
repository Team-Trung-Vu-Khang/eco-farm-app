import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { EnterpriseGroup, EnterpriseGroupFormData } from "../types";
import { INITIAL_DATA } from "../data/constants";

export function useEnterpriseGroupForm() {
  const { toast } = useToast();

  const [data, setData] = useState<EnterpriseGroup[]>(INITIAL_DATA);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<EnterpriseGroup | null>(null);
  const [deleteItem, setDeleteItem] = useState<EnterpriseGroup | null>(null);

  const [formData, setFormData] = useState<EnterpriseGroupFormData>({
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

  const handleEdit = (item: EnterpriseGroup) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: EnterpriseGroup) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, ...formData } : item
        )
      );
      toast({
        title: "Thành công",
        description: "Đã cập nhật nhóm tổ chức",
      });
    } else {
      const newItem: EnterpriseGroup = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm nhóm tổ chức mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa nhóm tổ chức",
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
