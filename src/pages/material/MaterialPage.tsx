import { useState } from "react";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";
import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";
import type { Material } from "./constants";
import useMaterialStore from "../../stores/useMaterialStore";

export default function MaterialPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Zustand store
  const materials = useMaterialStore((state) => state.materials);
  const deleteMaterial = useMaterialStore((state) => state.deleteMaterial);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Material | null>(null);

  const columns: Column<Material>[] = [
    { key: "code", label: "Mã" },
    {
      key: "name",
      label: "Tên vật tư",
      render: (value, row) => (
        <span
          className="font-medium text-primary cursor-pointer hover:underline"
          onClick={() => setLocation(`/material/${row.id}`)}
        >
          {value}
        </span>
      ),
    },
    {
      key: "type",
      label: "Phân loại",
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "description",
      label: "Mô tả",
      render: (value) => (
        <span className="truncate max-w-[200px] inline-block" title={value}>
          {value}
        </span>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "secondary"}>
          {value === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
  ];

  const handleAdd = () => {
    setLocation("/material/create");
  };

  const handleEdit = (item: Material) => {
    setLocation(`/material/${item.id}/edit`);
  };

  const handleDelete = (item: Material) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteMaterial(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa vật tư" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý vật liệu"
      description="Quản lý danh mục vật tư, thiết bị, dụng cụ"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm vật liệu
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={materials}
        onView={(item) =>
          toast({ title: "Xem chi tiết", description: item.name })
        }
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm vật tư..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
