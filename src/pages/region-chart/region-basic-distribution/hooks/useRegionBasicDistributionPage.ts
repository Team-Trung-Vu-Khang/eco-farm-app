import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";

import { useCultivationZones } from "@/features/farm/hooks/useCultivationZones";
import { useCultivationZoneMutations } from "@/features/farm/hooks/useCultivationZoneMutations";
import type { Region } from "../../constants";
import { createRegionDistributionColumns } from "../../data/distributionColumns";

export function useRegionBasicDistributionPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const {
    items: apiZones,
    response,
    isLoading,
  } = useCultivationZones({
    params: {
      keyword: debouncedSearch.trim() || undefined,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
      domainCode: "CROP",
    },
  });
  const { deleteCultivationZone } = useCultivationZoneMutations();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const regions: Region[] = useMemo(() => {
    return apiZones.map((zone) => {
      const regionScope = zone.scopes?.find((s) => s.scopeType === "REGION");
      const regionId =
        regionScope?.region?.id || regionScope?.region?.id || zone.id;
      const metadata = zone.metadataJson || {};
      const acreage =
        (regionScope?.region as any)?.acreage ||
        (regionScope?.region as any)?.area ||
        (metadata.area as number) ||
        0;
      const address =
        (regionScope?.region as any)?.address ||
        (metadata.address as string) ||
        "";

      return {
        id: zone.id,
        regionId,
        code: zone.code || regionScope?.region?.code || "",
        name: zone.name || regionScope?.region?.name || "",
        provinceId: "",
        districtId: "",
        ward: "",
        address,
        enterpriseId: "",
        area: acreage,
        landType: "",
        terrain: "",
        note: zone.notes || "",
        status: zone.status ?? "inactive",
        coordinates: [],
        subAreas: [],
        createdAt: zone.createdAt || "",
      } as any;
    });
  }, [apiZones]);

  const openDetail = (id: number) => {
    setLocation(`/cultivation-region-identification/crop/detail/${id}`);
  };

  const columns = useMemo(
    () => createRegionDistributionColumns(openDetail),
    [],
  );

  const handleAdd = () => {
    setLocation("/cultivation-region-identification/crop/create");
  };

  const handleEdit = (id: number) => {
    setLocation(`/cultivation-region-identification/crop/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteCultivationZone.mutateAsync(deletingId);
      toast({ title: "Thành công", description: "Đã xóa vùng trồng" });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa vùng trồng",
        variant: "destructive",
      });
    } finally {
      setDeleteOpen(false);
      setDeletingId(null);
    }
  };

  return {
    regions,
    isLoading,
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
  };
}
