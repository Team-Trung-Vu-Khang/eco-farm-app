import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Plus } from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useBranchStore, { type Branch } from "../../stores/useBranchStore";

export default function BranchPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const branches = useBranchStore((state) => state.branches);
  const deleteBranch = useBranchStore((state) => state.deleteBranch);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Branch | null>(null);

  const columns: Column<Branch>[] = [
    { key: "code", label: "Mã" },
    { key: "name", label: "Tên chi nhánh" },
    { key: "enterpriseName", label: "Đơn vị chủ quản" },
    { key: "phone", label: "Điện thoại" },
    { key: "email", label: "Email" },
    { key: "address", label: "Địa chỉ" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "outline"}>
          {value === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
  ];

  const filters = [
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Hoạt động", value: "active" },
        { label: "Không hoạt động", value: "inactive" },
      ],
    },
  ];

  const handleDelete = (item: Branch) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteBranch(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa chi nhánh khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý chi nhánh"
      description="Quản lý danh sách chi nhánh của các đơn vị"
      actions={
        <Link href="/branch/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={branches}
        onView={(item) => setLocation(`/branch/${item.id}/detail`)}
        onEdit={(item) => setLocation(`/branch/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm chi nhánh..."
        filters={filters}
        selectable
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa chi nhánh này? Dữ liệu liên quan có thể bị ảnh hưởng."
      />
    </AdminLayout>
  );
}
