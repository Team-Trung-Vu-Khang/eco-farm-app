import { CheckCircle2, Sprout } from "lucide-react";
import type { CreateVarietyForm } from "../types/types";

export function SeedReviewStep({
  formData,
  illustrationPreview,
}: {
  formData: CreateVarietyForm;
  illustrationPreview: string;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6">
      <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-6">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
          <div className="h-16 w-16 rounded-lg border border-slate-200 bg-white p-1">
            {illustrationPreview ? (
              <img
                src={illustrationPreview}
                className="h-full w-full rounded-md object-cover"
                alt=""
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-md bg-slate-100">
                <Sprout className="h-6 w-6 text-slate-400" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {formData.varietyName}
            </h3>
            <p className="text-sm text-slate-500">{formData.varietyCode}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <ReviewItem label="Cây trồng" value={formData.crop} />
          <ReviewItem label="Nhà cung cấp" value={formData.supplier} />
          <ReviewItem label="Xuất xứ" value={formData.origin || "Chưa chọn"} />
          <ReviewItem
            label="Hạn sử dụng"
            value={formData.expiryDate?.toLocaleDateString("vi-VN") || "---"}
          />
          <ReviewItem
            label="Tỷ lệ nảy mầm"
            value={`${formData.germinationRate}%`}
          />
          <ReviewItem label="Độ sạch" value={`${formData.uniformity}%`} />
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-yellow-800">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <p className="text-sm">
          Vui lòng kiểm tra kỹ thông tin. Bạn có thể chỉnh sửa lại sau khi tạo.
        </p>
      </div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="font-medium text-slate-700">{value}</p>
    </div>
  );
}
