import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useFertilizerGroupPage } from "./hooks/useFertilizerGroupPage";
import { fertilizerGroupColumns } from "./data/columns";
import { FertilizerGroupFormDialog } from "./components/FertilizerGroupFormDialog";

const FertilizerGroupPage = () => {
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
  } = useFertilizerGroupPage();

  return (
    <AdminLayout
      isDev={true}
      title="Danh mục phân bón"
      description="Quản lý danh sách các nhóm phân bón (Master Data)"
      actions={
        <Button onClick={handleAdd} data-testid="add-fertilizer-group">
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhóm
        </Button>
      }
    >
      <DataTable
        columns={fertilizerGroupColumns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm nhóm phân bón..."
      />

      <FertilizerGroupFormDialog
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
        description="Bạn có chắc chắn muốn xóa nhóm phân bón này?"
      />
    </AdminLayout>
  );
};

export default FertilizerGroupPage;
