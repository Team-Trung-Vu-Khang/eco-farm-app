import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";

interface Pesticide {
  id: number;
  code: string;
  name: string;
  group: string;
  form: string;
  actionType: string;
  origin: string;
  activeIngredient: string;
  status: "active" | "inactive";
  createdAt: string;
}

const initialData: Pesticide[] = [
  {
    id: 1,
    code: "BVTV001",
    name: "Actara 25WG",
    group: "Thuốc trừ sâu",
    form: "WP (bột thấm nước)",
    actionType: "Nội hấp",
    origin: "Thuốc hóa học",
    activeIngredient: "Thiamethoxam 25%",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "BVTV002",
    name: "Score 250EC",
    group: "Thuốc trừ bệnh",
    form: "EC (nhũ dầu)",
    actionType: "Nội hấp",
    origin: "Thuốc hóa học",
    activeIngredient: "Difenoconazole 25%",
    status: "active",
    createdAt: "2024-01-11",
  },
  {
    id: 3,
    code: "BVTV003",
    name: "Gramoxone 20SL",
    group: "Thuốc trừ cỏ",
    form: "SL (dạng lỏng)",
    actionType: "Tiếp xúc",
    origin: "Thuốc hóa học",
    activeIngredient: "Paraquat 20%",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 4,
    code: "BVTV004",
    name: "Reasgant 3.6EC",
    group: "Thuốc trừ sâu",
    form: "EC (nhũ dầu)",
    actionType: "Tiếp xúc, vị độc",
    origin: "Thuốc sinh học",
    activeIngredient: "Abamectin 3.6%",
    status: "active",
    createdAt: "2024-01-13",
  },
  {
    id: 5,
    code: "BVTV005",
    name: "Tilt Super 300EC",
    group: "Thuốc trừ bệnh",
    form: "EC (nhũ dầu)",
    actionType: "Nội hấp",
    origin: "Thuốc hóa học",
    activeIngredient: "Propiconazole 15% + Difenoconazole 15%",
    status: "inactive",
    createdAt: "2024-01-14",
  },
];

const pesticideGroups = [
  "Thuốc trừ sâu",
  "Thuốc trừ bệnh",
  "Thuốc trừ cỏ",
  "Thuốc trừ chuột",
  "Thuốc trừ tuyến trùng",
  "Thuốc trừ ốc, nhện, rệp",
];

const pesticideForms = [
  "WP (bột thấm nước)",
  "EC (nhũ dầu)",
  "SC (huyền phù đậm đặc)",
  "SL (dạng lỏng)",
  "GR (dạng hạt)",
  "WG (hạt phân tán trong nước)",
];

const actionTypes = [
  "Tiếp xúc",
  "Vị độc",
  "Xông hơi",
  "Nội hấp (lưu dẫn)",
  "Tiếp xúc, vị độc",
];

const origins = [
  "Thuốc hóa học",
  "Thuốc sinh học",
  "Thuốc thảo mộc",
  "Thuốc khoáng",
];

