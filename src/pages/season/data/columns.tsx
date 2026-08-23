import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Calendar, FileText, Layers } from "lucide-react";
import { CodeBadge } from "@/components/CodeBadge";
import { Link } from "wouter";
import { getDomainLabel } from "../utils/utils";
import type { MasterDataSeasonResponse } from "@/features/master-data/types/master-data.type";

export const seasonColumns: Column<MasterDataSeasonResponse>[] = [
  {
    key: "code",
    label: "Mã mùa vụ",
    render: (value) => <CodeBadge value={value} />,
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
    key: "stages",
    label: "Thời gian",
    render: (_, item) => {
      const totalDays = (item.stages || []).reduce(
        (sum, stage) => sum + (stage.durationDays || 0),
        0,
      );

      return (
        <div className="flex items-center gap-1.5 text-xs">
          <Calendar className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            {totalDays > 0 ? `${totalDays} ngày` : "-"}
          </span>
        </div>
      );
    },
  },
  {
    key: "domainCode",
    label: "Loại mùa vụ",
    render: (value: string) => (
      <div className="flex w-fit items-center gap-3 rounded-md border border-green-200 bg-green-100 px-2 py-1 font-mono text-xs font-bold text-green-600">
        {getDomainLabel(value as MasterDataSeasonResponse["domainCode"])}
      </div>
    ),
  },
  {
    key: "stages",
    label: "Giai đoạn",
    render: (_, item) => {
      const stageCount = (item.stages || []).length;

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
    key: "status",
    label: "Trạng thái",
    render: (value: string) => {
      const config: Record<
        string,
        {
          label: string;
          variant: "default" | "secondary" | "outline" | "destructive";
        }
      > = {
        active: { label: "Đang hoạt động", variant: "default" },
        inactive: { label: "Tạm ngưng", variant: "secondary" },
        archived: { label: "Lưu trữ", variant: "outline" },
      };
      const { label, variant } = config[value] || {
        label: value,
        variant: "outline" as const,
      };
      return (
        <Badge variant={variant} className="text-xs">
          {label}
        </Badge>
      );
    },
  },
];
