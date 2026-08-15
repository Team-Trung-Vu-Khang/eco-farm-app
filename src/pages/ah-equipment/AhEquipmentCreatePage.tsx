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
  Label,
  StepperForm,
  Switch,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { EquipmentBasicInfoStep } from "../equipment/components/steps/EquipmentBasicInfoStep";
import { EquipmentTechnicalStep } from "../equipment/components/steps/EquipmentTechnicalStep";
import { EquipmentOperationStep } from "../equipment/components/steps/EquipmentOperationStep";
import { EquipmentSuppliersStep } from "../equipment/components/steps/EquipmentSuppliersStep";
import { EquipmentConfirmationStep } from "../equipment/components/steps/EquipmentConfirmationStep";
import SimpleEquipmentForm from "../equipment/components/SimpleEquipmentForm";
import { useAhEquipmentCreateForm } from "./hooks/useAhEquipmentCreateForm";

const AhEquipmentCreatePage = () => {
  const {
    isEdit,
    formData,
    updateField,
    resetForm,
    tempSupplier,
    setTempSupplier,
    addSupplierItem,
    removeSupplierItem,
    confirmOpen,
    setConfirmOpen,
    handleConfirmSubmit,
    navigateBack,
    loading,
    submitting,
    isDetailMode,
    setIsDetailMode,
    isValidStep1,
  } = useAhEquipmentCreateForm();

  if (loading) {
    return (
      <PageWrapper
        title={isEdit ? "Cập nhật thiết bị" : "Thêm mới thiết bị chăn nuôi"}
      >
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground animate-pulse">
            Đang tải dữ liệu...
          </p>
        </div>
      </PageWrapper>
    );
  }

  const steps = [
    {
      id: "info",
      title: "Định danh & Phân loại",
      content: (
        <EquipmentBasicInfoStep formData={formData} updateField={updateField} />
      ),
      isValid: isValidStep1,
    },
    {
      id: "technical",
      title: "Thông số kỹ thuật",
      content: (
        <EquipmentTechnicalStep
          domainCode="LIVESTOCK"
          formData={formData}
          updateField={updateField}
        />
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
      title={
        isEdit ? "Cập nhật thiết bị chăn nuôi" : "Thêm mới thiết bị chăn nuôi"
      }
      description={
        isEdit
          ? `Chỉnh sửa thông tin ${formData.machineName || formData.name}`
          : "Quản lý máy móc, công cụ chăn nuôi và lịch bảo dưỡng"
      }
    >
      {/* Header bar: back button + toggle */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={navigateBack}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>

        <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
          <Label
            htmlFor="ah-equipment-detail-mode"
            className="text-xs font-semibold text-slate-600 cursor-pointer select-none"
          >
            Thông tin chuyên sâu
          </Label>
          <Switch
            id="ah-equipment-detail-mode"
            checked={isDetailMode}
            onCheckedChange={(checked) => {
              setIsDetailMode(checked);
              resetForm();
            }}
          />
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-xs rounded-xl">
        {isDetailMode ? (
          <StepperForm
            steps={steps}
            loading={submitting}
            completeLabel={isEdit ? "Lưu thay đổi" : "Hoàn tất & Lưu"}
            onComplete={() => setConfirmOpen(true)}
            onCancel={navigateBack}
          />
        ) : (
          <div className="p-4 md:p-6">
            <SimpleEquipmentForm
              loading={submitting}
              isEdit={isEdit}
              formData={formData}
              domain="animal"
              updateField={updateField}
              handleComplete={() => setConfirmOpen(true)}
              goBack={navigateBack}
              completeLabel={isEdit ? "Lưu thay đổi" : "Hoàn tất & Lưu"}
            />
          </div>
        )}
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
                    ? "Bạn có chắc chắn muốn cập nhật thông tin thiết bị chăn nuôi này?"
                    : "Bạn có chắc chắn muốn thêm thiết bị chăn nuôi mới vào hệ thống?"}
                </p>
                <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm mt-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã SKU:</span>
                    <span className="font-medium">
                      {formData.sku || formData.code}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tên máy móc:</span>
                    <span className="font-medium">
                      {formData.machineName || formData.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bảo dưỡng:</span>
                    <span className="font-medium">
                      {formData.maintenanceSchedule ||
                        formData.maintainanceInterval ||
                        "N/A"}
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

export default AhEquipmentCreatePage;
