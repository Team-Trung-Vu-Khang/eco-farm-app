import { useState } from "react";
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

import useCultivationPlotStore, {
  type CultivationPlot,
} from "../../stores/useCultivationPlotStore";
import useEnterpriseCertificateStore from "../../stores/useEnterpriseCertificateStore";
import useEnterpriseStore from "../../stores/useEnterpriseStore";

const CultivationPlotPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { cultivationPlots: data, deleteCultivationPlot } =
    useCultivationPlotStore();
  const { standards } = useEnterpriseCertificateStore();
  const { enterprises } = useEnterpriseStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = () => {
    setLocation("/cultivation-plot/create");
  };

  const handleEdit = (item: CultivationPlot) => {
    setLocation(`/cultivation-plot/${item.id}/edit`);
  };

  const handleDelete = (item: CultivationPlot) => {
    setDeletingId(item.id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteCultivationPlot(deletingId);
      toast({ title: "Thành công", description: "Đã xóa lô" });
      setDeleteOpen(false);
      setDeletingId(null);
    }
  };

  const columns = [
    {
      key: "id",
      label: "Mã",
      render: (v: string, r: CultivationPlot) => (
        <Link href={`/cultivation-plot/${r.id}`}>
          <a className="font-mono text-xs text-primary hover:underline">{v}</a>
        </Link>
      ),
    },
    {
      key: "name",
      label: "Tên lô",
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: "regionName",
      label: "Vùng trồng",
      render: (value: string) => (
        <span className="text-slate-600">{value}</span>
      ),
    },
    {
      key: "areaName",
      label: "Khu vực",
      render: (value: string) => (
        <span className="text-slate-600">{value}</span>
      ),
    },
    {
      key: "enterpriseId",
      label: "Doanh nghiệp",
      render: (value: string) => {
        const ent = enterprises.find((e) => e.id.toString() === value);
        return <span className="text-slate-600">{ent?.name || value}</span>;
      },
    },
    {
      key: "certificateIds",
      label: "Chứng nhận",
      render: (value: string[]) => {
        if (!value || value.length === 0) return null;
        return (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 2).map((certId) => {
              const cert = standards.find((c) => c.code === certId);
              return (
                <Badge
                  key={certId}
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs"
                >
                  {cert?.name || certId}
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

  return (
    <AdminLayout
      title="Lô canh tác"
      description="Quản lý các thiết lập canh tác theo Khu vực (Lô)"
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
        description="Bạn có chắc chắn muốn xóa lô này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default CultivationPlotPage;
