import { useState, useMemo, useCallback, memo, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import {
  ClipboardList,
  FileCheck,
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
  Users,
  Clock,
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
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@tankhang1/eco-shared-ui";
import useAmendmentPlanStore, {
  type AllocationItem,
} from "../../stores/useAmendmentPlanStore";
import useRegimenStore from "../../stores/useRegimenStore";
import usePersonnelStore from "../../stores/usePersonnelStore";
import useSeasonStore from "@/stores/useSeasonStore";
import { PersonnelSelectDialog } from "./components/PersonnelSelectDialog";
import useRegionStore from "@/stores/useRegionStore";
import { EnterpriseSelector } from "../cultivation-zone/cultivation-region/components";
import GeographicalSelector from "../plan/components/GeographicalSelector";
import { cn } from "@tankhang1/eco-shared-ui";

// --- Types ---

export interface GeographicalSelection {
  id: string;
  type: "region" | "area" | "plot";
  regionId: string;
  areaId?: string;
  plotId?: string;
}

// --- Mock Data ---

// --- Process Configs ---

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

// --- Material Configs ---

const MATERIAL_TYPES = [
  { value: "Phân bón", label: "Phân bón" },
  { value: "Thuốc BVTV", label: "Thuốc BVTV" },
  { value: "Giống", label: "Giống cây trồng" },
  { value: "Nông cụ", label: "Nông cụ & Thiết bị" },
  { value: "Vật tư khác", label: "Vật tư khác" },
];

const MATERIAL_OPTIONS: Record<
  string,
  { value: string; label: string; unit: string }[]
> = {
  "Phân bón": [
    { value: "Vôi bột", label: "Vôi bột (Xử lý pH)", unit: "kg" },
    { value: "Lân nung chảy", label: "Lân nung chảy (Khử phèn)", unit: "kg" },
    {
      value: "Phân chuồng hoai mục",
      label: "Phân chuồng hoai mục (Hữu cơ)",
      unit: "tấn",
    },
    { value: "Trichoderma", label: "Trichoderma (Nấm đối kháng)", unit: "kg" },
    { value: "Humic Acid", label: "Humic Acid (Kích rễ)", unit: "lít" },
    { value: "Kali Humate", label: "Kali Humate (Giảm mặn)", unit: "lít" },
    { value: "Ure", label: "Phân Ure", unit: "kg" },
    { value: "DAP", label: "Phân DAP", unit: "kg" },
  ],
  "Thuốc BVTV": [
    { value: "Mancozeb", label: "Mancozeb (Trừ nấm)", unit: "kg" },
    { value: "Metalaxyl", label: "Metalaxyl (Trừ nấm đất)", unit: "gói" },
    { value: "Glyphosate", label: "Glyphosate (Trừ cỏ)", unit: "lít" },
    { value: "Abamectin", label: "Abamectin (Trừ sâu)", unit: "chai" },
  ],
  Giống: [
    { value: "Cây giống chịu mặn", label: "Cây giống chịu mặn", unit: "cây" },
    {
      value: "Cây phân xanh",
      label: "Cây phân xanh (Cải tạo đất)",
      unit: "kg",
    },
  ],
  "Nông cụ": [
    { value: "Máy bơm nước", label: "Máy bơm nước", unit: "cái" },
    { value: "Máy cày", label: "Máy cày", unit: "cái" },
    { value: "Cuốc", label: "Cuốc", unit: "cái" },
    { value: "Xẻng", label: "Xẻng", unit: "cái" },
    { value: "Bình xịt", label: "Bình xịt thuốc", unit: "cái" },
  ],
  "Vật tư khác": [
    { value: "Bạt ngăn mặn", label: "Bạt ngăn mặn", unit: "m2" },
    { value: "Ống nước", label: "Ống dẫn nước", unit: "m" },
    { value: "Lưới lọc", label: "Lưới lọc nước", unit: "m2" },
  ],
};

const MATERIAL_UNITS: Record<string, string[]> = {
  "Phân bón": ["kg", "tấn", "bao", "lít", "can"],
  "Thuốc BVTV": ["lít", "ml", "chai", "gói"],
  Giống: ["cây", "kg", "hom"],
  "Nông cụ": ["cái", "bộ"],
  "Vật tư khác": ["kg", "cái", "cuộn", "m", "m2"],
};

const TASK_OPTIONS = [
  { value: "Cày sâu 30cm", label: "Cày sâu 30cm" },
  { value: "Bón vôi rải mặt", label: "Bón vôi rải mặt" },
  { value: "Bơm thoát nước", label: "Bơm thoát nước" },
  { value: "Đánh rãnh thoát phèn", label: "Đánh rãnh thoát phèn" },
  { value: "Trồng cây che phủ", label: "Trồng cây che phủ" },
  { value: "Kiểm tra pH đất", label: "Kiểm tra pH đất (Định kỳ)" },
  { value: "Cày xới đất", label: "Cày xới đất" },
  { value: "Bón lót", label: "Bón lót" },
  { value: "Tưới xả phèn", label: "Tưới xả phèn" },
  { value: "Rải vôi", label: "Rải vôi" },
  { value: "Phun chế phẩm sinh học", label: "Phun chế phẩm sinh học" },
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

    const handleAddMat = () => {
      if (!newItem.name || !newItem.qty) return;
      onAdd({
        stage: stageName,
        type: "material",
        name: newItem.name,
        detail: `${newItem.qty} ${newItem.unit}`,
        // Note: For full consistency with PlanCreatePage, we might want to store more fields,
        // but sticking to existing AllocationItem structure for now:
        // type, name, detail, subDetail
      });
      setNewItem({ name: "", qty: "", unit: "kg", type: "Phân bón" });
    };

    const handleAddTask = () => {
      if (!newTask.name) return;
      onAdd({
        stage: stageName,
        type: "task",
        name: newTask.name,
        detail: newTask.labor || "1 người",
        subDetail: newTask.duration || "1 ngày",
        labor: newTask.labor || "1 người",
        duration: newTask.duration || "1 ngày",
      });
      setNewTask({ name: "", desc: "", labor: "", duration: "" });
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
                <TabsTrigger value="materials">
                  <Leaf className="w-3.5 h-3.5 mr-2 text-green-600" />
                  Vật tư xử lý
                </TabsTrigger>
                <TabsTrigger value="tasks">
                  <Wrench className="w-3.5 h-3.5 mr-2 text-blue-600" />
                  Hoạt động thi công
                </TabsTrigger>
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

                {/* Add Material Form */}
                <div className="flex flex-1 gap-2 pt-2 border-t mt-2">
                  <Select
                    value={newItem.type}
                    onValueChange={(v) => {
                      const defaultUnit =
                        MATERIAL_UNITS[v as keyof typeof MATERIAL_UNITS]?.[0] ||
                        "kg";
                      setNewItem({
                        ...newItem,
                        type: v,
                        name: "",
                        unit: defaultUnit,
                      });
                    }}
                  >
                    <SelectTrigger className="w-[120px] h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MATERIAL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={newItem.name}
                    onValueChange={(v) => {
                      const category =
                        MATERIAL_OPTIONS[
                          newItem.type as keyof typeof MATERIAL_OPTIONS
                        ] || [];
                      const item = category.find((i) => i.value === v);
                      setNewItem({
                        ...newItem,
                        name: v,
                        unit: item?.unit || newItem.unit,
                      });
                    }}
                  >
                    <SelectTrigger className="w-full h-9 text-xs">
                      <SelectValue placeholder="Chọn vật tư..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        MATERIAL_OPTIONS[
                          newItem.type as keyof typeof MATERIAL_OPTIONS
                        ] || []
                      ).map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    className="h-9 text-xs"
                    placeholder="SL"
                    value={newItem.qty}
                    onChange={(e) =>
                      setNewItem({ ...newItem, qty: e.target.value })
                    }
                    type="number"
                  />

                  <Select
                    value={newItem.unit}
                    onValueChange={(v) => setNewItem({ ...newItem, unit: v })}
                  >
                    <SelectTrigger className="w-24 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        MATERIAL_UNITS[
                          newItem.type as keyof typeof MATERIAL_UNITS
                        ] || ["kg"]
                      ).map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
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

                {/* Add Task Form */}
                <div className="space-y-2 pt-2 border-t mt-2">
                  <div className="flex gap-2">
                    <Select
                      value={newTask.name}
                      onValueChange={(v) => setNewTask({ ...newTask, name: v })}
                    >
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

                  <Input
                    placeholder="Mô tả kỹ thuật..."
                    className="h-9 text-muted-foreground text-xs"
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
                        <SelectTrigger className="h-9 pl-8 text-xs">
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
                        placeholder="Thời gian"
                        className="h-9 pl-8 text-xs"
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

