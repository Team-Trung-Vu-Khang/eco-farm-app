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
  ScrollArea,
  useToast,
  cn,
  type Step,
} from "@tankhang1/eco-shared-ui";
import {
  AlertTriangle,
  ClipboardList,
  FileCheck,
  Info,
  Layers,
  MapPin,
  Package,
  Sprout,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { GROWTH_CYCLES, TREATMENT_REGIMENS } from "./constants";
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

export interface GeographicalSelection {
  id: string;
  type: "region" | "area" | "plot";
  regionId: string;
  areaId?: string;
  plotId?: string;
}

export interface EditPlanForm {
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
  purpose: "cultivation" | "treatment";
  growthCycleId: string;
  regimenId: string;
  selectedStages: string[];
  status: "active" | "planning" | "completed" | "cancelled";
  materialAllocations: MaterialAllocation[];
  taskAllocations: TaskAllocation[];
}

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
    className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
      checked ? "bg-primary/5 border-primary/20" : "bg-white hover:bg-slate-50"
    }`}
  >
    <div className="flex items-center justify-center">
      <Checkbox checked={checked} onCheckedChange={(c) => onChange(!!c)} />
    </div>
    <div
      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
        checked ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
      }`}
    >
      {index + 1}
    </div>
    <div
      className={`flex-1 font-medium ${
        checked ? "text-slate-900" : "text-slate-500"
      }`}
    >
      {stage}
    </div>
  </div>
);

