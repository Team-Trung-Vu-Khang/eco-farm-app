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
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowLeft,
  FileText,
  Plus,
  Trash2,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { useMemo, useEffect } from "react";
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
import {
  WizardCard,
  StageMetric,
  SummaryField,
  TagInput,
} from "./components/TreatmentWizardLayouts";

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
    goBack,
  } = useCreateTreatmentPage(id);

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

  const steps: Step[] = useMemo(
    () => [
      {
        id: "general",
      title: "Thông tin nền",
      description: "Nhận diện & Bài toán dịch hại",
      isValid: !!formData.code && !!formData.name && !!formData.diseaseType,
      content: (
        <WizardCard
          title="Khởi tạo hồ sơ phác đồ"
          description="Khai báo thông tin chung để định danh phác đồ và mô tả bài toán xử lý cây trồng."
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
            <div className="space-y-2">
              <Label>Khu vực áp dụng mẫu</Label>
              <Input
                value={formData.zone}
                onChange={(e) => updateForm("zone", e.target.value)}
                placeholder="VD: Đồng Nai - Vùng A"
              />
            </div>
            <div className="space-y-2">
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
            </div>
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
              <Label>Mức độ mục tiêu (Severity)</Label>
              <Select
                value={formData.targetSeverity}
                onValueChange={(val: any) => updateForm("targetSeverity", val)}
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
            <Label>Mô tả tình trạng & bài toán</Label>
            <Textarea
              rows={3}
              value={formData.soilIssue}
              onChange={(e) => updateForm("soilIssue", e.target.value)}
              placeholder="Mô tả dấu hiệu nhận biết, tác động của dịch hại..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Thời lượng (Dự kiến)</Label>
              <Input
                value={formData.duration}
                onChange={(e) => updateForm("duration", e.target.value)}
                placeholder="VD: 14 ngày"
              />
            </div>
            <div className="space-y-2">
              <Label>Ngày bắt đầu</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => updateForm("startDate", e.target.value)}
              />
            </div>
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
      isValid: !!formData.responsibleUnit,
      content: (
        <WizardCard
          title="Xác định phạm vi áp dụng"
          description="Thiết lập các nhóm cây trồng phù hợp và đơn vị chịu trách nhiệm thực thi."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Đơn vị phụ trách chính</Label>
              <AutoCompleteSelect
                options={responsibleUnitOptions.map((opt) => ({ ...opt }))}
                value={formData.responsibleUnit}
                onChange={(val) => updateForm("responsibleUnit", val)}
                placeholder="Chọn đơn vị"
              />
            </div>
            <div className="space-y-2">
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
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nhóm cây trồng (Tags)</Label>
              <MultiSelect
                options={cropTypes.map((t) => ({
                  label: t.name,
                  value: t.name,
                }))}
                value={formData.cropGroupTags}
                onChange={(val) => updateForm("cropGroupTags", val)}
                placeholder="Chọn nhóm cây"
              />
            </div>
            <div className="space-y-2">
              <Label>Cây trồng cụ thể</Label>
              <MultiSelect
                options={Object.values(crops)
                  .flat()
                  .map((c) => ({ label: c, value: c }))}
                value={formData.applicableCrops}
                onChange={(val) => updateForm("applicableCrops", val)}
                placeholder="Chọn cây trồng"
              />
            </div>
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
            <Textarea
              rows={4}
              value={formData.importantNotes}
              onChange={(e) => updateForm("importantNotes", e.target.value)}
              placeholder="Các quy tắc an toàn, điều kiện thời tiết bắt buộc..."
            />
          </div>

          <div className="space-y-2">
            <Label>Kết quả mong đợi sau phác đồ</Label>
            <Textarea
              rows={3}
              value={formData.expectedOutcomeSummary}
              onChange={(e) =>
                updateForm("expectedOutcomeSummary", e.target.value)
              }
              placeholder="Mô tả trạng thái cây trồng sau khi hoàn tất..."
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
                              value={(procedure.qualityCheckpoints || []).join(
                                "\n",
                              )}
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
                                addMaterialToProcedure(procedure.id)
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
                                        Khai báo loại vật tư và định lượng cho
                                        riêng giai đoạn này.
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      onClick={() =>
                                        removeMaterialFromProcedure(
                                          procedure.id,
                                          item.id,
                                        )
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
                                          {treatmentMaterialCategoryOptions.map(
                                            (option) => (
                                              <SelectItem
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </SelectItem>
                                            ),
                                          )}
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
                options={inspectionParameterOptions.map((item) => ({
                  ...item,
                }))}
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
                  value.map((item) =>
                    item.replace(/^#/, "").replace(/-/g, " "),
                  ),
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
                  Tóm tắt bài toán dịch hại và các mốc thời gian.
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
                    label="Hiện trạng & Bài toán"
                    value={formData.soilIssue || "Chưa cập nhật"}
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
                <SummaryField
                  label="Nhóm cây trồng"
                  value={joinOrFallback(formData.cropGroupTags)}
                />
                <SummaryField
                  label="Cây trồng áp dụng"
                  value={joinOrFallback(formData.applicableCrops)}
                />
                <div className="md:col-span-2">
                  <SummaryField
                    label="Tác giả"
                    value={joinOrFallback(
                      formData.authors.map((author) =>
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
                    label="Kết quả mong đợi"
                    value={formData.expectedOutcomeSummary || "Chưa cập nhật"}
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
  ], [formData, responsibleUnitLabel, targetSeverityLabel, priorityLabel, budgetRangeLabel, primaryMethodName, supportingMethodNames, timeWindowSummary, handleComplete]);

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
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
