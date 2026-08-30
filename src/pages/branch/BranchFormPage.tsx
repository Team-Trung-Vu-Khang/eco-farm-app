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
import { FormProvider } from "react-hook-form";
import { useState } from "react";

import PageWrapper from "@/components/PageWrapper";
import { BankingStep } from "./components/steps/BankingStep";
import { BasicInfoStep } from "./components/steps/BasicInfoStep";
import { ConfirmStep } from "./components/steps/ConfirmStep";
import { ContactInfoStep } from "./components/steps/ContactInfoStep";
import { LocationStep } from "./components/steps/LocationStep";
import { SimpleBranchForm } from "./components/SimpleBranchForm";
import { useBranchForm } from "./hooks/useBranchForm";

export default function BranchFormPage() {
  const {
    form,
    formData,
    updateFormData,
    enterprises,
    enterpriseSearchTerm,
    setEnterpriseSearchTerm,
    enterprisesLoading,
    hasMoreEnterprises,
    loadMoreEnterprises,
    isEdit,
    showConfirmDialog,
    setShowConfirmDialog,
    handleComplete,
    submitForm,
    handleCancel,
    isSaving,
  } = useBranchForm();
  const [isSimpleMode, setIsSimpleMode] = useState(true);

  const selectedEnterprise = enterprises.find(
    (enterprise) => enterprise.id.toString() === formData.enterpriseId,
  );

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cơ bản",
      content: (
        <BasicInfoStep
          enterprises={enterprises}
          isEdit={isEdit}
          enterpriseSearchTerm={enterpriseSearchTerm}
          onEnterpriseSearch={setEnterpriseSearchTerm}
          onLoadMoreEnterprises={loadMoreEnterprises}
          hasMoreEnterprises={hasMoreEnterprises}
          enterprisesLoading={enterprisesLoading}
        />
      ),
      isValid:
        formData.name.length > 0 &&
        formData.enterpriseId.length > 0,
    },
    {
      id: "contact-info",
      title: "Liên hệ",
      content: (
        <ContactInfoStep formData={formData} updateFormData={updateFormData} />
      ),
    },
    {
      id: "location",
      title: "Định vị",
      content: (
        <LocationStep formData={formData} updateFormData={updateFormData} />
      ),
    },
    {
      id: "banking",
      title: "Ngân hàng",
      content: (
        <BankingStep formData={formData} updateFormData={updateFormData} />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      content: (
        <ConfirmStep
          formData={formData}
          enterpriseName={selectedEnterprise?.name || formData.enterpriseName}
        />
      ),
    },
  ];

  return (
    <PageWrapper
      title={isEdit ? "Chỉnh sửa Chi nhánh" : "Tạo mới Chi nhánh"}
      actions={[
        <div
          key="mode"
          className="flex items-center gap-3 rounded-full border bg-white px-4 py-2 shadow-sm"
        >
          <span className="text-sm font-semibold text-slate-700">
            Thông tin chuyên sâu
          </span>
          <Switch
            checked={!isSimpleMode}
            onCheckedChange={(checked) => setIsSimpleMode(!checked)}
          />
        </div>,
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
      {isSimpleMode ? (
        <SimpleBranchForm
          formData={formData}
          updateFormData={updateFormData}
          enterprises={enterprises}
          enterpriseSearchTerm={enterpriseSearchTerm}
          onEnterpriseSearch={setEnterpriseSearchTerm}
          onLoadMoreEnterprises={loadMoreEnterprises}
          hasMoreEnterprises={hasMoreEnterprises}
          enterprisesLoading={enterprisesLoading}
          onComplete={handleComplete}
          isEdit={isEdit}
          isSaving={isSaving}
        />
      ) : (
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
      )}

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
    </PageWrapper>
  );
}
