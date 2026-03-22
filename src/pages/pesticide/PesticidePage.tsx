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
import type { Pesticide } from "./constants";
import usePesticideStore from "../../stores/usePesticideStore";

export default function PesticidePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Zustand store
  const pesticides = usePesticideStore((state) => state.pesticides);
  const deletePesticide = usePesticideStore((state) => state.deletePesticide);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Pesticide | null>(null);

  const columns: Column<Pesticide>[] = [
    { key: "code", label: "Mã" },
    {
      key: "name",
      label: "Tên thuốc",
      render: (value, row) => (
        <span
          className="font-medium text-primary cursor-pointer hover:underline"
          onClick={() => setLocation(`/pesticide/${row.id}`)}
        >
          {value}
        </span>
      ),
    },
    {
      key: "group",
      label: "Nhóm thuốc",
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    { key: "form", label: "Dạng thuốc" },
    { key: "origin", label: "Nguồn gốc" },
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
    setLocation("/pesticide/create");
  };

  const handleEdit = (item: Pesticide) => {
    setLocation(`/pesticide/${item.id}/edit`);
  };

  const handleDelete = (item: Pesticide) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };
  const handleViewDetail = (item: Pesticide) => {
    setLocation(`/pesticide/${item.id}`);
  };
  const handleConfirmDelete = () => {
    if (deleteItem) {
      deletePesticide(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa thuốc BVTV" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý thuốc BVTV"
      description="Quản lý danh mục thuốc bảo vệ thực vật"
      actions={
        <Button onClick={handleAdd} data-testid="add-pesticide">
          <Plus className="w-4 h-4 mr-2" />
          Thêm thuốc BVTV
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={pesticides}
        onView={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm thuốc BVTV..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
