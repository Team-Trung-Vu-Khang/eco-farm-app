import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { plantIdentificationColumns } from "../data/plantIdentificationColumns";
import type { Plant } from "@/pages/region-chart/constants";
import type { FarmPlantHealthStatus } from "@/features/farm";
import {
  usePlantIdentifications,
  usePlantIdentificationMutations,
} from "@/features/farm";
import { useCropVarieties } from "@/features/foundation";
import {
  PLANT_HEALTH_STATUS_LABELS,
  PLANT_HEALTH_STATUS_OPTIONS,
} from "../components/types";
import { mapApiPlantToFrontend } from "../utils/plantMapper";

export { mapApiPlantToFrontend };

export const usePlantIdentificationListPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [status, setStatus] = useState<string>("all");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Plant | null>(null);

  const [productionSubjectVariantId, setProductionSubjectVariantId] =
    useState("");
  const [healthStatus, setHealthStatus] = useState("");

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    // DataTable gửi "all" khi người dùng bỏ chọn
    const next = value === "all" ? "" : value;

    if (key === "status") setStatus(value);
    else if (key === "productionSubjectVariantId")
      setProductionSubjectVariantId(next);
    else if (key === "healthStatus") setHealthStatus(next);
    else return;

    setCurrentIndex(1);
  };

  // Danh mục giống cây cho dropdown lọc
  const { items: foundationVarieties } = useCropVarieties({
    params: { domainCode: "CROP", status: "active", size: 100 },
  });

  const filters = useMemo(
    () => [
      {
        key: "productionSubjectVariantId",
        label: "Giống cây",
        options: foundationVarieties.map((variety) => ({
          label: variety.name || `Giống #${variety.id}`,
          value: String(variety.id),
        })),
      },
      {
        key: "healthStatus",
        label: "Hiện trạng sức khỏe",
        options: PLANT_HEALTH_STATUS_OPTIONS.map((value) => ({
          label: PLANT_HEALTH_STATUS_LABELS[value],
          value,
        })),
      },
      {
        key: "status",
        label: "Trạng thái",
        options: [
          { label: "Hoạt động", value: "active" },
          { label: "Ngừng hoạt động", value: "inactive" },
          { label: "Đã lưu trữ", value: "archived" },
        ],
      },
    ],
    [foundationVarieties],
  );

  const {
    items,
    response,
    loading: isLoading,
  } = usePlantIdentifications({
    params: {
      // Bắt buộc: thiếu thì API trả lẫn cả vật nuôi và thủy sản
      domainCode: "CROP",
      keyword: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : (status as any),
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
      productionSubjectVariantId: productionSubjectVariantId
        ? Number(productionSubjectVariantId)
        : undefined,
      healthStatus: (healthStatus || undefined) as
        | FarmPlantHealthStatus
        | undefined,
    },
  });

  const { deletePlant } = usePlantIdentificationMutations();

  const plants = useMemo(() => items.map(mapApiPlantToFrontend), [items]);

  const handleView = (id: string | number) =>
    setLocation(`/plant-identification/${id}`);
  const handleEdit = (id: string | number) =>
    setLocation(`/plant-identification/${id}/edit`);

  return {
    plants,
    deleteOpen,
    setDeleteOpen,
    columns: plantIdentificationColumns,
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
