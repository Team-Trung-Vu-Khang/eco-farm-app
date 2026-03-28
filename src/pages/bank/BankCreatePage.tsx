import {
  AdminLayout,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, X } from "lucide-react";
import { BankFormCard } from "./components/BankFormCard";
import { useBankFormPage } from "./hooks/useBankFormPage";

export default function BankCreatePage() {
  const { formData, updateField, handleBankChange, handleSubmit, goBack } =
    useBankFormPage({ mode: "create" });

  return (
    <AdminLayout
      title="Thêm mới tài khoản ngân hàng"
      description="Thêm tài khoản ngân hàng mới vào hệ thống"
      actions={
        <div className="flex gap-2">
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
          onBankChange={handleBankChange}
          onFieldChange={updateField}
        />
      </div>
    </AdminLayout>
  );
}
