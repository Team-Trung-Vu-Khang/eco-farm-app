import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronDown, Fish, PawPrint } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import type {
  ProductionSubjectResponse,
  ProductionSubjectVariantResponse,
} from "../../../../../features/foundation/types/foundation.type";
import type { AnimalGrowthCycleFormValues } from "../../schemas/animalGrowthCycleSchema";
import {
  AnimalGrowthCycleHierarchyDialog,
  type AnimalGrowthCycleHierarchyChildOption,
} from "../AnimalGrowthCycleHierarchyDialog";

interface AnimalGrowthCycleBasicInfoStepProps {
  filteredVarieties: ProductionSubjectVariantResponse[];
  crops: ProductionSubjectResponse[];
}

function ScopeOption({
  checked,
  icon,
  inputId,
  title,
  value,
  description,
  onClick,
}: {
  checked: boolean;
  icon: ReactNode;
  inputId: string;
  title: string;
  value: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <div
      className={`relative flex flex-row items-center gap-4 rounded-2xl border-2 p-4 transition-all ${
        checked
          ? "border-primary bg-primary/5 shadow-md"
          : "border-muted hover:border-primary/50 hover:bg-muted/50"
      }`}
      onClick={onClick}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
          checked
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={value} id={inputId} />
          <Label
            htmlFor={inputId}
            className="cursor-pointer text-base font-bold"
          >
            {title}
          </Label>
        </div>
        <p className="text-xs leading-snug text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

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

export function AnimalGrowthCycleBasicInfoStep({
  filteredVarieties,
  crops,
}: AnimalGrowthCycleBasicInfoStepProps) {
  const { watch, setValue, control } =
    useFormContext<AnimalGrowthCycleFormValues>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const watchedScope = watch("scope");
  const watchedCropId = watch("cropId");
  const watchedVariety = watch("variety");

  const primaryOptions = crops.map((c) => ({
    id: String(c.id),
    name: c.name,
    group: c.scientificName || "Nhóm " + (c.subjectGroupId || ""),
    image: c.imageUrl ?? "",
    description: c.scientificName || "",
  }));

  const childOptions: AnimalGrowthCycleHierarchyChildOption[] =
    filteredVarieties.map((variety) => {
      return {
        id: String(variety.id),
        primaryId: String(variety.subject?.id),
        name: variety.name,
        group: variety.origin || "",
        image: variety.imageUrl || "",
        description: variety.description || "",
        code: variety.code,
      };
    });

  const selectedPrimary = primaryOptions.find(
    (item) => item.id === watchedCropId,
  );
  const selectedChild = childOptions.find((item) => item.id === watchedVariety);

  const selectionTitle = selectedPrimary
    ? selectedPrimary.name
    : "Chọn vật nuôi";

  const selectionSubtitle = selectedPrimary
    ? selectedPrimary.group
    : "Mở dialog để chọn vật nuôi";

  const selectionDetail = selectedPrimary?.description;

  const varietyTitle = selectedChild
    ? selectedChild.name
    : "Chọn giống vật nuôi";

  const varietySubtitle = !selectedPrimary
    ? "Chọn vật nuôi trước"
    : selectedChild
      ? selectedChild.group
      : "Mở dialog để chọn giống vật nuôi";

  const varietyDetail = !selectedPrimary
    ? "Vùng chọn này sẽ bật sau khi chọn vật nuôi."
    : watchedScope === "variety"
      ? selectedChild
        ? selectedChild.description || ""
        : "Bấm vào đây để chọn giống trong cùng dialog."
      : "Phạm vi đang là theo vật nuôi nên không cần chọn giống riêng.";

  const scopeCropTitle = "Theo vật nuôi";
  const scopeCropDescription =
    "Áp dụng cho tất cả các giống thuộc vật nuôi này.";
  const scopeVarietyDescription =
    "Chọn vật nuôi và giống vật nuôi trong cùng một dialog.";

  const scopeCropIcon = <PawPrint className="w-6 h-6" />;
  const scopeVarietyIcon = <Fish className="w-6 h-6" />;
  const primaryFallbackIcon = <PawPrint className="h-5 w-5" />;

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      <div className="space-y-6">
        <FormField
          control={control as any}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <Label className="text-sm font-semibold" required>
                Tên chu kỳ sinh trưởng
              </Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="VD: Chu kỳ sinh trưởng vật nuôi, Chu kỳ chăn nuôi Heo thịt..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <Label className="text-base font-semibold">Phạm vi áp dụng</Label>
          <FormField
            control={control as any}
            name="scope"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("variety", "");
                    }}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                  >
                    <ScopeOption
                      checked={field.value === "crop"}
                      icon={scopeCropIcon}
                      inputId="scope-crop"
                      title={scopeCropTitle}
                      value="crop"
                      description={scopeCropDescription}
                      onClick={() => {
                        field.onChange("crop");
                        setValue("variety", "");
                      }}
                    />
                    <ScopeOption
                      checked={field.value === "variety"}
                      icon={scopeVarietyIcon}
                      inputId="scope-variety"
                      title="Theo giống cụ thể"
                      value="variety"
                      description={scopeVarietyDescription}
                      onClick={() => {
                        field.onChange("variety");
                        setValue("variety", "");
                      }}
                    />
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Vật nuôi</Label>
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
                    placeholder="Chọn vật nuôi trong dialog"
                    showSecondary={watchedScope === "variety"}
                    secondaryTitle={varietyTitle}
                    secondarySubtitle={varietySubtitle}
                    secondaryPlaceholder="Chọn giống vật nuôi trong dialog"
                    secondaryDetail={varietyDetail}
                    secondaryGroup={
                      watchedScope === "variety" && selectedChild?.group
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
      </div>

      <AnimalGrowthCycleHierarchyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Chọn vật nuôi và giống"
        description="Chọn vật nuôi ở trên, sau đó chọn giống ở bên dưới nếu cần."
        searchPlaceholder="Tìm vật nuôi hoặc giống..."
        selectedPrimaryId={watchedCropId}
        selectedChildId={watchedVariety || ""}
        primaryOptions={primaryOptions}
        childOptions={childOptions}
        primaryLabel="Vật nuôi"
        childLabel="Giống vật nuôi"
        showChildSection={watchedScope === "variety"}
        onConfirm={({ primary, child }) => {
          setValue("cropId", primary.id, { shouldValidate: true });
          if (watchedScope === "variety") {
            setValue("variety", child?.id || "", { shouldValidate: true });
          } else {
            setValue("variety", "", { shouldValidate: true });
          }
        }}
      />
    </div>
  );
}
