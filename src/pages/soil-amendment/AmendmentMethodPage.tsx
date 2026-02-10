import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  FormDialog,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  type Column,
} from "@tankhang1/eco-shared-ui";

// --- Types ---
type MethodType = "chemical" | "biological" | "mechanical" | "cultural";
type DifficultyLevel = "dễ" | "trung bình" | "khó";
type CostLevel = "thấp" | "trung bình" | "cao";

interface AmendmentMethod {
  id: string;
  code: string;
  name: string;
  type: MethodType;
  target: string;
  description: string;
  implementation: string;
  difficulty: DifficultyLevel;
  cost: CostLevel;
  status: "active" | "inactive";
}

// --- Constants & Helpers ---
const INITIAL_DATA: AmendmentMethod[] = [
  {
    id: "1",
    code: "BP01",
    name: "Bón vôi bột",
    type: "chemical",
    target: "Đất chua (pH < 5.5)",
    description:
      "Sử dụng vôi bột (CaCO3) hoặc vôi tôi để trung hòa độ chua của đất, cung cấp Canxi và khử trùng.",
    implementation:
      "Rải đều vôi trên mặt ruộng, cày xới để trộn vào đất trước khi gieo trồng 15-20 ngày.",
    difficulty: "dễ",
    cost: "thấp",
    status: "active",
  },
  {
    id: "2",
    code: "BP02",
    name: "Bón phân hữu cơ hoai mục",
    type: "biological",
    target: "Đất bạc màu, nghèo dinh dưỡng",
    description:
      "Bổ sung chất hữu cơ giúp cải thiện kết cấu đất, tăng độ tơi xốp và khả năng giữ nước, giữ phân.",
    implementation:
      "Bón lót trong quá trình làm đất hoặc bón quanh gốc cây lâu năm.",
    difficulty: "trung bình",
    cost: "trung bình",
    status: "active",
  },
  {
    id: "3",
    code: "BP03",
    name: "Cày sâu, phơi ải",
    type: "mechanical",
    target: "Đất tích tụ mầm bệnh, nén chặt",
    description:
      "Cày lật đất sâu, phơi nắng để diệt mầm bệnh, trứng sâu hại và tăng cường quá trình khoáng hóa.",
    implementation:
      "Thực hiện vào mùa khô, cày lật đất và phơi nắng trong 2-4 tuần.",
    difficulty: "trung bình",
    cost: "thấp",
    status: "active",
  },
  {
    id: "4",
    code: "BP04",
    name: "Trồng cây họ Đậu che phủ",
    type: "biological",
    target: "Đất xói mòn, thiếu Đạm",
    description:
      "Trồng các loại đậu đỗ, lạc dại để che phủ đất, hạn chế cỏ dại và cố định đạm sinh học.",
    implementation: "Gieo hạt xen canh hoặc luân canh giữa các vụ trồng chính.",
    difficulty: "dễ",
    cost: "thấp",
    status: "active",
  },
  {
    id: "5",
    code: "BP05",
    name: "Rửa mặn",
    type: "mechanical",
    target: "Đất nhiễm mặn",
    description:
      "Sử dụng nước ngọt để hòa tan muối trong đất và đẩy chúng ra khỏi vùng rễ qua hệ thống thoát nước.",
    implementation:
      "Xây dựng hệ thống kênh mương, bơm nước ngọt vào ruộng và tháo nước mặn ra.",
    difficulty: "khó",
    cost: "cao",
    status: "active",
  },
  {
    id: "6",
    code: "BP06",
    name: "Sử dụng chế phẩm IMO",
    type: "biological",
    target: "Hệ vi sinh vật đất nghèo nàn",
    description:
      "Sử dụng các chủng vi sinh vật có lợi bản địa để phân giải chất hữu cơ và đối kháng nấm bệnh.",
    implementation:
      "Nhân nuôi chế phẩm và tưới vào đất hoặc trộn với phân hữu cơ.",
    difficulty: "khó",
    cost: "thấp",
    status: "active",
  },
];

