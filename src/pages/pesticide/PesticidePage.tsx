import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { pesticideColumns } from "./data/columns";
import { usePesticidePage } from "./hooks/usePesticidePage";

export default function PesticidePage() {
  const {
    pesticides,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleViewDetail,
    handleConfirmDelete,
    navigateToDetail,
  } = usePesticidePage();

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý thuốc BVTV"
      description="Quản lý danh mục thuốc bảo vệ thực vật"
      actions={
        <Button onClick={handleAdd} data-testid="add-pesticide">
          <Plus className="w-4 h-4 mr-2" />
          Thêm thuốc BVTV
        </Button>
      }
    >
      <DataTable
        columns={pesticideColumns(navigateToDetail)}
        data={pesticides}
        onView={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm thuốc BVTV..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
