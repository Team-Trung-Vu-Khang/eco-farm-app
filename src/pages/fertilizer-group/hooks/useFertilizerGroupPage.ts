import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  initialFertilizerGroups,
  type FertilizerGroup,
} from "../data/constants";

export type FertilizerGroupFormData = Omit<
  FertilizerGroup,
  "id" | "createdAt"
>;

const emptyFormData: FertilizerGroupFormData = {
  code: "",
  name: "",
  description: "",
  status: "active",
};

export function useFertilizerGroupPage() {
  const { toast } = useToast();

  const [data, setData] = useState<FertilizerGroup[]>(initialFertilizerGroups);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<FertilizerGroup | null>(null);
  const [deleteItem, setDeleteItem] = useState<FertilizerGroup | null>(null);
  const [formData, setFormData] = useState<FertilizerGroupFormData>(emptyFormData);

  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyFormData);
    setFormOpen(true);
  };

  const handleEdit = (item: FertilizerGroup) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: FertilizerGroup) => {
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
        description: "Đã cập nhật danh mục phân bón",
      });
    } else {
      const newItem: FertilizerGroup = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm danh mục phân bón mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa danh mục phân bón",
      });
    }
    setDeleteOpen(false);
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
