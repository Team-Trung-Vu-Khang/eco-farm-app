import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { plantIdentificationColumns } from "../data/plantIdentificationColumns";
import type { Plant } from "@/pages/region-chart/constants";
import {
  usePlantIdentifications,
  usePlantIdentificationMutations,
} from "@/features/farm";
import { mapApiPlantToFrontend } from "../utils/plantMapper";

export { mapApiPlantToFrontend };

export const usePlantIdentificationListPage = () => {
  const { items } = usePlantIdentifications();
  const { deletePlant } = usePlantIdentificationMutations();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Plant | null>(null);

  const plants = useMemo(() => items.map(mapApiPlantToFrontend), [items]);

  return {
    plants,
    deleteOpen,
    setDeleteOpen,
    columns: plantIdentificationColumns,
    handleDelete: (item: Plant) => {
      setDeleteItem(item);
      setDeleteOpen(true);
    },
    handleConfirmDelete: async () => {
      if (!deleteItem) return;
      try {
        await deletePlant.mutateAsync(Number(deleteItem.id));
        toast({
          title: "Thành công",
          description: `Đã xóa cây có mã ${deleteItem.code || deleteItem.id}`,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description: error?.message || "Không thể xóa cây trồng",
          variant: "destructive",
        });
      } finally {
        setDeleteOpen(false);
        setDeleteItem(null);
      }
    },
  };
};
