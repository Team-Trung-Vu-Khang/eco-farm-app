import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useDialogBugWorkaround } from "../../shared/hooks/useDialogBugWorkaround";
import { GroupLivestockFormDialog } from "./components/GroupLivestockFormDialog";
import { groupLivestockColumns } from "./data/columns";
import { useGroupLivestockPage } from "./hooks/useGroupLivestockPage";

export default function GroupLivestockPage() {
  const {
    groupLivestocks,
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
  } = useGroupLivestockPage();

  useDialogBugWorkaround([formOpen, deleteOpen]);

  return (
    <PageWrapper
      title="Quản lý nhóm vật nuôi"
      description="Danh mục các nhóm vật nuôi có trên thị trường"
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
        data={groupLivestocks}
        columns={groupLivestockColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm mã, tên nhóm vật nuôi..."
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

      <GroupLivestockFormDialog
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
        description="Bạn có chắc chắn muốn xóa nhóm vật nuôi này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </PageWrapper>
  );
}
