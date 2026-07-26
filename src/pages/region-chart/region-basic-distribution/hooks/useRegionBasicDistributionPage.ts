import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";

import { useRegions } from "@/features/farm/hooks/useRegions";
import { useRegionMutations } from "@/features/farm/hooks/useRegionMutations";
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
    items: apiRegions,
    response,
    isLoading,
  } = useRegions({
    params: {
      keyword: debouncedSearch.trim() || undefined,
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
      domainCode: "CROP",
    },
  });
  const { deleteRegion } = useRegionMutations();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const openDetail = (id: number) => {
    setLocation(`/cultivation-region-identification/crop/detail/${id}`);
  };

  const columns = useMemo(
    () => createRegionDistributionColumns(openDetail),
    [],
  );

  const regions: Region[] = useMemo(() => {
    return apiRegions.map((region) => ({
      id: region.id,
      code: region.code || "",
      name: region.name || "",
      provinceId: region.province || "",
      districtId: region.district || "",
      ward: region.ward || "",
      address: region.address || "",
      enterpriseId: (region.metadataJson?.enterpriseId as string) || "",
      area: region.acreage || 0,
      landType: region.soilType?.id?.toString() || "",
      terrain: region.terrainFeature?.id?.toString() || "",
      note: region.description || "",
      status: region.status ?? "inactive",
      coordinates: (region.boundary || []).map((boundary) => ({
        lat: boundary.latitude || 0,
        lng: boundary.longitude || 0,
      })),
      subAreas: (region.areas || []).map((area) => ({
        id: area.id?.toString() || "",
        code: area.code || "",
        name: area.name || "",
        regionId: region.id,
        area: area.acreage || 0,
        landType: area.soilType?.id?.toString() || "",
        terrain: area.terrainFeature?.id?.toString() || "",
        coordinates: (area.boundary || []).map((boundary) => ({
          lat: boundary.latitude || 0,
          lng: boundary.longitude || 0,
        })),
        plots: [],
        createdAt: area.createdAt || "",
        status: area.status ?? "inactive",
      })),
      createdAt: region.createdAt || "",
    }));
  }, [apiRegions]);

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
      await deleteRegion.mutateAsync(deletingId);
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
