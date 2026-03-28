import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useCultivationAreaStore from "../../../stores/useCultivationAreaStore";
import useEnterpriseCertificateStore from "../../../stores/useEnterpriseCertificateStore";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import { getCultivationAreaColumns } from "../data/columns";
import type { CultivationArea } from "../types/types";

export const useCultivationAreaPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { cultivationAreas, deleteCultivationArea } = useCultivationAreaStore();
  const { standards } = useEnterpriseCertificateStore();
  const { enterprises } = useEnterpriseStore();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<CultivationArea | null>(null);

  const columns = useMemo(
    () => getCultivationAreaColumns(enterprises, standards),
    [enterprises, standards],
  );

  const handleAdd = () => setLocation("/cultivation-area/create");

  const handleEdit = (item: CultivationArea) =>
    setLocation(`/cultivation-area/${item.id}/edit`);

  const handleDelete = (item: CultivationArea) => {
    setDeletingItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;

    deleteCultivationArea(deletingItem.id);
    toast({ title: "Thành công", description: "Đã xóa khu vực canh tác" });
    setDeleteOpen(false);
    setDeletingItem(null);
  };

  return {
    cultivationAreas,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
  };
};
