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
import { useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import { useCooperativeForm } from "./hooks/useCooperativeForm";
import { BasicInfoStep } from "./components/steps/BasicInfoStep";
import { ContactInfoStep } from "./components/steps/ContactInfoStep";
import { BankInfoStep } from "./components/steps/BankInfoStep";
import { DocumentsStep } from "./components/steps/DocumentsStep";
import { ConfirmStep } from "./components/steps/ConfirmStep";
import { BranchesStep } from "./components/steps/BranchesStep";
import type { CooperativeFormData } from "./types/types";
import useEnterpriseStore from "@/stores/useEnterpriseStore";

export default function CooperativeEditPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/cooperative/:id/edit");
  const getEnterpriseById = useEnterpriseStore(
    (state) => state.getEnterpriseById,
  );
  const enterpriseId = params?.id ? Number(params.id) : null;
  const cooperativeData = enterpriseId
    ? getEnterpriseById(enterpriseId)
    : undefined;

  const initialData: Partial<CooperativeFormData> | null = useMemo(() => {
    if (!cooperativeData) return null;

    return {
      id: cooperativeData.id,
      type: "cooperative",
      code: cooperativeData.code,
      name: cooperativeData.name,
      brandName: cooperativeData.brandName || "",
      taxCode: cooperativeData.taxCode || "",
      taxAddress: cooperativeData.taxAddress || "",
      taxAuthority: cooperativeData.taxAuthority || "",
      issueDate: cooperativeData.issueDate || "",
      classification: cooperativeData.classification || [],
      foundedDate: cooperativeData.foundedDate || "",
      representative: cooperativeData.representative || "",
      website: cooperativeData.website || "",
      phone: cooperativeData.phone || "",
      email: cooperativeData.email || "",
      province: cooperativeData.province || "",
      district: cooperativeData.district || "",
      ward: cooperativeData.ward || "",
      address: cooperativeData.address || "",
      image: cooperativeData.image || "",
      description: cooperativeData.description || "",
      contacts: cooperativeData.contacts || [],
      branches: cooperativeData.branches || [],
      bankAccounts: cooperativeData.bankAccounts || [],
      documents: cooperativeData.documents || [],
    };
  }, [cooperativeData]);

  const {
    formData,
    setFormData,
    newContact,
    setNewContact,
    newBranch,
    setNewBranch,
    newBankAccount,
    setNewBankAccount,
    bankInputMethod,
    setBankInputMethod,
    branchInputMethod,
    setBranchInputMethod,
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
  } = useCooperativeForm(initialData || {});

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

  if (!initialData) {
    return (
      <AdminLayout
        title="Cập nhật Hợp tác xã"
        description="Không tìm thấy dữ liệu hợp tác xã"
      >
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          Không tìm thấy hợp tác xã cần chỉnh sửa
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={`Cập nhật Hợp tác xã`}
      description="Cập nhật thông tin chi tiết"
    >
      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/cooperative")}
            completeLabel="Cập nhật"
          />
        </CardContent>
      </Card>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận cập nhật</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn cập nhật hợp tác xã "{formData.name}" không?
              <br />
              Thông tin mới sẽ được lưu vào hệ thống.
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
