import PageWrapper from "@/components/PageWrapper";
import { AppLoadingState } from "@/components/AppLoadingState";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Plus } from "lucide-react";
import { TaskCalendarView } from "./components/TaskCalendarView";
import { TaskPlanContextCard } from "./components/TaskPlanContextCard";
import { TaskStatsGrid } from "./components/TaskStatsGrid";
import { TaskViewToggle } from "./components/TaskViewToggle";
import { taskColumns } from "./data/columns";
import {
  TASK_ORIGIN_FILTER_OPTIONS,
  TASK_PRIORITY_FILTER_OPTIONS,
  TASK_STATUS_FILTER_OPTIONS,
} from "./data/constants";
import { useTaskPage } from "./hooks/useTaskPage";

export default function TaskPage() {
  const {
    tasks,
    tasksLoading,
    response,
    stats,
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    deleteOpen,
    setDeleteOpen,
    plan,
    isPlanScoped,
    planNotFound,
    clearPlanScope,
    handleSearchChange,
    handleFilterChange,
    currentIndex,
    setCurrentIndex,
    pageSize,
    setPageSize,
    handleAdd,
    handleEdit,
    handleView,
    handleDelete,
    handleConfirmDelete,
  } = useTaskPage();

  if (tasksLoading && tasks.length === 0) {
    return <AppLoadingState />;
  }

  return (
    <PageWrapper
      title={isPlanScoped ? "Danh sách công việc" : "Phân bổ công việc"}
      description={
        isPlanScoped
          ? `Công việc thuộc kế hoạch ${plan?.name || "không xác định"}`
          : "Phân công nhiệm vụ cho nhân viên và đội nhóm"
      }
      actions={
        <div className="flex items-center gap-2">
          {isPlanScoped && (
            <Button variant="outline" onClick={clearPlanScope}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tất cả công việc
            </Button>
          )}
          <TaskViewToggle
            value={viewMode}
            onChange={(mode) => {
              setCurrentIndex(1);
              setViewMode(mode);
            }}
          />
          <Button onClick={handleAdd} data-testid="add-task">
            <Plus className="w-4 h-4 mr-2" />
            Phân bổ công việc
          </Button>
        </div>
      }
    >
      {plan && (
        <TaskPlanContextCard
          plan={plan}
          taskCount={response?.totalElements ?? tasks.length}
        />
      )}

      {planNotFound && (
        <div className="mb-4 p-4 rounded-lg border border-amber-200 bg-amber-50 text-sm text-amber-800">
          Không tìm thấy kế hoạch tương ứng. Đang hiển thị danh sách rỗng —
          <button
            type="button"
            onClick={clearPlanScope}
            className="ml-1 font-bold underline underline-offset-2"
          >
            xem tất cả công việc
          </button>
          .
        </div>
      )}

      <TaskStatsGrid stats={stats} />

      {viewMode === "list" ? (
        <DataTable
          columns={taskColumns}
          data={tasks}
          searchable
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Tìm kiếm công việc..."
          onSearch={handleSearchChange}
          filters={[
            {
              key: "status",
              label: "Trạng thái",
              options: [...TASK_STATUS_FILTER_OPTIONS],
            },
            {
              key: "priority",
              label: "Độ ưu tiên",
              options: [...TASK_PRIORITY_FILTER_OPTIONS],
            },
            {
              key: "origin",
              label: "Nguồn gốc",
              options: [...TASK_ORIGIN_FILTER_OPTIONS],
            },
          ]}
          onFilterChange={handleFilterChange}
          onPageSize={setPageSize}
          onIndexChange={setCurrentIndex}
          pageSize={pageSize}
          currentIndex={currentIndex}
          totalElements={response?.totalElements}
          totalPages={response?.totalPages}
          loading={tasksLoading}
          selectable={false}
        />
      ) : (
        <TaskCalendarView
          data={tasks}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onEdit={handleEdit}
          onView={handleView}
        />
      )}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </PageWrapper>
  );
}
