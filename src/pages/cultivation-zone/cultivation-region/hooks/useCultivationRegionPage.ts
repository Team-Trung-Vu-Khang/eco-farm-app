import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useCatalog } from "@/features/foundation";
import { useRearingMethods } from "@/features/master-data";
import { useCultivationZones } from "@/features/farm/hooks/useCultivationZones";
import { cultivationZoneApi } from "@/features/farm/api/farm.api";
import type {
  FarmCultivationZoneRequest,
  FarmCultivationZoneResponse,
} from "@/features/farm/types/farm.type";
import { useCultivationZoneMutations } from "@/features/farm/hooks/useCultivationZoneMutations";
import { getCultivationRegionColumns } from "../data/columns";
import { getApiErrorMessage } from "@/shared/lib/api-error";

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
  const [togglingId, setTogglingId] = useState<number | null>(null);

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
          { label: "Đang hoạt động", value: "active" },
          { label: "Tạm dừng hoạt động", value: "inactive" },
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

  const {
    items: areas,
    response,
    isLoading,
  } = useCultivationZones({
    params: {
      domainCode: "CROP",
      keyword: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : (status as any),
      farmingMethodId:
        farmingMethodId === "all" ? undefined : Number(farmingMethodId),
      rearingMethodId:
        irrigationSystemId === "all" ? undefined : Number(irrigationSystemId),
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });

  const { deleteCultivationZone, updateCultivationZone } =
    useCultivationZoneMutations();

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

  /**
   * Chuyển đổi trạng thái hoạt động <-> tạm dừng.
   * API chỉ có PUT full-replace nên phải dựng lại payload từ chi tiết hiện tại.
   */
  const handleToggleStatus = async (row: FarmCultivationZoneResponse) => {
    const nextStatus = row.status === "active" ? "inactive" : "active";
    setTogglingId(row.id);
    try {
      const detail = await cultivationZoneApi.getById(row.id);
      const variantPayload =
        detail.subjectVariants && detail.subjectVariants.length > 0
          ? { subjectVariantIds: detail.subjectVariants.map((v) => v.id) }
          : {
              productionSubjectVariantIds: (
                detail.productionSubjectVariants ?? []
              ).map((v) => v.id),
            };

      const data: FarmCultivationZoneRequest = {
        code: detail.code,
        name: detail.name,
        domainCode: detail.domainCode,
        healthUpdateMode: detail.healthUpdateMode,
        scopes: (detail.scopes ?? [])
          .map((scope) => {
            const target =
              scope.scopeType === "REGION"
                ? scope.region
                : scope.scopeType === "AREA"
                  ? scope.area
                  : scope.plot;
            return { scopeType: scope.scopeType, scopeId: Number(target?.id) };
          })
          .filter((scope) => !isNaN(scope.scopeId) && scope.scopeId > 0),
        certificateIds: (detail.certificates ?? []).map((c) => c.id),
        personnelIds: (detail.personnel ?? []).map((p) => p.id),
        productionMethodId: Number(
          detail.productionMethod?.id ?? detail.farmingMethod?.id,
        ),
        rearingMethodId: detail.rearingMethod?.id,
        irrigationSystemId: detail.irrigationSystem?.id,
        ...variantPayload,
        notes: detail.notes,
        status: nextStatus,
        displayOrder: detail.displayOrder,
        metadataJson: detail.metadataJson,
      };

      await updateCultivationZone.mutateAsync({ id: row.id, data });
      toast({
        title: "Thành công",
        description:
          nextStatus === "active"
            ? "Đã chuyển vùng canh tác sang Đang hoạt động"
            : "Đã tạm dừng hoạt động vùng canh tác",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          getApiErrorMessage(error) || "Không thể chuyển đổi trạng thái",
        variant: "destructive",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const columns = useMemo(
    () => getCultivationRegionColumns(handleToggleStatus, togglingId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [togglingId],
  );

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCultivationZone.mutateAsync(deletingId);
      toast({ title: "Thành công", description: "Đã xóa vùng canh tác" });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: getApiErrorMessage(error) || "Không thể xóa vùng canh tác",
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
    handleToggleStatus,
    togglingId,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    filters,
    handleFilterChange,
  };
};
