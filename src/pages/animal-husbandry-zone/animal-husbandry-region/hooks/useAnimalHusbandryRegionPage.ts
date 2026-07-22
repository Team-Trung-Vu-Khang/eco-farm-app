import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useCatalog } from "@/features/foundation";
import { useIrrigationSystems } from "@/features/master-data";
import { useCultivationZones } from "@/features/farm/hooks/useCultivationZones";
import { useCultivationZoneMutations } from "@/features/farm/hooks/useCultivationZoneMutations";
import { getAnimalHusbandryRegionColumns } from "../data/columns";

export const useAnimalHusbandryRegionPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [farmingMethodId, setFarmingMethodId] = useState<string>("all");
  const [irrigationSystemId, setIrrigationSystemId] = useState<string>("all");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value);
      setCurrentIndex(1);
    } else if (key === "farmingMethod") {
      setFarmingMethodId(value);
      setCurrentIndex(1);
    } else if (key === "irrigationSystem") {
      setIrrigationSystemId(value);
      setCurrentIndex(1);
    }
  };

  // Fetch real farming methods for filtering
  const { items: farmingMethods } = useCatalog("farming-methods", {
    params: { status: "active", page: 0, size: 100 },
  });

  const farmingMethodOptions = useMemo(() => {
    return farmingMethods.map((m) => ({
      label: m.name,
      value: String(m.id),
    }));
  }, [farmingMethods]);

  // Fetch real irrigation systems for filtering
  const { items: irrigationSystems } = useIrrigationSystems({
    params: { status: "active", page: 0, size: 100 },
  });

  const irrigationSystemOptions = useMemo(() => {
    return irrigationSystems.map((s) => ({
      label: s.name,
      value: String(s.id),
    }));
  }, [irrigationSystems]);

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
      {
        key: "farmingMethod",
        label: "Phương pháp chăn nuôi",
        options: farmingMethodOptions,
      },
      {
        key: "irrigationSystem",
        label: "Hệ thống tưới tiêu",
        options: irrigationSystemOptions,
      },
    ];
  }, [farmingMethodOptions, irrigationSystemOptions]);

  const { items: areas, response, isLoading } = useCultivationZones({
    params: {
      keyword: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : (status as any),
      farmingMethodId: farmingMethodId === "all" ? undefined : Number(farmingMethodId),
      irrigationSystemId: irrigationSystemId === "all" ? undefined : Number(irrigationSystemId),
      domainCode: "LIVESTOCK",
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { deleteCultivationZone } = useCultivationZoneMutations();

  const handleAdd = () => setLocation("/animal-husbandry-region/create");

  const handleView = (id: number) => setLocation(`/animal-husbandry-region/${id}`);

  const handleWorkflow = (id: number) =>
    setLocation(`/animal-husbandry-region/${id}/workflow`);

  const handleEdit = (id: number) =>
    setLocation(`/animal-husbandry-region/${id}/edit`);

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const columns = useMemo(() => getAnimalHusbandryRegionColumns(), []);

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCultivationZone.mutateAsync(deletingId);
      toast({ title: "Thành công", description: "Đã xóa vùng chăn nuôi" });
    } catch {
      toast({
        title: "Lỗi",
        description: "Không thể xóa vùng chăn nuôi",
        variant: "destructive",
      });
    } finally {
      setDeleteOpen(false);
      setDeletingId(null);
    }
  };

  return {
    areas,
    columns,
    isLoading,
    response,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleView,
    handleWorkflow,
    handleEdit,
    handleSearch,
    handleDelete,
    handleConfirmDelete,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    filters,
    handleFilterChange,
  };
};
