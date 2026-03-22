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
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
  cn,
  type Step,
  ScrollArea,
} from "@tankhang1/eco-shared-ui";
import {
  Apple,
  Bug,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ClipboardList,
  Clock,
  Info,
  Layers,
  Leaf,
  MapPin,
  Package,
  Sprout,
  Users,
  Wrench,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import useRegimenStore from "../../stores/useRegimenStore";
import usePlanStore from "../../stores/usePlanStore";
import type {
  MaterialAllocation,
  TaskAllocation,
} from "../../stores/usePlanStore";
import useSeasonStore from "../../stores/useSeasonStore";
import useRegionStore from "@/stores/useRegionStore";
import useGrowthCycleStore from "@/stores/useGrowthCycleStore";
import { StageAllocation } from "./components/StageAllocation";
import { EnterpriseSelector } from "../cultivation-zone/cultivation-region/components";
import GeographicalSelector from "./components/GeographicalSelector";
import { RegimenSelector } from "./components/RegimenSelector";

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
  purpose: "cultivation" | "treatment" | "amendment" | "harvest" | "incurred";
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
  const regimens = useRegimenStore((state) => state.regimens);
  const growthCycles = useGrowthCycleStore((state) => state.growthCycles);

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

  const getTaskSelectionSummary = useCallback(
    (taskSelections: any[] | undefined) => {
      if (!regions || !taskSelections) return [];

      const summary: {
        regionId: string;
        regionName: string;
        items: { type: "region" | "area" | "plot"; name: string }[];
      }[] = [];

      taskSelections.forEach((sel) => {
        const region = regions.find(
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
          regionGroup.items.push({ type: "region", name: "Toàn bộ vùng" });
        } else if (sel.type === "area") {
          const area = region.subAreas?.find(
            (a) => String(a.id) === String(sel.areaId),
          );
          if (area) regionGroup.items.push({ type: "area", name: area.name });
        } else if (sel.type === "plot") {
          const area = region.subAreas?.find(
            (a) => String(a.id) === String(sel.areaId),
          );
          const plot = area?.plots?.find(
            (p) => String(p.id) === String(sel.plotId),
          );
          if (plot) regionGroup.items.push({ type: "plot", name: plot.name });
        }
      });
      return summary;
    },
    [regions],
  );

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
              <h3 className="font-semibold">Chỉnh sửa kế hoạch</h3>
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
                  Đơn vị sở hữu <span className="text-red-500">*</span>
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
                          Chọn đơn vị sở hữu trước
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
            <div className="grid grid-cols-4 gap-4">
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
                {
                  id: "harvest",
                  label: "Thu hoạch",
                  icon: Apple,
                  borderColor: "border-orange-500",
                  bgColor: "bg-orange-50/50",
                  activeColor: "bg-orange-500",
                  textColor: "text-orange-700",
                  description: "Thu hoạch",
                },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      purpose: type.id as any,
                      selectedStages:
                        type.id === "harvest" ? ["Thu hoạch"] : [],
                      regimenId: type.id === "harvest" ? "" : prev.regimenId,
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

          {formData.purpose === "harvest" ? null : formData.purpose ===
            "cultivation" ? (
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
        formData.purpose === "harvest"
          ? true
          : formData.purpose === "treatment" || formData.purpose === "amendment"
            ? !!formData.regimenId
            : formData.selectedStages.length > 0,
    },
    {
      id: "resources",
      title:
        formData.purpose === "harvest"
          ? "Vật tư - Nhân sự & cách thức"
          : formData.purpose === "cultivation"
            ? "Phân bổ & Công việc"
            : formData.purpose === "amendment"
              ? "Vật tư & Nhân lực"
              : "Vật tư & Phác đồ",
      description: "Hoạch định nguồn lực chi tiết",
      content: (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              {formData.purpose === "harvest"
                ? "Cách thức & Nguồn lực Thu hoạch"
                : formData.purpose === "cultivation"
                  ? "Định mức Vật tư & Giai đoạn"
                  : formData.purpose === "amendment"
                    ? "Vật tư & Công việc Cải tạo"
                    : "Vật tư & Công việc Điều trị"}
            </h3>
            <p className="text-slate-500 text-sm mt-1 max-w-lg mx-auto">
              {formData.purpose === "harvest"
                ? "Thiết lập các yêu cầu về vật tư, nhân sự và mô tả cách thức triển khai thu hoạch."
                : formData.purpose === "cultivation"
                  ? "Thiết lập chi tiết các hạng mục đầu tư và quy trình kỹ thuật cho từng giai đoạn của mùa vụ."
                  : formData.purpose === "amendment"
                    ? "Phân bổ vật tư và công việc cụ thể để thực hiện quy trình cải tạo đất đã chọn."
                    : "Phân bổ vật tư và công việc cụ thể để thực hiện phác đồ điều trị đã chọn."}
            </p>
          </div>

          <div className="space-y-4">
            {formData.purpose === "harvest" ? (
              <div className="animation-slide-up">
                <StageAllocation
                  isDetail={false}
                  index={0}
                  stageName="Thu hoạch"
                  cycleName="Kế hoạch thu hoạch"
                  allocations={formData.materialAllocations.filter(
                    (m) => m.stageId === "Thu hoạch",
                  )}
                  tasks={formData.taskAllocations.filter(
                    (t) => t.stageId === "Thu hoạch",
                  )}
                  regions={regions}
                  masterSelections={selections}
                  enterpriseId={selectedEnterpriseId}
                  onAddMaterial={(item) =>
                    handleAddMaterial({ ...item, stageId: "Thu hoạch" })
                  }
                  onRemoveMaterial={handleRemoveMaterial}
                  onAddTask={(item) =>
                    handleAddTask({ ...item, stageId: "Thu hoạch" })
                  }
                  onRemoveTask={handleRemoveTask}
                />
              </div>
            ) : formData.purpose === "cultivation" ? (
              formData.selectedStages.map((stageKey, idx) => {
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
                    regions={regions}
                    masterSelections={selections}
                    enterpriseId={selectedEnterpriseId}
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
            ) : (
              (() => {
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
                      regions={regions}
                      masterSelections={selections}
                      enterpriseId={selectedEnterpriseId}
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
              })()
            )}
          </div>
        </div>
      ),
    },
    {
      id: "confirmation",
      title: "Xác nhận thay đổi",
      description: "Kiểm tra lại trước khi lưu",
      content: (
        <div className="mx-auto space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Xác nhận thay đổi kế hoạch
            </h2>
            <p className="text-slate-500">
              Vui lòng kiểm tra kỹ các thông tin đã chỉnh sửa.
            </p>
          </div>

          <Card className="border-l-4 border-l-primary shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    {formData.name}
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 uppercase font-bold"
                    >
                      Chờ kích hoạt
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" /> Mã: {formData.code}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {formData.startDate} -{" "}
                      {formData.endDate}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            {formData.description && (
              <CardContent>
                <p className="text-muted-foreground bg-slate-50 p-4 rounded-lg italic border border-slate-100">
                  "{formData.description}"
                </p>
              </CardContent>
            )}
          </Card>

          {/* 2-Column Grid: General Info + Cultivation Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Info Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b bg-slate-50/80">
                <CardTitle className="text-base flex items-center gap-2 text-blue-700">
                  <Sprout className="w-5 h-5" />
                  Thông tin chung
                  {(formData.purpose === "treatment" ||
                    formData.purpose === "amendment" ||
                    formData.purpose === "harvest") && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "ml-auto font-bold uppercase",
                        formData.purpose === "treatment"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : formData.purpose === "amendment"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-orange-100 text-orange-800 border-orange-200",
                      )}
                    >
                      {formData.purpose === "treatment"
                        ? "KẾ HOẠCH ĐIỀU TRỊ"
                        : formData.purpose === "amendment"
                          ? "KẾ HOẠCH CẢI TẠO"
                          : "KẾ HOẠCH THU HOẠCH"}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Mùa vụ
                    </label>
                    <p className="font-medium mt-1 text-slate-800">
                      {formData.seasonName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Cây trồng
                    </label>
                    <p className="font-medium mt-1 text-slate-800">
                      {formData.crop} - {formData.variety}
                    </p>
                  </div>
                  {formData.purpose === "cultivation" ? (
                    <div>
                      <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        Quy trình
                      </label>
                      <p className="font-medium mt-1 text-slate-800">
                        Đã chọn {formData.selectedStages.length} giai đoạn
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        {formData.purpose === "amendment"
                          ? "Phác đồ cải tạo đất"
                          : formData.purpose === "harvest"
                            ? "Loại hình"
                            : "Phác đồ điều trị"}
                      </label>
                      <p
                        className={cn(
                          "font-bold mt-1",
                          formData.purpose === "amendment"
                            ? "text-amber-900"
                            : formData.purpose === "harvest"
                              ? "text-orange-900"
                              : "text-blue-900",
                        )}
                      >
                        {formData.purpose === "harvest"
                          ? "Kế hoạch thu hoạch"
                          : regimens.find((r) => r.id === formData.regimenId)
                              ?.name || "---"}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Trạng thái
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200"
                      >
                        Chờ kích hoạt
                      </Badge>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 block">
                    Thời gian thực hiện
                  </label>
                  <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-blue-900">
                        {formData.startDate} - {formData.endDate}
                      </p>
                      <p className="text-xs text-blue-600">
                        Thời gian dự kiến theo kế hoạch
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cultivation Info Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b bg-slate-50/80">
                <CardTitle className="text-base flex items-center gap-2 text-green-700">
                  <MapPin className="w-5 h-5" />
                  Thông tin canh tác
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5 px-6">
                <div className="space-y-4">
                  <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                    Chi tiết phạm vi canh tác
                  </label>
                  <div className="space-y-3">
                    {selectionSummary.length === 0 && (
                      <p className="text-sm italic text-slate-400">
                        Chưa xác định vùng chọn
                      </p>
                    )}
                    {selectionSummary.map((group) => (
                      <div
                        key={group.regionId}
                        className="space-y-2 p-3 rounded-xl border border-slate-100 bg-slate-50/50"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          {group.regionName}
                        </div>
                        <div className="flex flex-wrap gap-1.5 pl-0">
                          {group.items.map((item, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className={cn(
                                "text-[10px] py-0 px-2 h-5 font-medium shadow-xs border-emerald-100 bg-white",
                                item.type === "region" &&
                                  "bg-emerald-50 text-emerald-800",
                                item.type === "area" &&
                                  "bg-blue-50 text-blue-700 border-blue-100",
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

                <div className="grid grid-cols-2 gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <div>
                    <p className="text-[10px] text-emerald-700 font-black uppercase tracking-wider mb-1">
                      Tổng diện tích
                    </p>
                    <p className="text-xl font-black text-emerald-800">
                      {calculateArea()} ha
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-700 font-black uppercase tracking-wider mb-1">
                      Cây trồng & Giống
                    </p>
                    <p className="text-xl font-black text-emerald-800">
                      {formData.crop} - {formData.variety}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stage Cards with Tabs (same as PlanDetailPage) */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2.5 rounded-2xl shadow-sm",
                  formData.purpose === "treatment" && "bg-blue-100/50",
                  formData.purpose === "amendment" && "bg-amber-100/50",
                  formData.purpose === "harvest" && "bg-orange-100/50",
                  formData.purpose === "cultivation" && "bg-emerald-100/50",
                )}
              >
                <Layers
                  className={cn(
                    "w-7 h-7",
                    formData.purpose === "treatment" && "text-blue-600",
                    formData.purpose === "amendment" && "text-amber-600",
                    formData.purpose === "harvest" && "text-orange-600",
                    formData.purpose === "cultivation" && "text-emerald-600",
                  )}
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {formData.purpose === "treatment"
                    ? "Lộ trình xử lý & Phác đồ"
                    : formData.purpose === "amendment"
                      ? "Lộ trình cải tạo & Quy trình"
                      : formData.purpose === "harvest"
                        ? "Vật tư - Nhân sự & Cách thức"
                        : "Lộ trình triển khai & Giai đoạn"}
                </h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                  Chi tiết các hạng mục và kế hoạch hành động
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {formData.selectedStages.map((stageKey, index) => {
                const [cycleId, stageName] = stageKey.includes(":")
                  ? stageKey.split(":")
                  : [null, stageKey];
                const cycle = cycleId
                  ? growthCycles?.find((c) => c.id === cycleId)
                  : null;

                const stageMaterials = formData.materialAllocations.filter(
                  (m) => m.stageId === stageKey,
                );
                const stageTasks = formData.taskAllocations.filter(
                  (t) => t.stageId === stageKey,
                );

                return (
                  <Card
                    key={stageKey}
                    className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl"
                  >
                    <div className="bg-slate-50/80 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center font-black text-sm text-slate-700">
                          {index + 1}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base text-slate-900">
                              {stageName}
                            </h4>
                            {cycle && (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100 font-normal py-0 px-2 h-4"
                              >
                                {cycle.name}
                              </Badge>
                            )}
                          </div>
                          {formData.purpose !== "cultivation" && (
                            <p
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-wider",
                                formData.purpose === "amendment"
                                  ? "text-amber-600"
                                  : formData.purpose === "harvest"
                                    ? "text-orange-600"
                                    : "text-blue-600",
                              )}
                            >
                              {formData.purpose === "amendment"
                                ? "Hoạt động cải tạo đất"
                                : formData.purpose === "harvest"
                                  ? "Hoạt động thu hoạch"
                                  : "Hoạt động điều trị bệnh"}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3 text-sm">
                        <Badge
                          variant="outline"
                          className="bg-white hover:bg-green-50 transition-colors"
                        >
                          <Leaf className="w-3 h-3 mr-1 text-green-600" />
                          {stageMaterials.length} vật tư
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-white hover:bg-blue-50 transition-colors"
                        >
                          <Users className="w-3 h-3 mr-1 text-blue-600" />
                          {stageTasks.length} công việc
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-0">
                      {stageMaterials.length === 0 &&
                      stageTasks.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground italic">
                          Chưa có hoạt động nào được lên kế hoạch cho giai đoạn
                          này.
                        </div>
                      ) : (
                        <Tabs defaultValue="materials" className="w-full">
                          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                            <TabsTrigger
                              value="materials"
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-700 data-[state=active]:bg-green-50/50 px-6 py-3 font-medium text-sm flex-1 md:flex-none"
                            >
                              <Leaf className="w-4 h-4 mr-2" />
                              Vật tư ({stageMaterials.length})
                            </TabsTrigger>
                            <TabsTrigger
                              value="tasks"
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50/50 px-6 py-3 font-medium text-sm flex-1 md:flex-none"
                            >
                              <Users className="w-4 h-4 mr-2" />
                              Công việc ({stageTasks.length})
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent
                            value="materials"
                            className="p-4 m-0 bg-white"
                          >
                            {stageMaterials.length === 0 ? (
                              <div className="text-center py-6 border border-dashed rounded-lg bg-slate-50/50 mx-auto max-w-md">
                                <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">
                                  Chưa có vật tư phân bổ
                                </p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {stageMaterials.map((mat) => (
                                  <div
                                    key={mat.id}
                                    className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/30 hover:bg-slate-50 transition-colors"
                                  >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                      <div className="bg-white p-2 rounded-md shadow-sm border shrink-0">
                                        <Package className="w-4 h-4 text-green-600" />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate text-slate-800">
                                          {mat.materialName}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {mat.materialCategory} •{" "}
                                          {mat.materialType}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0 pl-2">
                                      <Badge
                                        variant="secondary"
                                        className="mb-1"
                                      >
                                        {mat.quantity} {mat.unit}
                                      </Badge>
                                      {mat.packaging && (
                                        <p className="text-[10px] text-muted-foreground">
                                          {mat.packaging}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent
                            value="tasks"
                            className="p-4 m-0 bg-white"
                          >
                            {stageTasks.length === 0 ? (
                              <div className="text-center py-6 border border-dashed rounded-lg bg-slate-50/50 mx-auto max-w-md">
                                <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">
                                  Chưa có công việc phân bổ
                                </p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-3">
                                {stageTasks.map((task) => (
                                  <div
                                    key={task.id}
                                    className="flex items-start gap-4 p-4 rounded-lg border bg-blue-50/10 hover:bg-blue-50/30 transition-colors"
                                  >
                                    <div className="bg-blue-100 p-2 rounded-full shrink-0">
                                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                        <h5 className="font-bold text-sm text-slate-900">
                                          {task.name}
                                        </h5>
                                        <div className="flex gap-2 shrink-0">
                                          {task.labor && (
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] h-5 bg-white text-slate-600 border-slate-200"
                                            >
                                              <Users className="w-3 h-3 mr-1" />
                                              {task.labor}
                                            </Badge>
                                          )}
                                          {task.duration && (
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] h-5 bg-amber-50 text-amber-700 border-amber-200"
                                            >
                                              <Clock className="w-3 h-3 mr-1" />
                                              {task.duration}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                        {task.description ||
                                          "Chưa có mô tả chi tiết"}
                                      </p>
                                      {/* Geographical summary for the task item */}
                                      {task.geographicalSelections &&
                                        task.geographicalSelections.length >
                                          0 && (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-blue-50/50 mt-2">
                                            {getTaskSelectionSummary(
                                              task.geographicalSelections,
                                            ).map((group) => (
                                              <div
                                                key={group.regionId}
                                                className="flex flex-col gap-1 border-l-2 border-blue-100 pl-2 py-0.5"
                                              >
                                                <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
                                                  <MapPin className="w-3 h-3 text-slate-400" />
                                                  {group.regionName}
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                  {group.items.map(
                                                    (item, idx) => (
                                                      <Badge
                                                        key={idx}
                                                        variant="outline"
                                                        className={cn(
                                                          "text-[9px] py-0 px-1.5 h-4 font-medium border-slate-200 shadow-none bg-white",
                                                          item.type ===
                                                            "region" &&
                                                            "text-emerald-700 bg-emerald-50/50",
                                                          item.type ===
                                                            "area" &&
                                                            "text-blue-700 bg-blue-50/50",
                                                        )}
                                                      >
                                                        {item.name}
                                                      </Badge>
                                                    ),
                                                  )}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Dark Summary Footer Card */}
          <Card className="bg-slate-900 text-slate-50 border-none shadow-lg mt-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center md:text-left">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Tổng giai đoạn
                  </p>
                  <div className="flex items-baseline justify-center md:justify-start gap-1">
                    <span className="text-4xl font-bold">
                      {formData.selectedStages.length}
                    </span>
                    <span className="text-slate-500 font-medium">bước</span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Tổng vật tư
                  </p>
                  <div className="flex items-baseline justify-center md:justify-start gap-1">
                    <span className="text-4xl font-bold text-green-400">
                      {formData.materialAllocations.length}
                    </span>
                    <span className="text-slate-500 font-medium">mục</span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Tổng công việc
                  </p>
                  <div className="flex items-baseline justify-center md:justify-start gap-1">
                    <span className="text-4xl font-bold text-blue-400">
                      {formData.taskAllocations.length}
                    </span>
                    <span className="text-slate-500 font-medium">đầu việc</span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Diện tích
                  </p>
                  <div className="flex items-baseline justify-center md:justify-start gap-1">
                    <span className="text-4xl font-bold text-emerald-400">
                      {calculateArea()}
                    </span>
                    <span className="text-slate-500 font-medium">ha</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  if (!plan) return null;

  return (
    <AdminLayout
      title="Chỉnh sửa Kế hoạch"
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
