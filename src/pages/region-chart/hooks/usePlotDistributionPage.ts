import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useRegionStore from "../../../stores/useRegionStore";
import { createPlotDistributionColumns } from "../data/distributionColumns";

export function usePlotDistributionPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { regions, removePlot } = useRegionStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const plots = useMemo(
    () => regions.flatMap((region) => (region.subAreas || []).flatMap((subArea) => subArea.plots || [])),
    [regions],
  );

  const columns = useMemo(
    () =>
      createPlotDistributionColumns((id) =>
        setLocation(`/plot-distribution/detail/${id}`),
      ),
    [setLocation],
  );

  const handleAdd = () => {
    setLocation("/plot-distribution/create");
  };

  const handleEdit = (id: string) => {
    setLocation(`/plot-distribution/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingId) {
      return;
    }

    removePlot(deletingId);
    toast({ title: "Thành công", description: "Đã xóa lô" });
    setDeleteOpen(false);
    setDeletingId(null);
  };

  return {
    plots,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    confirmDelete,
  };
}
