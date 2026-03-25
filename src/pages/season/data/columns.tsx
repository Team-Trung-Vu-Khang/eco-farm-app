import useVarietyStore from "@/stores/useVarietyStore";
import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Calendar, FileText, Hash, Layers } from "lucide-react";
import { Link } from "wouter";
import type { Season } from "../types/types";
export const seasonColumns: Column<Season>[] = [
  {
    key: "code",
    label: "Mã mùa vụ",
    render: (value) => (
      <div className="flex w-fit items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1 font-mono text-xs font-bold text-muted-foreground">
        <Hash className="h-3 w-3 opacity-60" />
        {value}
      </div>
    ),
  },
  {
    key: "name",
    label: "Tên mùa vụ",
    render: (value, item) => (
      <Link href={`/season/${item.id}`}>
        <div className="cursor-pointer font-semibold text-primary hover:underline">
          {value}
        </div>
      </Link>
    ),
  },
  {
    key: "duration",
    label: "Thời gian",
    render: (_, item) => (
      <div className="flex items-center gap-1.5 text-xs">
        <Calendar className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-green-700">
          {item.duration} ngày
        </span>
      </div>
    ),
  },
  {
    key: "applyFor",
    label: "Áp dụng cho",
    render: (_value: string[], season) => {
      const variety = season.varietyId
        ? useVarietyStore.getState().getVarietyById(season.varietyId)
        : null;

      return (
        <div className="flex w-fit items-center gap-3 rounded-md border border-green-200 bg-green-100 px-2 py-1 font-mono text-xs font-bold text-green-600">
          {variety?.varietyName || season.cropId}
        </div>
      );
    },
  },
  {
    key: "stages",
    label: "Giai đoạn",
    render: (_, item) => {
      const stageCount = Object.values(item.selectedStages || {}).reduce(
        (count, stages) => count + Object.keys(stages).length,
        0,
      );

      return (
        <Badge
          variant="outline"
          className="gap-1.5 border-purple-200 bg-purple-50 text-purple-700"
        >
          <Layers className="h-3 w-3" />
          {stageCount} giai đoạn
        </Badge>
      );
    },
  },
  {
    key: "documents",
    label: "Tài liệu",
    render: (value: Document[]) =>
      value.length > 0 ? (
        <Badge
          variant="outline"
          className="gap-1.5 border-blue-200 bg-blue-50 text-blue-700"
        >
          <FileText className="h-3 w-3" />
          {value.length} tài liệu
        </Badge>
      ) : null,
  },
];
