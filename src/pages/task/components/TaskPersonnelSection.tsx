import { Button, Label } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, X, type LucideIcon } from "lucide-react";
import type { Personnel } from "../../../stores/usePersonnelStore";

interface TaskPersonnelSectionProps {
  title: string;
  emptyLabel: string;
  addLabel?: string;
  values: string[];
  personnel: Personnel[];
  onAdd: () => void;
  onRemove: (name: string) => void;
  icon: LucideIcon;
  iconColorClassName: string;
  buttonClassName: string;
  cardClassName: string;
  emptyClassName: string;
}

export function TaskPersonnelSection({
  title,
  emptyLabel,
  addLabel = "Thêm",
  values,
  personnel,
  onAdd,
  onRemove,
  icon: Icon,
  iconColorClassName,
  buttonClassName,
  cardClassName,
  emptyClassName,
}: TaskPersonnelSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Icon className={`w-4 h-4 ${iconColorClassName}`} />
          {title}
        </Label>
        <Button
          variant="outline"
          size="sm"
          className={buttonClassName}
          onClick={onAdd}
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> {addLabel}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {values.map((name) => {
          const item = personnel.find((person) => person.fullName === name);

          return (
            <div
              key={name}
              className={`flex items-center justify-between p-3 rounded-2xl border group transition-all animate-in fade-in ${cardClassName}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 overflow-hidden rounded-xl border bg-white shadow-sm flex items-center justify-center shrink-0">
                  {item?.avatar ? (
                    <img
                      src={item.avatar}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon className={`w-4 h-4 ${iconColorClassName}`} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-none">
                    {name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {item?.taxCode || title}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full"
                onClick={() => onRemove(name)}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          );
        })}

        {values.length === 0 && (
          <div
            className={`py-5 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center ${emptyClassName}`}
          >
            <Icon className={`w-6 h-6 mb-1 ${iconColorClassName}`} />
            <p className="text-xs text-slate-400 italic">{emptyLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
}
