import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useDepartment } from "./hooks/useDepartment";
import { DEPARTMENT_COLUMNS } from "./constants/departmentConstants";
import { DepartmentFormDialog } from "./components/DepartmentFormDialog";

const DepartmentPage = () => {
  const {
    departments,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
  } = useDepartment();

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý phòng ban"
      description="Quản lý phòng ban theo đơn vị sở hữu"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm phòng ban
        </Button>
      }
    >
      <DataTable
        columns={DEPARTMENT_COLUMNS}
        data={departments}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm phòng ban..."
      />

      <DepartmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isEdit={!!editItem}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa phòng ban này?"
      />
    </AdminLayout>
  );
};

export default DepartmentPage;
