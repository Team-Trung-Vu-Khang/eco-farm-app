import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CATEGORY_LABELS } from "./constants";
import type { PlanType } from "../types/types";

export const planTypeColumns: Column<PlanType>[] = [
  {
    key: "code",
    label: "Mã loại",
    render: (value) => <span className="font-medium font-mono">{value}</span>,
  },
  {
    key: "name",
    label: "Tên loại kế hoạch",
    render: (value, row) => (
      <div className="flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full shadow-sm"
          style={{ backgroundColor: row.color }}
        />
        <span className="font-semibold">{value}</span>
      </div>
    ),
  },
  {
    key: "category",
    label: "Nhóm",
    render: (value) => (
      <Badge variant="outline" className="bg-background">
        {CATEGORY_LABELS[value as string] || value}
      </Badge>
    ),
  },
  {
    key: "description",
    label: "Mô tả",
    render: (value) => (
      <span
        className="block max-w-[300px] truncate text-muted-foreground"
        title={value}
      >
        {value}
      </span>
    ),
  },
];
