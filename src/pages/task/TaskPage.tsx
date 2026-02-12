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
  Package,
  X,
  Bug,
  FlaskConical,
  Wrench,
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

import useTaskStore, {
  type Task,
  type MaterialAllocation,
} from "../../stores/useTaskStore";

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

const MATERIAL_TYPES = [
  {
    id: "pesticide",
    label: "Thuốc BVTV",
    icon: Bug,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  {
    id: "fertilizer",
    label: "Phân bón",
    icon: FlaskConical,
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    id: "tool",
    label: "Dụng cụ - Máy móc",
    icon: Wrench,
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    id: "other",
    label: "Vật tư khác",
    icon: Package,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
];

const MATERIAL_OPTIONS = {
  pesticide: [
    { value: "Anvil 5SC", label: "Anvil 5SC (Trừ nấm)", unit: "lít" },
    { value: "Confidor", label: "Confidor (Trừ sâu)", unit: "lít" },
    { value: "Radiant", label: "Radiant (Trừ sâu)", unit: "lít" },
    { value: "Trichoderma", label: "Trichoderma (Nấm đối kháng)", unit: "lít" },
  ],
  fertilizer: [
    { value: "Vôi bột", label: "Vôi bột (Xử lý pH)", unit: "kg" },
    { value: "Lân nung chảy", label: "Lân nung chảy (Khử phèn)", unit: "kg" },
    {
      value: "Phân chuồng hoai mục",
      label: "Phân chuồng hoai mục",
      unit: "kg",
    },
    { value: "Humic Acid", label: "Humic Acid (Kích rễ)", unit: "lít" },
    { value: "Kali Humate", label: "Kali Humate (Giảm mặn)", unit: "lít" },
    { value: "NPK 20-20-15", label: "NPK 20-20-15", unit: "kg" },
    { value: "Ure", label: "Phân Ure", unit: "kg" },
  ],
  tool: [
    { value: "Máy cắt cỏ", label: "Máy cắt cỏ", unit: "cái" },
    { value: "Bình xịt điện", label: "Bình xịt điện 20L", unit: "cái" },
    { value: "Kéo cắt cành", label: "Kéo cắt cành", unit: "cái" },
    { value: "Cuốc", label: "Cuốc", unit: "cái" },
    { value: "Xẻng", label: "Xẻng", unit: "cái" },
  ],
  other: [
    { value: "Túi bao trái", label: "Túi bao trái sầu riêng", unit: "cái" },
    { value: "Dây cột", label: "Dây nilon đen", unit: "kg" },
    { value: "Bạt phủ", label: "Bạt phủ đất", unit: "m2" },
  ],
};

const MATERIAL_UNITS = {
  pesticide: ["lít", "ml", "chai", "gói", "can"],
  fertilizer: ["kg", "tấn", "bao", "lít", "can"],
  tool: ["cái", "bộ", "hộp"],
  other: ["kg", "cái", "cuộn", "m", "m2", "thùng"],
};

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

  const [newMaterial, setNewMaterial] = useState({
    type: "fertilizer" as "fertilizer" | "pesticide" | "tool" | "other",
    name: "",
    quantity: "",
    unit: "kg",
  });

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
    materials: [] as MaterialAllocation[],
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
      materials: [],
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
      materials: item.materials || [],
    });
    setFormOpen(true);
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.quantity) return;
    setFormData((prev) => ({
      ...prev,
      materials: [
        ...(prev.materials || []),
        {
          id: Date.now(),
          name: newMaterial.name,
          quantity: Number(newMaterial.quantity),
          unit: newMaterial.unit,
          type: newMaterial.type,
        },
      ],
    }));
    setNewMaterial({
      type: newMaterial.type,
      name: "",
      quantity: "",
      unit: "kg",
    });
  };

  const handleRemoveMaterial = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: (prev.materials || []).filter((m) => m.id !== id),
    }));
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
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
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

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-500" />
              Nguồn lực & Vật tư
            </h3>

            {/* List of materials */}
            <div className="space-y-2">
              {formData.materials.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded border"
                >
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">
                      {MATERIAL_TYPES.find((t) => t.id === item.type)?.label}
                    </Badge>
                    <Badge variant="outline">
                      {item.quantity} {item.unit}
                    </Badge>
                    <button
                      onClick={() => handleRemoveMaterial(item.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {formData.materials.length === 0 && (
                <p className="text-sm text-slate-400 italic text-center py-2">
                  Chưa có vật tư nào
                </p>
              )}
            </div>

            {/* Material Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
              {MATERIAL_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = newMaterial.type === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() =>
                      setNewMaterial((prev) => ({
                        ...prev,
                        type: type.id as any,
                        name: "",
                        unit: MATERIAL_UNITS[
                          type.id as keyof typeof MATERIAL_UNITS
                        ][0],
                      }))
                    }
                    className={`
                      cursor-pointer rounded-lg border p-3 flex flex-col items-center justify-center gap-2 transition-all
                      ${
                        isSelected
                          ? `${type.bg} ${type.border} border-2`
                          : "hover:bg-slate-50 border-slate-200"
                      }
                    `}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isSelected ? type.color : "text-slate-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        isSelected ? type.color : "text-slate-600"
                      }`}
                    >
                      {type.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Add material inputs */}
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Tên{" "}
                  {MATERIAL_TYPES.find((t) => t.id === newMaterial.type)?.label}
                </Label>
                <Select
                  value={newMaterial.name}
                  onValueChange={(val) => {
                    const typeOptions =
                      MATERIAL_OPTIONS[
                        newMaterial.type as keyof typeof MATERIAL_OPTIONS
                      ];
                    const opt = typeOptions.find((o) => o.value === val);
                    setNewMaterial((prev) => ({
                      ...prev,
                      name: val,
                      unit: opt?.unit || "kg",
                    }));
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIAL_OPTIONS[
                      newMaterial.type as keyof typeof MATERIAL_OPTIONS
                    ].map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24 space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Số lượng
                </Label>
                <Input
                  type="number"
                  className="h-9"
                  value={newMaterial.quantity}
                  onChange={(e) =>
                    setNewMaterial((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                  placeholder="0"
                />
              </div>
              <div className="w-24 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Đơn vị</Label>
                <Select
                  value={newMaterial.unit}
                  onValueChange={(val) =>
                    setNewMaterial((prev) => ({ ...prev, unit: val }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIAL_UNITS[
                      newMaterial.type as keyof typeof MATERIAL_UNITS
                    ].map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddMaterial} className="h-9 w-9 p-0 mb-px">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
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
