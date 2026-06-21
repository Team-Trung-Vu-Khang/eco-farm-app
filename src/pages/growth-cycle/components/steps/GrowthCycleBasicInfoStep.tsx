import {
  Label,
  RadioGroup,
  RadioGroupItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronDown, Fish, Flower2, PawPrint, TreeDeciduous } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { CreateGrowthCycleForm } from "../../types/types";
import type { Variety } from "@/pages/variety/types";
import {
  animalBreedOptions,
  animalCycleOptions,
  plantCycleOptions,
} from "../../data/cycleSelectionData";
import {
  GrowthCycleHierarchyDialog,
  type GrowthCycleHierarchyChildOption,
  type GrowthCycleHierarchyPrimaryOption,
} from "../GrowthCycleHierarchyDialog";

interface GrowthCycleBasicInfoStepProps {
  formData: CreateGrowthCycleForm;
  filteredVarieties: Variety[];
  onCycleTypeChange: (cycleType: "plant" | "animal") => void;
  onScopeChange: (scope: "crop" | "variety") => void;
  onCropChange: (cropId: string) => void;
  onVarietyChange: (variety: string) => void;
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
  value: "crop" | "variety";
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
          <Label htmlFor={inputId} className="cursor-pointer text-base font-bold">
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
              <img src={image} alt={title} className="h-full w-full object-cover" />
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
              <p className="text-sm font-semibold text-slate-900">{secondaryTitle}</p>
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
  formData,
  filteredVarieties,
  onCycleTypeChange,
  onScopeChange,
  onCropChange,
  onVarietyChange,
}: GrowthCycleBasicInfoStepProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isPlant = (formData.cycleType ?? "plant") === "plant";
  const primaryOptions = isPlant ? plantCycleOptions : animalCycleOptions;

  const primaryMap = new Map<string, GrowthCycleHierarchyPrimaryOption>(
    primaryOptions.map((item) => [item.id, item]),
  );

  const childOptions: GrowthCycleHierarchyChildOption[] = isPlant
    ? filteredVarieties.map((variety) => ({
        id: variety.id,
        primaryId: variety.crop,
        name: variety.varietyName,
        group: variety.scientificName || variety.crop,
        image:
          typeof variety.illustration === "string" ? variety.illustration : "",
        description: variety.description || "",
        code: variety.varietyCode,
      }))
    : animalBreedOptions.map((breed) => ({
        ...breed,
        group: primaryMap.get(breed.primaryId)?.group || breed.group,
      }));

  const selectedPrimary = primaryOptions.find((item) => item.id === formData.cropId);
  const selectedChild = childOptions.find((item) => item.id === formData.variety);

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
    : formData.scope === "variety"
      ? selectedChild
        ? selectedChild.description || ""
        : isPlant
          ? "Bấm vào đây để chọn giống trong cùng dialog."
          : "Bấm vào đây để chọn giống / dòng trong cùng dialog."
      : isPlant
        ? "Phạm vi đang là theo loại cây nên không cần chọn giống riêng."
        : "Phạm vi đang là theo đối tượng nuôi nên không cần chọn giống riêng.";

  const cycleIntroTitle = isPlant ? "Dùng cho chu kỳ cây trồng" : "Dùng cho chu kỳ vật nuôi / thủy sản";
  const cycleIntroDescription = isPlant
    ? "Từ nảy mầm đến ra hoa, đậu trái hoặc thu hoạch."
    : "Từ sơ sinh đến nuôi lớn, sinh sản hoặc xuất chuồng.";

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
          <Label className="text-base font-semibold">Nhóm chu kỳ</Label>
          <Tabs
            value={formData.cycleType ?? "plant"}
            onValueChange={(value) =>
              onCycleTypeChange(value as "plant" | "animal")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-0">
              <TabsTrigger value="plant" className="gap-2">
                <TreeDeciduous className="w-4 h-4" />
                Thực vật
              </TabsTrigger>
              <TabsTrigger value="animal" className="gap-2">
                <Fish className="w-4 h-4" />
                Vật nuôi / Thủy sản
              </TabsTrigger>
            </TabsList>
            <TabsContent value="plant" className="mt-4 space-y-3">
              <div className="rounded-lg border bg-emerald-50/40 p-4 text-sm text-emerald-900">
                {cycleIntroTitle}: {cycleIntroDescription}
              </div>
            </TabsContent>
            <TabsContent value="animal" className="mt-4 space-y-3">
              <div className="rounded-lg border bg-blue-50/50 p-4 text-sm text-blue-900">
                {cycleIntroTitle}: {cycleIntroDescription}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">Phạm vi áp dụng</Label>
          <RadioGroup
            value={formData.scope}
            onValueChange={onScopeChange}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <ScopeOption
              checked={formData.scope === "crop"}
              icon={scopeCropIcon}
              inputId="scope-crop"
              title={scopeCropTitle}
              value="crop"
              description={scopeCropDescription}
              onClick={() => onScopeChange("crop")}
            />
            <ScopeOption
              checked={formData.scope === "variety"}
              icon={scopeVarietyIcon}
              inputId="scope-variety"
              title="Theo giống cụ thể"
              value="variety"
              description={scopeVarietyDescription}
              onClick={() => onScopeChange("variety")}
            />
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            {isPlant ? "Loại cây trồng" : "Đối tượng nuôi"}
          </Label>
          <SelectionCard
            title={selectionTitle}
            subtitle={selectionSubtitle}
            image={selectedPrimary?.image}
            fallbackIcon={primaryFallbackIcon}
            group={selectedPrimary?.group}
            detail={selectionDetail}
            placeholder={
              isPlant ? "Chọn loại cây trong dialog" : "Chọn đối tượng nuôi trong dialog"
            }
            showSecondary={formData.scope === "variety"}
            secondaryTitle={varietyTitle}
            secondarySubtitle={varietySubtitle}
            secondaryPlaceholder={
              isPlant ? "Chọn giống cây trong dialog" : "Chọn giống / dòng trong dialog"
            }
            secondaryDetail={varietyDetail}
            secondaryGroup={
              formData.scope === "variety" && selectedChild?.group ? selectedChild.group : undefined
            }
            secondaryDisabled={!selectedPrimary}
            onPrimaryClick={() => setDialogOpen(true)}
            onSecondaryClick={() => {
              if (!selectedPrimary) return;
              setDialogOpen(true);
            }}
          />
        </div>
      </div>

      <GrowthCycleHierarchyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={isPlant ? "Chọn loại và giống cây" : "Chọn đối tượng nuôi và giống / dòng"}
        description={
          isPlant
            ? "Chọn loại cây ở trên, sau đó chọn giống ở bên dưới nếu cần."
            : "Chọn đối tượng nuôi ở trên, sau đó chọn giống / dòng ở bên dưới nếu cần."
        }
        searchPlaceholder={
          isPlant ? "Tìm loại cây hoặc giống..." : "Tìm đối tượng nuôi hoặc giống..."
        }
        selectedPrimaryId={formData.cropId}
        selectedChildId={formData.variety || ""}
        primaryOptions={primaryOptions}
        childOptions={childOptions}
        primaryLabel={isPlant ? "Loại cây trồng" : "Đối tượng nuôi"}
        childLabel={isPlant ? "Giống cây trồng" : "Giống / dòng"}
        showChildSection={formData.scope === "variety"}
        onConfirm={({ primary, child }) => {
          onCropChange(primary.id);
          if (formData.scope === "variety") {
            onVarietyChange(child?.id || "");
          } else {
            onVarietyChange("");
          }
        }}
      />
    </div>
  );
}
