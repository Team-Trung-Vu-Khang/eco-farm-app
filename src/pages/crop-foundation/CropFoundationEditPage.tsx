import {
  AdminLayout,
  Card,
  CardContent,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

import { BasicInfoStep } from "./components/steps/BasicInfoStep";
import { ConfirmationStep } from "./components/steps/ConfirmationStep";
import { DocumentationStep } from "./components/steps/DocumentationStep";
import { TechnicalSpecsStep } from "./components/steps/TechnicalSpecsStep";
import { useCropFoundationEditForm } from "./hooks/useCropFoundationEditForm";

export default function CropFoundationEditPage() {
  const {
    formData,
    illustrationPreview,
    fileInputRef,
    handleUpdateField,
    handleUpdateTechnicalSpecs,
    handleUpdateDocs,
    handleComplete,
    handleCancel,
  } = useCropFoundationEditForm();

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cây",
      content: (
        <BasicInfoStep
          formData={formData}
          handleUpdateField={handleUpdateField}
          fileInputRef={fileInputRef}
          illustrationPreview={illustrationPreview}
        />
      ),
      isValid:
        formData.code.length > 0 &&
        formData.name.length > 0 &&
        formData.cropFoundationGroup.length > 0,
    },
    {
      id: "technical",
      title: "Thông số KT",
      content: (
        <TechnicalSpecsStep
          formData={formData}
          handleUpdateTechnicalSpecs={handleUpdateTechnicalSpecs}
        />
      ),
      isValid: true,
    },
    {
      id: "docs",
      title: "Tài liệu",
      content: (
        <DocumentationStep
          formData={formData}
          handleUpdateDocs={handleUpdateDocs}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      content: <ConfirmationStep formData={formData} />,
    },
  ];

  return (
    <AdminLayout
      isDev={true}
      title={`Cập nhật thông tin: ${formData.name || "Đang tải..."}`}
      description="Chỉnh sửa thông tin kỹ thuật và tài liệu của cây trồng"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            completeLabel="Cập nhật thông tin"
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
