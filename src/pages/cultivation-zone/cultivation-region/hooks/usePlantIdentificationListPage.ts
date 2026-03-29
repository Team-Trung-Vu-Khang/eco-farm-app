import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import usePlantStore from "@/stores/usePlantStore";
import useRegionStore from "@/stores/useRegionStore";
import { getPlantIdentificationColumns } from "../data/plantIdentificationColumns";
import type { Plant } from "@/pages/region-chart/constants";

export const usePlantIdentificationListPage = () => {
  const { plants, deletePlant } = usePlantStore();
  const { toast } = useToast();
  const regionStore = useRegionStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Plant | null>(null);

  return {
    plants,
    columns: useMemo(
      () =>
        getPlantIdentificationColumns(
          regionStore.regions,
          regionStore.getAreaById,
          regionStore.getPlotById,
        ),
      [regionStore.getAreaById, regionStore.getPlotById, regionStore.regions],
    ),
    deleteOpen,
    setDeleteOpen,
    handleDelete: (item: Plant) => {
      setDeleteItem(item);
      setDeleteOpen(true);
    },
    handleConfirmDelete: () => {
      if (!deleteItem) return;
      deletePlant(deleteItem.id);
      toast({
        title: "Thành công",
        description: `Đã xóa cây có mã ${deleteItem.code || deleteItem.id}`,
      });
      setDeleteOpen(false);
      setDeleteItem(null);
    },
  };
};
