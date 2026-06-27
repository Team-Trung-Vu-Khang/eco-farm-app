import {
  Archive,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useFormContext } from "react-hook-form";
import type { VarietyFoundationFormValues } from "../schemas/varietyFoundationSchema";

interface VarietyFoundationConfirmationStepProps {
  selectedCrop?: {
    name?: string;
    image?: string;
    group?: string;
  };
  mode: "create" | "edit";
}

export function VarietyFoundationConfirmationStep({
  selectedCrop,
  mode,
}: VarietyFoundationConfirmationStepProps) {
  const { watch } = useFormContext<VarietyFoundationFormValues>();
  const formData = watch();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center space-y-4 py-8">
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-lg shadow-green-100/50 ring-4 ring-white animate-in zoom-in spin-in-12 duration-700">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            {mode === "edit" ? "Xác nhận thay đổi" : "Xác nhận thông tin"}
          </h3>
          <p className="text-slate-500 max-w-lg mx-auto text-sm mt-2 leading-relaxed">
            {mode === "edit"
              ? "Đảm bảo mọi thông tin là chính xác trước khi cập nhật."
              : "Vui lòng kiểm tra kỹ tất cả các thông tin trước khi khởi tạo."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-md ring-1 ring-slate-200">
          <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
              <Archive className="w-4 h-4 text-green-600" />
              Thông tin chung
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              {selectedCrop?.image ? (
                <img
                  src={selectedCrop.image}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover shadow-sm bg-white ring-2 ring-white"
                />
              ) : null}
              <div>
                <h4 className="font-bold text-lg text-slate-900">
                  {selectedCrop?.name || formData.crop || "---"}
                </h4>
                <p className="text-sm text-slate-500 font-medium">
                  Nhóm: {selectedCrop?.group || "---"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Mã giống
                </p>
                <p className="font-bold text-slate-900 text-lg">
                  {formData.varietyFoundationCode || "---"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tên giống
                </p>
                <p className="font-bold text-green-700 text-lg">
                  {formData.varietyFoundationName || "---"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tên khoa học
                </p>
                <p className="text-slate-700 italic font-serif">
                  {formData.scientificName || "---"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Nguồn gốc
                </p>
                <p className="text-slate-700">{formData.origin || "---"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Thời gian sinh trưởng
                </p>
                <p className="text-slate-700">{formData.growthDuration || "---"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Năng suất bình quân
                </p>
                <p className="text-slate-700">{formData.averageYield || "---"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Mô tả
              </p>
              <p className="text-slate-600 leading-relaxed text-sm">
                {formData.description || "Chưa có mô tả"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-md ring-1 ring-slate-200">
          <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
              <FileText className="w-4 h-4 text-purple-600" />
              Tài liệu kỹ thuật
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Hình thức
              </p>
              <p className="font-medium text-slate-800">
                {formData.contentType === "pdf" ? "Tệp PDF" : "Soạn thảo nội dung"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tệp đính kèm
              </p>
              <p className="text-sm text-slate-600">
                {formData.contentType === "pdf"
                  ? formData.pdfFile?.name || "Chưa tải lên"
                  : "Nội dung được nhập trực tiếp trong trình soạn thảo"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
