import { useDialogBugWorkaround } from "@/shared/hooks/useDialogBugWorkaround";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  Dialog,
  DialogContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { Link } from "wouter";
import { createAnimalGrowthCycleColumns } from "./data/columns";
import AnimalGrowthCycleDetailPage from "./AnimalGrowthCycleDetailPage";
import { useAnimalGrowthCyclePage } from "./hooks/useAnimalGrowthCyclePage";

const AnimalGrowthCyclePage = () => {
  const {
    animalGrowthCycles,
    detailOpen,
    setDetailOpen,
    selectedId,
    handleView,
    deleteOpen,
    setDeleteOpen,
    handleEdit,
    handleWorkflow,
    handleDelete,
    handleConfirmDelete,
    loading,
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    filters,
    handleFilterChange,
  } = useAnimalGrowthCyclePage();

  useDialogBugWorkaround([deleteOpen, detailOpen]);

  const animalGrowthCycleColumns = useMemo(
    () =>
      createAnimalGrowthCycleColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onWorkflow: handleWorkflow,
      }),
    [handleDelete, handleEdit, handleView, handleWorkflow],
  );

  const animalCycles = useMemo(
    () =>
      animalGrowthCycles.filter((cycle) => (cycle.cycleType ?? "animal") === "animal"),
    [animalGrowthCycles],
  );

  return (
    <AdminLayout
      isDev={true}
      title="Vụ nuôi"
      description="Quản lý chu kỳ sinh trưởng của vật nuôi / thủy sản"
      actions={
        <Link href="/animal-growth-cycle/create">
          <Button
            size="sm"
            className="h-9 px-3 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      <div className="w-full">
        <DataTable
          data={animalCycles}
          selectable={false}
          columns={animalGrowthCycleColumns}
          searchPlaceholder="Tìm kiếm chu kỳ vật nuôi / thủy sản..."
          searchable
          onSearch={handleSearch}
          pageSize={pageSize}
          currentIndex={currentIndex}
          totalElements={response?.totalElements}
          totalPages={response?.totalPages}
          onPageSize={setPageSize}
          onIndexChange={setCurrentIndex}
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
        />
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedId && <AnimalGrowthCycleDetailPage id={selectedId} />}
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
};

export default AnimalGrowthCyclePage;
