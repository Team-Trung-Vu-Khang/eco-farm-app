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
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useFarmerCreateForm } from "./hooks/useFarmerCreateForm";
import { FarmerBasicInfoStep } from "./components/steps/FarmerBasicInfoStep";
import { FarmerBankStep } from "./components/steps/FarmerBankStep";
import { FarmerDocumentStep } from "./components/steps/FarmerDocumentStep";
import { FarmerConfirmationStep } from "./components/steps/FarmerConfirmationStep";
import { FarmerContactStep } from "./components/steps/FarmerContactStep";

export default function FarmerEditPage() {
  const {
    formData,
    updateField,
    newBankAccount,
    setNewBankAccount,
    bankInputMethod,
    setBankInputMethod,
    hasCamera,
    bankSearchQuery,
    setBankSearchQuery,
    isDragging,
    handleDrag,
    processExcelFile,
    processQRImage,
    handleLiveScan,
    processLogoImage,
    processDocuments,
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
      id: "banks",
      title: "Tài khoản ngân hàng",
      description: "Thiết lập thông tin thanh toán",
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
      id: "documents",
      title: "Tài liệu đính kèm",
      description: "Giấy phép, chứng nhận...",
      content: (
        <FarmerDocumentStep
          documents={formData.documents}
          isDragging={!!isDragging["documents"]}
          handleDrag={handleDrag}
          processDocuments={processDocuments}
          removeDocument={(index) => {
            const newDocs = [...formData.documents];
            newDocs.splice(index, 1);
            updateField("documents", newDocs);
          }}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin",
      content: (
        <FarmerConfirmationStep
          formData={formData}
          bankSearchQuery={bankSearchQuery}
          setBankSearchQuery={setBankSearchQuery}
        />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <StepperForm
          steps={steps}
          onComplete={submitForm}
          onCancel={navigateBack}
        />

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                Xác nhận cập nhật?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Mọi thay đổi sẽ được lưu vào hệ thống. Bạn có chắc chắn muốn hoàn tất việc chỉnh sửa nông hộ này?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 pt-4">
              <AlertDialogCancel className="rounded-xl px-6">
                Kiểm tra lại
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={submitForm}
                className="rounded-xl px-6 bg-primary hover:bg-primary/90 transition-all font-bold"
              >
                Cập nhật ngay
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
