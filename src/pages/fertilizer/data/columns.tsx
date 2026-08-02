import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  type Fertilizer,
  originOptions,
  applicationStageOptions,
} from "./constants";

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
    key: "originId",
    label: "Phân loại",
    render: (_, row) => {
      const origin =
        originOptions.find((o) => o.id === row.originId)?.label || "N/A";
      const stage =
        applicationStageOptions.find((s) => s.id === row.applicationStageId)
          ?.label || "N/A";
      return (
        <div className="flex gap-1 flex-col sm:flex-row">
          <Badge variant="outline">{origin}</Badge>
          <Badge variant="secondary">{stage}</Badge>
        </div>
      );
    },
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
