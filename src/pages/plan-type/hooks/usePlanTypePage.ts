import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  emptyPlanTypeFormData,
  initialPlanTypes,
} from "../data/constants";
import type { PlanType, PlanTypeFormData } from "../types/types";

export function usePlanTypePage() {
  const { toast } = useToast();

  const [planTypes, setPlanTypes] = useState<PlanType[]>(initialPlanTypes);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PlanType | null>(null);
  const [deleteItem, setDeleteItem] = useState<PlanType | null>(null);
  const [formData, setFormData] = useState<PlanTypeFormData>(
    emptyPlanTypeFormData,
  );

  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyPlanTypeFormData);
    setFormOpen(true);
  };

  const handleEdit = (item: PlanType) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      category: item.category,
      description: item.description,
      color: item.color,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: PlanType) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.code || !formData.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập mã và tên loại kế hoạch",
        variant: "destructive",
      });
      return;
    }

    if (editItem) {
      setPlanTypes((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, ...formData } : item,
        ),
      );
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin loại kế hoạch đã được lưu.",
      });
    } else {
      const newItem: PlanType = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setPlanTypes((prev) => [...prev, newItem]);
      toast({
        title: "Thêm mới thành công",
        description: "Đã thêm loại kế hoạch mới vào danh sách.",
      });
    }

    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setPlanTypes((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Đã xóa",
        description: `Đã xóa loại kế hoạch ${deleteItem.name}`,
      });
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    planTypes,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    deleteItem,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
  };
}
