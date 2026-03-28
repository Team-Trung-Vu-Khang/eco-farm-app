import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useTerrainStore, { type Terrain } from "../../../stores/useTerrainStore";
import { emptyTerrainFormData } from "../data/constants";
import type { TerrainFormData } from "../types/types";

export function useTerrainPage() {
  const { toast } = useToast();

  const terrains = useTerrainStore((state) => state.terrains);
  const addTerrain = useTerrainStore((state) => state.addTerrain);
  const updateTerrain = useTerrainStore((state) => state.updateTerrain);
  const deleteTerrain = useTerrainStore((state) => state.deleteTerrain);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Terrain | null>(null);
  const [deleteItem, setDeleteItem] = useState<Terrain | null>(null);
  const [formData, setFormData] = useState<TerrainFormData>(
    emptyTerrainFormData,
  );

  const handleAdd = () => {
    setEditItem(null);
    setFormData(emptyTerrainFormData);
    setFormOpen(true);
  };

  const handleEdit = (item: Terrain) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: Terrain) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      updateTerrain(editItem.id, formData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin địa hình",
      });
    } else {
      addTerrain(formData);
      toast({ title: "Thành công", description: "Đã thêm địa hình mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteTerrain(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa địa hình" });
    }
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  return {
    terrains,
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
