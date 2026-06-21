import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import usePositionGroupStore from "../../../stores/usePositionGroupStore";
import type { PositionGroup } from "../../../stores/usePositionGroupStore";
import { emptyPositionGroupFormData } from "../data/constants";

export type PositionGroupFormData = Omit<PositionGroup, "id" | "createdAt">;

export function useGroupPositionForm() {
  const { toast } = useToast();

  // ── Zustand store ──────────────────────────────────────────────────────────
  const positionGroups = usePositionGroupStore((s) => s.positionGroups);
  const addPositionGroup = usePositionGroupStore((s) => s.addPositionGroup);
  const updatePositionGroup = usePositionGroupStore(
    (s) => s.updatePositionGroup,
  );
  const deletePositionGroup = usePositionGroupStore(
    (s) => s.deletePositionGroup,
  );

  // ── Local UI state (dialog open/close, current edit/delete target) ─────────
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PositionGroup | null>(null);
  const [deleteItem, setDeleteItem] = useState<PositionGroup | null>(null);
  const [formData, setFormData] = useState<PositionGroupFormData>(
    emptyPositionGroupFormData,
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyPositionGroupFormData);
    setFormOpen(true);
  };

  const handleEdit = (item: PositionGroup) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: PositionGroup) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      updatePositionGroup(editItem.id, formData);
      toast({ title: "Thành công", description: "Đã cập nhật nhóm chức vụ" });
    } else {
      addPositionGroup(formData);
      toast({ title: "Thành công", description: "Đã thêm nhóm chức vụ mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deletePositionGroup(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa nhóm chức vụ" });
    }
    setDeleteOpen(false);
  };

  return {
    data: positionGroups,
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
