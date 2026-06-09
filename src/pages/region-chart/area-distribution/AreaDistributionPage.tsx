import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useAreaDistributionPage } from "../hooks/useAreaDistributionPage";

const AreaDistributionPage = () => {
  const {
    areas,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    confirmDelete,
  } = useAreaDistributionPage();

  return (
    <AdminLayout
      isDev={true}
      title="Phân bố khu vực"
      description="Quản lý danh sách và bản đồ phân bố các khu vực trồng"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm khu vực
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={areas}
        onEdit={(item) => handleEdit(item.id)}
        onDelete={(item) => handleDelete(item.id)}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        description="Bạn có chắc chắn muốn xóa khu vực này?"
      />
    </AdminLayout>
  );
};
export default AreaDistributionPage;
