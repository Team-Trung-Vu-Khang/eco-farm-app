import React, { useState, useMemo } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileText,
  HeartPulse,
  History,
  Layers,
  MapPin,
  ShieldCheck,
  Sprout,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useHealthDiaryStore } from "@/features/health-diary/stores/useHealthDiaryStore";
import type { HealthStatusType } from "@/features/health-diary/types/health-diary.types";

const renderStatusBadge = (status: HealthStatusType) => {
  if (status === "DISEASE_DETECTED") {
    return (
      <Badge
        variant="outline"
        className="bg-red-50 text-red-700 border-red-200 font-bold gap-1.5 px-3 py-1 text-xs rounded-l"
      >
        <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
        Phát hiện bệnh
      </Badge>
    );
  }
  if (status === "UNDER_TREATMENT") {
    return (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-700 border-amber-200 font-bold gap-1.5 px-3 py-1 text-xs rounded-l"
      >
        <Stethoscope className="w-3.5 h-3.5 text-amber-500" />
        Đang điều trị
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold gap-1.5 px-3 py-1 text-xs rounded-l"
    >
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
      Sức khỏe tốt
    </Badge>
  );
};

export default function HealthDiaryDetailPage() {
  const { recordId } = useParams<{ recordId: string }>();
  const [, setLocation] = useLocation();
  const { records } = useHealthDiaryStore();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const record = useMemo(() => {
    if (!recordId) return null;
    return (
      records.find((r) => String(r.id) === String(recordId)) ||
      records.find((r) => r.code === recordId) ||
      records[0]
    );
  }, [records, recordId]);

  if (!record) {
    return (
      <PageWrapper
        title="Không tìm thấy nhật ký sức khỏe"
        description="Rất tiếc, thông tin bản ghi sức khỏe bạn tìm kiếm không tồn tại hoặc đã bị xóa."
        actions={
          <Button
            variant="outline"
            className="h-10 px-4 text-sm font-semibold gap-2 border-slate-200 cursor-pointer"
            onClick={() => setLocation("/diary/health-history")}
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại lịch sử
          </Button>
        }
      >
        <div className="py-20 text-center space-y-4">
          <p className="text-slate-500 font-medium">
            Không tìm thấy bản ghi nhật ký sức khỏe với mã{" "}
            <code className="font-bold">{recordId}</code>.
          </p>
          <Button
            className="bg-emerald-600 text-white font-bold px-6 py-2 rounded-xl"
            onClick={() => setLocation("/diary/health-history")}
          >
            Trở về Lịch sử sức khỏe
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={`[${record.code}] Nhật ký tình trạng sức khỏe`}
      description="Xem chi tiết các lần ghi nhận nhật ký sức khỏe vùng trồng và cá thể cây"
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 px-4 text-sm font-semibold gap-2 border-slate-200 hover:bg-slate-50 cursor-pointer rounded-xl"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                setLocation("/diary/health-history");
              }
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>
      }
    >
      <div className="mx-auto w-full max-w-[1600px] pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── CỘT TRÁI (COL 8): THÔNG TIN BẢN GHI SỨC KHỎE & HÌNH ẢNH ── */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: Thông tin bản ghi sức khỏe */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {record.code}
                      </span>
                    </div>
                    <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
                      Nhật ký diễn biến sức khỏe
                    </h2>
                  </div>
                </div>

                <div>{renderStatusBadge(record.status)}</div>
              </div>

              {/* Grid Thông tin Vùng & Phương thức */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vùng canh tác */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Vùng canh tác
                  </span>
                  <p className="text-sm font-extrabold text-slate-800">
                    {record.zoneName}
                  </p>
                  <p className="text-xs text-slate-500">
                    Mã vùng:{" "}
                    <span className="font-mono font-bold text-slate-700">
                      ZONE-{record.zoneId || "59"}
                    </span>
                  </p>
                </div>

                {/* Phương thức cập nhật */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    {record.methodType === "ZONE_SCOPE" ? (
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    Phương thức cập nhật
                  </span>
                  <p className="text-sm font-extrabold text-slate-800">
                    {record.methodType === "ZONE_SCOPE"
                      ? "Theo phạm vi vùng trồng"
                      : `Theo cá thể cây (${record.plantCount || record.plantCodes?.length || 0} cây)`}
                  </p>
                  <p className="text-xs text-slate-500">
                    Thời gian:{" "}
                    <span className="font-bold text-slate-700">
                      {record.createdAt}
                    </span>
                  </p>
                </div>
              </div>

              {/* Phạm vi / Mã cây chịu ảnh hưởng */}
              <div className="space-y-2 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-2 border-b border-emerald-100">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Đối tượng & Phạm vi được cập nhật
                  </span>
                  <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                    {record.methodType === "ZONE_SCOPE"
                      ? `${record.targetScopeNames?.length || 1} phạm vi`
                      : `${record.plantCodes?.length || 0} cá thể`}
                  </Badge>
                </div>

                {record.methodType === "ZONE_SCOPE" ? (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(
                      record.targetScopeNames || [
                        record.regionName || "Khu vực A",
                      ]
                    ).map((scope, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-white border-emerald-300 text-emerald-800 font-bold text-xs py-1 px-3 rounded-lg shadow-2xs"
                      >
                        <MapPin className="w-3 h-3 text-emerald-600 mr-1" />
                        {scope}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2">
                    {record.plantCodes?.map((code) => (
                      <div
                        key={code}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white border border-emerald-200 shadow-2xs"
                      >
                        <div className="w-4 h-4 rounded bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <span className="font-mono font-extrabold text-xs text-slate-900 truncate">
                          {code}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: Nội dung diễn biến & Ghi chú */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm uppercase tracking-wider">
                  Ghi chú & Diễn biến sức khỏe
                </h3>
              </div>
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 font-medium text-slate-800 text-sm leading-relaxed">
                {record.notes || "Chưa có ghi chú mô tả chi tiết."}
              </div>
            </div>

            {/* Card 3: Hình ảnh bằng chứng minh họa */}
            {record.imageUrls && record.imageUrls.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-sm uppercase tracking-wider">
                      Hình ảnh bằng chứng thực địa ({record.imageUrls.length})
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {record.imageUrls.map((url, idx) => (
                    <div
                      key={idx}
                      onClick={() => setPreviewImage(url)}
                      className="group relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-2xs hover:shadow-md transition-all"
                    >
                      <img
                        src={url}
                        alt={`Ảnh minh họa ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        Xem phóng to
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── CỘT PHẢI (COL 4): LỊCH SỬ CẬP NHẬT (TIMELINE) & TÓM TẮT ── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card: Lịch sử ghi nhận */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <History className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800">
                  Nhật ký ghi nhận
                </h3>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-white">
                  <img
                    src={
                      record.createdBy?.avatar ||
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=Vu"
                    }
                    alt={record.createdBy?.name || "Người dùng"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-slate-900 truncate">
                    {record.createdBy?.name || "Trần Anh Vũ"}
                  </p>
                  <p className="text-[11px] text-slate-500 font-semibold truncate">
                    Nông hộ / Kỹ thuật viên
                  </p>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {/* Event Step 1 */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">
                      {record.createdAt}
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900 mt-0.5">
                      Ghi nhận nhật ký sức khỏe
                    </h4>
                    <div className="mt-1">
                      {renderStatusBadge(record.status)}
                    </div>
                  </div>
                </div>

                {/* Event Step 2 */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-slate-300" />
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">
                      Hệ thống tự động
                    </span>
                    <h4 className="text-xs font-bold text-slate-700 mt-0.5">
                      Đã đồng bộ lên hệ thống
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX IMAGE PREVIEW DIALOG */}
      {previewImage && (
        <Dialog
          open={!!previewImage}
          onOpenChange={() => setPreviewImage(null)}
        >
          <DialogContent className="max-w-3xl p-2 bg-slate-950 border-none shadow-2xl rounded-2xl overflow-hidden">
            <div className="relative flex items-center justify-center p-2">
              <img
                src={previewImage}
                alt="Hình ảnh bằng chứng phóng to"
                className="max-h-[80vh] w-auto object-contain rounded-xl"
              />
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </PageWrapper>
  );
}
