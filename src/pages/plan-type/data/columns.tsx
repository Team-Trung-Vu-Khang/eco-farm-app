import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { PlanType } from "../types/types";

export const planTypeColumns: Column<PlanType>[] = [
  {
    key: "code",
    label: "Mã loại",
    render: (value) => (
      <span className="font-medium font-mono">{String(value ?? "")}</span>
    ),
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
        <span className="font-semibold">{String(value ?? "")}</span>
      </div>
    ),
  },
  {
    key: "planGroup",
    label: "Nhóm kế hoạch",
    render: (_value, row) => (
      <Badge variant="outline" className="bg-background">
        {row.planGroup?.name ?? row.planGroup?.code ?? "Chưa phân nhóm"}
      </Badge>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge
        variant={
          (value as PlanType["status"]) === "active" ? "default" : "secondary"
        }
      >
        {(value as PlanType["status"]) === "active"
          ? "Hoạt động"
          : (value as PlanType["status"]) === "inactive"
            ? "Ngừng hoạt động"
            : "Đã lưu trữ"}
      </Badge>
    ),
  },
  {
    key: "description",
    label: "Mô tả",
    render: (value) => (
      <span
        className="block max-w-[320px] truncate text-muted-foreground"
        title={String(value ?? "")}
      >
        {String(value ?? "")}
      </span>
    ),
  },
];
