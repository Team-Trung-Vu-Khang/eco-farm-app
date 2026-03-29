import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useCultivationRegionPage } from "./hooks/useCultivationRegionPage";

const CultivationRegionPage = () => {
  const {
    areas,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
  } = useCultivationRegionPage();

  return (
    <AdminLayout
      title="Vùng canh tác"
      description="Quản lý các thiết lập canh tác cho Vùng, Khu vực hoặc Lô"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thiết lập mới
        </Button>
      }
    >
      <DataTable columns={columns} data={areas} onEdit={handleEdit} onDelete={handleDelete} />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa vùng canh tác này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default CultivationRegionPage;
