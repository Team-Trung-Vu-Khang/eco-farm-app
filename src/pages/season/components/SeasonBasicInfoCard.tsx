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
  Flower2,
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
} from "../data/cycleSelectionData";
import { SEASON_STATUS_OPTIONS } from "../utils/utils";
import type { SeasonFormData, SeasonStatus } from "../types/types";
import type { Variety } from "@/pages/variety/types";

interface SeasonBasicInfoCardProps {
  formData: SeasonFormData;
  onChange: (formData: SeasonFormData) => void;
  showStatusField?: boolean;
  varieties: Variety[];
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

export function SeasonBasicInfoCard({
  formData,
  onChange,
  showStatusField = false,
  varieties,
}: SeasonBasicInfoCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isPlant = (formData.seasonType ?? "plant") === "plant";

  const primaryOptions = isPlant ? plantCycleOptions : animalCycleOptions;
  const primaryMap = new Map<string, GrowthCycleHierarchyPrimaryOption>(
    primaryOptions.map((item) => [item.id, item]),
  );

  const childOptions: GrowthCycleHierarchyChildOption[] = isPlant
    ? varieties.map((variety) => ({
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
  const selectedChild = childOptions.find((item) => item.id === formData.varietyId);

  const handleSeasonTypeChange = (seasonType: "plant" | "animal") => {
    if (formData.seasonType === seasonType) return;

    onChange({
      ...formData,
      seasonType,
      scope: "crop",
      cropId: undefined,
      varietyId: undefined,
      duration: 0,
      growthCycleIds: [],
      selectedStages: {},
    });
  };

  const handleScopeChange = (scope: SeasonFormData["scope"]) => {
    if (formData.scope === scope) return;

    onChange({
      ...formData,
      scope,
      cropId: undefined,
      varietyId: undefined,
      duration: 0,
      growthCycleIds: [],
      selectedStages: {},
    });
  };

  const updateForm = <K extends keyof SeasonFormData>(
    field: K,
    value: SeasonFormData[K],
  ) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

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

  const primaryFallbackIcon = isPlant ? (
    <TreeDeciduous className="h-5 w-5" />
  ) : (
    <PawPrint className="h-5 w-5" />
  );

  const primaryLabel = isPlant ? "Loại cây trồng" : "Đối tượng nuôi";
  const childLabel = isPlant ? "Giống cây trồng" : "Giống / dòng";
  const dialogTitle = isPlant
    ? "Chọn loại và giống cây"
    : "Chọn đối tượng nuôi và giống / dòng";
  const dialogDescription = isPlant
    ? "Chọn loại cây ở trên, sau đó chọn giống ở bên dưới nếu cần."
    : "Chọn đối tượng nuôi ở trên, sau đó chọn giống / dòng ở bên dưới nếu cần.";
  const dialogSearchPlaceholder = isPlant
    ? "Tìm loại cây hoặc giống..."
    : "Tìm đối tượng nuôi hoặc giống...";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Info className="h-5 w-5" />
          </div>
          <CardTitle>Thông tin chung</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-bold text-slate-800">
            Loại mùa vụ
          </Label>
          <Tabs
            value={formData.seasonType ?? "plant"}
            onValueChange={(value) =>
              handleSeasonTypeChange(value as "plant" | "animal")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-0">
              <TabsTrigger value="plant" className="gap-2">
                <TreeDeciduous className="w-4 h-4" />
                Vụ mùa
              </TabsTrigger>
              <TabsTrigger value="animal" className="gap-2">
                <Fish className="w-4 h-4" />
                Vụ nuôi
              </TabsTrigger>
            </TabsList>
            <TabsContent value="plant" className="mt-4 space-y-3">
              <div className="rounded-lg border bg-emerald-50/40 p-4 text-sm text-emerald-900">
                Dùng cho mùa vụ của cây trồng, theo loại hoặc theo giống cụ thể.
              </div>
            </TabsContent>
            <TabsContent value="animal" className="mt-4 space-y-3">
              <div className="rounded-lg border bg-blue-50/50 p-4 text-sm text-blue-900">
                Dùng cho mùa vụ của vật nuôi hoặc thủy sản, theo đối tượng hoặc
                theo giống / dòng.
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-bold text-slate-800">
            Phạm vi áp dụng
          </Label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <button
              type="button"
              className={`relative flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                formData.scope === "crop"
                  ? "border-green-600 bg-green-50/30"
                  : "border-slate-100 bg-white hover:border-green-200"
              }`}
              onClick={() => handleScopeChange("crop")}
            >
              <div
                className={`shrink-0 rounded-full p-3 ${
                  formData.scope === "crop"
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {isPlant ? (
                  <TreeDeciduous className="h-6 w-6" />
                ) : (
                  <PawPrint className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    {isPlant ? "Theo loại cây trồng" : "Theo loại vật nuôi"}
                  </span>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      formData.scope === "crop"
                        ? "border-green-600"
                        : "border-slate-300"
                    }`}
                  >
                    {formData.scope === "crop" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                    )}
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-slate-500">
                  {isPlant
                    ? "Áp dụng cho tất cả các giống thuộc loại cây trồng này."
                    : "Áp dụng cho tất cả các giống thuộc đối tượng nuôi này."}
                </p>
              </div>
            </button>

            <button
              type="button"
              className={`relative flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                formData.scope === "variety"
                  ? "border-green-600 bg-green-50/30"
                  : "border-slate-100 bg-white hover:border-green-200"
              }`}
              onClick={() => handleScopeChange("variety")}
            >
              <div
                className={`shrink-0 rounded-full p-3 ${
                  formData.scope === "variety"
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {isPlant ? (
                  <Flower2 className="h-6 w-6" />
                ) : (
                  <Fish className="h-6 w-6" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Theo giống cụ thể
                  </span>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      formData.scope === "variety"
                        ? "border-green-600"
                        : "border-slate-300"
                    }`}
                  >
                    {formData.scope === "variety" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                    )}
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-slate-500">
                  {isPlant
                    ? "Chọn loại và giống trong cùng một dialog."
                    : "Chọn đối tượng và giống / dòng trong cùng một dialog."}
                </p>
              </div>
            </button>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              {primaryLabel}
              <span className="text-destructive"> *</span>
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
                formData.scope === "variety" && selectedChild?.group
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
                Mã mùa vụ <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="VD: MV2024-01"
                value={formData.code}
                onChange={(event) => updateForm("code", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Tên mùa vụ <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="VD: Vụ Xuân 2024"
                value={formData.name}
                onChange={(event) => updateForm("name", event.target.value)}
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
                updateForm("description", event.target.value)
              }
            />
          </div>

          <div
            className={`grid grid-cols-1 gap-4 ${showStatusField ? "md:grid-cols-2" : ""}`}
          >
            {showStatusField && (
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    updateForm("status", value as SeasonStatus)
                  }
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
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <GrowthCycleHierarchyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogTitle}
        description={dialogDescription}
        searchPlaceholder={dialogSearchPlaceholder}
        selectedPrimaryId={formData.cropId || ""}
        selectedChildId={formData.varietyId || ""}
        primaryOptions={primaryOptions}
        childOptions={childOptions}
        primaryLabel={primaryLabel}
        childLabel={childLabel}
        showChildSection={formData.scope === "variety"}
        onConfirm={({ primary, child }) => {
          onChange({
            ...formData,
            cropId: primary.id,
            varietyId: formData.scope === "variety" ? child?.id : undefined,
            growthCycleIds: [],
            selectedStages: {},
          });
        }}
      />
    </Card>
  );
}
