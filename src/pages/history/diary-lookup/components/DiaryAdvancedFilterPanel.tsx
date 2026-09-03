import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  cn,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Filter,
  Layers,
  Search,
  Sprout,
  X,
} from "lucide-react";
import type { DiaryAdvancedFilters } from "../hooks/useDiaryLookupPage";

export interface Option {
  id: string;
  name: string;
  workflowId?: string;
}

interface MultiSelectFieldProps {
  options: Option[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function MultiSelectField({
  options,
  selectedValues,
  onToggle,
  placeholder = "Tất cả",
  disabled = false,
}: MultiSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const q = searchTerm.toLowerCase();
    return options.filter((o) => o.name.toLowerCase().includes(q));
  }, [options, searchTerm]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        className={`flex h-10 w-full items-center justify-between rounded-md border px-3 text-left text-sm shadow-2xs transition-colors ${
          disabled
            ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-70"
            : selectedValues.length
              ? "border-green-300 bg-green-50/40 font-bold text-green-800 cursor-pointer"
              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 cursor-pointer"
        }`}
        onClick={() => {
          if (disabled) return;
          setIsOpen((open) => !open);
        }}
      >
        <span className="truncate pr-2">
          {disabled
            ? placeholder
            : selectedValues.length === 1
              ? options.find((o) => o.id === selectedValues[0])?.name ||
                placeholder
              : selectedValues.length
                ? `Đã chọn ${selectedValues.length}`
                : placeholder}
        </span>
        <ChevronDown size={16} className="text-slate-400 shrink-0" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 max-h-64 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg flex flex-col">
          {/* Thanh tìm kiếm trực tiếp trong dropdown */}
          <div className="p-1.5 border-b border-slate-100 bg-slate-50 sticky top-0 z-10 flex items-center gap-1.5">
            <Search size={14} className="text-slate-400 ml-1.5 shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-transparent py-1 px-1 text-slate-800 focus:outline-none placeholder:text-slate-400"
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-48 p-1">
            {filteredOptions.length === 0 && (
              <p className="px-3 py-2 text-xs text-slate-400 italic text-center">
                {searchTerm
                  ? "Không tìm thấy kết quả"
                  : "Không có lựa chọn phù hợp"}
              </p>
            )}
            {filteredOptions.map((opt) => {
              const isSelected = selectedValues.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors cursor-pointer",
                    isSelected && "bg-green-50 text-green-700 font-bold",
                  )}
                  onClick={() => onToggle(opt.id)}
                >
                  <Checkbox checked={isSelected} className="mr-2" />
                  <span className="truncate">{opt.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Chíp/Badge hiển thị các option đã chọn */}
      {!disabled && selectedValues.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedValues.map((val) => {
            const opt = options.find((o) => o.id === val);
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700 border border-green-200 shadow-2xs"
              >
                <span className="truncate max-w-[130px]">
                  {opt?.name || val}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(val);
                  }}
                  className="rounded-full hover:bg-green-200 p-0.5 text-green-700 transition-colors cursor-pointer"
                  title="Xóa lựa chọn này"
                >
                  <X size={11} />
                </button>
              </span>
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
  onToggleFilter: (
    key: "workflowIds" | "planIds" | "workTypes",
    value: string,
  ) => void;
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
  const isWorkflowSelected =
    Boolean(filters.workflowIds) && filters.workflowIds.length > 0;

  const selectedWorkflowIdStrings = useMemo(
    () => (filters.workflowIds || []).map(String),
    [filters.workflowIds],
  );

  const selectedPlanIdStrings = useMemo(
    () => (filters.planIds || []).map(String),
    [filters.planIds],
  );

  // Lọc kế hoạch theo Vụ mùa / Vụ nuôi đã chọn
  const availablePlanOptions = useMemo(() => {
    if (!isWorkflowSelected) {
      return [];
    }
    return planOptions.filter(
      (p) =>
        !p.workflowId ||
        selectedWorkflowIdStrings.includes(String(p.workflowId)),
    );
  }, [planOptions, selectedWorkflowIdStrings, isWorkflowSelected]);

  if (!isOpen) return null;

  return (
    <div className="relative z-30 mt-2 overflow-visible rounded-xl border border-slate-200 bg-white shadow-md animate-in slide-in-from-top-2 duration-200">
      <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-green-600" />
          <h4 className="font-black text-sm uppercase tracking-widest text-slate-800">
            Cấu hình bộ lọc nâng cao
          </h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-green-700 hover:text-green-800 font-bold text-xs uppercase tracking-wider px-2 hover:bg-green-50 rounded-lg cursor-pointer"
        >
          Xóa tất cả bộ lọc
        </Button>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        {/* Vụ mùa / Vụ nuôi */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-500 ml-1">
            <Sprout size={14} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Vụ mùa / Vụ nuôi
            </span>
          </div>
          <MultiSelectField
            options={workflowOptions}
            selectedValues={selectedWorkflowIdStrings}
            onToggle={(v) => onToggleFilter("workflowIds", v)}
            placeholder="Tất cả vụ mùa..."
          />
        </div>

        {/* Kế hoạch (Khóa khi chưa chọn Vụ mùa) */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-500 ml-1">
            <ClipboardList size={14} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Kế hoạch {isWorkflowSelected ? "(Đã lọc theo vụ)" : ""}
            </span>
          </div>
          <MultiSelectField
            options={availablePlanOptions}
            selectedValues={selectedPlanIdStrings}
            onToggle={(v) => onToggleFilter("planIds", v)}
            disabled={!isWorkflowSelected}
            placeholder={
              !isWorkflowSelected
                ? "Vui lòng chọn vụ mùa trước..."
                : "Tất cả kế hoạch..."
            }
          />
        </div>

        {/* Loại công việc */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-500 ml-1">
            <Layers size={14} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Nhóm công việc
            </span>
          </div>
          <MultiSelectField
            options={workTypeOptions}
            selectedValues={filters.workTypes}
            onToggle={(v) => onToggleFilter("workTypes", v)}
            placeholder="Tất cả nhóm công việc..."
          />
        </div>

        {/* Từ ngày */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-500 ml-1">
            <CalendarDays size={14} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Từ ngày
            </span>
          </div>
          <Input
            type="date"
            className="h-10 bg-white border-slate-200 text-sm font-medium"
            value={filters.fromDate}
            onChange={(e) => onDateChange("fromDate", e.target.value)}
          />
        </div>

        {/* Đến ngày */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-500 ml-1">
            <CalendarDays size={14} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Đến ngày
            </span>
          </div>
          <Input
            type="date"
            className="h-10 bg-white border-slate-200 text-sm font-medium"
            value={filters.toDate}
            onChange={(e) => onDateChange("toDate", e.target.value)}
          />
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4 rounded-b-xl">
        <p className="text-xs text-slate-500 font-medium">
          Dựa trên các bộ lọc đã chọn, hệ thống tìm thấy{" "}
          <span className="text-green-700 font-black px-2 py-0.5 bg-white rounded-md border border-slate-200 shadow-2xs">
            {resultCount}
          </span>{" "}
          nhật ký phù hợp.
        </p>
        <Button
          className="h-10 px-8 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/20 cursor-pointer shrink-0"
          onClick={onApply}
        >
          Áp dụng
        </Button>
      </div>
    </div>
  );
}
