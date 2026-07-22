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
  Workflow,
} from "lucide-react";
import { CROP_OPTIONS } from "@/constants/crops";
import useVarietyStore from "@/stores/useVarietyStore";
import type { AnimalGrowthCycle } from "../types/types";

function resolveCropLabel(cropId: string, cropName?: string) {
  return (
    CROP_OPTIONS.find((item) => item.id === cropId || item.name === cropId)?.name ||
    cropName ||
    cropId ||
    "Chưa xác định"
  );
}

function resolveApplyForLabel(row: AnimalGrowthCycle) {
  const cropLabel = resolveCropLabel(row.cropId, row.cropName);

  if (row.scope === "crop") {
    return cropLabel;
  }

  const varietyStore = useVarietyStore.getState();
  const variety =
    (row.variety && varietyStore.getVarietyById(row.variety)) || undefined;

  return (
    variety?.varietyName ||
    row.variety ||
    cropLabel ||
    "Chưa xác định"
  );
}

export interface AnimalGrowthCycleColumnActions {
  onView: (item: AnimalGrowthCycle) => void;
  onEdit: (item: AnimalGrowthCycle) => void;
  onDelete: (item: AnimalGrowthCycle) => void;
  onWorkflow: (item: AnimalGrowthCycle) => void;
}

export function createAnimalGrowthCycleColumns({
  onView,
  onEdit,
  onDelete,
  onWorkflow,
}: AnimalGrowthCycleColumnActions): Column<AnimalGrowthCycle>[] {
  return [
    {
      key: "id",
      label: "Mã mẫu",
      render: (value: any) => (
        <div className="flex w-fit items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1 font-mono text-xs font-bold text-muted-foreground">
          <Hash className="h-3 w-3 opacity-60" />
          {value}
        </div>
      ),
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
          {value === "crop" ? "Theo loại" : "Theo giống"}
        </Badge>
      ),
    },
    {
      key: "applyFor",
      label: "Áp dụng cho",
      render: (_, row: AnimalGrowthCycle) => {
        const label = resolveApplyForLabel(row);

        return (
          <div className="flex w-fit items-center gap-2 rounded-md border border-green-200 bg-green-100 px-2 py-1 font-mono text-xs font-bold text-green-700">
            {label}
          </div>
        );
      },
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
            <DropdownMenuItem onClick={() => onWorkflow(item)}>
              <Workflow className="mr-2 h-4 w-4" />
              Mở workflow
            </DropdownMenuItem>
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
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
