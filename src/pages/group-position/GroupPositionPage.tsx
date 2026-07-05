import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { PositionGroupForm } from "./components/PositionGroupForm";
import { POSITION_GROUP_STATUS_OPTIONS } from "./data/constants";
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
      <Badge
        variant="outline"
        className={
          value === "active"
            ? "rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700"
            : value === "inactive"
              ? "rounded-full border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-600"
              : "rounded-full border-amber-200 bg-amber-50 px-2.5 py-1 font-medium text-amber-700"
        }
      >
        {value === "active"
          ? "Đang sử dụng"
          : value === "inactive"
            ? "Ngừng sử dụng"
            : "Đã lưu trữ"}
      </Badge>
    ),
  },
];

export default function GroupPositionPage() {
  const {
    data,
    loading,
    error,
    response,
    handleSearch,
    handleFilterChange,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
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
    isPending,
  } = useGroupPositionForm();

  return (
    <AdminLayout
      title="Nhóm chức vụ – chức danh"
      description="Quản lý các nhóm phân loại chức vụ và chức danh trong hệ thống"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
      }
    >
      {error ? (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {error}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          searchable
          searchPlaceholder="Tìm kiếm nhóm chức vụ..."
          pageSize={pageSize}
          currentIndex={currentIndex}
          totalElements={response?.totalElements}
          totalPages={response?.totalPages}
          onSearch={handleSearch}
          onPageSize={setPageSize}
          onIndexChange={setCurrentIndex}
          onFilterChange={handleFilterChange}
          filters={[
            {
              key: "status",
              label: "Trạng thái",
              options: POSITION_GROUP_STATUS_OPTIONS,
            },
          ]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      <PositionGroupForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        onSubmit={handleSubmit}
        loading={isPending}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        loading={isPending}
        description="Bạn có chắc chắn muốn xóa nhóm chức vụ này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
}
