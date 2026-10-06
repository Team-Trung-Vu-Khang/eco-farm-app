import React from "react";
import { FormProvider, type UseFormReturn, useWatch } from "react-hook-form";
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

  const [
    name,
    provinceId,
    wardId,
    centerPoint,
    farmingMethodId,
    cropIds,
    varietyIds,
    useSpecificSeeds,
    varietySeedMap,
    isSeedSelectionValid,
  ] = useWatch({
    control,
    name: [
      "name",
      "provinceId",
      "wardId",
      "centerPoint",
      "farmingMethodId",
      "cropIds",
      "varietyIds",
      "useSpecificSeeds",
      "varietySeedMap",
      "isSeedSelectionValid",
    ],
  });

  const step1Valid =
    !!name?.trim() &&
    !!provinceId?.trim() &&
    !!wardId?.trim() &&
    centerPoint?.lat !== undefined &&
    centerPoint?.lng !== undefined &&
    !isNaN(Number(centerPoint.lat)) &&
    !isNaN(Number(centerPoint.lng));

  const hasCrops = (cropIds?.length ?? 0) > 0;
  const hasVarieties = (varietyIds?.length ?? 0) > 0;

  const isSeedConfigValid = useSpecificSeeds
    ? hasCrops &&
      hasVarieties &&
      (varietyIds ?? []).every((vId: number) => {
        const vSeeds = (varietySeedMap as Record<string, number[]>)?.[
          String(vId)
        ];
        return Array.isArray(vSeeds) && vSeeds.length > 0;
      })
    : hasCrops;

  const step2Valid =
    !!farmingMethodId &&
    farmingMethodId > 0 &&
    isSeedConfigValid &&
    isSeedSelectionValid !== false;

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
        <ZoneConfigurationStep
          bypassSeedSelection={bypassSeedSelection}
          showSeedSelection={!isDialogMode}
        />
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
