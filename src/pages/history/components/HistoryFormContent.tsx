import PageWrapper from "@/components/PageWrapper";
import type { DomainCode } from "@/features/farm-supply/types";
import { useFarmWorkflows } from "@/features/farm-workflow/hooks";
import type { FarmWorkflowScopeResponse } from "@/features/farm-workflow/types/farm-workflow.type";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  RemoteAutoCompleteSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Apple,
  Bug,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  Layers,
  Sprout,
  Trash2,
  Upload,
  Wrench,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import {
  MOCK_PLANS,
  MOCK_TASKS,
  MOCK_TASKS_LIST,
  MOCK_WORKFLOWS,
  type MockTaskItem,
} from "../mock/history.mock";
import { GeographicalSelectionCard } from "./GeographicalSelectionCard";
import { HarvestGeographicalSelectorDialog } from "./HarvestGeographicalSelectorDialog";
import { HarvestTreeSelectorDialog } from "./HarvestTreeSelectorDialog";
import { PlannedTaskDetailCard } from "./PlannedTaskDetailCard";
import { WorkAllocationCard } from "./WorkAllocationCard";
import { WorkflowScopeMapModal } from "./WorkflowScopeMapModal";

export interface MaterialAllocation {
  id: number;
  stageId: string;
  materialType: string;
  materialName: string;
  quantity: string;
  actualQuantity?: string;
  unit: string;
  supplyItemId?: number;
  unitBaseId?: number;
  isPlanned?: boolean;
}

export interface HarvestDetail {
  id: string;
  targetId: string;
  targetLabel: string;
  codeName: string;
  quantity: string;
  unitBase: string;
}

export interface HistoryFormData {
  regimenId: string;
  workType: string;
  harvestScope: "region" | "crop";
  harvestTargets: string[];
  harvestDetails: HarvestDetail[];
  harvestFiles: File[];
  startDate: string;
  endDate: string;
  completionPercentage: number;
  description: string;
  images: File[];
  selectedStages: string[];
  materialAllocations: MaterialAllocation[];
}

const WORK_TYPE_OPTIONS = [
  {
    value: "cultivation",
    label: "Canh tác",
    icon: Layers,
    activeClass: "border-blue-500 bg-blue-50/50 text-blue-700",
    iconClass: "bg-blue-500 text-white",
  },
  {
    value: "facility-upgrade",
    label: "Nâng cấp CSVC",
    icon: Wrench,
    activeClass: "border-slate-500 bg-slate-50/80 text-slate-700",
    iconClass: "bg-slate-700 text-white",
  },
  {
    value: "treatment",
    label: "Điều trị",
    icon: Bug,
    activeClass: "border-red-500 bg-red-50/50 text-red-700",
    iconClass: "bg-red-500 text-white",
  },
  {
    value: "amendment",
    label: "Cải tạo đất",
    icon: Sprout,
    activeClass: "border-green-500 bg-green-50/50 text-green-700",
    iconClass: "bg-green-500 text-white",
  },
  {
    value: "harvest",
    label: "Thu hoạch",
    icon: Apple,
    activeClass: "border-green-500 bg-green-50/50 text-green-700",
    iconClass: "bg-green-600 text-white",
  },
] as const;

function getWorkflowLabel(domainCode?: DomainCode | string) {
  if (domainCode === "LIVESTOCK") return "Vụ nuôi";
  if (domainCode === "AQUACULTURE") return "Vụ nuôi thủy sản";
  return "Vụ mùa";
}

function getWorkflowSubtitle(domainCode?: DomainCode | string) {
  if (domainCode === "LIVESTOCK" || domainCode === "AQUACULTURE")
    return "Chăn nuôi và nuôi trồng thủy sản";
  return "Vùng trồng";
}

function getHarvestLabel(scope: "region" | "crop") {
  return scope === "region" ? "Vùng canh tác" : "Cây canh tác";
}

function getHarvestUnitOptions() {
  return [
    { label: "g (Gram)", value: "g" },
    { label: "kg (Kilogram)", value: "kg" },
    { label: "Tạ (100 kg)", value: "tạ" },
    { label: "Tấn (1.000 kg)", value: "tấn" },
    { label: "ml (Mililit / cc)", value: "ml" },
    { label: "l / L (Lít)", value: "l" },
  ];
}