export default function PesticidePage() {
  const { toast } = useToast();
  const [data, setData] = useState<Pesticide[]>(initialData);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<Pesticide | null>(null);
  const [deleteItem, setDeleteItem] = useState<Pesticide | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    group: "",
    form: "",
    actionType: "",
    origin: "",
    activeIngredient: "",
    usage: "",
  });

  const columns: Column<Pesticide>[] = [
    { key: "code", label: "Mã" },
    { key: "name", label: "Tên thuốc" },
    {
      key: "group",
      label: "Nhóm thuốc",
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    { key: "form", label: "Dạng thuốc" },
    { key: "origin", label: "Nguồn gốc" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "secondary"}>
          {value === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
  ];

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      group: "",
      form: "",
      actionType: "",
      origin: "",
      activeIngredient: "",
      usage: "",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: Pesticide) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      group: item.group,
      form: item.form,
      actionType: item.actionType,
      origin: item.origin,
      activeIngredient: item.activeIngredient,
      usage: "",
    });
    setFormOpen(true);
  };

  const handleDelete = (item: Pesticide) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (editItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editItem.id
            ? { ...item, ...formData, createdAt: item.createdAt }
            : item
        )
      );
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin thuốc BVTV",
      });
    } else {
      const newItem: Pesticide = {
        id: Date.now(),
        code: formData.code,
        name: formData.name,
        group: formData.group,
        form: formData.form,
        actionType: formData.actionType,
        origin: formData.origin,
        activeIngredient: formData.activeIngredient,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({ title: "Thành công", description: "Đã thêm thuốc BVTV mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa thuốc BVTV" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý thuốc BVTV"
      description="Quản lý danh mục thuốc bảo vệ thực vật"
      actions={
        <Button onClick={handleAdd} data-testid="add-pesticide">
          <Plus className="w-4 h-4 mr-2" />
          Thêm thuốc BVTV
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onView={(item) =>
          toast({ title: "Xem chi tiết", description: item.name })
        }
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm thuốc BVTV..."
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa thuốc BVTV" : "Thêm thuốc BVTV mới"}
        onSubmit={handleSubmit}
        size="xl"
      >
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Thông tin cơ bản</TabsTrigger>
            <TabsTrigger value="usage">Hướng dẫn sử dụng</TabsTrigger>
            <TabsTrigger value="documents">Tài liệu</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã thuốc</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="VD: BVTV001"
                  data-testid="input-code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Tên thuốc</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên thuốc"
                  data-testid="input-name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nhóm thuốc</Label>
                <Select
                  value={formData.group}
                  onValueChange={(value) =>
                    setFormData({ ...formData, group: value })
                  }
                >
                  <SelectTrigger data-testid="select-group">
                    <SelectValue placeholder="Chọn nhóm thuốc" />
                  </SelectTrigger>
                  <SelectContent>
                    {pesticideGroups.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Dạng thuốc</Label>
                <Select
                  value={formData.form}
                  onValueChange={(value) =>
                    setFormData({ ...formData, form: value })
                  }
                >
                  <SelectTrigger data-testid="select-form">
                    <SelectValue placeholder="Chọn dạng thuốc" />
                  </SelectTrigger>
                  <SelectContent>
                    {pesticideForms.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Đường tác động</Label>
                <Select
                  value={formData.actionType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, actionType: value })
                  }
                >
                  <SelectTrigger data-testid="select-actionType">
                    <SelectValue placeholder="Chọn đường tác động" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionTypes.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nguồn gốc</Label>
                <Select
                  value={formData.origin}
                  onValueChange={(value) =>
                    setFormData({ ...formData, origin: value })
                  }
                >
                  <SelectTrigger data-testid="select-origin">
                    <SelectValue placeholder="Chọn nguồn gốc" />
                  </SelectTrigger>
                  <SelectContent>
                    {origins.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activeIngredient">Thành phần hoạt chất</Label>
              <Textarea
                id="activeIngredient"
                value={formData.activeIngredient}
                onChange={(e) =>
                  setFormData({ ...formData, activeIngredient: e.target.value })
                }
                placeholder="Nhập thành phần hoạt chất"
                rows={2}
                data-testid="input-activeIngredient"
              />
            </div>
          </TabsContent>
          <TabsContent value="usage" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="usage">Hướng dẫn sử dụng (HDSD)</Label>
              <Textarea
                id="usage"
                value={formData.usage}
                onChange={(e) =>
                  setFormData({ ...formData, usage: e.target.value })
                }
                placeholder="Nhập hướng dẫn sử dụng chi tiết..."
                rows={10}
                className="font-mono text-sm"
                data-testid="input-usage"
              />
              <p className="text-xs text-muted-foreground">
                Hỗ trợ định dạng văn bản phong phú (Rich Text Editor)
              </p>
            </div>
          </TabsContent>
          <TabsContent value="documents" className="mt-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm font-medium mb-2">
                Kéo thả file hoặc click để tải lên
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Hỗ trợ PDF, Word, hình ảnh (tối đa 10MB)
              </p>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Chọn file
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
