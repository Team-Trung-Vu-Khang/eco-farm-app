import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Link } from "wouter";
import type { CultivationRegion } from "../../../../stores/useCultivationRegionStore";
import type { Standard } from "../../../../stores/useEnterpriseCertificateStore";

const SCOPE_LABELS: Record<string, string> = {
  region: "Vùng trồng",
  area: "Khu vực",
  plot: "Lô trồng",
};

export const getCultivationRegionColumns = (standards: Standard[]) => [
  {
    key: "id",
    label: "Mã",
    render: (value: string, row: CultivationRegion) => (
      <Link href={`/cultivation-region/${row.id}`}>
        <a className="font-mono text-xs text-primary hover:underline">{value}</a>
      </Link>
    ),
  },
  {
    key: "name",
    label: "Tên vùng canh tác",
    render: (value: string) => <span className="font-medium">{value}</span>,
  },
  {
    key: "scope",
    label: "Phạm vi",
    render: (value: string) => <Badge variant="outline">{SCOPE_LABELS[value]}</Badge>,
  },
  {
    key: "targetName",
    label: "Đối tượng áp dụng",
  },
  {
    key: "certificateId",
    label: "Chứng nhận",
    render: (value: string) => {
      const certificate = standards.find((item) => item.code === value);
      if (!certificate) return null;

      return (
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          {certificate.name}
        </Badge>
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
];
