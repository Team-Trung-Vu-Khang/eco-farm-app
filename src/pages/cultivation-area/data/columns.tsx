import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Link } from "wouter";
import type { CultivationArea, Standard } from "../types/types";

interface EnterpriseOption {
  id: string | number;
  name: string;
}

export const getCultivationAreaColumns = (
  enterprises: EnterpriseOption[],
  standards: Standard[],
) => [
  {
    key: "id",
    label: "Mã",
    render: (value: string, row: CultivationArea) => (
      <Link href={`/cultivation-area/${row.id}`}>
        <a className="font-mono text-xs text-primary hover:underline">{value}</a>
      </Link>
    ),
  },
  {
    key: "name",
    label: "Tên khu vực canh tác",
    render: (value: string) => <span className="font-medium">{value}</span>,
  },
  {
    key: "regionName",
    label: "Vùng trồng",
    render: (value: string) => <span className="text-slate-600">{value}</span>,
  },
  {
    key: "enterpriseId",
    label: "Đơn vị sở hữu",
    render: (value: string) => {
      const enterprise = enterprises.find((item) => item.id.toString() === value);
      return <span className="text-slate-600">{enterprise?.name || value}</span>;
    },
  },
  {
    key: "certificateIds",
    label: "Chứng nhận",
    render: (value: string[]) => {
      if (!value?.length) return null;

      return (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((certificateId) => {
            const certificate = standards.find((item) => item.code === certificateId);
            return (
              <Badge
                key={certificateId}
                variant="secondary"
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs"
              >
                {certificate?.name || certificateId}
              </Badge>
            );
          })}
          {value.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value: string) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value === "active" ? "Đang canh tác" : "Ngừng canh tác"}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
  },
];
