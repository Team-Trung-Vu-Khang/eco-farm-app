import { useState } from "react";
import {
  Plus,
  Calendar as CalendarIcon,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Sprout,
  Eye,
  List,
  LayoutGrid,
  Beaker,
  Tractor,
  Droplets,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useAmendmentTaskStore, {
  type AmendmentTask,
} from "../../stores/useAmendmentTaskStore";

// Mock data for amendment plans
const mockAmendmentPlans = [
  {
    id: 1,
    name: "Cải tạo đất nhiễm mặn Vùng A",
    code: "CT001",
    zone: "Vùng A - Cà Mau",
  },
  {
    id: 2,
    name: "Xử lý đất chua phèn Vùng B",
    code: "CT002",
    zone: "Vùng B - Long An",
  },
  {
    id: 3,
    name: "Phục hồi đất bạc màu Vùng C",
    code: "CT003",
    zone: "Vùng C - Đồng Nai",
  },
];

// Mock data for amendment methods
const mockAmendmentMethods = [
  "Bón vôi khử chua",
  "Rửa mặn",
  "Bón phân hữu cơ",
  "Trồng cây phân xanh",
  "Cày xới sâu",
  "Tưới ngập cải tạo",
  "Bón phân vi sinh",
  "Bón thạch cao",
];

// Mock data for personnel
const mockPersonnel = [
  { id: 1, name: "Nguyễn Văn A", code: "NV001" },
  { id: 2, name: "Trần Thị B", code: "NV002" },
  { id: 3, name: "Lê Văn C", code: "NV003" },
  { id: 4, name: "Phạm Văn D", code: "NV004" },
];

// Mock data for teams
const mockTeams = [
  { id: 1, name: "Đội Cải tạo đất", code: "TEAM-CT" },
  { id: 2, name: "Đội Kỹ thuật", code: "TEAM-KT" },
  { id: 3, name: "Đội Vận hành", code: "TEAM-VH" },
];

// Mock data for regions and zones (hierarchical)
const mockRegions = [
  {
    id: 1,
    name: "Miền Nam",
    zones: [
      { id: 1, name: "Vùng A - Cà Mau", code: "ZONE-A" },
      { id: 2, name: "Vùng B - Long An", code: "ZONE-B" },
      { id: 3, name: "Vùng C - Đồng Nai", code: "ZONE-C" },
      { id: 4, name: "Vùng D - Tiền Giang", code: "ZONE-D" },
    ],
  },
  {
    id: 2,
    name: "Miền Trung",
    zones: [
      { id: 5, name: "Vùng E - Quảng Nam", code: "ZONE-E" },
      { id: 6, name: "Vùng F - Đà Nẵng", code: "ZONE-F" },
      { id: 7, name: "Vùng G - Huế", code: "ZONE-G" },
    ],
  },
  {
    id: 3,
    name: "Miền Bắc",
    zones: [
      { id: 8, name: "Vùng H - Hà Nội", code: "ZONE-H" },
      { id: 9, name: "Vùng I - Hải Phòng", code: "ZONE-I" },
      { id: 10, name: "Vùng K - Thái Bình", code: "ZONE-K" },
    ],
  },
];

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "urgent":
      return {
        label: "Khẩn cấp",
        variant: "destructive" as const,
        className: "bg-red-600 hover:bg-red-700",
      };
    case "high":
      return {
        label: "Cao",
        variant: "destructive" as const,
        className: "bg-orange-500 hover:bg-orange-600",
      };
    case "medium":
      return {
        label: "Trung bình",
        variant: "default" as const,
        className: "",
      };
    case "low":
      return {
        label: "Thấp",
        variant: "outline" as const,
        className: "text-slate-600 border-slate-300",
      };
    default:
      return {
        label: "Không xác định",
        variant: "outline" as const,
        className: "",
      };
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "pending":
      return {
        label: "Chờ thực hiện",
        variant: "outline" as const,
        className: "text-amber-600 border-amber-200 bg-amber-50",
      };
    case "in_progress":
      return {
        label: "Đang thực hiện",
        variant: "default" as const,
        className: "bg-blue-600 hover:bg-blue-700",
      };
    case "completed":
      return {
        label: "Hoàn thành",
        variant: "secondary" as const,
        className: "bg-green-100 text-green-700",
      };
    case "cancelled":
      return {
        label: "Đã hủy",
        variant: "destructive" as const,
        className: "",
      };
    default:
      return {
        label: "Không xác định",
        variant: "outline" as const,
        className: "",
      };
  }
};
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

