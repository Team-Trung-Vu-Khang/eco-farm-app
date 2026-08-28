import {
  Badge,
  Button,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Flower2, Layers, Plus, TreeDeciduous, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import type {
  ProductionSubjectResponse,
  ProductionSubjectVariantResponse,
  CatalogRecordResponse,
} from "../../../../features/foundation/types/foundation.type";
import type { GrowthCycleFormValues } from "../../schemas/growthCycleSchema";
import {
  GrowthCycleMultiSelectDialog,
  type GrowthCycleMultiSelectOption,
} from "../GrowthCycleMultiSelectDialog";

interface GrowthCycleBasicInfoStepProps {
  varieties: ProductionSubjectVariantResponse[];
  crops: ProductionSubjectResponse[];
  cropGroups: CatalogRecordResponse[];
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

function MultiSelectCard({
  label,
  emptyText,
  selectedOptions,
  onOpen,
  onRemove,
  required,
}: {
  label: string;
  emptyText: string;
  selectedOptions: GrowthCycleMultiSelectOption[];
  onOpen: () => void;
  onRemove: (id: string) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold" required={required}>
          {label}
        </Label>
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold"
        >
          {selectedOptions.length} đã chọn
        </Badge>
      </div>

      <Button
        type="button"
        onClick={onOpen}
        variant="outline"
        className="w-full cursor-pointer border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary font-bold gap-2 transition-all rounded-lg shadow-sm hover:shadow-md"
      >
        <Plus className="h-5 w-5" />
        {selectedOptions.length > 0 ? "Chỉnh sửa lựa chọn" : emptyText}
      </Button>

      {selectedOptions.length > 0 && (
        <div className="space-y-2">
          {selectedOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                {option.image ? (
                  <img
                    src={option.image}
                    alt={option.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-black text-muted-foreground">
                    {option.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">
                  {option.name}
                </p>
                {(option.group || option.description) && (
                  <p className="truncate text-xs text-muted-foreground">
                    {option.group || option.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemove(option.id)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function GrowthCycleBasicInfoStep({
  varieties,
  crops,
  cropGroups,
}: GrowthCycleBasicInfoStepProps) {
  const { watch, setValue, control } = useFormContext<GrowthCycleFormValues>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const watchedScope = watch("scope");
  const watchedGroupIds = watch("groupIds") || [];
  const watchedCropIds = watch("cropIds") || [];
  const watchedVarietyIds = watch("varietyIds") || [];

  const groupOptions: GrowthCycleMultiSelectOption[] = useMemo(() => {
    return cropGroups.map((group) => ({
      id: String(group.id),
      name: group.name,
      group: "",
      image: group.imageUrl ?? "",
      description: group.description || "",
    }));
  }, [cropGroups]);

  const cropOptions: GrowthCycleMultiSelectOption[] = useMemo(
    () =>
      crops.map((c) => ({
        id: String(c.id),
        name: c.name,
        group: c.scientificName || "Nhóm " + (c.subjectGroupId || ""),
        image: c.imageUrl ?? "",
        description: c.scientificName || "",
      })),
    [crops],
  );

  const cropNameById = useMemo(
    () => new Map(cropOptions.map((c) => [c.id, c.name])),
    [cropOptions],
  );

  const varietyOptions: GrowthCycleMultiSelectOption[] = useMemo(
    () =>
      varieties.map((variety) => ({
        id: String(variety.id),
        name: variety.name,
        group:
          cropNameById.get(String(variety.subject?.id)) || variety.origin || "",
        image: variety.imageUrl || "",
        description: variety.description || "",
        code: variety.code,
      })),
    [varieties, cropNameById],
  );

  const scopeConfig = {
    group: {
      resource: "group" as const,
      label: "Nhóm cây trồng",
      emptyText: "Chọn nhóm cây trồng",
      options: groupOptions,
      selectedIds: watchedGroupIds,
      field: "groupIds" as const,
      dialogTitle: "Chọn nhóm cây trồng",
      dialogDescription: "Chọn một hoặc nhiều nhóm cây trồng áp dụng.",
      searchPlaceholder: "Tìm nhóm cây trồng...",
    },
    crop: {
      resource: "crop" as const,
      label: "Cây trồng",
      emptyText: "Chọn cây trồng",
      options: cropOptions,
      selectedIds: watchedCropIds,
      field: "cropIds" as const,
      dialogTitle: "Chọn cây trồng",
      dialogDescription: "Chọn một hoặc nhiều cây trồng áp dụng.",
      searchPlaceholder: "Tìm cây trồng...",
    },
    variety: {
      resource: "variety" as const,
      label: "Giống cây trồng",
      emptyText: "Chọn giống cây trồng",
      options: varietyOptions,
      selectedIds: watchedVarietyIds,
      field: "varietyIds" as const,
      dialogTitle: "Chọn giống cây trồng",
      dialogDescription: "Chọn một hoặc nhiều giống cây trồng áp dụng.",
      searchPlaceholder: "Tìm giống cây trồng...",
    },
  } as const;

  const active = scopeConfig[watchedScope];
  const selectedOptions = active.options.filter((option) =>
    active.selectedIds.includes(option.id),
  );

  const scopeGroupIcon = <Layers className="w-6 h-6" />;
  const scopeCropIcon = <TreeDeciduous className="w-6 h-6" />;
  const scopeVarietyIcon = <Flower2 className="w-6 h-6" />;

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      <div className="space-y-6">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <Label className="text-sm font-semibold" required>
                Tên chu kỳ sinh trưởng
              </Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="VD: Chu kỳ sinh trưởng Lúa mùa, Chu kỳ chăn nuôi Heo thịt..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    onValueChange={(value) => field.onChange(value)}
                    className="grid grid-cols-1 gap-4 md:grid-cols-3"
                  >
                    <ScopeOption
                      checked={field.value === "group"}
                      icon={scopeGroupIcon}
                      inputId="scope-group"
                      title="Theo nhóm cây trồng"
                      value="group"
                      description="Áp dụng cho tất cả cây trồng thuộc (các) nhóm được chọn."
                      onClick={() => field.onChange("group")}
                    />
                    <ScopeOption
                      checked={field.value === "crop"}
                      icon={scopeCropIcon}
                      inputId="scope-crop"
                      title="Theo cây trồng"
                      value="crop"
                      description="Áp dụng cho tất cả các giống thuộc (các) cây trồng được chọn."
                      onClick={() => field.onChange("crop")}
                    />
                    <ScopeOption
                      checked={field.value === "variety"}
                      icon={scopeVarietyIcon}
                      inputId="scope-variety"
                      title="Theo giống cây trồng"
                      value="variety"
                      description="Áp dụng cho (các) giống cây trồng cụ thể được chọn."
                      onClick={() => field.onChange("variety")}
                    />
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name={active.field}
          render={() => (
            <FormItem>
              <FormControl>
                <MultiSelectCard
                  label={active.label}
                  emptyText={active.emptyText}
                  selectedOptions={selectedOptions}
                  onOpen={() => setDialogOpen(true)}
                  onRemove={(id) =>
                    setValue(
                      active.field,
                      active.selectedIds.filter((item) => item !== id),
                      { shouldValidate: true },
                    )
                  }
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <GrowthCycleMultiSelectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={active.dialogTitle}
        description={active.dialogDescription}
        searchPlaceholder={active.searchPlaceholder}
        selectedIds={active.selectedIds}
        resource={active.resource}
        subjectIds={watchedCropIds}
        optionsLabel={active.label}
        onConfirm={(ids) =>
          setValue(active.field, ids, { shouldValidate: true })
        }
      />
    </div>
  );
}
