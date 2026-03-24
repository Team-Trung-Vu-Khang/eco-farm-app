import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  PesticideCategoryFormData,
  PesticideCategoryItem,
} from "../types";

interface UsePesticideCategoryPageOptions {
  initialData: PesticideCategoryItem[];
  emptyFormData: PesticideCategoryFormData;
  createSuccessMessage: string;
  updateSuccessMessage: string;
  deleteSuccessMessage: string;
}

export function usePesticideCategoryPage({
  initialData,
  emptyFormData,
  createSuccessMessage,
  updateSuccessMessage,
  deleteSuccessMessage,
}: UsePesticideCategoryPageOptions) {
  const { toast } = useToast();

  const [data, setData] = useState<PesticideCategoryItem[]>(initialData);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PesticideCategoryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<PesticideCategoryItem | null>(
    null,
  );
  const [formData, setFormData] = useState<PesticideCategoryFormData>(
    emptyFormData,
  );

  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyFormData);
    setFormOpen(true);
  };

  const handleEdit = (item: PesticideCategoryItem) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: PesticideCategoryItem) => {
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
      toast({ title: "Thành công", description: updateSuccessMessage });
    } else {
      const newItem: PesticideCategoryItem = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({ title: "Thành công", description: createSuccessMessage });
    }

    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: deleteSuccessMessage });
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
