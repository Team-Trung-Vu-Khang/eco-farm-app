import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { getMaterialGroupLabel } from "./constants";

export const materialColumns = (
  onNavigateDetail: (id: number) => void,
): Column<any>[] => [
  { key: "code", label: "Mã" },
  { key: "sku", label: "Mã SKU" },
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
    key: "source",
    label: "Nguồn",
    render: (value) => (
      <Badge variant={value === "MASTER" ? "secondary" : "default"}>
        {value === "MASTER" ? "Hệ thống" : "Nội bộ"}
      </Badge>
    ),
  },
  {
    key: "technologyLevelId",
    label: "Phân loại kỹ thuật",
    render: (_, row) => {
      const techLevel =
        row.classifications?.find(
          (c: any) => c.classification === "technology_level",
        )?.group?.code || row.technologyLevelId;
      const valueChain =
        row.classifications?.find(
          (c: any) => c.classification === "value_chain",
        )?.group?.code || row.valueChainId;

      const techLabel = getMaterialGroupLabel(techLevel);
      const chainLabel = getMaterialGroupLabel(valueChain);
      return (
        <div className="flex flex-col gap-1 text-xs">
          {techLabel && (
            <Badge variant="outline" className="w-fit">
              {techLabel}
            </Badge>
          )}
          {chainLabel && (
            <span
              className="text-muted-foreground truncate max-w-[200px]"
              title={chainLabel}
            >
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
      <span className="inline-block max-w-[200px] truncate">{value}</span>
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
