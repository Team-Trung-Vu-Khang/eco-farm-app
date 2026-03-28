import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useCultivationPlotPage } from "./hooks/useCultivationPlotPage";

const CultivationPlotPage = () => {
  const {
    cultivationPlots,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
  } = useCultivationPlotPage();

  return (
    <AdminLayout
      title="Lô canh tác"
      description="Quản lý các thiết lập canh tác theo Khu vực (Lô)"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thiết lập mới
        </Button>
      }
    >
      <DataTable columns={columns} data={cultivationPlots} onEdit={handleEdit} onDelete={handleDelete} />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa lô này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default CultivationPlotPage;
