import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { plantDistributionColumns } from "./data/columns";
import { usePlantDistributionListPage } from "./hooks/usePlantDistributionListPage";

const PlantDistributionListPage = () => {
  const {
    data,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
  } = usePlantDistributionListPage();

  return (
    <AdminLayout
      isDev={true}
      title="Phân bổ cây trồng"
      description="Quản lý phân bổ và định vị GPS cho cây trồng"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo phân bổ mới
        </Button>
      }
    >
      <DataTable
        columns={plantDistributionColumns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa phân bổ cây trồng này? Tất cả dữ liệu định vị GPS sẽ bị xóa."
      />
    </AdminLayout>
  );
};

export default PlantDistributionListPage;
