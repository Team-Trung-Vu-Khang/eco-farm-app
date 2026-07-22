import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { animalIdentificationColumns } from "../data/animalIdentificationColumns";
import type { Plant } from "@/pages/region-chart/constants";
import {
  usePlantIdentifications,
  usePlantIdentificationMutations,
} from "@/features/farm";
import { mapApiPlantToFrontend } from "../utils/animalMapper";

export { mapApiPlantToFrontend };

export const useAnimalIdentificationListPage = () => {
  const { items } = usePlantIdentifications({
    params: { domainCode: "LIVESTOCK" },
  });
  const { deletePlant } = usePlantIdentificationMutations();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Plant | null>(null);

  const animals = useMemo(() => items.map(mapApiPlantToFrontend), [items]);

  return {
    animals,
    deleteOpen,
    setDeleteOpen,
    columns: animalIdentificationColumns,
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
          description: `Đã xóa vật nuôi có mã ${deleteItem.code || deleteItem.id}`,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description: error?.message || "Không thể xóa vật nuôi",
          variant: "destructive",
        });
      } finally {
        setDeleteOpen(false);
        setDeleteItem(null);
      }
    },
  };
};
