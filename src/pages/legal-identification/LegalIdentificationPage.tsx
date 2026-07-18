import { AdminLayout, Button, DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { LegalIdentificationTable } from "./components/LegalIdentificationTable";
import { useLegalIdentificationPage } from "./hooks/useLegalIdentificationPage";

export default function LegalIdentificationPage() {
  const {
    records,
    loading,
    error,
    response,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    handleSearch,
    handleFilterChange,
    filters,
    handleAdd,
    handleView,
    handleEdit,
    handleDelete,
    deleteOpen,
    setDeleteOpen,
    handleConfirmDelete,
    isDeleting,
  } = useLegalIdentificationPage();

  return (
    <AdminLayout
      isDev={true}
      title="Định danh pháp lý"
      description="Danh sách hồ sơ pháp lý cho vùng trồng, khu vực và giấy tờ đính kèm."
      actions={
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo hồ sơ mới
        </Button>
      }
    >
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {error}
        </div>
      ) : (
        <LegalIdentificationTable
          data={records}
          searchable
          searchPlaceholder="Tìm kiếm hồ sơ, vùng trồng, khu vực, lô đất..."
          onSearch={handleSearch}
          filters={filters}
          onFilterChange={handleFilterChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          pageSize={pageSize}
          currentIndex={currentIndex}
          totalElements={response?.totalElements}
          totalPages={response?.totalPages}
          onPageSize={setPageSize}
          onIndexChange={setCurrentIndex}
        />
      )}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Xóa hồ sơ pháp lý"
        description="Bạn có chắc chắn muốn xóa hồ sơ pháp lý này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
}