function mapWorkflowScopeToHarvestOption(
  scope: FarmWorkflowScopeResponse,
  index: number,
): { label: string; value: string; keywords?: string[] } | null {
  const region = scope.region ?? scope.area?.region ?? scope.plot?.area?.region;
  if (!region) return null;

  if (scope.scopeType === "REGION") {
    return {
      label: region.name || `Vùng #${region.id}`,
      value: `region-${region.id}`,
      keywords: [region.code, region.name].filter(Boolean) as string[],
    };
  }

  if (scope.scopeType === "AREA" && scope.area) {
    return {
      label: `${scope.area.name || `Khu #${scope.area.id}`}`,
      value: `area-${scope.area.id}`,
      keywords: [scope.area.code, scope.area.name, region.name].filter(
        Boolean,
      ) as string[],
    };
  }

  if (scope.scopeType === "PLOT" && scope.plot) {
    const area = scope.area ?? scope.plot.area;
    return {
      label: `${scope.plot.name || `Lô #${scope.plot.id}`}`,
      value: `plot-${scope.plot.id}`,
      keywords: [
        scope.plot.code,
        scope.plot.name,
        area?.name,
        region.name,
      ].filter(Boolean) as string[],
    };
  }

  return {
    label: `Mục ${index + 1}`,
    value: `${scope.scopeType.toLowerCase()}-${index}`,
  };
}

function createHarvestDetail(
  targetId: string,
  targetLabel: string,
): HarvestDetail {
  return {
    id: `harvest-${targetId}`,
    targetId,
    targetLabel,
    codeName: targetLabel,
    quantity: "",
    unitBase: "",
  };
}

const historyFormSchema = z
  .object({
    regimenId: z.string().min(1, "Vui lòng chọn vụ mùa / vụ nuôi"),
    workType: z.string().min(1, "Vui lòng chọn loại công việc"),
    startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
    isPlannedMode: z.boolean(),
    planId: z.string().optional(),
    taskId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isPlannedMode) {
      if (!data.planId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn kế hoạch",
          path: ["planId"],
        });
      }
      if (!data.taskId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn công việc",
          path: ["taskId"],
        });
      }
    }
  });

export interface HistoryFormContentProps {
  isPlannedModeDefault?: boolean;
  allowModeToggle?: boolean;
  initialTaskId?: string;
  initialPlanId?: string;
  initialWorkflowId?: string;
  pageTitle?: string;
  backUrl?: string;
}

