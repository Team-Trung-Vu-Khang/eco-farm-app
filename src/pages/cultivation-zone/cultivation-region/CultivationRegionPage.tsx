import { useState } from "react";
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

import { type CultivationRegion } from "../../../stores/useCultivationRegionStore";
import useCultivationRegionStore from "../../../stores/useCultivationRegionStore";
import useEnterpriseCertificateStore from "../../../stores/useEnterpriseCertificateStore";

const CultivationRegionPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { areas: data, deleteArea } = useCultivationRegionStore();
  const { standards } = useEnterpriseCertificateStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = () => {
    setLocation("/cultivation-region/create");
  };

  const handleEdit = (item: CultivationRegion) => {
    setLocation(`/cultivation-region/${item.id}/edit`);
  };

  const handleDelete = (item: CultivationRegion) => {
    setDeletingId(item.id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteArea(deletingId);
      toast({ title: "Thành công", description: "Đã xóa vùng canh tác" });
      setDeleteOpen(false);
      setDeletingId(null);
    }
  };

  const columns = [
    {
      key: "id",
      label: "Mã",
      render: (v: string, r: CultivationRegion) => (
        <Link href={`/cultivation-region/${r.id}`}>
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
      key: "certificateId",
      label: "Chứng nhận",
      render: (value: string) => {
        const cert = standards.find((c) => c.code === value);
        if (!cert) return null;

        return (
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            {cert.name}
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

  return (
    <AdminLayout
      title="Vùng canh tác"
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

export default CultivationRegionPage;
