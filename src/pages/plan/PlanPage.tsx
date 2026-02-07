import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Plus, Calendar, MapPin, Sprout } from "lucide-react";
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
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";

interface Plan {
  id: number;
  code: string;
  name: string;
  season: string;
  zone: string;
  crop: string;
  variety: string;
  startDate: string;
  endDate: string;
  status: "draft" | "active" | "completed";
  createdAt: string;
}

const initialData: Plan[] = [
  {
    id: 1,
    code: "KH001",
    name: "Kế hoạch sầu riêng vụ Xuân 2025",
    season: "Vụ Xuân 2025",
    zone: "Vùng A1 - Bình Phước",
    crop: "Sầu riêng",
    variety: "Monthon",
    startDate: "2025-01-15",
    endDate: "2025-06-30",
    status: "active",
    createdAt: "2024-12-01",
  },
  {
    id: 2,
    code: "KH002",
    name: "Kế hoạch xoài vụ Hè 2025",
    season: "Vụ Hè 2025",
    zone: "Vùng B3 - Đồng Nai",
    crop: "Xoài",
    variety: "Cát Hòa Lộc",
    startDate: "2025-03-01",
    endDate: "2025-08-15",
    status: "draft",
    createdAt: "2024-12-10",
  },
  {
    id: 3,
    code: "KH003",
    name: "Kế hoạch bưởi da xanh 2025",
    season: "Vụ Thu 2025",
    zone: "Vùng C2 - Bến Tre",
    crop: "Bưởi",
    variety: "Da xanh",
    startDate: "2025-07-01",
    endDate: "2025-12-31",
    status: "draft",
    createdAt: "2024-12-15",
  },
  {
    id: 4,
    code: "KH004",
    name: "Kế hoạch thanh long 2024",
    season: "Năm 2024",
    zone: "Vùng D1 - Bình Thuận",
    crop: "Thanh long",
    variety: "Ruột đỏ",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "completed",
    createdAt: "2023-12-01",
  },
];

