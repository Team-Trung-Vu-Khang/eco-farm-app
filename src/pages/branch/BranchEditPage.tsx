import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, X } from "lucide-react";
import { useBranchEdit } from "./hooks/useBranchEdit";
import { GeneralInfoCard } from "./components/GeneralInfoCard";
import { AddressLocationCard } from "./components/AddressLocationCard";
import { ContactCard } from "./components/ContactCard";
import { DangerZoneCard } from "./components/DangerZoneCard";

/**
 * Branch edit page component.
 * Allows users to update information of an existing branch.
 */
export default function BranchEditPage() {
  const {
    branch,
    branchId,
    formData,
    updateFormData,
    handleSubmit,
    handleDelete,
    handleCancel,
  } = useBranchEdit();

  // Show not found state if branch doesn't exist
  if (branchId && !branch) {
    return (
      <AdminLayout isDev={true}>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-4">
            Không tìm thấy thông tin chi nhánh
          </h2>
          <Button onClick={handleCancel}>
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
      title="Chỉnh sửa chi nhánh"
      description={`Cập nhật thông tin chi nhánh #${branchId}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Cập nhật
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GeneralInfoCard formData={formData} onUpdate={updateFormData} />
          <AddressLocationCard formData={formData} onUpdate={updateFormData} />
          <DangerZoneCard onDelete={handleDelete} />
        </div>

        <div className="space-y-6">
          <ContactCard formData={formData} onUpdate={updateFormData} />
        </div>
      </div>
    </AdminLayout>
  );
}
