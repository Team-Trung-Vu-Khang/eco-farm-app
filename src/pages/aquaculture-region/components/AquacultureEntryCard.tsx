import React, { useState } from "react";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronDown, ChevronRight, Sprout, Trash2 } from "lucide-react";
import type { PlantEntry } from "./types";

interface PlantCardProps {
  plant: PlantEntry;
  index: number;
  onUpdate: (partial: Partial<PlantEntry>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export const PlantCard = ({
  plant,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: PlantCardProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      id={`plant-${plant.entryId}`}
      className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white"
    >
      <div
        className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 border-b cursor-pointer select-none"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-800 text-sm truncate flex items-center gap-2">
            {`Đối tượng nuôi ${index + 1}`}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {canRemove && (
            <button
              type="button"
              className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="p-5 space-y-5">
          <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-100 bg-emerald-50/40">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                Thông tin mẫu
              </div>
              <div className="text-sm text-emerald-900">
                Nhập thông tin cơ bản của từng cá thể thủy sản. Không cần
                tọa độ, bản đồ hay vị trí định danh cho bước này.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`height-${plant.entryId}`} className="text-xs">
                Kích cỡ / chiều dài
              </Label>
              <Input
                id={`height-${plant.entryId}`}
                type="text"
                placeholder="VD: 12 cm"
                value={plant.height}
                onChange={(e) => onUpdate({ height: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Độ tuổi</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Số"
                  className="flex-1"
                  value={plant.ageValue}
                  onChange={(e) => onUpdate({ ageValue: e.target.value })}
                />
                <Select
                  value={plant.ageUnit}
                  onValueChange={(val) => onUpdate({ ageUnit: val })}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Ngày</SelectItem>
                    <SelectItem value="months">Tháng</SelectItem>
                    <SelectItem value="years">Năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <Label htmlFor={`date-${plant.entryId}`} className="text-xs">
                Ngày ghi nhận
              </Label>
              <Input
                type="date"
                value={plant.plantedDate}
                id={`date-${plant.entryId}`}
                onChange={(e) => onUpdate({ plantedDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`note-${plant.entryId}`} className="text-xs">
              Ghi chú
            </Label>
            <textarea
              id={`note-${plant.entryId}`}
              rows={2}
              className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white resize-none"
              placeholder="Ghi nhận đặc điểm riêng của cá thể..."
              value={plant.note}
              onChange={(e) => onUpdate({ note: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
};
