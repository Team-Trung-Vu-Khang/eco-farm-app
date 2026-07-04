import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { WorkspaceRecord } from "@/features/workspace";

const STATUS_LABELS: Record<string, string> = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
  archived: "Đã lưu trữ",
};

export const workspaceColumns: Column<WorkspaceRecord>[] = [
  {
    key: "code",
    label: "Mã",
    render: (value) => (
      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-sm font-semibold tracking-widest text-slate-700">
        {String(value)}
      </span>
    ),
  },
  {
    key: "name",
    label: "Workspace",
    render: (value, item) => (
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-slate-900">{String(value)}</span>
        <span className="text-xs text-muted-foreground">
          {item.brandName || "-"}
        </span>
      </div>
    ),
  },
  {
    key: "organizationType",
    label: "Loại",
    render: (_, item) => item.organizationType?.name || "-",
  },
  {
    key: "businessLines",
    label: "Ngành nghề",
    render: (_, item) =>
      item.businessLines?.length
        ? item.businessLines.map((line) => line.name || line.code).join(", ")
        : "-",
  },
  {
    key: "mainCrop",
    label: "Cây trồng chính",
    render: (_, item) => item.mainCrop?.name || "-",
  },
  {
    key: "totalAcreage",
    label: "Diện tích",
    render: (value) =>
      typeof value === "number" ? `${value.toLocaleString("vi-VN")} ha` : "-",
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
];
