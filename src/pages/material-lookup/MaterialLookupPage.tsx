import { useState, type FC } from "react";
import { AdminLayout, useToast, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMaterialLookup } from "./hooks/useMaterialLookup";
import { MaterialTable } from "./components/MaterialTable";
import { FloatingActionBar } from "./components/FloatingActionBar";
import { AdvancedFilterPanel } from "./components/AdvancedFilterPanel";
import { PesticideDetailView } from "./components/details/PesticideDetailView";
import { FertilizerDetailView } from "./components/details/FertilizerDetailView";
import { MaterialDetailView } from "./components/details/MaterialDetailView";
import { EquipmentDetailView } from "./components/details/EquipmentDetailView";
import { type MaterialItem } from "./types/types";
import {
  CategorySidebar,
} from "./components/CategorySidebar";
import { CATEGORIES } from "./constants/categories";
import { MaterialSearchBar } from "./components/MaterialSearchBar";
import { ResultsSummary } from "./components/ResultsSummary";
import { DetailPanel } from "./components/DetailPanel";


const MaterialLookupPage: FC = () => {
  const { toast } = useToast();
  const {
    materials,
    totalCount,
    totalPages,
    page,
    pageSize,
    setPage,
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
    setIsSidebarCollapsed(true);
  };

  const renderDetailView = () => {
    if (!selectedItem) return null;

    switch (selectedItem.category) {
      case "Pesticide":
        return <PesticideDetailView item={selectedItem.originalData} />;
      case "Fertilizer":
        return <FertilizerDetailView item={selectedItem.originalData} />;
      case "Material":
        return <MaterialDetailView item={selectedItem.originalData} />;
      case "Equipment":
        return <EquipmentDetailView item={selectedItem.originalData} />;
      default:
        return null;
    }
  };

  const detailUrl = selectedItem
    ? `/${selectedItem.category.toLowerCase()}/${selectedItem.originalId}`
    : null;

  return (
    <AdminLayout title="Hệ thống tra cứu vật tư">
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50 font-sans">
        <CategorySidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(true)}
          currentCategories={tempFilters.categories}
          onCategoryChange={(cats) => {
            setTempFilters({ ...tempFilters, categories: cats });
            applyFilters();
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
                onApply={() => {
                  applyFilters();
                  setIsAdvancedFilterOpen(false);
                }}
                onReset={resetFilters}
                onClose={() => setIsAdvancedFilterOpen(false)}
              />
            }
          />

          <ResultsSummary totalCount={totalCount} />

          <div className="flex-1 overflow-hidden p-6 flex gap-6">
            <div
              className={cn(
                "flex-1 transition-all duration-500 ease-in-out",
                isDetailOpen ? "w-2/3" : "w-full",
              )}
            >
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
              />
            </div>

            <DetailPanel
              isOpen={isDetailOpen}
              onClose={() => setIsDetailOpen(false)}
              detailUrl={detailUrl}
            >
              {renderDetailView()}
            </DetailPanel>
          </div>

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
    </AdminLayout>
  );
};

export default MaterialLookupPage;
