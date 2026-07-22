import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Link } from "wouter";
import type { AnimalDistributionListItem } from "./constants";

const SCOPE_MAP: Record<string, { label: string; color: string }> = {
  region: { label: "Vùng chăn nuôi", color: "bg-blue-100 text-blue-700" },
  area: { label: "Khu vực", color: "bg-purple-100 text-purple-700" },
  plot: { label: "Lô đất", color: "bg-green-100 text-green-700" },
};

const STATUS_MAP: Record<
  string,
  { label: string; variant: "default" | "secondary" }
> = {
  active: { label: "Đang hoạt động", variant: "default" },
  completed: { label: "Hoàn thành", variant: "secondary" },
  pending: { label: "Chờ xử lý", variant: "secondary" },
};

export const animalDistributionColumns = [
  {
    key: "code",
    label: "Mã phân bổ",
    render: (value: string, row: AnimalDistributionListItem) => (
      <Link href={`/animal-distribution-detail/${row.id}`}>
        <span className="font-mono text-xs text-primary hover:underline">
          {value}
        </span>
      </Link>
    ),
  },
  {
    key: "name",
    label: "Tên phân bổ",
    render: (value: string) => <span className="font-medium">{value}</span>,
  },
  {
    key: "scope",
    label: "Phạm vi",
    render: (value: string) => {
      const config = SCOPE_MAP[value];
      return (
        <Badge variant="outline" className={config.color}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    key: "targetName",
    label: "Đối tượng",
    render: (value: string) => <span className="text-sm text-slate-600">{value}</span>,
  },
  {
    key: "distributionMethod",
    label: "Phương thức",
    render: (value: string) => (
      <Badge variant="secondary" className="font-normal">
        {value === "zone" ? "Theo vùng" : "Theo hàng"}
      </Badge>
    ),
  },
  {
    key: "totalAnimals",
    label: "Số cây",
    render: (value: number) => (
      <span className="font-semibold text-green-600">{value.toLocaleString()}</span>
    ),
  },
  {
    key: "seedVarieties",
    label: "Loại hạt",
    render: (value: number) => (
      <Badge variant="outline" className="font-mono">
        {value}
      </Badge>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value: string) => {
      const config = STATUS_MAP[value];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    render: (value: string) => (
      <span className="text-xs text-muted-foreground">{value}</span>
    ),
  },
];