export function HistoryFormContent({
  isPlannedModeDefault = false,
  allowModeToggle = true,
  initialTaskId = "",
  initialPlanId = "",
  initialWorkflowId = "",
  pageTitle = "Ghi nhận nhật ký nông hộ",
  backUrl = "/history",
}: HistoryFormContentProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isPlannedMode, setIsPlannedMode] =
    useState<boolean>(isPlannedModeDefault);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(initialTaskId);

  const [formData, setFormData] = useState<HistoryFormData>({
    regimenId: initialWorkflowId,
    workType: "",
    harvestScope: "region",
    harvestTargets: [],
    harvestDetails: [],
    harvestFiles: [],
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    completionPercentage: 60,
    description: "",
    images: [],
    selectedStages: [],
    materialAllocations: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [geoDialogOpen, setGeoDialogOpen] = useState(false);

  const [, setWorkflowSearchQuery] = useState("");
  const [, setPlanSearchQuery] = useState("");
  const [, setTaskSearchQuery] = useState("");
  const [plannedStages, setPlannedStages] = useState<string[]>([]);

  // Load workflows with mock fallback
  const workflowsQuery = useFarmWorkflows({
    params: { page: 0, size: 100 },
  });
  const apiWorkflows = workflowsQuery.items || [];
  const workflows = useMemo(() => {
    if (!apiWorkflows || apiWorkflows.length === 0) return MOCK_WORKFLOWS;
    const apiIds = new Set(apiWorkflows.map((w) => String(w.id)));
    const remainingMock = MOCK_WORKFLOWS.filter(
      (mw) => !apiIds.has(String(mw.id)),
    );
    return [...apiWorkflows, ...remainingMock];
  }, [apiWorkflows]);

  // Handle initialization: Auto select Workflow, Plan, and Task when initialTaskId is passed or in planned mode
  useEffect(() => {
    let taskItem: MockTaskItem | undefined;

    if (initialTaskId) {
      taskItem = MOCK_TASKS_LIST.find(
        (t) =>
          String(t.id) === String(initialTaskId) ||
          t.code.toLowerCase() === String(initialTaskId).toLowerCase(),
      );

      if (!taskItem) {
        const mockTaskObj = MOCK_TASKS.find(
          (t) =>
            String(t.id) === String(initialTaskId) ||
            t.code.toLowerCase() === String(initialTaskId).toLowerCase(),
        );
        if (mockTaskObj) {
          const planId = String(
            mockTaskObj.plan?.id ?? (mockTaskObj as any).planId ?? "20",
          );
          taskItem = {
            id: String(mockTaskObj.id),
            planId,
            code: mockTaskObj.code,
            name: mockTaskObj.name,
            workType:
              mockTaskObj.taskCategory?.code === "CAT-THU-HOACH" ||
              mockTaskObj.name.toLowerCase().includes("thu hoạch")
                ? "harvest"
                : mockTaskObj.taskCategory?.code === "CAT-PHUN-THUOC"
                  ? "treatment"
                  : mockTaskObj.taskCategory?.code === "CAT-CAI-TAO"
                    ? "amendment"
                    : "cultivation",
            startDate: mockTaskObj.startDate,
            endDate: mockTaskObj.endDate,
            objective: mockTaskObj.note || mockTaskObj.plan?.name,
            description: mockTaskObj.note,
            supplyLines: (mockTaskObj.supplyLines || []).map((s: any) => ({
              id: s.id,
              name: s.supplyItem?.name || s.name || `Vật tư #${s.id}`,
              plannedQty: String(s.quantity ?? s.plannedQty ?? 0),
              actualQty: String(s.quantity ?? s.actualQty ?? 0),
              unit: s.unitBase?.name || s.unit || "kg",
            })),
          };
        }
      }
    }

    if (!taskItem && isPlannedModeDefault) {
      taskItem = MOCK_TASKS_LIST[0];
    }

    if (taskItem) {
      const foundPlan = MOCK_PLANS.find(
        (p) => String(p.id) === String(taskItem.planId),
      );
      const planId = foundPlan ? String(foundPlan.id) : "3801";
      const workflowId = foundPlan ? String(foundPlan.workflowId) : "38";

      setSelectedTaskId(String(taskItem.id));
      setSelectedPlanId(planId);

      const plannedAllocations: MaterialAllocation[] = (
        taskItem.supplyLines || []
      ).map((s, idx) => ({
        id: Date.now() + idx,
        stageId: taskItem.name,
        materialType: "Kế hoạch",
        materialName: s.name,
        quantity: s.plannedQty,
        actualQuantity: s.actualQty || s.plannedQty,
        unit: s.unit,
        isPlanned: true,
      }));

      const isHarvestTask =
        taskItem.workType === "harvest" ||
        taskItem.name.toLowerCase().includes("thu hoạch") ||
        taskItem.name.toLowerCase().includes("harvest");

      const resolvedWorkType = isHarvestTask ? "harvest" : taskItem.workType;

      setPlannedStages([taskItem.name]);
      setFormData((prev) => ({
        ...prev,
        regimenId: workflowId,
        workType: resolvedWorkType,
        startDate: taskItem.startDate,
        endDate: taskItem.endDate,
        completionPercentage: taskItem.lastCompletionPercentage ?? 60,
        selectedStages: [taskItem.name],
        materialAllocations: plannedAllocations,
      }));
    }
  }, [initialTaskId, isPlannedModeDefault]);

  const selectedWorkflow = useMemo(
    () =>
      workflows.find((workflow) => String(workflow.id) === formData.regimenId),
    [formData.regimenId, workflows],
  );
  const workflowDomainCode = selectedWorkflow?.domainCode ?? "CROP";

  const workflowOptions = useMemo(
    () =>
      workflows.map((w) => ({
        label: w.code ? `${w.code} - ${w.name}` : w.name,
        value: String(w.id),
        keywords: [w.code, w.name].filter(Boolean) as string[],
      })),
    [workflows],
  );

  const availablePlans = useMemo(() => {
    if (!formData.regimenId) return [];
    return MOCK_PLANS.filter(
      (p) => String(p.workflowId) === String(formData.regimenId),
    );
  }, [formData.regimenId]);

  const planOptions = useMemo(
    () =>
      availablePlans.map((p) => ({
        label: p.code ? `${p.code} - ${p.name}` : p.name,
        value: String(p.id),
        keywords: [p.code, p.name],
      })),
    [availablePlans],
  );

  const selectedPlan = useMemo(
    () => MOCK_PLANS.find((p) => String(p.id) === String(selectedPlanId)),
    [selectedPlanId],
  );

  const availableTasks = useMemo(() => {
    if (!formData.regimenId || !selectedPlanId) return [];
    return MOCK_TASKS_LIST.filter(
      (t) => String(t.planId) === String(selectedPlanId),
    );
  }, [formData.regimenId, selectedPlanId]);

  const taskOptions = useMemo(
    () =>
      availableTasks.map((t) => ({
        label: t.code ? `${t.code} - ${t.name}` : t.name,
        value: String(t.id),
        keywords: [t.code, t.name],
      })),
    [availableTasks],
  );

  const selectedTask = useMemo(
    () => MOCK_TASKS_LIST.find((t) => String(t.id) === String(selectedTaskId)),
    [selectedTaskId],
  );

  const harvestTargetOptions = useMemo(() => {
    const scopes = ((selectedWorkflow as any)?.scopes ||
      []) as FarmWorkflowScopeResponse[];
    return scopes.map(mapWorkflowScopeToHarvestOption).filter(Boolean) as {
      label: string;
      value: string;
      keywords?: string[];
    }[];
  }, [selectedWorkflow]);

  const syncHarvestDetails = (nextTargets: string[]) => {
    const optionByValue = new Map(
      harvestTargetOptions.map((option) => [option.value, option]),
    );

    setFormData((prev) => {
      const current = new Map(
        prev.harvestDetails.map((item) => [item.targetId, item]),
      );
      const nextDetails = nextTargets.map((targetId) => {
        const existing = current.get(targetId);
        const option = optionByValue.get(targetId);
        if (existing) {
          return {
            ...existing,
            targetLabel: option?.label || existing.targetLabel,
            codeName:
              existing.codeName || option?.label || existing.targetLabel,
          };
        }
        return createHarvestDetail(targetId, option?.label || targetId);
      });

      return {
        ...prev,
        harvestTargets: nextTargets,
        harvestDetails: nextDetails,
      };
    });
  };

  const addStage = (stageName?: string) => {
    const nameToAdd = (stageName || "").trim();
    if (!nameToAdd) return;
    if (formData.selectedStages.includes(nameToAdd)) {
      toast({
        title: "Trùng lặp",
        description: "Hạng mục này đã có trong danh sách.",
        variant: "destructive",
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      selectedStages: [...prev.selectedStages, nameToAdd],
    }));
  };

  const removeStage = (stage: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedStages: prev.selectedStages.filter((s) => s !== stage),
      materialAllocations: prev.materialAllocations.filter(
        (m) => m.stageId !== stage,
      ),
    }));
  };

  const handleAddMaterial = (item: Omit<MaterialAllocation, "id">) => {
    setFormData((prev) => ({
      ...prev,
      materialAllocations: [
        ...prev.materialAllocations,
        { ...item, id: Date.now(), actualQuantity: item.quantity },
      ],
    }));
  };

  const handleRemoveMaterial = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      materialAllocations: prev.materialAllocations.filter((m) => m.id !== id),
    }));
  };

  const handleUpdateActualQuantity = (id: number, val: string) => {
    setFormData((prev) => ({
      ...prev,
      materialAllocations: prev.materialAllocations.map((m) =>
        m.id === id ? { ...m, actualQuantity: val } : m,
      ),
    }));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...filesArray],
      }));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...filesArray],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitForm = () => {
    setErrors({});
    const validationResult = historyFormSchema.safeParse({
      regimenId: formData.regimenId,
      workType: formData.workType,
      startDate: formData.startDate,
      isPlannedMode,
      planId: selectedPlanId,
      taskId: selectedTaskId,
    });

    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[String(issue.path[0])] = issue.message;
        }
      });
      setErrors(formattedErrors);

      toast({
        title: "Thông tin chưa hợp lệ",
        description: "Vui lòng điền đầy đủ các thông tin bắt buộc.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thành công",
      description: "Đã lưu thông tin nhật ký nông hộ thành công!",
    });
    setLocation(backUrl);
  };

  return (
    <PageWrapper
      title={pageTitle}
      description="Ghi nhận hoạt động sản xuất, cập nhật tiến độ công việc và cấp phát vật tư"
      actions={
        <div className="flex items-center gap-3">
          {allowModeToggle && (
            <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200/80 shrink-0">
              <span
                className={`text-xs font-extrabold px-3 py-1.5 rounded-lg transition-all ${
                  !isPlannedMode
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500"
                }`}
              >
                Phát sinh
              </span>
              <Switch
                checked={isPlannedMode}
                onCheckedChange={(checked) => {
                  setIsPlannedMode(checked);
                  if (!checked) {
                    setSelectedPlanId("");
                    setSelectedTaskId("");
                    setPlannedStages([]);
                  }
                }}
              />
              <span
                className={`text-xs font-extrabold px-3 py-1.5 rounded-lg transition-all ${
                  isPlannedMode
                    ? "bg-green-600 text-white shadow-2xs"
                    : "text-slate-500"
                }`}
              >
                Theo kế hoạch
              </span>
            </div>
          )}
          <Button
            variant="outline"
            className="h-10 rounded-lg px-4 text-sm gap-2"
            onClick={() => setLocation(backUrl)}
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>
      }
    >
      <div className="mx-auto w-full max-w-[1600px] pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cột trái: Thông tin chính */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-none bg-white shadow-sm">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <ClipboardList className="h-4 w-4 text-green-600" />
                  Thông tin cập nhật
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* Chọn Vụ mùa / Quy trình */}
                <div className="space-y-2">
                  <Label required>{getWorkflowLabel(workflowDomainCode)}</Label>
                  <RemoteAutoCompleteSelect
                    options={workflowOptions}
                    value={formData.regimenId}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, regimenId: val }));
                      setSelectedPlanId("");
                      setSelectedTaskId("");
                      if (errors.regimenId) {
                        setErrors((prev) => ({ ...prev, regimenId: "" }));
                      }
                    }}
                    onSearch={(query) => {
                      setWorkflowSearchQuery(query);
                    }}
                    placeholder={`Chọn ${getWorkflowLabel(workflowDomainCode).toLowerCase()}...`}
                    searchPlaceholder={`Tìm ${getWorkflowLabel(workflowDomainCode).toLowerCase()}...`}
                    emptyText="Không tìm thấy mục phù hợp."
                    disabled={!allowModeToggle}
                  />
                  {errors.regimenId && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.regimenId}
                    </p>
                  )}
                  <p className="text-xs text-slate-500">
                    {getWorkflowSubtitle(workflowDomainCode)} đang được áp dụng
                    cho nhật ký này.
                  </p>

                  {/* Bản đồ phạm vi Mùa vụ */}
                  {selectedWorkflow && (
                    <WorkflowScopeMapModal workflow={selectedWorkflow} />
                  )}
                </div>

                {/* Chế độ Theo kế hoạch -> Combobox chọn Kế hoạch & Hạng mục dự kiến */}
                {isPlannedMode && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label required>Kế hoạch</Label>
                        <RemoteAutoCompleteSelect
                          options={planOptions}
                          value={selectedPlanId}
                          onChange={(val) => {
                            setSelectedPlanId(val);
                            setSelectedTaskId("");
                            if (errors.planId) {
                              setErrors((prev) => ({ ...prev, planId: "" }));
                            }
                          }}
                          onSearch={(query) => {
                            setPlanSearchQuery(query);
                          }}
                          placeholder="Chọn kế hoạch..."
                          searchPlaceholder="Tìm kế hoạch..."
                          emptyText="Không tìm thấy kế hoạch."
                          disabled={!allowModeToggle || !formData.regimenId}
                        />
                        {errors.planId && (
                          <p className="text-xs font-medium text-red-500 mt-1">
                            {errors.planId}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label required>Hạng mục dự kiến</Label>
                        <RemoteAutoCompleteSelect
                          options={taskOptions}
                          value={selectedTaskId}
                          onChange={(val) => {
                            setSelectedTaskId(val);
                            const taskItem = MOCK_TASKS_LIST.find(
                              (t) => String(t.id) === String(val),
                            );
                            if (taskItem) {
                              const plannedAllocations: MaterialAllocation[] = (
                                taskItem.supplyLines || []
                              ).map((s, idx) => ({
                                id: Date.now() + idx,
                                stageId: taskItem.name,
                                materialType: "Kế hoạch",
                                materialName: s.name,
                                quantity: s.plannedQty,
                                actualQuantity: s.actualQty || s.plannedQty,
                                unit: s.unit,
                                isPlanned: true,
                              }));

                              const isHarvestTask =
                                taskItem.workType === "harvest" ||
                                taskItem.name
                                  .toLowerCase()
                                  .includes("thu hoạch") ||
                                taskItem.name.toLowerCase().includes("harvest");

                              const resolvedWorkType = isHarvestTask
                                ? "harvest"
                                : taskItem.workType;

                              setPlannedStages([taskItem.name]);
                              setFormData((prev) => ({
                                ...prev,
                                workType: resolvedWorkType,
                                startDate: taskItem.startDate,
                                endDate: taskItem.endDate,
                                completionPercentage:
                                  taskItem.lastCompletionPercentage ?? 60,
                                selectedStages: [taskItem.name],
                                materialAllocations: plannedAllocations,
                                harvestDetails: prev.harvestDetails,
                              }));
                            }
                            if (errors.taskId) {
                              setErrors((prev) => ({ ...prev, taskId: "" }));
                            }
                          }}
                          onSearch={(query) => {
                            setTaskSearchQuery(query);
                          }}
                          placeholder="Chọn công việc..."
                          searchPlaceholder="Tìm công việc..."
                          emptyText="Không tìm thấy công việc."
                          disabled={
                            !allowModeToggle ||
                            !formData.regimenId ||
                            !selectedPlanId
                          }
                        />
                        {errors.taskId && (
                          <p className="text-xs font-medium text-red-500 mt-1">
                            {errors.taskId}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card chi tiết thông tin công việc dự kiến đã chọn */}
                    {selectedTask && (
                      <PlannedTaskDetailCard
                        task={selectedTask}
                        planObjective={selectedPlan?.objective}
                      />
                    )}
                  </div>
                )}

                {/* Chọn Loại công việc */}
                <div className="space-y-3">
                  <Label required>Loại công việc</Label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {WORK_TYPE_OPTIONS.map((option) => {
                      const isActive = formData.workType === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          disabled={isPlannedMode}
                          onClick={() => {
                            if (isPlannedMode) return;
                            setFormData((prev) => ({
                              ...prev,
                              workType: option.value,
                            }));
                            if (errors.workType) {
                              setErrors((prev) => ({ ...prev, workType: "" }));
                            }
                          }}
                          className={`rounded-2xl border-2 px-3 py-4 transition-all flex flex-col items-center text-center gap-1.5 group ${
                            isPlannedMode
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          } ${
                            isActive
                              ? option.activeClass
                              : isPlannedMode
                                ? "border-slate-100 bg-slate-50/50 opacity-50 text-slate-400"
                                : "border-slate-100 bg-white hover:border-slate-200 text-slate-600"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                              isActive
                                ? option.iconClass
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <option.icon className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-tight">
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.workType && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.workType}
                    </p>
                  )}
                </div>

                {/* Mức độ hoàn thành công việc (Slide bar - Chỉ hiển thị khi Theo kế hoạch và đã chọn công việc) */}
                {isPlannedMode && (
                  <div
                    className={`space-y-2.5 rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 shadow-2xs transition-all ${
                      !selectedTaskId ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span className="flex items-center gap-1.5 text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Mức độ hoàn thành công việc đợt này
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-lg shadow-2xs">
                          {formData.completionPercentage ?? 60}%
                        </span>
                        {100 - (formData.completionPercentage ?? 60) > 0 && (
                          <span className="text-xs font-semibold text-slate-400">
                            (Còn lại:{" "}
                            {100 - (formData.completionPercentage ?? 60)}%)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        disabled={!selectedTaskId}
                        value={formData.completionPercentage ?? 60}
                        onChange={(e) => {
                          if (!selectedTaskId) return;
                          const val = Number(e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            completionPercentage: val,
                          }));
                        }}
                        className={`w-full h-2.5 bg-slate-200 rounded-lg appearance-none accent-green-600 focus:outline-none ${
                          !selectedTaskId
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ngày cập nhật, Ngày bắt đầu & kết thúc */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Ngày cập nhật hiện tại (Mặc định hôm nay) */}
                  <div className="space-y-2">
                    <Label required>Ngày cập nhật thông tin</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        clearable={false}
                        className="h-11 border-slate-200 pl-10 bg-white font-medium text-slate-800"
                        value={
                          formData.startDate ||
                          new Date().toISOString().split("T")[0]
                        }
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }));
                        }}
                      />
                      <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-green-600 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label required>Ngày bắt đầu</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        disabled={isPlannedMode}
                        clearable={false}
                        className={`h-11 border-slate-200 pl-10 ${
                          isPlannedMode
                            ? "bg-slate-50 cursor-not-allowed text-slate-700 font-medium opacity-90"
                            : "bg-white"
                        } ${
                          errors.startDate
                            ? "border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                        value={formData.startDate}
                        onChange={(e) => {
                          if (isPlannedMode) return;
                          setFormData((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }));
                          if (errors.startDate) {
                            setErrors((prev) => ({ ...prev, startDate: "" }));
                          }
                        }}
                      />
                      <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                    {errors.startDate && (
                      <p className="text-xs font-medium text-red-500 mt-1">
                        {errors.startDate}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Ngày kết thúc</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        disabled={isPlannedMode}
                        clearable={false}
                        className={`h-11 border-slate-200 pl-10 ${
                          isPlannedMode
                            ? "bg-slate-50 cursor-not-allowed text-slate-700 font-medium opacity-90"
                            : "bg-white"
                        }`}
                        value={formData.endDate}
                        onChange={(e) => {
                          if (isPlannedMode) return;
                          setFormData((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }));
                        }}
                      />
                      <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Mô tả */}
                <div className="space-y-2">
                  <Label>Mô tả chi tiết lần cập nhật</Label>
                  <Textarea
                    placeholder="Nhập mô tả hoặc ghi chú lần cập nhật..."
                    rows={4}
                    className="bg-white border-slate-200 focus:ring-green-500/20"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Upload hình ảnh đợt cập nhật */}
                <div className="space-y-2 pt-1">
                  <Label>Hình ảnh / Chứng từ đợt cập nhật (nếu có)</Label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`rounded-2xl border-2 border-dashed p-4 text-center transition-all cursor-pointer ${
                      isDragging
                        ? "border-green-500 bg-green-50/50"
                        : "border-slate-200 bg-slate-50/50 hover:border-green-300 hover:bg-white"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileInputChange}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-green-600">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Kéo thả hình ảnh hoặc{" "}
                          <span className="text-green-600 underline">
                            tải lên từ thiết bị
                          </span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Hỗ trợ định dạng PNG, JPG, JPEG (Tối đa 10MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Danh sách ảnh đã chọn */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2.5 pt-2">
                      {formData.images.map((file, idx) => (
                        <div
                          key={`${file.name}-${idx}`}
                          className="group relative h-20 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(idx);
                            }}
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                            title="Xóa ảnh này"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Block Thu hoạch (Nếu chọn loại công việc Thu hoạch) */}
            {formData.workType === "harvest" && (
              <Card className="border-none bg-white shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <Apple className="h-4 w-4 text-green-600" />
                    Thu hoạch
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">
                          Đối tượng thu hoạch
                        </p>
                        <p className="text-xs text-slate-500">
                          Chọn theo vùng canh tác hoặc cây canh tác, rồi nhập
                          chi tiết cho từng mục.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              harvestScope: "region",
                              harvestTargets: [],
                              harvestDetails: [],
                            }));
                          }}
                          className={`h-11 rounded-xl border px-3 text-xs font-extrabold transition-all cursor-pointer ${
                            formData.harvestScope === "region"
                              ? "border-green-600 bg-green-50/60 text-green-700 shadow-2xs"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          Vùng canh tác
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              harvestScope: "crop",
                              harvestTargets: [],
                              harvestDetails: [],
                            }));
                          }}
                          className={`h-11 rounded-xl border px-3 text-xs font-extrabold transition-all cursor-pointer ${
                            formData.harvestScope === "crop"
                              ? "border-green-600 bg-green-50/60 text-green-700 shadow-2xs"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          Cây canh tác
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {formData.harvestScope === "region" ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setGeoDialogOpen(true)}
                          className="w-full h-11 border-2 border-dashed border-green-200 bg-green-50/40 hover:bg-green-50 hover:border-green-400 text-green-700 font-bold gap-2 transition-all rounded-xl shadow-2xs cursor-pointer text-xs justify-center"
                        >
                          <Layers className="w-4 h-4 text-green-600" />
                          <span>
                            {formData.harvestDetails.length > 0
                              ? `Đã chọn ${formData.harvestDetails.length} đơn vị địa lý (Bấm để chọn lại)`
                              : "Chọn các vùng / khu vực / lô địa lý thu hoạch..."}
                          </span>
                        </Button>
                      ) : (
                        <HarvestTreeSelectorDialog
                          selectedItems={formData.harvestDetails
                            .filter((d) => d.codeName)
                            .map((d) => ({
                              id: d.targetId,
                              codeName: d.codeName,
                              label: d.targetLabel,
                              treeCode: d.codeName,
                              regionName: "Vùng trồng #1",
                            }))}
                          onConfirmSelections={(trees) => {
                            const currentMap = new Map(
                              formData.harvestDetails.map((d) => [
                                d.targetId,
                                d,
                              ]),
                            );
                            const nextTargets = trees.map((t) => t.id);
                            const nextDetails = trees.map((t) => {
                              const existing = currentMap.get(t.id);
                              if (existing) {
                                return {
                                  ...existing,
                                  codeName: t.treeCode,
                                  targetLabel: t.label,
                                };
                              }
                              return {
                                id: `h-tree-${t.id}`,
                                targetId: t.id,
                                targetLabel: t.label,
                                codeName: t.treeCode,
                                quantity: "",
                                unitBase: "kg",
                              };
                            });
                            setFormData((prev) => ({
                              ...prev,
                              harvestTargets: nextTargets,
                              harvestDetails: nextDetails,
                            }));
                          }}
                        />
                      )}

                      {/* Chi tiết từng mục thu hoạch */}
                      {formData.harvestDetails.length > 0 ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                Chi tiết thu hoạch
                              </p>
                              <p className="text-xs text-slate-500">
                                Nhập mã, sản lượng và đơn vị cơ bản cho từng mục
                                đã chọn.
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 font-bold"
                            >
                              {formData.harvestDetails.length} mục
                            </Badge>
                          </div>

                          {formData.harvestDetails.map((detail, index) => (
                            <div
                              key={detail.id}
                              className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm space-y-3"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {detail.targetLabel}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    {getHarvestLabel(formData.harvestScope)} #
                                    {index + 1}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    syncHarvestDetails(
                                      formData.harvestTargets.filter(
                                        (id) => id !== detail.targetId,
                                      ),
                                    )
                                  }
                                  className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Xóa mục này"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              {formData.harvestScope === "region" ? (
                                <GeographicalSelectionCard
                                  codeName={detail.codeName}
                                  onChangeLocation={() =>
                                    setGeoDialogOpen(true)
                                  }
                                  onRemove={() =>
                                    syncHarvestDetails(
                                      formData.harvestTargets.filter(
                                        (id) => id !== detail.targetId,
                                      ),
                                    )
                                  }
                                />
                              ) : null}

                              <div className="grid grid-cols-12 gap-3">
                                <div className="space-y-1.5 md:col-span-8">
                                  <Label className="text-xs font-semibold text-slate-500">
                                    Sản lượng
                                  </Label>
                                  <Input
                                    type="number"
                                    placeholder="Nhập sản lượng..."
                                    className="h-10 bg-white border-slate-200 text-sm"
                                    value={detail.quantity}
                                    onChange={(e) => {
                                      const next = e.target.value;
                                      setFormData((prev) => ({
                                        ...prev,
                                        harvestDetails: prev.harvestDetails.map(
                                          (item) =>
                                            item.id === detail.id
                                              ? { ...item, quantity: next }
                                              : item,
                                        ),
                                      }));
                                    }}
                                  />
                                </div>
                                <div className="space-y-1.5 md:col-span-4">
                                  <Label className="text-xs font-semibold text-slate-500">
                                    Đơn vị cơ bản
                                  </Label>
                                  <Select
                                    value={detail.unitBase}
                                    onValueChange={(value) => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        harvestDetails: prev.harvestDetails.map(
                                          (item) =>
                                            item.id === detail.id
                                              ? { ...item, unitBase: value }
                                              : item,
                                        ),
                                      }));
                                    }}
                                  >
                                    <SelectTrigger className="h-10 bg-white border-slate-200 text-sm">
                                      <SelectValue placeholder="Chọn đơn vị" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getHarvestUnitOptions().map((unit) => (
                                        <SelectItem
                                          key={unit.value}
                                          value={unit.value}
                                        >
                                          {unit.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-green-200 bg-green-50/30 p-6 text-sm text-slate-500 font-medium">
                          Chưa chọn đối tượng thu hoạch.
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Cột phải: Phân bổ công việc & Cấp phát vật tư */}
          <div className="lg:col-span-5">
            <WorkAllocationCard
              selectedStages={formData.selectedStages}
              plannedStages={plannedStages}
              isPlannedMode={isPlannedMode}
              materialAllocations={formData.materialAllocations}
              domainCode={workflowDomainCode as DomainCode}
              initialProgress={selectedTask?.lastCompletionPercentage ?? 60}
              onAddStage={addStage}
              onRemoveStage={removeStage}
              onAddMaterial={handleAddMaterial}
              onRemoveMaterial={handleRemoveMaterial}
              onUpdateActualQuantity={handleUpdateActualQuantity}
            />
          </div>
        </div>

        {/* Nút hành động (Sticky Footer) */}
        <div className="fixed left-0 right-0 bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
          <Button
            variant="outline"
            type="button"
            className="h-11 px-6 rounded-xl text-sm font-semibold"
            onClick={() => setLocation(backUrl)}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            className="h-11 px-8 rounded-xl text-sm bg-green-600 hover:bg-green-700 text-white font-bold shadow-md shadow-green-600/20"
            onClick={handleSubmitForm}
          >
            Lưu nhật ký
          </Button>
        </div>
      </div>

      {/* Dialog chọn các vùng địa lý thu hoạch (Multi-select) */}
      <HarvestGeographicalSelectorDialog
        open={geoDialogOpen}
        onOpenChange={setGeoDialogOpen}
        selectedItems={formData.harvestDetails
          .filter((d) => d.codeName)
          .map((d) => ({
            id: d.targetId,
            codeName: d.codeName,
            label: d.targetLabel,
            type: d.codeName.includes(" › ")
              ? d.codeName.split(" › ").length >= 3
                ? "plot"
                : "area"
              : "region",
          }))}
        onConfirmSelections={(selectedGeoItems) => {
          const currentMap = new Map(
            formData.harvestDetails.map((d) => [d.targetId, d]),
          );

          const nextTargets = selectedGeoItems.map((item) => item.id);
          const nextDetails = selectedGeoItems.map((item) => {
            const existing = currentMap.get(item.id);
            if (existing) {
              return {
                ...existing,
                codeName: item.codeName,
                targetLabel: item.label,
              };
            }
            return {
              id: `h-geo-${item.id}`,
              targetId: item.id,
              targetLabel: item.label,
              codeName: item.codeName,
              quantity: "",
              unitBase: "kg",
            };
          });

          setFormData((prev) => ({
            ...prev,
            harvestTargets: nextTargets,
            harvestDetails: nextDetails,
          }));
        }}
      />
    </PageWrapper>
  );
}
