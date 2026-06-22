import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { TerrainFormDialog } from "./components/TerrainFormDialog";
import { terrainColumns } from "./data/columns";
import { useTerrainPage } from "./hooks/useTerrainPage";

export default function TerrainPage() {
  const {
    terrains,
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
  } = useTerrainPage();

  return (
    <AdminLayout
      isRice
      title="Quản lý địa hình"
      description="Phân loại và quản lý các loại địa hình trong hệ thống"
      actions={
        <Button onClick={handleAdd} data-testid="add-terrain">
          <Plus className="w-4 h-4 mr-2" />
          Thêm địa hình
        </Button>
      }
    >
      <DataTable
        columns={terrainColumns}
        data={terrains}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm địa hình..."
      />

      <TerrainFormDialog
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
        description="Bạn có chắc chắn muốn xóa địa hình này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
