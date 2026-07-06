import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StepperForm,
  Textarea,
  cn,
  useToast,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  Apple,
  Bug,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FileCheck,
  Info,
  Layers,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Sprout,
  StickyNote,
  Target,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";

import useAmendmentPlanStore from "../../stores/useAmendmentPlanStore";
import { useAmendmentRegimenStore } from "../../stores/useAmendmentRegimenStore";
import usePersonnelStore from "../../stores/usePersonnelStore";
import usePlanStore from "../../stores/usePlanStore";
import useRegionStore from "../../stores/useRegionStore";
import useTaskStore from "../../stores/useTaskStore";
import useTeamStore from "../../stores/useTeamStore";
import { useTreatmentStore } from "../../stores/useTreatmentStore";
import { EnterpriseSelector } from "../cultivation-zone/cultivation-region/components";
import GeographicalSelector from "../plan/components/GeographicalSelector";
import { RegimenSelector } from "../plan/components/RegimenSelector";
import { TaskStageAllocation } from "../plan/components/TaskStageAllocation";
import type {
  GeographicalSelection,
  MaterialAllocation,
  TaskAllocation,
} from "../plan/types";
import { getFrequencyText } from "../plan/utils/task";

const SelectionCard = ({
  regionId,
  areaId,
  items,
  regions,
  onRemove,
  showRemoveButton = true,
}: {
  regionId: string;
  areaId?: string;
  items: GeographicalSelection[];
  regions: any[];
  onRemove: (ids: string[]) => void;
  showRemoveButton?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const region = regions.find((r) => String(r.id) === String(regionId));
  const area = region?.subAreas?.find(
    (a: any) => String(a.id) === String(areaId),
  );

  const primaryItem =
    items.find((i) => i.type === "area" || i.type === "region") || items[0];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "region":
        return "Vùng trồng";
      case "area":
        return "Khu vực";
      case "plot":
        return "Lô đất";
      default:
        return type;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all group animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-left">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "p-2.5 rounded-xl shrink-0 transition-colors duration-300",
              primaryItem.type === "region"
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary group-hover:bg-primary/20",
            )}
          >
            {primaryItem.type === "region" ? (
              <MapPin className="w-5 h-5" />
            ) : (
              <Layers className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-bold tracking-wider py-0 px-1.5 h-4 border-primary/20 text-primary bg-primary/5"
              >
                {getTypeLabel(primaryItem.type)}
              </Badge>
              {showRemoveButton ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                  onClick={() => onRemove(items.map((i) => i.id))}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <></>
              )}
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              {area?.name || region?.name}
            </div>
            <div className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium">
              ID: {areaId || regionId}
            </div>
          </div>
        </div>

        {(primaryItem.type !== "region" || items.length > 1) && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-2"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <span>Phân cấp quản lý</span>
            </button>

            {isExpanded && (
              <div className="mt-4 ml-3 relative">
                {/* Main vertical stem on the left */}
                <div className="absolute left-0 top-0 bottom-4 w-px bg-slate-200" />

                <div className="space-y-4">
                  {/* Region Level */}
                  <div className="flex items-center gap-3 relative z-10 pl-4">
                    <div className="absolute left-0 w-4 h-px bg-slate-200 top-1/2" />
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
                        Vùng trồng
                      </div>
                      <div className="text-xs font-bold text-slate-700">
                        {region?.name}
                      </div>
                    </div>
                    {items.some((i) => i.type === "region") && (
                      <Badge className="ml-auto bg-primary/10 text-primary border-none text-[10px]">
                        Đã chọn vùng
                      </Badge>
                    )}
                  </div>

                  {/* Area Level & Plots */}
                  {areaId && (
                    <div className="relative pl-4">
                      {/* Branch from main stem to Area */}
                      <div className="absolute left-0 w-4 h-px bg-slate-200 top-4" />

                      <div className="pl-4 relative">
                        {/* Nested Stem if Plots exist */}
                        {items.some((i) => i.type === "plot") && (
                          <div className="absolute left-3.75 top-4 bottom-4 w-px bg-slate-200" />
                        )}

                        <div className="flex items-center gap-3 relative z-10 py-1">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg border flex items-center justify-center shadow-xs shrink-0",
                              items.some((i) => i.type === "area")
                                ? "bg-primary/5 border-primary/20"
                                : "bg-slate-50 border-slate-100",
                            )}
                          >
                            <Layers
                              className={cn(
                                "w-3.5 h-3.5",
                                items.some((i) => i.type === "area")
                                  ? "text-primary"
                                  : "text-slate-400",
                              )}
                            />
                          </div>
                          <div>
                            <div
                              className={cn(
                                "text-[10px] uppercase font-bold tracking-wider leading-none mb-1",
                                items.some((i) => i.type === "area")
                                  ? "text-primary/60"
                                  : "text-slate-400",
                              )}
                            >
                              Khu vực
                            </div>
                            <div
                              className={cn(
                                "text-xs font-bold",
                                items.some((i) => i.type === "area")
                                  ? "text-slate-900"
                                  : "text-slate-700",
                              )}
                            >
                              {area?.name}
                            </div>
                          </div>
                        </div>

                        {/* Plots Level */}
                        <div className="space-y-3 mt-3">
                          {items
                            .filter((i) => i.type === "plot")
                            .map((pSelection) => {
                              const plot = area?.plots?.find(
                                (p: any) => p.id === pSelection.plotId,
                              );
                              return (
                                <div
                                  key={pSelection.id}
                                  className="flex items-center gap-3 relative z-10 pl-8 group/plot"
                                >
                                  <div className="absolute left-3.75 w-4 h-px bg-slate-200 top-1/2" />
                                  <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shadow-xs shrink-0">
                                    <Target className="w-3.5 h-3.5 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-[10px] text-primary/60 font-bold uppercase tracking-wider leading-none mb-1">
                                      Lô đất
                                    </div>
                                    <div className="text-xs font-bold text-slate-900">
                                      {plot?.name || pSelection.plotId}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemove([pSelection.id])}
                                    className="h-6 w-6 p-0 opacity-0 group-hover/plot:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3 text-slate-400 hover:text-red-500" />
                                  </Button>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function TaskEditPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { getTaskById, updateTask } = useTaskStore();
  const plans = usePlanStore((state) => state.plans);
  const amendmentPlans = useAmendmentPlanStore((state) => state.plans);
  const personnel = usePersonnelStore((state) => state.personnel);
  const teams = useTeamStore((state) => state.teams);
  const treatments = useTreatmentStore((state) => state.treatments);
  const amendmentRegimensRaw = useAmendmentRegimenStore(
    (state) => state.regimens,
  );
  const regimens = useMemo(() => {
    const mappedTreatments = treatments.map((t) => ({
      id: String(t.id),
      name: t.name,
      description: t.disease || t.name,
      type: "tri-benh" as const,
      provider: t.author || "Chưa rõ",
      category: t.disease || "Điều trị",
      crop: t.crop || "Tất cả",
      steps:
        t.procedures?.map((p: any) => ({
          id: String(p.id),
          day: p.startDay ? `Ngày ${p.startDay}` : `Ngày ${p.stepNumber}`,
          title: p.name,
          description: p.description,
        })) || [],
    }));

    const mappedAmendments = amendmentRegimensRaw.map((t) => ({
      id: String(t.id),
      name: t.name,
      description: t.soilIssue || t.name,
      type: "cai-tao-dat" as const,
      provider: t.authors?.[0]?.name || "Chưa rõ",
      category: t.soilIssue || "Cải tạo",
      crop: t.cropType || "Tất cả",
      steps:
        t.procedures?.map((p: any) => ({
          id: String(p.id),
          day: p.timing || `Ngày ${p.stepNumber}`,
          title: p.name,
          description: p.description,
        })) || [],
    }));

    return [...mappedTreatments, ...mappedAmendments];
  }, [treatments, amendmentRegimensRaw]);
  const { regions, getPlotById } = useRegionStore();

  const task = getTaskById(Number(id));

  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState("");
  const isInitialized = useRef<number | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    objectiveType: "phat-sinh" as
      | "phat-sinh"
      | "theo-ke-hoach"
      | "thu-hoach"
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
    geographicalSelections: [] as GeographicalSelection[],
    materials: [] as MaterialAllocation[],
    tasks: [] as TaskAllocation[],
    selectedStages: [] as string[],
    selectedPlotIds: [] as string[],
  });

  useEffect(() => {
    if (task) {
      if (isInitialized.current === task.id) {
        return;
      }

      // Check if we should wait for stores
      const needsStores = task.plan && task.plan !== "N/A";
      // We also need regions for getPlotById and SelectionCard to show names instead of IDs
      const storesLoaded =
        plans.length > 0 && regimens.length > 0 && regions.length > 0;

      if (needsStores && !storesLoaded) {
        return;
      }

      // Reconstruct objectiveType
      let objType: any = "phat-sinh";
      let pId = "";
      let rId = "";

      const planMatch = [...plans, ...amendmentPlans].find(
        (p) => p.name.normalize() === task.plan.normalize(),
      );

      if (planMatch) {
        // Map plan purpose to objectiveType id
        const purposeMap: Record<string, string> = {
          harvest: "thu-hoach",
          treatment: "tri-benh",
          amendment: "cai-tao-dat",
          cultivation: "theo-ke-hoach",
          incurred: "phat-sinh",
        };
        objType =
          (planMatch.purpose ? purposeMap[planMatch.purpose] : undefined) ||
          "theo-ke-hoach";
        pId = String(planMatch.id);

        // Also check if it has a regimen associated
        if (planMatch.regimenId) {
          rId = planMatch.regimenId;
        }
      } else {
        const regimenMatch = regimens.find(
          (r) => r.name.normalize() === task.plan.normalize(),
        );
        if (regimenMatch) {
          objType = regimenMatch.type; // "tri-benh" or "cai-tao-dat"
          rId = regimenMatch.id;
        }
      }

      const taskPlots = (task as any).selectedPlotIds || [];
      const planPlots = (planMatch?.selectedPlotIds as string[]) || [];

      setFormData({
        code: task.code,
        name: task.name,
        objectiveType: objType,
        planId: pId,
        planName: task.plan,
        stage: task.stage === "N/A" ? "" : task.stage.normalize(),
        regimenId: rId,
        assignedType: task.assignedType,
        assignedTo: task.assignedTo,
        supervisors: task.supervisors || [],
        qualityInspectors: task.qualityInspectors || [],
        startDate: task.startDate,
        endDate: task.endDate,
        priority: task.priority,
        description: task.description,
        geographicalSelections: (task as any).geographicalSelections || [],
        materials: (task.materials || []).map((m) => ({
          ...m,
          stageId: m.stageId.normalize(),
        })),
        tasks: ((task as any).tasks || []).map((t: any) => ({
          ...t,
          stageId: t.stageId.normalize(),
        })),
        selectedStages:
          task.stage && task.stage !== "N/A"
            ? task.stage
                .split("; ")
                .map((s) => s.normalize())
                .filter(Boolean)
            : [],
        selectedPlotIds: (taskPlots.length > 0
          ? taskPlots
          : planPlots) as string[],
      });

      // Resolve EnterpriseId for "phat-sinh" tasks if not already set
      if (
        objType === "phat-sinh" &&
        (task as any).geographicalSelections?.length > 0
      ) {
        const firstRegionId = (task as any).geographicalSelections[0].regionId;
        const region = regions.find(
          (r) => String(r.id) === String(firstRegionId),
        );
        if (region) {
          const entId = region.enterpriseId.startsWith("ent-")
            ? region.enterpriseId.replace("ent-", "")
            : region.enterpriseId;
          setSelectedEnterpriseId(entId);
        }
      }

      isInitialized.current = task.id;
    }
  }, [task, plans, regimens, regions]);

  const [isAssigneeDialogOpen, setIsAssigneeDialogOpen] = useState(false);
  const [searchAssignee, setSearchAssignee] = useState("");
  const [isSupervisorDialogOpen, setIsSupervisorDialogOpen] = useState(false);
  const [searchSupervisor, setSearchSupervisor] = useState("");
  const [isInspectorDialogOpen, setIsInspectorDialogOpen] = useState(false);
  const [searchInspector, setSearchInspector] = useState("");
  if (!task) return <div>Không tìm thấy công việc</div>;

  const activePlans = useMemo(() => {
    const basePlans = plans.filter((p) => {
      if (formData.objectiveType === "theo-ke-hoach")
        return p.purpose === "cultivation";
      if (formData.objectiveType === "thu-hoach")
        return p.purpose === "harvest";
      if (formData.objectiveType === "tri-benh")
        return p.purpose === "treatment";
      if (formData.objectiveType === "cai-tao-dat")
        return p.purpose === "amendment";
      return false;
    });

    if (formData.objectiveType === "cai-tao-dat") {
      return [...basePlans, ...amendmentPlans];
    }
    return basePlans;
  }, [formData.objectiveType, plans, amendmentPlans]);

  const selectedPlan = (activePlans as any[]).find(
    (p) => String(p.id) === formData.planId,
  );
  const availableStages = useMemo((): string[] => {
    // Priority 1: If plan has its own selectedStages, use them (task/material allocations reference these)
    if (selectedPlan) {
      if (
        "selectedStages" in selectedPlan &&
        (selectedPlan as any).selectedStages?.length > 0
      ) {
        return (selectedPlan as any).selectedStages;
      }
      if (
        "allocations" in selectedPlan &&
        (selectedPlan as any).allocations?.length > 0
      ) {
        return Array.from(
          new Set((selectedPlan as any).allocations.map((a: any) => a.stage)),
        );
      }
    }

    // Priority 2: If no plan stages but there's a regimen, use regimen step titles
    const activeRegimenId =
      (selectedPlan as any)?.regimenId || formData.regimenId;
    if (
      (formData.objectiveType === "cai-tao-dat" ||
        formData.objectiveType === "tri-benh") &&
      activeRegimenId
    ) {
      const regimen = regimens.find((r) => r.id === activeRegimenId);
      if (regimen?.steps && regimen.steps.length > 0) {
        return regimen.steps.map((s) => s.title);
      }
    }

    return [];
  }, [selectedPlan, formData.objectiveType, formData.regimenId, regimens]);
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

  const handleAddMaterialFromStage = (item: any) => {
    setFormData((prev) => ({
      ...prev,
      materials: [
        ...prev.materials,
        {
          id: Date.now(),
          taskId: item.taskId,
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
    // If objectiveType is "phat-sinh", pre-populate with Step 1 selections if no scope provided
    const geoMapping =
      formData.objectiveType === "phat-sinh"
        ? item.geographicalSelections && item.geographicalSelections.length > 0
          ? item.geographicalSelections
          : formData.geographicalSelections
        : item.geographicalSelections;

    setFormData((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        { id: Date.now(), ...item, geographicalSelections: geoMapping },
      ],
    }));
  };

  const handleUpdateTask = (
    id: number,
    updatedTask: Partial<TaskAllocation>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? { ...t, ...updatedTask } : t,
      ),
    }));
  };

  const handleRemoveTask = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  };

  const handleUpdateMaterial = useCallback(
    (id: number, updates: Partial<MaterialAllocation>) => {
      setFormData((prev) => ({
        ...prev,
        materials: prev.materials.map((m) =>
          m.id === id ? { ...m, ...updates } : m,
        ),
      }));
    },
    [],
  );

  const handleRemoveMaterial = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((m) => m.id !== id),
    }));
  };

  const filteredRegionsForPhatSinh = useMemo(() => {
    if (
      formData.objectiveType !== "phat-sinh" ||
      formData.geographicalSelections.length === 0
    ) {
      return regions;
    }

    return regions
      .map((region) => {
        // If the region itself is selected, keep it entire
        const isRegionSelected = formData.geographicalSelections.some(
          (s: GeographicalSelection) =>
            s.type === "region" && String(s.regionId) === String(region.id),
        );
        if (isRegionSelected) return region;

        // If not, filter its sub-areas
        const filteredSubAreas = (region.subAreas || [])
          .map((area) => {
            // If the area itself is selected, keep it entire
            const isAreaSelected = formData.geographicalSelections.some(
              (s: GeographicalSelection) =>
                s.type === "area" && String(s.areaId) === String(area.id),
            );
            if (isAreaSelected) return area;

            // If not, filter its plots
            const filteredPlots = (area.plots || []).filter((plot) =>
              formData.geographicalSelections.some(
                (s: GeographicalSelection) =>
                  s.type === "plot" && String(s.plotId) === String(plot.id),
              ),
            );

            if (filteredPlots.length > 0) {
              return { ...area, plots: filteredPlots };
            }
            return null;
          })
          .filter(Boolean) as any[];

        if (filteredSubAreas.length > 0) {
          return { ...region, subAreas: filteredSubAreas };
        }
        return null;
      })
      .filter(Boolean) as any[];
  }, [regions, formData.geographicalSelections, formData.objectiveType]);

  const handleComplete = () => {
    const updates = {
      code: formData.code,
      name: formData.name,
      plan:
        formData.objectiveType !== "phat-sinh"
          ? formData.planName ||
            regimens.find((r) => r.id === formData.regimenId)?.name ||
            "Công việc theo kế hoạch"
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
      tasks: formData.tasks,
      geographicalSelections: formData.geographicalSelections,
    };

    updateTask(task.id, updates as any);
    toast({
      title: "Cập nhật thành công",
      description: "Đã lưu thay đổi công việc",
    });
    setLocation("/task");
  };

  const renderStagesGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {availableStages.map((s) => {
        const isSelected = formData.selectedStages.includes(s);
        return (
          <div
            key={s}
            onClick={() => {
              const next = isSelected
                ? formData.selectedStages.filter((item) => item !== s)
                : [...formData.selectedStages, s];
              setFormData((prev) => ({
                ...prev,
                selectedStages: next,
                stage: next.join("; "),
              }));
            }}
            className={cn(
              "flex items-center gap-4 p-4 rounded-md border transition-all cursor-pointer group",
              isSelected
                ? "bg-primary/5 border-primary shadow-sm"
                : "bg-white border-slate-200 hover:border-primary/20 hover:bg-slate-50/50",
            )}
          >
            <Checkbox
              id={`stage-${s}`}
              checked={isSelected}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              onClick={(e) => e.stopPropagation()}
              onCheckedChange={(checked) => {
                const next = checked
                  ? [...formData.selectedStages, s]
                  : formData.selectedStages.filter((item) => item !== s);
                setFormData((prev) => ({
                  ...prev,
                  selectedStages: next,
                  stage: next.join("; "),
                }));
              }}
            />
            <label
              htmlFor={`stage-${s}`}
              className="text-sm font-bold text-slate-700 cursor-pointer flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              {s}
            </label>
          </div>
        );
      })}
      {availableStages.length === 0 && (
        <div className="col-span-full py-12 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center gap-2">
          <Layers className="w-8 h-8 text-slate-200" />
          <p className="text-xs text-slate-400 italic">
            {formData.planId
              ? "Kế hoạch không có giai đoạn"
              : "Hãy chọn kế hoạch trước"}
          </p>
        </div>
      )}
    </div>
  );

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
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">
                      Mã công việc *
                    </Label>
                    <Input
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      placeholder="VD: NV001"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">
                      Tên công việc *
                    </Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="VD: Bón phân thúc đợt 1"
                      className="border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Hạng mục *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      {
                        id: "theo-ke-hoach",
                        label: "Canh tác",
                        icon: Layers,
                        color: "blue",
                        borderColor: "border-blue-500",
                        bgColor: "bg-blue-50/50",
                        activeColor: "bg-blue-500",
                        textColor: "text-blue-700",
                        description: "Từ vùng trồng",
                      },
                      {
                        id: "thu-hoach",
                        label: "Thu hoạch",
                        icon: Apple,
                        color: "orange",
                        borderColor: "border-orange-500",
                        bgColor: "bg-orange-50/50",
                        activeColor: "bg-orange-500",
                        textColor: "text-orange-700",
                        description: "Kế hoạch thu",
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
                        label: "Điều trị",
                        icon: Bug,
                        color: "red",
                        borderColor: "border-red-500",
                        bgColor: "bg-red-50/50",
                        activeColor: "bg-red-500",
                        textColor: "text-red-700",
                        description: "Xử lý dịch hại",
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

                {formData.objectiveType === "phat-sinh" && (
                  <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">
                        Đơn vị sở hữu <span className="text-red-500">*</span>
                      </Label>
                      <div className="pt-2 pb-4">
                        <EnterpriseSelector
                          selectedId={selectedEnterpriseId}
                          onSelect={(val) => {
                            setSelectedEnterpriseId(val);
                            setFormData({
                              ...formData,
                              geographicalSelections: [],
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 relative">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold text-slate-700">
                            Phạm vi địa lý{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          {!selectedEnterpriseId && (
                            <Badge
                              variant="outline"
                              className="text-[10px] text-amber-600 border-amber-200 bg-amber-50"
                            >
                              Chọn đơn vị sở hữu trước
                            </Badge>
                          )}
                        </div>
                        <GeographicalSelector
                          regions={regions}
                          enterpriseId={selectedEnterpriseId}
                          existingSelections={formData.geographicalSelections}
                          onConfirm={(selections) =>
                            setFormData({
                              ...formData,
                              geographicalSelections: selections,
                            })
                          }
                        />

                        {formData.geographicalSelections.length > 0 && (
                          <div className="mt-4 space-y-3">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                              <Layers className="w-3 h-3" />
                              Phạm vi đã chọn (
                              {formData.geographicalSelections.length} mục)
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              {(() => {
                                const grouped: Record<
                                  string,
                                  GeographicalSelection[]
                                > = {};
                                formData.geographicalSelections.forEach((s) => {
                                  const key = s.areaId || s.regionId;
                                  if (!grouped[key]) grouped[key] = [];
                                  grouped[key].push(s);
                                });

                                return Object.entries(grouped).map(
                                  ([key, items]) => {
                                    const first = items[0];
                                    return (
                                      <SelectionCard
                                        key={key}
                                        regionId={first.regionId}
                                        areaId={first.areaId}
                                        items={items}
                                        regions={regions}
                                        showRemoveButton={false}
                                        onRemove={() => {}} // Read-only in this summary
                                      />
                                    );
                                  },
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {formData.objectiveType !== "phat-sinh" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 border-t pt-6 mt-6 border-slate-100">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-700">
                          Chọn kế hoạch triển khai *
                        </Label>
                        <Select
                          value={formData.planId}
                          onValueChange={(val) => {
                            const p = (activePlans as any[]).find(
                              (p) => String(p.id) === val,
                            );
                            let stages: string[] =
                              p?.selectedStages?.length > 0
                                ? p.selectedStages
                                : p?.allocations
                                  ? Array.from(
                                      new Set(
                                        p.allocations.map((a: any) => a.stage),
                                      ),
                                    )
                                  : [];
                            // Only use regimen steps when plan has NO stages of its own
                            if (
                              (stages as string[]).length === 0 &&
                              p?.regimenId &&
                              (formData.objectiveType === "cai-tao-dat" ||
                                formData.objectiveType === "tri-benh")
                            ) {
                              const reg = regimens.find(
                                (r) => r.id === p.regimenId,
                              );
                              if (reg?.steps && reg.steps.length > 0) {
                                stages = reg.steps.map((s) => s.title);
                              }
                            }
                            setFormData({
                              ...formData,
                              planId: val,
                              planName: p?.name || "",
                              selectedStages: stages as string[],
                              selectedPlotIds:
                                (p?.selectedPlotIds as string[]) || [],
                              regimenId: p?.regimenId || formData.regimenId,
                            });
                          }}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Chọn kế hoạch áp dụng..." />
                          </SelectTrigger>
                          <SelectContent>
                            {activePlans.map((p: any) => (
                              <SelectItem key={p.id} value={String(p.id)}>
                                {p.name} ({p.code})
                              </SelectItem>
                            ))}
                            {activePlans.length === 0 && (
                              <div className="p-4 text-center text-xs text-slate-400 italic">
                                Không tìm thấy kế hoạch phù hợp
                              </div>
                            )}
                          </SelectContent>
                        </Select>

                        {/* Thông tin kế hoạch chi tiết */}
                        {formData.planId && selectedPlan && (
                          <div className="p-6 rounded-md bg-white border border-slate-200/60 space-y-5 animate-in slide-in-from-bottom-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />

                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 relative z-10">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm",
                                    formData.objectiveType === "theo-ke-hoach"
                                      ? "bg-blue-50 text-blue-600"
                                      : formData.objectiveType === "thu-hoach"
                                        ? "bg-orange-50 text-orange-600"
                                        : formData.objectiveType ===
                                            "cai-tao-dat"
                                          ? "bg-green-50 text-green-600"
                                          : "bg-red-50 text-red-600",
                                  )}
                                >
                                  {formData.objectiveType ===
                                  "theo-ke-hoach" ? (
                                    <Layers className="w-5 h-5" />
                                  ) : formData.objectiveType === "thu-hoach" ? (
                                    <Apple className="w-5 h-5" />
                                  ) : formData.objectiveType ===
                                    "cai-tao-dat" ? (
                                    <Sprout className="w-5 h-5" />
                                  ) : (
                                    <Bug className="w-5 h-5" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-1.5">
                                    Chi tiết kế hoạch
                                  </h4>
                                  <p className="text-base font-bold text-slate-900 leading-none">
                                    {(selectedPlan as any).name}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="font-mono text-[10px] px-2.5 py-0.5 border-slate-200 text-slate-500 bg-slate-50/50"
                              >
                                {(selectedPlan as any).code}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm relative z-10">
                              <div className="space-y-1.5">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Thời hạn thực hiện
                                </span>
                                <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50/80 p-2 rounded-xl border border-slate-100/50">
                                  <CalendarIcon className="w-4 h-4 text-amber-500 shrink-0" />
                                  <span className="font-bold">
                                    {(selectedPlan as any).startDate} →{" "}
                                    {(selectedPlan as any).endDate}
                                  </span>
                                </div>
                              </div>

                              {formData.objectiveType === "theo-ke-hoach" && (
                                <>
                                  <div className="space-y-1.5">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                                      Cây trồng & Giống
                                    </span>
                                    <div className="flex items-center gap-2.5 text-slate-700 bg-blue-50/30 p-2 rounded-xl border border-blue-100/50">
                                      <Sprout className="w-4 h-4 text-green-500 shrink-0" />
                                      <span className="font-bold">
                                        {(selectedPlan as any).crop} -{" "}
                                        {(selectedPlan as any).variety || "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-span-2 space-y-2 pt-2 border-t border-slate-100">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                                      Danh sách giai đoạn canh tác
                                    </span>
                                    <div className="flex flex-wrap gap-1.5 mt-1.5 p-3 rounded-2xl bg-blue-50/10 border border-blue-100/30">
                                      {(
                                        (selectedPlan as any).selectedStages ||
                                        []
                                      ).map((s: string) => (
                                        <Badge
                                          key={s}
                                          variant="secondary"
                                          className="bg-white text-blue-600 border-blue-100 shadow-sm text-[10px] px-3 font-bold"
                                        >
                                          {s}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}

                              {formData.objectiveType === "cai-tao-dat" && (
                                <>
                                  <div className="col-span-2 space-y-1.5">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                                      Mục tiêu cải tạo / Vấn đề
                                    </span>
                                    <div className="flex items-center gap-2.5 text-green-700 bg-green-50/40 p-3 rounded-xl border border-green-100/50">
                                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                                      <span className="font-bold">
                                        {(selectedPlan as any).target_issue ||
                                          "Cải tạo định kỳ"}
                                      </span>
                                    </div>
                                  </div>
                                  {(selectedPlan as any).technician && (
                                    <div className="space-y-1.5">
                                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                                        Chuyên gia phụ trách
                                      </span>
                                      <div className="flex items-center gap-2.5 text-slate-700 bg-slate-50 p-2 rounded-xl">
                                        <User className="w-4 h-4 text-blue-400" />
                                        <span className="font-bold">
                                          {(selectedPlan as any).technician}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid gap-6 grid-cols-1">
                        {/* Multi-select Plots Summary */}
                        <div className="space-y-4">
                          <Label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                            Vùng canh tác / Vùng địa lý
                            <span className="text-[10px] text-slate-400 font-normal opacity-70">
                              (Khóa chỉnh sửa)
                            </span>
                          </Label>

                          <div className="grid grid-cols-1 gap-4">
                            {(() => {
                              const tempSelections: GeographicalSelection[] =
                                formData.selectedPlotIds.map((plotId) => {
                                  const data = getPlotById(plotId);
                                  return {
                                    id: Math.random().toString(36).substr(2, 9),
                                    type: "plot" as const,
                                    regionId: String(data?.region?.id || ""),
                                    areaId: String(data?.area?.id || ""),
                                    plotId: plotId,
                                  };
                                });

                              const grouped: Record<
                                string,
                                GeographicalSelection[]
                              > = {};
                              tempSelections.forEach((s) => {
                                const key = s.areaId || s.regionId;
                                if (!grouped[key]) grouped[key] = [];
                                grouped[key].push(s);
                              });

                              return Object.entries(grouped).map(
                                ([key, items]) => {
                                  const first = items[0];
                                  return (
                                    <SelectionCard
                                      key={key}
                                      regionId={first.regionId}
                                      areaId={first.areaId}
                                      items={items}
                                      regions={regions}
                                      showRemoveButton={false}
                                      onRemove={() => {}}
                                    />
                                  );
                                },
                              );
                            })()}

                            {formData.selectedPlotIds.length === 0 && (
                              <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50 text-center gap-2 animate-in fade-in duration-500">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-300">
                                  <MapPin className="w-6 h-6" />
                                </div>
                                <div className="text-sm font-bold text-slate-600">
                                  Chưa có lựa chọn nào
                                </div>
                                <div className="text-[11px] text-slate-400 max-w-50 mx-auto mt-1">
                                  {formData.planId
                                    ? "Kế hoạch không quy định lô đất"
                                    : "Hãy chọn kế hoạch trước"}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Multi-select Stages & Regimen */}
                        {formData.objectiveType !== "thu-hoach" && (
                          <div className="space-y-4">
                            {formData.objectiveType === "cai-tao-dat" ||
                            formData.objectiveType === "tri-benh"
                              ? (() => {
                                  const hasPlanRegimen = !!(selectedPlan as any)
                                    ?.regimenId;
                                  const planHasStages = !!(
                                    selectedPlan &&
                                    (("selectedStages" in selectedPlan &&
                                      (selectedPlan as any).selectedStages
                                        ?.length > 0) ||
                                      ("allocations" in selectedPlan &&
                                        (selectedPlan as any).allocations
                                          ?.length > 0))
                                  );

                                  if (hasPlanRegimen) {
                                    return (
                                      <div className="px-5 py-4 rounded-[1.25rem] border border-blue-100 bg-blue-50/20 space-y-5">
                                        <div className="space-y-3">
                                          <Label className="text-sm font-bold text-slate-700">
                                            {formData.objectiveType ===
                                            "cai-tao-dat"
                                              ? "Phác đồ cải tạo đất từ kế hoạch"
                                              : "Phác đồ trị bệnh từ kế hoạch"}
                                          </Label>
                                          <RegimenSelector
                                            regimens={regimens}
                                            selectedRegimenId={
                                              formData.regimenId
                                            }
                                            disabled={true}
                                            type={
                                              formData.objectiveType ===
                                              "cai-tao-dat"
                                                ? "amendment"
                                                : "treatment"
                                            }
                                            onSelect={() => {}}
                                          />
                                        </div>

                                        <div className="h-px bg-blue-100/50 w-full" />

                                        <div className="space-y-3">
                                          <Label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                                            Giai đoạn thực hiện *
                                            <span className="text-[10px] text-slate-400 font-normal">
                                              Từ phác đồ
                                            </span>
                                          </Label>
                                          {renderStagesGrid()}
                                        </div>
                                      </div>
                                    );
                                  } else if (planHasStages) {
                                    return (
                                      <div className="space-y-3">
                                        <Label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                                          Giai đoạn thực hiện *
                                          <span className="text-[10px] text-slate-400 font-normal">
                                            Chọn nhiều
                                          </span>
                                        </Label>
                                        {renderStagesGrid()}
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div className="space-y-5 mt-2 anim-fade-in">
                                        <div className="space-y-3">
                                          <Label className="text-sm font-bold text-slate-700">
                                            {formData.objectiveType ===
                                            "cai-tao-dat"
                                              ? "Phác đồ cải tạo đất áp dụng (tùy chọn)"
                                              : "Phác đồ trị bệnh áp dụng (tùy chọn)"}
                                          </Label>
                                          <RegimenSelector
                                            regimens={regimens}
                                            selectedRegimenId={
                                              formData.regimenId
                                            }
                                            disabled={false}
                                            type={
                                              formData.objectiveType ===
                                              "cai-tao-dat"
                                                ? "amendment"
                                                : "treatment"
                                            }
                                            onSelect={(regimen) => {
                                              if (
                                                formData.regimenId !==
                                                regimen.id
                                              ) {
                                                const stepTitles =
                                                  regimen.steps?.map(
                                                    (s) => s.title,
                                                  ) || [];
                                                setFormData((prev) => ({
                                                  ...prev,
                                                  regimenId: regimen.id,
                                                  selectedStages: stepTitles,
                                                }));
                                              }
                                            }}
                                          />
                                        </div>

                                        {formData.regimenId &&
                                          availableStages.length > 0 && (
                                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                              <Label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                                                Giai đoạn thực hiện *
                                                <span className="text-[10px] text-slate-400 font-normal">
                                                  Từ phác đồ
                                                </span>
                                              </Label>
                                              {renderStagesGrid()}
                                            </div>
                                          )}
                                      </div>
                                    );
                                  }
                                })()
                              : (availableStages.length > 0 ||
                                  !formData.regimenId) && (
                                  <div className="space-y-3">
                                    <Label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                                      Giai đoạn thực hiện *
                                      <span className="text-[10px] text-slate-400 font-normal">
                                        Chọn nhiều
                                      </span>
                                    </Label>
                                    {renderStagesGrid()}
                                  </div>
                                )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Nhân sự quản lý */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      {/* <Shield className="w-4 h-4 text-blue-500" /> */}
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
                  <div className="flex items-end justify-between">
                    <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      {/* <ClipboardCheck className="w-4 h-4 text-violet-500" /> */}
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
                    <ScrollArea className="h-75 px-3">
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
                    <ScrollArea className="h-75 px-3">
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
                  <CalendarIcon className="w-5 h-5 text-primary" />
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
                          "bg-primary text-white border-primary shadow-primary/5",
                        inactiveClass:
                          "bg-primary/5 text-primary/60 border-primary/10 hover:bg-primary/10",
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
                  <StickyNote className="w-5 h-5 text-primary" />
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
        <div className="max-w-5xl mx-auto space-y-6">
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
            {formData.objectiveType === "theo-ke-hoach" ||
            formData.objectiveType === "thu-hoach" ||
            formData.objectiveType === "cai-tao-dat" ||
            formData.objectiveType === "tri-benh" ? (
              formData.selectedStages.length > 0 ? (
                formData.selectedStages.map((stageName) => (
                  <TaskStageAllocation
                    key={stageName}
                    stageName={stageName}
                    cycleName={
                      formData.objectiveType === "cai-tao-dat"
                        ? "Cải tạo đất"
                        : formData.objectiveType === "tri-benh"
                          ? "Điều trị bệnh"
                          : undefined
                    }
                    allocations={formData.materials.filter(
                      (m) => m.stageId === stageName,
                    )}
                    tasks={formData.tasks.filter(
                      (t) => t.stageId === stageName,
                    )}
                    onAddMaterial={(item) =>
                      handleAddMaterialFromStage(item as any)
                    }
                    onRemoveMaterial={handleRemoveMaterial}
                    onAddTask={handleAddTask}
                    onRemoveTask={handleRemoveTask}
                    onUpdateTask={handleUpdateTask}
                    onUpdateMaterial={handleUpdateMaterial}
                    regions={regions}
                    personnel={personnel}
                    enterpriseId={
                      selectedEnterpriseId ||
                      (selectedPlan as any)?.enterpriseId ||
                      ""
                    }
                    availableTasks={selectedPlan?.taskAllocations?.filter(
                      (t: any) => t.stageId === stageName,
                    )}
                    availableMaterials={selectedPlan?.materialAllocations?.filter(
                      (m: any) => m.stageId === stageName,
                    )}
                  />
                ))
              ) : formData.objectiveType === "thu-hoach" ? (
                <TaskStageAllocation
                  key="thu-hoach"
                  stageName="Công việc thu hoạch"
                  allocations={formData.materials.filter(
                    (m) => m.stageId === "Công việc thu hoạch",
                  )}
                  tasks={formData.tasks.filter(
                    (t: any) => t.stageId === "Công việc thu hoạch",
                  )}
                  onAddMaterial={(item) =>
                    handleAddMaterialFromStage(item as any)
                  }
                  onRemoveMaterial={handleRemoveMaterial}
                  onAddTask={handleAddTask}
                  onRemoveTask={handleRemoveTask}
                  onUpdateTask={handleUpdateTask}
                  onUpdateMaterial={handleUpdateMaterial}
                  regions={regions}
                  personnel={personnel}
                  enterpriseId={
                    selectedEnterpriseId ||
                    (selectedPlan as any)?.enterpriseId ||
                    ""
                  }
                  availableTasks={selectedPlan?.taskAllocations}
                  availableMaterials={selectedPlan?.materialAllocations}
                />
              ) : (
                <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                  <p className="text-slate-400 font-medium italic">
                    Vui lòng chọn giai đoạn thực hiện ở bước trước.
                  </p>
                </div>
              )
            ) : formData.objectiveType === "phat-sinh" ? (
              <TaskStageAllocation
                key="phat-sinh"
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
                onUpdateTask={handleUpdateTask}
                onUpdateMaterial={handleUpdateMaterial}
                regions={filteredRegionsForPhatSinh}
                personnel={personnel}
                enterpriseId={selectedEnterpriseId || ""}
              />
            ) : null}
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
            <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-linear-to-br from-primary/5 via-white to-teal-50/40 p-6 shadow-sm">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow border border-primary/10 flex items-center justify-center shrink-0">
                    {formData.objectiveType === "tri-benh" ? (
                      <Bug className="w-7 h-7 text-rose-500" />
                    ) : formData.objectiveType === "cai-tao-dat" ? (
                      <Sprout className="w-7 h-7 text-primary" />
                    ) : formData.objectiveType === "phat-sinh" ? (
                      <Info className="w-7 h-7 text-amber-500" />
                    ) : (
                      <ClipboardList className="w-7 h-7 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary/60 mb-0.5">
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
                              : "bg-primary text-white",
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
                      {formData.selectedStages.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {formData.selectedStages.map((s) => (
                            <Badge
                              key={s}
                              variant="secondary"
                              className="text-[10px] bg-blue-50 text-blue-700 border-none px-2 py-0 h-5 font-medium"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Phạm vi lô đất
                      </p>
                      <div className="flex justify-end">
                        <div className="w-75 text-left">
                          <div className="grid grid-cols-1 gap-2">
                            {(() => {
                              const grouped: Record<
                                string,
                                GeographicalSelection[]
                              > = {};
                              formData.geographicalSelections.forEach((s) => {
                                const key = s.areaId || s.regionId;
                                if (!grouped[key]) grouped[key] = [];
                                grouped[key].push(s);
                              });

                              return Object.entries(grouped).map(
                                ([key, items]) => {
                                  const first = items[0];
                                  return (
                                    <SelectionCard
                                      key={key}
                                      regionId={first.regionId}
                                      areaId={first.areaId}
                                      items={items}
                                      regions={regions}
                                      showRemoveButton={false}
                                      onRemove={() => {}}
                                    />
                                  );
                                },
                              );
                            })()}
                          </div>
                        </div>
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

            {/* Tasks and Materials List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  Danh sách công việc chi tiết
                </h4>
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600 font-bold px-2 py-0"
                >
                  {formData.tasks.length} công việc
                </Badge>
              </div>

              {formData.tasks.length === 0 ? (
                <Card className="border-dashed border-slate-200 bg-slate-50/30">
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-slate-400 italic">
                      Chưa có công việc nào được cấu hình
                    </p>
                  </CardContent>
                </Card>
              ) : (
                formData.tasks.map((task, taskIdx) => (
                  <Card
                    key={taskIdx}
                    className="border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Task Header */}
                    <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {taskIdx + 1}
                        </div>
                        <span className="font-bold text-slate-800 truncate">
                          {task.name}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-white border-slate-200 text-slate-500 py-0.5 px-2"
                      >
                        {task.isRepeating ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1 opacity-60" />
                            {getFrequencyText(
                              task.repeatDays || [],
                              task.repeatWeeks || 0,
                            )}
                          </>
                        ) : (
                          <>
                            <CalendarIcon className="w-3 h-3 mr-1 opacity-60" />
                            {task.startDate} → {task.endDate}
                          </>
                        )}
                      </Badge>
                    </div>

                    <CardContent className="p-4 space-y-4">
                      {/* Labor & Duration */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-2.5">
                          <Users className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                              Nhân sự
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {task.labor ? (
                                task.labor.split(",").map((person, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="bg-blue-50 text-blue-700 border-none text-[10px] font-bold px-2 py-0 h-5"
                                  >
                                    <User className="w-3 h-3 mr-1 opacity-50" />
                                    {person.trim()}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs font-semibold text-slate-400 italic">
                                  Chưa phân công
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                              {task.isRepeating ? "Lặp lại" : "Thời gian"}
                            </p>
                            <p className="text-xs font-semibold text-slate-700">
                              {task.isRepeating
                                ? `${task.repeatWeeks || 0} tuần`
                                : task.duration || "—"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Scope MapPin */}
                      {task.geographicalSelections &&
                        task.geographicalSelections.length > 0 && (
                          <div className="flex items-start gap-2.5 pt-3 border-t border-slate-50">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-1" />
                            <div className="flex-1">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-left">
                                Phạm vi thực hiện
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {(() => {
                                  const grouped: Record<
                                    string,
                                    GeographicalSelection[]
                                  > = {};
                                  task.geographicalSelections!.forEach((s) => {
                                    const key = s.areaId || s.regionId;
                                    if (!grouped[key]) grouped[key] = [];
                                    grouped[key].push(s);
                                  });

                                  return Object.entries(grouped).map(
                                    ([key, items]) => {
                                      const first = items[0];
                                      return (
                                        <SelectionCard
                                          key={key}
                                          regionId={first.regionId}
                                          areaId={first.areaId}
                                          items={items}
                                          regions={regions}
                                          showRemoveButton={false}
                                          onRemove={() => {}}
                                        />
                                      );
                                    },
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Materials for this task */}
                      {formData.materials.filter((m) => m.taskId === task.id)
                        .length > 0 && (
                        <div className="pt-3 border-t border-slate-50">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-left">
                            Vật tư sử dụng
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {formData.materials
                              .filter((m) => m.taskId === task.id)
                              .map((m, mIdx) => (
                                <div
                                  key={mIdx}
                                  className="flex items-center justify-between bg-slate-50/50 border border-slate-100 rounded-lg px-2.5 py-1.5"
                                >
                                  <span className="text-xs text-slate-600 font-medium truncate mr-2">
                                    {m.materialName}
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="bg-white text-slate-900 border-slate-200 text-[10px] font-bold shrink-0"
                                  >
                                    {m.quantity} {m.unit}
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN: CTA + notice ── */}
          <div className="space-y-4">
            <Card className="bg-slate-900 border-none text-white shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-br from-slate-800 to-slate-950 pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
              <CardHeader className="border-b border-white/10 pb-4 relative">
                <CardTitle className="text-white text-sm flex items-center gap-2.5">
                  <div className="p-1.5 bg-primary/20 rounded-lg">
                    <FileCheck className="w-4 h-4 text-primary/40" />
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
                      value: (() => {
                        const allPersonnel = new Set([
                          ...formData.supervisors,
                          ...formData.qualityInspectors,
                          ...formData.tasks.flatMap((t: any) => {
                            const labor = t.labor || "";
                            if (labor.includes(":")) {
                              return labor
                                .split(":")[1]
                                .trim()
                                .split("; ")
                                .filter(Boolean);
                            }
                            return [];
                          }),
                        ]);
                        return allPersonnel.size > 0 ? allPersonnel.size : "—";
                      })(),
                      sub: "người",
                    },
                    {
                      label: "Vật tư",
                      value: formData.materials.length || "—",
                      sub: "danh mục",
                    },
                    {
                      label: "Giai đoạn",
                      value: formData.selectedStages.length || "—",
                      sub: "áp dụng",
                    },
                    {
                      label: "Mã định danh",
                      value: formData.code,
                      sub: "mã CV",
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
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-xs">Ưu tiên</span>
                      <span
                        className={cn(
                          "text-xs font-bold",
                          formData.priority === "high"
                            ? "text-rose-400"
                            : formData.priority === "medium"
                              ? "text-amber-400"
                              : "text-primary/40",
                        )}
                      >
                        {formData.priority === "high"
                          ? "Cao"
                          : formData.priority === "medium"
                            ? "Thường"
                            : "Thấp"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-1">
                  <Button
                    onClick={handleComplete}
                    className="w-full bg-primary hover:bg-primary/40 text-white border-none h-12 text-base font-black shadow-[0_8px_24px_-8px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-0.5 active:translate-y-0"
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
      isDev={true}
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
          completeLabel="Lưu thay đổi"
        />
      </div>

      {/* Dialog Selection (Reuse Assignee Dialog) */}
      <Dialog
        open={isAssigneeDialogOpen}
        onOpenChange={setIsAssigneeDialogOpen}
      >
        <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-[32px] bg-white">
          <DialogHeader className="p-8 pb-4 bg-slate-50/50">
            <DialogTitle className="flex items-end gap-3 text-2xl font-black tracking-tight">
              <Users className="w-6 h-6 text-primary" /> Chọn người thực hiện
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Tìm nhanh theo tên hoặc mã..."
                className="pl-11 h-12 rounded-xl border-slate-200 focus:border-primary transition-all font-medium"
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
                          ? "bg-primary/5 border-primary/20 shadow-sm"
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
                        className="rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-none"
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
                          <User className="w-5 h-5 text-primary" />
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
                        <CheckCircle2 className="w-4 h-4 text-primary/60" />
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
