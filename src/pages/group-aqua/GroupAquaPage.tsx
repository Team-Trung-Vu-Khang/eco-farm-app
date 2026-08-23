import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useDialogBugWorkaround } from "../../shared/hooks/useDialogBugWorkaround";
import { GroupAquaFormDialog } from "./components/GroupAquaFormDialog";
import { groupAquaColumns } from "./data/columns";
import { useGroupAquaPage } from "./hooks/useGroupAquaPage";

export default function GroupAquaPage() {
  const {
    groupAquas,
    loading,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    formData,
    handleAdd,
    handleEdit,
    handleDelete,
    filters,
    handleFilterChange,
    handleSubmit,
    handleConfirmDelete,
    isPending,
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
  } = useGroupAquaPage();

  useDialogBugWorkaround([formOpen, deleteOpen]);

  return (
    <PageWrapper
      title="Quản lý nhóm thủy sản"
      description="Danh mục các nhóm thủy sản có trên thị trường"
      actions={
        <Button
          className="shadow-sm hover:shadow-md transition-all active:scale-95 bg-green-600 hover:bg-green-700"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
      }
    >
      <DataTable
        data={groupAquas}
        columns={groupAquaColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm mã, tên nhóm thủy sản..."
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
        loading={loading}
      />

      <GroupAquaFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isEdit={!!editItem}
        initialData={formData}
        onSubmit={handleSubmit}
        isPending={isPending}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa nhóm thủy sản này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </PageWrapper>
  );
}
