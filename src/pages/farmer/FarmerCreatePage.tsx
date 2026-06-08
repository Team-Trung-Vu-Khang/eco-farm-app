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
import { useFarmerCreateForm } from "./hooks/useFarmerCreateForm";
import { FarmerBasicInfoStep } from "./components/steps/FarmerBasicInfoStep";
import { FarmerBankStep } from "./components/steps/FarmerBankStep";
import { FarmerConfirmationStep } from "./components/steps/FarmerConfirmationStep";
import { FarmerContactStep } from "./components/steps/FarmerContactStep";

export default function FarmerCreatePage() {
  const {
    isEdit,
    formData,
    updateField,
    newBankAccount,
    setNewBankAccount,
    bankInputMethod,
    setBankInputMethod,
    hasCamera,
    bankSearchQuery,
    setBankSearchQuery,
    confirmBankSearchQuery,
    setConfirmBankSearchQuery,
    isDragging,
    handleDrag,
    processExcelFile,
    processQRImage,
    handleLiveScan,
    processLogoImage,
    newContact,
    setNewContact,
    addContact,
    removeContact,
    addBankAccount,
    removeBankAccount,
    submitForm,
    showConfirmDialog,
    setShowConfirmDialog,
    navigateBack,
  } = useFarmerCreateForm();

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cơ bản",
      description: "Tên, thương hiệu, mã, thuế",
      content: (
        <FarmerBasicInfoStep
          formData={formData}
          updateField={updateField}
          isDragging={!!isDragging["logo"]}
          handleDrag={handleDrag}
          processLogoImage={processLogoImage}
        />
      ),
      isValid: formData.name.length > 0 && formData.code.length > 0,
    },
    {
      id: "contacts",
      title: "Người liên hệ",
      description: "Danh sách người liên hệ",
      content: (
        <FarmerContactStep
          contacts={formData.contacts}
          newContact={newContact}
          setNewContact={setNewContact}
          addContact={addContact}
          removeContact={removeContact}
        />
      ),
    },
    {
      id: "bank",
      title: "Ngân hàng",
      description: "Tài khoản thanh toán",
      content: (
        <FarmerBankStep
          bankAccounts={formData.bankAccounts}
          newBankAccount={newBankAccount}
          setNewBankAccount={setNewBankAccount}
          bankInputMethod={bankInputMethod}
          setBankInputMethod={setBankInputMethod}
          hasCamera={hasCamera}
          bankSearchQuery={bankSearchQuery}
          setBankSearchQuery={setBankSearchQuery}
          isDragging={isDragging}
          handleDrag={handleDrag}
          processExcelFile={processExcelFile}
          processQRImage={processQRImage}
          handleLiveScan={handleLiveScan}
          addBankAccount={addBankAccount}
          removeBankAccount={removeBankAccount}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: (
        <FarmerConfirmationStep
          formData={formData}
          bankSearchQuery={confirmBankSearchQuery}
          setBankSearchQuery={setConfirmBankSearchQuery}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      title={isEdit ? "Chỉnh sửa Nông hộ" : "Tạo mới Nông hộ"}
      description="Điền thông tin theo từng bước để tạo mới nông hộ"
    >
      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            completeLabel={isEdit ? "Cập nhật" : "Tạo mới"}
            onComplete={() => setShowConfirmDialog(true)}
            onCancel={navigateBack}
          />
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận {isEdit ? "cập nhật" : "tạo mới"}</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn {isEdit ? "cập nhật" : "tạo mới"} nông hộ "{formData.name}" không?
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
