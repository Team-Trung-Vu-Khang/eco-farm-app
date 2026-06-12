import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { LandSpecsFormDialog } from "./components/LandSpecsFormDialog";
import { landSpecsColumns } from "./data/columns";
import { useLandSpecsPage } from "./hooks/useLandSpecsPage";

export default function LandSpecsPage() {
  const {
    landSpecs,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
  } = useLandSpecsPage();

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý thông số địa hình"
      description="Quản lý các loại thông số địa hình trong hệ thống"
      actions={
        <Button onClick={handleAdd} data-testid="add-land-spec">
          <Plus className="w-4 h-4 mr-2" />
          Thêm thông số
        </Button>
      }
    >
      <DataTable
        columns={landSpecsColumns}
        data={landSpecs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm thông số địa hình..."
      />

      <LandSpecsFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isEdit={Boolean(editItem)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa thông số địa hình này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
