import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PlanTypeFormDialog } from "./components/PlanTypeFormDialog";
import { planTypeColumns } from "./data/columns";
import { usePlanTypePage } from "./hooks/usePlanTypePage";

const PlanTypePage = () => {
  const {
    planTypes,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    deleteItem,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
  } = usePlanTypePage();

  return (
    <AdminLayout
      title="Loại Kế Hoạch"
      description="Quản lý các loại hình kế hoạch sản xuất, kinh doanh trong nông trại"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm loại kế hoạch
        </Button>
      }
    >
      <DataTable
        columns={planTypeColumns}
        data={planTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm loại kế hoạch..."
      />

      <PlanTypeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isEdit={Boolean(editItem)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa loại kế hoạch"
        description={`Bạn có chắc chắn muốn xóa loại kế hoạch "${deleteItem?.name}"? Hành động này không thể hoàn tác.`}
      />
    </AdminLayout>
  );
};

export default PlanTypePage;
