import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useCultivationPlotStore from "../../../stores/useCultivationPlotStore";
import useEnterpriseCertificateStore from "../../../stores/useEnterpriseCertificateStore";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import { getCultivationPlotColumns } from "../data/columns";
import type { CultivationPlot } from "../types/types";

export const useCultivationPlotPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { cultivationPlots, deleteCultivationPlot } = useCultivationPlotStore();
  const { standards } = useEnterpriseCertificateStore();
  const { enterprises } = useEnterpriseStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<CultivationPlot | null>(null);

  const columns = useMemo(
    () => getCultivationPlotColumns(enterprises, standards),
    [enterprises, standards],
  );

  return {
    cultivationPlots,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd: () => setLocation("/cultivation-plot/create"),
    handleEdit: (item: CultivationPlot) =>
      setLocation(`/cultivation-plot/${item.id}/edit`),
    handleDelete: (item: CultivationPlot) => {
      setDeletingItem(item);
      setDeleteOpen(true);
    },
    handleConfirmDelete: () => {
      if (!deletingItem) return;
      deleteCultivationPlot(deletingItem.id);
      toast({ title: "Thành công", description: "Đã xóa lô" });
      setDeleteOpen(false);
      setDeletingItem(null);
    },
  };
};
