import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MaterialGroupFormDialog } from "./components/MaterialGroupFormDialog";
import { materialGroupColumns } from "./data/columns";
import { useMaterialGroupPage } from "./hooks/useMaterialGroupPage";

const MaterialGroupPage = () => {
  const {
    data,
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
  } = useMaterialGroupPage();

  return (
    <AdminLayout
      isRice
      title="Danh mục vật tư"
      description="Quản lý danh sách các nhóm vật tư (Master Data)"
      actions={
        <Button onClick={handleAdd} data-testid="add-material-group">
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhóm
        </Button>
      }
    >
      <DataTable
        columns={materialGroupColumns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm nhóm vật tư..."
      />

      <MaterialGroupFormDialog
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
        description="Bạn có chắc chắn muốn xóa nhóm vật tư này?"
      />
    </AdminLayout>
  );
};

export default MaterialGroupPage;
