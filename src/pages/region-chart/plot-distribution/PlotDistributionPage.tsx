import { Plus } from "lucide-react";
import { AdminLayout, Button, DataTable, DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { usePlotDistributionPage } from "../hooks/usePlotDistributionPage";

const PlotDistributionPage = () => {
  const {
    plots,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    confirmDelete,
  } = usePlotDistributionPage();

  return (
    <AdminLayout
      title="Phân bố lô"
      description="Quản lý danh sách và bản đồ phân bố các lô trồng"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm lô
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={plots}
        onEdit={(item) => handleEdit(item.id)}
        onDelete={(item) => handleDelete(item.id)}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        description="Bạn có chắc chắn muốn xóa lô này?"
      />
    </AdminLayout>
  );
};
export default PlotDistributionPage;
