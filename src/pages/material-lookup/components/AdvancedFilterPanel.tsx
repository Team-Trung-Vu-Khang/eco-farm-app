import { type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Label,
  Checkbox,
  Slider,
  Switch,
  Skeleton,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Filter,
  X,
  ShieldAlert,
  Clock,
  Activity,
  Database,
} from "lucide-react";
import { farmSupplyApi } from "@/features/farm-supply/api/farm-supply.api";
import type { MaterialFilters } from "../types/types";

interface AdvancedFilterPanelProps {
  filters: MaterialFilters;
  onChange: (filters: MaterialFilters) => void;
  onApply: (filters?: MaterialFilters) => void;
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
  // Fetch toxicity classification groups dynamically from Master Data API
  const { data: toxicityGroups, isLoading: isLoadingToxicity } = useQuery({
    queryKey: ["medicine-toxicity-groups"],
    queryFn: () =>
      farmSupplyApi.getClassificationGroups("medicine", "toxicity"),
    staleTime: 300_000,
  });

  const toggleStatus = (status: "active" | "inactive" | "maintenance") => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onChange({ ...filters, status: newStatus });
  };

  const toggleToxicityGroup = (groupId: number) => {
    const currentIds = filters.toxicityGroupIds || [];
    const newIds = currentIds.includes(groupId)
      ? currentIds.filter((id) => id !== groupId)
      : [...currentIds, groupId];
    onChange({ ...filters, toxicityGroupIds: newIds });
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Data Source Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Database className="h-4 w-4" />
                <h4 className="font-black text-xs uppercase tracking-widest">
                  Nguồn dữ liệu
                </h4>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="onlyOwner-switch"
                    className="text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    Chỉ vật tư cá nhân
                  </Label>
                  <p className="text-[10px] text-slate-400">
                    Bật để chỉ hiển thị vật tư trang trại tạo
                  </p>
                </div>
                <Switch
                  id="onlyOwner-switch"
                  checked={filters.onlyOwner ?? false}
                  onCheckedChange={(checked) =>
                    onChange({ ...filters, onlyOwner: checked })
                  }
                />
              </div>
            </div>

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
                  Độc tính (Thuốc BVTV)
                </h4>
              </div>
              {isLoadingToxicity ? (
                <div className="space-y-2">
                  <Skeleton className="h-9 w-full rounded-xl bg-slate-100" />
                  <Skeleton className="h-9 w-full rounded-xl bg-slate-100" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {toxicityGroups?.map((group: any) => {
                    const isSelected = (
                      filters.toxicityGroupIds || []
                    ).includes(group.id);
                    return (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => toggleToxicityGroup(group.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-slate-900 border-slate-900 text-white shadow-md"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-xs font-bold truncate">
                          {group.name || group.code}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isSelected ? "bg-emerald-400" : "bg-slate-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
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
            <Button
              className="rounded-md font-black"
              onClick={() => onApply(filters)}
            >
              Áp dụng bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
