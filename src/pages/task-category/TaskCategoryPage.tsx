import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useDialogBugWorkaround } from "../../shared/hooks/useDialogBugWorkaround";
import { TaskCategoryFormDialog } from "./components/TaskCategoryFormDialog";
import { taskCategoryColumns } from "./data/columns";
import {
  taskCategoryDomainLabel,
  taskCategoryDomainOptions,
} from "./data/constants";
import { useTaskCategoryPage } from "./hooks/useTaskCategoryPage";
import type { TaskCategoryDomain } from "./types/types";

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
    response,
    stages,
    activeDomain,
    setActiveDomain,
    handleSearch,
    handleFilterChange,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    error,
  } = useTaskCategoryPage();

  useDialogBugWorkaround([formOpen, deleteOpen]);

  return (
    <PageWrapper
      title="Danh mục công việc"
      description="Thông tin công việc gọi ý từ hệ thống"
      actions={
        <Button
          onClick={() => handleAdd(activeDomain)}
          data-testid="add-task-category"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm công việc
        </Button>
      }
    >
      <Tabs
        value={activeDomain}
        onValueChange={(value) => setActiveDomain(value as TaskCategoryDomain)}
        className="space-y-4"
      >
        {/* <TabsList className="grid w-full grid-cols-3">
          {taskCategoryDomainOptions.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {taskCategoryDomainLabel[option.value]}
            </TabsTrigger>
          ))}
        </TabsList> */}

        {taskCategoryDomainOptions.map((option) => (
          <TabsContent
            key={option.value}
            value={option.value}
            className="space-y-3"
          >
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : (
              <DataTable
                loading={loading}
                columns={taskCategoryColumns}
                data={taskCategories}
                searchable
                searchPlaceholder={`Tìm kiếm công việc ${taskCategoryDomainLabel[option.value].toLowerCase()}...`}
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                filters={[
                  {
                    key: "stage",
                    label: "Giai đoạn",
                    options: [
                      ...stages.map((item) => ({ value: item, label: item })),
                    ],
                  },
                  {
                    key: "status",
                    label: "Trạng thái",
                    options: [
                      { value: "active", label: "Hoạt động" },
                      { value: "inactive", label: "Không hoạt động" },
                      { value: "archived", label: "Đã lưu trữ" },
                    ],
                  },
                ]}
                pageSize={pageSize}
                currentIndex={currentIndex}
                totalElements={response?.totalElements}
                totalPages={response?.totalPages}
                onPageSize={setPageSize}
                onIndexChange={setCurrentIndex}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>

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
