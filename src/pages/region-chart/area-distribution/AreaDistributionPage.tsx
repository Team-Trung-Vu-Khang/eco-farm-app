import React, { useState } from "react";
import { useLocation } from "wouter";
import { Plus } from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
} from "@tankhang1/eco-shared-ui";

import { type SubArea } from "../constants";
import useRegionStore from "../../../stores/useRegionStore";

const AreaDistributionPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { regions, removeSubArea } = useRegionStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const areas = React.useMemo(() => {
    return regions.flatMap((r) => r.subAreas || []);
  }, [regions]);

  const handleAdd = () => {
    setLocation("/area-distribution/create");
  };

  const handleEdit = (item: SubArea) => {
    setLocation(`/area-distribution/edit/${item.id}`);
  };

  const handleDelete = (item: SubArea) => {
    setDeletingId(item.id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      removeSubArea(deletingId);
      toast({ title: "Thành công", description: "Đã xóa khu vực" });
      setDeleteOpen(false);
    }
  };

  return (
    <AdminLayout
      title="Phân bố khu vực"
      description="Quản lý danh sách và bản đồ phân bố các khu vực trồng"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm khu vực
        </Button>
      }
    >
      <DataTable
        columns={[
          {
            key: "code",
            label: "Mã khu vực",
            render: (value, row) => (
              <span
                className="font-medium text-primary hover:underline cursor-pointer"
                onClick={() =>
                  setLocation(`/area-distribution/detail/${row.id}`)
                }
              >
                {value}
              </span>
            ),
          },
          { key: "name", label: "Tên khu vực" },
          {
            key: "regionId",
            label: "Thuộc vùng",
            render: (v) => regions.find((r) => r.id === v)?.name || v,
          },
          { key: "area", label: "Diện tích (ha)" },
          {
            key: "status",
            label: "Trạng thái",
            render: (v) => (
              <Badge variant={v === "active" ? "default" : "secondary"}>
                {v === "active" ? "Hoạt động" : "Ngưng"}
              </Badge>
            ),
          },
        ]}
        data={areas}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        description="Bạn có chắc chắn muốn xóa khu vực này?"
      />
    </AdminLayout>
  );
};
export default AreaDistributionPage;
