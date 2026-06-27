import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { EnterpriseGroupForm } from "./components/EnterpriseGroupForm";
import { useEnterpriseGroupForm } from "./hooks/useEnterpriseGroupForm";
import type { VsicIndustry } from "./types";

const VSIC_STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "archived", label: "Đã lưu trữ" },
];

const VSIC_LEVEL_OPTIONS = [
  { value: "1", label: "Cấp 1" },
  { value: "2", label: "Cấp 2" },
  { value: "3", label: "Cấp 3" },
  { value: "4", label: "Cấp 4" },
  { value: "5", label: "Cấp 5" },
];

const columns: Column<VsicIndustry>[] = [
  { key: "code", label: "Mã ngành", sortable: true },
  { key: "name", label: "Tên ngành", sortable: true },
  { key: "level", label: "Cấp" },
  { key: "parentCode", label: "Mã ngành cha" },
  { key: "parentName", label: "Tên ngành cha" },
  {
    key: "status",
    label: "Trạng thái",
    render: (_value: unknown, row: VsicIndustry) => (
      <Badge variant={row.status === "active" ? "default" : "secondary"}>
        {row.status === "active"
          ? "Hoạt động"
          : row.status === "inactive"
            ? "Ngừng hoạt động"
            : "Lưu trữ"}
      </Badge>
    ),
  },
];

const EnterpriseTypePage = () => {
  const {
    data,
    loading,
    error,
    response,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSearch,
    handleFilterChange,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    handleSubmit,
    handleConfirmDelete,
  } = useEnterpriseGroupForm();

  return (
    <AdminLayout
      isDev={true}
      title="Thông tin ngành nghề"
      description="Quản lý danh mục ngành nghề VSIC"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
      }
    >
      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {error}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          searchable
          searchPlaceholder="Tìm kiếm ngành nghề..."
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
              options: VSIC_STATUS_OPTIONS,
            },
            {
              key: "level",
              label: "Cấp ngành",
              options: VSIC_LEVEL_OPTIONS,
            },
          ]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      <EnterpriseGroupForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa ngành nghề này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default EnterpriseTypePage;
