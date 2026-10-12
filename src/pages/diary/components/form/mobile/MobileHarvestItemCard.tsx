import React from "react";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin, Sprout, Trash2 } from "lucide-react";
import type { HarvestDetail } from "@/pages/diary/types/history-form.types";

interface MobileHarvestItemCardProps {
  detail: HarvestDetail;
  index: number;
  harvestScope: "region" | "crop";
  unitOptions: Array<{ label: string; value: string }>;
  onRemove: () => void;
  canRemove?: boolean;
  changeLocationTrigger?: React.ReactNode;
  onChangeLocation?: () => void;
  onUpdateQuantity: (quantity: string) => void;
  onUpdateUnit: (unit: string) => void;
}

export const MobileHarvestItemCard: React.FC<MobileHarvestItemCardProps> = ({
  detail,
  index,
  harvestScope,
  unitOptions,
  onRemove,
  canRemove = true,
  changeLocationTrigger,
  onChangeLocation,
  onUpdateQuantity,
  onUpdateUnit,
}) => {
  const isCrop = harvestScope === "crop";

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs space-y-3 transition-all">
      {/* Header: Icon, Tên vị trí/cây, Nút đổi và Nút xoá duy nhất */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            {isCrop ? (
              <Sprout className="w-4.5 h-4.5" />
            ) : (
              <MapPin className="w-4.5 h-4.5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded uppercase tracking-wide">
                Mục #{index + 1}
              </span>
              <p className="text-sm font-bold text-slate-800 truncate">
                {detail.targetLabel || "Chưa đặt tên"}
              </p>
            </div>
            {detail.codeName && detail.codeName !== detail.targetLabel && (
              <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                {detail.codeName}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {changeLocationTrigger ? (
            changeLocationTrigger
          ) : onChangeLocation ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onChangeLocation}
              className="h-7 px-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg"
            >
              Đổi
            </Button>
          ) : null}
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Xóa mục này"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Row: Sản lượng & Đơn vị cơ bản gộp chung 1 hàng ngang tối ưu màn hình mobile */}
      <div className="pt-1 border-t border-slate-100 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <Label className="text-xs font-semibold text-slate-600">
            Sản lượng thu hoạch <span className="text-red-500">*</span>
          </Label>
          <span className="text-[11px] text-slate-400">Đơn vị</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <Input
              type="number"
              placeholder="Nhập sản lượng (vd: 350)"
              value={detail.quantity}
              onChange={(e) => onUpdateQuantity(e.target.value)}
              className="h-10 bg-slate-50/50 border-slate-200 text-sm focus:bg-white transition-all font-medium"
            />
          </div>
          <div className="w-28 shrink-0">
            <Select value={detail.unitBase} onValueChange={onUpdateUnit}>
              <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200 text-sm font-semibold text-slate-700 focus:bg-white">
                <SelectValue placeholder="Đơn vị" />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
