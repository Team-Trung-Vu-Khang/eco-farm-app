import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useDialogBugWorkaround } from "../../shared/hooks/useDialogBugWorkaround";
import { TaskCategoryFormDialog } from "./components/TaskCategoryFormDialog";
import { taskCategoryColumns } from "./data/columns";
import { useTaskCategoryPage } from "./hooks/useTaskCategoryPage";

export default function TaskCategoryPage() {
  const {
    taskCategories,
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
  } = useTaskCategoryPage();

  useDialogBugWorkaround([formOpen, deleteOpen]);

  return (
    <PageWrapper
      title="Quản lý công việc"
      description="Quản lý các loại công việc trong hệ thống"
      actions={
        <Button onClick={handleAdd} data-testid="add-task-category">
          <Plus className="w-4 h-4 mr-2" />
          Thêm công việc
        </Button>
      }
    >
      <DataTable
        loading={loading}
        columns={taskCategoryColumns}
        data={taskCategories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm công việc..."
      />

      <TaskCategoryFormDialog
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
        description="Bạn có chắc chắn muốn xóa công việc này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
        loading={isPending}
      />
    </PageWrapper>
  );
}
