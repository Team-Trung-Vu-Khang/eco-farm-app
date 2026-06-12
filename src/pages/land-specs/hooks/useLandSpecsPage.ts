import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useLandSpecStore, { type LandSpec } from "../../../stores/useLandSpecStore";
import { emptyLandSpecsFormData } from "../data/constants";
import type { LandSpecsFormData } from "../types/types";

export function useLandSpecsPage() {
  const { toast } = useToast();

  const landSpecs = useLandSpecStore((state) => state.landSpecs);
  const addLandSpec = useLandSpecStore((state) => state.addLandSpec);
  const updateLandSpec = useLandSpecStore((state) => state.updateLandSpec);
  const deleteLandSpec = useLandSpecStore((state) => state.deleteLandSpec);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<LandSpec | null>(null);
  const [deleteItem, setDeleteItem] = useState<LandSpec | null>(null);
  const [formData, setFormData] = useState<LandSpecsFormData>(
    emptyLandSpecsFormData,
  );

  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyLandSpecsFormData);
    setFormOpen(true);
  };

  const handleEdit = (item: LandSpec) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: LandSpec) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      updateLandSpec(editItem.id, formData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông số địa hình",
      });
    } else {
      addLandSpec(formData);
      toast({ title: "Thành công", description: "Đã thêm thông số địa hình mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteLandSpec(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa thông số địa hình" });
    }
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    landSpecs,
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
