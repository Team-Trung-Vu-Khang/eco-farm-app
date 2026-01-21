import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import {
  AdminLayout,
  Button,
  DataTable,
  Badge,
  DeleteDialog,
  useToast,
} from "@tankhang1/eco-shared-ui";
import { Plus } from "lucide-react";

// Mock Data for List
interface CultivationArea {
  id: string;
  name: string;
  scope: string; // region, area, plot
  targetName: string;
  certificate: string;
  status: "active" | "inactive";
}

const MOCK_DATA: CultivationArea[] = [
  {
    id: "ca-1",
    name: "Canh tác Sầu riêng Công nghệ cao",
    scope: "region",
    targetName: "Vùng Bình Phước Alpha",
    certificate: "VietGAP",
    status: "active",
  },
  {
    id: "ca-2",
    name: "Khu vực trồng Bơ 034",
    scope: "area",
    targetName: "Khu vực B - Bơ sáp",
    certificate: "Organic USDA",
    status: "active",
  },
];

const CultivationAreaPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [data, setData] = useState<CultivationArea[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Initial Data Load
  useEffect(() => {
    setData(MOCK_DATA);
  }, []);

  const handleAdd = () => {
    setLocation("/cultivation-area/create");
  };

  const handleEdit = (item: CultivationArea) => {
    setLocation(`/cultivation-area/${item.id}/edit`);
  };

  const handleDelete = (item: CultivationArea) => {
    setDeletingId(item.id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setData((prev) => prev.filter((i) => i.id !== deletingId));
      toast({ title: "Thành công", description: "Đã xóa vùng canh tác" });
      setDeleteOpen(false);
      setDeletingId(null);
    }
  };

  const columns = [
    {
      key: "id",
      label: "Mã",
      render: (v: string, r: CultivationArea) => (
        <Link href={`/cultivation-area/${r.id}`}>
          <a className="font-mono text-xs text-primary hover:underline">{v}</a>
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
      render: (value: string) => {
        const map: Record<string, string> = {
          region: "Vùng trồng",
          area: "Khu vực",
          plot: "Lô trồng",
        };
        return <Badge variant="outline">{map[value]}</Badge>;
      },
    },
    {
      key: "targetName",
      label: "Đối tượng áp dụng",
    },
    {
      key: "certificate",
      label: "Chứng nhận",
      render: (value: string) => (
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          {value}
        </Badge>
      ),
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

  return (
    <AdminLayout
      title="Khu vực canh tác"
      description="Quản lý các thiết lập canh tác cho Vùng, Khu vực hoặc Lô"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thiết lập mới
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
        description="Bạn có chắc chắn muốn xóa vùng canh tác này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default CultivationAreaPage;
