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
  Card,
  CardContent,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

import { BankingStep } from "./components/steps/BankingStep";
import { BasicInfoStep } from "./components/steps/BasicInfoStep";
import { ConfirmStep } from "./components/steps/ConfirmStep";
import { ContactInfoStep } from "./components/steps/ContactInfoStep";
import { LocationStep } from "./components/steps/LocationStep";
import { PersonnelStep } from "./components/steps/PersonnelStep";
import { useBranchForm } from "./hooks/useBranchForm";

export default function BranchFormPage() {
  const {
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

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cơ bản",
      description: "Tên, mã, đơn vị",
      content: (
        <BasicInfoStep
          formData={formData}
          updateFormData={updateFormData}
          enterprises={enterprises}
          isEdit={isEdit}
        />
      ),
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
      id: "contacts",
      title: "Người liên hệ",
      description: "Quản lý người liên hệ",
      content: (
        <PersonnelStep formData={formData} updateFormData={updateFormData} />
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
      content: <ConfirmStep formData={formData} />,
    },
  ];

  return (
    <AdminLayout
      isDev={true}
      title={isEdit ? "Chỉnh sửa Chi nhánh" : "Tạo mới Chi nhánh"}
      description="Điền thông tin theo từng bước để tạo hoặc cập nhật chi nhánh"
    >
      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={handleCancel}
            completeLabel={isEdit ? "Cập nhật" : "Tạo mới"}
          />
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
