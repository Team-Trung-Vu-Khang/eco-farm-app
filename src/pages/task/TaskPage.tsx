import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { TaskCalendarView } from "./components/TaskCalendarView";
import TaskDetailDialog from "./components/TaskDetailDialog";
import { TaskStatsGrid } from "./components/TaskStatsGrid";
import { TaskViewToggle } from "./components/TaskViewToggle";
import { taskColumns } from "./data/columns";
import {
  TASK_ASSIGNED_TYPE_FILTER_OPTIONS,
  TASK_PRIORITY_FILTER_OPTIONS,
  TASK_STATUS_FILTER_OPTIONS,
} from "./data/constants";
import { useTaskPage } from "./hooks/useTaskPage";

export default function TaskPage() {
  const {
    tasks,
    stats,
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    deleteOpen,
    setDeleteOpen,
    detailOpen,
    setDetailOpen,
    selectedTask,
    handleAdd,
    handleEdit,
    handleView,
    handleDelete,
    handleConfirmDelete,
  } = useTaskPage();

  console.log("tasks", tasks);

  return (
    <AdminLayout
      isDev={true}
      title="Phân bổ công việc"
      description="Phân công nhiệm vụ cho nhân viên và đội nhóm"
      actions={
        <div className="flex items-center gap-2">
          <TaskViewToggle value={viewMode} onChange={setViewMode} />
          <Button onClick={handleAdd} data-testid="add-task">
            <Plus className="w-4 h-4 mr-2" />
            Phân bổ công việc
          </Button>
        </div>
      }
    >
      <TaskStatsGrid stats={stats} />

      {viewMode === "list" ? (
        <DataTable
          columns={taskColumns}
          data={tasks}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Tìm kiếm công việc..."
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
              key: "assignedType",
              label: "Loại phân công",
              options: [...TASK_ASSIGNED_TYPE_FILTER_OPTIONS],
            },
          ]}
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

      <TaskDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        task={selectedTask}
      />
    </AdminLayout>
  );
}
