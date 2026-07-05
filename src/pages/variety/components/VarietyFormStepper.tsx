import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import type { useVarietyFormPage } from "../hooks/useVarietyFormPage";
import { VarietyCharacteristicsStep } from "./VarietyCharacteristicsStep";
import { VarietyClassificationStep } from "./VarietyClassificationStep";
import { VarietyConfirmationStep } from "./VarietyConfirmationStep";
import { VarietyDocumentsStep } from "./VarietyDocumentsStep";

interface VarietyFormStepperProps {
  title: string;
  description: string;
  completeLabel: string;
  form: ReturnType<typeof useVarietyFormPage>;
}

export function VarietyFormStepper({
  title,
  description,
  completeLabel,
  form,
}: VarietyFormStepperProps) {
  const steps: Step[] = [
    {
      id: "classification",
      title: "Phân loại & Định danh",
      description:
        form.mode === "edit"
          ? "Cập nhật cây trồng và thông tin định danh cho giống"
          : "Chọn cây trồng và thiết lập thông tin định danh cho giống",
      content: (
        <VarietyClassificationStep
          formData={form.formData}
          updateField={form.updateField}
        />
      ),
      isValid: form.isClassificationValid,
    },
    {
      id: "characteristics",
      title: "Thông tin nông học",
      description:
        form.mode === "edit"
          ? "Cập nhật đặc điểm sinh trưởng và hình ảnh nhận diện"
          : "Mô tả đặc điểm sinh trưởng và hình ảnh nhận diện",
      content: (
        <VarietyCharacteristicsStep
          formData={form.formData}
          updateField={form.updateField}
          illustrationPreview={form.illustrationPreview}
          setIllustrationPreview={form.setIllustrationPreview}
          fileInputRef={form.fileInputRef}
          onPickIllustration={form.onPickIllustration}
        />
      ),
      isValid: true,
    },
    {
      id: "docs",
      title: "Tài liệu kỹ thuật",
      description:
        form.mode === "edit"
          ? "Cập nhật quy trình canh tác và tiêu chuẩn kỹ thuật"
          : "Tải lên quy trình canh tác và tiêu chuẩn kỹ thuật",
      content: (
        <VarietyDocumentsStep
          formData={form.formData}
          updateField={form.updateField}
          pdfInputRef={form.pdfInputRef}
          onContentTypeChange={form.handleContentTypeChange}
        />
      ),
      isValid: form.isDocumentsValid,
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description:
        form.mode === "edit"
          ? "Kiểm tra lại toàn bộ thông tin trước khi cập nhật"
          : "Kiểm tra lại toàn bộ thông tin trước khi tạo",
      content: (
        <VarietyConfirmationStep
          formData={form.formData}
          selectedCrop={form.selectedCrop}
          mode={form.mode}
        />
      ),
      isValid: true,
    },
  ];

  return (
    <AdminLayout title={title} description={description}>
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={form.goBack}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50">
        <CardContent className="p-10">
          <StepperForm
            steps={steps}
            onComplete={form.handleComplete}
            onCancel={form.goBack}
            completeLabel={completeLabel}
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
