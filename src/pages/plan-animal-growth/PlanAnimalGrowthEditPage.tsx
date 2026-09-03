import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  StepperForm,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  cn,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Apple,
  ArrowLeft,
  Bug,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Leaf,
  MapPin,
  Package,
  Sprout,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import GeographicalSelector from "./components/GeographicalSelector";
import GrowthCycleSelector from "../plan-growth/components/GrowthCycleSelector";
import { PersonnelMultiSelectCard } from "./components/PersonnelMultiSelectCard";
import { RegimenSelector } from "./components/RegimenSelector";
import SimplePlanForm from "./components/SimplePlanForm";
import { StageAllocation } from "./components/StageAllocation";
import { useAnimalSupplyCatalog } from "./hooks/useAnimalSupplyCatalog";
import { useAnimalGrowthForm } from "./hooks/useAnimalGrowthForm";

interface PlanAnimalGrowthEditPageProps {
  basePath?: string;
  onSaved?: (planId: number) => void;
  onCancel?: () => void;
}
export default function PlanAnimalGrowthEditPage({
  basePath = "/plan-animal-growth",
  onSaved,
  onCancel,
}: PlanAnimalGrowthEditPageProps) {
  const {
    plan,
    formData,
    setFormData,
    selections,
    selectedEnterpriseId,
    seasons,
    personnel,
    regions,
    regimens,
    growthCycles,
    isWorkflowContext,
    workflowInfo,
    selectionSummary,
    summarizeTaskSelections: getTaskSelectionSummary,
    handleSeasonChange,
    handleDurationPartChange,
    handleGeographicalConfirm,
    handleAddMaterial,
    handleRemoveMaterial,
    handleAddTask,
    handleRemoveTask,
    handleComplete,
    goBack,
    pageTitle,
    pageDescription,
    completeLabel,
  } = useAnimalGrowthForm("edit", basePath, { onSaved, onCancel });
  const supplyCatalog = useAnimalSupplyCatalog();

  const inheritedCycleIds = workflowInfo?.seasonIds?.length
    ? workflowInfo.seasonIds.map(String)
    : workflowInfo?.growthCycleSelections?.length
      ? Array.from(new Set(workflowInfo.growthCycleSelections.map((s) => s.cycleId)))
      : [];
  const inheritedCycles = growthCycles.filter((c) =>
    inheritedCycleIds.includes(c.id),
  );
  const growthCycleSummary = inheritedCycles
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
    );

  const [newManualStage, setNewManualStage] = useState("");
  const [removedGrowthCycleStages, setRemovedGrowthCycleStages] = useState<
    Set<string>
  >(new Set());
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const purpose = formData.purpose as string;
  const isTreatmentOrAmendment =
    purpose === "treatment" || purpose === "amendment";
  const isHarvest = purpose === "harvest";
  const isCultivation = purpose === "cultivation";
  const isFacilityUpgrade = purpose === "facility-upgrade";
  // Only cultivation automatically turns picked growth-cycle stages into
  // planned work items. Treatment/amendment stages remain optional checkboxes.
  const derivesStagesFromGrowthCycle = isCultivation;

  // Keep `selectedStages` synced to the picked growth-cycle stage(s) (as
  // `${cycleId}:${stageName}` entries, the same key shape the
  // "resources"/"confirmation" steps below already expect in order to look
  // up and badge the owning cycle — mirroring how regimen steps are
  // prefixed with the regimen id) so users don't have to re-type stage
  // names by hand. Manually added items and regimen steps are left untouched.
  const isGrowthCycleStageKey = (key: string) =>
    growthCycles.some((c) => key.startsWith(`${c.id}:`));

  useEffect(() => {
    if (!derivesStagesFromGrowthCycle) return;

    // On edit, the API's `stages` list is authoritative. Only generate
    // stage rows from the selected Season when the plan has no stages yet;
    // otherwise this effect must not append/replace API rows and create
    // duplicate items with the same name.
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

  // Regimen items are always included automatically. Growth-cycle stages for
  // treatment/amendment are intentionally handled by checkboxes in the UI.
  useEffect(() => {
    if (!isTreatmentOrAmendment || !formData.regimenId) return;
    const regimen = regimens.find((item) => item.id === formData.regimenId);
    if (!regimen) return;
    const regimenKeys = regimen.steps?.length
      ? regimen.steps.map(
          (step: { title: string }) => `${regimen.id}:${step.title}`,
        )
      : [`${regimen.id}:${regimen.name}`];
    setFormData((prev) => {
      const withoutRegimenItems = prev.selectedStages.filter(
        (stage) => !stage.startsWith(`${prev.regimenId}:`),
      );
      const nextStages = [...withoutRegimenItems, ...regimenKeys];
      return nextStages.length === prev.selectedStages.length &&
        nextStages.every((stage, index) => stage === prev.selectedStages[index])
        ? prev
        : { ...prev, selectedStages: nextStages };
    });
  }, [formData.regimenId, isTreatmentOrAmendment, regimens, setFormData]);

  const manualSelectedStages = formData.selectedStages.filter(
    (stage) => !stage.includes(":"),
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

  const selectedRegimen = regimens.find(
    (item) => item.id === formData.regimenId,
  );
  const regimenStageTitles: string[] = selectedRegimen?.steps?.length
    ? selectedRegimen.steps.map((step: { title: string }) => step.title)
    : selectedRegimen
      ? [selectedRegimen.name]
      : [];

  const purposeOptions = [
    {
      id: "cultivation",
      label: "Chăn nuôi",
      icon: Layers,
      borderColor: "border-blue-500",
      bgColor: "bg-blue-50/50",
      activeColor: "bg-blue-500",
      textColor: "text-blue-700",
      description: "Sử dụng quy trình chuẩn",
    },
    {
      id: "facility-upgrade",
      label: "Nâng cấp cơ sở vật chất",
      icon: Wrench,
      borderColor: "border-slate-500",
      bgColor: "bg-slate-50/80",
      activeColor: "bg-slate-700",
      textColor: "text-slate-700",
      description: "Nhập hạng mục công việc dự kiến",
    },
    {
      id: "treatment",
      label: "Điều trị",
      icon: Bug,
      borderColor: "border-red-500",
      bgColor: "bg-red-50/50",
      activeColor: "bg-red-500",
      textColor: "text-red-700",
      description: "Áp dụng phác đồ xử lý",
    },
    {
      id: "amendment",
      label: "Cải tạo chuồng trại",
      icon: Sprout,
      borderColor: "border-green-500",
      bgColor: "bg-green-50/50",
      activeColor: "bg-green-500",
      textColor: "text-green-700",
      description: "Xử lý và phục hồi",
    },
    {
      id: "harvest",
      label: "Xuất bán",
      icon: Apple,
      borderColor: "border-orange-500",
      bgColor: "bg-orange-50/50",
      activeColor: "bg-orange-500",
      textColor: "text-orange-700",
      description: "Nhập hạng mục dự kiến",
    },
  ] as const;

  const purposeSelector = (
    <div className="space-y-4">
      <Label className="text-base font-bold text-slate-800">
        Nhóm công việc
      </Label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {purposeOptions.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                purpose: type.id as any,
                selectedStages: [],
                regimenId:
                  type.id === "treatment" || type.id === "amendment"
                    ? prev.regimenId
                    : "",
              }));
            }}
            className={cn(
              "cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1 group relative overflow-hidden",
              formData.purpose === type.id
                ? `${type.borderColor} ${type.bgColor} ${type.textColor} shadow-md`
                : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm",
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform",
                formData.purpose === type.id
                  ? `${type.activeColor} text-white`
                  : "bg-slate-50 text-slate-400",
              )}
            >
              <type.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-tight">
              {type.label}
            </span>
            <span className="text-[10px] opacity-60 font-medium">
              {type.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const steps: Step[] = [
    {
      id: "general",
      title: "Thông tin chung",
      description: isWorkflowContext ? "Thời gian" : "Lứa nuôi và thời gian",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4 p-4 bg-blue-50 text-blue-900 rounded-lg border border-blue-100">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <Sprout className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Chỉnh sửa kế hoạch</h3>
              <p className="text-sm text-blue-700">
                Chọn lứa nuôi, nhập thời gian dự kiến và đặt tên cho kế hoạch của
                bạn.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {!isWorkflowContext && (
              <div className="space-y-2">
                <Label required>Lứa nuôi</Label>
                <Select
                  value={formData.seasonId}
                  onValueChange={handleSeasonChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lứa nuôi..." />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label required>Tên kế hoạch</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Kế hoạch Đông Xuân"
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
                    onChange={(e) =>
                      handleDurationPartChange("days", e.target.value)
                    }
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
              <Label>Mô tả</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          {purposeSelector}
        </div>
      ),
      isValid:
        (isWorkflowContext || !!formData.seasonId) &&
        !!formData.name &&
        Boolean(
          formData.plannedDurationYears ||
          formData.plannedDurationMonths ||
          formData.plannedDurationDays,
        ),
    },
    {
      id: "scope",
      title: "Phạm vi chăn nuôi & sản xuất",
      description: "Chọn vùng và nhân sự",
      content: (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                    1
                  </span>
                  Phạm vi chăn nuôi & sản xuất
                </h3>
                <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-sm space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                        Vùng chăn nuôi{" "}
                        {!isWorkflowContext && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full font-semibold">
                        {isWorkflowContext
                          ? `Kế thừa từ quy trình${workflowInfo?.name ? ` "${workflowInfo.name}"` : ""}`
                          : "Chọn 1 khu vực/lô từ sơ đồ ban đầu"}
                      </span>
                    </div>
                    {!isWorkflowContext && (
                      <GeographicalSelector
                        regions={regions || []}
                        enterpriseId={selectedEnterpriseId}
                        existingSelections={selections}
                        onConfirm={handleGeographicalConfirm}
                      />
                    )}

                    {selectionSummary.length > 0 && (
                      <div className="mt-4 p-4 rounded-xl bg-white/50 border border-emerald-100/50 space-y-3">
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
                        Quy trình chưa có vùng chăn nuôi được thiết lập
                      </p>
                    )}
                  </div>

                  {isWorkflowContext && (
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                        Giai đoạn sinh trưởng
                      </label>

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
                        <div className="mt-4 p-4 rounded-xl bg-white/50 border border-emerald-100/50 space-y-3">
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
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                    2
                  </span>
                  Nhân sự phụ trách
                </h3>
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

              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">
                  Ghi chú phạm vi
                </Label>
                <Textarea
                  placeholder="Nhập ghi chú phạm vi..."
                  value={formData.scopeNote}
                  onChange={(e) =>
                    setFormData({ ...formData, scopeNote: e.target.value })
                  }
                  className="bg-white"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  Tóm tắt phạm vi đã chọn
                </h3>
                <div className="bg-linear-to-br from-emerald-600 to-teal-700 p-6 rounded-3xl text-white shadow-xl space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-1">
                        Khu vực chăn nuôi
                      </p>
                      <h4 className="text-xl font-black leading-tight">
                        {selectionSummary
                          .map((group) => group.regionName)
                          .join(", ") || "Chưa chọn vùng"}
                      </h4>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectionSummary.flatMap((group) =>
                          group.items.map((item, idx) => (
                            <Badge
                              key={`${group.regionId}-${item.type}-${item.id}-${idx}`}
                              variant="secondary"
                              className={cn(
                                "bg-white/20 text-white border-transparent text-[10px] h-5",
                                item.type === "region"
                                  ? "bg-emerald-100/25"
                                  : item.type === "area"
                                    ? "bg-blue-100/20"
                                    : "bg-white/15",
                              )}
                            >
                              {item.name}
                            </Badge>
                          )),
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                      <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-2">
                        Nhân sự quản lý
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.managementPersonnelIds.length > 0 ? (
                          formData.managementPersonnelIds.map((id) => {
                            const person = personnel.find(
                              (item) => String(item.id) === String(id),
                            );
                            return person ? (
                              <Badge
                                key={id}
                                variant="secondary"
                                className="bg-white/20 text-white border-transparent text-[10px] h-5"
                              >
                                {person.fullName}
                              </Badge>
                            ) : null;
                          })
                        ) : (
                          <span className="text-xs text-white/60">---</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                      <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-2">
                        Kiểm định chất lượng
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.qualityInspectorPersonnelIds.length > 0 ? (
                          formData.qualityInspectorPersonnelIds.map((id) => {
                            const person = personnel.find(
                              (item) => String(item.id) === String(id),
                            );
                            return person ? (
                              <Badge
                                key={id}
                                variant="secondary"
                                className="bg-white/20 text-white border-transparent text-[10px] h-5"
                              >
                                {person.fullName}
                              </Badge>
                            ) : null;
                          })
                        ) : (
                          <span className="text-xs text-white/60">---</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {formData.scopeNote.trim() && (
                    <p className="text-sm text-emerald-50/80 leading-relaxed italic">
                      {formData.scopeNote}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      isValid: selectionSummary.length > 0,
    },
    {
      id: "process",
      title: "Quy trình & Giai đoạn",
      description: "Chọn hạng mục triển khai",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-6">
            <div className="space-y-5 animation-slide-up rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Danh sách hạng mục dự kiến
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

              {isTreatmentOrAmendment && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-700">
                      {purpose === "treatment"
                        ? "Phác đồ điều trị"
                        : "Phác đồ cải tạo chuồng trại"}
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
                              (stage) =>
                                !stage.startsWith(`${prev.regimenId}:`),
                            ),
                          }))
                        }
                        className="h-7 px-2 text-[10px] font-bold text-red-500 hover:bg-red-50"
                      >
                        Xoá phác đồ
                      </Button>
                    )}
                  </div>
                  <RegimenSelector
                    regimens={regimens}
                    selectedRegimenId={formData.regimenId}
                    type={formData.purpose as "treatment" | "amendment"}
                    onSelect={(regimen) => {
                      const regimenStages = regimen.steps?.length
                        ? regimen.steps.map(
                            (step) => `${regimen.id}:${step.title}`,
                          )
                        : [`${regimen.id}:${regimen.name}`];
                      setFormData((prev) => ({
                        ...prev,
                        regimenId: regimen.id,
                        selectedStages: [
                          ...prev.selectedStages.filter(
                            (stage) => !stage.startsWith(`${prev.regimenId}:`),
                          ),
                          ...regimenStages,
                        ],
                      }));
                    }}
                  />
                  {regimenStageTitles.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {regimenStageTitles.map((title, index) => (
                        <div
                          key={`${formData.regimenId}:${title}`}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-xs text-slate-500">
                            {index + 1}
                          </span>
                          <span className="line-clamp-2">{title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {isTreatmentOrAmendment &&
                availableGrowthCycleStages.length > 0 && (
                  <div className="space-y-3 border-t border-dashed border-slate-200 pt-5">
                    <div>
                      <Label className="text-xs font-bold text-slate-700">
                        Giai đoạn áp dụng (tuỳ chọn)
                      </Label>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Tick chọn các giai đoạn cần áp dụng thêm.
                      </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {availableGrowthCycleStages.map((stage) => {
                        const checked = formData.selectedStages.includes(
                          stage.key,
                        );
                        return (
                          <label
                            key={stage.key}
                            className={cn(
                              "flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300",
                            )}
                          >
                            <Checkbox
                              checked={checked}
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
                              <span className="block font-semibold">
                                {stage.name}
                              </span>
                              <span className="block text-[11px] text-slate-400">
                                {stage.cycleName}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

              {isTreatmentOrAmendment && (
                <div className="space-y-4 border-t border-dashed border-slate-200 pt-4">
                  <div className="flex gap-2">
                    <Input
                      value={newManualStage}
                      onChange={(event) =>
                        setNewManualStage(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key !== "Enter") return;
                        event.preventDefault();
                        const name = newManualStage.trim();
                        if (!name || formData.selectedStages.includes(name))
                          return;
                        setFormData((prev) => ({
                          ...prev,
                          selectedStages: [...prev.selectedStages, name],
                        }));
                        setNewManualStage("");
                      }}
                      placeholder="Thêm hạng mục mới..."
                      className="h-11 rounded-xl border-slate-200"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const name = newManualStage.trim();
                        if (!name || formData.selectedStages.includes(name))
                          return;
                        setFormData((prev) => ({
                          ...prev,
                          selectedStages: [...prev.selectedStages, name],
                        }));
                        setNewManualStage("");
                      }}
                      className="h-11 rounded-xl px-5 text-xs font-bold"
                    >
                      Thêm
                    </Button>
                  </div>
                  {newManualStage.trim() &&
                    formData.selectedStages.includes(newManualStage.trim()) && (
                      <p className="text-xs text-amber-600">
                        Hạng mục này đã có trong danh sách.
                      </p>
                    )}
                  {manualSelectedStages.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {manualSelectedStages.map((stage, index) => (
                        <div
                          key={stage}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-xs text-slate-500">
                            {index + 1}
                          </span>
                          <span className="flex-1">{stage}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                selectedStages: prev.selectedStages.filter(
                                  (item) => item !== stage,
                                ),
                              }))
                            }
                            className="h-7 w-7 shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {isCultivation && (
                <div className="space-y-4">
                  <div className="flex gap-2 border-t border-dashed border-slate-200 pt-4">
                    <Input
                      placeholder="Thêm hạng mục mới..."
                      value={newManualStage}
                      onChange={(event) =>
                        setNewManualStage(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          const name = newManualStage.trim();
                          if (name && !formData.selectedStages.includes(name)) {
                            setFormData((prev) => ({
                              ...prev,
                              selectedStages: [...prev.selectedStages, name],
                            }));
                            setNewManualStage("");
                          }
                        }
                      }}
                      className="h-11 rounded-xl border-slate-200"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const name = newManualStage.trim();
                        if (name && !formData.selectedStages.includes(name)) {
                          setFormData((prev) => ({
                            ...prev,
                            selectedStages: [...prev.selectedStages, name],
                          }));
                          setNewManualStage("");
                        }
                      }}
                      className="h-11 rounded-xl px-5 text-xs font-bold"
                    >
                      Thêm
                    </Button>
                  </div>
                  {formData.selectedStages.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {formData.selectedStages.map((stageKey, index) => {
                        const stage = availableGrowthCycleStages.find(
                          (item) => item.key === stageKey,
                        );
                        const name =
                          stage?.name ||
                          stageKey.split(":").slice(1).join(":") ||
                          stageKey;
                        return (
                          <div
                            key={stageKey}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-xs text-slate-500">
                              {index + 1}
                            </span>
                            <span className="flex-1">{name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (isGrowthCycleStageKey(stageKey)) {
                                  setRemovedGrowthCycleStages((prev) =>
                                    new Set(prev).add(stageKey),
                                  );
                                }
                                setFormData((prev) => ({
                                  ...prev,
                                  selectedStages: prev.selectedStages.filter(
                                    (item) => item !== stageKey,
                                  ),
                                  materialAllocations:
                                    prev.materialAllocations.filter(
                                      (item) => item.stageId !== stageKey,
                                    ),
                                }));
                              }}
                              className="h-7 w-7 shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {isFacilityUpgrade && (
                <div className="space-y-3">
                  <div className="flex gap-2 border-t border-dashed border-slate-200 pt-4">
                    <Input
                      value={newManualStage}
                      onChange={(event) =>
                        setNewManualStage(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key !== "Enter") return;
                        event.preventDefault();
                        const name = newManualStage.trim();
                        if (!name || formData.selectedStages.includes(name))
                          return;
                        setFormData((prev) => ({
                          ...prev,
                          selectedStages: [...prev.selectedStages, name],
                        }));
                        setNewManualStage("");
                      }}
                      placeholder="Thêm hạng mục mới..."
                      className="h-11 rounded-xl border-slate-200"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const name = newManualStage.trim();
                        if (!name || formData.selectedStages.includes(name))
                          return;
                        setFormData((prev) => ({
                          ...prev,
                          selectedStages: [...prev.selectedStages, name],
                        }));
                        setNewManualStage("");
                      }}
                      className="h-11 rounded-xl px-5 text-xs font-bold"
                    >
                      Thêm
                    </Button>
                  </div>
                  {newManualStage.trim() &&
                    formData.selectedStages.includes(newManualStage.trim()) && (
                      <p className="text-xs text-amber-600">
                        Hạng mục này đã có trong danh sách.
                      </p>
                    )}
                  {formData.selectedStages.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {formData.selectedStages.map((stage, index) => (
                        <div
                          key={stage}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-xs text-slate-500">
                            {index + 1}
                          </span>
                          <span className="flex-1">{stage}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                selectedStages: prev.selectedStages.filter(
                                  (item) => item !== stage,
                                ),
                              }))
                            }
                            className="h-7 w-7 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {isHarvest && (
                <div className="space-y-4 border-t border-dashed border-slate-200 pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Thêm hạng mục mới..."
                      value={newManualStage}
                      onChange={(event) =>
                        setNewManualStage(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key !== "Enter") return;
                        event.preventDefault();
                        const name = newManualStage.trim();
                        if (!name || formData.selectedStages.includes(name))
                          return;
                        setFormData((prev) => ({
                          ...prev,
                          selectedStages: [...prev.selectedStages, name],
                        }));
                        setNewManualStage("");
                      }}
                      className="h-11 rounded-xl border-slate-200"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const name = newManualStage.trim();
                        if (!name || formData.selectedStages.includes(name))
                          return;
                        setFormData((prev) => ({
                          ...prev,
                          selectedStages: [...prev.selectedStages, name],
                        }));
                        setNewManualStage("");
                      }}
                      className="h-11 rounded-xl px-5 text-xs font-bold"
                    >
                      Thêm
                    </Button>
                  </div>
                  {formData.selectedStages.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {formData.selectedStages.map((stage, index) => (
                        <div
                          key={stage}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-xs text-slate-500">
                            {index + 1}
                          </span>
                          <span className="flex-1">{stage}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                selectedStages: prev.selectedStages.filter(
                                  (item) => item !== stage,
                                ),
                              }))
                            }
                            className="h-7 w-7 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      isValid:
        formData.purpose === "harvest"
          ? true
          : formData.purpose === "treatment" || formData.purpose === "amendment"
            ? !!formData.regimenId || formData.selectedStages.length > 0
            : formData.selectedStages.length > 0,
    },
    {
      id: "resources",
      title:
        formData.purpose === "harvest"
          ? "Vật tư - Nhân sự & cách thức"
          : formData.purpose === "cultivation"
            ? "Phân bổ & Công việc"
            : formData.purpose === "amendment"
              ? "Vật tư & Nhân lực"
              : "Vật tư & Phác đồ",
      description: "Hoạch định nguồn lực chi tiết",
      content: (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              {formData.purpose === "harvest"
                ? "Cách thức & Nguồn lực Xuất bán"
                : formData.purpose === "cultivation"
                  ? "Định mức Vật tư & Giai đoạn"
                  : formData.purpose === "amendment"
                    ? "Vật tư & Công việc Cải tạo"
                    : "Vật tư & Công việc Điều trị"}
            </h3>
            <p className="text-slate-500 text-sm mt-1 max-w-lg mx-auto">
              {formData.purpose === "harvest"
                ? "Thiết lập các yêu cầu về vật tư, nhân sự và mô tả cách thức triển khai xuất bán."
                : formData.purpose === "cultivation"
                  ? "Thiết lập chi tiết các hạng mục đầu tư và quy trình kỹ thuật cho từng giai đoạn của lứa nuôi."
                  : formData.purpose === "amendment"
                    ? "Phân bổ vật tư và công việc cụ thể để thực hiện quy trình cải tạo chuồng trại đã chọn."
                    : "Phân bổ vật tư và công việc cụ thể để thực hiện phác đồ điều trị đã chọn."}
            </p>
          </div>

          <div className="space-y-4">
            {formData.purpose === "harvest" ? (
              <div className="animation-slide-up">
                <StageAllocation
                  isDetail={false}
                  index={0}
                  stageName="Xuất bán"
                  cycleName="Kế hoạch xuất bán"
                  allocations={formData.materialAllocations.filter(
                    (m) => m.stageId === "Xuất bán",
                  )}
                  tasks={formData.taskAllocations.filter(
                    (t) => t.stageId === "Xuất bán",
                  )}
                  regions={regions}
                  masterSelections={selections}
                  enterpriseId={selectedEnterpriseId}
                  onAddMaterial={(item) =>
                    handleAddMaterial({ ...item, stageId: "Xuất bán" })
                  }
                  onRemoveMaterial={handleRemoveMaterial}
                  onAddTask={(item) =>
                    handleAddTask({ ...item, stageId: "Xuất bán" })
                  }
                  onRemoveTask={handleRemoveTask}
                  supplyCatalog={supplyCatalog}
                />
              </div>
            ) : (
              formData.selectedStages.map((stageKey, idx) => {
                const [cycleId, stageName] = stageKey.includes(":")
                  ? stageKey.split(":")
                  : [null, stageKey];

                const cycleName = cycleId
                  ? growthCycles.find((c) => c.id === cycleId)?.name ||
                    regimens.find((r) => r.id === cycleId)?.name
                  : null;

                return (
                  <StageAllocation
                    isDetail={false}
                    key={idx}
                    stageName={stageName}
                    cycleName={cycleName}
                    index={idx}
                    allocations={formData.materialAllocations.filter(
                      (m) => m.stageId === stageKey,
                    )}
                    tasks={formData.taskAllocations.filter(
                      (t) => t.stageId === stageKey,
                    )}
                    regions={regions}
                    masterSelections={selections}
                    enterpriseId={selectedEnterpriseId}
                    onAddMaterial={(item) =>
                      handleAddMaterial({ ...item, stageId: stageKey })
                    }
                    onRemoveMaterial={handleRemoveMaterial}
                    onAddTask={(item) =>
                      handleAddTask({ ...item, stageId: stageKey })
                    }
                    onRemoveTask={handleRemoveTask}
                    supplyCatalog={supplyCatalog}
                  />
                );
              })
            )}
          </div>
        </div>
      ),
    },
    {
      id: "confirmation",
      title: "Xác nhận thay đổi",
      description: "Kiểm tra lại trước khi lưu",
      content: (
        <div className="mx-auto space-y-8">
          <Card className="border-l-4 border-l-primary shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    {formData.name}
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 uppercase font-bold"
                    >
                      Chờ kích hoạt
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" /> Mã: {formData.code}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {formData.startDate} -{" "}
                      {formData.endDate}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            {formData.description && (
              <CardContent>
                <p className="text-muted-foreground bg-slate-50 p-4 rounded-lg italic border border-slate-100">
                  "{formData.description}"
                </p>
              </CardContent>
            )}
          </Card>

          {/* 2-Column Grid: General Info + Cultivation Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Info Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b bg-slate-50/80">
                <CardTitle className="text-base flex items-center gap-2 text-blue-700">
                  <Sprout className="w-5 h-5" />
                  Thông tin chung
                  {(formData.purpose === "treatment" ||
                    formData.purpose === "amendment" ||
                    formData.purpose === "harvest") && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "ml-auto font-bold uppercase",
                        formData.purpose === "treatment"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : formData.purpose === "amendment"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-orange-100 text-orange-800 border-orange-200",
                      )}
                    >
                      {formData.purpose === "treatment"
                        ? "KẾ HOẠCH ĐIỀU TRỊ"
                        : formData.purpose === "amendment"
                          ? "KẾ HOẠCH CẢI TẠO"
                          : "KẾ HOẠCH XUẤT BÁN"}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {!isWorkflowContext && (
                    <div>
                      <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        Lứa nuôi
                      </label>
                      <p className="font-medium mt-1 text-slate-800">
                        {formData.seasonName}
                      </p>
                    </div>
                  )}
                  {formData.purpose === "cultivation" ? (
                    <div>
                      <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        Quy trình
                      </label>
                      <p className="font-medium mt-1 text-slate-800">
                        Đã chọn {formData.selectedStages.length} giai đoạn
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        {formData.purpose === "amendment"
                          ? "Phác đồ cải tạo chuồng trại"
                          : formData.purpose === "harvest"
                            ? "Loại hình"
                            : "Phác đồ điều trị"}
                      </label>
                      <p
                        className={cn(
                          "font-bold mt-1",
                          formData.purpose === "amendment"
                            ? "text-amber-900"
                            : formData.purpose === "harvest"
                              ? "text-orange-900"
                              : "text-blue-900",
                        )}
                      >
                        {formData.purpose === "harvest"
                          ? "Kế hoạch xuất bán"
                          : regimens.find((r) => r.id === formData.regimenId)
                              ?.name || "---"}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Trạng thái
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200"
                      >
                        Chờ kích hoạt
                      </Badge>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 block">
                    Thời gian thực hiện
                  </label>
                  <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-blue-900">
                        {formData.startDate} - {formData.endDate}
                      </p>
                      <p className="text-xs text-blue-600">
                        Thời gian dự kiến theo kế hoạch
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cultivation Info Card */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b bg-slate-50/80">
                <CardTitle className="text-base flex items-center gap-2 text-green-700">
                  <MapPin className="w-5 h-5" />
                  Thông tin chăn nuôi
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5 px-6">
                <div className="space-y-4">
                  <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                    Chi tiết phạm vi chăn nuôi
                  </label>
                  <div className="space-y-3">
                    {selectionSummary.length === 0 && (
                      <p className="text-sm italic text-slate-400">
                        Chưa xác định vùng chọn
                      </p>
                    )}
                    {selectionSummary.map((group) => (
                      <div
                        key={group.regionId}
                        className="space-y-2 p-3 rounded-xl border border-slate-100 bg-slate-50/50"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          {group.regionName}
                        </div>
                        <div className="flex flex-wrap gap-1.5 pl-0">
                          {group.items.map((item, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className={cn(
                                "text-[10px] py-0 px-2 h-5 font-medium shadow-xs border-emerald-100 bg-white",
                                item.type === "region" &&
                                  "bg-emerald-50 text-emerald-800",
                                item.type === "area" &&
                                  "bg-blue-50 text-blue-700 border-blue-100",
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
                <div className="space-y-4">
                  <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                    Nhân sự quản lý
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.managementPersonnelIds.length === 0 ? (
                      <span className="text-sm italic text-slate-400">
                        Chưa chọn nhân sự quản lý
                      </span>
                    ) : (
                      formData.managementPersonnelIds.map((id) => {
                        const person = personnel.find(
                          (item) => String(item.id) === String(id),
                        );
                        return person ? (
                          <Badge
                            key={id}
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-100 text-[10px] font-medium py-0 px-2 h-5"
                          >
                            <Users className="w-3 h-3 mr-1" />
                            {person.fullName}
                          </Badge>
                        ) : null;
                      })
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                    Nhân sự kiểm định chất lượng
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.qualityInspectorPersonnelIds.length === 0 ? (
                      <span className="text-sm italic text-slate-400">
                        Chưa chọn nhân sự kiểm định
                      </span>
                    ) : (
                      formData.qualityInspectorPersonnelIds.map((id) => {
                        const person = personnel.find(
                          (item) => String(item.id) === String(id),
                        );
                        return person ? (
                          <Badge
                            key={id}
                            variant="outline"
                            className="bg-violet-50 text-violet-700 border-violet-100 text-[10px] font-medium py-0 px-2 h-5"
                          >
                            <Users className="w-3 h-3 mr-1" />
                            {person.fullName}
                          </Badge>
                        ) : null;
                      })
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                    Ghi chú phạm vi chăn nuôi
                  </label>
                  <p>{formData.scopeNote || ""}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stage Cards with Tabs (same as PlanDetailPage) */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2.5 rounded-2xl shadow-sm",
                  formData.purpose === "treatment" && "bg-blue-100/50",
                  formData.purpose === "amendment" && "bg-amber-100/50",
                  formData.purpose === "harvest" && "bg-orange-100/50",
                  formData.purpose === "cultivation" && "bg-emerald-100/50",
                )}
              >
                <Layers
                  className={cn(
                    "w-7 h-7",
                    formData.purpose === "treatment" && "text-blue-600",
                    formData.purpose === "amendment" && "text-amber-600",
                    formData.purpose === "harvest" && "text-orange-600",
                    formData.purpose === "cultivation" && "text-emerald-600",
                  )}
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {formData.purpose === "treatment"
                    ? "Lộ trình xử lý & Phác đồ"
                    : formData.purpose === "amendment"
                      ? "Lộ trình cải tạo & Quy trình"
                      : formData.purpose === "harvest"
                        ? "Vật tư - Nhân sự & Cách thức"
                        : "Lộ trình triển khai & Giai đoạn"}
                </h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                  Chi tiết các hạng mục và kế hoạch hành động
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {formData.selectedStages.map((stageKey, index) => {
                const [cycleId, stageName] = stageKey.includes(":")
                  ? stageKey.split(":")
                  : [null, stageKey];
                const cycle = cycleId
                  ? growthCycles?.find((c) => c.id === cycleId)
                  : null;

                const stageMaterials = formData.materialAllocations.filter(
                  (m) => m.stageId === stageKey,
                );
                const stageTasks = formData.taskAllocations.filter(
                  (t) => t.stageId === stageKey,
                );

                return (
                  <Card
                    key={stageKey}
                    className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl"
                  >
                    <div className="bg-slate-50/80 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center font-black text-sm text-slate-700">
                          {index + 1}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base text-slate-900">
                              {stageName}
                            </h4>
                            {cycle && (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100 font-normal py-0 px-2 h-4"
                              >
                                {cycle.name}
                              </Badge>
                            )}
                          </div>
                          {formData.purpose !== "cultivation" && (
                            <p
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-wider",
                                formData.purpose === "amendment"
                                  ? "text-amber-600"
                                  : formData.purpose === "harvest"
                                    ? "text-orange-600"
                                    : "text-blue-600",
                              )}
                            >
                              {formData.purpose === "amendment"
                                ? "Hoạt động cải tạo chuồng trại"
                                : formData.purpose === "harvest"
                                  ? "Hoạt động xuất bán"
                                  : "Hoạt động điều trị bệnh"}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3 text-sm">
                        <Badge
                          variant="outline"
                          className="bg-white hover:bg-green-50 transition-colors"
                        >
                          <Leaf className="w-3 h-3 mr-1 text-green-600" />
                          {stageMaterials.length} vật tư
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-white hover:bg-blue-50 transition-colors"
                        >
                          <Users className="w-3 h-3 mr-1 text-blue-600" />
                          {stageTasks.length} công việc
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-0">
                      {stageMaterials.length === 0 &&
                      stageTasks.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground italic">
                          Chưa có hoạt động nào được lên kế hoạch cho giai đoạn
                          này.
                        </div>
                      ) : (
                        <Tabs defaultValue="materials" className="w-full">
                          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                            <TabsTrigger
                              value="materials"
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-700 data-[state=active]:bg-green-50/50 px-6 py-3 font-medium text-sm flex-1 md:flex-none"
                            >
                              <Leaf className="w-4 h-4 mr-2" />
                              Vật tư ({stageMaterials.length})
                            </TabsTrigger>
                            <TabsTrigger
                              value="tasks"
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 data-[state=active]:bg-blue-50/50 px-6 py-3 font-medium text-sm flex-1 md:flex-none"
                            >
                              <Users className="w-4 h-4 mr-2" />
                              Công việc ({stageTasks.length})
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent
                            value="materials"
                            className="p-4 m-0 bg-white"
                          >
                            {stageMaterials.length === 0 ? (
                              <div className="text-center py-6 border border-dashed rounded-lg bg-slate-50/50 mx-auto max-w-md">
                                <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">
                                  Chưa có vật tư phân bổ
                                </p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {stageMaterials.map((mat) => (
                                  <div
                                    key={mat.id}
                                    className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/30 hover:bg-slate-50 transition-colors"
                                  >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                      <div className="bg-white p-2 rounded-md shadow-sm border shrink-0">
                                        <Package className="w-4 h-4 text-green-600" />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate text-slate-800">
                                          {mat.materialName}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {mat.materialCategory} •{" "}
                                          {mat.materialType}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0 pl-2">
                                      <Badge
                                        variant="secondary"
                                        className="mb-1"
                                      >
                                        {mat.quantity} {mat.unit}
                                      </Badge>
                                      {mat.packaging && (
                                        <p className="text-[10px] text-muted-foreground">
                                          {mat.packaging}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent
                            value="tasks"
                            className="p-4 m-0 bg-white"
                          >
                            {stageTasks.length === 0 ? (
                              <div className="text-center py-6 border border-dashed rounded-lg bg-slate-50/50 mx-auto max-w-md">
                                <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">
                                  Chưa có công việc phân bổ
                                </p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-3">
                                {stageTasks.map((task) => (
                                  <div
                                    key={task.id}
                                    className="flex items-start gap-4 p-4 rounded-lg border bg-blue-50/10 hover:bg-blue-50/30 transition-colors"
                                  >
                                    <div className="bg-blue-100 p-2 rounded-full shrink-0">
                                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                        <h5 className="font-bold text-sm text-slate-900">
                                          {task.name}
                                        </h5>
                                        <div className="flex gap-2 shrink-0">
                                          {task.labor && (
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] h-5 bg-white text-slate-600 border-slate-200"
                                            >
                                              <Users className="w-3 h-3 mr-1" />
                                              {task.labor}
                                            </Badge>
                                          )}
                                          {task.duration && (
                                            <Badge
                                              variant="outline"
                                              className="text-[10px] h-5 bg-amber-50 text-amber-700 border-amber-200"
                                            >
                                              <Clock className="w-3 h-3 mr-1" />
                                              {task.duration}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                        {task.description ||
                                          "Chưa có mô tả chi tiết"}
                                      </p>
                                      {/* Geographical summary for the task item */}
                                      {task.geographicalSelections &&
                                        task.geographicalSelections.length >
                                          0 && (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-blue-50/50 mt-2">
                                            {getTaskSelectionSummary(
                                              task.geographicalSelections,
                                            ).map((group) => (
                                              <div
                                                key={group.regionId}
                                                className="flex flex-col gap-1 border-l-2 border-blue-100 pl-2 py-0.5"
                                              >
                                                <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
                                                  <MapPin className="w-3 h-3 text-slate-400" />
                                                  {group.regionName}
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                  {group.items.map(
                                                    (item, idx) => (
                                                      <Badge
                                                        key={idx}
                                                        variant="outline"
                                                        className={cn(
                                                          "text-[9px] py-0 px-1.5 h-4 font-medium border-slate-200 shadow-none bg-white",
                                                          item.type ===
                                                            "region" &&
                                                            "text-emerald-700 bg-emerald-50/50",
                                                          item.type ===
                                                            "area" &&
                                                            "text-blue-700 bg-blue-50/50",
                                                        )}
                                                      >
                                                        {item.name}
                                                      </Badge>
                                                    ),
                                                  )}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Dark Summary Footer Card */}
          <Card className="bg-slate-900 text-slate-50 border-none shadow-lg mt-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="text-center md:text-left">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Tổng giai đoạn
                  </p>
                  <div className="flex items-baseline justify-center md:justify-start gap-1">
                    <span className="text-4xl font-bold">
                      {formData.selectedStages.length}
                    </span>
                    <span className="text-slate-500 font-medium">bước</span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Tổng vật tư
                  </p>
                  <div className="flex items-baseline justify-center md:justify-start gap-1">
                    <span className="text-4xl font-bold text-green-400">
                      {formData.materialAllocations.length}
                    </span>
                    <span className="text-slate-500 font-medium">mục</span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Tổng công việc
                  </p>
                  <div className="flex items-baseline justify-center md:justify-start gap-1">
                    <span className="text-4xl font-bold text-blue-400">
                      {formData.taskAllocations.length}
                    </span>
                    <span className="text-slate-500 font-medium">đầu việc</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  if (!plan) return null;

  return (
    <PageWrapper
      title={pageTitle}
      description={pageDescription}
      actions={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <Label
              htmlFor="simple-mode-toggle"
              className="text-xs font-bold text-slate-700 whitespace-nowrap cursor-pointer"
            >
              Thông tin chuyên sâu
            </Label>
            <Switch
              id="simple-mode-toggle"
              checked={!isSimpleMode}
              onCheckedChange={(checked) => setIsSimpleMode(!checked)}
            />
          </div>
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      }
    >
      <div className="max-w-5xl mx-auto">
        {isSimpleMode ? (
          <SimplePlanForm
            formData={formData}
            setFormData={setFormData}
            regimens={regimens}
            handleDurationPartChange={handleDurationPartChange}
            handleAddMaterial={handleAddMaterial}
            handleRemoveMaterial={handleRemoveMaterial}
            handleComplete={handleComplete}
            goBack={goBack}
            completeLabel={completeLabel}
            regions={regions || []}
            selectedEnterpriseId={selectedEnterpriseId}
            selections={selections}
            selectionSummary={selectionSummary}
            handleGeographicalConfirm={handleGeographicalConfirm}
            isWorkflowContext={isWorkflowContext}
            workflowInfo={workflowInfo}
            growthCycles={growthCycles}
            personnel={personnel}
            supplyCatalog={supplyCatalog}
          />
        ) : (
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={goBack}
            completeLabel={completeLabel}
          />
        )}
      </div>
    </PageWrapper>
  );
}
