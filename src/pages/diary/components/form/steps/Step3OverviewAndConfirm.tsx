import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  Apple,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Image as ImageIcon,
  Layers,
  MapPin,
  Package,
  Sprout,
} from "lucide-react";
import {
  WORK_TYPE_OPTIONS,
  getWorkflowLabel,
} from "@/pages/diary/constants/history-form.constants";
import { formatDisplayDateTime } from "@/pages/diary/utils/history-form.utils";
import type { HistoryFormData } from "@/pages/diary/types/history-form.types";
import type { PhotoRequest } from "@/features/farm-daily-diary";
import type { WorkTaskDetail } from "@/pages/diary/components/form/WorkAllocationCard";
import type {
  FarmWorkflowResponse,
  FarmPlanResponse,
} from "@/features/farm-workflow/types/farm-workflow.type";
import type { FarmTaskResponse } from "@/features/farm-task/types/farm-task.type";

export interface Step3OverviewAndConfirmProps {
  formData: HistoryFormData;
  selectedWorkflow?: FarmWorkflowResponse;
  selectedPlan?: FarmPlanResponse;
  selectedStageId?: string;
  selectedTask?: FarmTaskResponse;
  isPlannedMode: boolean;
  workTaskDetails: Record<string, WorkTaskDetail>;
  existingPhotos: PhotoRequest[];
  workflowDomainCode: string;
  submittedByPersonnelName?: string;
  selectedCultivationZoneName?: string;
}

