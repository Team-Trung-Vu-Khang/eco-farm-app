import PageWrapper from "@/components/PageWrapper";
import { StepperForm } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { SeasonFormData } from "../types/types";
import { SeasonBasicInfoCard } from "./SeasonBasicInfoCard";
import { SeasonDocumentsCard } from "./SeasonDocumentsCard";
import { SeasonStagesCard } from "./SeasonStagesCard";
import { calculateTotalDuration } from "../utils/utils";
import type { Variety } from "@/pages/variety/types";
import type { Step } from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface SeasonFormPageProps {
  description: string;
  formData: SeasonFormData;
  isEdit?: boolean;
  onBack: () => void;
  onFormChange: (formData: SeasonFormData) => void;
  onSubmit: () => void;
  showStatusField?: boolean;
  submitLabel: string;
  title: string;
  varieties: Variety[];
}

export function SeasonFormPage({
  description,
  formData,
  isEdit = false,
  onBack,
  onFormChange,
  onSubmit,
  showStatusField = false,
  submitLabel,
  title,
  varieties,
}: SeasonFormPageProps) {
  const totalDuration = calculateTotalDuration(formData.stages);

  const isStep1Valid =
    formData.name.trim().length > 0 && formData.domainCode.length > 0;

  const isStep2Valid =
    formData.stages.length > 0 &&
    formData.stages.every((s) => s.name.trim().length > 0);

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cơ bản",
      description: "Đối tượng, tên, mã mùa vụ",
      content: (
        <SeasonBasicInfoCard
          formData={formData}
          onChange={onFormChange}
          showStatusField={showStatusField}
          varieties={varieties}
          disabled={isEdit}
          hideDomainTabs={isEdit}
        />
      ),
      isValid: isStep1Valid,
    },
    {
      id: "stages",
      title: "Các giai đoạn",
      description: "Quy trình canh tác",
      content: (
        <SeasonStagesCard
          stages={formData.stages}
          onChange={(stages) => onFormChange({ ...formData, stages })}
          totalDuration={totalDuration}
        />
      ),
      isValid: isStep2Valid,
    },
    {
      id: "documents",
      title: "Tài liệu",
      description: "Tài liệu kỹ thuật đính kèm",
      content: (
        <SeasonDocumentsCard
          documents={[]}
          onDocumentsChange={() => {}}
          onSubmit={onSubmit}
          submitLabel={submitLabel}
        />
      ),
    },
  ];

  return (
    <PageWrapper title={title} description={description}>
      <StepperForm
        steps={steps}
        onComplete={onSubmit}
        onCancel={onBack}
        completeLabel={submitLabel}
      />
    </PageWrapper>
  );
}
