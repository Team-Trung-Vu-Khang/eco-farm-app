import {
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  AutoCompleteSelect,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StepperForm,
  Textarea,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText, Image as ImageIcon, Plus, Trash2, Video, X } from "lucide-react";
import useCropStore from "../../../stores/useCropStore";
import useGroupCropStore from "../../../stores/useGroupCropStore";
import {
  applicableObjectOptions,
  budgetRangeOptions,
  inspectionParameterOptions,
  mockTreatmentMethods,
  responsibleUnitOptions,
  soilProblemOptions,
  targetSeverityOptions,
  terrainOptions,
  treatmentMaterialCategoryOptions,
  treatmentPlanIntensityOptions,
  treatmentPlanPriorityOptions,
} from "../data/soilAmendmentTreatmentData";
import type {
  TreatmentAttachment,
  TreatmentAuthor,
  TreatmentMaterialItem,
  TreatmentPlan,
  TreatmentPlanFormData,
  TreatmentProcedure,
} from "../types/treatment";

interface SoilTreatmentPlanFormDialogProps {
  embedded?: boolean;
  formData: TreatmentPlanFormData;
  onCancel?: () => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  open: boolean;
  setFormData: React.Dispatch<React.SetStateAction<TreatmentPlanFormData>>;
  selectedItem: TreatmentPlan | null;
}

function createAuthorRow(): TreatmentAuthor {
  return {
    id: Date.now(),
    name: "",
    qualification: "",
    organization: "",
  };
}

function createMaterialRow(): TreatmentMaterialItem {
  return {
    id: Date.now(),
    category: "fertilizer",
    name: "",
    dosageMin: "",
    dosageMax: "",
    unit: "kg/ha",
  };
}

