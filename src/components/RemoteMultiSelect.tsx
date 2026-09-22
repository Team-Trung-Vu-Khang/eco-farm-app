import {
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { useState } from "react";

export type RemoteMultiSelectOption = {
  label: string;
  value: string;
};

type RemoteMultiSelectProps = {
  options: RemoteMultiSelectOption[];
  value: string[];
  onChange: (next: string[]) => void;
  /** Called with the raw search term so the caller can query remotely. */
  onSearch: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  loading?: boolean;
  clearable?: boolean;
};

/**
 * Multi-value select whose option list is filtered remotely by the caller.
 * Mirrors the shared-ui MultiSelect, but delegates filtering to `onSearch`
 * instead of matching locally.
 */
export function RemoteMultiSelect({
  options,
  value,
  onChange,
  onSearch,
  placeholder = "Chọn...",
  searchPlaceholder = "Tìm kiếm...",
  emptyText = "Chưa có thông tin",
  disabled,
  loading,
  clearable = true,
}: RemoteMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleSearchChange = (next: string) => {
    setSearch(next);
    onSearch(next);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setSearch("");
      onSearch("");
    }
  };

  const labelFor = (optionValue: string) =>
    options.find((option) => option.value === optionValue)?.label ??
    optionValue;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "group h-auto min-h-9 w-full justify-between px-3 py-1 text-sm font-normal shadow-sm",
            !value.length && "text-muted-foreground",
          )}
        >
          <div className="flex flex-wrap items-center gap-2 text-left">
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              value.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="gap-2 rounded-full"
                >
                  {labelFor(item)}
                  <span
                    role="button"
                    tabIndex={0}
                    className="opacity-70 hover:opacity-100"
                    aria-label={`Xoá ${labelFor(item)}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onChange(value.filter((entry) => entry !== item));
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        event.stopPropagation();
                        onChange(value.filter((entry) => entry !== item));
                      }
                    }}
                  >
                    <X className="h-3 w-3" />
                  </span>
                </Badge>
              ))
            )}
          </div>
          <span className="ml-2 flex shrink-0 items-center">
            {clearable && value.length > 0 && !disabled && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Xoá tất cả"
                className="mr-2 hidden rounded-full p-0.5 opacity-60 transition-all hover:bg-muted hover:opacity-100 group-hover:block"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange([]);
                }}
              >
                <X className="h-3 w-3" />
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-70" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[--radix-popover-trigger-width] p-0"
      >
        {/* Filtering happens server side, so disable local matching. */}
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={handleSearchChange}
            placeholder={searchPlaceholder}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải...
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = value.includes(option.value);
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => toggle(option.value)}
                        className="flex items-center gap-3 py-3"
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <span>{option.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
