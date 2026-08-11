import PageWrapper from "@/components/PageWrapper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  StepperForm,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { EquipmentBasicInfoStep } from "../equipment/components/steps/EquipmentBasicInfoStep";
import { EquipmentTechnicalStep } from "../equipment/components/steps/EquipmentTechnicalStep";
import { EquipmentOperationStep } from "../equipment/components/steps/EquipmentOperationStep";
import { EquipmentSuppliersStep } from "../equipment/components/steps/EquipmentSuppliersStep";
import { EquipmentConfirmationStep } from "../equipment/components/steps/EquipmentConfirmationStep";
import { useAqEquipmentCreateForm } from "./hooks/useAqEquipmentCreateForm";

const AqEquipmentCreatePage = () => {
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
  } = useAqEquipmentCreateForm();

  const steps = [
    {
      id: "info",
      title: "Định danh & Phân loại",
      content: (
        <EquipmentBasicInfoStep formData={formData} updateField={updateField} />
      ),
    },
    {
      id: "technical",
      title: "Thông số kỹ thuật",
      content: (
        <EquipmentTechnicalStep formData={formData} updateField={updateField} />
      ),
    },
    {
      id: "operation",
      title: "Vận hành & Bảo dưỡng",
      content: (
        <EquipmentOperationStep formData={formData} updateField={updateField} />
      ),
    },
    {
      id: "supply",
      title: "Xuất xứ & Cung ứng",
      content: (
        <EquipmentSuppliersStep
          formData={formData}
          tempSupplier={tempSupplier}
          setTempSupplier={setTempSupplier}
          addSupplierItem={addSupplierItem}
          removeSupplierItem={removeSupplierItem}
          updateField={updateField}
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
    <PageWrapper
      title={isEdit ? "Cập nhật thiết bị thủy sản" : "Thêm mới thiết bị thủy sản"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin ${formData.machineName || formData.name}`
          : "Quản lý máy móc, công cụ thủy sản và lịch bảo dưỡng"
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
            <AlertDialogDescription className="space-y-3" asChild>
              <div>
                <p>
                  {isEdit
                    ? "Bạn có chắc chắn muốn cập nhật thông tin thiết bị thủy sản này?"
                    : "Bạn có chắc chắn muốn thêm thiết bị thủy sản mới vào hệ thống?"}
                </p>
                <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm mt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã SKU:</span>
                    <span className="font-medium">{formData.sku || formData.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tên máy móc:</span>
                    <span className="font-medium">{formData.machineName || formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bảo dưỡng:</span>
                    <span className="font-medium">
                      {formData.maintenanceSchedule || formData.maintainanceInterval || "N/A"}
                    </span>
                  </div>
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
    </PageWrapper>
  );
};

export default AqEquipmentCreatePage;
