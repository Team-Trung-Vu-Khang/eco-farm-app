import { useState } from "react";
import {
  AdminLayout,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  ScrollArea,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  type Column,
} from "@tankhang1/eco-shared-ui";
import {
  Clock,
  Sprout,
  Pickaxe,
  Leaf,
  Droplets,
  Recycle,
  AlertTriangle,
  ArrowRight,
  Info,
  LayoutGrid,
  List,
  Edit,
  Trash2,
  Eye,
  Plus,
  X,
  PlusCircle,
  Search,
  Check,
} from "lucide-react";

// Define Types
type ActivityType = "chemical" | "biological" | "mechanical" | "other";

type Activity = {
  text: string;
  type: ActivityType;
};

type AmendmentCycle = {
  id: string;
  type: "short" | "medium" | "long";
  title: string;
  duration: string;
  condition: string;
  conditionColor: string;
  activities: Activity[];
  outcome: string;
};

// Predefined Activities List for "Quick Select"
const PREDEFINED_ACTIVITIES: Activity[] = [
  { text: "Bón phân hữu cơ", type: "biological" },
  { text: "Bón phân chuồng hoai mục", type: "biological" },
  { text: "Bón vôi bột", type: "chemical" },
  { text: "Cày xới đất", type: "mechanical" },
  { text: "Phơi ải đất", type: "mechanical" },
  { text: "Trồng cây họ đậu", type: "biological" },
  { text: "Tưới tràn rửa mặn", type: "chemical" },
  { text: "Sử dụng chế phẩm IMO", type: "biological" },
  { text: "Che phủ bằng rơm rạ", type: "mechanical" },
  { text: "Làm rãnh thoát nước", type: "mechanical" },
];

// Helper to get Icon and Color based on Activity Type
const getActivityConfig = (type: ActivityType) => {
  switch (type) {
    case "biological":
      return {
        icon: Sprout,
        color: "text-green-600 bg-green-100",
        label: "Sinh học",
      };
    case "chemical":
      return {
        icon: Droplets,
        color: "text-blue-600 bg-blue-100",
        label: "Hóa học",
      };
    case "mechanical":
      return {
        icon: Pickaxe,
        color: "text-amber-600 bg-amber-100",
        label: "Cơ giới",
      };
    default:
      return {
        icon: Leaf,
        color: "text-slate-600 bg-slate-100",
        label: "Khác",
      };
  }
};

