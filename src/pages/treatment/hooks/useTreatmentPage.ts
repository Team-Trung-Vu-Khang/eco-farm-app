import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { materialsDatabase, severityConfig } from "../data/treatment.data";
import type { SearchFilters, Treatment } from "../types/treatment.types";
import { useTreatmentStore } from "@/stores/useTreatmentStore";

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
  const [, setLocation] = useLocation();
  const {
    treatments: data,
    deleteTreatment,
    updateTreatment,
    addTreatment,
  } = useTreatmentStore();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Treatment | null>(null);
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
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
    if (
      selectedId !== null &&
      filteredData.some((item) => item.id === selectedId)
    ) {
      return selectedId;
    }

    return filteredData[0]?.id ?? null;
  }, [filteredData, selectedId]);

  const selectedTreatment = useMemo(
    () => data.find((t) => t.id === resolvedSelectedId),
    [data, resolvedSelectedId],
  );

  const handleEdit = (item: Treatment) => {
    setLocation(`/treatment/${item.id}/edit`);
  };

  const handleCreate = () => {
    setLocation("/treatment/create");
  };

  const handleDelete = (item: Treatment) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteTreatment(deleteItem.id);
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

  const handleDuplicate = (item: Treatment) => {
    const newId = Date.now();
    
    // Deep clone nested arrays to avoid reference sharing
    const duplicatedProcedures = item.procedures?.map((proc, pIdx) => {
      const newProcId = Date.now() + pIdx + 1000;
      return {
        ...proc,
        id: newProcId,
        stageMaterials: proc.stageMaterials?.map((mat, mIdx) => ({
          ...mat,
          id: Date.now() + (pIdx * 100) + mIdx + 2000,
        })) || [],
      };
    }) || [];

    const duplicatedItem: Treatment = {
      ...item,
      id: newId,
      code: `${item.code}-COPY`,
      name: `${item.name} (Bản sao)`,
      createdAt: new Date().toISOString(),
      procedures: duplicatedProcedures,
      authors: item.authors?.map(a => ({ ...a })),
      attachments: item.attachments?.map(att => ({ ...att })),
    };

    addTreatment(duplicatedItem);
    setSelectedId(newId);
    toast({
      title: "Thành công",
      description: `Đã sao chép phác đồ: ${item.name}`,
    });
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
    searchFilters,
    setSearchFilters,
    materialModalOpen,
    setMaterialModalOpen,
    selectedMaterial: selectedMaterialId
      ? materialsDatabase[selectedMaterialId]
      : null,
    severityCounts,
    severityConfig,
    handleCreate,
    handleEdit,
    handleDelete,
    handleDuplicate,
    handleConfirmDelete,
    handleViewMaterial,
    handleResetFilters,
  };
}
