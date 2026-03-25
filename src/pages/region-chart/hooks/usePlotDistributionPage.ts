import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useRegionStore from "../../../stores/useRegionStore";
import {
  createPlotDistributionRichColumns,
  type PlotDistributionRow,
} from "../data/distributionColumns";

export function usePlotDistributionPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { regions, removePlot } = useRegionStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<PlotDistributionRow | null>(
    null,
  );

  const plots = useMemo(
    () =>
      regions.flatMap((region) =>
        (region.subAreas || []).flatMap((subArea) =>
          (subArea.plots || []).map((plot) => ({
            ...plot,
            regionName: region.name,
            areaName: subArea.name,
          })),
        ),
      ),
    [regions],
  );

  const columns = useMemo(
    () =>
      createPlotDistributionRichColumns((id) =>
        setLocation(`/region-chart/plot-distribution/detail/${id}`),
      ),
    [setLocation],
  );

  const handleAdd = () => {
    setLocation("/region-chart/plot-distribution/create");
  };

  const handleEdit = (item: PlotDistributionRow) => {
    setLocation(`/region-chart/plot-distribution/edit/${item.id}`);
  };

  const handleDelete = (item: PlotDistributionRow) => {
    setDeletingItem(item);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingItem) {
      return;
    }

    removePlot(deletingItem.id);
    toast({
      title: "Thành công",
      description: `Đã xóa lô ${deletingItem.code}`,
    });
    setDeleteOpen(false);
    setDeletingItem(null);
  };

  return {
    plots,
    columns,
    deleteOpen,
    setDeleteOpen,
    deletingItem,
    handleAdd,
    handleEdit,
    handleDelete,
    confirmDelete,
  };
}
