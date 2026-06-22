import { Link } from "wouter";
import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { bankColumns } from "./data/columns";
import { bankFilters } from "./data/constants";
import { useBankTable } from "./hooks/useBankTable";

export default function BankPage() {
  const {
    bankAccounts,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleEdit,
    handleView,
  } = useBankTable();

  return (
    <AdminLayout
      isRice
      title="Quản lý tài khoản ngân hàng"
      description="Danh sách tài khoản ngân hàng của đơn vị sở hữu"
      actions={
        <Link href="/bank/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </Link>
      }
    >
      <DataTable
        columns={bankColumns}
        data={bankAccounts}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm tài khoản..."
        filters={[...bankFilters]}
        selectable
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa tài khoản này? Hoạt động này không thể hoàn tác."
      />
    </AdminLayout>
  );
}
