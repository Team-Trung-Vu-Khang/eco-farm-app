import { StepperForm, type Step } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import { SeasonBasicInfoStep } from "./steps/SeasonBasicInfoStep";
import { SeasonConfirmStep } from "./steps/SeasonConfirmStep";
import { SeasonStagesStep } from "./steps/SeasonStagesStep";
import type { SeasonFormValues } from "../schemas/seasonFormSchema";
import type { Variety } from "@/pages/variety/types";

interface SeasonStepsProps {
  schema: z.ZodType<any, any, any>;
  varieties: Variety[];
  onComplete: () => void;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
  submitLabel: string;
}

export function SeasonSteps({
  schema,
  varieties,
  onComplete,
  onCancel,
  isEdit = false,
  isSubmitting = false,
  submitLabel,
}: SeasonStepsProps) {
  const { watch, handleSubmit } = useFormContext<SeasonFormValues>();
  const values = watch();

  const validationResult = useMemo(
    () => schema.safeParse(values),
    [schema, values],
  );

  const isStep1Valid = useMemo(() => {
    if (validationResult.success) return true;
    const step1Keys = ["name", "domainCode", "code", "description"];
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
          <SeasonBasicInfoStep
            varieties={varieties}
            disabled={isEdit}
            hideDomainTabs={isEdit}
            showStatusField={isEdit}
          />
        ),
        isValid: isStep1Valid,
      },
      {
        id: "stages",
        title: "Bước 2",
        description: "Danh sách giai đoạn",
        content: <SeasonStagesStep />,
        isValid: isStep2Valid,
      },
      {
        id: "confirm",
        title: "Bước 3",
        description: "Xác nhận",
        content: <SeasonConfirmStep varieties={varieties} />,
        isValid: true,
      },
    ],
    [isStep1Valid, isStep2Valid, varieties, isEdit],
  );

  return (
    <StepperForm
      steps={steps}
      onComplete={handleSubmit(onComplete)}
      onCancel={onCancel}
      completeLabel={submitLabel}
      loading={isSubmitting}
    />
  );
}

