import { useState, useMemo } from "react";
import { useCatalog } from "../../../features/foundation/hooks/useCatalog";
import { useFarmingMethodCrops } from "../../../features/foundation/hooks/useFarmingMethodCrops";
import { useFarmingMethodCropMutations } from "../../../features/foundation/hooks/useFarmingMethodCropMutations";
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
  const { items: farmingMethodCrops, loading } = useFarmingMethodCrops();
  const {
    createFarmingMethodCrop,
    updateFarmingMethodCrop,
    deleteFarmingMethodCrop,
  } = useFarmingMethodCropMutations();
  const { items: farmingMethods } = useCatalog("farming-methods");

  const data = useMemo(
    () => farmingMethodCrops.map(apiToRow),
    [farmingMethodCrops],
  );

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const [linkDraft, setLinkDraft] = useState<RelatedCropForm>(
    emptyRelatedCropForm(),
  );
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

  const handleConfirmLink = (value: RelatedCropForm) => {
    setFormData((current) => {
      const next = [...current.relatedCrops];

      if (editingLinkIndex === null) {
        next.push(value);
      } else {
        next[editingLinkIndex] = value;
      }

      return { ...current, relatedCrops: next };
    });

    setLinkDialogOpen(false);
    setEditingLinkIndex(null);
    setLinkDraft(emptyRelatedCropForm());
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        code: formData.code,
        farmingMethodId: Number(formData.farmingMethodId),
        description: formData.description,
        status: formData.status,
        crops: formData.relatedCrops
          .filter((c) => c.cropId > 0)
          .map((c) => ({
            cropId: c.cropId,
            varietyIds: c.varietyIds,
          })),
      };

      if (editingItem) {
        await updateFarmingMethodCrop.mutateAsync({
          id: editingItem.id,
          data: payload,
        });
      } else {
        await createFarmingMethodCrop.mutateAsync(payload);
      }

      setFormOpen(false);
      setEditingItem(null);
      setFormData(createEmptyForm());
    } catch (e) {
      console.error(e);
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
  };
}
