import { useMemo, useState } from "react";
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
} from "@tankhang1/eco-shared-ui";
import type { Enterprise } from "./constants";
import useEnterpriseStore from "../../stores/useEnterpriseStore";

export default function EnterprisePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const enterprises = useEnterpriseStore((state) => state.enterprises);
  const filterEnterprises = useMemo(() => {
    return enterprises.filter((enterprise) => enterprise.type === "enterprise");
  }, [enterprises]);
  const deleteEnterprise = useEnterpriseStore(
    (state) => state.deleteEnterprise,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Enterprise | null>(null);

  const columns: Column<Enterprise>[] = [
    { key: "code", label: "Mã" },
    {
      key: "image",
      label: "Hình ảnh",
      render: (value) =>
        value ? (
          <img
            src={value as string}
            alt="enterprise"
            className="w-10 h-10 object-cover rounded-md border"
          />
        ) : null,
    },
    { key: "name", label: "Tên đơn vị" },
    {
      key: "classification",
      label: "Phân loại",
      render: (value) => {
        const labels: Record<string, string> = {
          production: "Sản xuất",
          processing: "Chế biến",
          trading: "Thương mại",
          service: "Dịch vụ",
          other: "Khác",
        };
        return value.map((item: string) => {
          return (
            <Badge key={item} variant="secondary" className="mr-1">
              {labels[item]}
            </Badge>
          );
        });
      },
    },
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
      key: "classification",
      label: "Phân loại",
      options: [
        { label: "Sản xuất", value: "production" },
        { label: "Chế biến", value: "processing" },
        { label: "Thương mại", value: "trading" },
        { label: "Dịch vụ", value: "service" },
        { label: "Khác", value: "other" },
      ],
    },
  ];

  const handleDelete = (item: Enterprise) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteEnterprise(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa đơn vị khỏi hệ thống",
      });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý doanh nghiệp"
      description="Quản lý thông tin các doanh nghiệp trong hệ thống"
      actions={
        <Link href="/enterprise/create">
          <Button data-testid="add-enterprise">
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={filterEnterprises}
        onView={(item) => setLocation(`/enterprise/${item.id}`)}
        onEdit={(item) => setLocation(`/enterprise/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm doanh nghiệp..."
        filters={filters}
        selectable
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa doanh nghiệp này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}
