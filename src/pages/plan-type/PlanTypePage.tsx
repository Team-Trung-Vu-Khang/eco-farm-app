import { useState } from "react";
import { Plus } from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  FormDialog,
  Input,
  Label,
  Textarea,
  useToast,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface PlanType {
  id: number;
  code: string;
  name: string;
  category:
    | "cultivation"
    | "processing"
    | "distribution"
    | "financial"
    | "other";
  description: string;
  color: string;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  cultivation: "Canh tác & Sản xuất",
  processing: "Sơ chế & Chế biến",
  distribution: "Phân phối & Tiêu thụ",
  financial: "Tài chính & Kế toán",
  other: "Khác",
};

const PlanTypePage = () => {
  const { toast } = useToast();

  const [planTypes, setPlanTypes] = useState<PlanType[]>([
    {
      id: 1,
      code: "KHCT",
      name: "Kế hoạch canh tác",
      category: "cultivation",
      description:
        "Lập kế hoạch gieo trồng, chăm sóc và thu hoạch cho từng vụ mùa.",
      color: "#10b981", // emerald-500
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "KHCTD",
      name: "Kế hoạch cải tạo đất",
      category: "cultivation",
      description: "Các hoạt động xử lý đất, bón lót trước khi xuống giống.",
      color: "#f59e0b", // amber-500
      createdAt: "2024-01-11",
    },
    {
      id: 3,
      code: "KHBVTV",
      name: "Kế hoạch bảo vệ thực vật",
      category: "cultivation",
      description: "Lịch phun thuốc, phòng trừ sâu bệnh hại theo giai đoạn.",
      color: "#ef4444", // red-500
      createdAt: "2024-01-12",
    },
    {
      id: 4,
      code: "KHTH",
      name: "Kế hoạch thu hoạch",
      category: "cultivation",
      description: "Dự kiến thời gian, nhân sự và phương tiện thu hoạch.",
      color: "#3b82f6", // blue-500
      createdAt: "2024-01-13",
    },
    {
      id: 5,
      code: "KHSC",
      name: "Kế hoạch sơ chế",
      category: "processing",
      description: "Quy trình làm sạch, phân loại và đóng gói sau thu hoạch.",
      color: "#8b5cf6", // violet-500
      createdAt: "2024-01-14",
    },
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<PlanType | null>(null);
  const [deleteItem, setDeleteItem] = useState<PlanType | null>(null);

  const [formData, setFormData] = useState<Omit<PlanType, "id" | "createdAt">>({
    code: "",
    name: "",
    category: "cultivation",
    description: "",
    color: "#3b82f6",
  });

  const columns: Column<PlanType>[] = [
    {
      key: "code",
      label: "Mã loại",
      render: (value) => <span className="font-medium font-mono">{value}</span>,
    },
    {
      key: "name",
      label: "Tên loại kế hoạch",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: row.color }}
          />
          <span className="font-semibold">{value}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Nhóm",
      render: (value) => (
        <Badge variant="outline" className="bg-background">
          {CATEGORY_LABELS[value as string] || value}
        </Badge>
      ),
    },
    {
      key: "description",
      label: "Mô tả",
      render: (value) => (
        <span
          className="text-muted-foreground truncate max-w-[300px] block"
          title={value}
        >
          {value}
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      category: "cultivation",
      description: "",
      color: "#3b82f6",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: PlanType) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      category: item.category,
      description: item.description,
      color: item.color,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: PlanType) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.code || !formData.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập mã và tên loại kế hoạch",
        variant: "destructive",
      });
      return;
    }

    if (editItem) {
      setPlanTypes((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, ...formData } : item,
        ),
      );
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin loại kế hoạch đã được lưu.",
      });
    } else {
      const newItem: PlanType = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setPlanTypes((prev) => [...prev, newItem]);
      toast({
        title: "Thêm mới thành công",
        description: "Đã thêm loại kế hoạch mới vào danh sách.",
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setPlanTypes((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({
        title: "Đã xóa",
        description: `Đã xóa loại kế hoạch ${deleteItem.name}`,
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Loại Kế Hoạch"
      description="Quản lý các loại hình kế hoạch sản xuất, kinh doanh trong nông trại"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm loại kế hoạch
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={planTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm loại kế hoạch..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa loại kế hoạch" : "Thêm loại kế hoạch mới"}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="code"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              >
                Mã loại
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="VD: KHCT, BVTV..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Nhóm phân loại</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhóm" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Tên loại kế hoạch
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Kế hoạch vụ Đông Xuân..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Màu nhận diện</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả chi tiết</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Mô tả mục đích và phạm vi áp dụng của loại kế hoạch này..."
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa loại kế hoạch"
        description={`Bạn có chắc chắn muốn xóa loại kế hoạch "${deleteItem?.name}"? Hành động này không thể hoàn tác.`}
      />
    </AdminLayout>
  );
};

export default PlanTypePage;
