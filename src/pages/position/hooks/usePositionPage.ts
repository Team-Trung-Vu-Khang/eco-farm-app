import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import usePositionStore, {
  type Position,
} from "../../../stores/usePositionStore";
import { emptyPositionFormData } from "../data/constants";
import type { PositionFormData } from "../types/types";

export function usePositionPage() {
  const { toast } = useToast();

  const positions = usePositionStore((state) => state.positions);
  const addPosition = usePositionStore((state) => state.addPosition);
  const updatePosition = usePositionStore((state) => state.updatePosition);
  const deletePosition = usePositionStore((state) => state.deletePosition);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Position | null>(null);
  const [deleteItem, setDeleteItem] = useState<Position | null>(null);
  const [formData, setFormData] = useState<PositionFormData>(
    emptyPositionFormData,
  );

  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyPositionFormData);
    setFormOpen(true);
  };

  const handleEdit = (item: Position) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      group: item.group,
      description: item.description,
      responsibilities: item.responsibilities || [],
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: Position) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      updatePosition(editItem.id, formData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật chức vụ",
      });
    } else {
      addPosition(formData);
      toast({
        title: "Thành công",
        description: "Đã thêm chức vụ mới",
      });
    }

    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deletePosition(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa chức vụ",
      });
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    positions,
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
