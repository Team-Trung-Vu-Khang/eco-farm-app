import { Link, useLocation } from "wouter";
import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCooperative } from "./hooks/useCooperative";
import { CooperativeTable } from "./components/CooperativeTable";

export default function CooperativePage() {
  const [, setLocation] = useLocation();
  const {
    data,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
  } = useCooperative();

  const headerActions = (
    <Link href="/cooperative/create">
      <Button data-testid="add-cooperative">
        <Plus className="w-4 h-4 mr-2" />
        Thêm mới
      </Button>
    </Link>
  );

  return (
    <AdminLayout
      title="Quản lý hợp tác xã"
      description="Quản lý thông tin các hợp tác xã trong hệ thống"
      actions={headerActions}
    >
      <CooperativeTable
        data={data}
        onView={(item) => setLocation(`/cooperative/${item.id}`)}
        onEdit={(item) => setLocation(`/cooperative/${item.id}/edit`)}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa hợp tác xã này? Chỉ có thể xóa khi chưa có dữ liệu gắn kết."
      />
    </AdminLayout>
  );
}


