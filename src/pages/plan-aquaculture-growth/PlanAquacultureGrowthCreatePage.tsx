import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  Input,
  Label,
  ScrollArea,
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
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Apple,
  ArrowLeft,
  Bug,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  Info,
  Layers,
  Leaf,
  MapPin,
  Package,
  Search,
  Sprout,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import GeographicalSelector from "./components/GeographicalSelector";
import { PersonnelMultiSelectCard } from "./components/PersonnelMultiSelectCard";
import { RegimenSelector } from "./components/RegimenSelector";
import SimplePlanForm from "./components/SimplePlanForm";
import { StageAllocation } from "./components/StageAllocation";
import { StageItem } from "./components/StageItem";
import { TASK_OPTIONS } from "./data/mocks";
import { useAquacultureGrowthForm } from "./hooks/useAquacultureGrowthForm";

interface PlanAquacultureGrowthCreatePageProps {
  basePath?: string;
}

export default function PlanAquacultureGrowthCreatePage({
  basePath = "/plan-aquaculture-growth",
}: PlanAquacultureGrowthCreatePageProps) {
  const {
    formData,
    setFormData,
    selections,
    setSelections,
    selectedEnterpriseId,
    seasons,
    regions,
    regimens,
    growthCycles,
    selectionSummary,
    calculateArea,
    summarizeTaskSelections: getTaskSelectionSummary,
    personnel,
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
  } = useAquacultureGrowthForm("create", basePath);

  const [newManualStage, setNewManualStage] = useState("");
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const [stageSearch, setStageSearch] = useState("");
  const [applyRegimen, setApplyRegimen] = useState(true);
  const purpose = formData.purpose as string;
  const isCultivationLike =
    purpose === "cultivation" || purpose === "facility-upgrade";
  const isTreatmentOrAmendment =
    purpose === "treatment" || purpose === "amendment";
  const isHarvest = purpose === "harvest";
  const stageSearchTerm = stageSearch.trim().toLowerCase();

  const purposeOptions = [
    {
      id: "cultivation",
      label: "Nuôi trồng thủy sản",
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
      label: "Cải tạo ao trại",
      icon: Sprout,
      borderColor: "border-green-500",
      bgColor: "bg-green-50/50",
      activeColor: "bg-green-500",
      textColor: "text-green-700",
      description: "Xử lý và phục hồi",
    },
    {
      id: "harvest",
      label: "Thu hoạch",
      icon: Apple,
      borderColor: "border-orange-500",
      bgColor: "bg-orange-50/50",
      activeColor: "bg-orange-500",
      textColor: "text-orange-700",
      description: "Nhập hạng mục dự kiến",
    },
  ] as const;

  const harvestSuggestions = TASK_OPTIONS.map((item) => item.label).filter(
    (label) =>
      /thu hoạch|phân loại|đóng gói|vận chuyển|bốc xếp|kiểm tra/i.test(label),
  );

  const purposeSelector = (
    <div className="space-y-4">
      <Label className="text-base font-bold text-slate-800">
        Mục đích kế hoạch
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
              setStageSearch("");
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
      description: "Vụ nuôi và thời gian",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4 p-4 bg-blue-50 text-blue-900 rounded-lg border border-blue-100">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <Sprout className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Thiết lập kế hoạch</h3>
              <p className="text-sm text-blue-700">
                Chọn vụ nuôi, nhập thời gian dự kiến và đặt tên cho kế hoạch của
                bạn.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label required>Vụ nuôi</Label>
              <Select
                value={formData.seasonId}
                onValueChange={handleSeasonChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vụ nuôi..." />
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
        !!formData.seasonId &&
        !!formData.name &&
        Boolean(
          formData.plannedDurationYears ||
          formData.plannedDurationMonths ||
          formData.plannedDurationDays,
        ),
    },
    {
      id: "scope",
      title: "Phạm vi nuôi trồng thủy sản & sản xuất",
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
                  Phạm vi nuôi trồng thủy sản & sản xuất
                </h3>
                <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-sm space-y-4 relative">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                        Vùng sản xuất <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full font-semibold">
                        Chọn 1-n khu vực/lô từ sơ đồ ban đầu
                      </span>
                    </div>
                    <GeographicalSelector
                      regions={regions || []}
                      enterpriseId={selectedEnterpriseId}
                      existingSelections={selections}
                      onConfirm={handleGeographicalConfirm}
                    />

                    {selectionSummary.length > 0 && (
                      <div className="mt-4 p-4 rounded-xl bg-white/50 border border-emerald-100/50 space-y-3">
                        <div className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-widest flex items-center gap-2">
                          <Layers className="w-3 h-3" />
                          Phạm vi đã chọn ({selections.length} mục)
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
                  </div>
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

              {/* Ghi chú Section */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Ghi chú</Label>
                <Textarea
                  placeholder="Nhập thông tin ghi chú thêm..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-white border-slate-200 min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Summary Section */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  Tóm tắt phạm vi đã chọn
                </h3>
                <div className="bg-linear-to-br from-emerald-600 to-teal-700 p-6 rounded-3xl text-white shadow-xl space-y-6 relative overflow-hidden">
                  {/* Decorative blobs */}
                  <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-black/10 rounded-full blur-2xl" />

                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg ring-1 ring-white/30">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                        Khu vực nuôi trồng thủy sản
                      </p>
                      <h4 className="text-2xl font-black leading-tight tracking-tight">
                        {regions
                          .filter((r) =>
                            formData.selectedRegionIds.includes(
                              r.id.toString(),
                            ),
                          )
                          .map((r) => r.name)
                          .join(", ") || "Chưa chọn vùng"}
                      </h4>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge
                          variant="secondary"
                          className="bg-white/20 text-white border-transparent text-[10px] font-bold h-5"
                        >
                          {formData.selectedPlotIds.length} LÔ ĐẤT
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-white/20 text-white border-transparent text-[10px] font-bold h-5"
                        >
                          {calculateArea()} HA
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                      <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Đối tượng nuôi
                      </p>
                      <p className="font-bold text-sm truncate">
                        {formData.crop || "---"}
                      </p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                      <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Giống
                      </p>
                      <p className="font-bold text-sm truncate">
                        {formData.variety || "---"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 relative z-10">
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

                  {selectionSummary.length > 0 && (
                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                          Chi tiết phạm vi
                        </p>
                      </div>
                      <ScrollArea className="h-32 pr-2">
                        <div className="space-y-3">
                          {selectionSummary.map((group) => (
                            <div key={group.regionId} className="space-y-1.5">
                              <div className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider opacity-60">
                                {group.regionName}
                              </div>
                              {group.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2 rounded-xl bg-white/10 border border-white/5 hover:bg-white/15 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={cn(
                                        "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]",
                                        item.type === "region"
                                          ? "bg-amber-400"
                                          : item.type === "area"
                                            ? "bg-blue-400"
                                            : "bg-emerald-400",
                                      )}
                                    />
                                    <div className="flex flex-col">
                                      <span className="text-[10px] uppercase font-black opacity-40 leading-none mb-0.5">
                                        {item.type === "region"
                                          ? "Toàn vùng"
                                          : item.type === "area"
                                            ? "Khu vực"
                                            : "Ô ao"}
                                      </span>
                                      <span className="text-xs font-medium truncate max-w-[150px]">
                                        {item.name}
                                      </span>
                                    </div>
                                  </div>
                                  {item.parentName && (
                                    <span className="text-[9px] font-bold opacity-50 italic truncate max-w-[80px]">
                                      {item.parentName}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  <div className="bg-black/20 p-4 rounded-2xl border border-white/10 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-emerald-300" />
                      <span className="text-[10px] font-black text-emerald-200 uppercase tracking-widest">
                        Lưu ý
                      </span>
                    </div>
                    <p className="text-xs text-emerald-50/80 leading-relaxed italic text-justify">
                      Quy trình nuôi trồng thủy sản sẽ được áp dụng đồng bộ cho tất cả các
                      ô ao đã chọn trong danh sách trên.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      isValid: formData.selectedPlotIds.length > 0 && !!formData.crop,
    },
    {
      id: "process",
      title: "Quy trình & Giai đoạn",
      description: "Lộ trình nuôi trồng thủy sản",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-6">
            {isTreatmentOrAmendment && (
              <div className="space-y-4 animation-slide-up bg-slate-50/30 p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3">
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Áp dụng phác đồ có sẵn
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Tắt để tự nhập các hạng mục công việc thay vì dùng phác
                      đồ.
                    </p>
                  </div>
                  <Switch
                    checked={applyRegimen}
                    onCheckedChange={(checked) => {
                      setApplyRegimen(checked);
                      setFormData((prev) => ({
                        ...prev,
                        regimenId: checked ? prev.regimenId : "",
                        selectedStages: checked
                          ? prev.selectedStages.filter((stage) =>
                              stage.includes(":"),
                            )
                          : prev.selectedStages.filter(
                              (stage) => !stage.includes(":"),
                            ),
                      }));
                    }}
                  />
                </div>

                {applyRegimen ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Label className="text-base uppercase tracking-wider text-slate-500 font-bold text-[10px]">
                        {purpose === "treatment"
                          ? "Phác đồ điều trị"
                          : "Phác đồ cải tạo ao trại"}
                      </Label>
                      {formData.regimenId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              regimenId: "",
                              selectedStages: [],
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
                          selectedStages: stages,
                        }));
                      }}
                    />
                  </>
                ) : (
                  <div className="space-y-4 pt-4 border-t border-dashed border-slate-200">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] uppercase font-black text-slate-400">
                        Hạng mục công việc dự kiến
                      </Label>
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold"
                      >
                        {formData.selectedStages.length} giai đoạn
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập tên giai đoạn (VD: Bón vôi, Làm ao trại...)"
                        value={newManualStage}
                        onChange={(e) => setNewManualStage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const name = newManualStage.trim();
                            if (
                              name &&
                              !formData.selectedStages.includes(name)
                            ) {
                              setFormData((prev) => ({
                                ...prev,
                                selectedStages: [...prev.selectedStages, name],
                              }));
                              setNewManualStage("");
                            }
                          }
                        }}
                        className="bg-white border-slate-200 h-11 text-sm rounded-xl"
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
                        className="px-6 h-11 rounded-xl font-bold uppercase text-xs"
                      >
                        THÊM
                      </Button>
                    </div>

                    {formData.selectedStages.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        {formData.selectedStages.map((stage) => (
                          <Badge
                            key={stage}
                            variant="secondary"
                            className="bg-slate-100 text-slate-700 pr-1 py-1 pl-3 h-8 rounded-lg flex items-center gap-2 border-transparent group hover:bg-red-50 hover:text-red-700 transition-colors cursor-default"
                          >
                            <span className="font-bold text-xs">{stage}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  selectedStages: prev.selectedStages.filter(
                                    (s) => s !== stage,
                                  ),
                                }))
                              }
                              className="h-6 w-6 rounded-md hover:bg-red-100 hover:text-red-600 shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                      <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <p className="text-[10px] text-amber-700 font-medium">
                        Nhập tên các giai đoạn công việc bạn muốn triển khai.
                        Bạn sẽ phân bổ vật tư cho từng giai đoạn ở bước tiếp
                        theo.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isCultivationLike && (
              <div className="space-y-6 animation-slide-up">
                {(() => {
                  const season = seasons.find(
                    (s) => s.id === formData.seasonId,
                  );
                  const seasonCycles = (season?.growthCycleIds || [])
                    .map((cid) => growthCycles.find((gc) => gc.id === cid))
                    .filter(Boolean);
                  const filteredSeasonCycles = seasonCycles
                    .map((cycle) => {
                      const matchedStages = cycle!.stages.filter((stage) => {
                        if (!stageSearchTerm) return true;
                        return (
                          cycle!.name.toLowerCase().includes(stageSearchTerm) ||
                          stage.name.toLowerCase().includes(stageSearchTerm)
                        );
                      });

                      return { cycle, stages: matchedStages };
                    })
                    .filter((group) => group.stages.length > 0);

                  if (!season) {
                    return (
                      <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                        <p className="text-slate-400 font-medium">
                          Vui lòng chọn vụ nuôi ở bước 1
                        </p>
                      </div>
                    );
                  }

                  if (seasonCycles.length === 0) {
                    return (
                      <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                        <p className="text-slate-400 font-medium italic">
                          Ao nuôi/Vụ nuôi này chưa được gán quy trình mẫu.
                        </p>
                        <p className="text-[10px] text-slate-400 mt-2">
                          Vui lòng kiểm tra lại cấu hình vụ nuôi.
                        </p>
                      </div>
                    );
                  }

                  const selectedManualStages = formData.selectedStages.filter(
                    (stage) => !stage.includes(":"),
                  );

                  return (
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-2">
                          <Label className="text-[10px] uppercase font-black text-slate-400">
                            Tìm giai đoạn có sẵn
                          </Label>
                          <Badge
                            variant="outline"
                            className="bg-slate-50 text-slate-600 border-slate-200 text-[10px] font-bold"
                          >
                            {stageSearchTerm ? "Đang lọc" : "Tất cả"}
                          </Badge>
                        </div>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            value={stageSearch}
                            onChange={(e) => setStageSearch(e.target.value)}
                            placeholder="Tìm theo tên giai đoạn hoặc tên quy trình..."
                            className="pl-10 h-11 rounded-xl bg-white border-slate-200"
                          />
                        </div>
                      </div>

                      {filteredSeasonCycles.length === 0 ? (
                        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                          <p className="text-slate-400 font-medium">
                            Không tìm thấy giai đoạn phù hợp.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {filteredSeasonCycles.map(({ cycle, stages }) => (
                            <div
                              key={cycle!.id}
                              className="space-y-4 animation-fade-in"
                            >
                              <div className="flex items-center justify-between px-2">
                                <div className="space-y-0.5">
                                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4 text-emerald-500" />
                                    {cycle!.name}
                                  </h4>
                                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                                    {cycle!.totalDays} ngày • {stages.length} /{" "}
                                    {cycle!.stages.length} giai đoạn
                                  </p>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="bg-emerald-100 text-emerald-700 text-[9px] font-bold border-transparent"
                                >
                                  {
                                    formData.selectedStages.filter((s) =>
                                      s.startsWith(`${cycle!.id}:`),
                                    ).length
                                  }{" "}
                                  / {cycle!.stages.length}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                                {stages.map((stage, idx) => {
                                  const stageKey = `${cycle!.id}:${stage.name}`;
                                  return (
                                    <StageItem
                                      key={stage.id}
                                      index={idx}
                                      stage={stage.name}
                                      checked={formData.selectedStages.includes(
                                        stageKey,
                                      )}
                                      onChange={(c) => {
                                        setFormData((prev) => {
                                          const current = prev.selectedStages;
                                          if (c && !current.includes(stageKey))
                                            return {
                                              ...prev,
                                              selectedStages: [
                                                ...current,
                                                stageKey,
                                              ],
                                            };
                                          if (!c && current.includes(stageKey))
                                            return {
                                              ...prev,
                                              selectedStages: current.filter(
                                                (s) => s !== stageKey,
                                              ),
                                            };
                                          return prev;
                                        });
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-4 pt-4 border-t border-dashed border-slate-200">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] uppercase font-black text-slate-400">
                            Hoặc tự nhập hạng mục công việc dự kiến
                          </Label>
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold"
                          >
                            {selectedManualStages.length} mục
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Input
                            placeholder="Nhập tên hạng mục (VD: Bón phân, Tưới nước...)"
                            value={newManualStage}
                            onChange={(e) => setNewManualStage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const name = newManualStage.trim();
                                if (
                                  name &&
                                  !formData.selectedStages.includes(name)
                                ) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    selectedStages: [
                                      ...prev.selectedStages,
                                      name,
                                    ],
                                  }));
                                  setNewManualStage("");
                                }
                              }
                            }}
                            className="bg-white border-slate-200 h-11 text-sm rounded-xl"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              const name = newManualStage.trim();
                              if (
                                name &&
                                !formData.selectedStages.includes(name)
                              ) {
                                setFormData((prev) => ({
                                  ...prev,
                                  selectedStages: [
                                    ...prev.selectedStages,
                                    name,
                                  ],
                                }));
                                setNewManualStage("");
                              }
                            }}
                            className="px-6 h-11 rounded-xl font-bold uppercase text-xs"
                          >
                            THÊM
                          </Button>
                        </div>

                        {selectedManualStages.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            {selectedManualStages.map((stage) => (
                              <Badge
                                key={stage}
                                variant="secondary"
                                className="bg-slate-100 text-slate-700 pr-1 py-1 pl-3 h-8 rounded-lg flex items-center gap-2 border-transparent group hover:bg-red-50 hover:text-red-700 transition-colors cursor-default"
                              >
                                <span className="font-bold text-xs">
                                  {stage}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      selectedStages:
                                        prev.selectedStages.filter(
                                          (s) => s !== stage,
                                        ),
                                    }))
                                  }
                                  className="h-6 w-6 rounded-md hover:bg-red-100 hover:text-red-600 shrink-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-3 text-[11px] text-muted-foreground bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <Info className="w-4 h-4 text-blue-500 shrink-0" />
                          <p className="leading-relaxed">
                            {purpose === "facility-upgrade"
                              ? "Các giai đoạn được dùng để liệt kê các hạng mục nâng cấp dự kiến. Bạn có thể tìm nhanh mục có sẵn hoặc tự nhập hạng mục riêng."
                              : "Các giai đoạn được hiển thị dựa trên quy trình mẫu đã gán cho Vụ nuôi. Bạn có thể tìm nhanh giai đoạn có sẵn hoặc tự nhập hạng mục riêng."}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {isHarvest && (
              <div className="space-y-4 animation-slide-up bg-slate-50/30 p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <Label className="text-base uppercase tracking-wider text-slate-500 font-bold text-[10px]">
                    Hạng mục công việc dự kiến
                  </Label>
                </div>
                <div className="space-y-4 pt-4 border-t border-dashed border-slate-200">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase font-black text-slate-400">
                      Hạng mục có sẵn
                    </Label>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold"
                    >
                      {
                        harvestSuggestions.filter((item) =>
                          item.toLowerCase().includes(stageSearchTerm),
                        ).length
                      }{" "}
                      mục
                    </Badge>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      value={stageSearch}
                      onChange={(e) => setStageSearch(e.target.value)}
                      placeholder="Tìm hạng mục có sẵn..."
                      className="pl-10 h-11 rounded-xl bg-white border-slate-200"
                    />
                  </div>

                  {harvestSuggestions.filter((item) =>
                    item.toLowerCase().includes(stageSearchTerm),
                  ).length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                      <p className="text-slate-400 font-medium">
                        Không tìm thấy hạng mục phù hợp.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                      {harvestSuggestions
                        .filter((item) =>
                          item.toLowerCase().includes(stageSearchTerm),
                        )
                        .map((item, idx) => (
                          <StageItem
                            key={item}
                            index={idx}
                            stage={item}
                            checked={formData.selectedStages.includes(item)}
                            onChange={(checked) => {
                              setFormData((prev) => {
                                const current = prev.selectedStages;
                                if (checked && !current.includes(item)) {
                                  return {
                                    ...prev,
                                    selectedStages: [...current, item],
                                  };
                                }
                                if (!checked && current.includes(item)) {
                                  return {
                                    ...prev,
                                    selectedStages: current.filter(
                                      (s) => s !== item,
                                    ),
                                  };
                                }
                                return prev;
                              });
                            }}
                          />
                        ))}
                    </div>
                  )}

                  <div className="space-y-4 pt-4 border-t border-dashed border-slate-200">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] uppercase font-black text-slate-400">
                        Hoặc tự nhập hạng mục công việc dự kiến
                      </Label>
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold"
                      >
                        {formData.selectedStages.length} hạng mục
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập tên hạng mục (VD: Tập kết, Kiểm tra, Bốc dỡ...)"
                        value={newManualStage}
                        onChange={(e) => setNewManualStage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const name = newManualStage.trim();
                            if (
                              name &&
                              !formData.selectedStages.includes(name)
                            ) {
                              setFormData((prev) => ({
                                ...prev,
                                selectedStages: [...prev.selectedStages, name],
                              }));
                              setNewManualStage("");
                            }
                          }
                        }}
                        className="bg-white border-slate-200 h-11 text-sm rounded-xl"
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
                        className="px-6 h-11 rounded-xl font-bold uppercase text-xs"
                      >
                        THÊM
                      </Button>
                    </div>

                    {formData.selectedStages.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        {formData.selectedStages.map((stage) => (
                          <Badge
                            key={stage}
                            variant="secondary"
                            className="bg-slate-100 text-slate-700 pr-1 py-1 pl-3 h-8 rounded-lg flex items-center gap-2 border-transparent group hover:bg-red-50 hover:text-red-700 transition-colors cursor-default"
                          >
                            <span className="font-bold text-xs">{stage}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  selectedStages: prev.selectedStages.filter(
                                    (s) => s !== stage,
                                  ),
                                }))
                              }
                              className="h-6 w-6 rounded-md hover:bg-red-100 hover:text-red-600 shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                      <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <p className="text-[10px] text-amber-700 font-medium">
                        Nhập các hạng mục công việc dự kiến để phân bổ vật tư và
                        nhân sự ở bước tiếp theo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      isValid: isTreatmentOrAmendment
        ? !!formData.regimenId || formData.selectedStages.length > 0
        : formData.selectedStages.length > 0,
    },
    {
      id: "resources",
      title: isHarvest
        ? "Vật tư - Nhân sự & cách thức"
        : isCultivationLike
          ? "Phân bổ & Công việc"
          : purpose === "amendment"
            ? "Vật tư & Nhân lực"
            : "Vật tư & Phác đồ",
      description: "Hoạch định nguồn lực chi tiết",
      content: (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              {isHarvest
                ? "Cách thức & Nguồn lực Thu hoạch"
                : isCultivationLike
                  ? "Định mức Vật tư & Giai đoạn"
                  : purpose === "amendment"
                    ? "Vật tư & Công việc Cải tạo"
                    : "Vật tư & Công việc Điều trị"}
            </h3>
            <p className="text-slate-500 text-sm mt-1 max-w-lg mx-auto">
              {isHarvest
                ? "Thiết lập các yêu cầu về vật tư, nhân sự và mô tả cách thức triển khai thu hoạch."
                : isCultivationLike
                  ? "Thiết lập chi tiết các hạng mục đầu tư và quy trình kỹ thuật cho từng giai đoạn của vụ nuôi."
                  : purpose === "amendment"
                    ? "Phân bổ vật tư và công việc cụ thể để thực hiện quy trình cải tạo ao trại đã chọn."
                    : "Phân bổ vật tư và công việc cụ thể để thực hiện phác đồ điều trị đã chọn."}
            </p>
          </div>

          <div className="space-y-4">
            {formData.selectedStages.map((stageKey, idx) => {
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
                />
              );
            })}
          </div>
        </div>
      ),
    },
    {
      id: "confirmation",
      title: "Xác nhận & Kích hoạt",
      description: "Kiểm tra lại toàn bộ thông tin",
      content: (
        <div className="space-y-6 animation-fade-in">
          {/* Plan Header Card - same style as PlanDetailPage */}
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
                          : "KẾ HOẠCH THU HOẠCH"}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Vụ nuôi
                    </label>
                    <p className="font-medium mt-1 text-slate-800">
                      {formData.seasonName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Đối tượng nuôi
                    </label>
                    <p className="font-medium mt-1 text-slate-800">
                      {formData.crop} - {formData.variety}
                    </p>
                  </div>
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
                          ? "Phác đồ cải tạo ao trại"
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
                          ? "Kế hoạch thu hoạch"
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
                  Thông tin nuôi trồng thủy sản
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5 px-6">
                <div className="space-y-4">
                  <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                    Chi tiết phạm vi nuôi trồng thủy sản
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

                <div className="grid grid-cols-2 gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <div>
                    <p className="text-[10px] text-emerald-700 font-black uppercase tracking-wider mb-1">
                      Tổng diện tích
                    </p>
                    <p className="text-xl font-black text-emerald-800">
                      {calculateArea()} ha
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-700 font-black uppercase tracking-wider mb-1">
                      Đối tượng nuôi & Giống
                    </p>
                    <p className="text-xl font-black text-emerald-800">
                      {formData.crop} - {formData.variety}
                    </p>
                  </div>
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
                  ? growthCycles.find((c) => c.id === cycleId)
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
                                ? "Hoạt động cải tạo ao trại"
                                : formData.purpose === "harvest"
                                  ? "Hoạt động thu hoạch"
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
                <div className="text-center md:text-left">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Diện tích
                  </p>
                  <div className="flex items-baseline justify-center md:justify-start gap-1">
                    <span className="text-4xl font-bold text-emerald-400">
                      {calculateArea()}
                    </span>
                    <span className="text-slate-500 font-medium">ha</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <PageWrapper
      title={pageTitle}
      description={pageDescription}
      actions={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="simple-mode-toggle" className="text-xs font-bold text-slate-600 whitespace-nowrap">
              Chế độ đơn giản
            </Label>
            <Switch
              id="simple-mode-toggle"
              checked={isSimpleMode}
              onCheckedChange={setIsSimpleMode}
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