export default function PlanPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<Plan[]>(initialData);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Plan | null>(null);
  const [deleteItem, setDeleteItem] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    season: "",
    zone: "",
    crop: "",
    variety: "",
    startDate: "",
    endDate: "",
  });

  const columns: Column<Plan>[] = [
    { key: "code", label: "Mã" },
    { key: "name", label: "Tên kế hoạch" },
    { key: "season", label: "Mùa vụ" },
    { key: "zone", label: "Vùng canh tác" },
    { key: "crop", label: "Cây trồng" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge
          variant={
            value === "active"
              ? "default"
              : value === "completed"
                ? "secondary"
                : "outline"
          }
        >
          {value === "active"
            ? "Đang thực hiện"
            : value === "completed"
              ? "Hoàn thành"
              : "Bản nháp"}
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
      season: "",
      zone: "",
      crop: "",
      variety: "",
      startDate: "",
      endDate: "",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: Plan) => {
    setLocation(`/plan/${item.id}/edit`);
  };

  const handleDelete = (item: Plan) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, ...formData } : item,
        ),
      );
      toast({
        title: "Thành công",
        description: "Đã cập nhật kế hoạch canh tác",
      });
    } else {
      const newItem: Plan = {
        id: Date.now(),
        ...formData,
        status: "draft",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: "Đã thêm kế hoạch canh tác mới",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa kế hoạch" });
    }
    setDeleteOpen(false);
  };

  const activeCount = data.filter((p) => p.status === "active").length;
  const draftCount = data.filter((p) => p.status === "draft").length;
  const completedCount = data.filter((p) => p.status === "completed").length;

  return (
    <AdminLayout
      title="Quản lý kế hoạch canh tác"
      description="Lập và quản lý kế hoạch canh tác theo mùa vụ"
      actions={
        <Link href="/plan/create">
          <Button data-testid="add-plan">
            <Plus className="w-4 h-4 mr-2" />
            Thêm kế hoạch
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Đang thực hiện</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{draftCount}</p>
              <p className="text-sm text-muted-foreground">Bản nháp</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">
                {completedCount}
              </p>
              <p className="text-sm text-muted-foreground">Hoàn thành</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onView={(item) => setLocation(`/plan/${item.id}`)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm kế hoạch..."
        filters={[
          {
            key: "status",
            label: "Trạng thái",
            options: [
              { label: "Đang thực hiện", value: "active" },
              { label: "Bản nháp", value: "draft" },
              { label: "Hoàn thành", value: "completed" },
            ],
          },
          {
            key: "season",
            label: "Mùa vụ",
            options: [
              { label: "Vụ Xuân 2025", value: "Vụ Xuân 2025" },
              { label: "Vụ Hè 2025", value: "Vụ Hè 2025" },
              { label: "Vụ Thu 2025", value: "Vụ Thu 2025" },
              { label: "Vụ Đông 2025", value: "Vụ Đông 2025" },
              { label: "Năm 2025", value: "Năm 2025" },
            ],
          },
          {
            key: "crop",
            label: "Cây trồng",
            options: [
              { label: "Sầu riêng", value: "Sầu riêng" },
              { label: "Xoài", value: "Xoài" },
              { label: "Bưởi", value: "Bưởi" },
              { label: "Thanh long", value: "Thanh long" },
            ],
          },
        ]}
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa kế hoạch" : "Thêm kế hoạch mới"}
        onSubmit={handleSubmit}
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã kế hoạch</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: KH001"
                data-testid="input-code"
              />
            </div>
            <div className="space-y-2">
              <Label>Mùa vụ</Label>
              <Select
                value={formData.season}
                onValueChange={(value) =>
                  setFormData({ ...formData, season: value })
                }
              >
                <SelectTrigger data-testid="select-season">
                  <SelectValue placeholder="Chọn mùa vụ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vụ Xuân 2025">Vụ Xuân 2025</SelectItem>
                  <SelectItem value="Vụ Hè 2025">Vụ Hè 2025</SelectItem>
                  <SelectItem value="Vụ Thu 2025">Vụ Thu 2025</SelectItem>
                  <SelectItem value="Vụ Đông 2025">Vụ Đông 2025</SelectItem>
                  <SelectItem value="Năm 2025">Năm 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Tên kế hoạch</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nhập tên kế hoạch"
              data-testid="input-name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vùng canh tác</Label>
              <Select
                value={formData.zone}
                onValueChange={(value) =>
                  setFormData({ ...formData, zone: value })
                }
              >
                <SelectTrigger data-testid="select-zone">
                  <SelectValue placeholder="Chọn vùng canh tác" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vùng A1 - Bình Phước">
                    Vùng A1 - Bình Phước
                  </SelectItem>
                  <SelectItem value="Vùng B3 - Đồng Nai">
                    Vùng B3 - Đồng Nai
                  </SelectItem>
                  <SelectItem value="Vùng C2 - Bến Tre">
                    Vùng C2 - Bến Tre
                  </SelectItem>
                  <SelectItem value="Vùng D1 - Bình Thuận">
                    Vùng D1 - Bình Thuận
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cây trồng</Label>
              <Select
                value={formData.crop}
                onValueChange={(value) =>
                  setFormData({ ...formData, crop: value })
                }
              >
                <SelectTrigger data-testid="select-crop">
                  <SelectValue placeholder="Chọn cây trồng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sầu riêng">Sầu riêng</SelectItem>
                  <SelectItem value="Xoài">Xoài</SelectItem>
                  <SelectItem value="Bưởi">Bưởi</SelectItem>
                  <SelectItem value="Thanh long">Thanh long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Giống cây trồng</Label>
            <Select
              value={formData.variety}
              onValueChange={(value) =>
                setFormData({ ...formData, variety: value })
              }
            >
              <SelectTrigger data-testid="select-variety">
                <SelectValue placeholder="Chọn giống" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthon">Sầu riêng Monthon</SelectItem>
                <SelectItem value="Ri6">Sầu riêng Ri6</SelectItem>
                <SelectItem value="Cát Hòa Lộc">Xoài Cát Hòa Lộc</SelectItem>
                <SelectItem value="Da xanh">Bưởi Da xanh</SelectItem>
                <SelectItem value="Ruột đỏ">Thanh long Ruột đỏ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
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
              <Label htmlFor="endDate">Ngày kết thúc</Label>
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
