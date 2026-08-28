import { useFarmSupplyListHook } from "@/features/farm-supply/hooks/useFarmSupplyListHook";

export function useEquipmentPage() {
  const listHook = useFarmSupplyListHook("equipment", "CROP");
  return {
    equipments: listHook.items,
    deleteOpen: listHook.deleteOpen,
    setDeleteOpen: listHook.setDeleteOpen,
    handleAdd: listHook.handleAdd,
    handleEdit: listHook.handleEdit,
    handleView: listHook.handleViewDetail,
    handleDelete: listHook.handleDelete,
    handleConfirmDelete: listHook.handleConfirmDelete,
    navigateToDetail: listHook.navigateToDetail,

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
