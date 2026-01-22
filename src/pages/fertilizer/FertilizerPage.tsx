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
import { initialFertilizers, type Fertilizer } from "./constants";

export default function FertilizerPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<Fertilizer[]>(initialFertilizers);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Fertilizer | null>(null);

  const columns: Column<Fertilizer>[] = [
    { key: "code", label: "Mã" },
    {
      key: "name",
      label: "Tên phân bón",
      render: (value, row) => (
        <span
          className="font-medium text-primary cursor-pointer hover:underline"
          onClick={() => setLocation(`/fertilizer/${row.id}/edit`)} // Or detail if implemented
        >
          {value}
        </span>
      ),
    },
    {
      key: "type",
      label: "Loại phân",
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    { key: "nutrientContent", label: "Hàm lượng" },
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
    setLocation("/fertilizer/create");
  };

  const handleEdit = (item: Fertilizer) => {
    setLocation(`/fertilizer/${item.id}/edit`);
  };

  const handleDelete = (item: Fertilizer) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa phân bón" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý chất bón"
      description="Quản lý danh mục phân bón, chất cải tạo đất"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm chất bón
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        onView={(item) =>
          toast({ title: "Xem chi tiết", description: item.name })
        }
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm phân bón..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
