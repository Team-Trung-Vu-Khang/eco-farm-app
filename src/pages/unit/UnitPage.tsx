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
import { initialUnits, type Unit } from "./constants";

export default function UnitPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<Unit[]>(initialUnits);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Unit | null>(null);

  const columns: Column<Unit>[] = [
    { key: "code", label: "Mã" },
    {
      key: "name",
      label: "Tên đơn vị",
      render: (value, row) => (
        <span
          className="font-medium text-primary cursor-pointer hover:underline"
          onClick={() => setLocation(`/unit/${row.id}/edit`)}
        >
          {value}
        </span>
      ),
    },
    { key: "description", label: "Mô tả", render: (value) => value || "-" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "secondary"}>
          {value === "active" ? "Hoạt động" : "Ngừng hoạt động"}
        </Badge>
      ),
    },
  ];

  const handleAdd = () => {
    setLocation("/unit/create");
  };

  const handleEdit = (item: Unit) => {
    setLocation(`/unit/${item.id}/edit`);
  };

  const handleDelete = (item: Unit) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa đơn vị tính" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý đơn vị"
      description="Quản lý danh sách đơn vị tính cho vật tư, nông sản"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm đơn vị
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
        searchPlaceholder="Tìm kiếm đơn vị..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
