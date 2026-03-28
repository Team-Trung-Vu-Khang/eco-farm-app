import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  initialTreatments,
  materialsDatabase,
  severityConfig,
} from "../data/treatment.data";
import type { SearchFilters, Treatment } from "../types/treatment.types";

const emptySearchFilters: SearchFilters = {
  keyword: "",
  cropType: "",
  crop: "",
  variety: "",
  disease: "",
  severity: "",
  status: "",
};

export function useTreatmentPage() {
  const { toast } = useToast();
  const [data, setData] = useState<Treatment[]>(initialTreatments);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Treatment | null>(null);
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Treatment | null>(null);
  const [searchFilters, setSearchFilters] =
    useState<SearchFilters>(emptySearchFilters);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (searchFilters.keyword) {
        const keyword = searchFilters.keyword.toLowerCase();
        const matchKeyword =
          item.code.toLowerCase().includes(keyword) ||
          item.name.toLowerCase().includes(keyword) ||
          item.disease.toLowerCase().includes(keyword);
        if (!matchKeyword) return false;
      }

      if (searchFilters.cropType && item.cropType !== searchFilters.cropType)
        return false;
      if (searchFilters.crop && item.crop !== searchFilters.crop) return false;
      if (searchFilters.variety && item.variety !== searchFilters.variety)
        return false;
      if (searchFilters.disease && item.disease !== searchFilters.disease)
        return false;
      if (searchFilters.severity && item.severity !== searchFilters.severity)
        return false;
      if (searchFilters.status && item.status !== searchFilters.status)
        return false;

      return true;
    });
  }, [data, searchFilters]);

  const resolvedSelectedId = useMemo(() => {
    if (selectedId !== null && filteredData.some((item) => item.id === selectedId)) {
      return selectedId;
    }

    return filteredData[0]?.id ?? null;
  }, [filteredData, selectedId]);

  const selectedTreatment = useMemo(
    () => data.find((t) => t.id === resolvedSelectedId),
    [data, resolvedSelectedId],
  );

  const handleEdit = (item: Treatment) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleSubmit = (formData: Partial<Treatment>) => {
    if (editingItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...formData } : item,
        ),
      );
      toast({
        title: "Thành công",
        description: `Đã cập nhật phác đồ: ${formData.name}`,
      });
    } else {
      const newItem: Treatment = {
        ...formData,
        id: Math.max(...data.map((d) => d.id), 0) + 1,
        steps: [],
        createdAt: new Date().toISOString().split("T")[0],
        status: "active",
        severity: "moderate",
        safetyRating: "medium",
        ...formData,
      } as Treatment;

      setData((prev) => [newItem, ...prev]);
      setSelectedId(newItem.id);
      toast({
        title: "Thành công",
        description: `Đã tạo mới phác đồ: ${newItem.name}`,
      });
    }
    setFormOpen(false);
  };

  const handleDelete = (item: Treatment) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      if (selectedId === deleteItem.id) {
        setSelectedId(null);
      }
      toast({ title: "Thành công", description: "Đã xóa phác đồ" });
    }
    setDeleteOpen(false);
    setDeleteItem(null);
  };

  const handleViewMaterial = (materialId: string) => {
    setSelectedMaterialId(materialId);
    setMaterialModalOpen(true);
  };

  const handleResetFilters = () => setSearchFilters(emptySearchFilters);

  const severityCounts = {
    M0: data.filter((t) => t.severity === "M0").length,
    M1: data.filter((t) => t.severity === "M1").length,
    M2: data.filter((t) => t.severity === "M2").length,
    M3: data.filter((t) => t.severity === "M3").length,
    M4: data.filter((t) => t.severity === "M4").length,
  };

  return {
    data,
    filteredData,
    selectedId: resolvedSelectedId,
    setSelectedId,
    selectedTreatment,
    deleteOpen,
    setDeleteOpen,
    formOpen,
    setFormOpen,
    editingItem,
    searchFilters,
    setSearchFilters,
    materialModalOpen,
    setMaterialModalOpen,
    selectedMaterial:
      selectedMaterialId ? materialsDatabase[selectedMaterialId] : null,
    severityCounts,
    severityConfig,
    handleCreate,
    handleEdit,
    handleSubmit,
    handleDelete,
    handleConfirmDelete,
    handleViewMaterial,
    handleResetFilters,
  };
}
