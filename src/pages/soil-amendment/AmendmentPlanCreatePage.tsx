import { useState, useMemo, useCallback, memo, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import {
  ClipboardList,
  FileCheck,
  Target,
  Banknote,
  MapPin,
  Check,
  Leaf,
  Package,
  Layers,
  Wrench,
  StickyNote,
  Plus,
  X,
  Info,
} from "lucide-react";
import {
  AdminLayout,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StepperForm,
  Textarea,
  useToast,
  type Step,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@tankhang1/eco-shared-ui";
import useAmendmentPlanStore, {
  type AllocationItem,
} from "../../stores/useAmendmentPlanStore";

// --- Mock Data ---

const LOCATIONS = [
  {
    id: "region-1",
    name: "Vùng A - Bình Phước",
    crop: "Sầu riêng",
    variety: "Ri6",
    zones: [
      {
        id: "zone-1-1",
        name: "Khu vực A1",
        plots: [
          {
            id: "plot-1-1-1",
            name: "Lô A1-01",
            area: 1.5,
            status: "problem",
            issue: "Nhiễm phèn",
            ph: 4.5,
          },
          {
            id: "plot-1-1-2",
            name: "Lô A1-02",
            area: 2.0,
            status: "problem",
            issue: "Bạc màu",
            ph: 5.2,
          },
        ],
      },
      {
        id: "zone-1-2",
        name: "Khu vực A2",
        plots: [
          {
            id: "plot-1-2-1",
            name: "Lô A2-01",
            area: 1.2,
            status: "ready",
            issue: "Bình thường",
            ph: 6.5,
          },
        ],
      },
    ],
  },
  {
    id: "region-2",
    name: "Vùng B - Đồng Nai",
    crop: "Xoài",
    variety: "Cát Hòa Lộc",
    zones: [
      {
        id: "zone-2-1",
        name: "Khu vực B1",
        plots: [
          {
            id: "plot-2-1-1",
            name: "Lô B1-01",
            area: 2.5,
            status: "problem",
            issue: "Nhiễm mặn",
            ph: 5.8,
          },
        ],
      },
    ],
  },
];

const AMENDMENT_PROCESSES = [
  {
    id: "proc-phen",
    name: "Cải tạo đất nhiễm phèn (Tiêu chuẩn)",
    type: "Hóa học + Thủy lợi",
    duration: 30,
    stages: [
      "Thau chua rửa mặn",
      "Bón vôi",
      "Cày ải phơi đất",
      "Bón lót hữu cơ",
    ],
  },
  {
    id: "proc-bacmau",
    name: "Phục hồi đất bạc màu",
    type: "Hữu cơ + Sinh học",
    duration: 45,
    stages: ["Cày sâu", "Trồng cây phân xanh", "Cày vùi", "Bổ sung vi sinh"],
  },
  {
    id: "proc-man",
    name: "Xử lý đất nhiễm mặn",
    type: "Thủy lợi",
    duration: 25,
    stages: ["Rửa mặn", "Bón vôi", "Nghỉ đất"],
  },
];

const TREATMENT_REGIMENS = [
  {
    id: "reg-phen-cap-toc",
    name: "Phác đồ khử phèn cấp tốc",
    description: "Sử dụng vôi nóng và bơm xả liên tục",
  },
  {
    id: "reg-phen-ben-vung",
    name: "Phác đồ khử phèn bền vững",
    description: "Kết hợp vôi, lân và hữu cơ vi sinh",
  },
  {
    id: "reg-man-rua-troi",
    name: "Phác đồ rửa mặn 3 bước",
    description: "Rửa trôi - Bón vôi - Trồng cây chịu mặn",
  },
];

const MATERIAL_OPTIONS = [
  { value: "Vôi bột", label: "Vôi bột (Xử lý pH)" },
  { value: "Lân nung chảy", label: "Lân nung chảy (Khử phèn)" },
  { value: "Phân chuồng hoai mục", label: "Phân chuồng hoai mục (Hữu cơ)" },
  { value: "Trichoderma", label: "Trichoderma (Nấm đối kháng)" },
  { value: "Humic Acid", label: "Humic Acid (Kích rễ)" },
  { value: "Kali Humate", label: "Kali Humate (Giảm mặn)" },
];

const TASK_OPTIONS = [
  { value: "Cày sâu 30cm", label: "Cày sâu 30cm" },
  { value: "Bón vôi rải mặt", label: "Bón vôi rải mặt" },
  { value: "Bơm thoát nước", label: "Bơm thoát nước" },
  { value: "Đánh rãnh thoát phèn", label: "Đánh rãnh thoát phèn" },
  { value: "Trồng cây che phủ", label: "Trồng cây che phủ" },
  { value: "Kiểm tra pH đất", label: "Kiểm tra pH đất (Định kỳ)" },
];

// --- Components ---

const StageAllocation = memo(
  ({
    stageName,
    index,
    items,
    onAdd,
    onRemove,
  }: {
    stageName: string;
    index: number;
    items: AllocationItem[];
    onAdd: (item: Omit<AllocationItem, "id">) => void;
    onRemove: (id: number) => void;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Form States
    const [matName, setMatName] = useState("");
    const [matQty, setMatQty] = useState("");
    const [matUnit, setMatUnit] = useState("kg");

    const [taskName, setTaskName] = useState("");
    const [taskLabor, setTaskLabor] = useState("2 người");
    const [taskTime, setTaskTime] = useState("");

    const handleAddMat = () => {
      if (!matName || !matQty) return;
      onAdd({
        stage: stageName,
        type: "material",
        name: matName,
        detail: `${matQty} ${matUnit}`,
      });
      setMatName("");
      setMatQty("");
    };

    const handleAddTask = () => {
      if (!taskName) return;
      onAdd({
        stage: stageName,
        type: "task",
        name: taskName,
        detail: taskLabor,
        subDetail: taskTime,
      });
      setTaskName("");
      setTaskTime("");
    };

    const materials = items.filter((i) => i.type === "material");
    const tasks = items.filter((i) => i.type === "task");

    return (
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col transition-all duration-200">
        <div
          className="bg-slate-50 px-4 py-3 border-b flex justify-between items-center cursor-pointer hover:bg-slate-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${isExpanded ? "bg-amber-600 text-white" : "bg-white border text-slate-500"}`}
            >
              {index + 1}
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">{stageName}</h4>
              <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Package className="w-3 h-3" /> {materials.length} vật tư
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1">
                  <Wrench className="w-3 h-3" /> {tasks.length} công việc
                </span>
              </div>
            </div>
          </div>
          <div
            className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
          >
            <StickyNote className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {isExpanded && (
          <div className="p-4 border-t border-slate-100 animation-fade-in">
            <Tabs defaultValue="materials">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="materials">Vật tư xử lý</TabsTrigger>
                <TabsTrigger value="tasks">Hoạt động thi công</TabsTrigger>
              </TabsList>

              <TabsContent value="materials" className="space-y-3">
                {materials.length === 0 && (
                  <p className="text-center text-xs text-slate-400 py-4 border border-dashed rounded">
                    Chưa có vật tư
                  </p>
                )}
                {materials.map((m) => (
                  <div
                    key={m.id}
                    className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded"
                  >
                    <span className="font-medium">{m.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-white">
                        {m.detail}
                      </Badge>
                      <button
                        onClick={() => onRemove(m.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex flex-1 gap-2 pt-2 border-t mt-2">
                  <Select value={matName} onValueChange={setMatName}>
                    <SelectTrigger className="w-full h-9 text-xs">
                      <SelectValue placeholder="Chọn vật tư..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MATERIAL_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    className="w-full h-9 text-xs"
                    placeholder="SL"
                    value={matQty}
                    onChange={(e) => setMatQty(e.target.value)}
                    type="number"
                  />
                  <Select value={matUnit} onValueChange={setMatUnit}>
                    <SelectTrigger className="w-20 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lít">lít</SelectItem>
                      <SelectItem value="bao">bao</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    className="h-9 px-2 bg-slate-800"
                    onClick={handleAddMat}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-3">
                {tasks.length === 0 && (
                  <p className="text-center text-xs text-slate-400 py-4 border border-dashed rounded">
                    Chưa có công việc
                  </p>
                )}
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded"
                  >
                    <span className="font-medium">{t.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {t.detail}
                      </Badge>
                      {t.subDetail && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-white"
                        >
                          {t.subDetail}
                        </Badge>
                      )}
                      <button
                        onClick={() => onRemove(t.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="space-y-2 pt-2 border-t mt-2">
                  <div className="flex gap-2">
                    <Select value={taskName} onValueChange={setTaskName}>
                      <SelectTrigger className="flex-1 h-9 text-xs">
                        <SelectValue placeholder="Chọn hoạt động..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      className="h-9 px-3 bg-slate-800"
                      onClick={handleAddTask}
                    >
                      <Plus className="w-4 h-4" /> Thêm
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      className="h-9 text-xs"
                      placeholder="Nhân sự (VD: 2 người)"
                      value={taskLabor}
                      onChange={(e) => setTaskLabor(e.target.value)}
                    />
                    <Input
                      className="h-9 text-xs"
                      placeholder="Thời gian (VD: 2 ngày)"
                      value={taskTime}
                      onChange={(e) => setTaskTime(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    );
  },
);

export default function AmendmentPlanCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [, params] = useRoute("/amendment-plan/:id/edit");
  const isEdit = !!params?.id;

  // Zustand store
  const addPlan = useAmendmentPlanStore((state) => state.addPlan);
  const updatePlan = useAmendmentPlanStore((state) => state.updatePlan);
  const getPlanById = useAmendmentPlanStore((state) => state.getPlanById);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    technician: "",
    priority: "medium",
    description: "",

    // Scope
    selectedRegionId: "",
    selectedZoneId: "",
    selectedZoneIds: [] as string[],
    crop: "",
    variety: "",
    selectedPlotIds: [] as string[],

    // Analysis
    currentPH: "",
    targetPH: "",
    targetIssue: "",

    // Process
    processId: "",
    regimenId: "", // New State for Treatment Regimen
    selectedStages: [] as string[],
    allocations: [] as AllocationItem[],

    // Time & Budget
    startDate: "",
    endDate: "",
    budget: "",
  });

  // Load existing plan data if editing
  useEffect(() => {
    if (isEdit && params?.id) {
      const existingPlan = getPlanById(Number(params.id));
      if (existingPlan) {
        setFormData({
          code: existingPlan.code,
          name: existingPlan.name,
          technician: existingPlan.technician,
          priority: existingPlan.priority || "medium",
          description: existingPlan.description || "",
          selectedRegionId: existingPlan.selectedRegionId || "", // Assuming this might be stored or derived
          selectedZoneId: "",
          selectedZoneIds: existingPlan.selectedZoneIds || [],
          crop: existingPlan.crop || "",
          variety: existingPlan.variety || "",
          selectedPlotIds: existingPlan.selectedPlotIds || [],
          currentPH: existingPlan.currentPH || "",
          targetPH: existingPlan.targetPH || "",
          targetIssue: existingPlan.target_issue,
          processId: existingPlan.processId || "",
          regimenId: existingPlan.regimenId || "",
          selectedStages: [],
          allocations: existingPlan.allocations || [],
          startDate: existingPlan.startDate,
          endDate: existingPlan.endDate,
          budget: String(existingPlan.budget),
        });
      }
    }
  }, [isEdit, params?.id, getPlanById]);

  const calculateArea = () => {
    let area = 0;
    LOCATIONS.forEach((r) =>
      r.zones.forEach((z) =>
        z.plots.forEach((p) => {
          if (formData.selectedPlotIds.includes(p.id)) area += p.area;
        }),
      ),
    );
    return area.toFixed(1);
  };

  const selectedProcess = useMemo(
    () => AMENDMENT_PROCESSES.find((p) => p.id === formData.processId),
    [formData.processId],
  );

  const handleProcessChange = (id: string) => {
    const proc = AMENDMENT_PROCESSES.find((p) => p.id === id);
    if (proc) {
      setFormData((prev) => ({
        ...prev,
        processId: id,
        selectedStages: proc.stages,
        name: prev.name || `Kế hoạch ${proc.name.toLowerCase()}`, // Auto suggest name
      }));
    }
  };

  const handleRegionChange = (regionId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const region = LOCATIONS.find((r) => r.id === regionId) as any;
    if (region) {
      const allZoneIds = region.zones.map((z: any) => z.id);
      const allPlotIds = region.zones.flatMap((z: any) =>
        z.plots.map((p: any) => p.id),
      );
      setFormData((prev) => ({
        ...prev,
        selectedRegionId: regionId,
        selectedZoneIds: allZoneIds,
        selectedPlotIds: allPlotIds,
        crop: region.crop || "",
        variety: region.variety || "",
      }));
    }
  };

  const handleAddAllocation = useCallback(
    (item: Omit<AllocationItem, "id">) => {
      setFormData((prev) => ({
        ...prev,
        allocations: [...prev.allocations, { id: Date.now(), ...item }],
      }));
    },
    [],
  );

  const handleRemoveAllocation = useCallback((id: number) => {
    setFormData((prev) => ({
      ...prev,
      allocations: prev.allocations.filter((i) => i.id !== id),
    }));
  }, []);

  const handleComplete = () => {
    let currentStatus: "planning" | "in_progress" | "completed" | "cancelled" =
      "planning";

    if (isEdit && params?.id) {
      const existing = getPlanById(Number(params.id));
      if (existing) currentStatus = existing.status;
    }

    const planData = {
      code: formData.code,
      name: formData.name,
      zone:
        LOCATIONS.find((r) => r.id === formData.selectedRegionId)?.name || "",
      target_issue: formData.targetIssue,
      technician: formData.technician,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: currentStatus,
      area: Number(calculateArea()),
      budget: Number(formData.budget) || 0,
      methodCount: formData.allocations.length,
      priority: formData.priority,
      description: formData.description,
      currentPH: formData.currentPH,
      targetPH: formData.targetPH,
      processId: formData.processId,
      regimenId: formData.regimenId,
      selectedRegionId: formData.selectedRegionId,
      selectedZoneIds: formData.selectedZoneIds,
      selectedPlotIds: formData.selectedPlotIds,
      crop: formData.crop,
      variety: formData.variety,
      allocations: formData.allocations,
    };

    if (isEdit && params?.id) {
      updatePlan(Number(params.id), planData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật kế hoạch cải tạo",
      });
    } else {
      addPlan(planData);
      toast({ title: "Thành công", description: "Đã tạo kế hoạch cải tạo" });
    }
    setLocation("/amendment-plan");
  };

  // --- Step Definitions ---

  const steps: Step[] = [
    {
      id: "general",
      title: "Thông tin chung",
      description: "Định danh và mức độ ưu tiên",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4 p-4 bg-amber-50 text-amber-900 rounded-lg border border-amber-100 mb-6">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <ClipboardList className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold">Thiết lập kế hoạch cải tạo</h3>
              <p className="text-sm text-amber-700">
                Xác định mục tiêu, phạm vi và người phụ trách để bắt đầu.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Mã kế hoạch <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: CT-2024-001"
              />
            </div>
            <div className="space-y-2">
              <Label>Mức độ ưu tiên</Label>
              <Select
                value={formData.priority}
                onValueChange={(v) => setFormData({ ...formData, priority: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="urgent">Khẩn cấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Tên kế hoạch <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Cải tạo đất phèn khu vực A1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phụ trách kỹ thuật</Label>
              <Select
                value={formData.technician}
                onValueChange={(v) =>
                  setFormData({ ...formData, technician: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhân sự..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nguyễn Văn A">Nguyễn Văn A</SelectItem>
                  <SelectItem value="Trần Thị B">Trần Thị B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kinh phí dự trù (VNĐ)</Label>
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mô tả chi tiết</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>
        </div>
      ),
      isValid: !!formData.code && !!formData.name,
    },
    {
      id: "scope",
      title: "Phạm vi & Cây trồng",
      description: "Chọn đất và giống cây",
      content: (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Vùng canh tác Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                    1
                  </span>
                  Chọn vùng canh tác
                </h3>
                <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-sm space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Vùng canh tác <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.selectedRegionId}
                      onValueChange={handleRegionChange}
                    >
                      <SelectTrigger className="bg-white border-emerald-200 h-12 text-base font-medium">
                        <SelectValue placeholder="Chọn vùng canh tác..." />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Chi tiết phạm vi - Read Only Hierarchy */}
              {formData.selectedRegionId && (
                <div className="space-y-4 animation-fade-in">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Chi tiết phạm vi canh tác
                  </h3>
                  <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-6">
                    {/* Zone & Plot Hierarchy List */}
                    <div className="space-y-4">
                      {LOCATIONS.find(
                        (r) => r.id === formData.selectedRegionId,
                      )?.zones.map((zone) => (
                        <div key={zone.id} className="space-y-2">
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Layers className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-slate-900">
                                {zone.name}
                              </span>
                            </div>
                            <Check className="w-4 h-4 text-emerald-500" />
                          </div>

                          {/* Plots within Zone */}
                          <div className="grid grid-cols-2 gap-2 pl-4">
                            {zone.plots.map((plot) => (
                              <div
                                key={plot.id}
                                className="flex items-center justify-between p-2 rounded-lg bg-slate-100/50 border border-slate-200/50"
                              >
                                <span className="text-sm text-slate-600 truncate mr-2">
                                  {plot.name}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] h-4 px-1.5 bg-white font-normal border-slate-200"
                                >
                                  {plot.area} ha
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Ghi chú Section */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Ghi chú</Label>
                <Textarea
                  placeholder="Nhập thông tin ghi chú thêm..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-white border-slate-200 min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Crop & Variety Selection */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  Thông tin cây trồng
                </h3>
                <div className="grid grid-cols-1 gap-4 p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Loại cây trồng <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      className="h-11 px-3 flex items-center border border-slate-200 rounded-md bg-slate-50 text-slate-600 font-medium"
                      value={formData.crop}
                      onChange={(e) =>
                        setFormData({ ...formData, crop: e.target.value })
                      }
                      placeholder="Nhập loại cây trồng..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Giống (Variety)
                    </Label>
                    <Input
                      className="h-11 px-3 flex items-center border border-slate-200 rounded-md bg-slate-50 text-slate-600 font-medium"
                      value={formData.variety}
                      onChange={(e) =>
                        setFormData({ ...formData, variety: e.target.value })
                      }
                      placeholder="Nhập giống cây..."
                    />
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  Tóm tắt phạm vi đã chọn
                </h3>
                <div className="bg-linear-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl text-white shadow-lg space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-emerald-100 text-xs font-semibold uppercase tracking-widest">
                        Đang chọn canh tác
                      </p>
                      <h4 className="text-xl font-bold leading-tight">
                        {LOCATIONS.find(
                          (r) => r.id === formData.selectedRegionId,
                        )?.name || "Chưa chọn vùng"}
                      </h4>
                      <p className="text-xs text-emerald-200 mt-0.5">
                        {formData.selectedPlotIds.length} lô đất •{" "}
                        {calculateArea()} ha
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-emerald-200">Khu vực đã chọn</span>
                      <span>{formData.selectedZoneIds.length} khu vực</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-emerald-200">Giống cây trồng</span>
                      <span className="bg-white/10 px-2 py-0.5 rounded text-xs uppercase">
                        {formData.variety || "Trống"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-3.5 h-3.5 text-emerald-200" />
                      <span className="text-xs font-bold text-emerald-100 uppercase tracking-wide">
                        Thông báo phạm vi
                      </span>
                    </div>
                    <p className="text-sm text-white leading-relaxed font-medium">
                      Kế hoạch này sẽ áp dụng cho tất cả các lô đất thuộc vùng
                      đã chọn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      isValid: formData.selectedPlotIds.length > 0 && !!formData.crop,
    },
    {
      id: "process",
      title: "Quy trình & Nguồn lực",
      description: "Phương pháp và phân bổ",
      content: (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-base">Quy trình áp dụng</Label>
              <Select
                value={formData.processId}
                onValueChange={handleProcessChange}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Chọn quy trình mẫu..." />
                </SelectTrigger>
                <SelectContent>
                  {AMENDMENT_PROCESSES.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-base">Phác đồ điều trị (nếu có)</Label>
              <Select
                value={formData.regimenId}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, regimenId: v }))
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Chọn phác đồ..." />
                </SelectTrigger>
                <SelectContent>
                  {TREATMENT_REGIMENS.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label>Bắt đầu</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Kết thúc</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {selectedProcess && (
            <div className="space-y-4 animation-fade-in">
              <div className="flex items-center justify-between">
                <Label>Chi tiết các giai đoạn xử lý</Label>
                <Badge variant="outline">
                  {formData.selectedStages.length} giai đoạn
                </Badge>
              </div>

              <div className="space-y-4">
                {formData.selectedStages.map((stage, idx) => (
                  <StageAllocation
                    key={idx}
                    stageName={stage}
                    index={idx}
                    items={formData.allocations.filter(
                      (a) => a.stage === stage,
                    )}
                    onAdd={handleAddAllocation}
                    onRemove={handleRemoveAllocation}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ),
      isValid: !!formData.processId,
    },
    {
      id: "confirmation",
      title: "Xác nhận & Kích hoạt",
      description: "Tổng quan kế hoạch",
      content: (
        <div className="max-w-6xl mx-auto space-y-8 animation-fade-in">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <FileCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Xác nhận Kế hoạch Cải tạo
            </h2>
            <p className="text-slate-500 mt-2">
              Kiểm tra thông tin trước khi ban hành
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step 1: Thông tin chung */}
            <Card className="h-full">
              <CardHeader className="pb-3 border-b bg-amber-50/50">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-900">
                  <div className="w-6 h-6 rounded bg-amber-100 flex items-center justify-center text-xs">
                    1
                  </div>
                  Thông tin chung
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-sm">
                <div>
                  <span className="text-slate-500 block mb-1">Mã & Tên</span>
                  <div className="font-medium text-slate-900">
                    <span className="text-amber-600 font-bold mr-2">
                      [{formData.code}]
                    </span>
                    {formData.name}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block mb-1">Ưu tiên</span>
                    <Badge
                      variant="outline"
                      className={
                        formData.priority === "urgent"
                          ? "text-red-600 bg-red-50 border-red-200"
                          : formData.priority === "high"
                            ? "text-orange-600 bg-orange-50 border-orange-200"
                            : "text-slate-600 bg-slate-50"
                      }
                    >
                      {formData.priority === "urgent"
                        ? "Khẩn cấp"
                        : formData.priority === "high"
                          ? "Cao"
                          : formData.priority === "medium"
                            ? "Trung bình"
                            : "Thấp"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Phụ trách</span>
                    <div className="font-medium">
                      {formData.technician || "N/A"}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">
                    Kinh phí dự trù
                  </span>
                  <div className="font-bold text-slate-900">
                    {formData.budget
                      ? `${Number(formData.budget).toLocaleString()} đ`
                      : "0 đ"}
                  </div>
                </div>
                {formData.description && (
                  <div className="bg-slate-50 p-3 rounded-lg text-slate-600 text-xs italic border border-slate-100">
                    "{formData.description}"
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Phạm vi & Cây trồng */}
            <Card className="h-full">
              <CardHeader className="pb-3 border-b bg-emerald-50/50">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-emerald-900">
                  <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center text-xs">
                    2
                  </div>
                  Phạm vi & Cây trồng
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-sm">
                <div>
                  <span className="text-slate-500 block mb-1">
                    Vùng canh tác
                  </span>
                  <div className="font-bold text-emerald-700 text-base">
                    {LOCATIONS.find((r) => r.id === formData.selectedRegionId)
                      ?.name || "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block mb-1">Quy mô</span>
                    <div className="font-medium">
                      {formData.selectedZoneIds.length} khu •{" "}
                      {formData.selectedPlotIds.length} lô
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Diện tích</span>
                    <div className="font-medium">{calculateArea()} ha</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Cây trồng:</span>
                    <span className="font-bold text-emerald-900">
                      {formData.crop || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-emerald-200 pt-2">
                    <span className="text-emerald-700">Giống:</span>
                    <span className="font-medium text-emerald-900">
                      {formData.variety || "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Quy trình & Nguồn lực */}
            <Card className="h-full">
              <CardHeader className="pb-3 border-b bg-blue-50/50">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-blue-900">
                  <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-xs">
                    3
                  </div>
                  Quy trình & Nguồn lực
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-sm">
                <div>
                  <span className="text-slate-500 block mb-1">
                    Quy trình áp dụng
                  </span>
                  <div className="font-medium text-blue-900">
                    {selectedProcess?.name || "Tùy chỉnh"}
                  </div>
                </div>
                {formData.regimenId && (
                  <div>
                    <span className="text-slate-500 block mb-1">
                      Phác đồ điều trị
                    </span>
                    <div className="font-medium">
                      {TREATMENT_REGIMENS.find(
                        (r) => r.id === formData.regimenId,
                      )?.name || "N/A"}
                    </div>
                  </div>
                )}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    {/* Replaced Calendar with Clock for better semantic if needed, but keeping simple */}
                    <span className="text-xs">📅</span>
                    <span>
                      {formData.startDate} - {formData.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <span>{formData.selectedStages.length} giai đoạn</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span>{formData.allocations.length} hạng mục phân bổ</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title={isEdit ? "Cập nhật kế hoạch cải tạo" : "Lập kế hoạch cải tạo mới"}
      description="Xây dựng phương án xử lý đất, phân bổ nguồn lực và giám sát thực hiện"
    >
      <div className="max-w-5xl mx-auto">
        <StepperForm
          steps={steps}
          onComplete={handleComplete}
          onCancel={() => setLocation("/amendment-plan")}
          completeLabel={isEdit ? "Cập nhật" : "Kích hoạt Kế hoạch"}
        />
      </div>
    </AdminLayout>
  );
}
