import { useEffect, useRef, useState } from "react";
import { Button, Checkbox, cn, Input } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CalendarDays, ChevronDown, ClipboardList, Filter, Layers, Sprout } from "lucide-react";
import type { DiaryAdvancedFilters } from "../hooks/useDiaryLookupPage";

interface Option {
  id: string;
  name: string;
}

interface MultiSelectFieldProps {
  options: Option[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  placeholder?: string;
}

function MultiSelectField({
  options,
  selectedValues,
  onToggle,
  placeholder = "Tất cả",
}: MultiSelectFieldProps) {
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
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-left text-sm shadow-sm"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={selectedValues.length ? "text-slate-800" : "text-slate-500"}>
          {selectedValues.length === 1
            ? options.find((o) => o.id === selectedValues[0])?.name || placeholder
            : selectedValues.length
              ? `Đã chọn ${selectedValues.length}`
              : placeholder}
        </span>
        <ChevronDown size={16} className="text-slate-400" />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white p-1 shadow-lg">
          {options.length === 0 && (
            <p className="px-3 py-2 text-xs text-slate-400">Không có dữ liệu</p>
          )}
          {options.map((opt) => {
            const isSelected = selectedValues.includes(opt.id);
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
                <span className="truncate">{opt.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface DiaryAdvancedFilterPanelProps {
  isOpen: boolean;
  filters: DiaryAdvancedFilters;
  onToggleFilter: (key: "workflowIds" | "planIds" | "workTypes", value: string) => void;
  onDateChange: (key: "fromDate" | "toDate", value: string) => void;
  onReset: () => void;
  onApply: () => void;
  resultCount: number;
  workflowOptions: Option[];
  planOptions: Option[];
  workTypeOptions: Option[];
}

export function DiaryAdvancedFilterPanel({
  isOpen,
  filters,
  onToggleFilter,
  onDateChange,
  onReset,
  onApply,
  resultCount,
  workflowOptions,
  planOptions,
  workTypeOptions,
}: DiaryAdvancedFilterPanelProps) {
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

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-500 ml-1">
            <Sprout size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Vụ mùa / Vụ nuôi
            </span>
          </div>
          <MultiSelectField
            options={workflowOptions}
            selectedValues={filters.workflowIds.map(String)}
            onToggle={(v) => onToggleFilter("workflowIds", v)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-500 ml-1">
            <ClipboardList size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Kế hoạch
            </span>
          </div>
          <MultiSelectField
            options={planOptions}
            selectedValues={filters.planIds.map(String)}
            onToggle={(v) => onToggleFilter("planIds", v)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-500 ml-1">
            <Layers size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Loại công việc
            </span>
          </div>
          <MultiSelectField
            options={workTypeOptions}
            selectedValues={filters.workTypes}
            onToggle={(v) => onToggleFilter("workTypes", v)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-500 ml-1">
            <CalendarDays size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Từ ngày
            </span>
          </div>
          <Input
            type="date"
            className="h-10 bg-white border-slate-200"
            value={filters.fromDate}
            onChange={(e) => onDateChange("fromDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-500 ml-1">
            <CalendarDays size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Đến ngày
            </span>
          </div>
          <Input
            type="date"
            className="h-10 bg-white border-slate-200"
            value={filters.toDate}
            onChange={(e) => onDateChange("toDate", e.target.value)}
          />
        </div>
      </div>

      <div className="px-6 py-4 border-t bg-slate-50/60 flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500 font-medium">
          Dựa trên các bộ lọc đã chọn, hệ thống tìm thấy{" "}
          <span className="text-primary font-black px-1.5 py-0.5 bg-white rounded-md border border-slate-200">
            {resultCount}
          </span>{" "}
          nhật ký phù hợp.
        </p>
        <Button
          className="h-10 px-8 rounded-md font-bold bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform shrink-0"
          onClick={onApply}
        >
          Áp dụng
        </Button>
      </div>
    </div>
  );
}