export function Step3OverviewAndConfirm({
  formData,
  selectedWorkflow,
  selectedPlan,
  selectedStageId,
  selectedTask,
  isPlannedMode,
  workTaskDetails,
  existingPhotos,
  workflowDomainCode,
  submittedByPersonnelName,
  selectedCultivationZoneName,
}: Step3OverviewAndConfirmProps) {
  // Tìm label & icon của loại công việc đã chọn
  const workTypeOption = WORK_TYPE_OPTIONS.find(
    (o) => o.value === formData.workType,
  );

  // Tìm tên hạng mục dự kiến
  const targetStage = selectedPlan?.stages?.find(
    (s) => String(s.id) === String(selectedStageId),
  );

  const hasHarvest =
    formData.workType === "harvest" && formData.harvestDetails.length > 0;
  const hasTasks = formData.selectedStages.length > 0;
  const hasMaterials = formData.materialAllocations.length > 0;
  const totalPhotosCount = existingPhotos.length + formData.images.length;

  return (
    <div className="space-y-6">
      {/* Banner hướng dẫn kiểm tra */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-900 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm">
            Kiểm tra thông tin trước khi lưu nhật ký
          </h4>
          <p className="text-xs text-emerald-800/90 mt-0.5">
            Dưới đây là bảng tổng quan toàn bộ nội dung bạn đã thiết lập ở các
            bước trước. Nếu cần chỉnh sửa, bạn có thể bấm nút Quay lại ở bên
            dưới.
          </p>
        </div>
      </div>

      {/* 1. THẺ TỔNG QUAN: VÙNG CANH TÁC, VỤ MÙA & LOẠI CÔNG VIỆC */}
      <Card className="border-none bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <ClipboardList className="h-4 w-4 text-emerald-600" />
            1. Vùng canh tác, Vụ mùa & Loại công việc
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              <span className="text-xs text-slate-400 font-semibold block">
                Vùng canh tác:
              </span>
              <p className="font-bold text-sm text-slate-900 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {selectedCultivationZoneName || "Chưa chọn vùng canh tác"}
                </span>
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              <span className="text-xs text-slate-400 font-semibold block">
                {getWorkflowLabel(workflowDomainCode)}:
              </span>
              <p className="font-bold text-sm text-slate-900 mt-1 flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{selectedWorkflow?.name || "Chưa chọn vụ mùa"}</span>
              </p>
              {selectedWorkflow?.code && (
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Mã: {selectedWorkflow.code}
                </span>
              )}
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 sm:col-span-2 lg:col-span-1">
              <span className="text-xs text-slate-400 font-semibold block">
                Loại công việc:
              </span>
              <div className="mt-1 flex items-center gap-2">
                {workTypeOption ? (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${workTypeOption.iconClass}`}
                    >
                      <workTypeOption.icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-slate-900">
                      {workTypeOption.label}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-500">Chưa chọn</span>
                )}
              </div>
            </div>
          </div>

          {/* Nếu là theo kế hoạch -> Thông tin kế hoạch & hạng mục */}
          {isPlannedMode && (
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-2">
              <span className="text-xs text-slate-400 font-semibold block">
                Thông tin kế hoạch & Hạng mục:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Kế hoạch: </span>
                  <span className="font-semibold text-slate-900">
                    {selectedPlan?.name || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Hạng mục: </span>
                  <span className="font-semibold text-slate-900">
                    {targetStage?.name || "—"}
                  </span>
                </div>
                {selectedTask && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">Công việc dự kiến: </span>
                    <span className="font-semibold text-slate-900">
                      {selectedTask.name}
                    </span>
                  </div>
                )}
                {submittedByPersonnelName && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">Người ghi nhận: </span>
                    <span className="font-semibold text-emerald-700">
                      {submittedByPersonnelName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. THẺ TỔNG QUAN: HÌNH ẢNH, GHI CHÚ & CẢNH BÁO */}
      <Card className="border-none bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <ImageIcon className="h-4 w-4 text-emerald-600" />
            2. Hình ảnh & ghi chú
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          {/* Trạng thái cảnh báo */}
          <div
            className={`rounded-xl p-3.5 border flex items-center gap-3 ${
              formData.warning
                ? "bg-amber-50/70 border-amber-200 text-amber-900"
                : "bg-slate-50 border-slate-100 text-slate-600"
            }`}
          >
            {formData.warning ? (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-bold text-xs text-amber-900">
                    Nhật ký có gắn cờ CẢNH BÁO
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Đã bật cờ cảnh báo đối với sự cố hoặc sâu bệnh phát sinh
                    ngoài ruộng.
                  </p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" />
                <p className="text-xs text-slate-600 font-medium">
                  Trạng thái bình thường — Không có cảnh báo sự cố.
                </p>
              </>
            )}
          </div>

          {/* Ghi chú */}
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">
              Ghi chú chi tiết:
            </span>
            <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
              {formData.description?.trim() || "Không có ghi chú thêm."}
            </p>
          </div>

          {/* Ảnh đính kèm */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-semibold block">
              Hình ảnh đính kèm ({totalPhotosCount}):
            </span>
            {totalPhotosCount > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Ảnh đã có */}
                {existingPhotos.map((photo, idx) => {
                  const imgUrl = photo.fileUrl || photo.thumbnail?.fileUrl;
                  return (
                    <div
                      key={`review-exist-${idx}`}
                      className="h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                    >
                      <img
                        src={imgUrl}
                        alt="Ảnh nhật ký"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  );
                })}
                {/* Ảnh mới */}
                {formData.images.map((file, idx) => (
                  <div
                    key={`review-new-${idx}`}
                    className="h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Ảnh mới"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Không đính kèm hình ảnh.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. THẺ TỔNG QUAN: CÔNG VIỆC THỰC HIỆN & THU HOẠCH */}
      <Card className="border-none bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Layers className="h-4 w-4 text-emerald-600" />
            3. Chi tiết thực hiện {hasHarvest ? " & Thu hoạch" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          {/* Thu hoạch */}
          {hasHarvest && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Apple className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Sản lượng thu hoạch ({formData.harvestDetails.length} mục)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formData.harvestDetails.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-900">
                        {item.targetLabel}
                      </p>
                      {item.codeName && (
                        <p className="text-[10px] text-slate-500">
                          Mã: {item.codeName}
                        </p>
                      )}
                    </div>
                    <Badge className="bg-emerald-600 text-white font-bold text-xs">
                      {item.quantity} {item.unitBase}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Các công việc cụ thể */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Công việc thực hiện ({formData.selectedStages.length})
            </span>
            {hasTasks ? (
              <div className="space-y-2">
                {formData.selectedStages.map((stageName, idx) => {
                  const detail = workTaskDetails[stageName];
                  return (
                    <div
                      key={stageName || idx}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-900 truncate">
                          {stageName}
                        </p>
                        {detail?.description && (
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {detail.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-medium text-slate-700">
                              {formatDisplayDateTime(detail?.startDate)}
                            </span>
                            <span className="text-slate-400">➔</span>
                            <span className="font-medium text-slate-700">
                              {formatDisplayDateTime(detail?.endDate)}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="font-bold border-blue-200 bg-blue-50 text-blue-700"
                        >
                          Tiến độ: {detail?.progress ?? 100}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Chưa có công việc con nào được ghi nhận.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 4. THẺ TỔNG QUAN: VẬT TƯ ĐÃ CẤP PHÁT */}
      <Card className="border-none bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Package className="h-4 w-4 text-emerald-600" />
            4. Vật tư sử dụng ({formData.materialAllocations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          {hasMaterials ? (
            <div className="space-y-2">
              {formData.materialAllocations.map((mat, idx) => (
                <div
                  key={mat.id || idx}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate text-sm">
                      {mat.materialName}
                    </p>
                    <p className="text-slate-400 text-[11px] truncate mt-0.5">
                      Công việc: {mat.stageId} • Phân loại: {mat.materialType}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-extrabold text-sm text-emerald-700">
                      {mat.actualQuantity || mat.quantity || 0}
                    </span>
                    <span className="text-slate-500 font-medium ml-1">
                      {mat.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400 italic">
              Không phát sinh vật tư trong đợt cập nhật này.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
