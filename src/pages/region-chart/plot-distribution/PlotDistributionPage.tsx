import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
} from "@tankhang1/eco-shared-ui";

import { type Plot } from "../constants";
import useRegionStore from "../../../stores/useRegionStore";

const PlotDistributionPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { regions, removePlot } = useRegionStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const data = useMemo(() => {
    return regions.flatMap((r) =>
      (r.subAreas || []).flatMap((s) => s.plots || []),
    );
  }, [regions]);

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
      removePlot(deletingId);
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
            key: "code",
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
