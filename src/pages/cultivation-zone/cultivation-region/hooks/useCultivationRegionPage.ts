import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useCatalog } from "@/features/foundation";
import { useRearingMethods } from "@/features/master-data";
import { useCultivationZones } from "@/features/farm/hooks/useCultivationZones";
import { useCultivationZoneMutations } from "@/features/farm/hooks/useCultivationZoneMutations";
import { getCultivationRegionColumns } from "../data/columns";

export const useCultivationRegionPage = () => {
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

  // Fetch real rearing methods for filtering
  const { items: rearingMethods } = useRearingMethods({
    params: { domainCode: "CROP", status: "active", page: 0, size: 100 },
  });

  const irrigationSystemOptions = useMemo(() => {
    return rearingMethods.map((s) => ({
      label: s.name,
      value: String(s.id),
    }));
  }, [rearingMethods]);

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
        label: "Phương pháp canh tác",
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
      rearingMethodId: irrigationSystemId === "all" ? undefined : Number(irrigationSystemId),
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { deleteCultivationZone } = useCultivationZoneMutations();

  const handleAdd = () => setLocation("/cultivation-region/create");

  const handleView = (id: number) => setLocation(`/cultivation-region/${id}`);

  const handleWorkflow = (id: number) =>
    setLocation(`/cultivation-region/${id}/workflow`);

  const handleEdit = (id: number) =>
    setLocation(`/cultivation-region/${id}/edit`);

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const columns = useMemo(() => getCultivationRegionColumns(), []);

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCultivationZone.mutateAsync(deletingId);
      toast({ title: "Thành công", description: "Đã xóa vùng canh tác" });
    } catch {
      toast({
        title: "Lỗi",
        description: "Không thể xóa vùng canh tác",
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
