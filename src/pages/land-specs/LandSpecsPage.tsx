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
import { useDialogBugWorkaround } from "../../shared/hooks/useDialogBugWorkaround";

export default function LandSpecsPage() {
  const {
    landSpecs,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    formData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    loading,
    isPending,
  } = useLandSpecsPage();

  useDialogBugWorkaround([formOpen, deleteOpen]);

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
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-green-500 animate-spin" />
          <span className="text-sm">
            Đang tải danh sách thông số địa hình...
          </span>
        </div>
      ) : (
        <DataTable
          columns={landSpecsColumns}
          data={landSpecs}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Tìm kiếm thông số địa hình..."
        />
      )}

      <LandSpecsFormDialog
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
        description="Bạn có chắc chắn muốn xóa thông số địa hình này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
        loading={isPending}
      />
    </AdminLayout>
  );
}
