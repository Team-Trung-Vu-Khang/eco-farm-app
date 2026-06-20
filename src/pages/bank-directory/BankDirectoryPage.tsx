import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useBankDirectory } from "./hooks/useBankDirectory";
import BankFormDialog from "./components/BankFormDialog";
import { bankDirectoryColumns } from "./data/columns";

export default function BankDirectoryPage() {
  const {
    data,
    loading,
    error,
    formData,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    logoPreview,
    updateFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleLogoUpload,
    handleRemoveLogo,
    handleSubmit,
    handleConfirmDelete,
  } = useBankDirectory();

  return (
    <AdminLayout
      isDev={true}
      title="Danh mục ngân hàng"
      description="Tra cứu thông tin thanh toán quốc tế: SWIFT/BIC code, địa chỉ và mã routing ngân hàng"
      actions={
        <Button onClick={handleAdd} data-testid="add-bank">
          <Plus className="w-4 h-4 mr-2" />
          Thêm ngân hàng
        </Button>
      }
    >
      {error ? (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm font-medium">
          ⚠️ {error}
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
          <span className="text-sm">Đang tải dữ liệu ngân hàng...</span>
        </div>
      ) : (
        <DataTable
          columns={bankDirectoryColumns}
          data={data}
          pageSize={10}
          searchPlaceholder="Tìm kiếm tên, SWIFT code, BIC..."
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <BankFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        formData={formData}
        onFormUpdate={updateFormData}
        logoPreview={logoPreview}
        onLogoUpload={handleLogoUpload}
        onRemoveLogo={handleRemoveLogo}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa ngân hàng này khỏi danh sách?"
      />
    </AdminLayout>
  );
}
