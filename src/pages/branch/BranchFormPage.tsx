import {
  AdminLayout,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Card,
  CardContent,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft } from "lucide-react";
import { FormProvider } from "react-hook-form";

import { BankingStep } from "./components/steps/BankingStep";
import { BasicInfoStep } from "./components/steps/BasicInfoStep";
import { ConfirmStep } from "./components/steps/ConfirmStep";
import { ContactInfoStep } from "./components/steps/ContactInfoStep";
import { LocationStep } from "./components/steps/LocationStep";
import { useBranchForm } from "./hooks/useBranchForm";

export default function BranchFormPage() {
  const {
    form,
    formData,
    updateFormData,
    enterprises,
    isEdit,
    showConfirmDialog,
    setShowConfirmDialog,
    handleComplete,
    submitForm,
    handleCancel,
  } = useBranchForm();

  const selectedEnterprise = enterprises.find(
    (enterprise) => enterprise.id.toString() === formData.enterpriseId,
  );

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cơ bản",
      description: "Tên, mã, đơn vị",
      content: <BasicInfoStep enterprises={enterprises} isEdit={isEdit} />,
      isValid:
        formData.name.length > 0 &&
        formData.code.length > 0 &&
        formData.enterpriseId.length > 0,
    },
    {
      id: "contact-info",
      title: "Liên hệ",
      description: "Điện thoại, email, website",
      content: (
        <ContactInfoStep formData={formData} updateFormData={updateFormData} />
      ),
    },
    {
      id: "location",
      title: "Định vị",
      description: "Địa chỉ, bản đồ",
      content: (
        <LocationStep formData={formData} updateFormData={updateFormData} />
      ),
    },
    {
      id: "banking",
      title: "Ngân hàng",
      description: "Tài khoản thanh toán",
      content: (
        <BankingStep formData={formData} updateFormData={updateFormData} />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra lại thông tin",
      content: (
        <ConfirmStep
          formData={formData}
          enterpriseName={selectedEnterprise?.name || formData.enterpriseName}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      isDev={true}
      title={isEdit ? "Chỉnh sửa Chi nhánh" : "Tạo mới Chi nhánh"}
      description="Điền thông tin theo từng bước để tạo hoặc cập nhật chi nhánh"
      actions={[
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>,
      ]}
    >
      <Card>
        <CardContent className="p-6">
          <FormProvider {...form}>
            <StepperForm
              steps={steps}
              onComplete={handleComplete}
              onCancel={handleCancel}
              completeLabel={isEdit ? "Cập nhật" : "Tạo mới"}
            />
          </FormProvider>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEdit
                ? "Xác nhận cập nhật chi nhánh"
                : "Xác nhận tạo chi nhánh"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn {isEdit ? "cập nhật" : "tạo"} chi nhánh này
              không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={submitForm}>
              {isEdit ? "Cập nhật" : "Tạo mới"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
