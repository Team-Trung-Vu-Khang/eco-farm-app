import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  FormDialog,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { EquipmentGroupForm } from "./components/EquipmentGroupForm";
import { useEquipmentGroupForm } from "./hooks/useEquipmentGroupForm";
import type { EquipmentGroup } from "./types";

const EquipmentGroupPage = () => {
  const {
    data,
    formData,
    setFormData,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
  } = useEquipmentGroupForm();

  const columns: Column<EquipmentGroup>[] = [
    { key: "code", label: "Mã nhóm" },
    { key: "name", label: "Tên nhóm" },
    { key: "description", label: "Mô tả" },
  ];

  return (
    <AdminLayout
      isDev={true}
      title="Danh mục máy móc"
      description="Quản lý danh sách các nhóm máy móc, dụng cụ (Master Data)"
      actions={
        <Button onClick={handleAdd} data-testid="add-equipment-group">
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhóm
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm nhóm máy móc..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa nhóm máy móc" : "Thêm nhóm máy móc mới"}
        onSubmit={handleSubmit}
      >
        <EquipmentGroupForm
          formData={formData}
          onChange={(updates) =>
            setFormData((prev) => ({ ...prev, ...updates }))
          }
        />
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa nhóm máy móc này?"
      />
    </AdminLayout>
  );
};

export default EquipmentGroupPage;
