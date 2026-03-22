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
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useCooperativeForm } from "./hooks/useCooperativeForm";
import { BasicInfoStep } from "./components/steps/BasicInfoStep";
import { ContactInfoStep } from "./components/steps/ContactInfoStep";
import { BankInfoStep } from "./components/steps/BankInfoStep";
import { DocumentsStep } from "./components/steps/DocumentsStep";
import { ConfirmStep } from "./components/steps/ConfirmStep";
import { BranchesStep } from "./components/steps/BranchesStep";
import type { CooperativeFormData } from "./types/types";

export default function CooperativeEditPage() {
  const [, setLocation] = useLocation();
  const [initialData, setInitialData] =
    useState<Partial<CooperativeFormData> | null>(null);

  // Mock data fetching
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInitialData({
        id: "1",
        type: "cooperative",
        code: "DN2024001",
        name: "Hợp tác xã Nông nghiệp Xanh EcoFarm",
        brandName: "EcoFarm Vietnam",
        taxCode: "0101234567",
        taxAddress: "Tầng 5, Tòa nhà ABC, Cầu Giấy, Hà Nội",
        classification: ["production"],
        foundedDate: "2020-03-15",
        representative: "Nguyễn Văn Giám Đốc",
        website: "https://ecofarm.vn",
        province: "hn",
        ward: "dich_vong",
        address: "Số 123 Đường Xuân Thủy",
        image:
          "https://images.unsplash.com/photo-1595839019623-668b555776a3?w=800&q=80",
        description:
          "Hợp tác xã tiên phong trong lĩnh vực nông nghiệp công nghệ cao, chuyên sản xuất và cung ứng rau sạch chuẩn VietGAP.",
        contacts: [
          {
            name: "Lê Văn Tiến",
            phone: "0333444555",
            email: "tien.lv@ecofarm.vn",
          },
        ],
        branches: [],
        bankAccounts: [
          {
            bin: "970436",
            bankName: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)",
            accountHolder: "ECOFARM CORP",
            accountNumber: "0011001234567",
            branch: "Sở Giao Dịch",
            note: "Tài khoản chính",
          },
        ],
        documents: [
          { name: "giay_phep_kd.pdf", type: "application/pdf", size: "2.5MB" },
        ],
      });
    }, 500);
  }, []);

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
          formData={formData}
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
      title: "Tài liệu",
      description: "Giấy phép, chứng chỉ",
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
        description="Đang tải dữ liệu..."
      >
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
