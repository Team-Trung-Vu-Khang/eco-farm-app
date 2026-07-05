import {
  AdminLayout,
  Card,
  CardContent,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AttachmentsStep } from "./components/steps/AttachmentsStep";
import { BasicInfoStep } from "./components/steps/BasicInfoStep";
import { ContentStep } from "./components/steps/ContentStep";
import { SpecificationsStep } from "./components/steps/SpecificationsStep";
import { useCreateDocsForm } from "./hooks/useCreateDocsForm";

export default function CreateDocsPage() {
  const {
    formData,
    setFormData,
    handleChangeValue,
    onAddSpecs,
    onAddAttachment,
    handleComplete,
    setLocation,
  } = useCreateDocsForm();

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin chung",
      description: "Các thông tin cần thiết cho tài liệu",
      content: (
        <BasicInfoStep
          formData={formData}
          setFormData={setFormData}
          handleChangeValue={handleChangeValue}
        />
      ),
      isValid:
        formData.id.trim().length > 0 && formData.cropId.trim().length > 0,
    },
    {
      id: "specs",
      title: "Thông số",
      description: "Các thông số có trong tài liệu",
      content: (
        <SpecificationsStep
          formData={formData}
          setFormData={setFormData}
          onAddSpecs={onAddSpecs}
        />
      ),
    },
    {
      id: "content",
      title: "Nội dung",
      description: "Nội dung tài liệu kỹ thuật",
      content: <ContentStep />,
    },
    {
      id: "attachments",
      title: "Tài liệu đính kèm",
      content: (
        <AttachmentsStep
          formData={formData}
          setFormData={setFormData}
          onAddAttachment={onAddAttachment}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      title="Tạo mới tài liệu kỹ thuât"
      description="Thêm tài liệu kỹ thuật vào danh mục hệ thống"
    >
      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/docs")}
            completeLabel="Tạo tài liệu kỹ thuật"
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
