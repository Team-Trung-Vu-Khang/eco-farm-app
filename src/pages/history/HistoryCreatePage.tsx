import React, { useEffect, useMemo, useRef, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Button,
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
  Textarea,
  Badge,
  MultiSelect,
  RemoteAutoCompleteSelect,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Calendar,
  ChevronLeft,
  Layers,
  ClipboardList,
  FileText,
  Image as ImageIcon,
  Link2,
  Plus,
  Sprout,
  Bug,
  Wrench,
  Apple,
  Trash2,
  Upload,
  X,
  MapPin,
} from "lucide-react";
import { HarvestGeographicalSelectorDialog } from "./components/HarvestGeographicalSelectorDialog";
import { GeographicalSelectionCard } from "./components/GeographicalSelectionCard";
import { useLocation } from "wouter";
import { useFarmWorkflows } from "@/features/farm-workflow/hooks";
import type { FarmWorkflowScopeResponse } from "@/features/farm-workflow/types/farm-workflow.type";
import type { DomainCode, SupplyType } from "@/features/farm-supply/types";
import {
  getSupplyTypeOptions,
  isEquipmentSupplyType,
  mapSupplyItemToOption,
  useRemoteSupplySearch,
} from "@/shared/hooks/useRemoteSupplySearch";

interface MaterialAllocation {
  id: number;
  stageId: string;
  materialType: string;
  materialName: string;
  quantity: string;
  actualQuantity?: string;
  unit: string;
  supplyItemId: number;
  unitBaseId?: number;
}

interface HarvestDetail {
  id: string;
  targetId: string;
  targetLabel: string;
  codeName: string;
  quantity: string;
  unitBase: string;
}

interface HistoryFormData {
  regimenId: string;
  workType: string;
  harvestScope: "region" | "crop";
  harvestTargets: string[];
  harvestDetails: HarvestDetail[];
  harvestFiles: File[];
  startDate: string;
  endDate: string;
  description: string;
  images: File[];
  selectedStages: string[];
  materialAllocations: MaterialAllocation[];
}

const WORK_TYPE_OPTIONS = [
  {
    value: "cultivation",
    label: "Canh tác",
    icon: Layers,
    activeClass: "border-blue-500 bg-blue-50/50 text-blue-700",
    iconClass: "bg-blue-500 text-white",
  },
  {
    value: "facility-upgrade",
    label: "Nâng cấp CSVC",
    icon: Wrench,
    activeClass: "border-slate-500 bg-slate-50/80 text-slate-700",
    iconClass: "bg-slate-700 text-white",
  },
  {
    value: "treatment",
    label: "Điều trị",
    icon: Bug,
    activeClass: "border-red-500 bg-red-50/50 text-red-700",
    iconClass: "bg-red-500 text-white",
  },
  {
    value: "amendment",
    label: "Cải tạo đất",
    icon: Sprout,
    activeClass: "border-green-500 bg-green-50/50 text-green-700",
    iconClass: "bg-green-500 text-white",
  },
  {
    value: "harvest",
    label: "Thu hoạch",
    icon: Apple,
    activeClass: "border-orange-500 bg-orange-50/50 text-orange-700",
    iconClass: "bg-orange-500 text-white",
  },
] as const;

function getWorkflowLabel(domainCode?: DomainCode) {
  if (domainCode === "LIVESTOCK") return "Vụ nuôi";
  if (domainCode === "AQUACULTURE") return "Vụ nuôi thủy sản";
  return "Vụ mùa";
}

function getWorkflowSubtitle(domainCode?: DomainCode) {
  if (domainCode === "LIVESTOCK" || domainCode === "AQUACULTURE")
    return "Chăn nuôi và nuôi trồng thủy sản";
  return "Vùng trồng";
}

function getHarvestLabel(scope: "region" | "crop") {
  return scope === "region" ? "Vùng canh tác" : "Cây canh tác";
}

function getHarvestUnitOptions() {
  return [
    { label: "Kilogram (kg)", value: "kg" },
    { label: "Tấn", value: "tấn" },
    { label: "Cái / Chiếc", value: "cái / chiếc" },
    { label: "Lít", value: "lít" },
    { label: "Mét vuông (m²)", value: "m²" },
    { label: "Hecta (ha)", value: "ha" },
  ];
}

