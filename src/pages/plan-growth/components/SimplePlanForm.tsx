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
import { useState, type Dispatch, type SetStateAction } from "react";
import GeographicalSelector from "./GeographicalSelector";
import { RegimenSelector } from "./RegimenSelector";
import { MATERIAL_OPTIONS, MATERIAL_TYPES, MATERIAL_UNITS } from "../data/mocks";
import type { GeographicalSelection, MaterialAllocation, PlanFormData } from "../types";

const PURPOSE_OPTIONS = [
  { id: "cultivation", label: "Canh tác", icon: Layers, color: "blue" },
  { id: "facility-upgrade", label: "Nâng cấp CSVC", icon: Wrench, color: "slate" },
  { id: "treatment", label: "Điều trị", icon: Bug, color: "red" },
  { id: "amendment", label: "Cải tạo đất", icon: Sprout, color: "green" },
  { id: "harvest", label: "Thu hoạch", icon: Apple, color: "orange" },
] as const;

const PURPOSE_COLOR_CLASSES: Record<string, { active: string; text: string; border: string; bg: string }> = {
  blue: { active: "bg-blue-500", text: "text-blue-700", border: "border-blue-500", bg: "bg-blue-50/50" },
  slate: { active: "bg-slate-700", text: "text-slate-700", border: "border-slate-500", bg: "bg-slate-50/80" },
  red: { active: "bg-red-500", text: "text-red-700", border: "border-red-500", bg: "bg-red-50/50" },
  green: { active: "bg-green-500", text: "text-green-700", border: "border-green-500", bg: "bg-green-50/50" },
  orange: { active: "bg-orange-500", text: "text-orange-700", border: "border-orange-500", bg: "bg-orange-50/50" },
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
  handleDurationPartChange: (part: "years" | "months" | "days", value: string) => void;
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
  workflowInfo?: { name?: string } | null;
}

