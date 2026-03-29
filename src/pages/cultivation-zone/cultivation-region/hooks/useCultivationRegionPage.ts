import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useCultivationRegionStore, {
  type CultivationRegion,
} from "../../../../stores/useCultivationRegionStore";
import useEnterpriseCertificateStore from "../../../../stores/useEnterpriseCertificateStore";
import { getCultivationRegionColumns } from "../data/columns";

export const useCultivationRegionPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { areas, deleteArea } = useCultivationRegionStore();
  const { standards } = useEnterpriseCertificateStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<CultivationRegion | null>(null);

  return {
    areas,
    columns: useMemo(() => getCultivationRegionColumns(standards), [standards]),
    deleteOpen,
    setDeleteOpen,
    handleAdd: () => setLocation("/cultivation-region/create"),
    handleEdit: (item: CultivationRegion) =>
      setLocation(`/cultivation-region/${item.id}/edit`),
    handleDelete: (item: CultivationRegion) => {
      setDeletingItem(item);
      setDeleteOpen(true);
    },
    handleConfirmDelete: () => {
      if (!deletingItem) return;
      deleteArea(deletingItem.id);
      toast({ title: "Thành công", description: "Đã xóa vùng canh tác" });
      setDeleteOpen(false);
      setDeletingItem(null);
    },
  };
};
