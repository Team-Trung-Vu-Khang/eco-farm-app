import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Hash, Layers, Sprout } from "lucide-react";
import useVarietyStore from "@/stores/useVarietyStore";
import type { GrowthCycle } from "../types/types";

export const growthCycleColumns: Column<GrowthCycle>[] = [
  {
    key: "id",
    label: "Mã mẫu",
    render: (value) => (
      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border w-fit">
        <Hash className="w-3 h-3 opacity-60" />
        {value}
      </div>
    ),
  },
  {
    key: "name",
    label: "Chu kỳ",
    render: (value) => (
      <div className="flex items-center gap-2">
        <Sprout className="w-4 h-4 text-primary" />
        <span className="font-semibold">{value}</span>
      </div>
    ),
  },
  {
    key: "scope",
    label: "Phạm vi",
    render: (value) => (
      <Badge
        variant={value === "crop" ? "default" : "secondary"}
        className="text-[10px] font-bold uppercase"
      >
        {value === "crop" ? "Theo loại" : "Theo giống"}
      </Badge>
    ),
  },
  {
    key: "applyFor",
    label: "Áp dụng cho",
    render: (_, row: GrowthCycle) => {
      const label =
        row.scope === "crop"
          ? row.cropName
          : useVarietyStore.getState().getVarietyById(row.variety!)
              ?.varietyName;

      return (
        <div className="flex font-mono font-bold text-xs text-green-600 rounded-md bg-green-100 border border-green-200 px-2 py-1 items-center gap-3 w-fit">
          {label}
        </div>
      );
    },
  },
  {
    key: "totalDays",
    label: "Thời gian",
    render: (value) => (
      <Badge
        variant="secondary"
        className="bg-blue-50 text-blue-700 border-blue-100 text-[10px] font-bold uppercase tracking-wider"
      >
        {value} NGÀY
      </Badge>
    ),
  },
  {
    key: "numStages",
    label: "Số giai đoạn",
    render: (value) => (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
        <Layers className="w-3.5 h-3.5 opacity-60" />
        {value} giai đoạn
      </div>
    ),
  },
];
