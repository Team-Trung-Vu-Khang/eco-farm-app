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
  Card,
  CardContent,
  StepperForm,
  Switch,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { FarmerBankStep } from "./components/steps/FarmerBankStep";
import { FarmerBasicInfoStep } from "./components/steps/FarmerBasicInfoStep";
import { FarmerConfirmationStep } from "./components/steps/FarmerConfirmationStep";
import { FarmerContactStep } from "./components/steps/FarmerContactStep";
import { useFarmerCreateForm } from "./hooks/useFarmerCreateForm";
import SimpleFarmerForm from "./components/SimpleFarmerForm";

export default function FarmerCreatePage() {
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const {
    isEdit,
    formData,
    control,
    errors,
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
    openConfirmDialog,
    showConfirmDialog,
    setShowConfirmDialog,
    isSubmitting,
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
          control={control}
          errors={errors}
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
      <PageWrapper
      title={isEdit ? "Chỉnh sửa Nông hộ" : "Tạo mới Nông hộ"}
      description="Điền thông tin theo từng bước để tạo mới nông hộ"
      actions={[
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <span className="text-xs font-bold text-slate-700">Thông tin chuyên sâu</span>
          <Switch checked={!isSimpleMode} onCheckedChange={(checked) => setIsSimpleMode(!checked)} />
        </div>,
        <Button
          key="back"
          variant="outline"
          onClick={navigateBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>,
      ]}
    >
      {isSimpleMode ? (
        <SimpleFarmerForm
          formData={formData}
          onChange={(field, value) => updateField(field, value as never)}
          onImageUpload={processLogoImage}
          onSelectLocation={({ latitude, longitude }) => {
            updateField("latitude", latitude);
            updateField("longitude", longitude);
          }}
          onComplete={openConfirmDialog}
          isEdit={isEdit}
          isSubmitting={isSubmitting}
        />
      ) : <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            completeLabel={isEdit ? "Cập nhật" : "Tạo mới"}
            onComplete={openConfirmDialog}
            onCancel={navigateBack}
          />
        </CardContent>
      </Card>}

      <AlertDialog
        open={showConfirmDialog}
        onOpenChange={(open) => !isSubmitting && setShowConfirmDialog(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xác nhận {isEdit ? "cập nhật" : "tạo mới"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn {isEdit ? "cập nhật" : "tạo mới"} nông hộ "
              {formData.name}" không?
              <br />
              Thông tin đã nhập sẽ được lưu vào hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={(e) => {
                e.preventDefault();
                submitForm();
              }}
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
