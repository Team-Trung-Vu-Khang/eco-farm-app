import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  cn,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronDown, Filter, Layers } from "lucide-react";
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
}: MultiSelectFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
  <div ref={containerRef} className="relative space-y-2">
    <div className="flex items-center gap-2 ml-1">
      {Icon && <Icon size={14} className="text-slate-400" />}
      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
        {label}
      </Label>
    </div>
    <button
      type="button"
      className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-left text-sm shadow-sm"
      onClick={() => setIsOpen((open) => !open)}
    >
      <span className={selectedValues?.length ? "text-slate-800" : "text-slate-500"}>
        {selectedValues?.length === 1
          ? options.find(
              (option) => option.id.toString() === selectedValues[0]?.toString(),
            )?.name || placeholder
          : selectedValues?.length
            ? `Đã chọn ${selectedValues.length}`
            : placeholder}
      </span>
      <ChevronDown size={16} className="text-slate-400" />
    </button>
    {isOpen && (
      <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white p-1 shadow-lg">
        {options.map((opt) => {
          const isSelected = selectedValues?.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              className={cn(
                "flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm hover:bg-slate-50",
                isSelected && "bg-primary/5 font-bold",
              )}
              onClick={() => onToggle(opt.id)}
            >
              <Checkbox checked={isSelected} className="mr-2" />
              <span>{opt.name}</span>
            </button>
          );
        })}
      </div>
    )}
  </div>
  );
};

interface AdvancedFilterPanelProps {
  isOpen: boolean;
  filters: AdvancedFilters;
  onToggleFilter: (key: keyof AdvancedFilters, value: string) => void;
  onReset: () => void;
  onClose: () => void;
  resultCount: number;
  options: Record<keyof AdvancedFilters, { id: string; name: string }[]>;
}

export const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  isOpen,
  filters,
  onToggleFilter,
  onReset,
  onClose,
  resultCount,
  options,
}) => {
  if (!isOpen) return null;

  return (
    <div className="relative z-30 mt-2 overflow-visible rounded-md border bg-white shadow-sm animate-in slide-in-from-top-2 duration-200">
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
                  options={options[field.key]}
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
            Áp dụng
          </Button>
        </div>
      </div>
    </div>
  );
};
