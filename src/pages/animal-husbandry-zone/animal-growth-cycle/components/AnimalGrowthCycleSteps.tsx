import { StepperForm, type Step } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import { AnimalGrowthCycleBasicInfoStep } from "./steps/AnimalGrowthCycleBasicInfoStep";
import { AnimalGrowthCycleConfirmStep } from "./steps/AnimalGrowthCycleConfirmStep";
import { AnimalGrowthCycleStagesStep } from "./steps/AnimalGrowthCycleStagesStep";
import type { AnimalGrowthCycleFormValues } from "../schemas/animalGrowthCycleSchema";
import type {
  ProductionSubjectResponse,
  ProductionSubjectVariantResponse,
} from "@/features/foundation";

interface AnimalGrowthCycleStepsProps {
  varieties: ProductionSubjectVariantResponse[];
  crops: ProductionSubjectResponse[];
  schema: z.ZodType<any, any, any>;
  onComplete: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  domainCode?: "LIVESTOCK" | "AQUACULTURE";
  subjectLabel?: string;
  varietyLabel?: string;
  groupLabel?: string;
  cycleLabel?: string;
}

export function AnimalGrowthCycleSteps({
  varieties,
  crops,
  schema,
  onComplete,
  onCancel,
  isSubmitting = false,
  domainCode = "LIVESTOCK",
  subjectLabel = "Vật nuôi",
  varietyLabel = "Giống vật nuôi",
  groupLabel = "Nhóm vật nuôi",
  cycleLabel = "Vụ nuôi",
}: AnimalGrowthCycleStepsProps) {
  const { watch, handleSubmit } = useFormContext<AnimalGrowthCycleFormValues>();
  const values = watch();
  const validationResult = useMemo(
    () => schema.safeParse(values),
    [schema, values],
  );

  const isStep1Valid = useMemo(() => {
    if (validationResult.success) return true;
    const step1Keys = ["cycleType", "scope", "groupIds", "cropIds", "varietyIds", "name"];
    const step1Errors = validationResult.error.issues.filter((issue) =>
      step1Keys.includes(String(issue.path[0])),
    );
    return step1Errors.length === 0;
  }, [validationResult]);

  const isStep2Valid = useMemo(() => {
    if (validationResult.success) return true;
    const step2Errors = validationResult.error.issues.filter(
      (issue) => issue.path[0] === "stages",
    );
    return step2Errors.length === 0;
  }, [validationResult]);

  const steps: Step[] = useMemo(
    () => [
      {
        id: "basic",
        title: "Bước 1",
        description: "Thông tin chung",
        content: (
          <AnimalGrowthCycleBasicInfoStep
            varieties={varieties}
            crops={crops}
            domainCode={domainCode}
            subjectLabel={subjectLabel}
            varietyLabel={varietyLabel}
            groupLabel={groupLabel}
          />
        ),
        isValid: isStep1Valid,
      },
      {
        id: "stages",
        title: "Bước 2",
        description: "Danh sách giai đoạn",
        content: <AnimalGrowthCycleStagesStep />,
        isValid: isStep2Valid,
      },
      {
        id: "confirm",
        title: "Bước 3",
        description: "Xác nhận",
        content: (
          <AnimalGrowthCycleConfirmStep varieties={varieties} crops={crops} domainCode={domainCode} subjectLabel={subjectLabel} varietyLabel={varietyLabel} groupLabel={groupLabel} cycleLabel={cycleLabel} />
        ),
        isValid: true,
      },
    ],
    [isStep1Valid, isStep2Valid, varieties, crops],
  );

  return (
    <StepperForm
      steps={steps}
      onComplete={handleSubmit(onComplete)}
      onCancel={onCancel}
      completeLabel="Hoàn thành"
      loading={isSubmitting}
    />
  );
}
