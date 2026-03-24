import {
  Badge,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Pesticide } from "../types";

export const pesticideColumns = (
  onNavigateDetail: (id: number) => void,
): Column<Pesticide>[] => [
  { key: "code", label: "Mã" },
  {
    key: "name",
    label: "Tên thuốc",
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
    key: "group",
    label: "Nhóm thuốc",
    render: (value) => <Badge variant="outline">{value}</Badge>,
  },
  { key: "form", label: "Dạng thuốc" },
  { key: "origin", label: "Nguồn gốc" },
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
