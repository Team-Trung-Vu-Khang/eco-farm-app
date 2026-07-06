import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { seedColumns } from "./data/columns";
import { useSeedPage } from "./hooks/useSeedPage";

export default function SeedPage() {
  const {
    deleteOpen,
    handleAdd,
    handleConfirmDelete,
    handleDelete,
    handleEdit,
    handleView,
    seeds,
    setDeleteOpen,
    tableFilters,
    loading,
    pageCount,
    totalElements,
    page,
    size,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleFilterChange,
  } = useSeedPage();

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý hạt giống cây"
      actions={
        <div className="flex gap-2">
          <Button
            className="bg-green-600 text-white shadow-sm transition-all hover:bg-green-700 active:scale-95"
            onClick={handleAdd}
          >
            Thêm mới
          </Button>
        </div>
      }
    >
      <DataTable
        columns={seedColumns}
        data={seeds}
        selectable={false}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm giống cây..."
        filters={tableFilters}
        loading={loading}
        totalPages={pageCount}
        totalElements={totalElements}
        currentIndex={page}
        pageSize={size}
        onSearch={handleSearch}
        onIndexChange={handlePageChange}
        onPageSize={handlePageSizeChange}
        onFilterChange={handleFilterChange}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa giống cây này?"
      />
    </AdminLayout>
  );
}
