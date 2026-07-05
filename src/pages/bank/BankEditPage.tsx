import {
  AdminLayout,
  Button,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, Trash2, X } from "lucide-react";
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
    notFound,
  } = useBankFormPage({ mode: "edit" });

  // Show not found if bank account doesn't exist
  if (notFound) {
    return (
      <AdminLayout
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
      title="Cập nhật tài khoản ngân hàng"
      description="Chỉnh sửa thông tin tài khoản ngân hàng"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa
          </Button>
          <Button variant="outline" onClick={goBack}>
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Lưu lại
          </Button>
        </div>
      }
    >
      <div className="max-w-2xl mx-auto">
        <BankFormCard
          formData={formData}
          showStatusField
          onBankChange={handleBankChange}
          onFieldChange={updateField}
        />
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        description={`Bạn có chắc chắn muốn xóa tài khoản ${formData.bankName} - ${formData.accountNumber}?`}
      />
    </AdminLayout>
  );
}
