import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useRegionStore from "../../../stores/useRegionStore";
import { createAreaDistributionColumns } from "../data/distributionColumns";

export function useAreaDistributionPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { regions, removeSubArea } = useRegionStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const areas = useMemo(() => regions.flatMap((region) => region.subAreas || []), [regions]);
  const columns = useMemo(
    () =>
      createAreaDistributionColumns(regions, (id) =>
        setLocation(`/area-distribution/detail/${id}`),
      ),
    [regions, setLocation],
  );

  const handleAdd = () => {
    setLocation("/area-distribution/create");
  };

  const handleEdit = (id: string) => {
    setLocation(`/area-distribution/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingId) {
      return;
    }

    removeSubArea(deletingId);
    toast({ title: "Thành công", description: "Đã xóa khu vực" });
    setDeleteOpen(false);
    setDeletingId(null);
  };

  return {
    areas,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    confirmDelete,
  };
}
