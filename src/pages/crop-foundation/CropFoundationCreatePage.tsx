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
import { useCropFoundationForm } from "./hooks/useCropFoundationForm";

export default function CropFoundationCreatePage() {
  const {
    formData,
    illustrationPreview,
    fileInputRef,
    handleUpdateField,
    handleUpdateTechnicalSpecs,
    handleUpdateDocs,
    handleComplete,
    handleCancel,
  } = useCropFoundationForm();

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
      title: "Thông số kỹ thuật",
      content: (
        <TechnicalSpecsStep
          formData={formData}
          handleUpdateTechnicalSpecs={handleUpdateTechnicalSpecs}
        />
      ),
      isValid: true,
    },
    // {
    //   id: "seeds",
    //   title: "Hạt giống",
    //   content: (
    //     <SeedSelectionStep
    //       formData={formData}
    //       seedSearch={seedSearch}
    //       setSeedSearch={setSeedSearch}
    //       handleUpdateField={handleUpdateField}
    //     />
    //   ),
    //   isValid: formData.selectedSeedIds.length > 0,
    // },
    // {
    //   id: "growth",
    //   title: "Sinh trưởng",
    //   content: (
    //     <GrowthCycleStep
    //       formData={formData}
    //       handleAddGrowthCycle={handleAddGrowthCycle}
    //       handleRemoveGrowthCycle={handleRemoveGrowthCycle}
    //       handleUpdateGrowthCycle={handleUpdateGrowthCycle}
    //     />
    //   ),
    //   isValid:
    //     formData.growthCycles.length > 0 &&
    //     formData.growthCycles.every(
    //       (c) => c.name.trim() !== "" && c.estimatedDays !== "",
    //     ),
    // },
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
      title="Thêm mới cây trồng"
      description="Khởi tạo cây trồng mới với đầy đủ thông tin sinh trưởng và tài liệu"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            completeLabel="Khởi tạo cây trồng"
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