const getTypeConfig = (type: MethodType) => {
  switch (type) {
    case "chemical":
      return {
        label: "Hóa học",
        className: "bg-blue-100 text-blue-700 border-blue-200",
      };
    case "biological":
      return {
        label: "Sinh học",
        className: "bg-green-100 text-green-700 border-green-200",
      };
    case "mechanical":
      return {
        label: "Cơ giới",
        className: "bg-amber-100 text-amber-700 border-amber-200",
      };
    case "cultural":
      return {
        label: "Canh tác",
        className: "bg-purple-100 text-purple-700 border-purple-200",
      };
    default:
      return {
        label: "Khác",
        className: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
};

const getLevelColor = (level: string, type: "cost" | "difficulty") => {
  if (type === "cost") {
    switch (level) {
      case "thấp":
        return "text-green-600 bg-green-50";
      case "trung bình":
        return "text-amber-600 bg-amber-50";
      case "cao":
        return "text-red-600 bg-red-50";
      default:
        return "text-slate-600";
    }
  } else {
    // difficulty
    switch (level) {
      case "dễ":
        return "text-green-600 bg-green-50";
      case "trung bình":
        return "text-blue-600 bg-blue-50";
      case "khó":
        return "text-red-600 bg-red-50";
      default:
        return "text-slate-600";
    }
  }
};

const AmendmentMethodPage = () => {
  const { toast } = useToast();
  const [data, setData] = useState<AmendmentMethod[]>(INITIAL_DATA);

  // States
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AmendmentMethod | null>(
    null,
  );

  const [formData, setFormData] = useState<Partial<AmendmentMethod>>({
    code: "",
    name: "",
    type: "biological",
    target: "",
    description: "",
    implementation: "",
    difficulty: "dễ",
    cost: "thấp",
    status: "active",
  });

  const filters = [
    {
      key: "type",
      label: "Loại",
      options: [
        { label: "Sinh học", value: "biological" },
        { label: "Hóa học", value: "chemical" },
        { label: "Cơ giới", value: "mechanical" },
        { label: "Canh tác", value: "cultural" },
      ],
    },
    {
      key: "difficulty",
      label: "Độ khó",
      options: [
        { label: "Dễ", value: "dễ" },
        { label: "Trung bình", value: "trung bình" },
        { label: "Khó", value: "khó" },
      ],
    },
    {
      key: "cost",
      label: "Chi phí",
      options: [
        { label: "Thấp", value: "thấp" },
        { label: "Trung bình", value: "trung bình" },
        { label: "Cao", value: "cao" },
      ],
    },
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Đang áp dụng", value: "active" },
        { label: "Ngưng", value: "inactive" },
      ],
    },
  ];

  // Handlers
  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      code: "",
      name: "",
      type: "biological",
      target: "",
      description: "",
      implementation: "",
      difficulty: "dễ",
      cost: "thấp",
      status: "active",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: AmendmentMethod) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setFormOpen(true);
  };

  const handleDelete = (item: AmendmentMethod) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleViewDetail = (item: AmendmentMethod) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.code) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ mã và tên phương pháp",
        variant: "destructive",
      });
      return;
    }

    if (selectedItem && formOpen) {
      // Edit mode
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? ({ ...item, ...formData } as AmendmentMethod)
            : item,
        ),
      );
      toast({ title: "Thành công", description: "Đã cập nhật phương pháp" });
    } else if (formOpen) {
      // Add mode
      const newItem: AmendmentMethod = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as AmendmentMethod;
      setData((prev) => [...prev, newItem]);
      toast({ title: "Thành công", description: "Đã thêm phương pháp mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setData((prev) => prev.filter((item) => item.id !== selectedItem.id));
      toast({ title: "Thành công", description: "Đã xóa phương pháp" });
    }
    setDeleteOpen(false);
  };

  // Columns Configuration
  const columns: Column<AmendmentMethod>[] = [
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
      label: "Phương pháp",
      render: (val, item) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-700">{val}</span>
          <span
            className="text-xs text-slate-500 truncate max-w-[200px]"
            title={item.target}
          >
            {item.target}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      label: "Phân loại",
      render: (val) => {
        const config = getTypeConfig(val as MethodType);
        return (
          <Badge
            variant="outline"
            className={`${config.className} border font-normal`}
          >
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "cost",
      label: "Chi phí",
      render: (val) => (
        <div
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(val as string, "cost")}`}
        >
          {val}
        </div>
      ),
    },
    {
      key: "difficulty",
      label: "Độ khó",
      render: (val) => (
        <div
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(val as string, "difficulty")}`}
        >
          {val}
        </div>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (val) => (
        <Badge
          variant={val === "active" ? "secondary" : "outline"}
          className={
            val === "active"
              ? "bg-green-50 text-green-700 hover:bg-green-100"
              : "text-slate-500"
          }
        >
          {val === "active" ? "Đang áp dụng" : "Ngưng"}
        </Badge>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Phương pháp cải tạo đất"
      description="Quản lý thư viện các biện pháp kỹ thuật xử lý đất"
      actions={
        <Button onClick={handleAdd} className="shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
      }
    >
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleViewDetail}
          searchPlaceholder="Tìm kiếm..."
          filters={filters}
        />
        {data.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <p>Không tìm thấy kết quả phù hợp cho bộ lọc hiện tại.</p>
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selectedItem ? "Cập nhật phương pháp" : "Thêm phương pháp mới"}
        onSubmit={handleSubmit}
        size="lg"
      >
        <div className="space-y-6">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 border-b pb-1 mb-2">
              Thông tin chung
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">
                  Mã <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="VD: BP01"
                  className="font-mono bg-slate-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">
                  Tên phương pháp <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: Bón vôi bột"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phân loại</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val: MethodType) =>
                    setFormData({ ...formData, type: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="biological">Sinh học</SelectItem>
                    <SelectItem value="chemical">Hóa học</SelectItem>
                    <SelectItem value="mechanical">Cơ giới</SelectItem>
                    <SelectItem value="cultural">Canh tác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: any) =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang áp dụng</SelectItem>
                    <SelectItem value="inactive">Ngưng áp dụng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 2: Technical Specs */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 border-b pb-1 mb-2">
              Thông số kỹ thuật
            </h4>
            <div className="space-y-2">
              <Label htmlFor="target">Vấn đề / Đối tượng xử lý</Label>
              <Input
                id="target"
                value={formData.target}
                onChange={(e) =>
                  setFormData({ ...formData, target: e.target.value })
                }
                placeholder="VD: Đất chua, mặn, bạc màu..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ước tính chi phí</Label>
                <Select
                  value={formData.cost}
                  onValueChange={(val: any) =>
                    setFormData({ ...formData, cost: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thấp">Thấp</SelectItem>
                    <SelectItem value="trung bình">Trung bình</SelectItem>
                    <SelectItem value="cao">Cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Độ khó kỹ thuật</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(val: any) =>
                    setFormData({ ...formData, difficulty: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dễ">Dễ (Nông dân tự làm)</SelectItem>
                    <SelectItem value="trung bình">
                      Trung bình (Cần hướng dẫn)
                    </SelectItem>
                    <SelectItem value="khó">Khó (Cần chuyên gia)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 3: Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 border-b pb-1 mb-2">
              Chi tiết thực hiện
            </h4>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả & Nguyên lý</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả chi tiết nguyên lý hoạt động..."
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="implementation">Quy trình thực hiện</Label>
              <Textarea
                id="implementation"
                value={formData.implementation}
                onChange={(e) =>
                  setFormData({ ...formData, implementation: e.target.value })
                }
                placeholder="Các bước triển khai cụ thể..."
                className="min-h-[100px] font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </FormDialog>

      {/* Delete Confirmation */}
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa phương pháp"
        description={`Bạn có chắc chắn muốn xóa phương pháp "${selectedItem?.name}"?`}
      />

      {/* View Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {selectedItem?.name}
              <Badge
                variant="outline"
                className="ml-2 font-normal text-xs uppercase tracking-wider"
              >
                {selectedItem?.code}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <div className="text-xs text-slate-500 font-medium uppercase mb-1">
                    Loại phương pháp
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${getTypeConfig(selectedItem.type).className} border-0`}
                  >
                    {getTypeConfig(selectedItem.type).label}
                  </Badge>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <div className="text-xs text-slate-500 font-medium uppercase mb-1">
                    Trạng thái
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${selectedItem.status === "active" ? "bg-green-500" : "bg-slate-400"}`}
                    />
                    <span className="text-sm font-medium">
                      {selectedItem.status === "active"
                        ? "Đang áp dụng"
                        : "Tạm ngưng"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-slate-900 mb-2">
                  Vấn đề xử lý
                </h4>
                <div className="text-sm text-slate-700 bg-amber-50 p-3 rounded border border-amber-100 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  {selectedItem.target}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-2">
                    Chi phí thực hiện
                  </h4>
                  <div
                    className={`inline-flex items-center px-2.5 py-1 rounded text-sm font-medium ${getLevelColor(selectedItem.cost, "cost")}`}
                  >
                    {selectedItem.cost.charAt(0).toUpperCase() +
                      selectedItem.cost.slice(1)}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-2">
                    Độ khó kỹ thuật
                  </h4>
                  <div
                    className={`inline-flex items-center px-2.5 py-1 rounded text-sm font-medium ${getLevelColor(selectedItem.difficulty, "difficulty")}`}
                  >
                    {selectedItem.difficulty.charAt(0).toUpperCase() +
                      selectedItem.difficulty.slice(1)}
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-1">
                    Mô tả & Nguyên lý
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-1">
                    Quy trình thực hiện
                  </h4>
                  <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border whitespace-pre-wrap font-mono">
                    {selectedItem.implementation}
                  </div>
                </div>
              </div>

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
};

export default AmendmentMethodPage;
