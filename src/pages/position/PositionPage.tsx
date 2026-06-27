import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PositionFormDialog } from "./components/PositionFormDialog";
import { positionColumns } from "./data/columns";
import { usePositionPage } from "./hooks/usePositionPage";

const POSITION_FILTER_STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "archived", label: "Đã lưu trữ" },
];

const PositionPage = () => {
  const {
    positions,
    groupOptions,
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
  } = usePositionPage();

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý chức vụ"
      description="Quản lý chức vụ theo nhóm chức vụ"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm chức vụ
        </Button>
      }
    >
      {error ? (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {error}
        </div>
      ) : null}

      <DataTable
        columns={positionColumns}
        data={positions}
        searchable
        searchPlaceholder="Tìm kiếm chức vụ..."
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
            options: POSITION_FILTER_STATUS_OPTIONS,
          },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <PositionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        groupOptions={groupOptions}
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
