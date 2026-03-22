import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Equipment } from "./constants";

interface ColumnOptions {
  onNameClick: (id: number) => void;
}

export const getEquipmentColumns = ({
  onNameClick,
}: ColumnOptions): Column<Equipment>[] => [
  { key: "code", label: "Mã" },
  {
    key: "name",
    label: "Tên thiết bị",
    render: (value: any, row: Equipment) => (
      <span
        className="font-medium text-primary cursor-pointer hover:underline"
        onClick={() => onNameClick(row.id)}
      >
        {value}
      </span>
    ),
  },
  {
    key: "type",
    label: "Loại thiết bị",
    render: (value: any) => <Badge variant="outline">{value}</Badge>,
  },
  { key: "maintainanceInterval", label: "Chu kỳ B.Dưỡng" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value: any) => (
      <Badge
        variant={
          value === "active"
            ? "default"
            : value === "maintenance"
              ? "destructive"
              : "secondary"
        }
      >
        {value === "active"
          ? "Hoạt động"
          : value === "maintenance"
            ? "Bảo trì"
            : "Ngừng SD"}
      </Badge>
    ),
  },
];
