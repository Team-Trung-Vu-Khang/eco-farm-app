import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CodeBadge } from "@/components/CodeBadge";
import {
  technologyLevelOptions,
  financialManagementOptions,
} from "./constants";

interface ColumnOptions {
  onNameClick: (id: number) => void;
  scope?: "farm" | "admin";
}

export const getEquipmentColumns = (
  options: ColumnOptions | ((id: number) => void),
  scope?: "farm" | "admin",
): Column<any>[] => {
  const onNameClick =
    typeof options === "function" ? options : options?.onNameClick;
  const targetScope =
    typeof options === "object" && options.scope ? options.scope : scope;
  const isAdmin = targetScope
    ? targetScope === "admin"
    : typeof window !== "undefined" &&
      window.location.pathname.startsWith("/admin");

  const cols: Column<any>[] = [
    {
      key: "code",
      label: "Mã",
      render: (value) => <CodeBadge value={value} />,
    },
    {
      key: "sku",
      label: "Mã SKU",
      render: (_, row: any) => <CodeBadge value={row.sku || row.code} />,
    },
    {
      key: "machineName",
      label: "Tên máy móc / thiết bị",
      render: (_, row: any) => {
        const modelName = row.profile?.model || row.model;
        return (
          <div className="flex flex-col">
            <span
              className="font-semibold text-primary cursor-pointer hover:underline text-sm"
              onClick={() => onNameClick(row.id)}
            >
              {row.name || row.machineName}
            </span>
            {modelName && (
              <span className="text-xs text-muted-foreground mt-0.5">
                Model: {modelName}
              </span>
            )}
          </div>
        );
      },
    },
  ];

  if (!isAdmin) {
    cols.push({
      key: "source",
      label: "Nguồn",
      render: (value) => (
        <Badge variant={value === "MASTER" ? "secondary" : "default"}>
          {value === "MASTER" ? "Hệ thống" : "Nội bộ"}
        </Badge>
      ),
    });
  }

  return [
    ...cols,
    {
      key: "machineType",
      label: "Loại máy / Nhóm thiết bị",
      render: (_: any, row: any) => {
        const rawTypes = row.profile?.typeTags || row.machineType;
        const typesList = Array.isArray(rawTypes)
          ? rawTypes
          : rawTypes
            ? [rawTypes]
            : [];
        if (typesList.length === 0) {
          return <span className="text-muted-foreground text-xs">—</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {typesList.map((t: string, idx: number) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-[11px] px-1.5 py-0"
              >
                {t}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      key: "technologyLevelId",
      label: "Phân loại chính",
      render: (_: any, row: any) => {
        const techVal =
          row.classifications?.find(
            (c: any) => c.classification === "technology_level",
          )?.group?.code ||
          row.technologyLevelGroup ||
          row.technologyLevelId;
        const tech =
          technologyLevelOptions.find((o) => o.id === techVal)?.label || "N/A";

        const finVal =
          row.classifications?.find(
            (c: any) => c.classification === "financial_aspect",
          )?.group?.code ||
          row.assetManagementGroup ||
          row.financialManagementId;
        const fin =
          financialManagementOptions.find((o) => o.id === finVal)?.label ||
          "N/A";

        return (
          <div className="flex flex-col gap-1 text-xs">
            <span
              className="text-muted-foreground truncate max-w-[220px]"
              title={tech}
            >
              • {tech}
            </span>
            <span
              className="text-muted-foreground truncate max-w-[220px]"
              title={fin}
            >
              • {fin}
            </span>
          </div>
        );
      },
    },
    {
      key: "maintenanceSchedule",
      label: "Chu kỳ B.Dưỡng",
      render: (_, row: any) => {
        const schedule =
          row.profile?.maintenanceSchedule ||
          row.maintenanceSchedule ||
          row.maintainanceInterval;
        return (
          <span className="text-xs text-slate-600 font-medium">
            {schedule || "—"}
          </span>
        );
      },
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
};

export const equipmentColumns = getEquipmentColumns;
