import React, { useState, useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  HeartPulse,
  Image as ImageIcon,
  Plus,
  Send,
  Trash2,
  AlertTriangle,
  Stethoscope,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import type { HealthStatusType } from "@/features/health-diary/types/health-diary.types";

interface HealthFormFieldsProps {
  onSubmit: (data: {
    status: HealthStatusType;
    notes: string;
    imageUrls: string[];
  }) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export const HealthFormFields: React.FC<HealthFormFieldsProps> = ({
  onSubmit,
  isSubmitting = false,
  submitLabel = "Lưu nhật ký sức khỏe",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<HealthStatusType>("DISEASE_DETECTED");
  const [notes, setNotes] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImageUrls((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl("");
    setShowUrlInput(false);
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrls((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrls((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      status,
      notes: notes.trim(),
      imageUrls,
    });
  };

  return (
    <Card className="border border-slate-200 bg-white rounded-xl shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <HeartPulse className="w-4 h-4" />
          </div>
          <span>Thông tin cập nhật sức khỏe</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Status Selection */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>Tình trạng sức khỏe</span>
              <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Option 1: Phát hiện bệnh */}
              <button
                type="button"
                onClick={() => setStatus("DISEASE_DETECTED")}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all text-left bg-white relative cursor-pointer",
                  status === "DISEASE_DETECTED"
                    ? "border-red-500 bg-red-50/30"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    status === "DISEASE_DETECTED"
                      ? "bg-red-500 text-white"
                      : "bg-red-100 text-red-600",
                  )}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <div
                    className={cn(
                      "text-xs font-bold leading-snug",
                      status === "DISEASE_DETECTED"
                        ? "text-red-900"
                        : "text-slate-800",
                    )}
                  >
                    Phát hiện bệnh
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Cảnh báo triệu chứng & nguy cơ
                  </div>
                </div>
                {status === "DISEASE_DETECTED" && (
                  <CheckCircle2 className="w-4 h-4 text-red-500 absolute top-3 right-3" />
                )}
              </button>

              {/* Option 2: Đang điều trị */}
              <button
                type="button"
                onClick={() => setStatus("UNDER_TREATMENT")}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all text-left bg-white relative cursor-pointer",
                  status === "UNDER_TREATMENT"
                    ? "border-amber-500 bg-amber-50/30"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    status === "UNDER_TREATMENT"
                      ? "bg-amber-500 text-white"
                      : "bg-amber-100 text-amber-600",
                  )}
                >
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <div
                    className={cn(
                      "text-xs font-bold leading-snug",
                      status === "UNDER_TREATMENT"
                        ? "text-amber-900"
                        : "text-slate-800",
                    )}
                  >
                    Đang điều trị
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Đang bón phân / phun xịt vi sinh
                  </div>
                </div>
                {status === "UNDER_TREATMENT" && (
                  <CheckCircle2 className="w-4 h-4 text-amber-500 absolute top-3 right-3" />
                )}
              </button>

              {/* Option 3: Sức khỏe tốt */}
              <button
                type="button"
                onClick={() => setStatus("HEALTHY")}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all text-left bg-white relative cursor-pointer",
                  status === "HEALTHY"
                    ? "border-emerald-500 bg-emerald-50/30"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    status === "HEALTHY"
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-100 text-emerald-600",
                  )}
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <div
                    className={cn(
                      "text-xs font-bold leading-snug",
                      status === "HEALTHY"
                        ? "text-emerald-900"
                        : "text-slate-800",
                    )}
                  >
                    Sức khỏe tốt
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Sinh trưởng bình thường, an toàn
                  </div>
                </div>
                {status === "HEALTHY" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute top-3 right-3" />
                )}
              </button>
            </div>
          </div>

          {/* 2. Notes */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700">
              Ghi chú chi tiết
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập mô tả chi tiết diễn biến triệu chứng, vị trí hoặc lưu ý lâm sàng..."
              className="min-h-[90px] border-slate-200 focus:border-emerald-500 rounded-xl bg-slate-50/50 text-xs"
            />
          </div>

          {/* 3. Image Upload Section */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Hình ảnh / Chứng từ đợt cập nhật (nếu có)</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs h-7 rounded-lg"
              >
                {showUrlInput ? "Đóng URL" : "Nhập URL ảnh"}
              </Button>
            </div>

            {showUrlInput && (
              <div className="flex gap-2 pb-1">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Dán đường dẫn URL hình ảnh..."
                  className="text-xs h-9"
                />
                <Button
                  type="button"
                  onClick={handleAddImage}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 text-xs font-bold"
                >
                  Thêm URL
                </Button>
              </div>
            )}

            {/* Drag & Drop Upload Zone */}
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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
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

            {/* Preview Grid */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 pt-2">
                {imageUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="group relative h-20 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs"
                  >
                    <img
                      src={url}
                      alt={`Minh họa ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      title="Xóa ảnh này"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
