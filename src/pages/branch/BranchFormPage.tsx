import {
  AdminLayout,
  Card,
  CardContent,
  StepperForm,
  type Step,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useBranchForm } from "./hooks/useBranchForm";
import { BasicInfoStep } from "./components/steps/BasicInfoStep";
import { ContactInfoStep } from "./components/steps/ContactInfoStep";
import { LocationStep } from "./components/steps/LocationStep";
import { PersonnelStep } from "./components/steps/PersonnelStep";
import { BankingStep } from "./components/steps/BankingStep";
import { ConfirmStep } from "./components/steps/ConfirmStep";

/**
 * Branch form page component.
 * Uses a stepper to guide users through creating or editing a branch.
 */
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
      description: "Quản lý liên hệ",
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
      title={isEdit ? "Chỉnh sửa chi nhánh" : "Thêm chi nhánh mới"}
      description="Điền thông tin theo từng bước để tạo mới"
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
              {isEdit ? "Xác nhận cập nhật" : "Xác nhận tạo mới"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn {isEdit ? "cập nhật" : "tạo mới"} chi nhánh
              "{formData.name}" không?
              <br />
              Thông tin đã nhập sẽ được lưu vào hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={submitForm}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
