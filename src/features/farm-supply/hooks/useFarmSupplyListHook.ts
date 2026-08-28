import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { farmSupplyApi } from "../api/farm-supply.api";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  SupplyType,
  DomainCode,
  MasterDataStatus,
  SupplyItemResponse,
} from "../types";
import axios from "axios";
import { useDebounce } from "@/shared/hooks/useDebounce";

export function getSupplyBasePath(
  type: SupplyType,
  domainCode: DomainCode,
  scope: "admin" | "farm" = "farm",
): string {
  if (scope === "admin") {
    const splash = domainCode === "CROP" ? "/" : "";

    const typeSuffix =
      type === "medicine"
        ? `${splash}pesticide`
        : type === "fertilizer"
          ? `${splash}fertilizer`
          : type === "material"
            ? `${splash}material`
            : `${splash}equipment`;

    const domainPrefix =
      domainCode === "CROP" ? "" : domainCode === "LIVESTOCK" ? "/ah-" : "/aq-";

    return `/admin${domainPrefix}${typeSuffix}`;
  }

  const domainPrefix =
    domainCode === "CROP"
      ? "/cultivation-material"
      : domainCode === "LIVESTOCK"
        ? "/animal-husbandry-material"
        : "/aquaculture-material";

  const typeSuffix =
    type === "medicine"
      ? "/pesticide"
      : type === "fertilizer"
        ? "/fertilizer"
        : type === "material"
          ? "/material"
          : "/equipment";

  return `${domainPrefix}${typeSuffix}`;
}

export function useFarmSupplyListHook(
  type: SupplyType,
  domainCode: DomainCode,
) {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const scope = location.startsWith("/admin") ? "admin" : "farm";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MasterDataStatus | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [onlyOwner, setOnlyOwner] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<SupplyItemResponse | null>(null);

  // ─── Deletion Impact state ──────────────────────────────────────────────
  const [deleteImpactOpen, setDeleteImpactOpen] = useState(false);
  const [deleteImpactItem, setDeleteImpactItem] =
    useState<SupplyItemResponse | null>(null);

  const basePath = getSupplyBasePath(type, domainCode, scope);

  const searchDebounce = useDebounce(search, 400);

  const query = useQuery({
    queryKey: [
      scope === "admin" ? "admin-supplies" : "farm-supplies",
      "list",
      type,
      {
        domainCode,
        keyword: searchDebounce,
        status,
        page: currentIndex - 1,
        size: pageSize,
        ...(scope === "farm" && { onlyOwner }),
      },
    ],
    queryFn: () =>
      farmSupplyApi.list(
        type,
        {
          domainCode,
          keyword: searchDebounce.trim() || undefined,
          status: status || undefined,
          page: currentIndex - 1,
          size: pageSize,
          ...(scope === "farm" && { onlyOwner }),
        },
        scope,
      ),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => farmSupplyApi.delete(type, id, scope),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [scope === "admin" ? "admin-supplies" : "farm-supplies"],
      });
    },
  });

  const handleAdd = () => {
    setLocation(`${basePath}/create`);
  };

  const handleEdit = (item: SupplyItemResponse) => {
    if (scope === "farm" && item.source !== "OWNER") {
      toast({
        title: "Thông báo",
        description: "Không thể chỉnh sửa vật tư hệ thống.",
        variant: "destructive",
      });
      return;
    }
    setLocation(`${basePath}/${item.id}/edit`);
  };

  /**
   * Opens the DeletionImpactDialog instead of the plain DeleteDialog.
   * The dialog will check for blockers before allowing deletion.
   */
  const handleDelete = (item: SupplyItemResponse) => {
    if (scope === "farm" && item.source !== "OWNER") {
      toast({
        title: "Thông báo",
        description: "Không thể xóa vật tư hệ thống.",
        variant: "destructive",
      });
      return;
    }
    setDeleteImpactItem(item);
    setDeleteImpactOpen(true);
  };

  const handleViewDetail = (item: SupplyItemResponse) => {
    const queryParam = scope === "admin" ? "" : `?source=${item.source}`;
    setLocation(`${basePath}/${item.id}${queryParam}`);
  };

  /**
   * Called from DeletionImpactDialog when there are no blockers and user confirms.
   */
  const handleConfirmDelete = async () => {
    const itemToDelete = deleteImpactItem ?? deleteItem;
    if (itemToDelete) {
      try {
        await deleteMutation.mutateAsync(itemToDelete.id);
        toast({
          title: "Thành công",
          description: "Đã xóa thành công vật tư.",
        });
      } catch (e: any) {
        if (axios.isAxiosError(e) && e.response?.status === 409) {
          toast({
            title: "Không thể xóa",
            description:
              "Vật tư đang được sử dụng trong quy tắc quy đổi. Vui lòng xóa các quy tắc quy đổi liên quan trước.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Lỗi",
            description: e.message || "Xóa không thành công",
            variant: "destructive",
          });
        }
      }
    }
    setDeleteOpen(false);
    setDeleteItem(null);
    setDeleteImpactOpen(false);
    setDeleteImpactItem(null);
  };

  return {
    items: query.data?.content ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? null,
    totalElements: query.data?.totalElements ?? 0,
    totalPages: query.data?.totalPages ?? 0,

    search,
    setSearch,
    status,
    setStatus: (_status: string) =>
      setStatus(_status === "all" ? undefined : status),
    currentIndex,
    setCurrentIndex,
    pageSize,
    setPageSize,
    onlyOwner,
    setOnlyOwner,
    scope, // Expose scope for custom components/headers if needed

    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleViewDetail,
    handleConfirmDelete,

    // Deletion Impact dialog state — consuming page must render DeletionImpactDialog
    deleteImpactOpen,
    setDeleteImpactOpen,
    deleteImpactItem,
    supplyType: type,

    navigateToDetail: (id: number) => {
      // Find row in cache to determine source
      const row = query.data?.content?.find((x) => x.id === id);
      const src = row?.source ?? "OWNER";
      const queryParam = scope === "admin" ? "" : `?source=${src}`;
      setLocation(`${basePath}/${id}${queryParam}`);
    },
  };
}
