import { useState } from "react";
import { useLocation } from "wouter";
import {
  Plus,
  Calendar as CalendarIcon,
  Package,
  X,
  Bug,
  FlaskConical,
  Wrench,
  ChevronLeft,
  CheckCircle2,
  Info,
  Layers,
  ClipboardList,
  AlertTriangle,
  FileCheck,
  Sprout,
  StickyNote,
  Search,
  User,
  Users,
  MapPin,
} from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  StepperForm,
  useToast,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Checkbox,
  ScrollArea,
  cn,
  type Step,
} from "@tankhang1/eco-shared-ui";

import useTaskStore, {
  type MaterialAllocation,
} from "../../stores/useTaskStore";
import usePlanStore from "../../stores/usePlanStore";
import usePersonnelStore from "../../stores/usePersonnelStore";
import useTeamStore from "../../stores/useTeamStore";
import useRegimenStore from "../../stores/useRegimenStore";

// Danh mục vật tư mẫu

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
] as const;

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

export default function TaskCreatePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const addTask = useTaskStore((state) => state.addTask);
  const plans = usePlanStore((state) => state.plans);
  const personnel = usePersonnelStore((state) => state.personnel);
  const teams = useTeamStore((state) => state.teams);
  const regimens = useRegimenStore((state) => state.regimens);

  const [formData, setFormData] = useState({
    code: "CV-" + Math.floor(1000 + Math.random() * 9000),
    name: "",
    objectiveType: "phat-sinh" as
      | "phat-sinh"
      | "theo-ke-hoach"
      | "cai-tao-dat"
      | "tri-benh",
    planId: "",
    planName: "",
    stage: "",
    regimenId: "",
    assignedType: "individual" as "individual" | "team",
    assignedTo: [] as string[],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    priority: "medium" as "low" | "medium" | "high",
    description: "",
    materials: [] as MaterialAllocation[],
  });

  const [isAssigneeDialogOpen, setIsAssigneeDialogOpen] = useState(false);
  const [searchAssignee, setSearchAssignee] = useState("");

  const [newMaterial, setNewMaterial] = useState({
    type: "fertilizer" as "fertilizer" | "pesticide" | "tool" | "other",
    name: "",
    quantity: "",
    unit: "kg",
  });

  const selectedPlan = plans.find((p) => String(p.id) === formData.planId);
  const availableStages = selectedPlan?.selectedStages || [];
  const availableAssignees =
    formData.assignedType === "team"
      ? teams.map((t) => ({ id: t.id, name: t.name, code: t.code, avatar: "" }))
      : personnel.map((p) => ({
          id: p.id,
          name: p.fullName,
          code: p.taxCode || `NV${String(p.id).padStart(3, "0")}`,
          avatar: p.avatar,
        }));

  const filteredAssignees = availableAssignees.filter(
    (a) =>
      a.name.toLowerCase().includes(searchAssignee.toLowerCase()) ||
      a.code.toLowerCase().includes(searchAssignee.toLowerCase()),
  );

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.quantity) return;
    setFormData((prev) => ({
      ...prev,
      materials: [
        ...prev.materials,
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
      materials: prev.materials.filter((m) => m.id !== id),
    }));
  };

  const handleComplete = () => {
    const taskData = {
      code: formData.code,
      name: formData.name,
      plan:
        formData.objectiveType === "theo-ke-hoach"
          ? formData.planName
          : formData.objectiveType === "cai-tao-dat" ||
              formData.objectiveType === "tri-benh"
            ? regimens.find((r) => r.id === formData.regimenId)?.name ||
              "Điều trị/Cải tạo"
            : "Công việc phát sinh",
      stage: formData.stage || "N/A",
      assignedTo: formData.assignedTo,
      assignedType: formData.assignedType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      priority: formData.priority,
      description: formData.description,
      materials: formData.materials,
    };

    addTask(taskData);
    toast({
      title: "Thành công",
      description: "Đã phân bổ công việc mới",
    });
    setLocation("/task");
  };

  const steps: Step[] = [
    {
      id: "objective",
      title: "Mục tiêu công việc",
      description: "Xác định loại và nội dung công việc",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mã công việc *</Label>
                    <Input
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      placeholder="VD: NV001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tên công việc *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="VD: Bón phân thúc đợt 1"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Nguồn gốc công việc *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        id: "theo-ke-hoach",
                        label: "Kế hoạch",
                        icon: Layers,
                        color: "blue",
                        borderColor: "border-blue-500",
                        bgColor: "bg-blue-50/50",
                        activeColor: "bg-blue-500",
                        textColor: "text-blue-700",
                        description: "Từ canh tác",
                      },
                      {
                        id: "phat-sinh",
                        label: "Phát sinh",
                        icon: Info,
                        color: "amber",
                        borderColor: "border-amber-500",
                        bgColor: "bg-amber-50/50",
                        activeColor: "bg-amber-500",
                        textColor: "text-amber-700",
                        description: "Ngoài kế hoạch",
                      },
                      {
                        id: "cai-tao-dat",
                        label: "Cải tạo đất",
                        icon: Sprout,
                        color: "green",
                        borderColor: "border-green-500",
                        bgColor: "bg-green-50/50",
                        activeColor: "bg-green-500",
                        textColor: "text-green-700",
                        description: "Theo phác đồ",
                      },
                      {
                        id: "tri-benh",
                        label: "Trị bệnh",
                        icon: Bug,
                        color: "red",
                        borderColor: "border-red-500",
                        bgColor: "bg-red-50/50",
                        activeColor: "bg-red-500",
                        textColor: "text-red-700",
                        description: "Xử lý dịch hại",
                      },
                    ].map((type) => (
                      <div
                        key={type.id}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            objectiveType: type.id as any,
                            planId: "",
                            stage: "",
                            regimenId: "",
                          })
                        }
                        className={cn(
                          "cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1 group relative overflow-hidden",
                          formData.objectiveType === type.id
                            ? `${type.borderColor} ${type.bgColor} ${type.textColor} shadow-md`
                            : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm",
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform",
                            formData.objectiveType === type.id
                              ? `${type.activeColor} text-white`
                              : "bg-slate-50 text-slate-400",
                          )}
                        >
                          <type.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-tight">
                          {type.label}
                        </span>
                        <span className="text-[10px] opacity-60 font-medium">
                          {type.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.objectiveType === "theo-ke-hoach" && (
                  <div className="grid grid-cols-2 gap-4 animation-fade-in">
                    <div className="space-y-2">
                      <Label>Chọn kế hoạch *</Label>
                      <Select
                        value={formData.planId}
                        onValueChange={(val) => {
                          const p = plans.find((p) => String(p.id) === val);
                          setFormData({
                            ...formData,
                            planId: val,
                            planName: p?.name || "",
                            stage: "",
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn kế hoạch..." />
                        </SelectTrigger>
                        <SelectContent>
                          {plans.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Chọn giai đoạn *</Label>
                      <Select
                        value={formData.stage}
                        onValueChange={(val) =>
                          setFormData({ ...formData, stage: val })
                        }
                        disabled={!formData.planId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giai đoạn..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStages.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {(formData.objectiveType === "cai-tao-dat" ||
                  formData.objectiveType === "tri-benh") && (
                  <div className="space-y-2 animation-fade-in">
                    <Label>
                      {formData.objectiveType === "cai-tao-dat"
                        ? "Phác đồ cải tạo đất áp dụng *"
                        : "Phác đồ trị bệnh áp dụng *"}
                    </Label>
                    <Select
                      value={formData.regimenId}
                      onValueChange={(val) =>
                        setFormData({ ...formData, regimenId: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={`Chọn phác đồ ${formData.objectiveType === "cai-tao-dat" ? "cải tạo" : "trị bệnh"}...`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {regimens
                          .filter((r) => r.type === formData.objectiveType)
                          .map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Loại phân công *</Label>
                    <Select
                      value={formData.assignedType}
                      onValueChange={(val: any) =>
                        setFormData({
                          ...formData,
                          assignedType: val,
                          assignedTo: [],
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
                  <div className="space-y-2">
                    <Label>
                      {formData.assignedType === "team" ? "Đội nhóm" : "Người"}{" "}
                      thực hiện *
                    </Label>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        onClick={() => setIsAssigneeDialogOpen(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Chọn{" "}
                        {formData.assignedType === "team"
                          ? "đội nhóm"
                          : "nhân sự"}
                        ...
                      </Button>

                      {/* Selected Assignees List */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {formData.assignedTo.map((name) => {
                          const item = availableAssignees.find(
                            (a) => a.name === name,
                          );
                          return (
                            <div
                              key={name}
                              className="flex items-center justify-between p-3 rounded-2xl border bg-white border-slate-100 group transition-all hover:border-primary/30 hover:shadow-md animate-in fade-in slide-in-from-bottom-2"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 overflow-hidden rounded-xl border bg-slate-50 shadow-sm flex items-center justify-center shrink-0">
                                  {formData.assignedType === "team" ? (
                                    <Users className="w-5 h-5 text-blue-500" />
                                  ) : item?.avatar ? (
                                    <img
                                      src={item.avatar}
                                      alt={name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <User className="w-5 h-5 text-emerald-500" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-800">
                                    {name}
                                  </p>
                                  {item && (
                                    <p className="text-[10px] text-slate-400 font-mono tracking-tighter">
                                      {item.code}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    assignedTo: prev.assignedTo.filter(
                                      (n) => n !== name,
                                    ),
                                  }))
                                }
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          );
                        })}
                        {formData.assignedTo.length === 0 && (
                          <div className="md:col-span-2 py-6 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center bg-slate-50/30">
                            <Users className="w-8 h-8 text-slate-200 mb-2" />
                            <p className="text-xs text-slate-400 font-medium italic">
                              Chưa có người tham gia
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignee Selection Dialog */}
                <Dialog
                  open={isAssigneeDialogOpen}
                  onOpenChange={setIsAssigneeDialogOpen}
                >
                  <DialogContent className="max-w-md p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-2">
                      <DialogTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Chọn{" "}
                        {formData.assignedType === "team"
                          ? "đội nhóm"
                          : "nhân sự"}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="p-6 pt-2 space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          placeholder="Tìm nhanh theo tên hoặc mã..."
                          className="pl-10"
                          value={searchAssignee}
                          onChange={(e) => setSearchAssignee(e.target.value)}
                        />
                      </div>

                      <ScrollArea className="h-[300px] border rounded-xl p-2 bg-slate-50/30">
                        <div className="space-y-1">
                          {filteredAssignees.map((a) => {
                            const isSelected = formData.assignedTo.includes(
                              a.name,
                            );
                            return (
                              <div
                                key={a.id}
                                className={cn(
                                  "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border",
                                  isSelected
                                    ? "bg-primary/5 border-primary/20"
                                    : "bg-white border-transparent hover:border-slate-200",
                                )}
                                onClick={() => {
                                  setFormData((prev) => {
                                    const next = isSelected
                                      ? prev.assignedTo.filter(
                                          (n) => n !== a.name,
                                        )
                                      : [...prev.assignedTo, a.name];
                                    return { ...prev, assignedTo: next };
                                  });
                                }}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => {}} // Handle in parent div click
                                />
                                <div className="h-10 w-10 overflow-hidden rounded-full border bg-slate-100 flex items-center justify-center shrink-0">
                                  {formData.assignedType === "team" ? (
                                    <Users className="w-5 h-5 text-blue-500" />
                                  ) : a.avatar ? (
                                    <img
                                      src={a.avatar}
                                      alt={a.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <User className="w-5 h-5 text-green-500" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-slate-700">
                                    {a.name}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {a.code}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-primary" />
                                )}
                              </div>
                            );
                          })}
                          {filteredAssignees.length === 0 && (
                            <div className="py-8 text-center text-slate-400">
                              <p className="text-sm italic">
                                Không tìm thấy kết quả nào
                              </p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>

                    <DialogFooter className="p-6 bg-slate-50 border-t">
                      <Button
                        className="w-full"
                        onClick={() => setIsAssigneeDialogOpen(false)}
                      >
                        Xác nhận ({formData.assignedTo.length})
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  Thời gian & Ưu tiên
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Ngày bắt đầu *</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ngày kết thúc *</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Độ ưu tiên *
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        id: "low",
                        label: "Thấp",
                        color: "emerald",
                        activeClass:
                          "bg-emerald-500 text-white border-emerald-500 shadow-emerald-200",
                        inactiveClass:
                          "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
                      },
                      {
                        id: "medium",
                        label: "Thường",
                        color: "amber",
                        activeClass:
                          "bg-amber-500 text-white border-amber-500 shadow-amber-200",
                        inactiveClass:
                          "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100",
                      },
                      {
                        id: "high",
                        label: "Cao",
                        color: "rose",
                        activeClass:
                          "bg-rose-500 text-white border-rose-500 shadow-rose-200",
                        inactiveClass:
                          "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100",
                      },
                    ].map((p) => (
                      <div
                        key={p.id}
                        onClick={() =>
                          setFormData({ ...formData, priority: p.id as any })
                        }
                        className={cn(
                          "cursor-pointer px-2 py-3 rounded-xl border-2 text-center text-[10px] font-black uppercase transition-all shadow-sm",
                          formData.priority === p.id
                            ? `${p.activeClass} scale-105`
                            : p.inactiveClass,
                        )}
                      >
                        {p.label}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <StickyNote className="w-5 h-5 text-primary" />
                  Ghi chú
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả chi tiết công việc..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "resources",
      title: "Nguồn lực vật tư",
      description: "Phân bổ phân bón, thuốc, dụng cụ",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Danh mục vật tư sử dụng
                </CardTitle>
                <Badge variant="outline">
                  {formData.materials.length} hạng mục
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.materials.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 group transition-all hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 animate-in fade-in zoom-in-95"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                            MATERIAL_TYPES.find((t) => t.id === item.type)?.bg,
                          )}
                        >
                          {(() => {
                            const Icon =
                              MATERIAL_TYPES.find((t) => t.id === item.type)
                                ?.icon || Package;
                            return (
                              <Icon
                                className={cn(
                                  "w-6 h-6",
                                  MATERIAL_TYPES.find((t) => t.id === item.type)
                                    ?.color,
                                )}
                              />
                            );
                          })()}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 leading-none mb-1">
                            {item.name}
                          </p>
                          <Badge
                            variant="secondary"
                            className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border-none"
                          >
                            {
                              MATERIAL_TYPES.find((t) => t.id === item.type)
                                ?.label
                            }
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-lg font-black text-emerald-600 leading-none">
                            {item.quantity}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {item.unit}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMaterial(item.id)}
                          className="h-10 w-10 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {formData.materials.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/30">
                      <div className="bg-white w-20 h-20 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 animate-bounce duration-[3s]">
                        <Package className="w-10 h-10 text-slate-200" />
                      </div>
                      <h3 className="text-slate-900 font-black text-lg">
                        Chưa có vật tư
                      </h3>
                      <p className="text-slate-400 text-sm max-w-[200px] mx-auto mt-1 leading-relaxed">
                        Hãy chọn và thêm vật tư cần thiết ở cột bên phải
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 shadow-md ring-1 ring-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Thêm vật tư mới
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
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
                        className={cn(
                          "cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center gap-2 transition-all relative group overflow-hidden",
                          isSelected
                            ? `${type.bg} ${type.border} shadow-sm border-2`
                            : "hover:bg-slate-50 border-slate-100",
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                            isSelected
                              ? `${type.color.replace("text-", "bg-").replace("500", "500")} text-white`
                              : "bg-slate-100 text-slate-400",
                          )}
                        >
                          <Icon className="w-5 h-5 shadow-sm" />
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-black uppercase tracking-wider",
                            isSelected ? type.color : "text-slate-500",
                          )}
                        >
                          {type.label}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1 right-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">
                      Tên vật tư
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
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vật tư..." />
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

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">
                        Số lượng
                      </Label>
                      <Input
                        type="number"
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
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">
                        Đơn vị
                      </Label>
                      <Select
                        value={newMaterial.unit}
                        onValueChange={(val) =>
                          setNewMaterial((prev) => ({ ...prev, unit: val }))
                        }
                      >
                        <SelectTrigger>
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
                  </div>

                  <Button
                    onClick={handleAddMaterial}
                    className="w-full h-11 shadow-sm mt-2"
                    disabled={!newMaterial.name || !newMaterial.quantity}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm vào danh sách
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "confirmation",
      title: "Xác nhận & Hoàn tất",
      description: "Kiểm tra lại toàn bộ thông tin",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-500" />
                  Xác nhận & Hoàn tất
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 p-8 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden mb-8">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center border border-emerald-100">
                          {formData.objectiveType === "tri-benh" ? (
                            <Bug className="w-6 h-6 text-rose-500" />
                          ) : formData.objectiveType === "cai-tao-dat" ? (
                            <Sprout className="w-6 h-6 text-emerald-500" />
                          ) : (
                            <ClipboardList className="w-6 h-6 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                            {formData.objectiveType === "theo-ke-hoach"
                              ? "Theo kế hoạch"
                              : formData.objectiveType === "cai-tao-dat"
                                ? "Cải tạo đất"
                                : formData.objectiveType === "tri-benh"
                                  ? "Trị bệnh"
                                  : "Công việc phát sinh"}
                          </p>
                          <h4 className="font-black text-slate-900 text-2xl tracking-tight">
                            {formData.name || "Tên công việc chưa đặt"}
                          </h4>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="bg-white/80 border-emerald-200 text-emerald-700 px-3 py-1 font-bold rounded-lg"
                        >
                          <CalendarIcon className="w-3.5 h-3.5 mr-1.5 opacity-60" />
                          {formData.startDate} - {formData.endDate}
                        </Badge>
                        <Badge
                          className={cn(
                            "px-3 py-1 font-bold rounded-lg border-transparent",
                            formData.priority === "high"
                              ? "bg-rose-500 text-white"
                              : formData.priority === "medium"
                                ? "bg-amber-500 text-white"
                                : "bg-emerald-500 text-white",
                          )}
                        >
                          Ưu tiên:{" "}
                          {formData.priority === "high"
                            ? "Cao"
                            : formData.priority === "medium"
                              ? "Thường"
                              : "Thấp"}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="inline-block p-2 bg-white/50 rounded-xl border border-emerald-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                          Mã định danh
                        </p>
                        <p className="font-mono font-bold text-slate-800">
                          {formData.code}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                      <Users className="w-4 h-4 text-emerald-500" />
                      Nhân sự thực hiện
                    </div>
                    <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
                      <div className="flex items-center -space-x-3 mb-2">
                        {formData.assignedTo.slice(0, 5).map((name, idx) => {
                          const item = availableAssignees.find(
                            (a) => a.name === name,
                          );
                          return (
                            <div
                              key={idx}
                              className="w-12 h-12 rounded-2xl border-4 border-white overflow-hidden bg-white shadow-sm flex items-center justify-center ring-1 ring-slate-100"
                              title={name}
                            >
                              {formData.assignedType === "team" ? (
                                <Users className="w-6 h-6 text-blue-500" />
                              ) : item?.avatar ? (
                                <img
                                  src={item.avatar}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-6 h-6 text-emerald-500" />
                              )}
                            </div>
                          );
                        })}
                        {formData.assignedTo.length > 5 && (
                          <div className="w-12 h-12 rounded-2xl border-4 border-white bg-slate-800 text-white flex items-center justify-center text-sm font-black shadow-sm ring-1 ring-slate-100">
                            +{formData.assignedTo.length - 5}
                          </div>
                        )}
                        {formData.assignedTo.length === 0 && (
                          <div className="w-12 h-12 rounded-2xl border-4 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-slate-800">
                          {formData.assignedTo.length > 0
                            ? formData.assignedTo.join(", ")
                            : "Không có ai được giao"}
                        </p>
                        <p className="text-xs text-slate-400 font-medium">
                          {formData.assignedType === "team"
                            ? "Thực hiện đại diện bởi đội nhóm"
                            : "Phân công cá nhân trực tiếp"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                      <Layers className="w-4 h-4 text-emerald-500" />
                      Chi tiết lộ trình
                    </div>
                    <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-100">
                          <MapPin className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase mb-0.5">
                            {formData.objectiveType === "theo-ke-hoach"
                              ? "Căn cứ kế hoạch"
                              : "Hình thức áp dụng"}
                          </p>
                          <p className="font-black text-slate-800">
                            {formData.objectiveType === "theo-ke-hoach"
                              ? formData.planName
                              : formData.objectiveType === "cai-tao-dat" ||
                                  formData.objectiveType === "tri-benh"
                                ? regimens.find(
                                    (r) => r.id === formData.regimenId,
                                  )?.name || "Chuyên biệt"
                                : "Phát sinh đột xuất tại vườn"}
                          </p>
                          <Badge
                            variant="secondary"
                            className="mt-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-2 py-0"
                          >
                            {formData.stage || "Toàn chu kỳ"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-900 text-white border-none shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform group-hover:scale-110">
                <Package className="w-48 h-48" />
              </div>
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="text-white flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Package className="w-5 h-5 text-emerald-400" />
                  </div>
                  Tóm tắt vật tư
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  {formData.materials.map((m) => (
                    <div
                      key={m.id}
                      className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-slate-300 text-sm font-medium">
                          {m.name}
                        </span>
                      </div>
                      <span className="font-black text-white bg-white/10 px-2 py-0.5 rounded text-xs">
                        {m.quantity} {m.unit}
                      </span>
                    </div>
                  ))}
                  {formData.materials.length === 0 && (
                    <div className="text-center py-6 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                      <p className="text-slate-500 italic text-xs">
                        Không có vật tư đi kèm
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-10">
                  <Button
                    onClick={handleComplete}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white border-none h-14 text-lg font-black shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] transition-all hover:translate-y-[-2px] active:translate-y-[0px]"
                  >
                    <CheckCircle2 className="w-6 h-6 mr-3" />
                    Xác nhận & Chốt Lịch
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Sau khi xác nhận, công việc sẽ được gửi thông báo đến người thực
                hiện. Bạn vẫn có thể chỉnh sửa sau này trong danh sách công
                việc.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Phân bổ công việc"
      description="Quy trình 3 bước lập lịch và quản lý nguồn lực"
      actions={
        <Button variant="ghost" onClick={() => setLocation("/task")}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Button>
      }
    >
      <div className="max-w-7xl mx-auto">
        <StepperForm
          steps={steps}
          onComplete={handleComplete}
          onCancel={() => setLocation("/task")}
        />
      </div>
    </AdminLayout>
  );
}
