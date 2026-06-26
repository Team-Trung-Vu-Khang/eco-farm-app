import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { DepartmentItem } from "../types/types";

const STATUS_LABELS: Record<string, string> = {
  active: "Hoạt động",
  inactive: "Ngừng hoạt động",
  archived: "Đã lưu trữ",
};

export const DEPARTMENT_COLUMNS: Column<DepartmentItem>[] = [
  {
    key: "code",
    label: "Mã phòng ban",
    render: (value) => (
      <span className="font-mono text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md tracking-widest">
        {value as string}
      </span>
    ),
  },
  { key: "name", label: "Tên phòng ban", sortable: true },
  {
    key: "description",
    label: "Mô tả",
    render: (value) => (
      <span className="text-sm text-slate-600 line-clamp-2">
        {(value as string) || "—"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge
        variant="outline"
        className={
          value === "active"
            ? "rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700"
            : value === "inactive"
              ? "rounded-full border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-600"
              : "rounded-full border-amber-200 bg-amber-50 px-2.5 py-1 font-medium text-amber-700"
        }
      >
        {STATUS_LABELS[String(value)] ?? String(value)}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    render: (value) => {
      const createdAt = value ? new Date(String(value)) : null;

      if (!createdAt || Number.isNaN(createdAt.getTime())) {
        return <span className="text-sm text-slate-400 italic">—</span>;
      }

      return (
        <span className="text-sm text-slate-600">
          {createdAt.toLocaleDateString("vi-VN")}
        </span>
      );
    },
  },
];
