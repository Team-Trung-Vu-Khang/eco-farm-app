import { useState, useMemo } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useCatalog } from "../../../features/foundation/hooks/useCatalog";
import { useFarmingMethodCrops } from "../../../features/foundation/hooks/useFarmingMethodCrops";
import { useFarmingMethodCropMutations } from "../../../features/foundation/hooks/useFarmingMethodCropMutations";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  apiToRow,
  createEmptyForm,
  emptyRelatedCropForm,
  toRelatedCropForm,
} from "../data/constants";
import type {
  FarmingMethodCropRow,
  FarmingMethodCropFormData,
  RelatedCropForm,
} from "../types/types";

export function useFarmingMethodCropPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [status, setStatus] = useState<string>("all");

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value);
      setCurrentIndex(1);
    }
  };

  const {
    items: farmingMethodCrops,
    response,
    loading,
  } = useFarmingMethodCrops({
    params: {
      keyword: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : (status as any),
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
      domainCode: "CROP",
    },
  });
  const {
    createFarmingMethodCrop,
    updateFarmingMethodCrop,
    deleteFarmingMethodCrop,
  } = useFarmingMethodCropMutations();
  const { items: farmingMethods } = useCatalog("farming-methods", {
    params: {
      domainCode: "CROP",
    },
  });

  const data = useMemo(
    () => farmingMethodCrops.map(apiToRow),
    [farmingMethodCrops],
  );

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const [linkDraft, setLinkDraft] = useState<RelatedCropForm>();
  const [editingItem, setEditingItem] = useState<FarmingMethodCropRow | null>(
    null,
  );
  const [deleteItem, setDeleteItem] = useState<FarmingMethodCropRow | null>(
    null,
  );
  const [formData, setFormData] =
    useState<FarmingMethodCropFormData>(createEmptyForm());

  const isPending =
    createFarmingMethodCrop.isPending ||
    updateFarmingMethodCrop.isPending ||
    deleteFarmingMethodCrop.isPending;

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(createEmptyForm());
    setFormOpen(true);
  };

  const handleEdit = (item: FarmingMethodCropRow) => {
    setEditingItem(item);
    setFormData({
      code: item.code,
      farmingMethodId: String(item.farmingMethodId || ""),
      description: item.description,
      status: item.status,
      relatedCrops:
        item.relatedCrops.length > 0
          ? item.relatedCrops.map(toRelatedCropForm)
          : [emptyRelatedCropForm()],
    });
    setFormOpen(true);
  };

  const handleDelete = (item: FarmingMethodCropRow) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const openAddLinkDialog = () => {
    setEditingLinkIndex(null);
    setLinkDraft(emptyRelatedCropForm());
    setLinkDialogOpen(true);
  };

  const openEditLinkDialog = (index: number) => {
    const current = formData.relatedCrops[index];
    setEditingLinkIndex(index);
    setLinkDraft(current || emptyRelatedCropForm());
    setLinkDialogOpen(true);
  };

  const handleConfirmLink = (values: RelatedCropForm[]) => {
    setFormData((current) => {
      return {
        ...current,
        relatedCrops: values.length > 0 ? values : [emptyRelatedCropForm()],
      };
    });

    setLinkDialogOpen(false);
    setEditingLinkIndex(null);
    setLinkDraft(emptyRelatedCropForm());
  };

  const handleSubmit = async () => {
    try {
      const payload: any = {
        domainCode: "CROP",
        productionMethodId: Number(formData.farmingMethodId),
        // Backward compatibility
        farmingMethodId: Number(formData.farmingMethodId),
        description: formData.description,
        status: formData.status,
        subjects: formData.relatedCrops
          .filter((c) => c.cropId > 0)
          .map((c) => ({
            subjectId: c.cropId,
            subjectVariantIds: c.varietyIds,
          })),
        // Backward compatibility
        crops: formData.relatedCrops
          .filter((c) => c.cropId > 0)
          .map((c) => ({
            cropId: c.cropId,
            varietyIds: c.varietyIds,
          })),
      };

      if (editingItem) {
        payload.code = formData.code;
        await updateFarmingMethodCrop.mutateAsync({
          id: editingItem.id,
          data: payload,
        });
        toast({
          title: "Thành công",
          description: "Đã cập nhật phương thức canh tác theo cây trồng",
        });
      } else {
        if (formData.code) {
          payload.code = formData.code;
        }
        await createFarmingMethodCrop.mutateAsync(payload);
        toast({
          title: "Thành công",
          description: "Đã thêm phương thức canh tác theo cây trồng mới",
        });
      }

      setFormOpen(false);
      setEditingItem(null);
      setFormData(createEmptyForm());
    } catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: e.message || "Đã xảy ra lỗi khi thực hiện thao tác",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteItem) {
      try {
        await deleteFarmingMethodCrop.mutateAsync(deleteItem.id);
      } catch (e) {
        console.error(e);
      }
    }
    setDeleteItem(null);
    setDeleteOpen(false);
  };

  return {
    data,
    loading,
    isPending,
    farmingMethods,
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    linkDialogOpen,
    setLinkDialogOpen,
    linkDraft,
    editingItem,
    deleteItem,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    openAddLinkDialog,
    openEditLinkDialog,
    handleConfirmLink,
    handleSubmit,
    handleConfirmDelete,
    handleFilterChange,
  };
}
