import React from "react";
import {
  Badge,
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Switch,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  Apple,
  Camera,
  CheckCircle2,
  ImagePlus,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { DomainCode } from "@/features/farm-supply";
import type { PhotoRequest } from "@/features/farm-daily-diary";
import type { FarmTaskResponse } from "@/features/farm-task/types/farm-task.type";
import type { GeographicalSelection } from "@/pages/cultivation-zone/cultivation-region/components/types";
import {
  getHarvestLabel,
  getHarvestUnitOptions,
} from "@/pages/diary/constants/history-form.constants";
import type {
  CropSubjectVariantItem,
  HistoryFormData,
  MaterialAllocation,
} from "@/pages/diary/types/history-form.types";
import {
  CultivationZoneSelector,
  type CultivationZoneOption,
} from "@/pages/diary/components/form/CultivationZoneSelector";
import { GeographicalSelectionCard } from "@/pages/diary/components/form/GeographicalSelectionCard";
import { HarvestTreeSelectorDialog } from "@/pages/diary/components/dialogs/HarvestTreeSelectorDialog";
import { MobileWarningCard } from "@/pages/diary/components/form/mobile/MobileWarningCard";
import { MobileHarvestItemCard } from "@/pages/diary/components/form/mobile/MobileHarvestItemCard";
import {
  WorkAllocationCard,
  type WorkTaskDetail,
} from "@/pages/diary/components/form/WorkAllocationCard";

export interface Step2ExecutionAndMaterialsProps {
  formData: HistoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<HistoryFormData>>;
  workflowDomainCode: string;
  isPlannedMode: boolean;
  plannedStages: string[];
  workTaskDetails: Record<string, WorkTaskDetail>;
  currentPercentage?: number;
  previousPercentage?: number;
  sliderTrackBackground?: string;
  selectedStageId?: string;
  selectedTask?: FarmTaskResponse;
  errors: Record<string, string>;
  addStage: (stageName: string, categoryId?: number) => void;
  removeStage: (stageName: string) => void;
  handleUpdateWorkTaskDetail: (
    stageName: string,
    updates: Partial<WorkTaskDetail>,
  ) => void;
  handleAddMaterial: (item: Omit<MaterialAllocation, "id">) => void;
  handleRemoveMaterial: (id: number) => void;
  handleUpdateActualQuantity: (id: number, val: string) => void;

  // Harvest props
  regionOptions: CultivationZoneOption[];
  cropSubjectVariants: CropSubjectVariantItem[];
  existingGeoSelections: GeographicalSelection[];
  handleConfirmGeoSelections: (selectedLeafs: GeographicalSelection[]) => void;
  syncHarvestDetails: (targetIds: string[]) => void;

  // Photo & evidence props
  existingPhotos: PhotoRequest[];
  removeExistingPhoto: (idx: number) => void;
  removeImage: (idx: number) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isMobileOrTablet: boolean;
  isPhotoSheetOpen: boolean;
  setIsPhotoSheetOpen: (open: boolean) => void;
}

export function Step2ExecutionAndMaterials({
  formData,
  setFormData,
  workflowDomainCode,
  isPlannedMode,
  plannedStages,
  workTaskDetails,
  currentPercentage = 0,
  previousPercentage = 0,
  sliderTrackBackground = "",
  selectedStageId,
  selectedTask,
  errors,
  addStage,
  removeStage,
  handleUpdateWorkTaskDetail,
  handleAddMaterial,
  handleRemoveMaterial,
  handleUpdateActualQuantity,
  regionOptions,
  cropSubjectVariants,
  existingGeoSelections,
  handleConfirmGeoSelections,
  syncHarvestDetails,
  existingPhotos,
  removeExistingPhoto,
  removeImage,
  handleFileInputChange,
  handleDrop,
  isDragging,
  setIsDragging,
  cameraInputRef,
  fileInputRef,
  isMobileOrTablet,
  isPhotoSheetOpen,
  setIsPhotoSheetOpen,
}: Step2ExecutionAndMaterialsProps) {
  const isHarvestWorkType = formData.workType === "harvest";

  return (
    <div className="space-y-6">
      {/* 2. KHỐI HIỆN TRƯỜNG: HÌNH ẢNH, GHI CHÚ & CẢNH BÁO */}
      <Card className="border-none bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Camera className="h-4 w-4 text-emerald-600" />
            Hình ảnh & ghi chú
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          {/* Cảnh báo (Warning) */}
          {isMobileOrTablet ? (
            <MobileWarningCard
              checked={formData.warning}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, warning: checked }))
              }
            />
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/50 p-3.5">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <Label
                    htmlFor="diary-warning-switch"
                    className="text-sm font-semibold text-amber-900 cursor-pointer"
                  >
                    Đánh dấu cảnh báo cho nhật ký này
                  </Label>
                  <p className="text-xs text-amber-700">
                    Bật để gắn cờ cảnh báo đối với sự cố, sâu bệnh hoặc bất
                    thường phát hiện ngoài vườn
                  </p>
                </div>
              </div>
              <Switch
                id="diary-warning-switch"
                checked={formData.warning}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, warning: checked }))
                }
              />
            </div>
          )}

          {/* Mô tả chi tiết */}
          <div className="space-y-2">
            <Label>Mô tả chi tiết</Label>
            <Textarea
              placeholder="Nhập ghi chú chi tiết, tình trạng cây trồng hoặc quan sát thực tế..."
              rows={3}
              className="bg-white border-slate-200 focus:ring-emerald-500/20 text-sm"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          {/* Upload & Chụp hình ảnh */}
          <div className="space-y-2 pt-1">
            <Label>Hình ảnh đính kèm (nếu có)</Label>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />

            {isMobileOrTablet ? (
              <>
                <div
                  onClick={() => setIsPhotoSheetOpen(true)}
                  className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 hover:border-emerald-300 hover:bg-white p-4 text-center cursor-pointer transition-all active:scale-[0.99]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Chụp ảnh hoặc chọn từ thiết bị
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Chạm để chụp cây trồng trực tiếp hoặc tải từ album
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Sheet chọn nguồn ảnh */}
                <Sheet
                  open={isPhotoSheetOpen}
                  onOpenChange={setIsPhotoSheetOpen}
                >
                  <SheetContent
                    side="bottom"
                    className="rounded-t-3xl px-4 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] bg-white border-t border-slate-100 shadow-2xl"
                  >
                    <SheetHeader className="text-center pb-3 border-b border-slate-100">
                      <SheetTitle className="text-base font-bold text-slate-800 text-center">
                        Chọn nguồn ảnh
                      </SheetTitle>
                      <SheetDescription className="text-xs text-slate-500 text-center">
                        Chụp ảnh cây trồng trực tiếp tại vườn hoặc tải từ album
                        máy
                      </SheetDescription>
                    </SheetHeader>

                    <div className="flex flex-col gap-2.5 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-14 py-3 rounded-2xl border-emerald-200 bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100 flex items-center justify-start px-4 gap-3.5 shadow-xs transition-all text-left"
                        onClick={() => {
                          setIsPhotoSheetOpen(false);
                          setTimeout(
                            () => cameraInputRef.current?.click(),
                            150,
                          );
                        }}
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Chụp ảnh
                          </p>
                          <p className="text-xs text-slate-500">
                            Mở camera chụp trực tiếp tại vườn
                          </p>
                        </div>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="h-14 py-3 rounded-2xl border-slate-200 bg-white text-slate-800 hover:bg-slate-50 flex items-center justify-start px-4 gap-3.5 shadow-xs transition-all text-left"
                        onClick={() => {
                          setIsPhotoSheetOpen(false);
                          setTimeout(() => fileInputRef.current?.click(), 150);
                        }}
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                          <ImagePlus className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Chọn ảnh
                          </p>
                          <p className="text-xs text-slate-500">
                            Tải lên từ album ảnh trên thiết bị
                          </p>
                        </div>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        className="h-11 rounded-xl text-slate-500 hover:text-slate-800 font-medium mt-1"
                        onClick={() => setIsPhotoSheetOpen(false)}
                      >
                        Hủy bỏ
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-2xl border-2 border-dashed p-4 text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-slate-200 bg-slate-50/50 hover:border-emerald-300 hover:bg-white"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-emerald-600">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Kéo thả hình ảnh hoặc{" "}
                      <span className="text-emerald-600 underline">
                        tải lên từ thiết bị
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Hỗ trợ định dạng PNG, JPG, JPEG (Tối đa 10MB)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Danh sách ảnh đã có & ảnh mới */}
            {(existingPhotos.length > 0 || formData.images.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {/* Ảnh đã có từ trước */}
                {existingPhotos.map((photo, idx) => {
                  const imgUrl = photo.fileUrl || photo.thumbnail?.fileUrl;
                  const fileName = photo.fileName || `Ảnh #${idx + 1}`;
                  return (
                    <div
                      key={`existing-photo-${photo.objectKey || idx}`}
                      className="group relative h-24 rounded-xl overflow-hidden border border-emerald-300 bg-white shadow-2xs"
                    >
                      <img
                        src={imgUrl}
                        alt={fileName}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs z-10">
                        Ảnh đã có
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExistingPhoto(idx);
                        }}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-10 cursor-pointer"
                        title="Xóa ảnh này"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}

                {/* Ảnh mới tải lên */}
                {formData.images.map((file, idx) => (
                  <div
                    key={`new-image-${file.name}-${idx}`}
                    className="group relative h-24 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-blue-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs z-10">
                      Ảnh mới
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(idx);
                      }}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-10 cursor-pointer"
                      title="Xóa ảnh này"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 1. KHỐI THU HOẠCH (Nếu loại công việc là harvest) */}
      {isHarvestWorkType && (
        <Card className="border-none bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Apple className="h-4 w-4 text-emerald-600" />
              Chi tiết thu hoạch
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Đối tượng thu hoạch
                  </p>
                  <p className="text-xs text-slate-500">
                    Chọn theo vùng canh tác hoặc cây canh tác, sau đó nhập chi
                    tiết sản lượng cho từng mục.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        harvestScope: "region",
                        harvestTargets: [],
                        harvestDetails: [],
                      }));
                    }}
                    className={`h-11 rounded-xl border px-3 text-xs font-extrabold transition-all cursor-pointer ${
                      formData.harvestScope === "region"
                        ? "border-emerald-600 bg-emerald-50/60 text-emerald-700 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    Vùng canh tác
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        harvestScope: "crop",
                        harvestTargets: [],
                        harvestDetails: [],
                      }));
                    }}
                    className={`h-11 rounded-xl border px-3 text-xs font-extrabold transition-all cursor-pointer ${
                      formData.harvestScope === "crop"
                        ? "border-emerald-600 bg-emerald-50/60 text-emerald-700 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    Cây canh tác
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {formData.harvestScope === "region" ? (
                  <CultivationZoneSelector
                    regions={regionOptions}
                    existingSelections={existingGeoSelections}
                    onConfirm={handleConfirmGeoSelections}
                    regionOnly={true}
                    isMobile={isMobileOrTablet}
                    customTrigger={
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full cursor-pointer border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary font-bold gap-2 transition-all rounded-lg shadow-sm hover:shadow-md"
                      >
                        <Plus className="w-5 h-5" />
                        <span>
                          {formData.harvestDetails.length > 0
                            ? `Đã chọn ${formData.harvestDetails.length} vùng canh tác (Bấm để chọn lại)`
                            : "Chọn vùng canh tác..."}
                        </span>
                      </Button>
                    }
                  />
                ) : (
                  <HarvestTreeSelectorDialog
                    variants={cropSubjectVariants}
                    selectedItems={formData.harvestDetails
                      .filter((d) => d.codeName)
                      .map((d) => ({
                        id: d.targetId.toString(),
                        codeName: d.codeName,
                        label: d.targetLabel,
                        treeCode: d.codeName,
                        regionName: d.codeName,
                      }))}
                    onConfirmSelections={(trees) => {
                      const currentMap = new Map(
                        formData.harvestDetails.map((d) => [
                          String(d.targetId),
                          d,
                        ]),
                      );
                      const nextTargets = trees.map((t) =>
                        String(t.linkId ?? t.id),
                      );
                      const nextDetails = trees.map((t) => {
                        const targetIdStr = String(t.linkId ?? t.id);
                        const existing = currentMap.get(targetIdStr);
                        const label = t.name || `Giống #${t.id}`;
                        const codeName = t.code || label;

                        if (existing) {
                          return {
                            ...existing,
                            targetId: targetIdStr,
                            codeName,
                            targetLabel: label,
                          };
                        }
                        return {
                          id: `h-variant-${targetIdStr}`,
                          targetId: targetIdStr,
                          targetLabel: label,
                          codeName,
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
                )}

                {/* Chi tiết từng mục thu hoạch */}
                {formData.harvestDetails.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Chi tiết thu hoạch
                        </p>
                        <p className="text-xs text-slate-500">
                          Nhập mã, sản lượng và đơn vị cơ bản cho từng mục đã
                          chọn.
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold"
                      >
                        {formData.harvestDetails.length} mục
                      </Badge>
                    </div>

                    {isMobileOrTablet ? (
                      <div className="space-y-3">
                        {formData.harvestDetails.map((detail, index) => (
                          <MobileHarvestItemCard
                            key={detail.id}
                            detail={detail}
                            index={index}
                            harvestScope={formData.harvestScope}
                            unitOptions={getHarvestUnitOptions()}
                            onRemove={() =>
                              syncHarvestDetails(
                                formData.harvestTargets.filter(
                                  (id) => id !== detail.targetId,
                                ),
                              )
                            }
                            changeLocationTrigger={
                              formData.harvestScope === "region" ? (
                                <CultivationZoneSelector
                                  regions={regionOptions}
                                  existingSelections={existingGeoSelections}
                                  onConfirm={handleConfirmGeoSelections}
                                  regionOnly={true}
                                  isMobile={true}
                                  customTrigger={
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg cursor-pointer"
                                    >
                                      Đổi
                                    </Button>
                                  }
                                />
                              ) : undefined
                            }
                            onUpdateQuantity={(quantity) => {
                              setFormData((prev) => ({
                                ...prev,
                                harvestDetails: prev.harvestDetails.map(
                                  (item) =>
                                    item.id === detail.id
                                      ? { ...item, quantity }
                                      : item,
                                ),
                              }));
                            }}
                            onUpdateUnit={(unitBase) => {
                              setFormData((prev) => ({
                                ...prev,
                                harvestDetails: prev.harvestDetails.map(
                                  (item) =>
                                    item.id === detail.id
                                      ? { ...item, unitBase }
                                      : item,
                                ),
                              }));
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      formData.harvestDetails.map((detail, index) => (
                        <div
                          key={detail.id}
                          className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-3"
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
                              className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa mục này"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {formData.harvestScope === "region" ? (
                            <CultivationZoneSelector
                              regions={regionOptions}
                              existingSelections={existingGeoSelections}
                              onConfirm={handleConfirmGeoSelections}
                              regionOnly={true}
                              customTrigger={
                                <GeographicalSelectionCard
                                  codeName={detail.codeName}
                                  onChangeLocation={() => {}}
                                  onRemove={() =>
                                    syncHarvestDetails(
                                      formData.harvestTargets.filter(
                                        (id) => id !== detail.targetId,
                                      ),
                                    )
                                  }
                                />
                              }
                            />
                          ) : null}

                          <div className="grid grid-cols-12 gap-3">
                            <div className="space-y-1.5 col-span-12 md:col-span-8">
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
                            <div className="space-y-1.5 col-span-12 md:col-span-4">
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
                      ))
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/30 p-6 text-sm text-slate-500 font-medium">
                    Chưa chọn đối tượng thu hoạch nào.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. KHỐI CÔNG VIỆC THỰC HIỆN & CẤP PHÁT VẬT TƯ */}
      <div className="space-y-4">
        {/* Mức độ hoàn thành công việc (Slide bar 2 màu - Dành cho kế hoạch) */}
        {isPlannedMode && (
          <div
            className={`space-y-3.5 rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-2xs transition-all ${
              !selectedTask?.id &&
              !selectedStageId &&
              formData.selectedStages.length === 0
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
          >
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                    currentPercentage < previousPercentage
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Mức độ hoàn thành công việc
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Tự động tính toán theo tiến độ các công việc thuộc hạng mục
                  </p>
                </div>
              </div>

              {currentPercentage < previousPercentage && (
                <span className="text-[11px] font-extrabold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                  Giảm -{previousPercentage - currentPercentage}% so với trước
                  đó
                </span>
              )}
            </div>

            <div className="space-y-1 pt-1">
              <div className="relative flex items-center">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  disabled={true}
                  value={currentPercentage}
                  readOnly
                  style={{
                    background: sliderTrackBackground,
                  }}
                  className="w-full h-3 rounded-lg appearance-none accent-emerald-600 focus:outline-none cursor-not-allowed pointer-events-none"
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-600 border-t border-slate-100">
              {currentPercentage < previousPercentage ? (
                <>
                  <div className="flex items-center gap-1.5 font-bold text-blue-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Mức cập nhật mới ({currentPercentage}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-extrabold text-red-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span>
                      Khoảng giảm (-{previousPercentage - currentPercentage}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span>
                      Chưa hoàn thành ({Math.max(0, 100 - currentPercentage)}%)
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Tiến độ trước đó ({previousPercentage}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>
                      Cập nhật thêm đợt này (
                      {currentPercentage - previousPercentage}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span>
                      Chưa hoàn thành ({Math.max(0, 100 - currentPercentage)}%)
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <WorkAllocationCard
          title={
            isHarvestWorkType
              ? "Công việc thu hoạch & vật tư đóng gói"
              : "Công việc thực hiện & cấp phát vật tư"
          }
          selectedStages={formData.selectedStages}
          plannedStages={plannedStages}
          isPlannedMode={isPlannedMode}
          workTaskDetails={workTaskDetails}
          materialAllocations={formData.materialAllocations}
          domainCode={workflowDomainCode as DomainCode}
          workType={formData.workType}
          errors={errors}
          onAddStage={addStage}
          onRemoveStage={removeStage}
          onUpdateWorkTaskDetail={handleUpdateWorkTaskDetail}
          onAddMaterial={handleAddMaterial}
          onRemoveMaterial={handleRemoveMaterial}
          onUpdateActualQuantity={handleUpdateActualQuantity}
        />
      </div>
    </div>
  );
}
