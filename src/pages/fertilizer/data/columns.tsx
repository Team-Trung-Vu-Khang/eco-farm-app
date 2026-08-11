import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  type Fertilizer,
  originOptions,
  applicationStageOptions,
} from "./constants";

export const getFertilizerColumns = (
  onView: (id: string) => void,
): Column<Fertilizer>[] => [
  { key: "code", label: "Mã SKU" },
  {
    key: "name",
    label: "Tên phân bón",
    render: (value, row) => (
      <div>
        <span
          className="font-medium text-primary cursor-pointer hover:underline"
          onClick={() => onView(String(row.id))}
        >
          {value}
        </span>
        {row.scientificTechnicalName && (
          <span className="block text-[11px] text-muted-foreground italic mt-0.5">
            {row.scientificTechnicalName}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "registrationNumber",
    label: "Số đăng ký",
    render: (val) => <span className="font-mono text-xs">{val || "N/A"}</span>,
  },
  {
    key: "originId",
    label: "Phân loại",
    render: (_, row) => {
      const origin =
        row.fertilizerOriginGroup ||
        originOptions.find((o) => o.id === row.originId)?.label ||
        "N/A";
      const stage =
        row.applicationStage ||
        applicationStageOptions.find((s) => s.id === row.applicationStageId)
          ?.label ||
        "N/A";
      return (
        <div className="flex gap-1 flex-col">
          <Badge variant="outline" className="w-fit text-[10px] py-0 px-1.5">
            {origin}
          </Badge>
          <Badge variant="secondary" className="w-fit text-[10px] py-0 px-1.5">
            {stage}
          </Badge>
        </div>
      );
    },
  },
  {
    key: "npkRatio",
    label: "Tỷ lệ NPK / Hàm lượng",
    render: (val, row) => {
      const display = val || row.nutrientContent || "N/A";
      return <span className="text-xs">{display}</span>;
    },
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge
        variant={value === "active" ? "default" : "secondary"}
        className="text-xs"
      >
        {value === "active" ? "Hoạt động" : "Không hoạt động"}
      </Badge>
    ),
  },
];