export default function PlanEditPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selections, setSelections] = useState<GeographicalSelection[]>([]);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("");

  // Zustand stores
  const getPlanById = usePlanStore((state) => state.getPlanById);
  const updatePlan = usePlanStore((state) => state.updatePlan);
  const seasons = useSeasonStore((state) => state.seasons);
  const { regions } = useRegionStore();
  const { growthCycles } = useGrowthCycleStore();

  const plan = getPlanById(Number(params.id));

  const [formData, setFormData] = useState<EditPlanForm>({
    code: "",
    name: "",
    description: "",
    seasonId: "",
    seasonName: "",
    startDate: "",
    endDate: "",
    selectedRegionIds: [],
    selectedZoneIds: [],
    selectedPlotIds: [],
    crop: "",
    variety: "",
    purpose: "cultivation",
    growthCycleId: "",
    regimenId: "",
    selectedStages: [],
    materialAllocations: [],
    taskAllocations: [],
    status: "active",
  });

  const [dateWarning, setDateWarning] = useState<string | null>(null);

  // Initialize form with existing plan data and reconstruct selections
  useEffect(() => {
    if (plan && regions.length > 0) {
      setFormData({
        code: plan.code || "",
        name: plan.name || "",
        description: plan.description || "",
        seasonId: plan.seasonId || "",
        seasonName: plan.seasonName || "",
        startDate: plan.startDate || "",
        endDate: plan.endDate || "",
        selectedRegionIds: plan.selectedRegionIds || [],
        selectedZoneIds: plan.selectedZoneIds || [],
        selectedPlotIds: plan.selectedPlotIds || [],
        crop: plan.crop || "",
        variety: plan.variety || "",
        purpose: plan.purpose || "cultivation",
        growthCycleId: plan.growthCycleId || "",
        regimenId: plan.regimenId || "",
        selectedStages: plan.selectedStages || [],
        materialAllocations: plan.materialAllocations || [],
        taskAllocations: plan.taskAllocations || [],
        status: plan.status as any,
      });

      // Reconstruct GeographicalSelection array for the selector
      const initialSelections: GeographicalSelection[] = [];
      const regionIds = plan.selectedRegionIds || [];
      const zoneIds = plan.selectedZoneIds || [];
      const plotIds = plan.selectedPlotIds || [];

      regionIds.forEach((rid) => {
        const region = regions.find((r) => String(r.id) === String(rid));
        if (!region) return;

        // Determine if whole region, whole areas, or specific plots were selected
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
          if (!selectedEnterpriseId)
            setSelectedEnterpriseId(region.enterpriseId);
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
                if (!selectedEnterpriseId)
                  setSelectedEnterpriseId(region.enterpriseId);
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
                    if (!selectedEnterpriseId)
                      setSelectedEnterpriseId(region.enterpriseId);
                  }
                });
              }
            }
          });
        }
      });

      setSelections(initialSelections);
    } else if (!plan) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy kế hoạch",
        variant: "destructive",
      });
      setLocation("/plan");
    }
  }, [plan, regions, toast, setLocation]);

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
      selectedRegionIds: Array.from(regionIds),
      selectedZoneIds: Array.from(zoneIds),
      selectedPlotIds: Array.from(plotIds),
      crop: mainCrop || prev.crop,
      variety: mainVariety || prev.variety,
    }));
  };

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

  const handleGrowthCycleChange = (id: string) => {
    const cycle = growthCycles.find((c) => c.id === id);
    if (cycle) {
      setFormData((prev) => ({
        ...prev,
        growthCycleId: id,
        selectedStages: cycle.stages.map((s) => s.name),
      }));
    }
  };

  const calculateArea = () => {
    let total = 0;
    const regionIds = formData.selectedRegionIds || [];
    const zoneIds = formData.selectedZoneIds || [];
    const plotIds = formData.selectedPlotIds || [];

    regionIds.forEach((rid) => {
      const region = regions.find((r) => String(r.id) === String(rid));
      if (!region) return;

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

  const handleComplete = () => {
    updatePlan(Number(params.id), {
      ...formData,
      id: Number(params.id),
      area: calculateArea(),
    } as any);

    toast({
      title: "Thành công",
      description: `Đã cập nhật kế hoạch ${formData.name}`,
    });
    setLocation(`/plan/${params.id}`);
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
                Điều chỉnh thông tin mùa vụ và thời gian thực hiện.
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
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                    1
                  </span>
                  Chọn vùng canh tác
                </h3>
                <Label className="text-sm font-medium text-slate-700">
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
                <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-sm space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                        Vùng canh tác <span className="text-red-500">*</span>
                      </label>
                      {!selectedEnterpriseId && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-amber-50"
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
                        Khu vực canh tác
                      </p>
                      <h4 className="text-xl font-black leading-tight">
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
                        <Badge className="bg-white/20 text-white font-bold h-5">
                          {formData.selectedPlotIds.length} LÔ ĐẤT
                        </Badge>
                        <Badge className="bg-white/20 text-white font-bold h-5">
                          {calculateArea()} HA
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {selectionSummary.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                        Chi tiết phạm vi
                      </p>
                      <ScrollArea className="h-40 pr-2">
                        <div className="space-y-3">
                          {selectionSummary.map((group) => (
                            <div key={group.regionId} className="space-y-1.5">
                              <div className="text-[10px] font-bold text-emerald-100 uppercase opacity-60">
                                {group.regionName}
                              </div>
                              {group.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2 rounded-xl bg-white/10 border border-white/5"
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        item.type === "region"
                                          ? "bg-amber-400"
                                          : item.type === "area"
                                            ? "bg-blue-400"
                                            : "bg-emerald-400",
                                      )}
                                    />
                                    <span className="text-xs font-medium">
                                      {item.name}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
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
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, purpose: "cultivation" }))
                }
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all",
                  formData.purpose === "cultivation"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md"
                    : "bg-white border-slate-100 text-slate-500",
                )}
              >
                <Sprout className="w-8 h-8" />
                <p className="font-bold text-sm">Canh tác</p>
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, purpose: "treatment" }))
                }
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all",
                  formData.purpose === "treatment"
                    ? "bg-blue-50 border-blue-500 text-blue-900 shadow-md"
                    : "bg-white border-slate-100 text-slate-500",
                )}
              >
                <ClipboardList className="w-8 h-8" />
                <p className="font-bold text-sm">Điều trị</p>
              </button>
            </div>
          </div>

          {formData.purpose === "cultivation" ? (
            <div className="space-y-4 animation-fade-in">
              <Label className="text-base">Quy trình canh tác áp dụng</Label>
              <Select
                value={formData.growthCycleId}
                onValueChange={handleGrowthCycleChange}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Chọn quy trình mẫu..." />
                </SelectTrigger>
                <SelectContent>
                  {growthCycles
                    .filter((c) => c.cropName === formData.crop)
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.totalDays} ngày)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-4 animation-fade-in">
              <Label className="text-base">Phác đồ điều trị bệnh</Label>
              <Select
                value={formData.regimenId}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, regimenId: v }))
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Chọn phác đồ điều trị..." />
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
          )}

          {formData.selectedStages.length > 0 && (
            <div className="space-y-4">
              <Label>Các giai đoạn thực hiện</Label>
              <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2">
                {formData.selectedStages.map((stage, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-slate-50 border rounded-lg"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="font-medium">{stage}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
      isValid:
        formData.purpose === "treatment"
          ? !!formData.regimenId
          : !!formData.growthCycleId,
    },
    {
      id: "resources",
      title: "Nguồn lực & Công việc",
      description: "Phân bổ chi tiết",
      content: (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Định mức Vật tư & Công việc
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Điều chỉnh chi tiết các hạng mục cho từng giai đoạn.
            </p>
          </div>

          <div className="space-y-4">
            {formData.selectedStages.map((stage, idx) => (
              <StageAllocation
                key={idx}
                stageName={stage}
                index={idx}
                allocations={(formData.materialAllocations || []).filter(
                  (m) => m.stageId === stage,
                )}
                tasks={(formData.taskAllocations || []).filter(
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
      title: "Xác nhận",
      description: "Kiểm tra và lưu",
      content: (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <FileCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Sẵn sàng lưu thay đổi
            </h2>
            <p className="text-slate-500">
              Vui lòng kiểm tra kỹ các thông tin đã chỉnh sửa.
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-3 border-b bg-slate-50/50">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  Tổng quan kế hoạch
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 gap-y-4 text-sm font-medium">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase mb-1">
                    Tên kế hoạch
                  </span>
                  {formData.name}
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase mb-1">
                    Mã kế hoạch
                  </span>
                  <Badge variant="secondary">{formData.code}</Badge>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase mb-1">
                    Mùa vụ
                  </span>
                  {formData.seasonName}
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase mb-1">
                    Thời gian
                  </span>
                  {formData.startDate} → {formData.endDate}
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase mb-1">
                    Cây trồng
                  </span>
                  {formData.crop} ({formData.variety})
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase mb-1">
                    Diện tích
                  </span>
                  {calculateArea()} HA
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-emerald-50/30 border-emerald-100">
                <CardContent className="pt-6 text-center">
                  <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">
                    Vật tư phân bổ
                  </p>
                  <p className="text-3xl font-black text-emerald-900">
                    {formData.materialAllocations.length}
                  </p>
                  <p className="text-[10px] opacity-60">hạng mục</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50/30 border-blue-100">
                <CardContent className="pt-6 text-center">
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-2">
                    Công việc
                  </p>
                  <p className="text-3xl font-black text-blue-900">
                    {formData.taskAllocations.length}
                  </p>
                  <p className="text-[10px] opacity-60">đầu việc</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (!plan) return null;

  return (
    <AdminLayout
      title="Chỉnh sửa Kế hoạch canh tác"
      description={`Cập nhật thông tin chi tiết cho kế hoạch ${plan.code}`}
    >
      <div className="max-w-5xl mx-auto">
        <StepperForm
          steps={steps}
          onComplete={handleComplete}
          onCancel={() => setLocation(`/plan/${params.id}`)}
          completeLabel="Lưu thay đổi"
        />
      </div>
    </AdminLayout>
  );
}
