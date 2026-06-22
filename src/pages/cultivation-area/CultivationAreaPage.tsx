import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useCultivationAreaPage } from "./hooks/useCultivationAreaPage";

const CultivationAreaPage = () => {
  const {
    cultivationAreas,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
  } = useCultivationAreaPage();

  return (
    <AdminLayout
      isRice
      title="Khu vực canh tác"
      description="Quản lý các thiết lập canh tác theo Vùng trồng"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thiết lập mới
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={cultivationAreas}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa khu vực canh tác này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default CultivationAreaPage;
