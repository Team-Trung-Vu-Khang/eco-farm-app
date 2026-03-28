import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft } from "lucide-react";
import { CreateTreatmentInfoStep } from "./components/CreateTreatmentInfoStep";
import { CreateTreatmentMaterialsStep } from "./components/CreateTreatmentMaterialsStep";
import { CreateTreatmentProcessStep } from "./components/CreateTreatmentProcessStep";
import { useCreateTreatmentPage } from "./hooks/useCreateTreatmentPage";

export default function CreateTreatmentPage() {
  const {
    formData,
    setFormData,
    illustrationPreview,
    fileInputRef,
    onPickIllustration,
    onDropIllustration,
    handleComplete,
    onAddStep,
    onRemoveStep,
    onAddMaterial,
    onRemoveMaterial,
    goBack,
  } = useCreateTreatmentPage();

  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin",
      description: "Cây trồng & Bệnh",
      content: (
        <CreateTreatmentInfoStep
          formData={formData}
          setFormData={setFormData}
          illustrationPreview={illustrationPreview}
          fileInputRef={fileInputRef}
          onDropIllustration={onDropIllustration}
          onPickIllustration={onPickIllustration}
        />
      ),
      isValid: formData.name.trim() !== "" && formData.id.trim() !== "",
    },
    {
      id: "process",
      title: "Lộ trình",
      description: "Các bước xử lý",
      content: (
        <CreateTreatmentProcessStep
          formData={formData}
          setFormData={setFormData}
          onAddStep={onAddStep}
          onRemoveStep={onRemoveStep}
        />
      ),
      isValid: formData.steps.every(
        (s) => s.title.trim() !== "" && s.day.trim() !== "",
      ),
    },
    {
      id: "materials",
      title: "Vật tư",
      description: "Thuốc & An toàn",
      content: (
        <CreateTreatmentMaterialsStep
          formData={formData}
          setFormData={setFormData}
          onAddMaterial={onAddMaterial}
          onRemoveMaterial={onRemoveMaterial}
        />
      ),
      isValid:
        formData.materials.every((m) => m.name !== "" && m.dosage !== "") &&
        formData.estimatedCost !== "",
    },
  ];

  return (
    <AdminLayout
      title="Tạo phác đồ điều trị mới"
      description="Thiết lập các tham số kỹ thuật cho phác đồ mới"
    >
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-500"
          onClick={goBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50">
        <CardContent className="p-10">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={goBack}
            completeLabel="Xác nhận"
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
