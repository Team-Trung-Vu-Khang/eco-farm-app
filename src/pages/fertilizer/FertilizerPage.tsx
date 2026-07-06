import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { getFertilizerColumns } from "./data/columns";
import { useFertilizerPage } from "./hooks/useFertilizerPage";

export default function FertilizerPage() {
  const {
    fertilizers,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleView,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    setLocation,
  } = useFertilizerPage();

  const columns = getFertilizerColumns((id) =>
    setLocation(`/fertilizer/${id}`),
  );

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý chất bón"
      description="Quản lý danh mục phân bón, chất cải tạo đất"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm chất bón
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={fertilizers}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm phân bón..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
