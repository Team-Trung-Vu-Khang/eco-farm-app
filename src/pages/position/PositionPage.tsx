import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PositionFormDialog } from "./components/PositionFormDialog";
import { positionColumns } from "./data/columns";
import { POSITION_GROUPS, POSITION_STATUS_OPTIONS } from "./data/constants";
import { usePositionPage } from "./hooks/usePositionPage";

const PositionPage = () => {
  const {
    positions,
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
  } = usePositionPage();

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý chức vụ"
      description="Quản lý chức vụ theo đơn vị sở hữu"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm chức vụ
        </Button>
      }
    >
      <DataTable
        columns={positionColumns}
        data={positions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm chức vụ..."
        filters={[
          {
            key: "group",
            label: "Nhóm chức vụ",
            options: POSITION_GROUPS.map((group) => ({
              label: group,
              value: group,
            })),
          },
          {
            key: "status",
            label: "Trạng thái",
            options: [...POSITION_STATUS_OPTIONS],
          },
        ]}
      />

      <PositionFormDialog
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
        description="Bạn có chắc chắn muốn xóa chức vụ này?"
      />
    </AdminLayout>
  );
};

export default PositionPage;
