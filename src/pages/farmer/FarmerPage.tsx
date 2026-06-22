import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { useFarmerPage } from "./hooks/useFarmerPage";
import { farmerColumns } from "./data/columns";
import { farmerFilters } from "./data/constants";

export default function FarmerPage() {
  const {
    farmerData,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleView,
    handleEdit,
  } = useFarmerPage();

  return (
    <AdminLayout
      isRice
      title="Quản lý nông hộ"
      description="Quản lý thông tin các nông hộ trong hệ thống"
      actions={
        <Link href="/farmer/create">
          <Button data-testid="add-farmer">
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      <DataTable
        columns={farmerColumns}
        data={farmerData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm nông hộ..."
        filters={farmerFilters}
        selectable
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa nông hộ này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
