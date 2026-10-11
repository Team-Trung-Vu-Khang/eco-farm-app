import React from "react";
import { Label, Switch, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlertTriangle } from "lucide-react";

interface MobileWarningCardProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const MobileWarningCard: React.FC<MobileWarningCardProps> = ({
  checked,
  onCheckedChange,
  className,
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200 overflow-hidden",
        checked
          ? "border-amber-300 bg-amber-50/70 shadow-xs ring-1 ring-amber-200/60"
          : "border-slate-200 bg-white hover:border-slate-300",
        className,
      )}
    >
      <div className="flex items-center justify-between p-3.5 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
              checked
                ? "bg-amber-500 text-white shadow-2xs"
                : "bg-amber-50 text-amber-600 border border-amber-200/60",
            )}
          >
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <Label
              htmlFor="mobile-diary-warning-switch"
              className={cn(
                "text-sm font-bold block cursor-pointer transition-colors truncate",
                checked ? "text-amber-950" : "text-slate-800",
              )}
            >
              Đánh dấu cảnh báo sự cố
            </Label>
            <p
              className={cn(
                "text-[11px] transition-colors truncate",
                checked ? "text-amber-700" : "text-slate-500",
              )}
            >
              Gắn cờ sâu bệnh, thời tiết bất thường ngoài vườn
            </p>
          </div>
        </div>

        <Switch
          id="mobile-diary-warning-switch"
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="shrink-0"
        />
      </div>

      {checked && (
        <div className="px-3.5 pb-3 pt-0 border-t border-amber-200/50 mt-0.5">
          <p className="text-[11px] text-amber-800 bg-amber-100/70 px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 mt-2">
            <span>⚠️</span>
            <span>
              Vui lòng nhập mô tả chi tiết hoặc chụp ảnh sự cố ở phần bên dưới.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
