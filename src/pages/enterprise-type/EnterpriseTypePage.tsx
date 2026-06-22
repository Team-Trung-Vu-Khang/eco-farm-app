import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  FormDialog,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { EnterpriseGroupForm } from "./components/EnterpriseGroupForm";
import { useEnterpriseGroupForm } from "./hooks/useEnterpriseGroupForm";
import type { EnterpriseGroup } from "./types";

const EnterpriseTypePage = () => {
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
  } = useEnterpriseGroupForm();

  const columns: Column<EnterpriseGroup>[] = [
    { key: "code", label: "Mã nhóm", sortable: true },
    { key: "name", label: "Tên nhóm tổ chức", sortable: true },
    { key: "description", label: "Mô tả" },
    {
      key: "status",
      label: "Trạng thái",
      render: (row: EnterpriseGroup) => (
        <Badge variant={row.status === "active" ? "default" : "secondary"}>
          {row.status === "active" ? "Đang sử dụng" : "Ngưng sử dụng"}
        </Badge>
      ),
    },
  ];

  return (
    <AdminLayout
      isRice
      title="Nhóm tổ chức"
      description="Quản lý các nhóm đối tượng tổ chức/doanh nghiệp"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm nhóm tổ chức..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa nhóm tổ chức" : "Thêm nhóm tổ chức mới"}
        onSubmit={handleSubmit}
      >
        <EnterpriseGroupForm
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
        description="Bạn có chắc chắn muốn xóa nhóm tổ chức này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default EnterpriseTypePage;
