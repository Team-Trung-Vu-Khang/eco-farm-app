import { Badge, DialogHeader, DialogTitle } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Filter, MapPin, X } from "lucide-react";
import type { Region } from "../../../../region-chart/constants";

type CultivationZoneDialogHeaderProps = {
  selections: Region[];
  onRemoveSelection: (region: Region) => void;
};

export function CultivationZoneDialogHeader({
  selections,
  onRemoveSelection,
}: CultivationZoneDialogHeaderProps) {
  return (
    <DialogHeader className="relative border-b bg-linear-to-br from-primary/10 via-white to-primary/5 p-8">
      <div className="absolute right-0 top-0 p-8 opacity-10">
        <MapPin size={120} className="rotate-12 text-primary" />
      </div>

      <DialogTitle className="flex items-center gap-3 text-2xl font-black text-slate-800">
        <div className="rounded-xl bg-primary p-2 shadow-lg shadow-primary/20">
          <MapPin className="h-6 w-6 text-white" />
        </div>
        Chọn vùng canh tác
      </DialogTitle>

      <p className="mt-2 font-medium text-slate-500">
        Lọc theo vị trí địa lý và doanh nghiệp để tìm vùng trồng phù hợp
      </p>

      <div className="custom-scrollbar mt-6 flex max-h-24 flex-wrap gap-2 overflow-y-auto">
        {selections.map((selection) => (
          <Badge
            key={selection.id}
            variant="secondary"
            className="animate-in fade-in zoom-in gap-2 border border-primary/20 bg-white py-1 pl-3 pr-1 font-bold text-primary shadow-sm duration-200"
          >
            {selection.name}
            <div
              className="cursor-pointer rounded-full bg-primary/10 p-0.5 transition-colors hover:bg-primary/20"
              onClick={() => onRemoveSelection(selection)}
            >
              <X size={12} />
            </div>
          </Badge>
        ))}
        {selections.length === 0 && (
          <div className="flex items-center gap-2 py-1 text-sm italic text-slate-400">
            <Filter size={14} />
            Chưa có vùng nào được chọn
          </div>
        )}
      </div>
    </DialogHeader>
  );
}
