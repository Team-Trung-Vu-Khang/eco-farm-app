import { Link } from "wouter";
import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useBranchStore from "../../stores/useBranchStore";
import { branchColumns, branchFilters } from "./data/columns";
import { useBranchTable } from "./hooks/useBranchTable";

/**
 * Branch management page component.
 * Displays a list of branches with filtering, viewing, editing, and deletion capabilities.
 */
export default function BranchPage() {
  const branches = useBranchStore((state) => state.branches);

  const {
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleView,
    handleEdit,
  } = useBranchTable();

  return (
    <AdminLayout
      title="Quản lý chi nhánh"
      description="Quản lý danh sách chi nhánh của các đơn vị"
      actions={
        <Link href="/branch/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      <DataTable
        columns={branchColumns}
        data={branches}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm chi nhánh..."
        filters={[...branchFilters]}
        selectable
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa chi nhánh này? Dữ liệu liên quan có thể bị ảnh hưởng."
      />
    </AdminLayout>
  );
}
