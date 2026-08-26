import React from "react";
import {
  FormProvider,
  type UseFormReturn,
  useWatch,
  useFormState,
} from "react-hook-form";
import { StepperForm } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { RegionInfoStep } from "../../region-distribution/components/RegionInfoStep";
import { ZoneConfigurationStep } from "../../../cultivation-zone/cultivation-region/components/ZoneConfigurationStep";
import { RegionConfirmationStep } from "./RegionConfirmationStep";
import type { RegionBasicFormValues } from "../data/region-basic-form.schema";

interface RegionBasicDistributionFormProps {
  form: UseFormReturn<RegionBasicFormValues>;
  onSubmit: (data: RegionBasicFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
  isEditMode: boolean;
  isDialogMode?: boolean;
  completeLabel?: string;
  bypassSeedSelection?: boolean;
}

export const RegionBasicDistributionForm: React.FC<
  RegionBasicDistributionFormProps
> = ({
  form,
  onSubmit,
  onCancel,
  isLoading,
  isEditMode,
  isDialogMode = false,
  completeLabel,
  bypassSeedSelection = false,
}) => {
  const { control, handleSubmit } = form;

  const [name, farmingMethodId] = useWatch({
    control,
    name: ["name", "farmingMethodId", "seedIds"],
  });

  const { errors } = useFormState({ control });

  const step1Valid = !!name && name.trim().length > 0 && !errors.name;

  // seedIds (Giống / Hạt giống) is optional — user may leave it unselected.
  const step2Valid = !!farmingMethodId && farmingMethodId > 0;

  const steps = [
    {
      id: "step1",
      title: "Thông tin chung",
      description: "Nhập thông tin cơ bản của vùng trồng",
      content: <RegionInfoStep showCenterPoint={true} />,
      isValid: step1Valid,
    },
    {
      id: "step2",
      title: "Cấu hình canh tác",
      description: "Thiết lập phương pháp & giống cây trồng",
      content: (
        <ZoneConfigurationStep bypassSeedSelection={bypassSeedSelection} />
      ),
      isValid: step2Valid,
    },
    {
      id: "step3",
      title: "Xác nhận thông tin",
      description: "Xác nhận lại các thông tin trước khi hoàn thành",
      content: <RegionConfirmationStep domainCode="CROP" />,
      isValid: true,
    },
  ];

  return (
    <FormProvider {...form}>
      <StepperForm
        steps={steps}
        loading={isLoading}
        onComplete={handleSubmit(onSubmit)}
        onCancel={isDialogMode ? () => {} : onCancel} // Disable cancel button in StepperForm if in dialog onboarding mode
        completeLabel={
          completeLabel || (isEditMode ? "Lưu thay đổi" : "Khởi tạo vùng trồng")
        }
      />
    </FormProvider>
  );
};

export default RegionBasicDistributionForm;
