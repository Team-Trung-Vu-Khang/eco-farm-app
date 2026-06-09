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
  } = useGroupCropPage();

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
      <DataTable
        data={groupCrops}
        columns={groupCropColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm mã, tên loại cây..."
      />

      <GroupCropFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isEdit={!!editItem}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
