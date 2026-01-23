import { useState } from "react";
import { Link } from "wouter";
import {
  Plus,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
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

interface Task {
  id: number;
  code: string;
  name: string;
  plan: string;
  stage: string;
  assignedTo: string;
  assignedType: "individual" | "team";
  startDate: string;
  endDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "overdue";
  description: string;
  createdAt: string;
}

// Mock data cho kế hoạch
const mockPlans = [
  {
    id: 1,
    name: "Kế hoạch sầu riêng vụ Xuân 2025",
    code: "KH001",
    stages: [
      "Chuẩn bị đất",
      "Gieo trồng",
      "Chăm sóc giai đoạn 1",
      "Bón phân lần 1",
      "Phun thuốc BVTV",
    ],
  },
  {
    id: 2,
    name: "Kế hoạch xoài vụ Hè 2025",
    code: "KH002",
    stages: ["Chuẩn bị đất", "Gieo trồng", "Chăm sóc", "Thu hoạch"],
  },
];

// Mock data cho nhân viên
const mockPersonnel = [
  { id: 1, name: "Nguyễn Văn A", code: "NV001" },
  { id: 2, name: "Trần Thị B", code: "NV002" },
  { id: 3, name: "Lê Văn C", code: "NV003" },
];

// Mock data cho đội nhóm
const mockTeams = [
  { id: 1, name: "Đội canh tác 1", code: "TEAM001" },
  { id: 2, name: "Đội thu hoạch", code: "TEAM002" },
  { id: 3, name: "Đội chăm sóc", code: "TEAM003" },
];

const initialData: Task[] = [
  {
    id: 1,
    code: "NV001",
    name: "Chuẩn bị đất trồng sầu riêng",
    plan: "Kế hoạch sầu riêng vụ Xuân 2025",
    stage: "Chuẩn bị đất",
    assignedTo: "Đội canh tác 1",
    assignedType: "team",
    startDate: "2025-01-15",
    endDate: "2025-01-20",
    priority: "high",
    status: "in-progress",
    description: "Làm đất, bón phân nền",
    createdAt: "2025-01-10",
  },
  {
    id: 2,
    code: "NV002",
    name: "Gieo trồng giống sầu riêng",
    plan: "Kế hoạch sầu riêng vụ Xuân 2025",
    stage: "Gieo trồng",
    assignedTo: "Nguyễn Văn A",
    assignedType: "individual",
    startDate: "2025-01-21",
    endDate: "2025-01-25",
    priority: "high",
    status: "pending",
    description: "Gieo trồng giống Monthon",
    createdAt: "2025-01-10",
  },
  {
    id: 3,
    code: "NV003",
    name: "Bón phân lần 1",
    plan: "Kế hoạch sầu riêng vụ Xuân 2025",
    stage: "Bón phân lần 1",
    assignedTo: "Đội chăm sóc",
    assignedType: "team",
    startDate: "2025-02-01",
    endDate: "2025-02-05",
    priority: "medium",
    status: "pending",
    description: "Bón phân NPK 20-20-15",
    createdAt: "2025-01-10",
  },
];

export default function TaskPage() {
  const { toast } = useToast();
  const [data, setData] = useState<Task[]>(initialData);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Task | null>(null);
  const [deleteItem, setDeleteItem] = useState<Task | null>(null);

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
      setData((prev) =>
        prev.map((item) =>
          item.id === editItem.id
            ? { ...item, ...formData, status: item.status }
            : item,
        ),
      );
      toast({
        title: "Thành công",
        description: "Đã cập nhật công việc",
      });
    } else {
      const newItem: Task = {
        id: Date.now(),
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã phân bổ công việc mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa công việc" });
    }
    setDeleteOpen(false);
  };

  const pendingCount = data.filter((t) => t.status === "pending").length;
  const inProgressCount = data.filter((t) => t.status === "in-progress").length;
  const completedCount = data.filter((t) => t.status === "completed").length;
  const overdueCount = data.filter((t) => t.status === "overdue").length;

  return (
    <AdminLayout
      title="Phân bổ công việc"
      description="Phân công nhiệm vụ cho nhân viên và đội nhóm"
      actions={
        <Button onClick={handleAdd} data-testid="add-task">
          <Plus className="w-4 h-4 mr-2" />
          Phân bổ công việc
        </Button>
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

      <DataTable
        columns={columns}
        data={data}
        onView={(item) =>
          toast({ title: "Xem chi tiết", description: item.name })
        }
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm công việc..."
      />

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
