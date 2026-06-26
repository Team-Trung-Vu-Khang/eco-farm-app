import { useEffect } from "react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useGroupCropPage } from "./hooks/useGroupCropPage";
import { groupCropColumns } from "./data/columns";
import { GroupCropFormDialog } from "./components/GroupCropFormDialog";

export default function GroupCropPage() {
  const {
    groupCrops,
    loading,
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
    isPending,
  } = useGroupCropPage();

  // Workaround for Radix UI Dialog bug where pointer-events: none is left on body
  useEffect(() => {
    if (!formOpen && !deleteOpen) {
      setTimeout(() => {
        document.body.style.pointerEvents = "auto";
      }, 500);
    }
  }, [formOpen, deleteOpen]);

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý nhóm cây trồng"
      description="Danh mục các nhóm cây trồng có trên thị trường"
      actions={
        <Button
          className="shadow-sm hover:shadow-md transition-all active:scale-95 bg-green-600 hover:bg-green-700"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
      }
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-green-500 animate-spin" />
          <span className="text-sm">Đang tải danh sách nhóm cây trồng...</span>
        </div>
      ) : (
        <DataTable
          data={groupCrops}
          columns={groupCropColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Tìm kiếm mã, tên loại cây..."
        />
      )}

      <GroupCropFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isEdit={!!editItem}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isPending={isPending}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa nhóm cây trồng này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
