import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
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
  Trash2,
  Shield,
  ClipboardCheck,
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
import type { TaskAllocation } from "../plan/types";
import usePlanStore from "../../stores/usePlanStore";
import useAmendmentPlanStore from "../../stores/useAmendmentPlanStore";
import usePersonnelStore from "../../stores/usePersonnelStore";
import useTeamStore from "../../stores/useTeamStore";
import useRegimenStore from "../../stores/useRegimenStore";
import { StageAllocation } from "../plan/components/StageAllocation";

// Material data constants (keeping them local or importing if they move)
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

export default function TaskEditPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { getTaskById, updateTask } = useTaskStore();
  const plans = usePlanStore((state) => state.plans);
  const personnel = usePersonnelStore((state) => state.personnel);
  const teams = useTeamStore((state) => state.teams);
  const regimens = useRegimenStore((state) => state.regimens);

  const task = getTaskById(Number(id));

  const [formData, setFormData] = useState({
    code: "",
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
    supervisors: [] as string[],
    qualityInspectors: [] as string[],
    startDate: "",
    endDate: "",
    priority: "medium" as "low" | "medium" | "high",
    description: "",
    materials: [] as MaterialAllocation[],
    tasks: [] as TaskAllocation[],
    selectedStages: [] as string[],
  });

  useEffect(() => {
    if (task) {
      // Reconstruct objectiveType
      let objType: any = "phat-sinh";
      let pId = "";
      let rId = "";

      const planMatch = plans.find((p) => p.name === task.plan);
      if (planMatch) {
        objType = "theo-ke-hoach";
        pId = String(planMatch.id);
      } else {
        const regimenMatch = regimens.find((r) => r.name === task.plan);
        if (regimenMatch) {
          objType = regimenMatch.type;
          rId = regimenMatch.id;
        }
      }

      setFormData({
        code: task.code,
        name: task.name,
        objectiveType: objType,
        planId: pId,
        planName: task.plan,
        stage: task.stage === "N/A" ? "" : task.stage,
        regimenId: rId,
        assignedType: task.assignedType,
        assignedTo: task.assignedTo,
        supervisors: task.supervisors || [],
        qualityInspectors: task.qualityInspectors || [],
        startDate: task.startDate,
        endDate: task.endDate,
        priority: task.priority,
        description: task.description,
        materials: task.materials || [],
        tasks: (task as any).tasks || [],
        selectedStages:
          task.stage && task.stage !== "N/A"
            ? task.stage.split(", ").filter(Boolean)
            : [],
      });
    }
  }, [task, plans, regimens]);

  const [isAssigneeDialogOpen, setIsAssigneeDialogOpen] = useState(false);
  const [searchAssignee, setSearchAssignee] = useState("");
  const [isSupervisorDialogOpen, setIsSupervisorDialogOpen] = useState(false);
  const [searchSupervisor, setSearchSupervisor] = useState("");
  const [isInspectorDialogOpen, setIsInspectorDialogOpen] = useState(false);
  const [searchInspector, setSearchInspector] = useState("");
  const [newMaterial, setNewMaterial] = useState({
    type: "fertilizer" as "fertilizer" | "pesticide" | "tool" | "other",
    name: "",
    quantity: "",
    unit: "kg",
  });

  if (!task) return <div>Không tìm thấy công việc</div>;

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

  const handleAddMaterialFromStage = (
    item: Omit<MaterialAllocation, "id" | "quantity" | "type">,
  ) => {
    setFormData((prev) => ({
      ...prev,
      materials: [
        ...prev.materials,
        {
          id: Date.now(),
          name: (item as any).materialName || "",
          quantity: Number((item as any).quantity) || 0,
          unit: (item as any).unit || "kg",
          type: (item as any).materialType || "other",
        },
      ],
    }));
  };

  const handleAddTask = (item: Omit<TaskAllocation, "id">) => {
    setFormData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { id: Date.now(), ...item }],
    }));
  };

  const handleRemoveTask = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  };

  const handleRemoveMaterial = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((m) => m.id !== id),
    }));
  };

  const handleComplete = () => {
    const updates = {
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
      supervisors: formData.supervisors,
      qualityInspectors: formData.qualityInspectors,
      startDate: formData.startDate,
      endDate: formData.endDate,
      priority: formData.priority,
      description: formData.description,
      materials: formData.materials,
    };

    updateTask(task.id, updates);
    toast({
      title: "Cập nhật thành công",
      description: "Đã lưu thay đổi công việc",
    });
    setLocation("/task");
  };

  const steps: Step[] = [
    {
      id: "objective",
      title: "Mục tiêu công việc",
      description: "Điều chỉnh loại và nội dung công việc",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-emerald-500" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-slate-400">
                      Mã công việc *
                    </Label>
                    <Input
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      placeholder="VD: NV001"
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-slate-400">
                      Tên công việc *
                    </Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="VD: Bón phân thúc đợt 1"
                      className="rounded-xl border-slate-200"
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
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase text-slate-400">
                        Chọn kế hoạch *
                      </Label>
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
                        <SelectTrigger className="rounded-xl">
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
                      <Label className="text-xs font-black uppercase text-slate-400">
                        Chọn giai đoạn *
                      </Label>
                      <Select
                        value={formData.stage}
                        onValueChange={(val) =>
                          setFormData({ ...formData, stage: val })
                        }
                        disabled={!formData.planId}
                      >
                        <SelectTrigger className="rounded-xl">
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
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-xs font-black uppercase text-slate-400">
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
                      <SelectTrigger className="rounded-xl">
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

                {/* Nhân sự quản lý */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      Nhân sự quản lý
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
                      onClick={() => setIsSupervisorDialogOpen(true)}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Thêm
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {formData.supervisors.map((name) => {
                      const item = personnel.find((p) => p.fullName === name);
                      return (
                        <div
                          key={name}
                          className="flex items-center justify-between p-3 rounded-2xl border bg-blue-50/30 border-blue-100 group hover:border-blue-200 transition-all animate-in fade-in"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm flex items-center justify-center shrink-0">
                              {item?.avatar ? (
                                <img
                                  src={item.avatar}
                                  alt={name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Shield className="w-4 h-4 text-blue-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 leading-none">
                                {name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {item?.taxCode || "Quản lý"}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                supervisors: prev.supervisors.filter(
                                  (n) => n !== name,
                                ),
                              }))
                            }
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      );
                    })}
                    {formData.supervisors.length === 0 && (
                      <div className="py-5 border-2 border-dashed border-blue-100 rounded-2xl flex flex-col items-center justify-center bg-blue-50/20">
                        <Shield className="w-6 h-6 text-blue-200 mb-1" />
                        <p className="text-xs text-slate-400 italic">
                          Chưa có nhân sự quản lý
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Kiểm định chất lượng */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-violet-500" />
                      Kiểm định chất lượng
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs rounded-xl border-violet-200 text-violet-600 hover:bg-violet-50"
                      onClick={() => setIsInspectorDialogOpen(true)}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Thêm
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {formData.qualityInspectors.map((name) => {
                      const item = personnel.find((p) => p.fullName === name);
                      return (
                        <div
                          key={name}
                          className="flex items-center justify-between p-3 rounded-2xl border bg-violet-50/30 border-violet-100 group hover:border-violet-200 transition-all animate-in fade-in"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm flex items-center justify-center shrink-0">
                              {item?.avatar ? (
                                <img
                                  src={item.avatar}
                                  alt={name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ClipboardCheck className="w-4 h-4 text-violet-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 leading-none">
                                {name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {item?.taxCode || "Kiểm định"}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                qualityInspectors:
                                  prev.qualityInspectors.filter(
                                    (n) => n !== name,
                                  ),
                              }))
                            }
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      );
                    })}
                    {formData.qualityInspectors.length === 0 && (
                      <div className="py-5 border-2 border-dashed border-violet-100 rounded-2xl flex flex-col items-center justify-center bg-violet-50/20">
                        <ClipboardCheck className="w-6 h-6 text-violet-200 mb-1" />
                        <p className="text-xs text-slate-400 italic">
                          Chưa có nhân sự kiểm định
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Supervisor Dialog */}
                <Dialog
                  open={isSupervisorDialogOpen}
                  onOpenChange={setIsSupervisorDialogOpen}
                >
                  <DialogContent className="max-w-md p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-3 border-b">
                      <DialogTitle className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" /> Chọn nhân
                        sự quản lý
                      </DialogTitle>
                    </DialogHeader>
                    <div className="px-5 pb-3 pt-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <Input
                          placeholder="Tìm theo tên..."
                          className="pl-9 h-9 text-sm"
                          value={searchSupervisor}
                          onChange={(e) => setSearchSupervisor(e.target.value)}
                        />
                      </div>
                    </div>
                    <ScrollArea className="h-[300px] px-3">
                      <div className="space-y-1 pb-2">
                        {personnel
                          .filter((p) =>
                            p.fullName
                              .toLowerCase()
                              .includes(searchSupervisor.toLowerCase()),
                          )
                          .map((p) => {
                            const isSelected = formData.supervisors.includes(
                              p.fullName,
                            );
                            return (
                              <button
                                key={p.id}
                                type="button"
                                className={cn(
                                  "w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left",
                                  isSelected
                                    ? "bg-blue-50 border-blue-200"
                                    : "bg-white border-transparent hover:border-slate-200",
                                )}
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    supervisors: isSelected
                                      ? prev.supervisors.filter(
                                          (n) => n !== p.fullName,
                                        )
                                      : [...prev.supervisors, p.fullName],
                                  }))
                                }
                              >
                                <div className="h-9 w-9 overflow-hidden rounded-full border bg-slate-100 flex items-center justify-center shrink-0">
                                  {p.avatar ? (
                                    <img
                                      src={p.avatar}
                                      alt={p.fullName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <User className="w-4 h-4 text-blue-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-slate-800 truncate">
                                    {p.fullName}
                                  </p>
                                  <p className="text-[11px] text-slate-400 truncate">
                                    {p.taxCode || "—"}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </ScrollArea>
                    <DialogFooter className="p-4 bg-slate-50 border-t">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setIsSupervisorDialogOpen(false)}
                      >
                        Xác nhận ({formData.supervisors.length})
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Inspector Dialog */}
                <Dialog
                  open={isInspectorDialogOpen}
                  onOpenChange={setIsInspectorDialogOpen}
                >
                  <DialogContent className="max-w-md p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-3 border-b">
                      <DialogTitle className="flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4 text-violet-500" />{" "}
                        Chọn nhân sự kiểm định chất lượng
                      </DialogTitle>
                    </DialogHeader>
                    <div className="px-5 pb-3 pt-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <Input
                          placeholder="Tìm theo tên..."
                          className="pl-9 h-9 text-sm"
                          value={searchInspector}
                          onChange={(e) => setSearchInspector(e.target.value)}
                        />
                      </div>
                    </div>
                    <ScrollArea className="h-[300px] px-3">
                      <div className="space-y-1 pb-2">
                        {personnel
                          .filter((p) =>
                            p.fullName
                              .toLowerCase()
                              .includes(searchInspector.toLowerCase()),
                          )
                          .map((p) => {
                            const isSelected =
                              formData.qualityInspectors.includes(p.fullName);
                            return (
                              <button
                                key={p.id}
                                type="button"
                                className={cn(
                                  "w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left",
                                  isSelected
                                    ? "bg-violet-50 border-violet-200"
                                    : "bg-white border-transparent hover:border-slate-200",
                                )}
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    qualityInspectors: isSelected
                                      ? prev.qualityInspectors.filter(
                                          (n) => n !== p.fullName,
                                        )
                                      : [...prev.qualityInspectors, p.fullName],
                                  }))
                                }
                              >
                                <div className="h-9 w-9 overflow-hidden rounded-full border bg-slate-100 flex items-center justify-center shrink-0">
                                  {p.avatar ? (
                                    <img
                                      src={p.avatar}
                                      alt={p.fullName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <User className="w-4 h-4 text-violet-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-slate-800 truncate">
                                    {p.fullName}
                                  </p>
                                  <p className="text-[11px] text-slate-400 truncate">
                                    {p.taxCode || "—"}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </ScrollArea>
                    <DialogFooter className="p-4 bg-slate-50 border-t">
                      <Button
                        className="w-full bg-violet-600 hover:bg-violet-700"
                        onClick={() => setIsInspectorDialogOpen(false)}
                      >
                        Xác nhận ({formData.qualityInspectors.length})
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-emerald-500" />
                  Thời gian & Ưu tiên
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400">
                    Ngày bắt đầu *
                  </Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="rounded-xl border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400">
                    Ngày kết thúc *
                  </Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="rounded-xl border-slate-200"
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

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <StickyNote className="w-5 h-5 text-emerald-500" />
                  Ghi chú
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả chi tiết công việc..."
                  rows={4}
                  className="rounded-2xl border-slate-200 italic"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "resources",
      title: "Vật tư & Nhân sự",
      description: "Phân bổ vật tư và nhân sự theo giai đoạn",
      content: (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Vật tư & Công việc Thực hiện
            </h3>
            <p className="text-slate-500 text-sm mt-1 max-w-lg mx-auto">
              Chỉnh sửa vật tư và phân công nhân sự cho từng giai đoạn công
              việc.
            </p>
          </div>
          <div className="space-y-4">
            {(formData.selectedStages.length > 0
              ? formData.selectedStages
              : [formData.stage || "Công việc chính"]
            ).map((stageName, idx) => (
              <StageAllocation
                key={stageName}
                stageName={stageName}
                index={idx}
                allocations={(formData.materials as any[]).filter(
                  (m) => m.stageId === stageName,
                )}
                tasks={formData.tasks.filter((t) => t.stageId === stageName)}
                onAddMaterial={(item) =>
                  handleAddMaterialFromStage(item as any)
                }
                onRemoveMaterial={handleRemoveMaterial}
                onAddTask={handleAddTask}
                onRemoveTask={handleRemoveTask}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "confirmation",
      title: "Xác nhận & Lưu",
      description: "Kiểm tra và hoàn tất chỉnh sửa",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm rounded-[32px] overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-500" /> Xác nhận &
                  Cập nhật
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="bg-linear-to-br from-emerald-50 to-teal-50/30 p-8 rounded-[40px] border border-emerald-100 shadow-sm relative overflow-hidden mb-8">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-[20px] bg-white shadow-md flex items-center justify-center border border-emerald-50 ring-4 ring-emerald-500/5">
                          {formData.objectiveType === "tri-benh" ? (
                            <Bug className="w-7 h-7 text-rose-500" />
                          ) : formData.objectiveType === "cai-tao-dat" ? (
                            <Sprout className="w-7 h-7 text-emerald-500" />
                          ) : (
                            <ClipboardList className="w-7 h-7 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">
                            {formData.objectiveType === "theo-ke-hoach"
                              ? "Theo kế hoạch"
                              : formData.objectiveType === "cai-tao-dat"
                                ? "Cải tạo đất"
                                : formData.objectiveType === "tri-benh"
                                  ? "Trị bệnh"
                                  : "Công việc phát sinh"}
                          </p>
                          <h4 className="font-black text-slate-900 text-2xl tracking-tighter">
                            {formData.name || "Tên công việc"}
                          </h4>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Badge
                          variant="outline"
                          className="bg-white/80 border-emerald-200 text-emerald-700 px-3 py-1.5 font-bold rounded-xl shadow-sm"
                        >
                          <CalendarIcon className="w-3.5 h-3.5 mr-2 opacity-60" />
                          {formData.startDate} - {formData.endDate}
                        </Badge>
                        <Badge
                          className={cn(
                            "px-4 py-1.5 font-black uppercase text-[10px] tracking-widest rounded-xl border-none shadow-md",
                            formData.priority === "high"
                              ? "bg-rose-500 text-white"
                              : formData.priority === "medium"
                                ? "bg-amber-500 text-white"
                                : "bg-emerald-500 text-white",
                          )}
                        >
                          Ưu tiên: {formData.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-block p-3 bg-white/50 rounded-2xl border border-emerald-50 backdrop-blur-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">
                          Mã định danh
                        </p>
                        <p className="font-mono font-bold text-slate-800 text-lg">
                          {formData.code}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-[2px] ml-2">
                      <Users className="w-4 h-4 text-emerald-500" /> Nhân sự
                      thực hiện
                    </div>
                    <div className="p-6 rounded-[32px] border border-slate-100 bg-slate-50/50 space-y-4">
                      {/* Top-level assignedTo */}
                      {formData.assignedTo.length > 0 && (
                        <>
                          <div className="flex items-center -space-x-3 mb-2">
                            {formData.assignedTo
                              .slice(0, 5)
                              .map((name, idx) => {
                                const item = availableAssignees.find(
                                  (a) => a.name === name,
                                );
                                return (
                                  <div
                                    key={idx}
                                    className="w-12 h-12 rounded-[18px] border-4 border-white overflow-hidden bg-white shadow-sm flex items-center justify-center ring-1 ring-slate-100"
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
                              <div className="w-12 h-12 rounded-[18px] border-4 border-white bg-slate-800 text-white flex items-center justify-center text-sm font-black ring-1 ring-slate-100">
                                +{formData.assignedTo.length - 5}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-base leading-tight mb-0.5">
                              {formData.assignedTo.join(", ")}
                            </p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                              {formData.assignedType === "team"
                                ? "Thực hiện bởi đội nhóm"
                                : "Phân công cá nhân trực tiếp"}
                            </p>
                          </div>
                        </>
                      )}
                      {/* Stage-level tasks personnel */}
                      {formData.tasks.length > 0 && (
                        <div className="border-t border-slate-100 pt-4 space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                            Nhân sự theo công việc
                          </p>
                          {formData.tasks.map((t) => (
                            <div key={t.id} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-700 truncate">
                                  {t.name}
                                </p>
                                {t.labor && (
                                  <p className="text-[11px] text-slate-500">
                                    {t.labor}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {formData.assignedTo.length === 0 &&
                        formData.tasks.length === 0 && (
                          <p className="font-black text-slate-400 text-sm italic">
                            Chưa phân công
                          </p>
                        )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-[2px] ml-2">
                      <Layers className="w-4 h-4 text-emerald-500" /> Chi tiết
                      lộ trình
                    </div>
                    <div className="p-6 rounded-[32px] border border-slate-100 bg-slate-50/50 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-50 ring-1 ring-slate-100">
                          <MapPin className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                            {formData.objectiveType === "theo-ke-hoach"
                              ? "Căn cứ kế hoạch"
                              : "Hình thức áp dụng"}
                          </p>
                          <p className="font-black text-slate-800 truncate max-w-[180px]">
                            {formData.objectiveType === "theo-ke-hoach"
                              ? formData.planName
                              : formData.objectiveType === "cai-tao-dat" ||
                                  formData.objectiveType === "tri-benh"
                                ? regimens.find(
                                    (r) => r.id === formData.regimenId,
                                  )?.name || "Chuyên biệt"
                                : "Phát sinh đột xuất"}
                          </p>
                          <Badge className="mt-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter">
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
            <Card className="bg-slate-900 text-white border-none shadow-2xl rounded-[32px] overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform group-hover:scale-110 pointer-events-none">
                <Package className="w-48 h-48" />
              </div>
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="text-white flex items-center gap-3">
                  <div className="p-2.5 bg-white/10 rounded-xl">
                    <Package className="w-5 h-5 text-emerald-400" />
                  </div>{" "}
                  Tóm tắt vật tư
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 space-y-4 relative z-10">
                <div className="space-y-3 min-h-[120px]">
                  {formData.materials.map((m) => (
                    <div
                      key={m.id}
                      className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 -mx-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-slate-200 text-sm font-bold tracking-tight">
                          {m.name}
                        </span>
                      </div>
                      <span className="font-black text-white bg-white/10 px-3 py-1 rounded-xl text-[10px] uppercase">
                        {m.quantity} {m.unit}
                      </span>
                    </div>
                  ))}
                  {formData.materials.length === 0 && (
                    <div className="text-center py-10 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                      <p className="text-slate-500 italic text-xs">
                        Không có vật tư đi kèm
                      </p>
                    </div>
                  )}
                </div>
                <div className="pt-12">
                  <Button
                    onClick={handleComplete}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white border-none h-16 text-lg font-black rounded-2xl shadow-xl shadow-emerald-500/20 active:translate-y-1 transition-all"
                  >
                    <CheckCircle2 className="w-6 h-6 mr-3" /> Lưu thay đổi
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="p-5 bg-amber-50 rounded-[24px] border border-amber-100 flex items-start gap-4 ring-1 ring-amber-500/5 shadow-sm shadow-amber-500/5">
              <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
              <p className="text-[11px] text-amber-800 font-bold leading-relaxed uppercase tracking-tighter">
                Lưu ý: Bạn đang ở chế độ chỉnh sửa. Mọi thay đổi về thời gian và
                phân công sẽ được gửi thông báo cập nhật mới nhất cho nhân sự
                liên quan.
              </p>
            </div>
            <Button
              variant="ghost"
              className="w-full h-12 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl flex items-center justify-center gap-2 group transition-all"
              onClick={() => {
                if (confirm("Xác nhận xóa công việc này?")) {
                  useTaskStore.getState().deleteTask(task.id);
                  toast({
                    title: "Đã xóa",
                    description: "Công việc đã được gỡ bỏ khỏi hệ thống.",
                  });
                  setLocation("/task");
                }
              }}
            >
              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">
                Xóa công việc
              </span>
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Chỉnh sửa công việc"
      description={`Cập nhật thông tin cho mã: ${task.code}`}
      actions={
        <Button
          variant="ghost"
          onClick={() => setLocation("/task")}
          className="rounded-xl"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
      }
    >
      <div className="max-w-7xl mx-auto pb-20">
        <StepperForm
          steps={steps}
          onComplete={handleComplete}
          onCancel={() => setLocation("/task")}
        />
      </div>

      {/* Dialog Selection (Reuse Assignee Dialog) */}
      <Dialog
        open={isAssigneeDialogOpen}
        onOpenChange={setIsAssigneeDialogOpen}
      >
        <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-[32px]">
          <DialogHeader className="p-8 pb-4 bg-slate-50/50">
            <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight">
              <Users className="w-6 h-6 text-emerald-500" /> Chọn người thực
              hiện
            </DialogTitle>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Danh sách{" "}
              {formData.assignedType === "team"
                ? "đội nhóm"
                : "nhân sự kỹ thuật"}
            </p>
          </DialogHeader>
          <div className="p-8 pt-4 space-y-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                placeholder="Tìm nhanh theo tên hoặc mã..."
                className="pl-11 h-12 rounded-xl border-slate-200 focus:border-emerald-500 transition-all font-medium"
                value={searchAssignee}
                onChange={(e) => setSearchAssignee(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[350px] border-none pr-4">
              <div className="space-y-2">
                {filteredAssignees.map((a) => {
                  const isSelected = formData.assignedTo.includes(a.name);
                  return (
                    <div
                      key={a.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-2",
                        isSelected
                          ? "bg-emerald-50 border-emerald-500/20 shadow-sm"
                          : "bg-white border-transparent hover:border-slate-100 hover:bg-slate-50",
                      )}
                      onClick={() => {
                        setFormData((prev) => {
                          const next = isSelected
                            ? prev.assignedTo.filter((n) => n !== a.name)
                            : [...prev.assignedTo, a.name];
                          return { ...prev, assignedTo: next };
                        });
                      }}
                    >
                      <Checkbox
                        checked={isSelected}
                        className="rounded-md border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-none"
                      />
                      <div className="h-11 w-11 overflow-hidden rounded-[15px] border-2 border-white shadow-sm bg-slate-100 flex items-center justify-center shrink-0">
                        {formData.assignedType === "team" ? (
                          <Users className="w-5 h-5 text-blue-500" />
                        ) : a.avatar ? (
                          <img
                            src={a.avatar}
                            alt={a.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-emerald-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-slate-800 leading-none mb-1">
                          {a.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono tracking-tighter">
                          {a.code}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter className="p-8 bg-slate-900 border-none">
            <Button
              className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black text-lg shadow-xl active:translate-y-1 transition-all"
              onClick={() => setIsAssigneeDialogOpen(false)}
            >
              Xác nhận ({formData.assignedTo.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
