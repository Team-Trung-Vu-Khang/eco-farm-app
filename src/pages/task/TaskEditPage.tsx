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
  Clock,
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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

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
          quantity: String(newMaterial.quantity),
          unit: newMaterial.unit,
          type: newMaterial.type,
          stageId: formData.stage || "N/A",
          materialCategory: newMaterial.type,
          materialType: newMaterial.type,
          materialName: newMaterial.name,
        } as MaterialAllocation,
      ],
    }));
    setNewMaterial({
      type: newMaterial.type,
      name: "",
      quantity: "",
      unit: "kg",
    });
  };

  const handleAddMaterialFromStage = (item: any) => {
    setFormData((prev) => ({
      ...prev,
      materials: [
        ...prev.materials,
        {
          id: Date.now(),
          stageId: item.stageId || "",
          materialCategory: item.materialCategory || item.type || "other",
          materialType: item.materialType || item.type || "other",
          materialName: item.materialName || item.name || "",
          name: item.materialName || item.name || "",
          quantity: String(item.quantity) || "0",
          unit: item.unit || "kg",
          type: (item.materialType as any) || item.type || "other",
        } as MaterialAllocation,
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

                {/* Personnel responsible */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-500" />
                      Nhân sự thực hiện chính
                    </Label>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            assignedType: "individual",
                            assignedTo: [],
                          })
                        }
                        className={cn(
                          "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                          formData.assignedType === "individual"
                            ? "bg-white text-emerald-600 shadow-sm"
                            : "text-slate-400 hover:text-slate-600",
                        )}
                      >
                        Cá nhân
                      </button>
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            assignedType: "team",
                            assignedTo: [],
                          })
                        }
                        className={cn(
                          "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                          formData.assignedType === "team"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-slate-400 hover:text-slate-600",
                        )}
                      >
                        Đội nhóm
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {formData.assignedTo.length > 0 ? (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center -space-x-2">
                            {formData.assignedTo.slice(0, 3).map((name, i) => {
                              const p = availableAssignees.find(
                                (x) => x.name === name,
                              );
                              return (
                                <div
                                  key={i}
                                  className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200 shadow-sm shrink-0"
                                >
                                  {formData.assignedType === "team" ? (
                                    <Users className="w-5 h-5 m-2.5 text-blue-500" />
                                  ) : p?.avatar ? (
                                    <img
                                      src={p.avatar}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <User className="w-5 h-5 m-2.5 text-emerald-500" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 leading-none">
                              {formData.assignedTo.join(", ")}
                            </p>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1">
                              Đã chọn {formData.assignedTo.length}{" "}
                              {formData.assignedType === "team"
                                ? "đội"
                                : "nhân sự"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-primary"
                          onClick={() => setIsAssigneeDialogOpen(true)}
                        >
                          Thay đổi
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full h-20 border-2 border-dashed border-emerald-100 rounded-2xl hover:bg-emerald-50/50 hover:border-emerald-200 transition-all flex flex-col items-center justify-center gap-2 group"
                        onClick={() => setIsAssigneeDialogOpen(true)}
                      >
                        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Plus className="w-5 h-5 text-emerald-500" />
                        </div>
                        <span className="text-xs font-bold text-slate-400">
                          Chọn người thực hiện...
                        </span>
                      </Button>
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
      title:
        formData.objectiveType === "theo-ke-hoach" ||
        formData.objectiveType === "cai-tao-dat"
          ? "Phân bổ & Công việc"
          : formData.objectiveType === "phat-sinh"
            ? "Vật tư & Nhân sự"
            : "Vật tư & Phác đồ",
      description: "Hoạch định nguồn lực chi tiết",
      content: (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              {formData.objectiveType === "theo-ke-hoach" ||
              formData.objectiveType === "cai-tao-dat"
                ? "Định mức Vật tư & Giai đoạn"
                : formData.objectiveType === "phat-sinh"
                  ? "Vật tư & Công việc Phát sinh"
                  : "Vật tư & Công việc Điều trị"}
            </h3>
            <p className="text-slate-500 text-sm mt-1 max-w-lg mx-auto">
              {formData.objectiveType === "theo-ke-hoach" ||
              formData.objectiveType === "cai-tao-dat"
                ? "Thiết lập chi tiết các hạng mục đầu tư và quy trình kỹ thuật cho từng giai đoạn của mùa vụ."
                : formData.objectiveType === "phat-sinh"
                  ? "Phân bổ vật tư và nhân sự cần thiết cho công việc phát sinh ngoài kế hoạch."
                  : "Phân bổ vật tư và công việc cụ thể để thực hiện phác đồ điều trị đã chọn."}
            </p>
          </div>

          <div className="space-y-4">
            {formData.objectiveType === "theo-ke-hoach" ? (
              (formData.selectedStages.length > 0
                ? formData.selectedStages
                : [formData.stage || "Công việc chính"]
              ).map((stageName, idx) => (
                <StageAllocation
                  key={stageName}
                  stageName={stageName}
                  index={idx}
                  allocations={formData.materials.filter(
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
              ))
            ) : formData.objectiveType === "phat-sinh" ? (
              <StageAllocation
                key="phat-sinh"
                index={0}
                stageName="Công việc phát sinh"
                cycleName="Phát sinh"
                allocations={formData.materials.filter(
                  (m) => m.stageId === "Công việc phát sinh",
                )}
                tasks={formData.tasks.filter(
                  (t: any) => t.stageId === "Công việc phát sinh",
                )}
                onAddMaterial={(item) =>
                  handleAddMaterialFromStage(item as any)
                }
                onRemoveMaterial={handleRemoveMaterial}
                onAddTask={handleAddTask}
                onRemoveTask={handleRemoveTask}
              />
            ) : (
              (() => {
                const regimen = regimens.find(
                  (r) => r.id === formData.regimenId,
                );

                if (!regimen) {
                  return (
                    <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                      <p className="text-slate-400 font-medium italic">
                        Vui lòng chọn{" "}
                        {formData.objectiveType === "cai-tao-dat"
                          ? "quy trình cải tạo"
                          : "phác đồ điều trị"}{" "}
                        ở bước trước.
                      </p>
                    </div>
                  );
                }

                const stageName = regimen.name;
                const relevantMaterials = formData.materials.filter(
                  (m) => m.stageId === stageName,
                );
                const relevantTasks = formData.tasks.filter(
                  (t: any) => t.stageId === stageName,
                );

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animation-slide-up">
                    {/* --- LEFT SIDE: Task Addition --- */}
                    <div className="lg:col-span-7 space-y-5">
                      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            Danh mục đề xuất
                          </h4>
                          <Badge
                            variant="outline"
                            className="text-[9px] bg-slate-50"
                          >
                            {regimen.category}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          {regimen.steps?.map((step) => (
                            <button
                              key={step.id}
                              onClick={() =>
                                handleAddTask({
                                  stageId: stageName,
                                  name: step.title,
                                  description: step.description,
                                  labor: "Tùy chỉnh",
                                  duration: step.day,
                                })
                              }
                              className="w-full text-left p-3 rounded-2xl bg-slate-50 border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all group relative overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus className="w-4 h-4 text-primary" />
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 rounded uppercase">
                                  {step.day}
                                </span>
                                <span className="text-xs font-black text-slate-800">
                                  {step.title}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-1">
                                {step.description}
                              </p>
                            </button>
                          ))}
                          {(!regimen.steps || regimen.steps.length === 0) && (
                            <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                              <p className="text-[10px] text-slate-400 italic">
                                Không có công việc mẫu
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <StageAllocation
                        index={0}
                        stageName={stageName}
                        cycleName={
                          formData.objectiveType === "cai-tao-dat"
                            ? "Cải tạo đất"
                            : "Phác đồ điều trị"
                        }
                        allocations={relevantMaterials}
                        tasks={relevantTasks}
                        onAddMaterial={(item) =>
                          handleAddMaterialFromStage(item)
                        }
                        onRemoveMaterial={handleRemoveMaterial}
                        onAddTask={handleAddTask}
                        onRemoveTask={handleRemoveTask}
                      />
                    </div>

                    {/* --- RIGHT SIDE: Timeline --- */}
                    <div className="lg:col-span-5 bg-slate-900 rounded-xl p-8 text-white shadow-2xl relative overflow-hidden min-h-[500px]">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl" />

                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                            <Clock className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black tracking-tight leading-none mb-1">
                              Timeline chi tiết
                            </h4>
                            <p className="text-xs text-slate-400 font-medium">
                              Lộ trình kỹ thuật chuẩn của hệ thống
                            </p>
                          </div>
                        </div>

                        <div className="space-y-0 relative">
                          {/* Timeline Line */}
                          <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-linear-to-b from-primary via-slate-700 to-transparent" />

                          {regimen.steps?.map((step, idx) => (
                            <div
                              key={step.id}
                              className="relative pl-14 pb-10 last:pb-0"
                            >
                              <div
                                className={cn(
                                  "absolute -left-1 top-0 w-14 h-12 rounded-2xl bg-slate-800 border-4 border-slate-900 flex flex-col items-center justify-center z-10 transition-transform group-hover:scale-110 shadow-lg",
                                  idx === 0
                                    ? "bg-primary border-slate-900"
                                    : "",
                                )}
                              >
                                <span className="text-[8px] font-black uppercase text-white">
                                  {step.day}
                                </span>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-black text-base text-white">
                                    {step.title}
                                  </h5>
                                  {idx === 0 && (
                                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] font-black py-0">
                                      BẮT ĐẦU
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-md">
                                  {step.description}
                                </p>

                                {/* Task Status indicator in timeline */}
                                <div className="flex items-center gap-4 mt-3">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                      Sẵn sàng
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {(!regimen.steps || regimen.steps.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <CalendarIcon className="w-8 h-8 text-slate-700" />
                              </div>
                              <p className="text-sm font-bold italic">
                                Chưa có dữ liệu timeline
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
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
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Identity banner */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/40 p-6 shadow-sm">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow border border-emerald-100 flex items-center justify-center shrink-0">
                    {formData.objectiveType === "tri-benh" ? (
                      <Bug className="w-7 h-7 text-rose-500" />
                    ) : formData.objectiveType === "cai-tao-dat" ? (
                      <Sprout className="w-7 h-7 text-emerald-500" />
                    ) : formData.objectiveType === "phat-sinh" ? (
                      <Info className="w-7 h-7 text-amber-500" />
                    ) : (
                      <ClipboardList className="w-7 h-7 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600 mb-0.5">
                      {formData.objectiveType === "theo-ke-hoach"
                        ? "Theo kế hoạch"
                        : formData.objectiveType === "cai-tao-dat"
                          ? "Cải tạo đất"
                          : formData.objectiveType === "tri-benh"
                            ? "Điều trị bệnh"
                            : "Công việc phát sinh"}
                    </p>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">
                      {formData.name || (
                        <span className="text-slate-400 italic font-normal">
                          Chưa đặt tên
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Badge
                        variant="outline"
                        className="bg-white/80 border-slate-200 text-slate-600 text-[11px] px-2 py-0.5 font-medium rounded-md"
                      >
                        <CalendarIcon className="w-3 h-3 mr-1 opacity-50" />
                        {formData.startDate} → {formData.endDate}
                      </Badge>
                      <Badge
                        className={cn(
                          "text-[11px] px-2 py-0.5 font-bold rounded-md border-transparent",
                          formData.priority === "high"
                            ? "bg-rose-500 text-white"
                            : formData.priority === "medium"
                              ? "bg-amber-500 text-white"
                              : "bg-emerald-500 text-white",
                        )}
                      >
                        {formData.priority === "high"
                          ? "Ưu tiên cao"
                          : formData.priority === "medium"
                            ? "Ưu tiên thường"
                            : "Ưu tiên thấp"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Mã CV
                  </p>
                  <p className="font-mono text-sm font-bold text-slate-700 bg-white border border-slate-100 px-2.5 py-1 rounded-lg shadow-sm">
                    {formData.code}
                  </p>
                </div>
              </div>
            </div>

            {/* Info rows card */}
            <Card className="border-slate-100">
              <CardContent className="p-0 divide-y divide-slate-50">
                {/* Plan & Stages row */}
                {formData.objectiveType !== "phat-sinh" && (
                  <div className="flex items-start gap-4 px-5 py-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Layers className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                        Kế hoạch áp dụng
                      </p>
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {formData.planName || (
                          <span className="text-slate-400 italic font-normal">
                            Chưa chọn
                          </span>
                        )}
                      </p>
                      {formData.stage && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-blue-50 text-blue-700 border-none px-2 py-0 h-5 font-medium"
                          >
                            {formData.stage}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Personnel row */}
                <div className="flex items-start gap-4 px-5 py-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      {formData.assignedType === "team"
                        ? "Đội nhóm thực hiện"
                        : "Nhân sự thực hiện"}
                    </p>
                    {formData.assignedTo.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center -space-x-2.5">
                          {formData.assignedTo.slice(0, 6).map((name, idx) => {
                            const item = availableAssignees.find(
                              (a) => a.name === name,
                            );
                            return (
                              <div
                                key={idx}
                                title={name}
                                className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm flex items-center justify-center shrink-0"
                              >
                                {formData.assignedType === "team" ? (
                                  <Users className="w-4 h-4 text-blue-500" />
                                ) : item?.avatar ? (
                                  <img
                                    src={item.avatar}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="w-4 h-4 text-emerald-500" />
                                )}
                              </div>
                            );
                          })}
                          {formData.assignedTo.length > 6 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-700 text-white flex items-center justify-center text-[10px] font-black shadow-sm shrink-0">
                              +{formData.assignedTo.length - 6}
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-slate-700 truncate">
                          {formData.assignedTo.slice(0, 3).join(", ")}
                          {formData.assignedTo.length > 3
                            ? ` và ${formData.assignedTo.length - 3} người khác`
                            : ""}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic">
                        Chưa phân công
                      </p>
                    )}
                  </div>
                </div>

                {/* Supervisors row */}
                {formData.supervisors.length > 0 && (
                  <div className="flex items-start gap-4 px-5 py-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Shield className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Nhân sự quản lý
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.supervisors.map((name) => {
                          const p = personnel.find((x) => x.fullName === name);
                          return (
                            <div
                              key={name}
                              className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1"
                            >
                              <div className="w-5 h-5 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0">
                                {p?.avatar ? (
                                  <img
                                    src={p.avatar}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Shield className="w-3 h-3 text-blue-400" />
                                )}
                              </div>
                              <span className="text-xs font-semibold text-blue-800">
                                {name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quality Inspectors row */}
                {formData.qualityInspectors.length > 0 && (
                  <div className="flex items-start gap-4 px-5 py-4">
                    <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
                      <ClipboardCheck className="w-4 h-4 text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Kiểm định chất lượng
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.qualityInspectors.map((name) => {
                          const p = personnel.find((x) => x.fullName === name);
                          return (
                            <div
                              key={name}
                              className="flex items-center gap-1.5 bg-violet-50 border border-violet-100 rounded-lg px-2 py-1"
                            >
                              <div className="w-5 h-5 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0">
                                {p?.avatar ? (
                                  <img
                                    src={p.avatar}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ClipboardCheck className="w-3 h-3 text-violet-400" />
                                )}
                              </div>
                              <span className="text-xs font-semibold text-violet-800">
                                {name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Description row */}
                {formData.description && (
                  <div className="flex items-start gap-4 px-5 py-4">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                      <StickyNote className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                        Ghi chú
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {formData.description}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Materials compact list */}
            {formData.materials.length > 0 && (
              <Card className="border-slate-100">
                <CardHeader className="pb-3 pt-4 px-5">
                  <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-400" />
                    Vật tư đi kèm
                    <Badge
                      variant="secondary"
                      className="ml-auto text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0"
                    >
                      {formData.materials.length} mục
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4 pt-0">
                  <div className="divide-y divide-slate-50">
                    {formData.materials.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span className="text-sm text-slate-700 font-medium">
                            {m.name}
                          </span>
                          <span className="text-[11px] text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded font-mono text-[9px] uppercase">
                            {m.type}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-slate-800 bg-white border border-slate-100 px-2.5 py-0.5 rounded-lg shadow-sm">
                          {m.quantity} {m.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── RIGHT COLUMN: CTA + notice ── */}
          <div className="space-y-4">
            <Card className="bg-slate-900 border-none text-white shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
              <CardHeader className="border-b border-white/10 pb-4 relative">
                <CardTitle className="text-white text-sm flex items-center gap-2.5">
                  <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  Tóm tắt thay đổi
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-5 space-y-3 relative">
                {/* quick stats */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "Nhân sự",
                      value: formData.assignedTo.length || "—",
                      sub: formData.assignedType === "team" ? "đội" : "người",
                    },
                    {
                      label: "Vật tư",
                      value: formData.materials.length || "—",
                      sub: "danh mục",
                    },
                    {
                      label: "Mã định danh",
                      value: formData.code,
                      sub: "mã CV",
                    },
                    {
                      label: "Độ ưu tiên",
                      value:
                        formData.priority === "high"
                          ? "Cao"
                          : formData.priority === "medium"
                            ? "Thường"
                            : "Thấp",
                      sub: "mức độ",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white/5 rounded-xl px-3 py-2.5 border border-white/5"
                    >
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                        {stat.label}
                      </p>
                      <p className="text-lg font-black text-white leading-none truncate">
                        {stat.value}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {stat.sub}
                      </p>
                    </div>
                  ))}
                </div>

                {/* divider */}
                <div className="border-t border-white/10 pt-3">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-xs">Bắt đầu</span>
                      <span className="font-semibold text-slate-200 text-xs">
                        {formData.startDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-xs">Kết thúc</span>
                      <span className="font-semibold text-slate-200 text-xs">
                        {formData.endDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-1">
                  <Button
                    onClick={handleComplete}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white border-none h-12 text-base font-black shadow-[0_8px_24px_-8px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Lưu các thay đổi
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notice */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
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
