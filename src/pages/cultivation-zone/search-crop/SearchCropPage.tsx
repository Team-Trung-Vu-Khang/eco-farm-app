import PageWrapper from "@/components/PageWrapper";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { CropDetailDialog } from "./components/CropDetailDialog";
import { PlantDetailPanel } from "./components/PlantDetailPanel";
import { PlantResultList } from "./components/PlantResultList";
import { SearchCropFilterBar } from "./components/SearchCropFilterBar";
import { usePlantSearchResults } from "./hooks/usePlantSearchResults";
import { useSearchCropFilters } from "./hooks/useSearchCropFilters";
import { toCropDetail } from "./utils/plant-identification.utils";

/** Tìm kiếm cây trồng: danh sách kết quả (trái) + chi tiết cây đang chọn (phải) */
const SearchCropPage = () => {
  const { toast } = useToast();
  const search = useSearchCropFilters();
  const results = usePlantSearchResults(search.queryParams);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCropDetailOpen, setIsCropDetailOpen] = useState(false);

  // Cây đang xem: cây đã chọn nếu còn trong kết quả, không thì cây đầu tiên
  const activePlant =
    results.plants.find((plant) => plant.id === selectedId) ??
    results.plants[0] ??
    null;

  const handleSearch = async () => {
    const { data } = await results.refetch();
    toast({
      title: "Tìm kiếm hoàn tất",
      description: `Đã tìm thấy ${
        data?.pages[0]?.totalElements ?? 0
      } cây trồng phù hợp.`,
    });
  };

  return (
    <PageWrapper title="Tìm kiếm & Truy xuất nguồn gốc">
      <div className="flex min-h-screen flex-col space-y-6 bg-slate-50 pb-12">
        <SearchCropFilterBar
          searchQuery={search.searchQuery}
          onSearchQueryChange={(value) => {
            search.setSearchQuery(value);
            setSelectedId(null);
          }}
          onSearch={() => void handleSearch()}
          filters={search.filters}
          onFiltersChange={(partial) => {
            search.updateFilters(partial);
            setSelectedId(null);
          }}
          onClear={() => {
            search.clearFilters();
            setSelectedId(null);
          }}
          activeFilterCount={search.activeFilterCount}
          isAgeRangeInvalid={search.isAgeRangeInvalid}
          totalElements={results.totalElements}
        />

        <div className="relative flex flex-1 items-start gap-6 px-2">
          <PlantResultList
            plants={results.plants}
            totalElements={results.totalElements}
            activeId={activePlant?.id}
            onSelect={setSelectedId}
            isLoading={results.isLoading}
            isError={results.isError}
            hasNextPage={results.hasNextPage}
            isFetchingNextPage={results.isFetchingNextPage}
            onLoadMore={() => void results.fetchNextPage()}
            collapsed={isSidebarCollapsed}
            onCollapsedChange={setIsSidebarCollapsed}
          />

          <div className="relative flex min-w-0 flex-1 flex-col space-y-6">
            <PlantDetailPanel
              plants={results.plants}
              activePlant={activePlant}
              onSelect={setSelectedId}
              onOpenDetail={() => setIsCropDetailOpen(true)}
            />
          </div>
        </div>
      </div>

      <CropDetailDialog
        open={isCropDetailOpen}
        onOpenChange={setIsCropDetailOpen}
        crop={activePlant ? toCropDetail(activePlant) : null}
      />
    </PageWrapper>
  );
};

export default SearchCropPage;
