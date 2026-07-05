import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { useEnterprisePage } from "./hooks/useEnterprisePage";

export default function EnterprisePage() {
  const {
    filterEnterprises,
    columns,
    filters,
    pageSize,
    currentIndex,
    setCurrentIndex,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    setLocation,
    handleSearch,
    handleFilterChange,
    setPageSize,
    totalPages,
    totalElements,
    loading,
    error,
  } = useEnterprisePage();

  return (
    <AdminLayout
      title="Quản lý doanh nghiệp"
      description="Quản lý thông tin các doanh nghiệp trong hệ thống"
      actions={
        <Link href="/enterprise/create">
          <Button data-testid="add-enterprise">
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      {error ? (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      <DataTable
        columns={columns}
        data={filterEnterprises}
        searchable
        onView={(item) => setLocation(`/enterprise/${item.id}`)}
        onEdit={(item) => setLocation(`/enterprise/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm doanh nghiệp..."
        filters={filters}
        selectable={false}
        loading={loading}
        currentIndex={currentIndex}
        pageSize={pageSize}
        totalPages={totalPages}
        totalElements={totalElements}
        onSearch={handleSearch}
        onIndexChange={setCurrentIndex}
        onPageSize={setPageSize}
        onFilterChange={handleFilterChange}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa doanh nghiệp này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
