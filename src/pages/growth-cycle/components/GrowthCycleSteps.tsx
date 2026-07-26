import { StepperForm, type Step } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import { GrowthCycleBasicInfoStep } from "./steps/GrowthCycleBasicInfoStep";
import { GrowthCycleConfirmStep } from "./steps/GrowthCycleConfirmStep";
import { GrowthCycleStagesStep } from "./steps/GrowthCycleStagesStep";
import type { GrowthCycleFormValues } from "../schemas/growthCycleSchema";
import type {
  ProductionSubjectResponse,
  ProductionSubjectVariantResponse,
} from "@/features/foundation";

interface GrowthCycleStepsProps {
  varieties: ProductionSubjectVariantResponse[];
  crops: ProductionSubjectResponse[];
  schema: z.ZodType<any, any, any>;
  onComplete: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function GrowthCycleSteps({
  varieties,
  crops,
  schema,
  onComplete,
  onCancel,
  isSubmitting = false,
}: GrowthCycleStepsProps) {
  const { watch, handleSubmit } = useFormContext<GrowthCycleFormValues>();
  const values = watch();
  const watchedCropId = values.cropId;

  const filteredVarieties = useMemo(() => {
    if (!watchedCropId) return [];
    return varieties.filter((v) => String(v.subject?.id) === watchedCropId);
  }, [watchedCropId, varieties]);

  const validationResult = useMemo(
    () => schema.safeParse(values),
    [schema, values],
  );

  const isStep1Valid = useMemo(() => {
    if (validationResult.success) return true;
    const step1Keys = ["cycleType", "scope", "cropId", "variety", "name"];
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
          <GrowthCycleBasicInfoStep
            varieties={varieties}
            crops={crops}
          />
        ),
        isValid: isStep1Valid,
      },
      {
        id: "stages",
        title: "Bước 2",
        description: "Danh sách giai đoạn",
        content: <GrowthCycleStagesStep />,
        isValid: isStep2Valid,
      },
      {
        id: "confirm",
        title: "Bước 3",
        description: "Xác nhận",
        content: <GrowthCycleConfirmStep varieties={varieties} crops={crops} />,
        isValid: true,
      },
    ],
    [filteredVarieties, isStep1Valid, isStep2Valid, varieties, crops],
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
