import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Fertilizer } from "./constants";

export const getFertilizerColumns = (
  onView: (id: string) => void,
): Column<Fertilizer>[] => [
  { key: "code", label: "Mã" },
  {
    key: "name",
    label: "Tên phân bón",
    render: (value, row) => (
      <span
        className="font-medium text-primary cursor-pointer hover:underline"
        onClick={() => onView(String(row.id))}
      >
        {value}
      </span>
    ),
  },
  {
    key: "type",
    label: "Loại phân",
    render: (value) => <Badge variant="outline">{value}</Badge>,
  },
  { key: "nutrientContent", label: "Hàm lượng" },
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
