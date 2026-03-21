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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Equipment } from "./constants";
import useEquipmentStore from "../../stores/useEquipmentStore";

export default function EquipmentPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Zustand store
  const equipments = useEquipmentStore((state) => state.equipments);
  const deleteEquipment = useEquipmentStore((state) => state.deleteEquipment);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Equipment | null>(null);

  const columns: Column<Equipment>[] = [
    { key: "code", label: "Mã" },
    {
      key: "name",
      label: "Tên thiết bị",
      render: (value, row) => (
        <span
          className="font-medium text-primary cursor-pointer hover:underline"
          onClick={() => setLocation(`/equipment/${row.id}`)}
        >
          {value}
        </span>
      ),
    },
    {
      key: "type",
      label: "Loại thiết bị",
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    { key: "maintainanceInterval", label: "Chu kỳ B.Dưỡng" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge
          variant={
            value === "active"
              ? "default"
              : value === "maintenance"
                ? "destructive"
                : "secondary"
          }
        >
          {value === "active"
            ? "Hoạt động"
            : value === "maintenance"
              ? "Bảo trì"
              : "Ngừng SD"}
        </Badge>
      ),
    },
  ];

  const handleAdd = () => {
    setLocation("/equipment/create");
  };

  const handleEdit = (item: Equipment) => {
    setLocation(`/equipment/${item.id}/edit`);
  };

  const handleDelete = (item: Equipment) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteEquipment(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa thiết bị" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý thiết bị"
      description="Quản lý danh mục máy móc, công cụ và lịch bảo dưỡng"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm thiết bị
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={equipments}
        onView={(item) =>
          toast({ title: "Xem chi tiết", description: item.name })
        }
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm thiết bị..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
