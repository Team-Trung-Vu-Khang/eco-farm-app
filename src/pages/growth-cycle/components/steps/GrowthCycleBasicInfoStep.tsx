import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronDown,
  Fish,
  Flower2,
  PawPrint,
  TreeDeciduous,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import type {
  FoundationCropResponse,
  FoundationCropVarietyResponse,
} from "../../../../features/foundation/types/foundation.type";
import {
  animalBreedOptions,
  animalCycleOptions,
} from "../../data/cycleSelectionData";
import type { GrowthCycleFormValues } from "../../schemas/growthCycleSchema";
import {
  GrowthCycleHierarchyDialog,
  type GrowthCycleHierarchyChildOption,
  type GrowthCycleHierarchyPrimaryOption,
} from "../GrowthCycleHierarchyDialog";

interface GrowthCycleBasicInfoStepProps {
  filteredVarieties: FoundationCropVarietyResponse[];
  crops: FoundationCropResponse[];
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

export function GrowthCycleBasicInfoStep({
  filteredVarieties,
  crops,
}: GrowthCycleBasicInfoStepProps) {
  const { watch, setValue, control } = useFormContext<GrowthCycleFormValues>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const watchedCycleType = watch("cycleType") ?? "plant";
  const watchedScope = watch("scope");
  const watchedCropId = watch("cropId");
  const watchedVariety = watch("variety");

  const isPlant = watchedCycleType === "plant";
  const primaryOptions = isPlant
    ? crops.map((c) => ({
        id: String(c.id),
        name: c.name,
        group: c.cropGroupName,
        image: c.imageUrl ?? "",
        description: c.description ?? "",
      }))
    : animalCycleOptions;

  const primaryMap = new Map<string, GrowthCycleHierarchyPrimaryOption>(
    primaryOptions.map((item) => [item.id, item]),
  );

  const childOptions: GrowthCycleHierarchyChildOption[] = isPlant
    ? filteredVarieties.map((variety) => {
        const metadata: Record<string, unknown> = variety.metadataJson || {};
        return {
          id: String(variety.id),
          primaryId: String(variety.cropId),
          name: variety.name,
          group: String(metadata.scientificName || variety.cropName),
          image:
            typeof metadata.illustrationUrl === "string"
              ? metadata.illustrationUrl
              : "",
          description: variety.description || "",
          code: variety.code,
        };
      })
    : animalBreedOptions.map((breed) => ({
        ...breed,
        group: primaryMap.get(breed.primaryId)?.group || "",
      }));

  const selectedPrimary = primaryOptions.find(
    (item) => item.id === watchedCropId,
  );
  const selectedChild = childOptions.find((item) => item.id === watchedVariety);

  const selectionTitle = selectedPrimary
    ? selectedPrimary.name
    : isPlant
      ? "Chọn loại cây"
      : "Chọn đối tượng nuôi";

  const selectionSubtitle = selectedPrimary
    ? selectedPrimary.group
    : isPlant
      ? "Mở dialog để chọn loại cây"
      : "Mở dialog để chọn đối tượng nuôi";

  const selectionDetail = selectedPrimary?.description;

  const varietyTitle = selectedChild
    ? selectedChild.name
    : isPlant
      ? "Chọn giống cây"
      : "Chọn giống / dòng";

  const varietySubtitle = !selectedPrimary
    ? isPlant
      ? "Chọn loại cây trước"
      : "Chọn đối tượng nuôi trước"
    : selectedChild
      ? selectedChild.group
      : isPlant
        ? "Mở dialog để chọn giống cây"
        : "Mở dialog để chọn giống / dòng";

  const varietyDetail = !selectedPrimary
    ? isPlant
      ? "Vùng chọn này sẽ bật sau khi chọn loại cây."
      : "Vùng chọn này sẽ bật sau khi chọn đối tượng nuôi."
    : watchedScope === "variety"
      ? selectedChild
        ? selectedChild.description || ""
        : isPlant
          ? "Bấm vào đây để chọn giống trong cùng dialog."
          : "Bấm vào đây để chọn giống / dòng trong cùng dialog."
      : isPlant
        ? "Phạm vi đang là theo loại cây nên không cần chọn giống riêng."
        : "Phạm vi đang là theo đối tượng nuôi nên không cần chọn giống riêng.";

  const scopeCropTitle = isPlant ? "Theo loại cây trồng" : "Theo loại vật nuôi";
  const scopeCropDescription = isPlant
    ? "Áp dụng cho tất cả các giống thuộc loại cây trồng này."
    : "Áp dụng cho tất cả các giống thuộc đối tượng nuôi này.";
  const scopeVarietyDescription = isPlant
    ? "Chọn loại và giống trong cùng một dialog."
    : "Chọn đối tượng và giống / dòng trong cùng một dialog.";

  const scopeCropIcon = isPlant ? (
    <TreeDeciduous className="w-6 h-6" />
  ) : (
    <PawPrint className="w-6 h-6" />
  );

  const scopeVarietyIcon = isPlant ? (
    <Flower2 className="w-6 h-6" />
  ) : (
    <Fish className="w-6 h-6" />
  );

  const primaryFallbackIcon = isPlant ? (
    <TreeDeciduous className="h-5 w-5" />
  ) : (
    <Fish className="h-5 w-5" />
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-semibold">Vụ</Label>
          <FormField
            control={control}
            name="cycleType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    value={field.value ?? "plant"}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("cropId", "");
                      setValue("variety", "");
                    }}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                  >
                    <ScopeOption
                      checked={(field.value ?? "plant") === "plant"}
                      icon={<TreeDeciduous className="w-6 h-6" />}
                      inputId="cycle-type-plant"
                      title="Vụ mùa"
                      value="plant"
                      description="Từ nảy mầm đến ra hoa, đậu trái hoặc thu hoạch."
                      onClick={() => {
                        field.onChange("plant");
                        setValue("cropId", "");
                        setValue("variety", "");
                      }}
                    />
                    <ScopeOption
                      checked={field.value === "animal"}
                      icon={<Fish className="w-6 h-6" />}
                      inputId="cycle-type-animal"
                      title="Vụ nuôi"
                      value="animal"
                      description="Từ sơ sinh đến nuôi lớn, sinh sản hoặc xuất chuồng."
                      onClick={() => {
                        field.onChange("animal");
                        setValue("cropId", "");
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

        <div className="space-y-3">
          <Label className="text-base font-semibold">Phạm vi áp dụng</Label>
          <FormField
            control={control}
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
          <Label className="text-sm font-semibold">
            {isPlant ? "Loại cây trồng" : "Đối tượng nuôi"}
          </Label>
          <FormField
            control={control}
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
                    placeholder={
                      isPlant
                        ? "Chọn loại cây trong dialog"
                        : "Chọn đối tượng nuôi trong dialog"
                    }
                    showSecondary={watchedScope === "variety"}
                    secondaryTitle={varietyTitle}
                    secondarySubtitle={varietySubtitle}
                    secondaryPlaceholder={
                      isPlant
                        ? "Chọn giống cây trong dialog"
                        : "Chọn giống / dòng trong dialog"
                    }
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

      <GrowthCycleHierarchyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={
          isPlant
            ? "Chọn loại và giống cây"
            : "Chọn đối tượng nuôi và giống / dòng"
        }
        description={
          isPlant
            ? "Chọn loại cây ở trên, sau đó chọn giống ở bên dưới nếu cần."
            : "Chọn đối tượng nuôi ở trên, sau đó chọn giống / dòng ở bên dưới nếu cần."
        }
        searchPlaceholder={
          isPlant
            ? "Tìm loại cây hoặc giống..."
            : "Tìm đối tượng nuôi hoặc giống..."
        }
        selectedPrimaryId={watchedCropId}
        selectedChildId={watchedVariety || ""}
        primaryOptions={primaryOptions}
        childOptions={childOptions}
        primaryLabel={isPlant ? "Loại cây trồng" : "Đối tượng nuôi"}
        childLabel={isPlant ? "Giống cây trồng" : "Giống / dòng"}
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
