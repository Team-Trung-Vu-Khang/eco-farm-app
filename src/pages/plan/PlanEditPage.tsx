import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StepperForm,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  useToast,
  type Step,
} from "@tankhang1/eco-shared-ui";
import {
  AlertTriangle,
  Check,
  ClipboardList,
  Clock,
  FileCheck,
  Info,
  Layers,
  Leaf,
  MapPin,
  Package,
  Plus,
  Sprout,
  StickyNote,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import usePlanStore, {
  type MaterialAllocation,
  type Plan,
  type TaskAllocation,
} from "../../stores/usePlanStore";
import { GROWTH_CYCLES, SEASONS, getCyclesByCrop } from "./constants";

// --- Mock Data for Location Hierarchy (Same as Create Page) ---
const LOCATIONS = [
  {
    id: "pr-1",
    name: "Vùng canh tác Sầu riêng Ri6 - Bình Phước",
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
            status: "ready",
            soilType: "Đất đỏ Bazan",
            slope: "3-5%",
          },
          {
            id: "plot-1-1-2",
            name: "Lô A1-02",
            area: 2.0,
            status: "active",
            soilType: "Đất thịt nhẹ",
            slope: "<3%",
          },
        ],
      },
    ],
  },
  {
    id: "pr-2",
    name: "Vùng canh tác Sầu riêng Monthong - Bình Phước",
    crop: "Sầu riêng",
    variety: "Monthong",
    zones: [
      {
        id: "zone-1-2",
        name: "Khu vực A2",
        plots: [
          {
            id: "plot-1-2-1",
            name: "Lô A2-01",
            area: 1.2,
            status: "resting",
            soilType: "Đất đỏ Bazan",
            slope: "5-8%",
          },
          {
            id: "plot-1-2-2",
            name: "Lô A2-02",
            area: 1.8,
            status: "ready",
            soilType: "Đất đỏ Bazan",
            slope: "3-5%",
          },
        ],
      },
    ],
  },
  {
    id: "pr-3",
    name: "Vùng canh tác Xoài Cát Hòa Lộc - Đồng Nai",
    crop: "Xoài",
    variety: "Xoài Cát Hòa Lộc",
    zones: [
      {
        id: "zone-2-1",
        name: "Khu vực B1",
        plots: [
          {
            id: "plot-2-1-1",
            name: "Lô B1-01",
            area: 2.5,
            status: "active",
            soilType: "Đất xám",
            slope: "<3%",
          },
          {
            id: "plot-2-1-2",
            name: "Lô B1-02",
            area: 3.0,
            status: "ready",
            soilType: "Đất phù sa cổ",
            slope: "<3%",
          },
        ],
      },
    ],
  },
];

// --- Mock Data for Select Options ---
const MATERIAL_OPTIONS = [
  { value: "NPK 20-20-15", label: "NPK 20-20-15 (Phân bón)" },
  { value: "Urea", label: "Urea (Phân bón)" },
  { value: "Kali Clorua", label: "Kali Clorua (Phân bón)" },
  { value: "Lân Super", label: "Lân Super (Phân bón)" },
  { value: "Abamectin", label: "Abamectin (Thuốc BVTV)" },
  { value: "Mancozeb", label: "Mancozeb (Thuốc BVTV)" },
  { value: "Glyphosate", label: "Glyphosate (Thuốc cỏ)" },
  { value: "Vôi bộ", label: "Vôi bột (Cải tạo đất)" },
  { value: "Hữu cơ vi sinh", label: "Hữu cơ vi sinh (Phân bón)" },
  { value: "Khác", label: "Khác" },
];

const TASK_OPTIONS = [
  { value: "Cày xới đất", label: "Cày xới đất" },
  { value: "Bón lót", label: "Bón lót" },
  { value: "Gieo hạt/Trồng cây", label: "Gieo hạt/Trồng cây" },
  { value: "Tưới nước", label: "Tưới nước" },
  { value: "Bón thúc lần 1", label: "Bón thúc lần 1" },
  { value: "Phun thuốc phòng bệnh", label: "Phun thuốc phòng bệnh" },
  { value: "Tỉa cành/tạo tán", label: "Tỉa cành/tạo tán" },
  { value: "Làm cỏ", label: "Làm cỏ" },
  { value: "Thu hoạch", label: "Thu hoạch" },
  { value: "Vệ sinh đồng ruộng", label: "Vệ sinh đồng ruộng" },
  { value: "Khác", label: "Khác" },
];