function mapWorkflowScopeToHarvestOption(
  scope: FarmWorkflowScopeResponse,
  index: number,
): { label: string; value: string; keywords?: string[] } | null {
  const region = scope.region ?? scope.area?.region ?? scope.plot?.area?.region;
  if (!region) return null;

  if (scope.scopeType === "REGION") {
    return {
      label: region.name || `Vùng #${region.id}`,
      value: `region-${region.id}`,
      keywords: [region.code, region.name].filter(Boolean) as string[],
    };
  }

  if (scope.scopeType === "AREA" && scope.area) {
    return {
      label: `${scope.area.name || `Khu #${scope.area.id}`}`,
      value: `area-${scope.area.id}`,
      keywords: [scope.area.code, scope.area.name, region.name].filter(
        Boolean,
      ) as string[],
    };
  }

  if (scope.scopeType === "PLOT" && scope.plot) {
    const area = scope.area ?? scope.plot.area;
    return {
      label: `${scope.plot.name || `Lô #${scope.plot.id}`}`,
      value: `plot-${scope.plot.id}`,
      keywords: [
        scope.plot.code,
        scope.plot.name,
        area?.name,
        region.name,
      ].filter(Boolean) as string[],
    };
  }

  return {
    label: `Mục ${index + 1}`,
    value: `${scope.scopeType.toLowerCase()}-${index}`,
  };
}

function createHarvestDetail(
  targetId: string,
  targetLabel: string,
): HarvestDetail {
  return {
    id: `harvest-${targetId}`,
    targetId,
    targetLabel,
    codeName: targetLabel,
    quantity: "",
    unitBase: "",
  };
}

