import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
} from "@tankhang1/eco-shared-ui";

import { type Plot, MOCK_PLOTS } from "../constants";

const PlotDistributionPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [data, setData] = useState<Plot[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setData(MOCK_PLOTS);
  }, []);

  const handleAdd = () => {
    setLocation("/plot-distribution/create");
  };

  const handleEdit = (item: Plot) => {
    setLocation(`/plot-distribution/edit/${item.id}`);
  };

  const handleDelete = (item: Plot) => {
    setDeletingId(item.id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setData((prev) => prev.filter((i) => i.id !== deletingId));
      toast({ title: "Thành công", description: "Đã xóa lô" });
      setDeleteOpen(false);
    }
  };

  return (
    <AdminLayout
      title="Phân bố lô"
      description="Quản lý danh sách và bản đồ phân bố các lô trồng"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm lô
        </Button>
      }
    >
      <DataTable
        columns={[
          {
            key: "id",
            label: "Mã lô",
            render: (value, row) => (
              <span
                className="font-medium text-primary hover:underline cursor-pointer"
                onClick={() =>
                  setLocation(`/plot-distribution/detail/${row.id}`)
                }
              >
                {value}
              </span>
            ),
          },
          { key: "name", label: "Tên lô" },
          { key: "area", label: "Diện tích (ha)" },
          { key: "contour", label: "Đường bình độ" },
          { key: "altitude", label: "Độ cao (m)" },
        ]}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        description="Bạn có chắc chắn muốn xóa lô này?"
      />
    </AdminLayout>
  );
};
export default PlotDistributionPage;
