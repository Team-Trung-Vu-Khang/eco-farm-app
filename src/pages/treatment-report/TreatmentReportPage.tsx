import PageWrapper from "@/components/PageWrapper";
import { units as materialUnits } from "@/pages/material/data/constants";
import type { Material } from "@/pages/material/types/types";
import type { Treatment } from "@/pages/treatment/types/treatment.types";
import useMaterialStore from "@/stores/useMaterialStore";
import type { Plan } from "@/stores/usePlanStore";
import usePlanStore from "@/stores/usePlanStore";
import type { Task } from "@/stores/useTaskStore";
import useTaskStore from "@/stores/useTaskStore";
import useTreatmentReportStore from "@/stores/useTreatmentReportStore";
import { useTreatmentStore } from "@/stores/useTreatmentStore";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Activity,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileImage,
  Plus,
  RefreshCw,
  Stethoscope,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import type {
  TreatmentReportEntry,
  TreatmentReportEvidence,
  TreatmentReportImprovement,
  TreatmentReportMaterialUsage,
  TreatmentReportStatus,
  TreatmentReportSummary,
} from "./types";

interface MaterialDraft {
  id: string;
  materialId: string;
  quantity: string;
  unit: string;
}

interface TargetOption {
  value: string;
  label: string;
}

const improvementOptions: Array<{
  value: TreatmentReportImprovement;
  label: string;
  description: string;
}> = [
  {
    value: "better",
    label: "Tốt hơn",
    description: "Triệu chứng giảm, cây/vườn phản hồi tích cực",
  },
  {
    value: "unchanged",
    label: "Không đổi",
    description: "Chưa có thay đổi rõ rệt sau thao tác điều trị",
  },
  {
    value: "worse",
    label: "Nặng hơn",
    description: "Dấu hiệu lan rộng hoặc cần tái đánh giá sớm",
  },
];

const statusConfig: Record<
  TreatmentReportStatus,
  {
    label: string;
    description: string;
    className: string;
    icon: typeof Activity;
  }
