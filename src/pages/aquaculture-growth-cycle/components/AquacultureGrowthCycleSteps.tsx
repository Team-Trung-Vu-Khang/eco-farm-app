import {
  Badge,
  Card,
  CardContent,
  Input,
  Label,
  StepperForm,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CalendarDays, Fish, Layers3, Waves, ChevronDown } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { z } from "zod";
import { GrowthCycleStagesStep } from "@/pages/growth-cycle/components/steps/GrowthCycleStagesStep";
import type { AnimalGrowthCycleFormValues } from "@/pages/animal-husbandry-zone/animal-growth-cycle/schemas/animalGrowthCycleSchema";
import { parseDurationToDays } from "@/pages/growth-cycle/utils/duration";
import {
  useProductionSubjects,
  useProductionSubjectVariants,
  type ProductionSubjectResponse,
  type ProductionSubjectVariantResponse,
} from "@/features/foundation";
import { AquacultureGrowthCycleHierarchyDialog } from "./AquacultureGrowthCycleHierarchyDialog";

function SelectionCard({
  title,
  subtitle,
  image,
  fallbackIcon,
  group,
  detail,
  placeholder,
  showSecondary,
  secondaryTitle,
  secondarySubtitle,
  secondaryPlaceholder,
  secondaryDetail,
  secondaryGroup,
  secondaryDisabled,
  onPrimaryClick,
  onSecondaryClick,
}: {
  title: string;
  subtitle?: string;
  image?: string;
  fallbackIcon: ReactNode;
  group?: string;
  detail?: string;
  placeholder: string;
  showSecondary: boolean;
  secondaryTitle: string;
  secondarySubtitle?: string;
  secondaryPlaceholder: string;
  secondaryDetail?: string;
  secondaryGroup?: string;
  secondaryDisabled: boolean;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <button
        type="button"
        onClick={onPrimaryClick}
        className="flex min-h-[112px] w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-slate-50/70"
      >
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
            {image ? (
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground">{fallbackIcon}</span>
            )}
          </div>
          <div className="min-w-0 space-y-1">
            <p className="truncate text-base font-semibold text-slate-900">
              {title}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {subtitle || placeholder}
            </p>
            {detail && (
              <p className="line-clamp-2 text-xs leading-snug text-slate-500">
                {detail}
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {group && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
              {group}
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </button>

      {showSecondary ? (
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3">
          <button
            type="button"
            onClick={onSecondaryClick}
            disabled={secondaryDisabled}
            className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left transition-all ${
              secondaryDisabled
                ? "cursor-not-allowed border-dashed border-slate-200 bg-white/70 opacity-70"
                : "border-slate-200 bg-white hover:border-primary/40 hover:shadow-sm"
            }`}
          >
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                {secondaryTitle}
              </p>
              <p className="text-xs text-muted-foreground">
                {secondarySubtitle || secondaryPlaceholder}
              </p>
              {secondaryDetail && (
                <p className="line-clamp-1 text-[11px] text-slate-500">
                  {secondaryDetail}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {secondaryGroup && (
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                  {secondaryGroup}
                </span>
              )}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </button>
        </div>
      ) : null}
    </div>
  );
}

interface AquacultureBasicInfoStepProps {
  crops: ProductionSubjectResponse[];
  varieties: ProductionSubjectVariantResponse[];
}

function AquacultureBasicInfoStep({ crops, varieties }: AquacultureBasicInfoStepProps) {
  const {
    watch,
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<AnimalGrowthCycleFormValues>();

  const [dialogOpen, setDialogOpen] = useState(false);

  const scope = watch("scope");
  const cropId = watch("cropId");
  const variety = watch("variety");
  const name = watch("name");

  const filteredVarieties = useMemo(
    () =>
      varieties.filter(
        (item) => String(item.subject?.id) === cropId,
      ),
    [cropId, varieties],
  );

  const primaryOptions = crops.map((c) => ({
    id: String(c.id),
    name: c.name,
    group: c.scientificName || "Nhóm " + (c.subjectGroupId || ""),
    image: c.imageUrl ?? "",
    description: c.scientificName || "",
  }));

  const childOptions = filteredVarieties.map((item) => {
    return {
      id: String(item.id),
      primaryId: String(item.subject?.id),
      name: item.name,
      group: item.origin || "",
      image: item.imageUrl || "",
      description: item.description || "",
      code: item.code,
    };
  });

  const selectedPrimary = primaryOptions.find(
    (item) => item.id === cropId,
  );
  const selectedChild = childOptions.find((item) => item.id === variety);

  const selectionTitle = selectedPrimary ? selectedPrimary.name : "Chọn loài nuôi";
  const selectionSubtitle = selectedPrimary ? selectedPrimary.group : "Mở dialog để chọn loài nuôi";
  const selectionDetail = selectedPrimary?.description;

  const varietyTitle = selectedChild ? selectedChild.name : "Chọn giống loài nuôi";
  const varietySubtitle = !selectedPrimary
    ? "Vui lòng chọn loài nuôi trước khi chọn giống."
    : selectedChild
      ? selectedChild.group
      : "Nhấp để chọn giống";
  const varietyDetail = selectedChild?.description;

  const primaryFallbackIcon = <Fish className="w-8 h-8" />;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-white p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
            <Fish className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
              Chu kỳ thủy hải sản
            </p>
            <h3 className="text-xl font-bold text-slate-900">
              Thiết lập thông tin cơ bản cho chu kỳ nuôi
            </h3>
            <p className="max-w-2xl text-sm text-slate-600">
              Chỉ dùng cho tôm, cá, nghêu và các đối tượng thủy sản. Không còn
              lựa chọn cây trồng hay chăn nuôi tổng quát.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-none shadow-md bg-white">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Tên chu kỳ <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Ví dụ: Chu kỳ nuôi tôm thẻ chân trắng 2026"
                className="h-11"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs font-medium text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Phạm vi áp dụng <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="scope"
                render={({ field }) => (
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      {
                        value: "crop",
                        title: "Theo loài nuôi",
                        description: "Áp dụng cho một loài thủy sản cụ thể.",
                      },
                      {
                        value: "variety",
                        title: "Theo giống / dòng",
                        description: "Áp dụng chi tiết cho một giống thủy sản.",
                      },
                    ].map((option) => {
                      const isActive = field.value === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            field.onChange(option.value as "crop" | "variety")
                          }
                          className={`rounded-2xl border-2 p-4 text-left transition-all ${
                            isActive
                              ? "border-cyan-500 bg-cyan-50 shadow-sm"
                              : "border-slate-200 bg-white hover:border-cyan-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                               className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                 isActive
                                   ? "bg-cyan-500 text-white"
                                   : "bg-slate-100 text-slate-500"
                               }`}
                            >
                              <Waves className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-semibold text-slate-900">
                                {option.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Loài nuôi</Label>
              <FormField
                control={control as any}
                name="cropId"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <SelectionCard
                        title={selectionTitle}
                        subtitle={selectionSubtitle}
                        image={selectedPrimary?.image}
                        fallbackIcon={primaryFallbackIcon}
                        group={selectedPrimary?.group}
                        detail={selectionDetail}
                        placeholder="Chọn loài nuôi trong dialog"
                        showSecondary={scope === "variety"}
                        secondaryTitle={varietyTitle}
                        secondarySubtitle={varietySubtitle}
                        secondaryPlaceholder="Chọn giống thủy sản trong dialog"
                        secondaryDetail={varietyDetail}
                        secondaryGroup={
                          scope === "variety" && selectedChild?.group
                            ? selectedChild.group
                            : undefined
                        }
                        secondaryDisabled={!selectedPrimary}
                        onPrimaryClick={() => setDialogOpen(true)}
                        onSecondaryClick={() => {
                          if (!selectedPrimary) return;
                          setDialogOpen(true);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                <Layers3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Thông tin đang chọn
                </p>
                <p className="text-xs text-muted-foreground">
                  Tóm tắt lựa chọn cho chu kỳ thủy hải sản
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Tên chu kỳ</span>
                <span className="max-w-[180px] truncate font-medium text-slate-900">
                  {name || "Chưa nhập"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Loài nuôi</span>
                <span className="font-medium text-slate-900">
                  {selectedPrimary?.name || "Chưa chọn"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Phạm vi</span>
                <Badge variant="secondary">
                  {scope === "crop" ? "Theo loài nuôi" : "Theo giống / dòng"}
                </Badge>
              </div>
              {scope === "variety" && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Giống / dòng</span>
                  <span className="max-w-[180px] truncate font-medium text-slate-900">
                    {selectedChild?.name || "Chưa chọn"}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AquacultureGrowthCycleHierarchyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Chọn loài nuôi và giống"
        description="Chọn loài nuôi ở trên, sau đó chọn giống ở bên dưới nếu cần."
        searchPlaceholder="Tìm loài nuôi hoặc giống..."
        selectedPrimaryId={cropId}
        selectedChildId={variety || ""}
        primaryOptions={primaryOptions}
        childOptions={childOptions}
        primaryLabel="Loài nuôi"
        childLabel="Giống thủy sản"
        showChildSection={scope === "variety"}
        onConfirm={({ primary, child }) => {
          setValue("cropId", primary.id, { shouldValidate: true });
          if (scope === "variety") {
            setValue("variety", child?.id || "", { shouldValidate: true });
          } else {
            setValue("variety", "", { shouldValidate: true });
          }
        }}
      />
    </div>
  );
}

interface AquacultureConfirmStepProps {
  crops: ProductionSubjectResponse[];
  varieties: ProductionSubjectVariantResponse[];
}

function AquacultureConfirmStep({ crops, varieties }: AquacultureConfirmStepProps) {
  const { watch } = useFormContext<AnimalGrowthCycleFormValues>();
  const formData = watch();

  const selectedSpecies = crops.find(
    (item) => String(item.id) === formData.cropId,
  );
  const selectedVariety = varieties.find(
    (item) => String(item.id) === formData.variety,
  );
  const totalDays = formData.stages.reduce(
    (sum, stage) => sum + parseDurationToDays(String(stage.duration)),
    0,
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-4">
      <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-white p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
            <Fish className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
              Xác nhận
            </p>
            <h3 className="text-xl font-bold text-slate-900">
              Kiểm tra lại chu kỳ thủy hải sản trước khi tạo
            </h3>
            <p className="text-sm text-slate-600">
              Tất cả thông tin bên dưới đã được chuẩn hóa cho riêng thủy hải
              sản, không còn phần cây trồng hay chăn nuôi chung.
            </p>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-md bg-white">
        <CardContent className="grid gap-4 p-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Tên chu kỳ
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {formData.name || "-"}
            </p>
          </div>
          <div className="rounded-2xl bg-cyan-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
              Đối tượng nuôi
            </p>
            <p className="mt-2 text-lg font-semibold text-cyan-900">
              {selectedSpecies?.name || formData.cropId || "-"}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Phạm vi
            </p>
            <p className="mt-2 text-base font-medium text-slate-900">
              {formData.scope === "crop"
                ? "Theo loài nuôi"
                : "Theo giống / dòng"}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Giống / dòng
            </p>
            <p className="mt-2 text-base font-medium text-slate-900">
              {formData.scope === "variety"
                ? selectedVariety?.name || formData.variety || "-"
                : "Không áp dụng"}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-900">
              Số giai đoạn
            </p>
            <p className="mt-2 text-base font-medium text-slate-900">
              {formData.stages.length} giai đoạn
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Tổng thời gian
            </p>
            <p className="mt-2 text-base font-medium text-slate-900">
              {totalDays} ngày
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          Danh sách giai đoạn
        </div>

        <div className="space-y-2">
          {formData.stages.map((stage, index) => (
            <div
              key={stage.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                  <Waves className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    Giai đoạn {index + 1}
                  </p>
                  <p className="text-xs text-muted-foreground">{stage.name}</p>
                </div>
              </div>
              <Badge variant="outline" className="font-semibold">
                {stage.duration}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AquacultureGrowthCycleSteps({
  schema,
  onComplete,
  onCancel,
  isSubmitting = false,
}: AquacultureGrowthCycleStepsProps) {
  const { watch, handleSubmit } = useFormContext<AnimalGrowthCycleFormValues>();
  const values = watch();

  const { items: crops } = useProductionSubjects({ params: { domainCode: "AQUACULTURE", size: 100 } });
  const { items: varieties } = useProductionSubjectVariants({ params: { domainCode: "AQUACULTURE", size: 100 } });

  const validationResult = useMemo(
    () => schema.safeParse(values),
    [schema, values],
  );

  const isStep1Valid = useMemo(() => {
    if (validationResult.success) return true;
    const step1Keys = ["name", "scope", "cropId", "variety"];
    const step1Errors = validationResult.error.issues.filter((issue) =>
      step1Keys.includes(String(issue.path[0])),
    );
    return step1Errors.length === 0;
  }, [validationResult]);

  const isStep2Valid = useMemo(() => {
    if (validationResult.success) return true;
    const step2Errors = validationResult.error.issues.filter(
      (issue) => issue.path[0] === "stages",
    );
    return step2Errors.length === 0;
  }, [validationResult]);

  const steps: Step[] = useMemo(
    () => [
      {
        id: "info",
        title: "Bước 1",
        description: "Thông tin thủy hải sản",
        content: <AquacultureBasicInfoStep crops={crops} varieties={varieties} />,
        isValid: isStep1Valid,
      },
      {
        id: "stages",
        title: "Bước 2",
        description: "Danh sách giai đoạn",
        content: <GrowthCycleStagesStep />,
        isValid: isStep2Valid,
      },
      {
        id: "confirm",
        title: "Bước 3",
        description: "Xác nhận",
        content: <AquacultureConfirmStep crops={crops} varieties={varieties} />,
        isValid: true,
      },
    ],
    [isStep1Valid, isStep2Valid, crops, varieties],
  );

  return (
    <StepperForm
      steps={steps}
      onComplete={handleSubmit(onComplete)}
      onCancel={onCancel}
      completeLabel="Hoàn thành"
      loading={isSubmitting}
    />
  );
}
