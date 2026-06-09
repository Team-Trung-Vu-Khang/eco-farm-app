import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useRegionDistributionPage } from "../hooks/useRegionDistributionPage";

const RegionDistributionPage = () => {
  const {
    regions,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    confirmDelete,
  } = useRegionDistributionPage();

  return (
    <AdminLayout
      isDev={true}
      title="Phân bố vùng"
      description="Quản lý danh sách và bản đồ phân bố vùng trồng"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm vùng trồng
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={regions}
        onEdit={(item) => handleEdit(item.id)}
        onDelete={(item) => handleDelete(item.id)}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        description="Bạn có chắc chắn muốn xóa vùng trồng này?"
      />
    </AdminLayout>
  );
};

export default RegionDistributionPage;