> = {
  "not-started": {
    label: "Chưa bắt đầu",
    description: "Chưa có nhật ký hoặc công việc điều trị đang chạy.",
    className: "border-slate-200 bg-slate-50 text-slate-700",
    icon: CalendarClock,
  },
  "in-progress": {
    label: "Đang điều trị",
    description: "Đợt điều trị đang được thực hiện và theo dõi.",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    icon: Activity,
  },
  "needs-review": {
    label: "Cần tái đánh giá",
    description: "Có dấu hiệu xấu đi hoặc đã quá 7 ngày chưa cập nhật.",
    className: "border-amber-200 bg-amber-50 text-amber-800",
    icon: AlertTriangle,
  },
  completed: {
    label: "Hoàn tất",
    description: "Các công việc liên quan đã hoàn thành, chưa có cảnh báo mới.",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
};

const today = () => new Date().toISOString().split("T")[0];

const createDraftId = () =>
  `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function formatDate(value?: string) {
  if (!value) return "Chưa có";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function differenceInDays(fromDate: string, toDate = today()) {
  const start = new Date(fromDate).getTime();
  const end = new Date(toDate).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) return 0;

  return Math.max(0, Math.floor((end - start) / 86_400_000));
}

function buildTargetOptions(plan?: Plan): TargetOption[] {
  if (!plan) return [];

  const options: TargetOption[] = [
    {
      value: `plan:${plan.id}`,
      label: `${plan.name} - ${plan.crop || "Đối tượng điều trị"}`,
    },
  ];

  if (plan.cultivationRegion || plan.selectedRegionIds.length > 0) {
    options.push({
      value: `region:${plan.selectedRegionIds.join(",") || plan.cultivationRegion}`,
      label: `Vùng: ${plan.cultivationRegion || plan.selectedRegionIds.join(", ")}`,
    });
  }

  if (plan.zone || plan.selectedZoneIds.length > 0) {
    options.push({
      value: `zone:${plan.selectedZoneIds.join(",") || plan.zone}`,
      label: `Khu vực: ${plan.zone || plan.selectedZoneIds.join(", ")}`,
    });
  }

  if (plan.plot || plan.selectedPlotIds.length > 0) {
    options.push({
      value: `plot:${plan.selectedPlotIds.join(",") || plan.plot}`,
      label: `Lô: ${plan.plot || plan.selectedPlotIds.join(", ")}`,
    });
  }

  if (plan.crop) {
    options.push({
      value: `crop:${plan.crop}`,
      label: `Cây trồng: ${plan.crop}${plan.variety ? ` - ${plan.variety}` : ""}`,
    });
  }

  return options;
}

function buildSummary(
  plan: Plan | undefined,
  tasks: Task[],
  entries: TreatmentReportEntry[],
): TreatmentReportSummary {
  const latestEntry = entries[0];
  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;
  const completedTaskRate = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;
  const hasStartedTask = tasks.some(
    (task) => task.status === "in-progress" || task.status === "completed",
  );
  const hasOpenTask = tasks.some(
    (task) => task.status === "pending" || task.status === "in-progress",
  );
  const allTasksCompleted = tasks.length > 0 && completedTasks === tasks.length;
  const daysSinceLastUpdate = latestEntry
    ? differenceInDays(latestEntry.recordedAt)
    : 0;
  const totalMaterialItems = entries.reduce(
    (total, entry) => total + entry.materials.length,
    0,
  );

  let status: TreatmentReportStatus = "in-progress";

  if (!latestEntry && !hasStartedTask && !hasOpenTask) {
    status = "not-started";
  } else if (
    latestEntry?.improvement === "worse" ||
    (latestEntry && daysSinceLastUpdate > 7)
  ) {
    status = "needs-review";
  } else if (allTasksCompleted) {
    status = "completed";
  } else if (hasOpenTask || latestEntry) {
    status = "in-progress";
  }

  return {
    status,
    elapsedDays: plan ? differenceInDays(plan.startDate) : 0,
    completedTaskRate,
    totalMaterialItems,
    lastUpdatedAt: latestEntry?.recordedAt,
    latestReassessment: latestEntry?.reassessmentNote,
  };
}

function getImprovementLabel(value: TreatmentReportImprovement) {
  return (
    improvementOptions.find((option) => option.value === value)?.label || value
  );
}

export default function TreatmentReportPage() {
  const { toast } = useToast();
  const treatments = useTreatmentStore((state) => state.treatments);
  const plans = usePlanStore((state) => state.plans);
  const tasks = useTaskStore((state) => state.tasks);
  const materialsFromStore = useMaterialStore((state) => state.materials);
  const entries = useTreatmentReportStore((state) => state.entries);
  const addEntry = useTreatmentReportStore((state) => state.addEntry);
  const clearEntriesByPlan = useTreatmentReportStore(
    (state) => state.clearEntriesByPlan,
  );

  const treatmentPlans = useMemo(
    () => plans.filter((plan) => plan.purpose === "treatment"),
    [plans],
  );
  const [selectedTreatmentId, setSelectedTreatmentId] = useState(
    () => treatments[0]?.id.toString() || "",
  );
  const [selectedPlanId, setSelectedPlanId] = useState(
    () => treatmentPlans[0]?.id.toString() || "",
  );
  const selectedPlan = treatmentPlans.find(
    (plan) => plan.id.toString() === selectedPlanId,
  );
  const targetOptions = useMemo(
    () => buildTargetOptions(selectedPlan),
    [selectedPlan],
  );
  const [selectedTarget, setSelectedTarget] = useState(
    () => targetOptions[0]?.value || "",
  );
  const [recordedAt, setRecordedAt] = useState(today());
  const [symptoms, setSymptoms] = useState("");
  const [improvement, setImprovement] =
    useState<TreatmentReportImprovement>("better");
  const [actions, setActions] = useState("");
  const [reassessmentNote, setReassessmentNote] = useState("");
  const [materials, setMaterials] = useState<MaterialDraft[]>([
    { id: createDraftId(), materialId: "", quantity: "", unit: "" },
  ]);
  const [evidences, setEvidences] = useState<TreatmentReportEvidence[]>([]);

  useEffect(() => {
    if (!selectedTreatmentId && treatments[0]) {
      setSelectedTreatmentId(treatments[0].id.toString());
    }
  }, [selectedTreatmentId, treatments]);

  useEffect(() => {
    if (!selectedPlanId && treatmentPlans[0]) {
      setSelectedPlanId(treatmentPlans[0].id.toString());
    }
  }, [selectedPlanId, treatmentPlans]);

  useEffect(() => {
    if (
      targetOptions.length > 0 &&
      !targetOptions.some((item) => item.value === selectedTarget)
    ) {
      setSelectedTarget(targetOptions[0].value);
    }
  }, [selectedTarget, targetOptions]);

  const selectedTreatment = treatments.find(
    (treatment) => treatment.id.toString() === selectedTreatmentId,
  );
  const selectedTargetLabel =
    targetOptions.find((option) => option.value === selectedTarget)?.label ||
    "";
  const relatedTasks = useMemo(
    () =>
      tasks.filter((task) => selectedPlan && task.plan === selectedPlan.name),
    [selectedPlan, tasks],
  );
  const planEntries = useMemo(
    () =>
      entries
        .filter((entry) => selectedPlan && entry.planId === selectedPlan.id)
        .sort(
          (a, b) =>
            new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
        ),
    [entries, selectedPlan],
  );
  const summary = useMemo(
    () => buildSummary(selectedPlan, relatedTasks, planEntries),
    [planEntries, relatedTasks, selectedPlan],
  );
  const activeStatus = statusConfig[summary.status];
  const StatusIcon = activeStatus.icon;

  const updateMaterial = (
    id: string,
    field: keyof Omit<MaterialDraft, "id">,
    value: string,
  ) => {
    setMaterials((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addMaterialRow = () => {
    setMaterials((current) => [
      ...current,
      { id: createDraftId(), materialId: "", quantity: "", unit: "" },
    ]);
  };

  const removeMaterialRow = (id: string) => {
    setMaterials((current) =>
      current.length === 1 ? current : current.filter((item) => item.id !== id),
    );
  };

  const handleEvidenceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const nextEvidences = files.map<TreatmentReportEvidence>((file) => ({
      id: createDraftId(),
      name: file.name,
      fileType: file.type || file.name.split(".").pop() || "unknown",
      size: formatFileSize(file.size),
      addedAt: new Date().toISOString(),
    }));

    setEvidences((current) => [...current, ...nextEvidences]);
    event.target.value = "";
  };

  const removeEvidence = (id: string) => {
    setEvidences((current) => current.filter((item) => item.id !== id));
  };

  const resetForm = () => {
    setRecordedAt(today());
    setSymptoms("");
    setImprovement("better");
    setActions("");
    setReassessmentNote("");
    setMaterials([
      { id: createDraftId(), materialId: "", quantity: "", unit: "" },
    ]);
    setEvidences([]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedTreatment || !selectedPlan || !selectedTargetLabel) {
      toast({
        title: "Thiếu thông tin theo dõi",
        description:
          "Vui lòng chọn phác đồ, đối tượng áp dụng và đợt điều trị.",
        variant: "destructive",
      });
      return;
    }

    if (!symptoms.trim() || !actions.trim()) {
      toast({
        title: "Chưa đủ dữ liệu hiện trường",
        description:
          "Vui lòng nhập triệu chứng và thao tác điều trị đã thực hiện.",
        variant: "destructive",
      });
      return;
    }

    const normalizedMaterials: TreatmentReportMaterialUsage[] = materials
      .filter((item) => item.materialId)
      .map((item) => {
        const found = materialsFromStore.find(
          (material) => material.id.toString() === item.materialId,
        );
        return {
          id: createDraftId(),
          name: found
            ? `${found.code} - ${found.name}`
            : "Vật tư không xác định",
          quantity: item.quantity.trim() || "0",
          unit: item.unit.trim() || "đơn vị",
        };
      });

    addEntry({
      treatmentId: selectedTreatment.id,
      planId: selectedPlan.id,
      targetLabel: selectedTargetLabel,
      recordedAt,
      symptoms: symptoms.trim(),
      improvement,
      actions: actions.trim(),
      materials: normalizedMaterials,
      evidences,
      reassessmentNote: reassessmentNote.trim(),
    });

    toast({
      title: "Đã cập nhật theo dõi điều trị",
      description: "Nhật ký hiện trường đã được lưu cục bộ.",
    });
    resetForm();
  };

  const handleClearPlanEntries = () => {
    if (!selectedPlan) return;
    clearEntriesByPlan(selectedPlan.id);
    toast({
      title: "Đã xóa nhật ký của đợt điều trị",
      description: "Dữ liệu theo dõi cục bộ của đợt này đã được làm sạch.",
    });
  };

  return (
    <PageWrapper
      title="Theo dõi thực hiện phác đồ điều trị"
      description="Cập nhật hiện trường, vật tư sử dụng và trạng thái tái đánh giá cho từng đợt điều trị"
      actions={
        <Button variant="outline" onClick={resetForm}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Làm mới biểu mẫu
        </Button>
      }
    >
      <div className="space-y-6">
        <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Stethoscope className="w-5 h-5 text-emerald-700" />
              Thiết lập theo dõi
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Phác đồ điều trị</Label>
              <Select
                value={selectedTreatmentId}
                onValueChange={setSelectedTreatmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phác đồ" />
                </SelectTrigger>
                <SelectContent>
                  {treatments.map((treatment: Treatment) => (
                    <SelectItem
                      key={treatment.id}
                      value={treatment.id.toString()}
                    >
                      {treatment.code} - {treatment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Đợt điều trị</Label>
              <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đợt điều trị" />
                </SelectTrigger>
                <SelectContent>
                  {treatmentPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id.toString()}>
                      {plan.code} - {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Đối tượng áp dụng</Label>
              <Select
                value={selectedTarget}
                onValueChange={setSelectedTarget}
                disabled={!selectedPlan}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đối tượng" />
                </SelectTrigger>
                <SelectContent>
                  {targetOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <StatusCard
            title="Trạng thái hiện tại"
            value={activeStatus.label}
            description={activeStatus.description}
            className={activeStatus.className}
            icon={<StatusIcon className="w-5 h-5" />}
          />
          <StatusCard
            title="Số ngày điều trị"
            value={`${summary.elapsedDays} ngày`}
            description={
              selectedPlan
                ? `${formatDate(selectedPlan.startDate)} - ${formatDate(selectedPlan.endDate)}`
                : "Chưa chọn đợt"
            }
            icon={<CalendarClock className="w-5 h-5" />}
          />
          <StatusCard
            title="Hoàn thành công việc"
            value={`${summary.completedTaskRate}%`}
            description={`${relatedTasks.filter((task) => task.status === "completed").length}/${relatedTasks.length} công việc đã hoàn tất`}
            icon={<ClipboardCheck className="w-5 h-5" />}
            progress={summary.completedTaskRate}
          />
          <StatusCard
            title="Vật tư đã ghi nhận"
            value={`${summary.totalMaterialItems} dòng`}
            description={`Cập nhật gần nhất: ${formatDate(summary.lastUpdatedAt)}`}
            icon={<FileImage className="w-5 h-5" />}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cập nhật hiện trường</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Ngày ghi nhận</Label>
                    <Input
                      type="date"
                      value={recordedAt}
                      onChange={(event) => setRecordedAt(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mức độ cải thiện</Label>
                    <Select
                      value={improvement}
                      onValueChange={(value) =>
                        setImprovement(value as TreatmentReportImprovement)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mức độ" />
                      </SelectTrigger>
                      <SelectContent>
                        {improvementOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {
                        improvementOptions.find(
                          (item) => item.value === improvement,
                        )?.description
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Triệu chứng hiện tại</Label>
                  <Textarea
                    value={symptoms}
                    onChange={(event) => setSymptoms(event.target.value)}
                    placeholder="Ví dụ: mật độ rầy giảm ở tán dưới, còn xuất hiện đốm vàng trên lá non..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Thao tác điều trị đã thực hiện</Label>
                  <Textarea
                    value={actions}
                    onChange={(event) => setActions(event.target.value)}
                    placeholder="Ghi lại thao tác phun/tưới/cắt tỉa/cách ly và điều kiện hiện trường..."
                    rows={4}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label>Vật tư sử dụng</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addMaterialRow}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm vật tư
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {materials.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-1 gap-3 rounded-lg border bg-slate-50/70 p-3 md:grid-cols-[minmax(0,1fr)_120px_120px_40px]"
                      >
                        <Select
                          value={item.materialId}
                          onValueChange={(value) =>
                            updateMaterial(item.id, "materialId", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vật tư từ hệ thống" />
                          </SelectTrigger>
                          <SelectContent>
                            {materialsFromStore.map((material: Material) => (
                              <SelectItem
                                key={material.id}
                                value={material.id.toString()}
                              >
                                {material.code} - {material.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={item.quantity}
                          onChange={(event) =>
                            updateMaterial(
                              item.id,
                              "quantity",
                              event.target.value,
                            )
                          }
                          placeholder="Số lượng"
                        />
                        <Select
                          value={item.unit}
                          onValueChange={(value) =>
                            updateMaterial(item.id, "unit", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Đơn vị" />
                          </SelectTrigger>
                          <SelectContent>
                            {materialUnits.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMaterialRow(item.id)}
                          disabled={materials.length === 1}
                          aria-label="Xóa vật tư"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Minh chứng hiện trường</Label>
                  <Input type="file" multiple onChange={handleEvidenceChange} />
                  {evidences.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {evidences.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2 text-sm"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.fileType} - {item.size}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeEvidence(item.id)}
                            aria-label="Xóa minh chứng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label>Ghi chú tái đánh giá</Label>
                  <Textarea
                    value={reassessmentNote}
                    onChange={(event) =>
                      setReassessmentNote(event.target.value)
                    }
                    placeholder="Kết luận ngắn: tiếp tục phác đồ, tăng liều theo khuyến nghị, tái kiểm tra sau 3 ngày..."
                    rows={3}
                  />
                </div>

                <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Dữ liệu minh chứng chỉ lưu metadata cục bộ, chưa upload
                    backend.
                  </p>
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Lưu cập nhật
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">Tổng hợp & lịch sử</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedTreatment?.name || "Chưa chọn phác đồ"}
                  </p>
                </div>
                <Badge variant="outline" className={activeStatus.className}>
                  {activeStatus.label}
                </Badge>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">
                  Kết luận tái đánh giá gần nhất
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {summary.latestReassessment ||
                    "Chưa có ghi chú tái đánh giá."}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">Công việc liên quan</p>
                  <Badge variant="secondary">{relatedTasks.length} việc</Badge>
                </div>
                {relatedTasks.length > 0 ? (
                  <div className="space-y-2">
                    {relatedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-lg border p-3 text-sm"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium">{task.name}</p>
                          <TaskStatusBadge status={task.status} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(task.startDate)} -{" "}
                          {formatDate(task.endDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                    Chưa có công việc nào khớp với đợt điều trị này.
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">Nhật ký hiện trường</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearPlanEntries}
                    disabled={planEntries.length === 0}
                  >
                    Xóa nhật ký
                  </Button>
                </div>
                {planEntries.length > 0 ? (
                  <div className="space-y-3">
                    {planEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-xl border bg-white p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium">
                            {formatDate(entry.recordedAt)}
                          </p>
                          <Badge variant="outline">
                            {getImprovementLabel(entry.improvement)}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {entry.symptoms}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          <span className="font-medium">Thao tác: </span>
                          {entry.actions}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {entry.materials.map((material) => (
                            <Badge key={material.id} variant="secondary">
                              {material.name}: {material.quantity}{" "}
                              {material.unit}
                            </Badge>
                          ))}
                          {entry.evidences.length > 0 ? (
                            <Badge variant="outline">
                              {entry.evidences.length} minh chứng
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                    Chưa có nhật ký cho đợt điều trị đang chọn.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}

function StatusCard({
  title,
  value,
  description,
  icon,
  progress,
  className = "border-slate-200 bg-white text-slate-800",
}: {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  progress?: number;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm opacity-80">{title}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
          <div className="rounded-full bg-white/70 p-2 shadow-sm">{icon}</div>
        </div>
        <p className="mt-3 min-h-10 text-sm opacity-75">{description}</p>
        {typeof progress === "number" ? (
          <Progress value={progress} className="mt-3" />
        ) : null}
      </CardContent>
    </Card>
  );
}

function TaskStatusBadge({ status }: { status: Task["status"] }) {
  const config: Record<Task["status"], { label: string; className: string }> = {
    pending: { label: "Chờ làm", className: "border-slate-200 bg-slate-50" },
    "in-progress": {
      label: "Đang làm",
      className: "border-blue-200 bg-blue-50 text-blue-700",
    },
    completed: {
      label: "Hoàn thành",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    overdue: {
      label: "Quá hạn",
      className: "border-red-200 bg-red-50 text-red-700",
    },
  };

  return (
    <Badge variant="outline" className={config[status].className}>
      {config[status].label}
    </Badge>
  );
}
