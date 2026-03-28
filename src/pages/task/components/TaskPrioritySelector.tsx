import { Label, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface TaskPrioritySelectorProps {
  value: "low" | "medium" | "high";
  onChange: (value: "low" | "medium" | "high") => void;
}

const PRIORITY_OPTIONS = [
  {
    id: "low",
    label: "Thấp",
    activeClass:
      "bg-emerald-500 text-white border-emerald-500 shadow-emerald-200",
    inactiveClass:
      "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
  },
  {
    id: "medium",
    label: "Thường",
    activeClass: "bg-amber-500 text-white border-amber-500 shadow-amber-200",
    inactiveClass:
      "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100",
  },
  {
    id: "high",
    label: "Cao",
    activeClass: "bg-rose-500 text-white border-rose-500 shadow-rose-200",
    inactiveClass:
      "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100",
  },
] as const;

export function TaskPrioritySelector({
  value,
  onChange,
}: TaskPrioritySelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
        Độ ưu tiên *
      </Label>
      <div className="grid grid-cols-3 gap-2">
        {PRIORITY_OPTIONS.map((option) => (
          <div
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "cursor-pointer px-2 py-3 rounded-xl border-2 text-center text-[10px] font-black uppercase transition-all shadow-sm",
              value === option.id
                ? `${option.activeClass} scale-105`
                : option.inactiveClass,
            )}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}
