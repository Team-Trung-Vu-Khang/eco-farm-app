import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, X } from "lucide-react";
import { useBranchCreate } from "./hooks/useBranchCreate";
import { GeneralInfoCard } from "./components/GeneralInfoCard";
import { AddressLocationCard } from "./components/AddressLocationCard";
import { ContactCard } from "./components/ContactCard";
import { ConfirmCreateDialog } from "./components/ConfirmCreateDialog";

/**
 * Branch creation page component.
 * Allows users to create a new branch for an enterprise.
 */
export default function BranchCreatePage() {
  const {
    formData,
    updateFormData,
    contactInfos,
    newContactInfo,
    setNewContactInfo,
    addContactInfo,
    removeContactInfo,
    setPrimaryContactInfo,
    showConfirm,
    setShowConfirm,
    handleSubmit,
    handleConfirmSubmit,
    handleCancel,
  } = useBranchCreate();

  return (
    <AdminLayout
      isDev={true}
      title="Thêm mới chi nhánh"
      description="Tạo chi nhánh mới cho đơn vị sở hữu"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
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
      <ConfirmCreateDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleConfirmSubmit}
        formData={formData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GeneralInfoCard formData={formData} onUpdate={updateFormData} />
          <AddressLocationCard formData={formData} onUpdate={updateFormData} />
        </div>

        <div className="space-y-6">
          <ContactCard
            contactInfos={contactInfos}
            newContactInfo={newContactInfo}
            setNewContactInfo={setNewContactInfo}
            addContactInfo={addContactInfo}
            removeContactInfo={removeContactInfo}
            setPrimaryContactInfo={setPrimaryContactInfo}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
