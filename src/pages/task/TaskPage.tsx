import { useState } from "react";
import {
  Plus,
  Calendar,
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
  FormDialog,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";
import useTaskStore, { type Task } from "../../stores/useTaskStore";

// Mock data cho kế hoạch
const mockPlans = [
  {
    id: 1,
    name: "Kế hoạch sầu riêng vụ Xuân 2026",
    code: "KH26-SR01",
    stages: [
      "Chuẩn bị đất",
      "Xử lý ra hoa",
      "Thụ phấn",
      "Tuyển trái L1",
      "Tuyển trái L2",
      "Bón phân nuôi trái",
      "Phòng trừ sâu bệnh",
      "Thu hoạch",
    ],
  },
  {
    id: 2,
    name: "Kế hoạch xoài Cát Chu 2026",
    code: "KH26-XO01",
    stages: [
      "Tỉa cành tạo tán",
      "Kích thích ra hoa",
      "Bao trái",
      "Bón phân",
      "Thu hoạch",
      "Xử lý sau thu hoạch",
    ],
  },
  {
    id: 3,
    name: "Kế hoạch bưởi Da Xanh 2026",
    code: "KH26-BU01",
    stages: [
      "Tỉa cành",
      "Bón phân phục hồi",
      "Xử lý ra hoa",
      "Chăm sóc trái non",
      "Phòng trừ nhện đỏ",
      "Thu hoạch",
    ],
  },
];

// Mock data cho nhân viên
const mockPersonnel = [
  { id: 1, name: "Nguyễn Văn Hùng", code: "NV001" },
  { id: 2, name: "Trần Thị Mai", code: "NV002" },
  { id: 3, name: "Lê Văn Tám", code: "NV003" },
  { id: 4, name: "Phạm Quốc Bảo", code: "NV004" },
  { id: 5, name: "Hoàng Thị Lan", code: "NV005" },
];

// Mock data cho đội nhóm
const mockTeams = [
  { id: 1, name: "Đội Kỹ thuật & BVTV", code: "TEAM-KT" },
  { id: 2, name: "Đội Canh tác & Chăm sóc", code: "TEAM-CT" },
  { id: 3, name: "Đội Thu hoạch & Vận chuyển", code: "TEAM-TH" },
  { id: 4, name: "Đội Cơ giới hóa", code: "TEAM-CG" },
];

const CalendarView = ({
  data,
  currentDate,
  onDateChange,
  onEdit,
}: {
  data: Task[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEdit: (task: Task) => void;
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
                      onClick={() => onEdit(task)}
                      className={`text-xs p-1.5 rounded cursor-pointer truncate border ${
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
                      {task.name}
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
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Task | null>(null);
  const [deleteItem, setDeleteItem] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    plan: "",
    stage: "",
    assignedType: "individual" as "individual" | "team",
    assignedTo: "",
    startDate: "",
    endDate: "",
    priority: "medium" as "low" | "medium" | "high",
    description: "",
  });

  // Get stages based on selected plan
  const selectedPlan = mockPlans.find((p) => p.name === formData.plan);
  const availableStages = selectedPlan?.stages || [];

  // Get assignees based on type
  const availableAssignees =
    formData.assignedType === "team" ? mockTeams : mockPersonnel;

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
          <span>{value}</span>
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
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      plan: "",
      stage: "",
      assignedType: "individual",
      assignedTo: "",
      startDate: "",
      endDate: "",
      priority: "medium",
      description: "",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: Task) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      plan: item.plan,
      stage: item.stage,
      assignedType: item.assignedType,
      assignedTo: item.assignedTo,
      startDate: item.startDate,
      endDate: item.endDate,
      priority: item.priority,
      description: item.description,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: Task) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      updateTask(editItem.id, formData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật công việc",
      });
    } else {
      addTask(formData);
      toast({
        title: "Thành công",
        description: "Đã phân bổ công việc mới",
      });
    }
    setFormOpen(false);
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
              <Calendar className="w-5 h-5" />
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
          onView={(item) =>
            toast({ title: "Xem chi tiết", description: item.name })
          }
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
        />
      )}

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa công việc" : "Phân bổ công việc mới"}
        onSubmit={handleSubmit}
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã công việc *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: NV001"
                data-testid="input-code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Tên công việc *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Chuẩn bị đất trồng"
                data-testid="input-name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kế hoạch canh tác *</Label>
              <Select
                value={formData.plan}
                onValueChange={(value) =>
                  setFormData({ ...formData, plan: value, stage: "" })
                }
              >
                <SelectTrigger data-testid="select-plan">
                  <SelectValue placeholder="Chọn kế hoạch" />
                </SelectTrigger>
                <SelectContent>
                  {mockPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.name}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Giai đoạn *</Label>
              <Select
                value={formData.stage}
                onValueChange={(value) =>
                  setFormData({ ...formData, stage: value })
                }
                disabled={!formData.plan}
              >
                <SelectTrigger data-testid="select-stage">
                  <SelectValue placeholder="Chọn giai đoạn" />
                </SelectTrigger>
                <SelectContent>
                  {availableStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loại phân công *</Label>
              <Select
                value={formData.assignedType}
                onValueChange={(value: "individual" | "team") =>
                  setFormData({
                    ...formData,
                    assignedType: value,
                    assignedTo: "",
                  })
                }
              >
                <SelectTrigger data-testid="select-assigned-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Cá nhân</SelectItem>
                  <SelectItem value="team">Đội nhóm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                {formData.assignedType === "team"
                  ? "Phân công đội nhóm *"
                  : "Phân công nhân viên *"}
              </Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) =>
                  setFormData({ ...formData, assignedTo: value })
                }
              >
                <SelectTrigger data-testid="select-assigned-to">
                  <SelectValue
                    placeholder={
                      formData.assignedType === "team"
                        ? "Chọn đội nhóm"
                        : "Chọn nhân viên"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableAssignees.map((assignee) => (
                    <SelectItem key={assignee.id} value={assignee.name}>
                      {assignee.name} ({assignee.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                data-testid="input-startDate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                data-testid="input-endDate"
              />
            </div>
            <div className="space-y-2">
              <Label>Độ ưu tiên *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger data-testid="select-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả công việc</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Mô tả chi tiết về công việc cần thực hiện..."
              rows={3}
              data-testid="input-description"
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
