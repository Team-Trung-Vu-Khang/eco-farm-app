import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { bankColumns } from "./data/columns";
import { bankFilters } from "./data/constants";
import { useBankTable } from "./hooks/useBankTable";

export default function BankPage() {
  const {
    bankAccounts,
    loading,
    error,
    response,
    pageSize,
    currentIndex,
    handleSearch,
    handleFilterChange,
    handlePageSize,
    handleIndexChange,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleEdit,
    handleView,
  } = useBankTable();

  return (
    <AdminLayout
      isDev={true}
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
      {error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      ) : null}

      <DataTable
        columns={bankColumns}
        data={bankAccounts}
        searchable
        searchPlaceholder="Tìm kiếm tài khoản..."
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={[...bankFilters]}
        loading={loading}
        currentIndex={currentIndex}
        pageSize={pageSize}
        totalPages={response?.totalPages}
        totalElements={response?.totalElements}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onPageSize={handlePageSize}
        onIndexChange={handleIndexChange}
        selectable={false}
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
