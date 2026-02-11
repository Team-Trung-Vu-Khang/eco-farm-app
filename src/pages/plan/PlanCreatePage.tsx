import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useLocation } from "wouter";
import {
  ClipboardList,
  Calendar,
  MapPin,
  Package,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
  Check,
  Leaf,
  Droplet,
  FileCheck,
  Filter,
  X,
  Sprout,
  Users,
  Wrench,
  StickyNote,
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
  Checkbox,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
} from "@tankhang1/eco-shared-ui";
import {
  SEASONS,
  GROWTH_CYCLES,
  getCyclesByCrop,
  type Season,
  type GrowthCycle,
} from "./constants";

// --- Mock Data for Location Hierarchy (Enhanced) ---
const LOCATIONS = [
  {
    id: "region-1",
    name: "Vùng A - Bình Phước",
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
    id: "region-2",
    name: "Vùng B - Đồng Nai",
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
];

const LABOR_OPTIONS = [
  { value: "1 người", label: "1 người" },
  { value: "2 người", label: "2 người" },
  { value: "3-5 người", label: "3-5 người" },
  { value: "5-10 người", label: "5-10 người" },
  { value: "Cơ giới hóa", label: "Cơ giới hóa (Máy móc)" },
  { value: "Khoán trọn gói", label: "Khoán trọn gói" },
];

// Interface cho vật tư chi tiết
interface MaterialAllocation {
  id: number;
  stageId: string; // Linked to a specific stage
  materialCategory: string; // Loại vật tư
  materialType: string; // Loại vật tư cụ thể
  materialName: string; // Tên vật tư cụ thể
  quantity: string;
  unit: string;
}

interface TaskAllocation {
  id: number;
  stageId: string;
  name: string; // Tên hoạt động (e.g. Cày đất)
  description: string; // Chi tiết kỹ thuật
  labor: string; // Số lượng nhân sự/công
  duration: string; // Thời gian ước tính (giờ/ngày)
}

// 1. Location Selection Dialog (Filtered for Cultivation)
const LocationFilterDialog = ({
  open,
  onOpenChange,
  selectedIds,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[]; // List of selected Plot IDs
  onApply: (ids: string[]) => void;
}) => {
  const [tempSelected, setTempSelected] = useState<string[]>(selectedIds);

  useEffect(() => {
    if (open) setTempSelected(selectedIds);
  }, [open, selectedIds]);

  const toggleSelection = (id: string) => {
    setTempSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const isSelected = (id: string) => tempSelected.includes(id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chọn khu vực canh tác</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 pr-2">
          <div className="space-y-6">
            {LOCATIONS.map((region) => (
              <div key={region.id} className="space-y-3">
                <div className="flex items-center gap-2 font-semibold text-slate-800 bg-slate-50 p-2 rounded">
                  <MapPin className="w-4 h-4 text-primary" />
                  {region.name}
                </div>

                <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {region.zones.map((zone) => (
                    <div
                      key={zone.id}
                      className="border p-3 rounded-md space-y-2"
                    >
                      <div className="flex items-center gap-2 font-medium text-sm text-slate-700">
                        {zone.name}
                      </div>

                      <div className="pl-4 space-y-2">
                        {zone.plots.map((plot) => (
                          <div
                            key={plot.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Checkbox
                              checked={isSelected(plot.id)}
                              onCheckedChange={() => toggleSelection(plot.id)}
                            />
                            <span className="flex-1">{plot.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {plot.area} ha
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              onApply(tempSelected);
              onOpenChange(false);
            }}
          >
            Áp dụng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// 2. Stage Selection Item
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

// 3. Stage Allocation Component
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
        {/* Header - Click to Toggle */}
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

        {/* Content Tabs - Collapsible */}
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

                {/* Add Material Form */}
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

                {/* Add Task Form */}
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

export default function PlanCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    seasonId: "",
    seasonName: "",
    startDate: "",
    endDate: "",

    // Location & Crop
    selectedRegionId: "",
    selectedZoneId: "",
    selectedPlotIds: [] as string[],
    crop: "",
    variety: "",

    // Process
    growthCycleId: "",
    selectedStages: [] as string[],

    // Resources
    materialAllocations: [] as MaterialAllocation[],
    taskAllocations: [] as TaskAllocation[],
  });

  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [dateWarning, setDateWarning] = useState<string | null>(null);

  // --- Helpers & Handlers ---

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

  const removeLocationGroup = (plotIds: string[]) => {
    setFormData((prev) => ({
      ...prev,
      selectedPlotIds: prev.selectedPlotIds.filter(
        (id) => !plotIds.includes(id),
      ),
    }));
  };

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
              <h3 className="font-semibold">Thiết lập kế hoạch canh tác</h3>
              <p className="text-sm text-blue-700">
                Bắt đầu bằng việc chọn mùa vụ và đặt tên cho kế hoạch của bạn.
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
                      {s.name} (
                      {s.status === "active" ? "Đang diễn ra" : "Sắp tới"})
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
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-base">
                  Vùng canh tác <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.selectedRegionId}
                  onValueChange={(v) =>
                    setFormData((prev) => ({
                      ...prev,
                      selectedRegionId: v,
                      selectedZoneId: "",
                      selectedPlotIds: [],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vùng..." />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base">
                  Khu vực <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.selectedZoneId}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, selectedZoneId: v }))
                  }
                  disabled={!formData.selectedRegionId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khu vực..." />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.find(
                      (r) => r.id === formData.selectedRegionId,
                    )?.zones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.selectedZoneId && (
              <div className="space-y-3 animation-fade-in">
                <Label className="text-base font-semibold text-slate-800">
                  Chọn Lô đất canh tác <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {LOCATIONS.find((r) => r.id === formData.selectedRegionId)
                    ?.zones.find((z) => z.id === formData.selectedZoneId)
                    ?.plots.map((plot) => {
                      const isSelected = formData.selectedPlotIds.includes(
                        plot.id,
                      );
                      return (
                        <div
                          key={plot.id}
                          className={`relative flex items-start p-4 rounded-xl border transition-all cursor-pointer group hover:shadow-md ${
                            isSelected
                              ? "bg-blue-50/50 border-blue-200 shadow-sm ring-1 ring-blue-100"
                              : "bg-white border-slate-200 hover:border-blue-100"
                          }`}
                          onClick={() => {
                            setFormData((prev) => {
                              const current = prev.selectedPlotIds;
                              return {
                                ...prev,
                                selectedPlotIds: isSelected
                                  ? current.filter((id) => id !== plot.id)
                                  : [...current, plot.id],
                              };
                            });
                          }}
                        >
                          <div className="flex items-center h-5 mt-0.5">
                            <Checkbox
                              id={plot.id}
                              checked={isSelected}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              onCheckedChange={() => {}} // Handled by div onClick
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <Label
                                htmlFor={plot.id}
                                className="text-sm font-bold text-slate-800 cursor-pointer"
                              >
                                {plot.name}
                              </Label>
                              <Badge
                                variant={
                                  plot.status === "active"
                                    ? "default"
                                    : plot.status === "ready"
                                      ? "outline"
                                      : "secondary"
                                }
                                className={`text-[10px] px-1.5 h-5 font-normal ${
                                  plot.status === "ready"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : plot.status === "active"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : "bg-slate-100 text-slate-600 border-slate-200"
                                }`}
                              >
                                {plot.status === "ready"
                                  ? "Sẵn sàng"
                                  : plot.status === "active"
                                    ? "Đang canh tác"
                                    : "Đang nghỉ"}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>
                                  Diện tích:{" "}
                                  <b className="text-slate-700">
                                    {plot.area} ha
                                  </b>
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Leaf className="w-3 h-3 text-slate-400" />
                                <span>{plot.soilType}</span>
                              </div>
                              <div className="flex items-center gap-1.5 col-span-2">
                                <AlertTriangle className="w-3 h-3 text-slate-400" />
                                <span>Độ dốc: {plot.slope}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Selected Summary */}
            {formData.selectedPlotIds.length > 0 && (
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm animation-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Đã chọn canh tác
                    </p>
                    <p className="text-lg font-bold text-slate-900 leading-none mt-0.5">
                      {formData.selectedPlotIds.length} lô đất
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-600">
                    Tổng diện tích
                  </p>
                  <p className="text-xl font-bold text-blue-700 leading-none mt-0.5">
                    {calculateArea()} ha
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Loại cây trồng</Label>
              <Select
                value={formData.crop}
                onValueChange={(v) =>
                  setFormData({ ...formData, crop: v, variety: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cây..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sầu riêng">Sầu riêng</SelectItem>
                  <SelectItem value="Xoài">Xoài</SelectItem>
                  <SelectItem value="Bưởi">Bưởi</SelectItem>
                  <SelectItem value="Thanh long">Thanh long</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Giống (Variety)</Label>
              <Select
                value={formData.variety}
                onValueChange={(v) => setFormData({ ...formData, variety: v })}
                disabled={!formData.crop}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giống..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ri6">Ri6</SelectItem>
                  <SelectItem value="Monthong">Monthong</SelectItem>
                  <SelectItem value="Musang King">Musang King</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <LocationFilterDialog
            open={locationDialogOpen}
            onOpenChange={setLocationDialogOpen}
            selectedIds={formData.selectedPlotIds}
            onApply={(ids) =>
              setFormData({ ...formData, selectedPlotIds: ids })
            }
          />
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
                <p>
                  Bạn có thể bỏ chọn các giai đoạn không cần thiết cho mùa vụ
                  này (ví dụ: bỏ qua giai đoạn làm đất nếu trồng gối vụ).
                </p>
              </div>
            </div>
          )}
        </div>
      ),
      isValid: !!formData.growthCycleId && formData.selectedStages.length > 0,
    },
    {
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
      id: "resources",
    },
    {
      id: "confirmation",
      title: "Xác nhận & Kích hoạt",
      description: "Kiểm tra lại toàn bộ thông tin",
      content: (
        <div className="max-w-3xl mx-auto space-y-8 animation-fade-in">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <FileCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Xác nhận Kế hoạch Canh tác
            </h2>
            <p className="text-slate-500 mt-2">
              Vui lòng kiểm tra lại thông tin trước khi kích hoạt
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
            <Card>
              <CardHeader className="pb-3 border-b bg-slate-50/50">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  Phạm vi & Cây trồng
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="col-span-2 flex items-start gap-4 p-3 bg-green-50/50 rounded-lg border border-green-100">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full">
                    <div>
                      <span className="text-slate-500 block text-xs uppercase font-semibold">
                        Cây trồng
                      </span>
                      <span className="text-lg font-bold text-green-800">
                        {formData.crop} - {formData.variety}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-xs uppercase font-semibold">
                        Tổng diện tích
                      </span>
                      <span className="text-lg font-bold text-green-800">
                        {calculateArea()} ha
                      </span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-green-200/50 mt-1">
                      <span className="text-slate-500 text-xs mr-2">
                        Các lô đã chọn:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {groupedLocations.map((g) =>
                          g.zones.map((z) =>
                            z.plots.map((p) => (
                              <Badge
                                key={p.id}
                                variant="secondary"
                                className="bg-white text-slate-700 border-slate-200 font-normal"
                              >
                                {p.name}
                              </Badge>
                            )),
                          ),
                        )}
                      </div>
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
                      {
                        GROWTH_CYCLES.find(
                          (c) => c.id === formData.growthCycleId,
                        )?.name
                      }
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
                      {formData.taskAllocations.length} đầu việc
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

  const handleComplete = () => {
    toast({
      title: "Thành công",
      description: `Đã tạo kế hoạch ${formData.name}`,
    });
    setLocation("/plan");
  };

  return (
    <AdminLayout
      title="Lập kế hoạch canh tác"
      description="Xây dựng lộ trình trồng trọt, phân bổ nguồn lực và giám sát"
    >
      <div className="max-w-5xl mx-auto">
        <StepperForm
          steps={steps}
          onComplete={handleComplete}
          onCancel={() => setLocation("/plan")}
          completeLabel="Kích hoạt Kế hoạch"
        />
      </div>
    </AdminLayout>
  );
}
