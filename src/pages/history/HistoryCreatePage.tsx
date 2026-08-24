import React, { useState, useMemo, useRef } from "react";
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
  Combobox,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Calendar,
  ChevronLeft,
  ClipboardList,
  FileText,
  Image as ImageIcon,
  Link2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useLocation } from "wouter";
import { useFarmWorkflows } from "@/features/farm-workflow/hooks";
import { useCropSupplyCatalog } from "../plan-growth/hooks/useCropSupplyCatalog";
import type {
  CropSupplyCatalog,
  CropSupplyType,
} from "../plan-growth/hooks/useCropSupplyCatalog";

interface MaterialAllocation {
  id: number;
  stageId: string;
  materialType: string;
  materialName: string;
  quantity: string;
  unit: string;
  supplyItemId: number;
  unitBaseId: number;
}

interface HistoryFormData {
  regimenId: string;
  startDate: string;
  endDate: string;
  description: string;
  images: File[];
  selectedStages: string[];
  materialAllocations: MaterialAllocation[];
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

  const handleAdd = () => {
    if (
      !selectedMaterial ||
      !newItem.qty
      //  ||
      // !selectedPackagingVariant?.unitBase
    )
      return;
    onAddMaterial({
      stageId: stageKey,
      materialType: selectedTypeOption?.label || newItem.type,
      materialName: selectedMaterial.label,
      quantity: newItem.qty,
      // unit: selectedPackagingVariant.unitBase.name || selectedMaterial.unit,
      unit: newItem.unitBaseId,
      supplyItemId: selectedMaterial.item.id,
      // unitBaseId: selectedPackagingVariant.unitBase.id,
      unitBaseId: parseInt(newItem.unitBaseId),
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
              className="flex items-center justify-between bg-slate-50 rounded-lg border border-slate-100 px-3 py-1.5 text-xs"
            >
              <span className="font-medium text-slate-700">
                {a.materialName} ({a.materialType})
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border">
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
        <div className="col-span-3">
          <Select
            value={newItem.type}
            onValueChange={(v) => {
              const type = v as CropSupplyType;
              setNewItem({ ...newItem, type, name: "", unitBaseId: "" });
            }}
          >
            <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
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
        <div className="col-span-9">
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
            className="h-9 text-xs w-full bg-white border-slate-200"
          />
        </div>
        <div className="col-span-6">
          <Input
            placeholder="Số lượng ước lượng"
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
            // disabled={packagingVariantOptions.length === 0}
          >
            <SelectTrigger className="h-9 text-xs w-full bg-white border-slate-200">
              <SelectValue placeholder="Đơn vị..." />
            </SelectTrigger>
            <SelectContent>
              {/* {packagingVariantOptions.map((variant) => (
                <SelectItem
                  key={variant.unitBase?.id ?? variant.unitBase?.name}
                  value={String(variant.unitBase?.id)}
                >
                  {variant.unitBase?.name || variant.packagingType?.name || ""}
                </SelectItem>
              ))} */}
              <SelectItem value="g">Gam</SelectItem>
              <SelectItem value="kg">Kilogram</SelectItem>
              <SelectItem value="ml">Mililit</SelectItem>
              <SelectItem value="l">Lít</SelectItem>
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

  const [formData, setFormData] = useState<HistoryFormData>({
    regimenId: "",
    startDate: "",
    endDate: "",
    description: "",
    images: [],
    selectedStages: [],
    materialAllocations: [],
  });

  const [newStage, setNewStage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Load workflows
  const workflowsQuery = useFarmWorkflows({
    params: { page: 0, size: 100 },
  });
  const workflows = workflowsQuery.items || [];

  // Load supply catalog
  const supplyCatalog = useCropSupplyCatalog("CROP");

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
        { ...item, id: Date.now() },
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
        description: "Vui lòng chọn quy trình vụ mùa.",
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
      description: "Nhật ký vụ mùa đã được khởi tạo thành công.",
    });
    setLocation("/reports"); // Trở về dashboard/reports
  };

  return (
    <PageWrapper
      title="Cập nhật nhật ký canh tác"
      description="Thêm nhật ký canh tác"
      actions={
        <Button variant="outline" onClick={() => setLocation("/reports")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      }
    >
      <div className="mx-auto max-w-5xl space-y-6 pb-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Cột trái: Thông tin cơ bản & Upload ảnh */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-green-600" />
                  Thông tin vụ mùa
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Vụ mùa / Quy trình */}
                <div className="space-y-2">
                  <Label required>Chọn Quy trình / Vụ mùa</Label>
                  <Select
                    value={formData.regimenId}
                    onValueChange={(val) =>
                      setFormData((prev) => ({ ...prev, regimenId: val }))
                    }
                  >
                    <SelectTrigger className="h-11 bg-white border-slate-200">
                      <SelectValue placeholder="Chọn quy trình..." />
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
                    <Label>Ngày kết thúc dự kiến</Label>
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

            {/* Upload hình ảnh kéo thả */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-green-600" />
                  Hình ảnh đính kèm
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
          </div>

          {/* Cột phải: Hạng mục & Cấp phát vật tư */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    Hạng mục thực hiện
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

            {/* Cấp phát vật tư */}
            {formData.selectedStages.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-green-600" />
                  Cấp phát vật tư theo hạng mục
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
                            supplyCatalog={supplyCatalog}
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

        {/* Nút hành động */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <Button
            variant="outline"
            type="button"
            className="h-11 px-6 rounded-lg text-sm"
            onClick={() => setLocation("/reports")}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            className="h-11 px-8 rounded-lg text-sm bg-green-600 hover:bg-green-700 text-white font-bold"
            onClick={handleSubmitForm}
          >
            Lưu nhật ký
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}

export default HistoryCreatePage;
