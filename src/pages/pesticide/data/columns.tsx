import {
  Badge,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Pesticide } from "../types";

const toxicityBadgeColor: Record<string, string> = {
  Ia: "bg-red-100 text-red-700 border-red-300",
  Ib: "bg-orange-100 text-orange-700 border-orange-300",
  II: "bg-yellow-100 text-yellow-700 border-yellow-300",
  III: "bg-blue-100 text-blue-700 border-blue-300",
  U: "bg-green-100 text-green-700 border-green-300",
};

export const pesticideColumns = (
  onNavigateDetail: (id: number) => void,
): Column<Pesticide>[] => [
  { key: "code", label: "Mã SKU" },
  {
    key: "name",
    label: "Tên thương mại",
    render: (value, row) => (
      <span
        className="font-medium text-primary cursor-pointer hover:underline"
        onClick={() => onNavigateDetail(row.id)}
      >
        {value}
      </span>
    ),
  },
  {
    key: "registrationNumber",
    label: "Số đăng ký",
    render: (value) =>
      value ? (
        <span className="font-mono text-xs text-slate-600">{value}</span>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      ),
  },
  {
    key: "group",
    label: "Nhóm phân loại",
    render: (value) => <Badge variant="outline">{value}</Badge>,
  },
  { key: "form", label: "Dạng bào chế" },
  {
    key: "toxicityLevel",
    label: "Nhóm độc (WHO)",
    render: (value) =>
      value ? (
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold border ${toxicityBadgeColor[value as string] ?? "bg-slate-100 text-slate-600"}`}
        >
          {value}
        </span>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value === "active" ? "Hoạt động" : "Không hoạt động"}
      </Badge>
    ),
  },
];