const LABOR_OPTIONS = [
  { value: "1 người", label: "1 người" },
  { value: "2 người", label: "2 người" },
  { value: "3-5 người", label: "3-5 người" },
  { value: "5-10 người", label: "5-10 người" },
  { value: "Cơ giới hóa", label: "Cơ giới hóa (Máy móc)" },
  { value: "Khoán trọn gói", label: "Khoán trọn gói" },
];

// Helper Components
const StageItem = ({
  stage,
  index,
  checked,
  onChange,
}: {
  stage: string;
  index: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div
    className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${checked ? "bg-primary/5 border-primary/20" : "bg-white hover:bg-slate-50"}`}
  >
    <div className="flex items-center justify-center">
      <Checkbox checked={checked} onCheckedChange={(c) => onChange(!!c)} />
    </div>
    <div
      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${checked ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}
    >
      {index + 1}
    </div>
    <div
      className={`flex-1 font-medium ${checked ? "text-slate-900" : "text-slate-500"}`}
    >
      {stage}
    </div>
  </div>
);

const StageAllocation = memo(
  ({
    stageName,
    index,
    allocations,
    tasks,
    onAddMaterial,
    onRemoveMaterial,
    onAddTask,
    onRemoveTask,
  }: {
    stageName: string;
    index: number;
    allocations: MaterialAllocation[];
    tasks: TaskAllocation[];
    onAddMaterial: (item: any) => void;
    onRemoveMaterial: (id: number) => void;
    onAddTask: (item: any) => void;
    onRemoveTask: (id: number) => void;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newItem, setNewItem] = useState({
      name: "",
      qty: "",
      unit: "kg",
      type: "Phân bón",
    });

    const [newTask, setNewTask] = useState({
      name: "",
      desc: "",
      labor: "",
      duration: "",
    });

    const handleAddMaterial = () => {
      if (!newItem.name || !newItem.qty) return;
      onAddMaterial({
        stageId: stageName,
        materialCategory: newItem.type,
        materialType: newItem.type,
        materialName: newItem.name,
        quantity: newItem.qty,
        unit: newItem.unit,
      });
      setNewItem({ name: "", qty: "", unit: "kg", type: "Phân bón" });
    };

    const handleAddTask = () => {
      if (!newTask.name) return;
      onAddTask({
        stageId: stageName,
        name: newTask.name,
        description: newTask.desc,
        labor: newTask.labor,
        duration: newTask.duration,
      });
      setNewTask({ name: "", desc: "", labor: "", duration: "" });
    };

    return (
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col transition-all duration-200">
        <div
          className="bg-slate-50 px-4 py-3 border-b flex justify-between items-center cursor-pointer hover:bg-slate-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm transition-colors ${isExpanded ? "bg-blue-600 text-white" : "bg-white border text-slate-500"}`}
            >
              {index + 1}
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">{stageName}</h4>
              <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Leaf className="w-3 h-3" /> {allocations.length} vật tư
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {tasks.length} công việc
                </span>
              </div>
            </div>
          </div>
          <div
            className={`transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-400"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        {isExpanded && (
          <div className="p-4 flex-1 flex flex-col animation-fade-in border-t border-slate-100">
            <Tabs defaultValue="materials" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100 p-1 rounded-lg">
                <TabsTrigger
                  value="materials"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Leaf className="w-3.5 h-3.5 mr-2 text-green-600" />
                  Vật tư & Thiết bị
                </TabsTrigger>
                <TabsTrigger
                  value="tasks"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Users className="w-3.5 h-3.5 mr-2 text-blue-600" />
                  Nhân sự & Cách thức
                </TabsTrigger>
              </TabsList>

              {/* TAB: MATERIALS */}
              <TabsContent value="materials" className="flex-1 space-y-4">
                <div className="space-y-2 min-h-[120px]">
                  {allocations.length === 0 ? (
                    <div className="text-center py-6 border border-dashed rounded-lg bg-slate-50/50">
                      <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">
                        Chưa có vật tư phân bổ
                      </p>
                    </div>
                  ) : (
                    allocations.map((a) => (
                      <div
                        key={a.id}
                        className="flex justify-between items-center bg-slate-50 p-2.5 rounded-md text-sm group hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-white text-xs font-normal"
                          >
                            {a.materialType}
                          </Badge>
                          <span className="font-medium text-slate-700">
                            {a.materialName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border">
                            {a.quantity} {a.unit}
                          </span>
                          <button
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onRemoveMaterial(a.id)}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t mt-auto">
                  <Select
                    value={newItem.type}
                    onValueChange={(v) => setNewItem({ ...newItem, type: v })}
                  >
                    <SelectTrigger className="w-[110px] h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Phân bón">Phân bón</SelectItem>
                      <SelectItem value="Thuốc BVTV">Thuốc BVTV</SelectItem>
                      <SelectItem value="Giống">Giống</SelectItem>
                      <SelectItem value="Nông cụ">Nông cụ</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={newItem.name}
                    onValueChange={(v) => setNewItem({ ...newItem, name: v })}
                  >
                    <SelectTrigger className="h-9 text-xs flex-1">
                      <SelectValue placeholder="Chọn vật tư..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MATERIAL_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-1">
                    <Input
                      placeholder="SL"
                      type="number"
                      className="h-9 text-sm w-28"
                      value={newItem.qty}
                      onChange={(e) =>
                        setNewItem({ ...newItem, qty: e.target.value })
                      }
                    />
                    <Select
                      value={newItem.unit}
                      onValueChange={(v) => setNewItem({ ...newItem, unit: v })}
                    >
                      <SelectTrigger className="h-9 text-xs px-2 flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lít">lít</SelectItem>
                        <SelectItem value="chai">chai</SelectItem>
                        <SelectItem value="bao">bao</SelectItem>
                        <SelectItem value="cái">cái</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="sm"
                    className="h-9 w-9 p-0 bg-slate-900 hover:bg-slate-800"
                    onClick={handleAddMaterial}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* TAB: TASKS */}
              <TabsContent value="tasks" className="flex-1 space-y-4">
                <div className="space-y-2 min-h-[120px]">
                  {tasks.length === 0 ? (
                    <div className="text-center py-6 border border-dashed rounded-lg bg-slate-50/50">
                      <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">
                        Chưa thiết lập công việc
                      </p>
                    </div>
                  ) : (
                    tasks.map((t) => (
                      <div
                        key={t.id}
                        className="bg-slate-50 p-3 rounded-md text-sm space-y-1 group hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-slate-800">
                            {t.name}
                          </span>
                          <button
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onRemoveTask(t.id)}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {t.description && (
                          <p className="text-slate-600 text-xs italic flex items-start gap-1">
                            <StickyNote className="w-3 h-3 mt-0.5" />
                            {t.description}
                          </p>
                        )}
                        <div className="flex gap-3 mt-1 pt-1 border-t border-slate-200/50">
                          {t.labor && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] h-5 bg-blue-50 text-blue-700 border-blue-100 px-1.5"
                            >
                              <Users className="w-3 h-3 mr-1" /> {t.labor}
                            </Badge>
                          )}
                          {t.duration && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] h-5 bg-amber-50 text-amber-700 border-amber-100 px-1.5"
                            >
                              <Clock className="w-3 h-3 mr-1" /> {t.duration}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-2 pt-3 border-t mt-auto text-sm">
                  <div className="flex gap-2">
                    <Select
                      value={newTask.name}
                      onValueChange={(v) => setNewTask({ ...newTask, name: v })}
                    >
                      <SelectTrigger className="h-9 flex-1 font-medium">
                        <SelectValue placeholder="Chọn công việc..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      className="h-9 px-3 bg-slate-900 hover:bg-slate-800"
                      onClick={handleAddTask}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Thêm
                    </Button>
                  </div>
                  <Input
                    placeholder="Mô tả kỹ thuật (VD: Cày sâu 30cm, phơi đất 5 ngày)..."
                    className="h-9 text-muted-foreground"
                    value={newTask.desc}
                    onChange={(e) =>
                      setNewTask({ ...newTask, desc: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Users className="w-3.5 h-3.5 absolute left-2.5 top-3 z-10 text-slate-400" />
                      <Select
                        value={newTask.labor}
                        onValueChange={(v) =>
                          setNewTask({ ...newTask, labor: v })
                        }
                      >
                        <SelectTrigger className="h-9 pl-8">
                          <SelectValue placeholder="Nhân sự" />
                        </SelectTrigger>
                        <SelectContent>
                          {LABOR_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
                      <Input
                        placeholder="Thời gian (ngày/giờ)"
                        className="h-9 pl-8"
                        type="datetime-local"
                        value={newTask.duration}
                        onChange={(e) =>
                          setNewTask({ ...newTask, duration: e.target.value })
                        }
                      />
                    </div>
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

export default function PlanEditPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const getPlanById = usePlanStore((state) => state.getPlanById);
  const updatePlan = usePlanStore((state) => state.updatePlan);

  const plan = getPlanById(Number(params.id));

  // State Management
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    seasonId: "",
    seasonName: "",
    startDate: "",
    endDate: "",
    selectedRegionId: "",
    selectedZoneIds: [] as string[],
    selectedPlotIds: [] as string[],
    crop: "",
    variety: "",
    growthCycleId: "",
    selectedStages: [] as string[],
    status: "active" as const,
    materialAllocations: [] as MaterialAllocation[],
    taskAllocations: [] as TaskAllocation[], // Fallback for safety
  });

  const [dateWarning, setDateWarning] = useState<string | null>(null);

  // Initialize form with plan data
  useEffect(() => {
    if (plan) {
      setFormData({
        code: plan.code,
        name: plan.name,
        description: plan.description,
        seasonId: plan.seasonId,
        seasonName: plan.seasonName,
        startDate: plan.startDate,
        endDate: plan.endDate,
        selectedRegionId: plan.selectedRegionId,
        selectedZoneIds: plan.selectedZoneIds,
        selectedPlotIds: plan.selectedPlotIds,
        crop: plan.crop,
        variety: plan.variety,
        growthCycleId: plan.growthCycleId,
        selectedStages: plan.selectedStages,
        status: plan.status as "active",
        materialAllocations: plan.materialAllocations,
        taskAllocations: plan.taskAllocations || [],
      });
    } else {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy kế hoạch",
        variant: "destructive",
      });
      setLocation("/plan");
    }
  }, [plan, setLocation, toast]);

  // If loading or not found
  if (!plan) return null;

  // --- Helpers & Handlers (Same as Create Page) ---

  const handleSeasonChange = (seasonId: string) => {
    const season = SEASONS.find((s) => s.id === seasonId);
    if (season) {
      setFormData((prev) => ({
        ...prev,
        seasonId: season.id,
        seasonName: season.name,
        startDate: season.startDate,
        endDate: season.endDate,
      }));
      setDateWarning(null);
    }
  };

  const handleRegionChange = (id: string) => {
    const region = LOCATIONS.find((loc) => loc.id === id);
    if (region) {
      const zoneIds: string[] = [];
      const plotIds: string[] = [];
      region.zones.forEach((zone) => {
        zoneIds.push(zone.id);
        zone.plots.forEach((plot) => {
          plotIds.push(plot.id);
        });
      });
      setFormData((prev) => ({
        ...prev,
        selectedRegionId: id,
        selectedZoneIds: zoneIds,
        selectedPlotIds: plotIds,
        crop: region.crop,
        variety: region.variety,
      }));
    }
  };

  const handleGrowthCycleChange = (id: string) => {
    const cycle = GROWTH_CYCLES.find((c) => c.id === id);
    if (cycle) {
      setFormData((prev) => ({
        ...prev,
        growthCycleId: id,
        selectedStages: cycle.stages,
      }));
    }
  };

  const calculateArea = () => {
    let area = 0;
    LOCATIONS.forEach((region) => {
      region.zones.forEach((zone) => {
        zone.plots.forEach((plot) => {
          if (formData.selectedPlotIds.includes(plot.id)) {
            area += plot.area;
          }
        });
      });
    });
    return area.toFixed(1);
  };

  const groupedLocations = useMemo(() => {
    const groups: {
      region: string;
      zones: {
        id: string;
        name: string;
        plots: { id: string; name: string }[];
      }[];
    }[] = [];

    LOCATIONS.forEach((region) => {
      const activeZones: {
        id: string;
        name: string;
        plots: { id: string; name: string }[];
      }[] = [];

      region.zones.forEach((zone) => {
        const activePlots = zone.plots.filter((p) =>
          formData.selectedPlotIds.includes(p.id),
        );
        if (activePlots.length > 0) {
          activeZones.push({
            id: zone.id,
            name: zone.name,
            plots: activePlots.map((p) => ({ id: p.id, name: p.name })),
          });
        }
      });

      if (activeZones.length > 0) {
        groups.push({ region: region.name, zones: activeZones });
      }
    });

    return groups;
  }, [formData.selectedPlotIds]);

  const toggleStage = (stage: string, checked: boolean) => {
    setFormData((prev) => {
      const current = prev.selectedStages;
      if (checked && !current.includes(stage))
        return { ...prev, selectedStages: [...current, stage] };
      if (!checked && current.includes(stage))
        return { ...prev, selectedStages: current.filter((s) => s !== stage) };
      return prev;
    });
  };

  const handleAddMaterial = useCallback((item: any) => {
    setFormData((prev) => ({
      ...prev,
      materialAllocations: [
        ...prev.materialAllocations,
        { id: Date.now(), ...item },
      ],
    }));
  }, []);

  const handleRemoveMaterial = useCallback((id: number) => {
    setFormData((prev) => ({
      ...prev,
      materialAllocations: prev.materialAllocations.filter((m) => m.id !== id),
    }));
  }, []);

  const handleAddTask = useCallback((item: any) => {
    setFormData((prev) => ({
      ...prev,
      taskAllocations: [...prev.taskAllocations, { id: Date.now(), ...item }],
    }));
  }, []);

  const handleRemoveTask = useCallback((id: number) => {
    setFormData((prev) => ({
      ...prev,
      taskAllocations: prev.taskAllocations.filter((t) => t.id !== id),
    }));
  }, []);

  const handleComplete = () => {
    const planData = {
      ...plan,
      code: formData.code,
      name: formData.name,
      description: formData.description,
      seasonId: formData.seasonId,
      seasonName: formData.seasonName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      selectedRegionId: formData.selectedRegionId,
      selectedZoneIds: formData.selectedZoneIds,
      selectedPlotIds: formData.selectedPlotIds,
      crop: formData.crop,
      variety: formData.variety,
      growthCycleId: formData.growthCycleId,
      selectedStages: formData.selectedStages,
      materialAllocations: formData.materialAllocations,
      taskAllocations: formData.taskAllocations,
    };

    updatePlan(plan.id, planData);

    toast({
      title: "Thành công",
      description: `Đã cập nhật kế hoạch ${formData.name}`,
    });
    setLocation(`/plan/${plan.id}`);
  };

  const steps: Step[] = [
    {
      id: "general",
      title: "Thông tin chung",
      description: "Mùa vụ và thời gian",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4 p-4 bg-blue-50 text-blue-900 rounded-lg border border-blue-100">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <Sprout className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Chỉnh sửa kế hoạch canh tác</h3>
              <p className="text-sm text-blue-700">
                Điều chỉnh thông tin mùa vụ và chi tiết kế hoạch.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                Mùa vụ <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.seasonId}
                onValueChange={handleSeasonChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mùa vụ..." />
                </SelectTrigger>
                <SelectContent>
                  {SEASONS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày bắt đầu</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày kết thúc</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            {dateWarning && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
                <AlertTriangle className="w-4 h-4" />
                {dateWarning}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mã kế hoạch *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="VD: 2024-KH-DX"
                />
              </div>
              <div className="space-y-2">
                <Label>Tên kế hoạch *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: Kế hoạch canh tác Đông Xuân"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
        </div>
      ),
      isValid: !!formData.seasonId && !!formData.code && !!formData.name,
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
                      Loại cây trồng
                    </Label>
                    <div className="h-11 px-3 flex items-center border border-slate-200 rounded-md bg-slate-50 text-slate-600 font-medium">
                      {formData.crop || "Chưa xác định"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Giống (Variety)
                    </Label>
                    <div className="h-11 px-3 flex items-center border border-slate-200 rounded-md bg-slate-50 text-slate-600 font-medium">
                      {formData.variety || "Chưa xác định"}
                    </div>
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
      title: "Quy trình & Giai đoạn",
      description: "Lộ trình canh tác",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-4">
            <Label className="text-base">Quy trình áp dụng</Label>
            <Select
              value={formData.growthCycleId}
              onValueChange={handleGrowthCycleChange}
            >
              <SelectTrigger className="h-12">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-muted-foreground" />
                  <SelectValue placeholder="Chọn quy trình mẫu..." />
                </div>
              </SelectTrigger>
              <SelectContent>
                {getCyclesByCrop(formData.crop).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.durationDays} ngày)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.growthCycleId && (
            <div className="space-y-4 animation-fade-in">
              <div className="flex items-center justify-between">
                <Label>Các giai đoạn triển khai</Label>
                <Badge variant="outline">
                  {formData.selectedStages.length} được chọn
                </Badge>
              </div>

              <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-2">
                {GROWTH_CYCLES.find(
                  (c) => c.id === formData.growthCycleId,
                )?.stages.map((stage, idx) => (
                  <StageItem
                    key={idx}
                    index={idx}
                    stage={stage}
                    checked={formData.selectedStages.includes(stage)}
                    onChange={(c) => toggleStage(stage, c)}
                  />
                ))}
              </div>

              <div className="flex gap-2 text-sm text-muted-foreground bg-slate-50 p-3 rounded">
                <Info className="w-4 h-4 mt-0.5 text-blue-500" />
                <p>Bạn làm việc trên quy trình mẫu đã chọn.</p>
              </div>
            </div>
          )}
        </div>
      ),
      isValid: !!formData.growthCycleId && formData.selectedStages.length > 0,
    },
    {
      id: "resources",
      title: "Phân bổ & Công việc",
      description: "Hoạch định nguồn lực chi tiết",
      content: (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Định mức Vật tư & Công việc
            </h3>
            <p className="text-slate-500 text-sm mt-1 max-w-lg mx-auto">
              Thiết lập chi tiết các hạng mục đầu tư và quy trình kỹ thuật cho
              từng giai đoạn của mùa vụ.
            </p>
          </div>

          <div className="space-y-4">
            {formData.selectedStages.map((stage, idx) => (
              <StageAllocation
                key={idx}
                stageName={stage}
                index={idx}
                allocations={formData.materialAllocations.filter(
                  (m) => m.stageId === stage,
                )}
                tasks={formData.taskAllocations.filter(
                  (t) => t.stageId === stage,
                )}
                onAddMaterial={handleAddMaterial}
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
      title: "Xác nhận & Cập nhật",
      description: "Kiểm tra lại toàn bộ thông tin",
      content: (
        <div className="max-w-3xl mx-auto space-y-8 animation-fade-in">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <FileCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Xác nhận Cập nhật Kế hoạch
            </h2>
            <p className="text-slate-500 mt-2">
              Vui lòng kiểm tra lại thông tin trước khi lưu
            </p>
          </div>

          <div className="grid gap-6">
            {/* 1. General Info Card */}
            <Card>
              <CardHeader className="pb-3 border-b bg-slate-50/50">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-blue-600" />
                  Thông tin chung
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 block mb-1">
                    Tên kế hoạch
                  </span>
                  <span className="font-medium text-slate-900">
                    {formData.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Mã kế hoạch</span>
                  <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {formData.code}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Mùa vụ</span>
                  <span className="font-medium text-slate-900">
                    {formData.seasonName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Thời gian</span>
                  <span className="font-medium text-slate-900">
                    {formData.startDate} - {formData.endDate}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 2. Scope & Crop Card */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3 border-b bg-slate-50/50">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Phạm vi & Cây trồng
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 space-y-6">
                  <div className="flex items-start justify-between gap-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <div className="space-y-1">
                      <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider">
                        Cây trồng & Giống
                      </span>
                      <span className="text-xl font-extrabold text-emerald-800">
                        {formData.crop} - {formData.variety}
                      </span>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-slate-500 block text-xs uppercase font-bold tracking-wider">
                        Diện tích
                      </span>
                      <span className="text-xl font-extrabold text-emerald-800">
                        {calculateArea()} ha
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Process & Resources Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-amber-600" />
                    Quy trình
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Quy trình mẫu</span>
                    <span className="font-medium text-slate-900">
                      {GROWTH_CYCLES.find(
                        (c) => c.id === formData.growthCycleId,
                      )?.name || "Tùy chỉnh"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Số giai đoạn</span>
                    <Badge variant="outline" className="font-bold">
                      {formData.selectedStages.length} giai đoạn
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-600" />
                    Nguồn lực dự kiến
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tổng vật tư</span>
                    <span className="font-medium text-slate-900">
                      {formData.materialAllocations.length} hạng mục
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tổng công việc</span>
                    <span className="font-medium text-slate-900">
                      {formData.taskAllocations?.length || 0} đầu việc
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Chỉnh sửa Kế hoạch canh tác"
      description="Cập nhật thông tin và kế hoạch chi tiết"
    >
      <div className="max-w-5xl mx-auto">
        <StepperForm
          steps={steps}
          onComplete={handleComplete}
          onCancel={() => setLocation(`/plan/${plan.id}`)}
          completeLabel="Lưu thay đổi"
        />
      </div>
    </AdminLayout>
  );
}
