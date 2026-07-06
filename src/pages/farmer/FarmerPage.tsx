import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { useFarmerPage } from "./hooks/useFarmerPage";

export default function FarmerPage() {
  const {
    farmerData,
    columns,
    filters,
    pageSize,
    currentIndex,
    setCurrentIndex,
    totalPages,
    totalElements,
    loading,
    error,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleView,
    handleEdit,
    handleSearch,
    handleFilterChange,
    setPageSize,
  } = useFarmerPage();

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý nông hộ"
      description="Quản lý thông tin các nông hộ trong hệ thống"
      actions={
        <Link href="/farmer/create">
          <Button data-testid="add-farmer">
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      {error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      ) : null}

      <DataTable
        columns={columns}
        data={farmerData}
        searchable
        searchPlaceholder="Tìm kiếm nông hộ..."
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
        loading={loading}
        currentIndex={currentIndex}
        pageSize={pageSize}
        totalPages={totalPages}
        totalElements={totalElements}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
        selectable={false}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa nông hộ này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
