import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { getMaterialGroupLabel } from "./constants";
import { CodeBadge } from "@/components/CodeBadge";

export const materialColumns = (
  onNavigateDetail: (id: number) => void,
): Column<any>[] => [
  { key: "code", label: "Mã", render: (value) => <CodeBadge value={value} /> },
  {
    key: "sku",
    label: "Mã SKU",
    render: (value) => <CodeBadge value={value} />,
  },
  {
    key: "name",
    label: "Tên vật tư",
    render: (value, row) => (
      <span
        className="cursor-pointer font-medium text-primary hover:underline"
        onClick={() => onNavigateDetail(row.id)}
      >
        {value as string}
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
      const apiTechs =
        row.classifications
          ?.filter((c: any) => c.classification === "technology_level")
          ?.map((c: any) => c.group?.code || c.group?.name)
          ?.filter(Boolean) || [];

      const localTechs = Array.isArray(row.technologyLevelIds)
        ? row.technologyLevelIds
        : row.technologyLevelId
          ? [row.technologyLevelId]
          : [];

      const techCodes = Array.from(
        new Set([...apiTechs, ...localTechs]),
      ).filter(Boolean);

      const apiChains =
        row.classifications
          ?.filter((c: any) => c.classification === "value_chain")
          ?.map((c: any) => c.group?.code || c.group?.name)
          ?.filter(Boolean) || [];

      const localChains = Array.isArray(row.valueChainIds)
        ? row.valueChainIds
        : row.valueChainId
          ? [row.valueChainId]
          : [];

      const chainCodes = Array.from(
        new Set([...apiChains, ...localChains]),
      ).filter(Boolean);

      const techLabels = techCodes
        .map((code) => getMaterialGroupLabel(code))
        .filter(Boolean);
      const chainLabels = chainCodes
        .map((code) => getMaterialGroupLabel(code))
        .filter(Boolean);

      return (
        <div className="flex flex-col gap-1 text-xs">
          {techLabels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {techLabels.map((lbl, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="w-fit text-[10px] py-0 px-1.5"
                >
                  {lbl}
                </Badge>
              ))}
            </div>
          )}
          {chainLabels.length > 0 && (
            <span
              className="text-muted-foreground truncate max-w-[200px]"
              title={chainLabels.join(", ")}
            >
              • {chainLabels.join(", ")}
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
      <span className="inline-block max-w-[200px] truncate">
        {value as string}
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
