import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Material } from "../types/types";

export const materialColumns = (
  onNavigateDetail: (id: number) => void,
): Column<Material>[] => [
  { key: "code", label: "Mã" },
  {
    key: "name",
    label: "Tên vật tư",
    render: (value, row) => (
      <span
        className="cursor-pointer font-medium text-primary hover:underline"
        onClick={() => onNavigateDetail(row.id)}
      >
        {value}
      </span>
    ),
  },
  {
    key: "type",
    label: "Phân loại",
    render: (value) => <Badge variant="outline">{value}</Badge>,
  },
  {
    key: "description",
    label: "Mô tả",
    render: (value) => (
      <span className="inline-block max-w-[200px] truncate" title={value}>
        {value}
      </span>
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
