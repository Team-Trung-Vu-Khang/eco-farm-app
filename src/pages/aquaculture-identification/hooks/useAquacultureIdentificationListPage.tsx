import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  usePlantIdentifications,
  usePlantIdentificationMutations,
} from "@/features/farm";
import { mapApiPlantToFrontend } from "../utils/aquacultureMapper";

export const useAquacultureIdentificationListPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [status, setStatus] = useState<string>("all");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any | null>(null);

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
      domainCode: "AQUACULTURE",
      keyword: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : (status as any),
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { deletePlant } = usePlantIdentificationMutations();

  const plants = useMemo(() => items.map(mapApiPlantToFrontend), [items]);

  const columns = useMemo(
    () => [
      {
        key: "code",
        label: "Mã định danh",
        render: (value: string, row: { id: string }) => (
          <button
            type="button"
            onClick={() => setLocation(`/aquaculture-identification/${row.id}`)}
            className="font-mono font-bold text-primary hover:underline cursor-pointer"
          >
            {value || `AQI-${row.id}`}
          </button>
        ),
      },
      {
        key: "regionName",
        label: "Vùng nuôi trồng",
        render: (_: unknown, row: any) => (
          <span className="font-semibold text-slate-800">
            {row.regionName || "—"}
          </span>
        ),
      },
      {
        key: "areaName",
        label: "Khu vực",
        render: (_: unknown, row: any) => (
          <span className="text-slate-600 text-sm font-medium">
            {row.areaName || "Chưa xác định"}
          </span>
        ),
      },
      {
        key: "height",
        label: "C.Cao (m)",
        render: (value: string) => value || "—",
      },
      {
        key: "ageValue",
        label: "Độ tuổi",
        render: (_: unknown, row: any) => {
          if (!row.ageValue) return row.age || "—";
          const unitLabel = {
            days: "ngày",
            months: "tháng",
            years: "năm",
          }[row.ageUnit || "years"];
          return `${row.ageValue} ${unitLabel}`;
        },
      },
      {
        key: "coordinate",
        label: "Tọa độ",
        render: (_: unknown, row: any) =>
          row.coordinate?.lat ? (
            <span className="text-muted-foreground italic text-xs font-mono">
              {row.coordinate.lat.toFixed(5)} / {row.coordinate.lng.toFixed(5)}
            </span>
          ) : (
            "—"
          ),
      },
      {
        key: "note",
        label: "Ghi chú",
        render: (value: string) => (
          <span
            className="text-muted-foreground italic text-xs block max-w-50 truncate"
            title={value}
          >
            {value || "—"}
          </span>
        ),
      },
    ],
    [setLocation],
  );

  const handleDelete = (row: any) => {
    setDeleteItem(row);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await deletePlant.mutateAsync(Number(deleteItem.id));
      toast({
        title: "Thành công",
        description: "Đã xóa dữ liệu định danh mẫu",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.message || "Không thể xóa dữ liệu định danh",
        variant: "destructive",
      });
    } finally {
      setDeleteOpen(false);
      setDeleteItem(null);
    }
  };

  const handleView = (id: string | number) =>
    setLocation(`/aquaculture-identification/${id}`);
  const handleEdit = (id: string | number) =>
    setLocation(`/aquaculture-identification/${id}/edit`);

  return {
    plants,
    columns,
    isLoading,
    response,
    deleteOpen,
    setDeleteOpen,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    filters,
    handleFilterChange,
    handleSearch,
    handleView,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
  };
};
