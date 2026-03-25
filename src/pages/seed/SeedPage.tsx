import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Download } from "lucide-react";
import { seedColumns } from "./data/columns";
import { useSeedPage } from "./hooks/useSeedPage";

export default function SeedPage() {
  const {
    deleteOpen,
    handleAdd,
    handleConfirmDelete,
    handleDelete,
    handleEdit,
    handleView,
    seeds,
    setDeleteOpen,
    tableFilters,
  } = useSeedPage();

  return (
    <AdminLayout
      title="Quản lý hạt giống cây"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Xuất File
          </Button>
          <Button
            className="bg-green-600 text-white shadow-sm transition-all hover:bg-green-700 active:scale-95"
            onClick={handleAdd}
          >
            Thêm mới
          </Button>
        </div>
      }
    >
      <DataTable
        columns={seedColumns}
        data={seeds}
        selectable
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm giống cây..."
        filters={tableFilters}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa giống cây này?"
      />
    </AdminLayout>
  );
}
