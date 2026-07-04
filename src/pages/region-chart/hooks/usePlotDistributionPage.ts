import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { usePlots } from "@/features/farm/hooks/usePlots";
import { usePlotMutations } from "@/features/farm/hooks/usePlotMutations";
import {
  createPlotDistributionRichColumns,
  type PlotDistributionRow,
} from "../data/distributionColumns";

export function usePlotDistributionPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<PlotDistributionRow | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const { items, response, isLoading } = usePlots({
    params: {
      keyword: debouncedSearch.trim() || undefined,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { deletePlot } = usePlotMutations();

  const plots = useMemo(() => {
    return items.map((plot) => ({
      ...plot,
      id: String(plot.id),
      regionName: plot.area?.region?.name ?? "—",
      areaName: plot.area?.name ?? "—",
      area: plot.acreage ?? 0,
      altitude: plot.elevation ?? 0,
      contour: plot.contourInterval ? `${plot.contourInterval}m` : "—",
      coordinates: (plot.boundary || []).map((b) => ({
        lat: b.latitude || 0,
        lng: b.longitude || 0,
      })),
    })) as unknown as PlotDistributionRow[];
  }, [items]);

  const columns = useMemo(
    () =>
      createPlotDistributionRichColumns((id) =>
        setLocation(`/plot-distribution/detail/${id}`),
      ),
    [setLocation],
  );

  const handleAdd = () => {
    setLocation("/plot-distribution/create");
  };

  const handleEdit = (item: PlotDistributionRow) => {
    setLocation(`/plot-distribution/edit/${item.id}`);
  };

  const handleDelete = (item: PlotDistributionRow) => {
    setDeletingItem(item);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingItem) {
      return;
    }

    const numericId = parseInt(deletingItem.id, 10);
    deletePlot.mutate(numericId, {
      onSuccess: () => {
        toast({
          title: "Thành công",
          description: `Đã xóa lô ${deletingItem.code}`,
        });
        setDeleteOpen(false);
        setDeletingItem(null);
      },
      onError: (err) => {
        toast({
          title: "Lỗi",
          description: err.message,
          variant: "destructive",
        });
      },
    });
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
    isLoading,
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
  };
}
