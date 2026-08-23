import {
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  Combobox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Apple,
  ArrowLeft,
  Bug,
  Calendar,
  Info,
  Layers,
  Link2,
  Plus,
  Sprout,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { GrowthCycle } from "../../growth-cycle/types/types";
import type {
  CropSupplyCatalog,
  CropSupplyType,
} from "../hooks/useCropSupplyCatalog";
import type {
  GeographicalSelection,
  GrowthCycleSelection,
  MaterialAllocation,
  PlanFormData,
} from "../types";
import GeographicalSelector from "./GeographicalSelector";
import GrowthCycleSelector from "./GrowthCycleSelector";
import {
  PersonnelMultiSelectCard,
  type PersonnelOption,
} from "./PersonnelMultiSelectCard";
import { RegimenSelector } from "./RegimenSelector";

const PURPOSE_OPTIONS = [
  { id: "cultivation", label: "Canh tác", icon: Layers, color: "blue" },
  {
    id: "facility-upgrade",
    label: "Nâng cấp CSVC",
    icon: Wrench,
    color: "slate",
  },
  { id: "treatment", label: "Điều trị", icon: Bug, color: "red" },
  { id: "amendment", label: "Cải tạo đất", icon: Sprout, color: "green" },
  { id: "harvest", label: "Thu hoạch", icon: Apple, color: "orange" },
] as const;

const PURPOSE_COLOR_CLASSES: Record<
  string,
  { active: string; text: string; border: string; bg: string }
> = {
  blue: {
    active: "bg-blue-500",
    text: "text-blue-700",
    border: "border-blue-500",
    bg: "bg-blue-50/50",
  },
  slate: {
    active: "bg-slate-700",
    text: "text-slate-700",
    border: "border-slate-500",
    bg: "bg-slate-50/80",
  },
  red: {
    active: "bg-red-500",
    text: "text-red-700",
    border: "border-red-500",
    bg: "bg-red-50/50",
  },
  green: {
    active: "bg-green-500",
    text: "text-green-700",
    border: "border-green-500",
    bg: "bg-green-50/50",
  },
  orange: {
    active: "bg-orange-500",
    text: "text-orange-700",
    border: "border-orange-500",
    bg: "bg-orange-50/50",
  },
};

interface ScopeSelectionSummaryGroup {
  regionId: string;
  regionName: string;
  items: { type: string; name: string; parentName?: string }[];
}

interface SimplePlanFormProps {
  formData: PlanFormData;
  setFormData: Dispatch<SetStateAction<PlanFormData>>;
  regimens: Parameters<typeof RegimenSelector>[0]["regimens"];
  handleDurationPartChange: (
    part: "years" | "months" | "days",
    value: string,
  ) => void;
  handleAddMaterial: (item: Omit<MaterialAllocation, "id">) => void;
  handleRemoveMaterial: (id: number) => void;
  handleComplete: () => void;
  goBack: () => void;
  completeLabel: string;
  regions: any[];
  selectedEnterpriseId: string;
  selections: GeographicalSelection[];
  selectionSummary: ScopeSelectionSummaryGroup[];
  handleGeographicalConfirm: (selections: GeographicalSelection[]) => void;
  isWorkflowContext?: boolean;
  workflowInfo?: {
    name?: string;
    seasonIds?: number[];
    growthCycleSelections?: GrowthCycleSelection[];
  } | null;
  growthCycles: GrowthCycle[];
  personnel: PersonnelOption[];
  supplyCatalog: CropSupplyCatalog;
}

function StageMaterialPicker({
  stageKey,
  allocations,
  onAddMaterial,
  onRemoveMaterial,
  supplyCatalog,
}: {
  stageKey: string;
  allocations: MaterialAllocation[];
  onAddMaterial: (item: Omit<MaterialAllocation, "id">) => void;
  onRemoveMaterial: (id: number) => void;
  supplyCatalog: CropSupplyCatalog;
}) {
  const defaultType =
    supplyCatalog.typeOptions[1]?.value ||
    supplyCatalog.typeOptions[0]?.value ||
    "fertilizer";
  const [newItem, setNewItem] = useState({
    name: "",
    qty: "",
    unitBaseId: "",
    type: defaultType as CropSupplyType,
  });

  const selectedTypeOption = supplyCatalog.typeOptions.find(
    (option) => option.value === newItem.type,
  );
  const selectedMaterial = supplyCatalog.optionsByType[newItem.type].find(
    (option) => option.value === newItem.name,
  );
  const packagingVariantOptions =
    selectedMaterial?.item.packagingVariants || [];
  const selectedPackagingVariant = packagingVariantOptions.find(
    (variant) => String(variant.unitBase?.id) === newItem.unitBaseId,
  );
  const maxPackagingQuantity = selectedPackagingVariant?.quantity;
  const exceedsPackagingQuantity =
    maxPackagingQuantity != null && Number(newItem.qty) > maxPackagingQuantity;

  const handleAdd = () => {
    if (
      !selectedMaterial ||
      !newItem.qty ||
      !selectedPackagingVariant?.unitBase
    )
      return;
    onAddMaterial({
      stageId: stageKey,
      materialCategory: selectedTypeOption?.label || newItem.type,
      materialType: selectedTypeOption?.label || newItem.type,
      materialName: selectedMaterial.label,
      quantity: newItem.qty,
      unit: selectedPackagingVariant.unitBase.name || selectedMaterial.unit,
      supplyItemId: selectedMaterial.item.id,
      unitBaseId: selectedPackagingVariant.unitBase.id,
    });
    setNewItem({
      name: "",
      qty: "",
      unitBaseId: "",
      type: newItem.type,
    });
  };

  return (
    <div className="space-y-3">
      {allocations.length > 0 && (
        <div className="space-y-1.5">
          {allocations.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between bg-white rounded-lg border border-slate-100 px-3 py-1.5 text-sm"
            >
              <span className="font-medium text-slate-700">
                {a.materialName}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border">
                  {a.quantity} {a.unit}
                </span>
                <button
                  type="button"
                  className="text-slate-300 hover:text-red-500 transition-colors"
                  onClick={() => onRemoveMaterial(a.id)}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4">
          <Select
            value={newItem.type}
            onValueChange={(v) => {
              const type = v as CropSupplyType;
              setNewItem({ ...newItem, type, name: "", unitBaseId: "" });
            }}
          >
            <SelectTrigger className="w-full h-9 text-xs bg-white">
              <SelectValue placeholder="Loại..." />
            </SelectTrigger>
            <SelectContent>
              {supplyCatalog.typeOptions.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-8">
          <Combobox
            options={supplyCatalog.optionsByType[newItem.type].map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            value={newItem.name}
            onChange={(v) => {
              const item = supplyCatalog.optionsByType[newItem.type].find(
                (i) => i.value === v,
              );
              const firstVariant = item?.item.packagingVariants?.[0];
              setNewItem({
                ...newItem,
                name: v,
                unitBaseId: firstVariant?.unitBase?.id
                  ? String(firstVariant.unitBase.id)
                  : "",
              });
            }}
            placeholder="Chọn vật tư..."
            searchPlaceholder="Tìm vật tư..."
            emptyText={
              supplyCatalog.isLoading
                ? "Đang tải danh sách vật tư..."
                : "Không tìm thấy vật tư."
            }
            disabled={supplyCatalog.isLoading}
            className="h-9 text-xs w-full bg-white"
          />
        </div>
        <div className="col-span-5">
          <Input
            placeholder="Số lượng ước lượng"
            type="number"
            className="h-9 text-sm bg-white"
            value={newItem.qty}
            onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
          />
        </div>
        <div className="col-span-4">
          <Select
            value={newItem.unitBaseId}
            onValueChange={(v) => setNewItem({ ...newItem, unitBaseId: v })}
            disabled={packagingVariantOptions.length === 0}
          >
            <SelectTrigger className="h-9 text-xs w-full bg-white">
              <SelectValue placeholder="Đơn vị..." />
            </SelectTrigger>
            <SelectContent>
              {packagingVariantOptions.map((variant) => (
                <SelectItem
                  key={variant.unitBase?.id ?? variant.unitBase?.name}
                  value={String(variant.unitBase?.id)}
                >
                  {variant.unitBase?.name || variant.packagingType?.name || ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-3">
          <Button
            type="button"
            size="sm"
            className="h-9 w-full p-0 bg-slate-900 hover:bg-slate-800 font-bold text-xs"
            onClick={handleAdd}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            THÊM
          </Button>
        </div>
      </div>
      {exceedsPackagingQuantity && (
        <p className="text-[11px] text-amber-600">
          Số lượng vượt quá định mức đóng gói ({maxPackagingQuantity}{" "}
          {selectedPackagingVariant?.unitBase?.name}/
          {selectedPackagingVariant?.packagingType?.name})
        </p>
      )}
    </div>
  );
}

export default function SimplePlanForm({
  formData,
  setFormData,
  regimens,
  handleDurationPartChange,
  handleAddMaterial,
  handleRemoveMaterial,
  handleComplete,
  goBack,
  completeLabel,
  regions,
  selectedEnterpriseId,
  selections,
  selectionSummary,
  handleGeographicalConfirm,
  isWorkflowContext,
  workflowInfo,
  growthCycles,
  personnel,
  supplyCatalog,
}: SimplePlanFormProps) {
  const [newStage, setNewStage] = useState("");
  const [removedGrowthCycleStages, setRemovedGrowthCycleStages] = useState<
    Set<string>
  >(new Set());

  const inheritedCycleIds = useMemo(
    () =>
      workflowInfo?.seasonIds?.length
        ? workflowInfo.seasonIds.map(String)
        : workflowInfo?.growthCycleSelections?.length
          ? Array.from(new Set(workflowInfo.growthCycleSelections.map((s) => s.cycleId)))
          : [],
    [workflowInfo],
  );
  const inheritedCycles = useMemo(
    () => growthCycles.filter((c) => inheritedCycleIds.includes(c.id)),
    [growthCycles, inheritedCycleIds],
  );
  const growthCycleSummary = useMemo(
    () =>
      inheritedCycles
        .map((cycle) => {
          const stageNames = formData.growthCycleSelections
            .filter((s) => s.cycleId === cycle.id)
            .map((s) => cycle.stages.find((st) => st.id === s.stageId)?.name)
            .filter((name): name is string => Boolean(name));
          return stageNames.length > 0
            ? { cycleName: cycle.name, items: stageNames }
            : null;
        })
        .filter(
          (group): group is { cycleName: string; items: string[] } =>
            group !== null,
        ),
    [inheritedCycles, formData.growthCycleSelections],
  );
  const isTreatmentOrAmendment =
    formData.purpose === "treatment" || formData.purpose === "amendment";
  const isCultivation = formData.purpose === "cultivation";
  const isHarvest = formData.purpose === "harvest";
  const isFacilityUpgrade = formData.purpose === "facility-upgrade";
  const derivesStagesFromGrowthCycle = isCultivation;

  // Keep `selectedStages` synced to the picked growth-cycle stage(s) (as
  // `${cycleId}:${stageName}` entries, mirroring how regimen steps are
  // prefixed with the regimen id) so users don't have to re-type stage
  // names by hand. Manually added items (no prefix) are left untouched, so
  // users can still layer extra items on top — as can regimen steps for
  // treatment/amendment, which use their own `${regimenId}:` prefix.
  const isGrowthCycleStageKey = (key: string) =>
    growthCycles.some((c) => key.startsWith(`${c.id}:`));

  useEffect(() => {
    if (!derivesStagesFromGrowthCycle) return;

    // Trust stages already returned by the plan API. Auto-fill from the
    // selected growth cycle only for a plan that currently has no stages;
    // otherwise the same API stages can be duplicated by this effect.
    if (
      formData.selectedStages.length > 0 &&
      !formData.selectedStages.some(isGrowthCycleStageKey)
    ) {
      return;
    }

    const derivedKeys = Array.from(
      new Set(
        formData.growthCycleSelections
          .map((s) => {
            const cycle = growthCycles.find((c) => c.id === s.cycleId);
            const stageIndex =
              cycle?.stages.findIndex((st) => st.id === s.stageId) ?? -1;
            return stageIndex >= 0
              ? {
                  key: `${cycle!.id}:${cycle!.stages[stageIndex].name}`,
                  order: stageIndex,
                }
              : null;
          })
          .filter((e): e is { key: string; order: number } => Boolean(e))
          .sort((a, b) => a.order - b.order)
          .map((e) => e.key)
          .filter((key) => !removedGrowthCycleStages.has(key)),
      ),
    );

    setFormData((prev) => {
      const existingGcKeys = prev.selectedStages.filter(isGrowthCycleStageKey);
      const unchanged =
        existingGcKeys.length === derivedKeys.length &&
        existingGcKeys.every((key, idx) => key === derivedKeys[idx]);
      if (unchanged) return prev;

      const removedKeys = existingGcKeys.filter(
        (k) => !derivedKeys.includes(k),
      );
      return {
        ...prev,
        selectedStages: [
          ...derivedKeys,
          ...prev.selectedStages.filter((s) => !isGrowthCycleStageKey(s)),
        ],
        materialAllocations: prev.materialAllocations.filter(
          (m) => !removedKeys.includes(m.stageId),
        ),
      };
    });
    // `formData.purpose` must stay a dependency even though
    // `derivesStagesFromGrowthCycle` already derives from it — switching
    // between two purposes that are both `true` for it (e.g. treatment ->
    // amendment) doesn't change that boolean, so without `purpose` here the
    // effect wouldn't re-run to restore `selectedStages` after the
    // purpose-switch handler resets it to `[]`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    derivesStagesFromGrowthCycle,
    formData.purpose,
    formData.growthCycleSelections,
    growthCycles,
    removedGrowthCycleStages,
  ]);

  const addStage = () => {
    const name = newStage.trim();
    if (!name || formData.selectedStages.includes(name)) return;
    setFormData((prev) => ({
      ...prev,
      selectedStages: [...prev.selectedStages, name],
    }));
    setNewStage("");
  };

  const removeStage = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedStages: prev.selectedStages.filter((s) => s !== name),
      materialAllocations: prev.materialAllocations.filter(
        (m) => m.stageId !== name,
      ),
    }));
  };

  const manualStages = formData.selectedStages.filter((s) => !s.includes(":"));
  const displayedItemStages = isCultivation
    ? formData.selectedStages
    : manualStages;
  const regimenStages = formData.selectedStages.filter((s) =>
    s.startsWith(`${formData.regimenId}:`),
  );
  const growthCycleDerivedStages = formData.selectedStages.filter(
    isGrowthCycleStageKey,
  );
  const availableGrowthCycleStagesMap = new Map<
    string,
    { key: string; name: string; cycleName: string }
  >();
  formData.growthCycleSelections.forEach((selection) => {
    const cycle = growthCycles.find((item) => item.id === selection.cycleId);
    const stage = cycle?.stages.find((item) => item.id === selection.stageId);
    if (!cycle || !stage) return;
    const key = `${cycle.id}:${stage.name}`;
    availableGrowthCycleStagesMap.set(key, {
      key,
      name: stage.name,
      cycleName: cycle.name,
    });
  });
  const availableGrowthCycleStages = Array.from(
    availableGrowthCycleStagesMap.values(),
  );

  const hasDuration = Boolean(
    formData.plannedDurationYears ||
    formData.plannedDurationMonths ||
    formData.plannedDurationDays,
  );
  const isValid =
    Boolean(formData.name) &&
    hasDuration &&
    (isTreatmentOrAmendment
      ? Boolean(formData.regimenId) || formData.selectedStages.length > 0
      : formData.selectedStages.length > 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 p-4 bg-blue-50 text-blue-900 rounded-lg border border-blue-100">
        <div className="bg-white p-2 rounded-full shadow-sm">
          <Sprout className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold">Chế độ đơn giản</h3>
          <p className="text-sm text-blue-700">
            Nhập nhanh những thông tin cần thiết nhất. Bạn có thể chuyển sang
            chế độ chi tiết để bổ sung công việc cụ thể sau.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label required>Tên kế hoạch</Label>
        <Input
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="VD: Bón phân đợt 1"
        />
      </div>

      <div className="space-y-2">
        <Label required>Thời gian dự kiến</Label>
        <div className="flex items-center gap-4 rounded-lg border px-4 shadow-sm">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              value={formData.plannedDurationYears}
              onChange={(e) =>
                handleDurationPartChange("years", e.target.value)
              }
              placeholder="0"
              className="w-16 h-9 border-0 bg-transparent px-0 text-center text-base shadow-none focus-visible:ring-0"
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">
              năm
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              value={formData.plannedDurationMonths}
              onChange={(e) =>
                handleDurationPartChange("months", e.target.value)
              }
              placeholder="0"
              className="w-16 h-9 border-0 bg-transparent px-0 text-center text-base shadow-none focus-visible:ring-0"
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">
              tháng
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              value={formData.plannedDurationDays}
              onChange={(e) => handleDurationPartChange("days", e.target.value)}
              placeholder="0"
              className="w-16 h-9 border-0 bg-transparent px-0 text-center text-base shadow-none focus-visible:ring-0"
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">
              ngày
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Mục đích kế hoạch</Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Mô tả ngắn gọn mục đích của kế hoạch..."
          rows={2}
        />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {PURPOSE_OPTIONS.map((type) => {
            const colors = PURPOSE_COLOR_CLASSES[type.color];
            const isActive = formData.purpose === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() =>
                  setFormData((prev) => {
                    if (prev.purpose === type.id) return prev;
                    // Planned work items are purpose-specific (growth-cycle
                    // stages for cultivation, regimen steps for treatment/
                    // amendment, free-typed for the rest) — switching
                    // purpose invalidates whatever was picked before.
                    return {
                      ...prev,
                      purpose: type.id as PlanFormData["purpose"],
                      selectedStages: [],
                      regimenId: "",
                      materialAllocations: [],
                      taskAllocations: [],
                    };
                  })
                }
                className={cn(
                  "cursor-pointer p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-1",
                  isActive
                    ? `${colors.border} ${colors.bg} ${colors.text} shadow-sm`
                    : "border-slate-100 bg-white hover:border-slate-200",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    isActive
                      ? `${colors.active} text-white`
                      : "bg-slate-50 text-slate-400",
                  )}
                >
                  <type.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight">
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label required={!isWorkflowContext}>Vùng canh tác</Label>
          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full font-semibold">
            {isWorkflowContext
              ? `Kế thừa từ quy trình${workflowInfo?.name ? ` "${workflowInfo.name}"` : ""}`
              : "Chọn 1 khu vực/lô từ sơ đồ ban đầu"}
          </span>
        </div>
        <div className="space-y-3">
          {!isWorkflowContext && (
            <GeographicalSelector
              regions={regions || []}
              enterpriseId={selectedEnterpriseId}
              existingSelections={selections}
              onConfirm={handleGeographicalConfirm}
            />
          )}

          {selectionSummary.length > 0 && (
            <div className="p-4 rounded-xl bg-white/50 border border-emerald-100/50 space-y-3">
              <div className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-3 h-3" />
                Phạm vi đã chọn
              </div>
              <div className="space-y-3">
                {selectionSummary.map((group) => (
                  <div key={group.regionId} className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                      <div className="w-1 h-1 rounded-full bg-emerald-500" />
                      {group.regionName}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pl-2.5">
                      {group.items.map((item, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className={cn(
                            "text-[10px] py-0 px-2 h-5 font-medium border-emerald-100 shadow-sm",
                            item.type === "region"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.type === "area"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "bg-white text-slate-600 border-slate-200",
                          )}
                        >
                          <span className="opacity-70 mr-1 uppercase text-[8px] font-black">
                            {item.type === "region"
                              ? "Vùng"
                              : item.type === "area"
                                ? "Khu"
                                : "Lô"}
                          </span>
                          {item.name}
                          {item.parentName && (
                            <span className="ml-1 opacity-50 font-normal italic">
                              ({item.parentName})
                            </span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isWorkflowContext && selectionSummary.length === 0 && (
            <p className="text-xs text-emerald-800/60 italic text-center py-2">
              Quy trình chưa có vùng canh tác được thiết lập
            </p>
          )}
        </div>
      </div>

      {isWorkflowContext && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Chu kỳ sinh trưởng</Label>
            <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full font-semibold">
              {inheritedCycles.length === 0
                ? "Chưa thiết lập ở quy trình"
                : inheritedCycles.length === 1
                  ? `Kế thừa từ quy trình "${inheritedCycles[0].name}"`
                  : `Kế thừa ${inheritedCycles.length} chu kỳ từ quy trình`}
            </span>
          </div>
          {inheritedCycles.length > 0 ? (
            <GrowthCycleSelector
              growthCycles={growthCycles}
              lockedCycleIds={inheritedCycleIds}
              existingSelections={formData.growthCycleSelections}
              onConfirm={(nextSelections) =>
                setFormData((prev) => ({
                  ...prev,
                  growthCycleSelections: nextSelections,
                }))
              }
            />
          ) : (
            <p className="text-xs text-emerald-800/60 italic text-center py-2">
              Quy trình chưa thiết lập chu kỳ sinh trưởng
            </p>
          )}

          {growthCycleSummary.length > 0 && (
            <div className="p-4 rounded-xl bg-white/50 border border-emerald-100/50 space-y-3">
              <div className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-widest flex items-center gap-2">
                <Sprout className="w-3 h-3" />
                Giai đoạn đã chọn
              </div>
              <div className="space-y-3">
                {growthCycleSummary.map((group) => (
                  <div key={group.cycleName} className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                      <div className="w-1 h-1 rounded-full bg-emerald-500" />
                      {group.cycleName}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pl-2.5">
                      {group.items.map((label, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-[10px] py-0 px-2 h-5 font-medium border-emerald-100 shadow-sm bg-emerald-100 text-emerald-800"
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <Label>Nhân sự phụ trách</Label>
        <div className="grid gap-4">
          <PersonnelMultiSelectCard
            title="Nhân sự quản lý"
            description="Người phụ trách theo dõi và điều phối kế hoạch"
            selectedIds={formData.managementPersonnelIds}
            personnel={personnel}
            onChange={(ids) =>
              setFormData((prev) => ({
                ...prev,
                managementPersonnelIds: ids,
              }))
            }
            tone="blue"
            emptyText="Chưa chọn nhân sự quản lý"
          />
          <PersonnelMultiSelectCard
            title="Nhân sự kiểm định chất lượng"
            description="Người chịu trách nhiệm kiểm tra và xác nhận chất lượng"
            selectedIds={formData.qualityInspectorPersonnelIds}
            personnel={personnel}
            onChange={(ids) =>
              setFormData((prev) => ({
                ...prev,
                qualityInspectorPersonnelIds: ids,
              }))
            }
            tone="violet"
            emptyText="Chưa chọn nhân sự kiểm định"
          />
        </div>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Danh sách hạng mục
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {isCultivation
              ? "Các hạng mục được điền sẵn từ quy trình. Bạn có thể chọn, xoá hoặc thêm hạng mục mới."
              : "Hạng mục phác đồ được điền sẵn. Giai đoạn áp dụng là lựa chọn bổ sung cho kế hoạch này."}
          </p>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 bg-slate-50 text-slate-600"
        >
          {formData.selectedStages.length} mục đã chọn
        </Badge>
      </div>
      <Card className="border-slate-200 shadow-sm rounded-2xl">
        <CardContent className="space-y-4 p-4">
          {isTreatmentOrAmendment && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label required>
                  {formData.purpose === "treatment"
                    ? "Phác đồ điều trị"
                    : "Phác đồ cải tạo đất"}
                </Label>
                {formData.regimenId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        regimenId: "",
                        selectedStages: prev.selectedStages.filter(
                          (stage) => !stage.startsWith(`${prev.regimenId}:`),
                        ),
                      }))
                    }
                    className="h-7 text-[10px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg px-2"
                  >
                    XÓA PHÁC ĐỒ
                  </Button>
                )}
              </div>
              <RegimenSelector
                regimens={regimens}
                selectedRegimenId={formData.regimenId}
                type={formData.purpose as "treatment" | "amendment"}
                onSelect={(regimen) => {
                  const stages =
                    regimen.steps && regimen.steps.length > 0
                      ? regimen.steps.map(
                          (step) => `${regimen.id}:${step.title}`,
                        )
                      : [`${regimen.id}:${regimen.name}`];
                  setFormData((prev) => ({
                    ...prev,
                    regimenId: regimen.id,
                    selectedStages: [
                      // Drop only the *previous* regimen's own steps — manual
                      // entries and growth-cycle-derived stages (which also
                      // contain a ":") must survive picking a new regimen.
                      ...prev.selectedStages.filter(
                        (stage) => !stage.startsWith(`${prev.regimenId}:`),
                      ),
                      ...stages,
                    ],
                  }));
                }}
              />
              {formData.regimenId && regimenStages.length > 0 && (
                <div className="flex flex-col gap-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  {regimenStages.map((stage, index) => (
                    <div
                      key={stage}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-xs text-slate-500">
                        {index + 1}
                      </span>
                      {stage.split(":").slice(1).join(":")}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {isTreatmentOrAmendment && availableGrowthCycleStages.length > 0 && (
            <div className="space-y-3 pt-4">
              <div>
                <Label className="text-xs font-bold text-slate-700">
                  Giai đoạn áp dụng (tuỳ chọn)
                </Label>
                <p className="mt-1 text-[11px] text-slate-500">
                  Tick chọn các giai đoạn cần áp dụng thêm.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {availableGrowthCycleStages.map((stage) => (
                  <label
                    key={stage.key}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700"
                  >
                    <Checkbox
                      checked={formData.selectedStages.includes(stage.key)}
                      onCheckedChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          selectedStages: value
                            ? [...prev.selectedStages, stage.key]
                            : prev.selectedStages.filter(
                                (item) => item !== stage.key,
                              ),
                        }))
                      }
                    />
                    <span>
                      <span className="block">{stage.name}</span>
                      <span className="block text-[11px] font-normal text-slate-400">
                        {stage.cycleName}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {!isCultivation && growthCycleDerivedStages.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {growthCycleDerivedStages.map((stage, index) => (
                <div
                  key={stage}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-xs text-slate-500">
                    {index + 1}
                  </span>
                  <span className="flex-1">
                    {stage.split(":").slice(1).join(":")}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setRemovedGrowthCycleStages((prev) =>
                        new Set(prev).add(stage),
                      );
                      removeStage(stage);
                    }}
                    className="h-7 w-7 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 pt-4">
            {!isCultivation && !isHarvest && !isFacilityUpgrade && <div className="flex items-center justify-between">
              <Label
                required={
                  !isTreatmentOrAmendment &&
                  !(isCultivation && growthCycleDerivedStages.length > 0)
                }
              >
                Thêm hạng mục mới
              </Label>
              <Badge
                variant="outline"
                className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 font-bold"
              >
                {manualStages.length} mục
              </Badge>
            </div>}
            <div className="flex gap-2">
              <Input
                placeholder="Thêm hạng mục mới..."
                value={newStage}
                onChange={(e) => setNewStage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addStage();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addStage}
                className="h-11 rounded-xl px-5 text-xs font-bold"
              >
                Thêm
              </Button>
            </div>
            {displayedItemStages.length > 0 && (
              <div className="grid gap-2 sm:grid-cols-2">
                {displayedItemStages.map((stage, index) => (
                  <div
                    key={stage}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-xs text-slate-500">
                      {index + 1}
                    </span>
                    <span className="flex-1">
                      {stage.includes(":")
                        ? stage.split(":").slice(1).join(":")
                        : stage}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (isCultivation && isGrowthCycleStageKey(stage)) {
                          setRemovedGrowthCycleStages((prev) =>
                            new Set(prev).add(stage),
                          );
                        }
                        removeStage(stage);
                      }}
                      className="h-7 w-7 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {formData.selectedStages.length > 0 && (
        <div className="space-y-3">
          <Label>Chọn vật tư / ước lượng theo hạng mục</Label>
          <div className="space-y-2">
            {formData.selectedStages.map((stageKey, idx) => {
              const stageName = stageKey.includes(":")
                ? stageKey.split(":").slice(1).join(":")
                : stageKey;
              const materialCount = formData.materialAllocations.filter(
                (m) => m.stageId === stageKey,
              ).length;

              return (
                <div
                  key={stageKey}
                  className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-4 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">
                      {idx + 1}
                    </span>
                    <span className="flex-1 truncate font-bold text-sm text-slate-800">
                      {stageName}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 whitespace-nowrap">
                      <Link2 className="h-3.5 w-3.5" /> {materialCount} vật tư
                    </span>
                    <button
                      type="button"
                      onClick={() => removeStage(stageKey)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="border-t border-slate-100 p-4">
                    <StageMaterialPicker
                      stageKey={stageKey}
                      allocations={formData.materialAllocations.filter(
                        (m) => m.stageId === stageKey,
                      )}
                      onAddMaterial={handleAddMaterial}
                      onRemoveMaterial={handleRemoveMaterial}
                      supplyCatalog={supplyCatalog}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Card className="bg-amber-50/50 border-amber-100">
        <CardContent className="p-4 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Chế độ đơn giản không phân bổ công việc chi tiết theo từng giai
            đoạn. Chuyển sang chế độ chi tiết bất cứ lúc nào để bổ sung công
            việc cụ thể.
          </p>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 left-0 right-0 flex items-center justify-between gap-3 bg-white/95 backdrop-blur border-t border-slate-100 pt-4 pb-2 -mx-4 px-4">
        <Button type="button" variant="outline" onClick={goBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <Button
          type="button"
          disabled={!isValid}
          onClick={handleComplete}
          className="font-bold"
        >
          {completeLabel}
        </Button>
      </div>
    </div>
  );
}