const AmendmentCyclePage = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [data, setData] = useState<AmendmentCycle[]>([
    {
      id: "1",
      type: "short",
      title: "Ngắn hạn",
      duration: "1 vụ – 1 năm",
      condition: "Đất thoái hóa nhẹ",
      conditionColor: "bg-green-100 text-green-800",
      activities: [
        { text: "Bón phân hữu cơ, phân chuồng hoai", type: "biological" },
        { text: "Bón vôi (đất chua)", type: "chemical" },
        { text: "Cày xới, phơi ải", type: "mechanical" },
        { text: "Luân canh cây trồng", type: "biological" },
      ],
      outcome: "Hiệu quả thấy rõ sau 1–2 vụ",
    },
    {
      id: "2",
      type: "medium",
      title: "Trung hạn",
      duration: "2–3 năm",
      condition: "Đất bạc màu, chai cứng",
      conditionColor: "bg-yellow-100 text-yellow-800",
      activities: [
        { text: "Tăng hữu cơ + vi sinh", type: "biological" },
        { text: "Trồng cây họ đậu cải tạo đất", type: "biological" },
        { text: "Hạn chế phân hóa học", type: "other" },
        { text: "Che phủ đất (rơm rạ, cây phủ xanh)", type: "mechanical" },
      ],
      outcome: "Đất tơi xốp dần, hệ vi sinh phục hồi",
    },
    {
      id: "3",
      type: "long",
      title: "Dài hạn",
      duration: "5–7 năm hoặc hơn",
      condition: "Đất thoái hóa nặng / nhiễm mặn – phèn",
      conditionColor: "bg-red-100 text-red-800",
      activities: [
        { text: "Cải tạo tổng hợp", type: "other" },
        { text: "Rửa mặn, hạ phèn", type: "chemical" },
        { text: "Phytoremediation (cây hấp thụ độc)", type: "biological" },
        { text: "Quản lý nước và canh tác bền vững", type: "mechanical" },
      ],
      outcome: "Cần theo dõi và lặp lại định kỳ",
    },
  ]);

  // Dialog States
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  // Selected Items
  const [editItem, setEditItem] = useState<AmendmentCycle | null>(null);
  const [deleteItem, setDeleteItem] = useState<AmendmentCycle | null>(null);
  const [detailItem, setDetailItem] = useState<AmendmentCycle | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<AmendmentCycle>>({
    title: "",
    type: "short",
    duration: "",
    condition: "",
    outcome: "",
    activities: [],
  });

  // Activity Selection State
  const [activitySearch, setActivitySearch] = useState("");
  const [isActivityListOpen, setIsActivityListOpen] = useState(false);
  const [customActivityType, setCustomActivityType] =
    useState<ActivityType>("biological");

  // Filtered Predefined Activities
  const filteredActivities = PREDEFINED_ACTIVITIES.filter((act) =>
    act.text.toLowerCase().includes(activitySearch.toLowerCase()),
  );

  // Column Definitions for Table View
  const columns: Column<AmendmentCycle>[] = [
    { key: "title", label: "Tên chu kỳ" },
    {
      key: "type",
      label: "Loại",
      render: (val) => (
        <Badge variant="secondary" className="uppercase">
          {val}
        </Badge>
      ),
    },
    { key: "duration", label: "Thời gian" },
    { key: "condition", label: "Điều kiện áp dụng" },
    { key: "outcome", label: "Kết quả dự kiến" },
  ];

  // Actions
  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      title: "",
      type: "short",
      duration: "",
      condition: "",
      outcome: "",
      activities: [],
    });
    setActivitySearch("");
    setIsActivityListOpen(false);
    setFormOpen(true);
  };

  const handleEdit = (item: AmendmentCycle) => {
    setEditItem(item);
    setFormData({ ...item });
    setActivitySearch("");
    setIsActivityListOpen(false);
    setFormOpen(true);
  };

  const handleDelete = (item: AmendmentCycle) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleViewDetail = (item: AmendmentCycle) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  const addActivity = (activity: Activity) => {
    setFormData((prev) => {
      // Prevent duplicates
      if (prev.activities?.some((a) => a.text === activity.text)) return prev;
      return {
        ...prev,
        activities: [...(prev.activities || []), activity],
      };
    });
    setActivitySearch(""); // Reset search after adding
    setIsActivityListOpen(false);
  };

  const handleAddCustomActivity = () => {
    if (!activitySearch.trim()) return;
    addActivity({ text: activitySearch.trim(), type: customActivityType });
  };

  const handleRemoveActivity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities?.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    const newItem: AmendmentCycle = {
      id: editItem ? editItem.id : Math.random().toString(36).substr(2, 9),
      title: formData.title || "",
      type: (formData.type as any) || "short",
      duration: formData.duration || "",
      condition: formData.condition || "",
      outcome: formData.outcome || "",
      activities: formData.activities || [],
      conditionColor:
        formData.type === "short"
          ? "bg-green-100 text-green-800"
          : formData.type === "medium"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800",
    };

    if (editItem) {
      setData((prev) =>
        prev.map((item) => (item.id === editItem.id ? newItem : item)),
      );
      toast({ title: "Thành công", description: "Đã cập nhật chu kỳ cải tạo" });
    } else {
      setData((prev) => [...prev, newItem]);
      toast({ title: "Thành công", description: "Đã tạo chu kỳ cải tạo mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa chu kỳ cải tạo" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Chu kỳ cải tạo đất"
      description="Quản lý các quy trình và thời gian phục hồi đất canh tác"
      actions={
        <div className="flex gap-2">
          <div className="bg-muted p-1 rounded-lg flex gap-1">
            <Button
              variant={viewMode === "card" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("card")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("table")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo chu kỳ mới
          </Button>
        </div>
      }
    >
      <ScrollArea className="h-full">
        <div className="p-6 max-w-7xl mx-auto space-y-8">
          {/* Introduction Section */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 flex gap-4 items-start">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600 shrink-0">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 text-lg mb-2">
                Thông tin chung
              </h3>
              <p className="text-blue-800/80 leading-relaxed text-sm">
                “Chu kỳ cải tạo đất” là khoảng thời gian và các bước lặp lại để
                phục hồi, nâng cao độ phì nhiêu – cấu trúc – sinh học của đất
                sau khi bị thoái hóa do canh tác, ô nhiễm hoặc sử dụng không hợp
                lý.
              </p>
            </div>
          </div>

          {/* View Content */}
          {viewMode === "card" ? (
            <div className="grid md:grid-cols-3 gap-6">
              {data.map((cycle) => (
                <Card
                  key={cycle.id}
                  className="flex flex-col border-none shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Decorative Background Element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />

                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="font-mono">
                        {cycle.type.toUpperCase()}
                      </Badge>
                      <div className="flex items-center text-xs font-semibold text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                        <Clock className="w-3 h-3 mr-1" />
                        {cycle.duration}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-primary">
                      {cycle.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col relative z-10">
                    <div className="mb-6">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Áp dụng khi
                      </div>
                      <div
                        className={`inline-block px-3 py-1.5 rounded-md text-sm font-medium ${cycle.conditionColor}`}
                      >
                        {cycle.condition}
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        Hoạt động chính
                      </div>
                      <ul className="space-y-2">
                        {cycle.activities.slice(0, 3).map((act, i) => {
                          const { icon: Icon, color } = getActivityConfig(
                            act.type,
                          );
                          return (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-slate-700"
                            >
                              <div
                                className={`mt-0.5 p-1 rounded-full shrink-0 ${color}`}
                              >
                                <Icon className="w-3 h-3" />
                              </div>
                              <span className="line-clamp-1">{act.text}</span>
                            </li>
                          );
                        })}
                        {cycle.activities.length > 3 && (
                          <li className="text-xs text-muted-foreground italic pl-6">
                            + {cycle.activities.length - 3} hoạt động khác
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-dashed">
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 p-3 rounded-lg">
                        <Sprout className="w-4 h-4" />
                        {cycle.outcome}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="ghost"
                        className="flex-1 group/btn hover:bg-primary/5 hover:text-primary"
                        onClick={() => handleViewDetail(cycle)}
                      >
                        Xem chi tiết
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 text-muted-foreground hover:text-primary"
                          onClick={() => handleEdit(cycle)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(cycle)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <CardContent className="p-0">
              <DataTable
                columns={[
                  ...columns,
                  {
                    key: "id",
                    label: "Hành động",
                    render: (_, item) => (
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleViewDetail(item as AmendmentCycle)
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(item as AmendmentCycle)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(item as AmendmentCycle)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ),
                  },
                ]}
                data={data}
                searchPlaceholder="Tìm kiếm..."
              />
            </CardContent>
          )}
        </div>
      </ScrollArea>

      {/* Create/Edit Form */}
      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa chu kỳ" : "Tạo chu kỳ mới"}
        onSubmit={handleSave}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tên chu kỳ</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="VD: Ngắn hạn"
              />
            </div>
            <div className="space-y-2">
              <Label>Loại</Label>
              <Select
                value={formData.type}
                onValueChange={(val) =>
                  setFormData({ ...formData, type: val as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Ngắn hạn</SelectItem>
                  <SelectItem value="medium">Trung hạn</SelectItem>
                  <SelectItem value="long">Dài hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Thời gian ước tính</Label>
            <Input
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              placeholder="VD: 1 vụ - 1 năm"
            />
          </div>

          <div className="space-y-2">
            <Label>Điều kiện áp dụng</Label>
            <Input
              value={formData.condition}
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value })
              }
              placeholder="VD: Đất thoái hóa nhẹ..."
            />
          </div>

          <div className="space-y-2">
            <Label>Kết quả dự kiến</Label>
            <Input
              value={formData.outcome}
              onChange={(e) =>
                setFormData({ ...formData, outcome: e.target.value })
              }
              placeholder="VD: Hiệu quả thấy rõ sau 1-2 vụ"
            />
          </div>

          <div className="space-y-2">
            <Label>Danh sách hoạt động</Label>

            {/* Activity Search / Add Area */}
            <div className="relative z-50">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={activitySearch}
                    onChange={(e) => {
                      setActivitySearch(e.target.value);
                      setIsActivityListOpen(true);
                    }}
                    onFocus={() => setIsActivityListOpen(true)}
                    placeholder="Tìm kiếm hoặc nhập hoạt động mới..."
                    className="pl-10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        // If search matches exactly one item in list, add it.
                        // If search matches nothing or multiple, and user wants to add custom... this logic can be complex.
                        // Let's simplify: Enter always tries to add "new" custom one if nothing selected,
                        // but we can just use the button for that for clarity.
                        handleAddCustomActivity();
                      }
                    }}
                  />
                </div>
              </div>

              {/* Dropdown Suggestions */}
              {isActivityListOpen && activitySearch && (
                <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg p-1 z-50 max-h-[200px] overflow-y-auto">
                  {filteredActivities.length > 0 ? (
                    <>
                      <div className="text-xs text-muted-foreground px-2 py-1 font-semibold">
                        Gợi ý có sẵn:
                      </div>
                      {filteredActivities.slice(0, 5).map((act, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 hover:bg-slate-50 cursor-pointer rounded text-sm"
                          onClick={() => addActivity(act)}
                        >
                          <div className="flex items-center gap-2">
                            {act.type === "biological" && (
                              <Sprout className="w-4 h-4 text-green-600" />
                            )}
                            {act.type === "chemical" && (
                              <Droplets className="w-4 h-4 text-blue-600" />
                            )}
                            {act.type === "mechanical" && (
                              <Pickaxe className="w-4 h-4 text-amber-600" />
                            )}
                            <span>{act.text}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            {getActivityConfig(act.type).label}
                          </Badge>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="p-3 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Không tìm thấy hoạt động này.
                      </p>
                      <div className="p-2 bg-slate-50 rounded border flex flex-col gap-2">
                        <span className="text-xs font-medium text-left">
                          Thêm mới hoạt động: "{activitySearch}"
                        </span>
                        <div className="flex gap-2">
                          <Select
                            value={customActivityType}
                            onValueChange={(v) =>
                              setCustomActivityType(v as ActivityType)
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="biological">
                                Sinh học
                              </SelectItem>
                              <SelectItem value="chemical">
                                Hóa học/Nước
                              </SelectItem>
                              <SelectItem value="mechanical">
                                Cơ giới
                              </SelectItem>
                              <SelectItem value="other">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            onClick={handleAddCustomActivity}
                            className="h-8"
                          >
                            <PlusCircle className="w-3.5 h-3.5 mr-1" /> Thêm
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {filteredActivities.length > 0 && (
                    <div className="border-t mt-1 pt-1 p-2 bg-slate-50 rounded flex flex-col gap-2">
                      <span className="text-xs font-medium text-left text-muted-foreground">
                        Hoặc thêm mới: "{activitySearch}"
                      </span>
                      <div className="flex gap-2">
                        <Select
                          value={customActivityType}
                          onValueChange={(v) =>
                            setCustomActivityType(v as ActivityType)
                          }
                        >
                          <SelectTrigger className="h-8 text-xs bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="biological">Sinh học</SelectItem>
                            <SelectItem value="chemical">
                              Hóa học/Nước
                            </SelectItem>
                            <SelectItem value="mechanical">Cơ giới</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={handleAddCustomActivity}
                          className="h-8 border bg-white hover:bg-slate-100"
                        >
                          <PlusCircle className="w-3.5 h-3.5 mr-1" /> Thêm mới
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Overlay to close dropdown if clicking outside */}
              {isActivityListOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsActivityListOpen(false)}
                />
              )}
            </div>

            <ScrollArea className="h-[150px] border rounded-md p-2 bg-slate-50 mt-2">
              {formData.activities && formData.activities.length > 0 ? (
                <ul className="space-y-2">
                  {formData.activities.map((act, idx) => {
                    const {
                      icon: Icon,
                      color,
                      label,
                    } = getActivityConfig(act.type);
                    return (
                      <li
                        key={idx}
                        className="flex justify-between items-center bg-white p-2 rounded border text-sm group animate-in fade-in slide-in-from-bottom-1 duration-200"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-full ${color}`}>
                            <Icon className="w-3 h-3" />
                          </div>
                          <span>{act.text}</span>
                          <Badge variant="outline" className="text-[10px] h-5">
                            {label}
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveActivity(idx)}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="flex flex-col justify-center items-center h-full text-muted-foreground text-sm opacity-60">
                  <Search className="w-8 h-8 mb-2 opacity-20" />
                  <p>Tìm kiếm và chọn các hoạt động mẫu</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </FormDialog>

      {/* Delete Confirmation */}
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chi tiết chu kỳ cải tạo</DialogTitle>
          </DialogHeader>
          {detailItem && (
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    {detailItem.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{detailItem.duration}</span>
                  </div>
                </div>
                <Badge
                  className="text-lg px-3 py-1 uppercase"
                  variant="outline"
                >
                  {detailItem.type}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Điều kiện áp dụng</h3>
                  <p
                    className={`p-2 rounded ${detailItem.conditionColor} bg-opacity-20`}
                  >
                    {detailItem.condition}
                  </p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  <h3 className="font-semibold mb-2 text-emerald-800">
                    Kết quả dự kiến
                  </h3>
                  <div className="flex items-start gap-2">
                    <Sprout className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <p className="text-emerald-700">{detailItem.outcome}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <List className="w-5 h-5" /> Danh sách hoạt động
                </h3>
                <div className="grid gap-3">
                  {detailItem.activities.map((act, i) => {
                    const {
                      icon: Icon,
                      color,
                      label,
                    } = getActivityConfig(act.type);
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm"
                      >
                        <div className={`p-2 rounded-full ${color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 h-5"
                            >
                              {label}
                            </Badge>
                          </div>
                          <span className="font-medium">{act.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AmendmentCyclePage;
