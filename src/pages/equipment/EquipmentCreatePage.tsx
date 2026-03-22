import {
  AdminLayout,
  StepperForm,
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { useEquipmentCreateForm } from "./hooks/useEquipmentCreateForm";
import { EquipmentBasicInfoStep } from "./components/steps/EquipmentBasicInfoStep";
import { EquipmentTechnicalDocsStep } from "./components/steps/EquipmentTechnicalDocsStep";
import { EquipmentSuppliersStep } from "./components/steps/EquipmentSuppliersStep";
import { EquipmentConfirmationStep } from "./components/steps/EquipmentConfirmationStep";

const EquipmentCreatePage = () => {
  const {
    isEdit,
    formData,
    updateField,
    tempSupplier,
    setTempSupplier,
    addSupplierItem,
    removeSupplierItem,
    confirmOpen,
    setConfirmOpen,
    handleConfirmSubmit,
    navigateBack,
  } = useEquipmentCreateForm();

  const steps = [
    {
      id: "info",
      title: "Thông tin cơ bản",
      content: (
        <EquipmentBasicInfoStep 
          formData={formData} 
          updateField={updateField} 
        />
      ),
    },
    {
      id: "docs",
      title: "Tài liệu kỹ thuật",
      content: (
        <EquipmentTechnicalDocsStep 
          formData={formData} 
          updateField={updateField} 
        />
      ),
    },
    {
      id: "supply",
      title: "Nguồn cung & Bảo hành",
      content: (
        <EquipmentSuppliersStep
          formData={formData}
          tempSupplier={tempSupplier}
          setTempSupplier={setTempSupplier}
          addSupplierItem={addSupplierItem}
          removeSupplierItem={removeSupplierItem}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      content: <EquipmentConfirmationStep formData={formData} />,
    },
  ];

  return (
    <AdminLayout
      title={isEdit ? "Cập nhật thiết bị" : "Thêm mới thiết bị"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin ${formData.name}`
          : "Quản lý máy móc, công cụ và lịch bảo dưỡng"
      }
    >
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={navigateBack}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="bg-white/50 backdrop-blur-xs rounded-xl">
        <StepperForm
          steps={steps}
          completeLabel={isEdit ? "Lưu thay đổi" : "Hoàn tất & Lưu"}
          onComplete={() => setConfirmOpen(true)}
          onCancel={navigateBack}
        />
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEdit ? "Xác nhận cập nhật" : "Xác nhận thêm mới"}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                {isEdit
                  ? "Bạn có chắc chắn muốn cập nhật thông tin thiết bị này?"
                  : "Bạn có chắc chắn muốn thêm thiết bị mới vào hệ thống?"}
              </p>
              <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã thiết bị:</span>
                  <span className="font-medium">{formData.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tên thiết bị:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loại:</span>
                  <span className="font-medium">{formData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bảo dưỡng:</span>
                  <span className="font-medium">
                    {formData.maintainanceInterval}
                  </span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              {isEdit ? "Xác nhận cập nhật" : "Xác nhận thêm mới"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default EquipmentCreatePage;
