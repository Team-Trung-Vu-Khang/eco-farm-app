import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Equipment } from "./constants";
import { technologyLevelOptions, valueChainOptions, financialManagementOptions } from "./constants";

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
    key: "technologyLevelId",
    label: "Phân loại",
    render: (_: any, row: Equipment) => {
      const tech = technologyLevelOptions.find(o => o.id === row.technologyLevelId)?.label || "N/A";
      const chain = valueChainOptions.find(o => o.id === row.valueChainId)?.label || "N/A";
      const fin = financialManagementOptions.find(o => o.id === row.financialManagementId)?.label || "N/A";
      
      return (
        <div className="flex flex-col gap-1 text-xs">
          <span className="text-muted-foreground truncate max-w-[200px]" title={tech}>• {tech}</span>
          <span className="text-muted-foreground truncate max-w-[200px]" title={chain}>• {chain}</span>
          <span className="text-muted-foreground truncate max-w-[200px]" title={fin}>• {fin}</span>
        </div>
      );
    },
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
