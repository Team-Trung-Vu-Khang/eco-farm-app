import { useFarmSupplyListHook } from "@/features/farm-supply/hooks/useFarmSupplyListHook";
import type { SupplyItemResponse } from "@/features/farm-supply/types";
import { useLocation } from "wouter";
import { SUPPLY_TYPE } from "../data/constants";

const BASE_PATH = "/cultivation-material/biological-product";

export function useBiologicalProductPage() {
  const listHook = useFarmSupplyListHook(SUPPLY_TYPE, "CROP");
  const [, setLocation] = useLocation();

  // Hook chung dựng đường dẫn từ SupplyType nên sẽ trỏ về /fertilizer —
  // override lại cho đúng trang chế phẩm sinh học.
  return {
    biologicalProducts: listHook.items,
    deleteOpen: listHook.deleteOpen,
    setDeleteOpen: listHook.setDeleteOpen,
    handleAdd: () => setLocation(`${BASE_PATH}/create`),
    handleEdit: (item: SupplyItemResponse) =>
      setLocation(`${BASE_PATH}/${item.id}/edit`),
    handleDelete: listHook.handleDelete,
    handleView: (item: SupplyItemResponse) =>
      setLocation(`${BASE_PATH}/${item.id}`),
    handleConfirmDelete: listHook.handleConfirmDelete,
    navigateToDetail: (id: number) => setLocation(`${BASE_PATH}/${id}`),

    // Pagination/Filter states for DataTable
    pageSize: listHook.pageSize,
    setPageSize: listHook.setPageSize,
    currentIndex: listHook.currentIndex,
    setCurrentIndex: listHook.setCurrentIndex,
    totalElements: listHook.totalElements,
    totalPages: listHook.totalPages,
    search: listHook.search,
    setSearch: listHook.setSearch,
    status: listHook.status,
    setStatus: listHook.setStatus,
    onlyOwner: listHook.onlyOwner,
    setOnlyOwner: listHook.setOnlyOwner,
    loading: listHook.loading,

    // Deletion Impact
    deleteImpactOpen: listHook.deleteImpactOpen,
    setDeleteImpactOpen: listHook.setDeleteImpactOpen,
    deleteImpactItem: listHook.deleteImpactItem,
    supplyType: listHook.supplyType,
    scope: listHook.scope,
  };
}
