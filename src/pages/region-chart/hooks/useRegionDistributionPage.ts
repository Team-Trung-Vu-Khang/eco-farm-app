import { useMemo, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useRegions } from "@/features/farm/hooks/useRegions";
import { useRegionMutations } from "@/features/farm/hooks/useRegionMutations";
import { createRegionDistributionColumns } from "../data/distributionColumns";
import type { Region } from "../constants";

export function useRegionDistributionPage() {
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
    },
  });
  const { deleteRegion } = useRegionMutations();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const openDetail = (id: number) => {
    setLocation(`/region-distribution/detail/${id}`);
  };

  const columns = useMemo(
    () => createRegionDistributionColumns(openDetail),
    [],
  );

  const regions: Region[] = useMemo(() => {
    return apiRegions.map((r) => ({
      id: r.id,
      code: r.code || "",
      name: r.name || "",
      provinceId: r.province || "",
      districtId: r.district || "",
      address: r.address || "",
      enterpriseId: (r.metadataJson?.enterpriseId as string) || "",
      area: r.acreage || 0,
      landType: r.soilType?.id?.toString() || "",
      terrain: r.terrainFeature?.id?.toString() || "",
      note: r.description || "",
      status: r?.status ?? "inactive",
      coordinates: (r.boundary || []).map((b) => ({
        lat: b.latitude || 0,
        lng: b.longitude || 0,
      })),
      subAreas: (r.areas || []).map((a) => ({
        id: a.id?.toString() || "",
        code: a.code || "",
        name: a.name || "",
        regionId: r.id,
        area: a.acreage || 0,
        landType: a.soilType?.id?.toString() || "",
        terrain: a.terrainFeature?.id?.toString() || "",
        coordinates: (a.boundary || []).map((b) => ({
          lat: b.latitude || 0,
          lng: b.longitude || 0,
        })),
        plots: [],
        createdAt: a.createdAt || "",
        status: a?.status ?? "inactive",
      })),
      createdAt: r.createdAt || "",
    }));
  }, [apiRegions]);

  const handleAdd = () => {
    setLocation("/region-distribution/create");
  };

  const handleEdit = (id: number) => {
    setLocation(`/region-distribution/edit/${id}`);
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
    } catch (e) {
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
