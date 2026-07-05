import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useDialogBugWorkaround } from "../../shared/hooks/useDialogBugWorkaround";
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
    loading,
    isPending,
  } = useTerrainPage();

  useDialogBugWorkaround([formOpen, deleteOpen]);

  return (
    <AdminLayout
      title="Quản lý địa hình"
      description="Phân loại và quản lý các loại địa hình trong hệ thống"
      actions={
        <Button onClick={handleAdd} data-testid="add-terrain">
          <Plus className="w-4 h-4 mr-2" />
          Thêm địa hình
        </Button>
      }
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-green-500 animate-spin" />
          <span className="text-sm">Đang tải danh sách địa hình...</span>
        </div>
      ) : (
        <DataTable
          columns={terrainColumns}
          data={terrains}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Tìm kiếm địa hình..."
        />
      )}

      <TerrainFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isEdit={!!editItem}
        initialData={formData}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa địa hình này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
        loading={isPending}
      />
    </AdminLayout>
  );
}