function StageMaterialPicker({
  stageKey,
  allocations,
  onAddMaterial,
  onRemoveMaterial,
}: {
  stageKey: string;
  allocations: MaterialAllocation[];
  onAddMaterial: (item: Omit<MaterialAllocation, "id">) => void;
  onRemoveMaterial: (id: number) => void;
}) {
  const [newItem, setNewItem] = useState({
    name: "",
    qty: "",
    unit: MATERIAL_UNITS[MATERIAL_TYPES[0]?.value]?.[0] || "kg",
    type: MATERIAL_TYPES[0]?.value || "",
  });

  const handleAdd = () => {
    if (!newItem.name || !newItem.qty) return;
    onAddMaterial({
      stageId: stageKey,
      materialCategory: newItem.type,
      materialType: newItem.type,
      materialName: newItem.name,
      quantity: newItem.qty,
      unit: newItem.unit,
    });
    setNewItem({ name: "", qty: "", unit: MATERIAL_UNITS[newItem.type as keyof typeof MATERIAL_UNITS]?.[0] || "kg", type: newItem.type });
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
              <span className="font-medium text-slate-700">{a.materialName}</span>
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
              const defaultUnit = MATERIAL_UNITS[v as keyof typeof MATERIAL_UNITS]?.[0] || "kg";
              setNewItem({ ...newItem, type: v, name: "", unit: defaultUnit });
            }}
          >
            <SelectTrigger className="w-full h-9 text-xs bg-white">
              <SelectValue placeholder="Loại..." />
            </SelectTrigger>
            <SelectContent>
              {MATERIAL_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-8">
          <Combobox
            options={(MATERIAL_OPTIONS[newItem.type as keyof typeof MATERIAL_OPTIONS] || []).map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            value={newItem.name}
            onChange={(v) => {
              const category = MATERIAL_OPTIONS[newItem.type as keyof typeof MATERIAL_OPTIONS] || [];
              const item = category.find((i) => i.value === v);
              setNewItem({ ...newItem, name: v, unit: item?.unit || newItem.unit });
            }}
            placeholder="Chọn vật tư..."
            searchPlaceholder="Tìm vật tư..."
            emptyText="Không tìm thấy vật tư."
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
          <Select value={newItem.unit} onValueChange={(v) => setNewItem({ ...newItem, unit: v })}>
            <SelectTrigger className="h-9 text-xs w-full bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(MATERIAL_UNITS[newItem.type as keyof typeof MATERIAL_UNITS] || ["kg"]).map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
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
}: SimplePlanFormProps) {
  const [newStage, setNewStage] = useState("");
  const isTreatmentOrAmendment = formData.purpose === "treatment" || formData.purpose === "amendment";

  const addStage = () => {
    const name = newStage.trim();
    if (!name || formData.selectedStages.includes(name)) return;
    setFormData((prev) => ({ ...prev, selectedStages: [...prev.selectedStages, name] }));
    setNewStage("");
  };

  const removeStage = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedStages: prev.selectedStages.filter((s) => s !== name),
      materialAllocations: prev.materialAllocations.filter((m) => m.stageId !== name),
    }));
  };

  const manualStages = formData.selectedStages.filter((s) => !s.includes(":"));
  const regimenStages = formData.selectedStages.filter((s) => s.startsWith(`${formData.regimenId}:`));

  const hasDuration = Boolean(
    formData.plannedDurationYears || formData.plannedDurationMonths || formData.plannedDurationDays,
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
            Nhập nhanh những thông tin cần thiết nhất. Bạn có thể chuyển sang chế độ chi tiết để bổ sung nhân sự và
            công việc sau.
          </p>
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
        <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-sm space-y-3">
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
                            {item.type === "region" ? "Vùng" : item.type === "area" ? "Khu" : "Lô"}
                          </span>
                          {item.name}
                          {item.parentName && (
                            <span className="ml-1 opacity-50 font-normal italic">({item.parentName})</span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label required>Tên kế hoạch</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
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
              onChange={(e) => handleDurationPartChange("years", e.target.value)}
              placeholder="0"
              className="w-16 h-9 border-0 bg-transparent px-0 text-center text-base shadow-none focus-visible:ring-0"
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">năm</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              value={formData.plannedDurationMonths}
              onChange={(e) => handleDurationPartChange("months", e.target.value)}
              placeholder="0"
              className="w-16 h-9 border-0 bg-transparent px-0 text-center text-base shadow-none focus-visible:ring-0"
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">tháng</span>
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
            <span className="text-sm text-slate-500 whitespace-nowrap">ngày</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Mục đích kế hoạch</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
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
                  setFormData((prev) => ({
                    ...prev,
                    purpose: type.id as PlanFormData["purpose"],
                  }))
                }
                className={cn(
                  "cursor-pointer p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-1",
                  isActive ? `${colors.border} ${colors.bg} ${colors.text} shadow-sm` : "border-slate-100 bg-white hover:border-slate-200",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    isActive ? `${colors.active} text-white` : "bg-slate-50 text-slate-400",
                  )}
                >
                  <type.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isTreatmentOrAmendment && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label required>
              {formData.purpose === "treatment" ? "Phác đồ điều trị" : "Phác đồ cải tạo đất"}
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
                  ? regimen.steps.map((step) => `${regimen.id}:${step.title}`)
                  : [`${regimen.id}:${regimen.name}`];
              setFormData((prev) => ({
                ...prev,
                regimenId: regimen.id,
                selectedStages: [
                  ...prev.selectedStages.filter((stage) => !stage.includes(":")),
                  ...stages,
                ],
              }));
            }}
          />
          {formData.regimenId && regimenStages.length > 0 && (
            <div className="flex flex-col gap-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              {regimenStages.map((stage) => (
                <label
                  key={stage}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 transition-colors"
                >
                  <Checkbox
                    checked
                    onCheckedChange={(value) => {
                      if (value) return;
                      setFormData((prev) => ({
                        ...prev,
                        selectedStages: prev.selectedStages.filter((s) => s !== stage),
                      }));
                    }}
                  />
                  {stage.split(":").slice(1).join(":")}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label required={!isTreatmentOrAmendment}>
            {isTreatmentOrAmendment ? "Hạng mục dự kiến thêm (tự tạo)" : "Chọn hạng mục (tự tạo)"}
          </Label>
          <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 font-bold">
            {manualStages.length} mục
          </Badge>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Nhập tên hạng mục (VD: Bón phân, Tưới nước...)"
            value={newStage}
            onChange={(e) => setNewStage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addStage();
              }
            }}
          />
          <Button type="button" onClick={addStage} className="px-6 font-bold uppercase text-xs">
            Thêm
          </Button>
        </div>
      </div>

      {formData.selectedStages.length > 0 && (
        <div className="space-y-3">
          <Label>Chọn vật tư / ước lượng theo hạng mục</Label>
          <div className="space-y-2">
            {formData.selectedStages.map((stageKey, idx) => {
              const stageName = stageKey.includes(":") ? stageKey.split(":").slice(1).join(":") : stageKey;
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
            Chế độ đơn giản không phân bổ nhân công/công việc chi tiết. Chuyển sang chế độ chi tiết bất cứ lúc nào để
            bổ sung nhân sự phụ trách và công việc cụ thể.
          </p>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 left-0 right-0 flex items-center justify-between gap-3 bg-white/95 backdrop-blur border-t border-slate-100 pt-4 pb-2 -mx-4 px-4">
        <Button type="button" variant="outline" onClick={goBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <Button type="button" disabled={!isValid} onClick={handleComplete} className="font-bold">
          {completeLabel}
        </Button>
      </div>
    </div>
  );
}
