import PageWrapper from "@/components/PageWrapper";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState, type FC } from "react";
import { AdvancedFilterPanel } from "./components/AdvancedFilterPanel";
import { CategorySidebar } from "./components/CategorySidebar";
import { MaterialDetailDialog } from "./components/MaterialDetailDialog";
import { EquipmentDetailView } from "./components/details/EquipmentDetailView";
import { FertilizerDetailView } from "./components/details/FertilizerDetailView";
import { MaterialDetailView } from "./components/details/MaterialDetailView";
import { PesticideDetailView } from "./components/details/PesticideDetailView";
import { FloatingActionBar } from "./components/FloatingActionBar";
import { MaterialSearchBar } from "./components/MaterialSearchBar";
import { MaterialTable } from "./components/MaterialTable";
import { ResultsSummary } from "./components/ResultsSummary";
import { CATEGORIES } from "./constants/categories";
import { useMaterialLookup } from "./hooks/useMaterialLookup";
import { type MaterialItem } from "./types/types";

const MaterialLookupPage: FC = () => {
  const { toast } = useToast();
  const {
    materials,
    totalCount,
    totalPages,
    page,
    pageSize,
    setPage,
    setPageSize,
    isLoading,
    tempFilters,
    setTempFilters,
    applyFilters,
    resetFilters,
    selectedIds,
    toggleIdSelection,
    selectAll,
  } = useMaterialLookup();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MaterialItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const handleItemClick = (item: MaterialItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const renderDetailView = () => {
    if (!selectedItem) return null;

    const detailItem = {
      ...selectedItem.originalData,
      ...selectedItem.rawSupplyItem,
    };

    switch (selectedItem.category) {
      case "Pesticide":
        return <PesticideDetailView item={detailItem} />;
      case "Fertilizer":
        return <FertilizerDetailView item={detailItem} />;
      case "Material":
        return <MaterialDetailView item={detailItem} />;
      case "Equipment":
        return <EquipmentDetailView item={detailItem} />;
      default:
        return null;
    }
  };

  const getDetailUrl = (item: MaterialItem | null) => {
    if (!item || item.source === "MASTER") return null;
    const catPath =
      item.category === "Pesticide"
        ? "pesticide"
        : item.category === "Fertilizer"
          ? "fertilizer"
          : item.category === "Equipment"
            ? "equipment"
            : "material";
    return `/cultivation-material/${catPath}/${item.originalId}`;
  };

  const detailUrl = getDetailUrl(selectedItem);

  return (
    <PageWrapper title="Hệ thống tra cứu vật tư">
      <div className="flex bg-slate-50 font-sans">
        <CategorySidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(true)}
          currentCategories={tempFilters.categories}
          onCategoryChange={(cats) => {
            applyFilters({ ...tempFilters, categories: cats });
          }}
          categories={CATEGORIES}
        />

        <div className="flex-1 flex flex-col min-w-0 relative bg-slate-50">
          <MaterialSearchBar
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed(false)}
            searchValue={tempFilters.search}
            onSearchChange={(val) =>
              setTempFilters({ ...tempFilters, search: val })
            }
            onApply={applyFilters}
            isAdvancedFilterOpen={isAdvancedFilterOpen}
            onToggleAdvancedFilter={() =>
              setIsAdvancedFilterOpen(!isAdvancedFilterOpen)
            }
            advancedFilterPanel={
              <AdvancedFilterPanel
                filters={tempFilters}
                onChange={setTempFilters}
                onApply={(updatedFilters) => {
                  applyFilters(updatedFilters || tempFilters);
                  setIsAdvancedFilterOpen(false);
                }}
                onReset={resetFilters}
                onClose={() => setIsAdvancedFilterOpen(false)}
              />
            }
          />

          <ResultsSummary totalCount={totalCount} />

          <div className="p-6">
            <MaterialTable
              materials={materials}
              isLoading={isLoading}
              selectedIds={selectedIds}
              onToggleSelection={toggleIdSelection}
              onSelectAll={selectAll}
              onRowClick={handleItemClick}
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>

          <MaterialDetailDialog
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            selectedItem={selectedItem}
            detailUrl={detailUrl}
          >
            {renderDetailView()}
          </MaterialDetailDialog>

          <FloatingActionBar
            selectedCount={selectedIds.length}
            onClear={() => selectAll()}
            onExport={() =>
              toast({
                title: "Xuất dữ liệu",
                description: "Đang chuẩn bị tệp tin...",
              })
            }
            onUpdateStatus={() =>
              toast({
                title: "Cập nhật",
                description: "Chức năng đang phát triển",
              })
            }
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default MaterialLookupPage;
