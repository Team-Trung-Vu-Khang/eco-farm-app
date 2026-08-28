import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useDialogBugWorkaround } from "../../shared/hooks/useDialogBugWorkaround";
import LandFormDialog from "./components/LandFormDialog";
import { landColumns } from "./data/land.constants";
import { useLandPage } from "./hooks/useLandPage";

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

export default function LandPage() {
  const {
    data,
    loading,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    formData,
    isSubmitting,
    handleAdd,
    handleEdit,
    handleDelete,
    handleFileSelect,
    handleSubmit,
    handleConfirmDelete,
    response,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    handleSearch,
    handleFilterChange,
  } = useLandPage();

  useDialogBugWorkaround([formOpen, deleteOpen]);

  return (
    <PageWrapper
      title="Quản lý đất"
      description="Phân loại và quản lý các loại đất canh tác"
      actions={
        <Button onClick={handleAdd} data-testid="add-land">
          <Plus className="w-4 h-4 mr-2" />
          Thêm loại đất
        </Button>
      }
    >
      <DataTable
        columns={landColumns}
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm loại đất..."
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

      <LandFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isEdit={!!editItem}
        initialData={formData}
        onFileSelect={handleFileSelect}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa loại đất này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
        loading={isSubmitting}
      />
    </PageWrapper>
  );
}
