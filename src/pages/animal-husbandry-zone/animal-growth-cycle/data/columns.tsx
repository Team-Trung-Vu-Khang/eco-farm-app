import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Eye,
  Hash,
  Layers,
  MoreHorizontal,
  PencilLine,
  Sprout,
  Trash2,
} from "lucide-react";
import type { AnimalGrowthCycle } from "../types/types";

export interface AnimalGrowthCycleColumnActions {
  onView: (item: AnimalGrowthCycle) => void;
  onEdit: (item: AnimalGrowthCycle) => void;
  onDelete: (item: AnimalGrowthCycle) => void;
}

export function createAnimalGrowthCycleColumns({
  onView,
  onEdit,
  onDelete,
}: AnimalGrowthCycleColumnActions): Column<AnimalGrowthCycle>[] {
  return [
    {
      key: "id",
      label: "Mã mẫu",
      render: (value: any, item: AnimalGrowthCycle) => {
        const cleanId = String(value).replace(/^(foundation-|user-)/, "");
        const isFoundation = item.isFoundation ?? String(value).startsWith("foundation-");

        return (
          <div className="flex flex-col gap-1">
            <div className="flex w-fit items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1 font-mono text-xs font-bold text-muted-foreground">
              <Hash className="h-3 w-3 opacity-60" />
              {cleanId}
            </div>
            <Badge
              variant={isFoundation ? "secondary" : "outline"}
              className={
                isFoundation
                  ? "border-blue-200 bg-blue-50 text-[10px] font-bold text-blue-700 w-fit"
                  : "border-green-200 bg-green-50 text-[10px] font-bold text-green-700 w-fit"
              }
            >
              {isFoundation ? "Hệ thống" : "Cá nhân"}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "name",
      label: "Chu kỳ",
      render: (value: any) => (
        <div className="flex items-center gap-2">
          <Sprout className="h-4 w-4 text-primary" />
          <span className="font-semibold">{value}</span>
        </div>
      ),
    },
    {
      key: "scope",
      label: "Phạm vi",
      render: (value: any) => (
        <Badge
          variant={value === "crop" ? "default" : "secondary"}
          className="text-[10px] font-bold uppercase"
        >
          {value === "group" ? "Theo nhóm vật nuôi" : value === "crop" ? "Theo vật nuôi" : "Theo giống vật nuôi"}
        </Badge>
      ),
    },
    {
      key: "totalDays",
      label: "Thời gian",
      render: (_value, row: AnimalGrowthCycle) => {
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
            className="border-blue-100 bg-blue-50 text-[10px] font-bold uppercase tracking-wider text-blue-700"
          >
            {displayStr}
          </Badge>
        );
      },
    },
    {
      key: "numStages",
      label: "Số giai đoạn",
      render: (value: any) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Layers className="h-3.5 w-3.5 opacity-60" />
          {value} giai đoạn
        </div>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",
      render: (_, item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-primary"
            >
              <span className="sr-only">Mở menu thao tác</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            <DropdownMenuItem onClick={() => onView(item)}>
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </DropdownMenuItem>
            {!item.isFoundation && (
              <>
                <DropdownMenuItem onClick={() => onEdit(item)}>
                  <PencilLine className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(item)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
