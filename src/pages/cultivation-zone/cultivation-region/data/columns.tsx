import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Link } from "wouter";
import type {
  FarmCultivationZoneResponse,
  FarmCultivationZoneScopeResponse,
  CatalogRef,
} from "../../../../features/farm/types/farm.type";

const SCOPE_TYPE_LABELS: Record<string, string> = {
  REGION: "Vùng trồng",
  AREA: "Khu vực",
  PLOT: "Lô trồng",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Đang canh tác",
  inactive: "Ngừng canh tác",
  archived: "Lưu trữ",
};

export const getCultivationRegionColumns =
  (): Column<FarmCultivationZoneResponse>[] => [
    {
      key: "code",
      label: "Mã",
      render: (_, row) => (
        <Link href={`/cultivation-region/${row.id}`}>
          <span className="font-mono text-xs text-primary hover:underline">
            {row.code || `#${row.id}`}
          </span>
        </Link>
      ),
    },
    {
      key: "name",
      label: "Tên vùng canh tác",
      render: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "scopes",
      label: "Phạm vi",
      render: (value) => {
        const scopes = value as FarmCultivationZoneScopeResponse[] | undefined;
        if (!scopes || scopes.length === 0)
          return <span className="text-muted-foreground text-xs">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {scopes.map((scope, idx) => (
              <Badge key={idx} variant="outline">
                {SCOPE_TYPE_LABELS[scope.scopeType] ?? scope.scopeType}
              </Badge>
            ))}
          </div>
        );
      },
    },
    // {
    //   key: "certificates",
    //   label: "Chứng nhận",
    //   render: (value) => {
    //     const certs = value as CatalogRef[] | undefined;
    //     if (!certs || certs.length === 0) return null;
    //     return (
    //       <div className="flex flex-wrap gap-1">
    //         {certs.map((cert) => (
    //           <Badge
    //             key={cert.id}
    //             variant="secondary"
    //             className="bg-blue-50 text-blue-700 hover:bg-blue-100"
    //           >
    //             {cert.name}
    //           </Badge>
    //         ))}
    //       </div>
    //     );
    //   },
    // },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => {
        const status = value as string;
        return (
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {STATUS_LABELS[status] ?? status}
          </Badge>
        );
      },
    },
  ];
