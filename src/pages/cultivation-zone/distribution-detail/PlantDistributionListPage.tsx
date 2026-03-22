import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import {
  AdminLayout,
  Button,
  DataTable,
  Badge,
  DeleteDialog,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";

// Mock Data for List
interface PlantDistribution {
  id: string;
  code: string;
  name: string;
  scope: "region" | "area" | "plot";
  targetName: string;
  distributionMethod: "zone" | "row";
  totalPlants: number;
  seedVarieties: number;
  status: "active" | "completed" | "pending";
  createdAt: string;
}

const MOCK_DATA: PlantDistribution[] = [
  {
    id: "dist-1",
    code: "DIST-001",
    name: "Phân bổ Sầu riêng Vùng Alpha",
    scope: "region",
    targetName: "Vùng Bình Phước Alpha",
    distributionMethod: "zone",
    totalPlants: 500,
    seedVarieties: 2,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "dist-2",
    code: "DIST-002",
    name: "Phân bổ Bơ 034 Khu vực B",
    scope: "area",
    targetName: "Khu vực B - Bơ sáp",
    distributionMethod: "row",
    totalPlants: 300,
    seedVarieties: 1,
    status: "completed",
    createdAt: "2024-02-10",
  },
  {
    id: "dist-3",
    code: "DIST-003",
    name: "Phân bổ Xoài Lô 1",
    scope: "plot",
    targetName: "Lô 1 - Sầu riêng 6",
    distributionMethod: "zone",
    totalPlants: 150,
    seedVarieties: 2,
    status: "pending",
    createdAt: "2024-03-05",
  },
];

const PlantDistributionListPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [data, setData] = useState<PlantDistribution[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Initial Data Load
  useEffect(() => {
    setData(MOCK_DATA);
  }, []);

  const handleAdd = () => {
    setLocation("/distribution-detail/create");
  };

  const handleEdit = (item: PlantDistribution) => {
    setLocation(`/distribution-detail/${item.id}/edit`);
  };

  const handleDelete = (item: PlantDistribution) => {
    setDeletingId(item.id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setData((prev) => prev.filter((i) => i.id !== deletingId));
      toast({ title: "Thành công", description: "Đã xóa phân bổ cây trồng" });
      setDeleteOpen(false);
      setDeletingId(null);
    }
  };

  const columns = [
    {
      key: "code",
      label: "Mã phân bổ",
      render: (v: string, r: PlantDistribution) => (
        <Link href={`/distribution-detail/${r.id}`}>
          <a className="font-mono text-xs text-primary hover:underline">{v}</a>
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
        const map: Record<string, { label: string; color: string }> = {
          region: { label: "Vùng trồng", color: "bg-blue-100 text-blue-700" },
          area: { label: "Khu vực", color: "bg-purple-100 text-purple-700" },
          plot: { label: "Lô đất", color: "bg-green-100 text-green-700" },
        };
        const config = map[value];
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
      render: (value: string) => (
        <span className="text-sm text-slate-600">{value}</span>
      ),
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
      key: "totalPlants",
      label: "Số cây",
      render: (value: number) => (
        <span className="font-semibold text-green-600">
          {value.toLocaleString()}
        </span>
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
        const statusConfig: Record<
          string,
          { label: string; variant: "default" | "secondary" }
        > = {
          active: { label: "Đang hoạt động", variant: "default" },
          completed: { label: "Hoàn thành", variant: "secondary" },
          pending: { label: "Chờ xử lý", variant: "secondary" },
        };
        const config = statusConfig[value];
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

  return (
    <AdminLayout
      title="Phân bổ cây trồng"
      description="Quản lý phân bổ và định vị GPS cho cây trồng"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo phân bổ mới
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        description="Bạn có chắc chắn muốn xóa phân bổ cây trồng này? Tất cả dữ liệu định vị GPS sẽ bị xóa."
      />
    </AdminLayout>
  );
};

export default PlantDistributionListPage;
