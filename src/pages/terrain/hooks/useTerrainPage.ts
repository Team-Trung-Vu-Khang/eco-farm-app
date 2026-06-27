import { useState, useMemo } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCatalog } from "../../../features/foundation/hooks/useCatalog";
import { useCatalogMutations } from "../../../features/foundation/hooks/useCatalogMutations";
import { emptyTerrainFormData } from "../data/constants";
import type { TerrainFormData } from "../types/types";
import type { Terrain } from "../../../stores/useTerrainStore";

export function useTerrainPage() {
  const { toast } = useToast();

  const { items, loading } = useCatalog("terrain-features");
  const { createCatalog, updateCatalog, deleteCatalog } =
    useCatalogMutations("terrain-features");

  const terrains: Terrain[] = useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      code: item.code || "",
      name: item.name || "",
      description: item.description || "",
      status: (item.status as any) || "active",
      createdAt: item.createdAt ? item.createdAt.split("T")[0] : "",
    }));
  }, [items]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Terrain | null>(null);
  const [deleteItem, setDeleteItem] = useState<Terrain | null>(null);
  const [formData, setFormData] =
    useState<TerrainFormData>(emptyTerrainFormData);

  const isPending =
    createCatalog.isPending ||
    updateCatalog.isPending ||
    deleteCatalog.isPending;

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

  const handleSubmit = async (values: TerrainFormData) => {

    try {
      const payload = {
        code: values.code,
        name: values.name,
        description: values.description || "",
        status: "active" as const,
      };

      if (editItem) {
        await updateCatalog.mutateAsync({ id: editItem.id, data: payload });
        toast({
          title: "Thành công",
          description: "Đã cập nhật thông tin địa hình",
        });
      } else {
        await createCatalog.mutateAsync(payload);
        toast({ title: "Thành công", description: "Đã thêm địa hình mới" });
      }
      setFormOpen(false);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: e.message || "Đã xảy ra lỗi",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      try {
        await deleteCatalog.mutateAsync(deleteItem.id);
        toast({ title: "Thành công", description: "Đã xóa địa hình" });
        setDeleteOpen(false);
        setDeleteItem(null);
      } catch (e: any) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: e.message || "Đã xảy ra lỗi",
        });
      }
    }
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
    loading,
    isPending,
  };
}
