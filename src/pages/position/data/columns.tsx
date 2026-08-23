import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CodeBadge } from "@/components/CodeBadge";
import type { PositionItem } from "../types";

function formatDateTime(value: unknown) {
  if (!value) return "—";

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export const positionColumns: Column<PositionItem>[] = [
  {
    key: "code",
    label: "Mã chức vụ",
    render: (value) => <CodeBadge value={value} />,
  },
  { key: "name", label: "Tên chức vụ" },
  {
    key: "positionGroup",
    label: "Nhóm chức vụ",
    render: (_value, row) => (
      <span className="text-sm text-slate-700">
        {(row.positionGroup && row.positionGroup.name) || "—"}
      </span>
    ),
  },
  { key: "description", label: "Mô tả chức vụ" },
  {
    key: "responsibilityDescription",
    label: "Mô tả trách nhiệm",
    render: (value) => (
      <span
        className="block max-w-[280px] truncate text-sm text-slate-600"
        title={String(value ?? "")}
      >
        {String(value ?? "—")}
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
        {value === "active"
          ? "Hoạt động"
          : value === "inactive"
            ? "Ngừng hoạt động"
            : "Đã lưu trữ"}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    render: (value) => (
      <span className="text-sm text-slate-600">{formatDateTime(value)}</span>
    ),
  },
];
