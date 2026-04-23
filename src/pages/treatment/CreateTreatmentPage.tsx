import {
  AdminLayout,
  AutoCompleteSelect,
  Button,
  Card,
  CardContent,
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
  Editor,
  Badge,
  type Step,
  type SerializedEditorState,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  MATERIAL_OPTIONS,
  MATERIAL_TYPES,
  MATERIAL_UNITS,
} from "../plan/data/mocks";
import {
  ArrowLeft,
  FileText,
  Plus,
  Trash2,
  Video,
  FileUp,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { useParams } from "wouter";
import {
  budgetRangeOptions,
  crops,
  cropTypes,
  diseases,
  responsibleUnitOptions,
  severityConfig,
  treatmentIntensityOptions,
  treatmentMethodOptions,
  treatmentPriorityOptions,
  varieties,
  treatmentMaterialCategoryOptions,
  inspectionParameterOptions,
} from "./data/treatment.data";
import { useCreateTreatmentPage } from "./hooks/useCreateTreatmentPage";
import { initialEditorValue } from "@/pages/docs/mocks";
import {
  WizardCard,
  StageMetric,
  SummaryField,
  TagInput,
} from "./components/TreatmentWizardLayouts";
import { EnterpriseSelector } from "@/pages/cultivation-zone/cultivation-region/components/EnterpriseSelector";
import type { TreatmentAttachment } from "./types/treatment.types";

export default function CreateTreatmentPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const {
    formData,
    updateForm,
    handleComplete,
    addAuthor,
    removeAuthor,
    updateAuthor,
    addProcedure,
    removeProcedure,
    updateProcedureField,
    updateProcedure,
    addMaterialToProcedure,
    removeMaterialFromProcedure,
    updateStageMaterial,
    handleUploadFiles,
    pdfInputRef,
    imageInputRef,
    videoInputRef,
    addCropConfig,
    removeCropConfig,
    updateCropConfig,
    setUploadingProcedureId,
    goBack,
  } = useCreateTreatmentPage(id);
  const [materialDrafts, setMaterialDrafts] = useState<Record<string, any>>({});

  const getOptionLabel = (
    options: ReadonlyArray<{ label: string; value: string }>,
    value?: string,
  ) => options.find((item) => item.value === value)?.label || "Chưa cập nhật";

  const joinOrFallback = (items: (string | undefined)[]) =>
    items.filter(Boolean).join(", ") || "Chưa cập nhật";

  const responsibleUnitLabel = getOptionLabel(
    responsibleUnitOptions,
    formData.responsibleUnit,
  );
  const targetSeverityLabel =
    severityConfig[formData.targetSeverity as keyof typeof severityConfig]
      ?.label || "Chưa cập nhật";
  const priorityLabel = getOptionLabel(
    treatmentPriorityOptions,
    formData.priority,
  );
  const budgetRangeLabel = getOptionLabel(
    budgetRangeOptions,
    formData.budgetRange,
  );
  const primaryMethodName =
    treatmentMethodOptions.find((opt) => opt.value === formData.primaryMethodId)
      ?.label || "Chưa cập nhật";
  const supportingMethodNames = formData.supportingMethodIds
    .map((id) => treatmentMethodOptions.find((opt) => opt.value === id)?.label)
    .filter(Boolean);

  const timeWindowSummary =
    formData.startDate || formData.duration
      ? `${formData.startDate || "..."} (${formData.duration || "..."})`
      : "Chưa cập nhật";

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const newAttachments: TreatmentAttachment[] = files.map((file, index) => {
        let fileType: "pdf" | "image" | "video" = "image";
        if (file.type.includes("pdf")) {
          fileType = "pdf";
        } else if (file.type.includes("video")) {
          fileType = "video";
        }
        return {
          id: Date.now() + index,
          name: file.name,
          size: (file.size / 1024).toFixed(1) + " KB",
          fileType,
          url: URL.createObjectURL(file),
        };
      });
      updateForm("attachments", [...formData.attachments, ...newAttachments]);
    }
  };

  const steps: Step[] = useMemo(
    () => [
      {
        id: "general",
        title: "Thông tin nền",
        description: "Thông tin chung",
        isValid: !!formData.code && !!formData.name && !!formData.diseaseType,
        content: (
          <WizardCard
            title="Khởi tạo hồ sơ phác đồ"
            description="Khai báo thông tin chung để định danh phác đồ và mô tả hiện trạng dịch hại."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Mã phác đồ</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => updateForm("code", e.target.value)}
                  placeholder="VD: PT-2026-001"
                />
              </div>
              <div className="space-y-2">
                <Label>Tên phác đồ</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="VD: Phác đồ trị bệnh thán thư sầu riêng"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* <div className="space-y-2">
              <Label>Khu vực áp dụng mẫu</Label>
              <Input
                value={formData.zone}
                onChange={(e) => updateForm("zone", e.target.value)}
                placeholder="VD: Đồng Nai - Vùng A"
              />
            </div> */}
              {/* <div className="space-y-2">
                <Label>Cường độ can thiệp</Label>
                <Select
                  value={formData.intensity}
                  onValueChange={(val: any) => updateForm("intensity", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {treatmentIntensityOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Dịch hại / Vấn đề chính</Label>
                <AutoCompleteSelect
                  options={diseases.map((d) => ({ label: d, value: d }))}
                  value={formData.diseaseType || ""}
                  onChange={(val) => updateForm("diseaseType", val)}
                  placeholder="Chọn hoặc nhập tên bệnh"
                />
              </div>
              <div className="space-y-2">
                <Label>Giai đoạn áp dụng</Label>
                <Select
                  value={formData.targetSeverity}
                  onValueChange={(val: any) =>
                    updateForm("targetSeverity", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(severityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mô tả hiện trạng dịch hại</Label>
              <Editor
                contentEditableClassname="min-h-[300px] max-h-[300px] h-auto overflow-y-auto"
                initialText={
                  typeof formData.soilIssue === "string"
                    ? formData.soilIssue
                    : ""
                }
                editorSerializedState={
                  formData.soilIssue &&
                  typeof formData.soilIssue === "object" &&
                  "root" in formData.soilIssue
                    ? (formData.soilIssue as unknown as SerializedEditorState)
                    : undefined
                }
                onSerializedChange={(value) => updateForm("soilIssue", value)}
              />
            </div>

            <div
              className={`space-y-3 rounded-2xl border-2 transition-all ${
                isDragging
                  ? "border-sky-500 bg-sky-50/50 p-4 ring-4 ring-sky-500/10"
                  : "border-transparent"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex items-center justify-between">
                <Label>Ảnh & Tài liệu minh họa hiện trạng</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-xl border-dashed"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Thêm ảnh
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-xl border-dashed"
                    onClick={() => pdfInputRef.current?.click()}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Thêm PDF
                  </Button>
                </div>
              </div>

              {formData.attachments.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {formData.attachments.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {item.fileType === "image" ? (
                          <ImageIcon className="h-4 w-4 text-sky-500 shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 text-red-500 shrink-0" />
                        )}
                        <span className="text-xs font-medium truncate">
                          {item.name}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-400 hover:text-red-500"
                        onClick={() =>
                          updateForm(
                            "attachments",
                            formData.attachments.filter(
                              (a) => a.id !== item.id,
                            ),
                          )
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center">
                  <div className="rounded-full bg-white p-3 shadow-sm">
                    <FileUp className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-500">
                    Chưa có tệp minh họa
                  </p>
                  <p className="text-xs text-slate-400">
                    Tải lên ảnh hoặc PDF để minh họa hiện trạng dịch hại
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Thời lượng (Dự kiến)</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) => updateForm("duration", e.target.value)}
                  placeholder="VD: 14 ngày"
                />
              </div>
              {/* <div className="space-y-2">
                <Label>Ngày bắt đầu</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateForm("startDate", e.target.value)}
                />
              </div> */}
              <div className="space-y-2">
                <Label>Ngân sách ước tính</Label>
                <Select
                  value={formData.budgetRange}
                  onValueChange={(val) => updateForm("budgetRange", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khoảng giá" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRangeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
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
        description: "Đơn vị & Đối tượng áp dụng",
        isValid:
          !!formData.responsibleUnit &&
          formData.applicableCropConfigs.length > 0 &&
          formData.applicableCropConfigs.every((c) => !!c.groupName),
        content: (
          <WizardCard
            title="Xác định phạm vi áp dụng"
            description="Thiết lập các nhóm cây trồng phù hợp và đơn vị chịu trách nhiệm thực thi."
          >
            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Label>Đơn vị phụ trách chính</Label>
                <EnterpriseSelector
                  selectedId={formData.responsibleUnit}
                  onSelect={(val) => updateForm("responsibleUnit", val)}
                />
              </div>
              {/* <div className="space-y-2">
                <Label>Mức độ ưu tiên xử lý</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(val: any) => updateForm("priority", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {treatmentPriorityOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  Danh sách cấu hình cây trồng áp dụng
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCropConfig}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm cấu hình
                </Button>
              </div>

              {formData.applicableCropConfigs.length > 0 ? (
                <div className="space-y-4">
                  {formData.applicableCropConfigs.map((config, index) => (
                    <div
                      key={config.id}
                      className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow"
                    >
                      <div className="flex-1 space-y-2">
                        <Label>Nhóm cây trồng</Label>
                        <Select
                          value={config.groupName}
                          onValueChange={(val) => {
                            updateCropConfig(config.id, {
                              groupName: val,
                              specificCrops: [],
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn nhóm cây" />
                          </SelectTrigger>
                          <SelectContent>
                            {cropTypes.map((t) => (
                              <SelectItem key={t.id} value={t.name}>
                                {t.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 flex-1">
                        <Label>
                          Cây trồng cụ thể (Để trống để áp dụng tất cả)
                        </Label>
                        <MultiSelect
                          disabled={!config.groupName}
                          options={(
                            crops[config.groupName as keyof typeof crops] || []
                          ).map((c) => ({ label: c, value: c }))}
                          value={config.specificCrops}
                          onChange={(val) =>
                            updateCropConfig(config.id, { specificCrops: val })
                          }
                          placeholder={
                            config.groupName
                              ? "Chọn cây trồng"
                              : "Chọn nhóm cây trước"
                          }
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeCropConfig(config.id)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500">
                  Chưa có cấu hình cây trồng. Hãy nhấn "Thêm cấu hình" để bắt
                  đầu.
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Tác giả & Chuyên gia</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAuthor}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm tác giả
                </Button>
              </div>
              <div className="space-y-3">
                {formData.authors.map((author, index) => (
                  <div
                    key={author.id}
                    className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_1fr_1.2fr_auto]"
                  >
                    <Input
                      value={author.name}
                      placeholder={`Tác giả ${index + 1}`}
                      onChange={(e) =>
                        updateAuthor(author.id, "name", e.target.value)
                      }
                    />
                    <Input
                      value={author.qualification}
                      placeholder="Chức danh/Học vị"
                      onChange={(e) =>
                        updateAuthor(author.id, "qualification", e.target.value)
                      }
                    />
                    <Input
                      value={author.organization}
                      placeholder="Đơn vị công tác"
                      onChange={(e) =>
                        updateAuthor(author.id, "organization", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeAuthor(author.id)}
                      disabled={formData.authors.length === 1}
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
        description: "Chiến lược kỹ thuật",
        isValid: !!formData.primaryMethodId,
        content: (
          <WizardCard
            title="Chiến lược và Mục tiêu"
            description="Xác định biện pháp kỹ thuật cốt lõi và các mục tiêu định tính của phác đồ."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Biện pháp chính</Label>
                <Select
                  value={formData.primaryMethodId}
                  onValueChange={(val) => updateForm("primaryMethodId", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phương pháp" />
                  </SelectTrigger>
                  <SelectContent>
                    {treatmentMethodOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Biện pháp hỗ trợ</Label>
                <MultiSelect
                  options={treatmentMethodOptions.map((o) => ({ ...o }))}
                  value={formData.supportingMethodIds}
                  onChange={(vals) => updateForm("supportingMethodIds", vals)}
                  placeholder="Chọn thêm biện pháp"
                />
              </div>
            </div>

            <TagInput
              label="Mục tiêu đầu ra (Hashtags)"
              values={formData.goalTags}
              onChange={(val) => updateForm("goalTags", val)}
              placeholder="VD: #diet-nam, #kich-re"
            />

            <div className="space-y-2">
              <Label>Lưu ý quan trọng khi triển khai</Label>
              <Editor
                contentEditableClassname="min-h-[150px] max-h-[300px] h-auto overflow-y-auto"
                initialText={
                  typeof formData.importantNotes === "string"
                    ? formData.importantNotes
                    : ""
                }
                editorSerializedState={
                  formData.importantNotes &&
                  typeof formData.importantNotes === "object" &&
                  "root" in formData.importantNotes
                    ? (formData.importantNotes as unknown as SerializedEditorState)
                    : undefined
                }
                onSerializedChange={(value) =>
                  updateForm("importantNotes", value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Kết quả mong đợi sau phác đồ</Label>
              <Editor
                contentEditableClassname="min-h-[150px] max-h-[300px] h-auto overflow-y-auto"
                initialText={
                  typeof formData.expectedOutcomeSummary === "string"
                    ? formData.expectedOutcomeSummary
                    : ""
                }
                editorSerializedState={
                  formData.expectedOutcomeSummary &&
                  typeof formData.expectedOutcomeSummary === "object" &&
                  "root" in formData.expectedOutcomeSummary
                    ? (formData.expectedOutcomeSummary as unknown as SerializedEditorState)
                    : undefined
                }
                onSerializedChange={(value) =>
                  updateForm("expectedOutcomeSummary", value)
                }
              />
            </div>
          </WizardCard>
        ),
      },
      {
        id: "procedures",
        title: "Theo ngày",
        description: "Giai đoạn, vật tư, media",
        isValid: true,
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
                <Button type="button" variant="outline" onClick={addProcedure}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm giai đoạn
                </Button>
              </div>

              {formData.procedures.length > 0 ? (
                <div className="space-y-4">
                  {formData.procedures.map((procedure, index) => {
                    const stageMaterials = procedure.stageMaterials || [];
                    const hasTiming =
                      procedure.startDay !== undefined &&
                      procedure.endDay !== undefined;
                    const stageLabel =
                      procedure.name || `Giai đoạn ${index + 1}`;
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
                            <p className="mt-1 text-sm text-slate-500">
                              {scheduleLabel}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeProcedure(procedure.id)}
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
                              value={
                                typeof procedure.expectedOutcome === "string"
                                  ? procedure.expectedOutcome || "Chưa cập nhật"
                                  : "Đã có nội dung"
                              }
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
                                Chỉ giữ lại các trường cốt lõi để khai báo nhanh
                                cho từng giai đoạn.
                              </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                              <div className="space-y-2 xl:col-span-2">
                                <Label>Tên giai đoạn</Label>
                                <Input
                                  value={procedure.name}
                                  placeholder="VD: Xử lý mầm bệnh ban đầu"
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

                            <div className="mt-4 grid gap-4 md:grid-cols-1">
                              {/* <div className="space-y-2">
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
                              </div> */}
                              <div className="space-y-2">
                                <Label>Mục tiêu của giai đoạn</Label>
                                <Editor
                                  contentEditableClassname="min-h-[100px] max-h-[200px] h-auto overflow-y-auto"
                                  initialText={
                                    typeof procedure.expectedOutcome ===
                                    "string"
                                      ? procedure.expectedOutcome
                                      : ""
                                  }
                                  editorSerializedState={
                                    procedure.expectedOutcome &&
                                    typeof procedure.expectedOutcome ===
                                      "object" &&
                                    "root" in procedure.expectedOutcome
                                      ? (procedure.expectedOutcome as unknown as SerializedEditorState)
                                      : undefined
                                  }
                                  onSerializedChange={(value) =>
                                    updateProcedureField(
                                      procedure.id,
                                      "expectedOutcome",
                                      value,
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div className="mt-4 space-y-2">
                              <Label>Hướng dẫn thực hiện</Label>
                              <Editor
                                contentEditableClassname="min-h-[100px] max-h-[200px] h-auto overflow-y-auto"
                                initialText={
                                  typeof procedure.detailedInstructions ===
                                  "string"
                                    ? procedure.detailedInstructions
                                    : ""
                                }
                                editorSerializedState={
                                  procedure.detailedInstructions &&
                                  typeof procedure.detailedInstructions ===
                                    "object" &&
                                  "root" in procedure.detailedInstructions
                                    ? (procedure.detailedInstructions as unknown as SerializedEditorState)
                                    : undefined
                                }
                                onSerializedChange={(value) =>
                                  updateProcedureField(
                                    procedure.id,
                                    "detailedInstructions",
                                    value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="grid gap-4 lg:grid-cols-1">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                              <div className="mb-3">
                                <p className="text-sm font-semibold text-slate-900">
                                  Lưu ý triển khai
                                </p>
                                <p className="text-sm text-slate-500">
                                  Mỗi dòng là một cảnh báo hoặc lưu ý riêng.
                                </p>
                              </div>
                              <Editor
                                contentEditableClassname="min-h-[150px] max-h-[300px] h-auto overflow-y-auto"
                                initialText={
                                  typeof procedure.warnings === "string"
                                    ? procedure.warnings
                                    : ""
                                }
                                editorSerializedState={
                                  procedure.warnings &&
                                  typeof procedure.warnings === "object" &&
                                  "root" in procedure.warnings
                                    ? (procedure.warnings as unknown as SerializedEditorState)
                                    : undefined
                                }
                                onSerializedChange={(value) =>
                                  updateProcedureField(
                                    procedure.id,
                                    "warnings",
                                    value,
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
                              <Editor
                                contentEditableClassname="min-h-[150px] max-h-[300px] h-auto overflow-y-auto"
                                initialText={
                                  typeof procedure.qualityCheckpoints ===
                                  "string"
                                    ? procedure.qualityCheckpoints
                                    : ""
                                }
                                editorSerializedState={
                                  procedure.qualityCheckpoints &&
                                  typeof procedure.qualityCheckpoints ===
                                    "object" &&
                                  "root" in procedure.qualityCheckpoints
                                    ? (procedure.qualityCheckpoints as unknown as SerializedEditorState)
                                    : undefined
                                }
                                onSerializedChange={(value) =>
                                  updateProcedureField(
                                    procedure.id,
                                    "qualityCheckpoints",
                                    value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-sm font-semibold">
                              Tệp đính kèm cho giai đoạn này
                            </Label>
                            <div className="grid gap-3 md:grid-cols-3">
                              <button
                                type="button"
                                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-3 text-center transition-colors hover:bg-slate-50"
                                onClick={() => {
                                  setUploadingProcedureId(procedure.id);
                                  pdfInputRef.current?.click();
                                }}
                              >
                                <FileText className="h-5 w-5 text-red-500" />
                                <p className="mt-1 text-xs font-medium">PDF</p>
                              </button>
                              <button
                                type="button"
                                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-3 text-center transition-colors hover:bg-slate-50"
                                onClick={() => {
                                  setUploadingProcedureId(procedure.id);
                                  imageInputRef.current?.click();
                                }}
                              >
                                <ImageIcon className="h-5 w-5 text-sky-500" />
                                <p className="mt-1 text-xs font-medium">
                                  Ảnh minh họa
                                </p>
                              </button>
                              <button
                                type="button"
                                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-3 text-center transition-colors hover:bg-slate-50"
                                onClick={() => {
                                  setUploadingProcedureId(procedure.id);
                                  videoInputRef.current?.click();
                                }}
                              >
                                <Video className="h-5 w-5 text-violet-500" />
                                <p className="mt-1 text-xs font-medium">
                                  Video
                                </p>
                              </button>
                            </div>

                            {procedure.attachments &&
                              procedure.attachments.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                  {procedure.attachments.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2"
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
                                          <p className="text-xs font-medium text-slate-900">
                                            {item.name}
                                          </p>
                                          <p className="text-[10px] text-slate-500">
                                            {item.size}
                                          </p>
                                        </div>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() =>
                                          updateProcedureField(
                                            procedure.id,
                                            "attachments",
                                            procedure.attachments.filter(
                                              (a) => a.id !== item.id,
                                            ),
                                          )
                                        }
                                      >
                                        <Trash2 className="h-4 w-4 text-slate-400" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm font-semibold text-slate-900">
                                Định mức vật tư & thiết bị
                              </span>
                              <Badge
                                variant="outline"
                                className="bg-white text-xs font-normal"
                              >
                                {stageMaterials.length} vật tư
                              </Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                              {stageMaterials.length > 0 ? (
                                stageMaterials.map((a) => (
                                  <div
                                    key={a.id}
                                    className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200/60 text-sm group hover:bg-slate-100 transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className="bg-slate-50 text-[10px] h-5 font-normal border-slate-200"
                                      >
                                        {treatmentMaterialCategoryOptions.find(
                                          (o) => o.value === a.category,
                                        )?.label || a.category}
                                      </Badge>
                                      <span className="font-medium text-slate-700">
                                        {a.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="font-semibold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-xs">
                                        {a.dosageMin}
                                        {a.dosageMax
                                          ? ` - ${a.dosageMax}`
                                          : ""}{" "}
                                        {a.unit}
                                      </span>
                                      <button
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                        onClick={() =>
                                          removeMaterialFromProcedure(
                                            procedure.id,
                                            a.id,
                                          )
                                        }
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-6 border border-dashed rounded-xl bg-white/50">
                                  <p className="text-xs text-slate-500">
                                    Chưa có vật tư phân bổ
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Quick Add Material Form */}
                            <div className="border-t border-slate-200 pt-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  Thêm nhanh vật tư
                                </span>
                              </div>

                              <div className="space-y-2">
                                <div className="grid grid-cols-12 gap-2">
                                  <div className="col-span-4">
                                    <Select
                                      value={
                                        materialDrafts[procedure.id]
                                          ?.category || "Phân bón"
                                      }
                                      onValueChange={(v) => {
                                        const defaultUnit =
                                          MATERIAL_UNITS[v]?.[0] || "kg";
                                        setMaterialDrafts((prev) => ({
                                          ...prev,
                                          [procedure.id]: {
                                            ...(prev[procedure.id] || {}),
                                            category: v,
                                            name: "", // Clear name when category changes
                                            unit: defaultUnit,
                                          },
                                        }));
                                      }}
                                    >
                                      <SelectTrigger className="w-full h-9 text-xs bg-white">
                                        <SelectValue placeholder="Loại..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {MATERIAL_TYPES.map((type) => (
                                          <SelectItem
                                            key={type.value}
                                            value={type.value}
                                          >
                                            {type.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="col-span-8">
                                    <AutoCompleteSelect
                                      options={(
                                        MATERIAL_OPTIONS[
                                          materialDrafts[procedure.id]
                                            ?.category || "Phân bón"
                                        ] || []
                                      ).map((opt) => ({
                                        label: opt.label,
                                        value: opt.value,
                                        unit: opt.unit,
                                      }))}
                                      value={
                                        materialDrafts[procedure.id]?.name || ""
                                      }
                                      onChange={(val) => {
                                        const category =
                                          materialDrafts[procedure.id]
                                            ?.category || "Phân bón";
                                        const options =
                                          MATERIAL_OPTIONS[category] || [];
                                        const selectedOpt = options.find(
                                          (o) =>
                                            o.value === val || o.label === val,
                                        );

                                        setMaterialDrafts((prev) => ({
                                          ...prev,
                                          [procedure.id]: {
                                            ...(prev[procedure.id] || {}),
                                            name: val,
                                            unit:
                                              selectedOpt?.unit ||
                                              prev[procedure.id]?.unit ||
                                              "kg",
                                          },
                                        }));
                                      }}
                                      placeholder="Chọn hoặc nhập tên vật tư..."
                                      className="h-9 text-xs"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-12 gap-2">
                                  <div className="col-span-3">
                                    <Input
                                      placeholder="Từ"
                                      className="h-9 text-xs bg-white px-2"
                                      value={
                                        materialDrafts[procedure.id]
                                          ?.dosageMin || ""
                                      }
                                      onChange={(e) =>
                                        setMaterialDrafts((prev) => ({
                                          ...prev,
                                          [procedure.id]: {
                                            ...(prev[procedure.id] || {}),
                                            dosageMin: e.target.value,
                                          },
                                        }))
                                      }
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <Input
                                      placeholder="Đến"
                                      className="h-9 text-xs bg-white px-2"
                                      value={
                                        materialDrafts[procedure.id]
                                          ?.dosageMax || ""
                                      }
                                      onChange={(e) =>
                                        setMaterialDrafts((prev) => ({
                                          ...prev,
                                          [procedure.id]: {
                                            ...(prev[procedure.id] || {}),
                                            dosageMax: e.target.value,
                                          },
                                        }))
                                      }
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <AutoCompleteSelect
                                      options={(
                                        MATERIAL_UNITS[
                                          materialDrafts[procedure.id]
                                            ?.category || "Phân bón"
                                        ] || ["kg"]
                                      ).map((u) => ({
                                        label: u,
                                        value: u,
                                      }))}
                                      value={
                                        materialDrafts[procedure.id]?.unit || ""
                                      }
                                      onChange={(val) =>
                                        setMaterialDrafts((prev) => ({
                                          ...prev,
                                          [procedure.id]: {
                                            ...(prev[procedure.id] || {}),
                                            unit: val,
                                          },
                                        }))
                                      }
                                      placeholder="Đơn vị..."
                                      className="h-9 text-xs"
                                    />
                                  </div>
                                  <div className="col-span-3">
                                    <Button
                                      size="sm"
                                      className="h-9 w-full p-0 bg-slate-900 hover:bg-slate-800 shadow-sm font-bold flex items-center justify-center gap-1.5"
                                      onClick={() => {
                                        const draft =
                                          materialDrafts[procedure.id];
                                        if (!draft?.name) return;
                                        addMaterialToProcedure(procedure.id, {
                                          category:
                                            draft.category || "Phân bón",
                                          name: draft.name,
                                          dosageMin: draft.dosageMin || "",
                                          dosageMax: draft.dosageMax || "",
                                          unit: draft.unit || "kg/ha",
                                        });
                                        setMaterialDrafts((prev) => ({
                                          ...prev,
                                          [procedure.id]: {
                                            category: draft.category,
                                            unit: draft.unit,
                                            name: "",
                                            dosageMin: "",
                                            dosageMax: "",
                                          },
                                        }));
                                      }}
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      THÊM
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  Chưa có giai đoạn nào. Hãy thêm block ngày đầu tiên cho phác
                  đồ.
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Thông số kiểm tra</Label>
                <MultiSelect
                  options={inspectionParameterOptions.map((item) => ({
                    ...item,
                  }))}
                  value={formData.inspectionParameters || []}
                  onChange={(value) =>
                    updateForm("inspectionParameters", value)
                  }
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
                    value.map((item) =>
                      item.replace(/^#/, "").replace(/-/g, " "),
                    ),
                  )
                }
                placeholder="Nhập hạng mục rồi nhấn Enter"
              />
            </div>

            <div className="space-y-3">
              <Label>Tệp đính kèm</Label>
              <div className="grid gap-3 md:grid-cols-3">
                <button
                  type="button"
                  className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-left"
                  onClick={() => pdfInputRef.current?.click()}
                >
                  <FileText className="h-5 w-5 text-red-500" />
                  <p className="mt-2 font-medium">PDF</p>
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
                  <p className="mt-2 font-medium">Video</p>
                </button>
              </div>

              <div className="grid gap-2 md:grid-cols-3">
                {formData.attachments.length > 0 ? (
                  formData.attachments.map((item) => (
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
                          <p className="text-sm font-medium text-slate-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500">{item.size}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          updateForm(
                            "attachments",
                            formData.attachments.filter(
                              (attachment) => attachment.id !== item.id,
                            ),
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
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
        description: "Tổng hợp toàn bộ hồ sơ",
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
                value={primaryMethodName || "Chưa cập nhật"}
                tone="border-amber-100 bg-amber-50 text-amber-900"
              />
              <StageMetric
                label="Số giai đoạn"
                value={`${formData.procedures.length} giai đoạn`}
                tone="border-violet-100 bg-violet-50 text-violet-900"
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Step 1. Thông tin nền
                  </p>
                  <p className="text-sm text-slate-500">
                    Tóm tắt dịch hại và các mốc thời gian.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <SummaryField
                    label="Tên phác đồ"
                    value={formData.name || "Chưa cập nhật"}
                  />
                  <SummaryField
                    label="Khu vực áp dụng"
                    value={formData.zone || "Chưa cập nhật"}
                  />
                  <SummaryField
                    label="Mức độ mục tiêu"
                    value={targetSeverityLabel || "Chưa cập nhật"}
                  />
                  <SummaryField
                    label="Thời gian áp dụng"
                    value={timeWindowSummary}
                  />
                  <SummaryField
                    label="Ngân sách"
                    value={budgetRangeLabel || "Chưa cập nhật"}
                  />
                  <div className="md:col-span-2">
                    <SummaryField
                      label="Hiện trạng dịch hại"
                      value={
                        typeof formData.soilIssue === "string"
                          ? formData.soilIssue || "Chưa cập nhật"
                          : "(Đã nhập mô tả chi tiết)"
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Step 2. Phạm vi
                  </p>
                  <p className="text-sm text-slate-500">
                    Kiểm tra đơn vị phụ trách and nhóm cây trồng áp dụng.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <SummaryField
                    label="Ưu tiên xử lý"
                    value={priorityLabel || "Chưa cập nhật"}
                  />
                  <div className="md:col-span-2">
                    <SummaryField
                      label="Cấu hình cây trồng áp dụng"
                      value={
                        formData.applicableCropConfigs.length > 0 ? (
                          <div className="space-y-2 mt-1">
                            {formData.applicableCropConfigs.map((config) => (
                              <div
                                key={config.id}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                              >
                                <span className="font-semibold text-primary">
                                  {config.groupName}:
                                </span>{" "}
                                <span className="text-slate-600">
                                  {config.specificCrops.length > 0
                                    ? config.specificCrops.join(", ")
                                    : "Tất cả cây trồng trong nhóm"}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          "Chưa cập nhật"
                        )
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <SummaryField
                      label="Tác giả"
                      value={joinOrFallback(
                        formData.authors.map((author) =>
                          [
                            author.name,
                            author.qualification,
                            author.organization,
                          ]
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
                  <p className="text-sm font-semibold text-slate-900">
                    Step 3. Biện pháp
                  </p>
                  <p className="text-sm text-slate-500">
                    Đối chiếu biện pháp chính, hỗ trợ và mục tiêu đầu ra.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <SummaryField
                    label="Biện pháp chính"
                    value={primaryMethodName || "Chưa cập nhật"}
                  />
                  <SummaryField
                    label="Biện pháp hỗ trợ"
                    value={joinOrFallback(supportingMethodNames)}
                  />
                  <SummaryField
                    label="Mục tiêu phác đồ"
                    value={joinOrFallback(formData.goalTags || [])}
                  />
                  <div className="md:col-span-2">
                    <SummaryField
                      label="Lưu ý triển khai"
                      value={
                        typeof formData.importantNotes === "string"
                          ? formData.importantNotes || "Chưa cập nhật"
                          : "(Đã nhập lưu ý chi tiết)"
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <SummaryField
                      label="Kết quả mong đợi"
                      value={
                        typeof formData.expectedOutcomeSummary === "string"
                          ? formData.expectedOutcomeSummary || "Chưa cập nhật"
                          : "(Đã nhập kết quả chi tiết)"
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Step 4. Theo ngày
                  </p>
                  <p className="text-sm text-slate-500">
                    Tóm tắt số giai đoạn, vật tư và tài liệu đính kèm.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <SummaryField
                    label="Số giai đoạn"
                    value={`${formData.procedures.length} giai đoạn`}
                  />
                  <SummaryField
                    label="Tài liệu đính kèm"
                    value={`${formData.attachments.length} tệp`}
                  />
                  <div className="md:col-span-2">
                    <SummaryField
                      label="Lịch trình"
                      value={
                        formData.procedures.length > 0 ? (
                          <div className="space-y-2">
                            {formData.procedures.map((procedure, index) => (
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
                                  {` • ${procedure.attachments?.length || 0} tài liệu`}
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
        isValid: true,
      },
    ],
    [
      formData,
      responsibleUnitLabel,
      targetSeverityLabel,
      priorityLabel,
      budgetRangeLabel,
      primaryMethodName,
      supportingMethodNames,
      timeWindowSummary,
      handleComplete,
    ],
  );

  return (
    <AdminLayout
      title={isEdit ? `Cập nhật phác đồ: ${formData.code}` : "Tạo phác đồ mới"}
      description={
        isEdit
          ? "Chỉnh sửa thông tin quy trình kỹ thuật & sâu bệnh"
          : "Khởi tạo quy trình kỹ thuật & sâu bệnh mới cho hệ thống"
      }
      actions={
        <Button variant="outline" className="bg-white" onClick={goBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Button>
      }
    >
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={goBack}
            completeLabel="Xác nhận & Lưu phác đồ"
          />

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
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
