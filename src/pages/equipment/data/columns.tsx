import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Equipment } from "../types";
import { technologyLevelOptions, valueChainOptions, financialManagementOptions } from "./constants";

interface ColumnOptions {
  onNameClick: (id: number) => void;
}

export const getEquipmentColumns = ({
  onNameClick,
}: ColumnOptions): Column<Equipment>[] => [
  { 
    key: "sku", 
    label: "Mã SKU",
    render: (_, row: Equipment) => (
      <span className="font-mono text-xs bg-slate-50 border px-1.5 py-0.5 rounded font-semibold text-slate-700">
        {row.sku || row.code}
      </span>
    )
  },
  {
    key: "machineName",
    label: "Tên máy móc / thiết bị",
    render: (_, row: Equipment) => (
      <div className="flex flex-col">
        <span
          className="font-semibold text-primary cursor-pointer hover:underline text-sm"
          onClick={() => onNameClick(row.id)}
        >
          {row.machineName || row.name}
        </span>
        {row.model && (
          <span className="text-xs text-muted-foreground mt-0.5">
            Model: {row.model}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "technologyLevelId",
    label: "Phân loại chính",
    render: (_: any, row: Equipment) => {
      const techVal = row.technologyLevelGroup || row.technologyLevelId;
      const tech = technologyLevelOptions.find(o => o.id === techVal)?.label || "N/A";
      
      const finVal = row.assetManagementGroup || row.financialManagementId;
      const fin = financialManagementOptions.find(o => o.id === finVal)?.label || "N/A";
      
      return (
        <div className="flex flex-col gap-1 text-xs">
          <span className="text-muted-foreground truncate max-w-[220px]" title={tech}>• {tech}</span>
          <span className="text-muted-foreground truncate max-w-[220px]" title={fin}>• {fin}</span>
        </div>
      );
    },
  },
  { 
    key: "maintenanceSchedule", 
    label: "Chu kỳ B.Dưỡng",
    render: (_, row: Equipment) => (
      <span className="text-xs text-slate-600 font-medium">
        {row.maintenanceSchedule || row.maintainanceInterval}
      </span>
    )
  },
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
