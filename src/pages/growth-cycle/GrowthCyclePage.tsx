import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  Dialog,
  DialogContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Link } from "wouter";
import { Plus } from "lucide-react";
import { useGrowthCyclePage } from "./hooks/useGrowthCyclePage";
import { growthCycleColumns } from "./data/columns";
import GrowthCycleDetailPage from "./GrowthCycleDetailPage";

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
    handleDelete,
    handleConfirmDelete,
  } = useGrowthCyclePage();

  return (
    <AdminLayout
      title="Quản lý chu kỳ sinh trưởng"
      description="Các giai đoạn phát triển của cây trồng"
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
        selectable
        columns={growthCycleColumns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm chu kỳ..."
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
