import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronDown,
  Fish,
  Info,
  PawPrint,
  TreeDeciduous,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  GrowthCycleHierarchyDialog,
  type GrowthCycleHierarchyChildOption,
  type GrowthCycleHierarchyPrimaryOption,
} from "../../growth-cycle/components/GrowthCycleHierarchyDialog";
import {
  animalBreedOptions,
  animalCycleOptions,
  plantCycleOptions,
  type MockChildOption,
  type MockPrimaryOption,
} from "../data/cycleSelectionData";
import { DOMAIN_OPTIONS } from "../utils/utils";
import type { SeasonFormData } from "../types/types";
import type { SeasonDomainCode } from "@/features/master-data/types/master-data.type";
import type { Variety } from "@/pages/variety/types";

interface SeasonBasicInfoCardProps {
  formData: SeasonFormData;
  onChange: (formData: SeasonFormData) => void;
  showStatusField?: boolean;
  varieties: Variety[];
  disabled?: boolean;
  hideDomainTabs?: boolean;
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
  varieties: Variety[],
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
    (item) => item.group === "Thủy sản",
  );
  const childOptions: MockChildOption[] = animalBreedOptions
    .filter((breed) => primaryOptions.some((p) => p.id === breed.primaryId))
    .map((breed) => ({
      ...breed,
      group: primaryOptions.find((p) => p.id === breed.primaryId)?.group || breed.group,
    }));
  return { primaryOptions, childOptions };
}

export function SeasonBasicInfoCard({
  formData,
  onChange,
  showStatusField = false,
  varieties,
  disabled = false,
  hideDomainTabs = false,
}: SeasonBasicInfoCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { primaryOptions, childOptions } = getOptionsForDomain(
    formData.domainCode,
    varieties,
  );

  const selectedPrimary = primaryOptions.find(
    (item) => item.id === formData.selectedPrimaryId,
  );
  const selectedChild = childOptions.find(
    (item) => item.id === formData.selectedChildId,
  );

  const hasVarietyScope = !!formData.productionSubjectVariantId;

  const handleDomainChange = (domainCode: SeasonDomainCode) => {
    if (formData.domainCode === domainCode) return;

    onChange({
      ...formData,
      domainCode,
      productionSubjectId: undefined,
      productionSubjectVariantId: undefined,
      selectedPrimaryId: undefined,
      selectedChildId: undefined,
    });
  };

  const selectionTitle = selectedPrimary
    ? selectedPrimary.name
    : `Chọn đối tượng`;

  const selectionSubtitle = selectedPrimary
    ? selectedPrimary.group
    : `Mở dialog để chọn`;

  const selectionDetail = selectedPrimary?.description;

  const varietyTitle = selectedChild
    ? selectedChild.name
    : "Chọn giống / dòng";

  const varietySubtitle = !selectedPrimary
    ? "Chọn đối tượng trước"
    : selectedChild
      ? selectedChild.group
      : "Mở dialog để chọn giống / dòng";

  const varietyDetail = !selectedPrimary
    ? "Vùng chọn này sẽ bật sau khi chọn đối tượng."
    : hasVarietyScope
      ? selectedChild
        ? selectedChild.description || ""
        : "Bấm vào đây để chọn giống trong cùng dialog."
      : "Phạm vi đang là theo đối tượng nên không cần chọn giống riêng.";

  const fallbackIcon = <PawPrint className="h-5 w-5" />;

  const domainLabel =
    DOMAIN_OPTIONS.find((d) => d.value === formData.domainCode)?.label ||
    "Đối tượng";

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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Info className="h-5 h-5" />
          </div>
          <CardTitle>Thông tin chung</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hideDomainTabs && (
          <div className="space-y-3">
            <Label className="text-base font-bold text-slate-800">
              Loại mùa vụ
            </Label>
            <Tabs
              value={formData.domainCode}
              onValueChange={(value) =>
                handleDomainChange(value as SeasonDomainCode)
              }
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
              <TabsContent value="CROP" className="mt-4 space-y-3">
                <div className="rounded-lg border bg-emerald-50/40 p-4 text-sm text-emerald-900">
                  Dùng cho mùa vụ của cây trồng, theo loại hoặc theo giống cụ thể.
                </div>
              </TabsContent>
              <TabsContent value="LIVESTOCK" className="mt-4 space-y-3">
                <div className="rounded-lg border bg-blue-50/50 p-4 text-sm text-blue-900">
                  Dùng cho mùa vụ của vật nuôi, theo đối tượng hoặc theo giống / dòng.
                </div>
              </TabsContent>
              <TabsContent value="AQUACULTURE" className="mt-4 space-y-3">
                <div className="rounded-lg border bg-cyan-50/50 p-4 text-sm text-cyan-900">
                  Dùng cho mùa vụ của thủy sản, theo đối tượng hoặc theo giống / dòng.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-base font-bold text-slate-800">
            {domainLabel}
          </Label>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              {domainLabel}
              <span className="text-destructive"> *</span>
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
              secondaryGroup={
                hasVarietyScope && selectedChild?.group
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
          </div>
        </div>

        <Separator className="bg-slate-100" />

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Mã mùa vụ
              </Label>
              <Input
                placeholder="Để trống để tự sinh mã"
                value={formData.code}
                disabled={disabled}
                onChange={(event) =>
                  onChange({ ...formData, code: event.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>
                Tên mùa vụ <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="VD: Vụ Xuân 2024"
                value={formData.name}
                onChange={(event) =>
                  onChange({ ...formData, name: event.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mô tả</Label>
            <Textarea
              placeholder="Mô tả chi tiết về kế hoạch mùa vụ..."
              rows={3}
              value={formData.description}
              onChange={(event) =>
                onChange({ ...formData, description: event.target.value })
              }
            />
          </div>

          {showStatusField && (
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  onChange({
                    ...formData,
                    status: value as SeasonFormData["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {DOMAIN_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>

      <GrowthCycleHierarchyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={`Chọn ${domainLabel.toLowerCase()} và giống`}
        description="Chọn đối tượng ở trên, sau đó chọn giống ở bên dưới nếu cần."
        searchPlaceholder="Tìm đối tượng hoặc giống..."
        selectedPrimaryId={formData.selectedPrimaryId || ""}
        selectedChildId={formData.selectedChildId || ""}
        primaryOptions={primaryOptions.map(toHierarchyPrimary)}
        childOptions={childOptions.map(toHierarchyChild)}
        primaryLabel={domainLabel}
        childLabel="Giống / dòng"
        showChildSection={true}
        onConfirm={({ primary, child }) => {
          const matchedPrimary = primaryOptions.find(
            (p) => p.id === primary.id,
          );
          const matchedChild = child
            ? childOptions.find((c) => c.id === child.id)
            : undefined;

          onChange({
            ...formData,
            selectedPrimaryId: matchedPrimary?.id,
            selectedChildId: matchedChild?.id,
            productionSubjectId: matchedPrimary?.numericId,
            productionSubjectVariantId: matchedChild?.numericId,
          });
        }}
      />
    </Card>
  );
}
