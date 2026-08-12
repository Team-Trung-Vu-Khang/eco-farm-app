import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Material } from "../types/types";
import { getMaterialGroupLabel } from "./constants";

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
    key: "technologyLevelId",
    label: "Phân loại kỹ thuật",
    render: (_, row) => {
      const techLabel = getMaterialGroupLabel(row.technologyLevelId);
      const chainLabel = getMaterialGroupLabel(row.valueChainId);
      return (
        <div className="flex flex-col gap-1 text-xs">
          {techLabel && (
            <Badge variant="outline" className="w-fit">
              {techLabel}
            </Badge>
          )}
          {chainLabel && (
            <span className="text-muted-foreground truncate max-w-[200px]" title={chainLabel}>
              • {chainLabel}
            </span>
          )}
        </div>
      );
    },
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
