import {
  cn,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, ChevronDown, Loader2, Search } from "lucide-react";
import { useState } from "react";

export interface RemoteSelectOption {
  value: string;
  label: string;
}

interface RemoteSearchSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: RemoteSelectOption[];
  selectedLabel?: string;
  searchValue: string;
  onSearchChange: (keyword: string) => void;
  loading?: boolean;
  disabled?: boolean;
  allLabel?: string;
  hideAllOption?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
}

/**
 * Single-select dropdown whose option list is fetched from the API by
 * keyword (debounced upstream) instead of being filtered client-side.
 */
export const RemoteSearchSelect: React.FC<RemoteSearchSelectProps> = ({
  value,
  onChange,
  options,
  selectedLabel,
  searchValue,
  onSearchChange,
  loading = false,
  disabled = false,
  allLabel = "Tất cả",
  hideAllOption = false,
  searchPlaceholder = "Tìm kiếm...",
  emptyText = "Chưa có thông tin",
}) => {
  const [open, setOpen] = useState(false);

  const triggerLabel =
    value === "all" ? allLabel : selectedLabel || options[0]?.label || "...";

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) onSearchChange("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="flex w-full items-center justify-between gap-2 rounded-lg border border-input bg-white px-3 py-2 text-left text-sm shadow-sm transition-colors hover:border-primary/40 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="min-w-0 truncate text-slate-700">
            {triggerLabel}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="z-[9999] w-[--radix-popover-trigger-width] min-w-[220px] rounded-xl border border-slate-200 bg-white p-0 shadow-xl"
      >
        <div className="border-b p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-8 rounded-lg bg-slate-50 pl-8 pr-14 text-xs focus:bg-white"
            />
            {loading && (
              <Loader2 className="pointer-events-none absolute right-8 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        <ScrollArea className="max-h-64">
          <div className="space-y-0.5 p-1">
            {!hideAllOption && (
              <button
                type="button"
                onClick={() => {
                  onChange("all");
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors hover:bg-slate-50",
                  value === "all" && "bg-primary/5 text-primary",
                )}
              >
                {allLabel}
                {value === "all" && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            )}

            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors hover:bg-slate-50",
                  value === option.value && "bg-primary/5 text-primary",
                )}
              >
                <span className="min-w-0 truncate">{option.label}</span>
                {value === option.value && (
                  <Check className="h-3.5 w-3.5 shrink-0" />
                )}
              </button>
            ))}

            {!loading && options.length === 0 && (
              <p className="px-2.5 py-3 text-center text-xs italic text-slate-400">
                {emptyText}
              </p>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
