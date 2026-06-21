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
import { PositionGroupForm } from "./components/PositionGroupForm";
import { useGroupPositionForm } from "./hooks/useGroupPositionForm";
import type { PositionGroup } from "./types";

const columns: Column<PositionGroup>[] = [
  {
    key: "code",
    label: "Mã nhóm",
    sortable: true,
    render: (value) => (
      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
        {value as string}
      </span>
    ),
  },
  { key: "name", label: "Tên nhóm chức vụ", sortable: true },
  {
    key: "description",
    label: "Mô tả",
    render: (value) => (
      <span className="text-sm text-slate-600 line-clamp-2">
        {(value as string) || "—"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value === "active" ? "Đang sử dụng" : "Ngừng sử dụng"}
      </Badge>
    ),
  },
];

export default function GroupPositionPage() {
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
  } = useGroupPositionForm();

  return (
    <AdminLayout
      isDev={true}
      title="Nhóm chức vụ – chức danh"
      description="Quản lý các nhóm phân loại chức vụ và chức danh trong hệ thống"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhóm mới
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm nhóm chức vụ..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa nhóm chức vụ" : "Thêm nhóm chức vụ mới"}
        onSubmit={handleSubmit}
      >
        <PositionGroupForm
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
        description="Bạn có chắc chắn muốn xóa nhóm chức vụ này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
}
