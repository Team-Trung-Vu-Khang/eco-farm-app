import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useDialogBugWorkaround } from "../../shared/hooks/useDialogBugWorkaround";
import { TerrainFormDialog } from "./components/TerrainFormDialog";
import { terrainColumns } from "./data/columns";
import { useTerrainPage } from "./hooks/useTerrainPage";

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

export default function TerrainPage() {
  const {
    terrains,
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
  } = useTerrainPage();

  useDialogBugWorkaround([formOpen, deleteOpen]);

  return (
    <PageWrapper
      title="Quản lý địa hình"
      description="Phân loại và quản lý các loại địa hình trong hệ thống"
      actions={
        <Button onClick={handleAdd} data-testid="add-terrain">
          <Plus className="w-4 h-4 mr-2" />
          Thêm địa hình
        </Button>
      }
    >
      <DataTable
        loading={loading}
        columns={terrainColumns}
        data={terrains}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm địa hình..."
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

      <TerrainFormDialog
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
        description="Bạn có chắc chắn muốn xóa địa hình này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
        loading={isPending}
      />
    </PageWrapper>
  );
}
