import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useRegionStore from "../../../stores/useRegionStore";
import { createRegionDistributionColumns } from "../data/distributionColumns";

export function useRegionDistributionPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { regions, deleteRegion } = useRegionStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const openDetail = (id: number) => {
    setLocation(`/region-distribution/detail/${id}`);
  };

  const columns = useMemo(
    () => createRegionDistributionColumns(openDetail),
    [],
  );

  const handleAdd = () => {
    setLocation("/region-distribution/create");
  };

  const handleEdit = (id: number) => {
    setLocation(`/region-distribution/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingId) {
      return;
    }

    deleteRegion(deletingId);
    toast({ title: "Thành công", description: "Đã xóa vùng trồng" });
    setDeleteOpen(false);
    setDeletingId(null);
  };

  return {
    regions,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    confirmDelete,
  };
}
