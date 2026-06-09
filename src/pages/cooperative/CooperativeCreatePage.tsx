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
import { useLocation } from "wouter";
import { useCooperativeForm } from "./hooks/useCooperativeForm";
import { BasicInfoStep } from "./components/steps/BasicInfoStep";
import { ContactInfoStep } from "./components/steps/ContactInfoStep";
import { BranchesStep } from "./components/steps/BranchesStep";
import { BankInfoStep } from "./components/steps/BankInfoStep";
import { DocumentsStep } from "./components/steps/DocumentsStep";
import { ConfirmStep } from "./components/steps/ConfirmStep";

export default function CooperativeCreatePage() {
  const [, setLocation] = useLocation();
  const {
    formData,
    setFormData,
    newContact,
    setNewContact,
    newBranch,
    setNewBranch,
    branchInputMethod,
    setBranchInputMethod,
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
    handleExcelUpload,
    handleExcelDrop,
    handleBranchExcelUpload,
    handleBranchExcelDrop,
    handleQRImageUpload,
    handleQRImageDrop,
    handleLiveScan,
    handleImageUpload,
    handleLogoDrop,
    handleDocumentUpload,
    handleDocumentDrop,
    handleDocumentDelete,
    addContact,
    removeContact,
    addBranch,
    removeBranch,
    addBankAccount,
    removeBankAccount,
    showConfirmDialog,
    setShowConfirmDialog,
    handleComplete,
    submitForm,
  } = useCooperativeForm();

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cơ bản",
      description: "Tên, thương hiệu, mã, thuế",
      content: (
        <BasicInfoStep
          formData={formData}
          setFormData={setFormData}
          isDragging={isDragging}
          handleDrag={handleDrag}
          handleImageUpload={handleImageUpload}
          handleLogoDrop={handleLogoDrop}
        />
      ),
      isValid: formData.name.length > 0 && formData.code.length > 0,
    },
    {
      id: "contact",
      title: "Thông tin liên hệ",
      description: "Danh sách liên hệ",
      content: (
        <ContactInfoStep
          formData={formData}
          newContact={newContact}
          setNewContact={setNewContact}
          addContact={addContact}
          removeContact={removeContact}
        />
      ),
      isValid: formData.contacts.length > 0,
    },
    {
      id: "branches",
      title: "Chi nhánh",
      description: "Quản lý chi nhánh",
      content: (
        <BranchesStep
          formData={formData}
          newBranch={newBranch}
          setNewBranch={setNewBranch}
          branchInputMethod={branchInputMethod}
          setBranchInputMethod={setBranchInputMethod}
          isDragging={isDragging}
          handleDrag={handleDrag}
          handleBranchExcelUpload={handleBranchExcelUpload}
          handleBranchExcelDrop={handleBranchExcelDrop}
          addBranch={addBranch}
          removeBranch={removeBranch}
        />
      ),
    },
    {
      id: "bank",
      title: "Ngân hàng",
      description: "Tài khoản thanh toán",
      content: (
        <BankInfoStep
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
          handleExcelUpload={handleExcelUpload}
          handleExcelDrop={handleExcelDrop}
          handleQRImageUpload={handleQRImageUpload}
          handleQRImageDrop={handleQRImageDrop}
          handleLiveScan={handleLiveScan}
          addBankAccount={addBankAccount}
          removeBankAccount={removeBankAccount}
        />
      ),
    },
    {
      id: "documents",
      title: "Giấy chứng nhận đăng ký hợp tác xã",
      description: "Do cơ quan đăng ký kinh doanh cấp huyện cấp",
      content: (
        <DocumentsStep
          formData={formData}
          isDragging={isDragging}
          handleDrag={handleDrag}
          handleDocumentUpload={handleDocumentUpload}
          handleDocumentDrop={handleDocumentDrop}
          handleDocumentDelete={handleDocumentDelete}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: (
        <ConfirmStep
          formData={formData}
          confirmBankSearchQuery={confirmBankSearchQuery}
          setConfirmBankSearchQuery={setConfirmBankSearchQuery}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      isDev={true}
      title="Tạo mới Hợp tác xã"
      description="Điền thông tin theo từng bước để tạo mới hợp tác xã"
    >
      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/cooperative")}
            completeLabel="Tạo mới"
          />
        </CardContent>
      </Card>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận tạo mới</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn tạo mới hợp tác xã "{formData.name}" không?
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
