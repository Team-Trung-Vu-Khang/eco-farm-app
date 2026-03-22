import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useLocation } from "wouter";

import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

import useRegionStore from "../../../stores/useRegionStore";
import { type Region } from "../constants";

const RegionDistributionPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { regions, deleteRegion } = useRegionStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const columns: Column<Region>[] = React.useMemo(
    () => [
      {
        key: "code",
        label: "Mã vùng",
        render: (v: string, r: Region) => (
          <span
            onClick={() => setLocation(`/region-distribution/detail/${r.id}`)}
            className="font-medium text-primary hover:underline cursor-pointer"
          >
            {v}
          </span>
        ),
      },
      { key: "name", label: "Tên vùng" },
      { key: "area", label: "Diện tích (ha)" },
      { key: "address", label: "Địa chỉ" },
      {
        key: "status",
        label: "Trạng thái",
        render: (v: string) => (
          <Badge variant={v === "active" ? "default" : "secondary"}>
            {v === "active" ? "Hoạt động" : "Ngưng"}
          </Badge>
        ),
      },
    ],
    [],
  );

  const handleAdd = () => {
    setLocation("/region-distribution/create");
  };

  const handleEdit = (item: Region) => {
    setLocation(`/region-distribution/edit/${item.id}`);
  };

  const handleDelete = (item: Region) => {
    setDeletingId(item.id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteRegion(deletingId);
      toast({ title: "Thành công", description: "Đã xóa vùng trồng" });
      setDeleteOpen(false);
    }
  };

  return (
    <AdminLayout
      title="Phân bố vùng"
      description="Quản lý danh sách và bản đồ phân bố vùng trồng"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm vùng trồng
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={regions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        description="Bạn có chắc chắn muốn xóa vùng trồng này?"
      />
    </AdminLayout>
  );
};

export default RegionDistributionPage;
