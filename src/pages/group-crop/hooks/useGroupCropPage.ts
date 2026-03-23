import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import useGroupCropStore from "../../../stores/useGroupCropStore";
import type { GroupCrop } from "../types/types";

export interface GroupCropFormData {
  code: string;
  name: string;
  biological: string;
  description: string;
}

const emptyFormData: GroupCropFormData = {
  code: "",
  name: "",
  biological: "",
  description: "",
};

export function useGroupCropPage() {
  const { toast } = useToast();
  const { groupCrops, addGroupCrop, updateGroupCrop, deleteGroupCrop } =
    useGroupCropStore();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<GroupCrop | null>(null);
  const [deleteItem, setDeleteItem] = useState<GroupCrop | null>(null);
  const [formData, setFormData] = useState<GroupCropFormData>(emptyFormData);

  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyFormData);
    setFormOpen(true);
  };

  const handleEdit = (item: GroupCrop) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      biological: item.biological,
      description: item.description,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: GroupCrop) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      updateGroupCrop(editItem.id, formData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin cây trồng",
      });
    } else {
      addGroupCrop(formData);
      toast({ title: "Thành công", description: "Đã thêm cây trồng mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteGroupCrop(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa cây trồng" });
    }
    setDeleteOpen(false);
  };

  return {
    groupCrops,
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
