import {
  AdminLayout,
  Badge,
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
  ScrollArea,
  useToast,
  cn,
  type Step,
} from "@tankhang1/eco-shared-ui";
import {
  AlertTriangle,
  Bug,
  ClipboardList,
  Clock,
  FileCheck,
  Info,
  Layers,
  MapPin,
  Package,
  Sprout,
  Users,
  CheckCircle,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { GROWTH_CYCLES } from "./constants";
import usePlanStore from "../../stores/usePlanStore";
import type {
  MaterialAllocation,
  TaskAllocation,
} from "../../stores/usePlanStore";
import useSeasonStore from "../../stores/useSeasonStore";
import useRegionStore from "@/stores/useRegionStore";
import useGrowthCycleStore from "@/stores/useGrowthCycleStore";
import { StageAllocation } from "./components/StageAllocation";
import { EnterpriseSelector } from "../cultivation-zone/cultivation-area/components";
import GeographicalSelector from "./components/GeographicalSelector";
import { RegimenSelector } from "./components/RegimenSelector";
import useRegimenStore from "../../stores/useRegimenStore";

// 1. Location Selection Dialog (Filtered for Cultivation)

// --- Components ---
export interface GeographicalSelection {
  id: string;
  type: "region" | "area" | "plot";
  regionId: string;
  areaId?: string;
  plotId?: string;
}

export interface CreatePlanForm {
  code: string;
  name: string;
  description: string;
  seasonId: string;
  seasonName: string;
  startDate: string;
  endDate: string;
  selectedRegionIds: string[];
  selectedZoneIds: string[];
  selectedPlotIds: string[];
  crop: string;
  variety: string;
  purpose: "cultivation" | "treatment" | "amendment";
  growthCycleId: string;
  regimenId: string;
  selectedStages: string[];
  status: "active" | "planning" | "completed" | "cancelled";
  materialAllocations: any[]; // define proper type
  taskAllocations: any[]; // define proper type
}
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

export default function PlanCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selections, setSelections] = useState<GeographicalSelection[]>([]);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("");

  // Zustand store
  const addPlan = usePlanStore((state) => state.addPlan);
  const seasons = useSeasonStore((state) => state.seasons);
  const { regions } = useRegionStore();
  const { growthCycles } = useGrowthCycleStore();
  const regimens = useRegimenStore((state) => state.regimens);

  const [formData, setFormData] = useState<CreatePlanForm>({
    code: "",
    name: "",
    description: "",
    seasonId: "",
    seasonName: "",
    startDate: "",
    endDate: "",

    // Location & Crop
    selectedRegionIds: [] as string[],
    selectedZoneIds: [] as string[],
    selectedPlotIds: [],
    crop: "",
    variety: "",
    purpose: "cultivation",
    growthCycleId: "",
    regimenId: "",
    selectedStages: [],

    // Resources
    materialAllocations: [] as MaterialAllocation[],
    taskAllocations: [] as TaskAllocation[],
    status: "planning", // Default status
  });

  const [dateWarning, setDateWarning] = useState<string | null>(null);

  // --- Helpers & Handlers ---

  const handleSeasonChange = (seasonId: string) => {
    const season = seasons.find((s) => s.id === seasonId);
    if (season) {
      setFormData((prev) => ({
        ...prev,
        seasonId: season.id,
        seasonName: season.name,
        duration: season.duration,
      }));
      setDateWarning(null);
    }
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
      // Find the region
      const region = (regions || []).find(
        (loc) => String(loc.id) === String(sel.regionId),
      );
      if (!region) return;

      // Extract crop info if not yet set (or update based on latest region)
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
      selectedRegionIds: Array.from(regionIds),
      selectedZoneIds: Array.from(zoneIds),
      selectedPlotIds: Array.from(plotIds),
      crop: mainCrop,
      variety: mainVariety,
    }));
  };

  const calculateArea = () => {
    let total = 0;
    const regionIds = formData.selectedRegionIds || [];
    const zoneIds = formData.selectedZoneIds || [];
    const plotIds = formData.selectedPlotIds || [];

    regions.forEach((region) => {
      if (!regionIds.includes(String(region.id))) return;

      const regionZoneIds = region.subAreas?.map((sa) => sa.id) || [];
      const isWholeRegion =
        regionZoneIds.length > 0 &&
        regionZoneIds.every((zid) => zoneIds.includes(zid));

      if (isWholeRegion) {
        total += region.area || 0;
      } else {
        region.subAreas?.forEach((sa) => {
          if (zoneIds.includes(sa.id)) {
            const zonePlotIds = sa.plots?.map((p) => p.id) || [];
            const isWholeArea =
              zonePlotIds.length > 0 &&
              zonePlotIds.every((pid) => plotIds.includes(pid));

            if (isWholeArea) {
              total += sa.area || 0;
            } else {
              sa.plots?.forEach((p) => {
                if (plotIds.includes(p.id)) {
                  total += p.area || 0;
                }
              });
            }
          }
        });
      }
    });

    return total.toFixed(1);
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
              {/* Summary Section */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  Tóm tắt phạm vi đã chọn
                </h3>
                <div className="bg-linear-to-br from-emerald-600 to-teal-700 p-6 rounded-3xl text-white shadow-xl space-y-6 relative overflow-hidden">
                  {/* Decorative blobs */}
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-black/10 rounded-full blur-2xl" />

                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg ring-1 ring-white/30">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                        Khu vực canh tác
                      </p>
                      <h4 className="text-2xl font-black leading-tight tracking-tight">
                        {regions
                          .filter((r) =>
                            formData.selectedRegionIds.includes(
                              r.id.toString(),
                            ),
                          )
                          .map((r) => r.name)
                          .join(", ") || "Chưa chọn vùng"}
                      </h4>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge
                          variant="secondary"
                          className="bg-white/20 text-white border-transparent text-[10px] font-bold h-5"
                        >
                          {formData.selectedPlotIds.length} LÔ ĐẤT
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-white/20 text-white border-transparent text-[10px] font-bold h-5"
                        >
                          {calculateArea()} HA
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                      <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Cây trồng
                      </p>
                      <p className="font-bold text-sm truncate">
                        {formData.crop || "---"}
                      </p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                      <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Giống
                      </p>
                      <p className="font-bold text-sm truncate">
                        {formData.variety || "---"}
                      </p>
                    </div>
                  </div>

                  {selectionSummary.length > 0 && (
                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                          Chi tiết phạm vi
                        </p>
                      </div>
                      <ScrollArea className="h-32 pr-2">
                        <div className="space-y-3">
                          {selectionSummary.map((group) => (
                            <div key={group.regionId} className="space-y-1.5">
                              <div className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider opacity-60">
                                {group.regionName}
                              </div>
                              {group.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2 rounded-xl bg-white/10 border border-white/5 hover:bg-white/15 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={cn(
                                        "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]",
                                        item.type === "region"
                                          ? "bg-amber-400"
                                          : item.type === "area"
                                            ? "bg-blue-400"
                                            : "bg-emerald-400",
                                      )}
                                    />
                                    <div className="flex flex-col">
                                      <span className="text-[10px] uppercase font-black opacity-40 leading-none mb-0.5">
                                        {item.type === "region"
                                          ? "Toàn vùng"
                                          : item.type === "area"
                                            ? "Khu vực"
                                            : "Lô đất"}
                                      </span>
                                      <span className="text-xs font-medium truncate max-w-[150px]">
                                        {item.name}
                                      </span>
                                    </div>
                                  </div>
                                  {item.parentName && (
                                    <span className="text-[9px] font-bold opacity-50 italic truncate max-w-[80px]">
                                      {item.parentName}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  <div className="bg-black/20 p-4 rounded-2xl border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-emerald-300" />
                      <span className="text-[10px] font-black text-emerald-200 uppercase tracking-widest">
                        Lưu ý
                      </span>
                    </div>
                    <p className="text-xs text-emerald-50/80 leading-relaxed italic text-justify">
                      Quy trình canh tác sẽ được áp dụng đồng bộ cho tất cả các
                      lô đất đã chọn trong danh sách trên.
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
      description: "Lộ trình canh tác",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-bold text-slate-800">
              Mục đích kế hoạch
            </Label>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  id: "cultivation",
                  label: "Canh tác",
                  icon: Layers,
                  borderColor: "border-blue-500",
                  bgColor: "bg-blue-50/50",
                  activeColor: "bg-blue-500",
                  textColor: "text-blue-700",
                  description: "Sử dụng quy trình chuẩn",
                },
                {
                  id: "treatment",
                  label: "Điều trị",
                  icon: Bug,
                  borderColor: "border-red-500",
                  bgColor: "bg-red-50/50",
                  activeColor: "bg-red-500",
                  textColor: "text-red-700",
                  description: "Áp dụng phác đồ xử lý",
                },
                {
                  id: "amendment",
                  label: "Cải tạo đất",
                  icon: Sprout,
                  borderColor: "border-green-500",
                  bgColor: "bg-green-50/50",
                  activeColor: "bg-green-500",
                  textColor: "text-green-700",
                  description: "Xử lý và phục hồi",
                },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      purpose: type.id as any,
                    }))
                  }
                  className={cn(
                    "cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1 group relative overflow-hidden",
                    formData.purpose === type.id
                      ? `${type.borderColor} ${type.bgColor} ${type.textColor} shadow-md`
                      : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm",
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform",
                      formData.purpose === type.id
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
                </button>
              ))}
            </div>
          </div>

          {formData.purpose === "cultivation" ? (
            <div className="space-y-6 animation-slide-up">
              {(() => {
                const season = seasons.find((s) => s.id === formData.seasonId);
                const seasonCycles = (season?.growthCycleIds || [])
                  .map((cid) => growthCycles.find((gc) => gc.id === cid))
                  .filter(Boolean);

                if (!season) {
                  return (
                    <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                      <p className="text-slate-400 font-medium">
                        Vui lòng chọn mùa vụ ở bước 1
                      </p>
                    </div>
                  );
                }

                if (seasonCycles.length === 0) {
                  return (
                    <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                      <p className="text-slate-400 font-medium italic">
                        Vùng trồng/Mùa vụ này chưa được gán quy trình mẫu.
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2">
                        Vui lòng kiểm tra lại cấu hình mùa vụ.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-8">
                    {seasonCycles.map((cycle) => (
                      <div
                        key={cycle!.id}
                        className="space-y-4 animation-fade-in"
                      >
                        <div className="flex items-center justify-between px-2">
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                              <ClipboardList className="w-4 h-4 text-emerald-500" />
                              {cycle!.name}
                            </h4>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                              {cycle!.totalDays} ngày • {cycle!.stages.length}{" "}
                              giai đoạn
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-700 text-[9px] font-bold border-transparent"
                          >
                            {
                              formData.selectedStages.filter((s) =>
                                s.startsWith(`${cycle!.id}:`),
                              ).length
                            }{" "}
                            / {cycle!.stages.length}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                          {cycle!.stages.map((stage, idx) => {
                            const stageKey = `${cycle!.id}:${stage.name}`;
                            return (
                              <StageItem
                                key={stage.id}
                                index={idx}
                                stage={stage.name}
                                checked={formData.selectedStages.includes(
                                  stageKey,
                                )}
                                onChange={(c) => {
                                  setFormData((prev) => {
                                    const current = prev.selectedStages;
                                    if (c && !current.includes(stageKey))
                                      return {
                                        ...prev,
                                        selectedStages: [...current, stageKey],
                                      };
                                    if (!c && current.includes(stageKey))
                                      return {
                                        ...prev,
                                        selectedStages: current.filter(
                                          (s) => s !== stageKey,
                                        ),
                                      };
                                    return prev;
                                  });
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-3 text-[11px] text-muted-foreground bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <Info className="w-4 h-4 text-blue-500 shrink-0" />
                      <p className="leading-relaxed">
                        Các giai đoạn được hiển thị dựa trên quy trình mẫu đã
                        gán cho Mùa vụ. Bạn có thể chọn lọc các giai đoạn thực
                        tế sẽ triển khai.
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="space-y-4 animation-slide-up">
              <Label className="text-base uppercase tracking-wider text-slate-500 font-bold text-[10px]">
                {formData.purpose === "treatment"
                  ? "Phác đồ điều trị"
                  : "Phác đồ cải tạo đất"}
              </Label>
              <RegimenSelector
                regimens={regimens}
                selectedRegimenId={formData.regimenId}
                type={formData.purpose as "treatment" | "amendment"}
                onSelect={(regimen) => {
                  setFormData((prev) => ({
                    ...prev,
                    regimenId: regimen.id,
                    selectedStages: [regimen.name],
                  }));
                }}
              />

              {formData.regimenId && (
                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-blue-200 text-blue-500 shrink-0 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-blue-900">
                      Tính chất lộ trình
                    </p>
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      Phác đồ này được thiết kế để xử lý vấn đề hiện tại. Bạn có
                      thể phân bổ vật tư điều trị ở bước tiếp theo.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ),
      isValid:
        formData.purpose === "treatment" || formData.purpose === "amendment"
          ? !!formData.regimenId
          : formData.selectedStages.length > 0,
    },
    {
      id: "resources",
      title:
        formData.purpose === "cultivation"
          ? "Phân bổ & Công việc"
          : formData.purpose === "amendment"
            ? "Vật tư & Cải tạo"
            : "Vật tư & Phác đồ",
      description: "Hoạch định nguồn lực chi tiết",
      content: (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              {formData.purpose === "cultivation"
                ? "Định mức Vật tư & Giai đoạn"
                : formData.purpose === "amendment"
                  ? "Vật tư & Công việc Cải tạo"
                  : "Vật tư & Công việc Điều trị"}
            </h3>
            <p className="text-slate-500 text-sm mt-1 max-w-lg mx-auto">
              {formData.purpose === "cultivation"
                ? "Thiết lập chi tiết các hạng mục đầu tư và quy trình kỹ thuật cho từng giai đoạn của mùa vụ."
                : formData.purpose === "amendment"
                  ? "Phân bổ vật tư và công việc cụ thể để thực hiện quy trình cải tạo đất đã chọn."
                  : "Phân bổ vật tư và công việc cụ thể để thực hiện phác đồ điều trị đã chọn."}
            </p>
          </div>

          <div className="space-y-4">
            {formData.purpose === "cultivation"
              ? formData.selectedStages.map((stageKey, idx) => {
                  const [cycleId, stageName] = stageKey.includes(":")
                    ? stageKey.split(":")
                    : [null, stageKey];
                  const cycleName = cycleId
                    ? growthCycles.find((c) => c.id === cycleId)?.name
                    : null;

                  return (
                    <StageAllocation
                      isDetail={false}
                      key={idx}
                      stageName={stageName}
                      cycleName={cycleName}
                      index={idx}
                      allocations={formData.materialAllocations.filter(
                        (m) => m.stageId === stageKey,
                      )}
                      tasks={formData.taskAllocations.filter(
                        (t) => t.stageId === stageKey,
                      )}
                      onAddMaterial={(item) =>
                        handleAddMaterial({ ...item, stageId: stageKey })
                      }
                      onRemoveMaterial={handleRemoveMaterial}
                      onAddTask={(item) =>
                        handleAddTask({ ...item, stageId: stageKey })
                      }
                      onRemoveTask={handleRemoveTask}
                    />
                  );
                })
              : (() => {
                  const regimen = regimens.find(
                    (r) => r.id === formData.regimenId,
                  );
                  const stageKey = regimen?.name || "Treatment";
                  return regimen ? (
                    <div className="animation-slide-up">
                      <StageAllocation
                        isDetail={false}
                        index={0}
                        stageName={regimen.name}
                        cycleName={
                          formData.purpose === "amendment"
                            ? "Quy trình cải tạo"
                            : "Phác đồ điều trị"
                        }
                        allocations={formData.materialAllocations.filter(
                          (m) => m.stageId === stageKey,
                        )}
                        tasks={formData.taskAllocations.filter(
                          (t) => t.stageId === stageKey,
                        )}
                        onAddMaterial={(item) =>
                          handleAddMaterial({ ...item, stageId: stageKey })
                        }
                        onRemoveMaterial={handleRemoveMaterial}
                        onAddTask={(item) =>
                          handleAddTask({ ...item, stageId: stageKey })
                        }
                        onRemoveTask={handleRemoveTask}
                      />
                    </div>
                  ) : (
                    <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                      <p className="text-slate-400 font-medium italic">
                        {formData.purpose === "amendment"
                          ? "Vui lòng chọn quy trình cải tạo ở bước trước."
                          : "Vui lòng chọn phác đồ điều trị ở bước trước."}
                      </p>
                    </div>
                  );
                })()}
          </div>
        </div>
      ),
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
                  <Layers className="w-4 h-4 text-blue-600" />
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

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Layers className="w-4 h-4 text-emerald-500" />
                      Chi tiết phạm vi canh tác
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectionSummary.map((group) => (
                        <div
                          key={group.regionId}
                          className="space-y-3 p-4 rounded-xl border border-slate-100 bg-slate-50/30"
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                            <MapPin className="w-3 h-3 text-emerald-500" />
                            {group.regionName}
                          </div>
                          <div className="flex flex-wrap gap-1.5 pl-0">
                            {group.items.map((item, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className={cn(
                                  "text-[10px] py-0 px-2 h-5 font-medium shadow-xs",
                                  item.type === "region"
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
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
                  {formData.purpose === "cultivation" ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Mùa vụ áp dụng</span>
                        <span className="font-medium text-slate-900">
                          {formData.seasonName}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">
                          Số giai đoạn chọn
                        </span>
                        <Badge variant="outline" className="font-bold">
                          {formData.selectedStages.length} giai đoạn
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Loại kế hoạch</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "bg-red-50 text-red-700 border-red-200 uppercase",
                            formData.purpose === "amendment" &&
                              "bg-green-50 text-green-700 border-green-200",
                          )}
                        >
                          {formData.purpose === "amendment"
                            ? "CẢI TẠO"
                            : "ĐIỀU TRỊ"}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">
                          {formData.purpose === "amendment"
                            ? "Phác đồ cải tạo"
                            : "Phác đồ điều trị"}
                        </span>
                        <span
                          className={cn(
                            "font-bold text-red-900",
                            formData.purpose === "amendment" &&
                              "text-green-900",
                          )}
                        >
                          {regimens.find((r) => r.id === formData.regimenId)
                            ?.name || "---"}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-600" />
                    Nguồn lực dự kiến
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Vật tư
                      </span>
                      <p className="text-xl font-black text-slate-800">
                        {formData.materialAllocations.length}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Nhân lực
                      </span>
                      <p className="text-xl font-black text-slate-800">
                        {
                          new Set(
                            formData.taskAllocations
                              .map((t) => t.labor)
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
                        {formData.taskAllocations.length}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Material Summary */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase">
                        <Package className="w-3 h-3 text-purple-500" />
                        Danh mục vật tư
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.materialAllocations.length > 0 ? (
                          Array.from(
                            new Set(
                              formData.materialAllocations.map(
                                (m) => m.materialName,
                              ),
                            ),
                          ).map((name, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-purple-50 text-purple-700 border-purple-100 font-medium"
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

                    {/* Personnel Summary */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase">
                        <Users className="w-3 h-3 text-blue-500" />
                        Nhân lực huy động
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.taskAllocations.some((t) => t.labor) ? (
                          Array.from(
                            new Set(
                              formData.taskAllocations
                                .map((t) => t.labor)
                                .filter(Boolean),
                            ),
                          ).map((labor, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-blue-50 text-blue-700 border-blue-100 font-medium"
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

                    {/* Task Summary */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase">
                        <ClipboardList className="w-3 h-3 text-amber-500" />
                        Đầu việc triển khai
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.taskAllocations.length > 0 ? (
                          Array.from(
                            new Set(
                              formData.taskAllocations.map((t) => t.name),
                            ),
                          ).map((name, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-amber-50 text-amber-700 border-amber-100 font-medium"
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleComplete = () => {
    // Create plan data from formData
    const planData = {
      code: formData.code,
      name: formData.name,
      description: formData.description,
      seasonId: formData.seasonId,
      seasonName: formData.seasonName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      selectedRegionIds: formData.selectedRegionIds,
      selectedZoneIds: formData.selectedZoneIds,
      selectedPlotIds: formData.selectedPlotIds,
      crop: formData.crop,
      variety: formData.variety,
      purpose: formData.purpose,
      growthCycleId: formData.growthCycleId,
      regimenId: formData.regimenId,
      selectedStages: formData.selectedStages,
      status: "active" as const,
      materialAllocations: formData.materialAllocations,
      taskAllocations: formData.taskAllocations,
      area: calculateArea(),
    };

    addPlan(planData);

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