function createProcedureRow(nextStepNumber: number): TreatmentProcedure {
  return {
    id: Date.now(),
    stepNumber: nextStepNumber,
    name: "",
    description: "",
    startDay: undefined,
    endDay: undefined,
    detailedInstructions: "",
    dosage: "",
    timing: "",
    technique: "",
    materials: [],
    equipment: [],
    stageMaterials: [],
    estimatedDays: 0,
    warnings: [],
    tips: [],
    expectedOutcome: "",
    qualityCheckpoints: [],
  };
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function detectAttachmentType(file: File): TreatmentAttachment["fileType"] {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "pdf";
}

function WizardCard({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 border-b border-slate-100 pb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function StageMetric({
  label,
  tone,
  value,
}: {
  label: string;
  tone: string;
  value: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <p className="text-xs uppercase tracking-wide">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}

function SummaryField({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="space-y-1 rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="text-sm text-slate-700">{value}</div>
    </div>
  );
}

function TagInput({
  label,
  onChange,
  placeholder,
  values,
}: {
  label: string;
  onChange: (next: string[]) => void;
  placeholder: string;
  values: string[];
}) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const normalized = draft.trim().replace(/\s+/g, "");
    if (!normalized) return;
    const finalValue = normalized.startsWith("#")
      ? normalized.toLowerCase()
      : `#${normalized.toLowerCase()}`;

    if (!values.includes(finalValue)) {
      onChange([...values, finalValue]);
    }

    setDraft("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {values.length > 0 ? (
            values.map((item) => (
              <Badge key={item} variant="secondary" className="rounded-full gap-2">
                {item}
                <button
                  type="button"
                  onClick={() => onChange(values.filter((value) => value !== item))}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <p className="text-sm text-slate-400">
              Nhập hashtag và nhấn Enter để thêm.
            </p>
          )}
        </div>
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export function SoilTreatmentPlanFormDialog({
  embedded = false,
  formData,
  onCancel,
  onOpenChange,
  onSubmit,
  open,
  setFormData,
  selectedItem,
}: SoilTreatmentPlanFormDialogProps) {
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const authors = formData.authors || [];
  const attachments = formData.attachments || [];
  const procedures = formData.procedures || [];
  const groupCrops = useGroupCropStore((state) => state.groupCrops);
  const crops = useCropStore((state) => state.crops);

  const groupCropOptions = groupCrops.map((item) => ({
    label: item.name,
    value: String(item.id),
    keywords: [item.code, item.biological],
  }));

  const cropOptions = crops.map((item) => ({
    label: item.name,
    value: String(item.id),
    keywords: [item.code, item.cropGroup, item.cropType],
  }));
  const primaryMethod = mockTreatmentMethods.find(
    (method) => method.id === formData.primaryMethodId,
  );
  const supportingMethods = mockTreatmentMethods.filter((method) =>
    (formData.supportingMethodIds || []).includes(method.id),
  );
  const selectedGroupCropLabels = groupCropOptions
    .filter((item) => (formData.cropGroupTags || []).includes(item.value))
    .map((item) => item.label);
  const selectedCropLabels = cropOptions
    .filter((item) => (formData.applicableCrops || []).includes(item.value))
    .map((item) => item.label);
  const getOptionLabel = (
    options: ReadonlyArray<{ label: string; value: string }>,
    value?: string,
  ) => options.find((item) => item.value === value)?.label;
  const responsibleUnitLabel = getOptionLabel(
    responsibleUnitOptions,
    formData.responsibleUnit,
  );
  const priorityLabel = getOptionLabel(treatmentPlanPriorityOptions, formData.priority);
  const targetSeverityLabel = getOptionLabel(
    targetSeverityOptions,
    formData.targetSeverity,
  );
  const budgetRangeLabel = getOptionLabel(budgetRangeOptions, formData.budgetRange);
  const terrainLabels = terrainOptions
    .filter((item) => (formData.terrainTypes || []).includes(item.value))
    .map((item) => item.label);
  const applicableObjectLabels = applicableObjectOptions
    .filter((item) => (formData.applicableObjects || []).includes(item.value))
    .map((item) => item.label);

  const joinOrFallback = (values: Array<string | undefined>, fallback = "Chưa cập nhật") => {
    const normalized = values.map((item) => item?.trim()).filter(Boolean) as string[];
    return normalized.length > 0 ? normalized.join(", ") : fallback;
  };
  const timeWindowSummary =
    formData.startDate || formData.endDate
      ? joinOrFallback([formData.startDate, formData.endDate])
      : formData.duration || "Chưa cập nhật";

  const updateForm = <K extends keyof TreatmentPlanFormData>(
    key: K,
    value: TreatmentPlanFormData[K],
  ) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const updateAuthor = (
    authorId: number,
    key: keyof Omit<TreatmentAuthor, "id">,
    value: string,
  ) => {
    updateForm(
      "authors",
      authors.map((author) =>
        author.id === authorId ? { ...author, [key]: value } : author,
      ),
    );
  };

  const updateProcedure = (
    procedureId: number,
    updater: (procedure: TreatmentProcedure) => TreatmentProcedure,
  ) => {
    updateForm(
      "procedures",
      procedures.map((procedure) =>
        procedure.id === procedureId ? updater(procedure) : procedure,
      ),
    );
  };

  const updateProcedureField = <K extends keyof TreatmentProcedure>(
    procedureId: number,
    key: K,
    value: TreatmentProcedure[K],
  ) => {
    updateProcedure(procedureId, (procedure) => ({ ...procedure, [key]: value }));
  };

  const updateStageMaterial = (
    procedureId: number,
    materialId: number,
    key: keyof Omit<TreatmentMaterialItem, "id">,
    value: string,
  ) => {
    updateProcedure(procedureId, (procedure) => ({
      ...procedure,
      stageMaterials: (procedure.stageMaterials || []).map((material) =>
        material.id === materialId ? { ...material, [key]: value } : material,
      ),
    }));
  };

  const addProcedure = () => {
    updateForm("procedures", [...procedures, createProcedureRow(procedures.length + 1)]);
  };

  const handleUploadFiles =
    (kind: "pdf" | "image" | "video") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      updateForm("attachments", [
        ...attachments,
        ...files.map((file, index) => ({
          id: Date.now() + index,
          name: file.name,
          fileType: kind === "pdf" ? "pdf" : detectAttachmentType(file),
          size: formatFileSize(file.size),
        })),
      ]);

      event.target.value = "";
    };

  const steps: Step[] = [
    {
      id: "general",
      title: "Thông tin nền",
      description: "Bài toán đất và mốc thời gian",
      isValid:
        !!formData.code &&
        !!formData.name &&
        !!formData.zone &&
        !!formData.soilIssue,
      content: (
        <WizardCard
          title="Khởi tạo hồ sơ phác đồ"
          description="Khai báo thông tin chung để định danh phác đồ và mô tả bài toán xử lý đất."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Mã phác đồ</Label>
              <Input
                value={formData.code || ""}
                onChange={(event) => updateForm("code", event.target.value)}
                placeholder="VD: STP-2026-001"
              />
            </div>
            <div className="space-y-2">
              <Label>Tên phác đồ</Label>
              <Input
                value={formData.name || ""}
                onChange={(event) => updateForm("name", event.target.value)}
                placeholder="VD: Phác đồ xử lý đất bạc màu cho rau màu"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Khu vực áp dụng</Label>
              <Input
                value={formData.zone || ""}
                onChange={(event) => updateForm("zone", event.target.value)}
                placeholder="VD: Đồng Nai - vùng sản xuất 3"
              />
            </div>
            <div className="space-y-2">
              <Label>Cường độ áp dụng</Label>
              <Select
                value={formData.intensity || "medium"}
                onValueChange={(value: TreatmentPlan["intensity"]) =>
                  updateForm("intensity", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {treatmentPlanIntensityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Vấn đề - tình trạng đất</Label>
              <MultiSelect
                options={soilProblemOptions.map((item) => ({ ...item }))}
                value={formData.soilProblems || []}
                onChange={(value) => updateForm("soilProblems", value)}
                placeholder="Chọn nhiều vấn đề"
              />
            </div>
            <div className="space-y-2">
              <Label>Mục tiêu - mức độ</Label>
              <AutoCompleteSelect
                options={targetSeverityOptions.map((item) => ({ ...item }))}
                value={formData.targetSeverity || ""}
                onChange={(value) =>
                  updateForm(
                    "targetSeverity",
                    value as TreatmentPlan["targetSeverity"],
                  )
                }
                placeholder="Chọn mức độ mục tiêu"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mô tả hiện trạng đất</Label>
            <Textarea
              rows={4}
              value={formData.soilIssue || ""}
              onChange={(event) => updateForm("soilIssue", event.target.value)}
              placeholder="Mô tả rõ hiện trạng đất, bệnh nền, dấu hiệu ngoài ruộng..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Ngày bắt đầu</Label>
              <Input
                type="date"
                value={formData.startDate || ""}
                onChange={(event) => updateForm("startDate", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Ngày kết thúc</Label>
              <Input
                type="date"
                value={formData.endDate || ""}
                onChange={(event) => updateForm("endDate", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Thời lượng áp dụng</Label>
              <Input
                value={formData.duration || ""}
                onChange={(event) => updateForm("duration", event.target.value)}
                placeholder="VD: 60 ngày"
              />
            </div>
            <div className="space-y-2">
              <Label>Khoảng ngân sách</Label>
              <Select
                value={formData.budgetRange || ""}
                onValueChange={(value) => updateForm("budgetRange", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khoảng chi phí" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </WizardCard>
      ),
    },
    {
      id: "scope",
      title: "Phạm vi",
      description: "Đơn vị, tác giả, cây trồng",
      isValid: !!formData.responsibleUnit,
      content: (
        <WizardCard
          title="Phạm vi áp dụng và trách nhiệm"
          description="Xác định đơn vị phụ trách, tác giả, phân loại cây trồng và đối tượng áp dụng."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Đơn vị chịu trách nhiệm</Label>
              <AutoCompleteSelect
                options={responsibleUnitOptions.map((item) => ({ ...item }))}
                value={formData.responsibleUnit || ""}
                onChange={(value) => updateForm("responsibleUnit", value)}
                placeholder="Chọn đơn vị"
              />
            </div>
            <div className="space-y-2">
              <Label>Ưu tiên xử lý</Label>
              <Select
                value={formData.priority || "medium"}
                onValueChange={(value: TreatmentPlan["priority"]) =>
                  updateForm("priority", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {treatmentPlanPriorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Phân loại nhóm cây trồng</Label>
              <MultiSelect
                options={groupCropOptions}
                value={formData.cropGroupTags || []}
                onChange={(value) => updateForm("cropGroupTags", value)}
                placeholder="Chọn nhóm cây trồng"
              />
            </div>
            <div className="space-y-2">
              <Label>Đối tượng áp dụng</Label>
              <MultiSelect
                options={applicableObjectOptions.map((item) => ({ ...item }))}
                value={formData.applicableObjects || []}
                onChange={(value) => updateForm("applicableObjects", value)}
                placeholder="Chọn đối tượng"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Cây trồng áp dụng</Label>
              <MultiSelect
                options={cropOptions}
                value={formData.applicableCrops || []}
                onChange={(value) => updateForm("applicableCrops", value)}
                placeholder="Chọn cây trồng áp dụng"
              />
            </div>
            <div className="space-y-2">
              <Label>Địa hình</Label>
              <MultiSelect
                options={terrainOptions.map((item) => ({ ...item }))}
                value={formData.terrainTypes || []}
                onChange={(value) => updateForm("terrainTypes", value)}
                placeholder="Chọn địa hình"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Tác giả</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => updateForm("authors", [...authors, createAuthorRow()])}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm tác giả
              </Button>
            </div>

            <div className="space-y-3">
              {authors.map((author, index) => (
                <div
                  key={author.id}
                  className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_1fr_1.2fr_auto]"
                >
                  <Input
                    value={author.name}
                    placeholder={`Tác giả ${index + 1}`}
                    onChange={(event) =>
                      updateAuthor(author.id, "name", event.target.value)
                    }
                  />
                  <Input
                    value={author.qualification}
                    placeholder="Trình độ"
                    onChange={(event) =>
                      updateAuthor(author.id, "qualification", event.target.value)
                    }
                  />
                  <Input
                    value={author.organization}
                    placeholder="Đơn vị cộng tác"
                    onChange={(event) =>
                      updateAuthor(author.id, "organization", event.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      updateForm(
                        "authors",
                        authors.filter((item) => item.id !== author.id),
                      )
                    }
                    disabled={authors.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </WizardCard>
      ),
    },
    {
      id: "methods",
      title: "Biện pháp",
      description: "Biện pháp, mục tiêu, lưu ý",
      isValid: !!formData.primaryMethodId,
      content: (
        <WizardCard
          title="Biện pháp và mục tiêu phác đồ"
          description="Chọn 1 biện pháp chính, các biện pháp hỗ trợ và nhập mục tiêu dạng hashtag."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Biện pháp sử dụng chính</Label>
              <AutoCompleteSelect
                options={mockTreatmentMethods.map((method) => ({
                  label: method.name,
                  value: String(method.id),
                  keywords: [method.description, method.type],
                }))}
                value={formData.primaryMethodId ? String(formData.primaryMethodId) : ""}
                onChange={(value) =>
                  updateForm("primaryMethodId", value ? Number(value) : undefined)
                }
                placeholder="Chọn 1 biện pháp"
              />
            </div>
            <div className="space-y-2">
              <Label>Biện pháp hỗ trợ</Label>
              <MultiSelect
                options={mockTreatmentMethods.map((method) => ({
                  label: method.name,
                  value: String(method.id),
                  keywords: [method.description, method.type],
                }))}
                value={(formData.supportingMethodIds || []).map(String)}
                onChange={(value) =>
                  updateForm(
                    "supportingMethodIds",
                    value
                      .map(Number)
                      .filter((item) => item !== formData.primaryMethodId),
                  )
                }
                placeholder="Chọn nhiều biện pháp hỗ trợ"
              />
            </div>
          </div>

          <TagInput
            label="Mục tiêu phác đồ"
            values={formData.goalTags || []}
            onChange={(value) => updateForm("goalTags", value)}
            placeholder="Nhập hashtag rồi nhấn Enter"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Khảo sát hiện trạng</Label>
              <Textarea
                rows={4}
                value={formData.currentSurvey || ""}
                onChange={(event) => updateForm("currentSurvey", event.target.value)}
                placeholder="Tổng hợp khảo sát đầu kỳ..."
              />
            </div>
            <div className="space-y-2">
              <Label>Lưu ý quan trọng</Label>
              <Textarea
                rows={4}
                value={formData.importantNotes || ""}
                onChange={(event) => updateForm("importantNotes", event.target.value)}
                placeholder="Các lưu ý để đội triển khai tránh sai lệch..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kết quả mong đợi</Label>
            <Textarea
              rows={4}
              value={formData.expectedOutcomeSummary || ""}
              onChange={(event) =>
                updateForm("expectedOutcomeSummary", event.target.value)
              }
              placeholder="Kết quả mong đợi sau khi áp dụng phác đồ"
            />
          </div>
        </WizardCard>
      ),
    },
    {
      id: "materials",
      title: "Theo ngày",
      description: "Giai đoạn, vật tư, media",
      content: (
        <WizardCard
          title="Phác đồ theo từng giai đoạn ngày"
          description="Khai báo các block ngày như Ngày 1 - 2, Ngày 3 - 5; mỗi giai đoạn có vật tư, hướng dẫn, lưu ý và target riêng."
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Lịch trình theo ngày</Label>
                <p className="mt-1 text-sm text-slate-500">
                  Mỗi giai đoạn là một phần riêng của phác đồ.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addProcedure}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm giai đoạn
              </Button>
            </div>

            {procedures.length > 0 ? (
              <div className="space-y-4">
                {procedures.map((procedure, index) => {
                  const stageMaterials = procedure.stageMaterials || [];
                  const hasTiming =
                    procedure.startDay !== undefined && procedure.endDay !== undefined;
                  const stageLabel = procedure.name || `Giai đoạn ${index + 1}`;
                  const scheduleLabel = hasTiming
                    ? `Ngày ${procedure.startDay} -> ${procedure.endDay}`
                    : "Chưa cập nhật";

                  return (
                    <div
                      key={procedure.id}
                      className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-[linear-gradient(135deg,#eff6ff_0%,#f8fafc_100%)] px-5 py-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                            Giai đoạn {index + 1}
                          </p>
                          <p className="mt-1 text-base font-semibold text-slate-900">
                            {stageLabel}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">{scheduleLabel}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            updateForm(
                              "procedures",
                              procedures
                                .filter((item) => item.id !== procedure.id)
                                .map((item, itemIndex) => ({
                                  ...item,
                                  stepNumber: itemIndex + 1,
                                })),
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-5 p-5">
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                          <StageMetric
                            label="Khung ngày"
                            value={scheduleLabel}
                            tone="border-sky-100 bg-sky-50 text-sky-900"
                          />
                          <StageMetric
                            label="Giai đoạn"
                            value={stageLabel}
                            tone="border-emerald-100 bg-emerald-50 text-emerald-900"
                          />
                          <StageMetric
                            label="Target đạt được"
                            value={procedure.expectedOutcome || "Chưa cập nhật"}
                            tone="border-amber-100 bg-amber-50 text-amber-900"
                          />
                          <StageMetric
                            label="Số vật tư"
                            value={`${stageMaterials.length} mục`}
                            tone="border-violet-100 bg-violet-50 text-violet-900"
                          />
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-slate-900">
                              Thông tin chính
                            </p>
                            <p className="text-sm text-slate-500">
                              Chỉ giữ lại các trường cốt lõi để khai báo nhanh cho từng giai đoạn.
                            </p>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div className="space-y-2 xl:col-span-2">
                              <Label>Tên giai đoạn</Label>
                              <Input
                                value={procedure.name}
                                placeholder="VD: Xử lý nền đất ban đầu"
                                onChange={(event) =>
                                  updateProcedureField(
                                    procedure.id,
                                    "name",
                                    event.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Ngày bắt đầu</Label>
                              <Input
                                type="number"
                                value={procedure.startDay ?? ""}
                                placeholder="1"
                                onChange={(event) =>
                                  updateProcedureField(
                                    procedure.id,
                                    "startDay",
                                    event.target.value
                                      ? Number(event.target.value)
                                      : undefined,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Ngày kết thúc</Label>
                              <Input
                                type="number"
                                value={procedure.endDay ?? ""}
                                placeholder="3"
                                onChange={(event) =>
                                  updateProcedureField(
                                    procedure.id,
                                    "endDay",
                                    event.target.value
                                      ? Number(event.target.value)
                                      : undefined,
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Cách ghi khung ngày</Label>
                              <Input
                                value={procedure.timing}
                                placeholder="VD: Ngày 1 -> 3"
                                onChange={(event) =>
                                  updateProcedureField(
                                    procedure.id,
                                    "timing",
                                    event.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Target của giai đoạn</Label>
                              <Textarea
                                rows={3}
                                value={procedure.expectedOutcome || ""}
                                placeholder="Kết quả cần đạt sau khi hoàn tất giai đoạn này"
                                onChange={(event) =>
                                  updateProcedureField(
                                    procedure.id,
                                    "expectedOutcome",
                                    event.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <Label>Hướng dẫn thực hiện</Label>
                            <Textarea
                              rows={3}
                              value={procedure.detailedInstructions || ""}
                              placeholder="Các bước triển khai chính trong giai đoạn này"
                              onChange={(event) =>
                                updateProcedureField(
                                  procedure.id,
                                  "detailedInstructions",
                                  event.target.value,
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="mb-3">
                              <p className="text-sm font-semibold text-slate-900">
                                Lưu ý triển khai
                              </p>
                              <p className="text-sm text-slate-500">
                                Mỗi dòng là một cảnh báo hoặc lưu ý riêng.
                              </p>
                            </div>
                            <Textarea
                              rows={4}
                              value={(procedure.warnings || []).join("\n")}
                              placeholder="Ví dụ: Tránh tưới quá mạnh trong 24h đầu"
                              onChange={(event) =>
                                updateProcedureField(
                                  procedure.id,
                                  "warnings",
                                  event.target.value
                                    .split("\n")
                                    .map((item) => item.trim())
                                    .filter(Boolean),
                                )
                              }
                            />
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="mb-3">
                              <p className="text-sm font-semibold text-slate-900">
                                Checklist kiểm tra
                              </p>
                              <p className="text-sm text-slate-500">
                                Dùng để nghiệm thu nhanh sau từng giai đoạn.
                              </p>
                            </div>
                            <Textarea
                              rows={4}
                              value={(procedure.qualityCheckpoints || []).join("\n")}
                              placeholder="Ví dụ: Độ ẩm ổn định, đất tơi đều, không còn mùi chua"
                              onChange={(event) =>
                                updateProcedureField(
                                  procedure.id,
                                  "qualityCheckpoints",
                                  event.target.value
                                    .split("\n")
                                    .map((item) => item.trim())
                                    .filter(Boolean),
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                Vật tư của giai đoạn này
                              </p>
                              <p className="text-sm text-slate-500">
                                Mỗi giai đoạn có vật tư và định lượng riêng.
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                updateProcedure(procedure.id, (current) => ({
                                  ...current,
                                  stageMaterials: [
                                    ...(current.stageMaterials || []),
                                    createMaterialRow(),
                                  ],
                                }))
                              }
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Thêm vật tư
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {stageMaterials.length > 0 ? (
                              stageMaterials.map((item, materialIndex) => (
                                <div
                                  key={item.id}
                                  className="rounded-2xl border border-white bg-white p-4"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="text-sm font-medium text-slate-900">
                                        Vật tư {materialIndex + 1}
                                      </p>
                                      <p className="text-sm text-slate-500">
                                        Khai báo loại vật tư và định lượng cho riêng giai đoạn này.
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      onClick={() =>
                                        updateProcedure(procedure.id, (current) => ({
                                          ...current,
                                          stageMaterials: (current.stageMaterials || []).filter(
                                            (material) => material.id !== item.id,
                                          ),
                                        }))
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                    <div className="space-y-2">
                                      <Label>Nhóm vật tư</Label>
                                      <Select
                                        value={item.category}
                                        onValueChange={(value) =>
                                          updateStageMaterial(
                                            procedure.id,
                                            item.id,
                                            "category",
                                            value,
                                          )
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {treatmentMaterialCategoryOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                              {option.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Tên vật tư</Label>
                                      <Input
                                        value={item.name}
                                        placeholder="VD: Vôi dolomite, chế phẩm vi sinh..."
                                        onChange={(event) =>
                                          updateStageMaterial(
                                            procedure.id,
                                            item.id,
                                            "name",
                                            event.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                      <Label>Liều lượng từ</Label>
                                      <Input
                                        value={item.dosageMin}
                                        placeholder="Từ"
                                        onChange={(event) =>
                                          updateStageMaterial(
                                            procedure.id,
                                            item.id,
                                            "dosageMin",
                                            event.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Liều lượng đến</Label>
                                      <Input
                                        value={item.dosageMax}
                                        placeholder="Đến"
                                        onChange={(event) =>
                                          updateStageMaterial(
                                            procedure.id,
                                            item.id,
                                            "dosageMax",
                                            event.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Đơn vị</Label>
                                      <Input
                                        value={item.unit}
                                        placeholder="kg/ha"
                                        onChange={(event) =>
                                          updateStageMaterial(
                                            procedure.id,
                                            item.id,
                                            "unit",
                                            event.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
                                Chưa có vật tư cho giai đoạn này.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Chưa có giai đoạn nào. Hãy thêm block ngày đầu tiên cho phác đồ.
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Thông số kiểm tra</Label>
              <MultiSelect
                options={inspectionParameterOptions.map((item) => ({ ...item }))}
                value={formData.inspectionParameters || []}
                onChange={(value) => updateForm("inspectionParameters", value)}
                placeholder="Chọn thông số"
              />
            </div>
            <TagInput
              label="Hạng mục kiểm tra chất lượng"
              values={(formData.qualityChecklist || []).map((item) =>
                item.startsWith("#") ? item : `#${item.replace(/\s+/g, "-")}`,
              )}
              onChange={(value) =>
                updateForm(
                  "qualityChecklist",
                  value.map((item) => item.replace(/^#/, "").replace(/-/g, " ")),
                )
              }
              placeholder="Nhập hạng mục rồi nhấn Enter"
            />
          </div>

          <div className="space-y-3">
            <Label>Tệp hướng dẫn</Label>
            <div className="grid gap-3 md:grid-cols-3">
              <button
                type="button"
                className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-left"
                onClick={() => pdfInputRef.current?.click()}
              >
                <FileText className="h-5 w-5 text-red-500" />
                <p className="mt-2 font-medium">PDF hướng dẫn</p>
              </button>
              <button
                type="button"
                className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-left"
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon className="h-5 w-5 text-sky-500" />
                <p className="mt-2 font-medium">Ảnh minh họa</p>
              </button>
              <button
                type="button"
                className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-left"
                onClick={() => videoInputRef.current?.click()}
              >
                <Video className="h-5 w-5 text-violet-500" />
                <p className="mt-2 font-medium">Video hướng dẫn</p>
              </button>
            </div>

            <input
              ref={pdfInputRef}
              type="file"
              className="hidden"
              multiple
              accept=".pdf,application/pdf"
              onChange={handleUploadFiles("pdf")}
            />
            <input
              ref={imageInputRef}
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleUploadFiles("image")}
            />
            <input
              ref={videoInputRef}
              type="file"
              className="hidden"
              multiple
              accept="video/*"
              onChange={handleUploadFiles("video")}
            />

            <div className="space-y-2">
              {attachments.length > 0 ? (
                attachments.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      {item.fileType === "pdf" ? (
                        <FileText className="h-4 w-4 text-red-500" />
                      ) : item.fileType === "image" ? (
                        <ImageIcon className="h-4 w-4 text-sky-500" />
                      ) : (
                        <Video className="h-4 w-4 text-violet-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.size}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        updateForm(
                          "attachments",
                          attachments.filter((attachment) => attachment.id !== item.id),
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  Chưa có file hướng dẫn nào.
                </div>
              )}
            </div>
          </div>
        </WizardCard>
      ),
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Tổng hợp step 1 -> 4",
      content: (
        <WizardCard
          title="Xác nhận thông tin phác đồ"
          description="Rà soát nhanh toàn bộ dữ liệu đã nhập trước khi hoàn tất tạo hoặc cập nhật phác đồ."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StageMetric
              label="Mã phác đồ"
              value={formData.code || "Chưa cập nhật"}
              tone="border-sky-100 bg-sky-50 text-sky-900"
            />
            <StageMetric
              label="Đơn vị phụ trách"
              value={responsibleUnitLabel || "Chưa cập nhật"}
              tone="border-emerald-100 bg-emerald-50 text-emerald-900"
            />
            <StageMetric
              label="Biện pháp chính"
              value={primaryMethod?.name || "Chưa cập nhật"}
              tone="border-amber-100 bg-amber-50 text-amber-900"
            />
            <StageMetric
              label="Số giai đoạn"
              value={`${procedures.length} giai đoạn`}
              tone="border-violet-100 bg-violet-50 text-violet-900"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-900">Step 1. Thông tin nền</p>
                <p className="text-sm text-slate-500">
                  Tóm tắt bài toán đất, mốc thời gian và phạm vi áp dụng.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <SummaryField label="Tên phác đồ" value={formData.name || "Chưa cập nhật"} />
                <SummaryField label="Khu vực áp dụng" value={formData.zone || "Chưa cập nhật"} />
                <SummaryField
                  label="Mức độ mục tiêu"
                  value={targetSeverityLabel || "Chưa cập nhật"}
                />
                <SummaryField label="Thời gian áp dụng" value={timeWindowSummary} />
                <SummaryField
                  label="Ngân sách"
                  value={budgetRangeLabel || "Chưa cập nhật"}
                />
                <div className="md:col-span-2">
                  <SummaryField
                    label="Hiện trạng đất"
                    value={formData.soilIssue || "Chưa cập nhật"}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-900">Step 2. Phạm vi</p>
                <p className="text-sm text-slate-500">
                  Kiểm tra đơn vị phụ trách, nhóm cây trồng và tác giả liên quan.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <SummaryField
                  label="Ưu tiên xử lý"
                  value={priorityLabel || "Chưa cập nhật"}
                />
                <SummaryField
                  label="Nhóm cây trồng"
                  value={joinOrFallback(selectedGroupCropLabels)}
                />
                <SummaryField
                  label="Cây trồng áp dụng"
                  value={joinOrFallback(selectedCropLabels)}
                />
                <SummaryField
                  label="Đối tượng áp dụng"
                  value={joinOrFallback(applicableObjectLabels)}
                />
                <SummaryField
                  label="Địa hình"
                  value={joinOrFallback(terrainLabels)}
                />
                <div className="md:col-span-2">
                  <SummaryField
                    label="Tác giả"
                    value={joinOrFallback(
                      authors.map((author) =>
                        [author.name, author.qualification, author.organization]
                          .filter(Boolean)
                          .join(" - "),
                      ),
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-900">Step 3. Biện pháp</p>
                <p className="text-sm text-slate-500">
                  Đối chiếu biện pháp chính, hỗ trợ và mục tiêu đầu ra.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <SummaryField
                  label="Biện pháp chính"
                  value={primaryMethod?.name || "Chưa cập nhật"}
                />
                <SummaryField
                  label="Biện pháp hỗ trợ"
                  value={joinOrFallback(supportingMethods.map((method) => method.name))}
                />
                <SummaryField
                  label="Mục tiêu phác đồ"
                  value={joinOrFallback(formData.goalTags || [])}
                />
                <div className="md:col-span-2">
                  <SummaryField
                    label="Kết quả mong đợi"
                    value={formData.expectedOutcomeSummary || "Chưa cập nhật"}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-900">Step 4. Theo ngày</p>
                <p className="text-sm text-slate-500">
                  Tóm tắt số giai đoạn, vật tư và tài liệu đính kèm.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <SummaryField
                  label="Số giai đoạn"
                  value={`${procedures.length} giai đoạn`}
                />
                <SummaryField
                  label="Tài liệu đính kèm"
                  value={`${attachments.length} tệp`}
                />
                <div className="md:col-span-2">
                  <SummaryField
                    label="Lịch trình"
                    value={
                      procedures.length > 0 ? (
                        <div className="space-y-2">
                          {procedures.map((procedure, index) => (
                            <div
                              key={procedure.id}
                              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                            >
                              <p className="font-medium text-slate-800">
                                Giai đoạn {index + 1}:{" "}
                                {procedure.name || "Chưa đặt tên"}
                              </p>
                              <p className="text-xs text-slate-500">
                                {procedure.startDay !== undefined &&
                                procedure.endDay !== undefined
                                  ? `Ngày ${procedure.startDay} -> ${procedure.endDay}`
                                  : "Chưa khai báo khung ngày"}
                                {` • ${procedure.stageMaterials?.length || 0} vật tư`}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        "Chưa cập nhật"
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </WizardCard>
      ),
    },
  ];

  const content = (
    <div className="pt-2">
      <StepperForm
        steps={steps}
        onCancel={onCancel || (() => onOpenChange(false))}
        onComplete={onSubmit}
        completeLabel={selectedItem ? "Cập nhật phác đồ" : "Tạo phác đồ"}
      />
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedItem ? "Chỉnh sửa phác đồ" : "Tạo phác đồ mới"}
          </DialogTitle>
        <DialogDescription>
          Luồng nhập liệu theo từng bước để hoàn thiện master data cải tạo đất.
        </DialogDescription>
      </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
