import { useMemo, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { createAreaDistributionColumns } from "../data/distributionColumns";
import { useAreas } from "@/features/farm/hooks/useAreas";
import { useAreaMutations } from "@/features/farm/hooks/useAreaMutations";

export function useAreaDistributionPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const { items: areas, response, isLoading } = useAreas({
    params: {
      keyword: debouncedSearch.trim() || undefined,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });
  const { deleteArea } = useAreaMutations();

  const columns = useMemo(
    () =>
      createAreaDistributionColumns((id) =>
        setLocation(`/area-distribution/detail/${id}`),
      ),
    [setLocation],
  );

  const handleAdd = () => {
    setLocation("/area-distribution/create");
  };

  const handleEdit = (id: string | number) => {
    setLocation(`/area-distribution/edit/${id}`);
  };

  const handleDelete = (id: string | number) => {
    setDeletingId(Number(id));
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingId) {
      return;
    }

    deleteArea.mutate(deletingId, {
      onSuccess: () => {
        toast({ title: "Thành công", description: "Đã xóa khu vực" });
        setDeleteOpen(false);
        setDeletingId(null);
      },
      onError: (err) => {
        toast({ title: "Lỗi", description: err.message, variant: "destructive" });
      }
    });
  };

  return {
    areas,
    columns,
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    confirmDelete,
    isLoading,
  };
}
