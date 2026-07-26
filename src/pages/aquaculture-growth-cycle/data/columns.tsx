import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Eye, Hash, Layers, MoreHorizontal, PencilLine, Sprout, Trash2 } from "lucide-react";
import type { GrowthCycle } from "@/pages/growth-cycle/types/types";

const formatDate = (value: unknown) => {
  const date = new Date(Number(value));
  if (Number.isNaN(date.getTime())) return "Không rõ";
  return date.toLocaleDateString("vi-VN");
};

function resolveApplyForLabel(row: GrowthCycle) {
  return row.cropName || row.cropId || "Chưa xác định";
}

export interface AquacultureGrowthCycleColumnActions {
  onView: (item: GrowthCycle) => void;
  onEdit: (item: GrowthCycle) => void;
  onDelete: (item: GrowthCycle) => void;
}

export function createAquacultureGrowthCycleColumns({
  onView,
  onEdit,
  onDelete,
}: AquacultureGrowthCycleColumnActions): Column<GrowthCycle>[] {
  return [
    {
      key: "id",
      label: "Mã chu kỳ",
      render: (value, item: GrowthCycle) => {
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
      label: "Tên chu kỳ",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Sprout className="h-4 w-4 text-primary" />
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
        const label = resolveApplyForLabel(row);
        return (
          <div className="flex w-fit items-center gap-2 rounded-md border border-emerald-200 bg-emerald-100 px-2 py-1 font-mono text-xs font-bold text-emerald-700">
            {label}
          </div>
        );
      },
    },
    {
      key: "totalDays",
      label: "Thời gian",
      render: (_value, row: GrowthCycle) => {
        let totalDays = 0;

        row.stages.forEach((stage) => {
          const durationStr = String(stage.duration || "");
          const yearMatch = durationStr.match(/(\d+)\s*năm/);
          const monthMatch = durationStr.match(/(\d+)\s*tháng/);
          const dayMatch = durationStr.match(/(\d+)\s*ngày/);

          if (yearMatch) totalDays += parseInt(yearMatch[1], 10) * 365;
          else if (monthMatch) totalDays += parseInt(monthMatch[1], 10) * 30;
          else if (dayMatch) totalDays += parseInt(dayMatch[1], 10);
          else if (!Number.isNaN(Number(durationStr))) {
            totalDays += Number(durationStr);
          }
        });

        return (
          <Badge
            variant="secondary"
            className="border-blue-100 bg-blue-50 text-[10px] font-bold uppercase tracking-wider text-blue-700"
          >
            {totalDays} ngày
          </Badge>
        );
      },
    },
    {
      key: "numStages",
      label: "Số giai đoạn",
      render: (value) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Layers className="h-3.5 w-3.5 opacity-60" />
          {value} giai đoạn
        </div>
      ),
    },
    {
      key: "updatedAt",
      label: "Cập nhật",
      render: (value) => (
        <span className="text-xs text-muted-foreground">{formatDate(value)}</span>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",
      render: (_, item: GrowthCycle) => (
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
          <DropdownMenuContent align="end" className="min-w-44">
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
