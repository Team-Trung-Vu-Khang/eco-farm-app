import { CodeBadge } from "@/components/CodeBadge";
import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Badge, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2, Power } from "lucide-react";
import { Link } from "wouter";
import type {
  FarmCultivationZoneResponse,
  FarmCultivationZoneScopeResponse,
} from "../../../../features/farm/types/farm.type";

const SCOPE_TYPE_LABELS: Record<string, string> = {
  REGION: "Vùng trồng",
  AREA: "Khu vực",
  PLOT: "Lô trồng",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Đang hoạt động",
  inactive: "Tạm dừng hoạt động",
  archived: "Lưu trữ",
};

export const getCultivationRegionColumns = (
  /** Chuyển đổi trạng thái hoạt động <-> tạm dừng. */
  onToggleStatus?: (row: FarmCultivationZoneResponse) => void,
  togglingId?: number | null,
): Column<FarmCultivationZoneResponse>[] => [
    {
      key: "code",
      label: "Mã",
      render: (_, row) => (
        <Link href={`/cultivation-region/${row.id}`}>
          <CodeBadge value={row.code || `#${row.id}`} />
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
            {scopes.map((scope, idx) => {
              const typeLabel =
                SCOPE_TYPE_LABELS[scope.scopeType] ?? scope.scopeType;
              // Tên của thực thể tương ứng với scopeType (Vùng trồng / Khu vực / Lô trồng)
              const target =
                scope.scopeType === "REGION"
                  ? scope.region
                  : scope.scopeType === "AREA"
                    ? scope.area
                    : scope.plot;
              const name = target?.name || target?.code;

              return (
                <Badge key={idx} variant="outline" className="font-normal">
                  <span className="text-muted-foreground">{typeLabel}</span>
                  {name && (
                    <>
                      <span className="mx-1 text-muted-foreground">·</span>
                      <span className="font-medium">{name}</span>
                    </>
                  )}
                </Badge>
              );
            })}
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
      render: (value, row) => {
        const status = value as string;
        const isActive = status === "active";
        const isToggling = togglingId === row.id;
        return (
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? "default" : "secondary"}>
              {STATUS_LABELS[status] ?? status}
            </Badge>
            {onToggleStatus && status !== "archived" && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                disabled={isToggling}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleStatus(row);
                }}
              >
                {isToggling ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Power className="h-3.5 w-3.5" />
                )}
                {isActive ? "Tạm dừng" : "Kích hoạt"}
              </Button>
            )}
          </div>
        );
      },
    },
  ];
