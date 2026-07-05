import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { usePlantIdentificationListPage } from "./hooks/usePlantIdentificationListPage";

const PlantIdentificationListPage = () => {
  const {
    plants,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
  } = usePlantIdentificationListPage();

  return (
    <AdminLayout
      title="Định danh cây trồng"
      description="Danh sách thông tin định danh và thông số sinh trưởng của cây trồng"
      actions={
        <Link href="/plant-identification/create">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" /> Thêm mới cây
          </Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={plants}
        selectable={false}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa thông tin định danh của cây này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default PlantIdentificationListPage;