function StageMaterialPicker({
  stageKey,
  allocations,
  onAddMaterial,
  onRemoveMaterial,
  domainCode,
}: {
  stageKey: string;
  allocations: MaterialAllocation[];
  onAddMaterial: (item: Omit<MaterialAllocation, "id">) => void;
  onRemoveMaterial: (id: number) => void;
  domainCode: DomainCode;
}) {
  const [newItem, setNewItem] = useState({
    name: "",
    qty: "",
    unitBaseId: "",
    type:
      getSupplyTypeOptions(domainCode)[1]?.value ||
      getSupplyTypeOptions(domainCode)[0]?.value ||
      "material",
    searchValue: "",
  });

  const typeOptions = getSupplyTypeOptions(domainCode);
  const selectedTypeOption = typeOptions.find(
    (option) => option.value === newItem.type,
  );
  const { items: searchedMaterials, isFetching } = useRemoteSupplySearch(
    domainCode,
    newItem.type,
    newItem.searchValue,
  );
  const selectedMaterial = searchedMaterials.find(
    (item) => String(item.id) === newItem.name,
  );
  const materialOptions = searchedMaterials.map(mapSupplyItemToOption);
  const packagingVariantOptions = selectedMaterial?.packagingVariants || [];
  const selectedPackagingVariant = packagingVariantOptions.find(
    (variant) => String(variant.unitBase?.id) === newItem.unitBaseId,
  );
  const isEquipment = newItem.type === "equipment";
  const selectedUnitBaseId = isEquipment
    ? Number(newItem.unitBaseId || 6)
    : selectedPackagingVariant?.unitBase?.id;
  const selectedUnitLabel = isEquipment
    ? selectedPackagingVariant?.unitBase?.name || "Cái / Chiếc"
    : selectedPackagingVariant?.unitBase?.name ||
      selectedMaterial?.packagingVariants?.[0]?.unitBase?.name ||
      "";

  const handleAdd = () => {
    if (
      !selectedMaterial ||
      !newItem.qty ||
      (!isEquipment && !selectedPackagingVariant?.unitBase)
    )
      return;
    onAddMaterial({
      stageId: stageKey,
      materialType: selectedTypeOption?.label || newItem.type,
      materialName: selectedMaterial.name,
      quantity: newItem.qty,
      unit: selectedUnitLabel,
      supplyItemId: selectedMaterial.id,
      unitBaseId: selectedUnitBaseId,
    });
    setNewItem({
      name: "",
      qty: "",
      unitBaseId: "",
      type: newItem.type,
      searchValue: "",
    });
  };

  return (
    <div className="space-y-3">
      {allocations.length > 0 && (
        <div className="space-y-1.5">
          {allocations.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between bg-slate-50 rounded-lg border border-slate-100 px-3 py-1.5 text-xs"
            >
              <span className="font-medium text-slate-700">
                {a.materialName} ({a.materialType})
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border">
                  {a.actualQuantity || a.quantity} {a.unit}
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
        <div className="col-span-3">
          <Select
            value={newItem.type}
            onValueChange={(v) => {
              const type = v as SupplyType;
              setNewItem({
                ...newItem,
                type,
                name: "",
                unitBaseId: "",
                searchValue: "",
              });
            }}
          >
            <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
              <SelectValue placeholder="Loại..." />
            </SelectTrigger>
            <SelectContent>
              {getSupplyTypeOptions(domainCode).map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-9">
          <RemoteAutoCompleteSelect
            options={materialOptions}
            value={newItem.name}
            onChange={(v) => {
              const item = searchedMaterials.find((i) => String(i.id) === v);
              const firstVariant = item?.packagingVariants?.[0];
              setNewItem({
                ...newItem,
                name: v,
                unitBaseId: firstVariant?.unitBase?.id
                  ? String(firstVariant.unitBase.id)
                  : "",
                searchValue: item?.name || newItem.searchValue,
              });
            }}
            onSearch={(value) =>
              setNewItem((prev) => ({ ...prev, searchValue: value }))
            }
            placeholder="Chọn vật tư..."
            searchPlaceholder="Tìm vật tư..."
            emptyText={
              isFetching
                ? "Đang tải danh sách vật tư..."
                : "Không tìm thấy vật tư."
            }
            loading={isFetching}
            disabled={isFetching}
          />
        </div>
        <div className="col-span-6">
          <Input
            placeholder="Số lượng"
            type="number"
            className="h-9 text-xs bg-white border-slate-200"
            value={newItem.qty}
            onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
          />
        </div>
        <div className="col-span-4">
          <Select
            value={newItem.unitBaseId}
            onValueChange={(v) => setNewItem({ ...newItem, unitBaseId: v })}
            disabled={isEquipment || packagingVariantOptions.length === 0}
          >
            <SelectTrigger className="h-9 text-xs w-full bg-white border-slate-200">
              <SelectValue
                placeholder={isEquipment ? "Cái / Chiếc" : "Đơn vị..."}
              />
            </SelectTrigger>
            <SelectContent>
              {packagingVariantOptions.length > 0 ? (
                packagingVariantOptions.map((variant) => (
                  <SelectItem
                    key={variant.unitBase?.id ?? variant.unitBase?.name}
                    value={String(variant.unitBase?.id)}
                  >
                    {variant.unitBase?.name ||
                      variant.packagingType?.name ||
                      ""}
                  </SelectItem>
                ))
              ) : isEquipment ? (
                <SelectItem value="6">Cái / Chiếc</SelectItem>
              ) : null}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Button
            type="button"
            size="sm"
            className="h-9 w-full p-0 bg-slate-900 hover:bg-slate-800 font-bold text-xs"
            onClick={handleAdd}
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function HistoryCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const harvestFileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<HistoryFormData>({
    regimenId: "",
    workType: "",
    harvestScope: "region",
    harvestTargets: [],
    harvestDetails: [],
    harvestFiles: [],
    startDate: "",
    endDate: "",
    description: "",
    images: [],
    selectedStages: [],
    materialAllocations: [],
  });

  const [geoDialogOpen, setGeoDialogOpen] = useState(false);
  const [activeDetailIdForGeo, setActiveDetailIdForGeo] = useState<
    string | null
  >(null);

  const [newStage, setNewStage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Load workflows
  const workflowsQuery = useFarmWorkflows({
    params: { page: 0, size: 100 },
  });
  const workflows = workflowsQuery.items || [];
  const selectedWorkflow = useMemo(
    () =>
      workflows.find((workflow) => String(workflow.id) === formData.regimenId),
    [formData.regimenId, workflows],
  );
  const workflowDomainCode = selectedWorkflow?.domainCode ?? "CROP";
  const harvestTargetOptions = useMemo(() => {
    const scopes = (selectedWorkflow?.scopes ||
      []) as FarmWorkflowScopeResponse[];
    return scopes.map(mapWorkflowScopeToHarvestOption).filter(Boolean) as {
      label: string;
      value: string;
      keywords?: string[];
    }[];
  }, [selectedWorkflow]);

  const syncHarvestDetails = (nextTargets: string[]) => {
    const optionByValue = new Map(
      harvestTargetOptions.map((option) => [option.value, option]),
    );

    setFormData((prev) => {
      const current = new Map(
        prev.harvestDetails.map((item) => [item.targetId, item]),
      );
      const nextDetails = nextTargets.map((targetId) => {
        const existing = current.get(targetId);
        const option = optionByValue.get(targetId);
        if (existing) {
          return {
            ...existing,
            targetLabel: option?.label || existing.targetLabel,
            codeName:
              existing.codeName || option?.label || existing.targetLabel,
          };
        }
        return createHarvestDetail(targetId, option?.label || targetId);
      });

      return {
        ...prev,
        harvestTargets: nextTargets,
        harvestDetails: nextDetails,
      };
    });
  };

  const addStage = () => {
    const trimmed = newStage.trim();
    if (!trimmed) return;
    if (formData.selectedStages.includes(trimmed)) {
      toast({
        title: "Trùng lặp",
        description: "Hạng mục này đã có trong danh sách.",
        variant: "destructive",
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      selectedStages: [...prev.selectedStages, trimmed],
    }));
    setNewStage("");
  };

  const removeStage = (stage: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedStages: prev.selectedStages.filter((s) => s !== stage),
      materialAllocations: prev.materialAllocations.filter(
        (m) => m.stageId !== stage,
      ),
    }));
  };

  const handleAddMaterial = (item: Omit<MaterialAllocation, "id">) => {
    setFormData((prev) => ({
      ...prev,
      materialAllocations: [
        ...prev.materialAllocations,
        { ...item, id: Date.now(), actualQuantity: item.quantity },
      ],
    }));
  };

  const handleRemoveMaterial = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      materialAllocations: prev.materialAllocations.filter((m) => m.id !== id),
    }));
  };

  // Drag and Drop Images
  const handleFiles = (filesList: FileList) => {
    const validFiles: File[] = [];
    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      if (file.type.startsWith("image/")) {
        validFiles.push(file);
      }
    }
    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validFiles],
      }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
    }
    e.target.value = "";
  };

  const handleHarvestFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files?.length) {
      setFormData((prev) => ({
        ...prev,
        harvestFiles: [
          ...prev.harvestFiles,
          ...Array.from(e.target.files || []),
        ],
      }));
    }
    e.target.value = "";
  };

  const removeHarvestFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      harvestFiles: prev.harvestFiles.filter((_, i) => i !== index),
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitForm = () => {
    if (!formData.regimenId) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn vụ mùa/vụ nuôi.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.workType) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn loại công việc.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.startDate) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn ngày bắt đầu.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thành công",
      description: "Nhật ký đã được khởi tạo thành công.",
    });
    setLocation("/history");
  };

  return (
    <PageWrapper
      title="Cập nhật nhật ký canh tác"
      description="Thêm nhật ký canh tác"
      actions={
        <Button variant="outline" onClick={() => setLocation("/history")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      }
    >
      <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Cột trái: Thông tin cơ bản & Upload ảnh */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-green-600" />
                  Thông tin cập nhật
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Vụ mùa / Quy trình */}
                <div className="space-y-2">
                  <Label required>{getWorkflowLabel(workflowDomainCode)}</Label>
                  <Select
                    value={formData.regimenId}
                    onValueChange={(val) =>
                      setFormData((prev) => ({ ...prev, regimenId: val }))
                    }
                  >
                    <SelectTrigger className="h-11 bg-white border-slate-200">
                      <SelectValue
                        placeholder={`Chọn ${getWorkflowLabel(workflowDomainCode).toLowerCase()}...`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {workflows.map((workflow) => (
                        <SelectItem
                          key={workflow.id}
                          value={String(workflow.id)}
                        >
                          {workflow.code
                            ? `${workflow.code} - ${workflow.name}`
                            : workflow.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    {getWorkflowSubtitle(workflowDomainCode)} đang được áp dụng
                    cho nhật ký này.
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {getWorkflowLabel(workflowDomainCode)}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {selectedWorkflow?.name || "Chưa chọn"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Kế hoạch
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {selectedWorkflow?.code || "Chưa có mã"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {getWorkflowSubtitle(workflowDomainCode)}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      Chưa chọn
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label required>Loại công việc</Label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {WORK_TYPE_OPTIONS.map((option) => {
                      const isActive = formData.workType === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              workType: option.value,
                            }))
                          }
                          className={`cursor-pointer rounded-2xl border-2 px-3 py-4 transition-all flex flex-col items-center text-center gap-1.5 group ${
                            isActive
                              ? option.activeClass
                              : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm text-slate-500"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                              isActive
                                ? option.iconClass
                                : "bg-slate-50 text-slate-400"
                            }`}
                          >
                            <option.icon className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-tight">
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ngày bắt đầu & kết thúc */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label required>Ngày bắt đầu</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        className="h-11 bg-white border-slate-200 pl-10"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                      />
                      <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Ngày kết thúc</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        className="h-11 bg-white border-slate-200 pl-10"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                      />
                      <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Mô tả */}
                <div className="space-y-2">
                  <Label>Mô tả chi tiết</Label>
                  <Textarea
                    placeholder="Nhập mô tả hoặc ghi chú..."
                    rows={4}
                    className="bg-white border-slate-200 focus:ring-green-500/20"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {formData.workType === "harvest" && (
              <Card className="border-none bg-white shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <Apple className="h-4 w-4 text-orange-500" />
                    Thu hoạch
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">
                          Đối tượng thu hoạch
                        </p>
                        <p className="text-xs text-slate-500">
                          Chọn theo vùng canh tác hoặc cây canh tác, rồi nhập
                          chi tiết cho từng mục.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              harvestScope: "region",
                              harvestTargets: [],
                              harvestDetails: [],
                            }))
                          }
                          className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                            formData.harvestScope === "region"
                              ? "border-orange-400 bg-white text-orange-700 shadow-sm"
                              : "border-orange-100 bg-orange-50/60 text-slate-600"
                          }`}
                        >
                          Vùng canh tác
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              harvestScope: "crop",
                              harvestTargets: [],
                              harvestDetails: [],
                            }))
                          }
                          className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                            formData.harvestScope === "crop"
                              ? "border-orange-400 bg-white text-orange-700 shadow-sm"
                              : "border-orange-100 bg-orange-50/60 text-slate-600"
                          }`}
                        >
                          Cây canh tác
                        </button>
                      </div>

                      {formData.harvestScope === "region" ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setGeoDialogOpen(true)}
                          className="w-full h-11 border-2 border-dashed border-orange-200 bg-orange-50/40 hover:bg-orange-50 hover:border-orange-400 text-orange-700 font-bold gap-2 transition-all rounded-xl shadow-sm cursor-pointer text-xs justify-center"
                        >
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span>
                            {formData.harvestDetails.length > 0
                              ? `Đã chọn ${formData.harvestDetails.length} đơn vị địa lý (Bấm để thay đổi / chọn thêm)`
                              : "Chọn các vùng / khu vực / lô địa lý thu hoạch..."}
                          </span>
                        </Button>
                      ) : (
                        <MultiSelect
                          options={harvestTargetOptions}
                          value={formData.harvestTargets}
                          onChange={syncHarvestDetails}
                          placeholder={`Chọn ${getHarvestLabel(formData.harvestScope).toLowerCase()}`}
                          searchPlaceholder={`Tìm ${getHarvestLabel(formData.harvestScope).toLowerCase()}`}
                          emptyText={
                            harvestTargetOptions.length > 0
                              ? "Không tìm thấy mục phù hợp."
                              : "Chưa có dữ liệu từ quy trình đã chọn."
                          }
                          clearable
                        />
                      )}

                      <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/30 p-4">
                        <input
                          ref={harvestFileInputRef}
                          type="file"
                          accept=".csv,.xlsx,.xls,.txt"
                          className="hidden"
                          multiple
                          onChange={handleHarvestFileInputChange}
                        />
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              Upload danh sách thu hoạch
                            </p>
                            <p className="text-xs text-slate-500">
                              Mã tên/vùng canh tác hoặc mã cây, sản lượng, đơn
                              vị cơ bản.
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-9 rounded-lg border-orange-200 text-orange-700 hover:bg-orange-50"
                            onClick={() => harvestFileInputRef.current?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Tải danh sách
                          </Button>
                        </div>
                        {formData.harvestFiles.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {formData.harvestFiles.map((file, index) => (
                              <div
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between rounded-lg border border-orange-100 bg-white px-3 py-2 text-xs"
                              >
                                <span className="truncate font-medium text-slate-700">
                                  {file.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeHarvestFile(index)}
                                  className="text-slate-300 hover:text-red-500"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Chi tiết thu hoạch
                          </p>
                          <p className="text-xs text-slate-500">
                            Nhập mã, sản lượng và đơn vị cơ bản cho từng mục đã
                            chọn.
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-700 border-orange-200"
                        >
                          {formData.harvestTargets.length} mục
                        </Badge>
                      </div>

                      {formData.harvestTargets.length > 0 ? (
                        <div className="space-y-3">
                          {formData.harvestDetails.map((detail, index) => (
                            <div
                              key={detail.id}
                              className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm space-y-3"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {detail.targetLabel}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    {getHarvestLabel(formData.harvestScope)} #
                                    {index + 1}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    syncHarvestDetails(
                                      formData.harvestTargets.filter(
                                        (id) => id !== detail.targetId,
                                      ),
                                    )
                                  }
                                  className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Xóa mục này"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              {formData.harvestScope === "region" ? (
                                /* UI sau khi chọn vùng địa lý (kiểu SelectionCard phân cấp) */
                                <GeographicalSelectionCard
                                  codeName={detail.codeName}
                                  onChangeLocation={() =>
                                    setGeoDialogOpen(true)
                                  }
                                  onRemove={() =>
                                    syncHarvestDetails(
                                      formData.harvestTargets.filter(
                                        (id) => id !== detail.targetId,
                                      ),
                                    )
                                  }
                                />
                              ) : null}

                              <div className="grid grid-cols-12 gap-3">
                                <div className="space-y-1.5 md:col-span-8">
                                  <Label className="text-xs font-semibold text-slate-500">
                                    Sản lượng
                                  </Label>
                                  <Input
                                    type="number"
                                    placeholder="Nhập sản lượng..."
                                    className="h-10 bg-white border-slate-200 text-sm"
                                    value={detail.quantity}
                                    onChange={(e) => {
                                      const next = e.target.value;
                                      setFormData((prev) => ({
                                        ...prev,
                                        harvestDetails: prev.harvestDetails.map(
                                          (item) =>
                                            item.id === detail.id
                                              ? { ...item, quantity: next }
                                              : item,
                                        ),
                                      }));
                                    }}
                                  />
                                </div>
                                <div className="space-y-1.5 md:col-span-4">
                                  <Label className="text-xs font-semibold text-slate-500">
                                    Đơn vị cơ bản
                                  </Label>
                                  <Select
                                    value={detail.unitBase}
                                    onValueChange={(value) => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        harvestDetails: prev.harvestDetails.map(
                                          (item) =>
                                            item.id === detail.id
                                              ? { ...item, unitBase: value }
                                              : item,
                                        ),
                                      }));
                                    }}
                                  >
                                    <SelectTrigger className="h-10 bg-white border-slate-200 text-sm">
                                      <SelectValue placeholder="Chọn đơn vị" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getHarvestUnitOptions().map((unit) => (
                                        <SelectItem
                                          key={unit.value}
                                          value={unit.value}
                                        >
                                          {unit.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/30 p-6 text-sm text-slate-500">
                          Chưa chọn đối tượng thu hoạch.
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Cột phải: Hạng mục & Cấp phát vật tư */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    Hạng mục công việc
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {formData.selectedStages.length} mục
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Thêm hạng mục mới (Làm đất, Gieo hạt...)"
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addStage();
                      }
                    }}
                    className="h-10 bg-white border-slate-200 font-medium"
                  />
                  <Button
                    type="button"
                    onClick={addStage}
                    className="h-10 rounded-lg px-4 text-xs font-bold"
                  >
                    Thêm
                  </Button>
                </div>

                {formData.selectedStages.length > 0 && (
                  <div className="grid gap-2">
                    {formData.selectedStages.map((stage, index) => (
                      <div
                        key={stage}
                        className="flex items-center gap-3 rounded-xl border border-slate-150 bg-slate-50/50 px-3 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-white border text-[10px] text-slate-400 font-bold">
                          {index + 1}
                        </span>
                        <span className="flex-1 truncate">{stage}</span>
                        <button
                          type="button"
                          onClick={() => removeStage(stage)}
                          className="h-6 w-6 text-slate-300 hover:text-red-500 transition-colors flex items-center justify-center rounded-md hover:bg-red-50"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Công việc */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-green-600" />
                  Công việc
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  className={`cursor-pointer rounded-2xl border border-dashed p-6 text-center transition-all flex flex-col items-center justify-center min-h-[140px] ${
                    isDragging
                      ? "border-green-500 bg-green-50/50"
                      : "border-slate-200 bg-slate-50/50 hover:border-green-400 hover:bg-white"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                  <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Kéo thả hình ảnh vào đây
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Hoặc click để chọn file từ máy tính
                  </p>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.map((file, index) => {
                      const url = URL.createObjectURL(file);
                      return (
                        <div
                          key={index}
                          className="group relative h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                        >
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="absolute top-1 right-1 h-5 w-5 bg-red-500/80 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cấp phát vật tư */}
            {formData.selectedStages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-green-600" />
                  Danh mục vật tư
                </h3>
                <div className="space-y-3">
                  {formData.selectedStages.map((stageKey, idx) => {
                    const stageAllocations =
                      formData.materialAllocations.filter(
                        (m) => m.stageId === stageKey,
                      );
                    return (
                      <div
                        key={stageKey}
                        className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden"
                      >
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50/50 border-b border-slate-100">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-700">
                            {idx + 1}
                          </span>
                          <span className="flex-1 truncate font-bold text-xs text-slate-850">
                            {stageKey}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                            <Link2 className="h-3 w-3" />{" "}
                            {stageAllocations.length} vật tư
                          </span>
                        </div>
                        <div className="p-4">
                          <StageMaterialPicker
                            stageKey={stageKey}
                            allocations={stageAllocations}
                            onAddMaterial={handleAddMaterial}
                            onRemoveMaterial={handleRemoveMaterial}
                            domainCode={workflowDomainCode}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nút hành động (Sticky Footer) */}
        <div className="fixed left-0 right-0 bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
          <Button
            variant="outline"
            type="button"
            className="h-11 px-6 rounded-xl text-sm font-semibold"
            onClick={() => setLocation("/history")}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            className="h-11 px-8 rounded-xl text-sm bg-green-600 hover:bg-green-700 text-white font-bold shadow-md shadow-green-600/20"
            onClick={handleSubmitForm}
          >
            Lưu nhật ký
          </Button>
        </div>
      </div>

      {/* Dialog chọn các vùng địa lý thu hoạch (Multi-select) */}
      <HarvestGeographicalSelectorDialog
        open={geoDialogOpen}
        onOpenChange={setGeoDialogOpen}
        selectedItems={formData.harvestDetails
          .filter((d) => d.codeName)
          .map((d) => ({
            id: d.targetId,
            codeName: d.codeName,
            label: d.targetLabel,
            type: d.codeName.includes(" › ")
              ? d.codeName.split(" › ").length >= 3
                ? "plot"
                : "area"
              : "region",
          }))}
        onConfirmSelections={(selectedGeoItems) => {
          const currentMap = new Map(
            formData.harvestDetails.map((d) => [d.targetId, d]),
          );

          const nextTargets = selectedGeoItems.map((item) => item.id);
          const nextDetails = selectedGeoItems.map((item) => {
            const existing = currentMap.get(item.id);
            if (existing) {
              return {
                ...existing,
                codeName: item.codeName,
                targetLabel: item.label,
              };
            }
            return {
              id: `h-geo-${item.id}`,
              targetId: item.id,
              targetLabel: item.label,
              codeName: item.codeName,
              quantity: "",
              unitBase: "kg",
            };
          });

          setFormData((prev) => ({
            ...prev,
            harvestTargets: nextTargets,
            harvestDetails: nextDetails,
          }));
        }}
      />
    </PageWrapper>
  );
}

export default HistoryCreatePage;
