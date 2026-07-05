import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useUnitPage } from "./hooks/useUnitPage";

export default function UnitPage() {
  const {
    units,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleView,
  } = useUnitPage();

  return (
    <AdminLayout
      title="Quản lý đơn vị"
      description="Quản lý danh sách đơn vị tính và quy tắc quy đổi về đơn vị chuẩn (kg, lít...)"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm đơn vị
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={units}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm đơn vị..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
