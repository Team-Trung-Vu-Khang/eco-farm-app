import React from "react";
import {
  Badge,
  Button,
  Checkbox,
  cn,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Filter, Layers } from "lucide-react";
import { type AdvancedFilters, FILTER_GROUP_CONFIG } from "../data/constants";

interface MultiSelectFieldProps {
  label: string;
  options: { id: any; name: string }[];
  selectedValues?: any[];
  onToggle: (val: any) => void;
  placeholder?: string;
  icon?: any;
}

const MultiSelectField = ({
  label,
  options,
  selectedValues,
  onToggle,
  placeholder = "Tất cả",
  icon: Icon,
}: MultiSelectFieldProps) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 ml-1">
      {Icon && <Icon size={14} className="text-slate-400" />}
      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
        {label}
      </Label>
    </div>
    <Select
      value={selectedValues?.[0]?.toString() || ""}
      onValueChange={(v) => onToggle(v)}
    >
      <SelectTrigger className="rounded-md bg-white border-slate-200 h-10 shadow-sm text-sm">
        <SelectValue
          placeholder={
            selectedValues && selectedValues.length > 0
              ? `Đã chọn ${selectedValues.length}`
              : placeholder
          }
        />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem
            key={opt.id}
            value={opt.id.toString()}
            className={cn(
              selectedValues?.includes(opt.id) && "bg-primary/5 font-bold",
            )}
          >
            <div className="flex items-center gap-2 py-0.5">
              <Checkbox
                checked={selectedValues?.includes(opt.id)}
                onCheckedChange={() => onToggle(opt.id)}
                className="mr-2"
              />
              <span className="text-sm">{opt.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {selectedValues && selectedValues.length > 0 && (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {selectedValues.map((val) => {
          const opt = options.find((o) => o.id.toString() === val.toString());
          return (
            <Badge
              key={val}
              variant="secondary"
              className="text-[10px] h-6 bg-primary/5 text-primary border-primary/20 gap-1 px-2 rounded-md font-bold"
            >
              {opt?.name || val}
              <button
                className="cursor-pointer hover:text-destructive transition-colors ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(val);
                }}
              >
                ×
              </button>
            </Badge>
          );
        })}
      </div>
    )}
  </div>
);

interface AdvancedFilterPanelProps {
  isOpen: boolean;
  filters: AdvancedFilters;
  onToggleFilter: (key: keyof AdvancedFilters, value: string) => void;
  onReset: () => void;
  onClose: () => void;
  resultCount: number;
}

export const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  isOpen,
  filters,
  onToggleFilter,
  onReset,
  onClose,
  resultCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-white z-30 animate-in slide-in-from-top-2 duration-200 mt-2 border rounded-md overflow-hidden shadow-sm">
      <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-primary" />
          <h4 className="font-black text-sm uppercase tracking-widest text-slate-800">
            Cấu hình bộ lọc nâng cao
          </h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-primary hover:text-primary/80 font-black text-[10px] uppercase tracking-widest px-0 hover:bg-transparent"
        >
          Xóa tất cả bộ lọc
        </Button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {FILTER_GROUP_CONFIG.map((group, idx) => (
          <div key={idx} className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <group.icon size={18} />
              <h5 className="font-bold text-sm">{group.title}</h5>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {group.fields.map((field) => (
                <MultiSelectField
                  key={field.key}
                  label={field.label}
                  icon={field.icon}
                  options={field.options}
                  selectedValues={filters[field.key]}
                  onToggle={(val) => onToggleFilter(field.key, val)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Summary / Apply Column */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Layers size={18} />
              <h5 className="font-bold text-sm">3. Thống kê kết quả</h5>
            </div>
            <div className="p-5 rounded-md border border-dashed border-slate-200 bg-slate-50/50 space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                Dựa trên các bộ lọc đã chọn, hệ thống tìm thấy:
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-primary">
                  {resultCount}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  đơn vị phù hợp
                </span>
              </div>
            </div>
          </div>
          <Button
            className="w-full h-11 rounded-md font-bold bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            onClick={onClose}
          >
            Áp dụng và thu gọn
          </Button>
        </div>
      </div>
    </div>
  );
};
