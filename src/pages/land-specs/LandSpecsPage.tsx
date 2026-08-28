import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useDialogBugWorkaround } from "../../shared/hooks/useDialogBugWorkaround";
import { LandSpecsFormDialog } from "./components/LandSpecsFormDialog";
import { landSpecsColumns } from "./data/columns";
import { useLandSpecsPage } from "./hooks/useLandSpecsPage";

const filters = [
  {
    key: "status",
    label: "Trạng thái",
    options: [
      { label: "Hoạt động", value: "active" },
      { label: "Ngừng hoạt động", value: "inactive" },
      { label: "Đã lưu trữ", value: "archived" },
    ],
  },
];

export default function LandSpecsPage() {
  const {
    landSpecs,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    formData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    loading,
    isPending,
    response,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    handleSearch,
    handleFilterChange,
  } = useLandSpecsPage();

  useDialogBugWorkaround([formOpen, deleteOpen]);

  return (
    <PageWrapper
      title="Quản lý thông số địa hình"
      description="Quản lý các loại thông số địa hình trong hệ thống"
      actions={
        <Button onClick={handleAdd} data-testid="add-land-spec">
          <Plus className="w-4 h-4 mr-2" />
          Thêm thông số
        </Button>
      }
    >
      <DataTable
        loading={loading}
        columns={landSpecsColumns}
        data={landSpecs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm thông số địa hình..."
        searchable
        onSearch={handleSearch}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response?.totalElements}
        totalPages={response?.totalPages}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <LandSpecsFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isEdit={!!editItem}
        initialData={formData}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa thông số địa hình này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
        loading={isPending}
      />
    </PageWrapper>
  );
}
