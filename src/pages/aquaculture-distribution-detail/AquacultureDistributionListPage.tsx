import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import type { AquacultureDistribution } from "./AquacultureDistributionDetailPage";
import useAquacultureDistributionStore from "@/stores/useAquacultureDistributionStore";

const SCOPE_MAP: Record<string, { label: string; color: string }> = {
  "Vùng nuôi tôm Cần Giờ": { label: "Vùng nuôi", color: "bg-blue-100 text-blue-700" },
  "Khu nuôi thủy sản Long Sơn": {
    label: "Khu nuôi",
    color: "bg-purple-100 text-purple-700",
  },
};

const STATUS_MAP: Record<
  AquacultureDistribution["status"],
  { label: string; variant: "default" | "secondary" }
> = {
  active: { label: "Đang hoạt động", variant: "default" },
  monitoring: { label: "Theo dõi", variant: "secondary" },
};

const AquacultureDistributionListPage = () => {
  const [, setLocation] = useLocation();
  const { records, deleteRecord } = useAquacultureDistributionStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const columns = useMemo(
    () => [
      {
        key: "code",
        label: "Mã phân bổ",
        render: (value: unknown, row: AquacultureDistribution) => (
          <Link href={`/aquaculture-distribution-detail/${row.id}`}>
            <span className="font-mono text-xs text-primary hover:underline">
              {String(value)}
            </span>
          </Link>
        ),
      },
      {
        key: "name",
        label: "Tên phân bổ",
        render: (value: unknown) => (
          <span className="font-medium">{String(value)}</span>
        ),
      },
      {
        key: "scope",
        label: "Phạm vi",
        render: (value: unknown) => {
          const config = SCOPE_MAP[String(value)] || {
            label: String(value),
            color: "bg-slate-100 text-slate-700",
          };
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
        render: (value: unknown) => (
          <span className="text-sm text-slate-600">{String(value)}</span>
        ),
      },
      {
        key: "method",
        label: "Phương thức",
        render: (value: unknown) => (
          <Badge variant="secondary" className="font-normal">
            {String(value)}
          </Badge>
        ),
      },
      {
        key: "totalStock",
        label: "Số lượng",
        render: (value: unknown) => (
          <span className="font-semibold text-green-600">
            {Number(value).toLocaleString("vi-VN")}
          </span>
        ),
      },
      {
        key: "healthScore",
        label: "Sức khỏe",
        render: (value: unknown) => (
          <Badge variant="outline" className="font-mono">
            {String(value)}%
          </Badge>
        ),
      },
      {
        key: "status",
        label: "Trạng thái",
        render: (value: unknown) => {
          const config = STATUS_MAP[value as AquacultureDistribution["status"]];
          return <Badge variant={config.variant}>{config.label}</Badge>;
        },
      },
      {
        key: "stockedDate",
        label: "Ngày tạo",
        render: (value: unknown) => (
          <span className="text-xs text-muted-foreground">{String(value)}</span>
        ),
      },
    ],
    [],
  );

  const handleDelete = (row: AquacultureDistribution) => {
    setDeletingId(row.id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;
    deleteRecord(deletingId);
    setDeleteOpen(false);
    setDeletingId(null);
  };

  return (
    <AdminLayout
      isDev={true}
      title="Phân bổ thủy sản"
      description="Quản lý danh sách phân bổ và định vị GPS cho thủy sản"
      actions={
        <Link href="/aquaculture-distribution-detail/create">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Tạo phân bổ mới
          </Button>
        </Link>
      }
    >
      <DataTable
        data={records}
        columns={columns}
        selectable={false}
        onEdit={(item) => setLocation(`/aquaculture-distribution-detail/${item.id}`)}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa phân bổ thủy sản này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default AquacultureDistributionListPage;
