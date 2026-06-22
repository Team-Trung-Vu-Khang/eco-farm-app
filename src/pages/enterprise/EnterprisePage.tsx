import { Link } from "wouter";
import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEnterprisePage } from "./hooks/useEnterprisePage";

export default function EnterprisePage() {
  const {
    filterEnterprises,
    columns,
    filters,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    setLocation,
  } = useEnterprisePage();

  return (
    <AdminLayout
      isRice
      title="Quản lý doanh nghiệp"
      description="Quản lý thông tin các doanh nghiệp trong hệ thống"
      actions={
        <Link href="/enterprise/create">
          <Button data-testid="add-enterprise">
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={filterEnterprises}
        onView={(item) => setLocation(`/enterprise/${item.id}`)}
        onEdit={(item) => setLocation(`/enterprise/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm doanh nghiệp..."
        filters={filters}
        selectable
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa doanh nghiệp này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