export default function AmendmentPlanCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [, params] = useRoute("/amendment-plan/:id/edit");
  const isEdit = !!params?.id;

  // Zustand store
  const addPlan = useAmendmentPlanStore((state) => state.addPlan);
  const updatePlan = useAmendmentPlanStore((state) => state.updatePlan);
  const getPlanById = useAmendmentPlanStore((state) => state.getPlanById);
  const regimens = useRegimenStore((state) => state.regimens);
  const personnel = usePersonnelStore((state) => state.personnel);
  const { seasons } = useSeasonStore();

  const [personnelDialogOpen, setPersonnelDialogOpen] = useState(false);
  const [selections, setSelections] = useState<GeographicalSelection[]>([]);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("");

  const { regions } = useRegionStore();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    technician: "",
    priority: "medium",
    description: "",
    seasonId: "",

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
    purpose: "amendment" as "amendment" | "treatment",
    processId: "",
    regimenId: "", // New State for Treatment Regimen
    selectedStages: [] as string[],
    allocations: [] as AllocationItem[],

    // Time & Budget
    startDate: "",
    endDate: "",
    budget: "",
  });

  // --- Geographical Selection Helpers ---

  const handleGeographicalConfirm = (
    newSelections: GeographicalSelection[],
  ) => {
    setSelections(newSelections);
    const regionIds = new Set<string>();
    const zoneIds = new Set<string>();
    const plotIds = new Set<string>();
    let mainCrop = "";
    let mainVariety = "";

    newSelections.forEach((sel) => {
      const region = (regions || []).find(
        (loc) => String(loc.id) === String(sel.regionId),
      );
      if (!region) return;

      if (region.cropVarieties && region.cropVarieties.length > 0) {
        mainCrop = region.cropVarieties[0].name;
        mainVariety = region.cropVarieties[0].variety;
      }

      regionIds.add(String(region.id));

      if (sel.type === "region") {
        region.subAreas?.forEach((zone) => {
          zoneIds.add(String(zone.id));
          zone.plots?.forEach((plot) => {
            plotIds.add(String(plot.id));
          });
        });
      }

      if (sel.type === "area") {
        const zone = region.subAreas?.find(
          (z) => String(z.id) === String(sel.areaId),
        );
        if (zone) {
          zoneIds.add(String(zone.id));
          zone.plots?.forEach((plot) => {
            plotIds.add(String(plot.id));
          });
        }
      }

      if (sel.type === "plot") {
        plotIds.add(String(sel.plotId));
        const zone = region.subAreas?.find(
          (z) => String(z.id) === String(sel.areaId),
        );
        if (zone) {
          zoneIds.add(String(zone.id));
        }
      }
    });

    setFormData((prev) => ({
      ...prev,
      selectedRegionId: Array.from(regionIds)[0] || "",
      selectedZoneIds: Array.from(zoneIds),
      selectedPlotIds: Array.from(plotIds),
      crop: mainCrop || prev.crop,
      variety: mainVariety || prev.variety,
    }));
  };

  const selectionSummary = useMemo(() => {
    const summary: {
      regionId: string;
      regionName: string;
      items: {
        type: "region" | "area" | "plot";
        id: string;
        name: string;
        parentName?: string;
      }[];
    }[] = [];

    selections.forEach((sel) => {
      const region = (regions || []).find(
        (r) => String(r.id) === String(sel.regionId),
      );
      if (!region) return;

      let regionGroup = summary.find((s) => s.regionId === String(region.id));
      if (!regionGroup) {
        regionGroup = {
          regionId: String(region.id),
          regionName: region.name,
          items: [],
        };
        summary.push(regionGroup);
      }

      if (sel.type === "region") {
        regionGroup.items.push({
          type: "region",
          id: String(region.id),
          name: "Toàn bộ vùng",
        });
      } else if (sel.type === "area") {
        const area = region.subAreas?.find(
          (a) => String(a.id) === String(sel.areaId),
        );
        if (area) {
          regionGroup.items.push({
            type: "area",
            id: String(area.id),
            name: area.name,
          });
        }
      } else if (sel.type === "plot") {
        const area = region.subAreas?.find(
          (a) => String(a.id) === String(sel.areaId),
        );
        const plot = area?.plots?.find(
          (p) => String(p.id) === String(sel.plotId),
        );
        if (plot) {
          regionGroup.items.push({
            type: "plot",
            id: String(plot.id),
            name: plot.name,
            parentName: area?.name,
          });
        }
      }
    });

    return summary;
  }, [selections, regions]);

  const calculateArea = () => {
    let totalArea = 0;
    formData.selectedPlotIds.forEach((pid) => {
      regions.forEach((r) => {
        r.subAreas?.forEach((sa) => {
          const plot = sa.plots?.find((p) => String(p.id) === String(pid));
          if (plot) totalArea += plot.area || 0;
        });
      });
    });
    return totalArea.toFixed(1);
  };

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
          seasonId: existingPlan.seasonId || "",
          selectedRegionId: existingPlan.selectedRegionId || "",
          selectedZoneId: "",
          selectedZoneIds: existingPlan.selectedZoneIds || [],
          crop: existingPlan.crop || "",
          variety: existingPlan.variety || "",
          selectedPlotIds: existingPlan.selectedPlotIds || [],
          currentPH: existingPlan.currentPH || "",
          targetPH: existingPlan.targetPH || "",
          targetIssue: existingPlan.target_issue,
          purpose: existingPlan.processId ? "amendment" : "treatment",
          processId: existingPlan.processId || "",
          regimenId: existingPlan.regimenId || "",
          selectedStages: existingPlan.processId
            ? AMENDMENT_PROCESSES.find((p) => p.id === existingPlan.processId)
                ?.stages || []
            : existingPlan.regimenId
              ? ([
                  regimens.find((r) => r.id === existingPlan.regimenId)?.name,
                ].filter(Boolean) as string[])
              : [],
          allocations: existingPlan.allocations || [],
          startDate: existingPlan.startDate,
          endDate: existingPlan.endDate,
          budget: String(existingPlan.budget),
        });

        // Reconstruct selections
        if (
          existingPlan.selectedPlotIds &&
          existingPlan.selectedRegionId &&
          regions.length > 0
        ) {
          const initialSelections: GeographicalSelection[] = [];
          const rid = existingPlan.selectedRegionId;
          const zoneIds = existingPlan.selectedZoneIds || [];
          const plotIds = existingPlan.selectedPlotIds || [];

          const region = regions.find((r) => String(r.id) === String(rid));
          if (region) {
            setSelectedEnterpriseId(region.enterpriseId || "");

            // Reconstruct based on what was selected
            const regionZoneIds = region.subAreas?.map((sa) => sa.id) || [];
            const isWholeRegion =
              regionZoneIds.length > 0 &&
              regionZoneIds.every((zid) => zoneIds.includes(zid));

            if (isWholeRegion) {
              initialSelections.push({
                id: `region-${rid}`,
                type: "region",
                regionId: rid,
              });
            } else {
              region.subAreas?.forEach((sa) => {
                if (zoneIds.includes(sa.id)) {
                  const zonePlotIds = sa.plots?.map((p) => p.id) || [];
                  const isWholeArea =
                    zonePlotIds.length > 0 &&
                    zonePlotIds.every((pid) => plotIds.includes(pid));

                  if (isWholeArea) {
                    initialSelections.push({
                      id: `area-${sa.id}`,
                      type: "area",
                      regionId: rid,
                      areaId: sa.id,
                    });
                  } else {
                    sa.plots?.forEach((p) => {
                      if (plotIds.includes(p.id)) {
                        initialSelections.push({
                          id: `plot-${p.id}`,
                          type: "plot",
                          regionId: rid,
                          areaId: sa.id,
                          plotId: p.id,
                        });
                      }
                    });
                  }
                }
              });
            }
            setSelections(initialSelections);
          }
        }
      }
    }
  }, [isEdit, params?.id, getPlanById, regions]);

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
        regions.find((r) => String(r.id) === String(formData.selectedRegionId))
          ?.name || "",
      target_issue: formData.targetIssue,
      technician: formData.technician,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: currentStatus,
      area: Number(calculateArea()),
      budget: Number(formData.budget) || 0,
      methodCount: formData.allocations.length,
      priority: formData.priority,
      seasonId: formData.seasonId,
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
      purpose: formData.purpose,
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

          <div className="space-y-2">
            <Label>
              Mùa vụ <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.seasonId}
              onValueChange={(v) => setFormData({ ...formData, seasonId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn mùa vụ..." />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Phụ trách kỹ thuật
              </Label>
              <div
                onClick={() => setPersonnelDialogOpen(true)}
                className="flex items-center justify-between p-3 rounded-md border-2 border-slate-100 bg-slate-50/50 hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all group h-11"
              >
                {formData.technician ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6 border-2 border-white shadow-sm shrink-0">
                      <AvatarImage
                        src={
                          personnel.find(
                            (p) => p.fullName === formData.technician,
                          )?.avatar
                        }
                      />
                      <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                        {formData.technician.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-bold text-slate-800 truncate max-w-[120px]">
                      {formData.technician}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-400 font-medium pl-1">
                    Chọn...
                  </span>
                )}
                <Users className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
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
                className="h-11"
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
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                    1
                  </span>
                  Chọn vùng canh tác
                </h3>
                <Label className="text-sm font-medium">
                  Doanh nghiệp (Enterprise){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <EnterpriseSelector
                  selectedId={selectedEnterpriseId}
                  onSelect={(val) => {
                    setSelectedEnterpriseId(val);
                    setSelections([]);
                  }}
                />
                <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-sm space-y-4 relative">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                        Vùng canh tác <span className="text-red-500">*</span>
                      </label>
                      {!selectedEnterpriseId && (
                        <Badge
                          variant="outline"
                          className="text-[10px] text-amber-600 border-amber-200 bg-amber-50"
                        >
                          Chọn doanh nghiệp trước
                        </Badge>
                      )}
                    </div>
                    <GeographicalSelector
                      regions={regions || []}
                      enterpriseId={selectedEnterpriseId}
                      existingSelections={selections}
                      onConfirm={handleGeographicalConfirm}
                    />

                    {selectionSummary.length > 0 && (
                      <div className="mt-4 p-4 rounded-xl bg-white/50 border border-emerald-100/50 space-y-3">
                        <div className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-widest flex items-center gap-2">
                          <Layers className="w-3 h-3" />
                          Phạm vi đã chọn ({selections.length} mục)
                        </div>
                        <div className="space-y-3">
                          {selectionSummary.map((group) => (
                            <div key={group.regionId} className="space-y-2">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                {group.regionName}
                              </div>
                              <div className="flex flex-wrap gap-1.5 pl-2.5">
                                {group.items.map((item, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className={cn(
                                      "text-[10px] py-0 px-2 h-5 font-medium border-emerald-100 shadow-sm",
                                      item.type === "region"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : item.type === "area"
                                          ? "bg-blue-50 text-blue-700 border-blue-100"
                                          : "bg-white text-slate-600 border-slate-200",
                                    )}
                                  >
                                    <span className="opacity-70 mr-1 uppercase text-[8px] font-black">
                                      {item.type === "region"
                                        ? "Vùng"
                                        : item.type === "area"
                                          ? "Khu"
                                          : "Lô"}
                                    </span>
                                    {item.name}
                                    {item.parentName && (
                                      <span className="ml-1 opacity-50 font-normal italic">
                                        ({item.parentName})
                                      </span>
                                    )}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">
                  Ghi chú phạm vi
                </Label>
                <Textarea
                  placeholder="Nhập ghi chú thêm..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-white"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  Tóm tắt phạm vi đã chọn
                </h3>
                <div className="bg-linear-to-br from-emerald-600 to-teal-700 p-6 rounded-3xl text-white shadow-xl space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-1">
                        Khu vực cải tạo
                      </p>
                      <h4 className="text-xl font-black leading-tight">
                        {regions
                          .filter(
                            (r) =>
                              String(r.id) ===
                              String(formData.selectedRegionId),
                          )
                          .map((r) => r.name)
                          .join(", ") || "Chưa chọn vùng"}
                      </h4>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge className="bg-white/20 text-white font-bold h-5">
                          {formData.selectedPlotIds.length} LÔ ĐẤT
                        </Badge>
                        <Badge className="bg-white/20 text-white font-bold h-5">
                          {calculateArea()} HA
                        </Badge>
                      </div>
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
                      Kế hoạch cải tạo đất này sẽ áp dụng cho tất cả các lô đất
                      được chọn trong danh sách.
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
      title: "Quy trình & Giai đoạn",
      description: "Lộ trình cải tạo",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-bold text-slate-800">
              Mục đích kế hoạch
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, purpose: "amendment" }))
                }
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all text-left",
                  formData.purpose === "amendment"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md"
                    : "bg-white border-slate-100 text-slate-500 hover:border-slate-200",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                    formData.purpose === "amendment"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-400",
                  )}
                >
                  <Wrench className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm">Cải tạo đất</p>
                  <p className="text-[10px] opacity-60 mt-1">
                    Sử dụng quy trình cải tạo chuẩn
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, purpose: "treatment" }))
                }
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all text-left",
                  formData.purpose === "treatment"
                    ? "bg-blue-50 border-blue-500 text-blue-900 shadow-md"
                    : "bg-white border-slate-100 text-slate-500 hover:border-slate-200",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                    formData.purpose === "treatment"
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-400",
                  )}
                >
                  <StickyNote className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm">Xử lý/Điều trị</p>
                  <p className="text-[10px] opacity-60 mt-1">
                    Áp dụng phác đồ cải tạo đặc biệt
                  </p>
                </div>
              </button>
            </div>
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

          {formData.purpose === "amendment" ? (
            <div className="space-y-4 animation-slide-up">
              <Label className="text-base uppercase tracking-wider text-slate-500 font-bold text-[10px]">
                Quy trình áp dụng
              </Label>
              <Select
                value={formData.processId}
                onValueChange={handleProcessChange}
              >
                <SelectTrigger className="h-14 border-emerald-100 bg-emerald-50/20 focus:ring-emerald-500">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <ClipboardList className="w-4 h-4" />
                    </div>
                    <SelectValue placeholder="Chọn quy trình cải tạo..." />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {AMENDMENT_PROCESSES.map((proc) => (
                    <SelectItem key={proc.id} value={proc.id} className="py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-900">
                          {proc.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          {proc.type} • {proc.duration} ngày
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedProcess && (
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-emerald-200 text-emerald-500 shrink-0 shadow-sm">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-emerald-900 uppercase tracking-widest">
                      Lộ trình các giai đoạn
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {selectedProcess.stages.map((s, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className="bg-white text-emerald-700 border-emerald-100 text-[10px] font-bold"
                          >
                            {s}
                          </Badge>
                          {i < selectedProcess.stages.length - 1 && (
                            <span className="text-slate-300">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 animation-slide-up">
              <Label className="text-base uppercase tracking-wider text-slate-500 font-bold text-[10px]">
                Phác đồ xử lý
              </Label>
              <Select
                value={formData.regimenId}
                onValueChange={(v) => {
                  const regimen = regimens.find((r) => r.id === v);
                  setFormData((prev) => ({
                    ...prev,
                    regimenId: v,
                    selectedStages: regimen ? [regimen.name] : [],
                  }));
                }}
              >
                <SelectTrigger className="h-14 border-blue-100 bg-blue-50/20 focus:ring-blue-500">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <SelectValue placeholder="Chọn phác đồ xử lý..." />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {regimens
                    .filter((r) => r.type === "cai-tao-dat")
                    .map((r) => (
                      <SelectItem key={r.id} value={r.id} className="py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-900">
                            {r.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            {r.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {formData.regimenId && (
                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-blue-200 text-blue-500 shrink-0 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">
                      Tính chất phác đồ
                    </p>
                    <p className="text-[11px] text-blue-700 leading-relaxed mt-1">
                      Phác đồ này được thiết kế để xử lý vấn đề hiện trạng. Bạn
                      có thể phân bổ chi tiết vật tư ở bước tiếp theo.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {formData.purpose === "amendment" && selectedProcess && (
            <div className="space-y-4 pt-4 border-t animation-fade-in">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-slate-700">
                  Phân bổ nguồn lực theo giai đoạn
                </Label>
                <Badge variant="outline" className="text-[10px]">
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

          {formData.purpose === "treatment" && formData.regimenId && (
            <div className="space-y-4 pt-4 border-t animation-fade-in">
              <Label className="text-sm font-bold text-slate-700">
                Phân bổ nguồn lực điều trị
              </Label>
              {formData.selectedStages.map((stage, idx) => (
                <StageAllocation
                  key={idx}
                  stageName={stage}
                  index={idx}
                  items={formData.allocations.filter((a) => a.stage === stage)}
                  onAdd={handleAddAllocation}
                  onRemove={handleRemoveAllocation}
                />
              ))}
            </div>
          )}
        </div>
      ),
      isValid:
        formData.purpose === "amendment"
          ? !!formData.processId
          : !!formData.regimenId,
    },
    {
      id: "confirmation",
      title: "Xác nhận & Kích hoạt",
      description: "Tổng quan kế hoạch",
      content: (
        <div className="max-w-4xl mx-auto space-y-8 animation-fade-in">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <FileCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Xác nhận Kế hoạch Cải tạo
            </h2>
            <p className="text-slate-500 mt-2">
              Kiểm tra thông tin trước khi ban hành kế hoạch.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. General Info & Scope Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    Tổng quan & Phạm vi
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 grid grid-cols-2 gap-y-4 text-sm font-medium">
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase mb-1">
                      Tên kế hoạch
                    </span>
                    {formData.name}{" "}
                    <Badge variant="secondary" className="ml-2 font-mono">
                      {formData.code}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase mb-1">
                      Mùa vụ
                    </span>
                    {seasons.find((s) => s.id === formData.seasonId)?.name ||
                      "---"}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase mb-1">
                      Kỹ thuật viên
                    </span>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5 border">
                        <AvatarFallback className="text-[8px] bg-blue-100 text-blue-600">
                          {formData.technician?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {formData.technician || "Chưa phân bổ"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase mb-1">
                      Thời gian
                    </span>
                    {formData.startDate} → {formData.endDate}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase mb-1">
                      Quy mô
                    </span>
                    {formData.selectedPlotIds.length} lô đất • {calculateArea()}{" "}
                    HA
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase mb-1">
                      Vùng áp dụng
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {regions
                        .filter(
                          (r) =>
                            String(r.id) === String(formData.selectedRegionId),
                        )
                        .map((r) => (
                          <Badge
                            key={r.id}
                            className="bg-emerald-50 text-emerald-700 border-emerald-100"
                          >
                            {r.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-600" />
                    Quy trình cải tạo
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Quy trình:</span>
                    <span className="font-bold text-slate-900 border-b-2 border-amber-200">
                      {AMENDMENT_PROCESSES.find(
                        (p) => p.id === formData.processId,
                      )?.name || "Tùy chỉnh"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Lộ trình giai đoạn:
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {formData.selectedStages.map((s, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border"
                        >
                          <span className="text-[10px] font-black opacity-30">
                            {i + 1}
                          </span>
                          <span className="font-medium">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 2. Detailed Resources Summary */}
            <Card className="h-full">
              <CardHeader className="pb-3 border-b bg-slate-50/50">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-600" />
                  Nguồn lực & Dự trù
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Vật tư
                    </span>
                    <p className="text-xl font-black text-slate-800">
                      {
                        formData.allocations.filter(
                          (a) => a.type === "material",
                        ).length
                      }
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Nhân lực
                    </span>
                    <p className="text-xl font-black text-slate-800">
                      {
                        new Set(
                          formData.allocations
                            .filter((a) => a.type === "task")
                            .map((t) => t.labor || t.detail)
                            .filter(Boolean),
                        ).size
                      }
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Công việc
                    </span>
                    <p className="text-xl font-black text-slate-800">
                      {
                        formData.allocations.filter((a) => a.type === "task")
                          .length
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      <Package className="w-3 h-3 text-purple-500" />
                      Danh mục vật tư
                    </div>
                    <div className="flex flex-wrap gap-1.5 leading-none">
                      {formData.allocations.filter((a) => a.type === "material")
                        .length > 0 ? (
                        Array.from(
                          new Set(
                            formData.allocations
                              .filter((a) => a.type === "material")
                              .map((m) => m.name),
                          ),
                        ).map((name, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-purple-50 text-purple-700 border-purple-100 text-[10px] px-2 h-5 font-bold"
                          >
                            {name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Chưa có vật tư
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      <Users className="w-3 h-3 text-blue-500" />
                      Nhân lực huy động
                    </div>
                    <div className="flex flex-wrap gap-1.5 leading-none">
                      {formData.allocations
                        .filter((a) => a.type === "task")
                        .some((t) => t.labor || t.detail) ? (
                        Array.from(
                          new Set(
                            formData.allocations
                              .filter((a) => a.type === "task")
                              .map((t) => t.labor || t.detail)
                              .filter(Boolean),
                          ),
                        ).map((labor, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 border-blue-100 text-[10px] px-2 h-5 font-bold"
                          >
                            {labor}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Chưa phân bổ nhân lực
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      <ClipboardList className="w-3 h-3 text-amber-500" />
                      Đầu việc triển khai
                    </div>
                    <div className="flex flex-wrap gap-1.5 leading-none">
                      {formData.allocations.filter((a) => a.type === "task")
                        .length > 0 ? (
                        Array.from(
                          new Set(
                            formData.allocations
                              .filter((a) => a.type === "task")
                              .map((t) => t.name),
                          ),
                        ).map((name, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-amber-50 text-amber-700 border-amber-100 text-[10px] px-2 h-5 font-bold"
                          >
                            {name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Chưa có đầu việc
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-4 rounded-3xl mt-4 shadow-xl shadow-slate-200/50 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500" />
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Tổng kinh phí dự kiến
                      </p>
                      <h3 className="text-2xl font-black text-white leading-none">
                        {formData.budget
                          ? Number(formData.budget).toLocaleString()
                          : "0"}{" "}
                        <span className="text-xs font-normal opacity-60">
                          VNĐ
                        </span>
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                      <Package className="w-5 h-5 text-emerald-400" />
                    </div>
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

      <PersonnelSelectDialog
        open={personnelDialogOpen}
        onOpenChange={setPersonnelDialogOpen}
        selectedName={formData.technician}
        onConfirm={(name) => setFormData({ ...formData, technician: name })}
      />
    </AdminLayout>
  );
}
