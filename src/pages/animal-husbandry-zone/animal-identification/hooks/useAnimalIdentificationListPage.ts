import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { animalIdentificationColumns } from "../data/animalIdentificationColumns";
import type { Plant } from "@/pages/region-chart/constants";
import {
  usePlantIdentifications,
  usePlantIdentificationMutations,
} from "@/features/farm";
import { mapApiPlantToFrontend } from "../utils/animalMapper";

export { mapApiPlantToFrontend };

export const useAnimalIdentificationListPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [status, setStatus] = useState<string>("all");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Plant | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value);
      setCurrentIndex(1);
    }
  };

  const filters = useMemo(() => {
    return [
      {
        key: "status",
        label: "Trạng thái",
        options: [
          { label: "Hoạt động", value: "active" },
          { label: "Ngừng hoạt động", value: "inactive" },
          { label: "Đã lưu trữ", value: "archived" },
        ],
      },
    ];
  }, []);

  const {
    items,
    response,
    loading: isLoading,
  } = usePlantIdentifications({
    params: {
      domainCode: "LIVESTOCK",
      keyword: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : (status as any),
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { deletePlant } = usePlantIdentificationMutations();

  const animals = useMemo(() => items.map(mapApiPlantToFrontend), [items]);

  const handleView = (id: string | number) =>
    setLocation(`/animal-identification/${id}`);
  const handleEdit = (id: string | number) =>
    setLocation(`/animal-identification/${id}/edit`);

  return {
    animals,
    deleteOpen,
    setDeleteOpen,
    columns: animalIdentificationColumns,
    isLoading,
    response,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    filters,
    handleFilterChange,
    handleSearch,
    handleView,
    handleEdit,
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
