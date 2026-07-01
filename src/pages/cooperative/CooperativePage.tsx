import { Link, useLocation } from "wouter";
import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCooperative } from "./hooks/useCooperative";
import { CooperativeTable } from "./components/CooperativeTable";

export default function CooperativePage() {
  const [, setLocation] = useLocation();
  const {
    data,
    columns,
    filters,
    pageSize,
    currentIndex,
    setCurrentIndex,
    setPageSize,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleSearch,
    handleFilterChange,
    totalPages,
    totalElements,
    loading,
    error,
  } =
    useCooperative();

  const headerActions = (
    <Link href="/cooperative/create">
      <Button data-testid="add-cooperative">
        <Plus className="w-4 h-4 mr-2" />
        Thêm mới
      </Button>
    </Link>
  );

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý hợp tác xã"
      description="Quản lý thông tin các hợp tác xã trong hệ thống"
      actions={headerActions}
    >
      {error ? (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      ) : null}

      <CooperativeTable
        columns={columns}
        data={data}
        filters={filters}
        loading={loading}
        searchPlaceholder="Tìm kiếm hợp tác xã..."
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalPages={totalPages}
        totalElements={totalElements}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
        onView={(item) => setLocation(`/cooperative/${item.id}`)}
        onEdit={(item) => setLocation(`/cooperative/${item.id}/edit`)}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa hợp tác xã này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
