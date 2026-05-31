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
    render: (value, row: GrowthCycle) => {
      let hasDays = false;
      let hasMonths = false;
      let hasYears = false;

      let sumYears = 0;
      let sumMonths = 0;
      let sumDays = 0;

      row.stages.forEach((stage) => {
        const durationStr = String(stage.duration || "");
        if (durationStr.includes("ngày")) hasDays = true;
        if (durationStr.includes("tháng")) hasMonths = true;
        if (durationStr.includes("năm")) hasYears = true;

        const yearMatch = durationStr.match(/(\d+)\s*năm/);
        const monthMatch = durationStr.match(/(\d+)\s*tháng/);
        const dayMatch = durationStr.match(/(\d+)\s*ngày/);

        if (yearMatch) sumYears += parseInt(yearMatch[1]);
        if (monthMatch) sumMonths += parseInt(monthMatch[1]);
        if (dayMatch) sumDays += parseInt(dayMatch[1]);

        if (
          !yearMatch &&
          !monthMatch &&
          !dayMatch &&
          !isNaN(Number(durationStr)) &&
          Number(durationStr) > 0
        ) {
          hasDays = true;
          sumDays += Number(durationStr);
        }
      });

      const computedTotalDays = sumYears * 365 + sumMonths * 30 + sumDays;

      let displayStr = "";
      if (hasDays) {
        displayStr = `${computedTotalDays} ngày`;
      } else if (hasMonths) {
        const totalMonths = sumYears * 12 + sumMonths;
        displayStr = `${totalMonths} tháng`;
      } else if (hasYears) {
        displayStr = `${sumYears} năm`;
      } else {
        displayStr = `${computedTotalDays} ngày`;
      }

      return (
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 border-blue-100 text-[10px] font-bold uppercase tracking-wider"
        >
          {displayStr}
        </Badge>
      );
    },
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
