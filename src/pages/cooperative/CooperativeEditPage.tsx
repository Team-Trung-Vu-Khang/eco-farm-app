import PageWrapper from "@/components/PageWrapper";
import { useOrganizationById } from "@/features/organization";
import { useSelectedWorkspaceId } from "@/features/workspace";
import {
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
  Switch,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { BankInfoStep } from "./components/steps/BankInfoStep";
import { BasicInfoStep } from "./components/steps/BasicInfoStep";
import { BranchesStep } from "./components/steps/BranchesStep";
import { ConfirmStep } from "./components/steps/ConfirmStep";
import { ContactInfoStep } from "./components/steps/ContactInfoStep";
import { DocumentsStep } from "./components/steps/DocumentsStep";
import { useCooperativeForm } from "./hooks/useCooperativeForm";
import { toCooperativeFormData } from "./utils/cooperative.mapper";
import SimpleCooperativeForm from "./components/SimpleCooperativeForm";

export default function CooperativeEditPage() {
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/cooperative/:id/edit");
  const workspaceId = useSelectedWorkspaceId();
  const enterpriseId = params?.id ? Number(params.id) : null;
  const cooperativeQuery = useOrganizationById(
    enterpriseId ?? "",
    workspaceId ?? "missing",
    {
      enabled: workspaceId !== null && enterpriseId !== null,
    },
  );

  const initialData = useMemo(
    () =>
      cooperativeQuery.item
        ? toCooperativeFormData(cooperativeQuery.item)
        : null,
    [cooperativeQuery.item],
  );

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

  if (cooperativeQuery.loading) {
    return (
      <PageWrapper
        title="Cập nhật Hợp tác xã"
        description="Đang tải thông tin..."
      >
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      </PageWrapper>
    );
  }

  if (cooperativeQuery.error) {
    return (
      <PageWrapper
        title="Cập nhật Hợp tác xã"
        description="Không thể tải dữ liệu hợp tác xã"
        actions={
          <Link href="/cooperative">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Quay lại
            </button>
          </Link>
        }
      >
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          {cooperativeQuery.error}
        </div>
      </PageWrapper>
    );
  }

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
      <PageWrapper
        title="Cập nhật Hợp tác xã"
        description="Không tìm thấy dữ liệu hợp tác xã"
        actions={
          <Link href="/cooperative">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Quay lại
            </button>
          </Link>
        }
      >
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          Không tìm thấy hợp tác xã cần chỉnh sửa
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={`Cập nhật Hợp tác xã`}
      description="Cập nhật thông tin chi tiết"
      actions={
        <div className="flex items-center gap-3"><div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm"><span className="text-xs font-bold text-slate-700">Thông tin chuyên sâu</span><Switch checked={!isSimpleMode} onCheckedChange={(checked) => setIsSimpleMode(!checked)} /></div><Link href="/cooperative">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Quay lại
          </button>
        </Link></div>
      }
    >
      {isSimpleMode ? (
        <SimpleCooperativeForm formData={formData} setFormData={setFormData} onImageUpload={handleImageUpload} onComplete={handleComplete} isEdit />
      ) : <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/cooperative")}
            completeLabel="Cập nhật"
          />
        </CardContent>
      </Card>}
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
    </PageWrapper>
  );
}
