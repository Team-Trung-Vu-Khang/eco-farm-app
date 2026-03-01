import { Checkbox } from "@tankhang1/eco-shared-ui";

export const StageItem = ({
  stage,
  index,
  checked,
  onChange,
}: {
  stage: string;
  index: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div
    className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${checked ? "bg-primary/5 border-primary/20" : "bg-white hover:bg-slate-50"}`}
  >
    <div className="flex items-center justify-center">
      <Checkbox checked={checked} onCheckedChange={(c) => onChange(!!c)} />
    </div>
    <div
      className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${checked ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}
    >
      {index + 1}
    </div>
    <div
      className={`flex-1 font-medium ${checked ? "text-slate-900" : "text-slate-500"}`}
    >
      {stage}
    </div>
  </div>
);
