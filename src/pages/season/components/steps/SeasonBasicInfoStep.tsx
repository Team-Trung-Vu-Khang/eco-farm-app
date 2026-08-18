import React, { useState, useMemo, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import {
  Input,
  Label,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronDown,
  Fish,
  PawPrint,
  TreeDeciduous,
} from "lucide-react";
import {
  GrowthCycleHierarchyDialog,
  type GrowthCycleHierarchyChildOption,
  type GrowthCycleHierarchyPrimaryOption,
} from "../../../growth-cycle/components/GrowthCycleHierarchyDialog";
import {
  animalBreedOptions,
  animalCycleOptions,
  plantCycleOptions,
  type MockChildOption,
  type MockPrimaryOption,
} from "../../data/cycleSelectionData";
import { SEASON_STATUS_OPTIONS, getDomainLabel } from "../../utils/utils";
import type { SeasonFormValues } from "../../schemas/seasonFormSchema";
import type { Variety } from "@/pages/variety/types";
import type { SeasonDomainCode } from "@/features/master-data/types/master-data.type";

interface SeasonBasicInfoStepProps {
  varieties: Variety[];
  disabled?: boolean;
  hideDomainTabs?: boolean;
  showStatusField?: boolean;
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

function getOptionsForDomain(
  domainCode: SeasonDomainCode,
  varieties: Variety[]
): {
  primaryOptions: MockPrimaryOption[];
  childOptions: MockChildOption[];
} {
  if (domainCode === "CROP") {
    const primaryOptions = plantCycleOptions;
    const childOptions: MockChildOption[] = varieties.map((variety) => ({
      id: String(variety.id),
      numericId: Number(variety.id) || 0,
      primaryId: variety.crop,
      name: variety.varietyName,
      group: variety.scientificName || variety.crop,
      image:
        typeof variety.illustration === "string" ? variety.illustration : "",
      description: variety.description || "",
      code: variety.varietyCode,
    }));
    return { primaryOptions, childOptions };
  }

  if (domainCode === "LIVESTOCK") {
    const primaryOptions = animalCycleOptions;
    const childOptions: MockChildOption[] = animalBreedOptions.map((breed) => ({
      ...breed,
      group: primaryOptions.find((p) => p.id === breed.primaryId)?.group || breed.group,
    }));
    return { primaryOptions, childOptions };
  }

  // AQUACULTURE
  const primaryOptions = animalCycleOptions.filter(
    (item) => item.group === "Thủy sản"
  );
  const childOptions: MockChildOption[] = animalBreedOptions
    .filter((breed) => primaryOptions.some((p) => p.id === breed.primaryId))
    .map((breed) => ({
      ...breed,
      group: primaryOptions.find((p) => p.id === breed.primaryId)?.group || breed.group,
    }));
  return { primaryOptions, childOptions };
}

export function SeasonBasicInfoStep({
  varieties,
  disabled = false,
  hideDomainTabs = false,
  showStatusField = false,
}: SeasonBasicInfoStepProps) {
  const { watch, setValue, control } = useFormContext<SeasonFormValues>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const domainCode = watch("domainCode");
  const selectedPrimaryId = watch("selectedPrimaryId");
  const selectedChildId = watch("selectedChildId");

  const { primaryOptions, childOptions } = useMemo(
    () => getOptionsForDomain(domainCode, varieties),
    [domainCode, varieties]
  );

  const selectedPrimary = useMemo(
    () => primaryOptions.find((item) => item.id === selectedPrimaryId),
    [primaryOptions, selectedPrimaryId]
  );

  const selectedChild = useMemo(
    () => childOptions.find((item) => item.id === selectedChildId),
    [childOptions, selectedChildId]
  );

  const handleDomainChange = (newDomain: SeasonDomainCode) => {
    if (domainCode === newDomain) return;

    setValue("domainCode", newDomain);
    setValue("selectedPrimaryId", undefined);
    setValue("selectedChildId", undefined);
    setValue("productionSubjectId", undefined);
    setValue("productionSubjectVariantId", undefined);
  };

  const domainLabel = getDomainLabel(domainCode);

  const selectionTitle = selectedPrimary ? selectedPrimary.name : `Chọn đối tượng`;
  const selectionSubtitle = selectedPrimary ? selectedPrimary.group : `Mở dialog để chọn`;
  const selectionDetail = selectedPrimary?.description;

  const varietyTitle = selectedChild ? selectedChild.name : "Chọn giống / dòng";
  const varietySubtitle = !selectedPrimary
    ? "Chọn đối tượng trước"
    : selectedChild
    ? selectedChild.group
    : "Mở dialog để chọn giống / dòng";

  const varietyDetail = !selectedPrimary
    ? "Vùng chọn này sẽ bật sau khi chọn đối tượng."
    : selectedChild
    ? selectedChild.description || ""
    : "Bấm vào đây để chọn giống trong cùng dialog.";

  const fallbackIcon = <PawPrint className="h-5 w-5" />;

  const toHierarchyPrimary = (opt: MockPrimaryOption): GrowthCycleHierarchyPrimaryOption => ({
    id: opt.id,
    name: opt.name,
    group: opt.group,
    image: opt.image,
    description: opt.description,
  });

  const toHierarchyChild = (opt: MockChildOption): GrowthCycleHierarchyChildOption => ({
    id: opt.id,
    primaryId: opt.primaryId,
    name: opt.name,
    group: opt.group || "",
    image: opt.image,
    description: opt.description,
    code: opt.code,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      {!hideDomainTabs && (
        <div className="space-y-3">
          <Label className="text-base font-semibold text-slate-800">
            Loại mùa vụ
          </Label>
          <Tabs
            value={domainCode}
            onValueChange={(val) => handleDomainChange(val as SeasonDomainCode)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-0">
              <TabsTrigger value="CROP" className="gap-2">
                <TreeDeciduous className="w-4 h-4" />
                Vụ mùa
              </TabsTrigger>
              <TabsTrigger value="LIVESTOCK" className="gap-2">
                <PawPrint className="w-4 h-4" />
                Vụ nuôi
              </TabsTrigger>
              <TabsTrigger value="AQUACULTURE" className="gap-2">
                <Fish className="w-4 h-4" />
                Thủy sản
              </TabsTrigger>
            </TabsList>
            <TabsContent value="CROP" className="mt-4">
              <div className="rounded-lg border bg-emerald-50/40 p-4 text-sm text-emerald-900">
                Dùng cho mùa vụ của cây trồng, theo loại hoặc theo giống cụ thể.
              </div>
            </TabsContent>
            <TabsContent value="LIVESTOCK" className="mt-4">
              <div className="rounded-lg border bg-blue-50/50 p-4 text-sm text-blue-900">
                Dùng cho mùa vụ của vật nuôi, theo đối tượng hoặc theo giống / dòng.
              </div>
            </TabsContent>
            <TabsContent value="AQUACULTURE" className="mt-4">
              <div className="rounded-lg border bg-cyan-50/50 p-4 text-sm text-cyan-900">
                Dùng cho mùa vụ của thủy sản, theo đối tượng hoặc theo giống / dòng.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-sm font-semibold" required>
          {domainLabel}
        </Label>
        <SelectionCard
          title={selectionTitle}
          subtitle={selectionSubtitle}
          image={selectedPrimary?.image}
          fallbackIcon={fallbackIcon}
          group={selectedPrimary?.group}
          detail={selectionDetail}
          placeholder="Chọn trong dialog"
          showSecondary={true}
          secondaryTitle={varietyTitle}
          secondarySubtitle={varietySubtitle}
          secondaryPlaceholder="Chọn giống / dòng trong dialog"
          secondaryDetail={varietyDetail}
          secondaryGroup={selectedChild?.group}
          secondaryDisabled={!selectedPrimary}
          onPrimaryClick={() => setDialogOpen(true)}
          onSecondaryClick={() => {
            if (!selectedPrimary) return;
            setDialogOpen(true);
          }}
        />
      </div>

      <Separator className="bg-slate-100" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={control}
          name="code"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <Label className="text-sm font-semibold">Mã mùa vụ</Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Để trống để tự sinh mã"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <Label className="text-sm font-semibold" required>
                Tên mùa vụ
              </Label>
              <FormControl>
                <Input {...field} placeholder="VD: Vụ Xuân 2024" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <Label className="text-sm font-semibold">Mô tả</Label>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Mô tả chi tiết về kế hoạch mùa vụ..."
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      {showStatusField && (
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <Label className="text-sm font-semibold">Trạng thái</Label>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEASON_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <GrowthCycleHierarchyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={`Chọn đối tượng và giống`}
        description="Chọn đối tượng ở trên, sau đó chọn giống ở bên dưới nếu cần."
        searchPlaceholder="Tìm đối tượng hoặc giống..."
        selectedPrimaryId={selectedPrimaryId || ""}
        selectedChildId={selectedChildId || ""}
        primaryOptions={primaryOptions.map(toHierarchyPrimary)}
        childOptions={childOptions.map(toHierarchyChild)}
        primaryLabel={domainLabel}
        childLabel="Giống / dòng"
        showChildSection={true}
        onConfirm={({ primary, child }) => {
          const matchedPrimary = primaryOptions.find((p) => p.id === primary.id);
          const matchedChild = child ? childOptions.find((c) => c.id === child.id) : undefined;

          setValue("selectedPrimaryId", matchedPrimary?.id, { shouldValidate: true });
          setValue("selectedChildId", matchedChild?.id, { shouldValidate: true });
          setValue("productionSubjectId", matchedPrimary?.numericId, { shouldValidate: true });
          setValue("productionSubjectVariantId", matchedChild?.numericId, { shouldValidate: true });
        }}
      />
    </div>
  );
}
