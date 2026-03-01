import { useState } from "react";
import { useLocation } from "wouter";
import {
  Plus,
  Calendar as CalendarIcon,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  List,
  LayoutGrid,
} from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";

import useTaskStore, { type Task } from "../../stores/useTaskStore";
import TaskDetailDialog from "./components/TaskDetailDialog";

const CalendarView = ({
  data,
  currentDate,
  onDateChange,
  onEdit,
  onView,
}: {
  data: Task[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEdit: (task: Task) => void;
  onView: (task: Task) => void;
}) => {
  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const getTasksForDay = (date: Date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return data.filter(
      (task) => task.startDate <= dateStr && task.endDate >= dateStr,
    );
  };

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold capitalize">
          Tháng {month + 1}/{year}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDateChange(new Date(year, month - 1, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDateChange(new Date(year, month + 1, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b bg-muted/50">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium border-r last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 auto-rows-fr">
        {days.map((date, idx) => (
          <div
            key={idx}
            className={`min-h-[120px] p-2 border-r border-b last:border-r-0 relative hover:bg-muted/30 transition-colors ${
              !date ? "bg-muted/10" : ""
            }`}
          >
            {date && (
              <>
                <div
                  className={`text-sm font-medium mb-2 ${
                    date.toISOString().split("T")[0] ===
                    new Date().toISOString().split("T")[0]
                      ? "bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center"
                      : "text-muted-foreground"
                  }`}
                >
                  {date.getDate()}
                </div>
                <div className="space-y-1.5 overflow-hidden">
                  {getTasksForDay(date).map((task) => (
                    <div
                      key={task.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(task);
                      }}
                      className={`text-xs p-1.5 rounded cursor-pointer truncate border group flex items-center justify-between transition-all hover:ring-1 hover:ring-primary/20 hover:shadow-sm ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : task.status === "in-progress"
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : task.status === "overdue"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                      title={task.name}
                    >
                      <span className="truncate flex-1">{task.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(task);
                        }}
                        className="opacity-0 group-hover:opacity-100 ml-1 p-0.5 hover:bg-black/5 rounded transition-opacity"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function TaskPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const tasks = useTaskStore((state) => state.tasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const columns: Column<Task>[] = [
    { key: "code", label: "Mã" },
    { key: "name", label: "Tên công việc" },
    { key: "plan", label: "Kế hoạch" },
    { key: "stage", label: "Giai đoạn" },
    {
      key: "assignedTo",
      label: "Phân công",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row.assignedType === "team" ? (
            <Users className="w-4 h-4 text-blue-500" />
          ) : (
            <Users className="w-4 h-4 text-green-500" />
          )}
          <span>{Array.isArray(value) ? value.join(", ") : value}</span>
        </div>
      ),
    },
    {
      key: "priority",
      label: "Ưu tiên",
      render: (value) => (
        <Badge
          variant={
            value === "high"
              ? "destructive"
              : value === "medium"
                ? "default"
                : "outline"
          }
        >
          {value === "high"
            ? "Cao"
            : value === "medium"
              ? "Trung bình"
              : "Thấp"}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge
          variant={
            value === "completed"
              ? "secondary"
              : value === "in-progress"
                ? "default"
                : value === "overdue"
                  ? "destructive"
                  : "outline"
          }
        >
          {value === "completed"
            ? "Hoàn thành"
            : value === "in-progress"
              ? "Đang thực hiện"
              : value === "overdue"
                ? "Quá hạn"
                : "Chờ thực hiện"}
        </Badge>
      ),
    },
    { key: "startDate", label: "Bắt đầu" },
    { key: "endDate", label: "Kết thúc" },
  ];

  const handleAdd = () => {
    setLocation("/task/create");
  };

  const handleEdit = (item: Task) => {
    setLocation(`/task/${item.id}/edit`);
  };

  const handleDelete = (item: Task) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteTask(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa công việc" });
    }
    setDeleteOpen(false);
  };

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "in-progress",
  ).length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const overdueCount = tasks.filter((t) => t.status === "overdue").length;

  return (
    <AdminLayout
      title="Phân bổ công việc"
      description="Phân công nhiệm vụ cho nhân viên và đội nhóm"
      actions={
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-muted rounded-lg">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8"
            >
              <List className="w-4 h-4 mr-2" />
              Danh sách
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="h-8"
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Lịch
            </Button>
          </div>
          <Button onClick={handleAdd} data-testid="add-task">
            <Plus className="w-4 h-4 mr-2" />
            Phân bổ công việc
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Chờ thực hiện</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">
                {inProgressCount}
              </p>
              <p className="text-sm text-muted-foreground">Đang thực hiện</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">
                {completedCount}
              </p>
              <p className="text-sm text-muted-foreground">Hoàn thành</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-100 text-red-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{overdueCount}</p>
              <p className="text-sm text-muted-foreground">Quá hạn</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {viewMode === "list" ? (
        <DataTable
          columns={columns}
          data={tasks}
          onView={(item) => {
            setSelectedTask(item);
            setDetailOpen(true);
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Tìm kiếm công việc..."
          filters={[
            {
              key: "status",
              label: "Trạng thái",
              options: [
                { label: "Chờ thực hiện", value: "pending" },
                { label: "Đang thực hiện", value: "in-progress" },
                { label: "Hoàn thành", value: "completed" },
                { label: "Quá hạn", value: "overdue" },
              ],
            },
            {
              key: "priority",
              label: "Độ ưu tiên",
              options: [
                { label: "Cao", value: "high" },
                { label: "Trung bình", value: "medium" },
                { label: "Thấp", value: "low" },
              ],
            },
            {
              key: "assignedType",
              label: "Loại phân công",
              options: [
                { label: "Cá nhân", value: "individual" },
                { label: "Đội nhóm", value: "team" },
              ],
            },
          ]}
        />
      ) : (
        <CalendarView
          data={tasks}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onEdit={handleEdit}
          onView={(item) => {
            setSelectedTask(item);
            setDetailOpen(true);
          }}
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