export default function AmendmentTaskPage() {
  const { toast } = useToast();

  // Zustand store
  const tasks = useAmendmentTaskStore((state) => state.tasks);
  const addTask = useAmendmentTaskStore((state) => state.addTask);
  const updateTask = useAmendmentTaskStore((state) => state.updateTask);
  const deleteTask = useAmendmentTaskStore((state) => state.deleteTask);
  const getStatistics = useAmendmentTaskStore((state) => state.getStatistics);

  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  // Dialog States
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  // Selection States
  const [selectedItem, setSelectedItem] = useState<AmendmentTask | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const [newMaterial, setNewMaterial] = useState({
    type: "fertilizer" as "fertilizer" | "pesticide" | "tool" | "other",
    name: "",
    quantity: "",
    unit: "kg",
  });

  const [formData, setFormData] = useState<Partial<AmendmentTask>>({
    code: "",
    name: "",
    plan: "",
    zone: "",
    method: "",
    assignedType: "individual",
    assignedTo: "",
    startDate: "",
    endDate: "",
    priority: "medium",
    materials: [],
    equipment: [],
    targetArea: 0,
    notes: "",
  });

  const columns: Column<AmendmentTask>[] = [
    {
      key: "code",
      label: "Mã",
      render: (val) => (
        <span className="font-mono text-xs font-medium text-slate-500">
          {val}
        </span>
      ),
    },
    {
      key: "name",
      label: "Tên công việc",
      render: (val, item) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{val}</span>
          <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <Beaker className="w-3 h-3" />
            {item.method}
          </span>
        </div>
      ),
    },
    {
      key: "zone",
      label: "Khu vực",
      render: (val) => (
        <div className="flex items-center gap-1.5 text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sm">{val}</span>
        </div>
      ),
    },
    {
      key: "assignedTo",
      label: "Phân công",
      render: (val, item) => (
        <div className="flex items-center gap-1.5">
          {item.assignedType === "team" ? (
            <Users className="w-3.5 h-3.5 text-blue-500" />
          ) : (
            <Users className="w-3.5 h-3.5 text-green-500" />
          )}
          <span className="text-sm">{val}</span>
        </div>
      ),
    },
    {
      key: "priority",
      label: "Ưu tiên",
      render: (val) => {
        const config = getPriorityConfig(val as string);
        return (
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (val) => {
        const config = getStatusConfig(val as string);
        return (
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "startDate",
      label: "Tiến độ",
      render: (_, item) => (
        <div className="text-xs text-slate-500">
          <div>{item.startDate}</div>
          <div className="text-slate-400">→ {item.endDate}</div>
        </div>
      ),
    },
    {
      key: "id",
      label: "Chi tiết",
      render: (_, item) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
          onClick={() => handleViewDetail(item as AmendmentTask)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  // Handlers
  const handleAdd = () => {
    setSelectedItem(null);
    setSelectedRegion("");
    setFormData({
      code: "",
      name: "",
      plan: "",
      zone: "",
      method: "",
      assignedType: "individual",
      assignedTo: "",
      startDate: "",
      endDate: "",
      priority: "medium",
      materials: [],
      equipment: [],
      targetArea: 0,
      notes: "",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: AmendmentTask) => {
    setSelectedItem(item);
    setFormData({ ...item });
    // Find and set the region based on the zone
    const region = mockRegions.find((r) =>
      r.zones.some((z) => z.name === item.zone),
    );
    setSelectedRegion(region?.name || "");
    setFormOpen(true);
  };

  const handleDelete = (item: AmendmentTask) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleViewDetail = (item: AmendmentTask) => {
    setSelectedItem(item);
    setDetailOpen(true);
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

  const handleSubmit = () => {
    if (selectedItem) {
      // Edit
      updateTask(selectedItem.id, formData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật công việc cải tạo",
      });
    } else {
      // Create
      addTask(formData as Omit<AmendmentTask, "id" | "createdAt">);
      toast({
        title: "Thành công",
        description: "Đã tạo công việc mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      deleteTask(selectedItem.id);
      toast({ title: "Thành công", description: "Đã xóa công việc" });
    }
    setDeleteOpen(false);
  };

  // Dashboard Stats
  const stats = getStatistics();

  // Kanban columns
  const kanbanColumns = [
    { id: "pending", title: "Chờ thực hiện", status: "pending" },
    { id: "in_progress", title: "Đang thực hiện", status: "in_progress" },
    { id: "completed", title: "Hoàn thành", status: "completed" },
  ];

  return (
    <AdminLayout
      title="Công việc cải tạo đất"
      description="Quản lý và theo dõi các công việc cải tạo đất theo kế hoạch"
      actions={
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 mr-2">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"}`}
              title="Xem danh sách"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "kanban" ? "bg-white shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"}`}
              title="Xem Kanban"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={handleAdd} className="shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Tạo công việc
          </Button>
        </div>
      }
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.pending}
              </p>
              <p className="text-xs text-slate-500 font-medium uppercase">
                Chờ thực hiện
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.inProgress}
              </p>
              <p className="text-xs text-slate-500 font-medium uppercase">
                Đang thực hiện
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.completed}
              </p>
              <p className="text-xs text-slate-500 font-medium uppercase">
                Hoàn thành
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalArea} ha
              </p>
              <p className="text-xs text-slate-500 font-medium uppercase">
                Tổng diện tích
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {viewMode === "list" ? (
        <DataTable
          columns={columns}
          data={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Tìm kiếm công việc, phương pháp..."
          filters={[
            {
              key: "status",
              label: "Trạng thái",
              options: [
                { label: "Chờ thực hiện", value: "pending" },
                { label: "Đang thực hiện", value: "in_progress" },
                { label: "Hoàn thành", value: "completed" },
                { label: "Đã hủy", value: "cancelled" },
              ],
            },
            {
              key: "priority",
              label: "Độ ưu tiên",
              options: [
                { label: "Khẩn cấp", value: "urgent" },
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
            {
              key: "method",
              label: "Phương pháp",
              options: mockAmendmentMethods.map((m) => ({
                label: m,
                value: m,
              })),
            },
          ]}
        />
      ) : (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="grid grid-cols-3 gap-4">
            {kanbanColumns.map((column) => {
              const columnTasks = tasks.filter(
                (t) => t.status === column.status,
              );
              const statusConfig = getStatusConfig(column.status);

              return (
                <div key={column.id} className="flex flex-col">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={statusConfig.variant}
                        className={statusConfig.className}
                      >
                        {column.title}
                      </Badge>
                      <span className="text-sm text-slate-500">
                        ({columnTasks.length})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    {columnTasks.map((task) => {
                      const priorityConfig = getPriorityConfig(task.priority);

                      return (
                        <Card
                          key={task.id}
                          className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
                          style={{
                            borderLeftColor:
                              task.priority === "urgent"
                                ? "#dc2626"
                                : task.priority === "high"
                                  ? "#f97316"
                                  : task.priority === "medium"
                                    ? "#3b82f6"
                                    : "#94a3b8",
                          }}
                          onClick={() => handleViewDetail(task)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-mono text-xs text-slate-500">
                                {task.code}
                              </span>
                              <Badge
                                variant={priorityConfig.variant}
                                className={`${priorityConfig.className} text-xs`}
                              >
                                {priorityConfig.label}
                              </Badge>
                            </div>

                            <h4 className="font-medium text-sm text-slate-900 mb-2 line-clamp-2">
                              {task.name}
                            </h4>

                            <div className="space-y-1.5 text-xs text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <Beaker className="w-3 h-3 text-slate-400" />
                                <span className="truncate">{task.method}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span className="truncate">{task.zone}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3 h-3 text-slate-400" />
                                <span className="truncate">
                                  {task.assignedTo}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Sprout className="w-3 h-3 text-slate-400" />
                                <span>{task.targetArea} ha</span>
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-slate-500">
                              <span>{task.startDate}</span>
                              <span>→</span>
                              <span>{task.endDate}</span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}

                    {columnTasks.length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-sm">
                        Không có công việc
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create / Edit Form */}
      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selectedItem ? "Cập nhật công việc" : "Tạo công việc mới"}
        onSubmit={handleSubmit}
        size="xl"
      >
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 border-b pb-1">
              Thông tin cơ bản
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>
                  Mã công việc <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="VD: NVCT-001"
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label>
                  Tên công việc <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: Rải vôi bột khử chua"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Kế hoạch cải tạo</Label>
                <Select
                  value={formData.plan}
                  onValueChange={(v) => {
                    const plan = mockAmendmentPlans.find((p) => p.name === v);
                    setFormData({
                      ...formData,
                      plan: v,
                      zone: plan?.zone || "",
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn kế hoạch" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAmendmentPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.name}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Phương pháp cải tạo</Label>
                <Select
                  value={formData.method}
                  onValueChange={(v) => setFormData({ ...formData, method: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phương pháp" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAmendmentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Vùng</Label>
                <Select
                  value={selectedRegion}
                  onValueChange={(v) => {
                    setSelectedRegion(v);
                    setFormData({ ...formData, zone: "" });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vùng" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRegions.map((region) => (
                      <SelectItem key={region.id} value={region.name}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Khu vực thực hiện</Label>
                <Select
                  value={formData.zone}
                  onValueChange={(v) => setFormData({ ...formData, zone: v })}
                  disabled={!selectedRegion}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        selectedRegion ? "Chọn khu vực" : "Chọn vùng trước"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedRegion &&
                      mockRegions
                        .find((r) => r.name === selectedRegion)
                        ?.zones.map((zone) => (
                          <SelectItem key={zone.id} value={zone.name}>
                            {zone.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 border-b pb-1">
              Phân công thực hiện
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Loại phân công</Label>
                <Select
                  value={formData.assignedType}
                  onValueChange={(v: any) =>
                    setFormData({
                      ...formData,
                      assignedType: v,
                      assignedTo: "",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Cá nhân</SelectItem>
                    <SelectItem value="team">Đội nhóm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Người/Đội thực hiện</Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(v) =>
                    setFormData({ ...formData, assignedTo: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn người/đội" />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.assignedType === "team"
                      ? mockTeams
                      : mockPersonnel
                    ).map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Schedule & Priority */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 border-b pb-1">
              Tiến độ & Ưu tiên
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Ngày bắt đầu</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Ngày kết thúc</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: any) =>
                    setFormData({ ...formData, status: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ thực hiện</SelectItem>
                    <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Độ ưu tiên</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v: any) =>
                    setFormData({ ...formData, priority: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Diện tích mục tiêu (ha)</Label>
              <Input
                type="number"
                value={formData.targetArea}
                min={0}
                step={0.1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetArea: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 border-b pb-1">
              Ghi chú kỹ thuật
            </h4>
            <div className="space-y-1.5">
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Liều lượng, quy trình, lưu ý kỹ thuật..."
                rows={3}
              />
            </div>
          </div>

          {/* Materials Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-500" />
              Nguồn lực & Vật tư
            </h3>

            {/* List of materials */}
            <div className="space-y-2">
              {formData.materials?.map((item) => (
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
              {(!formData.materials || formData.materials.length === 0) && (
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
        title="Xóa công việc"
        description="Bạn có chắc chắn muốn xóa công việc cải tạo này?"
      />

      {/* View Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {selectedItem?.name}
              <Badge
                variant={
                  selectedItem
                    ? getStatusConfig(selectedItem.status).variant
                    : "outline"
                }
                className=""
              >
                {selectedItem ? getStatusConfig(selectedItem.status).label : ""}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 py-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border">
                  <div className="text-xs text-slate-500 uppercase font-medium mb-1">
                    Diện tích
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {selectedItem.targetArea} ha
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border">
                  <div className="text-xs text-slate-500 uppercase font-medium mb-1">
                    Ưu tiên
                  </div>
                  <div className="text-sm font-bold">
                    <Badge
                      variant={getPriorityConfig(selectedItem.priority).variant}
                      className={
                        getPriorityConfig(selectedItem.priority).className
                      }
                    >
                      {getPriorityConfig(selectedItem.priority).label}
                    </Badge>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border col-span-2">
                  <div className="text-xs text-slate-500 uppercase font-medium mb-1">
                    Thời gian
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    {selectedItem.startDate} → {selectedItem.endDate}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div>
                    <span className="text-slate-500 w-32 inline-block">
                      Mã công việc:
                    </span>
                    <span className="font-mono font-medium">
                      {selectedItem.code}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 w-32 inline-block">
                      Kế hoạch:
                    </span>
                    <span className="font-medium">{selectedItem.plan}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 w-32 inline-block">
                      Khu vực:
                    </span>
                    <span className="font-medium">{selectedItem.zone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 w-32 inline-block">
                      Phương pháp:
                    </span>
                    <span className="font-medium text-blue-700">
                      {selectedItem.method}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 w-32 inline-block">
                      Phân công:
                    </span>
                    <span className="font-medium">
                      {selectedItem.assignedTo}
                      <span className="text-xs text-slate-500 ml-1">
                        (
                        {selectedItem.assignedType === "team"
                          ? "Đội"
                          : "Cá nhân"}
                        )
                      </span>
                    </span>
                  </div>
                  {selectedItem.actualArea && (
                    <div>
                      <span className="text-slate-500 w-32 inline-block">
                        Diện tích thực tế:
                      </span>
                      <span className="font-medium text-green-700">
                        {selectedItem.actualArea} ha
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Materials & Equipment */}
              {(selectedItem.materials.length > 0 ||
                selectedItem.equipment.length > 0) && (
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedItem.materials &&
                      selectedItem.materials.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                            <Droplets className="w-4 h-4" />
                            Vật tư sử dụng
                          </h5>
                          <ul className="space-y-1 text-sm">
                            {selectedItem.materials.map((material, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                {material.name} ({material.quantity}{" "}
                                {material.unit})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {selectedItem.equipment &&
                      selectedItem.equipment.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                            <Tractor className="w-4 h-4" />
                            Thiết bị cần thiết
                          </h5>
                          <ul className="space-y-1 text-sm">
                            {selectedItem.equipment.map((equip, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                {equip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedItem.notes && (
                <div className="border-t pt-4">
                  <h5 className="text-sm font-semibold text-slate-900 mb-2">
                    Ghi chú kỹ thuật
                  </h5>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded border">
                    {selectedItem.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setDetailOpen(false)}>
                  Đóng
                </Button>
                <Button
                  onClick={() => {
                    setDetailOpen(false);
                    handleEdit(selectedItem);
                  }}
                >
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
