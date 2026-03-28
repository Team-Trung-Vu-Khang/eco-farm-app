import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, Search, User, Users, type LucideIcon } from "lucide-react";
import type { TaskAssigneeOption } from "../types/form";

interface TaskPersonnelPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  options: TaskAssigneeOption[];
  selectedValues: string[];
  onToggle: (name: string) => void;
  confirmLabel: string;
  colorClassName: string;
  icon: LucideIcon;
  teamMode?: boolean;
  large?: boolean;
}

export function TaskPersonnelPickerDialog({
  open,
  onOpenChange,
  title,
  description,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  options,
  selectedValues,
  onToggle,
  confirmLabel,
  colorClassName,
  icon: Icon,
  teamMode = false,
  large = false,
}: TaskPersonnelPickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 overflow-hidden",
          large
            ? "max-w-md border-none shadow-2xl rounded-[32px]"
            : "max-w-md",
        )}
      >
        <DialogHeader className={cn(large ? "p-8 pb-4 bg-slate-50/50" : "p-6 pb-3 border-b")}>
          <DialogTitle
            className={cn(
              "flex items-center gap-2",
              large && "text-2xl font-black tracking-tight",
            )}
          >
            <Icon className={cn("w-4 h-4", large && "w-6 h-6", colorClassName)} />
            {title}
          </DialogTitle>
          {description && (
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              {description}
            </p>
          )}
        </DialogHeader>

        <div className={cn(large ? "p-8 pt-4 space-y-6" : "px-5 pb-3 pt-4")}>
          <div className="relative group">
            <Search
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-slate-400",
                large
                  ? "left-4 w-4 h-4 group-focus-within:text-emerald-500 transition-colors"
                  : "left-3 w-3.5 h-3.5",
              )}
            />
            <Input
              placeholder={searchPlaceholder}
              className={cn(
                large
                  ? "pl-11 h-12 rounded-xl border-slate-200 focus:border-emerald-500 transition-all font-medium"
                  : "pl-9 h-9 text-sm",
              )}
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          <ScrollArea className={large ? "h-[350px] border-none pr-4" : "h-[300px] px-3"}>
            <div className="space-y-2 pb-2">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.name);

                return (
                  <div
                    key={option.id}
                    className={cn(
                      large
                        ? "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-2"
                        : "w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left cursor-pointer",
                      isSelected
                        ? large
                          ? "bg-emerald-50 border-emerald-500/20 shadow-sm"
                          : "bg-white border-slate-200"
                        : large
                          ? "bg-white border-transparent hover:border-slate-100 hover:bg-slate-50"
                          : "bg-white border-transparent hover:border-slate-200",
                    )}
                    onClick={() => onToggle(option.name)}
                  >
                    {large && (
                      <Checkbox
                        checked={isSelected}
                        className="rounded-md border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-none"
                      />
                    )}

                    <div
                      className={cn(
                        "overflow-hidden border bg-slate-100 flex items-center justify-center shrink-0",
                        large
                          ? "h-11 w-11 rounded-[15px] border-2 border-white shadow-sm"
                          : "h-9 w-9 rounded-full",
                      )}
                    >
                      {teamMode ? (
                        <Users className={cn(large ? "w-5 h-5 text-blue-500" : "w-4 h-4", colorClassName)} />
                      ) : option.avatar ? (
                        <img
                          src={option.avatar}
                          alt={option.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className={cn(large ? "w-5 h-5" : "w-4 h-4", colorClassName)} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={cn(large ? "text-sm font-black text-slate-800 leading-none mb-1" : "text-sm font-semibold text-slate-800 truncate")}>
                        {option.name}
                      </p>
                      <p className={cn(large ? "text-[10px] text-slate-400 font-mono tracking-tighter" : "text-[11px] text-slate-400 truncate")}>
                        {option.code || "—"}
                      </p>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className={cn(large ? "w-4 h-4 text-emerald-600" : `w-4 h-4 shrink-0 ${colorClassName}`)} />
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className={cn(large ? "p-8 bg-slate-900 border-none" : "p-4 bg-slate-50 border-t")}>
          <Button
            className={cn(
              "w-full",
              large
                ? "h-14 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black text-lg shadow-xl active:translate-y-1 transition-all"
                : "",
            )}
            onClick={() => onOpenChange(false)}
          >
            {confirmLabel} ({selectedValues.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
