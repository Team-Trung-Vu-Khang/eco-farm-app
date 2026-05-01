import { type FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Label,
  Checkbox,
  Slider,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Filter, X, ShieldAlert, Clock, Activity } from "lucide-react";
import type { MaterialFilters, WHOClass } from "../types/types";

interface AdvancedFilterPanelProps {
  filters: MaterialFilters;
  onChange: (filters: MaterialFilters) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

export const AdvancedFilterPanel: FC<AdvancedFilterPanelProps> = ({
  filters,
  onChange,
  onApply,
  onReset,
  onClose,
}) => {
  const toggleStatus = (status: "active" | "inactive" | "maintenance") => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onChange({ ...filters, status: newStatus });
  };

  const toggleToxicity = (tier: WHOClass) => {
    const newTox = filters.toxicity.includes(tier)
      ? filters.toxicity.filter((t) => t !== tier)
      : [...filters.toxicity, tier];
    onChange({ ...filters, toxicity: newTox });
  };

  return (
    <div className="bg-white z-30 animate-in slide-in-from-top-2 duration-200 mt-4 border rounded-2xl shadow-xl overflow-hidden">
      <Card className="border-none shadow-none">
        <CardHeader className="bg-slate-50 border-b pb-4 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="font-black text-primary flex items-center gap-2 uppercase tracking-widest text-sm">
              <Filter size={18} />
              Bộ lọc nâng cao
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-primary hover:text-primary/80 font-bold"
              >
                Xóa tất cả
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Status Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Activity className="h-4 w-4" />
                <h4 className="font-black text-xs uppercase tracking-widest">
                  Trạng thái hoạt động
                </h4>
              </div>
              <div className="space-y-3">
                {["active", "inactive", "maintenance"].map((s) => (
                  <div key={s} className="flex items-center gap-3">
                    <Checkbox
                      id={`status-${s}`}
                      checked={filters.status.includes(s as any)}
                      onCheckedChange={() => toggleStatus(s as any)}
                    />
                    <Label
                      htmlFor={`status-${s}`}
                      className="text-sm font-bold text-slate-600 capitalize cursor-pointer"
                    >
                      {s === "active"
                        ? "Đang hoạt động"
                        : s === "maintenance"
                          ? "Bảo trì"
                          : "Ngưng hoạt động"}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Toxicity Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-500">
                <ShieldAlert className="h-4 w-4" />
                <h4 className="font-black text-xs uppercase tracking-widest">
                  Độ độc (Pesticide)
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(["I", "II", "III", "IV"] as WHOClass[]).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => toggleToxicity(tier)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      filters.toxicity.includes(tier)
                        ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-xs font-black">Class {tier}</span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        tier === "I"
                          ? "bg-red-500"
                          : tier === "II"
                            ? "bg-orange-500"
                            : tier === "III"
                              ? "bg-blue-500"
                              : "bg-emerald-500"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* PHI Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-500">
                <Clock className="h-4 w-4" />
                <h4 className="font-black text-xs uppercase tracking-widest">
                  Thời gian cách ly (PHI)
                </h4>
              </div>
              <div className="px-2 pt-2">
                <Slider
                  min={0}
                  max={60}
                  step={1}
                  value={filters.phiRange}
                  onValueChange={(val) =>
                    onChange({ ...filters, phiRange: val as [number, number] })
                  }
                  className="mb-6"
                />
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  <span>{filters.phiRange[0]} ngày</span>
                  <span>{filters.phiRange[1]} ngày</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t">
            <Button className="rounded-md font-black" onClick={onApply}>
              Áp dụng bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
