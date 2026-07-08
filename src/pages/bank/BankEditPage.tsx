import {
  AdminLayout,
  Button,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2, Save, Trash2, X } from "lucide-react";
import { BankFormCard } from "./components/BankFormCard";
import { useBankFormPage } from "./hooks/useBankFormPage";

export default function BankEditPage() {
  const {
    formData,
    updateField,
    handleBankChange,
    handleSubmit,
    handleDelete,
    deleteOpen,
    setDeleteOpen,
    goBack,
    loading,
    error,
    isSubmitting,
    isDeleting,
    banks,
    notFound,
  } = useBankFormPage({ mode: "edit" });

  if (loading) {
    return (
      <AdminLayout
        isDev={true}
        title="Cập nhật tài khoản ngân hàng"
        description="Đang tải dữ liệu chi tiết..."
      >
        <div className="flex h-96 items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Đang tải dữ liệu chi tiết...
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout
        isDev={true}
        title="Cập nhật tài khoản ngân hàng"
        description="Không thể tải dữ liệu chi tiết"
      >
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      </AdminLayout>
    );
  }

  // Show not found if bank account doesn't exist
  if (notFound) {
    return (
      <AdminLayout
        isDev={true}
        title="Không tìm thấy"
        description="Tài khoản ngân hàng không tồn tại"
      >
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-4">
            Không tìm thấy tài khoản ngân hàng
          </h2>
          <Button onClick={goBack}>
            <X className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      isDev={true}
      title="Cập nhật tài khoản ngân hàng"
      description="Chỉnh sửa thông tin tài khoản ngân hàng"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
            disabled={isSubmitting || isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa
          </Button>
          <Button
            variant="outline"
            onClick={goBack}
            disabled={isSubmitting || isDeleting}
          >
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isDeleting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? "Đang lưu..." : "Lưu lại"}
          </Button>
        </div>
      }
    >
      <div className="max-w-2xl mx-auto">
        <BankFormCard
          formData={formData}
          banks={banks}
          showStatusField
          onBankChange={handleBankChange}
          onFieldChange={updateField}
        />
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={(open) => !isDeleting && setDeleteOpen(open)}
        onConfirm={handleDelete}
        description={`Bạn có chắc chắn muốn xóa tài khoản ${formData.bankName} - ${formData.accountNumber}?`}
        loading={isDeleting}
      />
    </AdminLayout>
  );
}
