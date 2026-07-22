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
import { createGrowthCycleColumns } from "./data/columns";
import GrowthCycleDetailPage from "./GrowthCycleDetailPage";
import { useGrowthCyclePage } from "./hooks/useGrowthCyclePage";

const GrowthCyclePage = () => {
  const {
    growthCycles,
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
  } = useGrowthCyclePage();

  useDialogBugWorkaround([deleteOpen, detailOpen]);

  const growthCycleColumns = useMemo(
    () =>
      createGrowthCycleColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onWorkflow: handleWorkflow,
      }),
    [handleDelete, handleEdit, handleView, handleWorkflow],
  );

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý chu kỳ sinh trưởng"
      description="Quản lý chu kỳ sinh trưởng cho cây trồng"
      actions={
        <Link href="/growth-cycle/create">
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
        <DataTable
        data={growthCycles}
        selectable={false}
        columns={growthCycleColumns}
        searchPlaceholder="Tìm kiếm chu kỳ..."
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

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedId && <GrowthCycleDetailPage id={selectedId} />}
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

export default GrowthCyclePage;
