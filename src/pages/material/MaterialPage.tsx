import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { materialColumns } from "./data/columns";
import { useMaterialPage } from "./hooks/useMaterialPage";

export default function MaterialPage() {
  const {
    materials,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleView,
    handleDelete,
    handleConfirmDelete,
    navigateToDetail,
  } = useMaterialPage();

  return (
    <AdminLayout
      title="Quản lý vật liệu"
      description="Quản lý danh mục vật tư, thiết bị, dụng cụ"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm vật liệu
        </Button>
      }
    >
      <DataTable
        columns={materialColumns(navigateToDetail)}
        data={materials}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm vật tư..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
