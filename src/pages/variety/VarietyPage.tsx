import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  Dialog,
  DialogContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Link } from "wouter";
import VarietyDetailPage from "./VarietyDetailPage";
import { varietyColumns } from "./data/columns";
import { varietyFilters } from "./data/constants";
import { useVarietyPage } from "./hooks/useVarietyPage";

const VarietyPage = () => {
  const {
    varieties,
    deleteOpen,
    setDeleteOpen,
    selectedId,
    detailOpen,
    setDetailOpen,
    handleDelete,
    handleConfirmDelete,
    handleView,
    handleEdit,
  } = useVarietyPage();

  return (
    <AdminLayout
      title="Quản lý giống cây"
      description="Xem và quản lý danh sách các loại giống cây trồng"
      actions={
        <div className="flex gap-2">
          <Link href="/variety/create">
            <Button className="shadow-sm hover:shadow-md transition-all active:scale-95 bg-green-600 hover:bg-green-700">
              Thêm mới
            </Button>
          </Link>
        </div>
      }
    >
      <DataTable
        columns={varietyColumns}
        data={varieties}
        selectable
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm giống cây..."
        filters={varietyFilters}
      />

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedId && <VarietyDetailPage id={selectedId} />}
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa giống cây này?"
      />
    </AdminLayout>
  );
};

export default VarietyPage;
